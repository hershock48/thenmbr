"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Clock, AlertTriangle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useTrial } from "@/contexts/TrialContext"

export function TrialCountdown() {
  const { trialInfo, dismissConversionPrompt } = useTrial()
  const [isVisible, setIsVisible] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0
  })

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date()
      const timeDiff = trialInfo.endDate.getTime() - now.getTime()
      
      if (timeDiff <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0 })
        return
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))

      setTimeRemaining({ days, hours, minutes })
    }

    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 1000 * 60) // Update every minute

    return () => clearInterval(interval)
  }, [trialInfo.endDate])

  if (!trialInfo.conversionTriggers.showCountdown || !isVisible) {
    return null
  }

  const isUrgent = trialInfo.daysRemaining <= 1
  const isExpired = trialInfo.daysRemaining === 0

  if (isExpired) {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md">
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
              Trial Expired
            </h3>
            <p className="text-sm text-red-800 dark:text-red-200 mb-4">
              Your free trial has ended. Upgrade now to continue using NMBR.
            </p>
            <Button asChild className="w-full bg-red-600 hover:bg-red-700">
              <Link href="/pricing">
                Upgrade to Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md">
      <Card className={`border-2 ${isUrgent ? 'border-red-200 bg-red-50 dark:bg-red-950/20' : 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20'}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isUrgent ? 'bg-red-100' : 'bg-yellow-100'}`}>
                <Clock className={`w-4 h-4 ${isUrgent ? 'text-red-600' : 'text-yellow-600'}`} />
              </div>
              <div>
                <h3 className={`font-semibold ${isUrgent ? 'text-red-900 dark:text-red-100' : 'text-yellow-900 dark:text-yellow-100'}`}>
                  {isUrgent ? 'Trial Ending Soon!' : 'Trial Countdown'}
                </h3>
                <p className={`text-xs ${isUrgent ? 'text-red-700 dark:text-red-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
                  {trialInfo.daysRemaining} day{trialInfo.daysRemaining !== 1 ? 's' : ''} remaining
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsVisible(false)
                dismissConversionPrompt('showCountdown')
              }}
              className={`h-6 w-6 p-0 ${isUrgent ? 'text-red-600 hover:text-red-800' : 'text-yellow-600 hover:text-yellow-800'}`}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="mb-4">
            <div className="flex justify-center gap-4 text-center">
              <div>
                <div className={`text-2xl font-bold ${isUrgent ? 'text-red-800' : 'text-yellow-800'}`}>
                  {timeRemaining.days}
                </div>
                <div className={`text-xs ${isUrgent ? 'text-red-600' : 'text-yellow-600'}`}>Days</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${isUrgent ? 'text-red-800' : 'text-yellow-800'}`}>
                  {timeRemaining.hours}
                </div>
                <div className={`text-xs ${isUrgent ? 'text-red-600' : 'text-yellow-600'}`}>Hours</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${isUrgent ? 'text-red-800' : 'text-yellow-800'}`}>
                  {timeRemaining.minutes}
                </div>
                <div className={`text-xs ${isUrgent ? 'text-red-600' : 'text-yellow-600'}`}>Minutes</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className={`text-sm ${isUrgent ? 'text-red-800 dark:text-red-200' : 'text-yellow-800 dark:text-yellow-200'}`}>
              {isUrgent 
                ? "Don't lose access to your NMBRs! Upgrade now to continue your fundraising."
                : "Your free trial is ending soon. Upgrade to keep your NMBRs active."
              }
            </p>

            <div className="flex gap-2">
              <Button asChild size="sm" className={`flex-1 ${isUrgent ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'}`}>
                <Link href="/pricing">
                  {isUrgent ? 'Upgrade Now' : 'View Plans'}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              {!isUrgent && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setIsVisible(false)
                    dismissConversionPrompt('showCountdown')
                  }}
                  className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                >
                  Later
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
