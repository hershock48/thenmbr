'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Heart, 
  Users, 
  DollarSign, 
  ArrowRight, 
  Gift, 
  Target, 
  Sparkles, 
  CheckCircle, 
  Star,
  Hash,
  Globe,
  TrendingUp,
  Award,
  Clock,
  Shield,
  Zap,
  Play,
  Eye,
  MessageSquare,
  BarChart3,
  Building2,
  Smartphone,
  ExternalLink,
  Percent,
  MousePointer,
  Bell,
  Share2,
  ThumbsUp,
  Star as StarIcon,
  Activity,
  Calendar,
  Trophy,
  Flame,
  Coffee,
  Store,
  Mail,
  Phone,
  MapPin,
  Link as LinkIcon,
  RefreshCw,
  Plus,
  Minus,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Camera,
  Video,
  Mic,
  FileText,
  Download,
  Upload,
  Settings,
  HelpCircle,
  Info,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  ShoppingCart,
  Archive
} from "lucide-react"

interface Story {
  id: string
  nmbr: string
  title: string
  description: string
  image: string
  category: 'nonprofit' | 'business' | 'grassroots'
  status: 'active' | 'completed' | 'paused'
  progress: number
  goal: number
  raised: number
  supporters: number
  lastUpdate: string
  updates: StoryUpdate[]
  products: Product[]
  organization: {
    name: string
    logo: string
    verified: boolean
  }
}

interface StoryUpdate {
  id: string
  date: string
  title: string
  content: string
  summary: string
  image?: string
  type: 'milestone' | 'update' | 'celebration' | 'challenge' | 'progress' | 'impact'
  likes: number
  comments: number
  isPublic: boolean
}

interface Product {
  id: string
  name: string
  price: number
  nmbr: string
  image: string
  description: string
  category: string
  inStock: boolean
  sales: number
}

interface LiveMetrics {
  donations: number
  views: number
  shares: number
  comments: number
  lastUpdated: string
}

