import { NextRequest, NextResponse } from 'next/server'
import { backupService, BackupConfig, BackupType, StorageProvider } from '@/lib/backup-service'

export async function GET(request: NextRequest) {
  try {
    const configs = backupService.getConfigs()
    
    return NextResponse.json({
      success: true,
      configs
    })

  } catch (error) {
    console.error('Error fetching backup configurations:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch backup configurations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      id, 
      name, 
      type, 
      enabled = true, 
      schedule, 
      retention, 
      storage, 
      encryption, 
      compression = true 
    } = body

    if (!id || !name || !type || !schedule || !retention || !storage) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const config: BackupConfig = {
      id,
      name,
      type: type as BackupType,
      enabled,
      schedule,
      retention,
      storage: {
        provider: storage.provider as StorageProvider,
        config: storage.config
      },
      encryption: {
        enabled: encryption?.enabled || false,
        key: encryption?.key
      },
      compression
    }

    backupService.addConfig(config)

    return NextResponse.json({
      success: true,
      message: 'Backup configuration created successfully',
      config
    })

  } catch (error) {
    console.error('Error creating backup configuration:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create backup configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Configuration ID is required' },
        { status: 400 }
      )
    }

    // Get existing config
    const configs = backupService.getConfigs()
    const existingConfig = configs.find(c => c.id === id)
    
    if (!existingConfig) {
      return NextResponse.json(
        { success: false, error: 'Configuration not found' },
        { status: 404 }
      )
    }

    // Update config
    const updatedConfig: BackupConfig = {
      ...existingConfig,
      ...updates
    }

    backupService.addConfig(updatedConfig)

    return NextResponse.json({
      success: true,
      message: 'Backup configuration updated successfully',
      config: updatedConfig
    })

  } catch (error) {
    console.error('Error updating backup configuration:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update backup configuration',
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
        { success: false, error: 'Configuration ID is required' },
        { status: 400 }
      )
    }

    const removed = backupService.removeConfig(id)
    
    if (removed) {
      return NextResponse.json({
        success: true,
        message: 'Backup configuration deleted successfully'
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Configuration not found' },
        { status: 404 }
      )
    }

  } catch (error) {
    console.error('Error deleting backup configuration:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete backup configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
