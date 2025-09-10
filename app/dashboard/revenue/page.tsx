"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  DollarSign, 
  BarChart3,
  ShoppingCart,
  Mail,
  MessageSquare,
  Bell,
  Globe,
  Hash,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Award,
  Coffee,
  Heart,
  Building2,
  Smartphone,
  ExternalLink,
  Clock,
  Crown,
  Rocket,
  Gift,
  Phone,
  Calendar,
  FileText,
  Download,
  Play,
  Eye,
  MousePointer,
  CreditCard,
  PieChart,
  LineChart,
  Activity
} from "lucide-react"

// Start with empty metrics - will populate as users create stories and receive donations
const revenueMetrics = {
  totalRevenue: 0,
  monthlyGrowth: 0,
  averageOrderValue: 0,
  conversionRate: 0,
  totalOrders: 0,
  repeatCustomers: 0,
  revenueByStory: [],
  revenueByChannel: [],
  topPerformingProducts: []
}

const optimizationSuggestions = [
  {
    type: "revenue",
    title: "Optimize Maria's Coffee Story",
    description: "This story has the highest conversion rate. Consider promoting it more heavily.",
    impact: "+$2,340 monthly revenue",
    effort: "Low",
    priority: "High"
  },
  {
    type: "conversion",
    title: "Improve Environmental Story",
    description: "Lowest conversion rate. Consider A/B testing different headlines and images.",
    impact: "+$1,200 monthly revenue",
    effort: "Medium",
    priority: "Medium"
  },
  {
    type: "channel",
    title: "Increase SMS Campaigns",
    description: "SMS has high conversion rates. Consider sending more targeted campaigns.",
    impact: "+$3,500 monthly revenue",
    effort: "Low",
    priority: "High"
  },
  {
    type: "product",
    title: "Bundle Coffee with Seeds",
    description: "Create product bundles to increase average order value.",
    impact: "+$1,800 monthly revenue",
    effort: "Medium",
    priority: "Medium"
  }
]

export default function RevenuePage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedTab, setSelectedTab] = useState('overview')

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Donation Analytics</h1>
              <p className="text-muted-foreground">Track and optimize your story-driven donations</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button>
                <Target className="w-4 h-4 mr-2" />
                Optimize Revenue
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          {revenueMetrics.totalRevenue === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <DollarSign className="h-8 w-8 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">No donation data yet</h3>
                    <p className="text-muted-foreground">
                      When you create impact stories and donors start contributing, analytics will appear here.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Button asChild>
                      <a href="/dashboard/nmbrs">Create Your First Story</a>
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Impact stories help donors understand your mission and connect with your cause
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-3xl font-bold">${revenueMetrics.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      +{revenueMetrics.monthlyGrowth}% this month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Order Value</p>
                    <p className="text-3xl font-bold">${revenueMetrics.averageOrderValue}</p>
                    <p className="text-sm text-blue-600 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      +12% vs last month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                    <p className="text-3xl font-bold">{revenueMetrics.conversionRate}%</p>
                    <p className="text-sm text-purple-600 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      +0.8% vs last month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Repeat Customers</p>
                    <p className="text-3xl font-bold">{revenueMetrics.repeatCustomers}%</p>
                    <p className="text-sm text-orange-600 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      +5.2% vs last month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="stories">By Stories</TabsTrigger>
              <TabsTrigger value="channels">By Channels</TabsTrigger>
              <TabsTrigger value="optimization">Optimization</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Story</CardTitle>
                    <CardDescription>Performance breakdown by individual stories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {revenueMetrics.revenueByStory.map((story, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-semibold">{story.story}</h3>
                            <p className="text-sm text-muted-foreground">
                              {story.orders} orders • {story.conversion}% conversion
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">${story.revenue.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">
                              {((story.revenue / revenueMetrics.totalRevenue) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Channel</CardTitle>
                    <CardDescription>Performance breakdown by marketing channel</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {revenueMetrics.revenueByChannel.map((channel, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{channel.channel}</span>
                            <span className="text-sm text-muted-foreground">
                              ${channel.revenue.toLocaleString()} ({channel.percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${channel.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="stories" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Story Performance Analysis</CardTitle>
                  <CardDescription>Detailed breakdown of each story's revenue contribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenueMetrics.revenueByStory.map((story, index) => (
                      <div key={index} className="p-6 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{story.story}</h3>
                            <p className="text-sm text-muted-foreground">
                              {story.orders} total orders
                            </p>
                          </div>
                          <Badge variant="outline" className="text-lg px-3 py-1">
                            ${story.revenue.toLocaleString()}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-3 bg-muted/50 rounded">
                            <div className="text-2xl font-bold text-primary">{story.conversion}%</div>
                            <div className="text-xs text-muted-foreground">Conversion Rate</div>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded">
                            <div className="text-2xl font-bold text-blue-600">{story.orders}</div>
                            <div className="text-xs text-muted-foreground">Total Orders</div>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded">
                            <div className="text-2xl font-bold text-green-600">
                              ${(story.revenue / story.orders).toFixed(2)}
                            </div>
                            <div className="text-xs text-muted-foreground">Avg Order Value</div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Target className="w-4 h-4 mr-2" />
                            Optimize
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="channels" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Channel Performance Analysis</CardTitle>
                  <CardDescription>Detailed breakdown of each marketing channel's effectiveness</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenueMetrics.revenueByChannel.map((channel, index) => (
                      <div key={index} className="p-6 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{channel.channel}</h3>
                            <p className="text-sm text-muted-foreground">
                              {channel.percentage}% of total revenue
                            </p>
                          </div>
                          <Badge variant="outline" className="text-lg px-3 py-1">
                            ${channel.revenue.toLocaleString()}
                          </Badge>
                        </div>
                        
                        <div className="w-full bg-muted rounded-full h-3 mb-4">
                          <div 
                            className="bg-primary h-3 rounded-full" 
                            style={{ width: `${channel.percentage}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            View Analytics
                          </Button>
                          <Button variant="outline" size="sm">
                            <Target className="w-4 h-4 mr-2" />
                            Optimize
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="optimization" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Optimization Suggestions</CardTitle>
                  <CardDescription>AI-powered recommendations to increase your revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {optimizationSuggestions.map((suggestion, index) => (
                      <div key={index} className="p-6 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{suggestion.title}</h3>
                              <Badge 
                                variant={suggestion.priority === 'High' ? 'destructive' : suggestion.priority === 'Medium' ? 'default' : 'secondary'}
                              >
                                {suggestion.priority} Priority
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-4">{suggestion.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <span className="font-medium text-green-600">{suggestion.impact}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-blue-600" />
                                <span className="text-blue-600">{suggestion.effort} Effort</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm">
                            <Rocket className="w-4 h-4 mr-2" />
                            Implement
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-2" />
                            Learn More
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
