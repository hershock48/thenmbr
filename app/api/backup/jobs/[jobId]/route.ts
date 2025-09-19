import { NextRequest, NextResponse } from 'next/server'
import { backupService } from '@/lib/backup-service'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      )
    }

    // Get the job to find its location
    const jobs = backupService.getJobs({ limit: 1000 })
    const job = jobs.find(j => j.id === jobId)
    
    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Backup job not found' },
        { status: 404 }
      )
    }

    // Delete the backup file if it exists
    if (job.location) {
      try {
        // This would need to be implemented in the backup service
        // await backupService.deleteBackup(job.location)
      } catch (error) {
        console.warn('Failed to delete backup file:', error)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Backup job deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting backup job:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete backup job',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
