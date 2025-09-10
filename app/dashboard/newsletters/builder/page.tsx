'use client'

import { useState, useEffect, Suspense, lazy } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save, Send, Eye, Download, Loader2 } from 'lucide-react'

// Lazy load heavy components
const SimpleNewsletterBuilder = lazy(() => import('@/components/dashboard/simple-newsletter-builder').then(module => ({ default: module.SimpleNewsletterBuilder })))
const AudienceTargeting = lazy(() => import('@/components/dashboard/audience-targeting').then(module => ({ default: module.AudienceTargeting })))

export default function NewsletterBuilderPage() {
  const { org } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [storyId, setStoryId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [audience, setAudience] = useState({
    type: 'all' as 'all' | 'specific',
    selectedStories: [] as string[],
    totalRecipients: 0
  })

  useEffect(() => {
    // Get story ID from URL params or use first available story
    const storyIdParam = searchParams.get('storyId')
    if (storyIdParam) {
      setStoryId(storyIdParam)
    }
    setIsLoading(false)
  }, [searchParams])

  const handleSave = (newsletter: any) => {
    console.log('Newsletter saved:', newsletter)
    // Show success message
    // Optionally redirect back to newsletters list
  }

  const handleSend = (newsletter: any) => {
    console.log('Newsletter sent:', newsletter)
    console.log('Audience:', audience)
    // Show success message
    // Optionally redirect back to newsletters list
  }

  const handleAudienceChange = (newAudience: any) => {
    setAudience(newAudience)
  }

  const handleBack = () => {
    router.push('/dashboard/newsletters')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
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
            <Suspense fallback={
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading audience targeting...</span>
                  </div>
                </CardContent>
              </Card>
            }>
              <AudienceTargeting
                organizationId={org?.id || ''}
                onAudienceChange={handleAudienceChange}
              />
            </Suspense>
          </div>
          
          {/* Newsletter Builder */}
          <div className="lg:col-span-2">
            <Suspense fallback={
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading newsletter builder...</span>
                  </div>
                </CardContent>
              </Card>
            }>
              <SimpleNewsletterBuilder
                storyId={storyId}
                organizationId={org?.id || ''}
                onSave={handleSave}
                onSend={handleSend}
                audience={audience}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
