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
      // Update existing subscriber with new NMBR
      const { data: updatedSubscriber, error: updateError } = await supabase
        .from('subscribers')
        .update({
          first_name: firstName,
          last_name: lastName,
          updated_at: new Date().toISOString(),
          source: source
        })
        .eq('id', existingSubscriber.id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      // Add story subscription if not already subscribed
      const { error: subscriptionError } = await supabase
        .from('nmbr_subscriptions')
        .upsert({
          subscriber_id: existingSubscriber.id,
          story_id: storyId,
          subscribed_at: new Date().toISOString()
        })

      if (subscriptionError) {
        throw subscriptionError
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
        first_name: firstName,
        last_name: lastName,
        org_id: orgId,
        source: source,
        subscribed_at: new Date().toISOString()
      })
      .select()
      .single()

    if (subscriberError) {
      throw subscriberError
    }

    // Create story subscription
    const { error: subscriptionError } = await supabase
      .from('nmbr_subscriptions')
      .insert({
        subscriber_id: newSubscriber.id,
        story_id: storyId,
        subscribed_at: new Date().toISOString()
      })

    if (subscriptionError) {
      throw subscriptionError
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
        nmbr_subscriptions (
          story_id,
          subscribed_at
        )
      `)
      .eq('org_id', orgId)

    if (storyId) {
      query = query.eq('nmbr_subscriptions.story_id', storyId)
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

    // Remove specific story subscription
    const { error: subscriptionError } = await supabase
      .from('nmbr_subscriptions')
      .delete()
      .eq('subscriber_id', subscriberId)
      .eq('story_id', storyId)

    if (subscriptionError) {
      throw subscriptionError
    }

    // Check if subscriber has any remaining subscriptions
    const { data: remainingSubscriptions } = await supabase
      .from('nmbr_subscriptions')
      .select('id')
      .eq('subscriber_id', subscriberId)

    // If no remaining subscriptions, mark subscriber as unsubscribed
    if (!remainingSubscriptions || remainingSubscriptions.length === 0) {
      await supabase
        .from('subscribers')
        .update({ 
          unsubscribed_at: new Date().toISOString(),
          status: 'unsubscribed'
        })
        .eq('id', subscriberId)
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