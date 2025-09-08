"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Search, Filter, Edit, Eye, Share2, MoreHorizontal, ImageIcon, Video, Target, Home, X, AlertCircle } from "lucide-react"
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
import { useRouter } from "next/navigation"

interface NMBR {
  id: number
  code: string
  title: string
  story: string
  subscribers: number
  raised: number
  goal: number
  status: "active" | "completed" | "paused" | "draft"
  image: string
  createdAt: string
}

export default function NMBRsPage() {
  const router = useRouter()
  const [nmbrs, setNmbrs] = useState<NMBR[]>([
    {
      id: 1,
      code: "HOPE001",
      title: "Clean Water for Village",
      story:
        "This bracelet represents our mission to bring clean water to a remote village in Kenya. Every donation helps us get closer to installing a sustainable water system that will serve 500 families.",
      subscribers: 89,
      raised: 3250,
      goal: 5000,
      status: "active",
      image: "/placeholder.jpg",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      code: "HOPE002",
      title: "School Supplies Drive",
      story:
        "Education is the key to breaking the cycle of poverty. This NMBR supports our school supplies drive, providing books, pencils, and learning materials to children in underserved communities.",
      subscribers: 156,
      raised: 4800,
      goal: 3000,
      status: "completed",
      image: "/placeholder.jpg",
      createdAt: "2024-01-10",
    },
    {
      id: 3,
      code: "HOPE003",
      title: "Medical Equipment Fund",
      story:
        "Our local clinic desperately needs new medical equipment to serve the community better. This NMBR helps us raise funds for essential medical devices that will save lives.",
      subscribers: 203,
      raised: 7200,
      goal: 10000,
      status: "active",
      image: "/placeholder.jpg",
      createdAt: "2024-01-08",
    },
  ])

  // Form state for create NMBR dialog
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    story: "",
    goal: "",
  })
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState("")
  const [formErrors, setFormErrors] = useState({
    code: "",
    title: "",
    story: "",
    goal: ""
  })

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [filteredNmbrs, setFilteredNmbrs] = useState<NMBR[]>([])

  // Filter and search logic
  useEffect(() => {
    let filtered = [...nmbrs]

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(nmbr =>
        nmbr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nmbr.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nmbr.story.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(nmbr => nmbr.status === statusFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "most-raised":
          return b.raised - a.raised
        case "most-subscribers":
          return b.subscribers - a.subscribers
        default:
          return 0
      }
    })

    setFilteredNmbrs(filtered)
  }, [nmbrs, searchQuery, statusFilter, sortBy])

  // Form validation
  const validateForm = () => {
    const errors = {
      code: "",
      title: "",
      story: "",
      goal: ""
    }

    if (!formData.code.trim()) {
      errors.code = "NMBR code is required"
    } else if (!/^[A-Z0-9]+$/.test(formData.code.trim())) {
      errors.code = "NMBR code must contain only letters and numbers"
    } else if (nmbrs.some(nmbr => nmbr.code === formData.code.trim().toUpperCase())) {
      errors.code = "This NMBR code already exists"
    }

    if (!formData.title.trim()) {
      errors.title = "Campaign title is required"
    } else if (formData.title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters"
    }

    if (!formData.story.trim()) {
      errors.story = "Story is required"
    } else if (formData.story.trim().length < 20) {
      errors.story = "Story must be at least 20 characters"
    }

    if (!formData.goal.trim()) {
      errors.goal = "Fundraising goal is required"
    } else if (isNaN(Number(formData.goal)) || Number(formData.goal) <= 0) {
      errors.goal = "Please enter a valid fundraising goal"
    } else if (Number(formData.goal) > 1000000) {
      errors.goal = "Goal cannot exceed $1,000,000"
    }

    setFormErrors(errors)
    return Object.values(errors).every(error => error === "")
  }

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleCreateNmbr = async () => {
    if (!validateForm()) {
      setCreateError("Please fix the errors below")
      return
    }

    setIsCreating(true)
    setCreateError("")

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newNmbr: NMBR = {
        id: Date.now(), // Simple ID generation
        code: formData.code.trim().toUpperCase(),
        title: formData.title.trim(),
        story: formData.story.trim(),
        goal: Number(formData.goal),
        raised: 0,
        subscribers: 0,
        status: "active",
        image: "/placeholder.jpg",
        createdAt: new Date().toISOString().split('T')[0],
      }

      setNmbrs(prev => [newNmbr, ...prev])
      setFormData({ code: "", title: "", story: "", goal: "" })
      setShowCreateDialog(false)
      
      // Trigger first story achievement
      try {
        const { useAchievements } = require('@/components/ui/achievement-system')
        const { updateAchievement } = useAchievements()
        updateAchievement('first-story', 1)
      } catch (err) {
        console.log('Achievement system not available:', err)
      }
    } catch (error) {
      setCreateError("Failed to create NMBR. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  const handleDropdownAction = (action: string, nmbr: NMBR) => {
    switch (action) {
      case "view":
        router.push(`/dashboard/nmbrs/${nmbr.id}`)
        break
      case "edit":
        router.push(`/dashboard/nmbrs/${nmbr.id}/edit`)
        break
      case "share":
        // Copy widget code to clipboard
        const widgetCode = `<script src="${window.location.origin}/nmbr.js" data-org="${nmbr.code}"></script>`
        navigator.clipboard.writeText(widgetCode)
        alert('Widget code copied to clipboard!')
        break
      case "analytics":
        router.push(`/dashboard/analytics?nmbr=${nmbr.id}`)
        break
    }
  }

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
            <BreadcrumbPage className="text-slate-900 font-medium">NMBRs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 text-balance">NMBRs</h1>
          <p className="text-slate-600 text-lg">Manage your bracelet campaigns and their stories</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 shadow-lg hover:shadow-xl transition-all duration-200">
              <Plus className="w-4 h-4 mr-2" />
              Create New NMBR
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-slate-900">Create New NMBR</DialogTitle>
              <DialogDescription className="text-slate-600">
                Create a new bracelet campaign with its associated story and fundraising goal.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {createError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-700 text-sm">{createError}</span>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-slate-700 font-medium">
                    NMBR Code *
                  </Label>
                  <Input
                    id="code"
                    placeholder="e.g., HOPE005"
                    value={formData.code}
                    onChange={(e) => handleFormChange('code', e.target.value)}
                    className={`border-slate-200 focus:border-cyan-500 focus:ring-cyan-500/20 ${
                      formErrors.code ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''
                    }`}
                    required
                  />
                  {formErrors.code && (
                    <p className="text-red-600 text-xs mt-1">{formErrors.code}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal" className="text-slate-700 font-medium">
                    Fundraising Goal ($) *
                  </Label>
                  <Input
                    id="goal"
                    type="number"
                    placeholder="5000"
                    value={formData.goal}
                    onChange={(e) => handleFormChange('goal', e.target.value)}
                    className={`border-slate-200 focus:border-cyan-500 focus:ring-cyan-500/20 ${
                      formErrors.goal ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''
                    }`}
                    min="1"
                    required
                  />
                  {formErrors.goal && (
                    <p className="text-red-600 text-xs mt-1">{formErrors.goal}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-700 font-medium">
                  Campaign Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Emergency Relief Fund"
                  value={formData.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  className={`border-slate-200 focus:border-cyan-500 focus:ring-cyan-500/20 ${
                    formErrors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''
                  }`}
                  required
                />
                {formErrors.title && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.title}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="story" className="text-slate-700 font-medium">
                  Story *
                </Label>
                <Textarea
                  id="story"
                  placeholder="Tell the compelling story behind this NMBR..."
                  value={formData.story}
                  onChange={(e) => handleFormChange('story', e.target.value)}
                  className={`min-h-32 border-slate-200 focus:border-cyan-500 focus:ring-cyan-500/20 ${
                    formErrors.story ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''
                  }`}
                  required
                />
                {formErrors.story && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.story}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Media</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50 bg-transparent" disabled>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Add Image
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50 bg-transparent" disabled>
                    <Video className="w-4 h-4 mr-2" />
                    Add Video
                  </Button>
                </div>
                <p className="text-xs text-slate-500">Media upload coming soon</p>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="border-slate-200 hover:bg-slate-50 bg-transparent"
                  onClick={() => {
                    setShowCreateDialog(false)
                    setFormData({ code: "", title: "", story: "", goal: "" })
                    setCreateError("")
                    setFormErrors({ code: "", title: "", story: "", goal: "" })
                  }}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateNmbr}
                  disabled={isCreating || !validateForm()}
                  className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800"
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create & Activate
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search NMBRs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-slate-200 focus:border-cyan-500 focus:ring-cyan-500/20"
                aria-label="Search NMBRs by title, code, or story"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 border-slate-200" aria-label="Filter by status">
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
              <SelectTrigger className="w-40 border-slate-200" aria-label="Sort NMBRs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="most-raised">Most Raised</SelectItem>
                <SelectItem value="most-subscribers">Most Subscribers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* NMBRs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNmbrs.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No NMBRs found</h3>
            <p className="text-slate-600 mb-4">
              {searchQuery ? "Try adjusting your search or filter criteria." : "Create your first NMBR to get started."}
            </p>
            {!searchQuery && (
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First NMBR
              </Button>
            )}
          </div>
        ) : (
          filteredNmbrs.map((nmbr) => (
          <Card
            key={nmbr.id}
            className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm"
          >
            <div className="aspect-video bg-slate-100 relative overflow-hidden">
              <img
                src={nmbr.image || "/placeholder.jpg"}
                alt={nmbr.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.jpg"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <Badge
                className={`absolute top-3 right-3 shadow-lg ${
                  nmbr.status === "active"
                    ? "bg-emerald-500 hover:bg-emerald-500 text-white"
                    : nmbr.status === "completed"
                      ? "bg-blue-500 hover:bg-blue-500 text-white"
                      : "bg-slate-500 hover:bg-slate-500 text-white"
                }`}
              >
                {nmbr.status}
              </Badge>
            </div>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-bold text-slate-900 mb-1">{nmbr.title}</CardTitle>
                  <CardDescription className="text-slate-500 font-medium">Code: {nmbr.code}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hover:bg-slate-100">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="shadow-lg border-slate-200">
                    <DropdownMenuItem 
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => handleDropdownAction("view", nmbr)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => handleDropdownAction("edit", nmbr)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Story
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => handleDropdownAction("share", nmbr)}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Get Widget Code
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => handleDropdownAction("analytics", nmbr)}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      View Analytics
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-slate-600 mb-6 line-clamp-3 leading-relaxed">{nmbr.story}</p>

              {/* Progress */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">Progress</span>
                  <span className="font-bold text-slate-900">
                    ${nmbr.raised.toLocaleString()} / ${nmbr.goal.toLocaleString()}
                  </span>
                </div>
                <Progress 
                  value={nmbr.goal > 0 ? (nmbr.raised / nmbr.goal) * 100 : 0} 
                  className="h-3 bg-slate-100" 
                />
                <div className="text-xs text-slate-500 font-medium">
                  {nmbr.goal > 0 ? Math.round((nmbr.raised / nmbr.goal) * 100) : 0}% of goal reached
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 font-medium">{nmbr.subscribers} subscribers</span>
                <span className="text-slate-500">Created {new Date(nmbr.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>
    </div>
  )
}
