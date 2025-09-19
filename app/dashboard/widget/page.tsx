"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Copy, 
  Eye, 
  Code, 
  Settings, 
  ExternalLink, 
  Home, 
  CheckCircle,
  Calendar,
  Clock,
  Users,
  Heart,
  DollarSign,
  Share2,
  Bell,
  Archive,
  Sparkles,
  ChevronRight,
  Play,
  Image as ImageIcon,
  Video,
  FileText,
  Target,
  TrendingUp
} from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"
import { useOrganization } from "@/contexts/OrganizationContext"

// Enhanced interfaces for story structure
interface StoryUpdate {
  id: string
  date: string
  title: string
  summary: string
  fullContent: string
  type: 'milestone' | 'progress' | 'completion' | 'photo' | 'video' | 'impact'
  mediaUrl?: string
  mediaType?: 'image' | 'video'
  isPublic: boolean
}

interface NMBRStory {
  id: string
  nmbrCode: string
  title: string
  description: string
  beneficiary: string
  category: string
  goal: number
  raised: number
  status: 'active' | 'completed' | 'paused'
  organization: {
    name: string
    logo: string
    verified: boolean
  }
  updates: StoryUpdate[]
  createdAt: string
  lastUpdated: string
}

interface WidgetConfig {
  // Appearance
  primaryColor: string
  secondaryColor: string
  title: string
  description: string
  size: string
  
  // Content
  searchPlaceholder: string
  ctaText: string
  donateText: string
  successMessage: string
  
  // Features
  showVideoButton: boolean
  requireEmail: boolean
  showProgressBar: boolean
  showTimeline: boolean
  showAISummary: boolean
  showArchiveLink: boolean
  enableSharing: boolean
  
  // Donation
  defaultAmounts: string
  allowCustomAmount: boolean
  
  // Updates
  maxUpdatesShown: number
  updatePreviewLength: number
}

