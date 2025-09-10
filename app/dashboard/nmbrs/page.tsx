"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Share2, 
  MoreHorizontal, 
  ImageIcon, 
  Video, 
  Target, 
  Home,
  Heart,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  BarChart3
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"

interface ImpactStory {
  id: string
  code: string
  title: string
  description: string
  beneficiary: string
  category: string
  donors: number
  fundsRaised: number
  fundingGoal: number
  status: "active" | "completed" | "draft" | "paused"
  image: string
  createdAt: string
  impactDescription: string
  location: string
}

export default function ImpactStoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [stories, setStories] = useState<ImpactStory[]>([])
  const [isCreating, setIsCreating] = useState(false)

  // Start with empty array - users will create their own stories
  const impactStories = stories

  const filteredStories = impactStories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.beneficiary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || story.status === statusFilter
    
    return matchesSearch && matchesStatus
  }).sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "most-raised":
        return b.fundsRaised - a.fundsRaised
      case "most-donors":
        return b.donors - a.donors
      default:
        return 0
    }
  })

  const totalStories = impactStories.length
  const totalFundsRaised = impactStories.reduce((sum, story) => sum + story.fundsRaised, 0)
  const totalDonors = impactStories.reduce((sum, story) => sum + story.donors, 0)
  const activeStories = impactStories.filter(story => story.status === "active").length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "completed": return "bg-blue-100 text-blue-800"
      case "draft": return "bg-yellow-100 text-yellow-800"
      case "paused": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Education": return <Users className="h-4 w-4 text-blue-500" />
      case "Healthcare": return <Heart className="h-4 w-4 text-red-500" />
      case "Community": return <Target className="h-4 w-4 text-green-500" />
      case "Emergency": return <TrendingUp className="h-4 w-4 text-orange-500" />
      default: return <Target className="h-4 w-4 text-gray-500" />
    }
  }

  const handleCreateStory = async (formData: FormData) => {
    setIsCreating(true)
    try {
      const newStory: ImpactStory = {
        id: `story-${Date.now()}`,
        code: formData.get('code') as string,
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        beneficiary: formData.get('beneficiary') as string,
        category: formData.get('category') as string || 'Community',
        donors: 0,
        fundsRaised: 0,
        fundingGoal: parseInt(formData.get('goal') as string) || 1000,
        status: 'draft',
        image: '/placeholder.svg',
        createdAt: new Date().toISOString().split('T')[0],
        impactDescription: formData.get('impactDescription') as string || '',
        location: formData.get('location') as string || ''
      }

      setStories(prev => [newStory, ...prev])
      setShowCreateDialog(false)
      
      // Reset form
      const form = document.getElementById('create-story-form') as HTMLFormElement
      if (form) form.reset()
      
    } catch (error) {
      console.error('Error creating story:', error)
      alert('Failed to create story. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground font-medium">Impact Stories</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Impact Stories</h1>
          <p className="text-muted-foreground text-lg">Manage your impact stories and track donor engagement</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Story
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Create New Impact Story</DialogTitle>
              <DialogDescription>
                Create a new impact story to connect with donors and track your fundraising progress.
              </DialogDescription>
            </DialogHeader>
            <form id="create-story-form" action={handleCreateStory} className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Story Code *</Label>
                  <Input
                    id="code"
                    name="code"
                    placeholder="e.g., HOPE006"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal">Funding Goal ($) *</Label>
                  <Input
                    id="goal"
                    name="goal"
                    type="number"
                    placeholder="5000"
                    min="100"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Story Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Supporting Local Families"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="beneficiary">Beneficiary Name *</Label>
                <Input
                  id="beneficiary"
                  name="beneficiary"
                  placeholder="e.g., Maria Rodriguez"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Community">Community</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g., New York, NY"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Story Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Tell the compelling story behind this impact story..."
                  className="min-h-32"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="impactDescription">Impact Description</Label>
                <Textarea
                  id="impactDescription"
                  name="impactDescription"
                  placeholder="Describe the positive impact this story will have..."
                  className="min-h-24"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Media</Label>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Add Image
                  </Button>
                  <Button type="button" variant="outline" size="sm">
                    <Video className="w-4 h-4 mr-2" />
                    Add Video
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create Story'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Stories</p>
                <p className="text-2xl font-bold text-foreground">{totalStories}</p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Stories</p>
                <p className="text-2xl font-bold text-foreground">{activeStories}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Donors</p>
                <p className="text-2xl font-bold text-foreground">{totalDonors}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Funds Raised</p>
                <p className="text-2xl font-bold text-foreground">${totalFundsRaised.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search stories, beneficiaries, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="most-raised">Most Raised</SelectItem>
                <SelectItem value="most-donors">Most Donors</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map((story) => (
          <Card key={story.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="aspect-video bg-muted relative overflow-hidden">
              <img
                src={story.image || "/placeholder.svg"}
                alt={story.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <Badge className={`absolute top-3 right-3 ${getStatusColor(story.status)}`}>
                {story.status}
              </Badge>
              <div className="absolute top-3 left-3">
                <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                  {getCategoryIcon(story.category)}
                  <span className="text-xs font-medium text-foreground">{story.category}</span>
                </div>
              </div>
            </div>
            
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-bold text-foreground mb-1">{story.title}</CardTitle>
                  <CardDescription className="text-muted-foreground font-medium">
                    Code: {story.code}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Story
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Story
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Beneficiary:</strong> {story.beneficiary}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {story.description}
                  </p>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Funding Progress</span>
                    <span className="font-bold text-foreground">
                      ${story.fundsRaised.toLocaleString()} / ${story.fundingGoal.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={(story.fundsRaised / story.fundingGoal) * 100} className="h-2" />
                  <div className="text-xs text-muted-foreground font-medium">
                    {Math.round((story.fundsRaised / story.fundingGoal) * 100)}% of goal reached
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{story.donors} donors</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {new Date(story.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStories.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Target className="h-10 w-10 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  {searchTerm || statusFilter !== "all" 
                    ? "No stories found"
                    : "No impact stories yet"
                  }
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your search or filters to find stories."
                    : "Create compelling impact stories to connect with donors and track your fundraising progress. Each story helps you build meaningful relationships with supporters."
                  }
                </p>
              </div>
              {!searchTerm && statusFilter === "all" && (
                <div className="space-y-4">
                  <Button 
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Story
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    <p>Impact stories help donors understand your mission and connect with your cause</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}