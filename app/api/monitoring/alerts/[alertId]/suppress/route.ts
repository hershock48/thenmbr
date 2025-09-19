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

    const suppressed = performanceMonitor.suppressAlert(alertId)
    
    if (suppressed) {
      return NextResponse.json({ 
        success: true, 
        message: 'Alert suppressed successfully',
        alertId 
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to suppress alert. Alert may not exist or already be suppressed.',
          alertId 
        },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error suppressing alert:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to suppress alert',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
