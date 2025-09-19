import { NextRequest, NextResponse } from 'next/server'
import { performanceMonitor } from '@/lib/performance-monitor'

export async function POST(
  request: NextRequest,
  { params }: { params: { alertId: string } }
) {
  try {
    const { alertId } = params

    if (!alertId) {
      return NextResponse.json(
        { success: false, error: 'Alert ID is required' },
        { status: 400 }
      )
    }

    const acknowledged = performanceMonitor.acknowledgeAlert(alertId)
    
    if (acknowledged) {
      return NextResponse.json({ 
        success: true, 
        message: 'Alert acknowledged successfully',
        alertId 
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to acknowledge alert. Alert may not exist or already be acknowledged.',
          alertId 
        },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error acknowledging alert:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to acknowledge alert',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
