import { NextRequest, NextResponse } from 'next/server'
import { withAdminAccess } from '@/lib/auth-middleware'
import { 
  authRateLimiter, 
  apiRateLimiter, 
  widgetRateLimiter, 
  emailRateLimiter, 
  uploadRateLimiter, 
  newsletterRateLimiter, 
  donationRateLimiter, 
  healthRateLimiter 
} from '@/lib/rate-limiter'

async function getRateLimitStatus(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const endpoint = searchParams.get('endpoint')
    const blockedOnly = searchParams.get('blocked') === 'true'

    // Get all active rate limits
    const authLimits = authRateLimiter.getAllStatuses()
    const apiLimits = apiRateLimiter.getAllStatuses()
    const widgetLimits = widgetRateLimiter.getAllStatuses()
    const emailLimits = emailRateLimiter.getAllStatuses()
    const uploadLimits = uploadRateLimiter.getAllStatuses()
    const newsletterLimits = newsletterRateLimiter.getAllStatuses()
    const donationLimits = donationRateLimiter.getAllStatuses()
    const healthLimits = healthRateLimiter.getAllStatuses()

    // Combine all limits with metadata
    const allLimits = [
      ...Array.from(authLimits.entries()).map(([key, value]) => ({
        key: `auth:${key}`,
        ...value,
        endpoint: 'Authentication',
        category: 'auth'
      })),
      ...Array.from(apiLimits.entries()).map(([key, value]) => ({
        key: `api:${key}`,
        ...value,
        endpoint: 'API',
        category: 'api'
      })),
      ...Array.from(widgetLimits.entries()).map(([key, value]) => ({
        key: `widget:${key}`,
        ...value,
        endpoint: 'Widget',
        category: 'widget'
      })),
      ...Array.from(emailLimits.entries()).map(([key, value]) => ({
        key: `email:${key}`,
        ...value,
        endpoint: 'Email',
        category: 'email'
      })),
      ...Array.from(uploadLimits.entries()).map(([key, value]) => ({
        key: `upload:${key}`,
        ...value,
        endpoint: 'Upload',
        category: 'upload'
      })),
      ...Array.from(newsletterLimits.entries()).map(([key, value]) => ({
        key: `newsletter:${key}`,
        ...value,
        endpoint: 'Newsletter',
        category: 'newsletter'
      })),
      ...Array.from(donationLimits.entries()).map(([key, value]) => ({
        key: `donation:${key}`,
        ...value,
        endpoint: 'Donation',
        category: 'donation'
      })),
      ...Array.from(healthLimits.entries()).map(([key, value]) => ({
        key: `health:${key}`,
        ...value,
        endpoint: 'Health',
        category: 'health'
      }))
    ]

    // Apply filters
    let filteredLimits = allLimits

    if (endpoint) {
      filteredLimits = filteredLimits.filter(limit => 
        limit.endpoint.toLowerCase().includes(endpoint.toLowerCase())
      )
    }

    if (blockedOnly) {
      filteredLimits = filteredLimits.filter(limit => limit.blocked)
    }

    // Sort by total hits (descending)
    filteredLimits.sort((a, b) => b.totalHits - a.totalHits)

    // Apply pagination
    const paginatedLimits = filteredLimits.slice(offset, offset + limit)

    // Add additional metadata
    const enrichedLimits = paginatedLimits.map(limit => ({
      ...limit,
      ipAddress: extractIPFromKey(limit.key),
      userAgent: 'Unknown', // Would need to store this separately
      lastActivity: new Date(limit.resetTime - (15 * 60 * 1000)).toISOString() // Approximate
    }))

    return NextResponse.json(enrichedLimits)
  } catch (error) {
    console.error('Error getting rate limit status:', error)
    return NextResponse.json(
      { error: 'Failed to get rate limit status' },
      { status: 500 }
    )
  }
}

function extractIPFromKey(key: string): string {
  // Extract IP address from rate limit key
  // Keys are typically in format "category:ip:userId" or "category:ip"
  const parts = key.split(':')
  if (parts.length >= 2) {
    return parts[1]
  }
  return 'Unknown'
}

export const GET = withAdminAccess(getRateLimitStatus)
