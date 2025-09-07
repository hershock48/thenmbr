import { NextRequest, NextResponse } from 'next/server'
import { alertingService, ChannelType, NotificationChannel } from '@/lib/alerting-service'

export async function GET(request: NextRequest) {
  try {
    const channels = alertingService.getChannels()
    
    return NextResponse.json({
      success: true,
      channels
    })

  } catch (error) {
    console.error('Error fetching alerting channels:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch alerting channels',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, type, config, enabled = true, rateLimit } = body

    if (!id || !type || !config) {
      return NextResponse.json(
        { success: false, error: 'ID, type, and config are required' },
        { status: 400 }
      )
    }

    const channel: NotificationChannel = {
      type: type as ChannelType,
      config,
      enabled,
      rateLimit
    }

    alertingService.addChannel(id, channel)

    return NextResponse.json({
      success: true,
      message: 'Channel added successfully',
      channel: { id, ...channel }
    })

  } catch (error) {
    console.error('Error adding alerting channel:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to add alerting channel',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, type, config, enabled, rateLimit } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Channel ID is required' },
        { status: 400 }
      )
    }

    const channel: NotificationChannel = {
      type: type as ChannelType,
      config,
      enabled: enabled !== undefined ? enabled : true,
      rateLimit
    }

    alertingService.addChannel(id, channel)

    return NextResponse.json({
      success: true,
      message: 'Channel updated successfully',
      channel: { id, ...channel }
    })

  } catch (error) {
    console.error('Error updating alerting channel:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update alerting channel',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Channel ID is required' },
        { status: 400 }
      )
    }

    const removed = alertingService.removeChannel(id)
    
    if (removed) {
      return NextResponse.json({
        success: true,
        message: 'Channel removed successfully'
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Channel not found' },
        { status: 404 }
      )
    }

  } catch (error) {
    console.error('Error removing alerting channel:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to remove alerting channel',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
