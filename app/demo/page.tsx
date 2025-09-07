import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Heart, Users, DollarSign, ExternalLink, Copy, Check } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function DemoPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  
  const demoOrgId = 'demo-org-123' // Use our actual demo org ID
  
  const widgetTypes = [
    {
      name: 'Story Search Widget',
      description: 'Let donors search for stories by NMBR code',
      type: 'story-search',
      icon: Search,
      color: 'blue',
      features: ['Search by NMBR code', 'Story details with photos', 'Progress tracking', 'Subscribe to updates']
    },
    {
      name: 'Donate Widget',
      description: 'One-click donations with Stripe integration',
      type: 'donate',
      icon: DollarSign,
      color: 'green',
      features: ['Stripe payments', 'Platform fee collection', 'Secure transactions', 'Custom amounts']
    },
    {
      name: 'Subscribe Widget',
      description: 'Email capture for NMBR-specific updates',
      type: 'subscribe',
      icon: Users,
      color: 'purple',
      features: ['Email collection', 'NMBR-specific lists', 'Auto-tagging', 'Analytics tracking']
    }
  ]

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const embedCode = `<script src="https://nmbr-widget.vercel.app/nmbr.js"></script>
<div 
  data-nmbr-org="${demoOrgId}" 
  data-nmbr-type="story-search"
  data-nmbr-width="100%"
  data-nmbr-height="600"
></div>`

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-primary-foreground font-bold text-lg">N</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-xs">#</span>
                </div>
              </div>
              <span className="text-xl font-bold text-foreground">NMBR Platform</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 mb-6">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Live Demo</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Widget <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Demo</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Test our embeddable widgets and see how they work on your website. Try searching for NMBR codes: <strong>1</strong>, <strong>2</strong>, or <strong>3</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/widget?org=${demoOrgId}&type=story-search`}>
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Search className="w-5 h-5 mr-2" />
                  Try Live Widget
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => copyToClipboard(embedCode, 'embed')}
              >
                {copiedCode === 'embed' ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
                Copy Embed Code
              </Button>
            </div>
          </div>

          {/* Widget Types */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {widgetTypes.map((widget) => (
              <Card key={widget.type} className="group hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <widget.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-foreground">{widget.name}</CardTitle>
                      <CardDescription className="text-muted-foreground">{widget.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {widget.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex gap-3 pt-4">
                    <Link href={`/widget?org=${demoOrgId}&type=${widget.type}`} className="flex-1">
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Widget
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const url = `${window.location.origin}/widget?org=${demoOrgId}&type=${widget.type}`
                        copyToClipboard(url, widget.type)
                      }}
                      className="px-3"
                    >
                      {copiedCode === widget.type ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Live Preview Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Live Preview</CardTitle>
              <CardDescription className="text-lg">
                See how the widget looks embedded in a real webpage. Try searching for NMBR codes: <strong>1</strong>, <strong>2</strong>, or <strong>3</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="ml-4 text-sm text-gray-600">your-website.com</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Welcome to Our Impact Stories</h3>
                      <p className="text-gray-600 mb-6">
                        Discover the stories behind the numbers. Search for your NMBR code to see how your support is making a difference.
                      </p>
                      
                      {/* Embedded Widget */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <iframe 
                          src={`/widget?org=${demoOrgId}&type=story-search`}
                          className="w-full h-[500px]"
                          title="NMBR Widget Preview"
                        />
                      </div>
                      
                      <p className="text-sm text-gray-500 mt-4 text-center">
                        ↑ This widget is fully functional and responsive
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Embed Code Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Integration Code</CardTitle>
              <CardDescription className="text-lg">
                Copy and paste this code into your website to embed the NMBR widget
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm overflow-x-auto">
                <pre className="whitespace-pre-wrap">{embedCode}</pre>
              </div>
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => copyToClipboard(embedCode, 'code')}
                  className="flex items-center gap-2"
                >
                  {copiedCode === 'code' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedCode === 'code' ? 'Copied!' : 'Copy Code'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center bg-card rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of nonprofits already using NMBR to create deeper donor connections and increase giving.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
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
