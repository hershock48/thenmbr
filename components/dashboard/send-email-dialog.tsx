'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, Mail, Users, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Story {
  id: string
  title: string
  nmbr_code: string
  current_amount: number
  goal_amount: number
  subscribers_count: number
}

interface SendEmailDialogProps {
  stories: Story[]
  organizationId: string
  onEmailSent?: () => void
}

export function SendEmailDialog({ stories, organizationId, onEmailSent }: SendEmailDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedStory, setSelectedStory] = useState<string>("")
  const [emailType, setEmailType] = useState<string>("story_update")
  const [customMessage, setCustomMessage] = useState("")
  const [scheduledAt, setScheduledAt] = useState("")
  const { toast } = useToast()

  const selectedStoryData = stories.find(s => s.id === selectedStory)

  const emailTypes = [
    { value: "story_update", label: "Story Update", description: "Weekly progress update" },
    { value: "milestone", label: "Milestone Achievement", description: "Celebrate reaching a goal" },
    { value: "completion", label: "Story Complete", description: "Mission accomplished!" },
    { value: "welcome", label: "Welcome New Subscribers", description: "Welcome new followers" }
  ]

  const handleSendEmail = async () => {
    if (!selectedStory) {
      toast({
        title: "Error",
        description: "Please select a story to send updates for.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: emailType,
          storyId: selectedStory,
          organizationId,
          customMessage: customMessage || undefined,
          scheduledAt: scheduledAt || undefined
        })
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success!",
          description: `Email sent to ${result.recipients} subscribers`,
        })
        setOpen(false)
        setSelectedStory("")
        setCustomMessage("")
        setScheduledAt("")
        onEmailSent?.()
      } else {
        throw new Error(result.error || 'Failed to send email')
      }
    } catch (error) {
      console.error('Email sending error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send email. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getEmailPreview = () => {
    if (!selectedStoryData) return null

    const progress = Math.round((selectedStoryData.current_amount / selectedStoryData.goal_amount) * 100)
    
    switch (emailType) {
      case 'story_update':
        return {
          subject: `📈 ${selectedStoryData.title} - ${progress}% Complete!`,
          preview: `Great news! ${selectedStoryData.title} has reached ${progress}% of its goal!`
        }
      case 'milestone':
        return {
          subject: `🎉 Milestone Reached! ${selectedStoryData.title}`,
          preview: `Congratulations! A major milestone has been achieved for ${selectedStoryData.title}!`
        }
      case 'completion':
        return {
          subject: `✅ Story Complete! ${selectedStoryData.title} - Mission Accomplished`,
          preview: `Amazing work! ${selectedStoryData.title} has been completed successfully!`
        }
      case 'welcome':
        return {
          subject: `Welcome to ${selectedStoryData.title}! You're now part of the story 💙`,
          preview: `Welcome! You're now following ${selectedStoryData.title} and will receive updates.`
        }
      default:
        return null
    }
  }

  const preview = getEmailPreview()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white shadow-lg">
          <Send className="w-4 h-4 mr-2" />
          Send Update
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-600" />
            Send Story Update
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Story Selection */}
          <div className="space-y-3">
            <Label htmlFor="story">Select Story</Label>
            <Select value={selectedStory} onValueChange={setSelectedStory}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a story to send updates for" />
              </SelectTrigger>
              <SelectContent>
                {stories.map((story) => (
                  <SelectItem key={story.id} value={story.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{story.title}</span>
                      <Badge variant="secondary" className="ml-2">
                        {story.subscribers_count} subscribers
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStoryData && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{selectedStoryData.title}</CardTitle>
                <CardDescription>NMBR #{selectedStoryData.nmbr_code}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedStoryData.subscribers_count} subscribers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>${selectedStoryData.current_amount.toLocaleString()} raised</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Email Type */}
          <div className="space-y-3">
            <Label htmlFor="emailType">Email Type</Label>
            <Select value={emailType} onValueChange={setEmailType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {emailTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-muted-foreground">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Message */}
          <div className="space-y-3">
            <Label htmlFor="customMessage">Custom Message (Optional)</Label>
            <Textarea
              id="customMessage"
              placeholder="Add a personal message or update details..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={3}
            />
            <p className="text-sm text-muted-foreground">
              This will be included in the email content. Leave blank to use the default message.
            </p>
          </div>

          {/* Schedule */}
          <div className="space-y-3">
            <Label htmlFor="scheduledAt">Schedule (Optional)</Label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Leave blank to send immediately, or schedule for later.
            </p>
          </div>

          {/* Preview */}
          {preview && (
            <Card className="bg-muted/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Subject:</span>
                    <p className="text-sm text-muted-foreground">{preview.subject}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Preview:</span>
                    <p className="text-sm text-muted-foreground">{preview.preview}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendEmail}
              disabled={loading || !selectedStory}
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white"
            >
              {loading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {scheduledAt ? 'Schedule Email' : 'Send Now'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
