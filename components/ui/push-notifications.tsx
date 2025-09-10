"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  Bell, 
  Smartphone, 
  Send, 
  Users, 
  Eye, 
  MousePointer,
  Calendar,
  Hash,
  DollarSign,
  Heart,
  Settings,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react"
import { useOrganization } from "@/contexts/OrganizationContext"
import { useSubscription } from "@/contexts/SubscriptionContext"

interface PushNotification {
  id: string
  title: string
  body: string
  type: 'story_update' | 'donation' | 'event' | 'general' | 'urgent'
  recipients: {
    total: number
    subscribed: number
  }
  scheduledFor?: string
  status: 'draft' | 'scheduled' | 'sent' | 'failed'
  createdAt: string
  sentAt?: string
  engagement: {
    sent: number
    delivered: number
    opened: number
    clicked: number
  }
  actionUrl?: string
  imageUrl?: string
}

interface PushNotificationsProps {
  storyId?: string
  className?: string
}

const mockPushNotifications: PushNotification[] = [
  {
    id: '1',
    title: 'Maria\'s Story Update',
    body: 'Maria just passed her final exams! Read her full story and see photos.',
    type: 'story_update',
    recipients: { total: 250, subscribed: 180 },
    status: 'sent',
    createdAt: '2024-01-20T10:30:00Z',
    sentAt: '2024-01-20T10:35:00Z',
    engagement: { sent: 180, delivered: 175, opened: 142, clicked: 67 },
    actionUrl: '/story/maria-education',
    imageUrl: '/images/maria-graduation.jpg'
  },
  {
    id: '2',
    title: 'Community Garden Milestone',
    body: 'We\'ve reached 50% of our funding goal! Help us get to 100%.',
    type: 'donation',
    recipients: { total: 300, subscribed: 220 },
    status: 'scheduled',
    scheduledFor: '2024-01-21T14:00:00Z',
    createdAt: '2024-01-20T09:15:00Z',
    engagement: { sent: 0, delivered: 0, opened: 0, clicked: 0 },
    actionUrl: '/story/community-garden'
  },
  {
    id: '3',
    title: 'Volunteer Event Tomorrow',
    body: 'Join us for Volunteer Appreciation Day at the Community Center.',
    type: 'event',
    recipients: { total: 120, subscribed: 85 },
    status: 'sent',
    createdAt: '2024-01-19T16:20:00Z',
    sentAt: '2024-01-19T16:25:00Z',
    engagement: { sent: 85, delivered: 82, opened: 58, clicked: 23 },
    actionUrl: '/events/volunteer-appreciation'
  }
]

const notificationTypeIcons = {
  story_update: Hash,
  donation: DollarSign,
  event: Calendar,
  general: Bell,
  urgent: AlertCircle
}

const notificationTypeColors = {
  story_update: 'bg-green-100 text-green-800',
  donation: 'bg-purple-100 text-purple-800',
  event: 'bg-orange-100 text-orange-800',
  general: 'bg-blue-100 text-blue-800',
  urgent: 'bg-red-100 text-red-800'
}

