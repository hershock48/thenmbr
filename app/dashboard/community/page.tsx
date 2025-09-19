'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Sparkles,
  Settings,
  Download,
  RefreshCw
} from 'lucide-react'
import { useOrganization } from '@/contexts/OrganizationContext'
import { CommunityDashboard } from '@/components/dashboard/community-dashboard'

export default function CommunityPage() {
  const { terminology, orgType } = useOrganization()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading community dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Hub</h1>
          <p className="text-muted-foreground">
            Build and engage your {terminology.fundraising.toLowerCase()} community
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Community Settings
          </Button>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Members
          </Button>
        </div>
      </div>

      {/* Community Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 ml-1">+12.5% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Referrers</p>
                <p className="text-2xl font-bold">89</p>
              </div>
              <UserPlus className="w-8 h-8 text-green-600" />
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
                <p className="text-sm text-muted-foreground">Total Referrals</p>
                <p className="text-2xl font-bold">2,156</p>
              </div>
              <Share2 className="w-8 h-8 text-purple-600" />
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
                <p className="text-sm text-muted-foreground">Community Engagement</p>
                <p className="text-2xl font-bold">94%</p>
              </div>
              <Heart className="w-8 h-8 text-red-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 ml-1">+2.1% this month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Community Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Sarah Johnson', referrals: 25, level: 'platinum', avatar: 'SJ' },
                { name: 'Mike Chen', referrals: 18, level: 'gold', avatar: 'MC' },
                { name: 'Emily Davis', referrals: 12, level: 'silver', avatar: 'ED' },
                { name: 'Alex Rodriguez', referrals: 8, level: 'bronze', avatar: 'AR' },
                { name: 'Lisa Wang', referrals: 6, level: 'bronze', avatar: 'LW' }
              ].map((member, index) => (
                <div key={member.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-600">{member.avatar}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.referrals} referrals</p>
                    </div>
                  </div>
                  <Badge className={
                    member.level === 'platinum' ? 'bg-purple-100 text-purple-800' :
                    member.level === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                    member.level === 'silver' ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                  }>
                    {member.level}
                  </Badge>
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
              {[
                { action: 'New referral', user: 'Sarah Johnson', time: '2 hours ago', type: 'referral' },
                { action: 'Reached milestone', user: 'Mike Chen', time: '4 hours ago', type: 'milestone' },
                { action: 'Shared story', user: 'Emily Davis', time: '6 hours ago', type: 'story' },
                { action: 'New member joined', user: 'Alex Rodriguez', time: '8 hours ago', type: 'join' },
                { action: 'Earned reward', user: 'Lisa Wang', time: '12 hours ago', type: 'reward' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'referral' ? 'bg-green-100' :
                    activity.type === 'milestone' ? 'bg-purple-100' :
                    activity.type === 'story' ? 'bg-blue-100' :
                    activity.type === 'join' ? 'bg-yellow-100' :
                    'bg-orange-100'
                  }`}>
                    {activity.type === 'referral' ? <UserPlus className="w-4 h-4 text-green-600" /> :
                     activity.type === 'milestone' ? <Trophy className="w-4 h-4 text-purple-600" /> :
                     activity.type === 'story' ? <MessageCircle className="w-4 h-4 text-blue-600" /> :
                     activity.type === 'join' ? <Users className="w-4 h-4 text-yellow-600" /> :
                     <Gift className="w-4 h-4 text-orange-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Community Dashboard Component */}
      <CommunityDashboard organizationId="org-1" />
    </div>
  )
}
