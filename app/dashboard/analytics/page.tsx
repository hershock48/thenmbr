'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  DollarSign,
  Mail,
  Eye,
  MousePointer,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Target,
  Zap,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AnalyticsData {
  revenue: {
    total: number
    monthly: number
    weekly: number
    daily: number
    growth: number
  }
  subscribers: {
    total: number
    new: number
    active: number
    growth: number
  }
  engagement: {
    emailOpenRate: number
    clickRate: number
    donationRate: number
    avgSessionTime: number
  }
  stories: {
    total: number
    active: number
    completed: number
    avgRaised: number
  }
  geographic: Array<{
    country: string
    donations: number
    percentage: number
  }>
  timeline: Array<{
    date: string
    revenue: number
    subscribers: number
    donations: number
  }>
  topStories: Array<{
    id: string
    title: string
    raised: number
    goal: number
    subscribers: number
    growth: number
  }>
}

export default function AnalyticsPage() {
  const { user, org } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [timeRange, setTimeRange] = useState("30d")
  const [activeTab, setActiveTab] = useState("overview")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (org?.id) {
      fetchAnalytics()
    } else if (user && !org) {
      router.push('/select-org')
    } else if (!user) {
      router.push('/login')
    }
  }, [org?.id, user, router, timeRange])

  const fetchAnalytics = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError("")
      
      // Simulate API call with time range parameter
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data for now - in real app this would come from API
      const mockData: AnalyticsData = {
        revenue: {
          total: 157500,
          monthly: 12500,
          weekly: 3200,
          daily: 450,
          growth: 12.5
        },
        subscribers: {
          total: 2847,
          new: 156,
          active: 2103,
          growth: 8.2
        },
        engagement: {
          emailOpenRate: 24.8,
          clickRate: 3.2,
          donationRate: 1.8,
          avgSessionTime: 4.2
        },
        stories: {
          total: 45,
          active: 32,
          completed: 13,
          avgRaised: 3500
        },
        geographic: [
          { country: "United States", donations: 125000, percentage: 79.4 },
          { country: "Canada", donations: 18500, percentage: 11.7 },
          { country: "United Kingdom", donations: 8900, percentage: 5.6 },
          { country: "Australia", donations: 6100, percentage: 3.9 }
        ],
        timeline: [
          { date: "2024-01-01", revenue: 12000, subscribers: 2500, donations: 45 },
          { date: "2024-01-08", revenue: 13500, subscribers: 2600, donations: 52 },
          { date: "2024-01-15", revenue: 11800, subscribers: 2550, donations: 38 },
          { date: "2024-01-22", revenue: 14200, subscribers: 2700, donations: 61 },
          { date: "2024-01-29", revenue: 12800, subscribers: 2650, donations: 48 }
        ],
        topStories: [
          { id: "1", title: "Maria's Water Well", raised: 8500, goal: 10000, subscribers: 234, growth: 15.2 },
          { id: "2", title: "Ahmed's Education", raised: 6200, goal: 8000, subscribers: 189, growth: 8.7 },
          { id: "3", title: "Sarah's Medical Care", raised: 4500, goal: 6000, subscribers: 156, growth: 12.3 },
          { id: "4", title: "Community Garden", raised: 3200, goal: 5000, subscribers: 98, growth: 5.4 }
        ]
      }
      setData(mockData)
      if (isRefresh) {
        setSuccess("Analytics data refreshed successfully")
        setTimeout(() => setSuccess(""), 3000)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      setError("Failed to fetch analytics data. Please try again.")
      setTimeout(() => setError(""), 5000)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleExport = async () => {
    if (!data) return
    
    setExporting(true)
    try {
      // Simulate export generation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const exportData = {
        timeRange,
        generatedAt: new Date().toISOString(),
        ...data
      }
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics_${timeRange}_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setSuccess("Analytics data exported successfully")
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      setError("Failed to export analytics data")
      setTimeout(() => setError(""), 3000)
    } finally {
      setExporting(false)
    }
  }

  const handleRefresh = () => {
    fetchAnalytics(true)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Redirecting to Login</h2>
          <p className="text-gray-600">Please log in to access your analytics.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Track your fundraising performance</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-8 bg-gray-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!data) return null

  const StatCard = ({ title, value, change, icon: Icon, trend, subtitle }: {
    title: string
    value: string | number
    change?: number
    icon: any
    trend?: 'up' | 'down' | 'neutral'
    subtitle?: string
  }) => {
    // Validate data to prevent display issues
    const safeValue = value ?? 'N/A'
    const safeChange = change ?? 0
    const safeTrend = trend ?? 'neutral'
    
    return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{safeValue}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            {safeChange !== 0 && (
              <div className="flex items-center mt-2">
                {safeTrend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                ) : safeTrend === 'down' ? (
                  <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                ) : (
                  <Activity className="w-4 h-4 text-gray-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  safeTrend === 'up' ? 'text-green-600' : 
                  safeTrend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {safeChange > 0 ? '+' : ''}{safeChange}%
                </span>
              </div>
            )}
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Error and Success Messages */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <div className="w-4 h-4 text-red-500">⚠️</div>
          <span className="text-red-700 text-sm">{error}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setError("")}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </Button>
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <div className="w-4 h-4 text-green-500">✅</div>
          <span className="text-green-700 text-sm">{success}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSuccess("")}
            className="ml-auto text-green-500 hover:text-green-700"
          >
            ×
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your fundraising performance and engagement</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button 
            size="sm" 
            onClick={handleExport}
            disabled={exporting || !data}
          >
            <Download className="w-4 h-4 mr-2" />
            {exporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${data.revenue.total.toLocaleString()}`}
          change={data.revenue.growth}
          icon={DollarSign}
          trend="up"
          subtitle={`$${data.revenue.monthly.toLocaleString()} this month`}
        />
        <StatCard
          title="Total Subscribers"
          value={data.subscribers.total.toLocaleString()}
          change={data.subscribers.growth}
          icon={Users}
          trend="up"
          subtitle={`${data.subscribers.new} new this month`}
        />
        <StatCard
          title="Active Stories"
          value={data.stories.active}
          icon={Heart}
          subtitle={`${data.stories.completed} completed`}
        />
        <StatCard
          title="Email Open Rate"
          value={`${data.engagement.emailOpenRate}%`}
          change={2.1}
          icon={Mail}
          trend="up"
          subtitle="Industry avg: 21.5%"
        />
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="stories">Stories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Revenue Trend
                </CardTitle>
                <CardDescription>Revenue over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.timeline.map((point, index) => (
                    <div key={point.date} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-sm text-gray-600">
                          {new Date(point.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${point.revenue.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">{point.donations} donations</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Geographic Distribution
                </CardTitle>
                <CardDescription>Donations by country</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.geographic.map((country, index) => {
                    const safePercentage = Math.min(Math.max(country.percentage || 0, 0), 100)
                    return (
                      <div key={country.country} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{country.country || 'Unknown'}</span>
                          <span className="text-sm text-gray-600">{safePercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${safePercentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Stories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Top Performing Stories
              </CardTitle>
              <CardDescription>Your most successful fundraising campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topStories.map((story, index) => {
                  const safeRaised = story.raised || 0
                  const safeGoal = story.goal || 1
                  const safeSubscribers = story.subscribers || 0
                  const safeGrowth = story.growth || 0
                  const progressPercentage = safeGoal > 0 ? Math.min((safeRaised / safeGoal) * 100, 100) : 0
                  
                  return (
                    <div key={story.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="font-bold text-blue-600">#{story.id || index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{story.title || 'Untitled Story'}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{safeSubscribers} subscribers</span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              +{safeGrowth}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${safeRaised.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">of ${safeGoal.toLocaleString()}</div>
                        <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Monthly Revenue"
              value={`$${data.revenue.monthly.toLocaleString()}`}
              change={data.revenue.growth}
              icon={Calendar}
              trend="up"
            />
            <StatCard
              title="Weekly Revenue"
              value={`$${data.revenue.weekly.toLocaleString()}`}
              change={5.2}
              icon={Clock}
              trend="up"
            />
            <StatCard
              title="Daily Revenue"
              value={`$${data.revenue.daily.toLocaleString()}`}
              change={-2.1}
              icon={Zap}
              trend="down"
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>Detailed revenue analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Revenue charts and detailed breakdown coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Email Open Rate"
              value={`${data.engagement.emailOpenRate}%`}
              change={2.1}
              icon={Eye}
              trend="up"
            />
            <StatCard
              title="Click Rate"
              value={`${data.engagement.clickRate}%`}
              change={0.8}
              icon={MousePointer}
              trend="up"
            />
            <StatCard
              title="Donation Rate"
              value={`${data.engagement.donationRate}%`}
              change={0.3}
              icon={Target}
              trend="up"
            />
            <StatCard
              title="Avg Session Time"
              value={`${data.engagement.avgSessionTime}m`}
              change={0.5}
              icon={Activity}
              trend="up"
            />
          </div>
        </TabsContent>

        <TabsContent value="stories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Stories"
              value={data.stories.total}
              icon={Heart}
            />
            <StatCard
              title="Active Stories"
              value={data.stories.active}
              icon={CheckCircle}
            />
            <StatCard
              title="Completed Stories"
              value={data.stories.completed}
              icon={Star}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

