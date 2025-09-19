import { NextRequest, NextResponse } from 'next/server'
import { createCSRFToken } from '@/lib/security'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get session ID from headers or generate one
    const sessionId = request.headers.get('x-session-id') || 
                     request.headers.get('x-forwarded-for') || 
                     'anonymous'
    
    // Generate CSRF token
    const token = createCSRFToken(sessionId)
    
    // Return token
    return NextResponse.json({ token }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('CSRF token generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    )
  }
}
