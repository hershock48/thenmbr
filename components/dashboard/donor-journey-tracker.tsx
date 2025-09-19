"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Heart, 
  Eye, 
  MousePointer, 
  CreditCard, 
  Mail, 
  MessageSquare,
  Calendar,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Clock,
  Target,
  Zap
} from 'lucide-react'

interface DonorJourneyStep {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  count: number
  percentage: number
  avgTime: string
  conversionRate: number
  color: string
}

interface DonorJourneyData {
  totalDonors: number
  journeySteps: DonorJourneyStep[]
  topPerformingStories: Array<{
    id: string
    title: string
    conversionRate: number
    totalDonors: number
  }>
  recentActivity: Array<{
    id: string
    donor: string
    action: string
    story: string
    timestamp: string
    amount?: number
  }>
}

const mockDonorJourneyData: DonorJourneyData = {
  totalDonors: 2847,
  journeySteps: [
    {
      id: 'story-view',
      name: 'Story Discovery',
      description: 'Donor discovers your story through NMBR code',
      icon: <Eye className="w-5 h-5" />,
      count: 19600,
      percentage: 100,
      avgTime: '2.3s',
      conversionRate: 100,
      color: 'bg-blue-500'
    },
    {
      id: 'story-engagement',
      name: 'Story Engagement',
      description: 'Donor reads and engages with story content',
      icon: <Heart className="w-5 h-5" />,
      count: 12600,
      percentage: 64.3,
      avgTime: '1m 45s',
      conversionRate: 64.3,
      color: 'bg-purple-500'
    },
    {
      id: 'donation-intent',
      name: 'Donation Intent',
      description: 'Donor shows interest in donating',
      icon: <Target className="w-5 h-5" />,
      count: 7800,
      percentage: 39.8,
      avgTime: '3m 12s',
      conversionRate: 39.8,
      color: 'bg-orange-500'
    },
    {
      id: 'donation-page',
      name: 'Donation Page Visit',
      description: 'Donor visits donation page',
      icon: <MousePointer className="w-5 h-5" />,
      count: 4900,
      percentage: 25.0,
      avgTime: '2m 18s',
      conversionRate: 25.0,
      color: 'bg-yellow-500'
    },
    {
      id: 'donation-complete',
      name: 'Donation Complete',
      description: 'Donor successfully completes donation',
      icon: <CreditCard className="w-5 h-5" />,
      count: 1960,
      percentage: 10.0,
      avgTime: '4m 30s',
      conversionRate: 10.0,
      color: 'bg-green-500'
    },
    {
      id: 'follow-up',
      name: 'Follow-up Engagement',
      description: 'Donor engages with follow-up content',
      icon: <Mail className="w-5 h-5" />,
      count: 1470,
      percentage: 7.5,
      avgTime: '2d 4h',
      conversionRate: 7.5,
      color: 'bg-indigo-500'
    }
  ],
  topPerformingStories: [
    {
      id: 'nmbr-001',
      title: "Maria's Education Journey",
      conversionRate: 12.4,
      totalDonors: 420
    },
    {
      id: 'nmbr-002',
      title: "Clean Water for Village",
      conversionRate: 10.8,
      totalDonors: 380
    },
    {
      id: 'nmbr-003',
      title: "Medical Care for Children",
      conversionRate: 9.2,
      totalDonors: 340
    }
  ],
  recentActivity: [
    {
      id: '1',
      donor: 'Sarah M.',
      action: 'Completed donation',
      story: "Maria's Education Journey",
      timestamp: '2 minutes ago',
      amount: 25
    },
    {
      id: '2',
      donor: 'Mike R.',
      action: 'Viewed story',
      story: "Clean Water for Village",
      timestamp: '5 minutes ago'
    },
    {
      id: '3',
      donor: 'Lisa K.',
      action: 'Opened email update',
      story: "Medical Care for Children",
      timestamp: '12 minutes ago'
    },
    {
      id: '4',
      donor: 'John D.',
      action: 'Completed donation',
      story: "Food Security Program",
      timestamp: '18 minutes ago',
      amount: 50
    },
    {
      id: '5',
      donor: 'Emma S.',
      action: 'Shared story',
      story: "Disaster Relief Fund",
      timestamp: '25 minutes ago'
    }
  ]
}

export function DonorJourneyTracker() {
  const [data, setData] = useState<DonorJourneyData>(mockDonorJourneyData)
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d')
  const [isLive, setIsLive] = useState(true)

  // Simulate live data updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setData(prevData => ({
        ...prevData,
        recentActivity: [
          {
            id: Date.now().toString(),
            donor: ['Sarah M.', 'Mike R.', 'Lisa K.', 'John D.', 'Emma S.', 'Alex T.', 'Maria G.'][Math.floor(Math.random() * 7)],
            action: ['Completed donation', 'Viewed story', 'Opened email update', 'Shared story', 'Started donation'][Math.floor(Math.random() * 5)],
            story: ['Maria\'s Education Journey', 'Clean Water for Village', 'Medical Care for Children', 'Food Security Program', 'Disaster Relief Fund'][Math.floor(Math.random() * 5)],
            timestamp: 'Just now',
            amount: Math.random() > 0.5 ? Math.floor(Math.random() * 100) + 10 : undefined
          },
          ...prevData.recentActivity.slice(0, 4)
        ]
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Donor Journey Tracker</h2>
          <p className="text-muted-foreground">Track how donors move through your story-driven fundraising funnel</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isLive ? "default" : "secondary"} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            {isLive ? 'Live' : 'Paused'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? 'Pause' : 'Resume'}
          </Button>
        </div>
      </div>

      {/* Journey Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Donor Journey Funnel
          </CardTitle>
          <CardDescription>
            See how donors progress through each stage of your fundraising funnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.journeySteps.map((step, index) => (
              <div key={step.id} className="relative">
                <div className="flex items-center gap-4 p-4 rounded-lg border bg-card">
                  <div className={`p-2 rounded-lg ${step.color} text-white`}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{step.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{step.count.toLocaleString()} donors</span>
                        <span>{step.percentage}%</span>
                        <span>Avg: {step.avgTime}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                    <Progress value={step.percentage} className="h-2" />
                  </div>
                </div>
                {index < data.journeySteps.length - 1 && (
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
        {/* Top Performing Stories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Top Performing Stories
            </CardTitle>
            <CardDescription>
              Stories with the highest donor conversion rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topPerformingStories.map((story, index) => (
                <div key={story.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium">{story.title}</h4>
                      <p className="text-sm text-muted-foreground">{story.totalDonors} donors</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{story.conversionRate}%</div>
                    <div className="text-xs text-muted-foreground">conversion</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Donor Activity
            </CardTitle>
            <CardDescription>
              Live feed of donor interactions and donations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{activity.donor}</span>
                      <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.action} • {activity.story}
                      {activity.amount && (
                        <span className="ml-2 font-medium text-green-600">
                          ${activity.amount}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
