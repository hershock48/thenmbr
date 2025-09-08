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
} from "recharts"
import { TrendingUp, Users, Eye, ShoppingCart, DollarSign, Calendar, Download, Filter } from "lucide-react"

const getNonprofitAnalyticsData = () => {
  return {
    performanceData: [
      { month: "Jan", views: 8400, engagement: 5200, donations: 840, revenue: 16800 },
      { month: "Feb", views: 10600, engagement: 6800, donations: 1080, revenue: 21600 },
      { month: "Mar", views: 12200, engagement: 7900, donations: 1220, revenue: 24400 },
      { month: "Apr", views: 14800, engagement: 9500, donations: 1480, revenue: 29600 },
      { month: "May", views: 17400, engagement: 11200, donations: 1740, revenue: 34800 },
      { month: "Jun", views: 19600, engagement: 12600, donations: 1960, revenue: 39200 },
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
        revenue: 8400,
        impact: "12 months of school",
      },
      {
        name: "Clean Water for Village",
        views: 3800,
        engagement: 2500,
        donations: 380,
        revenue: 7600,
        impact: "200 people served",
      },
      {
        name: "Medical Care for Children",
        views: 3400,
        engagement: 2200,
        donations: 340,
        revenue: 6800,
        impact: "15 children treated",
      },
      {
        name: "Food Security Program",
        views: 2800,
        engagement: 1800,
        donations: 280,
        revenue: 5600,
        impact: "50 families fed",
      },
      {
        name: "Disaster Relief Fund",
        views: 2200,
        engagement: 1400,
        donations: 220,
        revenue: 4400,
        impact: "25 homes rebuilt",
      },
    ],
  }
}

const COLORS = ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#e0f2fe"]

export default function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState("6months")
  const [selectedMetric, setSelectedMetric] = useState("revenue")
  const { performanceData, conversionFunnelData, topStoriesData } = getNonprofitAnalyticsData()

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Advanced Analytics</h1>
            <p className="text-muted-foreground">Deep insights into your story-driven commerce performance</p>
          </div>
          <div className="flex gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <Calendar className="h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$324,800</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-primary" />
                <span className="text-primary">+23.5%</span> from last period
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Story Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">122,200</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-primary" />
                <span className="text-primary">+18.2%</span> from last period
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">QR Code Scans</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">81,200</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-primary" />
                <span className="text-primary">+15.7%</span> from last period
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversions</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">16,240</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-primary" />
                <span className="text-primary">+28.3%</span> from last period
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="conversion">Conversion Funnel</TabsTrigger>
            <TabsTrigger value="geographic">Geographic</TabsTrigger>
            <TabsTrigger value="stories">Top Stories</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Track your story-driven commerce metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="views"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                        name="Story Views"
                      />
                      <Line
                        type="monotone"
                        dataKey="engagement"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                        name="Engagement"
                      />
                      <Line
                        type="monotone"
                        dataKey="donations"
                        stroke="hsl(var(--chart-3))"
                        strokeWidth={2}
                        name="Donations"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Attribution</CardTitle>
                <CardDescription>Revenue generated from story-driven sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversion" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel Analysis</CardTitle>
                <CardDescription>Track user journey from product view to purchase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversionFunnelData.map((stage, index) => (
                    <div key={stage.stage} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">{stage.stage}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{stage.count.toLocaleString()}</span>
                          <Badge variant="secondary">{stage.percentage}%</Badge>
                        </div>
                      </div>
                      <Progress value={stage.percentage} className="h-3" />
                      {index < conversionFunnelData.length - 1 && (
                        <div className="text-xs text-muted-foreground text-right">
                          Drop-off:{" "}
                          {(
                            ((conversionFunnelData[index].count - conversionFunnelData[index + 1].count) /
                              conversionFunnelData[index].count) *
                            100
                          ).toFixed(1)}
                          %
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate by Stage</CardTitle>
                <CardDescription>Visual representation of conversion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={conversionFunnelData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="stage" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="percentage" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geographic" className="space-y-6">
            {/* Geographic data remains unchanged */}
          </TabsContent>

          <TabsContent value="stories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Stories</CardTitle>
                <CardDescription>Stories driving the most engagement and revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topStoriesData.map((story, index) => (
                    <div key={story.name} className="flex items-center justify-between p-4 rounded-lg bg-muted">
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{story.name}</h4>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>{story.views.toLocaleString()} views</span>
                            <span>{story.engagement.toLocaleString()} engagement</span>
                            <span>{story.donations.toLocaleString()} donations</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-foreground">${story.revenue.toLocaleString()}</div>
                        <div className="flex items-center gap-1 text-sm">
                          <TrendingUp className="h-3 w-3 text-primary" />
                          <span className="text-primary">{story.roi}% ROI</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{story.impact}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
