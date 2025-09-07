import { NextRequest, NextResponse } from 'next/server'
import { performanceMonitor, PerformanceMetricType } from '@/lib/performance-monitor'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const type = searchParams.get('type') as PerformanceMetricType | null
    const name = searchParams.get('name') || undefined
    const startTime = searchParams.get('startTime') ? parseInt(searchParams.get('startTime')!) : undefined
    const endTime = searchParams.get('endTime') ? parseInt(searchParams.get('endTime')!) : undefined
    const limit = parseInt(searchParams.get('limit') || '100')
    const period = searchParams.get('period') || '1h'

    // Get metrics from performance monitor
    const metrics = performanceMonitor.getMetrics({
      type: type || undefined,
      name,
      startTime,
      endTime,
      limit
    })

    // Get performance report
    const report = performanceMonitor.getPerformanceReport(period)

    // Calculate additional statistics
    const metricsByType = new Map<string, number[]>()
    metrics.forEach(metric => {
      if (!metricsByType.has(metric.type)) {
        metricsByType.set(metric.type, [])
      }
      metricsByType.get(metric.type)!.push(metric.value)
    })

    const typeStats = Object.fromEntries(
      Array.from(metricsByType.entries()).map(([type, values]) => [
        type,
        {
          count: values.length,
          average: values.reduce((sum, val) => sum + val, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          p95: values.sort((a, b) => a - b)[Math.floor(values.length * 0.95)],
          p99: values.sort((a, b) => a - b)[Math.floor(values.length * 0.99)]
        }
      ])
    )

    return NextResponse.json({
      success: true,
      metrics,
      report,
      typeStats,
      pagination: {
        limit,
        total: metrics.length,
        hasMore: metrics.length === limit
      },
      filters: {
        type,
        name,
        startTime,
        endTime,
        period
      }
    })

  } catch (error) {
    console.error('Error fetching performance metrics:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch performance metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      type, 
      name, 
      value, 
      unit = 'ms', 
      tags = {}, 
      metadata 
    } = body

    if (!type || !name || value === undefined) {
      return NextResponse.json(
        { success: false, error: 'Type, name, and value are required' },
        { status: 400 }
      )
    }

    // Record the metric
    performanceMonitor.recordMetric(
      type as PerformanceMetricType,
      name,
      value,
      unit,
      tags,
      metadata
    )

    return NextResponse.json({
      success: true,
      message: 'Metric recorded successfully'
    })

  } catch (error) {
    console.error('Error recording performance metric:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to record performance metric',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}