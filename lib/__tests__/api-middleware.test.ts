import { NextRequest } from 'next/server'
import {
  withRequestLogging,
  withAuth,
  withRateLimit,
  withCORS,
  withValidation,
  withPerformanceMonitoring,
  withAPIMiddleware,
  healthCheck
} from '../api-middleware'
import { logger } from '../error-handler'

// Mock the logger
jest.mock('../error-handler', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  },
  handleError: jest.fn((error) => error),
  createErrorResponse: jest.fn((error) => ({ status: error.statusCode, body: { error: error.message } }))
}))

describe('API Middleware', () => {
  let mockRequest: NextRequest
  let mockHandler: jest.Mock

  beforeEach(() => {
    mockRequest = new NextRequest('http://localhost:3000/api/test', {
      method: 'GET',
      headers: {
        'x-request-id': 'test-request-123',
        'user-agent': 'test-agent',
        'x-forwarded-for': '192.168.1.1'
      }
    })
    mockHandler = jest.fn().mockResolvedValue(new Response('OK', { status: 200 }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('withRequestLogging', () => {
    it('should log request and response', async () => {
      const wrappedHandler = withRequestLogging(mockHandler)
      await wrappedHandler(mockRequest)

      expect(logger.info).toHaveBeenCalledWith(
        'API Request: GET http://localhost:3000/api/test',
        expect.objectContaining({
          requestId: 'test-request-123',
          method: 'GET',
          url: 'http://localhost:3000/api/test',
          userAgent: 'test-agent',
          ip: '192.168.1.1'
        })
      )

      expect(logger.info).toHaveBeenCalledWith(
        'API Response: GET http://localhost:3000/api/test - 200',
        expect.objectContaining({
          status: 200,
          duration: expect.any(Number)
        })
      )
    })

    it('should log errors', async () => {
      const error = new Error('Test error')
      mockHandler.mockRejectedValue(error)
      
      const wrappedHandler = withRequestLogging(mockHandler)
      const response = await wrappedHandler(mockRequest)

      expect(logger.error).toHaveBeenCalledWith(
        'API Error: GET http://localhost:3000/api/test - Test error',
        expect.any(Error),
        expect.objectContaining({
          duration: expect.any(Number)
        })
      )

      expect(response.status).toBe(500)
    })
  })

  describe('withAuth', () => {
    it('should allow requests with valid auth header', async () => {
      const authRequest = new NextRequest('http://localhost:3000/api/test', {
        method: 'GET',
        headers: {
          'authorization': 'Bearer valid-token'
        }
      })

      const wrappedHandler = withAuth(mockHandler)
      await wrappedHandler(authRequest)

      expect(mockHandler).toHaveBeenCalledWith(authRequest)
    })

    it('should reject requests without auth header', async () => {
      const wrappedHandler = withAuth(mockHandler)
      const response = await wrappedHandler(mockRequest)

      expect(logger.warn).toHaveBeenCalledWith('Unauthenticated API request', expect.any(Object))
      expect(response.status).toBe(401)
      expect(mockHandler).not.toHaveBeenCalled()
    })

    it('should reject requests with invalid auth header', async () => {
      const invalidRequest = new NextRequest('http://localhost:3000/api/test', {
        method: 'GET',
        headers: {
          'authorization': 'Invalid token'
        }
      })

      const wrappedHandler = withAuth(mockHandler)
      const response = await wrappedHandler(invalidRequest)

      expect(logger.warn).toHaveBeenCalledWith('Unauthenticated API request', expect.any(Object))
      expect(response.status).toBe(401)
      expect(mockHandler).not.toHaveBeenCalled()
    })
  })

  describe('withRateLimit', () => {
    it('should allow requests within rate limit', async () => {
      const wrappedHandler = withRateLimit(100, 60000)(mockHandler)
      
      // Make multiple requests
      for (let i = 0; i < 5; i++) {
        await wrappedHandler(mockRequest)
      }

      expect(mockHandler).toHaveBeenCalledTimes(5)
    })

    it('should reject requests exceeding rate limit', async () => {
      const wrappedHandler = withRateLimit(2, 60000)(mockHandler)
      
      // Make requests within limit
      await wrappedHandler(mockRequest)
      await wrappedHandler(mockRequest)
      
      // This should be rate limited
      const response = await wrappedHandler(mockRequest)

      expect(logger.warn).toHaveBeenCalledWith(
        'Rate limit exceeded for 192.168.1.1',
        expect.any(Object)
      )
      expect(response.status).toBe(429)
      expect(mockHandler).toHaveBeenCalledTimes(2)
    })

    it('should include rate limit headers', async () => {
      const wrappedHandler = withRateLimit(2, 60000)(mockHandler)
      
      // Exceed rate limit
      await wrappedHandler(mockRequest)
      await wrappedHandler(mockRequest)
      const response = await wrappedHandler(mockRequest)

      expect(response.headers.get('X-RateLimit-Limit')).toBe('2')
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('0')
      expect(response.headers.get('X-RateLimit-Reset')).toBeDefined()
    })
  })

  describe('withCORS', () => {
    it('should add CORS headers for allowed origins', async () => {
      process.env.ALLOWED_ORIGINS = 'http://localhost:3000,https://example.com'
      
      const originRequest = new NextRequest('http://localhost:3000/api/test', {
        method: 'GET',
        headers: {
          'origin': 'http://localhost:3000'
        }
      })

      const wrappedHandler = withCORS(mockHandler)
      const response = await wrappedHandler(originRequest)

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000')
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET, POST, PUT, DELETE, OPTIONS')
      expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type, Authorization, X-Request-ID')
      expect(response.headers.get('Access-Control-Allow-Credentials')).toBe('true')
    })

    it('should not add CORS headers for disallowed origins', async () => {
      process.env.ALLOWED_ORIGINS = 'http://localhost:3000'
      
      const originRequest = new NextRequest('http://localhost:3000/api/test', {
        method: 'GET',
        headers: {
          'origin': 'https://malicious.com'
        }
      })

      const wrappedHandler = withCORS(mockHandler)
      const response = await wrappedHandler(originRequest)

      expect(response.headers.get('Access-Control-Allow-Origin')).toBeNull()
    })
  })

  describe('withValidation', () => {
    it('should validate request body', async () => {
      const schema = {
        required: ['email', 'name'],
        properties: {
          email: { type: 'string', format: 'email' },
          name: { type: 'string', minLength: 1 }
        }
      }

      const validRequest = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', name: 'John' })
      })

      const wrappedHandler = withValidation(schema)(mockHandler)
      await wrappedHandler(validRequest)

      expect(mockHandler).toHaveBeenCalledWith(validRequest)
    })

    it('should reject invalid request body', async () => {
      const schema = {
        required: ['email', 'name'],
        properties: {
          email: { type: 'string', format: 'email' },
          name: { type: 'string', minLength: 1 }
        }
      }

      const invalidRequest = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
        body: JSON.stringify({ email: 'invalid-email' })
      })

      const wrappedHandler = withValidation(schema)(mockHandler)
      const response = await wrappedHandler(invalidRequest)

      expect(response.status).toBe(400)
      expect(mockHandler).not.toHaveBeenCalled()
    })
  })

  describe('withPerformanceMonitoring', () => {
    it('should add performance headers', async () => {
      const wrappedHandler = withPerformanceMonitoring(mockHandler)
      const response = await wrappedHandler(mockRequest)

      expect(response.headers.get('X-Response-Time')).toMatch(/\d+\.\d+ms/)
      expect(response.headers.get('X-Memory-Usage')).toMatch(/\d+\.\d+MB/)
    })

    it('should log performance metrics', async () => {
      const wrappedHandler = withPerformanceMonitoring(mockHandler)
      await wrappedHandler(mockRequest)

      expect(logger.info).toHaveBeenCalledWith(
        'Performance metrics',
        expect.objectContaining({
          requestId: 'test-request-123',
          method: 'GET',
          url: 'http://localhost:3000/api/test',
          duration: expect.stringMatching(/\d+\.\d+ms/),
          memoryDelta: expect.stringMatching(/\d+\.\d+MB/)
        })
      )
    })
  })

  describe('withAPIMiddleware', () => {
    it('should apply all middleware when configured', async () => {
      const wrappedHandler = withAPIMiddleware({
        auth: true,
        rateLimit: { maxRequests: 100, windowMs: 60000 },
        cors: true,
        performanceMonitoring: true
      })(mockHandler)

      const authRequest = new NextRequest('http://localhost:3000/api/test', {
        method: 'GET',
        headers: {
          'authorization': 'Bearer valid-token',
          'origin': 'http://localhost:3000'
        }
      })

      await wrappedHandler(authRequest)

      expect(mockHandler).toHaveBeenCalledWith(authRequest)
    })

    it('should apply minimal middleware when not configured', async () => {
      const wrappedHandler = withAPIMiddleware({})(mockHandler)
      await wrappedHandler(mockRequest)

      expect(mockHandler).toHaveBeenCalledWith(mockRequest)
    })
  })

  describe('healthCheck', () => {
    it('should return health status', async () => {
      const response = await healthCheck()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('healthy')
      expect(data.timestamp).toBeDefined()
      expect(data.uptime).toBeDefined()
      expect(data.memory).toBeDefined()
      expect(data.version).toBeDefined()
      expect(data.environment).toBeDefined()
    })

    it('should include proper headers', async () => {
      const response = await healthCheck()

      expect(response.headers.get('Cache-Control')).toBe('no-cache, no-store, must-revalidate')
      expect(response.headers.get('Pragma')).toBe('no-cache')
      expect(response.headers.get('Expires')).toBe('0')
    })

    it('should log health check request', async () => {
      await healthCheck()

      expect(logger.info).toHaveBeenCalledWith(
        'Health check requested',
        expect.objectContaining({
          health: expect.objectContaining({
            status: 'healthy'
          })
        })
      )
    })
  })
})
