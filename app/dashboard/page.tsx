"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Heart,
  Plus,
  Eye,
  Edit,
  Share2,
  Target,
  BarChart3,
  ArrowRight,
  Building2,
  Hash,
  TrendingUp,
  DollarSign,
  Mail,
  MessageSquare,
  Globe,
  Clock,
  CheckCircle,
  Zap,
  Loader2,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useOrganization } from "@/contexts/OrganizationContext"
import { useSubscription } from "@/contexts/SubscriptionContext"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Story {
  id: string
  nmbr_code: string
  title: string
  description: string
  photo_url?: string
  goal_amount?: number
  current_amount?: number
  status: "active" | "completed" | "draft"
  created_at: string
  donations_count: number
  engagement_rate: number
}

interface DashboardStats {
  totalStories: number
  totalDonations: number
  activeDonors: number
  avgDonation: number
  monthlyGrowth: number
  completionRate: number
}

export default function DashboardPage() {
  const { user, org } = useAuth()
  const { terminology } = useOrganization()
  const { tier } = useSubscription()
  const router = useRouter()
  
  const [stories, setStories] = useState<Story[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalStories: 0,
    totalDonations: 0,
    activeDonors: 0,
    avgDonation: 0,
    monthlyGrowth: 0,
    completionRate: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (org?.id) {
      fetchDashboardData()
    } else if (user && !org) {
      router.push("/select-org")
    } else if (!user) {
      router.push("/login")
    }
  }, [org, user, router])

  const fetchDashboardData = async () => {
    try {
      setError(null)
      // Start with empty data - users will create their own content
      const mockStories: Story[] = []

      const mockStats: DashboardStats = {
        totalStories: 0,
        totalDonations: 0,
        activeDonors: 0,
        avgDonation: 0,
        monthlyGrowth: 0,
        completionRate: 0
      }

      setStories(mockStories)
      setStats(mockStats)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
      setError("Failed to load dashboard data. Please refresh the page.")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-slate-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Redirecting to Login</h3>
          <p className="text-slate-600">Please sign in to access your dashboard.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted animate-pulse rounded" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3 p-6 border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-10 w-10 bg-muted animate-pulse rounded-xl" />
              </div>
              <div className="h-8 w-20 bg-muted animate-pulse rounded" />
              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Inspirational Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-100">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
        <div className="relative p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Welcome back, {org?.name || "Team"}
                  </h1>
                  <p className="text-blue-600/80 font-medium">Ready to change the world today?</p>
                </div>
              </div>
              <p className="text-slate-600 text-lg max-w-2xl leading-relaxed">
                Your impact stories are building bridges between hearts and causes. Let's see how many lives you've touched and create even more meaningful connections.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/select-org")}
                className="flex items-center space-x-2 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Building2 className="w-4 h-4" />
                <span>Switch Organization</span>
              </Button>
              <Link href="/dashboard/stories/create">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Impact Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Metrics - The Heart of Your Mission */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-foreground">Your Impact Dashboard</h2>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            Live Impact
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Lives Impacted */}
          <Card className="group hover:shadow-lg hover:scale-105 transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-green-700 mb-1">Lives Impacted</p>
                  <p className="text-3xl font-bold text-green-800 mt-1">
                    {stats.totalDonations > 0 ? Math.floor(stats.totalDonations / 50) : 0}
                  </p>
                  <p className="text-xs text-green-600 mt-1 font-medium">
                    ${stats.totalDonations.toLocaleString()} raised
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:from-green-500 group-hover:to-emerald-600 transition-all duration-300 shadow-lg">
                  <Heart className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Champions */}
          <Card className="group hover:shadow-lg hover:scale-105 transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-blue-700 mb-1">Community Champions</p>
                  <p className="text-3xl font-bold text-blue-800 mt-1">
                    {stats.activeDonors}
                  </p>
                  <p className="text-xs text-blue-600 mt-1 font-medium">
                    Dedicated supporters
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center group-hover:from-blue-500 group-hover:to-indigo-600 transition-all duration-300 shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stories of Hope */}
          <Card className="group hover:shadow-lg hover:scale-105 transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-purple-700 mb-1">Stories of Hope</p>
                  <p className="text-3xl font-bold text-purple-800 mt-1">
                    {stats.totalStories}
                  </p>
                  <p className="text-xs text-purple-600 mt-1 font-medium">
                    {stats.completionRate}% completed
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center group-hover:from-purple-500 group-hover:to-pink-600 transition-all duration-300 shadow-lg">
                  <Eye className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Momentum */}
          <Card className="group hover:shadow-lg hover:scale-105 transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-red-50">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-orange-700 mb-1">Monthly Momentum</p>
                  <p className="text-3xl font-bold text-orange-800 mt-1">
                    +{stats.monthlyGrowth}%
                  </p>
                  <p className="text-xs text-orange-600 mt-1 font-medium">
                    Growth this month
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center group-hover:from-orange-500 group-hover:to-red-600 transition-all duration-300 shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Action Hub - Your Mission Control */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-foreground">Quick Actions</h2>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Get Started
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Create Impact Story */}
          <Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200">
            <Link href="/dashboard/stories/create">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:from-blue-600 group-hover:to-indigo-700 transition-all duration-300 shadow-lg">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-blue-800 group-hover:text-blue-900">Create Impact Story</CardTitle>
                <CardDescription className="text-blue-600">Share your mission and inspire donors</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          {/* View Analytics */}
          <Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-green-50 to-emerald-100 hover:from-green-100 hover:to-emerald-200">
            <Link href="/dashboard/analytics">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:from-green-600 group-hover:to-emerald-700 transition-all duration-300 shadow-lg">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-green-800 group-hover:text-green-900">Impact Analytics</CardTitle>
                <CardDescription className="text-green-600">Track your fundraising success</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          {/* Manage Community */}
          <Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-purple-50 to-pink-100 hover:from-purple-100 hover:to-pink-200">
            <Link href="/dashboard/communications">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:from-purple-600 group-hover:to-pink-700 transition-all duration-300 shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-purple-800 group-hover:text-purple-900">Connect & Engage</CardTitle>
                <CardDescription className="text-purple-600">Build lasting donor relationships</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          {/* Customize Brand */}
          <Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-orange-50 to-red-100 hover:from-orange-100 hover:to-red-200">
            <Link href="/dashboard/settings">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 group-hover:from-orange-600 group-hover:to-red-700 transition-all duration-300 shadow-lg">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-orange-800 group-hover:text-orange-900">Customize Brand</CardTitle>
                <CardDescription className="text-orange-600">Make it uniquely yours</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>
      </div>

      {/* Your Impact Stories - The Heart of Your Mission */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-blue-50/30">
        <CardHeader className="border-b border-blue-100/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                Your Impact Stories
              </CardTitle>
              <CardDescription className="text-slate-600 text-lg">
                Every story is a bridge between hearts and hope. Create connections that last a lifetime.
              </CardDescription>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard/stories">
                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                  View All Stories
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard/stories/create">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Story
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {stories.length === 0 ? (
            <div className="text-center py-16">
              {/* Inspirational Hero */}
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Heart className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-yellow-800" />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Ready to Change the World?
              </h3>
              <p className="text-slate-600 mb-12 max-w-3xl mx-auto text-xl leading-relaxed">
                Your first impact story is waiting to be told. When donors discover the real people behind your cause, 
                they don't just give money—they give hope, they give love, they give their hearts.
              </p>
              
              {/* Enhanced Quick Start Guide */}
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/50 rounded-2xl p-8 mb-12 max-w-5xl mx-auto shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800">Your Journey to Impact</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                  <div className="group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">1</div>
                      <h5 className="font-bold text-slate-800 text-lg">Share Your Story</h5>
                    </div>
                    <p className="text-slate-600 leading-relaxed">Tell the world about the real people you help. Make it personal, make it powerful, make it unforgettable.</p>
                  </div>
                  <div className="group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">2</div>
                      <h5 className="font-bold text-slate-800 text-lg">Get Your NMBR</h5>
                    </div>
                    <p className="text-slate-600 leading-relaxed">We'll create a unique code that connects donors directly to your story. Every scan is a new connection.</p>
                  </div>
                  <div className="group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">3</div>
                      <h5 className="font-bold text-slate-800 text-lg">Watch Magic Happen</h5>
                    </div>
                    <p className="text-slate-600 leading-relaxed">See donations flow in as people discover your mission and become lifelong supporters of your cause.</p>
                  </div>
                </div>
              </div>
              
              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/dashboard/stories/create">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xl px-12 py-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                    <Plus className="w-6 h-6 mr-3" />
                    Create Your First Story
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button size="lg" variant="outline" className="text-xl px-12 py-6 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
                    <Eye className="w-6 h-6 mr-3" />
                    See the Magic
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="flex items-center justify-between p-6 border border-border rounded-xl group hover:shadow-sm transition-all duration-200 hover:border-primary/20"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {story.nmbr_code}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">{story.title}</h3>
                      <p className="text-sm text-muted-foreground max-w-md">{story.description}</p>
                      {story.goal_amount && (
                        <div className="flex items-center space-x-2">
                          <Progress
                            value={((story.current_amount || 0) / story.goal_amount) * 100}
                            className="w-32 h-2"
                          />
                          <span className="text-xs text-muted-foreground">
                            ${story.current_amount?.toLocaleString()} / ${story.goal_amount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{story.donations_count} donations</span>
                        <span>{story.engagement_rate}% engagement</span>
                        <Badge variant={story.status === "completed" ? "default" : "secondary"}>
                          {story.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Plan: {tier.name}</h3>
              <p className="text-sm text-muted-foreground">
                You're on the {tier.name} plan with access to all core features.
              </p>
            </div>
            <Link href="/dashboard/upgrade">
              <Button variant="outline">
                Upgrade Plan
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
