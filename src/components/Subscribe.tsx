'use client'

import { useState } from 'react'
import { Mail, Check } from 'lucide-react'
import { Nonprofit } from '@/types'

interface SubscribeProps {
  orgId: string
  org?: Nonprofit
  storyId?: string
  onSuccess?: (email: string) => void
}

export default function Subscribe({ orgId, org, storyId, onSuccess }: SubscribeProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          org_id: orgId,
          story_id: storyId
        })
      })

      if (response.ok) {
        setSuccess(true)
        onSuccess?.(email)
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Subscription failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Subscription failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
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
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h2 
            className="text-xl font-bold mb-2"
            style={{ color: org?.brand_color || '#3B82F6' }}
          >
            Successfully Subscribed!
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            You'll receive updates from {org?.name || 'this organization'}.
          </p>
          <button
            onClick={() => {
              setSuccess(false)
              setEmail('')
            }}
            className="text-sm hover:opacity-80"
            style={{ color: org?.brand_color || '#3B82F6' }}
          >
            Subscribe another email
          </button>
        </div>
        
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
          className="text-2xl font-bold mb-2"
          style={{ color: org?.brand_color || '#3B82F6' }}
        >
          Stay Connected
        </h2>
        <p className="text-gray-600 text-base">
          Get updates about the impact you're making with {org?.name || 'this organization'}
        </p>
      </div>

      {/* Subscribe Form */}
      <form onSubmit={handleSubscribe} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ 
                borderColor: org?.brand_color || '#3B82F6',
                '--tw-ring-color': org?.brand_color || '#3B82F6'
              } as React.CSSProperties}
              disabled={loading}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        {/* Subscribe Button */}
        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          style={{ backgroundColor: org?.brand_color || '#3B82F6' }}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Subscribing...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4" />
              Subscribe
            </>
          )}
        </button>
      </form>

      {/* Privacy Note */}
      <p className="text-xs text-gray-500 text-center mt-4">
        We respect your privacy. Unsubscribe at any time.
      </p>

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
