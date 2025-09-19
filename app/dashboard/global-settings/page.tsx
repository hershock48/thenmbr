"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Globe,
  Languages,
  DollarSign,
  Clock,
  MapPin,
  Shield,
  Users,
  Settings,
  CheckCircle,
  AlertCircle,
  Save,
  RefreshCw,
  Download,
  Upload,
  Eye,
  EyeOff,
  Zap,
  Server,
  Database,
  Cloud,
  Smartphone,
  Monitor,
  Laptop,
  Calendar
} from "lucide-react"
import { useTranslation, localizationService } from "@/lib/localization"

export default function GlobalSettingsPage() {
  const { t, locale, setLocale, formatCurrency, formatDate, isRTL } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  // Global settings state
  const [globalSettings, setGlobalSettings] = useState({
    // Localization
    defaultLanguage: 'en-US',
    supportedLanguages: ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'zh-CN'],
    autoDetectLanguage: true,
    fallbackLanguage: 'en-US',
    
    // Currency
    defaultCurrency: 'USD',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'JPY'],
    autoDetectCurrency: true,
    currencyFormat: 'symbol', // symbol, code, name
    
    // Regional
    defaultTimezone: 'UTC',
    supportedTimezones: ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'],
    autoDetectTimezone: true,
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    
    // Compliance
    gdprEnabled: true,
    ccpaEnabled: true,
    cookieConsent: true,
    dataRetention: 365, // days
    
    // Performance
    cdnEnabled: true,
    edgeLocations: 12,
    cachingEnabled: true,
    compressionEnabled: true,
    
    // Security
    ssoEnabled: false,
    mfaRequired: false,
    sessionTimeout: 30, // minutes
    ipWhitelist: '',
    
    // Features
    multiTenant: true,
    whiteLabel: false,
    apiAccess: true,
    webhooks: true
  })

  // Load settings on mount
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      // In a real app, this would fetch from your API
      const savedSettings = localStorage.getItem('nmbr_global_settings')
      if (savedSettings) {
        setGlobalSettings(JSON.parse(savedSettings))
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setLoading(true)
    try {
      // In a real app, this would save to your API
      localStorage.setItem('nmbr_global_settings', JSON.stringify(globalSettings))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLanguageChange = (newLocale: string) => {
    setLocale(newLocale)
    setGlobalSettings(prev => ({ ...prev, defaultLanguage: newLocale }))
  }

  const supportedLocales = localizationService.getSupportedLocales()
  const supportedCurrencies = localizationService.getSupportedCurrencies()

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Global Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure global localization, regional settings, and compliance for your organization
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Settings Saved
            </Badge>
          )}
          <Button onClick={saveSettings} disabled={loading}>
            {loading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="localization" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="localization">Localization</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Localization Tab */}
        <TabsContent value="localization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Language Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="w-5 h-5" />
                  Language Settings
                </CardTitle>
                <CardDescription>
                  Configure language preferences and support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultLanguage">Default Language</Label>
                  <Select 
                    value={globalSettings.defaultLanguage} 
                    onValueChange={handleLanguageChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedLocales.map((locale) => (
                        <SelectItem key={locale.code} value={locale.code}>
                          <div className="flex items-center gap-2">
                            <span>{locale.nativeName}</span>
                            <span className="text-muted-foreground">({locale.name})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fallbackLanguage">Fallback Language</Label>
                  <Select 
                    value={globalSettings.fallbackLanguage} 
                    onValueChange={(value) => setGlobalSettings(prev => ({ ...prev, fallbackLanguage: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fallback language" />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedLocales.map((locale) => (
                        <SelectItem key={locale.code} value={locale.code}>
                          {locale.nativeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoDetectLanguage">Auto-detect Language</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically detect user's preferred language
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.autoDetectLanguage}
                    onCheckedChange={(checked) => 
                      setGlobalSettings(prev => ({ ...prev, autoDetectLanguage: checked }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Supported Languages</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {globalSettings.supportedLanguages.map((langCode) => {
                      const locale = supportedLocales.find(l => l.code === langCode)
                      return (
                        <div key={langCode} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{locale?.nativeName}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setGlobalSettings(prev => ({
                                ...prev,
                                supportedLanguages: prev.supportedLanguages.filter(l => l !== langCode)
                              }))
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    <Languages className="w-4 h-4 mr-2" />
                    Add Language
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Currency Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Currency Settings
                </CardTitle>
                <CardDescription>
                  Configure currency preferences and formatting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultCurrency">Default Currency</Label>
                  <Select 
                    value={globalSettings.defaultCurrency} 
                    onValueChange={(value) => setGlobalSettings(prev => ({ ...prev, defaultCurrency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedCurrencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center gap-2">
                            <span>{currency.symbol}</span>
                            <span>{currency.name}</span>
                            <span className="text-muted-foreground">({currency.code})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currencyFormat">Currency Format</Label>
                  <Select 
                    value={globalSettings.currencyFormat} 
                    onValueChange={(value) => setGlobalSettings(prev => ({ ...prev, currencyFormat: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="symbol">Symbol ($1,234.56)</SelectItem>
                      <SelectItem value="code">Code (USD 1,234.56)</SelectItem>
                      <SelectItem value="name">Name (1,234.56 US Dollars)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoDetectCurrency">Auto-detect Currency</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically detect user's currency based on location
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.autoDetectCurrency}
                    onCheckedChange={(checked) => 
                      setGlobalSettings(prev => ({ ...prev, autoDetectCurrency: checked }))
                    }
                  />
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-2">Preview</div>
                  <div className="text-lg">
                    {formatCurrency(1234.56, globalSettings.defaultCurrency)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RTL Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Right-to-Left (RTL) Support
              </CardTitle>
              <CardDescription>
                Configure RTL language support for Arabic, Hebrew, and Persian
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">RTL Languages Enabled</div>
                    <div className="text-sm text-muted-foreground">
                      Support for Arabic, Hebrew, and Persian languages
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Enabled
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl mb-2">العربية</div>
                    <div className="text-sm text-muted-foreground">Arabic</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl mb-2">עברית</div>
                    <div className="text-sm text-muted-foreground">Hebrew</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl mb-2">فارسی</div>
                    <div className="text-sm text-muted-foreground">Persian</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regional Tab */}
        <TabsContent value="regional" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Timezone Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Timezone Settings
                </CardTitle>
                <CardDescription>
                  Configure timezone and time formatting preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultTimezone">Default Timezone</Label>
                  <Select 
                    value={globalSettings.defaultTimezone} 
                    onValueChange={(value) => setGlobalSettings(prev => ({ ...prev, defaultTimezone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {globalSettings.supportedTimezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select 
                    value={globalSettings.dateFormat} 
                    onValueChange={(value) => setGlobalSettings(prev => ({ ...prev, dateFormat: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (US)</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (EU)</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO)</SelectItem>
                      <SelectItem value="DD.MM.YYYY">DD.MM.YYYY (DE)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Select 
                    value={globalSettings.timeFormat} 
                    onValueChange={(value) => setGlobalSettings(prev => ({ ...prev, timeFormat: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                      <SelectItem value="24h">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoDetectTimezone">Auto-detect Timezone</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically detect user's timezone
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.autoDetectTimezone}
                    onCheckedChange={(checked) => 
                      setGlobalSettings(prev => ({ ...prev, autoDetectTimezone: checked }))
                    }
                  />
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-2">Preview</div>
                  <div className="text-lg">
                    {formatDate(new Date())}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regional Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Regional Features
                </CardTitle>
                <CardDescription>
                  Configure region-specific features and compliance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Multi-language Support</div>
                      <div className="text-sm text-muted-foreground">Support for 25+ languages</div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Enabled
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Multi-currency Support</div>
                      <div className="text-sm text-muted-foreground">Support for 15+ currencies</div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Enabled
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Regional Compliance</div>
                      <div className="text-sm text-muted-foreground">GDPR, CCPA, and other regional laws</div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Enabled
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">CDN Distribution</div>
                      <div className="text-sm text-muted-foreground">Global content delivery network</div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Enabled
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Privacy Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy Compliance
                </CardTitle>
                <CardDescription>
                  Configure privacy and data protection compliance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="gdprEnabled">GDPR Compliance</Label>
                    <p className="text-sm text-muted-foreground">
                      European General Data Protection Regulation
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.gdprEnabled}
                    onCheckedChange={(checked) => 
                      setGlobalSettings(prev => ({ ...prev, gdprEnabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ccpaEnabled">CCPA Compliance</Label>
                    <p className="text-sm text-muted-foreground">
                      California Consumer Privacy Act
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.ccpaEnabled}
                    onCheckedChange={(checked) => 
                      setGlobalSettings(prev => ({ ...prev, ccpaEnabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="cookieConsent">Cookie Consent</Label>
                    <p className="text-sm text-muted-foreground">
                      Show cookie consent banner to users
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.cookieConsent}
                    onCheckedChange={(checked) => 
                      setGlobalSettings(prev => ({ ...prev, cookieConsent: checked }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataRetention">Data Retention (days)</Label>
                  <Input
                    type="number"
                    value={globalSettings.dataRetention}
                    onChange={(e) => 
                      setGlobalSettings(prev => ({ ...prev, dataRetention: parseInt(e.target.value) }))
                    }
                    min="1"
                    max="3650"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Compliance Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Compliance Status
                </CardTitle>
                <CardDescription>
                  Current compliance status and requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'GDPR', status: 'compliant', score: 95 },
                    { name: 'CCPA', status: 'compliant', score: 92 },
                    { name: 'SOC 2', status: 'compliant', score: 98 },
                    { name: 'PCI DSS', status: 'compliant', score: 100 }
                  ].map((compliance, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{compliance.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {compliance.status === 'compliant' ? 'Compliant' : 'Not Compliant'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{compliance.score}%</div>
                        <Badge 
                          variant={compliance.status === 'compliant' ? 'default' : 'secondary'}
                          className={compliance.status === 'compliant' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {compliance.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CDN Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="w-5 h-5" />
                  CDN Settings
                </CardTitle>
                <CardDescription>
                  Configure content delivery network for global performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="cdnEnabled">CDN Enabled</Label>
                    <p className="text-sm text-muted-foreground">
                      Global content delivery network
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.cdnEnabled}
                    onCheckedChange={(checked) => 
                      setGlobalSettings(prev => ({ ...prev, cdnEnabled: checked }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edgeLocations">Edge Locations</Label>
                  <Input
                    type="number"
                    value={globalSettings.edgeLocations}
                    onChange={(e) => 
                      setGlobalSettings(prev => ({ ...prev, edgeLocations: parseInt(e.target.value) }))
                    }
                    min="1"
                    max="100"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="cachingEnabled">Caching Enabled</Label>
                    <p className="text-sm text-muted-foreground">
                      Cache static content for faster loading
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.cachingEnabled}
                    onCheckedChange={(checked) => 
                      setGlobalSettings(prev => ({ ...prev, cachingEnabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compressionEnabled">Compression Enabled</Label>
                    <p className="text-sm text-muted-foreground">
                      Compress content for faster transfer
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.compressionEnabled}
                    onCheckedChange={(checked) => 
                      setGlobalSettings(prev => ({ ...prev, compressionEnabled: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>
                  Current performance metrics and optimization status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: 'Page Load Time', value: '1.2s', status: 'excellent' },
                    { metric: 'Time to First Byte', value: '180ms', status: 'good' },
                    { metric: 'Largest Contentful Paint', value: '0.8s', status: 'excellent' },
                    { metric: 'Cumulative Layout Shift', value: '0.05', status: 'good' }
                  ].map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{metric.metric}</div>
                        <div className="text-sm text-muted-foreground">
                          {metric.status === 'excellent' ? 'Excellent' : 'Good'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{metric.value}</div>
                        <Badge 
                          variant={metric.status === 'excellent' ? 'default' : 'secondary'}
                          className={metric.status === 'excellent' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                        >
                          {metric.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure security features and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ssoEnabled">Single Sign-On (SSO)</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable SSO integration
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.ssoEnabled}
                    onCheckedChange={(checked) => 
                      setGlobalSettings(prev => ({ ...prev, ssoEnabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="mfaRequired">Multi-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require MFA for all users
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.mfaRequired}
                    onCheckedChange={(checked) => 
                      setGlobalSettings(prev => ({ ...prev, mfaRequired: checked }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={globalSettings.sessionTimeout}
                    onChange={(e) => 
                      setGlobalSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))
                    }
                    min="5"
                    max="480"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                  <Input
                    placeholder="192.168.1.0/24, 10.0.0.0/8"
                    value={globalSettings.ipWhitelist}
                    onChange={(e) => 
                      setGlobalSettings(prev => ({ ...prev, ipWhitelist: e.target.value }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Feature Flags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Feature Flags
                </CardTitle>
                <CardDescription>
                  Enable or disable platform features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="multiTenant">Multi-tenant Support</Label>
                    <p className="text-sm text-muted-foreground">
                      Support multiple organizations
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.multiTenant}
                    onCheckedChange={(checked) => 
                      setGlobalSettings(prev => ({ ...prev, multiTenant: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="whiteLabel">White-label Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Remove NMBR branding
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.whiteLabel}
                    onCheckedChange={(checked) => 
                      setGlobalSettings(prev => ({ ...prev, whiteLabel: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="apiAccess">API Access</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable API access for integrations
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.apiAccess}
                    onCheckedChange={(checked) => 
                      setGlobalSettings(prev => ({ ...prev, apiAccess: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="webhooks">Webhooks</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable webhook notifications
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.webhooks}
                    onCheckedChange={(checked) => 
                      setGlobalSettings(prev => ({ ...prev, webhooks: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
