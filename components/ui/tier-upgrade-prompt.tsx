"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CheckCircle, X, Crown, Zap, BarChart3, Shield, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useSubscription } from "@/contexts/SubscriptionContext"

interface TierUpgradePromptProps {
  feature: string
  currentAction: string
  requiredTier: string
  className?: string
}

const TIER_INFO = {
  starter: {
    name: "Starter",
    price: "$99",
    icon: Crown,
    color: "from-rose-500 to-pink-600",
    features: ["1-3 active NMBRs", "Basic analytics", "CSV exports", "Basic branding"]
  },
  growth: {
    name: "Growth", 
    price: "$199",
    icon: Zap,
    color: "from-blue-500 to-indigo-600",
    features: ["5 active NMBRs", "Advanced branding", "Integrations", "Marketplace"]
  },
  professional: {
    name: "Professional",
    price: "$399", 
    icon: BarChart3,
    color: "from-emerald-500 to-teal-600",
    features: ["10 active NMBRs", "White-label", "API access", "Built-in email", "Team roles"]
  },
  enterprise: {
    name: "Enterprise",
    price: "Custom",
    icon: Shield,
    color: "from-purple-500 to-violet-600", 
    features: ["Unlimited NMBRs", "SSO", "Advanced security", "Dedicated support"]
  }
}

export function TierUpgradePrompt({ feature, currentAction, requiredTier, className }: TierUpgradePromptProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { tier } = useSubscription()
  
  const currentTierInfo = tier ? TIER_INFO[tier.id as keyof typeof TIER_INFO] : null
  const requiredTierInfo = TIER_INFO[requiredTier as keyof typeof TIER_INFO]

  if (!currentTierInfo || !requiredTierInfo) return null

  const IconComponent = requiredTierInfo.icon

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className={`border-dashed border-2 border-primary/20 bg-primary/5 ${className}`}>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconComponent className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Upgrade to {requiredTierInfo.name} to {currentAction}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              This feature requires {requiredTierInfo.name} tier or higher
            </p>
            <Button className="w-full">
              View Upgrade Options
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            Unlock {feature} and more powerful features with a higher tier plan
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current vs Required Tier Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Tier */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 bg-gradient-to-br ${currentTierInfo.color} rounded-lg flex items-center justify-center`}>
                    <currentTierInfo.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{currentTierInfo.name}</CardTitle>
                    <CardDescription>Current Plan</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentTierInfo.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Required Tier */}
            <Card className="ring-2 ring-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 bg-gradient-to-br ${requiredTierInfo.color} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{requiredTierInfo.name}</CardTitle>
                    <CardDescription>Recommended</CardDescription>
                  </div>
                  <Badge className="ml-auto">Upgrade</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {requiredTierInfo.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature Benefits */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">What you'll get with {requiredTierInfo.name}:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• {feature} and other advanced features</li>
              <li>• Higher NMBR limits for more stories</li>
              <li>• Enhanced analytics and reporting</li>
              <li>• Priority support and faster response times</li>
              <li>• Advanced integrations and API access</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1" asChild>
              <Link href="/pricing">
                View All Plans
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/contact">
                Contact Sales
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Feature-specific upgrade prompts
export function NmbrLimitReachedPrompt() {
  return (
    <TierUpgradePrompt
      feature="more active NMBRs"
      currentAction="create additional stories"
      requiredTier="growth"
    />
  )
}

export function WhiteLabelPrompt() {
  return (
    <TierUpgradePrompt
      feature="white-label branding"
      currentAction="remove NMBR branding"
      requiredTier="professional"
    />
  )
}

export function ApiAccessPrompt() {
  return (
    <TierUpgradePrompt
      feature="API access"
      currentAction="integrate with external systems"
      requiredTier="professional"
    />
  )
}

export function TeamRolesPrompt() {
  return (
    <TierUpgradePrompt
      feature="team roles and permissions"
      currentAction="manage team access"
      requiredTier="professional"
    />
  )
}
