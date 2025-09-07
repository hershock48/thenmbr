import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get("stripe-signature")!

  let event: any

  try {
    event = stripe!.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object
        console.log("Payment succeeded:", paymentIntent.id)

        // In real app, this would:
        // 1. Update donation record in database
        // 2. Update NMBR raised amount
        // 3. Send confirmation email to donor
        // 4. Notify organization
        break

      case "account.updated":
        const account = event.data.object
        console.log("Connect account updated:", account.id)

        // In real app, update organization's Stripe Connect status
        break

      case "invoice.payment_succeeded":
        const invoice = event.data.object
        console.log("Subscription payment succeeded:", invoice.id)

        // In real app, update organization's subscription status
        break

      case "invoice.payment_failed":
        const failedInvoice = event.data.object
        console.log("Subscription payment failed:", failedInvoice.id)

        // In real app, handle failed subscription payment
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
