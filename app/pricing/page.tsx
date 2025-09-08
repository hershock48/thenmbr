"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Heart, Users, Building2, Star, Zap, Crown } from "lucide-react"
import Link from "next/link"

interface PricingTier {
  id: string
  name: string
  description: string
  price: string
  period: string
  icon: any
  color: string
  features: string[]
  cta: string
  popular?: boolean
  revenueShare?: string
}

const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small nonprofits and grassroots organizations getting started",
    price: "Free",
    period: "",
    icon: Heart,
    color: "from-rose-500 to-pink-600",
    features: [
      "Up to 10 stories per month",
      "Basic analytics dashboard",
      "QR code generation",
      "Email support",
      "Community templates",
      "Mobile story discovery",
    ],
    cta: "Start Free",
    revenueShare: "No revenue sharing",
  },
  {
    id: "professional",
    name: "Professional",
    description: "For growing organizations ready to scale their impact storytelling",
    price: "$49",
    period: "/month",
    icon: Users,
    color: "from-blue-500 to-indigo-600",
    features: [
      "Unlimited stories",
      "Advanced analytics & ROI tracking",
      "Custom branding & templates",
      "Team collaboration tools",
      "Priority email & chat support",
      "Integration with CRM/payment systems",
      "A/B testing for stories",
      "Donor/customer segmentation",
    ],
    cta: "Start Professional",
    popular: true,
    revenueShare: "2% of story-driven revenue",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations with complex needs and high-volume storytelling",
    price: "Custom",
    period: "",
    icon: Crown,
    color: "from-purple-500 to-violet-600",
    features: [
      "Everything in Professional",
      "White-label solution",
      "Custom integrations & API access",
      "Dedicated account manager",
      "24/7 phone support",
      "Advanced security & compliance",
      "Custom reporting & dashboards",
      "Multi-organization management",
    ],
    cta: "Contact Sales",
    revenueShare: "Negotiable revenue sharing",
  },
]

const businessTiers: PricingTier[] = [
  {
    id: "growth",
    name: "Growth",
    description: "For businesses starting their story-driven commerce journey",
    price: "$99",
    period: "/month",
    icon: Zap,
    color: "from-emerald-500 to-teal-600",
    features: [
      "Up to 100 products with stories",
      "Story-to-purchase tracking",
      "Customer engagement analytics",
      "QR code campaigns",
      "Email & chat support",
      "Basic e-commerce integrations",
    ],
    cta: "Start Growth",
    revenueShare: "3% of story-driven sales",
  },
  {
    id: "scale",
    name: "Scale",
    description: "For established businesses scaling their customer engagement",
    price: "$299",
    period: "/month",
    icon: Building2,
    color: "from-blue-500 to-indigo-600",
    features: [
      "Unlimited products & stories",
      "Advanced conversion tracking",
      "Customer lifetime value analysis",
      "Multi-channel campaigns",
      "Priority support",
      "Advanced e-commerce integrations",
      "Custom story templates",
      "Team collaboration tools",
    ],
    cta: "Start Scale",
    popular: true,
    revenueShare: "2.5% of story-driven sales",
  },
  {
    id: "enterprise-business",
    name: "Enterprise",
    description: "For large businesses with complex story-driven commerce needs",
    price: "Custom",
    period: "",
    icon: Crown,
    color: "from-purple-500 to-violet-600",
    features: [
      "Everything in Scale",
      "White-label solution",
      "Custom integrations & API",
      "Dedicated success manager",
      "24/7 priority support",
      "Advanced security features",
      "Custom analytics & reporting",
      "Multi-brand management",
    ],
    cta: "Contact Sales",
    revenueShare: "Custom revenue sharing",
  },
]

