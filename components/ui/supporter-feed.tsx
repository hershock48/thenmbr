"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Image as ImageIcon,
  Video,
  FileText,
  ExternalLink,
  Bookmark,
  BookmarkCheck
} from "lucide-react"
import { useOrganization } from "@/contexts/OrganizationContext"

interface FeedPost {
  id: string
  type: 'story_update' | 'milestone' | 'donation' | 'event' | 'general'
  title: string
  content: string
  author: {
    name: string
    avatar?: string
    role: string
  }
  story?: {
    id: string
    title: string
    nmbr: string
  }
  media?: {
    type: 'image' | 'video' | 'document'
    url: string
    thumbnail?: string
  }
  timestamp: string
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  isBookmarked: boolean
  engagement: {
    views: number
    clicks: number
    donations?: number
  }
}

const mockFeedPosts: FeedPost[] = [
  {
    id: '1',
    type: 'story_update',
    title: 'Maria just passed her final exams! 🎓',
    content: 'We\'re thrilled to share that Maria has successfully completed her nursing program and will be graduating next month. Your support made this possible!',
    author: {
      name: 'Sarah Johnson',
      role: 'Program Director',
      avatar: '/avatars/sarah.jpg'
    },
    story: {
      id: 'story-1',
      title: 'Maria\'s Education Journey',
      nmbr: 'NMBR-001'
    },
    media: {
      type: 'image',
      url: '/images/maria-graduation.jpg',
      thumbnail: '/images/maria-graduation-thumb.jpg'
    },
    timestamp: '2024-01-20T10:30:00Z',
    likes: 24,
    comments: 8,
    shares: 3,
    isLiked: false,
    isBookmarked: false,
    engagement: {
      views: 156,
      clicks: 23,
      donations: 5
    }
  },
  {
    id: '2',
    type: 'milestone',
    title: 'Community Garden Reaches 50% Funding! 🌱',
    content: 'Thanks to your incredible support, we\'ve reached 50% of our funding goal for the community garden project. Every donation brings us closer to providing fresh produce for 200+ families.',
    author: {
      name: 'Green Thumbs Initiative',
      role: 'Organization',
      avatar: '/avatars/green-thumbs.jpg'
    },
    story: {
      id: 'story-2',
      title: 'Community Garden Project',
      nmbr: 'NMBR-002'
    },
    media: {
      type: 'video',
      url: '/videos/garden-progress.mp4',
      thumbnail: '/images/garden-thumb.jpg'
    },
    timestamp: '2024-01-19T14:20:00Z',
    likes: 42,
    comments: 12,
    shares: 7,
    isLiked: true,
    isBookmarked: true,
    engagement: {
      views: 289,
      clicks: 45,
      donations: 12
    }
  },
  {
    id: '3',
    type: 'donation',
    title: 'Anonymous donor contributes $500! 💝',
    content: 'We received a generous $500 donation from an anonymous supporter. This will help us provide emergency food assistance to 25 families this month.',
    author: {
      name: 'Food Bank Team',
      role: 'Staff',
      avatar: '/avatars/food-bank.jpg'
    },
    story: {
      id: 'story-3',
      title: 'Emergency Food Assistance',
      nmbr: 'NMBR-003'
    },
    timestamp: '2024-01-18T16:45:00Z',
    likes: 18,
    comments: 4,
    shares: 2,
    isLiked: false,
    isBookmarked: false,
    engagement: {
      views: 98,
      clicks: 15,
      donations: 1
    }
  },
  {
    id: '4',
    type: 'event',
    title: 'Volunteer Appreciation Day - This Saturday! 🎉',
    content: 'Join us this Saturday from 10 AM to 2 PM for our annual Volunteer Appreciation Day. We\'ll have food, games, and a special ceremony to recognize our amazing volunteers.',
    author: {
      name: 'Community Center',
      role: 'Event Coordinator',
      avatar: '/avatars/community-center.jpg'
    },
    timestamp: '2024-01-17T09:15:00Z',
    likes: 31,
    comments: 9,
    shares: 5,
    isLiked: true,
    isBookmarked: false,
    engagement: {
      views: 203,
      clicks: 34
    }
  }
]

const postTypeIcons = {
  story_update: Heart,
  milestone: Users,
  donation: DollarSign,
  event: Calendar,
  general: MessageCircle
}

const postTypeColors = {
  story_update: 'bg-green-100 text-green-800',
  milestone: 'bg-blue-100 text-blue-800',
  donation: 'bg-purple-100 text-purple-800',
  event: 'bg-orange-100 text-orange-800',
  general: 'bg-gray-100 text-gray-800'
}

interface SupporterFeedProps {
  storyId?: string
  className?: string
}

export function SupporterFeed({ storyId, className }: SupporterFeedProps) {
  const { orgType, terminology } = useOrganization()
  const [posts, setPosts] = useState<FeedPost[]>(mockFeedPosts)
  const [filter, setFilter] = useState<'all' | 'story_update' | 'milestone' | 'donation' | 'event'>('all')

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.type === filter)

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ))
  }

  const handleBookmark = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ))
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'story_update': return 'Story Update'
      case 'milestone': return 'Milestone'
      case 'donation': return 'Donation'
      case 'event': return 'Event'
      default: return 'Update'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Supporter Feed</h2>
          <p className="text-muted-foreground">
            Stay connected with the latest updates from {orgType === 'nonprofit' ? 'our impact stories' : 'our brand stories'}
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share Feed
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-muted rounded-lg p-1">
        {[
          { key: 'all', label: 'All Updates' },
          { key: 'story_update', label: 'Story Updates' },
          { key: 'milestone', label: 'Milestones' },
          { key: 'donation', label: 'Donations' },
          { key: 'event', label: 'Events' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
              filter === key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Feed Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const TypeIcon = postTypeIcons[post.type]
          const typeColor = postTypeColors[post.type]

          return (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>
                        {post.author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{post.author.name}</h3>
                        <Badge className={typeColor}>
                          <TypeIcon className="w-3 h-3 mr-1" />
                          {getPostTypeLabel(post.type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {post.author.role} • {formatTimestamp(post.timestamp)}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                  <p className="text-muted-foreground">{post.content}</p>
                </div>

                {/* Story Link */}
                {post.story && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-primary" />
                      <span className="font-medium">{post.story.title}</span>
                      <Badge variant="outline" className="ml-auto">
                        {post.story.nmbr}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Media */}
                {post.media && (
                  <div className="relative">
                    {post.media.type === 'image' ? (
                      <img 
                        src={post.media.url} 
                        alt="Post media"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    ) : post.media.type === 'video' ? (
                      <div className="relative w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                        <Video className="w-12 h-12 text-muted-foreground" />
                        <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                          <Button size="sm" className="bg-white/90 text-black hover:bg-white">
                            Play Video
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 border rounded-lg flex items-center gap-3">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Document</p>
                          <p className="text-sm text-muted-foreground">Click to view</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Engagement Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>{post.engagement.views} views</span>
                    <span>{post.engagement.clicks} clicks</span>
                    {post.engagement.donations && (
                      <span>{post.engagement.donations} donations</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={post.isLiked ? 'text-red-600' : ''}
                    >
                      <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4 mr-1" />
                      {post.shares}
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBookmark(post.id)}
                    className={post.isBookmarked ? 'text-blue-600' : ''}
                  >
                    {post.isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">
          Load More Updates
        </Button>
      </div>
    </div>
  )
}
