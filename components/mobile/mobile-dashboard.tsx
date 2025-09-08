"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users,
  Heart,
  DollarSign,
  TrendingUp,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Share2,
  Sparkles,
  Target,
  Gift,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Star,
  Building2,
  ShoppingCart,
  Bell,
  Settings,
  Menu,
  SwipeUp,
  SwipeDown,
  SwipeLeft,
  SwipeRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Story {
  id: string
  nmbr_code: string
  title: string
  description: string
  photo_url?: string
  goal_amount?: number
  current_amount?: number
  status: string
  created_at: string
  supporters: number
  progress: number
}

interface Stats {
  totalStories: number
  totalSubscribers: number
  totalRaised: number
  activeStories: number
}

interface MobileDashboardProps {
  stories: Story[]
  stats: Stats
  onStorySelect?: (story: Story) => void
  onAddStory?: () => void
}

export function MobileDashboard({ stories, stats, onStorySelect, onAddStory }: MobileDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  // Swipe gesture handling
  const handleSwipe = (direction: string) => {
    setSwipeDirection(direction)
    setTimeout(() => setSwipeDirection(null), 300)
    
    // Handle swipe actions
    switch (direction) {
      case 'up':
        setActiveTab("stories")
        break
      case 'down':
        setActiveTab("overview")
        break
      case 'left':
        setActiveTab("analytics")
        break
      case 'right':
        setActiveTab("settings")
        break
    }
  }

  const StatCard = ({ title, value, change, icon: Icon, color, subtitle }: {
    title: string
    value: string | number
    change?: number
    icon: any
    color: string
    subtitle?: string
  }) => (
    <Card className="touch-manipulation">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            {change !== undefined && (
              <div className="flex items-center mt-1">
                <TrendingUp className={cn("w-3 h-3 mr-1", change > 0 ? "text-green-500" : "text-red-500")} />
                <span className={cn("text-xs font-medium", change > 0 ? "text-green-600" : "text-red-600")}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
              </div>
            )}
          </div>
          <div className={cn("p-3 rounded-xl", color)}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              className="p-2"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">Your impact stories</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 relative"
            >
              <Bell className="w-5 h-5" />
              {showNotifications && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("settings")}
              className="p-2"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Swipe Indicators */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 flex gap-2">
        <div className={cn("w-2 h-2 rounded-full transition-colors", activeTab === "overview" ? "bg-blue-500" : "bg-gray-300")} />
        <div className={cn("w-2 h-2 rounded-full transition-colors", activeTab === "stories" ? "bg-blue-500" : "bg-gray-300")} />
        <div className={cn("w-2 h-2 rounded-full transition-colors", activeTab === "analytics" ? "bg-blue-500" : "bg-gray-300")} />
        <div className={cn("w-2 h-2 rounded-full transition-colors", activeTab === "settings" ? "bg-blue-500" : "bg-gray-300")} />
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                title="Total Stories"
                value={stats.totalStories}
                change={12}
                icon={Heart}
                color="bg-red-500"
                subtitle="Active campaigns"
              />
              <StatCard
                title="Subscribers"
                value={stats.totalSubscribers}
                change={8}
                icon={Users}
                color="bg-blue-500"
                subtitle="Story followers"
              />
              <StatCard
                title="Raised"
                value={`$${stats.totalRaised.toLocaleString()}`}
                change={15}
                icon={DollarSign}
                color="bg-green-500"
                subtitle="This month"
              />
              <StatCard
                title="Active"
                value={stats.activeStories}
                icon={Target}
                color="bg-purple-500"
                subtitle="Running now"
              />
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={onAddStory}
                  className="w-full h-12 text-lg font-semibold"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Story
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-12">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Widget
                  </Button>
                  <Button variant="outline" className="h-12">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Stories Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Stories</CardTitle>
                <CardDescription>Your latest impact campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stories.slice(0, 3).map((story) => (
                    <div
                      key={story.id}
                      onClick={() => onStorySelect?.(story)}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer touch-manipulation"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {story.nmbr_code}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{story.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={story.progress} className="flex-1 h-2" />
                          <span className="text-sm text-gray-600">{story.progress}%</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("stories")}
                  className="w-full mt-4"
                >
                  View All Stories
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stories" className="space-y-6">
            {/* Stories Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Your Stories</h2>
              <Button onClick={onAddStory} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Story
              </Button>
            </div>

            {/* Stories List */}
            <div className="space-y-4">
              {stories.map((story) => (
                <Card
                  key={story.id}
                  onClick={() => onStorySelect?.(story)}
                  className="cursor-pointer touch-manipulation hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {story.nmbr_code}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 truncate">{story.title}</h3>
                          <Badge variant={story.status === 'active' ? 'default' : 'secondary'}>
                            {story.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{story.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-semibold">{story.progress}%</span>
                          </div>
                          <Progress value={story.progress} className="h-2" />
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>${story.current_amount?.toLocaleString() || '0'} raised</span>
                            <span>${story.goal_amount?.toLocaleString() || '0'} goal</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {story.supporters}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              View
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
            
            {/* Analytics Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Open Rate</p>
                      <p className="text-2xl font-bold">24.8%</p>
                    </div>
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Click Rate</p>
                      <p className="text-2xl font-bold">3.2%</p>
                    </div>
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Donations</p>
                      <p className="text-2xl font-bold">1.8%</p>
                    </div>
                    <Gift className="w-6 h-6 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Engagement</p>
                      <p className="text-2xl font-bold">7.2/10</p>
                    </div>
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Settings</h2>
            
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Notifications</h3>
                      <p className="text-sm text-gray-600">Manage your alerts</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Account</h3>
                      <p className="text-sm text-gray-600">Profile and preferences</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Help & Support</h3>
                      <p className="text-sm text-gray-600">Get help and contact us</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Swipe Gesture Overlay */}
      <div
        className="fixed inset-0 z-30 pointer-events-none"
        onTouchStart={(e) => {
          const touch = e.touches[0]
          const startX = touch.clientX
          const startY = touch.clientY
          
          const handleTouchEnd = (e: TouchEvent) => {
            const touch = e.changedTouches[0]
            const endX = touch.clientX
            const endY = touch.clientY
            const diffX = endX - startX
            const diffY = endY - startY
            const threshold = 50
            
            if (Math.abs(diffX) > Math.abs(diffY)) {
              if (diffX > threshold) {
                handleSwipe('right')
              } else if (diffX < -threshold) {
                handleSwipe('left')
              }
            } else {
              if (diffY > threshold) {
                handleSwipe('down')
              } else if (diffY < -threshold) {
                handleSwipe('up')
              }
            }
            
            document.removeEventListener('touchend', handleTouchEnd)
          }
          
          document.addEventListener('touchend', handleTouchEnd)
        }}
      />

      {/* Swipe Animation */}
      {swipeDirection && (
        <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
          <div className={cn(
            "w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl animate-pulse",
            swipeDirection === 'up' && "transform -translate-y-8",
            swipeDirection === 'down' && "transform translate-y-8",
            swipeDirection === 'left' && "transform -translate-x-8",
            swipeDirection === 'right' && "transform translate-x-8"
          )}>
            {swipeDirection === 'up' && <SwipeUp className="w-8 h-8" />}
            {swipeDirection === 'down' && <SwipeDown className="w-8 h-8" />}
            {swipeDirection === 'left' && <SwipeLeft className="w-8 h-8" />}
            {swipeDirection === 'right' && <SwipeRight className="w-8 h-8" />}
          </div>
        </div>
      )}
    </div>
  )
}

