import { NextRequest, NextResponse } from 'next/server'
import { sendTrialEmail } from '@/lib/email-templates/trial-conversion'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, templateType, organizationName, additionalData } = body

    if (!email || !templateType || !organizationName) {
      return NextResponse.json(
        { error: 'Missing required fields: email, templateType, organizationName' },
        { status: 400 }
      )
    }

    // Validate template type
    const validTemplates = ['day1_welcome', 'day3_analytics', 'day7_upgrade_teaser', 'day12_urgency', 'day14_final']
    if (!validTemplates.includes(templateType)) {
      return NextResponse.json(
        { error: 'Invalid template type' },
        { status: 400 }
      )
    }

    // Send the email
    const result = await sendTrialEmail(email, templateType as any, organizationName, additionalData)

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      templateType
    })

  } catch (error) {
    console.error('Trial email error:', error)
    return NextResponse.json(
      { error: 'Failed to send trial email' },
      { status: 500 }
    )
  }
}

// GET endpoint to trigger email sequences (for testing)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const organizationName = searchParams.get('org') || 'Test Organization'
    const templateType = searchParams.get('template') || 'day1_welcome'

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    const result = await sendTrialEmail(email, templateType as any, organizationName)

    return NextResponse.json({
      success: true,
      message: `Trial email sent to ${email}`,
      templateType,
      messageId: result.messageId
    })

  } catch (error) {
    console.error('Trial email GET error:', error)
    return NextResponse.json(
      { error: 'Failed to send trial email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
