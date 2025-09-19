import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 })
    }

    const { org_id, return_url } = await request.json()

    if (!org_id) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
    }

    // Create Stripe Connect account
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US', // You might want to make this configurable
      email: `org-${org_id}@thenmbr.com`, // Placeholder email
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true }
      },
      business_type: 'non_profit',
      settings: {
        payouts: {
          schedule: {
            interval: 'daily'
          }
        }
      }
    })

    // Update nonprofit with Stripe account ID
    const { error: updateError } = await supabaseAdmin
      .from('nonprofits')
      .update({ stripe_account_id: account.id })
      .eq('id', org_id)

    if (updateError) {
      console.error('Error updating nonprofit with Stripe account ID:', updateError)
      return NextResponse.json({ error: 'Failed to save Stripe account' }, { status: 500 })
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: return_url,
      return_url: return_url,
      type: 'account_onboarding'
    })

    return NextResponse.json({ 
      account_id: account.id,
      url: accountLink.url 
    })

  } catch (error) {
    console.error('Error creating Stripe Connect account:', error)
    return NextResponse.json({ 
      error: 'Failed to create Stripe account' 
    }, { status: 500 })
  }
}
