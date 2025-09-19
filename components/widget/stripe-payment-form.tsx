"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Lock } from "lucide-react"

interface StripePaymentFormProps {
  amount: string
  nmbrId: string
  organizationSlug: string
  onSuccess: () => void
  onError: (error: string) => void
}

export function StripePaymentForm({ amount, nmbrId, organizationSlug, onSuccess, onError }: StripePaymentFormProps) {
  const [loading, setLoading] = useState(false)
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    email: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // In a real implementation, this would:
      // 1. Use Stripe Elements to securely collect card data
      // 2. Create a payment method
      // 3. Call the donation API with the payment method ID

      // Mock successful payment for demo
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const response = await fetch(`/api/widget/${organizationSlug}/donate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nmbrId,
          amount: Number.parseFloat(amount),
          donorEmail: cardData.email,
          donorName: cardData.name,
          paymentMethodId: "pm_mock_payment_method", // In real app, this comes from Stripe Elements
        }),
      })

      const result = await response.json()

      if (result.success) {
        onSuccess()
      } else {
        onError(result.error || "Payment failed")
      }
    } catch (error) {
      onError("Payment processing failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-card">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-foreground">
          <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          Secure Payment
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-muted-foreground">
          Donate ${amount} securely with your credit card
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="donor-name" className="text-sm font-medium text-foreground">
              Full Name
            </Label>
            <Input
              id="donor-name"
              className="h-10 sm:h-11 text-sm sm:text-base border-border focus:border-primary focus:ring-primary/20"
              value={cardData.name}
              onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="donor-email" className="text-sm font-medium text-foreground">
              Email Address
            </Label>
            <Input
              id="donor-email"
              type="email"
              className="h-10 sm:h-11 text-sm sm:text-base border-border focus:border-primary focus:ring-primary/20"
              value={cardData.email}
              onChange={(e) => setCardData({ ...cardData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-number" className="text-sm font-medium text-foreground">
              Card Number
            </Label>
            <Input
              id="card-number"
              placeholder="1234 5678 9012 3456"
              className="h-10 sm:h-11 text-sm sm:text-base border-border focus:border-primary focus:ring-primary/20"
              value={cardData.number}
              onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry" className="text-sm font-medium text-foreground">
                Expiry Date
              </Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                className="h-10 sm:h-11 text-sm sm:text-base border-border focus:border-primary focus:ring-primary/20"
                value={cardData.expiry}
                onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc" className="text-sm font-medium text-foreground">
                CVC
              </Label>
              <Input
                id="cvc"
                placeholder="123"
                className="h-10 sm:h-11 text-sm sm:text-base border-border focus:border-primary focus:ring-primary/20"
                value={cardData.cvc}
                onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-muted/50 p-3 sm:p-4 rounded-lg border border-border">
            <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
            <span>Your payment information is encrypted and secure</span>
          </div>

          <Button
            type="submit"
            className="w-full h-11 sm:h-12 text-sm sm:text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            disabled={loading}
          >
            {loading ? "Processing..." : `Donate $${amount}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
