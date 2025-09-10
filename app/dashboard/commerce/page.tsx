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

// Start with empty analytics data - will populate as users create stories and receive donations
const mockAnalytics: CommerceAnalytics = {
  revenue: {
    total: 0,
    byNmbr: {},
    byUpdate: {},
    byProduct: {},
    byTimeframe: {
      daily: {},
      weekly: {},
      monthly: {}
    }
  },
  orders: {
    total: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    repeatPurchaseRate: 0
  },
  attribution: {
    emailClicks: 0,
    emailConversions: 0,
    emailRevenue: 0,
    topPerformingUpdates: []
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
          <h3 className="text-2xl font-bold mb-2">Donation Analytics Not Available</h3>
          <p className="text-muted-foreground mb-4">
            Donation analytics are available on Professional tier and above. Upgrade to track donations and fundraising from your stories.
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
          <h1 className="text-3xl font-bold">Donation Analytics</h1>
          <p className="text-muted-foreground">
            Track donations, fundraising, and attribution from your {terminology.subscribers.toLowerCase()}
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
          <Card>
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingCart className="h-8 w-8 text-cyan-600" />
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
        </TabsContent>

        <TabsContent value="attribution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attribution Flow</CardTitle>
              <CardDescription>Track the donor journey from story to donation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No attribution data yet</h3>
                <p className="text-muted-foreground">
                  Attribution tracking will appear here once you start sending newsletters and receiving donations.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Track donations and fundraising by product</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Hash className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No product data yet</h3>
                <p className="text-muted-foreground">
                  Product performance will appear here once you start receiving donations through your stories.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}