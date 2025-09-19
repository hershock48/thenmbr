"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  DollarSign,
  Mail,
  Eye,
  MousePointer,
  Calendar,
  Target,
  Zap,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  PieChart,
  LineChart,
  AreaChart
} from "lucide-react"
import { useState } from "react"
import { useOrganization } from "@/contexts/OrganizationContext"

interface DataVisualizationProps {
  data: {
    revenue: {
      total: number
      monthly: number
      weekly: number
      daily: number
      growth: number
    }
    subscribers: {
      total: number
      new: number
      active: number
      growth: number
    }
    engagement: {
      emailOpenRate: number
      clickRate: number
      donationRate: number
      avgSessionTime: number
    }
    stories: {
      total: number
      active: number
      completed: number
      avgRaised: number
    }
    timeline: Array<{
      date: string
      revenue: number
      subscribers: number
      donations: number
    }>
    topStories: Array<{
      id: string
      title: string
      raised: number
      goal: number
      subscribers: number
      growth: number
    }>
  }
}

export function DataVisualization({ data }: DataVisualizationProps) {
  const { terminology, orgType } = useOrganization()
  const [activeChart, setActiveChart] = useState("revenue")

  const StatCard = ({ title, value, change, icon: Icon, trend, subtitle, color }: {
    title: string
    value: string | number
    change?: number
    icon: any
    trend?: 'up' | 'down' | 'neutral'
    subtitle?: string
    color?: string
  }) => (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            {change !== undefined && (
              <div className="flex items-center mt-2">
                {trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                ) : trend === 'down' ? (
                  <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                ) : (
                  <Activity className="w-4 h-4 text-gray-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  trend === 'up' ? 'text-green-600' : 
                  trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${color || 'bg-blue-50'}`}>
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const AnimatedProgressBar = ({ value, max, label, color = "bg-blue-500" }: {
    value: number
    max: number
    label: string
    color?: string
  }) => {
    const percentage = Math.min((value / max) * 100, 100)
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{label}</span>
          <span className="font-semibold">{percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>${value.toLocaleString()}</span>
          <span>${max.toLocaleString()}</span>
        </div>
      </div>
    )
  }

  const MiniChart = ({ data, type = "line", color = "blue" }: {
    data: number[]
    type?: "line" | "bar" | "area"
    color?: string
  }) => {
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min
    
    return (
      <div className="h-16 w-full flex items-end gap-1">
        {data.map((value, index) => {
          const height = range > 0 ? ((value - min) / range) * 100 : 50
          return (
            <div
              key={index}
              className={`flex-1 rounded-t ${
                color === 'blue' ? 'bg-blue-500' :
                color === 'green' ? 'bg-green-500' :
                color === 'purple' ? 'bg-purple-500' : 'bg-gray-500'
              } opacity-80 hover:opacity-100 transition-opacity`}
              style={{ height: `${height}%` }}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${data.revenue.total.toLocaleString()}`}
          change={data.revenue.growth}
          icon={DollarSign}
          trend="up"
          subtitle={`$${data.revenue.monthly.toLocaleString()} this month`}
          color="bg-green-50"
        />
        <StatCard
          title="Total Subscribers"
          value={data.subscribers.total.toLocaleString()}
          change={data.subscribers.growth}
          icon={Users}
          trend="up"
          subtitle={`${data.subscribers.new} new this month`}
          color="bg-blue-50"
        />
        <StatCard
          title="Active Stories"
          value={data.stories.active}
          icon={Heart}
          subtitle={`${data.stories.completed} completed`}
          color="bg-red-50"
        />
        <StatCard
          title="Email Open Rate"
          value={`${data.engagement.emailOpenRate}%`}
          change={2.1}
          icon={Mail}
          trend="up"
          subtitle="Industry avg: 21.5%"
          color="bg-purple-50"
        />
      </div>

      {/* Interactive Charts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Analytics
              </CardTitle>
              <CardDescription>Interactive data visualization and insights</CardDescription>
            </div>
            <Tabs value={activeChart} onValueChange={setActiveChart}>
              <TabsList>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="stories">Stories</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeChart} onValueChange={setActiveChart}>
            <TabsContent value="revenue" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Revenue Breakdown</h3>
                  <div className="space-y-4">
                    <AnimatedProgressBar
                      value={data.revenue.monthly}
                      max={data.revenue.total}
                      label="Monthly Revenue"
                      color="bg-green-500"
                    />
                    <AnimatedProgressBar
                      value={data.revenue.weekly}
                      max={data.revenue.monthly}
                      label="Weekly Revenue"
                      color="bg-blue-500"
                    />
                    <AnimatedProgressBar
                      value={data.revenue.daily}
                      max={data.revenue.weekly}
                      label="Daily Revenue"
                      color="bg-purple-500"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Revenue Trend</h3>
                  <div className="space-y-2">
                    <MiniChart 
                      data={data.timeline.map(t => t.revenue)} 
                      color="green" 
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>30 days ago</span>
                      <span>Today</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="subscribers" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Subscriber Growth</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div>
                        <p className="text-sm text-blue-600">Total Subscribers</p>
                        <p className="text-2xl font-bold text-blue-900">{data.subscribers.total.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-blue-600">Growth</p>
                        <p className="text-lg font-semibold text-blue-900">+{data.subscribers.growth}%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <p className="text-sm text-green-600">New This Month</p>
                        <p className="text-2xl font-bold text-green-900">{data.subscribers.new}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-600">Active</p>
                        <p className="text-lg font-semibold text-green-900">{data.subscribers.active}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Subscriber Activity</h3>
                  <div className="space-y-2">
                    <MiniChart 
                      data={data.timeline.map(t => t.subscribers)} 
                      color="blue" 
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>30 days ago</span>
                      <span>Today</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-blue-600">Open Rate</p>
                  <p className="text-2xl font-bold text-blue-900">{data.engagement.emailOpenRate}%</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <MousePointer className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-green-600">Click Rate</p>
                  <p className="text-2xl font-bold text-green-900">{data.engagement.clickRate}%</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <p className="text-sm text-red-600">{orgType === 'business' ? 'Conversion Rate' : orgType === 'grassroots' ? 'Support Rate' : 'Donation Rate'}</p>
                  <p className="text-2xl font-bold text-red-900">{data.engagement.donationRate}%</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-purple-600">Avg Session</p>
                  <p className="text-2xl font-bold text-purple-900">{data.engagement.avgSessionTime}m</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stories" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Top Performing Stories</h3>
                <div className="space-y-3">
                  {data.topStories.map((story, index) => (
                    <div key={story.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="font-bold text-blue-600">#{story.id}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{story.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{story.subscribers} subscribers</span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              +{story.growth}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${story.raised.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">of ${story.goal.toLocaleString()}</div>
                        <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(story.raised / story.goal) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Real-time Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Real-time Activity
          </CardTitle>
          <CardDescription>Live updates from your platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { type: "donation", message: orgType === 'business' ? "Sarah M. purchased $50 from Maria's Product" : orgType === 'grassroots' ? "Sarah M. supported $50 for Maria's Project" : "Sarah M. donated $50 to Maria's Water Well", time: "2 min ago", color: "green" },
              { type: "subscription", message: "Michael R. subscribed to Ahmed's Education", time: "5 min ago", color: "blue" },
              { type: "milestone", message: "Maria's Water Well reached 75% of goal", time: "8 min ago", color: "purple" },
              { type: "completion", message: "Ahmed's Education story completed!", time: "12 min ago", color: "orange" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  activity.color === 'green' ? 'bg-green-500' :
                  activity.color === 'blue' ? 'bg-blue-500' :
                  activity.color === 'purple' ? 'bg-purple-500' : 'bg-orange-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
