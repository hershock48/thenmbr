import { NextRequest, NextResponse } from 'next/server'
import { withAdminAccess } from '@/lib/auth-middleware'
import { monitoring, LogLevel, LogCategory } from '@/lib/monitoring'

export const dynamic = 'force-dynamic'

async function getLogs(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const level = searchParams.get('level') as LogLevel | null
    const category = searchParams.get('category') as LogCategory | null
    const userId = searchParams.get('userId')
    const organizationId = searchParams.get('organizationId')
    const startTime = searchParams.get('startTime')
    const endTime = searchParams.get('endTime')
    const limit = parseInt(searchParams.get('limit') || '100')

    // Build filters
    const filters: any = {
      limit: Math.min(limit, 1000) // Cap at 1000 logs
    }

    if (level) filters.level = level
    if (category) filters.category = category
    if (userId) filters.userId = userId
    if (organizationId) filters.organizationId = organizationId
    if (startTime) filters.startTime = startTime
    if (endTime) filters.endTime = endTime

    // Get logs
    const logs = monitoring.getLogs(filters)

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Error getting logs:', error)
    return NextResponse.json(
      { error: 'Failed to get logs' },
      { status: 500 }
    )
  }
}

export const GET = withAdminAccess(getLogs)
