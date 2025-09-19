import { NextRequest, NextResponse } from 'next/server'
import { withAdminAccess } from '@/lib/auth-middleware'
import { databaseCache } from '@/lib/cache'

async function clearDatabaseCache(req: NextRequest) {
  try {
    // Clear all database cache
    databaseCache.clear('database')

    return NextResponse.json({ 
      success: true, 
      message: 'Database cache cleared successfully' 
    })
  } catch (error) {
    console.error('Error clearing database cache:', error)
    return NextResponse.json(
      { error: 'Failed to clear database cache' },
      { status: 500 }
    )
  }
}

export const POST = withAdminAccess(clearDatabaseCache)
