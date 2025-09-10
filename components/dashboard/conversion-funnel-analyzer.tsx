"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Heart, 
  MousePointer, 
  CreditCard, 
  Mail,
  BarChart3,
  Target,
  Zap,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

interface FunnelStage {
  id: string
  name: string
  description: string
  count: number
  percentage: number
  dropoffRate: number
  avgTime: string
  conversionRate: number
  color: string
  icon: React.ReactNode
  recommendations: string[]
}

interface ConversionFunnelData {
  totalVisitors: number
  stages: FunnelStage[]
  overallConversionRate: number
  avgTimeToConvert: string
  topDropoffPoints: Array<{
    stage: string
    dropoffRate: number
    potentialLoss: number
  }>
  optimizationSuggestions: Array<{
    stage: string
    suggestion: string
    impact: 'high' | 'medium' | 'low'
    effort: 'high' | 'medium' | 'low'
  }>
}

const mockFunnelData: ConversionFunnelData = {
  totalVisitors: 19600,
  stages: [
    {
      id: 'story-discovery',
      name: 'Story Discovery',
      description: 'Donors find your story through NMBR code',
      count: 19600,
      percentage: 100,
      dropoffRate: 0,
      avgTime: '2.3s',
      conversionRate: 100,
      color: 'bg-blue-500',
      icon: <Eye className="w-5 h-5" />,
      recommendations: [
        'Optimize NMBR code placement for better visibility',
        'A/B test different code designs',
        'Add QR code to physical materials'
      ]
    },
    {
      id: 'story-engagement',
      name: 'Story Engagement',
      description: 'Donors read and engage with story content',
      count: 12600,
      percentage: 64.3,
      dropoffRate: 35.7,
      avgTime: '1m 45s',
      conversionRate: 64.3,
      color: 'bg-purple-500',
      icon: <Heart className="w-5 h-5" />,
      recommendations: [
        'Improve story headlines and opening paragraphs',
        'Add compelling visuals and videos',
        'Use emotional storytelling techniques',
        'Optimize mobile experience'
      ]
    },
    {
      id: 'donation-intent',
      name: 'Donation Intent',
      description: 'Donors show interest in donating',
      count: 7800,
      percentage: 39.8,
      dropoffRate: 24.5,
      avgTime: '3m 12s',
      conversionRate: 39.8,
      color: 'bg-orange-500',
      icon: <Target className="w-5 h-5" />,
      recommendations: [
        'Add clear call-to-action buttons',
        'Show impact of donations more prominently',
        'Add social proof and testimonials',
        'Create urgency with limited-time offers'
      ]
    },
    {
      id: 'donation-page',
      name: 'Donation Page Visit',
      description: 'Donors visit the donation page',
      count: 4900,
      percentage: 25.0,
      dropoffRate: 14.8,
      avgTime: '2m 18s',
      conversionRate: 25.0,
      color: 'bg-yellow-500',
      icon: <MousePointer className="w-5 h-5" />,
      recommendations: [
        'Simplify donation form fields',
        'Add multiple payment options',
        'Show security badges and trust signals',
        'Optimize page loading speed'
      ]
    },
    {
      id: 'donation-complete',
      name: 'Donation Complete',
      description: 'Donors successfully complete donation',
      count: 1960,
      percentage: 10.0,
      dropoffRate: 15.0,
      avgTime: '4m 30s',
      conversionRate: 10.0,
      color: 'bg-green-500',
      icon: <CreditCard className="w-5 h-5" />,
      recommendations: [
        'Reduce form completion time',
        'Add progress indicators',
        'Provide clear error messages',
        'Offer guest checkout option'
      ]
    },
    {
      id: 'follow-up',
      name: 'Follow-up Engagement',
      description: 'Donors engage with follow-up content',
      count: 1470,
      percentage: 7.5,
      dropoffRate: 2.5,
      avgTime: '2d 4h',
      conversionRate: 7.5,
      color: 'bg-indigo-500',
      icon: <Mail className="w-5 h-5" />,
      recommendations: [
        'Send immediate thank you email',
        'Share impact updates regularly',
        'Create donor community',
        'Offer volunteer opportunities'
      ]
    }
  ],
  overallConversionRate: 10.0,
  avgTimeToConvert: '4m 30s',
  topDropoffPoints: [
    {
      stage: 'Story Engagement',
      dropoffRate: 35.7,
      potentialLoss: 7000
    },
    {
      stage: 'Donation Intent',
      dropoffRate: 24.5,
      potentialLoss: 4800
    },
    {
      stage: 'Donation Page',
      dropoffRate: 14.8,
      potentialLoss: 2900
    }
  ],
  optimizationSuggestions: [
    {
      stage: 'Story Engagement',
      suggestion: 'Add video testimonials to increase emotional connection',
      impact: 'high',
      effort: 'medium'
    },
    {
      stage: 'Donation Intent',
      suggestion: 'Implement exit-intent popups with special offers',
      impact: 'medium',
      effort: 'low'
    },
    {
      stage: 'Donation Page',
      suggestion: 'Add one-click donation amounts ($25, $50, $100)',
      impact: 'high',
      effort: 'low'
    },
    {
      stage: 'Donation Complete',
      suggestion: 'Add progress bar and estimated completion time',
      impact: 'medium',
      effort: 'low'
    }
  ]
}

