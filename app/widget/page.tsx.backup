'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Heart, Users, DollarSign } from "lucide-react"

interface Story {
  id: string
  nmbr_code: string
  title: string
  description: string
  photo_url?: string
  goal_amount?: number
  current_amount?: number
  status: string
}

interface Org {
  id: string
  name: string
  logo_url?: string
  brand_color: string
  secondary_color?: string
  accent_color?: string
  font_family?: string
  show_powered_by?: boolean
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
      const response = await fetch(`/api/stories?org_id=${orgId}&nmbr=${code}`)
      const data = await response.json()
      
      if (data.stories && data.stories.length > 0) {
        setStories(data.stories)
      } else {
        setError('No story found with that NMBR code')
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

  const handleSubscribe = async (email: string, storyId: string) => {
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          org_id: orgId,
          story_id: storyId
        })
      })
      alert('Successfully subscribed!')
    } catch (error) {
      alert('Failed to subscribe. Please try again.')
    }
  }

  const handleDonate = async (amount: number, storyId?: string) => {
    try {
      const response = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          org_id: orgId,
          story_id: storyId,
          donor_email: '',
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/cancel`
        })
      })
      
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      alert('Failed to process donation. Please try again.')
    }
  }

  if (!orgId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Invalid Widget</h2>
            <p className="text-gray-600">This widget requires an organization ID.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen bg-gray-50 p-4"
      style={{
        fontFamily: org?.font_family || 'Inter',
        '--brand-color': org?.brand_color || '#3B82F6',
        '--secondary-color': org?.secondary_color || '#1e40af',
        '--accent-color': org?.accent_color || '#60a5fa'
      } as React.CSSProperties}
    >
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          {org?.logo_url && (
            <img 
              src={org.logo_url} 
              alt={org.name} 
              className="h-16 mx-auto mb-4"
            />
          )}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {org?.name || 'NMBR Platform'}
          </h1>
          <p className="text-gray-600">Search for a story by NMBR code</p>
        </div>

        {/* Search Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" style={{ color: 'var(--brand-color)' }} />
              Search Story
            </CardTitle>
            <CardDescription>
              Enter the NMBR code from your bracelet to discover the story
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nmbr-code">NMBR Code</Label>
                <Input
                  id="nmbr-code"
                  type="text"
                  placeholder="Enter NMBR code..."
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="text-center text-lg font-mono"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                style={{ backgroundColor: 'var(--brand-color)' }}
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search Story'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600 text-center">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Story Results */}
        {stories.length > 0 && (
          <div className="space-y-4">
            {stories.map((story) => (
              <Card key={story.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: 'var(--brand-color)' }}
                    >
                      {story.nmbr_code.slice(-3)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{story.title}</CardTitle>
                      <CardDescription>Code: {story.nmbr_code}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {story.photo_url && (
                    <img 
                      src={story.photo_url} 
                      alt={story.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  
                  <p className="text-gray-700">{story.description}</p>
                  
                  {story.goal_amount && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>${(story.current_amount || 0).toLocaleString()} / ${story.goal_amount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${((story.current_amount || 0) / story.goal_amount) * 100}%`,
                            backgroundColor: 'var(--brand-color)'
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        const email = prompt('Enter your email to subscribe:')
                        if (email) handleSubscribe(email, story.id)
                      }}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Follow Journey
                    </Button>
                    <Button 
                      className="flex-1"
                      style={{ backgroundColor: 'var(--brand-color)' }}
                      onClick={() => handleDonate(25, story.id)}
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Donate $25
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Powered by Footer */}
        {org?.show_powered_by !== false && (
          <div className="mt-8 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Powered by <span className="font-semibold">The NMBR</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function WidgetPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <WidgetContent />
    </Suspense>
  )
}
