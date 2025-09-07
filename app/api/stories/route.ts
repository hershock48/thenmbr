import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const org = searchParams.get('org')
    const nmbr = searchParams.get('nmbr')

    if (!org) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
    }

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // Return mock data for demo purposes
      const mockStories = [
        {
          id: 'story-1',
          org_id: org,
          nmbr_code: '1',
          title: 'Clean Water for Maria',
          description: 'Maria lives in a remote village where clean water is scarce. Your support helps provide her family with access to safe, clean drinking water through our community well project.',
          photo_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
          goal_amount: 5000,
          current_amount: 3200,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'story-2',
          org_id: org,
          nmbr_code: '2',
          title: 'Education for Ahmed',
          description: 'Ahmed dreams of becoming a doctor to help his community. Your sponsorship provides him with school supplies, books, and educational support to make his dream a reality.',
          photo_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
          goal_amount: 3000,
          current_amount: 1800,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'story-3',
          org_id: org,
          nmbr_code: '3',
          title: 'Medical Care for Sarah',
          description: 'Sarah needs ongoing medical treatment for a chronic condition. Your donation helps cover her medication costs and regular check-ups with local healthcare providers.',
          photo_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
          goal_amount: 4000,
          current_amount: 2500,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]

      // Filter by NMBR code if provided
      const filteredStories = nmbr 
        ? mockStories.filter(story => story.nmbr_code === nmbr)
        : mockStories

      return NextResponse.json({ stories: filteredStories })
    }

    let query = supabase
      .from('stories')
      .select('*')
      .eq('org_id', org)

    if (nmbr) {
      query = query.eq('nmbr_code', nmbr)
    }

    const { data: stories, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 })
    }

    return NextResponse.json({ stories: stories || [] })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
