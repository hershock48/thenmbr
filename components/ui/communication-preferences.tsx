"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Mail, 
  MessageSquare, 
  Bell, 
  Smartphone, 
  Globe, 
  Settings,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react"

interface CommunicationPreferences {
  email: {
    enabled: boolean
    frequency: 'immediate' | 'daily' | 'weekly' | 'monthly'
    types: {
      storyUpdates: boolean
      newsletters: boolean
      donations: boolean
      events: boolean
    }
  }
  sms: {
    enabled: boolean
    phoneNumber: string
    frequency: 'immediate' | 'daily' | 'weekly'
    types: {
      storyUpdates: boolean
      urgentUpdates: boolean
      milestones: boolean
    }
  }
  push: {
    enabled: boolean
    types: {
      storyUpdates: boolean
      donations: boolean
      events: boolean
      general: boolean
    }
  }
  feed: {
    enabled: boolean
    privacy: 'public' | 'subscribers' | 'private'
    notifications: boolean
  }
}

const defaultPreferences: CommunicationPreferences = {
  email: {
    enabled: true,
    frequency: 'weekly',
    types: {
      storyUpdates: true,
      newsletters: true,
      donations: true,
      events: false
    }
  },
  sms: {
    enabled: false,
    phoneNumber: '',
    frequency: 'immediate',
    types: {
      storyUpdates: true,
      urgentUpdates: true,
      milestones: true
    }
  },
  push: {
    enabled: true,
    types: {
      storyUpdates: true,
      donations: true,
      events: true,
      general: false
    }
  },
  feed: {
    enabled: true,
    privacy: 'subscribers',
    notifications: true
  }
}

interface CommunicationPreferencesProps {
  subscriberId?: string
  onSave?: (preferences: CommunicationPreferences) => void
  className?: string
}

export function CommunicationPreferences({ 
  subscriberId, 
  onSave, 
  className 
}: CommunicationPreferencesProps) {
  const [preferences, setPreferences] = useState<CommunicationPreferences>(defaultPreferences)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (onSave) {
        onSave(preferences)
      }
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Failed to save preferences:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const updatePreference = (path: string, value: any) => {
    setPreferences(prev => {
      const newPrefs = { ...prev }
      const keys = path.split('.')
      let current = newPrefs
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i] as keyof typeof current] as any
      }
      
      current[keys[keys.length - 1] as keyof typeof current] = value
      return newPrefs
    })
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Communication Preferences</h2>
          <p className="text-muted-foreground">
            Choose how you'd like to stay connected with our stories
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : saved ? 'Saved!' : 'Save Preferences'}
        </Button>
      </div>

      {/* Email Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <CardTitle>Email Updates</CardTitle>
            </div>
            <Switch
              checked={preferences.email.enabled}
              onCheckedChange={(checked) => updatePreference('email.enabled', checked)}
            />
          </div>
          <CardDescription>
            Receive updates via email about stories, donations, and events
          </CardDescription>
        </CardHeader>
        {preferences.email.enabled && (
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email-frequency">Update Frequency</Label>
              <Select
                value={preferences.email.frequency}
                onValueChange={(value: any) => updatePreference('email.frequency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Summary</SelectItem>
                  <SelectItem value="monthly">Monthly Newsletter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label>What would you like to receive?</Label>
              <div className="space-y-2">
                {Object.entries(preferences.email.types).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={`email-${key}`} className="capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </Label>
                    <Switch
                      id={`email-${key}`}
                      checked={value}
                      onCheckedChange={(checked) => updatePreference(`email.types.${key}`, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* SMS Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <CardTitle>SMS Updates</CardTitle>
              <Badge variant="secondary">Premium</Badge>
            </div>
            <Switch
              checked={preferences.sms.enabled}
              onCheckedChange={(checked) => updatePreference('sms.enabled', checked)}
            />
          </div>
          <CardDescription>
            Get instant updates via text message for urgent story updates
          </CardDescription>
        </CardHeader>
        {preferences.sms.enabled && (
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="phone-number">Phone Number</Label>
              <Input
                id="phone-number"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={preferences.sms.phoneNumber}
                onChange={(e) => updatePreference('sms.phoneNumber', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                We'll send you a verification code to confirm your number
              </p>
            </div>
            
            <div>
              <Label htmlFor="sms-frequency">Update Frequency</Label>
              <Select
                value={preferences.sms.frequency}
                onValueChange={(value: any) => updatePreference('sms.frequency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label>What would you like to receive via SMS?</Label>
              <div className="space-y-2">
                {Object.entries(preferences.sms.types).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={`sms-${key}`} className="capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </Label>
                    <Switch
                      id={`sms-${key}`}
                      checked={value}
                      onCheckedChange={(checked) => updatePreference(`sms.types.${key}`, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-600" />
              <CardTitle>Push Notifications</CardTitle>
            </div>
            <Switch
              checked={preferences.push.enabled}
              onCheckedChange={(checked) => updatePreference('push.enabled', checked)}
            />
          </div>
          <CardDescription>
            Receive notifications on your mobile device when you have the app installed
          </CardDescription>
        </CardHeader>
        {preferences.push.enabled && (
          <CardContent>
            <div className="space-y-3">
              <Label>Notification Types</Label>
              <div className="space-y-2">
                {Object.entries(preferences.push.types).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={`push-${key}`} className="capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </Label>
                    <Switch
                      id={`push-${key}`}
                      checked={value}
                      onCheckedChange={(checked) => updatePreference(`push.types.${key}`, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Supporter Feed */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-orange-600" />
              <CardTitle>Supporter Feed</CardTitle>
            </div>
            <Switch
              checked={preferences.feed.enabled}
              onCheckedChange={(checked) => updatePreference('feed.enabled', checked)}
            />
          </div>
          <CardDescription>
            Access a private feed of story updates and community content
          </CardDescription>
        </CardHeader>
        {preferences.feed.enabled && (
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="feed-privacy">Feed Privacy</Label>
              <Select
                value={preferences.feed.privacy}
                onValueChange={(value: any) => updatePreference('feed.privacy', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Anyone can see</SelectItem>
                  <SelectItem value="subscribers">Subscribers Only</SelectItem>
                  <SelectItem value="private">Private - Just me</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="feed-notifications">Feed Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when new content is added to your feed
                </p>
              </div>
              <Switch
                id="feed-notifications"
                checked={preferences.feed.notifications}
                onCheckedChange={(checked) => updatePreference('feed.notifications', checked)}
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-medium text-blue-900">Why Multiple Channels?</h4>
              <p className="text-sm text-blue-800">
                We use multiple communication channels to ensure you never miss important updates about the stories you care about. 
                You can customize each channel to match your preferences and communication style.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
