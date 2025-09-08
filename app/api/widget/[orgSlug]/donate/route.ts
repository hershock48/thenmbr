import { type NextRequest, NextResponse } from "next/server"
import { stripe, createPaymentIntent } from "@/lib/stripe"

export async function POST(request: NextRequest, { params }: { params: { orgSlug: string } }) {
  const { orgSlug } = params
  const body = await request.json()

  const { nmbrId, amount, donorEmail, donorName, paymentMethodId } = body

  // Validate required fields
  if (!nmbrId || !amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid donation amount" }, { status: 400 })
  }

  if (!paymentMethodId) {
    return NextResponse.json({ error: "Payment method required" }, { status: 400 })
  }

  try {
    // In real app, fetch organization and NMBR from database
    const mockOrganization = {
      id: "1",
      name: "Hope Foundation",
      slug: "hope-foundation",
      stripeAccountId: "acct_1234567890", // This would come from database
      stripeConnected: true,
    }

    const mockNmbr = {
      id: nmbrId,
      code: "HOPE001",
      title: "Clean Water for Village",
      organizationId: "1",
    }

    if (!mockOrganization.stripeConnected || !mockOrganization.stripeAccountId) {
      return NextResponse.json({ error: "Organization payment processing not set up" }, { status: 400 })
    }

    // Calculate platform fee (5% of donation)
    const platformFeeAmount = amount * 0.05

    // Create payment intent with Stripe Connect
    const paymentIntent = await createPaymentIntent(
      amount,
      "usd",
      mockOrganization.stripeAccountId,
      platformFeeAmount,
      {
        nmbrId: nmbrId,
        nmbrCode: mockNmbr.code,
        organizationId: mockOrganization.id,
        donorEmail: donorEmail || "",
        donorName: donorName || "",
      },
    )

    // Confirm payment intent with payment method
    const confirmedPayment = await stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method: paymentMethodId,
      return_url: `${request.nextUrl.origin}/widget/${orgSlug}/success`,
    })

    if (confirmedPayment.status === "succeeded") {
      // In real app, this would:
      // 1. Record donation in database
      // 2. Update NMBR raised amount
      // 3. Send confirmation email
      // 4. Trigger webhook events

      console.log("Donation processed successfully:", {
        paymentIntentId: confirmedPayment.id,
        amount,
        nmbrId,
        donorEmail,
      })

      return NextResponse.json({
        success: true,
        message: "Donation processed successfully",
        donation: {
          id: confirmedPayment.id,
          amount,
          currency: "USD",
          nmbrId,
          donorEmail,
          donorName,
          status: "completed",
          createdAt: new Date().toISOString(),
        },
      })
    } else {
      return NextResponse.json({
        success: false,
        error: "Payment requires additional action",
        clientSecret: confirmedPayment.client_secret,
      })
    }
  } catch (error) {
    console.error("Stripe payment error:", error)
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 })
  }
}
