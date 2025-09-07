import { NextRequest, NextResponse } from 'next/server'
import { backupService, RestoreStatus } from '@/lib/backup-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const backupId = searchParams.get('backupId') || undefined
    const status = searchParams.get('status') as RestoreStatus || undefined
    const startTime = searchParams.get('startTime') ? parseInt(searchParams.get('startTime')!) : undefined
    const endTime = searchParams.get('endTime') ? parseInt(searchParams.get('endTime')!) : undefined
    const limit = parseInt(searchParams.get('limit') || '50')

    const restores = backupService.getRestores({
      backupId,
      status,
      startTime,
      endTime,
      limit
    })

    return NextResponse.json({
      success: true,
      restores,
      pagination: {
        limit,
        total: restores.length,
        hasMore: restores.length === limit
      }
    })

  } catch (error) {
    console.error('Error fetching restore jobs:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch restore jobs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
