import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { withAdminAccess } from '@/lib/auth-middleware'

async function getSecurityEvents(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const severity = searchParams.get('severity')
    const type = searchParams.get('type')

    // Build query
    let query = supabase
      .from('audit_logs')
      .select(`
        id,
        action,
        resource_type,
        resource_id,
        organization_id,
        details,
        ip_address,
        user_agent,
        created_at,
        user_profiles!inner(
          id,
          email,
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (severity) {
      query = query.eq('details->severity', severity)
    }

    if (type) {
      query = query.eq('action', type)
    }

    const { data: events, error } = await query

    if (error) {
      console.error('Error fetching security events:', error)
      return NextResponse.json(
        { error: 'Failed to fetch security events' },
        { status: 500 }
      )
    }

    // Transform events to match the expected format
    const transformedEvents = events?.map(event => {
      const details = event.details || {}
      const user = event.user_profiles

      return {
        id: event.id,
        type: mapActionToType(event.action),
        severity: details.severity || 'low',
        message: generateEventMessage(event.action, details, user),
        timestamp: event.created_at,
        user_id: event.user_profiles?.id,
        ip_address: event.ip_address,
        details: {
          action: event.action,
          resource_type: event.resource_type,
          resource_id: event.resource_id,
          organization_id: event.organization_id,
          user_agent: event.user_agent,
          ...details
        }
      }
    }) || []

    return NextResponse.json(transformedEvents)
  } catch (error) {
    console.error('Error getting security events:', error)
    return NextResponse.json(
      { error: 'Failed to get security events' },
      { status: 500 }
    )
  }
}

function mapActionToType(action: string): string {
  if (action.includes('login') || action.includes('auth')) {
    return 'failed_login'
  }
  if (action.includes('permission') || action.includes('access')) {
    return 'permission_denied'
  }
  if (action.includes('suspicious') || action.includes('security')) {
    return 'suspicious_activity'
  }
  if (action.includes('data') || action.includes('read') || action.includes('write')) {
    return 'data_access'
  }
  return 'other'
}

function generateEventMessage(action: string, details: any, user: any): string {
  const userName = user ? `${user.first_name} ${user.last_name}` : 'Unknown user'
  
  switch (action) {
    case 'login_failed':
      return `Failed login attempt for ${userName}`
    
    case 'permission_denied':
      return `Permission denied for ${userName}: ${details.resource || 'Unknown resource'}`
    
    case 'suspicious_activity':
      return `Suspicious activity detected for ${userName}: ${details.description || 'Unknown activity'}`
    
    case 'profile_updated':
      return `${userName} updated their profile`
    
    case 'story_created':
      return `${userName} created a new story`
    
    case 'story_updated':
      return `${userName} updated a story`
    
    case 'story_deleted':
      return `${userName} deleted a story`
    
    case 'newsletter_sent':
      return `${userName} sent a newsletter`
    
    case 'donation_processed':
      return `Donation processed: $${(details.amount / 100).toFixed(2)}`
    
    case 'subscriber_added':
      return `New subscriber added: ${details.email || 'Unknown email'}`
    
    case 'subscriber_removed':
      return `Subscriber removed: ${details.email || 'Unknown email'}`
    
    default:
      return `${action.replace(/_/g, ' ')} by ${userName}`
  }
}

export const GET = withAdminAccess(getSecurityEvents)
