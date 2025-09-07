"use client"

import { useState, useEffect } from "react"
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
  const [currentStep, setCurrentStep] = useState<"search" | "story" | "donate" | "success">("search")
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
        status: currentStep === "donate"
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

  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch stories from API
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch(`/api/stories?org=${organization.id}`)
        const data = await response.json()
        if (data.stories) {
          setStories(data.stories)
        }
      } catch (error) {
        console.error('Error fetching stories:', error)
      }
    }
    fetchStories()
  }, [organization.id])

  const handleSearch = async () => {
    if (!searchCode.trim()) {
      alert("Please enter a NMBR code")
      return
    }

    setLoading(true)
    try {
      // Find story by NMBR code
      const story = stories.find(s => s.nmbr_code === searchCode.trim())
      if (story) {
        // Transform the story data to match the expected format
        const transformedStory = {
          id: story.id,
          code: story.nmbr_code,
          title: story.title,
          story: story.description,
          image: story.photo_url,
          goal: story.goal_amount,
          raised: story.current_amount,
          subscribers: 0, // This would come from subscribers count
          status: story.status,
        }
        setSelectedNmbr(transformedStory)
        setCurrentStep("story")
      } else {
        alert("NMBR code not found. Please check the code and try again.")
      }
    } catch (error) {
      console.error('Error searching for NMBR:', error)
      alert("Error searching for NMBR. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async () => {
    try {
      // Subscribe the user to the story
      const subscriptionResponse = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: subscriberData.email,
          firstName: subscriberData.firstName,
          lastName: subscriberData.lastName || '',
          storyId: selectedNmbr.id,
          orgId: organization.id,
          source: 'widget'
        })
      })

      const subscriptionResult = await subscriptionResponse.json()
      
      if (!subscriptionResult.success) {
        throw new Error(subscriptionResult.error || 'Failed to subscribe to story updates')
      }

      // Show success message
      alert('Successfully subscribed! You\'ll receive updates about this story.')
      setCurrentStep("success")
    } catch (error) {
      console.error('Subscription error:', error)
      alert('There was an error subscribing you. Please try again.')
    }
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
                    disabled={loading}
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

              {/* Subscription Form */}
              <div className="space-y-4 p-4 bg-gradient-to-r from-cyan-50 to-purple-50 border border-cyan-200 rounded-xl">
                <div className="text-center space-y-2">
                  <h4 className="font-semibold text-slate-900">Stay Connected to Your Story</h4>
                  <p className="text-sm text-slate-600">
                    Get exclusive updates on <strong>{selectedNmbr.title}</strong> - see how your support is making a real difference.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={subscriberData.firstName}
                        onChange={(e) => setSubscriberData({ ...subscriberData, firstName: e.target.value })}
                        placeholder="Your name"
                        className="h-10 border-2 focus:ring-2 transition-all duration-200"
                        style={{
                          borderColor: organization.secondaryColor || "#e2e8f0",
                          "--tw-ring-color": `${organization.primaryColor}20`,
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={subscriberData.lastName}
                        onChange={(e) => setSubscriberData({ ...subscriberData, lastName: e.target.value })}
                        placeholder="Last name"
                        className="h-10 border-2 focus:ring-2 transition-all duration-200"
                        style={{
                          borderColor: organization.secondaryColor || "#e2e8f0",
                          "--tw-ring-color": `${organization.primaryColor}20`,
                        }}
                      />
                    </div>
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
                      className="h-10 border-2 focus:ring-2 transition-all duration-200"
                      style={{
                        borderColor: organization.secondaryColor || "#e2e8f0",
                        "--tw-ring-color": `${organization.primaryColor}20`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleSubscribe}
                    variant="outline"
                    className="flex-1 h-10 border-2 hover:bg-slate-50 transition-all duration-200"
                    disabled={!subscriberData.email || !subscriberData.firstName}
                    style={{ borderColor: organization.primaryColor, color: organization.primaryColor }}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Follow Story (Free)
                  </Button>
                  {selectedNmbr.status === "active" && (
                    <Button
                      onClick={() => setCurrentStep("donate")}
                      className="flex-1 h-10 shadow-lg hover:shadow-xl transition-all duration-200"
                      style={{ backgroundColor: organization.primaryColor }}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Donate & Follow
                    </Button>
                  )}
                </div>
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
