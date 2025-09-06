import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 })
    }

    const { amount, org_id, story_id, donor_email, success_url, cancel_url } = await request.json()

    if (!amount || !org_id) {
      return NextResponse.json({ error: 'Amount and organization ID are required' }, { status: 400 })
    }

    // Get organization details
    const { data: org, error: orgError } = await supabaseAdmin
      .from('nonprofits')
      .select('*')
      .eq('id', org_id)
      .single()

    if (orgError || !org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    if (!org.stripe_account_id) {
      return NextResponse.json({ error: 'Organization has not connected Stripe' }, { status: 400 })
    }

    // Calculate platform fee
    const platformFeePercentage = parseFloat(process.env.NEXT_PUBLIC_PLATFORM_FEE_PERCENTAGE || '5')
    const platformFee = Math.round((amount * platformFeePercentage) / 100)
    const netAmount = amount - platformFee

    // Create Stripe Checkout session with Connect
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Donation to ${org.name}`,
              description: story_id ? 'Story donation' : 'General donation',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: success_url || `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      customer_email: donor_email,
      payment_intent_data: {
        application_fee_amount: platformFee,
        transfer_data: {
          destination: org.stripe_account_id,
        },
      },
      metadata: {
        org_id,
        story_id: story_id || '',
        platform_fee: platformFee.toString(),
      },
    })

    // Store donation record in database
    const { error: donationError } = await supabaseAdmin
      .from('donations')
      .insert({
        org_id,
        story_id: story_id || null,
        amount,
        platform_fee: platformFee,
        donor_email,
        status: 'pending'
      })

    if (donationError) {
      console.error('Failed to create donation record:', donationError)
    }

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: 'Failed to create donation session' }, { status: 500 })
  }
}