export default function PricingPage() {
  const [selectedAudience, setSelectedAudience] = useState<"nonprofit" | "business">("nonprofit")

  const currentTiers = selectedAudience === "nonprofit" ? pricingTiers : businessTiers

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs">#</span>
                </div>
              </div>
              <span className="text-xl font-bold text-foreground">The NMBR</span>
            </Link>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Choose Your <span className="text-primary">Story-Driven</span> Plan
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Transform your engagement with personalized impact stories. Pay only for what you use with our
              revenue-sharing model.
            </p>

            {/* Audience Toggle */}
            <div className="flex items-center justify-center space-x-1 bg-muted rounded-lg p-1 max-w-md mx-auto mb-12">
              <button
                onClick={() => setSelectedAudience("nonprofit")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  selectedAudience === "nonprofit"
                    ? "bg-rose-100 text-rose-800 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Nonprofits
              </button>
              <button
                onClick={() => setSelectedAudience("business")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  selectedAudience === "business"
                    ? "bg-blue-100 text-blue-800 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Businesses
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {currentTiers.map((tier) => {
            const IconComponent = tier.icon

            return (
              <Card
                key={tier.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  tier.popular ? "ring-2 ring-primary border-primary/20 scale-105" : "hover:scale-105"
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-center py-2">
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span className="text-sm font-medium">Most Popular</span>
                    </div>
                  </div>
                )}

                <CardHeader className={`text-center ${tier.popular ? "pt-12" : "pt-6"}`}>
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${tier.color} rounded-xl flex items-center justify-center mx-auto mb-4`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                  <CardDescription className="text-sm">{tier.description}</CardDescription>

                  <div className="mt-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                      {tier.period && <span className="text-muted-foreground ml-1">{tier.period}</span>}
                    </div>
                    {tier.revenueShare && (
                      <Badge variant="secondary" className="mt-2">
                        {tier.revenueShare}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full h-12 bg-gradient-to-r ${tier.color} hover:opacity-90 text-white font-semibold transition-all duration-300`}
                    asChild
                  >
                    <Link href="/signup">
                      {tier.cta}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Revenue Sharing Explanation */}
        <div className="mt-16 bg-muted/50 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">How Revenue Sharing Works</h3>
          <p className="text-muted-foreground mb-6 max-w-3xl mx-auto">
            {selectedAudience === "nonprofit"
              ? "We only succeed when you do. Our revenue sharing model means we take a small percentage only from donations that are directly attributed to your stories. No stories, no impact, no fees."
              : "We align our success with yours. Our revenue sharing model means we only take a percentage from sales that are directly driven by your story campaigns. More engaging stories = more sales = mutual success."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Track Everything</h4>
              <p className="text-sm text-muted-foreground">
                Advanced analytics show exactly which {selectedAudience === "nonprofit" ? "donations" : "sales"} came
                from your stories
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💰</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Pay for Results</h4>
              <p className="text-sm text-muted-foreground">
                Only pay when your stories drive actual {selectedAudience === "nonprofit" ? "donations" : "revenue"}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🚀</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Scale Together</h4>
              <p className="text-sm text-muted-foreground">
                As your impact grows, we grow together - aligned incentives for maximum success
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-8">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Can I switch plans anytime?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                What counts as story-driven {selectedAudience === "nonprofit" ? "donations" : "revenue"}?
              </h4>
              <p className="text-sm text-muted-foreground">
                Any {selectedAudience === "nonprofit" ? "donation" : "sale"} that can be traced back to a user engaging
                with your stories through QR codes or direct links.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Is there a setup fee?</h4>
              <p className="text-sm text-muted-foreground">
                No setup fees. You only pay the monthly subscription and revenue sharing on successful{" "}
                {selectedAudience === "nonprofit" ? "donations" : "sales"}.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Do you offer custom solutions?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, our Enterprise plan includes custom integrations, white-label solutions, and dedicated support.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Transform Your Impact?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of organizations using story-driven engagement to{" "}
            {selectedAudience === "nonprofit"
              ? "increase donations and build stronger donor relationships"
              : "boost sales and create loyal customers"}
            .
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
              <Link href="/signup">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">See It In Action</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
