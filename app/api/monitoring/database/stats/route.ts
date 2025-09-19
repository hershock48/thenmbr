import { NextRequest, NextResponse } from 'next/server'
import { withAdminAccess } from '@/lib/auth-middleware'
import { dbOptimizer } from '@/lib/database-optimizer'
import { databaseCache } from '@/lib/cache'

export const dynamic = 'force-dynamic'

async function getDatabaseStats(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const table = searchParams.get('table')
    const timeRange = searchParams.get('timeRange') || '1h'

    // Get query metrics
    const allMetrics = dbOptimizer.getQueryMetrics()
    
    // Filter by table if specified
    let metrics = allMetrics
    if (table && table !== 'all') {
      metrics = allMetrics.filter(metric => 
        metric.query.toLowerCase().includes(table.toLowerCase())
      )
    }

    // Filter by time range
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

    // Filter metrics by time range
    metrics = metrics.filter(metric => 
      new Date(metric.timestamp) >= startTime
    )

    // Calculate statistics
    const totalQueries = metrics.length
    const totalDuration = metrics.reduce((sum, metric) => sum + metric.duration, 0)
    const averageDuration = totalQueries > 0 ? totalDuration / totalQueries : 0
    const slowQueries = metrics.filter(metric => metric.duration > 1000).length
    const cacheHits = metrics.filter(metric => metric.cacheHit).length
    const cacheHitRate = totalQueries > 0 ? (cacheHits / totalQueries) * 100 : 0
    const errors = metrics.filter(metric => metric.error).length
    const errorRate = totalQueries > 0 ? (errors / totalQueries) * 100 : 0

    // Calculate top tables
    const tableStats = new Map<string, {
      queries: number
      totalDuration: number
      errors: number
    }>()

    for (const metric of metrics) {
      // Extract table name from query
      const tableMatch = metric.query.match(/(?:FROM|INTO|UPDATE|DELETE FROM)\s+(\w+)/i)
      const tableName = tableMatch ? tableMatch[1] : 'unknown'
      
      const existing = tableStats.get(tableName) || {
        queries: 0,
        totalDuration: 0,
        errors: 0
      }
      
      existing.queries++
      existing.totalDuration += metric.duration
      if (metric.error) {
        existing.errors++
      }
      
      tableStats.set(tableName, existing)
    }

    const topTables = Array.from(tableStats.entries())
      .map(([table, stats]) => ({
        table,
        queries: stats.queries,
        averageDuration: stats.totalDuration / stats.queries,
        errorRate: (stats.errors / stats.queries) * 100
      }))
      .sort((a, b) => b.queries - a.queries)
      .slice(0, 10)

    // Get recent queries (last 20)
    const recentQueries = metrics
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20)

    // Get slow queries
    const slowQueriesList = metrics
      .filter(metric => metric.duration > 1000)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10)

    // Get cache statistics
    const cacheStats = databaseCache.getStats()

    const stats = {
      totalQueries,
      averageDuration,
      slowQueries,
      cacheHitRate,
      errorRate,
      topTables,
      recentQueries,
      slowQueries: slowQueriesList,
      cacheStats: {
        hits: cacheStats.hits,
        misses: cacheStats.misses,
        hitRate: cacheStats.hitRate,
        totalItems: cacheStats.totalItems,
        memoryUsage: cacheStats.memoryUsage
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error getting database stats:', error)
    return NextResponse.json(
      { error: 'Failed to get database statistics' },
      { status: 500 }
    )
  }
}

export const GET = withAdminAccess(getDatabaseStats)
