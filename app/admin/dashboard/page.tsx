"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts"
import {
  Users,
  Building2,
  Heart,
  DollarSign,
  TrendingUp,
  Eye,
  Hash,
  BarChart3,
  Filter,
  Calendar,
  Download,
  RefreshCw,
  Activity,
  Search,
  MoreHorizontal,
  Edit,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from "lucide-react"

interface PlatformMetrics {
  totalUsers: number
  totalOrganizations: number
  totalRevenue: number
  totalNMBRs: number
  totalStories: number
  activeSubscriptions: number
  monthlyGrowth: number
  businessCount: number
  nonprofitCount: number
}

interface Organization {
  id: string
  name: string
  type: 'business' | 'nonprofit'
  email: string
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  lastActive: string
  nmbrCount: number
  revenue: number
  stories: number
  members: number
  searchCount?: number
  views?: number
}

interface UserGrowthData {
  month: string
  users: number
  organizations: number
}

interface OrganizationTypeData {
  name: string
  value: number
  color: string
}

interface RevenueData {
  month: string
  revenue: number
  subscriptions: number
}

interface RecentActivity {
  id: string
  type: string
  description: string
  timestamp: string
  organization: string
}

interface PerformanceMetrics {
  nmbrSearches: number
  storyViews: number
  newsletterSubscriptions: number
  conversionRate: number
  averageSessionDuration: number
  bounceRate: number
}

export default function AdminAnalytics() {
  const [metrics, setMetrics] = useState<PlatformMetrics>({
    totalUsers: 0,
    totalOrganizations: 0,
    totalRevenue: 0,
    totalNMBRs: 0,
    totalStories: 0,
    activeSubscriptions: 0,
    monthlyGrowth: 0,
    businessCount: 0,
    nonprofitCount: 0
  })
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([])
  const [organizationTypeData, setOrganizationTypeData] = useState<OrganizationTypeData[]>([])
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    nmbrSearches: 0,
    storyViews: 0,
    newsletterSubscriptions: 0,
    conversionRate: 0,
    averageSessionDuration: 0,
    bounceRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [searchTerm, setSearchTerm] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      
      // Fetch all analytics data
      const [overviewRes, organizationsRes, userGrowthRes, orgTypesRes, revenueRes, activityRes, performanceRes] = await Promise.all([
        fetch(`/api/admin/analytics?type=overview&timeRange=${timeRange}`),
        fetch(`/api/admin/analytics?type=organizations&timeRange=${timeRange}`),
        fetch(`/api/admin/analytics?type=userGrowth&timeRange=${timeRange}`),
        fetch(`/api/admin/analytics?type=organizationTypes&timeRange=${timeRange}`),
        fetch(`/api/admin/analytics?type=revenue&timeRange=${timeRange}`),
        fetch(`/api/admin/analytics?type=activity&timeRange=${timeRange}`),
        fetch(`/api/admin/analytics?type=performance&timeRange=${timeRange}`)
      ])

      const [overview, organizationsData, userGrowth, orgTypes, revenue, activity, performance] = await Promise.all([
        overviewRes.json(),
        organizationsRes.json(),
        userGrowthRes.json(),
        orgTypesRes.json(),
        revenueRes.json(),
        activityRes.json(),
        performanceRes.json()
      ])

      setMetrics(overview)
      setOrganizations(organizationsData.organizations || organizationsData)
      setUserGrowthData(userGrowth)
      setOrganizationTypeData(orgTypes)
      setRevenueData(revenue)
      setRecentActivity(activity)
      setPerformanceMetrics(performance)
    } catch (error) {
      console.error('Failed to fetch analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await fetch('/api/admin/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refresh' })
      })
      await fetchAnalyticsData()
    } catch (error) {
      console.error('Failed to refresh data:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const handleExport = async (format: string = 'json') => {
    try {
      const response = await fetch('/api/admin/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'export', data: { format } })
      })
      
      const data = await response.json()
      
      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export data:', error)
    }
  }

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-yellow-100 text-yellow-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    return type === 'business' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration': return <Users className="h-4 w-4" />
      case 'nmbr_created': return <Hash className="h-4 w-4" />
      case 'story_published': return <Edit className="h-4 w-4" />
      case 'subscription_upgraded': return <TrendingUp className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Platform performance and organization insights</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport()}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{metrics.monthlyGrowth}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Organizations</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalOrganizations.toLocaleString()}</div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Business: {metrics.businessCount}</span>
                <span>Nonprofit: {metrics.nonprofitCount}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{metrics.monthlyGrowth}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active NMBRs</CardTitle>
              <Hash className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalNMBRs.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Across {metrics.totalStories} stories
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">NMBR Searches</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.nmbrSearches.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total searches this period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Story Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.storyViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total story page views</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">Search to subscription rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Monthly user and organization registration trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--card-foreground)",
                    }}
                  />
                  <Bar dataKey="users" fill="var(--chart-1)" name="Users" />
                  <Bar dataKey="organizations" fill="var(--chart-2)" name="Organizations" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organization Types</CardTitle>
              <CardDescription>Distribution of organization types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={organizationTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {organizationTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--card-foreground)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue and subscription growth</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--card-foreground)",
                  }}
                />
                <Line type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2} name="Revenue ($)" />
                <Line type="monotone" dataKey="subscriptions" stroke="var(--chart-2)" strokeWidth={2} name="Subscriptions" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tabs for Organizations and Activity */}
        <Tabs defaultValue="organizations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="organizations">Top Organizations</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="organizations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Top Organizations</CardTitle>
                    <CardDescription>Organizations with highest engagement and revenue</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search organizations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Organization</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">NMBRs</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Revenue</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Searches</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrganizations.map((org) => (
                        <tr key={org.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-foreground">{org.name}</div>
                              <div className="text-sm text-muted-foreground">{org.email}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getTypeColor(org.type)}>
                              {org.type === 'business' ? 'Business' : 'Nonprofit'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(org.status)}>
                              {org.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium">{org.nmbrCount}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium">${org.revenue.toLocaleString()}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium">{org.searchCount || 0}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activity and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{activity.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {activity.organization} • {new Date(activity.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Badge variant="outline">
                          {activity.type.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}