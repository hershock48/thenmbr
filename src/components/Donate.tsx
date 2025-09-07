'use client'

import { useState } from 'react'
import { Heart, CreditCard } from 'lucide-react'
import { Nonprofit } from '@/types'

interface DonateProps {
  orgId: string
  org?: Nonprofit
  storyId?: string
  amount?: number
  onSuccess?: () => void
}

export default function Donate({ orgId, org, storyId, amount = 25, onSuccess }: DonateProps) {
  const [customAmount, setCustomAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const predefinedAmounts = [10, 25, 50, 100, 250, 500]
  const selectedAmount = customAmount ? parseInt(customAmount) : amount

  const handleDonate = async () => {
    if (!selectedAmount || selectedAmount < 1) {
      setError('Please enter a valid amount')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedAmount * 100, // Convert to cents
          org_id: orgId,
          story_id: storyId,
          success_url: window.location.href + '?donation=success',
          cancel_url: window.location.href + '?donation=canceled'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create donation')
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Donation failed')
      setLoading(false)
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
          className="text-2xl font-bold mb-2"
          style={{ color: org?.brand_color || '#3B82F6' }}
        >
          Make a Difference
        </h2>
        <p className="text-gray-600 text-base">
          Your donation directly supports {org?.name || 'this cause'} and helps create lasting impact
        </p>
      </div>

      {/* Amount Selection */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Select Amount</h3>
        
        {/* Predefined amounts */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {predefinedAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => {
                setCustomAmount('')
                setError('')
              }}
              className={`px-3 py-2 text-sm rounded-lg border ${
                !customAmount && selectedAmount === amt
                  ? 'text-white'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{
                backgroundColor: !customAmount && selectedAmount === amt 
                  ? (org?.brand_color || '#3B82F6') 
                  : 'transparent',
                borderColor: !customAmount && selectedAmount === amt 
                  ? (org?.brand_color || '#3B82F6') 
                  : undefined
              }}
            >
              ${amt}
            </button>
          ))}
        </div>

        {/* Custom amount */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value)
              setError('')
            }}
            placeholder="Custom amount"
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            style={{ 
              borderColor: org?.brand_color || '#3B82F6',
              '--tw-ring-color': org?.brand_color || '#3B82F6'
            } as React.CSSProperties}
            min="1"
          />
        </div>
      </div>

      {/* Donation Summary */}
      {selectedAmount > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-700 font-medium">Your Donation</span>
            <span className="font-bold text-lg">${selectedAmount}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
            <span>Processing Fee (5%)</span>
            <span>${(selectedAmount * 0.05).toFixed(2)}</span>
          </div>
          <div className="border-t border-blue-200 mt-2 pt-2">
            <div className="flex justify-between items-center font-semibold text-gray-800">
              <span>Total Charged</span>
              <span>${(selectedAmount * 1.05).toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-600">
            <p>✓ 100% of your donation goes to {org?.name || 'the cause'}</p>
            <p>✓ Secure payment processing</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
      )}

      {/* Donate Button */}
      <button
        onClick={handleDonate}
        disabled={loading || !selectedAmount || selectedAmount < 1}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        style={{ backgroundColor: org?.brand_color || '#3B82F6' }}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4" />
            Donate ${selectedAmount}
          </>
        )}
      </button>

      {/* Security Note */}
      <p className="text-xs text-gray-500 text-center mt-4">
        Secure payment powered by Stripe
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
