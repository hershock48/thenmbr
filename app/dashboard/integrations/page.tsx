"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Users,
  Mail,
  Heart,
  BarChart3,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  ExternalLink,
  DollarSign,
  TrendingUp,
  Zap,
  Shield,
  MessageSquare,
  Calendar,
  FileText,
  Globe,
} from "lucide-react"
import { useOrganization } from "@/contexts/OrganizationContext"

export default function IntegrationsPage() {
  const { terminology } = useOrganization()
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)

  // Start with empty integrations - will populate as users connect tools
  const integrations = [
    {
      id: "salesforce",
      name: "Salesforce",
      description: "Sync donor data and track fundraising campaigns",
      icon: Users,
      status: "disconnected",
      category: "crm",
      setupSteps: 4,
      completedSteps: 0,
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      description: "Sync email lists and automate donor communications",
      icon: Mail,
      status: "disconnected",
      category: "email",
      setupSteps: 3,
      completedSteps: 0,
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Process donations and track payment analytics",
      icon: DollarSign,
      status: "disconnected",
      category: "payments",
      setupSteps: 2,
      completedSteps: 0,
    },
    {
      id: "google_analytics",
      name: "Google Analytics",
      description: "Track website traffic and donor engagement",
      icon: BarChart3,
      status: "disconnected",
      category: "analytics",
      setupSteps: 3,
      completedSteps: 0,
    },
    {
      id: "facebook_pixel",
      name: "Facebook Pixel",
      description: "Track social media engagement and conversions",
      icon: Globe,
      status: "disconnected",
      category: "social",
      setupSteps: 2,
      completedSteps: 0,
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "Automate workflows between your favorite tools",
      icon: Zap,
      status: "disconnected",
      category: "automation",
      setupSteps: 3,
      completedSteps: 0,
    },
  ]

  const categories = [
    { id: "all", name: "All Integrations", icon: Settings },
    { id: "crm", name: "CRM & Donor Management", icon: Users },
    { id: "email", name: "Email Marketing", icon: Mail },
    { id: "payments", name: "Payment Processing", icon: DollarSign },
    { id: "analytics", name: "Analytics & Tracking", icon: BarChart3 },
    { id: "social", name: "Social Media", icon: Globe },
    { id: "automation", name: "Automation", icon: Zap },
  ]

  const [selectedCategory, setSelectedCategory] = useState("all")
  const filteredIntegrations = selectedCategory === "all" 
    ? integrations 
    : integrations.filter(integration => integration.category === selectedCategory)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        )
      case "disconnected":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Disconnected
          </Badge>
        )
      case "setup_required":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Setup Required
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Integrations</h1>
        <p className="text-muted-foreground mt-2">
          Connect your favorite tools to streamline your {terminology.fundraising.toLowerCase()} and donor management
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Connected Tools</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">0</div>
            <p className="text-xs text-muted-foreground">No integrations yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Automated Workflows</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">0</div>
            <p className="text-xs text-muted-foreground">Connect tools to enable automation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Data Sync Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">Ready</div>
            <p className="text-xs text-muted-foreground">All systems ready for integration</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              {category.name}
            </Button>
          )
        })}
      </div>

      {/* Integration Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">Available Integrations</h3>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Request Integration
          </Button>
        </div>

        {filteredIntegrations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Settings className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              No Integrations in This Category
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
              Try selecting a different category or browse all available integrations.
            </p>
            <Button onClick={() => setSelectedCategory("all")}>
              View All Integrations
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredIntegrations.map((integration) => {
              const Icon = integration.icon
              return (
                <Card key={integration.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-muted rounded-lg">
                          <Icon className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-foreground">{integration.name}</CardTitle>
                          <CardDescription>{integration.description}</CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(integration.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Setup Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Setup Progress</span>
                        <span className="text-foreground">
                          {integration.completedSteps}/{integration.setupSteps} steps
                        </span>
                      </div>
                      <Progress value={(integration.completedSteps / integration.setupSteps) * 100} className="h-2" />
                    </div>

                    {/* Benefits */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-foreground">Benefits:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {integration.category === "crm" && (
                          <>
                            <li>• Sync donor contact information</li>
                            <li>• Track donation history and preferences</li>
                            <li>• Automate follow-up workflows</li>
                          </>
                        )}
                        {integration.category === "email" && (
                          <>
                            <li>• Sync email lists automatically</li>
                            <li>• Segment donors by engagement</li>
                            <li>• Track email campaign performance</li>
                          </>
                        )}
                        {integration.category === "payments" && (
                          <>
                            <li>• Process donations securely</li>
                            <li>• Track payment analytics</li>
                            <li>• Automate receipt generation</li>
                          </>
                        )}
                        {integration.category === "analytics" && (
                          <>
                            <li>• Track website engagement</li>
                            <li>• Monitor donor journey</li>
                            <li>• Measure campaign effectiveness</li>
                          </>
                        )}
                        {integration.category === "social" && (
                          <>
                            <li>• Track social media engagement</li>
                            <li>• Measure conversion rates</li>
                            <li>• Optimize ad targeting</li>
                          </>
                        )}
                        {integration.category === "automation" && (
                          <>
                            <li>• Connect multiple tools</li>
                            <li>• Automate repetitive tasks</li>
                            <li>• Streamline workflows</li>
                          </>
                        )}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      {integration.status === "connected" ? (
                        <>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Settings className="w-4 h-4 mr-2" />
                            Configure
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                              <Plus className="w-4 h-4 mr-2" />
                              Connect
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Connect {integration.name}</DialogTitle>
                              <DialogDescription>
                                Set up your {integration.name} integration to start syncing data and automating workflows.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="api-key">API Key</Label>
                                <Input id="api-key" placeholder="Enter your API key" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="webhook-url">Webhook URL</Label>
                                <Input
                                  id="webhook-url"
                                  value={`https://api.nmbr.com/webhooks/${integration.id}`}
                                  readOnly
                                />
                              </div>
                              <Button className="w-full">
                                Connect Integration
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
