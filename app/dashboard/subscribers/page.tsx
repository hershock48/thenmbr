'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  Mail,
  Heart,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Send,
  Download,
  Calendar,
  Target,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Star,
  Building2,
  Plus
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SendEmailDialog } from "@/components/dashboard/send-email-dialog"

interface Subscriber {
  id: string
  email: string
  first_name: string
  last_name: string
  status: string
  subscribed_at: string
  last_engagement_at?: string
  total_donations: number
  total_donated_amount: number
  nmbr_subscriptions: Array<{
    nmbr_id: string
    subscribed_at: string
  }>
}

interface SubscriberStats {
  total_subscribers: number
  active_subscribers: number
  total_story_subscriptions: number
  avg_engagement_score: number
  total_donations: number
  total_donation_amount: number
}

export default function SubscribersPage() {
  const { user, org } = useAuth()
  const router = useRouter()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [stats, setStats] = useState<SubscriberStats>({
    total_subscribers: 0,
    active_subscribers: 0,
    total_story_subscriptions: 0,
    avg_engagement_score: 0,
    total_donations: 0,
    total_donation_amount: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("subscribed_at")
  const [stories, setStories] = useState<any[]>([])

  useEffect(() => {
    if (org?.id) {
      fetchSubscribers()
      fetchStats()
      fetchStories()
    } else if (user && !org) {
      router.push('/select-org')
    } else if (!user) {
      router.push('/login')
    }
  }, [org?.id, user, router])

  const fetchSubscribers = async () => {
    try {
      const response = await fetch(`/api/subscribers?org=${org?.id}`)
      const data = await response.json()
      setSubscribers(data.subscribers || [])
    } catch (error) {
      console.error('Failed to fetch subscribers:', error)
    }
  }

  const fetchStories = async () => {
    try {
      const response = await fetch(`/api/stories?org=${org?.id}`)
      const data = await response.json()
      setStories(data.stories || [])
    } catch (error) {
      console.error('Failed to fetch stories:', error)
    }
  }

  const fetchStats = async () => {
    try {
      // Mock stats for now - in real app this would come from API
      setStats({
        total_subscribers: subscribers.length,
        active_subscribers: subscribers.filter(s => s.status === 'active').length,
        total_story_subscriptions: subscribers.reduce((acc, s) => acc + s.nmbr_subscriptions.length, 0),
        avg_engagement_score: 7.2,
        total_donations: subscribers.filter(s => s.total_donations > 0).length,
        total_donation_amount: subscribers.reduce((acc, s) => acc + s.total_donated_amount, 0)
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscriber.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscriber.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || subscriber.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'unsubscribed':
        return <Badge variant="secondary">Unsubscribed</Badge>
      case 'bounced':
        return <Badge variant="destructive">Bounced</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Redirecting to Login</h2>
          <p className="text-gray-600">Please log in to access your subscribers.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3 p-6 border rounded-lg">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              Your Story Subscribers 📧
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl">
              Manage the people who are following your impact stories and see how they're engaging with your cause.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button variant="outline" className="flex items-center space-x-2 text-sm">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export List</span>
              <span className="sm:hidden">Export</span>
            </Button>
            <SendEmailDialog 
              stories={stories.map(story => ({
                id: story.id,
                title: story.title,
                nmbr_code: story.nmbr_code,
                current_amount: story.current_amount || 0,
                goal_amount: story.goal_amount || 1000,
                subscribers_count: story.subscribers || 0
              }))}
              organizationId={org?.id || ''}
              onEmailSent={() => {
                fetchSubscribers()
                fetchStats()
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-cyan-100 hover:border-cyan-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Total Subscribers</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.total_subscribers}</p>
                <p className="text-xs text-muted-foreground">People following stories</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-green-100 hover:border-green-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Active Subscribers</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.active_subscribers}</p>
                <p className="text-xs text-muted-foreground">Currently engaged</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-purple-100 hover:border-purple-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Story Subscriptions</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.total_story_subscriptions}</p>
                <p className="text-xs text-muted-foreground">Total story follows</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-orange-100 hover:border-orange-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Donation Conversion</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.total_donations}</p>
                <p className="text-xs text-muted-foreground">Subscribers who donated</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscribers Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="space-y-2">
              <CardTitle className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />
                Subscriber List
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm sm:text-base">
                Manage your story subscribers and track their engagement
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search subscribers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                    <SelectItem value="bounced">Bounced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSubscribers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No subscribers yet</h3>
              <p className="text-muted-foreground mb-6">
                When people subscribe to your stories through the widget, they'll appear here.
              </p>
              <Link href="/dashboard/nmbrs">
                <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Story
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subscriber</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Stories Following</TableHead>
                    <TableHead>Donations</TableHead>
                    <TableHead>Subscribed</TableHead>
                    <TableHead>Last Engagement</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {subscriber.first_name} {subscriber.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {subscriber.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(subscriber.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {subscriber.nmbr_subscriptions.length}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            ${subscriber.total_donated_amount.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {subscriber.total_donations} donations
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(subscriber.subscribed_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {subscriber.last_engagement_at 
                            ? formatDate(subscriber.last_engagement_at)
                            : 'Never'
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="mr-2 h-4 w-4" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart3 className="mr-2 h-4 w-4" />
                              View Activity
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
