'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save, Send, Eye, Download } from 'lucide-react'
import { SimpleNewsletterBuilder } from '@/components/dashboard/simple-newsletter-builder'

export default function NewsletterBuilderPage() {
  const { org } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [storyId, setStoryId] = useState('')
  const [isLoading, setIsLoading] = useState(true)

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
    // Show success message
    // Optionally redirect back to newsletters list
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
        <SimpleNewsletterBuilder
          storyId={storyId}
          organizationId={org?.id || ''}
          onSave={handleSave}
          onSend={handleSend}
        />
      </div>
    </div>
  )
}
