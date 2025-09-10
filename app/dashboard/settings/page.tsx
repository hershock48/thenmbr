"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Users, CreditCard, Shield, Plus, Trash2, Edit, Copy } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage your organization profile, team, billing, and platform preferences.
          </p>
        </div>

        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Management */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization Profile</CardTitle>
                <CardDescription>Update your nonprofit information and branding settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">Organization Name</Label>
                    <Input id="org-name" placeholder="Enter your nonprofit name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cause">Cause Focus</Label>
                    <Input id="cause" placeholder="e.g., Education, Healthcare, Community" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" placeholder="https://yournonprofit.org" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="+1 (555) 123-4567" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Mission Statement</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your organization's mission and impact..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Management */}
          <TabsContent value="team" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Team Members</h3>
                <p className="text-sm text-muted-foreground">Manage your team and their permissions.</p>
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>

            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No team members yet</h3>
              <p className="text-muted-foreground mb-4">
                Invite team members to help manage your nonprofit's impact stories and donor communications.
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Invite Team Member
              </Button>
            </div>
          </TabsContent>

          {/* Billing Management */}
          <TabsContent value="billing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>Your subscription details and usage.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Plan</span>
                    <Badge className="bg-primary text-primary-foreground">Free Trial</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Monthly Cost</span>
                    <span className="font-semibold">$0/month</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Trial Ends</span>
                    <span className="text-sm">14 days remaining</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Stories Created</span>
                    <span className="text-sm">0 / 5</span>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Upgrade Plan
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Manage your billing information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-5 bg-primary rounded"></div>
                      <div>
                        <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                        <p className="text-xs text-muted-foreground">Expires 12/26</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Sharing</CardTitle>
                <CardDescription>Track your story-driven sales and revenue sharing.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-primary">$12,847</p>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-secondary">$642</p>
                    <p className="text-sm text-muted-foreground">Platform Fee (5%)</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-accent">$12,205</p>
                    <p className="text-sm text-muted-foreground">Your Share</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage your API keys for integrations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted">
                  <div>
                    <p className="text-sm font-medium">Production API Key</p>
                    <p className="text-xs text-muted-foreground font-mono">nmbr_prod_••••••••••••••••</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <Button variant="outline">Generate New Key</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Preferences</CardTitle>
                <CardDescription>Configure your security settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive security alerts via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex justify-end">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Save Security Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
