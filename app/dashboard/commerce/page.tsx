"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Hash,
  Mail,
  MousePointer,
  BarChart3,
  Calendar,
  Filter,
  Download,
  ExternalLink
} from "lucide-react"
import { useOrganization } from "@/contexts/OrganizationContext"
import { useSubscription } from "@/contexts/SubscriptionContext"
import { CommerceAnalytics } from "@/types/commerce"

// Mock analytics data
const mockAnalytics: CommerceAnalytics = {
  revenue: {
    total: 45680,
    byNmbr: {
      'nmbr-4': 12500,
      'nmbr-7': 8900,
      'nmbr-12': 6800,
      'nmbr-15': 4200,
      'nmbr-23': 3380
    },
    byUpdate: {
      'update-2024-01-20': 8500,
      'update-2024-01-15': 7200,
      'update-2024-01-10': 6800,
      'update-2024-01-05': 5200
    },
    byProduct: {
      'coffee-12oz': 15600,
      'textile-scarf': 8900,
      'pottery-vase': 6800,
      'jewelry-necklace': 4200
    },
    byTimeframe: {
      daily: {
        '2024-01-20': 1200,
        '2024-01-19': 980,
        '2024-01-18': 1450,
        '2024-01-17': 890,
        '2024-01-16': 1100
      },
      weekly: {
        '2024-W03': 5200,
        '2024-W02': 4800,
        '2024-W01': 4200
      },
      monthly: {
        '2024-01': 15600,
        '2023-12': 12800,
        '2023-11': 11200
      }
    }
  },
  orders: {
    total: 342,
    averageOrderValue: 133.57,
    conversionRate: 4.2,
    repeatPurchaseRate: 23.5
  },
  attribution: {
    emailClicks: 2840,
    emailConversions: 142,
    emailRevenue: 18920,
    topPerformingUpdates: [
      {
        updateId: 'update-2024-01-20',
        nmbrId: 'nmbr-4',
        clicks: 450,
        conversions: 28,
        revenue: 4200
      },
      {
        updateId: 'update-2024-01-15',
        nmbrId: 'nmbr-7',
        clicks: 380,
        conversions: 22,
        revenue: 3200
      },
      {
        updateId: 'update-2024-01-10',
        nmbrId: 'nmbr-12',
        clicks: 320,
        conversions: 18,
        revenue: 2800
      }
    ]
  }
}

export default function CommercePage() {
  const { orgType, terminology } = useOrganization()
  const { canUseFeature } = useSubscription()
  const [analytics, setAnalytics] = useState<CommerceAnalytics>(mockAnalytics)
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [activeTab, setActiveTab] = useState('overview')

  const canUseCommerce = canUseFeature('commerce_analytics')

  if (!canUseCommerce) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Commerce Analytics Not Available</h3>
          <p className="text-muted-foreground mb-4">
            Commerce analytics are available on Professional tier and above. Upgrade to track sales and revenue from your stories.
          </p>
          <Button>Upgrade Plan</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Commerce Analytics</h1>
          <p className="text-muted-foreground">
            Track sales, revenue, and attribution from your {terminology.subscribers.toLowerCase()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex items-center gap-2">
        {[
          { key: '7d', label: 'Last 7 days' },
          { key: '30d', label: 'Last 30 days' },
          { key: '90d', label: 'Last 90 days' },
          { key: '1y', label: 'Last year' }
        ].map(({ key, label }) => (
          <Button
            key={key}
            variant={timeframe === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeframe(key as any)}
          >
            {label}
          </Button>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">${analytics.revenue.total.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+12.5% from last month</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">{analytics.orders.total}</p>
                    <p className="text-xs text-green-600">+8.2% from last month</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                    <p className="text-2xl font-bold">${analytics.orders.averageOrderValue}</p>
                    <p className="text-xs text-green-600">+5.1% from last month</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                    <p className="text-2xl font-bold">{analytics.orders.conversionRate}%</p>
                    <p className="text-xs text-green-600">+0.8% from last month</p>
                  </div>
                  <MousePointer className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue by NMBR */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue by NMBR</CardTitle>
              <CardDescription>See which stories are driving the most sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analytics.revenue.byNmbr)
                  .sort(([,a], [,b]) => b - a)
                  .map(([nmbrId, revenue]) => (
                    <div key={nmbrId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Hash className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">NMBR {nmbrId.split('-')[1]}</h3>
                          <p className="text-sm text-muted-foreground">Story-driven sales</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">${revenue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round((revenue / analytics.revenue.total) * 100)}% of total
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Email Updates</CardTitle>
              <CardDescription>Updates that drove the most sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.attribution.topPerformingUpdates.map((update, index) => (
                  <div key={update.updateId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Update {update.updateId.split('-')[2]}</h3>
                        <p className="text-sm text-muted-foreground">NMBR {update.nmbrId.split('-')[1]}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-lg font-bold">{update.clicks}</div>
                        <div className="text-xs text-muted-foreground">Clicks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{update.conversions}</div>
                        <div className="text-xs text-muted-foreground">Sales</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">${update.revenue.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Revenue</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">
                          {Math.round((update.conversions / update.clicks) * 100)}%
                        </div>
                        <div className="text-xs text-muted-foreground">CVR</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Track revenue over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                  <p>Revenue chart would be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Product</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.revenue.byProduct)
                    .sort(([,a], [,b]) => b - a)
                    .map(([product, revenue]) => (
                      <div key={product} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{product}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ 
                                width: `${(revenue / Math.max(...Object.values(analytics.revenue.byProduct))) * 100}%` 
                              }}
                            />
                          </div>
                          <span className="text-sm font-bold">${revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Update</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.revenue.byUpdate)
                    .sort(([,a], [,b]) => b - a)
                    .map(([update, revenue]) => (
                      <div key={update} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{update}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ 
                                width: `${(revenue / Math.max(...Object.values(analytics.revenue.byUpdate))) * 100}%` 
                              }}
                            />
                          </div>
                          <span className="text-sm font-bold">${revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attribution" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email Clicks</p>
                    <p className="text-2xl font-bold">{analytics.attribution.emailClicks.toLocaleString()}</p>
                  </div>
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email Conversions</p>
                    <p className="text-2xl font-bold">{analytics.attribution.emailConversions}</p>
                  </div>
                  <MousePointer className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email Revenue</p>
                    <p className="text-2xl font-bold">${analytics.attribution.emailRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Attribution Flow</CardTitle>
              <CardDescription>Track the customer journey from email to purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email Sent</h3>
                      <p className="text-sm text-muted-foreground">Newsletter delivered</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{analytics.attribution.emailClicks.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">recipients</div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="w-px h-8 bg-muted" />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <MousePointer className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Link Clicked</h3>
                      <p className="text-sm text-muted-foreground">User clicked product link</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{analytics.attribution.emailConversions}</div>
                    <div className="text-sm text-muted-foreground">
                      {Math.round((analytics.attribution.emailConversions / analytics.attribution.emailClicks) * 100)}% click rate
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="w-px h-8 bg-muted" />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Purchase Made</h3>
                      <p className="text-sm text-muted-foreground">Order completed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">${analytics.attribution.emailRevenue.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">
                      {Math.round((analytics.attribution.emailConversions / analytics.attribution.emailClicks) * 100)}% conversion rate
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Track sales and revenue by product</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analytics.revenue.byProduct)
                  .sort(([,a], [,b]) => b - a)
                  .map(([product, revenue]) => (
                    <div key={product} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Hash className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">{product}</h3>
                          <p className="text-sm text-muted-foreground">Product sales</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">${revenue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round((revenue / analytics.revenue.total) * 100)}% of total revenue
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
