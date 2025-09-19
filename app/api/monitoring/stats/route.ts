import { NextRequest, NextResponse } from 'next/server'
import { withAdminAccess } from '@/lib/auth-middleware'
import { monitoring } from '@/lib/monitoring'

export const dynamic = 'force-dynamic'

async function getMonitoringStats(req: NextRequest) {
  try {
    // Get log statistics
    const logStats = monitoring.getLogStatistics()
    
    // Get system health
    const systemHealth = monitoring.getSystemHealth()
    
    // Get recent errors (last 10)
    const recentErrors = monitoring.getLogs({
      level: 'error' as any,
      limit: 10
    })
    
    // Get performance metrics for top endpoints
    const performanceMetrics = monitoring.getPerformanceMetrics({ limit: 1000 })
    
    // Calculate top endpoints
    const endpointStats = new Map<string, {
      requests: number
      totalResponseTime: number
      errorCount: number
    }>()
    
    for (const metric of performanceMetrics) {
      const key = `${metric.method} ${metric.endpoint}`
      const existing = endpointStats.get(key) || {
        requests: 0,
        totalResponseTime: 0,
        errorCount: 0
      }
      
      existing.requests++
      existing.totalResponseTime += metric.duration
      if (metric.statusCode >= 400) {
        existing.errorCount++
      }
      
      endpointStats.set(key, existing)
    }
    
    const topEndpoints = Array.from(endpointStats.entries())
      .map(([endpoint, stats]) => ({
        endpoint,
        requests: stats.requests,
        averageResponseTime: stats.totalResponseTime / stats.requests,
        errorRate: (stats.errorCount / stats.requests) * 100
      }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 10)
    
    // Calculate active users (simplified - in production, use real-time data)
    const activeUsers = monitoring.getLogs({
      category: 'user_action' as any,
      startTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // Last 5 minutes
      limit: 1000
    }).length
    
    const stats = {
      totalLogs: logStats.totalLogs,
      logsByLevel: logStats.logsByLevel,
      logsByCategory: logStats.logsByCategory,
      errorRate: logStats.errorRate,
      averageResponseTime: logStats.averageResponseTime,
      activeUsers,
      systemHealth: systemHealth || {
        status: 'healthy' as const,
        uptime: 0,
        memoryUsage: 0,
        cpuUsage: 0,
        diskUsage: 0,
        databaseConnections: 0,
        errorRate: 0,
        responseTime: 0,
        throughput: 0
      },
      recentErrors,
      topEndpoints
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error getting monitoring stats:', error)
    return NextResponse.json(
      { error: 'Failed to get monitoring statistics' },
      { status: 500 }
    )
  }
}

export const GET = withAdminAccess(getMonitoringStats)
