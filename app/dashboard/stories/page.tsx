"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Grid3X3,
  List,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Plus,
  TrendingUp,
  Users,
  Hash,
  Heart,
  DollarSign,
  Target,
  Calendar,
  Share2,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

interface Story {
  id: string
  title: string
  beneficiary: string
  category: string
  status: "published" | "draft" | "archived"
  views: number
  donations: number
  fundsRaised: number
  fundingGoal: number
  createdAt: string
  thumbnail: string
  description: string
  location: string
}

const mockStories: Story[] = [
  {
    id: "1",
    title: "Supporting Maria's Education",
    beneficiary: "Maria Rodriguez",
    category: "Education",
    status: "published",
    views: 1247,
    donations: 34,
    fundsRaised: 2850,
    fundingGoal: 5000,
    createdAt: "2024-01-10",
    thumbnail: "https://via.placeholder.com/300x200?text=Education+Story",
    description: "Help Maria complete her nursing degree and serve her community",
    location: "San Francisco, CA"
  },
  {
    id: "2",
    title: "Medical Care for Ahmed",
    beneficiary: "Ahmed Hassan",
    category: "Healthcare",
    status: "published",
    views: 892,
    donations: 67,
    fundsRaised: 5420,
    fundingGoal: 8000,
    createdAt: "2024-01-08",
    thumbnail: "https://via.placeholder.com/300x200?text=Healthcare+Story",
    description: "Critical surgery needed for Ahmed's recovery",
    location: "Chicago, IL"
  },
  {
    id: "3",
    title: "Community Garden Project",
    beneficiary: "Westside Community",
    category: "Community",
    status: "draft",
    views: 0,
    donations: 0,
    fundsRaised: 0,
    fundingGoal: 3000,
    createdAt: "2024-01-15",
    thumbnail: "https://via.placeholder.com/300x200?text=Community+Story",
    description: "Building a sustainable community garden for local families",
    location: "Austin, TX"
  },
  {
    id: "4",
    title: "Youth Sports Program",
    beneficiary: "Local Youth",
    category: "Education",
    status: "published",
    views: 456,
    donations: 23,
    fundsRaised: 1200,
    fundingGoal: 2500,
    createdAt: "2024-01-12",
    thumbnail: "https://via.placeholder.com/300x200?text=Sports+Story",
    description: "Providing sports equipment and coaching for underserved youth",
    location: "Miami, FL"
  },
  {
    id: "5",
    title: "Emergency Relief Fund",
    beneficiary: "Disaster Victims",
    category: "Community",
    status: "archived",
    views: 2103,
    donations: 156,
    fundsRaised: 12500,
    fundingGoal: 10000,
    createdAt: "2024-01-05",
    thumbnail: "https://via.placeholder.com/300x200?text=Emergency+Story",
    description: "Immediate relief for families affected by natural disaster",
    location: "Houston, TX"
  }
]

const categories = ["All Categories", "Education", "Healthcare", "Community"]
const statuses = ["All Status", "Published", "Draft", "Archived"]

