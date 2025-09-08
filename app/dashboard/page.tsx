"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Users,
  Heart,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Share2,
  Sparkles,
  Target,
  BarChart3,
  ArrowRight,
  Building2,
  QrCode,
  TrendingUp,
  DollarSign,
  Package,
  Zap,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { useAuth } from "@/contexts/AuthContext"
import { useOrganization } from "@/contexts/OrganizationContext"
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
  const { terminology, orgType, getMetricsForType } = useOrganization()
  const router = useRouter()
  const [stories, setStories] = useState<Story[]>([])
  const [stats, setStats] = useState<Stats>({
    totalStories: 0,
    totalSubscribers: 0,
    totalRaised: 0,
    activeStories: 0,
  })
  const [loading, setLoading] = useState(true)
  const [businessMetrics, setBusinessMetrics] = useState({
    storyDrivenSales: 47250,
    qrCodeScans: 1847,
    conversionRate: 12.4,
    avgOrderValue: 89.5,
    revenueShare: 2365,
    activeProducts: 23,
  })
  const [nonprofitMetrics, setNonprofitMetrics] = useState({
    totalDonations: 15750,
    activeDonors: 342,
    impactStories: 28,
    avgDonation: 46.05,
    donorRetention: 78.5,
    storyEngagement: 92.3,
  })

  useEffect(() => {
    if (org?.id) {
      fetchStories()
      fetchStats()
    } else if (user && !org) {
      router.push("/select-org")
    } else if (!user) {
      router.push("/login")
    }
  }, [org, user, router])

  const fetchStories = async () => {
    try {
      const response = await fetch(`/api/stories?org=${org?.id}`)
      const data = await response.json()
      setStories(data.stories || [])
    } catch (error) {
      console.error("Failed to fetch stories:", error)
    }
  }

  const fetchStats = async () => {
    try {
      setStats({
        totalStories: stories.length,
        totalSubscribers: orgType === "nonprofit" ? nonprofitMetrics.activeDonors : 42,
        totalRaised: orgType === "nonprofit" ? nonprofitMetrics.totalDonations : 15750,
        activeStories: stories.filter((s) => s.status === "active").length,
      })
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const getWelcomeMessage = () => {
    switch (orgType) {
      case "nonprofit":
        return "Ready to create more amazing impact stories? Let's see how your fundraising is doing."
      case "grassroots":
        return "Ready to share more community project updates? Let's see how your projects are progressing."
      case "business":
        return "Ready to boost your story-driven sales? Let's see how your product stories are converting customers."
      default:
        return "Ready to create more amazing stories? Let's see how things are going."
    }
  }

  const getBusinessMetrics = () => {
    if (orgType !== "business") return getMetricsForType()

    return [
      {
        key: "story-sales",
        name: "Story-Driven Sales",
        description: "Revenue from story engagement",
        icon: DollarSign,
      },
      {
        key: "qr-scans",
        name: "QR Code Scans",
        description: "Product story discoveries",
        icon: QrCode,
      },
      {
        key: "conversion",
        name: "Story Conversion",
        description: "Scan to purchase rate",
        icon: TrendingUp,
      },
      {
        key: "revenue-share",
        name: "Revenue Share",
        description: "Your platform earnings",
        icon: Zap,
      },
    ]
  }

  const getNonprofitMetrics = () => {
    return [
      {
        key: "donations",
        name: "Total Donations",
        description: "Funds raised through stories",
        icon: DollarSign,
      },
      {
        key: "donors",
        name: "Active Donors",
        description: "Engaged supporters",
        icon: Users,
      },
      {
        key: "stories",
        name: "Impact Stories",
        description: "Published story connections",
        icon: Heart,
      },
      {
        key: "engagement",
        name: "Story Engagement",
        description: "Donor interaction rate",
        icon: TrendingUp,
      },
    ]
  }

  // Debug logging
  console.log("Dashboard Debug:", { orgType, org: org?.organization_type, businessMetrics: businessMetrics })

  // Force business metrics if org type is business or if we detect business context
  const isBusiness = orgType === "business" || org?.organization_type === "business"
  
  const metrics = isBusiness
    ? getBusinessMetrics()
    : orgType === "nonprofit"
      ? getNonprofitMetrics()
      : getMetricsForType()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Redirecting to Login</h2>
          <p className="text-slate-600">Please log in to access your dashboard.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
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
        <div data-tour="tour-complete" className="hidden" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4" data-tour="tour-welcome">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Welcome back, {org?.name || "Team"}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">{getWelcomeMessage()}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/select-org")}
              className="flex items-center space-x-2"
              data-tour="switch-org-button"
            >
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Switch Organization</span>
              <span className="sm:hidden">Switch</span>
            </Button>
            <AchievementSystem />
            <TourTrigger />
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">New {terminology.stories.split(" ")[0]}</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6" data-tour="progress-banner">
        <ProgressTracker />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-tour="stats-cards">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon
          let value: string | number = "0"

          if (isBusiness) {
            switch (metric.key) {
              case "story-sales":
                value = `$${businessMetrics.storyDrivenSales.toLocaleString()}`
                break
              case "qr-scans":
                value = businessMetrics.qrCodeScans.toLocaleString()
                break
              case "conversion":
                value = `${businessMetrics.conversionRate}%`
                break
              case "revenue-share":
                value = `$${businessMetrics.revenueShare.toLocaleString()}`
                break
              default:
                value = businessMetrics.activeProducts
            }
          } else if (orgType === "nonprofit") {
            switch (metric.key) {
              case "donations":
                value = `$${nonprofitMetrics.totalDonations.toLocaleString()}`
                break
              case "donors":
                value = nonprofitMetrics.activeDonors.toLocaleString()
                break
              case "stories":
                value = nonprofitMetrics.impactStories
                break
              case "engagement":
                value = `${nonprofitMetrics.storyEngagement}%`
                break
              default:
                value = stats.activeStories
            }
          } else {
            switch (metric.key) {
              case "donations":
              case "support":
              case "sales":
                value = `$${stats.totalRaised.toLocaleString()}`
                break
              case "donors":
              case "supporters":
              case "customers":
                value = stats.totalSubscribers
                break
              case "campaigns":
              case "projects":
                value = stats.activeStories
                break
              case "stories":
              case "updates":
                value = stats.totalStories
                break
              default:
                value = index === 3 ? "87%" : stats.activeStories
            }
          }

          return (
            <Card
              key={metric.key}
              className="group hover:shadow-md transition-all duration-200 bg-card border-border hover:border-primary/20"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground truncate">{metric.name}</p>
                    <p className="text-2xl font-bold text-card-foreground mt-1">{value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200 flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {orgType === "business" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="group hover:shadow-md transition-all duration-200 bg-card border-border hover:border-primary/20">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl text-card-foreground">Add Product Stories</CardTitle>
              <CardDescription className="text-muted-foreground">
                Create compelling stories for your products with embedded QR codes
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Create Product Story
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-md transition-all duration-200 bg-card border-border hover:border-primary/20">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                <QrCode className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl text-card-foreground">Generate QR Codes</CardTitle>
              <CardDescription className="text-muted-foreground">
                Create unique QR codes for product packaging and marketing materials
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                variant="outline"
                className="w-full border-border text-card-foreground hover:bg-muted bg-transparent"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Generate Codes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-md transition-all duration-200 bg-card border-border hover:border-primary/20">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl text-card-foreground">ROI Analytics</CardTitle>
              <CardDescription className="text-muted-foreground">
                Track story-driven sales performance and revenue sharing
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link href="/dashboard/analytics">
                <Button
                  variant="outline"
                  className="w-full border-border text-card-foreground hover:bg-muted bg-transparent"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View ROI Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}

      <Card
        className="group hover:shadow-md transition-all duration-200 bg-card border-border"
        data-tour="stories-section"
      >
        <CardHeader className="border-b border-border">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-card-foreground flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                Your {terminology.stories}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {orgType === "nonprofit"
                  ? "Manage and track your personalized impact stories that connect donors to the people they help"
                  : orgType === "grassroots"
                    ? "Manage and track your community project stories that connect supporters to local initiatives"
                    : "Manage and track your product stories that drive customer engagement and sales"}
              </CardDescription>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard/stories/create">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New {terminology.stories.split(" ")[0]}
                </Button>
              </Link>
              <Link href="/dashboard/stories">
                <Button variant="outline" className="border-border text-card-foreground hover:bg-muted bg-transparent">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {stories.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                No {terminology.stories.toLowerCase()} yet
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {orgType === "nonprofit"
                  ? "Create your first impact story to start connecting donors with the people they help"
                  : orgType === "grassroots"
                    ? "Create your first project story to start connecting supporters with your community initiatives"
                    : "Create your first product story to start driving customer engagement and sales"}
              </p>
              <Link href="/dashboard/stories/create">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Your First {terminology.stories.split(" ")[0]}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {stories.slice(0, 3).map((story, index) => (
                <div
                  key={story.id}
                  className="flex items-center justify-between p-6 border border-border rounded-xl group hover:shadow-sm transition-all duration-200 hover:border-primary/20"
                  data-tour={index === 0 ? "story-card-example" : undefined}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {story.nmbr_code}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-card-foreground">{story.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{story.description}</p>
                      {story.goal_amount && (
                        <div className="flex items-center space-x-2">
                          <Progress
                            value={((story.current_amount || 0) / story.goal_amount) * 100}
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-card-foreground"
                      >
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

      {orgType !== "business" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-tour="quick-actions">
          <Card className="group hover:shadow-md transition-all duration-200 bg-card border-border hover:border-primary/20">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl text-card-foreground">
                Create New {terminology.stories.split(" ")[0]}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {orgType === "nonprofit"
                  ? "Add a new impact story to connect donors with the people they help"
                  : "Add a new project story to connect supporters with community initiatives"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link href="/dashboard/stories/create">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Start Creating
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-md transition-all duration-200 bg-card border-border hover:border-primary/20">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl text-card-foreground">View {terminology.analytics}</CardTitle>
              <CardDescription className="text-muted-foreground">
                {orgType === "nonprofit"
                  ? "See how your stories are performing and track your fundraising impact"
                  : "See how your projects are performing and track community engagement"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link href="/dashboard/analytics">
                <Button
                  variant="outline"
                  className="w-full border-border text-card-foreground hover:bg-muted bg-transparent"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Reports
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-md transition-all duration-200 bg-card border-border hover:border-primary/20">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl text-card-foreground">Manage Stories</CardTitle>
              <CardDescription className="text-muted-foreground">
                {orgType === "nonprofit"
                  ? "View and manage all your impact stories in one place"
                  : "View and manage all your project stories in one place"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link href="/dashboard/stories">
                <Button
                  variant="outline"
                  className="w-full border-border text-card-foreground hover:bg-muted bg-transparent"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Manage Stories
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
