"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Heart,
  DollarSign,
  Shield,
  Clock,
  Users,
  Zap,
  CreditCard,
  Smartphone,
  X,
  TrendingUp,
  Gift,
  Star,
} from "lucide-react"

interface DonationFlowProps {
  organization: any
  selectedNmbr: any
  onSuccess: () => void
  onBack: () => void
}

export function EnhancedDonationFlow({ organization, selectedNmbr, onSuccess, onBack }: DonationFlowProps) {
  const [donationAmount, setDonationAmount] = useState("")
  const [subscriberData, setSubscriberData] = useState({ email: "", firstName: "" })
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "apple" | "google">("card")
  const [showExitIntent, setShowExitIntent] = useState(false)
  const [recentDonors] = useState([
    { name: "Sarah M.", amount: 50, time: "2 minutes ago" },
    { name: "Michael R.", amount: 25, time: "5 minutes ago" },
    { name: "Jennifer L.", amount: 100, time: "8 minutes ago" },
  ])

  const getSmartAmounts = () => {
    const remaining = selectedNmbr.goal - selectedNmbr.raised
    const progress = (selectedNmbr.raised / selectedNmbr.goal) * 100

    if (progress > 90) {
      // Close to goal - suggest amounts that could complete it
      return [Math.min(remaining, 25), Math.min(remaining, 50), remaining]
    } else if (progress > 50) {
      // Halfway there - suggest moderate amounts
      return [25, 50, 100]
    } else {
      // Early stage - suggest various amounts
      return [15, 35, 75]
    }
  }

  const getImpactMessage = (amount: number) => {
    const impactMap = {
      15: "Provides clean water for 1 family for 1 week",
      25: "Supplies school materials for 2 children",
      35: "Funds medical supplies for 5 patients",
      50: "Supports 1 family's basic needs for 1 month",
      75: "Provides educational resources for 10 students",
      100: "Funds clean water access for 2 families permanently",
    }

    const closestAmount = Object.keys(impactMap).reduce((prev, curr) =>
      Math.abs(Number(curr) - amount) < Math.abs(Number(prev) - amount) ? curr : prev,
    )

    return impactMap[closestAmount as keyof typeof impactMap] || "Makes a meaningful impact on lives"
  }

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !showExitIntent) {
        setShowExitIntent(true)
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)
    return () => document.removeEventListener("mouseleave", handleMouseLeave)
  }, [showExitIntent])

  const handleDonate = async () => {
    // Process donation with selected payment method
    console.log("Processing donation:", {
      amount: donationAmount,
      paymentMethod,
      subscriber: subscriberData,
      nmbrId: selectedNmbr.id,
    })

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    onSuccess()
  }

  const smartAmounts = getSmartAmounts()
  const remaining = selectedNmbr.goal - selectedNmbr.raised
  const progress = (selectedNmbr.raised / selectedNmbr.goal) * 100

  return (
    <div className="space-y-6">
      {/* Urgency Header */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <h4 className="font-semibold text-orange-900">
              Only ${remaining.toLocaleString()} left to reach our goal!
            </h4>
            <p className="text-sm text-orange-700">
              {Math.round(100 - progress)}% remaining • {selectedNmbr.subscribers} supporters
            </p>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span className="font-medium text-slate-900">Recent Support</span>
        </div>
        <div className="space-y-2">
          {recentDonors.map((donor, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-slate-700">
                {donor.name} donated ${donor.amount}
              </span>
              <span className="text-slate-500">{donor.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Combined Subscribe + Donate Form */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-slate-900">Support {selectedNmbr.title}</h3>
          <p className="text-sm text-slate-600">Get updates and make a donation in one step</p>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">
              First Name
            </Label>
            <Input
              id="firstName"
              value={subscriberData.firstName}
              onChange={(e) => setSubscriberData({ ...subscriberData, firstName: e.target.value })}
              className="h-11 border-2 focus:ring-2 transition-all duration-200"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={subscriberData.email}
              onChange={(e) => setSubscriberData({ ...subscriberData, email: e.target.value })}
              className="h-11 border-2 focus:ring-2 transition-all duration-200"
            />
          </div>
        </div>

        {/* Smart Donation Amounts */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">Choose Amount</Label>
          <div className="grid grid-cols-3 gap-3">
            {smartAmounts.map((amount, index) => (
              <Button
                key={amount}
                variant={donationAmount === amount.toString() ? "default" : "outline"}
                onClick={() => setDonationAmount(amount.toString())}
                className="h-16 flex flex-col items-center justify-center border-2 transition-all duration-200"
                style={
                  donationAmount === amount.toString()
                    ? { backgroundColor: organization.primaryColor }
                    : { borderColor: organization.primaryColor, color: organization.primaryColor }
                }
              >
                <span className="text-lg font-bold">${amount}</span>
                {index === smartAmounts.length - 1 && progress > 90 && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    Completes Goal!
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          <div>
            <Input
              type="number"
              placeholder="Custom amount"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              className="h-11 border-2 focus:ring-2 transition-all duration-200"
            />
          </div>
        </div>

        {/* Impact Visualization */}
        {donationAmount && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-900">Your ${donationAmount} Impact</h4>
                <p className="text-sm text-green-700">{getImpactMessage(Number(donationAmount))}</p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">Payment Method</Label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={paymentMethod === "card" ? "default" : "outline"}
              onClick={() => setPaymentMethod("card")}
              className="h-12 border-2"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Card
            </Button>
            <Button
              variant={paymentMethod === "paypal" ? "default" : "outline"}
              onClick={() => setPaymentMethod("paypal")}
              className="h-12 border-2"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              PayPal
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={paymentMethod === "apple" ? "default" : "outline"}
              onClick={() => setPaymentMethod("apple")}
              className="h-12 border-2"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Apple Pay
            </Button>
            <Button
              variant={paymentMethod === "google" ? "default" : "outline"}
              onClick={() => setPaymentMethod("google")}
              className="h-12 border-2"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Google Pay
            </Button>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="flex items-center justify-center gap-4 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            <span>4.9/5 Trust Rating</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>10k+ Donors</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onBack} className="flex-1 h-12 border-2 bg-transparent">
            Back
          </Button>
          <Button
            onClick={handleDonate}
            className="flex-1 h-12 shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={!donationAmount || !subscriberData.email}
            style={{ backgroundColor: organization.primaryColor }}
          >
            <Zap className="w-4 h-4 mr-2" />
            Donate ${donationAmount}
          </Button>
        </div>
      </div>

      {/* Exit Intent Modal */}
      <Dialog open={showExitIntent} onOpenChange={setShowExitIntent}>
        <DialogContent className="max-w-md border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">Wait! Don't Leave Yet</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-4"
              onClick={() => setShowExitIntent(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center">
              <Gift className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Special Offer: 50% Matching</h3>
              <p className="text-sm text-slate-600 mb-4">
                A generous donor will match your contribution up to $50. Your impact doubles!
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setShowExitIntent(false)} className="flex-1">
                Maybe Later
              </Button>
              <Button
                onClick={() => {
                  setDonationAmount("25")
                  setShowExitIntent(false)
                }}
                className="flex-1"
                style={{ backgroundColor: organization.primaryColor }}
              >
                Claim Match
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
