"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Heart, Users, Building2, Star, Zap, Crown, Hash, DollarSign, Mail, BarChart3, Shield, Globe, Settings } from "lucide-react"
import { GlobalHeader } from "@/components/layout/global-header"
import { GlobalFooter } from "@/components/layout/global-footer"
import Link from "next/link"

interface PricingTier {
  id: string
  name: string
  description: string
  price: string
  annualPrice: string
  period: string
  icon: any
  color: string
  features: string[]
  cta: string
  popular?: boolean
  platformFee: string
  activeNmbrs: string
  seats: string
  support: string
}

const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small nonprofits getting started with story-driven fundraising",
    price: "$99",
    annualPrice: "$990",
    period: "/month",
    icon: Heart,
    color: "from-rose-500 to-pink-600",
    activeNmbrs: "1-3",
    seats: "2",
    platformFee: "5%",
    support: "Email (2 biz days)",
    features: [
      "1-3 active NMBRs (unlimited archived)",
      "Story pages with photos, narratives, updates",
      "Email capture per NMBR",
      "Stripe checkout integration",
      "Basic branding + 'Powered by The NMBR'",
      "Basic analytics (views, searches, donations)",
      "CSV exports (subscribers & donations)",
      "Up to 2 admin users",
      "Reassign up to 2 NMBRs/year",
    ],
    cta: "Start Free Trial",
  },
  {
    id: "growth",
    name: "Growth",
    description: "For growing nonprofits ready to scale their story-driven fundraising",
    price: "$199",
    annualPrice: "$1,990",
    period: "/month",
    icon: Users,
    color: "from-blue-500 to-indigo-600",
    activeNmbrs: "5",
    seats: "Unlimited",
    platformFee: "3%",
    support: "Email + Chat (1 biz day)",
    features: [
      "5 active NMBRs (unlimited archived)",
      "Everything in Starter",
      "Advanced branding (remove 'Powered by')",
      "Enhanced analytics (donations by story, donor journey tracking)",
      "Mailchimp/Constant Contact sync",
      "Zapier webhooks",
      "Marketplace self-serve ordering",
      "Reassign up to 5 NMBRs/year",
    ],
    cta: "Start Growth",
    popular: true,
  },
  {
    id: "professional",
    name: "Professional",
    description: "For established nonprofits with comprehensive fundraising needs",
    price: "$399",
    annualPrice: "$3,990",
    period: "/month",
    icon: Building2,
    color: "from-emerald-500 to-teal-600",
    activeNmbrs: "10",
    seats: "Unlimited + Roles",
    platformFee: "1% (0% with tips)",
    support: "Priority (8 biz hours)",
    features: [
      "10 active NMBRs (unlimited archived)",
      "Everything in Growth",
      "White-label (custom subdomain)",
      "Built-in email (25k/month included)",
      "Advanced analytics (donor engagement, conversion funnels, impact tracking)",
      "Public API + CRM connectors",
      "Team roles & permissions",
      "2 live onboarding sessions",
      "Reassign up to 12 NMBRs/year",
    ],
    cta: "Start Professional",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large nonprofits, federations, and multi-organization portfolios",
    price: "Custom",
    annualPrice: "$750-1,000+",
    period: "/month",
    icon: Crown,
    color: "from-purple-500 to-violet-600",
    activeNmbrs: "Unlimited",
    seats: "Unlimited + Enterprise",
    platformFee: "0%",
    support: "Dedicated CSM (4 biz hours)",
    features: [
      "Unlimited active NMBRs",
      "Everything in Professional",
      "SSO (SAML/OIDC) + SCIM",
      "Dedicated email domain (250k/month)",
      "IP allow-listing + audit logs",
      "Data residency controls",
      "Custom theming packages",
      "Multi-org hierarchy",
      "Unlimited reassignments",
      "Quarterly business reviews",
    ],
    cta: "Contact Sales",
  },
]


