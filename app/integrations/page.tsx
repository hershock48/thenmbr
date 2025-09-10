"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CheckCircle, 
  ArrowRight, 
  ExternalLink, 
  Zap, 
  Database,
  Users,
  Mail,
  BarChart3,
  Settings,
  Shield,
  Clock,
  Star,
  TrendingUp,
  Link as LinkIcon,
  Download,
  Play,
  Code,
  Globe,
  Smartphone,
  Monitor
} from "lucide-react"
import Link from "next/link"

const crmIntegrations = [
  {
    name: "Salesforce",
    description: "Sync NMBR stories with Salesforce campaigns, leads, and opportunities",
    logo: "🔵",
    status: "Available",
    features: [
      "Automatic lead creation from story interactions",
      "Campaign attribution tracking",
      "Custom field mapping",
      "Real-time sync with Salesforce objects",
      "Advanced reporting integration"
    ],
    setupTime: "5 minutes",
    pricing: "Included in Professional+",
    popularity: 95
  },
  {
    name: "HubSpot",
    description: "Connect NMBR stories to HubSpot contacts, deals, and marketing campaigns",
    logo: "🟠",
    status: "Available", 
    features: [
      "Contact lifecycle stage updates",
      "Deal pipeline integration",
      "Marketing automation triggers",
      "Custom property mapping",
      "Attribution reporting"
    ],
    setupTime: "3 minutes",
    pricing: "Included in Professional+",
    popularity: 88
  },
  {
    name: "Pipedrive",
    description: "Track story engagement and revenue attribution in Pipedrive deals",
    logo: "🟢",
    status: "Available",
    features: [
      "Deal stage automation",
      "Activity tracking",
      "Revenue attribution",
      "Custom field sync",
      "Pipeline reporting"
    ],
    setupTime: "4 minutes",
    pricing: "Included in Professional+",
    popularity: 72
  },
  {
    name: "Microsoft Dynamics",
    description: "Enterprise-grade integration with Dynamics 365 CRM",
    logo: "🔷",
    status: "Available",
    features: [
      "Account and contact sync",
      "Opportunity management",
      "Custom entity mapping",
      "Power BI integration",
      "Advanced security controls"
    ],
    setupTime: "10 minutes",
    pricing: "Enterprise only",
    popularity: 65
  }
]

const marketingIntegrations = [
  {
    name: "Mailchimp",
    description: "Sync NMBR subscribers with Mailchimp audiences and campaigns",
    logo: "📧",
    status: "Available",
    features: [
      "Automatic audience segmentation",
      "Campaign performance tracking",
      "Subscriber behavior sync",
      "A/B testing integration",
      "Revenue attribution"
    ],
    setupTime: "2 minutes",
    pricing: "Included in Growth+",
    popularity: 92
  },
  {
    name: "Constant Contact",
    description: "Connect NMBR stories to Constant Contact email marketing",
    logo: "📬",
    status: "Available",
    features: [
      "Contact list synchronization",
      "Email campaign tracking",
      "Engagement metrics",
      "Automated workflows",
      "Performance reporting"
    ],
    setupTime: "3 minutes",
    pricing: "Included in Growth+",
    popularity: 78
  },
  {
    name: "ActiveCampaign",
    description: "Advanced marketing automation with NMBR story triggers",
    logo: "⚡",
    status: "Available",
    features: [
      "Complex automation workflows",
      "Lead scoring integration",
      "Behavioral triggers",
      "Advanced segmentation",
      "Revenue tracking"
    ],
    setupTime: "5 minutes",
    pricing: "Included in Professional+",
    popularity: 85
  }
]

const analyticsIntegrations = [
  {
    name: "Google Analytics",
    description: "Track NMBR story performance with detailed analytics",
    logo: "📊",
    status: "Available",
    features: [
      "Custom event tracking",
      "Conversion funnel analysis",
      "Attribution modeling",
      "Real-time reporting",
      "Goal tracking"
    ],
    setupTime: "2 minutes",
    pricing: "Included in all plans",
    popularity: 98
  },
  {
    name: "Mixpanel",
    description: "Advanced user behavior analytics for NMBR stories",
    logo: "🔍",
    status: "Available",
    features: [
      "User journey mapping",
      "Cohort analysis",
      "Funnel optimization",
      "A/B testing",
      "Custom dashboards"
    ],
    setupTime: "3 minutes",
    pricing: "Included in Professional+",
    popularity: 82
  },
  {
    name: "Amplitude",
    description: "Product analytics for NMBR story engagement and conversion",
    logo: "📈",
    status: "Available",
    features: [
      "Behavioral analytics",
      "Retention analysis",
      "Feature adoption tracking",
      "Predictive analytics",
      "Custom events"
    ],
    setupTime: "4 minutes",
    pricing: "Included in Professional+",
    popularity: 76
  }
]

const ecommerceIntegrations = [
  {
    name: "Shopify",
    description: "Seamlessly integrate NMBR stories with Shopify stores",
    logo: "🛍️",
    status: "Available",
    features: [
      "Product story integration",
      "Order attribution tracking",
      "Customer journey mapping",
      "Inventory sync",
      "Revenue reporting"
    ],
    setupTime: "5 minutes",
    pricing: "Included in Growth+",
    popularity: 89
  },
  {
    name: "WooCommerce",
    description: "WordPress e-commerce integration with NMBR stories",
    logo: "🛒",
    status: "Available",
    features: [
      "Product page integration",
      "Order tracking",
      "Customer data sync",
      "Plugin compatibility",
      "Custom reporting"
    ],
    setupTime: "4 minutes",
    pricing: "Included in Growth+",
    popularity: 84
  },
  {
    name: "BigCommerce",
    description: "Enterprise e-commerce platform integration",
    logo: "🏢",
    status: "Available",
    features: [
      "Multi-store support",
      "Advanced attribution",
      "B2B integration",
      "API customization",
      "Enterprise reporting"
    ],
    setupTime: "6 minutes",
    pricing: "Included in Professional+",
    popularity: 71
  }
]

