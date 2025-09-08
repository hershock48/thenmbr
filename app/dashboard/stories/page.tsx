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
} from "lucide-react"
import { useOrganization } from "@/contexts/OrganizationContext"

interface Story {
  id: string
  title: string
  product: string
  category: string
  status: "published" | "draft" | "archived"
  views: number
  scans: number
  conversions: number
  donations?: number
  fundsRaised?: number
  beneficiary?: string
  createdAt: string
  thumbnail: string
}

const mockStories: Story[] = [
  // Business stories
  {
    id: "1",
    title: "Maria's Coffee Journey",
    product: "Ethiopian Single Origin",
    category: "Coffee",
    status: "published",
    views: 1247,
    scans: 89,
    conversions: 23,
    createdAt: "2024-01-15",
    thumbnail: "/ethiopian-woman-farmer-portrait.jpg",
  },
  {
    id: "2",
    title: "Sustainable Tea Farming",
    product: "Earl Grey Premium",
    category: "Tea",
    status: "published",
    views: 892,
    scans: 67,
    conversions: 18,
    createdAt: "2024-01-12",
    thumbnail: "/lush-tea-plantation.png",
  },
  // Nonprofit stories
  {
    id: "3",
    title: "Sarah's Educational Journey",
    product: "Education Program",
    beneficiary: "Sarah M.",
    category: "Education",
    status: "published",
    views: 1456,
    scans: 0,
    conversions: 0,
    donations: 34,
    fundsRaised: 2850,
    createdAt: "2024-01-10",
    thumbnail: "/school-children-books.jpg",
  },
  {
    id: "4",
    title: "Clean Water for Village",
    product: "Water Access Project",
    beneficiary: "Riverside Village",
    category: "Water & Sanitation",
    status: "published",
    views: 2103,
    scans: 0,
    conversions: 0,
    donations: 67,
    fundsRaised: 5420,
    createdAt: "2024-01-08",
    thumbnail: "/water-well-village.jpg",
  },
]

export default function StoriesPage() {
  const { orgType } = useOrganization()
  const [stories, setStories] = useState<Story[]>(mockStories)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStories, setSelectedStories] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const filteredStories = stories.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (story.beneficiary && story.beneficiary.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === "all" || story.status === statusFilter
    const matchesCategory = categoryFilter === "all" || story.category === categoryFilter

    // Show appropriate stories based on org type
    const matchesOrgType =
      orgType === "nonprofit"
        ? story.donations !== undefined // Nonprofit stories have donations field
        : story.donations === undefined // Business stories don't have donations field

    return matchesSearch && matchesStatus && matchesCategory && matchesOrgType
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStories(filteredStories.map((story) => story.id))
    } else {
      setSelectedStories([])
    }
  }

  const handleSelectStory = (storyId: string, checked: boolean) => {
    if (checked) {
      setSelectedStories([...selectedStories, storyId])
    } else {
      setSelectedStories(selectedStories.filter((id) => id !== storyId))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-primary text-primary-foreground"
      case "draft":
        return "bg-muted text-muted-foreground"
      case "archived":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const totalViews = filteredStories.reduce((sum, story) => sum + story.views, 0)
  const totalScans = filteredStories.reduce((sum, story) => sum + story.scans, 0)
  const totalConversions =
    orgType === "nonprofit"
      ? filteredStories.reduce((sum, story) => sum + (story.donations || 0), 0)
      : filteredStories.reduce((sum, story) => sum + story.conversions, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Story Management</h1>
          <p className="text-muted-foreground">
            {orgType === "nonprofit"
              ? "Manage and track your impact stories and donor engagement"
              : "Manage and track your product stories"}
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Story
        </Button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {orgType === "nonprofit" ? "NMBR Searches" : "NMBR Searches"}
            </CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalScans.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {orgType === "nonprofit" ? "Total Donations" : "Conversions"}
            </CardTitle>
            {orgType === "nonprofit" ? (
              <Heart className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Users className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalConversions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +15% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {orgType === "nonprofit" ? (
                <>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Water & Sanitation">Water & Sanitation</SelectItem>
                  <SelectItem value="Housing">Housing</SelectItem>
                  <SelectItem value="Community">Community</SelectItem>
                </>
              ) : (
                // Business categories
                <>
                  <SelectItem value="Coffee">Coffee</SelectItem>
                  <SelectItem value="Tea">Tea</SelectItem>
                  <SelectItem value="Chocolate">Chocolate</SelectItem>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedStories.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{selectedStories.length} stories selected</span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Archive Selected
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Stories Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <Card key={story.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={story.thumbnail || "/placeholder.svg"}
                  alt={story.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <Checkbox
                    checked={selectedStories.includes(story.id)}
                    onCheckedChange={(checked) => handleSelectStory(story.id, checked as boolean)}
                    className="bg-background"
                  />
                </div>
                <div className="absolute top-2 right-2">
                  <Badge className={getStatusColor(story.status)}>{story.status}</Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-1">{story.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {orgType === "nonprofit" && story.beneficiary ? story.beneficiary : story.product}
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-3">
                  <div>
                    <div className="font-medium text-foreground">{story.views}</div>
                    <div>Views</div>
                  </div>
                  {orgType === "nonprofit" ? (
                    <>
                      <div>
                        <div className="font-medium text-foreground">{story.donations || 0}</div>
                        <div>Donations</div>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">${story.fundsRaised || 0}</div>
                        <div>Raised</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <div className="font-medium text-foreground">{story.scans}</div>
                        <div>Scans</div>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{story.conversions}</div>
                        <div>Conversions</div>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{story.createdAt}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Story
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Story
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Story
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left p-4">
                      <Checkbox
                        checked={selectedStories.length === filteredStories.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Story</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      {orgType === "nonprofit" ? "Beneficiary" : "Product"}
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Views</th>
                    {orgType === "nonprofit" ? (
                      <>
                        <th className="text-left p-4 font-medium text-muted-foreground">Donations</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Funds Raised</th>
                      </>
                    ) : (
                      <>
                        <th className="text-left p-4 font-medium text-muted-foreground">Scans</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Conversions</th>
                      </>
                    )}
                    <th className="text-left p-4 font-medium text-muted-foreground">Created</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStories.map((story) => (
                    <tr key={story.id} className="border-b border-border hover:bg-muted/50">
                      <td className="p-4">
                        <Checkbox
                          checked={selectedStories.includes(story.id)}
                          onCheckedChange={(checked) => handleSelectStory(story.id, checked as boolean)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={story.thumbnail || "/placeholder.svg"}
                            alt={story.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <span className="font-medium text-foreground">{story.title}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {orgType === "nonprofit" && story.beneficiary ? story.beneficiary : story.product}
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(story.status)}>{story.status}</Badge>
                      </td>
                      <td className="p-4 text-foreground">{story.views}</td>
                      {orgType === "nonprofit" ? (
                        <>
                          <td className="p-4 text-foreground">{story.donations || 0}</td>
                          <td className="p-4 text-foreground">${story.fundsRaised || 0}</td>
                        </>
                      ) : (
                        <>
                          <td className="p-4 text-foreground">{story.scans}</td>
                          <td className="p-4 text-foreground">{story.conversions}</td>
                        </>
                      )}
                      <td className="p-4 text-muted-foreground">{story.createdAt}</td>
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
                              View Story
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Story
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Story
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
    </div>
  )
}
