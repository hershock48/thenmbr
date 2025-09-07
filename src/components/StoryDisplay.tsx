'use client'

import { useState, useEffect } from 'react'
import { Heart, Mail, Share2, ArrowLeft } from 'lucide-react'
import { Story, Nonprofit } from '@/types'

interface StoryDisplayProps {
  orgId: string
  storyId: string
  org?: Nonprofit
  onSubscribe?: (email: string, storyId: string) => void
  onDonate?: (storyId: string, amount: number) => void
}

export default function StoryDisplay({ orgId, storyId, org, onSubscribe, onDonate }: StoryDisplayProps) {
  const [story, setStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showSubscribe, setShowSubscribe] = useState(false)
  const [subscribeEmail, setSubscribeEmail] = useState('')
  const [showDonate, setShowDonate] = useState(false)
  const [donateAmount, setDonateAmount] = useState(25)

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`/api/stories?org=${orgId}&nmbr=${storyId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch story')
        }

        if (data.stories.length > 0) {
          setStory(data.stories[0])
          
          // Track story view
          try {
            await fetch(`/api/stories/${data.stories[0].id}/view`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ org_id: orgId })
            })
          } catch (viewError) {
            console.error('Failed to track story view:', viewError)
          }
        } else {
          setError('Story not found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load story')
      } finally {
        setLoading(false)
      }
    }

    fetchStory()
  }, [orgId, storyId])

  const handleSubscribe = async () => {
    if (!subscribeEmail.trim() || !story) return

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: subscribeEmail,
          org_id: orgId,
          story_id: story.id
        })
      })

      if (response.ok) {
        setShowSubscribe(false)
        setSubscribeEmail('')
        onSubscribe?.(subscribeEmail, story.id)
        alert('Successfully subscribed!')
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Subscription failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Subscription failed')
    }
  }

  const handleDonate = (amount: number) => {
    if (!story) return
    onDonate?.(story.id, amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading story...</p>
        </div>
      </div>
    )
  }

  if (error || !story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">Story Not Found</div>
          <p className="text-gray-600">{error || 'The story you\'re looking for doesn\'t exist.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {org?.logo_url && (
                <img 
                  src={org.logo_url} 
                  alt={org.name}
                  className="h-10"
                />
              )}
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{org?.name}</h1>
                <p className="text-sm text-gray-600">NMBR {story.nmbr_code}</p>
              </div>
            </div>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Story Image */}
          {story.photo_url && (
            <div className="relative h-96">
              <img 
                src={story.photo_url} 
                alt={story.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-sm font-semibold text-gray-700">
                  NMBR {story.nmbr_code}
                </span>
              </div>
            </div>
          )}

          {/* Story Details */}
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Meet {story.title}
            </h1>
            
            {story.description && (
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {story.description}
                </p>
              </div>
            )}

            {/* Impact Statement */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Impact</h3>
              <p className="text-gray-700 leading-relaxed">
                When you support {story.title}, you're not just making a donation – you're becoming part of their story. 
                Your contribution helps provide essential resources, opportunities, and hope that can change lives forever.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Subscribe Button */}
              <button
                onClick={() => setShowSubscribe(true)}
                className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors font-semibold text-lg"
              >
                <Mail className="h-5 w-5" />
                Follow {story.title}'s Journey
              </button>

              {/* Donate Button */}
              <button
                onClick={() => setShowDonate(true)}
                className="flex items-center justify-center gap-3 px-6 py-4 text-white rounded-xl hover:opacity-90 font-semibold text-lg"
                style={{ backgroundColor: org?.brand_color || '#3B82F6' }}
              >
                <Heart className="h-5 w-5" />
                Support {story.title}
              </button>
            </div>

            {/* Quick Donate Amounts */}
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-3">Quick Donate:</p>
              <div className="flex flex-wrap gap-2">
                {[25, 50, 100, 250].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleDonate(amount)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 text-sm font-medium"
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscribe Modal */}
      {showSubscribe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 max-w-full mx-4">
            <h3 className="text-xl font-semibold mb-2">Follow {story.title}'s Journey</h3>
            <p className="text-gray-600 text-sm mb-4">
              Get updates about {story.title} and how your support is making a difference.
            </p>
            <input
              type="email"
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowSubscribe(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubscribe}
                className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90"
                style={{ backgroundColor: org?.brand_color || '#3B82F6' }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Donate Modal */}
      {showDonate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 max-w-full mx-4">
            <h3 className="text-xl font-semibold mb-2">Support {story.title}</h3>
            <p className="text-gray-600 text-sm mb-4">
              Enter the amount you'd like to donate to help {story.title} and others like them.
            </p>
            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={donateAmount}
                onChange={(e) => setDonateAmount(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                step="0.01"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDonate(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDonate(donateAmount)
                  setShowDonate(false)
                }}
                disabled={donateAmount < 1}
                className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: org?.brand_color || '#3B82F6' }}
              >
                Donate ${donateAmount}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