export default function StoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedStories, setSelectedStories] = useState<string[]>([])

  const filteredStories = mockStories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.beneficiary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || story.category === selectedCategory
    const matchesStatus = selectedStatus === "All Status" || 
                         story.status === selectedStatus.toLowerCase()
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalViews = filteredStories.reduce((sum, story) => sum + story.views, 0)
  const totalDonations = filteredStories.reduce((sum, story) => sum + story.donations, 0)
  const totalFundsRaised = filteredStories.reduce((sum, story) => sum + story.fundsRaised, 0)
  const totalFundingGoals = filteredStories.reduce((sum, story) => sum + story.fundingGoal, 0)

  const handleSelectStory = (storyId: string) => {
    setSelectedStories(prev => 
      prev.includes(storyId) 
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId]
    )
  }

  const handleSelectAll = () => {
    if (selectedStories.length === filteredStories.length) {
      setSelectedStories([])
    } else {
      setSelectedStories(filteredStories.map(story => story.id))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-800"
      case "draft": return "bg-yellow-100 text-yellow-800"
      case "archived": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getProgressPercentage = (raised: number, goal: number) => {
    return goal > 0 ? Math.min((raised / goal) * 100, 100) : 0
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Impact Stories</h1>
              <p className="text-muted-foreground mt-1">
                Manage and track your impact stories and donor engagement
              </p>
            </div>
            <Link href="/dashboard/stories/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Story
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Views
                  </CardTitle>
                  <div className="text-2xl font-bold text-foreground">
                    {totalViews.toLocaleString()}
                  </div>
                </div>
                <Eye className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Donations
                  </CardTitle>
                  <div className="text-2xl font-bold text-foreground">
                    {totalDonations.toLocaleString()}
                  </div>
                </div>
                <Heart className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Funds Raised
                  </CardTitle>
                  <div className="text-2xl font-bold text-foreground">
                    ${totalFundsRaised.toLocaleString()}
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Goal Progress
                  </CardTitle>
                  <div className="text-2xl font-bold text-foreground">
                    {totalFundingGoals > 0 ? Math.round((totalFundsRaised / totalFundingGoals) * 100) : 0}%
                  </div>
                </div>
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search stories or beneficiaries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stories List */}
        {filteredStories.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Heart className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">No stories found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || selectedCategory !== "All Categories" || selectedStatus !== "All Status"
                      ? "Try adjusting your filters to see more stories"
                      : "Create your first impact story to get started"
                    }
                  </p>
                </div>
                {!searchTerm && selectedCategory === "All Categories" && selectedStatus === "All Status" && (
                  <Link href="/dashboard/stories/create">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Story
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <Card key={story.id} className="group hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={story.thumbnail}
                    alt={story.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className={getStatusColor(story.status)}>
                      {story.status}
                    </Badge>
                  </div>
                  <div className="absolute top-3 left-3">
                    <Checkbox
                      checked={selectedStories.includes(story.id)}
                      onCheckedChange={() => handleSelectStory(story.id)}
                    />
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-1">
                        {story.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Beneficiary: {story.beneficiary}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {story.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Funding Progress</span>
                        <span className="font-medium">
                          ${story.fundsRaised.toLocaleString()} / ${story.fundingGoal.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${getProgressPercentage(story.fundsRaised, story.fundingGoal)}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="font-semibold text-foreground">{story.views}</div>
                        <div className="text-xs text-muted-foreground">Views</div>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{story.donations}</div>
                        <div className="text-xs text-muted-foreground">Donations</div>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {getProgressPercentage(story.fundsRaised, story.fundingGoal)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Complete</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(story.createdAt).toLocaleDateString()}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4">
                        <Checkbox
                          checked={selectedStories.length === filteredStories.length && filteredStories.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Story</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Beneficiary</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Views</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Donations</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Funds Raised</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Progress</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStories.map((story) => (
                      <tr key={story.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <Checkbox
                            checked={selectedStories.includes(story.id)}
                            onCheckedChange={() => handleSelectStory(story.id)}
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={story.thumbnail}
                              alt={story.title}
                              className="w-12 h-12 object-cover rounded-md"
                            />
                            <div>
                              <div className="font-medium text-foreground">{story.title}</div>
                              <div className="text-sm text-muted-foreground">{story.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-foreground">{story.beneficiary}</td>
                        <td className="p-4">
                          <Badge className={getStatusColor(story.status)}>
                            {story.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-foreground">{story.views}</td>
                        <td className="p-4 text-foreground">{story.donations}</td>
                        <td className="p-4 text-foreground">${story.fundsRaised.toLocaleString()}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${getProgressPercentage(story.fundsRaised, story.fundingGoal)}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {getProgressPercentage(story.fundsRaised, story.fundingGoal)}%
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bulk Actions */}
        {selectedStories.length > 0 && (
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {selectedStories.length} story{selectedStories.length !== 1 ? 'ies' : ''} selected
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Selected
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}