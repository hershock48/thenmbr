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
      {/* Welcome Header */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              Welcome back, {org?.name || "Team"}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Ready to create more amazing impact stories? Let's see how your fundraising is doing.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/select-org")}
              className="flex items-center space-x-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Switch Organization</span>
            </Button>
            <Link href="/dashboard/stories/create">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                New Story
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="group hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground">Total Donations</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  ${stats.totalDonations.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  +{stats.monthlyGrowth}% this month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground">Active Donors</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stats.activeDonors}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Engaged supporters
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground">Impact Stories</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stats.totalStories}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.completionRate}% completed
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground">Avg Donation</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  ${stats.avgDonation}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Per donation
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer">
          <Link href="/dashboard/stories/create">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Create Story</CardTitle>
              <CardDescription>Start a new impact story to engage donors</CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer">
          <Link href="/dashboard/analytics">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Analytics</CardTitle>
              <CardDescription>View detailed performance metrics</CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer">
          <Link href="/dashboard/communications">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Communications</CardTitle>
              <CardDescription>Send updates to your donors</CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer">
          <Link href="/dashboard/settings">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
                <Globe className="w-6 h-6 text-gray-600" />
              </div>
              <CardTitle className="text-xl">Settings</CardTitle>
              <CardDescription>Customize your organization</CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>

      {/* Recent Stories */}
      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                Your Impact Stories
              </CardTitle>
              <CardDescription>
                Manage and track your fundraising campaigns
              </CardDescription>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard/stories">
                <Button variant="outline">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard/stories/create">
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  New Story
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {stories.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Ready to Create Your First Impact Story?
              </h3>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
                Your impact story is the heart of NMBR. When donors search your bracelet code, 
                they'll discover the real people behind your cause and become lifelong supporters.
              </p>
              
              {/* Quick Start Guide */}
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-xl p-6 mb-8 max-w-4xl mx-auto">
                <h4 className="text-lg font-semibold text-foreground mb-4">How It Works</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Create Your Story</h5>
                      <p className="text-sm text-muted-foreground">Write about the real people your nonprofit helps and the impact you create.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Get Your NMBR Code</h5>
                      <p className="text-sm text-muted-foreground">We'll generate a unique code that donors can search to find your story.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Share & Fundraise</h5>
                      <p className="text-sm text-muted-foreground">Embed the widget on your website and watch donations come in.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard/stories/create">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Story
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                    <Eye className="w-5 h-5 mr-2" />
                    See How It Works
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