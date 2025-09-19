"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  DollarSign, 
  Calendar, 
  Download, 
  Filter,
  Target,
  Share2,
  BarChart3,
  Activity
} from "lucide-react"

const getNonprofitAnalyticsData = () => {
  return {
    performanceData: [
      // Start with empty data - will populate as users create content
      { month: "Jan", views: 0, engagement: 0, donations: 0, fundsRaised: 0 },
      { month: "Feb", views: 0, engagement: 0, donations: 0, fundsRaised: 0 },
      { month: "Mar", views: 0, engagement: 0, donations: 0, fundsRaised: 0 },
      { month: "Apr", views: 0, engagement: 0, donations: 0, fundsRaised: 0 },
      { month: "May", views: 0, engagement: 0, donations: 0, fundsRaised: 0 },
      { month: "Jun", views: 0, engagement: 0, donations: 0, fundsRaised: 0 },
    ],
    conversionFunnelData: [
      { stage: "Story Views", count: 0, percentage: 0 },
      { stage: "Engaged Viewers", count: 0, percentage: 0 },
      { stage: "Donation Page Visits", count: 0, percentage: 0 },
      { stage: "Donation Attempts", count: 0, percentage: 0 },
      { stage: "Completed Donations", count: 0, percentage: 0 },
    ],
    topStoriesData: [
      // Empty - will populate as users create stories
    ] as Array<{
      name: string
      impact: string
      views: number
      donations: number
      fundsRaised: number
      conversionRate: number
    }>,
    donorDemographicsData: [
      // Empty - will populate as donors engage
    ],
    impactMetricsData: [
      // Empty - will populate as users create stories and receive donations
    ],
    hasData: false // Flag to show empty states
  }
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months")
  const [selectedMetric, setSelectedMetric] = useState("fundsRaised")
  const [isLive, setIsLive] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const { performanceData, conversionFunnelData, topStoriesData, donorDemographicsData, impactMetricsData, hasData } = getNonprofitAnalyticsData()

  // Simulate real-time updates
  React.useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setLastUpdated(new Date())
      }, 30000) // Update every 30 seconds
      
      return () => clearInterval(interval)
    }
  }, [isLive])

  const totalViews = performanceData.reduce((sum, data) => sum + data.views, 0)
  const totalEngagement = performanceData.reduce((sum, data) => sum + data.engagement, 0)
  const totalDonations = performanceData.reduce((sum, data) => sum + data.donations, 0)
  const totalFundsRaised = performanceData.reduce((sum, data) => sum + data.fundsRaised, 0)
  const conversionRate = totalViews > 0 ? (totalDonations / totalViews) * 100 : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
                {isLive && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    <Activity className="w-3 h-3 mr-1 animate-pulse" />
                    Live
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">
                Track your impact stories and donor engagement
                {isLive && (
                  <span className="text-xs text-muted-foreground ml-2">
                    • Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant={isLive ? "default" : "outline"}
                size="sm"
                onClick={() => setIsLive(!isLive)}
              >
                <Activity className="h-4 w-4 mr-2" />
                {isLive ? "Live" : "Paused"}
              </Button>
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
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Views
                  </CardTitle>
                  <div className="text-2xl font-bold text-foreground">
                    {totalViews.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    +12.5% from last month
                  </div>
                </div>
                <Eye className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Donations
                  </CardTitle>
                  <div className="text-2xl font-bold text-foreground">
                    {totalDonations.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    +8.2% from last month
                  </div>
                </div>
                <Heart className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Funds Raised
                  </CardTitle>
                  <div className="text-2xl font-bold text-foreground">
                    ${totalFundsRaised.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    +15.3% from last month
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Conversion Rate
                  </CardTitle>
                  <div className="text-2xl font-bold text-foreground">
                    {conversionRate.toFixed(1)}%
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    +2.1% from last month
                  </div>
                </div>
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="conversion">Conversion Funnel</TabsTrigger>
            <TabsTrigger value="stories">Top Stories</TabsTrigger>
            <TabsTrigger value="demographics">Donor Insights</TabsTrigger>
          </TabsList>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Funds Raised Over Time</CardTitle>
                  <CardDescription>Monthly funds raised from your impact stories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {hasData ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip 
                            formatter={(value) => [`$${value.toLocaleString()}`, 'Funds Raised']}
                            labelFormatter={(label) => `Month: ${label}`}
                          />
                          <Area
                            type="monotone"
                            dataKey="fundsRaised"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary))"
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                            <BarChart3 className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">No data yet</h3>
                            <p className="text-muted-foreground">Create impact stories to see analytics here</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                  <CardDescription>Views and engagement trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {hasData ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="views"
                            stroke="#8884d8"
                            strokeWidth={2}
                            name="Views"
                          />
                          <Line
                            type="monotone"
                            dataKey="engagement"
                            stroke="#82ca9d"
                            strokeWidth={2}
                            name="Engagement"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                            <Activity className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">No engagement data</h3>
                            <p className="text-muted-foreground">Views and engagement will appear here</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Impact by Category</CardTitle>
                <CardDescription>Funds raised and people helped by cause category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={impactMetricsData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="category" type="category" width={100} />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'fundsRaised' ? `$${value.toLocaleString()}` : value,
                          name === 'fundsRaised' ? 'Funds Raised' : 'People Helped'
                        ]}
                      />
                      <Legend />
                      <Bar dataKey="fundsRaised" fill="hsl(var(--primary))" name="Funds Raised" />
                      <Bar dataKey="peopleHelped" fill="#82ca9d" name="People Helped" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversion Funnel Tab */}
          <TabsContent value="conversion" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Donation Conversion Funnel</CardTitle>
                <CardDescription>How viewers progress from story views to completed donations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversionFunnelData.map((stage, index) => (
                    <div key={stage.stage} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{stage.stage}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            {stage.count.toLocaleString()} people
                          </span>
                          <span className="font-semibold text-primary">
                            {stage.percentage}%
                          </span>
                        </div>
                      </div>
                      <Progress value={stage.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Top Stories Tab */}
          <TabsContent value="stories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Stories</CardTitle>
                <CardDescription>Stories driving the most engagement and funds raised</CardDescription>
              </CardHeader>
              <CardContent>
                {hasData && topStoriesData.length > 0 ? (
                  <div className="space-y-4">
                    {topStoriesData.map((story, index) => (
                      <div key={story.name} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">#{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{story.name}</h3>
                            <p className="text-sm text-muted-foreground">{story.impact}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="font-semibold text-foreground">{story.views.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Views</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-foreground">{story.donations.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Donations</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-foreground">${story.fundsRaised.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Funds Raised</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-foreground">{story.conversionRate}%</div>
                            <div className="text-xs text-muted-foreground">Conversion</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No stories yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create impact stories to see performance analytics here
                    </p>
                    <Button asChild>
                      <a href="/dashboard/nmbrs">Create Your First Story</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demographics Tab */}
          <TabsContent value="demographics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Donor Age Demographics</CardTitle>
                  <CardDescription>Age distribution of your donors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={donorDemographicsData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name}: ${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {donorDemographicsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${value}%`, 'Donors']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Donor Engagement Summary</CardTitle>
                  <CardDescription>Key insights about your donor base</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {hasData ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">{totalDonations.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Total Donors</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          ${totalDonations > 0 ? (totalFundsRaised / totalDonations).toFixed(2) : '0.00'}
                        </div>
                        <div className="text-sm text-muted-foreground">Avg Donation</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {totalDonations > 0 ? (totalDonations / totalDonations).toFixed(1) : '0.0'}
                        </div>
                        <div className="text-sm text-muted-foreground">Avg Donations/Donor</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">0%</div>
                        <div className="text-sm text-muted-foreground">Repeat Donors</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">No donor data yet</h3>
                      <p className="text-muted-foreground">
                        Donor insights will appear here as people engage with your stories
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
