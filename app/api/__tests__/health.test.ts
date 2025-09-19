import { NextRequest } from 'next/server'
import { GET } from '../health/route'

// Mock performance API
const mockPerformance = {
  now: jest.fn(() => Date.now()),
  memory: {
    usedJSHeapSize: 1000000,
    totalJSHeapSize: 2000000,
    jsHeapSizeLimit: 4000000
  }
}

Object.defineProperty(global, 'performance', {
  value: mockPerformance,
  writable: true
})

// Mock process
const originalProcess = process
beforeEach(() => {
  process = {
    ...originalProcess,
    uptime: jest.fn(() => 3600), // 1 hour
    memoryUsage: jest.fn(() => ({
      rss: 50000000,
      heapTotal: 20000000,
      heapUsed: 15000000,
      external: 1000000,
      arrayBuffers: 500000
    }))
  }
})

afterEach(() => {
  process = originalProcess
})

// Mock error handler
jest.mock('@/lib/error-handler', () => ({
  withRequestLogging: (handler: any) => handler,
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}))

describe('Health Check API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/health', () => {
    it('should return health status successfully', async () => {
      const request = new NextRequest('http://localhost:3000/api/health')

      const response = await GET(request)
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
      const request = new NextRequest('http://localhost:3000/api/health')

      const response = await GET(request)

      expect(response.headers.get('Cache-Control')).toBe('no-cache, no-store, must-revalidate')
      expect(response.headers.get('Pragma')).toBe('no-cache')
      expect(response.headers.get('Expires')).toBe('0')
      expect(response.headers.get('Content-Type')).toBe('application/json')
    })

    it('should include memory usage information', async () => {
      const request = new NextRequest('http://localhost:3000/api/health')

      const response = await GET(request)
      const data = await response.json()

      expect(data.memory).toBeDefined()
      expect(data.memory.rss).toBeDefined()
      expect(data.memory.heapTotal).toBeDefined()
      expect(data.memory.heapUsed).toBeDefined()
      expect(data.memory.external).toBeDefined()
      expect(data.memory.arrayBuffers).toBeDefined()
    })

    it('should include uptime information', async () => {
      const request = new NextRequest('http://localhost:3000/api/health')

      const response = await GET(request)
      const data = await response.json()

      expect(data.uptime).toBeDefined()
      expect(typeof data.uptime).toBe('number')
      expect(data.uptime).toBeGreaterThan(0)
    })

    it('should include version information', async () => {
      const request = new NextRequest('http://localhost:3000/api/health')

      const response = await GET(request)
      const data = await response.json()

      expect(data.version).toBeDefined()
      expect(typeof data.version).toBe('string')
    })

    it('should include environment information', async () => {
      const request = new NextRequest('http://localhost:3000/api/health')

      const response = await GET(request)
      const data = await response.json()

      expect(data.environment).toBeDefined()
      expect(typeof data.environment).toBe('string')
    })

    it('should include timestamp', async () => {
      const request = new NextRequest('http://localhost:3000/api/health')

      const response = await GET(request)
      const data = await response.json()

      expect(data.timestamp).toBeDefined()
      expect(typeof data.timestamp).toBe('string')
      
      // Verify it's a valid ISO date
      const date = new Date(data.timestamp)
      expect(date.toISOString()).toBe(data.timestamp)
    })

    it('should handle different request methods', async () => {
      const methods = ['GET', 'POST', 'PUT', 'DELETE']
      
      for (const method of methods) {
        const request = new NextRequest('http://localhost:3000/api/health', {
          method: method as any
        })

        const response = await GET(request)
        
        // Health check should work regardless of method
        expect(response.status).toBe(200)
      }
    })

    it('should handle concurrent requests', async () => {
      const requests = Array(10).fill(null).map(() => 
        new NextRequest('http://localhost:3000/api/health')
      )

      const responses = await Promise.all(
        requests.map(request => GET(request))
      )

      responses.forEach(response => {
        expect(response.status).toBe(200)
      })
    })

    it('should return consistent response structure', async () => {
      const request = new NextRequest('http://localhost:3000/api/health')

      const response = await GET(request)
      const data = await response.json()

      const expectedKeys = [
        'status',
        'timestamp',
        'uptime',
        'memory',
        'version',
        'environment'
      ]

      expectedKeys.forEach(key => {
        expect(data).toHaveProperty(key)
      })
    })

    it('should handle memory pressure scenarios', async () => {
      // Mock high memory usage
      process.memoryUsage = jest.fn(() => ({
        rss: 1000000000, // 1GB
        heapTotal: 500000000,
        heapUsed: 400000000,
        external: 50000000,
        arrayBuffers: 25000000
      }))

      const request = new NextRequest('http://localhost:3000/api/health')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('healthy')
      expect(data.memory.heapUsed).toBe(400000000)
    })

    it('should handle long uptime scenarios', async () => {
      // Mock long uptime (1 year)
      process.uptime = jest.fn(() => 365 * 24 * 3600)

      const request = new NextRequest('http://localhost:3000/api/health')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.uptime).toBe(365 * 24 * 3600)
    })
  })
})
