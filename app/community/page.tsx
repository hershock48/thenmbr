"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Users,
  MessageSquare,
  TrendingUp,
  Star,
  Heart,
  Share2,
  Plus,
  Search,
  Filter,
  Award,
  Target,
  DollarSign,
  Calendar,
  MapPin,
  Globe,
  Zap,
  Sparkles,
  ThumbsUp,
  Reply,
  Bookmark,
  Flag,
  MoreHorizontal,
  ChevronRight,
  Activity,
  BarChart3,
  Lightbulb,
  Handshake
} from "lucide-react"
import { useOrganization } from "@/contexts/OrganizationContext"

interface CommunityPost {
  id: string
  author: {
    name: string
    organization: string
    avatar: string
    verified: boolean
    tier: 'free' | 'starter' | 'growth' | 'professional'
  }
  content: string
  type: 'success' | 'question' | 'tip' | 'collaboration' | 'announcement'
  category: 'fundraising' | 'stories' | 'products' | 'analytics' | 'general'
  tags: string[]
  likes: number
  comments: number
  shares: number
  views: number
  createdAt: string
  isLiked: boolean
  isBookmarked: boolean
  featured: boolean
}

interface CommunityStats {
  totalPosts: number
  activeUsers: number
  totalLikes: number
  successStories: number
  collaborations: number
  topContributors: Array<{
    name: string
    organization: string
    posts: number
    likes: number
    avatar: string
  }>
}

