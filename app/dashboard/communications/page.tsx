"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Mail, 
  MessageSquare, 
  Bell, 
  Globe, 
  Users, 
  BarChart3, 
  Settings,
  Plus,
  Eye,
  MousePointer,
  CheckCircle,
  Clock,
  Send
} from "lucide-react"
import { useOrganization } from "@/contexts/OrganizationContext"
import { useSubscription } from "@/contexts/SubscriptionContext"
import { CommunicationPreferences } from "@/components/ui/communication-preferences"
import { SupporterFeed } from "@/components/ui/supporter-feed"
import { SMSUpdates } from "@/components/ui/sms-updates"
import { PushNotifications } from "@/components/ui/push-notifications"

// Start with empty stats - will populate as users create communications
const communicationStats = {
  email: {
    total: 0,
    sent: 0,
    opened: 0,
    clicked: 0,
    unsubscribed: 0
  },
  sms: {
    total: 0,
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0
  },
  push: {
    total: 0,
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0
  },
  feed: {
    totalViews: 0,
    totalPosts: 0,
    totalEngagement: 0,
    activeUsers: 0
  }
}

export default function CommunicationsPage() {
  const { orgType, terminology } = useOrganization()
  const { canUseFeature } = useSubscription()
  const [activeTab, setActiveTab] = useState("overview")

  const canUseSMS = canUseFeature('sms_updates')
  const canUsePush = canUseFeature('push_notifications')
  const canUseFeed = canUseFeature('supporter_feed')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Multi-Channel Communications</h1>
          <p className="text-muted-foreground">
            Engage your {terminology.subscribers.toLowerCase()} across email, SMS, push notifications, and supporter feed
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="sms" disabled={!canUseSMS}>SMS</TabsTrigger>
          <TabsTrigger value="push" disabled={!canUsePush}>Push</TabsTrigger>
          <TabsTrigger value="feed" disabled={!canUseFeed}>Feed</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Communication Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email Campaigns</p>
                    <p className="text-2xl font-bold">{communicationStats.email.sent}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((communicationStats.email.opened / communicationStats.email.sent) * 100)}% open rate
                    </p>
                  </div>
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">SMS Messages</p>
                    <p className="text-2xl font-bold">{communicationStats.sms.sent}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((communicationStats.sms.delivered / communicationStats.sms.sent) * 100)}% delivery rate
                    </p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Push Notifications</p>
                    <p className="text-2xl font-bold">{communicationStats.push.sent}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((communicationStats.push.opened / communicationStats.push.delivered) * 100)}% open rate
                    </p>
                  </div>
                  <Bell className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Feed Views</p>
                    <p className="text-2xl font-bold">{communicationStats.feed.totalViews}</p>
                    <p className="text-xs text-muted-foreground">
                      {communicationStats.feed.activeUsers} active users
                    </p>
                  </div>
                  <Globe className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Channel Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Channel Performance</CardTitle>
              <CardDescription>Compare engagement across all communication channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    channel: 'Email',
                    icon: Mail,
                    color: 'text-blue-600',
                    stats: {
                      sent: communicationStats.email.sent,
                      opened: communicationStats.email.opened,
                      clicked: communicationStats.email.clicked,
                      rate: Math.round((communicationStats.email.opened / communicationStats.email.sent) * 100)
                    }
                  },
                  {
                    channel: 'SMS',
                    icon: MessageSquare,
                    color: 'text-green-600',
                    stats: {
                      sent: communicationStats.sms.sent,
                      opened: communicationStats.sms.opened,
                      clicked: communicationStats.sms.clicked,
                      rate: Math.round((communicationStats.sms.opened / communicationStats.sms.sent) * 100)
                    }
                  },
                  {
                    channel: 'Push Notifications',
                    icon: Bell,
                    color: 'text-purple-600',
                    stats: {
                      sent: communicationStats.push.sent,
                      opened: communicationStats.push.opened,
                      clicked: communicationStats.push.clicked,
                      rate: Math.round((communicationStats.push.opened / communicationStats.push.delivered) * 100)
                    }
                  },
                  {
                    channel: 'Supporter Feed',
                    icon: Globe,
                    color: 'text-orange-600',
                    stats: {
                      sent: communicationStats.feed.totalPosts,
                      opened: communicationStats.feed.totalViews,
                      clicked: communicationStats.feed.totalEngagement,
                      rate: Math.round((communicationStats.feed.totalEngagement / communicationStats.feed.totalViews) * 100)
                    }
                  }
                ].map(({ channel, icon: Icon, color, stats }) => (
                  <div key={channel} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${color}`} />
                      <div>
                        <h3 className="font-medium">{channel}</h3>
                        <p className="text-sm text-muted-foreground">
                          {stats.sent} sent • {stats.opened} opened • {stats.clicked} clicked
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{stats.rate}%</p>
                      <p className="text-xs text-muted-foreground">engagement rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Communications</CardTitle>
              <CardDescription>Latest messages sent across all channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">No Communications Yet</h3>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
                  When you send newsletters, SMS updates, or post to your supporter feed, they'll appear here. 
                  Start engaging with your {terminology.subscribers.toLowerCase()} across multiple channels.
                </p>

                {/* Quick Start Guide */}
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-xl p-6 mb-8 max-w-4xl mx-auto">
                  <h4 className="text-lg font-semibold text-foreground mb-4">Multi-Channel Communication Strategy</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                      <div>
                        <h5 className="font-medium text-foreground mb-1">Email Newsletters</h5>
                        <p className="text-sm text-muted-foreground">Send detailed updates and impact stories to your donor list.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                      <div>
                        <h5 className="font-medium text-foreground mb-1">SMS Updates</h5>
                        <p className="text-sm text-muted-foreground">Send instant alerts for urgent needs and quick updates.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                      <div>
                        <h5 className="font-medium text-foreground mb-1">Push Notifications</h5>
                        <p className="text-sm text-muted-foreground">Engage donors through mobile app notifications.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                      <div>
                        <h5 className="font-medium text-foreground mb-1">Supporter Feed</h5>
                        <p className="text-sm text-muted-foreground">Create a private community for your most engaged supporters.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
                    onClick={() => window.location.href = '/dashboard/newsletters'}
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Create Newsletter
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-8 py-6"
                    onClick={() => window.location.href = '/dashboard/analytics'}
                  >
                    <BarChart3 className="w-5 h-5 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Communication Features</CardTitle>
              <CardDescription>Available communication channels based on your plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    name: 'Email Campaigns',
                    icon: Mail,
                    available: true,
                    description: 'Send newsletters and updates via email'
                  },
                  {
                    name: 'SMS Updates',
                    icon: MessageSquare,
                    available: canUseSMS,
                    description: 'Send instant text message updates',
                    requiredTier: 'Growth+'
                  },
                  {
                    name: 'Push Notifications',
                    icon: Bell,
                    available: canUsePush,
                    description: 'Send mobile app notifications',
                    requiredTier: 'Professional+'
                  },
                  {
                    name: 'Supporter Feed',
                    icon: Globe,
                    available: canUseFeed,
                    description: 'Private feed for story updates',
                    requiredTier: 'Professional+'
                  }
                ].map((feature) => (
                  <div key={feature.name} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <feature.icon className="w-5 h-5 text-muted-foreground" />
                      <h3 className="font-medium">{feature.name}</h3>
                      {feature.available ? (
                        <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                      ) : (
                        <Badge variant="secondary" className="ml-auto">
                          {feature.requiredTier}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Communications</CardTitle>
              <CardDescription>Manage your email campaigns and newsletters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Email Campaigns</h3>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
                  Use the Newsletter Builder to create and send email campaigns to your {terminology.subscribers.toLowerCase()}. 
                  Track engagement, segment your audience, and build lasting relationships.
                </p>

                {/* Email Benefits */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-8 max-w-4xl mx-auto">
                  <h4 className="text-lg font-semibold text-foreground mb-4">Why Email Marketing Works for Nonprofits</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                      <div>
                        <h5 className="font-medium text-foreground mb-1">High ROI</h5>
                        <p className="text-sm text-muted-foreground">Email marketing returns $42 for every $1 spent.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                      <div>
                        <h5 className="font-medium text-foreground mb-1">Direct Communication</h5>
                        <p className="text-sm text-muted-foreground">Reach donors directly in their inbox.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                      <div>
                        <h5 className="font-medium text-foreground mb-1">Personalization</h5>
                        <p className="text-sm text-muted-foreground">Segment and personalize your messages.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
                    onClick={() => window.location.href = '/dashboard/newsletters'}
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Go to Newsletter Builder
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-8 py-6"
                    onClick={() => window.location.href = '/dashboard/subscribers'}
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Manage Subscribers
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms" className="space-y-6">
          <SMSUpdates />
        </TabsContent>

        <TabsContent value="push" className="space-y-6">
          <PushNotifications />
        </TabsContent>

        <TabsContent value="feed" className="space-y-6">
          <SupporterFeed />
        </TabsContent>
      </Tabs>

      {/* Communication Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriber Preferences</CardTitle>
          <CardDescription>Manage how your {terminology.subscribers.toLowerCase()} receive communications</CardDescription>
        </CardHeader>
        <CardContent>
          <CommunicationPreferences />
        </CardContent>
      </Card>
    </div>
  )
}
