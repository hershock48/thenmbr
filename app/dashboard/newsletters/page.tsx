'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mail,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Send,
  Copy,
  Trash2,
  BarChart3,
  Users,
  Calendar,
  Palette,
  Image,
  Settings,
  Download,
  Upload,
  SortAsc,
  SortDesc,
  X,
  Check,
  ArrowUpDown,
  Hash,
  Tag,
  Clock,
  TrendingUp,
  TrendingDown,
  Star,
  Heart,
  Zap,
  Target,
  Award,
  Globe,
  Shield,
  Lightbulb,
  Rocket,
  Diamond,
  Crown,
  Flame,
  Sun,
  Moon,
  Cloud,
  Leaf,
  Flower,
  Tree,
  Mountain,
  Ocean,
  Fire,
  Water,
  Earth,
  Air,
  Space,
  Galaxy,
  Planet,
  Sparkles,
  Gift,
  Award as AwardIcon,
  Target as TargetIcon,
  Globe as GlobeIcon,
  Shield as ShieldIcon,
  Lightbulb as LightbulbIcon,
  Rocket as RocketIcon,
  Diamond as DiamondIcon,
  Crown as CrownIcon,
  Flame as FlameIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  Cloud as CloudIcon,
  Leaf as LeafIcon,
  Flower as FlowerIcon,
  Tree as TreeIcon,
  Mountain as MountainIcon,
  Ocean as OceanIcon,
  Fire as FireIcon,
  Water as WaterIcon,
  Earth as EarthIcon,
  Air as AirIcon,
  Space as SpaceIcon,
  Galaxy as GalaxyIcon,
  Planet as PlanetIcon,
  Sparkles as SparklesIcon,
  Gift as GiftIcon
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MediaUpload } from "@/components/dashboard/media-upload"
import { newsletterTemplates, newsletterThemes } from "@/lib/newsletter-templates"

interface Newsletter {
  id: string
  name: string
  type: 'story_update' | 'milestone' | 'completion' | 'welcome' | 'custom'
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
  storyId: string
  storyTitle: string
  theme: string
  recipients: number
  sentAt?: string
  scheduledAt?: string
  openRate?: number
  clickRate?: number
  donationRate?: number
  createdAt: string
}

interface Story {
  id: string
  title: string
  nmbr_code: string
  subscribers_count: number
}

