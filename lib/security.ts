import { NextRequest, NextResponse } from 'next/server'

// Edge-compatible random bytes generation
function randomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length))
}

// Security headers configuration
export const securityHeaders = {
  // Prevent XSS attacks
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.stripe.com https://*.supabase.co wss://*.supabase.co",
    "frame-src 'self' https://js.stripe.com https://checkout.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; '),
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()'
  ].join(', '),
  
  // HSTS (HTTP Strict Transport Security)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Cross-Origin policies
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  
  // Additional security headers
  'X-Permitted-Cross-Domain-Policies': 'none',
  'X-Download-Options': 'noopen',
  'X-DNS-Prefetch-Control': 'off'
}

// CSRF token management
const csrfTokens = new Map<string, { token: string; expires: number }>()

export function generateCSRFToken(): string {
  const bytes = randomBytes(32)
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
}

export function createCSRFToken(sessionId: string): string {
  const token = generateCSRFToken()
  const expires = Date.now() + (60 * 60 * 1000) // 1 hour
  
  csrfTokens.set(sessionId, { token, expires })
  
  // Clean up expired tokens
  cleanupExpiredTokens()
  
  return token
}

export function validateCSRFToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId)
  
  if (!stored) {
    return false
  }
  
  if (Date.now() > stored.expires) {
    csrfTokens.delete(sessionId)
    return false
  }
  
  return stored.token === token
}

function cleanupExpiredTokens(): void {
  const now = Date.now()
  for (const [sessionId, { expires }] of csrfTokens.entries()) {
    if (now > expires) {
      csrfTokens.delete(sessionId)
    }
  }
}

// Rate limiting storage
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const key = identifier
  const stored = rateLimitStore.get(key)
  
  if (!stored || now > stored.resetTime) {
    // Reset or create new entry
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs
    })
    
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs
    }
  }
  
  if (stored.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: stored.resetTime
    }
  }
  
  // Increment count
  stored.count++
  rateLimitStore.set(key, stored)
  
  return {
    allowed: true,
    remaining: maxRequests - stored.count,
    resetTime: stored.resetTime
  }
}

// Security middleware
export function withSecurityHeaders(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const response = await handler(req)
    
    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    // Add CSRF token to response if needed
    if (req.method === 'GET' && req.nextUrl.pathname.startsWith('/api/')) {
      const sessionId = req.headers.get('x-session-id') || 'anonymous'
      const csrfToken = createCSRFToken(sessionId)
      response.headers.set('X-CSRF-Token', csrfToken)
    }
    
    return response
  }
}

// CSRF protection middleware
export function withCSRFProtection(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // Skip CSRF for safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return handler(req)
    }
    
    const sessionId = req.headers.get('x-session-id') || 'anonymous'
    const csrfToken = req.headers.get('x-csrf-token')
    
    if (!csrfToken || !validateCSRFToken(sessionId, csrfToken)) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      )
    }
    
    return handler(req)
  }
}

// Rate limiting middleware
export function withRateLimit(
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000
) {
  return (handler: (req: NextRequest) => Promise<NextResponse>) => {
    return async (req: NextRequest): Promise<NextResponse> => {
      const identifier = req.headers.get('x-forwarded-for') || 
                       req.headers.get('x-real-ip') || 
                       'unknown'
      
      const rateLimit = checkRateLimit(identifier, maxRequests, windowMs)
      
      if (!rateLimit.allowed) {
        return NextResponse.json(
          { error: 'Rate limit exceeded' },
          { 
            status: 429,
            headers: {
              'X-RateLimit-Limit': maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': rateLimit.resetTime.toString(),
              'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString()
            }
          }
        )
      }
      
      const response = await handler(req)
      
      // Add rate limit headers
      response.headers.set('X-RateLimit-Limit', maxRequests.toString())
      response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString())
      response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString())
      
      return response
    }
  }
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
}

// SQL injection prevention
export function sanitizeSQL(input: string): string {
  return input
    .replace(/['";\\]/g, '') // Remove SQL special characters
    .replace(/\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b/gi, '') // Remove SQL keywords
    .trim()
}

// XSS prevention
export function escapeHTML(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Validate file uploads
export function validateFileUpload(
  file: File,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxSize: number = 5 * 1024 * 1024 // 5MB
): { valid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type' }
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File too large' }
  }
  
  return { valid: true }
}

// Generate secure random strings
export function generateSecureRandom(length: number = 32): string {
  const bytes = randomBytes(length)
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
export function validatePasswordStrength(password: string): {
  valid: boolean
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0
  
  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters long')
  } else {
    score += 1
  }
  
  if (!/[a-z]/.test(password)) {
    feedback.push('Password must contain at least one lowercase letter')
  } else {
    score += 1
  }
  
  if (!/[A-Z]/.test(password)) {
    feedback.push('Password must contain at least one uppercase letter')
  } else {
    score += 1
  }
  
  if (!/\d/.test(password)) {
    feedback.push('Password must contain at least one number')
  } else {
    score += 1
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    feedback.push('Password must contain at least one special character')
  } else {
    score += 1
  }
  
  return {
    valid: score >= 4,
    score,
    feedback
  }
}
