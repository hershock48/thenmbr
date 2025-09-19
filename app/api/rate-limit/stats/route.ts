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

export const dynamic = 'force-dynamic'

async function getRateLimitStats(req: NextRequest) {
  try {
    // Get all active rate limits
    const authLimits = authRateLimiter.getAllStatuses()
    const apiLimits = apiRateLimiter.getAllStatuses()
    const widgetLimits = widgetRateLimiter.getAllStatuses()
    const emailLimits = emailRateLimiter.getAllStatuses()
    const uploadLimits = uploadRateLimiter.getAllStatuses()
    const newsletterLimits = newsletterRateLimiter.getAllStatuses()
    const donationLimits = donationRateLimiter.getAllStatuses()
    const healthLimits = healthRateLimiter.getAllStatuses()

    // Combine all limits
    const allLimits = new Map([
      ...Array.from(authLimits.entries()).map(([key, value]) => [`auth:${key}`, { ...value, endpoint: 'Authentication' }]),
      ...Array.from(apiLimits.entries()).map(([key, value]) => [`api:${key}`, { ...value, endpoint: 'API' }]),
      ...Array.from(widgetLimits.entries()).map(([key, value]) => [`widget:${key}`, { ...value, endpoint: 'Widget' }]),
      ...Array.from(emailLimits.entries()).map(([key, value]) => [`email:${key}`, { ...value, endpoint: 'Email' }]),
      ...Array.from(uploadLimits.entries()).map(([key, value]) => [`upload:${key}`, { ...value, endpoint: 'Upload' }]),
      ...Array.from(newsletterLimits.entries()).map(([key, value]) => [`newsletter:${key}`, { ...value, endpoint: 'Newsletter' }]),
      ...Array.from(donationLimits.entries()).map(([key, value]) => [`donation:${key}`, { ...value, endpoint: 'Donation' }]),
      ...Array.from(healthLimits.entries()).map(([key, value]) => [`health:${key}`, { ...value, endpoint: 'Health' }])
    ])

    // Calculate statistics
    const totalActiveLimits = allLimits.size
    const blockedUsers = Array.from(allLimits.values()).filter(limit => limit.blocked).length
    const totalRequests = Array.from(allLimits.values()).reduce((sum, limit) => sum + limit.totalHits, 0)
    const averageRequestsPerMinute = totalRequests / 15 // Assuming 15-minute windows

    // Get top endpoints by request volume
    const endpointStats = new Map<string, number>()
    for (const [key, limit] of allLimits.entries()) {
      const endpoint = limit.endpoint || 'Unknown'
      endpointStats.set(endpoint, (endpointStats.get(endpoint) || 0) + limit.totalHits)
    }

    const topEndpoints = Array.from(endpointStats.entries())
      .map(([endpoint, requests]) => ({ endpoint, requests }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 10)

    // Get recent blocks (last 24 hours)
    const recentBlocks = Array.from(allLimits.entries())
      .filter(([_, limit]) => limit.blocked)
      .map(([key, limit]) => ({
        key,
        endpoint: limit.endpoint || 'Unknown',
        blockedAt: new Date().toISOString(),
        reason: 'Rate limit exceeded'
      }))
      .slice(0, 10)

    const stats = {
      totalActiveLimits,
      blockedUsers,
      totalRequests,
      averageRequestsPerMinute: Math.round(averageRequestsPerMinute * 10) / 10,
      topEndpoints,
      recentBlocks
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error getting rate limit stats:', error)
    return NextResponse.json(
      { error: 'Failed to get rate limit statistics' },
      { status: 500 }
    )
  }
}

export const GET = withAdminAccess(getRateLimitStats)
