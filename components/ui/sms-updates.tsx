"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Users, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Smartphone,
  Hash,
  DollarSign,
  Calendar
} from "lucide-react"
import { useOrganization } from "@/contexts/OrganizationContext"
import { useSubscription } from "@/contexts/SubscriptionContext"

interface SMSUpdate {
  id: string
  content: string
  recipients: {
    total: number
    optedIn: number
  }
  scheduledFor?: string
  status: 'draft' | 'scheduled' | 'sent' | 'failed'
  createdAt: string
  sentAt?: string
  engagement: {
    delivered: number
    opened: number
    clicked: number
  }
}

interface SMSUpdatesProps {
  storyId?: string
  className?: string
}

const mockSMSUpdates: SMSUpdate[] = [
  {
    id: '1',
    content: '🎉 Maria just passed her final exams! Read her full story: [link]',
    recipients: { total: 150, optedIn: 89 },
    status: 'sent',
    createdAt: '2024-01-20T10:30:00Z',
    sentAt: '2024-01-20T10:35:00Z',
    engagement: { delivered: 87, opened: 72, clicked: 34 }
  },
  {
    id: '2',
    content: '🚨 URGENT: Community garden needs $500 more to reach our goal! Donate now: [link]',
    recipients: { total: 200, optedIn: 120 },
    status: 'scheduled',
    scheduledFor: '2024-01-21T14:00:00Z',
    createdAt: '2024-01-20T09:15:00Z',
    engagement: { delivered: 0, opened: 0, clicked: 0 }
  },
  {
    id: '3',
    content: '📅 Volunteer Appreciation Day is tomorrow! Join us 10 AM - 2 PM at Community Center',
    recipients: { total: 80, optedIn: 45 },
    status: 'sent',
    createdAt: '2024-01-19T16:20:00Z',
    sentAt: '2024-01-19T16:25:00Z',
    engagement: { delivered: 44, opened: 38, clicked: 12 }
  }
]

export function SMSUpdates({ storyId, className }: SMSUpdatesProps) {
  const { orgType, terminology } = useOrganization()
  const { canUseFeature } = useSubscription()
  const [updates, setUpdates] = useState<SMSUpdate[]>(mockSMSUpdates)
  const [isComposing, setIsComposing] = useState(false)
  const [newUpdate, setNewUpdate] = useState({
    content: '',
    recipients: 'all' as 'all' | 'story' | 'custom',
    scheduledFor: '',
    isUrgent: false
  })
  const [isSending, setIsSending] = useState(false)

  const canSendSMS = canUseFeature('sms_updates')

  const handleSendUpdate = async () => {
    if (!canSendSMS) return

    setIsSending(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const update: SMSUpdate = {
        id: Date.now().toString(),
        content: newUpdate.content,
        recipients: {
          total: 150, // Mock data
          optedIn: 89
        },
        status: newUpdate.scheduledFor ? 'scheduled' : 'sent',
        scheduledFor: newUpdate.scheduledFor || undefined,
        createdAt: new Date().toISOString(),
        sentAt: newUpdate.scheduledFor ? undefined : new Date().toISOString(),
        engagement: {
          delivered: 0,
          opened: 0,
          clicked: 0
        }
      }

      setUpdates([update, ...updates])
      setNewUpdate({ content: '', recipients: 'all', scheduledFor: '', isUrgent: false })
      setIsComposing(false)
    } catch (error) {
      console.error('Failed to send SMS update:', error)
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

  if (!canSendSMS) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <Smartphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">SMS Updates Not Available</h3>
          <p className="text-muted-foreground mb-4">
            SMS updates are available on Growth tier and above. Upgrade to send instant text message updates to your supporters.
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
          <h2 className="text-2xl font-bold">SMS Updates</h2>
          <p className="text-muted-foreground">
            Send instant text message updates to your {terminology.subscribers.toLowerCase()}
          </p>
        </div>
        <Button onClick={() => setIsComposing(true)}>
          <MessageSquare className="w-4 h-4 mr-2" />
          Compose SMS
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Recipients</p>
                <p className="text-2xl font-bold">150</p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Opted In</p>
                <p className="text-2xl font-bold">89</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Rate</p>
                <p className="text-2xl font-bold">81%</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compose SMS */}
      {isComposing && (
        <Card>
          <CardHeader>
            <CardTitle>Compose SMS Update</CardTitle>
            <CardDescription>
              Send a text message to your opted-in {terminology.subscribers.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="sms-content">Message Content</Label>
              <Textarea
                id="sms-content"
                placeholder="Enter your SMS message here..."
                value={newUpdate.content}
                onChange={(e) => setNewUpdate({ ...newUpdate, content: e.target.value })}
                className="min-h-[100px]"
                maxLength={160}
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-muted-foreground">
                  {newUpdate.content.length}/160 characters
                </p>
                <div className="flex items-center gap-2">
                  <Switch
                    id="urgent"
                    checked={newUpdate.isUrgent}
                    onCheckedChange={(checked) => setNewUpdate({ ...newUpdate, isUrgent: checked })}
                  />
                  <Label htmlFor="urgent" className="text-sm">Urgent</Label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recipients">Recipients</Label>
                <Select
                  value={newUpdate.recipients}
                  onValueChange={(value: any) => setNewUpdate({ ...newUpdate, recipients: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Opted-in Subscribers (89)</SelectItem>
                    <SelectItem value="story">This Story's Subscribers (23)</SelectItem>
                    <SelectItem value="custom">Custom List</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="schedule">Schedule</Label>
                <Select
                  value={newUpdate.scheduledFor ? 'scheduled' : 'now'}
                  onValueChange={(value) => setNewUpdate({ 
                    ...newUpdate, 
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

            {newUpdate.scheduledFor && (
              <div>
                <Label htmlFor="scheduled-time">Scheduled Time</Label>
                <Input
                  id="scheduled-time"
                  type="datetime-local"
                  value={newUpdate.scheduledFor}
                  onChange={(e) => setNewUpdate({ ...newUpdate, scheduledFor: e.target.value })}
                />
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsComposing(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSendUpdate}
                disabled={!newUpdate.content || isSending}
              >
                {isSending ? 'Sending...' : 'Send SMS'}
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SMS History */}
      <Card>
        <CardHeader>
          <CardTitle>SMS History</CardTitle>
          <CardDescription>Recent SMS updates sent to your {terminology.subscribers.toLowerCase()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {updates.map((update) => (
              <div key={update.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-medium mb-1">{update.content}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{update.recipients.optedIn} recipients</span>
                      <span>•</span>
                      <span>{formatTimestamp(update.createdAt)}</span>
                      {update.scheduledFor && (
                        <>
                          <span>•</span>
                          <span>Scheduled for {formatTimestamp(update.scheduledFor)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusColor(update.status)}>
                    {update.status}
                  </Badge>
                </div>

                {update.status === 'sent' && (
                  <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{update.engagement.delivered}</p>
                      <p className="text-xs text-muted-foreground">Delivered</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{update.engagement.opened}</p>
                      <p className="text-xs text-muted-foreground">Opened</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{update.engagement.clicked}</p>
                      <p className="text-xs text-muted-foreground">Clicked</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SMS Guidelines */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">SMS Best Practices</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Keep messages under 160 characters for best delivery</li>
                <li>• Use urgent messages sparingly for maximum impact</li>
                <li>• Include clear call-to-action with links</li>
                <li>• Respect opt-out requests immediately</li>
                <li>• Test messages before sending to large groups</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
