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
  Share2,
  DollarSign,
  Gift,
  Copy,
  ExternalLink,
  TrendingUp,
  Award,
  Target,
  Calendar,
  Mail,
  MessageSquare,
  Download,
  Settings,
  Eye,
  CheckCircle,
  Clock,
  Star,
  Zap,
  Heart,
  BarChart3,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  QrCode,
  Link as LinkIcon,
  Send,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal
} from "lucide-react"
import { useOrganization } from "@/contexts/OrganizationContext"

interface ReferralProgram {
  id: string
  name: string
  description: string
  reward: {
    type: 'percentage' | 'fixed' | 'credits'
    value: number
    description: string
  }
  status: 'active' | 'paused' | 'draft'
  createdAt: string
  totalReferrals: number
  successfulReferrals: number
  totalRewards: number
  conversionRate: number
}

interface Referral {
  id: string
  referrer: {
    name: string
    email: string
    organization: string
  }
  referred: {
    name: string
    email: string
    organization: string
  }
  status: 'pending' | 'completed' | 'expired'
  reward: number
  createdAt: string
  completedAt?: string
  source: 'email' | 'social' | 'direct' | 'qr'
}

interface AffiliatePartner {
  id: string
  name: string
  organization: string
  email: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  totalReferrals: number
  successfulReferrals: number
  totalEarnings: number
  commissionRate: number
  status: 'active' | 'inactive' | 'pending'
  joinedAt: string
  lastActivity: string
}

