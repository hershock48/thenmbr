import { NextRequest, NextResponse } from 'next/server'

// Rate limiting storage (in production, use Redis or database)
interface RateLimitEntry {
  count: number
  resetTime: number
  blocked: boolean
  blockUntil?: number
}

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  blockDurationMs?: number
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
  keyGenerator?: (req: NextRequest) => string
  onLimitReached?: (req: NextRequest, key: string) => void
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
  totalHits: number
  blocked: boolean
}

// In-memory storage (replace with Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime && (!entry.blocked || (entry.blockUntil && now > entry.blockUntil))) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

export class RateLimiter {
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = {
      blockDurationMs: 15 * 60 * 1000, // 15 minutes default block
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      keyGenerator: (req) => this.getDefaultKey(req),
      ...config
    }
  }

  private getDefaultKey(req: NextRequest): string {
    // Get client IP
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               req.headers.get('cf-connecting-ip') ||
               'unknown'
    
    // Get user ID if authenticated
    const userId = req.headers.get('x-user-id')
    
    // Combine IP and user ID for more granular limiting
    return userId ? `${ip}:${userId}` : ip
  }

  private getKey(req: NextRequest): string {
    return this.config.keyGenerator!(req)
  }

  async checkLimit(req: NextRequest): Promise<RateLimitResult> {
    const key = this.getKey(req)
    const now = Date.now()
    const windowStart = now - this.config.windowMs

    // Get or create entry
    let entry = rateLimitStore.get(key)
    
    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired one
      entry = {
        count: 0,
        resetTime: now + this.config.windowMs,
        blocked: false
      }
    }

    // Check if currently blocked
    if (entry.blocked && entry.blockUntil && now < entry.blockUntil) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter: Math.ceil((entry.blockUntil - now) / 1000),
        totalHits: entry.count,
        blocked: true
      }
    }

    // Reset block if expired
    if (entry.blocked && (!entry.blockUntil || now >= entry.blockUntil)) {
      entry.blocked = false
      entry.blockUntil = undefined
    }

    // Check if limit exceeded
    if (entry.count >= this.config.maxRequests) {
      // Block the user
      entry.blocked = true
      entry.blockUntil = now + (this.config.blockDurationMs || 15 * 60 * 1000)
      
      // Call limit reached callback
      if (this.config.onLimitReached) {
        this.config.onLimitReached(req, key)
      }

      rateLimitStore.set(key, entry)

      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter: Math.ceil((entry.blockUntil - now) / 1000),
        totalHits: entry.count,
        blocked: true
      }
    }

    // Increment counter
    entry.count++
    rateLimitStore.set(key, entry)

    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetTime: entry.resetTime,
      totalHits: entry.count,
      blocked: false
    }
  }

  async recordRequest(req: NextRequest, success: boolean = true): Promise<void> {
    const key = this.getKey(req)
    const entry = rateLimitStore.get(key)
    
    if (entry) {
      // Update counters based on success/failure
      if (success && this.config.skipSuccessfulRequests) {
        // Don't count successful requests
        return
      }
      
      if (!success && this.config.skipFailedRequests) {
        // Don't count failed requests
        return
      }

      // The checkLimit method already increments the counter
      // This method is for additional tracking if needed
    }
  }

  // Get current rate limit status for a key
  getStatus(key: string): RateLimitResult | null {
    const entry = rateLimitStore.get(key)
    if (!entry) return null

    const now = Date.now()
    
    if (entry.blocked && entry.blockUntil && now < entry.blockUntil) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter: Math.ceil((entry.blockUntil - now) / 1000),
        totalHits: entry.count,
        blocked: true
      }
    }

    return {
      allowed: entry.count < this.config.maxRequests,
      remaining: Math.max(0, this.config.maxRequests - entry.count),
      resetTime: entry.resetTime,
      totalHits: entry.count,
      blocked: false
    }
  }

  // Reset rate limit for a key
  reset(key: string): void {
    rateLimitStore.delete(key)
  }

  // Get all active rate limits (for monitoring)
  getAllStatuses(): Map<string, RateLimitResult> {
    const statuses = new Map<string, RateLimitResult>()
    const now = Date.now()

    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetTime && (!entry.blocked || (entry.blockUntil && now > entry.blockUntil))) {
        continue // Skip expired entries
      }

      statuses.set(key, {
        allowed: !entry.blocked && entry.count < this.config.maxRequests,
        remaining: Math.max(0, this.config.maxRequests - entry.count),
        resetTime: entry.resetTime,
        retryAfter: entry.blocked && entry.blockUntil ? Math.ceil((entry.blockUntil - now) / 1000) : undefined,
        totalHits: entry.count,
        blocked: entry.blocked
      })
    }

    return statuses
  }
}

