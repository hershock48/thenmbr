"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ArrowRight, Target, Users, Zap } from "lucide-react"
import Link from "next/link"
import { useTrial } from "@/contexts/TrialContext"

export function UsagePrompt() {
  const { trialInfo, dismissConversionPrompt } = useTrial()
  const [isVisible, setIsVisible] = useState(true)

  if (!trialInfo.conversionTriggers.showUsagePrompt || !isVisible) {
    return null
  }

  const usagePercentage = (trialInfo.usage.nmbrsCreated / trialInfo.usage.maxNmbrs) * 100
  const remainingNmbrs = trialInfo.usage.maxNmbrs - trialInfo.usage.nmbrsCreated

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                  NMBR Usage Alert
                </h3>
                <p className="text-xs text-orange-700 dark:text-orange-300">
                  {remainingNmbrs} NMBR{remainingNmbrs !== 1 ? 's' : ''} remaining
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsVisible(false)
                dismissConversionPrompt('showUsagePrompt')
              }}
              className="h-6 w-6 p-0 text-orange-600 hover:text-orange-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-orange-800 dark:text-orange-200">NMBRs Used</span>
              <span className="text-orange-800 dark:text-orange-200">
                {trialInfo.usage.nmbrsCreated}/{trialInfo.usage.maxNmbrs}
              </span>
            </div>
            <div className="w-full bg-orange-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              You've used {usagePercentage.toFixed(0)}% of your NMBR allocation. 
              {remainingNmbrs > 0 ? (
                <> Create {remainingNmbrs} more before upgrading.</>
              ) : (
                <> Upgrade to create unlimited NMBRs.</>
              )}
            </p>

            <div className="flex gap-2">
              <Button asChild size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700">
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
                  dismissConversionPrompt('showUsagePrompt')
                }}
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
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