export default function CommunityPage() {
  const { terminology } = useOrganization()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null)

  // Mock community data
  const communityStats: CommunityStats = {
    totalPosts: 1247,
    activeUsers: 342,
    totalLikes: 8934,
    successStories: 156,
    collaborations: 89,
    topContributors: [
      {
        name: "Sarah Johnson",
        organization: "Clean Water Initiative",
        posts: 23,
        likes: 456,
        avatar: "/api/placeholder/40/40"
      },
      {
        name: "Michael Chen",
        organization: "Education First",
        posts: 18,
        likes: 389,
        avatar: "/api/placeholder/40/40"
      },
      {
        name: "Maria Rodriguez",
        organization: "Wildlife Conservation",
        posts: 15,
        likes: 312,
        avatar: "/api/placeholder/40/40"
      }
    ]
  }

  const communityPosts: CommunityPost[] = [
    {
      id: '1',
      author: {
        name: "Sarah Johnson",
        organization: "Clean Water Initiative",
        avatar: "/api/placeholder/40/40",
        verified: true,
        tier: 'professional'
      },
      content: "Just hit $50K in donations this month using NMBR codes on our event t-shirts! The story-driven approach is incredible - donors are 3x more engaged when they can see exactly how their money helps. Pro tip: Add a QR code to your merchandise and watch donations soar! 🚀",
      type: 'success',
      category: 'fundraising',
      tags: ['success-story', 'merchandise', 'donations', 'engagement'],
      likes: 89,
      comments: 23,
      shares: 12,
      views: 456,
      createdAt: '2 hours ago',
      isLiked: false,
      isBookmarked: false,
      featured: true
    },
    {
      id: '2',
      author: {
        name: "Michael Chen",
        organization: "Education First",
        avatar: "/api/placeholder/40/40",
        verified: true,
        tier: 'growth'
      },
      content: "Question: How do you handle international shipping for your NMBR products? We're getting requests from donors in Europe and Asia, but shipping costs are eating into our margins. Any recommendations for global fulfillment partners?",
      type: 'question',
      category: 'products',
      tags: ['shipping', 'international', 'fulfillment', 'help'],
      likes: 34,
      comments: 18,
      shares: 5,
      views: 234,
      createdAt: '4 hours ago',
      isLiked: true,
      isBookmarked: true,
      featured: false
    },
    {
      id: '3',
      author: {
        name: "Maria Rodriguez",
        organization: "Wildlife Conservation",
        avatar: "/api/placeholder/40/40",
        verified: true,
        tier: 'starter'
      },
      content: "Tip: Use the AI Review feature in your newsletters! It helped us improve our donor communication by 40%. The suggestions are spot-on for nonprofit messaging. Our open rates went from 12% to 18% in just one month. 🤖✨",
      type: 'tip',
      category: 'analytics',
      tags: ['ai-review', 'newsletters', 'open-rates', 'tips'],
      likes: 67,
      comments: 15,
      shares: 8,
      views: 312,
      createdAt: '6 hours ago',
      isLiked: false,
      isBookmarked: false,
      featured: false
    },
    {
      id: '4',
      author: {
        name: "David Kim",
        organization: "Tech for Good",
        avatar: "/api/placeholder/40/40",
        verified: false,
        tier: 'free'
      },
      content: "Looking to collaborate with other nonprofits on a joint fundraising campaign. We focus on digital literacy in underserved communities. Anyone interested in partnering? We could create a shared NMBR story and split the proceeds 50/50.",
      type: 'collaboration',
      category: 'general',
      tags: ['collaboration', 'partnership', 'digital-literacy', 'joint-campaign'],
      likes: 23,
      comments: 7,
      shares: 3,
      views: 156,
      createdAt: '1 day ago',
      isLiked: false,
      isBookmarked: false,
      featured: false
    },
    {
      id: '5',
      author: {
        name: "NMBR Team",
        organization: "NMBR Platform",
        avatar: "/api/placeholder/40/40",
        verified: true,
        tier: 'professional'
      },
      content: "🎉 Exciting news! We're launching our new marketplace with 20+ product templates. Now you can create custom merchandise with NMBR codes built-in. No design skills needed - just customize and sell! Check out the marketplace tab. #NewFeature #Marketplace",
      type: 'announcement',
      category: 'products',
      tags: ['announcement', 'marketplace', 'new-feature', 'products'],
      likes: 156,
      comments: 45,
      shares: 23,
      views: 892,
      createdAt: '2 days ago',
      isLiked: true,
      isBookmarked: true,
      featured: true
    }
  ]

  const filteredPosts = communityPosts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'question': return <MessageSquare className="w-4 h-4 text-blue-600" />
      case 'tip': return <Lightbulb className="w-4 h-4 text-yellow-600" />
      case 'collaboration': return <Handshake className="w-4 h-4 text-purple-600" />
      case 'announcement': return <Award className="w-4 h-4 text-orange-600" />
      default: return <MessageSquare className="w-4 h-4 text-gray-600" />
    }
  }

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200'
      case 'question': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'tip': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'collaboration': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'announcement': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-background to-purple-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">NMBR Community</h1>
              <p className="text-muted-foreground mt-2">
                Connect, learn, and grow with other nonprofits using NMBR technology
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button onClick={() => setShowCreatePost(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Community Stats */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{communityStats.totalPosts}</div>
                    <div className="text-xs text-muted-foreground">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{communityStats.activeUsers}</div>
                    <div className="text-xs text-muted-foreground">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{communityStats.totalLikes}</div>
                    <div className="text-xs text-muted-foreground">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{communityStats.successStories}</div>
                    <div className="text-xs text-muted-foreground">Success Stories</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Contributors */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Top Contributors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {communityStats.topContributors.map((contributor, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">{contributor.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{contributor.name}</div>
                      <div className="text-xs text-muted-foreground">{contributor.organization}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{contributor.posts}</div>
                      <div className="text-xs text-muted-foreground">posts</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { id: 'all', name: 'All Posts', count: 1247 },
                  { id: 'fundraising', name: 'Fundraising', count: 456 },
                  { id: 'stories', name: 'Impact Stories', count: 234 },
                  { id: 'products', name: 'Products', count: 189 },
                  { id: 'analytics', name: 'Analytics', count: 156 },
                  { id: 'general', name: 'General', count: 212 }
                ].map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <span className="text-sm">{category.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search posts, tags, or organizations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <Card key={post.id} className={`group hover:shadow-lg transition-shadow ${post.featured ? 'ring-2 ring-primary/20' : ''}`}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Post Header */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">{post.author.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{post.author.name}</span>
                            {post.author.verified && (
                              <Badge variant="secondary" className="text-xs">
                                <Star className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {post.author.tier}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {post.author.organization} • {post.createdAt}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getPostTypeColor(post.type)}`}>
                            {getPostTypeIcon(post.type)}
                            <span className="ml-1 capitalize">{post.type}</span>
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="space-y-3">
                        <p className="text-foreground leading-relaxed">{post.content}</p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`flex items-center gap-2 ${post.isLiked ? 'text-red-600' : ''}`}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <Reply className="w-4 h-4" />
                            {post.comments}
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <Share2 className="w-4 h-4" />
                            {post.shares}
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`${post.isBookmarked ? 'text-yellow-600' : ''}`}
                          >
                            <Bookmark className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Flag className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredPosts.length === 0 && (
              <Card className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}>
                  Clear Filters
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Create Post Dialog */}
      <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>
              Share your success stories, ask questions, or collaborate with other nonprofits
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Post Type</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'success', label: 'Success Story', icon: TrendingUp },
                  { value: 'question', label: 'Question', icon: MessageSquare },
                  { value: 'tip', label: 'Tip', icon: Lightbulb },
                  { value: 'collaboration', label: 'Collaboration', icon: Handshake }
                ].map((type) => (
                  <Button key={type.value} variant="outline" className="h-20 flex-col gap-2">
                    <type.icon className="w-5 h-5" />
                    <span className="text-sm">{type.label}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Content</label>
              <textarea
                className="w-full h-32 p-3 border rounded-lg resize-none"
                placeholder="Share your thoughts, ask questions, or tell your success story..."
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Tags (optional)</label>
              <Input placeholder="Add tags separated by commas" />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowCreatePost(false)}>
                Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