export function PushNotifications({ storyId, className }: PushNotificationsProps) {
  const { orgType, terminology } = useOrganization()
  const { canUseFeature } = useSubscription()
  const [notifications, setNotifications] = useState<PushNotification[]>(mockPushNotifications)
  const [isComposing, setIsComposing] = useState(false)
  const [newNotification, setNewNotification] = useState({
    title: '',
    body: '',
    type: 'general' as PushNotification['type'],
    recipients: 'all' as 'all' | 'story' | 'custom',
    scheduledFor: '',
    actionUrl: '',
    imageUrl: '',
    isUrgent: false
  })
  const [isSending, setIsSending] = useState(false)
  const [permissionStatus, setPermissionStatus] = useState<'default' | 'granted' | 'denied'>('default')

  const canSendPush = canUseFeature('push_notifications')

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setPermissionStatus(permission)
    }
  }

  const handleSendNotification = async () => {
    if (!canSendPush || permissionStatus !== 'granted') return

    setIsSending(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const notification: PushNotification = {
        id: Date.now().toString(),
        title: newNotification.title,
        body: newNotification.body,
        type: newNotification.type,
        recipients: {
          total: 250, // Mock data
          subscribed: 180
        },
        status: newNotification.scheduledFor ? 'scheduled' : 'sent',
        scheduledFor: newNotification.scheduledFor || undefined,
        createdAt: new Date().toISOString(),
        sentAt: newNotification.scheduledFor ? undefined : new Date().toISOString(),
        engagement: {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0
        },
        actionUrl: newNotification.actionUrl,
        imageUrl: newNotification.imageUrl
      }

      setNotifications([notification, ...notifications])
      setNewNotification({
        title: '',
        body: '',
        type: 'general',
        recipients: 'all',
        scheduledFor: '',
        actionUrl: '',
        imageUrl: '',
        isUrgent: false
      })
      setIsComposing(false)
    } catch (error) {
      console.error('Failed to send push notification:', error)
    } finally {
      setIsSending(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  if (!canSendPush) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Push Notifications Not Available</h3>
          <p className="text-muted-foreground mb-4">
            Push notifications are available on Professional tier and above. Upgrade to send mobile notifications to your supporters.
          </p>
          <Button>Upgrade Plan</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Push Notifications</h2>
          <p className="text-muted-foreground">
            Send mobile notifications to your {terminology.subscribers.toLowerCase()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {permissionStatus === 'default' && (
            <Button variant="outline" onClick={requestPermission}>
              <Bell className="w-4 h-4 mr-2" />
              Enable Notifications
            </Button>
          )}
          <Button onClick={() => setIsComposing(true)} disabled={permissionStatus !== 'granted'}>
            <Bell className="w-4 h-4 mr-2" />
            Send Notification
          </Button>
        </div>
      </div>

      {/* Permission Status */}
      {permissionStatus !== 'granted' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-900">Notification Permission Required</h3>
                <p className="text-sm text-yellow-800 mt-1">
                  {permissionStatus === 'default' 
                    ? 'Click "Enable Notifications" to allow push notifications in your browser.'
                    : 'Push notifications are blocked. Please enable them in your browser settings to send notifications.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Subscribers</p>
                <p className="text-2xl font-bold">250</p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notification Enabled</p>
                <p className="text-2xl font-bold">180</p>
              </div>
              <Bell className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Rate</p>
                <p className="text-2xl font-bold">79%</p>
              </div>
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Click Rate</p>
                <p className="text-2xl font-bold">37%</p>
              </div>
              <MousePointer className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compose Notification */}
      {isComposing && (
        <Card>
          <CardHeader>
            <CardTitle>Compose Push Notification</CardTitle>
            <CardDescription>
              Send a mobile notification to your subscribed {terminology.subscribers.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="notification-title">Title</Label>
                <Input
                  id="notification-title"
                  placeholder="Enter notification title..."
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  maxLength={50}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {newNotification.title.length}/50 characters
                </p>
              </div>
              <div>
                <Label htmlFor="notification-type">Type</Label>
                <Select
                  value={newNotification.type}
                  onValueChange={(value: any) => setNewNotification({ ...newNotification, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="story_update">Story Update</SelectItem>
                    <SelectItem value="donation">Donation</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="notification-body">Message</Label>
              <Textarea
                id="notification-body"
                placeholder="Enter notification message..."
                value={newNotification.body}
                onChange={(e) => setNewNotification({ ...newNotification, body: e.target.value })}
                className="min-h-[80px]"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {newNotification.body.length}/200 characters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="action-url">Action URL (Optional)</Label>
                <Input
                  id="action-url"
                  placeholder="https://example.com/action"
                  value={newNotification.actionUrl}
                  onChange={(e) => setNewNotification({ ...newNotification, actionUrl: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="image-url">Image URL (Optional)</Label>
                <Input
                  id="image-url"
                  placeholder="https://example.com/image.jpg"
                  value={newNotification.imageUrl}
                  onChange={(e) => setNewNotification({ ...newNotification, imageUrl: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recipients">Recipients</Label>
                <Select
                  value={newNotification.recipients}
                  onValueChange={(value: any) => setNewNotification({ ...newNotification, recipients: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subscribers (180)</SelectItem>
                    <SelectItem value="story">This Story's Subscribers (45)</SelectItem>
                    <SelectItem value="custom">Custom Segment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="schedule">Schedule</Label>
                <Select
                  value={newNotification.scheduledFor ? 'scheduled' : 'now'}
                  onValueChange={(value) => setNewNotification({ 
                    ...newNotification, 
                    scheduledFor: value === 'now' ? '' : new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Send Now</SelectItem>
                    <SelectItem value="scheduled">Schedule for Later</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {newNotification.scheduledFor && (
              <div>
                <Label htmlFor="scheduled-time">Scheduled Time</Label>
                <Input
                  id="scheduled-time"
                  type="datetime-local"
                  value={newNotification.scheduledFor}
                  onChange={(e) => setNewNotification({ ...newNotification, scheduledFor: e.target.value })}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="urgent"
                  checked={newNotification.isUrgent}
                  onCheckedChange={(checked) => setNewNotification({ ...newNotification, isUrgent: checked })}
                />
                <Label htmlFor="urgent">Urgent Notification</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsComposing(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSendNotification}
                disabled={!newNotification.title || !newNotification.body || isSending}
              >
                {isSending ? 'Sending...' : 'Send Notification'}
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notification History */}
      <Card>
        <CardHeader>
          <CardTitle>Notification History</CardTitle>
          <CardDescription>Recent push notifications sent to your {terminology.subscribers.toLowerCase()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => {
              const TypeIcon = notificationTypeIcons[notification.type]
              const typeColor = notificationTypeColors[notification.type]

              return (
                <div key={notification.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{notification.title}</h3>
                        <Badge className={typeColor}>
                          <TypeIcon className="w-3 h-3 mr-1" />
                          {notification.type.replace('_', ' ')}
                        </Badge>
                        {notification.isUrgent && (
                          <Badge variant="destructive">Urgent</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.body}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{notification.recipients.subscribed} recipients</span>
                        <span>•</span>
                        <span>{formatTimestamp(notification.createdAt)}</span>
                        {notification.scheduledFor && (
                          <>
                            <span>•</span>
                            <span>Scheduled for {formatTimestamp(notification.scheduledFor)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(notification.status)}>
                      {notification.status}
                    </Badge>
                  </div>

                  {notification.status === 'sent' && (
                    <div className="grid grid-cols-4 gap-4 pt-3 border-t">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{notification.engagement.sent}</p>
                        <p className="text-xs text-muted-foreground">Sent</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{notification.engagement.delivered}</p>
                        <p className="text-xs text-muted-foreground">Delivered</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{notification.engagement.opened}</p>
                        <p className="text-xs text-muted-foreground">Opened</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">{notification.engagement.clicked}</p>
                        <p className="text-xs text-muted-foreground">Clicked</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-medium text-green-900">Push Notification Best Practices</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Keep titles under 50 characters and messages under 200 characters</li>
                <li>• Use urgent notifications sparingly for maximum impact</li>
                <li>• Include clear call-to-action in the message</li>
                <li>• Test notifications on different devices before sending</li>
                <li>• Respect user preferences and provide easy opt-out</li>
                <li>• Use images and action URLs to increase engagement</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
