'use client'

import { useState } from 'react'
import { CheckCircle, Copy, ExternalLink, Code, Share2 } from 'lucide-react'

interface QuickStartGuideProps {
  orgId: string
  orgName: string
}

export default function QuickStartGuide({ orgId, orgName }: QuickStartGuideProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const steps = [
    {
      id: 1,
      title: 'Create Your First Story',
      description: 'Add a NMBR story with photos and descriptions',
      action: 'Go to Stories',
      href: '/dashboard/stories/new',
      icon: '📝'
    },
    {
      id: 2,
      title: 'Customize Your Branding',
      description: 'Upload your logo and set your colors',
      action: 'Go to Branding',
      href: '/dashboard/branding',
      icon: '🎨'
    },
    {
      id: 3,
      title: 'Connect Stripe Account',
      description: 'Set up payments to receive donations',
      action: 'Go to Payments',
      href: '/dashboard/payments',
      icon: '💳'
    },
    {
      id: 4,
      title: 'Preview Your Widget',
      description: 'Test how your widget looks to donors',
      action: 'Go to Preview',
      href: '/dashboard/preview',
      icon: '👁️'
    },
    {
      id: 5,
      title: 'Get Embed Code',
      description: 'Copy the code to add to your website',
      action: 'Copy Code',
      href: null,
      icon: '📋'
    }
  ]

  const embedCode = `<!-- NMBR Widget -->
<script src="${typeof window !== 'undefined' ? window.location.origin : 'https://app.thenmbr.com'}/nmbr.js"></script>
<div 
  data-nmbr-org="${orgId}" 
  data-nmbr-type="story-search"
></div>
<!-- End NMBR Widget -->`

  const copyToClipboard = async (text: string, stepId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(stepId)
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Start Guide</h3>
        <p className="text-sm text-gray-600 mb-6">
          Get your NMBR widget up and running in just a few steps
        </p>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <span className="text-sm font-medium text-blue-600">{step.id}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{step.title}</h4>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {step.href ? (
                      <a
                        href={step.href}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        {step.action}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    ) : (
                      <button
                        onClick={() => copyToClipboard(embedCode, step.id.toString())}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        {copied === step.id.toString() ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" />
                            {step.action}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Embed Code Preview */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Your Embed Code</h4>
          <div className="bg-gray-100 rounded-lg p-3">
            <pre className="text-xs text-gray-800 whitespace-pre-wrap overflow-x-auto">
              {embedCode}
            </pre>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Copy this code and paste it into your website where you want the widget to appear.
          </p>
        </div>
      </div>
    </div>
  )
}
