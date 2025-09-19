import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // Return mock data for demo purposes
      const mockOrg = {
        id: id,
        name: 'Demo Nonprofit',
        logo_url: 'https://via.placeholder.com/200x100/3B82F6/FFFFFF?text=Demo+Org',
        brand_color: '#3B82F6',
        secondary_color: '#1e40af',
        accent_color: '#60a5fa',
        font_family: 'Inter',
        show_powered_by: true,
        website: 'https://example.org',
        stripe_account_id: 'acct_demo123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      return NextResponse.json(mockOrg)
    }

    const { data: org, error } = await supabase
      .from('nonprofits')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    return NextResponse.json(org)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
