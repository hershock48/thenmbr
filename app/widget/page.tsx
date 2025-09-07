'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Heart, Users, DollarSign, ArrowRight, Gift, Target, Sparkles, CheckCircle, Star } from "lucide-react"

interface Story {
  id: string
  nmbr_code: string
  title: string
  description: string
  photo_url?: string
  goal_amount?: number
  current_amount?: number
  status: string
  created_at: string
}

interface Org {
  id: string
  name: string
  logo_url?: string
  brand_color?: string
  website?: string
}

function WidgetContent() {
  const searchParams = useSearchParams()
  const [org, setOrg] = useState<Org | null>(null)
  const [stories, setStories] = useState<Story[]>([])
  const [searchCode, setSearchCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const orgId = searchParams.get('org')
  const widgetType = searchParams.get('type') || 'story-search'
  const nmbrCode = searchParams.get('nmbr')

  useEffect(() => {
    console.log('WidgetContent useEffect triggered')
    console.log('orgId:', orgId)
    console.log('widgetType:', widgetType)
    console.log('nmbrCode:', nmbrCode)

    if (orgId) {
      fetchOrg()
      if (nmbrCode) {
        setSearchCode(nmbrCode)
        searchStory(nmbrCode)
      }
    }
  }, [orgId, nmbrCode])

  const fetchOrg = async () => {
    try {
      const response = await fetch(`/api/org/${orgId}`)
      const data = await response.json()
      setOrg(data)
    } catch (error) {
      console.error('Failed to fetch organization:', error)
    }
  }

  const searchStory = async (code: string) => {
    if (!code.trim()) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/stories?org=${orgId}&nmbr=${code}`)
      const data = await response.json()
      
      if (data.stories && data.stories.length > 0) {
        setStories(data.stories)
      } else {
        setError('No story found with that number. Try 1, 2, or 3.')
        setStories([])
      }
    } catch (error) {
      setError('Failed to search for story')
      setStories([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchStory(searchCode)
  }

  const handleSubscribe = async (storyId: string) => {
    // In a real app, this would handle subscription
    alert('Thank you! You\'ll receive updates about this story.')
  }

  const handleDonate = async (storyId: string) => {
    // In a real app, this would handle donation
    alert('Redirecting to secure donation page...')
  }

  if (!orgId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-background to-purple-50">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Widget Not Found</h2>
            <p className="text-muted-foreground mb-6">
              This widget requires a valid organization ID to work properly.
            </p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Debug: orgId is {orgId === null ? 'null' : orgId}</p>
              <p>Debug: widgetType is {widgetType}</p>
              <p>Debug: nmbrCode is {nmbrCode === null ? 'null' : nmbrCode}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-background to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">#</span>
              </div>
            </div>
            <span className="text-2xl font-bold text-foreground">The NMBR</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Find Your Impact Story</h1>
          <p className="text-muted-foreground">
            Search by number to discover the person or cause you're helping
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <Search className="w-5 h-5 text-cyan-600" />
              Search for a Story
            </CardTitle>
            <CardDescription>
              Enter the number you received to find your personalized impact story
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <Label htmlFor="search" className="text-sm font-medium text-foreground">
                  Story Number
                </Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="search"
                    type="text"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    placeholder="Enter a number (try 1, 2, or 3)"
                    className="flex-1 h-12 text-base border-2 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
                  />
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="h-12 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white shadow-lg"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Find Story
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>

            {/* Quick Search Buttons */}
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-3">Or try one of these:</p>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant="outline" 
                  className="h-10 border-2 border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300"
                  onClick={() => searchStory('1')}
                >
                  Story #1
                </Button>
                <Button 
                  variant="outline" 
                  className="h-10 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
                  onClick={() => searchStory('2')}
                >
                  Story #2
                </Button>
                <Button 
                  variant="outline" 
                  className="h-10 border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
                  onClick={() => searchStory('3')}
                >
                  Story #3
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-700">
                <Target className="w-5 h-5" />
                <span className="font-medium">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stories */}
        {stories.length > 0 && (
          <div className="space-y-6">
            {stories.map((story) => (
              <Card key={story.id} className="shadow-xl border-0 bg-white/80 backdrop-blur-sm group hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Story Image */}
                    <div className="md:w-1/3">
                      <div className="relative">
                        <div className="w-full h-48 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-4xl">
                          {story.nmbr_code}
                        </div>
                        {story.photo_url && (
                          <img 
                            src={story.photo_url} 
                            alt={story.title}
                            className="w-full h-48 object-cover rounded-xl"
                          />
                        )}
                      </div>
                    </div>

                    {/* Story Content */}
                    <div className="md:w-2/3 space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">{story.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{story.description}</p>
                      </div>

                      {/* Progress Bar */}
                      {story.goal_amount && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-foreground">Progress</span>
                            <span className="text-sm text-muted-foreground">
                              ${story.current_amount || 0} / ${story.goal_amount}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-cyan-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(((story.current_amount || 0) / story.goal_amount) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                          onClick={() => handleSubscribe(story.id)}
                          className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white shadow-lg"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Follow This Story
                        </Button>
                        <Button 
                          onClick={() => handleDonate(story.id)}
                          variant="outline"
                          className="flex-1 border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
                        >
                          <Gift className="w-4 h-4 mr-2" />
                          Make a Donation
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 py-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-lg font-bold text-foreground">The NMBR</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Making every donation personal. Connecting donors directly to the people they help.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function WidgetPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-background to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your impact story...</p>
        </div>
      </div>
    }>
      <WidgetContent />
    </Suspense>
  )
}
