"use client"

import { useState } from "react"
import { Bell, Check, X, Settings, Mail, MessageSquare, TrendingUp, Users, AlertCircle } from "lucide-react"
import { useOrganization } from "@/contexts/OrganizationContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

interface Notification {
  id: string
  type: "story" | "donation" | "purchase" | "analytics" | "system"
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: "low" | "medium" | "high"
}

// Start with empty notifications - will populate as users create stories and receive donations
const getMockNotifications = (orgType: string): Notification[] => []

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "donation":
      return <TrendingUp className="h-4 w-4 text-primary" />
    case "story":
      return <MessageSquare className="h-4 w-4 text-secondary" />
    case "analytics":
      return <Users className="h-4 w-4 text-accent" />
    case "system":
      return <AlertCircle className="h-4 w-4 text-muted-foreground" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-destructive text-destructive-foreground"
    case "medium":
      return "bg-secondary text-secondary-foreground"
    case "low":
      return "bg-muted text-muted-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export default function NotificationsPage() {
  const { orgType } = useOrganization()
  const [notifications, setNotifications] = useState(getMockNotifications(orgType || 'business'))
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    storyUpdates: true,
    donationAlerts: true,
    analyticsReports: false,
    systemUpdates: true,
  })

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your story performance and platform activity</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-primary text-primary-foreground">
            {unreadCount} unread
          </Badge>
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <Check className="h-4 w-4 mr-2" />
            Mark all read
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="story">Stories</TabsTrigger>
          <TabsTrigger value="donation">Donations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Notifications
              </CardTitle>
              <CardDescription>Your latest updates and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bell className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    No Notifications Yet
                  </h3>
                  <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
                    You'll receive notifications when donors engage with your {terminology.stories.toLowerCase()}, 
                    make donations, or when there are important updates about your {terminology.fundraising.toLowerCase()}.
                  </p>

                  {/* Quick Start Guide */}
                  <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-xl p-6 mb-8 max-w-4xl mx-auto">
                    <h4 className="text-lg font-semibold text-foreground mb-4">What You'll Be Notified About</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                        <div>
                          <h5 className="font-medium text-foreground mb-1">New Donations</h5>
                          <p className="text-sm text-muted-foreground">Instant alerts when someone donates to your stories.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                        <div>
                          <h5 className="font-medium text-foreground mb-1">Story Engagement</h5>
                          <p className="text-sm text-muted-foreground">Updates on views, shares, and donor interactions.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                        <div>
                          <h5 className="font-medium text-foreground mb-1">Milestone Alerts</h5>
                          <p className="text-sm text-muted-foreground">Celebrate when you reach funding goals and targets.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                        <div>
                          <h5 className="font-medium text-foreground mb-1">Analytics Reports</h5>
                          <p className="text-sm text-muted-foreground">Weekly summaries of your fundraising performance.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      size="lg" 
                      className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
                      onClick={() => window.location.href = '/dashboard/nmbrs'}
                    >
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Create Your First Story
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="text-lg px-8 py-6"
                      onClick={() => window.location.href = '/dashboard/widget'}
                    >
                      <Settings className="w-5 h-5 mr-2" />
                      Set Up Widget
                    </Button>
                  </div>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                      notification.read ? "bg-card" : "bg-accent/10 border-accent/20"
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium text-foreground">{notification.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                          <div className="flex gap-1">
                            {!notification.read && (
                              <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="story" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Story Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.filter((n) => n.type === "story").length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="font-medium text-foreground mb-2">No Story Notifications</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You'll receive updates when your {terminology.stories.toLowerCase()} get views, shares, or engagement.
                  </p>
                  <Button variant="outline" onClick={() => window.location.href = '/dashboard/nmbrs'}>
                    Create Your First Story
                  </Button>
                </div>
              ) : (
                notifications
                  .filter((n) => n.type === "story")
                  .map((notification) => (
                    <div key={notification.id} className="p-4 border rounded-lg">
                      <h3 className="font-medium">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                  ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Donation Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.filter((n) => n.type === "donation").length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="font-medium text-foreground mb-2">No Donation Notifications</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You'll receive instant alerts when donors contribute to your {terminology.stories.toLowerCase()}.
                  </p>
                  <Button variant="outline" onClick={() => window.location.href = '/dashboard/widget'}>
                    Set Up Donation Widget
                  </Button>
                </div>
              ) : (
                notifications
                  .filter((n) => n.type === "donation")
                  .map((notification) => (
                    <div key={notification.id} className="p-4 border rounded-lg">
                      <h3 className="font-medium">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                  ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Analytics Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.filter((n) => n.type === "analytics").length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="font-medium text-foreground mb-2">No Analytics Notifications</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You'll receive weekly reports and milestone alerts about your {terminology.fundraising.toLowerCase()} performance.
                  </p>
                  <Button variant="outline" onClick={() => window.location.href = '/dashboard/analytics'}>
                    View Analytics Dashboard
                  </Button>
                </div>
              ) : (
                notifications
                  .filter((n) => n.type === "analytics")
                  .map((notification) => (
                    <div key={notification.id} className="p-4 border rounded-lg">
                      <h3 className="font-medium">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                  ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Customize how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-foreground">Delivery Methods</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) =>
                        setPreferences((prev) => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.pushNotifications}
                      onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, pushNotifications: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-foreground">Notification Types</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Story Updates</p>
                      <p className="text-sm text-muted-foreground">Performance updates and engagement metrics</p>
                    </div>
                    <Switch
                      checked={preferences.storyUpdates}
                      onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, storyUpdates: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Donation Alerts</p>
                      <p className="text-sm text-muted-foreground">New donations and funding milestones</p>
                    </div>
                    <Switch
                      checked={preferences.donationAlerts}
                      onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, donationAlerts: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Analytics Reports</p>
                      <p className="text-sm text-muted-foreground">Weekly and monthly performance summaries</p>
                    </div>
                    <Switch
                      checked={preferences.analyticsReports}
                      onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, analyticsReports: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">System Updates</p>
                      <p className="text-sm text-muted-foreground">Platform updates and maintenance notices</p>
                    </div>
                    <Switch
                      checked={preferences.systemUpdates}
                      onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, systemUpdates: checked }))}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