export default function ReferralsPage() {
  const { terminology } = useOrganization()
  const [showCreateProgram, setShowCreateProgram] = useState(false)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState<ReferralProgram | null>(null)

  // Mock data
  const referralPrograms: ReferralProgram[] = [
    {
      id: '1',
      name: 'Nonprofit Referral Program',
      description: 'Refer other nonprofits and earn 20% commission on their first year',
      reward: {
        type: 'percentage',
        value: 20,
        description: '20% of first year revenue'
      },
      status: 'active',
      createdAt: '2024-01-15',
      totalReferrals: 45,
      successfulReferrals: 12,
      totalRewards: 2340,
      conversionRate: 26.7
    },
    {
      id: '2',
      name: 'Donor Referral Program',
      description: 'Refer donors and earn $10 credit for each successful referral',
      reward: {
        type: 'fixed',
        value: 10,
        description: '$10 credit per referral'
      },
      status: 'active',
      createdAt: '2024-02-01',
      totalReferrals: 89,
      successfulReferrals: 34,
      totalRewards: 340,
      conversionRate: 38.2
    },
    {
      id: '3',
      name: 'Partner Program',
      description: 'Refer business partners and earn 15% commission',
      reward: {
        type: 'percentage',
        value: 15,
        description: '15% of first year revenue'
      },
      status: 'paused',
      createdAt: '2024-01-20',
      totalReferrals: 23,
      successfulReferrals: 8,
      totalRewards: 1200,
      conversionRate: 34.8
    }
  ]

  const recentReferrals: Referral[] = [
    {
      id: '1',
      referrer: {
        name: 'Sarah Johnson',
        email: 'sarah@cleanwater.org',
        organization: 'Clean Water Initiative'
      },
      referred: {
        name: 'Michael Chen',
        email: 'michael@educationfirst.org',
        organization: 'Education First'
      },
      status: 'completed',
      reward: 240,
      createdAt: '2024-03-15',
      completedAt: '2024-03-20',
      source: 'email'
    },
    {
      id: '2',
      referrer: {
        name: 'Maria Rodriguez',
        email: 'maria@wildlife.org',
        organization: 'Wildlife Conservation'
      },
      referred: {
        name: 'David Kim',
        email: 'david@techforgood.org',
        organization: 'Tech for Good'
      },
      status: 'pending',
      reward: 180,
      createdAt: '2024-03-18',
      source: 'social'
    },
    {
      id: '3',
      referrer: {
        name: 'John Smith',
        email: 'john@hungerrelief.org',
        organization: 'Hunger Relief'
      },
      referred: {
        name: 'Lisa Wang',
        email: 'lisa@childrenshelter.org',
        organization: 'Children Shelter'
      },
      status: 'completed',
      reward: 120,
      createdAt: '2024-03-12',
      completedAt: '2024-03-16',
      source: 'direct'
    }
  ]

  const affiliatePartners: AffiliatePartner[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      organization: 'Clean Water Initiative',
      email: 'sarah@cleanwater.org',
      tier: 'platinum',
      totalReferrals: 23,
      successfulReferrals: 12,
      totalEarnings: 2340,
      commissionRate: 20,
      status: 'active',
      joinedAt: '2024-01-15',
      lastActivity: '2024-03-15'
    },
    {
      id: '2',
      name: 'Michael Chen',
      organization: 'Education First',
      email: 'michael@educationfirst.org',
      tier: 'gold',
      totalReferrals: 18,
      successfulReferrals: 8,
      totalEarnings: 1200,
      commissionRate: 15,
      status: 'active',
      joinedAt: '2024-02-01',
      lastActivity: '2024-03-10'
    },
    {
      id: '3',
      name: 'Maria Rodriguez',
      organization: 'Wildlife Conservation',
      email: 'maria@wildlife.org',
      tier: 'silver',
      totalReferrals: 12,
      successfulReferrals: 5,
      totalEarnings: 680,
      commissionRate: 12,
      status: 'active',
      joinedAt: '2024-02-15',
      lastActivity: '2024-03-08'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'paused': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'bronze': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'email': return <Mail className="w-4 h-4" />
      case 'social': return <Share2 className="w-4 h-4" />
      case 'direct': return <LinkIcon className="w-4 h-4" />
      case 'qr': return <QrCode className="w-4 h-4" />
      default: return <LinkIcon className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Referrals & Affiliates</h1>
          <p className="text-muted-foreground">
            Grow your {terminology.fundraising.toLowerCase()} through referrals and partnerships
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowInviteDialog(true)}>
            <Send className="w-4 h-4 mr-2" />
            Invite Partners
          </Button>
          <Button onClick={() => setShowCreateProgram(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Program
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">156</div>
                <div className="text-sm text-muted-foreground">Total Referrals</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">54</div>
                <div className="text-sm text-muted-foreground">Successful</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">$3,880</div>
                <div className="text-sm text-muted-foreground">Total Rewards</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">34.6%</div>
                <div className="text-sm text-muted-foreground">Conversion Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="programs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="referrals">Recent Referrals</TabsTrigger>
          <TabsTrigger value="affiliates">Affiliate Partners</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Programs Tab */}
        <TabsContent value="programs" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {referralPrograms.map((program) => (
              <Card key={program.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{program.name}</CardTitle>
                    <Badge className={getStatusColor(program.status)}>
                      {program.status}
                    </Badge>
                  </div>
                  <CardDescription>{program.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Reward:</span>
                      <span className="font-semibold">{program.reward.description}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Referrals:</span>
                      <span className="font-semibold">{program.totalReferrals}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Successful:</span>
                      <span className="font-semibold">{program.successfulReferrals}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Conversion Rate:</span>
                      <span className="font-semibold">{program.conversionRate}%</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Recent Referrals Tab */}
        <TabsContent value="referrals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Referrals</CardTitle>
              <CardDescription>Latest referral activity and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReferrals.map((referral) => (
                  <div key={referral.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      {getSourceIcon(referral.source)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{referral.referrer.name}</span>
                        <span className="text-sm text-muted-foreground">→</span>
                        <span className="font-semibold">{referral.referred.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {referral.referrer.organization} → {referral.referred.organization}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Reward: ${referral.reward}</span>
                        <span>Created: {referral.createdAt}</span>
                        {referral.completedAt && (
                          <span>Completed: {referral.completedAt}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(referral.status)}>
                        {referral.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Affiliate Partners Tab */}
        <TabsContent value="affiliates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Affiliate Partners</CardTitle>
              <CardDescription>Manage your affiliate network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {affiliatePartners.map((partner) => (
                  <div key={partner.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold">{partner.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{partner.name}</span>
                        <Badge className={getTierColor(partner.tier)}>
                          {partner.tier}
                        </Badge>
                        <Badge className={getStatusColor(partner.status)}>
                          {partner.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {partner.organization} • {partner.email}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Referrals:</span>
                          <span className="font-semibold ml-1">{partner.totalReferrals}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Successful:</span>
                          <span className="font-semibold ml-1">{partner.successfulReferrals}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Earnings:</span>
                          <span className="font-semibold ml-1">${partner.totalEarnings}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Rate:</span>
                          <span className="font-semibold ml-1">{partner.commissionRate}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Mail className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Referral Sources</CardTitle>
                <CardDescription>Where your referrals come from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Email</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">45%</div>
                      <div className="text-xs text-muted-foreground">70 referrals</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Social Media</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">30%</div>
                      <div className="text-xs text-muted-foreground">47 referrals</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">Direct Link</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">20%</div>
                      <div className="text-xs text-muted-foreground">31 referrals</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-orange-600" />
                      <span className="text-sm">QR Code</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">5%</div>
                      <div className="text-xs text-muted-foreground">8 referrals</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>Referral performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Chart visualization would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Program Dialog */}
      <Dialog open={showCreateProgram} onOpenChange={setShowCreateProgram}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Referral Program</DialogTitle>
            <DialogDescription>
              Set up a new referral program to grow your network
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Program Name</label>
              <Input placeholder="e.g., Nonprofit Referral Program" />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <textarea
                className="w-full h-20 p-3 border rounded-lg resize-none"
                placeholder="Describe your referral program..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Reward Type</label>
                <select className="w-full p-3 border rounded-lg">
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                  <option value="credits">Credits</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Reward Value</label>
                <Input placeholder="e.g., 20" />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateProgram(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowCreateProgram(false)}>
                Create Program
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invite Affiliate Partners</DialogTitle>
            <DialogDescription>
              Send invitations to potential affiliate partners
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Email Addresses</label>
              <textarea
                className="w-full h-20 p-3 border rounded-lg resize-none"
                placeholder="Enter email addresses separated by commas..."
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Message</label>
              <textarea
                className="w-full h-32 p-3 border rounded-lg resize-none"
                placeholder="Write a personalized message..."
                defaultValue="Hi! I'd like to invite you to join our affiliate program. You can earn commissions by referring other nonprofits to NMBR. Let me know if you're interested!"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowInviteDialog(false)}>
                <Send className="w-4 h-4 mr-2" />
                Send Invitations
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
