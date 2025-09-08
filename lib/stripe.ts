import Stripe from "stripe"

// Initialize Stripe only if secret key is available
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-12-18.acacia",
    })
  : null

export const getStripe = () => {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return import("@stripe/stripe-js").then(({ loadStripe }) =>
      loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
    )
  }
  return null
}

export const createConnectAccount = async (email: string, country = "US") => {
  if (!stripe) {
    throw new Error("Stripe is not initialized")
  }

  try {
    const account = await stripe.accounts.create({
      type: "express",
      country,
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    })

    return account
  } catch (error) {
    console.error("Error creating Connect account:", error)
    throw error
  }
}

export const createConnectAccountLink = async (accountId: string, refreshUrl: string, returnUrl: string) => {
  if (!stripe) {
    throw new Error("Stripe is not initialized")
  }

  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: "account_onboarding",
    })

    return accountLink
  } catch (error) {
    console.error("Error creating Connect account link:", error)
    throw error
  }
}

export const createPaymentIntent = async (
  amount: number,
  currency = "usd",
  connectedAccountId?: string,
  applicationFeeAmount?: number,
) => {
  if (!stripe) {
    throw new Error("Stripe is not initialized")
  }

  try {
    const paymentIntentData: Stripe.PaymentIntentCreateParams = {
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    }

    // Add Connect account and application fee if provided
    if (connectedAccountId) {
      paymentIntentData.transfer_data = {
        destination: connectedAccountId,
      }
    }

    if (applicationFeeAmount) {
      paymentIntentData.application_fee_amount = applicationFeeAmount
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData)

    return paymentIntent
  } catch (error) {
    console.error("Error creating payment intent:", error)
    throw error
  }
}
