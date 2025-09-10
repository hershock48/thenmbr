'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  Package,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  RefreshCw,
  Target,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  Zap,
  Users,
  Globe
} from 'lucide-react'
import { useOrganization } from '@/contexts/OrganizationContext'
import { RevenueAnalytics } from '@/components/dashboard/revenue-analytics'
import { pricingEngine } from '@/lib/pricing-engine'
import { revenueTracker } from '@/lib/revenue-tracking'

export default function RevenuePage() {
  const { terminology, orgType } = useOrganization()
  const [loading, setLoading] = useState(true)
  const [revenueMetrics, setRevenueMetrics] = useState<any>(null)
  const [commissionTier, setCommissionTier] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadRevenueData()
  }, [])

  const loadRevenueData = async () => {
    try {
      setLoading(true)
      
      // Load revenue metrics
      const metrics = revenueTracker.getRevenueMetrics('org-1')
      setRevenueMetrics(metrics)
      
      // Load commission tier
      const tier = pricingEngine.getCommissionTier(metrics.totalRevenue)
      setCommissionTier(tier)
      
    } catch (error) {
      console.error('Failed to load revenue data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading revenue data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Revenue Dashboard</h1>
          <p className="text-muted-foreground">
            Track your {terminology.fundraising.toLowerCase()} revenue and marketplace performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadRevenueData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Revenue Settings
          </Button>
        </div>
      </div>

      {/* Commission Tier Status */}
      {commissionTier && (
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold capitalize">{commissionTier.tier} Tier</h3>
                  <p className="text-sm text-muted-foreground">
                    Platform Fee: {formatPercentage(commissionTier.platformFeePercentage)} | 
                    Dropship Markup: {formatPercentage(commissionTier.dropshipMarkupPercentage)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="mb-2">
                  Current Tier
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Monthly Revenue: {formatCurrency(revenueMetrics?.totalRevenue || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(revenueMetrics?.totalRevenue || 0)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 ml-1">+12.5% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{revenueMetrics?.totalOrders || 0}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 ml-1">+8.3% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-bold">{formatCurrency(revenueMetrics?.totalProfit || 0)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 ml-1">+15.2% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Profit Margin</p>
                <p className="text-2xl font-bold">{formatPercentage(revenueMetrics?.profitMargin || 0)}</p>
              </div>
              <Percent className="w-8 h-8 text-orange-600" />
            </div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 ml-1">+2.1% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Revenue Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Gross Revenue</span>
                    <span className="font-semibold">{formatCurrency(revenueMetrics?.totalRevenue || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-600">Platform Fees</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(revenueMetrics?.platformFees || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-600">Dropship Costs</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(revenueMetrics?.dropshipCosts || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-600">Processing Fees</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(revenueMetrics?.processingFees || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-600">Shipping Fees</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(revenueMetrics?.shippingFees || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-600">Taxes</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(revenueMetrics?.taxes || 0)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Net Revenue</span>
                      <span className="font-bold text-green-600">{formatCurrency(revenueMetrics?.netRevenue || 0)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Order Value</span>
                    <span className="font-semibold">{formatCurrency(revenueMetrics?.averageOrderValue || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Conversion Rate</span>
                    <span className="font-semibold">{formatPercentage(revenueMetrics?.conversionRate || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Customer Lifetime Value</span>
                    <span className="font-semibold">{formatCurrency(revenueMetrics?.customerLifetimeValue || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Commissions</span>
                    <span className="font-semibold">{formatCurrency(revenueMetrics?.totalCommissions || 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <RevenueAnalytics organizationId="org-1" />
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Pricing Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Current Commission Tier</h3>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold capitalize">{commissionTier?.tier} Tier</span>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Platform Fee: {formatPercentage(commissionTier?.platformFeePercentage || 0)}</p>
                        <p>Dropship Markup: {formatPercentage(commissionTier?.dropshipMarkupPercentage || 0)}</p>
                        <p>Min Revenue: {formatCurrency(commissionTier?.minimumMonthlyRevenue || 0)}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Tier Benefits</h3>
                    <div className="space-y-2">
                      {commissionTier?.features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Revenue Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Configure your revenue settings, commission tiers, and payment preferences.
                </p>
                <Button>
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Revenue Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}