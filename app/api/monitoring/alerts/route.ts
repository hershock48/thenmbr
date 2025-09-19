import { NextRequest, NextResponse } from 'next/server'
import { performanceMonitor } from '@/lib/performance-monitor'
import { alertingService } from '@/lib/alerting-service'
import { AlertSeverity, AlertStatus, AlertType } from '@/lib/performance-monitor'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const severity = searchParams.get('severity') as AlertSeverity | null
    const status = searchParams.get('status') as AlertStatus | null
    const type = searchParams.get('type') as AlertType | null
    const limit = parseInt(searchParams.get('limit') || '50')
    const startTime = searchParams.get('startTime') ? parseInt(searchParams.get('startTime')!) : undefined
    const endTime = searchParams.get('endTime') ? parseInt(searchParams.get('endTime')!) : undefined

    // Get alerts from performance monitor
    const alerts = performanceMonitor.getAlerts({
      severity: severity || undefined,
      status: status || undefined,
      type: type || undefined,
      startTime,
      endTime,
      limit
    })

    // Calculate statistics
    const allAlerts = performanceMonitor.getAlerts()
    const stats = {
      total: allAlerts.length,
      active: allAlerts.filter(a => a.status === AlertStatus.ACTIVE).length,
      resolved: allAlerts.filter(a => a.status === AlertStatus.RESOLVED).length,
      critical: allAlerts.filter(a => a.severity === AlertSeverity.CRITICAL).length,
      high: allAlerts.filter(a => a.severity === AlertSeverity.HIGH).length,
      medium: allAlerts.filter(a => a.severity === AlertSeverity.MEDIUM).length,
      low: allAlerts.filter(a => a.severity === AlertSeverity.LOW).length,
      byType: Object.values(AlertType).reduce((acc, type) => {
        acc[type] = allAlerts.filter(a => a.type === type).length
        return acc
      }, {} as Record<AlertType, number>),
      byStatus: Object.values(AlertStatus).reduce((acc, status) => {
        acc[status] = allAlerts.filter(a => a.status === status).length
        return acc
      }, {} as Record<AlertStatus, number>)
    }

    return NextResponse.json({
      success: true,
      alerts,
      stats,
      pagination: {
        limit,
        total: allAlerts.length,
        hasMore: alerts.length === limit
      }
    })

  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch alerts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, alertId, channelId, message } = body

    switch (action) {
      case 'acknowledge':
        if (!alertId) {
          return NextResponse.json(
            { success: false, error: 'Alert ID is required' },
            { status: 400 }
          )
        }
        
        const acknowledged = performanceMonitor.acknowledgeAlert(alertId)
        if (acknowledged) {
          return NextResponse.json({ success: true, message: 'Alert acknowledged' })
        } else {
          return NextResponse.json(
            { success: false, error: 'Failed to acknowledge alert' },
            { status: 400 }
          )
        }

      case 'resolve':
        if (!alertId) {
          return NextResponse.json(
            { success: false, error: 'Alert ID is required' },
            { status: 400 }
          )
        }
        
        const resolved = performanceMonitor.resolveAlert(alertId)
        if (resolved) {
          return NextResponse.json({ success: true, message: 'Alert resolved' })
        } else {
          return NextResponse.json(
            { success: false, error: 'Failed to resolve alert' },
            { status: 400 }
          )
        }

      case 'suppress':
        if (!alertId) {
          return NextResponse.json(
            { success: false, error: 'Alert ID is required' },
            { status: 400 }
          )
        }
        
        const suppressed = performanceMonitor.suppressAlert(alertId)
        if (suppressed) {
          return NextResponse.json({ success: true, message: 'Alert suppressed' })
        } else {
          return NextResponse.json(
            { success: false, error: 'Failed to suppress alert' },
            { status: 400 }
          )
        }

      case 'send_notification':
        if (!alertId || !channelId) {
          return NextResponse.json(
            { success: false, error: 'Alert ID and channel ID are required' },
            { status: 400 }
          )
        }
        
        const alerts = performanceMonitor.getAlerts({ limit: 1 })
        const alert = alerts.find(a => a.id === alertId)
        if (!alert) {
          return NextResponse.json(
            { success: false, error: 'Alert not found' },
            { status: 404 }
          )
        }
        
        const sent = await alertingService.sendNotification(channelId, alert, message)
        if (sent) {
          return NextResponse.json({ success: true, message: 'Notification sent' })
        } else {
          return NextResponse.json(
            { success: false, error: 'Failed to send notification' },
            { status: 500 }
          )
        }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error processing alert action:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process alert action',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
