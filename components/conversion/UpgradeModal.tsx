"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Check, X, Star, Users, Building2, ArrowRight, Clock } from "lucide-react"
import Link from "next/link"
import { useTrial } from "@/contexts/TrialContext"

const plans = [
  {
    id: "growth",
    name: "Growth",
    price: "$199",
    annualPrice: "$1,990",
    period: "/month",
    icon: Users,
    color: "from-blue-500 to-indigo-600",
    popular: true,
    features: [
      "5 active NMBRs",
      "Unlimited team seats",
      "Advanced analytics",
      "Enhanced branding",
      "Marketplace ordering",
      "3% platform fee"
    ]
  },
  {
    id: "professional",
    name: "Professional", 
    price: "$399",
    annualPrice: "$3,990",
    period: "/month",
    icon: Building2,
    color: "from-emerald-500 to-teal-600",
    popular: false,
    features: [
      "10 active NMBRs",
      "White-label storefronts",
      "Built-in email",
      "Advanced analytics",
      "API access",
      "1% platform fee"
    ]
  }
]

export function UpgradeModal() {
  const { trialInfo, dismissConversionPrompt } = useTrial()
  const [selectedPlan, setSelectedPlan] = useState("growth")
  const [showAnnual, setShowAnnual] = useState(false)

  if (!trialInfo.conversionTriggers.showUpgradeModal) {
    return null
  }

  const selectedPlanData = plans.find(p => p.id === selectedPlan) || plans[0]

  return (
    <Dialog open={true} onOpenChange={() => dismissConversionPrompt('showUpgradeModal')}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            <Clock className="w-6 h-6 inline mr-2 text-red-600" />
            Your Trial Ends Today!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Urgency Message */}
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="text-center">
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                Don't Lose Your Progress
              </h3>
              <p className="text-sm text-red-800 dark:text-red-200">
                You've created {trialInfo.usage.nmbrsCreated} NMBR{trialInfo.usage.nmbrsCreated !== 1 ? 's' : ''} and captured {trialInfo.usage.emailsCaptured} donor emails. 
                Upgrade now to keep everything active.
              </p>
            </div>
          </div>

          {/* Special Offer */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
            <Badge className="mb-2 bg-green-600">Limited Time Offer</Badge>
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
              20% Off Your First 3 Months
            </h3>
            <p className="text-sm text-green-800 dark:text-green-200">
              Save ${selectedPlan === "growth" ? "119" : "239"} when you upgrade today
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center">
            <div className="bg-muted rounded-lg p-1">
              <button
                onClick={() => setShowAnnual(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  !showAnnual ? 'bg-background shadow-sm' : 'text-muted-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setShowAnnual(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  showAnnual ? 'bg-background shadow-sm' : 'text-muted-foreground'
                }`}
              >
                Annual <span className="text-green-600 ml-1">(Save 2 months)</span>
              </button>
            </div>
          </div>

          {/* Plan Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`cursor-pointer transition-all ${
                  selectedPlan === plan.id 
                    ? 'ring-2 ring-primary border-primary' 
                    : 'hover:border-primary/50'
                } ${plan.popular ? 'border-primary' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${plan.color} rounded-lg flex items-center justify-center`}>
                        <plan.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{plan.name}</h3>
                        {plan.popular && (
                          <Badge variant="secondary" className="text-xs">Most Popular</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {showAnnual ? plan.annualPrice : plan.price}
                        <span className="text-sm text-muted-foreground">
                          {showAnnual ? '/year' : plan.period}
                        </span>
                      </div>
                      {showAnnual && (
                        <div className="text-xs text-green-600">
                          Save 2 months
                        </div>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${
                      selectedPlan === plan.id 
                        ? 'bg-primary hover:bg-primary/90' 
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                    disabled={selectedPlan !== plan.id}
                  >
                    {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => dismissConversionPrompt('showUpgradeModal')}
              className="px-8"
            >
              Maybe Later
            </Button>
            <Button asChild className="px-8 bg-primary hover:bg-primary/90">
              <Link href={`/pricing?plan=${selectedPlan}&annual=${showAnnual}`}>
                Upgrade to {selectedPlanData.name}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="text-center text-sm text-muted-foreground">
            <p>✓ Cancel anytime • ✓ 30-day money-back guarantee • ✓ Instant activation</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
