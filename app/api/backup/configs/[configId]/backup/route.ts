import { NextRequest, NextResponse } from 'next/server'
import { backupService, BackupType } from '@/lib/backup-service'

export async function POST(
  request: NextRequest,
  { params }: { params: { configId: string } }
) {
  try {
    const { configId } = params
    const body = await request.json()
    const { type } = body

    if (!configId) {
      return NextResponse.json(
        { success: false, error: 'Configuration ID is required' },
        { status: 400 }
      )
    }

    const job = await backupService.createBackup(
      configId, 
      type ? type as BackupType : undefined
    )

    return NextResponse.json({
      success: true,
      message: 'Backup job created successfully',
      job
    })

  } catch (error) {
    console.error('Error creating backup job:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create backup job',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
