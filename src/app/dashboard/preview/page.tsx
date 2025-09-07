'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Nonprofit, Story } from '@/types'
import { 
  Eye, 
  Copy, 
  ExternalLink, 
  Smartphone, 
  Tablet, 
  Monitor,
  RefreshCw,
  CheckCircle,
  Code,
  Share2
} from 'lucide-react'
import StorySearch from '@/components/StorySearch'
import Donate from '@/components/Donate'
import Subscribe from '@/components/Subscribe'

type WidgetType = 'story-search' | 'donate' | 'subscribe'
type DeviceType = 'mobile' | 'tablet' | 'desktop'

export default function PreviewPage() {
  const { org } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stories, setStories] = useState<Story[]>([])
  const [selectedWidget, setSelectedWidget] = useState<WidgetType>('story-search')
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('desktop')
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [testNMBR, setTestNMBR] = useState('')
  const [testAmount, setTestAmount] = useState(25)
  const [copied, setCopied] = useState(false)
  const [showEmbedCode, setShowEmbedCode] = useState(false)

  useEffect(() => {
    if (org?.id) {
      fetchStories()
    }
  }, [org?.id])

  const fetchStories = async () => {
    if (!org?.id) return

    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('org_id', org.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setStories(data || [])
      if (data && data.length > 0) {
        setSelectedStory(data[0])
        setTestNMBR(data[0].nmbr_code)
      }
    } catch (error) {
      console.error('Error fetching stories:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDeviceStyles = () => {
    switch (selectedDevice) {
      case 'mobile':
        return 'max-w-sm mx-auto'
      case 'tablet':
        return 'max-w-2xl mx-auto'
      case 'desktop':
        return 'max-w-4xl mx-auto'
      default:
        return 'max-w-4xl mx-auto'
    }
  }

  const getEmbedCode = () => {
    if (!org?.id) return ''

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://app.thenmbr.com'
    
    return `<!-- NMBR Widget -->
<script src="${baseUrl}/nmbr.js"></script>
<div 
  data-nmbr-org="${org.id}" 
  data-nmbr-type="${selectedWidget}"
  ${selectedWidget === 'story-search' && testNMBR ? `data-nmbr-code="${testNMBR}"` : ''}
  ${selectedWidget === 'donate' && testAmount ? `data-nmbr-amount="${testAmount}"` : ''}
></div>
<!-- End NMBR Widget -->`
  }

  const copyEmbedCode = async () => {
    try {
      await navigator.clipboard.writeText(getEmbedCode())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const copyWidgetUrl = async () => {
    if (!org?.id) return

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://app.thenmbr.com'
    const params = new URLSearchParams({
      org: org.id,
      type: selectedWidget
    })
    
    if (selectedWidget === 'story-search' && testNMBR) {
      params.set('nmbr', testNMBR)
    }
    if (selectedWidget === 'donate' && testAmount) {
      params.set('amount', testAmount.toString())
    }

    const url = `${baseUrl}/widget?${params.toString()}`
    
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleSubscribe = (email: string, storyId: string) => {
    console.log('Test subscription:', { email, storyId })
    alert(`Test subscription: ${email} subscribed to story ${storyId}`)
  }

  const handleDonate = (storyId: string, amount: number) => {
    console.log('Test donation:', { storyId, amount })
    alert(`Test donation: $${amount} for story ${storyId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!org) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Organization not found</h3>
        <p className="mt-1 text-sm text-gray-500">Please make sure you're logged in.</p>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Widget Preview</h1>
          <p className="mt-1 text-sm text-gray-500">
            Test your widgets and get embed codes for your website
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Widget Type Selection */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Widget Type</h3>
                <div className="space-y-3">
                  {[
                    { id: 'story-search', name: 'Story Search', description: 'Search and display stories' },
                    { id: 'donate', name: 'Donate', description: 'Direct donation widget' },
                    { id: 'subscribe', name: 'Subscribe', description: 'Email subscription widget' }
                  ].map((widget) => (
                    <button
                      key={widget.id}
                      onClick={() => setSelectedWidget(widget.id as WidgetType)}
                      className={`w-full text-left p-3 rounded-lg border ${
                        selectedWidget === widget.id
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium">{widget.name}</div>
                      <div className="text-sm text-gray-500">{widget.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Device Preview */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Device Preview</h3>
                <div className="flex space-x-2">
                  {[
                    { id: 'mobile', name: 'Mobile', icon: Smartphone },
                    { id: 'tablet', name: 'Tablet', icon: Tablet },
                    { id: 'desktop', name: 'Desktop', icon: Monitor }
                  ].map((device) => {
                    const Icon = device.icon
                    return (
                      <button
                        key={device.id}
                        onClick={() => setSelectedDevice(device.id as DeviceType)}
                        className={`flex-1 flex flex-col items-center p-3 rounded-lg border ${
                          selectedDevice === device.id
                            ? 'border-blue-500 bg-blue-50 text-blue-900'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <Icon className="h-5 w-5 mb-1" />
                        <span className="text-xs">{device.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Widget Settings */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Widget Settings</h3>
                
                {selectedWidget === 'story-search' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Test NMBR Code
                      </label>
                      <select
                        value={testNMBR}
                        onChange={(e) => setTestNMBR(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a story to test</option>
                        {stories.map((story) => (
                          <option key={story.id} value={story.nmbr_code}>
                            {story.title} (NMBR {story.nmbr_code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {selectedWidget === 'donate' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Amount
                      </label>
                      <input
                        type="number"
                        value={testAmount}
                        onChange={(e) => setTestAmount(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                        step="0.01"
                      />
                    </div>
                  </div>
                )}

                {selectedWidget === 'subscribe' && (
                  <div className="text-sm text-gray-500">
                    <p>Email subscription widget with your organization's branding.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Embed Code */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Embed Code</h3>
                  <button
                    onClick={() => setShowEmbedCode(!showEmbedCode)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {showEmbedCode ? 'Hide' : 'Show'} Code
                  </button>
                </div>
                
                {showEmbedCode && (
                  <div className="space-y-3">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <pre className="text-xs text-gray-800 whitespace-pre-wrap overflow-x-auto">
                        {getEmbedCode()}
                      </pre>
                    </div>
                    <button
                      onClick={copyEmbedCode}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy Embed Code
                        </>
                      )}
                    </button>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={copyWidgetUrl}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    <Share2 className="h-4 w-4" />
                    Copy Widget URL
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Live Preview</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={fetchStories}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Refresh"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    <a
                      href={`/widget?org=${org.id}&type=${selectedWidget}${testNMBR ? `&nmbr=${testNMBR}` : ''}${testAmount ? `&amount=${testAmount}` : ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Open in new tab"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                {/* Preview Container */}
                <div className={`${getDeviceStyles()} bg-gray-100 rounded-lg p-4`}>
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {selectedWidget === 'story-search' && (
                      <StorySearch
                        orgId={org.id}
                        org={org}
                        onSubscribe={handleSubscribe}
                        onDonate={handleDonate}
                      />
                    )}
                    
                    {selectedWidget === 'donate' && (
                      <Donate
                        orgId={org.id}
                        org={org}
                        amount={testAmount}
                        onSuccess={() => alert('Test donation successful!')}
                      />
                    )}
                    
                    {selectedWidget === 'subscribe' && (
                      <Subscribe
                        orgId={org.id}
                        org={org}
                        onSuccess={handleSubscribe}
                      />
                    )}
                  </div>
                </div>

                {/* Device Info */}
                <div className="mt-4 text-center text-sm text-gray-500">
                  Previewing on {selectedDevice === 'mobile' ? 'Mobile' : selectedDevice === 'tablet' ? 'Tablet' : 'Desktop'} view
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