export default function WidgetPage() {
  const { terminology, orgType } = useOrganization()
  const [config, setConfig] = useState<WidgetConfig>({
    // Appearance
    primaryColor: "#2563eb",
    secondaryColor: "#ffffff",
    title: "Find Your NMBR Story",
    description: "Enter your bracelet code to discover the story behind it",
    size: "medium",
    
    // Content
    searchPlaceholder: "e.g., NMBR:003",
    ctaText: "Get Updates",
    donateText: "Donate Now",
    successMessage: "Thank you for your support! You'll receive updates about the impact of your contribution.",
    
    // Features
    showVideoButton: true,
    requireEmail: true,
    showProgressBar: true,
    showTimeline: true,
    showAISummary: true,
    showArchiveLink: true,
    enableSharing: true,
    
    // Donation
    defaultAmounts: "25, 50, 100",
    allowCustomAmount: true,
    
    // Updates
    maxUpdatesShown: 3,
    updatePreviewLength: 150
  })
  
  const [showPreview, setShowPreview] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showAISummary, setShowAISummary] = useState(false)

  // Mock story data for preview
  const mockStory: NMBRStory = {
    id: "story-003",
    nmbrCode: "NMBR:003",
    title: "Sarah's Journey to Recovery",
    description: "Help Sarah, a 12-year-old cancer survivor, get the medical care she needs to fully recover and return to school.",
    beneficiary: "Sarah Johnson",
    category: "Medical",
    goal: 15000,
    raised: 8750,
    status: "active",
    organization: {
      name: "Hope Foundation",
      logo: "HF",
      verified: true
    },
    updates: [
      {
        id: "update-1",
        date: "2024-01-15",
        title: "Sarah's Surgery Successful!",
        summary: "Sarah underwent her first major surgery and is recovering well. The doctors are optimistic about her progress.",
        fullContent: "We're thrilled to share that Sarah's surgery was a complete success! The medical team was able to remove the tumor completely, and Sarah is now in recovery. She's been incredibly brave throughout the process, and her family is overjoyed. The surgery took 6 hours, and Sarah is now resting comfortably in the pediatric ward. Her doctors are very optimistic about her recovery timeline.",
        type: "milestone",
        mediaUrl: "/api/placeholder/400/300",
        mediaType: "image",
        isPublic: true
      },
      {
        id: "update-2",
        date: "2024-01-22",
        title: "Physical Therapy Begins",
        summary: "Sarah started her physical therapy sessions this week and is making great progress with her mobility.",
        fullContent: "This week marked an important milestone in Sarah's recovery journey. She began her physical therapy sessions and is already showing remarkable progress. Her therapist, Dr. Martinez, is impressed with her determination and positive attitude. Sarah is working on regaining strength in her left side, and we're seeing improvements every day. She's also been able to sit up and take short walks with assistance.",
        type: "progress",
        isPublic: true
      },
      {
        id: "update-3",
        date: "2024-01-29",
        title: "Sarah's First Day Back at School",
        summary: "After 3 months away, Sarah returned to school for half days. Her classmates welcomed her back with a special celebration.",
        fullContent: "What an emotional and joyful day! Sarah returned to school for the first time in 3 months, and her classmates had prepared a beautiful welcome back celebration. The school community has been incredibly supportive throughout her journey. Sarah is attending half days for now, but her teachers are confident she'll be back to full days soon. She's already caught up on most of her schoolwork thanks to the home tutoring program we set up.",
        type: "milestone",
        mediaUrl: "/api/placeholder/400/300",
        mediaType: "image",
        isPublic: true
      }
    ],
    createdAt: "2024-01-01",
    lastUpdated: "2024-01-29"
  }

  const updateConfig = (field: keyof WidgetConfig, value: string | boolean | number) => {
    setConfig(prev => ({ ...prev, [field]: value }))
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const getWidgetSize = () => {
    switch (config.size) {
      case 'small': return 'max-w-sm'
      case 'medium': return 'max-w-md'
      case 'large': return 'max-w-lg'
      default: return 'max-w-md'
    }
  }

  const generateAISummary = (story: NMBRStory) => {
    const totalUpdates = story.updates.length
    const daysActive = Math.ceil((new Date().getTime() - new Date(story.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    const progressPercent = Math.round((story.raised / story.goal) * 100)
    
    return `Welcome to ${story.title}! This story has been active for ${daysActive} days with ${totalUpdates} updates. We've raised $${story.raised.toLocaleString()} of our $${story.goal.toLocaleString()} goal (${progressPercent}% complete). ${story.updates[0]?.summary || 'Follow along as we share updates about this important cause.'}`
  }

  const renderStoryUpdate = (update: StoryUpdate, index: number) => (
    <div key={update.id} className="border-l-2 border-blue-200 pl-4 pb-6 last:pb-0">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900 text-sm">{update.title}</h4>
            <Badge variant="outline" className="text-xs">
              {update.type}
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mb-2">{update.date}</p>
          <p className="text-sm text-gray-700 mb-2">{update.summary}</p>
          {update.mediaUrl && (
            <div className="flex items-center gap-2 text-xs text-blue-600">
              {update.mediaType === 'video' ? <Play className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
              <span>Media attached</span>
            </div>
          )}
          <Button variant="ghost" size="sm" className="text-xs p-0 h-auto">
            Read full update <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )

  const renderWidgetPreview = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">{mockStory.organization.logo}</span>
          </div>
          <div className="text-left">
            <div className="font-semibold text-gray-900 text-sm">{mockStory.organization.name}</div>
            {mockStory.organization.verified && (
              <Badge variant="secondary" className="text-xs">Verified</Badge>
            )}
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{config.title}</h3>
        <p className="text-sm text-gray-600">{config.description}</p>
      </div>

      {/* Search */}
      <div className="space-y-4 mb-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium">NMBR Code</Label>
          <div className="flex space-x-2">
            <Input 
              placeholder={config.searchPlaceholder} 
              className="text-sm" 
              defaultValue="NMBR:003"
            />
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Story Display */}
      <div className="space-y-4">
        {/* Story Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">{mockStory.title}</h4>
              <p className="text-xs text-gray-600">{mockStory.beneficiary} • {mockStory.category}</p>
            </div>
            <Badge variant={mockStory.status === 'active' ? 'default' : 'secondary'} className="text-xs">
              {mockStory.status}
            </Badge>
          </div>
          <p className="text-sm text-gray-700 mb-3">{mockStory.description}</p>
          
          {/* Progress Bar */}
          {config.showProgressBar && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>${mockStory.raised.toLocaleString()} raised</span>
                <span>{Math.round((mockStory.raised / mockStory.goal) * 100)}% of ${mockStory.goal.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(mockStory.raised / mockStory.goal) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Latest Update */}
        {config.showTimeline && mockStory.updates.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="font-medium text-gray-900 text-sm">Latest Update</h5>
              <Button variant="ghost" size="sm" className="text-xs p-0 h-auto">
                View Timeline <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-xs">1</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h6 className="font-medium text-gray-900 text-xs">{mockStory.updates[0].title}</h6>
                  <p className="text-xs text-gray-500 mb-1">{mockStory.updates[0].date}</p>
                  <p className="text-xs text-gray-700">{mockStory.updates[0].summary}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Summary */}
        {config.showAISummary && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <h6 className="font-medium text-gray-900 text-xs mb-1">AI Summary</h6>
                <p className="text-xs text-gray-700">{generateAISummary(mockStory)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm">
            <Heart className="w-4 h-4 mr-2" />
            {config.donateText}
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Bell className="w-3 h-3 mr-1" />
              {config.ctaText}
            </Button>
            {config.enableSharing && (
              <Button variant="outline" size="sm" className="text-xs">
                <Share2 className="w-3 h-3 mr-1" />
                Share
              </Button>
            )}
          </div>
        </div>

        {/* Archive Link */}
        {config.showArchiveLink && (
          <div className="text-center">
            <Button variant="ghost" size="sm" className="text-xs text-blue-600">
              <Archive className="w-3 h-3 mr-1" />
              View Story Archive
            </Button>
          </div>
        )}
      </div>
    </div>
  )
  
  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard" className="flex items-center gap-1 text-slate-600 hover:text-slate-900">
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-slate-900 font-medium">Donation Widget</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Donation Widget</h1>
          <p className="text-gray-600">Create powerful story-driven donation widgets with timeline updates and AI summaries</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={showPreview ? "default" : "outline"}
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          <Button>
            <ExternalLink className="w-4 h-4 mr-2" />
            View Live Widget
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Configuration */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Widget Configuration
              </CardTitle>
              <CardDescription>Customize your story-driven donation widget</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="appearance" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="updates">Updates</TabsTrigger>
                </TabsList>

                <TabsContent value="appearance" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="primary-color" 
                          type="color" 
                          value={config.primaryColor} 
                          onChange={(e) => updateConfig('primaryColor', e.target.value)}
                          className="w-12 h-10 p-1" 
                        />
                        <Input 
                          value={config.primaryColor} 
                          onChange={(e) => updateConfig('primaryColor', e.target.value)}
                          className="flex-1" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondary-color">Secondary Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="secondary-color" 
                          type="color" 
                          value={config.secondaryColor} 
                          onChange={(e) => updateConfig('secondaryColor', e.target.value)}
                          className="w-12 h-10 p-1" 
                        />
                        <Input 
                          value={config.secondaryColor} 
                          onChange={(e) => updateConfig('secondaryColor', e.target.value)}
                          className="flex-1" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="widget-title">Widget Title</Label>
                    <Input 
                      id="widget-title" 
                      value={config.title}
                      onChange={(e) => updateConfig('title', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="widget-description">Widget Description</Label>
                    <Textarea
                      id="widget-description"
                      value={config.description}
                      onChange={(e) => updateConfig('description', e.target.value)}
                      className="min-h-20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="widget-size">Widget Size</Label>
                    <Select value={config.size} onValueChange={(value) => updateConfig('size', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (300px)</SelectItem>
                        <SelectItem value="medium">Medium (400px)</SelectItem>
                        <SelectItem value="large">Large (500px)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="search-placeholder">Search Placeholder Text</Label>
                    <Input 
                      id="search-placeholder" 
                      value={config.searchPlaceholder}
                      onChange={(e) => updateConfig('searchPlaceholder', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cta-text">Call-to-Action Text</Label>
                    <Input 
                      id="cta-text" 
                      value={config.ctaText}
                      onChange={(e) => updateConfig('ctaText', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="donate-text">Donate Button Text</Label>
                    <Input 
                      id="donate-text" 
                      value={config.donateText}
                      onChange={(e) => updateConfig('donateText', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="success-message">Success Message</Label>
                    <Textarea
                      id="success-message"
                      value={config.successMessage}
                      onChange={(e) => updateConfig('successMessage', e.target.value)}
                      className="min-h-20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="default-amounts">Default Donation Amounts ($)</Label>
                    <Input 
                      id="default-amounts" 
                      value={config.defaultAmounts}
                      onChange={(e) => updateConfig('defaultAmounts', e.target.value)}
                      placeholder="Comma-separated values"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="features" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Show Progress Bar</Label>
                        <p className="text-sm text-gray-600">Display fundraising progress on active campaigns</p>
                      </div>
                      <Switch 
                        checked={config.showProgressBar}
                        onCheckedChange={(checked) => updateConfig('showProgressBar', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Show Timeline</Label>
                        <p className="text-sm text-gray-600">Display story updates and timeline</p>
                      </div>
                      <Switch 
                        checked={config.showTimeline}
                        onCheckedChange={(checked) => updateConfig('showTimeline', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">AI Summary</Label>
                        <p className="text-sm text-gray-600">Generate AI-powered story summaries for new subscribers</p>
                      </div>
                      <Switch 
                        checked={config.showAISummary}
                        onCheckedChange={(checked) => updateConfig('showAISummary', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Archive Link</Label>
                        <p className="text-sm text-gray-600">Show link to complete story archive</p>
                      </div>
                      <Switch 
                        checked={config.showArchiveLink}
                        onCheckedChange={(checked) => updateConfig('showArchiveLink', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Enable Sharing</Label>
                        <p className="text-sm text-gray-600">Allow users to share stories</p>
                      </div>
                      <Switch 
                        checked={config.enableSharing}
                        onCheckedChange={(checked) => updateConfig('enableSharing', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Require Email</Label>
                        <p className="text-sm text-gray-600">Make email required when subscribing</p>
                      </div>
                      <Switch 
                        checked={config.requireEmail}
                        onCheckedChange={(checked) => updateConfig('requireEmail', checked)}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="updates" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-updates">Max Updates Shown</Label>
                    <Input 
                      id="max-updates" 
                      type="number"
                      value={config.maxUpdatesShown}
                      onChange={(e) => updateConfig('maxUpdatesShown', parseInt(e.target.value))}
                      min="1"
                      max="10"
                    />
                    <p className="text-xs text-gray-600">Number of recent updates to display in the widget</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preview-length">Update Preview Length</Label>
                    <Input 
                      id="preview-length" 
                      type="number"
                      value={config.updatePreviewLength}
                      onChange={(e) => updateConfig('updatePreviewLength', parseInt(e.target.value))}
                      min="50"
                      max="500"
                    />
                    <p className="text-xs text-gray-600">Character limit for update summaries</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">AI Summary Features</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Automatically generates catch-up summaries for new subscribers</li>
                      <li>• Includes story progress, timeline, and key milestones</li>
                      <li>• Helps donors understand the full context quickly</li>
                      <li>• Can be customized per organization</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Embed Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Embed Code
              </CardTitle>
              <CardDescription>Copy this code to embed the enhanced widget on your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="iframe" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="iframe">iFrame</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                </TabsList>

                <TabsContent value="iframe" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Enhanced iFrame Embed Code</Label>
                    <div className="relative">
                      <Textarea
                        readOnly
                        value={`<iframe 
  src="https://nmbr-platform.vercel.app/widget/hope-foundation?primaryColor=${encodeURIComponent(config.primaryColor)}&secondaryColor=${encodeURIComponent(config.secondaryColor)}&showTimeline=true&showAISummary=true&showArchive=true"
  width="400" 
  height="700" 
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
</iframe>`}
                        className="min-h-32 font-mono text-sm"
                      />
                      <Button 
                        size="sm" 
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(`<iframe 
  src="https://nmbr-platform.vercel.app/widget/hope-foundation?primaryColor=${encodeURIComponent(config.primaryColor)}&secondaryColor=${encodeURIComponent(config.secondaryColor)}&showTimeline=true&showAISummary=true&showArchive=true"
  width="400" 
  height="700" 
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
</iframe>`)}
                      >
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="javascript" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Enhanced JavaScript Embed Code</Label>
                    <div className="relative">
                      <Textarea
                        readOnly
                        value={`<div id="nmbr-widget"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://nmbr-platform.vercel.app/widget.js';
    script.onload = function() {
      NMBRWidget.init({
        container: '#nmbr-widget',
        organization: 'hope-foundation',
        primaryColor: '${config.primaryColor}',
        secondaryColor: '${config.secondaryColor}',
        showTimeline: ${config.showTimeline},
        showAISummary: ${config.showAISummary},
        showArchive: ${config.showArchiveLink},
        enableSharing: ${config.enableSharing},
        maxUpdates: ${config.maxUpdatesShown}
      });
    };
    document.head.appendChild(script);
  })();
</script>`}
                        className="min-h-32 font-mono text-sm"
                      />
                      <Button 
                        size="sm" 
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(`<div id="nmbr-widget"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://nmbr-platform.vercel.app/widget.js';
    script.onload = function() {
      NMBRWidget.init({
        container: '#nmbr-widget',
        organization: 'hope-foundation',
        primaryColor: '${config.primaryColor}',
        secondaryColor: '${config.secondaryColor}',
        showTimeline: ${config.showTimeline},
        showAISummary: ${config.showAISummary},
        showArchive: ${config.showArchiveLink},
        enableSharing: ${config.enableSharing},
        maxUpdates: ${config.maxUpdatesShown}
      });
    };
    document.head.appendChild(script);
  })();
</script>`)}
                      >
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Enhanced Widget Features
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">Story Timeline</h4>
                    <p className="text-sm text-blue-800 mb-2">
                      Shows the latest story updates with dates, summaries, and media attachments.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">AI Summary</h4>
                    <p className="text-sm text-blue-800 mb-2">
                      Automatically generates catch-up summaries for new subscribers to understand the full story context.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">Archive Navigation</h4>
                    <p className="text-sm text-blue-800 mb-2">
                      Users can access the complete story timeline and all past updates.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">Smart Sharing</h4>
                    <p className="text-sm text-blue-800">
                      Easy sharing with pre-formatted messages and social media integration.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Live Preview
              </CardTitle>
              <CardDescription>See how your enhanced widget will appear</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-6 rounded-lg">
                {renderWidgetPreview()}
              </div>
            </CardContent>
          </Card>

          {/* AI Summary Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI Summary Demo
              </CardTitle>
              <CardDescription>See how AI summaries help new subscribers catch up</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm mb-2">Welcome to Sarah's Journey!</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      This story has been active for 29 days with 3 updates. We've raised $8,750 of our $15,000 goal (58% complete). 
                      Sarah underwent her first major surgery and is recovering well. The doctors are optimistic about her progress.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>• 3 updates available</span>
                      <span>• 58% funded</span>
                      <span>• Active 29 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Enhanced Analytics
              </CardTitle>
              <CardDescription>Track engagement with your story-driven widget</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-gray-600">Widget Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-600">NMBR Searches</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="text-sm text-gray-600">Timeline Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">0</div>
                  <div className="text-sm text-gray-600">AI Summaries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">0</div>
                  <div className="text-sm text-gray-600">New Subscribers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">$0</div>
                  <div className="text-sm text-gray-600">Donations</div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 text-center">
                  Enhanced analytics will track story engagement, timeline views, AI summary usage, and conversion rates.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
