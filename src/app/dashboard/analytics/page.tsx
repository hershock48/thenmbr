'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { 
  DollarSign, 
  Users, 
  Eye, 
  Heart, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import SimpleChart from '@/components/SimpleChart'

interface AnalyticsData {
  overview: {
    total_donations: number
    total_amount: number
    total_subscribers: number
    total_story_views: number
    avg_donation: number
    conversion_rate: number
  }
  donations_over_time: Array<{
    date: string
    amount: number
    count: number
  }>
  top_stories: Array<{
    id: string
    title: string
    nmbr_code: string
    donations: number
    amount: number
    views: number
  }>
  recent_activity: Array<{
    type: 'donation' | 'subscription' | 'story_view'
    description: string
    amount?: number
    created_at: string
  }>
  monthly_stats: Array<{
    month: string
    donations: number
    amount: number
    subscribers: number
  }>
}

export default function AnalyticsPage() {
  const { org } = useAuth()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [error, setError] = useState('')

  useEffect(() => {
    if (org?.id) {
      fetchAnalytics()
    }
  }, [org?.id, timeRange])

  const fetchAnalytics = async () => {
    if (!org?.id) return

    try {
      // Calculate date range
      const now = new Date()
      const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365
      const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)

      // Fetch donations
      const { data: donations, error: donationsError } = await supabase
        .from('donations')
        .select(`
          id,
          amount,
          created_at,
          stories (
            id,
            title,
            nmbr_code
          )
        `)
        .eq('org_id', org.id)
        .eq('status', 'succeeded')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })

      if (donationsError) throw donationsError

      // Fetch subscribers
      const { data: subscribers, error: subscribersError } = await supabase
        .from('subscribers')
        .select('id, created_at')
        .eq('org_id', org.id)
        .gte('created_at', startDate.toISOString())

      if (subscribersError) throw subscribersError

      // Fetch stories for views (mock data for now)
      const { data: stories, error: storiesError } = await supabase
        .from('stories')
        .select('id, title, nmbr_code')
        .eq('org_id', org.id)

      if (storiesError) throw storiesError

      // Process data
      const totalAmount = donations?.reduce((sum, d) => sum + d.amount, 0) || 0
      const totalDonations = donations?.length || 0
      const totalSubscribers = subscribers?.length || 0
      const avgDonation = totalDonations > 0 ? totalAmount / totalDonations : 0

      // Group donations by date
      const donationsByDate = new Map<string, { amount: number; count: number }>()
      donations?.forEach(donation => {
        const date = new Date(donation.created_at).toISOString().split('T')[0]
        const existing = donationsByDate.get(date) || { amount: 0, count: 0 }
        donationsByDate.set(date, {
          amount: existing.amount + donation.amount,
          count: existing.count + 1
        })
      })

      const donationsOverTime = Array.from(donationsByDate.entries())
        .map(([date, data]) => ({
          date,
          amount: data.amount / 100, // Convert from cents
          count: data.count
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      // Top performing stories
      const storyStats = new Map<string, { title: string; nmbr_code: string; donations: number; amount: number; views: number }>()
      
      stories?.forEach(story => {
        storyStats.set(story.id, {
          title: story.title,
          nmbr_code: story.nmbr_code,
          donations: 0,
          amount: 0,
          views: Math.floor(Math.random() * 100) + 10 // Mock views for now
        })
      })

      donations?.forEach(donation => {
        if (donation.stories) {
          const existing = storyStats.get(donation.stories.id) || { title: '', nmbr_code: '', donations: 0, amount: 0, views: 0 }
          storyStats.set(donation.stories.id, {
            ...existing,
            donations: existing.donations + 1,
            amount: existing.amount + donation.amount
          })
        }
      })

      const topStories = Array.from(storyStats.entries())
        .map(([id, stats]) => ({ id, ...stats, amount: stats.amount / 100 }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5)

      // Recent activity
      const recentActivity = [
        ...(donations?.slice(0, 5).map(d => ({
          type: 'donation' as const,
          description: `$${(d.amount / 100).toFixed(2)} donation for ${d.stories?.title || 'Unknown Story'}`,
          amount: d.amount / 100,
          created_at: d.created_at
        })) || []),
        ...(subscribers?.slice(0, 3).map(s => ({
          type: 'subscription' as const,
          description: 'New subscriber joined',
          created_at: s.created_at
        })) || [])
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 8)

      // Monthly stats (mock data for now)
      const monthlyStats = Array.from({ length: 6 }, (_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        return {
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          donations: Math.floor(Math.random() * 20) + 5,
          amount: Math.floor(Math.random() * 2000) + 500,
          subscribers: Math.floor(Math.random() * 15) + 3
        }
      }).reverse()

      setData({
        overview: {
          total_donations: totalDonations,
          total_amount: totalAmount / 100,
          total_subscribers: totalSubscribers,
          total_story_views: topStories.reduce((sum, s) => sum + s.views, 0),
          avg_donation: avgDonation / 100,
          conversion_rate: totalSubscribers > 0 ? (totalDonations / totalSubscribers) * 100 : 0
        },
        donations_over_time: donationsOverTime,
        top_stories: topStories,
        recent_activity: recentActivity,
        monthly_stats: monthlyStats
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track your performance and optimize your fundraising
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d' | '1y')}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Raised</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatCurrency(data.overview.total_amount)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Donations</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatNumber(data.overview.total_donations)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Subscribers</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatNumber(data.overview.total_subscribers)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Eye className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Story Views</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatNumber(data.overview.total_story_views)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg Donation</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatCurrency(data.overview.avg_donation)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Conversion Rate</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {data.overview.conversion_rate.toFixed(1)}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Activity className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Platform Fee</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatCurrency(data.overview.total_amount * 0.05)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Donations Over Time Chart */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Donations Over Time</h3>
              {data.donations_over_time.length > 0 ? (
                <SimpleChart 
                  data={data.donations_over_time} 
                  title="Daily Donations"
                  height={200}
                />
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No donation data available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Top Performing Stories */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Stories</h3>
              <div className="space-y-4">
                {data.top_stories.map((story, index) => (
                  <div key={story.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {story.title}
                      </p>
                      <p className="text-sm text-gray-500">NMBR {story.nmbr_code}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(story.amount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {story.donations} donations
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {data.recent_activity.map((activity, index) => (
                  <li key={index}>
                    <div className="relative pb-8">
                      {index !== data.recent_activity.length - 1 && (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            activity.type === 'donation' 
                              ? 'bg-green-500' 
                              : activity.type === 'subscription'
                              ? 'bg-blue-500'
                              : 'bg-purple-500'
                          }`}>
                            {activity.type === 'donation' ? (
                              <Heart className="h-4 w-4 text-white" />
                            ) : activity.type === 'subscription' ? (
                              <Users className="h-4 w-4 text-white" />
                            ) : (
                              <Eye className="h-4 w-4 text-white" />
                            )}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">{activity.description}</p>
                            {activity.amount && (
                              <p className="text-sm font-medium text-gray-900">
                                {formatCurrency(activity.amount)}
                              </p>
                            )}
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {new Date(activity.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
