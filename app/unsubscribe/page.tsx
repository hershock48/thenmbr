'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Heart, Mail, ArrowLeft } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

interface UnsubscribeData {
  subscriber: {
    id: string
    email: string
    first_name: string
    last_name: string
  }
  story: {
    id: string
    title: string
    nmbr_code: string
  }
  organization: {
    name: string
    website: string
  }
}

export default function UnsubscribePage() {
  const searchParams = useSearchParams()
  const [unsubscribeData, setUnsubscribeData] = useState<UnsubscribeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const subscriberId = searchParams.get('subscriber_id')
    const nmbrId = searchParams.get('nmbr_id')

    if (subscriberId && nmbrId) {
      handleUnsubscribe(subscriberId, nmbrId)
    } else {
      setError('Invalid unsubscribe link')
      setLoading(false)
    }
  }, [searchParams])

  const handleUnsubscribe = async (subscriberId: string, nmbrId: string) => {
    try {
      const response = await fetch('/api/subscribers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriberId,
          nmbrId
        })
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(true)
        // In a real app, you'd fetch the actual subscriber and story data
        setUnsubscribeData({
          subscriber: {
            id: subscriberId,
            email: 'subscriber@example.com',
            first_name: 'Friend',
            last_name: ''
          },
          story: {
            id: nmbrId,
            title: 'Your Impact Story',
            nmbr_code: 'HOPE001'
          },
          organization: {
            name: 'Hope Foundation',
            website: 'https://hopefoundation.org'
          }
        })
      } else {
        setError(result.error || 'Failed to unsubscribe')
      }
    } catch (error) {
      console.error('Unsubscribe error:', error)
      setError('Failed to unsubscribe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-cyan-600 animate-pulse" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing...</h2>
            <p className="text-gray-600">Please wait while we process your unsubscribe request.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
            {success ? (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {success ? 'Successfully Unsubscribed' : 'Unsubscribe Failed'}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {success 
              ? 'You have been unsubscribed from story updates.' 
              : 'There was an error processing your unsubscribe request.'
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {success && unsubscribeData ? (
            <>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Story Details</span>
                </div>
                <div className="text-sm text-gray-700">
                  <p><strong>Story:</strong> {unsubscribeData.story.title}</p>
                  <p><strong>NMBR Code:</strong> #{unsubscribeData.story.nmbr_code}</p>
                  <p><strong>Organization:</strong> {unsubscribeData.organization.name}</p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Hi {unsubscribeData.subscriber.first_name}, you will no longer receive updates about this specific story.
                </p>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    You can still:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Visit the story page anytime</li>
                    <li>• Subscribe to other stories</li>
                    <li>• Make donations directly</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link href={`/widget/${unsubscribeData.organization.website}`}>
                  <Button className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white">
                    <Heart className="w-4 h-4 mr-2" />
                    Visit Story Page
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-red-600">
                {error || 'An unexpected error occurred.'}
              </p>
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => window.location.reload()} 
                  className="w-full"
                >
                  Try Again
                </Button>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          )}

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              If you have any questions, please contact{' '}
              <a 
                href={`mailto:support@${unsubscribeData?.organization.website || 'thenmbr.com'}`}
                className="text-cyan-600 hover:text-cyan-700"
              >
                support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
