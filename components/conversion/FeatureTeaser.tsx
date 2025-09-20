"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Star, Globe, BarChart3, Zap, Lock } from "lucide-react"
import Link from "next/link"
import { useTrial } from "@/contexts/TrialContext"

const lockedFeatures = [
  {
    icon: Globe,
    title: "White-label Branding",
    description: "Remove 'Powered by NMBR' and use your own domain",
    plan: "Professional",
    price: "$399/month"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Donor journey tracking, conversion funnels, and detailed reports",
    plan: "Growth",
    price: "$199/month"
  },
  {
    icon: Star,
    title: "Unlimited NMBRs",
    description: "Create as many impact stories as you need",
    plan: "Growth",
    price: "$199/month"
  }
]

export function FeatureTeaser() {
  const { trialInfo, dismissConversionPrompt } = useTrial()
  const [isVisible, setIsVisible] = useState(true)
  const [currentFeature, setCurrentFeature] = useState(0)

  if (!trialInfo.conversionTriggers.showFeatureTeaser || !isVisible) {
    return null
  }

  const feature = lockedFeatures[currentFeature]

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/20">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Lock className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                  Unlock Premium Features
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {feature.plan} Plan
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsVisible(false)
                dismissConversionPrompt('showFeatureTeaser')
              }}
              className="h-6 w-6 p-0 text-purple-600 hover:text-purple-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-purple-900 dark:text-purple-100">
                  {feature.title}
                </h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  {feature.price}
                </p>
              </div>
            </div>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              {feature.description}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex gap-1 justify-center">
              {lockedFeatures.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeature(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentFeature ? 'bg-purple-600' : 'bg-purple-300'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <Button asChild size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                <Link href="/pricing">
                  <Zap className="w-4 h-4 mr-1" />
                  Upgrade Now
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setIsVisible(false)
                  dismissConversionPrompt('showFeatureTeaser')
                }}
                className="border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                Later
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
