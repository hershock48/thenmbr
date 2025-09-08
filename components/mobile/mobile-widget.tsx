"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Search, 
  Heart, 
  Mail, 
  CheckCircle, 
  Users, 
  Clock, 
  TrendingUp, 
  Zap, 
  Star, 
  Gift,
  ArrowRight,
  Camera,
  Share2,
  Volume2,
  Vibrate
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Organization {
  id: string
  name: string
  slug: string
  primaryColor: string
  secondaryColor: string
  logo: string
}

interface MobileWidgetProps {
  organization: Organization
  onSubscribe?: (data: any) => void
  onDonate?: (data: any) => void
}

export function MobileWidget({ organization, onSubscribe, onDonate }: MobileWidgetProps) {
  const [searchCode, setSearchCode] = useState("")
  const [currentStep, setCurrentStep] = useState<"search" | "story" | "donate" | "success">("search")
  const [selectedNmbr, setSelectedNmbr] = useState<any>(null)
  const [subscriberData, setSubscriberData] = useState({ email: "", firstName: "", lastName: "" })
  const [donationAmount, setDonationAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [hapticFeedback, setHapticFeedback] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Mock data for mobile-optimized stories
  const mockStories = [
    {
      id: "1",
      nmbr_code: "1",
      title: "Maria's Water Well",
      description: "Help Maria bring clean water to her village of 500 families",
      photo_url: "/water-well-village.jpg",
      goal_amount: 10000,
      current_amount: 7500,
      progress: 75,
      supporters: 234,
      urgency: "high",
      location: "Rural Kenya",
      impact: "500 families will have access to clean water"
    },
    {
      id: "2", 
      nmbr_code: "2",
      title: "Ahmed's Education",
      description: "Support Ahmed's dream of becoming a doctor",
      photo_url: "/school-children-books.jpg",
      goal_amount: 8000,
      current_amount: 3200,
      progress: 40,
      supporters: 156,
      urgency: "medium",
      location: "Cairo, Egypt",
      impact: "Ahmed will complete medical school"
    }
  ]

  const [recentActivity] = useState([
    { name: "Sarah M.", action: "donated $50", time: "2 min ago", avatar: "SM" },
    { name: "Michael R.", action: "subscribed", time: "5 min ago", avatar: "MR" },
    { name: "Jennifer L.", action: "donated $100", time: "8 min ago", avatar: "JL" },
  ])

  const handleSearch = async () => {
    if (!searchCode.trim()) return
    
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const story = mockStories.find(s => s.nmbr_code === searchCode)
      if (story) {
        setSelectedNmbr(story)
        setCurrentStep("story")
        if (hapticFeedback) {
          // Trigger haptic feedback
          if (navigator.vibrate) {
            navigator.vibrate(100)
          }
        }
      } else {
        // Show error with haptic feedback
        if (hapticFeedback && navigator.vibrate) {
          navigator.vibrate([100, 50, 100])
        }
      }
      setLoading(false)
    }, 1000)
  }

  const handleSubscribe = async () => {
    if (!subscriberData.email || !subscriberData.firstName || !subscriberData.lastName) return
    
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      onSubscribe?.(subscriberData)
      setCurrentStep("success")
      if (hapticFeedback && navigator.vibrate) {
        navigator.vibrate([200, 100, 200])
      }
      setLoading(false)
    }, 1500)
  }

  const handleDonate = async () => {
    if (!donationAmount) return
    
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      onDonate?.({ amount: donationAmount, story: selectedNmbr })
      setCurrentStep("success")
      if (hapticFeedback && navigator.vibrate) {
        navigator.vibrate([300, 100, 300])
      }
      setLoading(false)
    }, 2000)
  }

  const handleCameraCapture = () => {
    setShowCamera(true)
    // In a real app, this would open the camera
    setTimeout(() => {
      setShowCamera(false)
      // Simulate QR code scanning
      setSearchCode("1")
    }, 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Support ${selectedNmbr?.title}`,
          text: `Help make a difference with ${selectedNmbr?.title}`,
          url: window.location.href
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">{organization.name}</h1>
              <p className="text-sm text-gray-600">Impact Stories</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHapticFeedback(!hapticFeedback)}
              className={cn("p-2", hapticFeedback && "bg-blue-100")}
            >
              <Vibrate className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={cn("p-2", soundEnabled && "bg-green-100")}
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Search Step */}
        {currentStep === "search" && (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Find Your Impact Story</h2>
              <p className="text-gray-600 max-w-sm mx-auto">
                Enter a NMBR code to discover the story you're supporting
              </p>
            </div>

            {/* Search Input */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Enter NMBR code (e.g., 1, 2, 3...)"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    className="pl-12 h-14 text-lg text-center font-mono"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button
                    onClick={handleSearch}
                    disabled={!searchCode.trim() || loading}
                    className="flex-1 h-12 text-lg font-semibold"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Find Story
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleCameraCapture}
                    className="h-12 px-4"
                  >
                    <Camera className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {activity.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.name} {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Story Step */}
        {currentStep === "story" && selectedNmbr && (
          <div className="space-y-6">
            {/* Story Header */}
            <div className="text-center space-y-4">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep("search")}
                className="absolute left-4 top-4"
              >
                ← Back
              </Button>
              
              <div className="relative">
                <img
                  src={selectedNmbr.photo_url}
                  alt={selectedNmbr.title}
                  className="w-full h-48 object-cover rounded-2xl"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-gray-900">
                    NMBR #{selectedNmbr.nmbr_code}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">{selectedNmbr.title}</h2>
                <p className="text-gray-600">{selectedNmbr.description}</p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {selectedNmbr.supporters} supporters
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedNmbr.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Card */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">Progress</h3>
                  <Badge variant={selectedNmbr.urgency === "high" ? "destructive" : "secondary"}>
                    {selectedNmbr.urgency === "high" ? "Urgent" : "Active"}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Raised</span>
                    <span className="font-semibold">${selectedNmbr.current_amount.toLocaleString()}</span>
                  </div>
                  <Progress value={selectedNmbr.progress} className="h-3" />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Goal</span>
                    <span className="font-semibold">${selectedNmbr.goal_amount.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="text-center py-2">
                  <span className="text-2xl font-bold text-gray-900">{selectedNmbr.progress}%</span>
                  <p className="text-sm text-gray-600">Complete</p>
                </div>
              </div>
            </Card>

            {/* Impact Card */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                Impact
              </h3>
              <p className="text-gray-600">{selectedNmbr.impact}</p>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => setCurrentStep("donate")}
                className="w-full h-14 text-lg font-semibold"
              >
                <Gift className="w-5 h-5 mr-2" />
                Donate Now
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setCurrentStep("subscribe")}
                className="w-full h-12"
              >
                <Mail className="w-4 h-4 mr-2" />
                Follow This Story
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleShare}
                className="w-full h-12"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Story
              </Button>
            </div>
          </div>
        )}

        {/* Subscribe Step */}
        {currentStep === "subscribe" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Follow This Story</h2>
              <p className="text-gray-600">Get updates on {selectedNmbr?.title}</p>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <Input
                    placeholder="Enter your first name"
                    value={subscriberData.firstName}
                    onChange={(e) => setSubscriberData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="h-12"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <Input
                    placeholder="Enter your last name"
                    value={subscriberData.lastName}
                    onChange={(e) => setSubscriberData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="h-12"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={subscriberData.email}
                    onChange={(e) => setSubscriberData(prev => ({ ...prev, email: e.target.value }))}
                    className="h-12"
                  />
                </div>
                
                <Button
                  onClick={handleSubscribe}
                  disabled={!subscriberData.email || !subscriberData.firstName || !subscriberData.lastName || loading}
                  className="w-full h-12 text-lg font-semibold"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Mail className="w-5 h-5 mr-2" />
                      Subscribe to Updates
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Donate Step */}
        {currentStep === "donate" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Make a Donation</h2>
              <p className="text-gray-600">Support {selectedNmbr?.title}</p>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Donation Amount
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="h-12 text-lg text-center"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {[25, 50, 100].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => setDonationAmount(amount.toString())}
                      className="h-12"
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
                
                <Button
                  onClick={handleDonate}
                  disabled={!donationAmount || loading}
                  className="w-full h-12 text-lg font-semibold"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Gift className="w-5 h-5 mr-2" />
                      Donate ${donationAmount || '0'}
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Success Step */}
        {currentStep === "success" && (
          <div className="text-center space-y-6 py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Success!</h2>
              <p className="text-gray-600">
                {selectedNmbr ? 
                  `You're now following ${selectedNmbr.title}` : 
                  'Your donation has been processed'
                }
              </p>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={() => {
                  setCurrentStep("search")
                  setSelectedNmbr(null)
                  setSubscriberData({ email: "", firstName: "", lastName: "" })
                  setDonationAmount("")
                }}
                className="w-full h-12 text-lg font-semibold"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Find Another Story
              </Button>
              
              <Button
                variant="outline"
                onClick={handleShare}
                className="w-full h-12"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share This Story
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

