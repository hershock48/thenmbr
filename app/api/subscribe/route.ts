import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, org_id, story_id } = await request.json()

    if (!email || !org_id) {
      return NextResponse.json({ error: 'Email and organization ID are required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
      // Return mock success for demo purposes
      const mockSubscriber = {
        id: 'sub-' + Date.now(),
        email,
        org_id,
        story_id: story_id || null,
        created_at: new Date().toISOString()
      }
      return NextResponse.json({ subscriber: mockSubscriber })
    }

    const { data, error } = await supabase
      .from('subscribers')
      .insert({
        email,
        org_id,
        story_id: story_id || null
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
    }

    return NextResponse.json({ subscriber: data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
