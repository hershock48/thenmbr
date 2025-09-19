import { NextRequest, NextResponse } from 'next/server'
import { performanceMonitor, PerformanceMetricType } from './performance-monitor'

// Performance tracking middleware
export function withPerformanceTracking(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now()
    const startMemory = process.memoryUsage()
    
    let response: NextResponse
    let error: Error | null = null

    try {
      // Execute the handler
      response = await handler(req)
    } catch (err) {
      error = err instanceof Error ? err : new Error('Unknown error')
      throw err
    } finally {
      const endTime = Date.now()
      const endMemory = process.memoryUsage()
      const responseTime = endTime - startTime
      
      // Extract endpoint information
      const url = new URL(req.url)
      const endpoint = url.pathname
      const method = req.method
      const statusCode = response?.status || 500
      
      // Record API response time
      performanceMonitor.recordApiResponseTime(
        endpoint,
        method,
        responseTime,
        statusCode,
        {
          userAgent: req.headers.get('user-agent'),
          referer: req.headers.get('referer'),
          ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          memoryUsage: {
            start: startMemory.heapUsed,
            end: endMemory.heapUsed,
            delta: endMemory.heapUsed - startMemory.heapUsed
          }
        }
      )

      // Record error rate if there was an error
      if (error || statusCode >= 400) {
        performanceMonitor.recordMetric(
          PerformanceMetricType.ERROR_RATE,
          `${method} ${endpoint}`,
          1,
          'count',
          {
            endpoint,
            method,
            status_code: statusCode.toString(),
            error: error?.message || 'HTTP Error'
          }
        )
      }

      // Record memory usage
      const memoryUsagePercent = (endMemory.heapUsed / endMemory.heapTotal) * 100
      performanceMonitor.recordSystemResource('memory', memoryUsagePercent, {
        endpoint,
        method,
        heapUsed: endMemory.heapUsed,
        heapTotal: endMemory.heapTotal,
        external: endMemory.external,
        rss: endMemory.rss
      })

      // Record request size
      const contentLength = req.headers.get('content-length')
      if (contentLength) {
        performanceMonitor.recordMetric(
          PerformanceMetricType.REQUEST_SIZE,
          `${method} ${endpoint}`,
          parseInt(contentLength),
          'bytes',
          { endpoint, method }
        )
      }

      // Record response size if available
      const responseContentLength = response?.headers.get('content-length')
      if (responseContentLength) {
        performanceMonitor.recordMetric(
          PerformanceMetricType.RESPONSE_SIZE,
          `${method} ${endpoint}`,
          parseInt(responseContentLength),
          'bytes',
          { endpoint, method, status_code: statusCode.toString() }
        )
      }
    }

    return response
  }
}

// Database query performance tracking
export function trackDatabaseQuery<T>(
  query: string,
  operation: () => Promise<T>
): Promise<T> {
  const startTime = Date.now()
  
  return operation()
    .then(result => {
      const duration = Date.now() - startTime
      const rowsReturned = Array.isArray(result) ? result.length : 1
      
      performanceMonitor.recordDatabaseQuery(
        query,
        duration,
        rowsReturned,
        {
          query_type: getQueryType(query),
          success: true
        }
      )
      
      return result
    })
    .catch(error => {
      const duration = Date.now() - startTime
      
      performanceMonitor.recordDatabaseQuery(
        query,
        duration,
        0,
        {
          query_type: getQueryType(query),
          success: false,
          error: error.message
        }
      )
      
      throw error
    })
}

// Cache performance tracking
export function trackCachePerformance<T>(
  cacheName: string,
  key: string,
  operation: () => Promise<T>
): Promise<T> {
  const startTime = Date.now()
  let hit = false
  
  return operation()
    .then(result => {
      const duration = Date.now() - startTime
      hit = true
      
      performanceMonitor.recordCachePerformance(
        cacheName,
        100, // 100% hit rate for this operation
        1,
        {
          key,
          hit,
          duration,
          success: true
        }
      )
      
      return result
    })
    .catch(error => {
      const duration = Date.now() - startTime
      hit = false
      
      performanceMonitor.recordCachePerformance(
        cacheName,
        0, // 0% hit rate for this operation
        1,
        {
          key,
          hit,
          duration,
          success: false,
          error: error.message
        }
      )
      
      throw error
    })
}

// Page load performance tracking
export function trackPageLoad(page: string, loadTime: number, metadata?: Record<string, any>) {
  performanceMonitor.recordPageLoad(page, loadTime, {
    ...metadata,
    timestamp: Date.now(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined
  })
}

// Utility function to get query type
function getQueryType(query: string): string {
  const upperQuery = query.toUpperCase().trim()
  if (upperQuery.startsWith('SELECT')) return 'SELECT'
  if (upperQuery.startsWith('INSERT')) return 'INSERT'
  if (upperQuery.startsWith('UPDATE')) return 'UPDATE'
  if (upperQuery.startsWith('DELETE')) return 'DELETE'
  if (upperQuery.startsWith('CREATE')) return 'CREATE'
  if (upperQuery.startsWith('DROP')) return 'DROP'
  if (upperQuery.startsWith('ALTER')) return 'ALTER'
  return 'OTHER'
}

// Performance monitoring decorator for functions
export function withPerformanceTracking<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  metricName: string,
  metricType: PerformanceMetricType = PerformanceMetricType.API_RESPONSE_TIME
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    const startTime = Date.now()
    
    try {
      const result = await fn(...args)
      const duration = Date.now() - startTime
      
      performanceMonitor.recordMetric(
        metricType,
        metricName,
        duration,
        'ms',
        { success: true }
      )
      
      return result
    } catch (error) {
      const duration = Date.now() - startTime
      
      performanceMonitor.recordMetric(
        metricType,
        metricName,
        duration,
        'ms',
        { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      )
      
      throw error
    }
  }
}

export default withPerformanceTracking
