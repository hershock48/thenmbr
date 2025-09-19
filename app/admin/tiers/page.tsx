"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Hash, 
  DollarSign, 
  Users, 
  Mail, 
  BarChart3, 
  Shield, 
  Globe, 
  Settings,
  Edit,
  Save,
  X,
  Plus,
  Trash2
} from "lucide-react"

interface TierFeature {
  id: string
  name: string
  description: string
  included: boolean
  limit?: string
}

interface PricingTier {
  id: string
  name: string
  description: string
  monthlyPrice: number
  annualPrice: number
  activeNmbrs: number
  platformFee: number
  seats: number
  support: string
  features: TierFeature[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const defaultTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small nonprofits and grassroots projects",
    monthlyPrice: 99,
    annualPrice: 990,
    activeNmbrs: 3,
    platformFee: 5,
    seats: 2,
    support: "Email (2 biz days)",
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    features: [
      { id: "nmbrs", name: "Active NMBRs", description: "Number of active story slots", included: true, limit: "1-3" },
      { id: "branding", name: "Basic Branding", description: "Logo + colors + 'Powered by NMBR'", included: true },
      { id: "analytics", name: "Basic Analytics", description: "Views, searches, donations", included: true },
      { id: "exports", name: "CSV Exports", description: "Subscriber and donation data", included: true },
      { id: "reassign", name: "NMBR Reassignment", description: "Change story assignments", included: true, limit: "2/year" },
      { id: "white-label", name: "White-label", description: "Custom subdomain and branding", included: false },
      { id: "api", name: "API Access", description: "REST API and webhooks", included: false },
      { id: "email", name: "Built-in Email", description: "Send newsletters from platform", included: false },
    ]
  },
  {
    id: "growth",
    name: "Growth",
    description: "For growing nonprofits and SMBs",
    monthlyPrice: 199,
    annualPrice: 1990,
    activeNmbrs: 5,
    platformFee: 3,
    seats: -1, // unlimited
    support: "Email + Chat (1 biz day)",
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    features: [
      { id: "nmbrs", name: "Active NMBRs", description: "Number of active story slots", included: true, limit: "5" },
      { id: "branding", name: "Advanced Branding", description: "Remove 'Powered by NMBR'", included: true },
      { id: "analytics", name: "Enhanced Analytics", description: "Donations by NMBR, growth trends", included: true },
      { id: "integrations", name: "Integrations", description: "Mailchimp, Constant Contact, Zapier", included: true },
      { id: "marketplace", name: "Marketplace", description: "Self-serve product ordering", included: true },
      { id: "reassign", name: "NMBR Reassignment", description: "Change story assignments", included: true, limit: "5/year" },
      { id: "white-label", name: "White-label", description: "Custom subdomain and branding", included: false },
      { id: "api", name: "API Access", description: "REST API and webhooks", included: false },
      { id: "email", name: "Built-in Email", description: "Send newsletters from platform", included: false },
    ]
  },
  {
    id: "professional",
    name: "Professional",
    description: "For established nonprofits and mid-sized brands",
    monthlyPrice: 399,
    annualPrice: 3990,
    activeNmbrs: 10,
    platformFee: 1,
    seats: -1, // unlimited
    support: "Priority (8 biz hours)",
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    features: [
      { id: "nmbrs", name: "Active NMBRs", description: "Number of active story slots", included: true, limit: "10" },
      { id: "branding", name: "White-label", description: "Custom subdomain and branding", included: true },
      { id: "analytics", name: "Advanced Analytics", description: "Open rates, funnels, UTM tracking", included: true },
      { id: "integrations", name: "API & Integrations", description: "Public API + CRM connectors", included: true },
      { id: "email", name: "Built-in Email", description: "25k emails/month included", included: true, limit: "25k/month" },
      { id: "roles", name: "Team Roles", description: "Admin, Editor, Viewer permissions", included: true },
      { id: "onboarding", name: "Onboarding", description: "2 live setup sessions", included: true },
      { id: "reassign", name: "NMBR Reassignment", description: "Change story assignments", included: true, limit: "12/year" },
    ]
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large nonprofits and multi-brand portfolios",
    monthlyPrice: 750,
    annualPrice: 9000,
    activeNmbrs: -1, // unlimited
    platformFee: 0,
    seats: -1, // unlimited
    support: "Dedicated CSM (4 biz hours)",
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    features: [
      { id: "nmbrs", name: "Active NMBRs", description: "Number of active story slots", included: true, limit: "Unlimited" },
      { id: "branding", name: "White-label", description: "Custom subdomain and branding", included: true },
      { id: "analytics", name: "Advanced Analytics", description: "Open rates, funnels, UTM tracking", included: true },
      { id: "integrations", name: "API & Integrations", description: "Public API + CRM connectors", included: true },
      { id: "email", name: "Built-in Email", description: "250k emails/month included", included: true, limit: "250k/month" },
      { id: "sso", name: "SSO", description: "SAML/OIDC + SCIM", included: true },
      { id: "security", name: "Advanced Security", description: "IP allow-listing, audit logs", included: true },
      { id: "reassign", name: "NMBR Reassignment", description: "Change story assignments", included: true, limit: "Unlimited" },
    ]
  }
]

