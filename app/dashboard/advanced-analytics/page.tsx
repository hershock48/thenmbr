"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  DollarSign,
  Target,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  MousePointer,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Zap,
  Award,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Filter,
  Search,
  Settings,
  Share2,
  Bookmark,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react"
import { useOrganization } from "@/contexts/OrganizationContext"

interface AdvancedMetrics {
  // Engagement Metrics
  totalEngagement: number
  engagementRate: number
  avgSessionDuration: number
  bounceRate: number
  returnVisitorRate: number
  
  // Conversion Metrics
  conversionRate: number
  conversionFunnel: {
    stage: string
    visitors: number
    conversion: number
    dropoff: number
  }[]
  
  // Revenue Metrics
  totalRevenue: number
  revenueGrowth: number
  avgOrderValue: number
  lifetimeValue: number
  revenuePerVisitor: number
  
  // Story Performance
  topStories: Array<{
    id: string
    title: string
    views: number
    donations: number
    conversionRate: number
    revenue: number
    engagement: number
  }>
  
  // Geographic Data
  topCountries: Array<{
    country: string
    visitors: number
    donations: number
    revenue: number
  }>
  
  // Device Analytics
  deviceBreakdown: {
    desktop: number
    mobile: number
    tablet: number
  }
  
  // Time-based Analytics
  hourlyTraffic: Array<{
    hour: number
    visitors: number
    donations: number
  }>
  
  weeklyTrends: Array<{
    week: string
    visitors: number
    donations: number
    revenue: number
  }>
  
  // Predictive Analytics
  predictions: {
    nextMonthRevenue: number
    confidence: number
    growthTrend: 'up' | 'down' | 'stable'
    recommendations: string[]
  }
}

