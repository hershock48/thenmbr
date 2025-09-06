'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { CreditCard, ExternalLink, CheckCircle, AlertCircle, DollarSign, TrendingUp, Users, Calendar } from 'lucide-react'

interface StripeAccount {
  id: string
  business_profile: {
    name: string
    url?: string
  }
  country: string
  default_currency: string
  details_submitted: boolean
  charges_enabled: boolean
  payouts_enabled: boolean
  created: number
}

interface DonationStats {
  total_donations: number
  total_amount: number
  platform_fees: number
  recent_donations: Array<{
    id: string
    amount: number
    donor_email: string
    story_title: string
    created_at: string
  }>
}

export default function PaymentsPage() {
  const { org } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stripeAccount, setStripeAccount] = useState<StripeAccount | null>(null)
  const [stats, setStats] = useState<DonationStats | null>(null)
  const [error, setError] = useState('')
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    if (org?.id) {
      fetchStripeData()
    }
  }, [org?.id])

  const fetchStripeData = async () => {
    if (!org?.id) return

    try {
      // Fetch Stripe account info
      if (org.stripe_account_id) {
        const response = await fetch(`/api/stripe/account?account_id=${org.stripe_account_id}`)
        if (response.ok) {
          const accountData = await response.json()
          setStripeAccount(accountData)
        }
      }

      // Fetch donation stats
      const { data: donations, error: donationsError } = await supabase
        .from('donations')
        .select(`
          id,
          amount,
          donor_email,
          created_at,
          stories (
            title
          )
        `)
        .eq('org_id', org.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (donationsError) throw donationsError

      const totalAmount = donations?.reduce((sum, d) => sum + d.amount, 0) || 0
      const platformFees = totalAmount * 0.05 // 5% platform fee

      setStats({
        total_donations: donations?.length || 0,
        total_amount: totalAmount / 100, // Convert from cents
        platform_fees: platformFees / 100,
        recent_donations: donations?.map(d => ({
          id: d.id,
          amount: d.amount / 100,
          donor_email: d.donor_email,
          story_title: d.stories?.title || 'Unknown Story',
          created_at: d.created_at
        })) || []
      })
    } catch (error) {
      console.error('Error fetching Stripe data:', error)
      setError('Failed to load payment data')
    } finally {
      setLoading(false)
    }
  }

  const handleConnectStripe = async () => {
    if (!org?.id) return

    setConnecting(true)
    setError('')

    try {
      const response = await fetch('/api/stripe/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          org_id: org.id,
          return_url: `${window.location.origin}/dashboard/payments?connected=true`
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create Stripe connection')
      }

      // Redirect to Stripe Connect
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect Stripe')
      setConnecting(false)
    }
  }

  const handleDisconnectStripe = async () => {
    if (!org?.id || !org.stripe_account_id) return

    if (!confirm('Are you sure you want to disconnect your Stripe account? This will disable donations.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('nonprofits')
        .update({ stripe_account_id: null })
        .eq('id', org.id)

      if (error) throw error

      setStripeAccount(null)
      // Refresh the page to update the org context
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect Stripe')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your Stripe account and view donation analytics
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <div className="text-sm text-red-600">{error}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stripe Account Status */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Stripe Account</h3>
                  {stripeAccount && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </span>
                  )}
                </div>

                {stripeAccount ? (
                  <div className="space-y-4">
                    {/* Account Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Account Name</label>
                        <p className="mt-1 text-sm text-gray-900">{stripeAccount.business_profile.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Country</label>
                        <p className="mt-1 text-sm text-gray-900">{stripeAccount.country.toUpperCase()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Currency</label>
                        <p className="mt-1 text-sm text-gray-900">{stripeAccount.default_currency.toUpperCase()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <div className="mt-1 flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            stripeAccount.charges_enabled 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {stripeAccount.charges_enabled ? 'Charges Enabled' : 'Pending Verification'}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            stripeAccount.payouts_enabled 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {stripeAccount.payouts_enabled ? 'Payouts Enabled' : 'Pending Verification'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Account Actions */}
                    <div className="flex space-x-3 pt-4 border-t border-gray-200">
                      <a
                        href={`https://dashboard.stripe.com/connect/accounts/${stripeAccount.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View in Stripe
                      </a>
                      <a
                        href="/dashboard/payments/test"
                        className="inline-flex items-center px-3 py-2 border border-green-300 shadow-sm text-sm leading-4 font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Test Donation
                      </a>
                      <button
                        onClick={handleDisconnectStripe}
                        className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Stripe Account Connected</h3>
                    <p className="text-gray-500 mb-6">
                      Connect your Stripe account to start accepting donations through your widgets.
                    </p>
                    <button
                      onClick={handleConnectStripe}
                      disabled={connecting}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {connecting ? 'Connecting...' : 'Connect Stripe Account'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Donation Stats */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Donation Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Raised</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        ${stats?.total_amount.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Donations</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {stats?.total_donations || 0}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Platform Fees</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        ${stats?.platform_fees.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Fee Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Platform Fee Structure</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 5% platform fee on all donations</li>
                <li>• Stripe processing fees: ~2.9% + 30¢</li>
                <li>• Nonprofit receives: ~92.1% of donation</li>
                <li>• Platform receives: 5% of donation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Donations */}
        {stats && stats.recent_donations.length > 0 && (
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Donations</h3>
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Donor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Story
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.recent_donations.map((donation) => (
                        <tr key={donation.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${donation.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {donation.donor_email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {donation.story_title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(donation.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
