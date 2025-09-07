'use client'

import { useEffect } from 'react'

export default function DemoPage() {
  useEffect(() => {
    // Load the widget script
    const script = document.createElement('script')
    script.src = '/nmbr.js'
    script.async = true
    document.head.appendChild(script)

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="/nmbr.js"]')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            NMBR Widget Platform
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Connect donors with impact stories through beautiful, branded widgets
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-blue-800 text-sm">
              <strong>Try it:</strong> Search for "STORY001", "STORY002", "STORY003", "STORY004", or "STORY005" 
              to see how donors can connect with specific impact stories.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Story Search Widget */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Story Search Widget</h2>
                      <div 
            id="story-search-demo"
            data-nmbr-org="550e8400-e29b-41d4-a716-446655440000"
            data-nmbr-type="story-search"
            data-nmbr-powered="true"
            style={{ minHeight: '400px' }}
          ></div>
          </div>

          {/* Donate Widget */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Donate Widget</h2>
                      <div 
            id="donate-demo"
            data-nmbr-org="550e8400-e29b-41d4-a716-446655440000"
            data-nmbr-type="donate"
            data-nmbr-amount="25"
            data-nmbr-powered="true"
            style={{ minHeight: '500px' }}
          ></div>
          </div>

          {/* Subscribe Widget */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Subscribe Widget</h2>
                      <div 
            id="subscribe-demo"
            data-nmbr-org="550e8400-e29b-41d4-a716-446655440000"
            data-nmbr-type="subscribe"
            data-nmbr-powered="true"
            style={{ minHeight: '300px' }}
          ></div>
          </div>

          {/* Integration Code Example */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Integration Code</h2>
            <div className="bg-gray-900 rounded-lg p-4 text-sm text-gray-100 overflow-x-auto">
              <pre>{`<!-- Add this to your website -->
<script src="https://app.thenmbr.com/nmbr.js"></script>

<!-- Story Search Widget -->
<div 
  data-nmbr-org="550e8400-e29b-41d4-a716-446655440000"
  data-nmbr-type="story-search"
  data-nmbr-powered="true"
  style="width: 100%; min-height: 400px;"
></div>

<!-- Donate Widget -->
<div 
  data-nmbr-org="550e8400-e29b-41d4-a716-446655440000"
  data-nmbr-type="donate"
  data-nmbr-amount="25"
  data-nmbr-powered="true"
  style="width: 100%; min-height: 500px;"
></div>

<!-- Subscribe Widget -->
<div 
  data-nmbr-org="550e8400-e29b-41d4-a716-446655440000"
  data-nmbr-type="subscribe"
  data-nmbr-powered="true"
  style="width: 100%; min-height: 300px;"
></div>`}</pre>
            </div>
          </div>
        </div>

        {/* Manual Initialization Example */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Manual Initialization</h2>
          <div className="bg-gray-900 rounded-lg p-4 text-sm text-gray-100 overflow-x-auto">
            <pre>{`// Manual widget initialization
<script>
  // Wait for NMBR to load
  window.addEventListener('load', function() {
    if (window.NMBR) {
      // Initialize story search widget
      window.NMBR.init('my-story-widget', {
        org: '550e8400-e29b-41d4-a716-446655440000',
        type: 'story-search',
        powered: true
      });

      // Initialize donate widget
      window.NMBR.init('my-donate-widget', {
        org: '550e8400-e29b-41d4-a716-446655440000',
        type: 'donate',
        amount: 50,
        powered: true
      });

      // Initialize subscribe widget
      window.NMBR.init('my-subscribe-widget', {
        org: '550e8400-e29b-41d4-a716-446655440000',
        type: 'subscribe',
        powered: true
      });
    }
  });
</script>`}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
