import { NextRequest, NextResponse } from 'next/server'
import { backupService, BackupType, BackupStatus } from '@/lib/backup-service'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const configId = searchParams.get('configId') || undefined
    const type = searchParams.get('type') as BackupType || undefined
    const status = searchParams.get('status') as BackupStatus || undefined
    const startTime = searchParams.get('startTime') ? parseInt(searchParams.get('startTime')!) : undefined
    const endTime = searchParams.get('endTime') ? parseInt(searchParams.get('endTime')!) : undefined
    const limit = parseInt(searchParams.get('limit') || '50')

    const jobs = backupService.getJobs({
      configId,
      type,
      status,
      startTime,
      endTime,
      limit
    })

    return NextResponse.json({
      success: true,
      jobs,
      pagination: {
        limit,
        total: jobs.length,
        hasMore: jobs.length === limit
      }
    })

  } catch (error) {
    console.error('Error fetching backup jobs:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch backup jobs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
