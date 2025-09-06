import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const { org_id, story_id, platform_fee } = session.metadata || {}

        if (org_id) {
          // Update donation status
          await supabaseAdmin
            .from('donations')
            .update({
              status: 'succeeded',
              stripe_txn_id: session.payment_intent as string,
              stripe_payment_intent_id: session.payment_intent as string,
            })
            .eq('org_id', org_id)
            .eq('amount', session.amount_total)
            .eq('status', 'pending')
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const { org_id } = paymentIntent.metadata || {}

        if (org_id) {
          // Update donation status to failed
          await supabaseAdmin
            .from('donations')
            .update({
              status: 'failed',
              stripe_payment_intent_id: paymentIntent.id,
            })
            .eq('org_id', org_id)
            .eq('stripe_payment_intent_id', paymentIntent.id)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
