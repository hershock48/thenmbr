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

const getDonationContext = (orgType: "nonprofit" | "grassroots" | "business" = "nonprofit") => {
  const contexts = {
    nonprofit: {
      actionLabel: "Donate",
      actionVerb: "donated",
      supportLabel: "supporters",
      impactTitle: "Your Impact",
      followLabel: "Follow Story",
      donateLabel: "Donate & Follow Story",
      connectionTitle: "Stay Connected to Your Story",
      connectionDescription:
        "Get exclusive updates - see how your support is making a real difference in someone's life.",
      benefitsList: [
        "• Exclusive updates on this specific story's progress",
        "• Photos and videos showing your impact in action",
        "• Milestone celebrations when goals are reached",
        "• Direct connection to the person you're helping",
      ],
      urgencyMessage: "left to reach our goal!",
      recentActivity: "Recent Donations",
    },
    grassroots: {
      actionLabel: "Support",
      actionVerb: "contributed",
      supportLabel: "supporters",
      impactTitle: "Your Community Impact",
      followLabel: "Follow Project",
      donateLabel: "Support & Follow Project",
      connectionTitle: "Stay Connected to Your Project",
      connectionDescription: "Get exclusive updates - see how your community support is building something amazing.",
      benefitsList: [
        "• Exclusive updates on this community project's progress",
        "• Photos and videos of the project in action",
        "• Milestone celebrations when goals are reached",
        "• Direct connection to your local community impact",
      ],
      urgencyMessage: "left to complete our community goal!",
      recentActivity: "Recent Community Support",
    },
    business: {
      actionLabel: "Contribute",
      actionVerb: "contributed",
      supportLabel: "customers",
      impactTitle: "Your Purchase Impact",
      followLabel: "Follow Impact",
      donateLabel: "Contribute & Follow Impact",
      connectionTitle: "Track Your Impact Story",
      connectionDescription: "Get exclusive updates - see how your purchase is creating positive change in the world.",
      benefitsList: [
        "• Exclusive updates on this impact story's progress",
        "• Photos and videos showing change in action",
        "• Milestone celebrations when goals are reached",
        "• Direct connection to the positive change you're creating",
      ],
      urgencyMessage: "left to reach our impact goal!",
      recentActivity: "Recent Customer Contributions",
    },
  }
  return contexts[orgType]
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

  const context = getDonationContext(organization.organizationType)

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
    const impactMaps = {
      nonprofit: {
        15: "Provides clean water for 1 family for 1 week",
        25: "Supplies school materials for 2 children",
        35: "Funds medical supplies for 5 patients",
        50: "Supports 1 family's basic needs for 1 month",
        75: "Provides educational resources for 10 students",
        100: "Funds clean water access for 2 families permanently",
      },
      grassroots: {
        15: "Supports 1 community garden plot for 1 month",
        25: "Funds materials for 2 community workshops",
        35: "Provides supplies for 5 local volunteers",
        50: "Supports 1 community event for 100 people",
        75: "Funds equipment for 10 community members",
        100: "Supports 2 community projects permanently",
      },
      business: {
        15: "Plants 3 trees through our reforestation partner",
        25: "Provides 5 meals through our food security program",
        35: "Funds clean energy for 1 household for 1 month",
        50: "Supports 1 entrepreneur in developing communities",
        75: "Provides educational resources for 10 students",
        100: "Funds sustainable livelihood for 2 families",
      },
    }

    const impactMap = impactMaps[organization.organizationType || "nonprofit"]
    const closestAmount = Object.keys(impactMap).reduce((prev, curr) =>
      Math.abs(Number(curr) - amount) < Math.abs(Number(prev) - amount) ? curr : prev,
    )

    return impactMap[closestAmount as keyof typeof impactMap] || "Makes a meaningful impact"
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

  const handleSubscribe = async () => {
    try {
      // Subscribe the user to the story
      const subscriptionResponse = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: subscriberData.email,
          firstName: subscriberData.firstName,
          lastName: subscriberData.lastName || "",
          storyId: selectedNmbr.id,
          orgId: organization.id,
          source: "widget",
        }),
      })

      const subscriptionResult = await subscriptionResponse.json()

      if (!subscriptionResult.success) {
        throw new Error(subscriptionResult.error || "Failed to subscribe to story updates")
      }

      // Show success message
      alert("Successfully subscribed! You'll receive updates about this story.")
      onSuccess()
    } catch (error) {
      console.error("Subscription error:", error)
      alert("There was an error subscribing you. Please try again.")
    }
  }

  const handleDonate = async () => {
    try {
      // First, subscribe the user to the story
      const subscriptionResponse = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: subscriberData.email,
          firstName: subscriberData.firstName,
          lastName: subscriberData.lastName || "",
          storyId: selectedNmbr.id,
          orgId: organization.id,
          source: "widget",
        }),
      })

      const subscriptionResult = await subscriptionResponse.json()

      if (!subscriptionResult.success) {
        throw new Error(subscriptionResult.error || "Failed to subscribe to story updates")
      }

      // Then process the donation
      console.log("Processing donation:", {
        amount: donationAmount,
        paymentMethod,
        subscriber: subscriberData,
        nmbrId: selectedNmbr.id,
        subscriptionId: subscriptionResult.subscriber.id,
      })

      // Simulate donation processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real implementation, this would integrate with Stripe
      // and update the subscriber's donation stats

      onSuccess()
    } catch (error) {
      console.error("Donation error:", error)
      alert("There was an error processing your donation. Please try again.")
    }
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
            <h3 className="font-semibold text-orange-900">
              Only ${remaining.toLocaleString()} {context.urgencyMessage}
            </h3>
            <p className="text-sm text-orange-700">
              {Math.round(100 - progress)}% remaining • {selectedNmbr.subscribers} {context.supportLabel}
            </p>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span className="font-medium text-slate-900">{context.recentActivity}</span>
        </div>
        <div className="space-y-2">
          {recentDonors.map((donor, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-slate-700">
                {donor.name} {context.actionVerb} ${donor.amount}
              </span>
              <span className="text-slate-500">{donor.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Combined Subscribe + Donate Form */}
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-cyan-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{context.connectionTitle}</h3>
          <p className="text-base text-slate-600 max-w-md mx-auto">
            Get exclusive updates on <strong>{selectedNmbr.title}</strong> -{" "}
            {context.connectionDescription.split(" - ")[1]}
          </p>
          <div className="bg-gradient-to-r from-cyan-50 to-purple-50 border border-cyan-200 rounded-xl p-4">
            <div className="flex items-center justify-center gap-2 text-sm text-cyan-700 font-medium">
              <Users className="w-4 h-4" />
              <span>
                {selectedNmbr.subscribers} people are already following this{" "}
                {organization.organizationType === "grassroots" ? "project" : "story"}
              </span>
            </div>
          </div>
        </div>

        {/* Subscription Benefits */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
          <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
            <Gift className="w-4 h-4" />
            What you'll get as a subscriber:
          </h3>
          <ul className="text-sm text-green-700 space-y-1">
            {context.benefitsList.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold text-slate-900 mb-1">Join the Story</h3>
            <p className="text-sm text-slate-600">
              We'll send you updates about this specific story, not general newsletters
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">
                Your First Name
              </Label>
              <Input
                id="firstName"
                value={subscriberData.firstName}
                onChange={(e) => setSubscriberData({ ...subscriberData, firstName: e.target.value })}
                placeholder="Enter your name"
                className="h-11 border-2 focus:ring-2 transition-all duration-200"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={subscriberData.email}
                onChange={(e) => setSubscriberData({ ...subscriberData, email: e.target.value })}
                placeholder="your@email.com"
                className="h-11 border-2 focus:ring-2 transition-all duration-200"
              />
            </div>
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
                <h3 className="font-semibold text-green-900">
                  {context.impactTitle}: ${donationAmount}
                </h3>
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
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-slate-600">
              Choose how you'd like to support this{" "}
              {organization.organizationType === "grassroots" ? "project" : "story"}
            </p>
          </div>

          {/* Subscribe Only Button */}
          <Button
            onClick={handleSubscribe}
            variant="outline"
            className="w-full h-12 border-2 hover:bg-slate-50 transition-all duration-200 bg-transparent"
            disabled={!subscriberData.email || !subscriberData.firstName}
            style={{ borderColor: organization.primaryColor, color: organization.primaryColor }}
          >
            <Heart className="w-4 h-4 mr-2" />
            {context.followLabel} (Free Updates)
          </Button>

          {/* Donate Button */}
          <Button
            onClick={handleDonate}
            className="w-full h-12 shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={!donationAmount || !subscriberData.email || !subscriberData.firstName}
            style={{ backgroundColor: organization.primaryColor }}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            {context.actionLabel} ${donationAmount} & {context.followLabel}
          </Button>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onBack} className="flex-1 h-10 border-2 bg-transparent">
              Back
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-slate-500">
              You can unsubscribe anytime. We only send updates about{" "}
              {organization.organizationType === "grassroots" ? "projects" : "stories"} you're following.
            </p>
          </div>
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