// Demo data matching the NMBR vision
const demoStories: Story[] = [
  {
    id: "story-001",
    nmbr: "NMBR:001",
    title: "Maria's Water Well",
    description: "Follow Maria's journey as her community gets access to clean water for the first time. Every drop tells a story of hope and transformation.",
    image: "/images/maria-story.jpg",
    category: 'nonprofit',
    status: 'active',
    progress: 85,
    goal: 5000,
    raised: 4250,
    supporters: 127,
    lastUpdate: "2 hours ago",
    organization: {
      name: "Water for All",
      logo: "/images/water-for-all-logo.png",
      verified: true
    },
    updates: [
      {
        id: "update-001",
        date: "2024-01-15",
        title: "Well Construction Begins",
        content: "The drilling team arrived today. Maria is so excited to finally have clean water! The whole village gathered to watch the first drill.",
        summary: "Drilling team arrived and construction begins. Maria and the whole village are excited about the new water well.",
        type: 'milestone',
        likes: 23,
        comments: 8,
        isPublic: true
      },
      {
        id: "update-002", 
        date: "2024-01-22",
        title: "First Water Flows",
        content: "Incredible! Clean water is flowing for the first time. The whole village celebrated with songs and dancing. Maria's dream is becoming reality.",
        summary: "Clean water flows for the first time! The whole village celebrated with songs and dancing as Maria's dream becomes reality.",
        type: 'celebration',
        likes: 45,
        comments: 12,
        isPublic: true
      },
      {
        id: "update-003",
        date: "2024-02-01", 
        title: "Community Training",
        content: "Maria and her neighbors learned how to maintain the well. This will last for generations. The children are already healthier!",
        summary: "Community training completed. Maria and neighbors learned well maintenance. Children are already healthier!",
        type: 'update',
        likes: 31,
        comments: 6,
        isPublic: true
      }
    ],
    products: [
      {
        id: "water-bottle",
        name: "Maria's Water Bottle",
        price: 25,
        nmbr: "NMBR:001",
        image: "/images/water-bottle.jpg",
        description: "Stainless steel water bottle with Maria's story engraved",
        category: "Accessories",
        inStock: true,
        sales: 89
      },
      {
        id: "well-plaque",
        name: "Well Dedication Plaque",
        price: 150,
        nmbr: "NMBR:001", 
        image: "/images/well-plaque.jpg",
        description: "Custom plaque for the well with donor recognition",
        category: "Memorabilia",
        inStock: true,
        sales: 12
      }
    ]
  },
  {
    id: "story-002",
    nmbr: "NMBR:002", 
    title: "Genesis School Project",
    description: "Watch Genesis build her dream school and transform her community's future. Every brick represents hope for the children.",
    image: "/images/genesis-story.jpg",
    category: 'nonprofit',
    status: 'active',
    progress: 92,
    goal: 15000,
    raised: 13800,
    supporters: 89,
    lastUpdate: "4 hours ago",
    organization: {
      name: "Education First",
      logo: "/images/education-first-logo.png", 
      verified: true
    },
    updates: [
      {
        id: "update-004",
        date: "2024-01-10",
        title: "School Foundation Laid",
        content: "The foundation is complete! Genesis can't wait to see her school take shape. The children are already planning their first day.",
        summary: "School foundation complete! Genesis and children are excited as the school takes shape.",
        type: 'milestone',
        likes: 67,
        comments: 15,
        isPublic: true
      },
      {
        id: "update-005",
        date: "2024-01-25", 
        title: "Walls Going Up",
        content: "The walls are rising fast. Every brick represents hope for the children. The community is working together to make this dream real.",
        summary: "Walls rising fast! Every brick represents hope as the community works together to make this dream real.",
        type: 'update',
        likes: 52,
        comments: 9,
        isPublic: true
      },
      {
        id: "update-006",
        date: "2024-02-05",
        title: "First Class Begins",
        content: "School is open! 50 children are now learning in Genesis's dream school. The first day was filled with joy and excitement.",
        summary: "School is open! 50 children are now learning in Genesis's dream school with joy and excitement.",
        type: 'celebration',
        likes: 89,
        comments: 23,
        isPublic: true
      }
    ],
    products: [
      {
        id: "school-supplies",
        name: "School Supply Kit",
        price: 35,
        nmbr: "NMBR:002",
        image: "/images/school-supplies.jpg",
        description: "Complete school supply kit for one child",
        category: "Education",
        inStock: true,
        sales: 156
      },
      {
        id: "desk-sponsor",
        name: "Desk Sponsorship",
        price: 75,
        nmbr: "NMBR:002",
        image: "/images/desk-sponsor.jpg", 
        description: "Sponsor a desk with your name engraved",
        category: "Sponsorship",
        inStock: true,
        sales: 34
      }
    ]
  },
  {
    id: "story-003",
    nmbr: "NMBR:003",
    title: "Ethiopian Coffee Co-op",
    description: "Experience the journey of premium coffee from farm to cup, supporting local farmers and their families.",
    image: "/images/coffee-story.jpg",
    category: 'business',
    status: 'active',
    progress: 100,
    goal: 10000,
    raised: 10000,
    supporters: 234,
    lastUpdate: "1 day ago",
    organization: {
      name: "Ethiopian Coffee Co-op",
      logo: "/images/coffee-coop-logo.png",
      verified: true
    },
    updates: [
      {
        id: "update-007",
        date: "2024-01-12",
        title: "Harvest Season Begins",
        content: "The coffee cherries are perfectly ripe. Our farmers are excited about this year's crop! The quality looks exceptional.",
        summary: "Coffee harvest season begins! Farmers excited about this year's exceptional quality crop.",
        type: 'milestone',
        likes: 78,
        comments: 19,
        isPublic: true
      },
      {
        id: "update-008",
        date: "2024-01-20",
        title: "Processing Excellence", 
        content: "Our new processing facility is working beautifully. The quality is exceptional. Every bean tells a story of care and tradition.",
        summary: "New processing facility working beautifully! Exceptional quality with every bean telling a story of care and tradition.",
        type: 'update',
        likes: 65,
        comments: 14,
        isPublic: true
      },
      {
        id: "update-009",
        date: "2024-02-01",
        title: "First Shipment Ready",
        content: "The first batch is ready for our customers. Every bag tells a story of impact. The farmers are proud of their work!",
        summary: "First batch ready for customers! Every bag tells a story of impact as farmers are proud of their work.",
        type: 'celebration',
        likes: 92,
        comments: 28,
        isPublic: true
      }
    ],
    products: [
      {
        id: "coffee-bag",
        name: "Ethiopian Co-op Roast",
        price: 18,
        nmbr: "NMBR:003",
        image: "/images/coffee-bag.jpg",
        description: "Premium single-origin coffee from our co-op",
        category: "Coffee",
        inStock: true,
        sales: 445
      },
      {
        id: "coffee-subscription",
        name: "Monthly Coffee Subscription",
        price: 45,
        nmbr: "NMBR:003",
        image: "/images/coffee-subscription.jpg",
        description: "Monthly delivery of fresh roasted coffee",
        category: "Subscription",
        inStock: true,
        sales: 89
      }
    ]
  }
]

