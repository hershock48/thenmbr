'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Heart, Users, DollarSign, ExternalLink, Copy, Check, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function DemoPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  
  const demoOrgId = 'demo-org-123'
  
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">#</span>
                </div>
              </div>
              <span className="text-xl font-bold text-gray-900">NMBR Platform</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-full px-4 py-2 mb-6">
              <Heart className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Live Demo</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Try Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Widgets</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              See how donors can search for stories, subscribe to updates, and make donations. 
              <strong className="text-blue-600"> Try searching for NMBR codes: 1, 2, or 3</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href={`/widget?org=${demoOrgId}&type=story-search`}>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  <Search className="w-5 h-5 mr-2" />
                  Try Live Widget
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline"
                className="px-8 py-4 text-lg border-2"
                onClick={() => {
                  const url = `${window.location.origin}/widget?org=${demoOrgId}&type=story-search`
                  copyToClipboard(url, 'widget')
                }}
              >
                {copiedCode === 'widget' ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
                Copy Widget URL
              </Button>
            </div>

            {/* Live Widget Preview */}
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-2xl border-0">
                <CardHeader className="bg-gray-50">
                  <CardTitle className="text-center text-2xl">Live Widget Preview</CardTitle>
                  <CardDescription className="text-center text-lg">
                    This is how the widget looks on your website. Try searching for NMBR codes: <strong>1</strong>, <strong>2</strong>, or <strong>3</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="bg-white rounded-lg overflow-hidden">
                    <iframe 
                      src={`/widget?org=${demoOrgId}&type=story-search`}
                      className="w-full h-[600px] border-0"
                      title="NMBR Widget Preview"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Widget Types */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Story Search</CardTitle>
                <CardDescription className="text-lg">
                  Donors search by NMBR code to find their impact story
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span>Search by NMBR code</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span>Story details with photos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span>Progress tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span>Subscribe to updates</span>
                  </li>
                </ul>
                <Link href={`/widget?org=${demoOrgId}&type=story-search`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Widget
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Donations</CardTitle>
                <CardDescription className="text-lg">
                  One-click donations with Stripe integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                    <span>Stripe payments</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                    <span>Platform fee collection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                    <span>Secure transactions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                    <span>Custom amounts</span>
                  </li>
                </ul>
                <Link href={`/widget?org=${demoOrgId}&type=donate`}>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Widget
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Subscriptions</CardTitle>
                <CardDescription className="text-lg">
                  Email capture for NMBR-specific updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full" />
                    <span>Email collection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full" />
                    <span>NMBR-specific lists</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full" />
                    <span>Auto-tagging</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full" />
                    <span>Analytics tracking</span>
                  </li>
                </ul>
                <Link href={`/widget?org=${demoOrgId}&type=subscribe`}>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Widget
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Embed Code */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-2xl">Integration Code</CardTitle>
              <CardDescription className="text-lg">
                Copy this code to embed the widget on your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`<script src="https://nmbr-widget.vercel.app/nmbr.js"></script>
<div 
  data-nmbr-org="${demoOrgId}" 
  data-nmbr-type="story-search"
  data-nmbr-width="100%"
  data-nmbr-height="600"
></div>`}</pre>
              </div>
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const code = `<script src="https://nmbr-widget.vercel.app/nmbr.js"></script>
<div 
  data-nmbr-org="${demoOrgId}" 
  data-nmbr-type="story-search"
  data-nmbr-width="100%"
  data-nmbr-height="600"
></div>`
                    copyToClipboard(code, 'embed')
                  }}
                  className="flex items-center gap-2"
                >
                  {copiedCode === 'embed' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedCode === 'embed' ? 'Copied!' : 'Copy Code'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join hundreds of nonprofits using NMBR to create deeper donor connections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

          {/* Backend Management System */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-2xl">Nonprofit Management Dashboard</CardTitle>
              <CardDescription className="text-lg">
                See how nonprofits manage their stories, branding, and analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Dashboard Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span>Story Management - Create and edit NMBR stories</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span>Branding Customization - Upload logos and colors</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span>Stripe Integration - Connect payment processing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span>Analytics Dashboard - Track engagement and donations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span>Subscriber Management - View and export email lists</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold mb-4">Try the Dashboard</h4>
                  <p className="text-gray-600 mb-4">
                    Sign up for a free account to access the full nonprofit management system.
                  </p>
                  <div className="space-y-3">
                    <Link href="/signup">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Create Account
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
