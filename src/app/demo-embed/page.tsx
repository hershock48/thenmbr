'use client'

import { useState, useEffect } from 'react'
import { Nonprofit } from '@/types'

export default function DemoEmbedPage() {
  const [org, setOrg] = useState<Nonprofit | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Use the demo organization
    const demoOrg: Nonprofit = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Demo Nonprofit',
      logo_url: 'https://via.placeholder.com/200x100/3B82F6/FFFFFF?text=Demo+Org',
      brand_color: '#3B82F6',
      secondary_color: '#1e40af',
      accent_color: '#60a5fa',
      font_family: 'Inter',
      show_powered_by: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    setOrg(demoOrg)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            NMBR Widget Demo
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            See how the NMBR widget looks when embedded in a real website
          </p>
        </div>

        {/* Demo Website Layout */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Website Header */}
          <div className="bg-gray-800 text-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {org?.logo_url && (
                  <img 
                    src={org.logo_url} 
                    alt={org.name}
                    className="h-8"
                  />
                )}
                <h2 className="text-xl font-semibold">{org?.name}</h2>
              </div>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="hover:text-gray-300">About</a>
                <a href="#" className="hover:text-gray-300">Programs</a>
                <a href="#" className="hover:text-gray-300">Get Involved</a>
                <a href="#" className="hover:text-gray-300">Contact</a>
              </nav>
            </div>
          </div>

          {/* Website Content */}
          <div className="px-6 py-8">
            <div className="prose max-w-none">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Make a Difference Today
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Join us in creating positive change in our community. Every contribution, 
                no matter how small, makes a real difference in someone's life.
              </p>
            </div>

            {/* NMBR Widget Embed */}
            <div className="my-12 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  NMBR Widget Embedded Here
                </span>
              </div>
              
              {/* Widget iframe */}
              <div className="max-w-md mx-auto">
                <iframe
                  src={`/widget?org=${org?.id}&type=story-search`}
                  className="w-full h-96 border-0 rounded-lg shadow-sm"
                  title="NMBR Widget"
                />
              </div>
            </div>

            {/* More Website Content */}
            <div className="prose max-w-none">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Impact
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Through the support of generous donors like you, we've been able to:
              </p>
              <ul className="list-disc list-inside text-lg text-gray-600 space-y-2">
                <li>Help over 1,000 families in need</li>
                <li>Provide educational resources to 500+ children</li>
                <li>Support 200+ community programs</li>
                <li>Create lasting change in our neighborhoods</li>
              </ul>
            </div>
          </div>

          {/* Website Footer */}
          <div className="bg-gray-100 px-6 py-8">
            <div className="text-center text-gray-600">
              <p>&copy; 2024 {org?.name}. All rights reserved.</p>
              <p className="mt-2 text-sm">
                This is a demo website showing how the NMBR widget integrates seamlessly.
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            How to Add This Widget to Your Website
          </h3>
          <ol className="list-decimal list-inside text-blue-800 space-y-2">
            <li>Copy the embed code from your dashboard</li>
            <li>Paste it into your website's HTML where you want the widget to appear</li>
            <li>The widget will automatically load with your organization's branding</li>
            <li>Donors can search for stories and make donations directly</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
