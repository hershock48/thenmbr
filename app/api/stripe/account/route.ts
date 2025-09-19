import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('account_id')

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 })
    }

    // Retrieve Stripe account details
    const account = await stripe.accounts.retrieve(accountId)

    return NextResponse.json(account)

  } catch (error) {
    console.error('Error retrieving Stripe account:', error)
    return NextResponse.json({ 
      error: 'Failed to retrieve Stripe account' 
    }, { status: 500 })
  }
}
