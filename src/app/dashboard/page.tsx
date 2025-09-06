'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { BarChart3, Users, Heart, Mail, Eye, Plus } from 'lucide-react'
import Link from 'next/link'
import QuickStartGuide from '@/components/QuickStartGuide'

interface DashboardStats {
  totalStories: number
  totalDonations: number
  totalSubscribers: number
  totalRevenue: number
}

export default function DashboardPage() {
  const { user, org } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalStories: 0,
    totalDonations: 0,
    totalSubscribers: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (org?.id) {
      fetchStats()
    }
  }, [org?.id])

  const fetchStats = async () => {
    if (!org?.id) return

    try {
      // Fetch stories count
      const { count: storiesCount } = await supabase
        .from('stories')
        .select('*', { count: 'exact', head: true })
        .eq('org_id', org.id)

      // Fetch donations count and revenue
      const { data: donations } = await supabase
        .from('donations')
        .select('amount, platform_fee')
        .eq('org_id', org.id)
        .eq('status', 'succeeded')

      // Fetch subscribers count
      const { count: subscribersCount } = await supabase
        .from('subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('org_id', org.id)

      const totalDonations = donations?.length || 0
      const totalRevenue = donations?.reduce((sum, donation) => sum + donation.amount, 0) || 0

      setStats({
        totalStories: storiesCount || 0,
        totalDonations,
        totalSubscribers: subscribersCount || 0,
        totalRevenue: totalRevenue / 100 // Convert from cents to dollars
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {org?.name}! Here's what's happening with your NMBR widgets.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Stories
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalStories}
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
                  <Heart className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Donations
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalDonations}
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
                  <Mail className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Subscribers
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalSubscribers}
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
                  <BarChart3 className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Revenue
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      ${stats.totalRevenue.toFixed(2)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <Link
            href="/dashboard/stories"
            className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                <Users className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium">
                <span className="absolute inset-0" aria-hidden="true" />
                Manage Stories
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Create, edit, and organize your NMBR stories and impact narratives.
              </p>
            </div>
            <span className="absolute top-6 right-6 text-gray-300 group-hover:text-gray-400" aria-hidden="true">
              <Plus className="h-6 w-6" />
            </span>
          </Link>

          <Link
            href="/dashboard/branding"
            className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                <Eye className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium">
                <span className="absolute inset-0" aria-hidden="true" />
                Customize Branding
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Upload your logo, set colors, and customize your widget appearance.
              </p>
            </div>
            <span className="absolute top-6 right-6 text-gray-300 group-hover:text-gray-400" aria-hidden="true">
              <Plus className="h-6 w-6" />
            </span>
          </Link>

          <Link
            href="/dashboard/analytics"
            className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                <BarChart3 className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium">
                <span className="absolute inset-0" aria-hidden="true" />
                View Analytics
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Track donations, engagement, and performance metrics.
              </p>
            </div>
            <span className="absolute top-6 right-6 text-gray-300 group-hover:text-gray-400" aria-hidden="true">
              <Plus className="h-6 w-6" />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Start Guide */}
          <div>
            <QuickStartGuide 
              orgId={org?.id || ''} 
              orgName={org?.name || 'Your Organization'} 
            />
          </div>

          {/* Widget Preview */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Your Widget Preview
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                This is how your widget appears to donors. Customize the branding to match your organization.
              </p>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <iframe
                  src={`/widget?org=${org?.id}&type=story-search`}
                  className="w-full h-96 border-0 rounded"
                  title="Widget Preview"
                />
              </div>
              <div className="mt-4">
                <Link
                  href="/dashboard/preview"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Full Preview & Embed Code
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
