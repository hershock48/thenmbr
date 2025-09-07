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
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
      // Return mock data for demo purposes
      const mockStories = [
        {
          id: 'story-1',
          org_id: org,
          nmbr_code: 'STORY001',
          title: 'Help Local Families',
          description: 'Support families in need with essential supplies and resources during difficult times.',
          photo_url: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=Family+Support',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'story-2',
          org_id: org,
          nmbr_code: 'STORY002',
          title: 'Education Initiative',
          description: 'Provide educational materials and programs to underserved communities.',
          photo_url: 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Education',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'story-3',
          org_id: org,
          nmbr_code: 'STORY003',
          title: 'Environmental Cleanup',
          description: 'Join our efforts to clean up local parks and waterways.',
          photo_url: 'https://via.placeholder.com/400x300/059669/FFFFFF?text=Environment',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]

      // Filter by NMBR code if provided
      const filteredStories = nmbr 
        ? mockStories.filter(story => story.nmbr_code.toLowerCase() === nmbr.toLowerCase())
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
