"use client"

import { useState } from "react"
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
      { month: "Jan", views: 8400, engagement: 5200, donations: 840, fundsRaised: 16800 },
      { month: "Feb", views: 10600, engagement: 6800, donations: 1080, fundsRaised: 21600 },
      { month: "Mar", views: 12200, engagement: 7900, donations: 1220, fundsRaised: 24400 },
      { month: "Apr", views: 14800, engagement: 9500, donations: 1480, fundsRaised: 29600 },
      { month: "May", views: 17400, engagement: 11200, donations: 1740, fundsRaised: 34800 },
      { month: "Jun", views: 19600, engagement: 12600, donations: 1960, fundsRaised: 39200 },
    ],
    conversionFunnelData: [
      { stage: "Story Views", count: 19600, percentage: 100 },
      { stage: "Engaged Viewers", count: 12600, percentage: 64.3 },
      { stage: "Donation Page Visits", count: 7800, percentage: 39.8 },
      { stage: "Donation Attempts", count: 2940, percentage: 15.0 },
      { stage: "Completed Donations", count: 1960, percentage: 10.0 },
    ],
    topStoriesData: [
      {
        name: "Maria's Education Journey",
        views: 4200,
        engagement: 2800,
        donations: 420,
        fundsRaised: 8400,
        impact: "12 months of school",
        conversionRate: 10.0
      },
      {
        name: "Ahmed's Medical Care",
        views: 3800,
        engagement: 2400,
        donations: 380,
        fundsRaised: 7600,
        impact: "200 people served",
        conversionRate: 10.0
      },
      {
        name: "Community Garden Project",
        views: 3400,
        engagement: 2200,
        donations: 340,
        fundsRaised: 6800,
        impact: "15 children treated",
        conversionRate: 10.0
      },
      {
        name: "Youth Sports Program",
        views: 2800,
        engagement: 1800,
        donations: 280,
        fundsRaised: 5600,
        impact: "50 families fed",
        conversionRate: 10.0
      },
      {
        name: "Emergency Relief Fund",
        views: 2200,
        engagement: 1400,
        donations: 220,
        fundsRaised: 4400,
        impact: "25 homes rebuilt",
        conversionRate: 10.0
      }
    ],
    donorDemographicsData: [
      { name: "18-24", value: 15, count: 294 },
      { name: "25-34", value: 25, count: 490 },
      { name: "35-44", value: 30, count: 588 },
      { name: "45-54", value: 20, count: 392 },
      { name: "55+", value: 10, count: 196 },
    ],
    impactMetricsData: [
      { category: "Education", fundsRaised: 15000, peopleHelped: 45, stories: 3 },
      { category: "Healthcare", fundsRaised: 12000, peopleHelped: 200, stories: 2 },
      { category: "Community", fundsRaised: 8000, peopleHelped: 75, stories: 2 },
      { category: "Emergency", fundsRaised: 5000, peopleHelped: 25, stories: 1 },
    ]
  }
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months")
  const [selectedMetric, setSelectedMetric] = useState("fundsRaised")
  const { performanceData, conversionFunnelData, topStoriesData, donorDemographicsData, impactMetricsData } = getNonprofitAnalyticsData()

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
              <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Track your impact stories and donor engagement
              </p>
            </div>
            <div className="flex items-center gap-3">
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">1,960</div>
                      <div className="text-sm text-muted-foreground">Total Donors</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">$32.50</div>
                      <div className="text-sm text-muted-foreground">Avg Donation</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">2.3</div>
                      <div className="text-sm text-muted-foreground">Avg Donations/Donor</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">68%</div>
                      <div className="text-sm text-muted-foreground">Repeat Donors</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
