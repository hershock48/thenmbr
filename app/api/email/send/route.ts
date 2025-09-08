import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { 
  generateStoryUpdateEmail, 
  generateMilestoneEmail, 
  generateCompletionEmail, 
  generateWelcomeEmail,
  type StoryUpdateData,
  type MilestoneData,
  type CompletionData
} from '@/lib/email-templates'

export async function POST(request: NextRequest) {
  try {
    const { 
      type, 
      storyId, 
      organizationId, 
      customMessage,
      scheduledAt 
    } = await request.json()

    if (!type || !storyId || !organizationId) {
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

    // Get subscribers for this story
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
      return NextResponse.json({ error: 'No active subscribers found' }, { status: 404 })
    }

    // Create email campaign record
    const { data: campaign, error: campaignError } = await supabase
      .from('email_campaigns')
      .insert({
        organization_id: organizationId,
        nmbr_id: storyId,
        subject: `Story Update - ${story.title}`,
        content: customMessage || 'Story update',
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

    // Generate email content based on type
    let emailContent: any = null
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const baseData = {
      storyTitle: story.title,
      storyCode: story.nmbr_code,
      organizationName: story.organizations.name,
      organizationWebsite: story.organizations.website || baseUrl,
      storyImageUrl: story.photo_url,
      donationUrl: `${baseUrl}/widget/${story.organizations.slug}?nmbr=${story.nmbr_code}`,
      unsubscribeUrl: `${baseUrl}/unsubscribe?subscriber_id={SUBSCRIBER_ID}&nmbr_id=${storyId}`
    }

    switch (type) {
      case 'story_update':
        const updateData: StoryUpdateData = {
          ...baseData,
          progress: (story.current_amount / story.goal_amount) * 100,
          raised: story.current_amount,
          goal: story.goal_amount,
          recentUpdate: customMessage || `We've made great progress on ${story.title}!`,
          subscriberName: '{SUBSCRIBER_NAME}'
        }
        emailContent = generateStoryUpdateEmail(updateData)
        break

      case 'milestone':
        const milestoneData: MilestoneData = {
          ...baseData,
          milestone: customMessage || 'Major milestone reached!',
          achievement: 'Your support made this possible!',
          subscriberName: '{SUBSCRIBER_NAME}'
        }
        emailContent = generateMilestoneEmail(milestoneData)
        break

      case 'completion':
        const completionData: CompletionData = {
          ...baseData,
          finalAmount: story.current_amount,
          impact: customMessage || 'Your support has made a lasting difference!',
          newStoryUrl: `${baseUrl}/widget/${story.organizations.slug}`,
          subscriberName: '{SUBSCRIBER_NAME}'
        }
        emailContent = generateCompletionEmail(completionData)
        break

      case 'welcome':
        const welcomeData: StoryUpdateData = {
          ...baseData,
          progress: (story.current_amount / story.goal_amount) * 100,
          raised: story.current_amount,
          goal: story.goal_amount,
          recentUpdate: `Welcome to following ${story.title}!`,
          subscriberName: '{SUBSCRIBER_NAME}'
        }
        emailContent = generateWelcomeEmail(welcomeData)
        break

      default:
        return NextResponse.json({ error: 'Invalid email type' }, { status: 400 })
    }

    // Update campaign with generated content
    await supabase
      .from('email_campaigns')
      .update({
        subject: emailContent.subject,
        content: emailContent.html
      })
      .eq('id', campaign.id)

    // If not scheduled, send emails immediately
    if (!scheduledAt) {
      await sendEmailsToSubscribers(subscribers, emailContent, campaign.id, supabase)
    }

    return NextResponse.json({ 
      success: true, 
      campaignId: campaign.id,
      recipients: subscribers.length,
      message: scheduledAt ? 'Email campaign scheduled' : 'Emails sent successfully'
    })

  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json({ 
      error: 'Failed to send emails' 
    }, { status: 500 })
  }
}

async function sendEmailsToSubscribers(
  subscribers: any[], 
  emailContent: any, 
  campaignId: string, 
  supabase: any
) {
  const sentEmails = []
  
  for (const subscription of subscribers) {
    const subscriber = subscription.subscribers
    
    if (!subscriber || subscriber.status !== 'active') continue

    try {
      // Replace placeholders in email content
      const personalizedSubject = emailContent.subject.replace('{SUBSCRIBER_NAME}', subscriber.first_name || 'Friend')
      const personalizedHtml = emailContent.html.replace(/{SUBSCRIBER_NAME}/g, subscriber.first_name || 'Friend')
      const personalizedText = emailContent.text.replace(/{SUBSCRIBER_NAME}/g, subscriber.first_name || 'Friend')
      const personalizedUnsubscribeUrl = emailContent.html.match(/unsubscribeUrl.*?href="([^"]*)"/)?.[1]?.replace('{SUBSCRIBER_ID}', subscriber.id) || ''

      // In a real implementation, you would integrate with an email service like:
      // - SendGrid
      // - Mailgun
      // - AWS SES
      // - Resend
      
      // For now, we'll just log the email and mark it as sent
      console.log('Sending email to:', subscriber.email)
      console.log('Subject:', personalizedSubject)
      
      // Record email event
      await supabase
        .from('email_events')
        .insert({
          campaign_id: campaignId,
          subscriber_id: subscriber.id,
          event_type: 'sent',
          event_data: {
            subject: personalizedSubject,
            sent_at: new Date().toISOString()
          }
        })

      sentEmails.push({
        subscriber_id: subscriber.id,
        email: subscriber.email,
        status: 'sent'
      })

    } catch (error) {
      console.error(`Failed to send email to ${subscriber.email}:`, error)
      
      // Record failed email event
      await supabase
        .from('email_events')
        .insert({
          campaign_id: campaignId,
          subscriber_id: subscriber.id,
          event_type: 'bounced',
          event_data: {
            error: error.message,
            failed_at: new Date().toISOString()
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
