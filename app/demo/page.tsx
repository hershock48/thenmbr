import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Heart, Users, DollarSign, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function DemoPage() {
  const demoOrgId = '550e8400-e29b-41d4-a716-446655440000'
  
  const widgetTypes = [
    {
      name: 'Story Search Widget',
      description: 'Search for stories by NMBR code',
      type: 'story-search',
      icon: Search,
      color: 'blue'
    },
    {
      name: 'Donate Widget',
      description: 'Direct donation widget',
      type: 'donate',
      icon: DollarSign,
      color: 'green'
    },
    {
      name: 'Subscribe Widget',
      description: 'Email subscription widget',
      type: 'subscribe',
      icon: Users,
      color: 'purple'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 mb-6">
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Live Demo</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Widget <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Demo</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Test our embeddable widgets with different configurations and see how they look on your website.
          </p>
        </div>

        {/* Widget Types */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {widgetTypes.map((widget) => (
            <Card key={widget.type} className="hover:shadow-2xl transition-all duration-300 border-0 shadow-xl bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <widget.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-foreground">{widget.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">{widget.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Link href={`/widget?org=${demoOrgId}&type=${widget.type}`} className="flex-1">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Widget
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const url = `${window.location.origin}/widget?org=${demoOrgId}&type=${widget.type}`
                      navigator.clipboard.writeText(url)
                      alert('Widget URL copied to clipboard!')
                    }}
                    className="px-3"
                  >
                    Copy
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg font-mono">
                  <code>?org={demoOrgId}&type={widget.type}</code>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Embed Code Example */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Embed Code</CardTitle>
            <CardDescription>
              Use this code to embed the widget on your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`<script src="https://your-domain.com/nmbr.js"></script>
<div 
  data-nmbr-org="${demoOrgId}" 
  data-nmbr-type="story-search"
  data-nmbr-width="400"
  data-nmbr-height="600"
></div>`}</pre>
            </div>
          </CardContent>
        </Card>

        {/* Live Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>
              See how the widget looks embedded in a webpage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold mb-4">Your Website</h3>
                <p className="text-gray-600 mb-6">
                  This is where your content would go. The widget will appear below:
                </p>
                
                {/* Embedded Widget Preview */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <iframe 
                    src={`/widget?org=${demoOrgId}&type=story-search`}
                    className="w-full h-96"
                    title="Widget Preview"
                  />
                </div>
                
                <p className="text-sm text-gray-500 mt-4">
                  The widget above is fully functional and responsive
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Dashboard */}
        <div className="text-center mt-12">
          <Link href="/dashboard">
            <Button size="lg">
              <Heart className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