const integrationBenefits = [
  {
    icon: <Zap className="w-6 h-6 text-blue-600" />,
    title: "One-Click Setup",
    description: "Connect your favorite tools in minutes with our guided setup process"
  },
  {
    icon: <Database className="w-6 h-6 text-green-600" />,
    title: "Real-Time Sync",
    description: "Keep all your data synchronized across platforms automatically"
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-purple-600" />,
    title: "Unified Analytics",
    description: "See complete customer journey across all your tools in one dashboard"
  },
  {
    icon: <Shield className="w-6 h-6 text-red-600" />,
    title: "Enterprise Security",
    description: "Bank-level security with OAuth 2.0 and encrypted data transmission"
  }
]

export default function IntegrationsPage() {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              <LinkIcon className="w-4 h-4 mr-2" />
              Integrations
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Connect NMBR with
              <span className="text-primary"> Your Favorite Tools</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Seamlessly integrate NMBR with 50+ popular business tools. Sync data, automate workflows, 
              and get unified analytics across your entire tech stack.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                Browse All Integrations
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <ExternalLink className="w-5 h-5 mr-2" />
                View API Docs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Why Choose NMBR Integrations?</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built for modern businesses that need their tools to work together seamlessly
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {integrationBenefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Categories */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Integration Categories</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect NMBR with the tools you already use and love
            </p>
          </div>

          <Tabs defaultValue="crm" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="crm">CRM Systems</TabsTrigger>
              <TabsTrigger value="marketing">Marketing Tools</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="ecommerce">E-Commerce</TabsTrigger>
            </TabsList>

            {/* CRM Integrations */}
            <TabsContent value="crm" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {crmIntegrations.map((integration) => (
                  <Card key={integration.name} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{integration.logo}</div>
                          <div>
                            <CardTitle className="text-xl">{integration.name}</CardTitle>
                            <CardDescription>{integration.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {integration.popularity}%
                          </Badge>
                          <Badge variant="outline">{integration.status}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>Setup: {integration.setupTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                          <span>{integration.pricing}</span>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {integration.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-2">
                        <Button className="flex-1">
                          <Play className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                        <Button variant="outline">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Marketing Integrations */}
            <TabsContent value="marketing" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {marketingIntegrations.map((integration) => (
                  <Card key={integration.name} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{integration.logo}</div>
                          <div>
                            <CardTitle className="text-xl">{integration.name}</CardTitle>
                            <CardDescription>{integration.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {integration.popularity}%
                          </Badge>
                          <Badge variant="outline">{integration.status}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>Setup: {integration.setupTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                          <span>{integration.pricing}</span>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {integration.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-2">
                        <Button className="flex-1">
                          <Play className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                        <Button variant="outline">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Analytics Integrations */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analyticsIntegrations.map((integration) => (
                  <Card key={integration.name} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{integration.logo}</div>
                          <div>
                            <CardTitle className="text-xl">{integration.name}</CardTitle>
                            <CardDescription>{integration.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {integration.popularity}%
                          </Badge>
                          <Badge variant="outline">{integration.status}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>Setup: {integration.setupTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                          <span>{integration.pricing}</span>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {integration.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-2">
                        <Button className="flex-1">
                          <Play className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                        <Button variant="outline">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* E-Commerce Integrations */}
            <TabsContent value="ecommerce" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ecommerceIntegrations.map((integration) => (
                  <Card key={integration.name} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{integration.logo}</div>
                          <div>
                            <CardTitle className="text-xl">{integration.name}</CardTitle>
                            <CardDescription>{integration.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {integration.popularity}%
                          </Badge>
                          <Badge variant="outline">{integration.status}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>Setup: {integration.setupTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                          <span>{integration.pricing}</span>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {integration.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-2">
                        <Button className="flex-1">
                          <Play className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                        <Button variant="outline">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* API & Custom Integrations */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold mb-4">Need a Custom Integration?</h3>
              <p className="text-xl text-muted-foreground">
                Our powerful API and webhook system makes it easy to connect with any tool
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-6 h-6 text-blue-600" />
                    RESTful API
                  </CardTitle>
                  <CardDescription>
                    Complete API access to all NMBR functionality
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Full CRUD operations</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Real-time webhooks</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>OAuth 2.0 authentication</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Rate limiting & monitoring</span>
                    </li>
                  </ul>
                  <Button className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View API Documentation
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-6 h-6 text-purple-600" />
                    Webhooks
                  </CardTitle>
                  <CardDescription>
                    Real-time notifications for all NMBR events
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Story view events</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Purchase notifications</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Subscriber updates</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Custom event triggers</span>
                    </li>
                  </ul>
                  <Button className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Webhooks
                  </Button>
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
            <h3 className="text-4xl font-bold">Ready to Connect Your Tools?</h3>
            <p className="text-xl opacity-90">
              Join thousands of organizations already using NMBR integrations to streamline their workflows and boost productivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary">
                <ExternalLink className="w-5 h-5 mr-2" />
                Contact Sales
              </Button>
            </div>
            <p className="text-sm opacity-75">
              Setup takes less than 5 minutes • No credit card required
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
