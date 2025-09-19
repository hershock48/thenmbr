"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CheckCircle, 
  Crown, 
  Zap, 
  BarChart3, 
  Shield, 
  ArrowRight,
  CreditCard,
  Calendar,
  Users,
  Hash,
  DollarSign
} from "lucide-react"
import { useSubscription } from "@/contexts/SubscriptionContext"
import { useOrganization } from "@/contexts/OrganizationContext"
import Link from "next/link"

const TIER_INFO = {
  starter: {
    name: "Starter",
    monthlyPrice: 49,
    annualPrice: 490,
    icon: Crown,
    color: "from-rose-500 to-pink-600",
    features: ["1-3 impact stories", "Basic analytics", "CSV exports", "Basic branding", "2 team seats"]
  },
  growth: {
    name: "Growth", 
    monthlyPrice: 99,
    annualPrice: 990,
    icon: Zap,
    color: "from-blue-500 to-indigo-600",
    features: ["5 impact stories", "Advanced branding", "Integrations", "Marketplace", "Unlimited seats"]
  },
  professional: {
    name: "Professional",
    monthlyPrice: 199, 
    annualPrice: 1990,
    icon: BarChart3,
    color: "from-emerald-500 to-teal-600",
    features: ["10 impact stories", "White-label", "API access", "Built-in email", "Team roles"]
  },
  enterprise: {
    name: "Enterprise",
    monthlyPrice: 399,
    annualPrice: 3990,
    icon: Shield,
    color: "from-purple-500 to-violet-600", 
    features: ["Unlimited impact stories", "SSO", "Advanced security", "Dedicated support"]
  }
}

export default function BillingPage() {
  const { subscription, tier, purchaseSubscription, upgradeSubscription } = useSubscription()
  const { orgType } = useOrganization()
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual')
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async (tierId: string) => {
    setIsLoading(true)
    try {
      await purchaseSubscription(tierId, billingPeriod)
      // Show success message
    } catch (error) {
      console.error('Upgrade failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'starter': return Crown
      case 'growth': return Zap
      case 'professional': return BarChart3
      case 'enterprise': return Shield
      default: return Crown
    }
  }

  const getTierColor = (tierId: string) => {
    switch (tierId) {
      case 'starter': return 'from-rose-500 to-pink-600'
      case 'growth': return 'from-blue-500 to-indigo-600'
      case 'professional': return 'from-emerald-500 to-teal-600'
      case 'enterprise': return 'from-purple-500 to-violet-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const currentTierId = tier?.id || 'starter'
  const availableTiers = Object.entries(TIER_INFO).filter(([id]) => id !== currentTierId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription and billing settings</p>
      </div>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList>
          <TabsTrigger value="current">Current Plan</TabsTrigger>
          <TabsTrigger value="upgrade">Upgrade Plan</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          {/* Current Subscription */}
          {tier && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <div className={`w-8 h-8 bg-gradient-to-br ${getTierColor(tier.id)} rounded-lg flex items-center justify-center`}>
                        {React.createElement(getTierIcon(tier.id), { className: "w-4 h-4 text-white" })}
                      </div>
                      {tier.name} Plan
                    </CardTitle>
                    <CardDescription>
                      {subscription?.status === 'trial' ? 'Free Trial' : 'Active Subscription'}
                    </CardDescription>
                  </div>
                  <Badge variant={subscription?.status === 'trial' ? 'secondary' : 'default'}>
                    {subscription?.status === 'trial' ? 'Trial' : 'Active'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">${tier.monthlyPrice}</div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{tier.activeNmbrs === -1 ? 'Unlimited' : tier.activeNmbrs}</div>
                      <div className="text-sm text-muted-foreground">impact stories</div>
                    </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{tier.platformFee}%</div>
                    <div className="text-sm text-muted-foreground">platform fee</div>
                  </div>
                </div>

                {subscription?.trialEndsAt && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        Trial ends {new Date(subscription.trialEndsAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <Link href="/pricing">View All Plans</Link>
                  </Button>
                  <Button variant="outline">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Update Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upgrade" className="space-y-6">
          {/* Billing Period Toggle */}
          <div className="flex items-center justify-center space-x-1 bg-muted rounded-lg p-1 max-w-sm mx-auto">
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

          {/* Available Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTiers.map(([tierId, tierInfo]) => {
              const IconComponent = tierInfo.icon
              const displayPrice = billingPeriod === "annual" ? tierInfo.annualPrice : tierInfo.monthlyPrice
              const isRecommended = tierId === 'growth'

              return (
                <Card key={tierId} className={`relative ${isRecommended ? 'ring-2 ring-primary border-primary/20' : ''}`}>
                  {isRecommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">Recommended</Badge>
                    </div>
                  )}

                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${tierInfo.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{tierInfo.name}</CardTitle>
                    <CardDescription>
                      {orgType === "nonprofit" 
                        ? "Perfect for growing nonprofits and impact organizations"
                        : "Ideal for businesses scaling their customer engagement"
                      }
                    </CardDescription>

                    <div className="mt-4">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-foreground">${displayPrice}</span>
                        <span className="text-muted-foreground ml-1">/{billingPeriod === 'annual' ? 'year' : 'month'}</span>
                      </div>
                      {billingPeriod === 'annual' && (
                        <Badge variant="secondary" className="mt-2">
                          Save 2 months
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {tierInfo.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      className={`w-full h-12 bg-gradient-to-r ${tierInfo.color} hover:opacity-90 text-white font-semibold transition-all duration-300`}
                      onClick={() => handleUpgrade(tierId)}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : `Upgrade to ${tierInfo.name}`}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View your past invoices and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No billing history yet</h3>
                <p className="text-muted-foreground">
                  Your invoices and payment history will appear here once you start your subscription.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
