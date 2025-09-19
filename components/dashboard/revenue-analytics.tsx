'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Users, 
  Package,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  RefreshCw,
  Target,
  Percent,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { revenueTracker, RevenueMetrics, RevenueByCategory, RevenueByPartner } from '@/lib/revenue-tracking'
import { pricingEngine } from '@/lib/pricing-engine'

interface RevenueAnalyticsProps {
  organizationId: string
  timeframe?: { start: Date; end: Date }
}

export function RevenueAnalytics({ organizationId, timeframe }: RevenueAnalyticsProps) {
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null)
  const [revenueByCategory, setRevenueByCategory] = useState<RevenueByCategory[]>([])
  const [revenueByPartner, setRevenueByPartner] = useState<RevenueByPartner[]>([])
  const [selectedTimeframe, setSelectedTimeframe] = useState('monthly')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadRevenueData()
  }, [organizationId, selectedTimeframe])

  const loadRevenueData = async () => {
    try {
      setLoading(true)
      
      // Calculate timeframe based on selection
      const now = new Date()
      let startDate: Date
      let endDate: Date = now

      switch (selectedTimeframe) {
        case 'daily':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
          break
        case 'weekly':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'monthly':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case 'yearly':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
          break
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      }

      const timeframeData = { start: startDate, end: endDate }
      
      // Load all revenue data
      const [metricsData, categoryData, partnerData] = await Promise.all([
        revenueTracker.getRevenueMetrics(organizationId, timeframeData),
        revenueTracker.getRevenueByCategory(organizationId, timeframeData),
        revenueTracker.getRevenueByPartner(organizationId, timeframeData)
      ])

      setMetrics(metricsData)
      setRevenueByCategory(categoryData)
      setRevenueByPartner(partnerData)
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

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <ArrowUpRight className="w-4 h-4 text-green-600" />
    ) : (
      <ArrowDownRight className="w-4 h-4 text-red-600" />
    )
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading revenue analytics...</p>
        </div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Revenue Data</h3>
        <p className="text-muted-foreground mb-4">
          Start selling products to see revenue analytics
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Revenue Analytics</h2>
          <p className="text-muted-foreground">Track your marketplace performance and earnings</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Last 24 Hours</SelectItem>
              <SelectItem value="weekly">Last 7 Days</SelectItem>
              <SelectItem value="monthly">Last 30 Days</SelectItem>
              <SelectItem value="yearly">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={loadRevenueData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2">
              {getGrowthIcon(5.2)}
              <span className={`text-sm ml-1 ${getGrowthColor(5.2)}`}>
                +5.2% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{metrics.totalOrders}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2">
              {getGrowthIcon(12.5)}
              <span className={`text-sm ml-1 ${getGrowthColor(12.5)}`}>
                +12.5% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.totalProfit)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex items-center mt-2">
              {getGrowthIcon(8.3)}
              <span className={`text-sm ml-1 ${getGrowthColor(8.3)}`}>
                +8.3% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Profit Margin</p>
                <p className="text-2xl font-bold">{formatPercentage(metrics.profitMargin)}</p>
              </div>
              <Percent className="w-8 h-8 text-orange-600" />
            </div>
            <div className="flex items-center mt-2">
              {getGrowthIcon(2.1)}
              <span className={`text-sm ml-1 ${getGrowthColor(2.1)}`}>
                +2.1% from last period
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="partners">By Partner</TabsTrigger>
          <TabsTrigger value="breakdown">Revenue Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Revenue Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Gross Revenue</span>
                    <span className="font-semibold">{formatCurrency(metrics.totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Platform Fees</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(metrics.platformFees)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Dropship Costs</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(metrics.dropshipCosts)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Processing Fees</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(metrics.processingFees)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Shipping Fees</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(metrics.shippingFees)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Taxes</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(metrics.taxes)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Refunds</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(metrics.refunds)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Net Revenue</span>
                      <span className="font-bold text-green-600">{formatCurrency(metrics.netRevenue)}</span>
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
                    <span className="font-semibold">{formatCurrency(metrics.averageOrderValue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Conversion Rate</span>
                    <span className="font-semibold">{formatPercentage(metrics.conversionRate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Customer Lifetime Value</span>
                    <span className="font-semibold">{formatCurrency(metrics.customerLifetimeValue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Commissions</span>
                    <span className="font-semibold">{formatCurrency(metrics.totalCommissions)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Revenue by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueByCategory.map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold capitalize">{category.category}</h3>
                        <p className="text-sm text-muted-foreground">{category.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(category.revenue)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPercentage(category.profitMargin)} margin
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partners" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Revenue by Dropship Partner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueByPartner.map((partner, index) => (
                  <div key={partner.partner} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Package className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold capitalize">{partner.partner}</h3>
                        <p className="text-sm text-muted-foreground">{partner.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(partner.revenue)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(partner.commission)} commission
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Gross Revenue</span>
                    <span className="font-semibold">{formatCurrency(metrics.totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-red-600">Platform Fees</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(metrics.platformFees)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-red-600">Dropship Costs</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(metrics.dropshipCosts)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-red-600">Other Fees</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(metrics.processingFees + metrics.shippingFees + metrics.taxes)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Net Revenue</span>
                      <span className="font-bold text-green-600">{formatCurrency(metrics.netRevenue)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profit Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Profit</span>
                    <span className="font-semibold text-green-600">{formatCurrency(metrics.totalProfit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Profit Margin</span>
                    <span className="font-semibold">{formatPercentage(metrics.profitMargin)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Commissions</span>
                    <span className="font-semibold">{formatCurrency(metrics.totalCommissions)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Average Order Value</span>
                    <span className="font-semibold">{formatCurrency(metrics.averageOrderValue)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
