'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save, Send, Eye, Download, Loader2 } from 'lucide-react'
import { SimpleNewsletterBuilder } from '@/components/dashboard/simple-newsletter-builder'
import { AudienceTargeting } from '@/components/dashboard/audience-targeting'

export default function NewsletterBuilderPage() {
  const { org } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [storyId, setStoryId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [audience, setAudience] = useState({
    type: 'all' as 'all' | 'specific',
    selectedStories: [] as string[],
    totalRecipients: 0
  })

  useEffect(() => {
    try {
      // Get story ID from URL params or use first available story
      const storyIdParam = searchParams.get('storyId')
      if (storyIdParam) {
        setStoryId(storyIdParam)
      }
    } catch (err) {
      console.error('Error initializing newsletter builder:', err)
      setError('Failed to initialize newsletter builder. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [searchParams])

  interface NewsletterData {
    name: string
    content: unknown
    type: string
    storyId?: string
  }

  interface AudienceData {
    type: 'all' | 'specific'
    selectedStories: string[]
    totalRecipients: number
  }

  const handleSave = async (newsletter: NewsletterData) => {
    try {
      setError(null)
      console.log('Newsletter saved:', newsletter)
      // TODO: Implement actual save functionality
      // Show success message
      // Optionally redirect back to newsletters list
    } catch (err) {
      console.error('Error saving newsletter:', err)
      setError('Failed to save newsletter. Please try again.')
    }
  }

  const handleSend = async (newsletter: NewsletterData) => {
    try {
      setError(null)
      console.log('Newsletter sent:', newsletter)
      console.log('Audience:', audience)
      // TODO: Implement actual send functionality
      // Show success message
      // Optionally redirect back to newsletters list
    } catch (err) {
      console.error('Error sending newsletter:', err)
      setError('Failed to send newsletter. Please try again.')
    }
  }

  const handleAudienceChange = (newAudience: AudienceData) => {
    setAudience(newAudience)
  }

  const handleBack = () => {
    router.push('/dashboard/newsletters')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading newsletter builder...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Newsletters</span>
            </Button>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-xl font-semibold">Newsletter Builder</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleSave({})}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button 
              size="sm"
              onClick={() => handleSend({})}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Newsletter
            </Button>
          </div>
        </div>
      </div>

      {/* Newsletter Builder */}
      <div className="flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Audience Targeting Sidebar */}
          <div className="lg:col-span-1">
            <AudienceTargeting
              organizationId={org?.id || ''}
              onAudienceChange={handleAudienceChange}
            />
          </div>
          
          {/* Newsletter Builder */}
          <div className="lg:col-span-2">
            <SimpleNewsletterBuilder
              storyId={storyId}
              organizationId={org?.id || ''}
              onSave={handleSave}
              onSend={handleSend}
              audience={audience}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
