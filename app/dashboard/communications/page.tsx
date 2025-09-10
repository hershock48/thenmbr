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
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No communications yet</h3>
                <p className="text-muted-foreground mb-4">
                  When you send newsletters, SMS updates, or post to your supporter feed, they'll appear here.
                </p>
                <div className="space-y-2">
                  <Button asChild>
                    <a href="/dashboard/newsletters">Create Newsletter</a>
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Start by creating your first newsletter to engage with donors
                  </p>
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
              <div className="text-center py-8">
                <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Email Campaigns</h3>
                <p className="text-muted-foreground mb-4">
                  Use the Newsletter Builder to create and send email campaigns to your {terminology.subscribers.toLowerCase()}.
                </p>
                <Button asChild>
                  <a href="/dashboard/newsletters">Go to Newsletter Builder</a>
                </Button>
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
