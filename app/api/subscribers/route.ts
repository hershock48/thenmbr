import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, storyId, orgId, source = 'widget' } = await request.json()

    if (!email || !storyId || !orgId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Using the supabase client from lib/supabase.ts

    // Check if subscriber already exists
    const { data: existingSubscriber } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', email)
      .eq('org_id', orgId)
      .single()

    if (existingSubscriber) {
      // Update existing subscriber with new story subscription
      const { data: updatedSubscriber, error: updateError } = await supabase
        .from('subscribers')
        .update({
          story_id: storyId,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSubscriber.id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      return NextResponse.json({ 
        success: true, 
        subscriber: updatedSubscriber,
        message: 'Subscription updated successfully' 
      })
    }

    // Create new subscriber
    const { data: newSubscriber, error: subscriberError } = await supabase
      .from('subscribers')
      .insert({
        email,
        org_id: orgId,
        story_id: storyId,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (subscriberError) {
      throw subscriberError
    }

    return NextResponse.json({ 
      success: true, 
      subscriber: newSubscriber,
      message: 'Successfully subscribed to story updates' 
    })

  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json({ 
      error: 'Failed to subscribe to story updates' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('org')
    const storyId = searchParams.get('story')

    if (!orgId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 })
    }

    // Using the supabase client from lib/supabase.ts

    let query = supabase
      .from('subscribers')
      .select(`
        *,
        stories (
          id,
          title,
          nmbr_code
        )
      `)
      .eq('org_id', orgId)

    if (storyId) {
      query = query.eq('story_id', storyId)
    }

    const { data: subscribers, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({ subscribers: subscribers || [] })

  } catch (error) {
    console.error('Get subscribers error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch subscribers' 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { subscriberId, storyId } = await request.json()

    if (!subscriberId || !storyId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Using the supabase client from lib/supabase.ts

    // Remove subscriber from story (set story_id to null)
    const { error: subscriptionError } = await supabase
      .from('subscribers')
      .update({ 
        story_id: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriberId)
      .eq('story_id', storyId)

    if (subscriptionError) {
      throw subscriptionError
    }

    return NextResponse.json({ 
      success: true,
      message: 'Successfully unsubscribed from story updates' 
    })

  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json({ 
      error: 'Failed to unsubscribe' 
    }, { status: 500 })
  }
}
