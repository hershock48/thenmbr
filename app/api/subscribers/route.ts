import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { withAPIMiddleware, withRequestLogging } from '@/lib/api-middleware'
import { logger, handleDatabaseError, ValidationError, validateEmail, validateRequired } from '@/lib/error-handler'
import { createRateLimitMiddleware, RATE_LIMIT_CONFIGS } from '@/lib/rate-limiter'
import { db } from '@/lib/database-optimizer'

// Apply rate limiting to POST requests (subscription creation)
const rateLimitedPOST = createRateLimitMiddleware({
  ...RATE_LIMIT_CONFIGS.API,
  maxRequests: 50, // More lenient for subscription creation
  windowMs: 15 * 60 * 1000, // 15 minutes
  onLimitReached: (req, key) => {
    logger.warn('Rate limit exceeded for subscription creation', { key, ip: req.headers.get('x-forwarded-for') })
  }
})

export const POST = rateLimitedPOST(withRequestLogging(async (request: NextRequest) => {
  try {
    const { email, firstName, lastName, storyId, orgId, source = 'widget' } = await request.json()

    // Validate required fields
    validateRequired(email, 'Email')
    validateRequired(storyId, 'Story ID')
    validateRequired(orgId, 'Organization ID')
    
    // Validate email format
    if (!validateEmail(email)) {
      throw new ValidationError('Invalid email format')
    }

    logger.info('Creating new subscriber', { email, storyId, orgId, source })

    // Using the supabase client from lib/supabase.ts

    // Check if subscriber already exists (with caching)
    const { data: existingSubscriber, error: selectError } = await db.select('subscribers', {
      useCache: true,
      cacheTTL: 5 * 60 * 1000, // 5 minutes
      cacheTags: ['subscribers', `org:${orgId}`],
      selectFields: ['*']
    }, {
      email,
      org_id: orgId
    })

    if (selectError) {
      throw handleDatabaseError(selectError, { email, orgId })
    }

    if (existingSubscriber && existingSubscriber.length > 0) {
      const subscriber = existingSubscriber[0]
      
      // Update existing subscriber with new NMBR
      const { data: updatedSubscriber, error: updateError } = await db.update('subscribers', {
        first_name: firstName,
        last_name: lastName,
        updated_at: new Date().toISOString(),
        source: source
      }, {
        id: subscriber.id
      }, {
        useCache: false,
        cacheTags: ['subscribers', `org:${orgId}`, `subscriber:${subscriber.id}`],
        selectFields: ['*']
      })

      if (updateError) {
        throw handleDatabaseError(updateError, { subscriberId: subscriber.id })
      }

      // Add story subscription if not already subscribed
      const { error: subscriptionError } = await db.insert('nmbr_subscriptions', {
        subscriber_id: subscriber.id,
        story_id: storyId,
        subscribed_at: new Date().toISOString()
      }, {
        useCache: false,
        cacheTags: ['subscriptions', `subscriber:${subscriber.id}`, `story:${storyId}`]
      })

      if (subscriptionError) {
        throw handleDatabaseError(subscriptionError, { subscriberId: subscriber.id, storyId })
      }

      return NextResponse.json({ 
        success: true, 
        subscriber: updatedSubscriber && updatedSubscriber.length > 0 ? updatedSubscriber[0] : null,
        message: 'Subscription updated successfully' 
      })
    }

    // Create new subscriber
    const { data: newSubscriber, error: subscriberError } = await db.insert('subscribers', {
      email,
      first_name: firstName,
      last_name: lastName,
      org_id: orgId,
      source: source,
      subscribed_at: new Date().toISOString()
    }, {
      useCache: false,
      cacheTags: ['subscribers', `org:${orgId}`],
      selectFields: ['*']
    })

    if (subscriberError) {
      throw subscriberError
    }

    // Create story subscription
    const { error: subscriptionError } = await db.insert('nmbr_subscriptions', {
      subscriber_id: newSubscriber && newSubscriber.length > 0 ? newSubscriber[0].id : null,
      story_id: storyId,
      subscribed_at: new Date().toISOString()
    }, {
      useCache: false,
      cacheTags: ['subscriptions', `story:${storyId}`]
    })

    if (subscriptionError) {
      throw subscriptionError
    }

    return NextResponse.json({ 
      success: true, 
      subscriber: newSubscriber && newSubscriber.length > 0 ? newSubscriber[0] : null,
      message: 'Successfully subscribed to story updates' 
    })

  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json({ 
      error: 'Failed to subscribe to story updates' 
    }, { status: 500 })
  }
}))

// Apply rate limiting to GET requests (subscriber fetching)
const rateLimitedGET = createRateLimitMiddleware({
  ...RATE_LIMIT_CONFIGS.API,
  maxRequests: 100, // More lenient for read operations
  windowMs: 15 * 60 * 1000, // 15 minutes
})

export const GET = rateLimitedGET(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('org')
    const storyId = searchParams.get('story')

    if (!orgId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 })
    }

    // Build filters for optimized query
    const filters: Record<string, any> = {
      org_id: orgId
    }

    // Use optimized database query with caching
    const { data: subscribers, error } = await db.select('subscribers', {
      useCache: true,
      cacheTTL: 5 * 60 * 1000, // 5 minutes
      cacheTags: ['subscribers', `org:${orgId}`, storyId ? `story:${storyId}` : 'all'],
      selectFields: ['*']
    }, filters)

    if (error) {
      throw error
    }

    // If storyId is specified, filter subscriptions in memory
    // (This is a simplified approach - in production, you'd want a proper join)
    let filteredSubscribers = subscribers || []
    
    if (storyId && subscribers) {
      // This would ideally be done with a proper join query
      // For now, we'll return all subscribers and let the client filter
      // In a real implementation, you'd use a more sophisticated query
    }

    return NextResponse.json({ subscribers: filteredSubscribers })

  } catch (error) {
    console.error('Get subscribers error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch subscribers' 
    }, { status: 500 })
  }
})

// Apply rate limiting to DELETE requests (unsubscribe)
const rateLimitedDELETE = createRateLimitMiddleware({
  ...RATE_LIMIT_CONFIGS.API,
  maxRequests: 30, // Moderate limit for unsubscribe operations
  windowMs: 15 * 60 * 1000, // 15 minutes
})

export const DELETE = rateLimitedDELETE(async (request: NextRequest) => {
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
})