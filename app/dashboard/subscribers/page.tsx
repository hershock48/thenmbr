"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, Filter, Mail, Download, Users, TrendingUp, Calendar, Send, Eye, UserX } from "lucide-react"

export default function SubscribersPage() {
  const [selectedSegment, setSelectedSegment] = useState("all")
  const [isComposeOpen, setIsComposeOpen] = useState(false)

  // Mock data - would come from database
  const subscriberStats = {
    total: 1247,
    active: 1189,
    thisMonth: 156,
    growthRate: 12.5,
  }

  const segments = [
    { id: "all", name: "All Subscribers", count: 1247 },
    { id: "water", name: "Water Projects", count: 423 },
    { id: "education", name: "Education", count: 356 },
    { id: "healthcare", name: "Healthcare", count: 289 },
    { id: "recent", name: "Recent (30 days)", count: 156 },
    { id: "inactive", name: "Inactive", count: 58 },
  ]

  const subscribers = [
    {
      id: 1,
      email: "sarah.johnson@email.com",
      name: "Sarah Johnson",
      nmbrs: ["W001", "E003"],
      subscribedAt: "2024-01-15T10:30:00Z",
      lastActivity: "2024-01-20T14:22:00Z",
      status: "active",
      location: "New York, NY",
    },
    {
      id: 2,
      email: "mike.chen@email.com",
      name: "Mike Chen",
      nmbrs: ["W001", "H002", "E001"],
      subscribedAt: "2024-01-12T09:15:00Z",
      lastActivity: "2024-01-19T11:45:00Z",
      status: "active",
      location: "San Francisco, CA",
    },
    {
      id: 3,
      email: "emma.davis@email.com",
      name: "Emma Davis",
      nmbrs: ["E003"],
      subscribedAt: "2024-01-10T16:20:00Z",
      lastActivity: "2024-01-18T09:30:00Z",
      status: "active",
      location: "Austin, TX",
    },
    {
      id: 4,
      email: "alex.wilson@email.com",
      name: "Alex Wilson",
      nmbrs: ["W001"],
      subscribedAt: "2024-01-08T14:45:00Z",
      lastActivity: "2024-01-10T16:20:00Z",
      status: "inactive",
      location: "Seattle, WA",
    },
  ]

  const recentActivity = [
    { type: "subscription", email: "new.subscriber@email.com", nmbr: "W001", time: "2 hours ago" },
    { type: "update_sent", count: 423, segment: "Water Projects", time: "1 day ago" },
    { type: "unsubscribe", email: "former.subscriber@email.com", time: "2 days ago" },
    { type: "subscription", email: "another.new@email.com", nmbr: "E003", time: "3 days ago" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Subscriber Management</h1>
          <p className="text-muted-foreground">Manage your NMBR subscribers and send targeted updates</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
            <DialogTrigger asChild>
              <Button>
                <Mail className="h-4 w-4 mr-2" />
                Compose Update
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Send Subscriber Update</DialogTitle>
                <DialogDescription>Send a targeted update to your subscribers about NMBR progress</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="segment">Target Segment</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subscriber segment" />
                    </SelectTrigger>
                    <SelectContent>
                      {segments.map((segment) => (
                        <SelectItem key={segment.id} value={segment.id}>
                          {segment.name} ({segment.count} subscribers)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input id="subject" placeholder="Your impact update from Hope Foundation" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Share updates about your NMBR projects, impact stories, and progress..."
                    rows={6}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                    Cancel
                  </Button>
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Send Update
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriberStats.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{subscriberStats.active} active subscribers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriberStats.thisMonth}</div>
            <p className="text-xs text-green-600">+{subscriberStats.growthRate}% growth rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular NMBR</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">W001</div>
            <p className="text-xs text-muted-foreground">423 subscribers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">Average open rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="subscribers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search subscribers..." className="pl-10" />
                </div>
                <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {segments.map((segment) => (
                      <SelectItem key={segment.id} value={segment.id}>
                        {segment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Subscribers List */}
          <div className="space-y-4">
            {subscribers.map((subscriber) => (
              <Card key={subscriber.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-semibold">{subscriber.name}</h3>
                          <p className="text-sm text-muted-foreground">{subscriber.email}</p>
                        </div>
                        <Badge variant={subscriber.status === "active" ? "default" : "secondary"}>
                          {subscriber.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span>{subscriber.location}</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Joined {new Date(subscriber.subscribedAt).toLocaleDateString()}
                        </div>
                        <span>Last active {new Date(subscriber.lastActivity).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Subscribed NMBRs:</span>
                        <div className="flex gap-1">
                          {subscriber.nmbrs.map((nmbr) => (
                            <Badge key={nmbr} variant="outline" className="text-xs">
                              {nmbr}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Mail className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View Profile
                      </Button>
                      <Button size="sm" variant="outline">
                        <UserX className="h-3 w-3 mr-1" />
                        Unsubscribe
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {segments.map((segment) => (
              <Card key={segment.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{segment.name}</CardTitle>
                  <CardDescription>{segment.count} subscribers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Engagement Rate</span>
                      <span className="font-medium">
                        {segment.id === "water" ? "72%" : segment.id === "education" ? "65%" : "68%"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Growth (30d)</span>
                      <span className="font-medium text-green-600">
                        +{segment.id === "recent" ? "100%" : Math.floor(Math.random() * 20 + 5)}%
                      </span>
                    </div>
                    <Button size="sm" className="w-full">
                      <Mail className="h-3 w-3 mr-1" />
                      Send Update
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest subscriber actions and campaign updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {activity.type === "subscription" && <Users className="h-4 w-4 text-green-600" />}
                    {activity.type === "update_sent" && <Mail className="h-4 w-4 text-blue-600" />}
                    {activity.type === "unsubscribe" && <UserX className="h-4 w-4 text-red-600" />}
                    <div className="flex-1">
                      {activity.type === "subscription" && (
                        <p className="text-sm">
                          <span className="font-medium">{activity.email}</span> subscribed to NMBR{" "}
                          <Badge variant="outline" className="text-xs">
                            {activity.nmbr}
                          </Badge>
                        </p>
                      )}
                      {activity.type === "update_sent" && (
                        <p className="text-sm">
                          Update sent to <span className="font-medium">{activity.count} subscribers</span> in{" "}
                          {activity.segment}
                        </p>
                      )}
                      {activity.type === "unsubscribe" && (
                        <p className="text-sm">
                          <span className="font-medium">{activity.email}</span> unsubscribed from all updates
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
