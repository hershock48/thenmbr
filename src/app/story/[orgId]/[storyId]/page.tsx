'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import StoryDisplay from '@/components/StoryDisplay'
import { Nonprofit } from '@/types'

export default function StoryPage() {
  const params = useParams()
  const [org, setOrg] = useState<Nonprofit | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const orgId = params.orgId as string
  const storyId = params.storyId as string

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

  const handleSubscribe = (email: string, storyId: string) => {
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

  return (
    <StoryDisplay
      orgId={orgId}
      storyId={storyId}
      org={org}
      onSubscribe={handleSubscribe}
      onDonate={handleDonate}
    />
  )
}
