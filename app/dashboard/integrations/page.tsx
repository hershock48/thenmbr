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
  ShoppingCart,
  Store,
  Zap,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  ExternalLink,
  DollarSign,
  TrendingUp,
} from "lucide-react"

export default function IntegrationsPage() {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)

  const integrations = [
    {
      id: "shopify",
      name: "Shopify",
      description: "Connect your Shopify store to track story-driven sales",
      icon: ShoppingCart,
      status: "connected",
      revenue: "$12,450",
      orders: 89,
      setupSteps: 3,
      completedSteps: 3,
    },
    {
      id: "woocommerce",
      name: "WooCommerce",
      description: "Integrate with your WordPress WooCommerce store",
      icon: Store,
      status: "disconnected",
      revenue: "$0",
      orders: 0,
      setupSteps: 4,
      completedSteps: 0,
    },
    {
      id: "bigcommerce",
      name: "BigCommerce",
      description: "Connect your BigCommerce store for revenue tracking",
      icon: Zap,
      status: "setup_required",
      revenue: "$3,200",
      orders: 24,
      setupSteps: 3,
      completedSteps: 2,
    },
  ]

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
          Connect your e-commerce platforms to track story-driven sales and revenue attribution
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Connected Platforms</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">2</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$15,650</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Story-Driven Orders</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">113</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Integration Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">Available Integrations</h3>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Request Integration
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {integrations.map((integration) => {
            const Icon = integration.icon
            return (
              <Card key={integration.id} className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Icon className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-card-foreground">{integration.name}</CardTitle>
                        <CardDescription>{integration.description}</CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(integration.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Setup Progress</span>
                      <span className="text-card-foreground">
                        {integration.completedSteps}/{integration.setupSteps} steps
                      </span>
                    </div>
                    <Progress value={(integration.completedSteps / integration.setupSteps) * 100} className="h-2" />
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="text-lg font-semibold text-foreground">{integration.revenue}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Orders</p>
                      <p className="text-lg font-semibold text-foreground">{integration.orders}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    {integration.status === "connected" ? (
                      <>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </>
                    ) : integration.status === "setup_required" ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                            Complete Setup
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-popover border-border">
                          <DialogHeader>
                            <DialogTitle className="text-popover-foreground">
                              Complete {integration.name} Setup
                            </DialogTitle>
                            <DialogDescription>
                              Finish configuring your {integration.name} integration to start tracking story-driven
                              sales.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="api-key" className="text-popover-foreground">
                                API Key
                              </Label>
                              <Input id="api-key" placeholder="Enter your API key" className="bg-input border-border" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="webhook-url" className="text-popover-foreground">
                                Webhook URL
                              </Label>
                              <Input
                                id="webhook-url"
                                value="https://api.nmbr.com/webhooks/bigcommerce"
                                readOnly
                                className="bg-input border-border"
                              />
                            </div>
                            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                              Complete Integration
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                            Connect
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-popover border-border">
                          <DialogHeader>
                            <DialogTitle className="text-popover-foreground">Connect {integration.name}</DialogTitle>
                            <DialogDescription>
                              Set up your {integration.name} integration to start tracking story-driven sales.
                            </DialogDescription>
                          </DialogHeader>
                          <Tabs defaultValue="credentials" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="credentials">Credentials</TabsTrigger>
                              <TabsTrigger value="settings">Settings</TabsTrigger>
                            </TabsList>
                            <TabsContent value="credentials" className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="store-url" className="text-popover-foreground">
                                  Store URL
                                </Label>
                                <Input
                                  id="store-url"
                                  placeholder="https://yourstore.com"
                                  className="bg-input border-border"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="api-key" className="text-popover-foreground">
                                  API Key
                                </Label>
                                <Input
                                  id="api-key"
                                  placeholder="Enter your API key"
                                  className="bg-input border-border"
                                />
                              </div>
                            </TabsContent>
                            <TabsContent value="settings" className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="revenue-share" className="text-popover-foreground">
                                  Revenue Share (%)
                                </Label>
                                <Input id="revenue-share" placeholder="2.5" className="bg-input border-border" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="webhook-url" className="text-popover-foreground">
                                  Webhook URL
                                </Label>
                                <Input
                                  id="webhook-url"
                                  value="https://api.nmbr.com/webhooks/woocommerce"
                                  readOnly
                                  className="bg-input border-border"
                                />
                              </div>
                            </TabsContent>
                          </Tabs>
                          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                            Connect Integration
                          </Button>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