export default function TiersPage() {
  const [tiers, setTiers] = useState<PricingTier[]>(defaultTiers)
  const [editingTier, setEditingTier] = useState<string | null>(null)
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null)

  const handleEditTier = (tierId: string) => {
    const tier = tiers.find(t => t.id === tierId)
    if (tier) {
      setSelectedTier({ ...tier })
      setEditingTier(tierId)
    }
  }

  const handleSaveTier = () => {
    if (selectedTier && editingTier) {
      setTiers(prev => prev.map(tier => 
        tier.id === editingTier ? { ...selectedTier, updatedAt: new Date().toISOString() } : tier
      ))
      setEditingTier(null)
      setSelectedTier(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingTier(null)
    setSelectedTier(null)
  }

  const handleToggleTier = (tierId: string) => {
    setTiers(prev => prev.map(tier => 
      tier.id === tierId ? { ...tier, isActive: !tier.isActive } : tier
    ))
  }

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'starter': return Hash
      case 'growth': return Users
      case 'professional': return BarChart3
      case 'enterprise': return Shield
      default: return Settings
    }
  }

  const getTierColor = (tierId: string) => {
    switch (tierId) {
      case 'starter': return 'from-rose-500 to-pink-600'
      case 'growth': return 'from-blue-500 to-indigo-600'
      case 'professional': return 'from-emerald-500 to-teal-600'
      case 'enterprise': return 'from-purple-500 to-violet-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pricing Tiers</h1>
          <p className="text-muted-foreground">Manage subscription tiers and feature access</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add New Tier
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier) => {
              const IconComponent = getTierIcon(tier.id)
              const color = getTierColor(tier.id)

              return (
                <Card key={tier.id} className={`relative ${!tier.isActive ? 'opacity-50' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditTier(tier.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleTier(tier.id)}
                        >
                          {tier.isActive ? 'Disable' : 'Enable'}
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{tier.name}</CardTitle>
                    <CardDescription className="text-sm">{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="text-2xl font-bold">${tier.monthlyPrice}</div>
                        <div className="text-xs text-muted-foreground">/month</div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="text-2xl font-bold">${tier.annualPrice}</div>
                        <div className="text-xs text-muted-foreground">/year</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Active NMBRs:</span>
                        <span className="font-medium">{tier.activeNmbrs === -1 ? 'Unlimited' : tier.activeNmbrs}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Platform Fee:</span>
                        <span className="font-medium">{tier.platformFee}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Seats:</span>
                        <span className="font-medium">{tier.seats === -1 ? 'Unlimited' : tier.seats}</span>
                      </div>
                    </div>

                    <Badge variant={tier.isActive ? "default" : "secondary"}>
                      {tier.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Matrix</CardTitle>
              <CardDescription>Compare features across all tiers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">Feature</th>
                      {tiers.map((tier) => (
                        <th key={tier.id} className="text-center p-4 font-semibold">
                          {tier.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tiers[0]?.features.map((feature) => (
                      <tr key={feature.id} className="border-b">
                        <td className="p-4 font-medium">{feature.name}</td>
                        {tiers.map((tier) => {
                          const tierFeature = tier.features.find(f => f.id === feature.id)
                          return (
                            <td key={tier.id} className="text-center p-4">
                              {tierFeature?.included ? (
                                <div className="flex items-center justify-center">
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                  {tierFeature.limit && (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                      {tierFeature.limit}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <X className="w-5 h-5 text-red-500 mx-auto" />
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organizations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organizations by Tier</CardTitle>
              <CardDescription>View which organizations are on each tier</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tiers.map((tier) => (
                  <div key={tier.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{tier.name}</h3>
                      <Badge variant="outline">0 organizations</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      No organizations currently on this tier
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Tier Modal */}
      {editingTier && selectedTier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Edit Tier: {selectedTier.name}</CardTitle>
                <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Tier Name</Label>
                  <Input
                    id="name"
                    value={selectedTier.name}
                    onChange={(e) => setSelectedTier({ ...selectedTier, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={selectedTier.description}
                    onChange={(e) => setSelectedTier({ ...selectedTier, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="monthlyPrice">Monthly Price</Label>
                  <Input
                    id="monthlyPrice"
                    type="number"
                    value={selectedTier.monthlyPrice}
                    onChange={(e) => setSelectedTier({ ...selectedTier, monthlyPrice: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="annualPrice">Annual Price</Label>
                  <Input
                    id="annualPrice"
                    type="number"
                    value={selectedTier.annualPrice}
                    onChange={(e) => setSelectedTier({ ...selectedTier, annualPrice: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="platformFee">Platform Fee (%)</Label>
                  <Input
                    id="platformFee"
                    type="number"
                    value={selectedTier.platformFee}
                    onChange={(e) => setSelectedTier({ ...selectedTier, platformFee: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="activeNmbrs">Active NMBRs</Label>
                  <Input
                    id="activeNmbrs"
                    type="number"
                    value={selectedTier.activeNmbrs === -1 ? '' : selectedTier.activeNmbrs}
                    onChange={(e) => setSelectedTier({ ...selectedTier, activeNmbrs: e.target.value === '' ? -1 : Number(e.target.value) })}
                    placeholder="Unlimited"
                  />
                </div>
                <div>
                  <Label htmlFor="seats">Team Seats</Label>
                  <Input
                    id="seats"
                    type="number"
                    value={selectedTier.seats === -1 ? '' : selectedTier.seats}
                    onChange={(e) => setSelectedTier({ ...selectedTier, seats: e.target.value === '' ? -1 : Number(e.target.value) })}
                    placeholder="Unlimited"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTier}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
