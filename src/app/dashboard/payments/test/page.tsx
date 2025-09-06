'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { CreditCard, CheckCircle } from 'lucide-react'

export default function TestPaymentsPage() {
  const { org } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const testDonation = async () => {
    if (!org?.id) return

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 1000, // $10.00 in cents
          org_id: org.id,
          donor_email: 'test@example.com',
          success_url: `${window.location.origin}/dashboard/payments?test=success`,
          cancel_url: `${window.location.origin}/dashboard/payments?test=canceled`
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create test donation')
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Test donation failed')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Test Successful!</h2>
          <p className="text-gray-600">
            Your Stripe integration is working correctly.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Stripe Integration</h1>
          
          {!org?.stripe_account_id ? (
            <div className="text-center py-8">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Stripe Account Connected</h3>
              <p className="text-gray-500 mb-6">
                You need to connect your Stripe account before testing donations.
              </p>
              <a
                href="/dashboard/payments"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Connect Stripe Account
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Test Donation</h3>
                <p className="text-gray-600 mb-4">
                  This will create a test donation of $10.00 to verify your Stripe integration is working.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="text-sm text-red-600">{error}</div>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Test Details:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Amount: $10.00</li>
                  <li>• Platform Fee: $0.50 (5%)</li>
                  <li>• Stripe Fee: ~$0.59 (2.9% + 30¢)</li>
                  <li>• Net to Organization: ~$8.91</li>
                </ul>
              </div>

              <button
                onClick={testDonation}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold bg-blue-600"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Creating Test Donation...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Test $10 Donation
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                This will redirect you to Stripe Checkout for testing. You can use test card numbers.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
