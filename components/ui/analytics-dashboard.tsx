"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Eye, 
  Heart, 
  Target,
  Zap,
  BarChart3,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'

interface MetricCard {
  id: string
  title: string
  value: string | number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: React.ReactNode
  color: string
  trend: 'up' | 'down' | 'stable'
  format: 'currency' | 'number' | 'percentage'
  description: string
}

interface AnalyticsDashboardProps {
  orgType?: 'nonprofit' | 'business'
  className?: string
}

export function AnalyticsDashboard({ orgType = 'nonprofit', className = '' }: AnalyticsDashboardProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])
  const [timeRange, setTimeRange] = useState('7d')
  const [isCustomizing, setIsCustomizing] = useState(false)

  // Sample data - in real app, this would come from API
  const allMetrics: MetricCard[] = orgType === 'nonprofit' ? [
    {
      id: 'total-donations',
      title: 'Total Donations',
      value: 15750,
      change: 23.5,
      changeType: 'increase',
      icon: <Heart className="w-5 h-5" />,
      color: 'text-red-500',
      trend: 'up',
      format: 'currency',
      description: 'Total donations received this period'
    },
    {
      id: 'donor-growth',
      title: 'New Donors',
      value: 47,
      change: 12.3,
      changeType: 'increase',
      icon: <Users className="w-5 h-5" />,
      color: 'text-blue-500',
      trend: 'up',
      format: 'number',
      description: 'New donors acquired this period'
    },
    {
      id: 'avg-donation',
      title: 'Avg Donation',
      value: 89.50,
      change: -2.1,
      changeType: 'decrease',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-green-500',
      trend: 'down',
      format: 'currency',
      description: 'Average donation amount'
    },
    {
      id: 'story-engagement',
      title: 'Story Engagement',
      value: 92.3,
      change: 8.7,
      changeType: 'increase',
      icon: <Eye className="w-5 h-5" />,
      color: 'text-purple-500',
      trend: 'up',
      format: 'percentage',
      description: 'Percentage of stories with high engagement'
    },
    {
      id: 'conversion-rate',
      title: 'Conversion Rate',
      value: 15.8,
      change: 4.2,
      changeType: 'increase',
      icon: <Target className="w-5 h-5" />,
      color: 'text-orange-500',
      trend: 'up',
      format: 'percentage',
      description: 'Visitor to donor conversion rate'
    },
    {
      id: 'retention-rate',
      title: 'Donor Retention',
      value: 78.5,
      change: 2.3,
      changeType: 'increase',
      icon: <Zap className="w-5 h-5" />,
      color: 'text-indigo-500',
      trend: 'up',
      format: 'percentage',
      description: 'Donor retention rate'
    }
  ] : [
    {
      id: 'story-revenue',
      title: 'Story-Driven Revenue',
      value: 47250,
      change: 34.2,
      changeType: 'increase',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-green-500',
      trend: 'up',
      format: 'currency',
      description: 'Revenue attributed to story engagement'
    },
    {
      id: 'nmbr-searches',
      title: 'NMBR Searches',
      value: 1847,
      change: 28.9,
      changeType: 'increase',
      icon: <Target className="w-5 h-5" />,
      color: 'text-blue-500',
      trend: 'up',
      format: 'number',
      description: 'Total NMBR searches this period'
    },
    {
      id: 'conversion-rate',
      title: 'Conversion Rate',
      value: 12.4,
      change: 3.1,
      changeType: 'increase',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-purple-500',
      trend: 'up',
      format: 'percentage',
      description: 'NMBR search to purchase conversion'
    },
    {
      id: 'avg-order-value',
      title: 'Avg Order Value',
      value: 89.50,
      change: 5.7,
      changeType: 'increase',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'text-orange-500',
      trend: 'up',
      format: 'currency',
      description: 'Average order value from story-driven sales'
    },
    {
      id: 'active-products',
      title: 'Active Products',
      value: 23,
      change: 15.0,
      changeType: 'increase',
      icon: <Zap className="w-5 h-5" />,
      color: 'text-indigo-500',
      trend: 'up',
      format: 'number',
      description: 'Products with active story campaigns'
    },
    {
      id: 'revenue-share',
      title: 'Platform Revenue',
      value: 2365,
      change: 34.2,
      changeType: 'increase',
      icon: <Sparkles className="w-5 h-5" />,
      color: 'text-pink-500',
      trend: 'up',
      format: 'currency',
      description: 'Your share of story-driven revenue'
    }
  ]

  // Initialize with top 4 metrics
  useEffect(() => {
    if (selectedMetrics.length === 0) {
      setSelectedMetrics(allMetrics.slice(0, 4).map(m => m.id))
    }
  }, [allMetrics])

  const formatValue = (value: string | number, format: string) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(Number(value))
    }
    if (format === 'percentage') {
      return `${value}%`
    }
    return value.toLocaleString()
  }

  const getChangeIcon = (trend: string) => {
    if (trend === 'up') return <ArrowUpRight className="w-4 h-4" />
    if (trend === 'down') return <ArrowDownRight className="w-4 h-4" />
    return <div className="w-4 h-4" />
  }

  const getChangeColor = (changeType: string) => {
    if (changeType === 'increase') return 'text-green-600'
    if (changeType === 'decrease') return 'text-red-600'
    return 'text-gray-600'
  }

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    )
  }

  const displayedMetrics = allMetrics.filter(metric => selectedMetrics.includes(metric.id))

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold">Key Metrics</h3>
          <Badge variant="secondary" className="text-xs">
            {timeRange === '7d' ? 'Last 7 days' : 
             timeRange === '30d' ? 'Last 30 days' : 
             timeRange === '90d' ? 'Last 90 days' : 'All time'}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {timeRange === '7d' ? '7D' : 
                 timeRange === '30d' ? '30D' : 
                 timeRange === '90d' ? '90D' : 'All'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setTimeRange('7d')}>Last 7 days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('30d')}>Last 30 days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('90d')}>Last 90 days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('all')}>All time</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCustomizing(!isCustomizing)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Customize
          </Button>
          
          <Link href="/dashboard/analytics">
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              View All
            </Button>
          </Link>
        </div>
      </div>

      {/* Customization Panel */}
      {isCustomizing && (
        <Card className="p-4 bg-muted/50">
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Choose metrics to display:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {allMetrics.map(metric => (
                <label key={metric.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id={`metric-${metric.id}`}
                    checked={selectedMetrics.includes(metric.id)}
                    onChange={() => toggleMetric(metric.id)}
                    className="rounded"
                    aria-label={`Toggle ${metric.name} metric`}
                  />
                  <span className="text-sm">{metric.title}</span>
                </label>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayedMetrics.map(metric => (
          <Card key={metric.id} className="relative group hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`${metric.color}`}>
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {formatValue(metric.value, metric.format)}
                </div>
                <div className={`flex items-center text-sm ${getChangeColor(metric.changeType)}`}>
                  {getChangeIcon(metric.trend)}
                  <span className="ml-1">
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                  <span className="text-muted-foreground ml-1">vs last period</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {metric.description}
                </div>
              </div>
            </CardContent>
            
          </Card>
        ))}
      </div>

      {/* Quick Insights */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-blue-900">Performance Insight</h3>
            <p className="text-sm text-blue-700 mt-1">
              {orgType === 'nonprofit' 
                ? "Your story engagement is 23% above average for similar organizations. Keep creating compelling content!"
                : "Your story-driven revenue is growing 34% faster than industry average. Consider expanding to more products!"
              }
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