export function ConversionFunnelAnalyzer() {
  const [data, setData] = useState<ConversionFunnelData>(mockFunnelData)
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d')
  const [selectedStage, setSelectedStage] = useState<string | null>(null)

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Conversion Funnel Analyzer</h2>
          <p className="text-muted-foreground">Analyze and optimize your story-to-donation conversion funnel</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="90d">90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Conversion Rate</p>
                <p className="text-2xl font-bold">{data.overallConversionRate}%</p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Time to Convert</p>
                <p className="text-2xl font-bold">{data.avgTimeToConvert}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Visitors</p>
                <p className="text-2xl font-bold">{data.totalVisitors.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funnel Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Conversion Funnel
          </CardTitle>
          <CardDescription>
            Track how donors progress through each stage of your fundraising funnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.stages.map((stage, index) => (
              <div key={stage.id} className="relative">
                <div 
                  className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    selectedStage === stage.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedStage(selectedStage === stage.id ? null : stage.id)}
                >
                  <div className={`p-2 rounded-lg ${stage.color} text-white`}>
                    {stage.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{stage.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{stage.count.toLocaleString()}</span>
                        <span>{stage.percentage}%</span>
                        <span>Avg: {stage.avgTime}</span>
                        {stage.dropoffRate > 0 && (
                          <Badge variant="destructive">
                            -{stage.dropoffRate}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{stage.description}</p>
                    <Progress value={stage.percentage} className="h-2" />
                  </div>
                </div>
                
                {/* Expanded Stage Details */}
                {selectedStage === stage.id && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-3">Optimization Recommendations</h4>
                    <div className="space-y-2">
                      {stage.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {index < data.stages.length - 1 && (
                  <div className="flex justify-center my-2">
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Dropoff Points */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Top Dropoff Points
            </CardTitle>
            <CardDescription>
              Stages where you're losing the most potential donors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topDropoffPoints.map((point, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <h4 className="font-medium">{point.stage}</h4>
                    <p className="text-sm text-muted-foreground">
                      Potential loss: {point.potentialLoss.toLocaleString()} donors
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600">{point.dropoffRate}%</div>
                    <div className="text-xs text-muted-foreground">dropoff rate</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Optimization Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Optimization Suggestions
            </CardTitle>
            <CardDescription>
              Actionable recommendations to improve conversion rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.optimizationSuggestions.map((suggestion, index) => (
                <div key={index} className="p-3 rounded-lg border">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{suggestion.stage}</h4>
                    <div className="flex gap-2">
                      <Badge className={getImpactColor(suggestion.impact)}>
                        {suggestion.impact} impact
                      </Badge>
                      <Badge className={getEffortColor(suggestion.effort)}>
                        {suggestion.effort} effort
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{suggestion.suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