const popularStories = [
  { nmbr: "NMBR:001", title: "Maria's Water Well", category: "Water", supporters: 127, trending: true },
  { nmbr: "NMBR:002", title: "Genesis School Project", category: "Education", supporters: 89, trending: false },
  { nmbr: "NMBR:003", title: "Ethiopian Coffee Co-op", category: "Business", supporters: 234, trending: true },
  { nmbr: "NMBR:004", title: "Sustainable Fashion Line", category: "Fashion", supporters: 156, trending: false },
  { nmbr: "NMBR:005", title: "Community Garden Initiative", category: "Environment", supporters: 78, trending: true }
]

const dailyChallenges = [
  {
    id: "challenge-1",
    title: "Share a Story",
    description: "Share Maria's water well story with 3 friends",
    points: 50,
    progress: 0,
    max: 3,
    icon: Share2
  },
  {
    id: "challenge-2", 
    title: "Make a Donation",
    description: "Support any active story with a donation",
    points: 100,
    progress: 0,
    max: 1,
    icon: Heart
  },
  {
    id: "challenge-3",
    title: "Follow Updates",
    description: "Follow 5 stories to get regular updates",
    points: 75,
    progress: 2,
    max: 5,
    icon: Bell
  }
]

function WidgetContent() {
  const searchParams = useSearchParams()
  const orgId = searchParams.get('org')
  const nmbrCode = searchParams.get('nmbr')

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showDonationForm, setShowDonationForm] = useState(false)
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false)
  const [subscriptionEmail, setSubscriptionEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [showAISummary, setShowAISummary] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics>({
    donations: 0,
    views: 0,
    shares: 0,
    comments: 0,
    lastUpdated: new Date().toLocaleTimeString()
  })
  const [isLoading, setIsLoading] = useState(false)

  // Simulate live metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        donations: prev.donations + Math.floor(Math.random() * 3),
        views: prev.views + Math.floor(Math.random() * 5),
        shares: prev.shares + Math.floor(Math.random() * 2),
        comments: prev.comments + Math.floor(Math.random() * 2),
        lastUpdated: new Date().toLocaleTimeString()
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Auto-select story if NMBR code provided
  useEffect(() => {
      if (nmbrCode) {
      const story = demoStories.find(s => s.nmbr === nmbrCode)
      if (story) {
        setSelectedStory(story)
      }
    }
  }, [nmbrCode])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.length >= 3) {
      const story = demoStories.find(s => 
        s.nmbr.toLowerCase().includes(query.toLowerCase()) ||
        s.title.toLowerCase().includes(query.toLowerCase())
      )
      if (story) {
        setSelectedStory(story)
      }
    }
  }

  const handleQuickSearch = (nmbr: string) => {
    const story = demoStories.find(s => s.nmbr === nmbr)
    if (story) {
      setSelectedStory(story)
    }
  }

  const handleDonate = (story: Story, amount?: number) => {
    setIsLoading(true)
    
    // Show donation form or redirect to payment
    if (amount) {
      // Direct donation with amount
      processDonation(story, amount)
    } else {
      // Show donation amount selection
      setShowDonationForm(true)
    }
  }

  const processDonation = async (story: Story, amount: number) => {
    try {
      // Simulate API call to payment processor
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update live metrics
      setLiveMetrics(prev => ({
        ...prev,
        donations: prev.donations + 1
      }))
      
      // Show success message with confirmation details
      const confirmationMessage = `🎉 Thank you for your $${amount} donation to ${story.title}!

Your donation is being processed securely and you'll receive a confirmation email shortly.

What happens next:
• Your donation will be added to the story's progress
• You'll receive updates on how your contribution is making an impact
• The organization will send you a detailed impact report

Thank you for making a difference! 💙`
      
      alert(confirmationMessage)
      
    } catch (error) {
      console.error('Donation failed:', error)
      alert('Donation failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFollow = (story: Story) => {
    // Show subscription form instead of immediate follow
    setShowSubscriptionForm(true)
  }

  const handleSubscribe = async () => {
    if (!subscriptionEmail || !subscriptionEmail.includes('@')) {
      alert('Please enter a valid email address')
      return
    }

    setIsSubscribing(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update live metrics
      setLiveMetrics(prev => ({
        ...prev,
        views: prev.views + 1
      }))
      
      // Show success message
      alert(`Thank you! You'll receive updates about ${selectedStory?.title}`)
      
      // Close form
      setShowSubscriptionForm(false)
      setSubscriptionEmail('')
      
    } catch (error) {
      console.error('Subscription failed:', error)
      alert('Subscription failed. Please try again.')
    } finally {
      setIsSubscribing(false)
    }
  }

  const handleShare = (story: Story) => {
    // Simulate share action
    setLiveMetrics(prev => ({
      ...prev,
      shares: prev.shares + 1
    }))
  }

  const generateAISummary = (story: Story) => {
    const totalUpdates = story.updates.length
    const daysActive = Math.ceil((new Date().getTime() - new Date(story.lastUpdate).getTime()) / (1000 * 60 * 60 * 24))
    const progressPercent = Math.round((story.raised / story.goal) * 100)
    
    return `Welcome to ${story.title}! This story has been active for ${daysActive} days with ${totalUpdates} updates. We've raised $${story.raised.toLocaleString()} of our $${story.goal.toLocaleString()} goal (${progressPercent}% complete). ${story.updates[0]?.summary || 'Follow along as we share updates about this important cause.'}`
  }

    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Live Activity Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              <span className="font-semibold">Live Activity</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>+{liveMetrics.donations}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>+{liveMetrics.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="w-4 h-4" />
                <span>+{liveMetrics.shares}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>+{liveMetrics.comments}</span>
              </div>
            </div>
          </div>
          <div className="text-sm opacity-90">
            Last updated: {liveMetrics.lastUpdated}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Hash className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">NMBR Platform</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover and follow real stories of impact. Every NMBR connects you to authentic stories, 
            meaningful products, and direct impact.
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Find Your Impact Story
            </CardTitle>
            <CardDescription>
              Search by NMBR code or story title to discover authentic stories of impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Main Search */}
              <div className="relative">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Enter NMBR code (e.g., NMBR:001) or story title..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10 h-12 text-lg"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                    />
                  </div>
                  <Button 
                    onClick={() => handleSearch(searchQuery)}
                    className="h-12 px-8"
                    size="lg"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
                
                {/* Search Suggestions */}
                {searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {demoStories
                      .filter(story => 
                        story.nmbr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        story.title.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .slice(0, 5)
                      .map((story) => (
                        <div
                          key={story.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => {
                            setSelectedStory(story)
                            setSearchQuery('')
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {story.nmbr.split(':')[1]}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{story.title}</div>
                              <div className="text-xs text-muted-foreground">{story.nmbr}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Quick Search Buttons */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-muted-foreground">Popular Stories:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {['NMBR:001', 'NMBR:002', 'NMBR:003'].map((nmbr) => (
                    <Button 
                      key={nmbr}
                      variant="outline" 
                      onClick={() => handleQuickSearch(nmbr)}
                      className="h-12 justify-start text-left"
                    >
                      <Hash className="w-4 h-4 mr-2" />
                      {nmbr}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Mobile-First Features */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Mobile Optimized</h4>
                    <p className="text-sm text-blue-800">
                      This search works perfectly on any device. Try scanning a QR code or typing a NMBR code directly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Analytics Toggle */}
        <div className="flex justify-end mb-6">
          <Button
            variant="outline"
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            {showAnalytics ? 'Hide' : 'Show'} Live Analytics
          </Button>
        </div>

        {/* Live Analytics Panel */}
        {showAnalytics && (
          <Card className="mb-8 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Live Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">{liveMetrics.donations}</div>
                  <div className="text-sm text-red-700">Donations</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{liveMetrics.views}</div>
                  <div className="text-sm text-blue-700">Views</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Share2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{liveMetrics.shares}</div>
                  <div className="text-sm text-green-700">Shares</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">{liveMetrics.comments}</div>
                  <div className="text-sm text-purple-700">Comments</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily Challenges */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Daily Challenges
            </CardTitle>
            <CardDescription>
              Complete challenges to earn points and make a bigger impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dailyChallenges.map((challenge) => {
                const Icon = challenge.icon
                const progressPercent = (challenge.progress / challenge.max) * 100
                
                return (
                  <div key={challenge.id} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-yellow-600" />
                        </div>
                      <div>
                        <h3 className="font-semibold">{challenge.title}</h3>
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{challenge.progress}/{challenge.max}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-yellow-600 font-medium">{challenge.points} points</span>
                        <span className="text-muted-foreground">
                          {challenge.progress === challenge.max ? 'Completed!' : `${challenge.max - challenge.progress} left`}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Popular Stories */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-600" />
              Popular Stories
            </CardTitle>
            <CardDescription>
              Trending stories that are making a real impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {popularStories.map((story) => (
                <Badge
                  key={story.nmbr}
                  variant={story.trending ? "default" : "secondary"}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                  onClick={() => handleQuickSearch(story.nmbr)}
                >
                  {story.trending && <Flame className="w-3 h-3 mr-1" />}
                  {story.nmbr} • {story.title} • {story.supporters} supporters
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Story Display */}
        {selectedStory ? (
          <Card className="mb-8 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                    <Hash className="w-8 h-8 text-white font-bold" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      {selectedStory.nmbr}
                      {selectedStory.organization.verified && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </CardTitle>
                    <CardDescription className="text-lg">{selectedStory.title}</CardDescription>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Building2 className="w-4 h-4" />
                        {selectedStory.organization.name}
                      </div>
                      <Badge variant={selectedStory.status === 'active' ? 'default' : 'secondary'}>
                        {selectedStory.status}
                      </Badge>
                      <Badge variant="outline">{selectedStory.category}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleShare(selectedStory)}>
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Story Description */}
                <div className="prose max-w-none">
                  <p className="text-lg text-muted-foreground">{selectedStory.description}</p>
                      </div>

                      {/* Progress Bar */}
                        <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{selectedStory.progress}% • ${selectedStory.raised.toLocaleString()} raised</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                      className="bg-gradient-to-r from-primary to-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${selectedStory.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Goal: ${selectedStory.goal.toLocaleString()}</span>
                    <span>{selectedStory.supporters} supporters</span>
                          </div>
                        </div>

                      {/* Action Buttons */}
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      onClick={() => handleDonate(selectedStory)}
                      disabled={isLoading}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Heart className="w-4 h-4" />
                      )}
                      Donate Now
                    </Button>
                        <Button 
                    variant="outline"
                    onClick={() => handleFollow(selectedStory)}
                    className="flex items-center gap-2"
                        >
                    <Bell className="w-4 h-4" />
                    Follow Story
                        </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleShare(selectedStory)}
                      className="flex items-center gap-2"
                        >
                    <Share2 className="w-4 h-4" />
                    Share
                        </Button>
                  </div>
                  
                  {/* Security & Trust Indicators */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm text-green-800">
                      <Shield className="w-4 h-4" />
                      <span className="font-medium">Secure Donation</span>
                    </div>
                    <div className="text-xs text-green-700 mt-1">
                      Your donation is processed securely with 256-bit SSL encryption. 
                      You'll receive a confirmation email and tax receipt.
                    </div>
                  </div>
                </div>

                {/* AI Summary */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm mb-2">AI Summary</h4>
                      <p className="text-sm text-gray-700 mb-3">{generateAISummary(selectedStory)}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>• {selectedStory.updates.length} updates available</span>
                        <span>• {Math.round((selectedStory.raised / selectedStory.goal) * 100)}% funded</span>
                        <span>• {selectedStory.supporters} supporters</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Story Updates */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Story Updates</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowTimeline(!showTimeline)}
                      className="text-xs"
                    >
                      {showTimeline ? 'Hide' : 'Show'} Full Timeline
                    </Button>
                  </div>
                  
                  {selectedStory.updates.slice(0, showTimeline ? selectedStory.updates.length : 2).map((update, index) => (
                    <div key={update.id} className="p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{update.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {update.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{update.date}</p>
                          <p className="text-sm text-gray-700 mb-2">{update.summary}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="w-3 h-3" />
                              {update.likes}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {update.comments}
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs p-0 h-auto">
                              Read full update <ChevronRight className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {!showTimeline && selectedStory.updates.length > 2 && (
                    <div className="text-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowTimeline(true)}
                        className="text-xs"
                      >
                        View {selectedStory.updates.length - 2} more updates
                      </Button>
                    </div>
                  )}
                </div>

                {/* Products */}
                {selectedStory.products.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Support Through Products</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedStory.products.map((product) => (
                        <div key={product.id} className="p-4 border rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Gift className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{product.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {product.nmbr}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-primary">${product.price}</span>
                                <Button size="sm" className="flex items-center gap-1">
                                  <ShoppingCart className="w-3 h-3" />
                                  Add to Cart
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Archive Link */}
                <div className="text-center pt-4 border-t">
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    <Archive className="w-4 h-4 mr-2" />
                    View Complete Story Archive
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Access all updates, photos, and milestones from the beginning
                  </p>
                </div>
                  </div>
                </CardContent>
              </Card>
        ) : (
          /* No Story Selected State */
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Your Impact Story</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Search for a NMBR code or story title to discover authentic stories of impact and make a difference.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['NMBR:001', 'NMBR:002', 'NMBR:003'].map((nmbr) => (
                  <Button
                    key={nmbr}
                    variant="outline"
                    onClick={() => handleQuickSearch(nmbr)}
                    className="text-sm"
                  >
                    Try {nmbr}
                  </Button>
            ))}
          </div>
            </CardContent>
          </Card>
        )}

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-Time Updates</h3>
            <p className="text-sm text-muted-foreground">
              Get instant updates on the stories you follow. See progress as it happens.
            </p>
          </Card>
          
          <Card className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Personal Connection</h3>
            <p className="text-sm text-muted-foreground">
              Connect directly with the people and causes you care about. Every story matters.
            </p>
          </Card>
          
          <Card className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
            <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
          <p className="text-sm text-muted-foreground">
              See exactly how your support makes a difference with complete transparency.
          </p>
          </Card>
        </div>
      </div>

      {/* Subscription Form Modal */}
      {showSubscriptionForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Follow {selectedStory?.title}
              </CardTitle>
              <CardDescription>
                Get updates about this story's progress and impact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={subscriptionEmail}
                  onChange={(e) => setSubscriptionEmail(e.target.value)}
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">What you'll receive:</p>
                    <ul className="mt-1 space-y-1 text-xs">
                      <li>• Progress updates on this story</li>
                      <li>• Impact photos and videos</li>
                      <li>• Milestone celebrations</li>
                      <li>• Ways to help further</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowSubscriptionForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubscribe}
                  disabled={isSubscribing}
                  className="flex-1"
                >
                  {isSubscribing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4 mr-2" />
                      Follow Story
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default function WidgetPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading NMBR Platform...</p>
        </div>
      </div>
    }>
      <WidgetContent />
    </Suspense>
  )
}