export default function NewslettersPage() {
  const { user, org } = useAuth()
  const router = useRouter()
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [showBuilder, setShowBuilder] = useState(false)
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  const [selectedStory, setSelectedStory] = useState<string>("")

  useEffect(() => {
    if (org?.id) {
      fetchNewsletters()
      fetchStories()
    } else if (user && !org) {
      router.push('/select-org')
    } else if (!user) {
      router.push('/login')
    }
  }, [org?.id, user, router])

  const fetchNewsletters = async () => {
    try {
      // Mock data - in real app this would come from API
      const mockNewsletters: Newsletter[] = [
        {
          id: '1',
          name: 'Weekly Water Project Update',
          type: 'story_update',
          status: 'sent',
          storyId: 'story-1',
          storyTitle: 'Clean Water for Village',
          theme: 'modern-cyan',
          recipients: 89,
          sentAt: '2024-01-15T10:30:00Z',
          openRate: 78.5,
          clickRate: 23.4,
          donationRate: 12.1,
          createdAt: '2024-01-15T09:00:00Z'
        },
        {
          id: '2',
          name: 'Milestone Celebration - School Supplies',
          type: 'milestone',
          status: 'sent',
          storyId: 'story-2',
          storyTitle: 'School Supplies Drive',
          theme: 'elegant-purple',
          recipients: 156,
          sentAt: '2024-01-14T14:20:00Z',
          openRate: 82.1,
          clickRate: 31.2,
          donationRate: 18.7,
          createdAt: '2024-01-14T13:00:00Z'
        },
        {
          id: '3',
          name: 'Medical Equipment - Story Complete!',
          type: 'completion',
          status: 'sent',
          storyId: 'story-3',
          storyTitle: 'Medical Equipment for Clinic',
          theme: 'bold-orange',
          recipients: 203,
          sentAt: '2024-01-13T09:15:00Z',
          openRate: 85.3,
          clickRate: 28.9,
          donationRate: 15.4,
          createdAt: '2024-01-13T08:00:00Z'
        },
        {
          id: '4',
          name: 'Welcome New Subscribers',
          type: 'welcome',
          status: 'draft',
          storyId: 'story-1',
          storyTitle: 'Clean Water for Village',
          theme: 'minimal-green',
          recipients: 0,
          createdAt: '2024-01-16T11:00:00Z'
        }
      ]
      setNewsletters(mockNewsletters)
    } catch (error) {
      console.error('Failed to fetch newsletters:', error)
    } finally {
      setLoading(false)
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

  const filteredNewsletters = newsletters.filter(newsletter => {
    const matchesSearch = newsletter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         newsletter.storyTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || newsletter.status === statusFilter
    const matchesType = typeFilter === "all" || newsletter.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
      case 'sending':
        return <Badge className="bg-yellow-100 text-yellow-800">Sending</Badge>
      case 'sent':
        return <Badge className="bg-green-100 text-green-800">Sent</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'story_update':
        return <Badge variant="outline">Story Update</Badge>
      case 'milestone':
        return <Badge className="bg-purple-100 text-purple-800">Milestone</Badge>
      case 'completion':
        return <Badge className="bg-orange-100 text-orange-800">Completion</Badge>
      case 'welcome':
        return <Badge className="bg-cyan-100 text-cyan-800">Welcome</Badge>
      case 'custom':
        return <Badge className="bg-gray-100 text-gray-800">Custom</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Redirecting to Login</h2>
          <p className="text-gray-600">Please log in to access your newsletters.</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
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
              Newsletter Studio 📧
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl">
              Create professional newsletters that keep your story subscribers engaged and drive donations.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2 text-sm">
                  <Image className="w-4 h-4" />
                  <span className="hidden sm:inline">Media Library</span>
                  <span className="sm:hidden">Media</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Media Library</DialogTitle>
                </DialogHeader>
                <MediaUpload 
                  organizationId={org?.id || ''}
                  onSelect={(file) => {
                    console.log('Selected file:', file)
                    // Handle file selection
                  }}
                />
              </DialogContent>
            </Dialog>
            <Button 
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white shadow-lg text-sm"
              onClick={() => router.push(`/dashboard/newsletters/builder?storyId=${selectedStory || stories[0]?.id || ''}`)}
            >
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Create Newsletter</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-cyan-100 hover:border-cyan-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Total Newsletters</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{newsletters.length}</p>
                <p className="text-xs text-muted-foreground">Created</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-green-100 hover:border-green-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Avg Open Rate</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">81.2%</p>
                <p className="text-xs text-muted-foreground">Across all newsletters</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-purple-100 hover:border-purple-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Total Recipients</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {newsletters.reduce((acc, n) => acc + n.recipients, 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Emails sent</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-orange-100 hover:border-orange-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Donation Rate</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">15.4%</p>
                <p className="text-xs text-muted-foreground">From newsletter clicks</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Newsletter List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="space-y-2">
              <CardTitle className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />
                Your Newsletters
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm sm:text-base">
                Manage and track your newsletter campaigns
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search newsletters..."
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
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="story_update">Story Update</SelectItem>
                    <SelectItem value="milestone">Milestone</SelectItem>
                    <SelectItem value="completion">Completion</SelectItem>
                    <SelectItem value="welcome">Welcome</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredNewsletters.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No newsletters yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first newsletter to engage with your story subscribers.
              </p>
              <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Newsletter
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNewsletters.map((newsletter) => (
                <div 
                  key={newsletter.id} 
                  className="flex items-center justify-between p-6 border rounded-xl group hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground">{newsletter.name}</h3>
                        {getStatusBadge(newsletter.status)}
                        {getTypeBadge(newsletter.type)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        For: {newsletter.storyTitle} • {newsletter.recipients} recipients
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Created: {formatDate(newsletter.createdAt)}</span>
                        {newsletter.sentAt && (
                          <span>Sent: {formatDate(newsletter.sentAt)}</span>
                        )}
                        {newsletter.openRate && (
                          <span>Open Rate: {newsletter.openRate}%</span>
                        )}
                        {newsletter.donationRate && (
                          <span>Donation Rate: {newsletter.donationRate}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
