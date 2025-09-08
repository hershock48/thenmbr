"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Settings, 
  Save, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Globe,
  Shield,
  Mail,
  DollarSign
} from "lucide-react"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    // Platform Settings
    platformName: "NMBR Platform",
    platformUrl: "https://thenmbr.com",
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    
    // Business Settings
    businessPricing: {
      basic: 0,
      pro: 99,
      enterprise: 299
    },
    
    // Nonprofit Settings
    nonprofitPricing: {
      basic: 0,
      pro: 49,
      enterprise: 149
    },
    
    // Email Settings
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "noreply@thenmbr.com",
    fromEmail: "noreply@thenmbr.com",
    
    // Security Settings
    maxLoginAttempts: 5,
    sessionTimeout: 24,
    require2FA: false,
    
    // Analytics Settings
    googleAnalyticsId: "",
    trackingEnabled: true,
    
    // Feature Flags
    features: {
      aiNewsletterBuilder: true,
      customBranding: true,
      multiLanguage: false,
      apiAccess: true,
      webhooks: false
    }
  })

  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLastSaved(new Date())
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const updateNestedSetting = (path: string[], value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev }
      let current = newSettings
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]] = { ...current[path[i]] }
      }
      
      current[path[path.length - 1]] = value
      return newSettings
    })
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Platform Settings</h1>
            <p className="text-muted-foreground">Configure platform-wide settings and preferences</p>
          </div>
          <div className="flex items-center gap-4">
            {lastSaved && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Last saved: {lastSaved.toLocaleTimeString()}
              </div>
            )}
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Platform Configuration
                </CardTitle>
                <CardDescription>
                  Basic platform settings and information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platformName">Platform Name</Label>
                    <Input
                      id="platformName"
                      value={settings.platformName}
                      onChange={(e) => updateSetting('platformName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platformUrl">Platform URL</Label>
                    <Input
                      id="platformUrl"
                      value={settings.platformUrl}
                      onChange={(e) => updateSetting('platformUrl', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Temporarily disable public access to the platform
                      </p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Registration Enabled</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow new users to register accounts
                      </p>
                    </div>
                    <Switch
                      checked={settings.registrationEnabled}
                      onCheckedChange={(checked) => updateSetting('registrationEnabled', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Verification Required</Label>
                      <p className="text-sm text-muted-foreground">
                        Require users to verify their email addresses
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailVerificationRequired}
                      onCheckedChange={(checked) => updateSetting('emailVerificationRequired', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Settings */}
          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing Configuration
                </CardTitle>
                <CardDescription>
                  Set pricing tiers for different organization types
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Business Pricing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="business-basic">Basic (Free)</Label>
                      <Input
                        id="business-basic"
                        type="number"
                        value={settings.businessPricing.basic}
                        onChange={(e) => updateNestedSetting(['businessPricing', 'basic'], parseInt(e.target.value))}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-pro">Pro</Label>
                      <Input
                        id="business-pro"
                        type="number"
                        value={settings.businessPricing.pro}
                        onChange={(e) => updateNestedSetting(['businessPricing', 'pro'], parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-enterprise">Enterprise</Label>
                      <Input
                        id="business-enterprise"
                        type="number"
                        value={settings.businessPricing.enterprise}
                        onChange={(e) => updateNestedSetting(['businessPricing', 'enterprise'], parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Nonprofit Pricing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nonprofit-basic">Basic (Free)</Label>
                      <Input
                        id="nonprofit-basic"
                        type="number"
                        value={settings.nonprofitPricing.basic}
                        onChange={(e) => updateNestedSetting(['nonprofitPricing', 'basic'], parseInt(e.target.value))}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nonprofit-pro">Pro</Label>
                      <Input
                        id="nonprofit-pro"
                        type="number"
                        value={settings.nonprofitPricing.pro}
                        onChange={(e) => updateNestedSetting(['nonprofitPricing', 'pro'], parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nonprofit-enterprise">Enterprise</Label>
                      <Input
                        id="nonprofit-enterprise"
                        type="number"
                        value={settings.nonprofitPricing.enterprise}
                        onChange={(e) => updateNestedSetting(['nonprofitPricing', 'enterprise'], parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Configuration
                </CardTitle>
                <CardDescription>
                  Configure SMTP settings for sending emails
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={settings.smtpHost}
                      onChange={(e) => updateSetting('smtpHost', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={settings.smtpPort}
                      onChange={(e) => updateSetting('smtpPort', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpUser">SMTP Username</Label>
                    <Input
                      id="smtpUser"
                      value={settings.smtpUser}
                      onChange={(e) => updateSetting('smtpUser', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fromEmail">From Email</Label>
                    <Input
                      id="fromEmail"
                      value={settings.fromEmail}
                      onChange={(e) => updateSetting('fromEmail', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Configuration
                </CardTitle>
                <CardDescription>
                  Configure security settings and authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require 2FA</Label>
                    <p className="text-sm text-muted-foreground">
                      Require two-factor authentication for all users
                    </p>
                  </div>
                  <Switch
                    checked={settings.require2FA}
                    onCheckedChange={(checked) => updateSetting('require2FA', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Settings */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Analytics Configuration
                </CardTitle>
                <CardDescription>
                  Configure analytics and tracking settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                  <Input
                    id="googleAnalyticsId"
                    value={settings.googleAnalyticsId}
                    onChange={(e) => updateSetting('googleAnalyticsId', e.target.value)}
                    placeholder="GA-XXXXXXXXX"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Tracking Enabled</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable analytics tracking across the platform
                    </p>
                  </div>
                  <Switch
                    checked={settings.trackingEnabled}
                    onCheckedChange={(checked) => updateSetting('trackingEnabled', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feature Flags */}
          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Feature Flags
                </CardTitle>
                <CardDescription>
                  Enable or disable platform features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>AI Newsletter Builder</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable AI-powered newsletter content generation
                      </p>
                    </div>
                    <Switch
                      checked={settings.features.aiNewsletterBuilder}
                      onCheckedChange={(checked) => updateNestedSetting(['features', 'aiNewsletterBuilder'], checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Custom Branding</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow organizations to customize their branding
                      </p>
                    </div>
                    <Switch
                      checked={settings.features.customBranding}
                      onCheckedChange={(checked) => updateNestedSetting(['features', 'customBranding'], checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Multi-Language Support</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable multiple language support
                      </p>
                    </div>
                    <Switch
                      checked={settings.features.multiLanguage}
                      onCheckedChange={(checked) => updateNestedSetting(['features', 'multiLanguage'], checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>API Access</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable API access for integrations
                      </p>
                    </div>
                    <Switch
                      checked={settings.features.apiAccess}
                      onCheckedChange={(checked) => updateNestedSetting(['features', 'apiAccess'], checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Webhooks</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable webhook notifications
                      </p>
                    </div>
                    <Switch
                      checked={settings.features.webhooks}
                      onCheckedChange={(checked) => updateNestedSetting(['features', 'webhooks'], checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
