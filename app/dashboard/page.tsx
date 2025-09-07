'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Users,
  Heart,
  DollarSign,
  TrendingUp,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Share2,
  Sparkles,
  Target,
  Gift,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Star,
  Building2,
  ShoppingCart
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { TourTrigger } from "@/components/ui/onboarding-tour"
import { AchievementSystem } from "@/components/ui/achievement-system"
import { ProgressTracker } from "@/components/ui/progress-tracker"

interface Story {
  id: string
  nmbr_code: string
  title: string
  description: string
  photo_url?: string
  goal_amount?: number
  current_amount?: number
  status: string
  created_at: string
}

interface Stats {
  totalStories: number
  totalSubscribers: number
  totalRaised: number
  activeStories: number
}

export default function DashboardPage() {
  const { user, org } = useAuth()
  const router = useRouter()
  const [stories, setStories] = useState<Story[]>([])
  const [stats, setStats] = useState<Stats>({
    totalStories: 0,
    totalSubscribers: 0,
    totalRaised: 0,
    activeStories: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (org?.id) {
      fetchStories()
      fetchStats()
    } else if (user && !org) {
      // User is authenticated but no org selected, redirect to org selection
      router.push('/select-org')
    } else if (!user) {
      // User is not authenticated, redirect to login
      router.push('/login')
    }
  }, [org?.id, user, router])

  const fetchStories = async () => {
    try {
      const response = await fetch(`/api/stories?org=${org?.id}`)
      const data = await response.json()
      setStories(data.stories || [])
    } catch (error) {
      console.error('Failed to fetch stories:', error)
    }
  }

  const fetchStats = async () => {
    try {
      // Mock stats for now - in real app this would come from API
      setStats({
        totalStories: stories.length,
        totalSubscribers: 42,
        totalRaised: 15750,
        activeStories: stories.filter(s => s.status === 'active').length
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // If user is not authenticated, show redirect message
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Redirecting to Login</h2>
          <p className="text-gray-600">Please log in to access your dashboard.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3 p-6 border rounded-lg">
              <div className="flex justify-between items-start">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="bg-muted h-10 w-10 rounded-xl" />
              </div>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>

        {/* Stories List Skeleton */}
        <div className="space-y-4 p-6 border rounded-lg">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-6 border rounded-xl">
                <div className="flex items-center space-x-4">
                  <Skeleton className="bg-muted w-14 h-14 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
        </div>
      </div>
      
      {/* Tour completion element */}
      <div data-tour="tour-complete" className="hidden" />
    </div>
  )
}

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-4" data-tour="tour-welcome">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              Welcome back, {org?.name || 'Team'}! 👋
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl">
              Ready to create more amazing impact stories? Let's see how your fundraising is doing.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/select-org')}
              className="flex items-center space-x-2 text-sm"
              data-tour="switch-org-button"
            >
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Switch Org</span>
              <span className="sm:hidden">Switch</span>
            </Button>
            <AchievementSystem />
            <TourTrigger />
            <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-sm">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">New Story</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Tracker Banner */}
      <div className="mb-6" data-tour="progress-banner">
        <ProgressTracker />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" data-tour="stats-cards">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-cyan-100 hover:border-cyan-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Active Stories</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.activeStories}</p>
                <p className="text-xs text-muted-foreground">Stories making impact</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-purple-100 hover:border-purple-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Total Supporters</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.totalSubscribers}</p>
                <p className="text-xs text-muted-foreground">People following your stories</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-green-100 hover:border-green-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Total Raised</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">${stats.totalRaised.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">From your impact stories</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-orange-100 hover:border-orange-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Engagement Rate</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">87%</p>
                <p className="text-xs text-muted-foreground">Stories being followed</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Stories */}
      <Card className="group hover:shadow-lg transition-all duration-300" data-tour="stories-section">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="space-y-2">
              <CardTitle className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />
                Your Impact Stories
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm sm:text-base">
                Manage and track your personalized impact stories that connect donors to the people they help
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Link href="/dashboard/nmbrs" className="w-full sm:w-auto">
                <Button className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white shadow-lg text-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Create New Story</span>
                  <span className="sm:hidden">New Story</span>
                </Button>
              </Link>
              <Link href="/dashboard/nmbrs" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300 text-sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {stories.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No stories yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first impact story to start connecting donors with the people they help
              </p>
              <Link href="/dashboard/nmbrs">
                <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white shadow-lg">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Your First Story
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {stories.slice(0, 3).map((story, index) => (
                <div 
                  key={story.id} 
                  className="flex items-center justify-between p-6 border rounded-xl group hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
                  data-tour={index === 0 ? "story-card-example" : undefined}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {story.nmbr_code}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">{story.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{story.description}</p>
                      {story.goal_amount && (
                        <div className="flex items-center space-x-2">
                          <Progress 
                            value={(story.current_amount || 0) / story.goal_amount * 100} 
                            className="w-32 h-2"
                          />
                          <span className="text-xs text-muted-foreground">
                            ${story.current_amount || 0} / ${story.goal_amount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" data-tour="quick-actions">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-cyan-100 hover:border-cyan-200">
          <CardHeader className="pb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <CardTitle className="text-lg sm:text-xl">Create New Story</CardTitle>
            <CardDescription className="text-sm">
              Add a new impact story to connect donors with the people they help
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Link href="/dashboard/nmbrs">
              <Button className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white text-sm">
                <Plus className="w-4 h-4 mr-2" />
                Start Creating
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-purple-100 hover:border-purple-200">
          <CardHeader className="pb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <CardTitle className="text-lg sm:text-xl">View Analytics</CardTitle>
            <CardDescription className="text-sm">
              See how your stories are performing and track your impact
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Link href="/dashboard/analytics">
              <Button variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 text-sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Reports
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-indigo-100 hover:border-indigo-200">
          <CardHeader className="pb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <CardTitle className="text-lg sm:text-xl">Order Bracelets</CardTitle>
            <CardDescription className="text-sm">
              Create custom numbered bracelets and merchandise for your supporters
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Link href="/marketplace">
              <Button variant="outline" className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 text-sm">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Visit Marketplace
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-green-100 hover:border-green-200">
          <CardHeader>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-xl">Widget Settings</CardTitle>
            <CardDescription>
              Customize your widget to match your brand and style
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/widget">
              <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300">
                <Gift className="w-4 h-4 mr-2" />
                Customize Widget
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
