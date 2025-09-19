"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Code,
  Play,
  BookOpen,
  Key,
  Shield,
  Zap,
  Database,
  Webhook,
  Settings,
  Download,
  Eye,
  CheckCircle,
  ExternalLink,
  BarChart3,
  Users,
  Heart,
  DollarSign,
  Mail,
  MessageSquare,
} from "lucide-react"

interface APIEndpoint {
  id: string
  name: string
  description: string
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  path: string
  category: "stories" | "donations" | "analytics" | "users" | "webhooks" | "integrations"
  authentication: "api-key" | "oauth" | "jwt" | "none"
  rateLimit: string
  parameters: Array<{
    name: string
    type: string
    required: boolean
    description: string
  }>
  response: {
    status: number
    data: any
  }
  examples: Array<{
    language: string
    code: string
  }>
}

interface Integration {
  id: string
  name: string
  description: string
  category: "crm" | "email" | "payment" | "analytics" | "social" | "automation"
  status: "available" | "beta" | "coming-soon"
  icon: any
  features: string[]
  setupSteps: string[]
  documentation: string
}

export default function APIDocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [showCodeExample, setShowCodeExample] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")

  const apiEndpoints: APIEndpoint[] = [
    // Stories API
    {
      id: "1",
      name: "Create Story",
      description: "Create a new impact story",
      method: "POST",
      path: "/api/v1/stories",
      category: "stories",
      authentication: "jwt",
      rateLimit: "100/hour",
      parameters: [
        { name: "title", type: "string", required: true, description: "Story title" },
        { name: "description", type: "string", required: true, description: "Story description" },
        { name: "goal", type: "number", required: true, description: "Fundraising goal" },
        { name: "category", type: "string", required: false, description: "Story category" },
      ],
      response: {
        status: 201,
        data: { id: "story_123", title: "Clean Water Initiative", status: "active" },
      },
      examples: [
        {
          language: "javascript",
          code: `fetch('/api/v1/stories', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Clean Water Initiative',
    description: 'Providing clean water to 1000 families',
    goal: 50000,
    category: 'health'
  })
})`,
        },
        {
          language: "python",
          code: `import requests

response = requests.post(
    'https://api.nmbr.com/v1/stories',
    headers={
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
        'Content-Type': 'application/json'
    },
    json={
        'title': 'Clean Water Initiative',
        'description': 'Providing clean water to 1000 families',
        'goal': 50000,
        'category': 'health'
    }
)`,
        },
      ],
    },
    {
      id: "2",
      name: "Get Stories",
      description: "Retrieve all stories for an organization",
      method: "GET",
      path: "/api/v1/stories",
      category: "stories",
      authentication: "jwt",
      rateLimit: "1000/hour",
      parameters: [
        { name: "limit", type: "number", required: false, description: "Number of stories to return" },
        { name: "offset", type: "number", required: false, description: "Number of stories to skip" },
        { name: "status", type: "string", required: false, description: "Filter by status" },
      ],
      response: {
        status: 200,
        data: { stories: [], total: 0, limit: 20, offset: 0 },
      },
      examples: [
        {
          language: "javascript",
          code: `fetch('/api/v1/stories?limit=10&status=active', {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
})`,
        },
      ],
    },
    // Donations API
    {
      id: "3",
      name: "Create Donation",
      description: "Process a new donation",
      method: "POST",
      path: "/api/v1/donations",
      category: "donations",
      authentication: "jwt",
      rateLimit: "500/hour",
      parameters: [
        { name: "story_id", type: "string", required: true, description: "Story ID" },
        { name: "amount", type: "number", required: true, description: "Donation amount" },
        { name: "donor_email", type: "string", required: true, description: "Donor email" },
        { name: "payment_method", type: "string", required: true, description: "Payment method" },
      ],
      response: {
        status: 201,
        data: { id: "donation_123", amount: 100, status: "completed" },
      },
      examples: [
        {
          language: "javascript",
          code: `fetch('/api/v1/donations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    story_id: 'story_123',
    amount: 100,
    donor_email: 'donor@example.com',
    payment_method: 'stripe'
  })
})`,
        },
      ],
    },
    // Analytics API
    {
      id: "4",
      name: "Get Analytics",
      description: "Retrieve analytics data for stories",
      method: "GET",
      path: "/api/v1/analytics",
      category: "analytics",
      authentication: "jwt",
      rateLimit: "200/hour",
      parameters: [
        { name: "story_id", type: "string", required: false, description: "Specific story ID" },
        { name: "date_from", type: "string", required: false, description: "Start date (ISO 8601)" },
        { name: "date_to", type: "string", required: false, description: "End date (ISO 8601)" },
        { name: "metrics", type: "array", required: false, description: "Specific metrics to return" },
      ],
      response: {
        status: 200,
        data: { views: 1000, donations: 50, revenue: 5000, conversion_rate: 5.0 },
      },
      examples: [
        {
          language: "javascript",
          code: `fetch('/api/v1/analytics?story_id=story_123&date_from=2024-01-01', {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
})`,
        },
      ],
    },
  ]

  const integrations: Integration[] = [
    {
      id: "1",
      name: "Salesforce",
      description: "Sync donor data and fundraising metrics with Salesforce CRM",
      category: "crm",
      status: "available",
      icon: Database,
      features: [
        "Automatic donor contact creation",
        "Campaign and opportunity tracking",
        "Real-time data synchronization",
        "Custom field mapping",
      ],
      setupSteps: [
        "Install NMBR Salesforce package",
        "Configure OAuth connection",
        "Map custom fields",
        "Test data synchronization",
      ],
      documentation: "https://docs.nmbr.com/integrations/salesforce",
    },
    {
      id: "2",
      name: "Mailchimp",
      description: "Automatically sync donor emails and create targeted campaigns",
      category: "email",
      status: "available",
      icon: Mail,
      features: [
        "Automatic list segmentation",
        "Donor behavior tracking",
        "Campaign performance analytics",
        "Automated email sequences",
      ],
      setupSteps: [
        "Connect Mailchimp account",
        "Select target audience lists",
        "Configure sync preferences",
        "Set up automated campaigns",
      ],
      documentation: "https://docs.nmbr.com/integrations/mailchimp",
    },
    {
      id: "3",
      name: "Stripe",
      description: "Process donations securely with Stripe payment processing",
      category: "payment",
      status: "available",
      icon: DollarSign,
      features: [
        "Secure payment processing",
        "Multiple payment methods",
        "International currency support",
        "Automated tax handling",
      ],
      setupSteps: [
        "Create Stripe account",
        "Configure webhook endpoints",
        "Set up payment methods",
        "Test transaction processing",
      ],
      documentation: "https://docs.nmbr.com/integrations/stripe",
    },
    {
      id: "4",
      name: "Google Analytics",
      description: "Track website traffic and donor engagement with Google Analytics",
      category: "analytics",
      status: "available",
      icon: BarChart3,
      features: [
        "Enhanced ecommerce tracking",
        "Custom event tracking",
        "Donor journey analysis",
        "Conversion funnel reporting",
      ],
      setupSteps: [
        "Create Google Analytics property",
        "Install tracking code",
        "Configure custom events",
        "Set up conversion goals",
      ],
      documentation: "https://docs.nmbr.com/integrations/google-analytics",
    },
    {
      id: "5",
      name: "Zapier",
      description: "Connect NMBR with 5000+ apps through Zapier automation",
      category: "automation",
      status: "available",
      icon: Zap,
      features: ["5000+ app integrations", "Custom automation workflows", "Real-time triggers", "No-code automation"],
      setupSteps: [
        "Create Zapier account",
        "Search for NMBR triggers",
        "Configure automation rules",
        "Test and activate workflows",
      ],
      documentation: "https://docs.nmbr.com/integrations/zapier",
    },
    {
      id: "6",
      name: "Slack",
      description: "Get real-time notifications and updates in your Slack workspace",
      category: "social",
      status: "beta",
      icon: MessageSquare,
      features: [
        "Real-time donation notifications",
        "Team collaboration tools",
        "Custom notification channels",
        "Analytics reporting",
      ],
      setupSteps: [
        "Install NMBR Slack app",
        "Configure notification preferences",
        "Set up team channels",
        "Test notification delivery",
      ],
      documentation: "https://docs.nmbr.com/integrations/slack",
    },
  ]

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-800 border-green-200"
      case "POST":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "PUT":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "DELETE":
        return "bg-red-100 text-red-800 border-red-200"
      case "PATCH":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "stories":
        return <Heart className="w-4 h-4" />
      case "donations":
        return <DollarSign className="w-4 h-4" />
      case "analytics":
        return <BarChart3 className="w-4 h-4" />
      case "users":
        return <Users className="w-4 h-4" />
      case "webhooks":
        return <Webhook className="w-4 h-4" />
      case "integrations":
        return <Zap className="w-4 h-4" />
      default:
        return <Settings className="w-4 h-4" />
    }
  }

  const getIntegrationIcon = (category: string) => {
    switch (category) {
      case "crm":
        return <Database className="w-5 h-5" />
      case "email":
        return <Mail className="w-5 h-5" />
      case "payment":
        return <DollarSign className="w-5 h-5" />
      case "analytics":
        return <BarChart3 className="w-5 h-5" />
      case "social":
        return <MessageSquare className="w-5 h-5" />
      case "automation":
        return <Zap className="w-5 h-5" />
      default:
        return <Settings className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200"
      case "beta":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "coming-soon":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">API Documentation</h1>
              <p className="text-muted-foreground mt-2">Integrate NMBR with your existing systems and workflows</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download SDK
              </Button>
              <Button>
                <Key className="w-4 h-4 mr-2" />
                Get API Key
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Quick Start
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Key className="w-4 h-4 mr-2" />
                  Authentication
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Shield className="w-4 h-4 mr-2" />
                  Security
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Webhook className="w-4 h-4 mr-2" />
                  Webhooks
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Code className="w-4 h-4 mr-2" />
                  SDKs
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { id: "stories", name: "Stories", count: 8 },
                  { id: "donations", name: "Donations", count: 6 },
                  { id: "analytics", name: "Analytics", count: 4 },
                  { id: "users", name: "Users", count: 5 },
                  { id: "webhooks", name: "Webhooks", count: 3 },
                  { id: "integrations", name: "Integrations", count: 12 },
                ].map((category) => (
                  <button
                    key={category.id}
                    className="w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(category.id)}
                      <span className="text-sm">{category.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="endpoints" className="space-y-6">
              <TabsList>
                <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
                <TabsTrigger value="sdk">SDKs</TabsTrigger>
              </TabsList>

              {/* API Endpoints Tab */}
              <TabsContent value="endpoints" className="space-y-6">
                <div className="space-y-4">
                  {apiEndpoints.map((endpoint) => (
                    <Card key={endpoint.id} className="group hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className={getMethodColor(endpoint.method)}>{endpoint.method}</Badge>
                              <code className="text-sm bg-muted px-2 py-1 rounded">{endpoint.path}</code>
                              <Badge variant="outline" className="text-xs">
                                {getCategoryIcon(endpoint.category)}
                                <span className="ml-1 capitalize">{endpoint.category}</span>
                              </Badge>
                            </div>
                            <h3 className="font-semibold mb-2">{endpoint.name}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{endpoint.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Auth: {endpoint.authentication}</span>
                              <span>Rate: {endpoint.rateLimit}</span>
                              <span>{endpoint.parameters.length} params</span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => setSelectedEndpoint(endpoint)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Integrations Tab */}
              <TabsContent value="integrations" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {integrations.map((integration) => (
                    <Card key={integration.id} className="group hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                            <integration.icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{integration.name}</h3>
                              <Badge className={getStatusColor(integration.status)}>{integration.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{integration.description}</p>
                            <div className="space-y-2">
                              <h4 className="text-xs font-medium text-muted-foreground">Features:</h4>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {integration.features.slice(0, 3).map((feature, index) => (
                                  <li key={index} className="flex items-start gap-1">
                                    <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                    {feature}
                                  </li>
                                ))}
                                {integration.features.length > 3 && (
                                  <li className="text-xs text-muted-foreground">
                                    +{integration.features.length - 3} more features
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => setSelectedIntegration(integration)}>
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Webhooks Tab */}
              <TabsContent value="webhooks" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Webhook Events</CardTitle>
                    <CardDescription>Subscribe to real-time events from NMBR</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { event: "story.created", description: "Triggered when a new story is created" },
                        { event: "donation.received", description: "Triggered when a donation is received" },
                        { event: "donor.subscribed", description: "Triggered when a donor subscribes to updates" },
                        { event: "story.milestone", description: "Triggered when a story reaches a milestone" },
                      ].map((webhook, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <Webhook className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{webhook.event}</h3>
                            <p className="text-sm text-muted-foreground">{webhook.description}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Settings className="w-4 h-4 mr-2" />
                            Configure
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SDKs Tab */}
              <TabsContent value="sdk" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: "JavaScript", icon: Code, description: "Node.js and browser support" },
                    { name: "Python", icon: Code, description: "Django and Flask integration" },
                    { name: "PHP", icon: Code, description: "Laravel and WordPress support" },
                    { name: "Ruby", icon: Code, description: "Rails and Sinatra integration" },
                    { name: "Java", icon: Code, description: "Spring Boot and Android" },
                    { name: "C#", icon: Code, description: ".NET and ASP.NET Core" },
                  ].map((sdk, index) => (
                    <Card key={index} className="group hover:shadow-lg transition-shadow">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                          <sdk.icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold mb-2">{sdk.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{sdk.description}</p>
                        <Button size="sm" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Endpoint Detail Dialog */}
      <Dialog open={!!selectedEndpoint} onOpenChange={() => setSelectedEndpoint(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Badge className={getMethodColor(selectedEndpoint?.method || "")}>{selectedEndpoint?.method}</Badge>
              <code>{selectedEndpoint?.path}</code>
            </DialogTitle>
            <DialogDescription>{selectedEndpoint?.description}</DialogDescription>
          </DialogHeader>

          {selectedEndpoint && (
            <div className="space-y-6">
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="parameters">Parameters</TabsTrigger>
                  <TabsTrigger value="response">Response</TabsTrigger>
                  <TabsTrigger value="examples">Examples</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Authentication</h4>
                      <p className="text-sm text-muted-foreground">{selectedEndpoint.authentication}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Rate Limit</h4>
                      <p className="text-sm text-muted-foreground">{selectedEndpoint.rateLimit}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="parameters" className="space-y-4">
                  <div className="space-y-3">
                    {selectedEndpoint.parameters.map((param, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="text-sm font-mono">{param.name}</code>
                            <Badge variant="outline" className="text-xs">
                              {param.type}
                            </Badge>
                            {param.required && (
                              <Badge variant="destructive" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{param.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="response" className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">Status: {selectedEndpoint.response.status}</span>
                    </div>
                    <pre className="text-sm overflow-x-auto">
                      {JSON.stringify(selectedEndpoint.response.data, null, 2)}
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="examples" className="space-y-4">
                  <div className="space-y-3">
                    {selectedEndpoint.examples.map((example, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{example.language}</h4>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedLanguage(example.language)
                              setShowCodeExample(true)
                            }}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Try it
                          </Button>
                        </div>
                        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">{example.code}</pre>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Integration Detail Dialog */}
      <Dialog open={!!selectedIntegration} onOpenChange={() => setSelectedIntegration(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedIntegration && <selectedIntegration.icon className="w-5 h-5" />}
              {selectedIntegration?.name}
            </DialogTitle>
            <DialogDescription>{selectedIntegration?.description}</DialogDescription>
          </DialogHeader>

          {selectedIntegration && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(selectedIntegration.status)}>{selectedIntegration.status}</Badge>
                <Badge variant="outline">
                  {getIntegrationIcon(selectedIntegration.category)}
                  <span className="ml-1 capitalize">{selectedIntegration.category}</span>
                </Badge>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Features</h4>
                <ul className="space-y-2">
                  {selectedIntegration.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Setup Steps</h4>
                <ol className="space-y-2">
                  {selectedIntegration.setupSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Documentation
                </Button>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
