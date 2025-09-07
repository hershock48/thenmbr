import { type NextRequest, NextResponse } from "next/server"
import { createConnectAccount, createConnectAccountLink } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { organizationId, email, organizationName } = body

  if (!organizationId || !email || !organizationName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    // Create Stripe Connect account
    const account = await createConnectAccount(email, organizationName)

    // Create onboarding link
    const refreshUrl = `${request.nextUrl.origin}/dashboard/billing/connect/refresh`
    const returnUrl = `${request.nextUrl.origin}/dashboard/billing/connect/success`

    const accountLink = await createConnectAccountLink(account.id, refreshUrl, returnUrl)

    // In real app, save account.id to organization record in database
    console.log("Created Stripe Connect account:", account.id, "for organization:", organizationId)

    return NextResponse.json({
      success: true,
      accountId: account.id,
      onboardingUrl: accountLink.url,
    })
  } catch (error) {
    console.error("Stripe Connect onboarding error:", error)
    return NextResponse.json({ error: "Failed to create Stripe Connect account" }, { status: 500 })
  }
}
