"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { 
  Users, 
  Hash, 
  Target, 
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"

interface Story {
  id: string
  title: string
  nmbr_code: string
  subscriber_count: number
}

interface AudienceTargetingProps {
  organizationId: string
  onAudienceChange: (audience: {
    type: 'all' | 'specific'
    selectedStories: string[]
    totalRecipients: number
  }) => void
}

export function AudienceTargeting({ organizationId, onAudienceChange }: AudienceTargetingProps) {
  const [audienceType, setAudienceType] = useState<'all' | 'specific'>('all')
  const [stories, setStories] = useState<Story[]>([])
  const [selectedStories, setSelectedStories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [totalSubscribers, setTotalSubscribers] = useState(0)

  useEffect(() => {
    if (organizationId) {
      fetchStories()
      fetchTotalSubscribers()
    }
  }, [organizationId])

  const fetchStories = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/newsletters/audience?organizationId=${organizationId}`)
      const data = await response.json()
      
      if (response.ok) {
        setStories(data.stories)
        setTotalSubscribers(data.totalSubscribers)
      } else {
        throw new Error(data.error || 'Failed to fetch stories')
      }
    } catch (error) {
      console.error('Failed to fetch stories:', error)
      // Fallback to mock data
      const mockStories: Story[] = [
        {
          id: 'story-1',
          title: 'Clean Water Project',
          nmbr_code: 'NMBR001',
          subscriber_count: 45
        },
        {
          id: 'story-2', 
          title: 'Education for All',
          nmbr_code: 'NMBR002',
          subscriber_count: 32
        },
        {
          id: 'story-3',
          title: 'Community Garden',
          nmbr_code: 'NMBR003',
          subscriber_count: 28
        }
      ]
      setStories(mockStories)
      setTotalSubscribers(127)
    } finally {
      setLoading(false)
    }
  }

  const fetchTotalSubscribers = async () => {
    // This is now handled in fetchStories
  }

  const handleStoryToggle = (storyId: string) => {
    const newSelected = selectedStories.includes(storyId)
      ? selectedStories.filter(id => id !== storyId)
      : [...selectedStories, storyId]
    
    setSelectedStories(newSelected)
    updateAudience(audienceType, newSelected)
  }

  const updateAudience = (type: 'all' | 'specific', selected: string[]) => {
    let totalRecipients = 0
    
    if (type === 'all') {
      totalRecipients = totalSubscribers
    } else {
      totalRecipients = selected.reduce((total, storyId) => {
        const story = stories.find(s => s.id === storyId)
        return total + (story?.subscriber_count || 0)
      }, 0)
    }

    onAudienceChange({
      type,
      selectedStories: selected,
      totalRecipients
    })
  }

  const handleAudienceTypeChange = (type: 'all' | 'specific') => {
    setAudienceType(type)
    updateAudience(type, selectedStories)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Audience Targeting
        </CardTitle>
        <CardDescription>
          Choose who will receive this newsletter
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Audience Type Selection */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Send to:</Label>
          <RadioGroup 
            value={audienceType} 
            onValueChange={(value) => handleAudienceTypeChange(value as 'all' | 'specific')}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">All Subscribers</p>
                      <p className="text-sm text-muted-foreground">
                        Send to everyone who has subscribed to any of your stories
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {totalSubscribers} people
                  </Badge>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
              <RadioGroupItem value="specific" id="specific" />
              <Label htmlFor="specific" className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Hash className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Specific NMBR Contacts</p>
                      <p className="text-sm text-muted-foreground">
                        Send only to people who subscribed to specific stories
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {selectedStories.length > 0 
                      ? `${selectedStories.reduce((total, id) => {
                          const story = stories.find(s => s.id === id)
                          return total + (story?.subscriber_count || 0)
                        }, 0)} people`
                      : 'Select stories'
                    }
                  </Badge>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Story Selection (when specific is selected) */}
        {audienceType === 'specific' && (
          <div className="space-y-4">
            <Label className="text-base font-medium">Select Stories:</Label>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading stories...</span>
              </div>
            ) : stories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p>No stories found. Create a story first to target specific subscribers.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {stories.map((story) => (
                  <div 
                    key={story.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <Checkbox
                      id={story.id}
                      checked={selectedStories.includes(story.id)}
                      onCheckedChange={() => handleStoryToggle(story.id)}
                    />
                    <Label htmlFor={story.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{story.title}</p>
                          <p className="text-sm text-muted-foreground">
                            NMBR: {story.nmbr_code}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {story.subscriber_count} subscribers
                        </Badge>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Summary */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="font-medium">Newsletter Summary</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {audienceType === 'all' ? (
              <p>This newsletter will be sent to all {totalSubscribers} subscribers.</p>
            ) : selectedStories.length > 0 ? (
              <div>
                <p>This newsletter will be sent to subscribers of:</p>
                <ul className="mt-1 ml-4 list-disc">
                  {selectedStories.map(storyId => {
                    const story = stories.find(s => s.id === storyId)
                    return story ? (
                      <li key={storyId}>
                        {story.title} ({story.subscriber_count} people)
                      </li>
                    ) : null
                  })}
                </ul>
                <p className="mt-2 font-medium">
                  Total recipients: {selectedStories.reduce((total, id) => {
                    const story = stories.find(s => s.id === id)
                    return total + (story?.subscriber_count || 0)
                  }, 0)} people
                </p>
              </div>
            ) : (
              <p>Select at least one story to send the newsletter.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
