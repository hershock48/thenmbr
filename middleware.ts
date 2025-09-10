import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from './lib/security'

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  '/api/auth': { maxRequests: 10, windowMs: 15 * 60 * 1000 }, // 10 requests per 15 minutes
  '/api/subscribers': { maxRequests: 50, windowMs: 15 * 60 * 1000 }, // 50 requests per 15 minutes
  '/api/email': { maxRequests: 20, windowMs: 15 * 60 * 1000 }, // 20 requests per 15 minutes
  '/api/donate': { maxRequests: 10, windowMs: 15 * 60 * 1000 }, // 10 requests per 15 minutes
  '/api/stories': { maxRequests: 100, windowMs: 15 * 60 * 1000 }, // 100 requests per 15 minutes
  '/api/newsletters': { maxRequests: 30, windowMs: 15 * 60 * 1000 }, // 30 requests per 15 minutes
  '/api/widget': { maxRequests: 200, windowMs: 15 * 60 * 1000 }, // 200 requests per 15 minutes
  '/api/health': { maxRequests: 1000, windowMs: 15 * 60 * 1000 }, // 1000 requests per 15 minutes
}

// Blocked IPs (for security)
const BLOCKED_IPS = new Set([
  // Add blocked IPs here
  // '192.168.1.100',
  // '10.0.0.50'
])

// Suspicious patterns to block
const SUSPICIOUS_PATTERNS = [
  /\.\./, // Path traversal
  /<script/i, // XSS attempts
  /union\s+select/i, // SQL injection
  /javascript:/i, // JavaScript protocol
  /on\w+\s*=/i, // Event handlers
  /eval\s*\(/i, // Eval function
  /expression\s*\(/i, // CSS expression
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown'
  
  // Block specific IPs
  if (BLOCKED_IPS.has(ip)) {
    return new NextResponse('Access Denied', { status: 403 })
  }
  
  // Check for suspicious patterns in URL
  const url = request.url
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(url)) {
      console.warn(`Suspicious request blocked from ${ip}: ${url}`)
      return new NextResponse('Bad Request', { status: 400 })
    }
  }
  
  // Check for suspicious patterns in headers
  const userAgent = request.headers.get('user-agent') || ''
  if (userAgent.includes('bot') && !userAgent.includes('googlebot')) {
    // Block suspicious bots
    return new NextResponse('Access Denied', { status: 403 })
  }
  
  // Apply rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const config = RATE_LIMIT_CONFIG[pathname.split('/').slice(0, 3).join('/')] || 
                   RATE_LIMIT_CONFIG['/api/health']
    
    const rateLimit = checkRateLimit(ip, config.maxRequests, config.windowMs)
    
    if (!rateLimit.allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString()
          }
        }
      )
    }
  }
  
  // Add security headers
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Content-Security-Policy', [
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
  ].join('; '))
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  response.headers.set('X-Download-Options', 'noopen')
  response.headers.set('X-DNS-Prefetch-Control', 'off')
  
  // Add HSTS header for HTTPS
  if (request.headers.get('x-forwarded-proto') === 'https') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }
  
  // Add CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin')
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
    
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-ID, X-CSRF-Token')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Max-Age', '86400')
  }
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers })
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