export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("annual")

  const currentTiers = pricingTiers

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader variant="default" />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Turn Stories Into <span className="text-primary">Impact</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              The complete story-driven fundraising platform for nonprofits. Turn your impact stories into sustainable donor relationships and recurring support.
            </p>

            {/* Nonprofit Focus Badge */}
            <div className="flex items-center justify-center mb-8">
              <div className="bg-primary/10 text-primary px-6 py-2 rounded-full font-medium">
                Nonprofit Pricing
              </div>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-1 bg-muted rounded-lg p-1 max-w-sm mx-auto mb-12">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  billingPeriod === "monthly"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("annual")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  billingPeriod === "annual"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Annual (2 months free)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentTiers.map((tier) => {
            const IconComponent = tier.icon
            const displayPrice = billingPeriod === "annual" ? tier.annualPrice : tier.price
            const isAnnual = billingPeriod === "annual"

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
                      <span className="text-4xl font-bold text-foreground">{displayPrice}</span>
                      <span className="text-muted-foreground ml-1">{isAnnual ? '/year' : tier.period}</span>
                    </div>
                    {isAnnual && tier.id !== "enterprise" && tier.id !== "enterprise-business" && (
                      <Badge variant="secondary" className="mt-2">
                        Save 2 months
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center justify-center mb-1">
                        <Hash className="w-4 h-4 text-primary mr-1" />
                        <span className="text-sm font-medium">Active NMBRs</span>
                      </div>
                      <div className="text-lg font-bold">{tier.activeNmbrs}</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center justify-center mb-1">
                        <DollarSign className="w-4 h-4 text-primary mr-1" />
                        <span className="text-sm font-medium">Platform Fee</span>
                      </div>
                      <div className="text-lg font-bold">{tier.platformFee}</div>
                    </div>
                  </div>

                  {/* Features */}
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

        {/* Feature Comparison Matrix */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">Feature Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  {currentTiers.map((tier) => (
                    <th key={tier.id} className="text-center p-4 font-semibold">
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4 font-medium">Active NMBRs</td>
                  {currentTiers.map((tier) => (
                    <td key={tier.id} className="text-center p-4">{tier.activeNmbrs}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Platform Fee</td>
                  {currentTiers.map((tier) => (
                    <td key={tier.id} className="text-center p-4">{tier.platformFee}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Team Seats</td>
                  {currentTiers.map((tier) => (
                    <td key={tier.id} className="text-center p-4">{tier.seats}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Support Level</td>
                  {currentTiers.map((tier) => (
                    <td key={tier.id} className="text-center p-4">{tier.support}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">White-label</td>
                  {currentTiers.map((tier) => (
                    <td key={tier.id} className="text-center p-4">
                      {tier.id.includes('professional') || tier.id.includes('enterprise') ? '✓' : '✗'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">API Access</td>
                  {currentTiers.map((tier) => (
                    <td key={tier.id} className="text-center p-4">
                      {tier.id.includes('professional') || tier.id.includes('enterprise') ? '✓' : '✗'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Donor Tips Explanation */}
        <div className="mt-16 bg-muted/50 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">Donor Tips Feature</h3>
          <p className="text-muted-foreground mb-6 max-w-3xl mx-auto">
            When enabled, donors can add an optional tip to support NMBR. 
            This often offsets or eliminates platform fees for your organization, making our service more sustainable for everyone.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Optional Support</h3>
              <p className="text-sm text-muted-foreground">
                Donors can choose to add a tip when giving
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Reduce Your Costs</h3>
              <p className="text-sm text-muted-foreground">
                Tips often cover or eliminate platform fees, reducing your operational costs
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Sustainable Platform</h3>
              <p className="text-sm text-muted-foreground">
                Helps us maintain and improve the platform for all users
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-8">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h3 className="font-semibold text-foreground mb-2">What counts as an active NMBR?</h3>
              <p className="text-sm text-muted-foreground">
                An active NMBR is a currently assigned, public story slot. You can archive NMBRs to free up slots and reassign them to new stories.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Can I change my plan anytime?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate any differences.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">What happens to archived NMBRs?</h3>
              <p className="text-sm text-muted-foreground">
                Archived NMBRs preserve all history and data. Public URLs can show "This story has concluded" with a final update.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Do you offer custom solutions?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, our Enterprise plan includes custom integrations, white-label solutions, and dedicated support tailored to your needs.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Transform Your Impact?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join organizations using story-driven engagement to increase donations and build stronger donor relationships.
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
      
      <GlobalFooter />
    </div>
  )
}
