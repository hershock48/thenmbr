'use client'

import { useState, useEffect } from 'react'
import { Search, Heart, Mail, ExternalLink } from 'lucide-react'
import { Story, Nonprofit } from '@/types'

interface StorySearchProps {
  orgId: string
  org?: Nonprofit
  onSubscribe?: (email: string, storyId: string) => void
  onDonate?: (storyId: string, amount: number) => void
}

export default function StorySearch({ orgId, org, onSubscribe, onDonate }: StorySearchProps) {
  const [searchCode, setSearchCode] = useState('')
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [showSubscribe, setShowSubscribe] = useState(false)
  const [subscribeEmail, setSubscribeEmail] = useState('')
  const [showCustomAmount, setShowCustomAmount] = useState(false)
  const [customAmount, setCustomAmount] = useState('')

  const searchStories = async () => {
    if (!searchCode.trim()) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/stories?org=${orgId}&nmbr=${searchCode}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search stories')
      }

      setStories(data.stories)
      if (data.stories.length > 0) {
        setSelectedStory(data.stories[0])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async () => {
    if (!subscribeEmail.trim() || !selectedStory) return

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: subscribeEmail,
          org_id: orgId,
          story_id: selectedStory.id
        })
      })

      if (response.ok) {
        setShowSubscribe(false)
        setSubscribeEmail('')
        onSubscribe?.(subscribeEmail, selectedStory.id)
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
    if (!selectedStory) return
    onDonate?.(selectedStory.id, amount)
  }

  const handleCustomDonate = () => {
    const amount = parseFloat(customAmount)
    if (amount > 0) {
      handleDonate(amount)
      setShowCustomAmount(false)
      setCustomAmount('')
    }
  }

  return (
    <div 
      className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6" 
      style={{ 
        fontFamily: org?.font_family || 'Inter',
        '--brand-color': org?.brand_color || '#3B82F6',
        '--secondary-color': org?.secondary_color || '#1e40af',
        '--accent-color': org?.accent_color || '#60a5fa'
      } as React.CSSProperties}
    >
      {/* Header */}
      <div className="text-center mb-6">
        {org?.logo_url && (
          <img 
            src={org.logo_url} 
            alt={org.name}
            className="h-12 mx-auto mb-4 object-contain"
          />
        )}
        <h2 
          className="text-xl font-bold mb-2"
          style={{ color: org?.brand_color || '#3B82F6' }}
        >
          Search Stories
        </h2>
        <p className="text-gray-600 text-sm">
          Enter a NMBR code to find stories
        </p>
      </div>

      {/* Search Form */}
      <div className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Enter NMBR code..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ 
                borderColor: org?.brand_color || '#3B82F6',
                '--tw-ring-color': org?.brand_color || '#3B82F6'
              } as React.CSSProperties}
              onKeyPress={(e) => e.key === 'Enter' && searchStories()}
            />
          </div>
          <button
            onClick={searchStories}
            disabled={loading || !searchCode.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: org?.brand_color || '#3B82F6' }}
          >
            {loading ? '...' : 'Search'}
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </div>

      {/* Story Results */}
      {selectedStory && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden mb-6">
          {/* Story Image */}
          {selectedStory.photo_url && (
            <div className="relative">
              <img 
                src={selectedStory.photo_url} 
                alt={selectedStory.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-sm font-semibold text-gray-700">
                  NMBR {selectedStory.nmbr_code}
                </span>
              </div>
            </div>
          )}
          
          {/* Story Content */}
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Meet {selectedStory.title}
            </h3>
            {selectedStory.description && (
              <p className="text-gray-700 text-base leading-relaxed mb-6">
                {selectedStory.description}
              </p>
            )}
            
            {/* Impact Statement */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 italic">
                "Your support helps {selectedStory.title} and others like them continue their journey. 
                Every donation makes a real difference in their lives."
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setShowSubscribe(true)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors font-semibold"
              >
                <Mail className="h-5 w-5" />
                Follow {selectedStory.title}'s Journey
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleDonate(25)}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg hover:opacity-90 font-semibold"
                  style={{ backgroundColor: org?.brand_color || '#3B82F6' }}
                >
                  <Heart className="h-4 w-4" />
                  $25
                </button>
                <button
                  onClick={() => handleDonate(50)}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg hover:opacity-90 font-semibold"
                  style={{ backgroundColor: org?.brand_color || '#3B82F6' }}
                >
                  <Heart className="h-4 w-4" />
                  $50
                </button>
              </div>
              <button
                onClick={() => setShowCustomAmount(true)}
                className="w-full text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Other Amount
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscribe Modal */}
      {showSubscribe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Follow {selectedStory?.title}'s Journey</h3>
            <p className="text-gray-600 text-sm mb-4">
              Get updates about {selectedStory?.title} and how your support is making a difference.
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

      {/* Custom Amount Modal */}
      {showCustomAmount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Support {selectedStory?.title}</h3>
            <p className="text-gray-600 text-sm mb-4">
              Enter the amount you'd like to donate to help {selectedStory?.title} and others like them.
            </p>
            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                step="0.01"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCustomAmount(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCustomDonate}
                disabled={!customAmount || parseFloat(customAmount) < 1}
                className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: org?.brand_color || '#3B82F6' }}
              >
                Donate ${customAmount || '0'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      {org?.show_powered_by !== false && (
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Powered by <span className="font-semibold">The NMBR</span>
          </p>
        </div>
      )}
    </div>
  )
}
