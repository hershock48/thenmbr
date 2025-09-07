import { NextRequest, NextResponse } from 'next/server'
import { withAdminAccess } from '@/lib/auth-middleware'
import { monitoring } from '@/lib/monitoring'

async function getPerformanceStats(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const endpoint = searchParams.get('endpoint')
    const timeRange = searchParams.get('timeRange') || '1h'

    // Calculate time range
    const now = new Date()
    let startTime: Date
    
    switch (timeRange) {
      case '15m':
        startTime = new Date(now.getTime() - 15 * 60 * 1000)
        break
      case '1h':
        startTime = new Date(now.getTime() - 60 * 60 * 1000)
        break
      case '6h':
        startTime = new Date(now.getTime() - 6 * 60 * 60 * 1000)
        break
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      default:
        startTime = new Date(now.getTime() - 60 * 60 * 1000)
    }

    // Get performance metrics
    const metrics = monitoring.getPerformanceMetrics({
      endpoint: endpoint || undefined,
      startTime: startTime.toISOString(),
      limit: 10000
    })

    if (metrics.length === 0) {
      return NextResponse.json({
        totalRequests: 0,
        averageResponseTime: 0,
        slowestEndpoints: [],
        errorRate: 0,
        throughput: 0,
        memoryUsage: {
          current: 0,
          peak: 0,
          average: 0
        },
        databasePerformance: {
          averageQueryTime: 0,
          totalQueries: 0,
          slowQueries: 0
        },
        cachePerformance: {
          hitRate: 0,
          totalHits: 0,
          totalMisses: 0
        }
      })
    }

    // Calculate statistics
    const totalRequests = metrics.length
    const totalDuration = metrics.reduce((sum, metric) => sum + metric.duration, 0)
    const averageResponseTime = totalDuration / totalRequests

    // Calculate error rate
    const errorCount = metrics.filter(metric => metric.statusCode >= 400).length
    const errorRate = (errorCount / totalRequests) * 100

    // Calculate throughput (requests per second)
    const timeSpanMs = now.getTime() - startTime.getTime()
    const throughput = (totalRequests / timeSpanMs) * 1000

    // Calculate slowest endpoints
    const endpointStats = new Map<string, {
      totalDuration: number
      maxDuration: number
      requestCount: number
    }>()

    for (const metric of metrics) {
      const key = `${metric.method} ${metric.endpoint}`
      const existing = endpointStats.get(key) || {
        totalDuration: 0,
        maxDuration: 0,
        requestCount: 0
      }
      
      existing.totalDuration += metric.duration
      existing.maxDuration = Math.max(existing.maxDuration, metric.duration)
      existing.requestCount++
      
      endpointStats.set(key, existing)
    }

    const slowestEndpoints = Array.from(endpointStats.entries())
      .map(([endpoint, stats]) => ({
        endpoint,
        averageDuration: stats.totalDuration / stats.requestCount,
        maxDuration: stats.maxDuration,
        requestCount: stats.requestCount
      }))
      .sort((a, b) => b.averageDuration - a.averageDuration)
      .slice(0, 10)

    // Calculate memory usage
    const memoryUsages = metrics.map(metric => metric.memoryUsage)
    const currentMemory = memoryUsages[memoryUsages.length - 1] || 0
    const peakMemory = Math.max(...memoryUsages)
    const averageMemory = memoryUsages.reduce((sum, usage) => sum + usage, 0) / memoryUsages.length

    // Calculate database performance
    const totalQueries = metrics.reduce((sum, metric) => sum + metric.databaseQueries, 0)
    const slowQueries = metrics.filter(metric => metric.databaseQueries > 0).length
    const averageQueryTime = totalQueries > 0 ? totalDuration / totalQueries : 0

    // Calculate cache performance
    const totalCacheHits = metrics.reduce((sum, metric) => sum + metric.cacheHits, 0)
    const totalCacheMisses = metrics.reduce((sum, metric) => sum + metric.cacheMisses, 0)
    const totalCacheRequests = totalCacheHits + totalCacheMisses
    const hitRate = totalCacheRequests > 0 ? (totalCacheHits / totalCacheRequests) * 100 : 0

    const stats = {
      totalRequests,
      averageResponseTime,
      slowestEndpoints,
      errorRate,
      throughput,
      memoryUsage: {
        current: currentMemory,
        peak: peakMemory,
        average: averageMemory
      },
      databasePerformance: {
        averageQueryTime,
        totalQueries,
        slowQueries
      },
      cachePerformance: {
        hitRate,
        totalHits: totalCacheHits,
        totalMisses: totalCacheMisses
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error getting performance stats:', error)
    return NextResponse.json(
      { error: 'Failed to get performance statistics' },
      { status: 500 }
    )
  }
}

export const GET = withAdminAccess(getPerformanceStats)
