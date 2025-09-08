'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Calendar,
  Target,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Star,
  Building2,
  Plus,
  Upload,
  Tag,
  UserPlus,
  UserMinus,
  Trash2,
  Edit,
  Copy,
  FileText,
  PieChart,
  Activity,
  Clock,
  Zap,
  Shield,
  Globe,
  Phone,
  MapPin,
  MousePointer
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
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [showSegmentation, setShowSegmentation] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [segments, setSegments] = useState([
    { id: "high-value", name: "High Value Donors", count: 12, color: "bg-green-500" },
    { id: "recent", name: "Recent Subscribers", count: 45, color: "bg-blue-500" },
    { id: "engaged", name: "Highly Engaged", count: 23, color: "bg-purple-500" },
    { id: "inactive", name: "Inactive", count: 8, color: "bg-gray-500" }
  ])

  // Import dialog state
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importData, setImportData] = useState<any[]>([])
  const [columnMapping, setColumnMapping] = useState({
    email: '',
    first_name: '',
    last_name: ''
  })
  const [importOptions, setImportOptions] = useState({
    skipDuplicates: true,
    sendWelcome: true
  })
  const [isImporting, setIsImporting] = useState(false)
  const [importError, setImportError] = useState("")
  const [importSuccess, setImportSuccess] = useState("")

  useEffect(() => {
    if (org?.id) {
      fetchSubscribers()
      fetchStories()
    } else if (user && !org) {
      router.push('/select-org')
    } else if (!user) {
      router.push('/login')
    }
  }, [org?.id, user, router])

  // Update stats when subscribers data changes
  useEffect(() => {
    if (subscribers.length > 0) {
      fetchStats()
    }
  }, [subscribers])

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
      // Ensure subscribers array exists and has data
      if (!subscribers || subscribers.length === 0) {
        setStats({
          total_subscribers: 0,
          active_subscribers: 0,
          total_story_subscriptions: 0,
          avg_engagement_score: 0,
          total_donations: 0,
          total_donation_amount: 0
        })
        setLoading(false)
        return
      }

      // Mock stats for now - in real app this would come from API
      setStats({
        total_subscribers: subscribers.length,
        active_subscribers: subscribers.filter(s => s.status === 'active').length,
        total_story_subscriptions: subscribers.reduce((acc, s) => acc + (s.nmbr_subscriptions?.length || 0), 0),
        avg_engagement_score: 7.2,
        total_donations: subscribers.filter(s => (s.total_donations || 0) > 0).length,
        total_donation_amount: subscribers.reduce((acc, s) => acc + (s.total_donated_amount || 0), 0)
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSubscribers = (subscribers || []).filter(subscriber => {
    const matchesSearch = subscriber.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscriber.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscriber.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Import functionality
  const handleFileUpload = (file: File) => {
    setImportFile(file)
    setImportError("")
    setImportSuccess("")
    
    // Parse CSV file
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n')
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
        const row: any = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })
        return row
      }).filter(row => row[headers[0]]) // Remove empty rows
      
      setImportData(data)
      
      // Auto-map common column names
      const autoMapping: any = {}
      headers.forEach(header => {
        const lowerHeader = header.toLowerCase()
        if (lowerHeader.includes('email')) autoMapping.email = header
        if (lowerHeader.includes('first') && lowerHeader.includes('name')) autoMapping.first_name = header
        if (lowerHeader.includes('last') && lowerHeader.includes('name')) autoMapping.last_name = header
      })
      setColumnMapping(prev => ({ ...prev, ...autoMapping }))
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    if (!importFile || !columnMapping.email) {
      setImportError("Please select a file and map the email column")
      return
    }

    setIsImporting(true)
    setImportError("")
    setImportSuccess("")

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      const mappedData = importData.map(row => ({
        email: row[columnMapping.email],
        first_name: columnMapping.first_name ? row[columnMapping.first_name] : '',
        last_name: columnMapping.last_name ? row[columnMapping.last_name] : '',
        status: 'active',
        subscribed_at: new Date().toISOString(),
        total_donations: 0,
        total_donated_amount: 0,
        nmbr_subscriptions: []
      }))

      // Add to subscribers (in real app, this would be an API call)
      setSubscribers(prev => [...prev, ...mappedData])
      
      setImportSuccess(`Successfully imported ${mappedData.length} subscribers`)
      setImportFile(null)
      setImportData([])
      setColumnMapping({ email: '', first_name: '', last_name: '' })
      
      // Close dialog after 2 seconds
      setTimeout(() => {
        setShowImportDialog(false)
        setImportSuccess("")
      }, 2000)
      
    } catch (error) {
      setImportError("Failed to import subscribers. Please try again.")
    } finally {
      setIsImporting(false)
    }
  }

  // Bulk actions functionality
  const handleBulkAction = (action: string) => {
    if (selectedSubscribers.length === 0) return

    switch (action) {
      case 'email':
        // Open email dialog with selected subscribers
        alert(`Send email to ${selectedSubscribers.length} subscribers`)
        break
      case 'tags':
        // Open tag dialog
        alert(`Add tags to ${selectedSubscribers.length} subscribers`)
        break
      case 'remove':
        if (confirm(`Remove ${selectedSubscribers.length} subscribers?`)) {
          setSubscribers(prev => prev.filter(s => !selectedSubscribers.includes(s.id)))
          setSelectedSubscribers([])
        }
        break
    }
  }

  // Individual subscriber actions
  const handleSubscriberAction = (action: string, subscriber: Subscriber) => {
    switch (action) {
      case 'view':
        router.push(`/dashboard/subscribers/${subscriber.id}`)
        break
      case 'message':
        alert(`Send message to ${subscriber.email}`)
        break
      case 'activity':
        router.push(`/dashboard/analytics?subscriber=${subscriber.id}`)
        break
    }
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
            <Button 
              variant="outline" 
              onClick={() => setShowImportDialog(true)}
              className="flex items-center space-x-2 text-sm"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Import Subscribers</span>
              <span className="sm:hidden">Import</span>
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

      {/* Enhanced Subscriber Management with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Subscribers</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="space-y-2">
                  <CardTitle className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />
                    Subscriber List
                    {selectedSubscribers.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {selectedSubscribers.length} selected
                      </Badge>
                    )}
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
                  {selectedSubscribers.length > 0 && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleBulkAction('email')}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Email
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleBulkAction('tags')}
                      >
                        <Tag className="w-4 h-4 mr-2" />
                        Add Tags
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleBulkAction('remove')}
                      >
                        <UserMinus className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  )}
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
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedSubscribers(filteredSubscribers.map(s => s.id))
                          } else {
                            setSelectedSubscribers([])
                          }
                        }}
                      />
                    </TableHead>
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
                        <Checkbox
                          checked={selectedSubscribers.includes(subscriber.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedSubscribers([...selectedSubscribers, subscriber.id])
                            } else {
                              setSelectedSubscribers(selectedSubscribers.filter(id => id !== subscriber.id))
                            }
                          }}
                        />
                      </TableCell>
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
                            {subscriber.nmbr_subscriptions?.length || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            ${(subscriber.total_donated_amount || 0).toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {subscriber.total_donations || 0} donations
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
                            <DropdownMenuItem 
                              onClick={() => handleSubscriberAction('view', subscriber)}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleSubscriberAction('message', subscriber)}
                              className="cursor-pointer"
                            >
                              <Send className="mr-2 h-4 w-4" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleSubscriberAction('activity', subscriber)}
                              className="cursor-pointer"
                            >
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
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-purple-600" />
                    Subscriber Segments
                  </CardTitle>
                  <CardDescription>Organize your subscribers into meaningful groups</CardDescription>
                </div>
                <Button onClick={() => setShowSegmentation(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Segment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {segments.map((segment) => (
                  <Card key={segment.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-3 h-3 rounded-full ${segment.color}`} />
                        <Badge variant="outline">{segment.count}</Badge>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{segment.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {segment.count} subscribers in this segment
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email Open Rate</p>
                    <p className="text-2xl font-bold">24.8%</p>
                  </div>
                  <Eye className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Click Rate</p>
                    <p className="text-2xl font-bold">3.2%</p>
                  </div>
                  <MousePointer className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Donation Rate</p>
                    <p className="text-2xl font-bold">1.8%</p>
                  </div>
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Engagement</p>
                    <p className="text-2xl font-bold">7.2/10</p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Platform Integrations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  Platform Integrations
                </CardTitle>
                <CardDescription>Connect with popular email marketing platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full h-auto p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Mailchimp</div>
                      <div className="text-xs text-muted-foreground">Import your audience</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="w-full h-auto p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Constant Contact</div>
                      <div className="text-xs text-muted-foreground">Sync your contacts</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="w-full h-auto p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">ConvertKit</div>
                      <div className="text-xs text-muted-foreground">Bring your subscribers</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="w-full h-auto p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">AWeber</div>
                      <div className="text-xs text-muted-foreground">Transfer your list</div>
                    </div>
                  </Button>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <Shield className="w-4 h-4 inline mr-1" />
                    Secure OAuth connection - we never store your platform credentials
                  </p>
                </div>
              </CardContent>
            </Card>


            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-600" />
                  GDPR Compliance
                </CardTitle>
                <CardDescription>Manage data privacy and compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Data Export Request
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Data Deletion Request
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  Automation
                </CardTitle>
                <CardDescription>Set up automated workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <Clock className="w-4 h-4 mr-2" />
                    Welcome Series
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Activity className="w-4 h-4 mr-2" />
                    Engagement Campaigns
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Enhanced Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Import Subscribers
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Import Status Messages */}
            {importError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <div className="w-4 h-4 text-red-500">⚠️</div>
                <span className="text-red-700 text-sm">{importError}</span>
              </div>
            )}
            {importSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <div className="w-4 h-4 text-green-500">✅</div>
                <span className="text-green-700 text-sm">{importSuccess}</span>
              </div>
            )}

            {/* File Upload Area */}
            <div className="space-y-4">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onDragOver={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.add('border-blue-400', 'bg-blue-50')
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50')
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50')
                  const files = Array.from(e.dataTransfer.files)
                  if (files.length > 0) {
                    handleFileUpload(files[0])
                  }
                }}
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = '.csv,.xlsx,.txt,.json'
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) handleFileUpload(file)
                  }
                  input.click()
                }}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">Drag & drop your file here</p>
                <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                <Button 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = '.csv,.xlsx,.txt,.json'
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file) handleFileUpload(file)
                    }
                    input.click()
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  Supported formats: CSV, Excel (.xlsx), TXT, JSON
                </p>
              </div>
            </div>

            {/* File Format Options */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Popular Formats</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">CSV File</div>
                    <div className="text-xs text-muted-foreground">Comma-separated values</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Excel File</div>
                    <div className="text-xs text-muted-foreground">.xlsx spreadsheet</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column Mapping */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold">Map Your Columns</Label>
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Label className="w-24 text-sm">Email:</Label>
                  <Select 
                    value={columnMapping.email} 
                    onValueChange={(value) => setColumnMapping(prev => ({ ...prev, email: value }))}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select email column" />
                    </SelectTrigger>
                    <SelectContent>
                      {importData.length > 0 && Object.keys(importData[0] || {}).map(header => (
                        <SelectItem key={header} value={header}>{header}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Badge variant="secondary" className="text-xs">Required</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="w-24 text-sm">First Name:</Label>
                  <Select 
                    value={columnMapping.first_name} 
                    onValueChange={(value) => setColumnMapping(prev => ({ ...prev, first_name: value }))}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select first name column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {importData.length > 0 && Object.keys(importData[0] || {}).map(header => (
                        <SelectItem key={header} value={header}>{header}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Badge variant="outline" className="text-xs">Optional</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="w-24 text-sm">Last Name:</Label>
                  <Select 
                    value={columnMapping.last_name} 
                    onValueChange={(value) => setColumnMapping(prev => ({ ...prev, last_name: value }))}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select last name column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {importData.length > 0 && Object.keys(importData[0] || {}).map(header => (
                        <SelectItem key={header} value={header}>{header}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Badge variant="outline" className="text-xs">Optional</Badge>
                </div>
              </div>
            </div>

            {/* Import Options */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Import Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="skip-duplicates" 
                    checked={importOptions.skipDuplicates}
                    onCheckedChange={(checked) => setImportOptions(prev => ({ ...prev, skipDuplicates: !!checked }))}
                  />
                  <Label htmlFor="skip-duplicates" className="text-sm">
                    Skip duplicate email addresses
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="send-welcome" 
                    checked={importOptions.sendWelcome}
                    onCheckedChange={(checked) => setImportOptions(prev => ({ ...prev, sendWelcome: !!checked }))}
                  />
                  <Label htmlFor="send-welcome" className="text-sm">
                    Send welcome email to new subscribers
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowImportDialog(false)
                  setImportFile(null)
                  setImportData([])
                  setColumnMapping({ email: '', first_name: '', last_name: '' })
                  setImportError("")
                  setImportSuccess("")
                }}
                disabled={isImporting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleImport}
                disabled={isImporting || !importFile || !columnMapping.email}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
              >
                {isImporting ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Subscribers
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}