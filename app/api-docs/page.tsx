"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Code, 
  Copy, 
  ExternalLink, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Globe,
  Database,
  Key,
  Terminal,
  BookOpen,
  Download,
  Play,
  Settings,
  BarChart3,
  Users,
  Mail,
  ShoppingCart
} from "lucide-react"
import Link from "next/link"

const apiEndpoints = [
  {
    method: "GET",
    endpoint: "/api/stories",
    description: "Retrieve all stories for an organization",
    parameters: [
      { name: "orgId", type: "string", required: true, description: "Organization ID" },
      { name: "limit", type: "number", required: false, description: "Number of stories to return (default: 20)" },
      { name: "offset", type: "number", required: false, description: "Number of stories to skip" }
    ],
    example: {
      request: "GET /api/stories?orgId=123&limit=10",
      response: {
        stories: [
          {
            id: "story_123",
            title: "Maria's Coffee Journey",
            content: "Story content...",
            nmbrId: "NMBR-001",
            createdAt: "2024-01-15T10:30:00Z",
            metrics: {
              views: 1250,
              conversions: 45,
              revenue: 1250.00
            }
          }
        ],
        total: 25,
        hasMore: true
      }
    }
  },
  {
    method: "POST",
    endpoint: "/api/stories",
    description: "Create a new story",
    parameters: [
      { name: "title", type: "string", required: true, description: "Story title" },
      { name: "content", type: "string", required: true, description: "Story content" },
      { name: "orgId", type: "string", required: true, description: "Organization ID" },
      { name: "media", type: "array", required: false, description: "Array of media URLs" }
    ],
    example: {
      request: "POST /api/stories",
      body: {
        title: "New Story",
        content: "Story content...",
        orgId: "123",
        media: ["https://example.com/image.jpg"]
      },
      response: {
        id: "story_456",
        title: "New Story",
        content: "Story content...",
        nmbrId: "NMBR-002",
        createdAt: "2024-01-15T11:00:00Z",
        status: "published"
      }
    }
  },
  {
    method: "GET",
    endpoint: "/api/analytics/revenue",
    description: "Get revenue analytics for stories",
    parameters: [
      { name: "orgId", type: "string", required: true, description: "Organization ID" },
      { name: "startDate", type: "string", required: false, description: "Start date (ISO 8601)" },
      { name: "endDate", type: "string", required: false, description: "End date (ISO 8601)" },
      { name: "storyId", type: "string", required: false, description: "Specific story ID" }
    ],
    example: {
      request: "GET /api/analytics/revenue?orgId=123&startDate=2024-01-01",
      response: {
        totalRevenue: 15420.50,
        totalOrders: 342,
        conversionRate: 4.2,
        topStories: [
          {
            storyId: "story_123",
            title: "Maria's Coffee Journey",
            revenue: 8750.25,
            orders: 156,
            conversionRate: 5.1
          }
        ],
        period: {
          start: "2024-01-01T00:00:00Z",
          end: "2024-01-31T23:59:59Z"
        }
      }
    }
  },
  {
    method: "POST",
    endpoint: "/api/webhooks",
    description: "Create a webhook endpoint",
    parameters: [
      { name: "url", type: "string", required: true, description: "Webhook URL" },
      { name: "events", type: "array", required: true, description: "Array of events to subscribe to" },
      { name: "secret", type: "string", required: false, description: "Webhook secret for verification" }
    ],
    example: {
      request: "POST /api/webhooks",
      body: {
        url: "https://your-app.com/webhooks/nmbr",
        events: ["story.viewed", "story.converted", "order.created"],
        secret: "whsec_1234567890"
      },
      response: {
        id: "webhook_789",
        url: "https://your-app.com/webhooks/nmbr",
        events: ["story.viewed", "story.converted", "order.created"],
        status: "active",
        createdAt: "2024-01-15T12:00:00Z"
      }
    }
  }
]

