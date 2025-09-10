"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Hash, 
  Mail, 
  ShoppingCart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MousePointer,
  CreditCard,
  Target,
  Clock,
  Zap,
  CheckCircle,
  Star,
  ExternalLink
} from "lucide-react"
import Link from "next/link"

// Mock data for live attribution tracking
const mockAttributionData = {
  totalRevenue: 2847,
  totalOrders: 127,
  conversionRate: 4.2,
  avgOrderValue: 22.4,
  totalStories: 3,
  totalSubscribers: 2847,
  emailOpenRate: 68.5,
  clickThroughRate: 12.3,
  revenueByStory: [
    {
      id: 'nmbr-001',
      title: "Maria's Coffee Journey",
      revenue: 1847,
      orders: 89,
      conversionRate: 4.8,
      subscribers: 1847,
      lastUpdated: '2 minutes ago'
    },
    {
      id: 'nmbr-002', 
      title: "Green Thumbs Garden",
      revenue: 623,
      orders: 28,
      conversionRate: 3.2,
      subscribers: 623,
      lastUpdated: '5 minutes ago'
    },
    {
      id: 'nmbr-003',
      title: "Community Impact",
      revenue: 377,
      orders: 10,
      conversionRate: 2.1,
      subscribers: 377,
      lastUpdated: '1 hour ago'
    }
  ],
  revenueByCampaign: [
    {
      id: 'email-001',
      name: 'Coffee Lovers Newsletter',
      revenue: 1247,
      orders: 56,
      conversionRate: 5.2,
      sent: 1200,
      opened: 820,
      clicked: 101,
      lastSent: '2 hours ago'
    },
    {
      id: 'email-002',
      name: 'Garden Update',
      revenue: 623,
      orders: 28,
      conversionRate: 3.2,
      sent: 800,
      opened: 560,
      clicked: 68,
      lastSent: '1 day ago'
    },
    {
      id: 'sms-001',
      name: 'Flash Sale Alert',
      revenue: 377,
      orders: 10,
      conversionRate: 2.1,
      sent: 500,
      opened: 450,
      clicked: 21,
      lastSent: '3 days ago'
    }
  ],
  attributionFlow: [
    { step: 'Story View', count: 2847, percentage: 100 },
    { step: 'Email Open', count: 1950, percentage: 68.5 },
    { step: 'Link Click', count: 240, percentage: 8.4 },
    { step: 'Add to Cart', count: 180, percentage: 6.3 },
    { step: 'Checkout', count: 127, percentage: 4.5 },
    { step: 'Purchase', count: 127, percentage: 4.5 }
  ],
  realTimeEvents: [
    { time: '2 min ago', event: 'Purchase', story: "Maria's Coffee", amount: 18.00, customer: 'Sarah M.' },
    { time: '5 min ago', event: 'Email Open', story: "Green Thumbs", customer: 'Mike R.' },
    { time: '8 min ago', event: 'Story View', story: "Community Impact", customer: 'Lisa K.' },
    { time: '12 min ago', event: 'Purchase', story: "Maria's Coffee", amount: 32.00, customer: 'John D.' },
    { time: '15 min ago', event: 'Link Click', story: "Green Thumbs", customer: 'Emma S.' }
  ]
}

export default function AttributionDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')
  const [liveData, setLiveData] = useState(mockAttributionData)

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 50),
        totalOrders: prev.totalOrders + Math.floor(Math.random() * 3),
        realTimeEvents: [
          {
            time: 'Just now',
            event: Math.random() > 0.5 ? 'Purchase' : 'Story View',
            story: prev.revenueByStory[Math.floor(Math.random() * 3)].title,
            amount: Math.random() > 0.5 ? (Math.random() * 30 + 10).toFixed(2) : undefined,
            customer: ['Sarah M.', 'Mike R.', 'Lisa K.', 'John D.', 'Emma S.'][Math.floor(Math.random() * 5)]
          },
          ...prev.realTimeEvents.slice(0, 4)
        ]
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Revenue Attribution Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Live tracking of story-to-sale attribution and revenue generation
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live Data
              </Badge>
              <Button asChild>
                <Link href="/demo">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Full Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${liveData.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                  +12% from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{liveData.totalOrders}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                  +8% from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{liveData.conversionRate}%</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                  +0.3% from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${liveData.avgOrderValue}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                  +$2.10 from last week
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="stories" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stories">Revenue by Story</TabsTrigger>
            <TabsTrigger value="campaigns">Revenue by Campaign</TabsTrigger>
            <TabsTrigger value="attribution">Attribution Flow</TabsTrigger>
          </TabsList>

          {/* Revenue by Story */}
          <TabsContent value="stories" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {liveData.revenueByStory.map((story) => (
                <Card key={story.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-primary" />
                        <CardTitle className="text-lg">{story.title}</CardTitle>
                      </div>
                      <Badge variant="secondary">{story.id}</Badge>
                    </div>
                    <CardDescription>Updated {story.lastUpdated}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="text-2xl font-bold">${story.revenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Orders</p>
                        <p className="text-2xl font-bold">{story.orders}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Conversion Rate</span>
                        <span className="font-medium">{story.conversionRate}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${story.conversionRate * 20}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Subscribers</span>
                      <span className="font-medium">{story.subscribers.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Revenue by Campaign */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {liveData.revenueByCampaign.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <Badge variant="outline">
                        {campaign.id.startsWith('email') ? 'Email' : 'SMS'}
                      </Badge>
                    </div>
                    <CardDescription>Sent {campaign.lastSent}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="text-2xl font-bold">${campaign.revenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Orders</p>
                        <p className="text-2xl font-bold">{campaign.orders}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Open Rate</span>
                        <span className="font-medium">{((campaign.opened / campaign.sent) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Click Rate</span>
                        <span className="font-medium">{((campaign.clicked / campaign.sent) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Conversion Rate</span>
                        <span className="font-medium">{campaign.conversionRate}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Attribution Flow */}
          <TabsContent value="attribution" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Journey Attribution</CardTitle>
                <CardDescription>
                  Track how customers move from story view to purchase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {liveData.attributionFlow.map((step, index) => (
                    <div key={step.step} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{step.step}</span>
                          <span className="text-sm text-muted-foreground">
                            {step.count.toLocaleString()} ({step.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${step.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Real-time Events */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Live Activity Feed
            </CardTitle>
            <CardDescription>
              Real-time events happening across your stories and campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {liveData.realTimeEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{event.event}</span>
                      <span className="text-sm text-muted-foreground">in</span>
                      <span className="text-sm font-medium">{event.story}</span>
                      {event.amount && (
                        <Badge variant="secondary">${event.amount}</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {event.customer} • {event.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="py-12">
              <h3 className="text-3xl font-bold mb-4">Ready to Track Your Own Revenue Attribution?</h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                See exactly how your stories drive sales with complete attribution tracking from story view to purchase.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  View Full Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
