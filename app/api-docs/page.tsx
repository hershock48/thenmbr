"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Copy, Play, Key, Code, Book, Zap } from "lucide-react"

export default function ApiDocsPage() {
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [testResponse, setTestResponse] = useState("")

  const endpoints = [
    {
      id: "stories",
      method: "GET",
      path: "/api/v1/stories",
      title: "List Stories",
      description: "Retrieve all stories for your organization",
      parameters: [
        { name: "limit", type: "integer", description: "Number of stories to return (max 100)" },
        { name: "offset", type: "integer", description: "Number of stories to skip" },
        { name: "status", type: "string", description: "Filter by status: draft, published, archived" },
      ],
    },
    {
      id: "create-story",
      method: "POST",
      path: "/api/v1/stories",
      title: "Create Story",
      description: "Create a new product story",
      parameters: [
        { name: "title", type: "string", description: "Story title (required)" },
        { name: "content", type: "string", description: "Story content (required)" },
        { name: "product_id", type: "string", description: "Associated product ID" },
      ],
    },
    {
      id: "qr-codes",
      method: "GET",
      path: "/api/v1/qr-codes",
      title: "List QR Codes",
      description: "Retrieve all QR codes and their analytics",
      parameters: [
        { name: "story_id", type: "string", description: "Filter by story ID" },
        { name: "active", type: "boolean", description: "Filter by active status" },
      ],
    },
    {
      id: "analytics",
      method: "GET",
      path: "/api/v1/analytics",
      title: "Get Analytics",
      description: "Retrieve story and QR code performance metrics",
      parameters: [
        { name: "date_from", type: "string", description: "Start date (YYYY-MM-DD)" },
        { name: "date_to", type: "string", description: "End date (YYYY-MM-DD)" },
        { name: "metric", type: "string", description: "Specific metric: views, scans, conversions" },
      ],
    },
  ]

  const handleTestApi = () => {
    setTestResponse(`{
  "data": [
    {
      "id": "story_123",
      "title": "Ethiopian Coffee Farm Story",
      "status": "published",
      "views": 1247,
      "scans": 89,
      "conversions": 12
    }
  ],
  "meta": {
    "total": 1,
    "limit": 10,
    "offset": 0
  }
}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    N
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
                    #
                  </div>
                </div>
                <span className="font-semibold">NMBR API</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <a href="#overview" className="hover:text-secondary-foreground transition-colors">
                  Overview
                </a>
                <a href="#authentication" className="hover:text-secondary-foreground transition-colors">
                  Authentication
                </a>
                <a href="#endpoints" className="hover:text-secondary-foreground transition-colors">
                  Endpoints
                </a>
                <a href="#explorer" className="hover:text-secondary-foreground transition-colors">
                  API Explorer
                </a>
              </nav>
            </div>
            <Button variant="secondary" size="sm">
              <Key className="w-4 h-4 mr-2" />
              Get API Key
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <a
                    href="#overview"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Overview
                  </a>
                  <a
                    href="#authentication"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Authentication
                  </a>
                  <a
                    href="#endpoints"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Endpoints
                  </a>
                  <a
                    href="#explorer"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    API Explorer
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Overview Section */}
            <section id="overview">
              <div className="flex items-center gap-3 mb-6">
                <Book className="w-6 h-6 text-primary" />
                <h1 className="text-3xl font-bold">API Documentation</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">RESTful API</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Simple HTTP-based API with JSON responses</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Key className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">API Key Auth</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Secure authentication with API keys</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">Real-time</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Webhooks for real-time event notifications</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                  <CardDescription>
                    The NMBR API allows you to programmatically manage stories, QR codes, and analytics for your
                    story-driven commerce platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-card p-4 rounded-lg">
                    <p className="text-sm font-mono">
                      Base URL: <span className="text-primary">https://api.nmbr.com/v1</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Authentication Section */}
            <section id="authentication">
              <h2 className="text-2xl font-bold mb-4">Authentication</h2>
              <Card>
                <CardHeader>
                  <CardTitle>API Key Authentication</CardTitle>
                  <CardDescription>
                    All API requests require authentication using your API key in the Authorization header.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-card p-4 rounded-lg">
                    <p className="text-sm font-mono mb-2">Authorization: Bearer YOUR_API_KEY</p>
                  </div>

                  <Tabs defaultValue="curl" className="w-full">
                    <TabsList>
                      <TabsTrigger value="curl">cURL</TabsTrigger>
                      <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                      <TabsTrigger value="python">Python</TabsTrigger>
                    </TabsList>
                    <TabsContent value="curl" className="bg-card p-4 rounded-lg">
                      <pre className="text-sm font-mono">
                        {`curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.nmbr.com/v1/stories`}
                      </pre>
                    </TabsContent>
                    <TabsContent value="javascript" className="bg-card p-4 rounded-lg">
                      <pre className="text-sm font-mono">
                        {`const response = await fetch('https://api.nmbr.com/v1/stories', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});`}
                      </pre>
                    </TabsContent>
                    <TabsContent value="python" className="bg-card p-4 rounded-lg">
                      <pre className="text-sm font-mono">
                        {`import requests

headers = {'Authorization': 'Bearer YOUR_API_KEY'}
response = requests.get('https://api.nmbr.com/v1/stories', headers=headers)`}
                      </pre>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </section>

            {/* Endpoints Section */}
            <section id="endpoints">
              <h2 className="text-2xl font-bold mb-4">API Endpoints</h2>
              <div className="space-y-4">
                {endpoints.map((endpoint) => (
                  <Collapsible
                    key={endpoint.id}
                    open={expandedEndpoint === endpoint.id}
                    onOpenChange={(open) => setExpandedEndpoint(open ? endpoint.id : null)}
                  >
                    <Card>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge variant={endpoint.method === "GET" ? "secondary" : "default"}>
                                {endpoint.method}
                              </Badge>
                              <div>
                                <CardTitle className="text-lg">{endpoint.title}</CardTitle>
                                <p className="text-sm font-mono text-muted-foreground">{endpoint.path}</p>
                              </div>
                            </div>
                            {expandedEndpoint === endpoint.id ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronRight className="w-5 h-5" />
                            )}
                          </div>
                          <CardDescription>{endpoint.description}</CardDescription>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Parameters</h4>
                              <div className="space-y-2">
                                {endpoint.parameters.map((param, index) => (
                                  <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                                    <Badge variant="outline" className="text-xs">
                                      {param.type}
                                    </Badge>
                                    <div className="flex-1">
                                      <p className="font-mono text-sm font-semibold">{param.name}</p>
                                      <p className="text-sm text-muted-foreground">{param.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">Example Response</h4>
                              <div className="bg-card p-4 rounded-lg">
                                <pre className="text-sm font-mono">
                                  {`{
  "data": [...],
  "meta": {
    "total": 100,
    "limit": 10,
    "offset": 0
  }
}`}
                                </pre>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
              </div>
            </section>

            {/* API Explorer Section */}
            <section id="explorer">
              <h2 className="text-2xl font-bold mb-4">API Explorer</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Test API Endpoints</CardTitle>
                  <CardDescription>Try out API endpoints directly from this interface.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="api-key">API Key</Label>
                      <Input
                        id="api-key"
                        type="password"
                        placeholder="Enter your API key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endpoint">Endpoint</Label>
                      <select className="w-full p-2 border rounded-md bg-input">
                        <option>GET /api/v1/stories</option>
                        <option>POST /api/v1/stories</option>
                        <option>GET /api/v1/qr-codes</option>
                        <option>GET /api/v1/analytics</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="request-body">Request Body (for POST requests)</Label>
                    <Textarea
                      id="request-body"
                      placeholder='{"title": "My Story", "content": "Story content..."}'
                      rows={4}
                    />
                  </div>

                  <Button onClick={handleTestApi} className="w-full">
                    <Play className="w-4 h-4 mr-2" />
                    Send Request
                  </Button>

                  {testResponse && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Response</Label>
                        <Button variant="outline" size="sm">
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                      <div className="bg-card p-4 rounded-lg">
                        <pre className="text-sm font-mono whitespace-pre-wrap">{testResponse}</pre>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-sidebar border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-6 h-6 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                  N
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
                  #
                </div>
              </div>
              <span className="text-sidebar-foreground">© 2024 NMBR Platform</span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/support"
                className="text-sm text-sidebar-foreground hover:text-sidebar-primary transition-colors"
              >
                Support
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-sidebar-foreground hover:text-sidebar-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-sidebar-foreground hover:text-sidebar-primary transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
