import { NextRequest, NextResponse } from 'next/server'
import { backupService } from '@/lib/backup-service'

export async function POST(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params
    const body = await request.json()
    const { targetLocation } = body

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      )
    }

    const restore = await backupService.restoreBackup(jobId, targetLocation)

    return NextResponse.json({
      success: true,
      message: 'Restore job created successfully',
      restore
    })

  } catch (error) {
    console.error('Error creating restore job:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create restore job',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