const webhookEvents = [
  {
    event: "story.viewed",
    description: "Triggered when a story is viewed",
    payload: {
      event: "story.viewed",
      timestamp: "2024-01-15T10:30:00Z",
      data: {
        storyId: "story_123",
        nmbrId: "NMBR-001",
        viewerId: "user_456",
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0...",
        referrer: "https://example.com"
      }
    }
  },
  {
    event: "story.converted",
    description: "Triggered when a story view leads to a conversion",
    payload: {
      event: "story.converted",
      timestamp: "2024-01-15T10:35:00Z",
      data: {
        storyId: "story_123",
        nmbrId: "NMBR-001",
        conversionType: "purchase",
        orderId: "order_789",
        amount: 25.99,
        currency: "USD",
        customerId: "customer_101"
      }
    }
  },
  {
    event: "order.created",
    description: "Triggered when a new order is created",
    payload: {
      event: "order.created",
      timestamp: "2024-01-15T10:40:00Z",
      data: {
        orderId: "order_789",
        storyId: "story_123",
        nmbrId: "NMBR-001",
        customerId: "customer_101",
        items: [
          {
            productId: "product_456",
            name: "Coffee Beans",
            quantity: 2,
            price: 12.99
          }
        ],
        total: 25.98,
        currency: "USD"
      }
    }
  }
]

const sdkExamples = [
  {
    language: "JavaScript",
    icon: "🟨",
    description: "Node.js and browser SDK",
    code: `// Install the SDK
npm install @nmbr/sdk

// Initialize the SDK
import { NMBRClient } from '@nmbr/sdk';

const client = new NMBRClient({
  apiKey: 'your-api-key',
  orgId: 'your-org-id'
});

// Create a story
const story = await client.stories.create({
  title: 'My Story',
  content: 'Story content...',
  media: ['https://example.com/image.jpg']
});

// Track a view
await client.analytics.trackView({
  storyId: story.id,
  viewerId: 'user_123'
});

// Get analytics
const analytics = await client.analytics.getRevenue({
  startDate: '2024-01-01',
  endDate: '2024-01-31'
});`
  },
  {
    language: "Python",
    icon: "🐍",
    description: "Python SDK for server-side integration",
    code: `# Install the SDK
pip install nmbr-sdk

# Initialize the SDK
from nmbr import NMBRClient

client = NMBRClient(
    api_key='your-api-key',
    org_id='your-org-id'
)

# Create a story
story = client.stories.create(
    title='My Story',
    content='Story content...',
    media=['https://example.com/image.jpg']
)

# Track a view
client.analytics.track_view(
    story_id=story.id,
    viewer_id='user_123'
)

# Get analytics
analytics = client.analytics.get_revenue(
    start_date='2024-01-01',
    end_date='2024-01-31'
)`
  },
  {
    language: "PHP",
    icon: "🐘",
    description: "PHP SDK for web applications",
    code: `<?php
// Install via Composer
composer require nmbr/sdk

// Initialize the SDK
use NMBR\\Client;

$client = new Client([
    'api_key' => 'your-api-key',
    'org_id' => 'your-org-id'
]);

// Create a story
$story = $client->stories->create([
    'title' => 'My Story',
    'content' => 'Story content...',
    'media' => ['https://example.com/image.jpg']
]);

// Track a view
$client->analytics->trackView([
    'story_id' => $story->id,
    'viewer_id' => 'user_123'
]);

// Get analytics
$analytics = $client->analytics->getRevenue([
    'start_date' => '2024-01-01',
    'end_date' => '2024-01-31'
]);
?>`
  }
]

