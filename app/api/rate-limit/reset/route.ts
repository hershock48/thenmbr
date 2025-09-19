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

async function resetRateLimit(req: NextRequest) {
  try {
    const { key } = await req.json()

    if (!key) {
      return NextResponse.json(
        { error: 'Rate limit key is required' },
        { status: 400 }
      )
    }

    // Determine which rate limiter to use based on key prefix
    const [category, ...keyParts] = key.split(':')
    const actualKey = keyParts.join(':')

    let resetSuccess = false

    switch (category) {
      case 'auth':
        authRateLimiter.reset(actualKey)
        resetSuccess = true
        break
      case 'api':
        apiRateLimiter.reset(actualKey)
        resetSuccess = true
        break
      case 'widget':
        widgetRateLimiter.reset(actualKey)
        resetSuccess = true
        break
      case 'email':
        emailRateLimiter.reset(actualKey)
        resetSuccess = true
        break
      case 'upload':
        uploadRateLimiter.reset(actualKey)
        resetSuccess = true
        break
      case 'newsletter':
        newsletterRateLimiter.reset(actualKey)
        resetSuccess = true
        break
      case 'donation':
        donationRateLimiter.reset(actualKey)
        resetSuccess = true
        break
      case 'health':
        healthRateLimiter.reset(actualKey)
        resetSuccess = true
        break
      default:
        return NextResponse.json(
          { error: 'Invalid rate limit category' },
          { status: 400 }
        )
    }

    if (resetSuccess) {
      return NextResponse.json({ 
        success: true, 
        message: `Rate limit reset for ${key}` 
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to reset rate limit' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error resetting rate limit:', error)
    return NextResponse.json(
      { error: 'Failed to reset rate limit' },
      { status: 500 }
    )
  }
}

export const POST = withAdminAccess(resetRateLimit)