export default function AdvancedAnalyticsPage() {
  const { terminology } = useOrganization()
  const [timeRange, setTimeRange] = useState("6months")
  const [selectedMetric, setSelectedMetric] = useState("engagement")
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Mock advanced analytics data
  const advancedMetrics: AdvancedMetrics = {
    totalEngagement: 8947,
    engagementRate: 68.5,
    avgSessionDuration: 4.2,
    bounceRate: 31.2,
    returnVisitorRate: 42.8,
    
    conversionRate: 12.4,
    conversionFunnel: [
      { stage: "Visitors", visitors: 10000, conversion: 100, dropoff: 0 },
      { stage: "Story Views", visitors: 8500, conversion: 85, dropoff: 15 },
      { stage: "Donation Page", visitors: 3200, conversion: 32, dropoff: 53 },
      { stage: "Checkout", visitors: 1800, conversion: 18, dropoff: 14 },
      { stage: "Completed", visitors: 1240, conversion: 12.4, dropoff: 5.6 }
    ],
    
    totalRevenue: 45680,
    revenueGrowth: 23.4,
    avgOrderValue: 36.8,
    lifetimeValue: 89.2,
    revenuePerVisitor: 4.57,
    
    topStories: [
      {
        id: '1',
        title: 'Clean Water for 1000 Families',
        views: 2340,
        donations: 156,
        conversionRate: 6.7,
        revenue: 5620,
        engagement: 8.9
      },
      {
        id: '2',
        title: 'Education Fund for Orphans',
        views: 1890,
        donations: 98,
        conversionRate: 5.2,
        revenue: 3420,
        engagement: 7.2
      },
      {
        id: '3',
        title: 'Medical Supplies for Clinic',
        views: 1560,
        donations: 87,
        conversionRate: 5.6,
        revenue: 2890,
        engagement: 6.8
      }
    ],
    
    topCountries: [
      { country: 'United States', visitors: 4560, donations: 234, revenue: 18920 },
      { country: 'Canada', visitors: 1230, donations: 67, revenue: 5420 },
      { country: 'United Kingdom', visitors: 890, donations: 45, revenue: 3890 },
      { country: 'Australia', visitors: 670, donations: 34, revenue: 2890 },
      { country: 'Germany', visitors: 540, donations: 28, revenue: 2340 }
    ],
    
    deviceBreakdown: {
      desktop: 45.2,
      mobile: 48.7,
      tablet: 6.1
    },
    
    hourlyTraffic: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      visitors: Math.floor(Math.random() * 200) + 50,
      donations: Math.floor(Math.random() * 20) + 5
    })),
    
    weeklyTrends: [
      { week: 'Week 1', visitors: 1200, donations: 45, revenue: 2340 },
      { week: 'Week 2', visitors: 1350, donations: 52, revenue: 2670 },
      { week: 'Week 3', visitors: 1180, donations: 48, revenue: 2450 },
      { week: 'Week 4', visitors: 1420, donations: 61, revenue: 2890 },
      { week: 'Week 5', visitors: 1380, donations: 58, revenue: 2750 },
      { week: 'Week 6', visitors: 1560, donations: 67, revenue: 3120 }
    ],
    
    predictions: {
      nextMonthRevenue: 52340,
      confidence: 87.3,
      growthTrend: 'up',
      recommendations: [
        'Focus on mobile optimization - 48.7% of traffic is mobile',
        'Improve conversion funnel - 14% dropoff at checkout stage',
        'Expand to European markets - strong performance in UK and Germany',
        'Create more engaging content - average session duration is 4.2 minutes'
      ]
    }
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  const getTrendIcon = (value: number, isPositive: boolean = true) => {
    if (value > 0) return <ArrowUpRight className="w-4 h-4 text-green-600" />
    if (value < 0) return <ArrowDownRight className="w-4 h-4 text-red-600" />
    return <Minus className="w-4 h-4 text-gray-600" />
  }

  const getTrendColor = (value: number, isPositive: boolean = true) => {
    if (value > 0) return 'text-green-600'
    if (value < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-muted-foreground">
            Deep insights into your {terminology.fundraising.toLowerCase()} performance and donor behavior
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Engagement</p>
                <p className="text-2xl font-bold">{advancedMetrics.totalEngagement.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(12.4)}
                  <span className={`text-sm ${getTrendColor(12.4)}`}>+12.4%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{advancedMetrics.conversionRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(2.1)}
                  <span className={`text-sm ${getTrendColor(2.1)}`}>+2.1%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${advancedMetrics.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(advancedMetrics.revenueGrowth)}
                  <span className={`text-sm ${getTrendColor(advancedMetrics.revenueGrowth)}`}>+{advancedMetrics.revenueGrowth}%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Session Duration</p>
                <p className="text-2xl font-bold">{advancedMetrics.avgSessionDuration}m</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(0.8)}
                  <span className={`text-sm ${getTrendColor(0.8)}`}>+0.8m</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="conversion">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="stories">Story Performance</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Engagement Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>How users interact with your content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Engagement Rate</span>
                    <span className="font-semibold">{advancedMetrics.engagementRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Bounce Rate</span>
                    <span className="font-semibold">{advancedMetrics.bounceRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Return Visitor Rate</span>
                    <span className="font-semibold">{advancedMetrics.returnVisitorRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>Traffic by device type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Mobile</span>
                    </div>
                    <span className="font-semibold">{advancedMetrics.deviceBreakdown.mobile}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Desktop</span>
                    </div>
                    <span className="font-semibold">{advancedMetrics.deviceBreakdown.desktop}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tablet className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">Tablet</span>
                    </div>
                    <span className="font-semibold">{advancedMetrics.deviceBreakdown.tablet}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Trends</CardTitle>
              <CardDescription>Performance over the last 6 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Chart visualization would go here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conversion Funnel Tab */}
        <TabsContent value="conversion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>Track user journey from visitor to donor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {advancedMetrics.conversionFunnel.map((stage, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{stage.stage}</span>
                        <span className="text-sm text-muted-foreground">{stage.conversion}% conversion</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${stage.conversion}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{stage.visitors.toLocaleString()} visitors</span>
                        <span>{stage.dropoff}% dropoff</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Story Performance Tab */}
        <TabsContent value="stories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Stories</CardTitle>
              <CardDescription>Your most successful impact stories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {advancedMetrics.topStories.map((story, index) => (
                  <div key={story.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{story.title}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">{story.views.toLocaleString()}</span> views
                        </div>
                        <div>
                          <span className="font-medium">{story.donations}</span> donations
                        </div>
                        <div>
                          <span className="font-medium">{story.conversionRate}%</span> conversion
                        </div>
                        <div>
                          <span className="font-medium">${story.revenue.toLocaleString()}</span> revenue
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geographic Tab */}
        <TabsContent value="geographic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Performance</CardTitle>
              <CardDescription>Donor engagement by country</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {advancedMetrics.topCountries.map((country, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{country.country}</h3>
                      <div className="grid grid-cols-3 gap-4 mt-2 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">{country.visitors.toLocaleString()}</span> visitors
                        </div>
                        <div>
                          <span className="font-medium">{country.donations}</span> donations
                        </div>
                        <div>
                          <span className="font-medium">${country.revenue.toLocaleString()}</span> revenue
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Prediction</CardTitle>
                <CardDescription>AI-powered forecast for next month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    ${advancedMetrics.predictions.nextMonthRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Predicted revenue for next month
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Badge variant="secondary">
                      {advancedMetrics.predictions.confidence}% confidence
                    </Badge>
                    <Badge variant={advancedMetrics.predictions.growthTrend === 'up' ? 'default' : 'secondary'}>
                      {advancedMetrics.predictions.growthTrend === 'up' ? 'Growing' : 'Declining'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
                <CardDescription>Optimize your performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {advancedMetrics.predictions.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Zap className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Last Updated */}
      <div className="text-center text-sm text-muted-foreground">
        Last updated: {lastUpdated.toLocaleString()}
      </div>
    </div>
  )
}