export default function APIDocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              <Code className="w-4 h-4 mr-2" />
              API Documentation
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              NMBR
              <span className="text-primary"> API Reference</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Build powerful integrations with our comprehensive REST API. Access all NMBR functionality 
              programmatically with our well-documented endpoints and SDKs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                <Key className="w-5 h-5 mr-2" />
                Get API Key
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <ExternalLink className="w-5 h-5 mr-2" />
                Interactive Docs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold mb-4">Quick Start</h3>
              <p className="text-xl text-muted-foreground">
                Get up and running with the NMBR API in minutes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-blue-600" />
                    1. Get API Key
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Generate your API key from the dashboard settings
                  </p>
                  <Button className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Go to Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-green-600" />
                    2. Make Request
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Use your API key to authenticate requests
                  </p>
                  <div className="bg-muted p-3 rounded text-sm font-mono">
                    curl -H "Authorization: Bearer YOUR_API_KEY" \
                    https://api.thenmbr.com/v1/stories
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    3. Start Building
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Use our SDKs or build with raw HTTP requests
                  </p>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download SDK
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">API Endpoints</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Complete reference for all available API endpoints
            </p>
          </div>

          <div className="space-y-8">
            {apiEndpoints.map((endpoint, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge 
                        variant={endpoint.method === 'GET' ? 'default' : 'secondary'}
                        className="font-mono"
                      >
                        {endpoint.method}
                      </Badge>
                      <code className="text-lg font-mono">{endpoint.endpoint}</code>
                    </div>
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <CardDescription className="text-base">
                    {endpoint.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Parameters</h3>
                    <div className="space-y-2">
                      {endpoint.parameters.map((param, paramIndex) => (
                        <div key={paramIndex} className="flex items-center gap-4 text-sm">
                          <code className="font-mono bg-muted px-2 py-1 rounded">
                            {param.name}
                          </code>
                          <span className="text-muted-foreground">{param.type}</span>
                          {param.required && (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          )}
                          <span className="text-muted-foreground">{param.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Example</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Request</p>
                        <div className="bg-muted p-4 rounded-lg">
                          <code className="text-sm">{endpoint.example.request}</code>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Response</p>
                        <div className="bg-muted p-4 rounded-lg">
                          <pre className="text-sm overflow-x-auto">
                            {JSON.stringify(endpoint.example.response, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Webhooks */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Webhooks</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get real-time notifications when events occur in your NMBR account
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {webhookEvents.map((webhook, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    {webhook.event}
                  </CardTitle>
                  <CardDescription>{webhook.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      {JSON.stringify(webhook.payload, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SDKs */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Official SDKs</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Use our official SDKs to integrate NMBR into your applications quickly and easily
            </p>
          </div>

          <div className="space-y-8">
            {sdkExamples.map((sdk, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{sdk.icon}</div>
                      <div>
                        <CardTitle className="text-xl">{sdk.language}</CardTitle>
                        <CardDescription>{sdk.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Code
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      <code>{sdk.code}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Rate Limits & Security */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold mb-4">Rate Limits & Security</h3>
              <p className="text-xl text-muted-foreground">
                Learn about our rate limiting, authentication, and security measures
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Rate Limits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Free Plan</span>
                      <span className="font-mono">100 requests/hour</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Growth Plan</span>
                      <span className="font-mono">1,000 requests/hour</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Professional Plan</span>
                      <span className="font-mono">10,000 requests/hour</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Enterprise Plan</span>
                      <span className="font-mono">Unlimited</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Rate limits are applied per API key. Exceeding limits will result in a 429 status code.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>OAuth 2.0 authentication</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>HTTPS encryption</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>API key rotation</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>IP whitelisting</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>SOC 2 compliance</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h3 className="text-4xl font-bold">Ready to Start Building?</h3>
            <p className="text-xl opacity-90">
              Get your API key and start integrating NMBR into your applications today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Key className="w-5 h-5 mr-2" />
                Get API Key
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary">
                <ExternalLink className="w-5 h-5 mr-2" />
                View Interactive Docs
              </Button>
            </div>
            <p className="text-sm opacity-75">
              Free API access with all plans • No setup fees • 24/7 support
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}