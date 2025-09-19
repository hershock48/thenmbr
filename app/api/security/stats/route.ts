import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { withAdminAccess } from '@/lib/auth-middleware'

export const dynamic = 'force-dynamic'

async function getSecurityStats(req: NextRequest) {
  try {
    // Get security statistics for the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    // Get failed login attempts
    const { data: failedLogins, error: failedLoginsError } = await supabase
      .from('audit_logs')
      .select('id')
      .eq('action', 'login_failed')
      .gte('created_at', twentyFourHoursAgo)

    if (failedLoginsError) {
      console.error('Error fetching failed logins:', failedLoginsError)
    }

    // Get permission denied events
    const { data: permissionDenied, error: permissionDeniedError } = await supabase
      .from('audit_logs')
      .select('id')
      .eq('action', 'permission_denied')
      .gte('created_at', twentyFourHoursAgo)

    if (permissionDeniedError) {
      console.error('Error fetching permission denied events:', permissionDeniedError)
    }

    // Get suspicious activity events
    const { data: suspiciousActivity, error: suspiciousActivityError } = await supabase
      .from('audit_logs')
      .select('id')
      .like('action', '%suspicious%')
      .gte('created_at', twentyFourHoursAgo)

    if (suspiciousActivityError) {
      console.error('Error fetching suspicious activity:', suspiciousActivityError)
    }

    // Get total events
    const { data: totalEvents, error: totalEventsError } = await supabase
      .from('audit_logs')
      .select('id')
      .gte('created_at', twentyFourHoursAgo)

    if (totalEventsError) {
      console.error('Error fetching total events:', totalEventsError)
    }

    // Get active users (users who have logged in within the last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { data: activeUsers, error: activeUsersError } = await supabase
      .from('user_profiles')
      .select('id')
      .gte('last_login_at', oneHourAgo)
      .eq('is_active', true)

    if (activeUsersError) {
      console.error('Error fetching active users:', activeUsersError)
    }

    // Calculate security score (0-100)
    const failedLoginsCount = failedLogins?.length || 0
    const permissionDeniedCount = permissionDenied?.length || 0
    const suspiciousActivityCount = suspiciousActivity?.length || 0
    const totalEventsCount = totalEvents?.length || 0
    const activeUsersCount = activeUsers?.length || 0

    // Security score calculation
    let securityScore = 100
    
    // Deduct points for security events
    if (failedLoginsCount > 0) {
      securityScore -= Math.min(failedLoginsCount * 2, 30) // Max 30 points deduction
    }
    
    if (permissionDeniedCount > 0) {
      securityScore -= Math.min(permissionDeniedCount * 1, 20) // Max 20 points deduction
    }
    
    if (suspiciousActivityCount > 0) {
      securityScore -= Math.min(suspiciousActivityCount * 5, 40) // Max 40 points deduction
    }

    // Ensure score doesn't go below 0
    securityScore = Math.max(securityScore, 0)

    const stats = {
      totalEvents: totalEventsCount,
      failedLogins: failedLoginsCount,
      permissionDenied: permissionDeniedCount,
      suspiciousActivity: suspiciousActivityCount,
      activeUsers: activeUsersCount,
      securityScore: Math.round(securityScore)
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error getting security stats:', error)
    return NextResponse.json(
      { error: 'Failed to get security statistics' },
      { status: 500 }
    )
  }
}

export const GET = withAdminAccess(getSecurityStats)
