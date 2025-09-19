/**
 * API Middleware for Error Handling, Logging, and Request Processing
 */

import { NextRequest, NextResponse } from 'next/server'
import { logger, handleError, createErrorResponse, AppError, ErrorType } from './error-handler'

// Request logging middleware
export const withRequestLogging = (handler: Function) => {
  return async (request: NextRequest, ...args: any[]) => {
    const startTime = Date.now()
    const requestId = request.headers.get('x-request-id') || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const context = {
      requestId,
      method: request.method,
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      timestamp: new Date().toISOString()
    }

    logger.info(`API Request: ${request.method} ${request.url}`, context)

    try {
      const response = await handler(request, ...args)
      const duration = Date.now() - startTime
      
      logger.info(`API Response: ${request.method} ${request.url} - ${response.status} (${duration}ms)`, {
        ...context,
        status: response.status,
        duration
      })

      return response
    } catch (error) {
      const duration = Date.now() - startTime
      const appError = handleError(error, context)
      
      logger.error(`API Error: ${request.method} ${request.url} - ${appError.message} (${duration}ms)`, appError, {
        ...context,
        duration
      })

      const { status, body } = createErrorResponse(appError)
      return NextResponse.json(body, { 
        status,
        headers: { 
          'Content-Type': 'application/json',
          'X-Request-ID': requestId
        }
      })
    }
  }
}

// Authentication middleware
export const withAuth = (handler: Function) => {
  return async (request: NextRequest, ...args: any[]) => {
    const authHeader = request.headers.get('authorization')
    const context = {
      requestId: request.headers.get('x-request-id'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      timestamp: new Date().toISOString()
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Unauthenticated API request', context)
      const error = new AppError('Authentication required', ErrorType.AUTHENTICATION, 401, context)
      const { status, body } = createErrorResponse(error)
      return NextResponse.json(body, { status })
    }

    try {
      // Note: JWT token validation would be implemented here
      // const token = authHeader.substring(7)
      // const payload = await verifyJWT(token)
      
      return await handler(request, ...args)
    } catch (error) {
      logger.error('Authentication failed', error as Error, context)
      const appError = new AppError('Invalid authentication token', ErrorType.AUTHENTICATION, 401, context)
      const { status, body } = createErrorResponse(appError)
      return NextResponse.json(body, { status })
    }
  }
}

// Rate limiting middleware
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export const withRateLimit = (maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) => {
  return (handler: Function) => {
    return async (request: NextRequest, ...args: any[]) => {
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      const now = Date.now()
      const key = `${ip}:${request.url}`
      
      const context = {
        requestId: request.headers.get('x-request-id'),
        ip,
        timestamp: new Date().toISOString()
      }

      const current = rateLimitMap.get(key)
      
      if (current) {
        if (now < current.resetTime) {
          if (current.count >= maxRequests) {
            logger.warn(`Rate limit exceeded for ${ip}`, context)
            const error = new AppError('Rate limit exceeded', ErrorType.RATE_LIMIT, 429, context)
            const { status, body } = createErrorResponse(error)
            return NextResponse.json(body, { 
              status,
              headers: {
                'X-RateLimit-Limit': maxRequests.toString(),
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': new Date(current.resetTime).toISOString()
              }
            })
          }
          current.count++
        } else {
          rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
        }
      } else {
        rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
      }

      return await handler(request, ...args)
    }
  }
}

// CORS middleware
export const withCORS = (handler: Function) => {
  return async (request: NextRequest, ...args: any[]) => {
    const origin = request.headers.get('origin')
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
    
    const response = await handler(request, ...args)
    
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-ID')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    
    return response
  }
}

// Request validation middleware
export const withValidation = (schema: any) => {
  return (handler: Function) => {
    return async (request: NextRequest, ...args: any[]) => {
      try {
        const body = await request.json()
        
        // Basic validation - in production, use a proper schema validation library like Zod
        if (schema.required) {
          for (const field of schema.required) {
            if (!body[field]) {
              const error = new AppError(`Missing required field: ${field}`, ErrorType.VALIDATION, 400)
              const { status, body: errorBody } = createErrorResponse(error)
              return NextResponse.json(errorBody, { status })
            }
          }
        }

        return await handler(request, ...args)
      } catch (error) {
        const appError = handleError(error)
        const { status, body } = createErrorResponse(appError)
        return NextResponse.json(body, { status })
      }
    }
  }
}

// Performance monitoring middleware
export const withPerformanceMonitoring = (handler: Function) => {
  return async (request: NextRequest, ...args: any[]) => {
    const startTime = performance.now()
    const startMemory = process.memoryUsage()
    
    const response = await handler(request, ...args)
    
    const endTime = performance.now()
    const endMemory = process.memoryUsage()
    
    const duration = endTime - startTime
    const memoryDelta = endMemory.heapUsed - startMemory.heapUsed
    
    logger.info('Performance metrics', {
      requestId: request.headers.get('x-request-id'),
      method: request.method,
      url: request.url,
      duration: `${duration.toFixed(2)}ms`,
      memoryDelta: `${(memoryDelta / 1024 / 1024).toFixed(2)}MB`,
      timestamp: new Date().toISOString()
    })

    // Add performance headers
    response.headers.set('X-Response-Time', `${duration.toFixed(2)}ms`)
    response.headers.set('X-Memory-Usage', `${(endMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`)

    return response
  }
}

// Combined middleware for API routes
export const withAPIMiddleware = (options: {
  auth?: boolean
  rateLimit?: { maxRequests: number; windowMs: number }
  cors?: boolean
  validation?: any
  performanceMonitoring?: boolean
} = {}) => {
  return (handler: Function) => {
    let wrappedHandler = handler

    // Apply middleware in reverse order (last applied is first executed)
    if (options.performanceMonitoring !== false) {
      wrappedHandler = withPerformanceMonitoring(wrappedHandler)
    }

    if (options.validation) {
      wrappedHandler = withValidation(options.validation)(wrappedHandler)
    }

    if (options.cors !== false) {
      wrappedHandler = withCORS(wrappedHandler)
    }

    if (options.rateLimit) {
      wrappedHandler = withRateLimit(options.rateLimit.maxRequests, options.rateLimit.windowMs)(wrappedHandler)
    }

    if (options.auth) {
      wrappedHandler = withAuth(wrappedHandler)
    }

    // Always apply request logging and error handling last
    wrappedHandler = withRequestLogging(wrappedHandler)

    return wrappedHandler
  }
}

// Health check endpoint
export const healthCheck = async () => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  }

  logger.info('Health check requested', { health })

  return NextResponse.json(health, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  })
}
