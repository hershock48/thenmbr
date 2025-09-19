"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useOrganization } from "@/contexts/OrganizationContext"
import { 
  Sparkles, 
  Lightbulb, 
  MessageSquare, 
  RefreshCw,
  Save,
  Copy,
  Eye
} from "lucide-react"

export default function AIStoriesPage() {
  const { orgType } = useOrganization()
  const [userStory, setUserStory] = useState('')
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>('')
  const [improvedStory, setImprovedStory] = useState('')
  const [isImproving, setIsImproving] = useState(false)

  const getContextualSuggestions = () => {
    if (orgType === 'business') {
      return [
        "Add more emotional connection - focus on how your product makes customers feel",
        "Strengthen the call-to-action - make it more specific about purchasing or engagement",
        "Include concrete details about your product's unique features and benefits",
        "Add customer testimonials or success stories to build credibility",
        "Improve the opening to grab attention and create curiosity about your product"
      ]
    } else {
      return [
        "Add more emotional connection - focus on the human impact of donations",
        "Strengthen the call-to-action - make it more specific and urgent about donating",
        "Include concrete details and numbers to show the impact of contributions",
        "Add personal stories or testimonials from people you've helped",
        "Improve the opening hook to create immediate emotional connection"
      ]
    }
  }

  const handleAnalyzeStory = async () => {
    if (!userStory.trim()) return
    
    setIsAnalyzing(true)
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setAiSuggestions(getContextualSuggestions())
    } catch (error) {
      console.error('Failed to analyze story:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleImproveStory = async (suggestion: string) => {
    if (!userStory.trim()) return
    
    setIsImproving(true)
    setSelectedSuggestion(suggestion)
    
    try {
      // Simulate AI improvement
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // This would be real AI improvement based on the suggestion
      const improved = `[AI IMPROVED VERSION]\n\n${userStory}\n\n[Improvements made: ${suggestion}]\n\nThis is how your story could look with AI enhancement while keeping your original voice and message intact.`
      
      setImprovedStory(improved)
    } catch (error) {
      console.error('Failed to improve story:', error)
    } finally {
      setIsImproving(false)
    }
  }

  const handleSaveStory = () => {
    if (generatedStory) {
      setSavedStories(prev => [...prev, generatedStory])
      setGeneratedStory(null)
    }
  }

  const handlePublishStory = () => {
    if (generatedStory) {
      // Navigate to story creation page with pre-filled content
      window.location.href = `/dashboard/stories/create?ai_generated=${encodeURIComponent(JSON.stringify(generatedStory))}`
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-purple-500" />
              AI Story Assistant
            </h1>
            <p className="text-muted-foreground">
              {orgType === 'business' 
                ? 'Write your product stories and let AI help you improve them'
                : 'Write your impact stories and let AI help you improve them'
              }
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => window.location.href = '/dashboard/stories'}>
              <Eye className="w-4 h-4 mr-2" />
              View All Stories
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Your Story Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                Write Your Story
              </CardTitle>
              <CardDescription>
                Write your story first, then let AI help you improve it
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Your Story</Label>
                <Textarea
                  placeholder="Write your story here... Don't worry about perfection, just get your ideas down. AI will help you improve it."
                  value={userStory}
                  onChange={(e) => setUserStory(e.target.value)}
                  rows={12}
                  className="resize-none"
                />
              </div>
              
              <Button 
                onClick={handleAnalyzeStory} 
                disabled={!userStory.trim() || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {isAnalyzing ? 'Analyzing...' : 'Get AI Suggestions'}
              </Button>
            </CardContent>
          </Card>

          {/* AI Suggestions & Improvements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                AI Suggestions
              </CardTitle>
              <CardDescription>
                AI will analyze your story and suggest improvements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {aiSuggestions.length > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Suggested Improvements</Label>
                    {aiSuggestions.map((suggestion, index) => (
                      <div key={index} className="p-3 border border-border rounded-lg">
                        <div className="flex items-start justify-between">
                          <p className="text-sm text-muted-foreground flex-1">{suggestion}</p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleImproveStory(suggestion)}
                            disabled={isImproving}
                            className="ml-2"
                          >
                            {isImproving && selectedSuggestion === suggestion ? (
                              <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : (
                              'Improve'
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {improvedStory && (
                    <div className="space-y-2">
                      <Label>AI Improved Version</Label>
                      <div className="p-4 bg-muted rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                          {improvedStory}
                        </pre>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                        <Button size="sm">
                          <Save className="h-3 w-3 mr-1" />
                          Use This Version
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>Write your story first, then click "Get AI Suggestions" to see how AI can help improve it.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
