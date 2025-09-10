import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { generateNewsletterHTML } from '@/lib/newsletter-templates'

export async function POST(request: NextRequest) {
  try {
    const { 
      name, 
      type, 
      storyId, 
      organizationId, 
      templateId,
      customContent,
      scheduledAt 
    } = await request.json()

    if (!name || !type || !storyId || !organizationId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createClient()

    // Get story details
    const { data: story, error: storyError } = await supabase
      .from('stories')
      .select(`
        *,
        organizations (
          name,
          website,
          primary_color,
          logo_url
        )
      `)
      .eq('id', storyId)
      .single()

    if (storyError || !story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    // Get subscribers for this specific story
    const { data: subscribers, error: subscribersError } = await supabase
      .from('nmbr_subscriptions')
      .select(`
        subscribers (
          id,
          email,
          first_name,
          last_name,
          status
        )
      `)
      .eq('nmbr_id', storyId)
      .eq('subscribers.status', 'active')

    if (subscribersError) {
      throw subscribersError
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ error: 'No active subscribers found for this story' }, { status: 404 })
    }

    // Create newsletter campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('email_campaigns')
      .insert({
        organization_id: organizationId,
        nmbr_id: storyId,
        subject: `${type === 'story_update' ? 'Story Update' : type === 'milestone' ? 'Milestone Reached' : type === 'completion' ? 'Story Complete' : 'Welcome'} - ${story.title}`,
        content: customContent || 'Newsletter content',
        campaign_type: type,
        status: scheduledAt ? 'scheduled' : 'sending',
        scheduled_at: scheduledAt,
        total_recipients: subscribers.length
      })
      .select()
      .single()

    if (campaignError) {
      throw campaignError
    }

    // Generate newsletter HTML using template
    const newsletterData = {
      STORY_TITLE: story.title,
      STORY_CODE: story.nmbr_code,
      PROGRESS_PERCENTAGE: Math.round((story.current_amount / story.goal_amount) * 100),
      RAISED_AMOUNT: `$${story.current_amount.toLocaleString()}`,
      GOAL_AMOUNT: `$${story.goal_amount.toLocaleString()}`,
      REMAINING_AMOUNT: `$${(story.goal_amount - story.current_amount).toLocaleString()}`,
      ORGANIZATION_NAME: story.organizations.name,
      ORGANIZATION_WEBSITE: story.organizations.website || process.env.NEXT_PUBLIC_APP_URL,
      STORY_IMAGE: story.photo_url,
      DONATION_URL: `${process.env.NEXT_PUBLIC_APP_URL}/widget/${story.organizations.slug}?nmbr=${story.nmbr_code}`,
      UNSUBSCRIBE_URL: `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?subscriber_id={SUBSCRIBER_ID}&nmbr_id=${storyId}`,
      CUSTOM_MESSAGE: customContent || 'Thank you for your support!',
      SUBSCRIBER_NAME: '{SUBSCRIBER_NAME}'
    }

    // Generate HTML content
    const htmlContent = generateNewsletterHTML(templateId, newsletterData)

    // Update campaign with generated content
    await supabase
      .from('email_campaigns')
      .update({
        content: htmlContent.html,
        subject: htmlContent.subject
      })
      .eq('id', campaign.id)

    // If not scheduled, send emails immediately
    if (!scheduledAt) {
      await sendNewsletterToSubscribers(subscribers, htmlContent, campaign.id, story, supabase)
    }

    return NextResponse.json({ 
      success: true, 
      campaignId: campaign.id,
      recipients: subscribers.length,
      message: scheduledAt ? 'Newsletter scheduled successfully' : 'Newsletter sent successfully'
    })

  } catch (error) {
    console.error('Newsletter creation error:', error)
    return NextResponse.json({ 
      error: 'Failed to create newsletter' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('org')
    const storyId = searchParams.get('story')

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 })
    }

    const supabase = createClient()

    let query = supabase
      .from('email_campaigns')
      .select(`
        *,
        stories (
          title,
          nmbr_code
        )
      `)
      .eq('organization_id', organizationId)

    if (storyId) {
      query = query.eq('nmbr_id', storyId)
    }

    const { data: campaigns, error } = await query.order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ campaigns: campaigns || [] })

  } catch (error) {
    console.error('Get newsletters error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch newsletters' 
    }, { status: 500 })
  }
}

async function sendNewsletterToSubscribers(
  subscribers: any[], 
  newsletterContent: any, 
  campaignId: string, 
  story: any,
  supabase: any
) {
  const sentEmails = []
  
  for (const subscription of subscribers) {
    const subscriber = subscription.subscribers
    
    if (!subscriber || subscriber.status !== 'active') continue

    try {
      // Replace placeholders in newsletter content
      const personalizedSubject = newsletterContent.subject.replace('{SUBSCRIBER_NAME}', subscriber.first_name || 'Friend')
      const personalizedHtml = newsletterContent.html.replace(/{SUBSCRIBER_NAME}/g, subscriber.first_name || 'Friend')
      const personalizedUnsubscribeUrl = newsletterContent.html.match(/unsubscribeUrl.*?href="([^"]*)"/)?.[1]?.replace('{SUBSCRIBER_ID}', subscriber.id) || ''

      // Import email service
      const { emailService } = await import('@/lib/email-service')
      
      // Send actual email
      const emailResult = await emailService.sendNewsletter({
        to: subscriber.email,
        subject: personalizedSubject,
        html: personalizedHtml,
        subscriberId: subscriber.id,
        campaignId: campaignId,
        storyId: story.id,
        unsubscribeUrl: personalizedUnsubscribeUrl
      })

      if (!emailResult.success) {
        throw new Error(emailResult.error || 'Failed to send email')
      }
      
      // Record email event
      await supabase
        .from('email_events')
        .insert({
          campaign_id: campaignId,
          subscriber_id: subscriber.id,
          event_type: 'sent',
          event_data: {
            subject: personalizedSubject,
            sent_at: new Date().toISOString(),
            story_id: story.id,
            story_title: story.title
          }
        })

      sentEmails.push({
        subscriber_id: subscriber.id,
        email: subscriber.email,
        status: 'sent',
        story_id: story.id
      })

    } catch (error) {
      console.error(`Failed to send newsletter to ${subscriber.email}:`, error)
      
      // Record failed email event
      await supabase
        .from('email_events')
        .insert({
          campaign_id: campaignId,
          subscriber_id: subscriber.id,
          event_type: 'bounced',
          event_data: {
            error: error.message,
            failed_at: new Date().toISOString(),
            story_id: story.id
          }
        })
    }
  }

  // Update campaign status
  await supabase
    .from('email_campaigns')
    .update({
      status: 'sent',
      sent_at: new Date().toISOString(),
      total_sent: sentEmails.length
    })
    .eq('id', campaignId)

  return sentEmails
}
