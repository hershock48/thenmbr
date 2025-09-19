import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { org_id } = await request.json()

    if (!id || !org_id) {
      return NextResponse.json({ error: 'Story ID and organization ID are required' }, { status: 400 })
    }

    // For now, we'll just return success
    // In a real implementation, you'd track views in a separate table
    // or use a service like Google Analytics, Mixpanel, etc.
    
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error tracking story view:', error)
    return NextResponse.json({ 
      error: 'Failed to track story view' 
    }, { status: 500 })
  }
}
