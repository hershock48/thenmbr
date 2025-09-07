'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import StorySearch from '@/components/StorySearch'
import Donate from '@/components/Donate'
import Subscribe from '@/components/Subscribe'
import { Nonprofit } from '@/types'

function WidgetContent() {
  const searchParams = useSearchParams()
  const [org, setOrg] = useState<Nonprofit | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const orgId = searchParams.get('org')
  const type = searchParams.get('type') as 'story-search' | 'donate' | 'subscribe'
  const nmbr = searchParams.get('nmbr')
  const amount = searchParams.get('amount') ? parseInt(searchParams.get('amount')!) : undefined
  const showPoweredBy = searchParams.get('powered') !== 'false'

  useEffect(() => {
    if (!orgId) {
      setError('Organization ID is required')
      setLoading(false)
      return
    }

    const fetchOrg = async () => {
      try {
        const response = await fetch(`/api/org/${orgId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Organization not found')
        }

        setOrg(data.org)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load organization')
      } finally {
        setLoading(false)
      }
    }

    fetchOrg()
  }, [orgId])

  const handleSubscribe = (email: string, storyId?: string) => {
    console.log('Subscribed:', { email, storyId, orgId })
  }

  const handleDonate = (storyId: string, amount: number) => {
    console.log('Donate:', { storyId, amount, orgId })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">Error</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  const renderWidget = () => {
    switch (type) {
      case 'story-search':
        return (
          <StorySearch
            orgId={orgId!}
            org={org}
            onSubscribe={handleSubscribe}
            onDonate={handleDonate}
          />
        )
      case 'donate':
        return (
          <Donate
            orgId={orgId!}
            org={org}
            amount={amount}
            onSuccess={() => console.log('Donation successful')}
          />
        )
      case 'subscribe':
        return (
          <Subscribe
            orgId={orgId!}
            org={org}
            onSuccess={handleSubscribe}
          />
        )
      default:
        return (
          <div className="text-center">
            <div className="text-red-500 text-lg mb-2">Invalid Widget Type</div>
            <p className="text-gray-600">Supported types: story-search, donate, subscribe</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {renderWidget()}
        
        {/* Powered by footer */}
        {showPoweredBy && (
          <div className="text-center mt-8">
            <p className="text-xs text-gray-500">
              Powered by{' '}
              <a 
                href="https://thenmbr.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                The NMBR
              </a>
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
