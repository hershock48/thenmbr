'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Users, 
  Trophy, 
  Gift, 
  Share2, 
  Copy, 
  ExternalLink,
  TrendingUp,
  Award,
  Star,
  Target,
  Calendar,
  DollarSign,
  UserPlus,
  MessageCircle,
  Heart,
  ThumbsUp,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Crown,
  Medal,
  Shield,
  Sparkles
} from 'lucide-react'
import { referralSystem, ReferralCode, ReferralStats, ReferralUsage } from '@/lib/referral-system'

interface CommunityDashboardProps {
  organizationId: string
}

interface CommunityMember {
  id: string
  name: string
  email: string
  avatar?: string
  joinDate: Date
  totalReferrals: number
  totalRewards: number
  level: 'bronze' | 'silver' | 'gold' | 'platinum'
  badges: string[]
  isActive: boolean
}

interface CommunityPost {
  id: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  type: 'story' | 'achievement' | 'milestone' | 'tip'
  likes: number
  comments: number
  createdAt: Date
  isPinned: boolean
}

export function CommunityDashboard({ organizationId }: CommunityDashboardProps) {
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null)
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([])
  const [referralUsages, setReferralUsages] = useState<ReferralUsage[]>([])
  const [communityMembers, setCommunityMembers] = useState<CommunityMember[]>([])
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showCreateReferral, setShowCreateReferral] = useState(false)

  useEffect(() => {
    loadCommunityData()
  }, [organizationId])

  const loadCommunityData = async () => {
    try {
      setLoading(true)
      
      // Load referral data
      const [stats, codes, usages] = await Promise.all([
        referralSystem.getReferralStats(organizationId),
        referralSystem.getReferralCodes(organizationId),
        referralSystem.getReferralUsages(organizationId, 20)
      ])

      setReferralStats(stats)
      setReferralCodes(codes)
      setReferralUsages(usages)

      // Load mock community data
      setCommunityMembers(loadMockMembers())
      setCommunityPosts(loadMockPosts())

    } catch (error) {
      console.error('Failed to load community data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMockMembers = (): CommunityMember[] => [
    {
      id: 'member-1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      joinDate: new Date('2024-01-15'),
      totalReferrals: 25,
      totalRewards: 150.00,
      level: 'platinum',
      badges: ['Top Referrer', 'Early Supporter', 'Community Champion'],
      isActive: true
    },
    {
      id: 'member-2',
      name: 'Mike Chen',
      email: 'mike@example.com',
      joinDate: new Date('2024-02-20'),
      totalReferrals: 18,
      totalRewards: 95.00,
      level: 'gold',
      badges: ['Active Supporter', 'Referral Master'],
      isActive: true
    },
    {
      id: 'member-3',
      name: 'Emily Davis',
      email: 'emily@example.com',
      joinDate: new Date('2024-03-10'),
      totalReferrals: 12,
      totalRewards: 60.00,
      level: 'silver',
      badges: ['New Champion'],
      isActive: true
    }
  ]

  const loadMockPosts = (): CommunityPost[] => [
    {
      id: 'post-1',
      authorId: 'member-1',
      authorName: 'Sarah Johnson',
      content: 'Just reached 25 referrals! Thank you to everyone who joined our cause. Together we\'re making a real difference! 🎉',
      type: 'milestone',
      likes: 24,
      comments: 8,
      createdAt: new Date('2024-01-20'),
      isPinned: true
    },
    {
      id: 'post-2',
      authorId: 'member-2',
      authorName: 'Mike Chen',
      content: 'Pro tip: Share your referral link on social media with a personal story about why this cause matters to you. It makes a huge difference!',
      type: 'tip',
      likes: 18,
      comments: 5,
      createdAt: new Date('2024-01-19'),
      isPinned: false
    },
    {
      id: 'post-3',
      authorId: 'member-3',
      authorName: 'Emily Davis',
      content: 'Excited to be part of this amazing community! Every referral brings us closer to our goal. Let\'s keep the momentum going! 💪',
      type: 'story',
      likes: 15,
      comments: 3,
      createdAt: new Date('2024-01-18'),
      isPinned: false
    }
  ]

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'platinum': return <Crown className="w-4 h-4 text-purple-600" />
      case 'gold': return <Trophy className="w-4 h-4 text-yellow-600" />
      case 'silver': return <Medal className="w-4 h-4 text-gray-600" />
      case 'bronze': return <Award className="w-4 h-4 text-orange-600" />
      default: return <Star className="w-4 h-4 text-blue-600" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'platinum': return 'bg-purple-100 text-purple-800'
      case 'gold': return 'bg-yellow-100 text-yellow-800'
      case 'silver': return 'bg-gray-100 text-gray-800'
      case 'bronze': return 'bg-orange-100 text-orange-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const copyReferralCode = (code: string) => {
    navigator.clipboard.writeText(code)
    // TODO: Show toast notification
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading community data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Community Dashboard</h2>
          <p className="text-muted-foreground">Build and engage your supporter community</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share Community
          </Button>
          <Button onClick={() => setShowCreateReferral(true)}>
            <Gift className="w-4 h-4 mr-2" />
            Create Referral Code
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Referrals</p>
                <p className="text-2xl font-bold">{referralStats?.totalReferrals || 0}</p>
              </div>
              <UserPlus className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 ml-1">+12.5% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Members</p>
                <p className="text-2xl font-bold">{communityMembers.length}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 ml-1">+8.3% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Rewards</p>
                <p className="text-2xl font-bold">{formatCurrency(referralStats?.totalRewardsEarned || 0)}</p>
              </div>
              <Gift className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 ml-1">+15.2% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{referralStats?.conversionRate.toFixed(1) || 0}%</p>
              </div>
              <Target className="w-8 h-8 text-orange-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 ml-1">+2.1% this month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Top Referrers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {referralStats?.topReferrers.slice(0, 5).map((referrer, index) => (
                    <div key={referrer.userId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{referrer.userName}</h3>
                          <p className="text-sm text-muted-foreground">{referrer.referralCount} referrals</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(referrer.totalRewards)}</p>
                        <p className="text-sm text-muted-foreground">rewards earned</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {referralUsages.slice(0, 5).map((usage) => (
                    <div key={usage.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <UserPlus className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {usage.referredUserEmail} joined via referral
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {usage.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={usage.status === 'completed' ? 'default' : 'secondary'}>
                        {usage.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Referral Codes</h3>
            <Button onClick={() => setShowCreateReferral(true)}>
              <Gift className="w-4 h-4 mr-2" />
              Create New Code
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {referralCodes.map((code) => (
              <Card key={code.id} className="group hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{code.code}</CardTitle>
                    <Badge variant={code.isActive ? 'default' : 'secondary'}>
                      {code.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{code.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span>Uses: {code.currentUses}</span>
                      <span>Max: {code.maxUses || '∞'}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Reward:</span>
                      <span className="text-sm">
                        {code.rewardType === 'percentage' ? `${code.rewardValue}%` : 
                         code.rewardType === 'fixed' ? formatCurrency(code.rewardValue) : 
                         'Product'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Expires:</span>
                      <span className="text-sm">
                        {code.expiresAt ? code.expiresAt.toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => copyReferralCode(code.code)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Community Members</h3>
            <Button variant="outline">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Members
            </Button>
          </div>

          <div className="space-y-4">
            {communityMembers.map((member) => (
              <Card key={member.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getLevelIcon(member.level)}
                          <Badge className={getLevelColor(member.level)}>
                            {member.level}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{member.totalReferrals} referrals</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(member.totalRewards)} earned
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Joined {member.joinDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {member.badges.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex flex-wrap gap-2">
                        {member.badges.map((badge, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Award className="w-3 h-3 mr-1" />
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Community Feed</h3>
            <Button>
              <MessageCircle className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>

          <div className="space-y-4">
            {communityPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {post.authorName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">{post.authorName}</h4>
                        <Badge variant="outline" className="text-xs">
                          {post.type}
                        </Badge>
                        {post.isPinned && (
                          <Badge variant="default" className="text-xs">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Pinned
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{post.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </div>
                        <span>{post.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Referral Code Dialog */}
      <Dialog open={showCreateReferral} onOpenChange={setShowCreateReferral}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Referral Code</DialogTitle>
            <DialogDescription>
              Create a new referral code to encourage supporters to invite others
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="code">Referral Code</Label>
              <Input id="code" placeholder="e.g., WELCOME20" />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="e.g., Welcome discount for new supporters" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reward-type">Reward Type</Label>
                <select id="reward-type" className="w-full p-2 border rounded">
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                  <option value="product">Product</option>
                </select>
              </div>
              <div>
                <Label htmlFor="reward-value">Reward Value</Label>
                <Input id="reward-value" type="number" placeholder="20" />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateReferral(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowCreateReferral(false)}>
                Create Code
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
