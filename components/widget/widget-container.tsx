"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ProgressSteps } from "@/components/ui/progress-steps"
import { Search, Heart, Mail, CheckCircle, ArrowRight, Play, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EnhancedDonationFlow } from "./enhanced-donation-flow"

interface Organization {
  id: string
  name: string
  slug: string
  primaryColor: string
  secondaryColor: string
  logo: string
  accentColor?: string
  textColor?: string
  headingFont?: string
  bodyFont?: string
  fontSize?: string
  widgetStyle?: string
  borderRadius?: string
  shadow?: string
  customCSS?: string
  whiteLabel?: boolean
}

interface WidgetContainerProps {
  organization: Organization
}

export function WidgetContainer({ organization }: WidgetContainerProps) {
  const [searchCode, setSearchCode] = useState("")
  const [currentStep, setCurrentStep] = useState<"search" | "story" | "subscribe" | "donate" | "success">("search")
  const [selectedNmbr, setSelectedNmbr] = useState<any>(null)
  const [subscriberData, setSubscriberData] = useState({ email: "", firstName: "", lastName: "" })
  const [donationAmount, setDonationAmount] = useState("")
  const [showVideo, setShowVideo] = useState(false)

  const getProgressSteps = () => {
    const steps = [
      {
        id: "search",
        title: "Search",
        description: "Find your NMBR",
        status:
          currentStep === "search"
            ? "current"
            : ["story", "subscribe", "donate", "success"].includes(currentStep)
              ? "completed"
              : "upcoming",
      },
      {
        id: "story",
        title: "Discover",
        description: "Read the story",
        status:
          currentStep === "story"
            ? "current"
            : ["subscribe", "donate", "success"].includes(currentStep)
              ? "completed"
              : "upcoming",
      },
      {
        id: "connect",
        title: "Connect",
        description: "Subscribe or donate",
        status: ["subscribe", "donate"].includes(currentStep)
          ? "current"
          : currentStep === "success"
            ? "completed"
            : "upcoming",
      },
      {
        id: "success",
        title: "Complete",
        description: "Thank you!",
        status: currentStep === "success" ? "completed" : "upcoming",
      },
    ]
    return steps
  }

  // Mock NMBR data - in real app this would come from API
  const mockNmbrs = {
    HOPE001: {
      id: "1",
      code: "HOPE001",
      title: "Clean Water for Village",
      story:
        "This bracelet represents our mission to bring clean water to a remote village in Kenya. Every donation helps us get closer to installing a sustainable water system that will serve 500 families. The community has been walking 3 miles daily to fetch water from an unsafe source. With your help, we can change their lives forever.",
      image: "/water-well-village.jpg",
      video: "https://example.com/water-project-video.mp4",
      goal: 5000,
      raised: 3250,
      subscribers: 89,
      status: "active",
    },
    HOPE002: {
      id: "2",
      code: "HOPE002",
      title: "School Supplies Drive",
      story:
        "Education is the key to breaking the cycle of poverty. This NMBR supports our school supplies drive, providing books, pencils, and learning materials to children in underserved communities. Over 200 children are waiting for basic school supplies to continue their education.",
      image: "/school-children-books.jpg",
      goal: 3000,
      raised: 4800,
      subscribers: 156,
      status: "completed",
    },
  }

  const handleSearch = () => {
    const nmbr = mockNmbrs[searchCode.toUpperCase() as keyof typeof mockNmbrs]
    if (nmbr) {
      setSelectedNmbr(nmbr)
      setCurrentStep("story")
    } else {
      alert("NMBR code not found. Please check the code and try again.")
    }
  }

  const handleSubscribe = () => {
    // In real app, this would call API to subscribe user
    console.log("Subscribing:", subscriberData, "to NMBR:", selectedNmbr?.code)
    setCurrentStep("donate")
  }

  const handleDonate = () => {
    // In real app, this would integrate with Stripe
    console.log("Processing donation:", donationAmount, "for NMBR:", selectedNmbr?.code)
    setCurrentStep("success")
  }

  const resetWidget = () => {
    setCurrentStep("search")
    setSelectedNmbr(null)
    setSearchCode("")
    setSubscriberData({ email: "", firstName: "", lastName: "" })
    setDonationAmount("")
  }

  const getWidgetStyles = () => {
    const borderRadiusMap = {
      none: "0px",
      small: "4px",
      medium: "8px",
      large: "16px",
    }

    const shadowMap = {
      none: "none",
      small: "0 1px 3px rgba(0,0,0,0.1)",
      medium: "0 4px 12px rgba(0,0,0,0.1)",
      large: "0 8px 24px rgba(0,0,0,0.15)",
    }

    return {
      borderRadius: borderRadiusMap[organization.borderRadius as keyof typeof borderRadiusMap] || "12px",
      boxShadow: shadowMap[organization.shadow as keyof typeof shadowMap] || "0 8px 32px rgba(0,0,0,0.12)",
      fontFamily: organization.bodyFont || "Inter",
      color: organization.textColor || "#334155",
    }
  }

  const getHeadingStyles = () => ({
    fontFamily: organization.headingFont || "Inter",
    color: organization.textColor || "#0f172a",
  })

  return (
    <div className="max-w-md mx-auto">
      {organization.customCSS && <style dangerouslySetInnerHTML={{ __html: organization.customCSS }} />}

      <Card
        className="border-0 bg-white/95 backdrop-blur-sm"
        style={{
          borderTop: `4px solid ${organization.primaryColor}`,
          ...getWidgetStyles(),
        }}
      >
        {/* Header */}
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm">
              <img
                src={organization.logo || "/placeholder.svg"}
                alt={organization.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-lg" style={getHeadingStyles()}>
              {organization.name}
            </span>
          </div>
          <CardTitle className="text-2xl font-bold mb-2" style={getHeadingStyles()}>
            Find Your NMBR Story
          </CardTitle>
          <CardDescription className="text-base leading-relaxed" style={{ color: organization.textColor || "#64748b" }}>
            Enter your bracelet code to discover the story behind it
          </CardDescription>
        </CardHeader>

        {currentStep !== "search" && (
          <div className="px-6 pb-6">
            <ProgressSteps steps={getProgressSteps()} className="mb-2" />
          </div>
        )}

        <CardContent className="space-y-6">
          {/* Search Step */}
          {currentStep === "search" && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="nmbr-code" className="text-sm font-medium" style={{ color: organization.textColor }}>
                  NMBR Code
                </Label>
                <div className="flex space-x-3">
                  <Input
                    id="nmbr-code"
                    placeholder="e.g., HOPE001"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    className="uppercase font-mono text-center text-lg h-12 border-2 focus:ring-2 transition-all duration-200"
                    style={{
                      borderColor: organization.secondaryColor || "#e2e8f0",
                      "--tw-ring-color": `${organization.primaryColor}20`,
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button
                    onClick={handleSearch}
                    className="h-12 px-6 shadow-lg hover:shadow-xl transition-all duration-200"
                    style={{ backgroundColor: organization.primaryColor }}
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-sm leading-relaxed" style={{ color: organization.textColor || "#64748b" }}>
                  Look for the code on your bracelet and enter it above to discover your story
                </p>
              </div>
            </div>
          )}

          {/* Story Step */}
          {currentStep === "story" && selectedNmbr && (
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={selectedNmbr.image || "/placeholder.svg?height=200&width=400"}
                  alt={selectedNmbr.title}
                  className="w-full h-52 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {selectedNmbr.video && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-3 right-3 shadow-lg backdrop-blur-sm bg-white/90"
                    onClick={() => setShowVideo(true)}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Video
                  </Button>
                )}
                <Badge
                  className="absolute top-3 left-3 shadow-lg font-mono font-bold"
                  style={{ backgroundColor: organization.primaryColor }}
                >
                  {selectedNmbr.code}
                </Badge>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold leading-tight" style={getHeadingStyles()}>
                  {selectedNmbr.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: organization.textColor || "#64748b" }}>
                  {selectedNmbr.story}
                </p>
              </div>

              {selectedNmbr.status === "active" && (
                <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium" style={{ color: organization.textColor || "#64748b" }}>
                      Progress
                    </span>
                    <span className="font-bold" style={{ color: organization.textColor }}>
                      ${selectedNmbr.raised.toLocaleString()} / ${selectedNmbr.goal.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={(selectedNmbr.raised / selectedNmbr.goal) * 100} className="h-3" />
                  <div className="text-xs font-medium" style={{ color: organization.textColor || "#94a3b8" }}>
                    {Math.round((selectedNmbr.raised / selectedNmbr.goal) * 100)}% of goal reached •{" "}
                    {selectedNmbr.subscribers} supporters
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("subscribe")}
                  className="flex-1 h-12 border-2 hover:shadow-md transition-all duration-200"
                  style={{
                    borderColor: organization.primaryColor,
                    color: organization.primaryColor,
                  }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Get Updates
                </Button>
                {selectedNmbr.status === "active" && (
                  <Button
                    onClick={() => setCurrentStep("donate")}
                    className="flex-1 h-12 shadow-lg hover:shadow-xl transition-all duration-200"
                    style={{ backgroundColor: organization.primaryColor }}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Donate
                  </Button>
                )}
              </div>

              <Button
                variant="ghost"
                onClick={resetWidget}
                className="w-full text-sm hover:bg-slate-50 transition-all duration-200"
                style={{ color: organization.textColor || "#64748b" }}
              >
                Search Another NMBR
              </Button>
            </div>
          )}

          {/* Subscribe Step */}
          {currentStep === "subscribe" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold" style={getHeadingStyles()}>
                  Stay Connected
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: organization.textColor || "#64748b" }}>
                  Get updates about <strong>{selectedNmbr?.title}</strong> and see the impact of your support
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium"
                      style={{ color: organization.textColor }}
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={subscriberData.firstName}
                      onChange={(e) => setSubscriberData({ ...subscriberData, firstName: e.target.value })}
                      className="h-11 border-2 focus:ring-2 transition-all duration-200"
                      style={{
                        borderColor: organization.secondaryColor || "#e2e8f0",
                        "--tw-ring-color": `${organization.primaryColor}20`,
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium" style={{ color: organization.textColor }}>
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={subscriberData.lastName}
                      onChange={(e) => setSubscriberData({ ...subscriberData, lastName: e.target.value })}
                      className="h-11 border-2 focus:ring-2 transition-all duration-200"
                      style={{
                        borderColor: organization.secondaryColor || "#e2e8f0",
                        "--tw-ring-color": `${organization.primaryColor}20`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium" style={{ color: organization.textColor }}>
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={subscriberData.email}
                    onChange={(e) => setSubscriberData({ ...subscriberData, email: e.target.value })}
                    className="h-11 border-2 focus:ring-2 transition-all duration-200"
                    style={{
                      borderColor: organization.secondaryColor || "#e2e8f0",
                      "--tw-ring-color": `${organization.primaryColor}20`,
                    }}
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("story")}
                  className="flex-1 h-12 border-2 hover:bg-slate-50 transition-all duration-200"
                  style={{ borderColor: organization.secondaryColor, color: organization.textColor }}
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubscribe}
                  className="flex-1 h-12 shadow-lg hover:shadow-xl transition-all duration-200"
                  style={{ backgroundColor: organization.primaryColor }}
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Enhanced Donate Step */}
          {currentStep === "donate" && (
            <EnhancedDonationFlow
              organization={organization}
              selectedNmbr={selectedNmbr}
              onSuccess={() => setCurrentStep("success")}
              onBack={() => setCurrentStep("story")}
            />
          )}

          {/* Success Step */}
          {currentStep === "success" && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold" style={getHeadingStyles()}>
                  Thank You!
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: organization.textColor || "#64748b" }}>
                  Your support means the world to us. You'll receive updates about the impact of your contribution to{" "}
                  <strong>{selectedNmbr?.title}</strong>.
                </p>
              </div>
              <Button
                onClick={resetWidget}
                className="w-full h-12 shadow-lg hover:shadow-xl transition-all duration-200"
                style={{ backgroundColor: organization.primaryColor }}
              >
                Search Another NMBR
              </Button>

              {!organization.whiteLabel && (
                <p className="text-xs" style={{ color: organization.textColor || "#94a3b8" }}>
                  Powered by NMBR Platform
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Video Modal */}
      <Dialog open={showVideo} onOpenChange={setShowVideo}>
        <DialogContent className="max-w-2xl border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold" style={getHeadingStyles()}>
              {selectedNmbr?.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-4 hover:bg-slate-100"
              onClick={() => setShowVideo(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogHeader>
          <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center">
            <p className="text-slate-500">Video player would be embedded here</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
