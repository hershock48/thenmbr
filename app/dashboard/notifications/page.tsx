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

const getMockNotifications = (orgType: string): Notification[] => [
  {
    id: "1",
    type: orgType === "business" ? "donation" : "donation",
    title: orgType === "business" ? "New Purchase Made" : "New Donation Received",
    message: orgType === "business" 
      ? "Sarah Johnson purchased your Coffee Blend #3 for $25"
      : "Sarah Johnson donated $50 to your Clean Water Project story",
    timestamp: "2 minutes ago",
    read: false,
    priority: "high",
  },
  {
    id: "2",
    type: "story",
    title: "Story Performance Update",
    message: orgType === "business"
      ? 'Your "Artisan Coffee Journey" story reached 1,000 views this week'
      : 'Your "Education for All" story reached 1,000 views this week',
    timestamp: "1 hour ago",
    read: false,
    priority: "medium",
  },
  {
    id: "3",
    type: "analytics",
    title: "Weekly Analytics Report",
    message: orgType === "business"
      ? "Your stories generated $2,450 in sales this week (+15%)"
      : "Your stories generated $2,450 in donations this week (+15%)",
    timestamp: "3 hours ago",
    read: true,
    priority: "medium",
  },
  {
    id: "4",
    type: "system",
    title: "NMBR Searched",
    message: orgType === "business"
      ? "25 people searched your NMBR at the farmers market"
      : "25 people searched your NMBR at the community event",
    timestamp: "1 day ago",
    read: true,
    priority: "low",
  },
]

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
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications yet</p>
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
                          <h4 className="font-medium text-foreground">{notification.title}</h4>
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
              {notifications
                .filter((n) => n.type === "story")
                .map((notification) => (
                  <div key={notification.id} className="p-4 border rounded-lg">
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                ))}
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
              {notifications
                .filter((n) => n.type === "donation")
                .map((notification) => (
                  <div key={notification.id} className="p-4 border rounded-lg">
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                ))}
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
              {notifications
                .filter((n) => n.type === "analytics")
                .map((notification) => (
                  <div key={notification.id} className="p-4 border rounded-lg">
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                ))}
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
                <h4 className="font-medium text-foreground">Delivery Methods</h4>
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
                <h4 className="font-medium text-foreground">Notification Types</h4>
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
