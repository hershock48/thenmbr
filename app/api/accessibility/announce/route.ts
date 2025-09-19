import { NextRequest, NextResponse } from 'next/server'
import { accessibilityService } from '@/lib/accessibility-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message } = body

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    // Announce message to screen readers
    accessibilityService.announceToScreenReader(message)

    return NextResponse.json({
      success: true,
      message: 'Announcement sent to screen readers'
    })

  } catch (error) {
    console.error('Error announcing message:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to announce message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
