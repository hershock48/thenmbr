"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ProgressSteps } from "@/components/ui/progress-steps"
import { Search, Heart, Mail, CheckCircle, Play, X, Users, Clock, TrendingUp, Zap, Star, Gift } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EnhancedDonationFlow } from "./enhanced-donation-flow"
import { ValidatedInput, useFormValidation } from "@/components/ui/validated-input"
import { VALIDATION_SCHEMAS } from "@/lib/validation"

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
  
  // Form validation
  const subscriptionForm = useFormValidation(VALIDATION_SCHEMAS.subscription)
  const searchForm = useFormValidation(VALIDATION_SCHEMAS.nmbrSearch)
  const [donationAmount, setDonationAmount] = useState("")
  const [showVideo, setShowVideo] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stories, setStories] = useState<any[]>([])

  const [recentActivity, setRecentActivity] = useState([
    { name: "Sarah M.", action: "donated $50", time: "2 min ago", avatar: "SM" },
    { name: "Michael R.", action: "subscribed", time: "5 min ago", avatar: "MR" },
    { name: "Jennifer L.", action: "donated $100", time: "8 min ago", avatar: "JL" },
  ])
  const [totalSupporters, setTotalSupporters] = useState(1247)
  const [urgencyTimer, setUrgencyTimer] = useState(86400) // 24 hours in seconds
  const [showUrgencyBanner, setShowUrgencyBanner] = useState(true)
  const [animateProgress, setAnimateProgress] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setUrgencyTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const activityTimer = setInterval(() => {
      const activities = [
        { name: "Alex K.", action: "donated $25", time: "just now", avatar: "AK" },
        { name: "Maria S.", action: "subscribed", time: "1 min ago", avatar: "MS" },
        { name: "David L.", action: "donated $75", time: "2 min ago", avatar: "DL" },
        { name: "Emma W.", action: "donated $50", time: "3 min ago", avatar: "EW" },
      ]
      const randomActivity = activities[Math.floor(Math.random() * activities.length)]
      setRecentActivity((prev) => [randomActivity, ...prev.slice(0, 2)])
      setTotalSupporters((prev) => prev + 1)
    }, 15000) // New activity every 15 seconds

    return () => clearInterval(activityTimer)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getProgressSteps = () => {
    const steps = [
      {
        id: "search",
        title: "Search",
        description: "Find your NMBR",
        status:
          currentStep === "search"
            ? "current" as const
            : ["story", "subscribe", "donate", "success"].includes(currentStep)
              ? "completed" as const
              : "upcoming" as const,
      },
      {
        id: "story",
        title: "Discover",
        description: "Read the story",
        status:
          currentStep === "story"
            ? "current" as const
            : ["subscribe", "donate", "success"].includes(currentStep)
              ? "completed" as const
              : "upcoming" as const,
      },
      {
        id: "connect",
        title: "Connect",
        description: "Subscribe or donate",
        status: currentStep === "donate" ? "current" as const : currentStep === "success" ? "completed" as const : "upcoming" as const,
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
        console.error("Error fetching stories:", error)
      }
    }
    fetchStories()
  }, [organization.id])

  const handleSearch = async () => {
    // Validate search form before searching
    const isValid = await searchForm.validateForm()
    if (!isValid) {
      return
    }

    setLoading(true)
    try {
      // Find story by NMBR code
      const story = stories.find((s) => s.nmbr_code === searchCode.trim())
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
        setTimeout(() => setAnimateProgress(true), 500)
      } else {
        alert("NMBR code not found. Please check the code and try again.")
      }
    } catch (error) {
      console.error("Error searching for NMBR:", error)
      alert("Error searching for NMBR. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async () => {
    // Validate form before submitting
    const isValid = await subscriptionForm.validateForm()
    if (!isValid) {
      return
    }

    setLoading(true)
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
      setCurrentStep("success")
    } catch (error) {
      console.error("Subscription error:", error)
      alert("There was an error subscribing you. Please try again.")
    } finally {
      setLoading(false)
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
    setAnimateProgress(false)
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

      {showUrgencyBanner && urgencyTimer > 0 && (
        <div className="mb-4 bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-lg shadow-lg animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-semibold">Limited Time: Double Impact!</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 h-6 w-6 p-0"
              onClick={() => setShowUrgencyBanner(false)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          <div className="text-xs mt-1">All donations matched for the next {formatTime(urgencyTimer)}</div>
        </div>
      )}

      <Card
        className="border-0 bg-white/95 backdrop-blur-sm overflow-hidden"
        style={{
          borderTop: `4px solid ${organization.primaryColor}`,
          ...getWidgetStyles(),
        }}
      >
        {/* Header */}
        <CardHeader className="text-center pb-4 relative">
          <div className="absolute top-4 right-4">
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 animate-bounce">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{totalSupporters} supporters</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg ring-2 ring-white">
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

          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span>4.9/5 rating</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>Trusted by {totalSupporters}+</span>
            </div>
          </div>
        </CardHeader>

        {currentStep !== "search" && (
          <div className="px-6 pb-6">
            <ProgressSteps steps={getProgressSteps() as any} className="mb-2" />
          </div>
        )}

        <CardContent className="space-y-6">
          {currentStep === "search" && (
            <>
              {/* Recent Activity Feed */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900 text-sm">Recent Activity</span>
                </div>
                <div className="space-y-2">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm animate-fade-in">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-700">
                        {activity.avatar}
                      </div>
                      <span className="text-blue-800 flex-1">
                        <strong>{activity.name}</strong> {activity.action}
                      </span>
                      <span className="text-blue-600 text-xs">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="nmbr-code" className="text-sm font-medium" style={{ color: organization.textColor }}>
                    NMBR Code
                  </Label>
                  <div className="flex space-x-3">
                    <ValidatedInput
                      name="code"
                      value={searchCode}
                      onChange={(value) => {
                        setSearchCode(value)
                        searchForm.setValue('code', value)
                      }}
                      onBlur={() => searchForm.setTouchedField('code')}
                      rules={VALIDATION_SCHEMAS.nmbrSearch.code}
                      placeholder="e.g., HOPE001"
                      className="uppercase font-mono text-center text-lg h-12 border-2 focus:ring-2 transition-all duration-200 focus:scale-105 flex-1"
                      showValidation={searchForm.isFieldTouched('code')}
                    />
                    <Button
                      onClick={handleSearch}
                      disabled={loading || searchForm.hasErrors() || !searchCode.trim()}
                      className="h-12 px-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
                      style={{ backgroundColor: organization.primaryColor }}
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Search className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-sm leading-relaxed" style={{ color: organization.textColor || "#64748b" }}>
                    Look for the code on your bracelet and enter it above to discover your story
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Story Step */}
          {currentStep === "story" && selectedNmbr && (
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={selectedNmbr.image || "/placeholder.svg?height=200&width=400"}
                  alt={selectedNmbr.title}
                  className="w-full h-52 object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {selectedNmbr.video && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-3 right-3 shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white transition-all duration-200"
                    onClick={() => setShowVideo(true)}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Video
                  </Button>
                )}
                <Badge
                  className="absolute top-3 left-3 shadow-lg font-mono font-bold animate-pulse"
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
                  <div className="relative">
                    <Progress
                      value={animateProgress ? (selectedNmbr.raised / selectedNmbr.goal) * 100 : 0}
                      className="h-3 transition-all duration-1000 ease-out"
                    />
                    {animateProgress && (selectedNmbr.raised / selectedNmbr.goal) * 100 > 75 && (
                      <div className="absolute -top-8 right-0 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold animate-bounce">
                        Almost there! 🎉
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-medium" style={{ color: organization.textColor || "#94a3b8" }}>
                      {Math.round((selectedNmbr.raised / selectedNmbr.goal) * 100)}% of goal reached
                    </div>
                    <div
                      className="flex items-center gap-1 text-xs font-medium"
                      style={{ color: organization.textColor || "#94a3b8" }}
                    >
                      <Users className="w-3 h-3" />
                      {selectedNmbr.subscribers} supporters
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4 p-4 bg-gradient-to-r from-cyan-50 to-purple-50 border border-cyan-200 rounded-xl">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-cyan-100 to-purple-100 rounded-full flex items-center justify-center mb-2">
                    <Heart className="w-6 h-6 text-cyan-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900">Stay Connected to Your Story</h4>
                  <p className="text-sm text-slate-600">
                    Get exclusive updates on <strong>{selectedNmbr.title}</strong> - see how your support is making a
                    real difference.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <ValidatedInput
                      name="firstName"
                      label="First Name"
                      value={subscriberData.firstName}
                      onChange={(value) => {
                        setSubscriberData({ ...subscriberData, firstName: value })
                        subscriptionForm.setValue('firstName', value)
                      }}
                      onBlur={() => subscriptionForm.setTouchedField('firstName')}
                      rules={VALIDATION_SCHEMAS.subscription.firstName}
                      placeholder="Your name"
                      className="h-10 border-2 focus:ring-2 transition-all duration-200 focus:scale-105"
                      showValidation={subscriptionForm.isFieldTouched('firstName')}
                    />
                    <ValidatedInput
                      name="lastName"
                      label="Last Name"
                      value={subscriberData.lastName}
                      onChange={(value) => {
                        setSubscriberData({ ...subscriberData, lastName: value })
                        subscriptionForm.setValue('lastName', value)
                      }}
                      onBlur={() => subscriptionForm.setTouchedField('lastName')}
                      rules={VALIDATION_SCHEMAS.subscription.lastName}
                      placeholder="Last name"
                      className="h-10 border-2 focus:ring-2 transition-all duration-200 focus:scale-105"
                      showValidation={subscriptionForm.isFieldTouched('lastName')}
                    />
                  </div>
                  <ValidatedInput
                    name="email"
                    label="Email Address"
                    type="email"
                    value={subscriberData.email}
                    onChange={(value) => {
                      setSubscriberData({ ...subscriberData, email: value })
                      subscriptionForm.setValue('email', value)
                    }}
                    onBlur={() => subscriptionForm.setTouchedField('email')}
                    rules={VALIDATION_SCHEMAS.subscription.email}
                    placeholder="your@email.com"
                    className="h-10 border-2 focus:ring-2 transition-all duration-200 focus:scale-105"
                    showValidation={subscriptionForm.isFieldTouched('email')}
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleSubscribe}
                    variant="outline"
                    className="flex-1 h-10 border-2 hover:bg-slate-50 transition-all duration-200 hover:scale-105 active:scale-95 bg-transparent"
                    disabled={loading || subscriptionForm.hasErrors() || !subscriberData.email || !subscriberData.firstName}
                    style={{ borderColor: organization.primaryColor, color: organization.primaryColor }}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    {loading ? "Subscribing..." : "Follow Story (Free)"}
                  </Button>
                  {selectedNmbr.status === "active" && (
                    <Button
                      onClick={() => setCurrentStep("donate")}
                      className="flex-1 h-10 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 relative overflow-hidden"
                      style={{ backgroundColor: organization.primaryColor }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                      <Heart className="w-4 h-4 mr-2" />
                      Donate & Follow
                    </Button>
                  )}
                </div>

                <div className="bg-white/50 rounded-lg p-3 border border-cyan-200">
                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <Gift className="w-3 h-3 text-green-500" />
                      <span>Exclusive story updates with photos & videos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-3 h-3 text-blue-500" />
                      <span>See your direct impact in real-time</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span>Join a community of {totalSupporters}+ supporters</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                onClick={resetWidget}
                className="w-full text-sm hover:bg-slate-50 transition-all duration-200 hover:scale-105"
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

          {currentStep === "success" && (
            <div className="space-y-6 text-center">
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping"
                      style={{
                        left: `${20 + i * 10}%`,
                        top: `${10 + (i % 2) * 20}%`,
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: "1s",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold" style={getHeadingStyles()}>
                  Thank You! 🎉
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: organization.textColor || "#64748b" }}>
                  Your support means the world to us. You'll receive updates about the impact of your contribution to{" "}
                  <strong>{selectedNmbr?.title}</strong>.
                </p>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mt-4">
                  <h4 className="font-semibold text-green-900 mb-2">What happens next?</h4>
                  <div className="text-sm text-green-700 space-y-1 text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>You'll receive a welcome email within 24 hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>Monthly updates with photos and progress reports</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>Special milestone celebrations and achievements</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onClick={resetWidget}
                className="w-full h-12 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
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

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}
