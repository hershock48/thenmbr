"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Target, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileDonationWidgetProps {
  nmbrId: string
  organizationSlug: string
  title: string
  description: string
  goalAmount: number
  currentAmount: number
  supporterCount: number
  className?: string
}

export function MobileDonationWidget({
  nmbrId,
  organizationSlug,
  title,
  description,
  goalAmount,
  currentAmount,
  supporterCount,
  className,
}: MobileDonationWidgetProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const widgetRef = useRef<HTMLDivElement>(null)
  const progress = (currentAmount / goalAmount) * 100

  const suggestedAmounts = [10, 25, 50, 100, 250]

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isUpSwipe = distance > 50
    const isDownSwipe = distance < -50

    if (isUpSwipe && !isExpanded) {
      setIsExpanded(true)
    } else if (isDownSwipe && isExpanded) {
      setIsExpanded(false)
    }
  }

  // Haptic feedback for touch interactions
  const triggerHaptic = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(10)
    }
  }

  const handleAmountSelect = (amount: number) => {
    triggerHaptic()
    setSelectedAmount(amount)
    setCustomAmount("")
  }

  const handleDonate = () => {
    triggerHaptic()
    setShowPayment(true)
  }

  return (
    <>
      <Card
        ref={widgetRef}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border-0 shadow-2xl bg-card transition-all duration-300 ease-out",
          isExpanded ? "h-[85vh]" : "h-32",
          className,
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
        </div>

        <CardContent className="p-4 h-full overflow-hidden">
          {/* Collapsed View */}
          <div className={cn("transition-opacity duration-200", isExpanded && "opacity-0 pointer-events-none")}>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate text-foreground">{title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{Math.round(progress)}%</span>
                </div>
              </div>
              <Button
                size="sm"
                className="ml-3 h-8 px-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => setIsExpanded(true)}
              >
                Donate
              </Button>
            </div>
          </div>

          {/* Expanded View */}
          <div
            className={cn(
              "absolute inset-4 transition-all duration-300",
              !isExpanded && "opacity-0 pointer-events-none translate-y-4",
            )}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-foreground mb-1">{title}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 -mr-2" onClick={() => setIsExpanded(false)}>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-foreground">${currentAmount.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">of ${goalAmount.toLocaleString()}</span>
                </div>

                <div className="relative bg-muted rounded-full h-3 mb-3">
                  <div
                    className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{supporterCount} supporters</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Target className="h-4 w-4" />
                    <span>{Math.round(progress)}% complete</span>
                  </div>
                </div>
              </div>

              {/* Amount Selection */}
              <div className="flex-1 overflow-y-auto">
                <h3 className="font-semibold mb-3 text-foreground">Choose Amount</h3>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {suggestedAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? "default" : "outline"}
                      className={cn(
                        "h-12 text-base font-semibold transition-all duration-200",
                        selectedAmount === amount
                          ? "bg-primary text-primary-foreground shadow-lg scale-105"
                          : "hover:scale-105 active:scale-95",
                      )}
                      onClick={() => handleAmountSelect(amount)}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>

                <div className="mb-6">
                  <Input
                    type="number"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setSelectedAmount(null)
                    }}
                    className="h-12 text-base text-center border-2 focus:border-primary"
                  />
                </div>
              </div>

              {/* Donate Button */}
              <Button
                className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl active:scale-95 transition-all duration-200"
                disabled={!selectedAmount && !customAmount}
                onClick={handleDonate}
              >
                <Heart className="w-5 h-5 mr-2" />
                Donate {selectedAmount ? `$${selectedAmount}` : customAmount ? `$${customAmount}` : ""}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-[60] bg-background">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Complete Donation</h2>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowPayment(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-4">
            {/* Payment form would go here */}
            <div className="text-center py-8">
              <p className="text-muted-foreground">Payment form integration would go here</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