// Predefined rate limit configurations
export const RATE_LIMIT_CONFIGS = {
  // Authentication endpoints - very strict
  AUTH: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 30 * 60 * 1000, // 30 minutes
    keyGenerator: (req: NextRequest) => {
      const ip = req.headers.get('x-forwarded-for') || 'unknown'
      return `auth:${ip}`
    }
  },

  // API endpoints - moderate
  API: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 15 * 60 * 1000, // 15 minutes
  },

  // Widget endpoints - more lenient for public use
  WIDGET: {
    maxRequests: 200,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 5 * 60 * 1000, // 5 minutes
  },

  // Email sending - strict to prevent spam
  EMAIL: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
    blockDurationMs: 60 * 60 * 1000, // 1 hour
  },

  // File uploads - moderate
  UPLOAD: {
    maxRequests: 20,
    windowMs: 60 * 60 * 1000, // 1 hour
    blockDurationMs: 30 * 60 * 1000, // 30 minutes
  },

  // Newsletter sending - very strict
  NEWSLETTER: {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
    blockDurationMs: 2 * 60 * 60 * 1000, // 2 hours
  },

  // Donation processing - strict for security
  DONATION: {
    maxRequests: 10,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 30 * 60 * 1000, // 30 minutes
  },

  // Health checks - very lenient
  HEALTH: {
    maxRequests: 1000,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 5 * 60 * 1000, // 5 minutes
  }
}

// Create rate limiter instances
export const authRateLimiter = new RateLimiter(RATE_LIMIT_CONFIGS.AUTH)
export const apiRateLimiter = new RateLimiter(RATE_LIMIT_CONFIGS.API)
export const widgetRateLimiter = new RateLimiter(RATE_LIMIT_CONFIGS.WIDGET)
export const emailRateLimiter = new RateLimiter(RATE_LIMIT_CONFIGS.EMAIL)
export const uploadRateLimiter = new RateLimiter(RATE_LIMIT_CONFIGS.UPLOAD)
export const newsletterRateLimiter = new RateLimiter(RATE_LIMIT_CONFIGS.NEWSLETTER)
export const donationRateLimiter = new RateLimiter(RATE_LIMIT_CONFIGS.DONATION)
export const healthRateLimiter = new RateLimiter(RATE_LIMIT_CONFIGS.HEALTH)

// Rate limiting middleware factory
export function createRateLimitMiddleware(config: RateLimitConfig) {
  const rateLimiter = new RateLimiter(config)

  return (handler: (req: NextRequest) => Promise<NextResponse>) => {
    return async (req: NextRequest): Promise<NextResponse> => {
      const result = await rateLimiter.checkLimit(req)

      if (!result.allowed) {
        const response = NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message: 'Too many requests. Please try again later.',
            retryAfter: result.retryAfter,
            resetTime: new Date(result.resetTime).toISOString()
          },
          { status: 429 }
        )

        // Add rate limit headers
        response.headers.set('X-RateLimit-Limit', config.maxRequests.toString())
        response.headers.set('X-RateLimit-Remaining', '0')
        response.headers.set('X-RateLimit-Reset', result.resetTime.toString())
        
        if (result.retryAfter) {
          response.headers.set('Retry-After', result.retryAfter.toString())
        }

        return response
      }

      // Call the original handler
      const response = await handler(req)

      // Record the request
      await rateLimiter.recordRequest(req, response.status < 400)

      // Add rate limit headers to successful responses
      response.headers.set('X-RateLimit-Limit', config.maxRequests.toString())
      response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
      response.headers.set('X-RateLimit-Reset', result.resetTime.toString())

      return response
    }
  }
}

// Utility function to get rate limit status
export async function getRateLimitStatus(req: NextRequest, config: RateLimitConfig): Promise<RateLimitResult | null> {
  const rateLimiter = new RateLimiter(config)
  const key = config.keyGenerator ? config.keyGenerator(req) : rateLimiter['getDefaultKey'](req)
  return rateLimiter.getStatus(key)
}

// Utility function to reset rate limit
export async function resetRateLimit(req: NextRequest, config: RateLimitConfig): Promise<void> {
  const rateLimiter = new RateLimiter(config)
  const key = config.keyGenerator ? config.keyGenerator(req) : rateLimiter['getDefaultKey'](req)
  rateLimiter.reset(key)
}

export default RateLimiter
