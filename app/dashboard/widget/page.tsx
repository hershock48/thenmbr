"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Eye, Code, Settings, ExternalLink, Home, Save } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function WidgetPage() {
  // Widget configuration state
  const [widgetConfig, setWidgetConfig] = useState({
    primaryColor: "#2563eb",
    secondaryColor: "#ffffff",
    title: "Find Your NMBR Story",
    description: "Enter your bracelet code to discover the story behind it",
    size: "medium",
    searchPlaceholder: "e.g., HOPE001",
    ctaText: "Get Updates",
    donateText: "Donate",
    successMessage: "Thank you for your support! You'll receive updates about the impact of your contribution.",
    showVideoButton: true,
    requireEmail: true,
    showProgressBar: true,
    defaultAmounts: "25, 50, 100"
  })

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [copySuccess, setCopySuccess] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  // Update config and mark as changed
  const updateConfig = (key: string, value: any) => {
    setWidgetConfig(prev => ({ ...prev, [key]: value }))
    setHasUnsavedChanges(true)
  }

  // Save configuration
  const saveConfig = async () => {
    setIsSaving(true)
    try {
      // Here you would typically save to your backend/database
      console.log("Saving widget config:", widgetConfig)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setHasUnsavedChanges(false)
      setCopySuccess("Configuration saved successfully!")
      setTimeout(() => setCopySuccess(""), 3000)
    } catch (error) {
      console.error("Failed to save configuration:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Copy to clipboard functionality
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(`${type} copied to clipboard!`)
      setTimeout(() => setCopySuccess(""), 3000)
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
      setCopySuccess("Failed to copy to clipboard")
      setTimeout(() => setCopySuccess(""), 3000)
    }
  }

  // Generate dynamic embed codes
  const generateIframeCode = () => {
    const params = new URLSearchParams({
      primaryColor: widgetConfig.primaryColor.replace('#', '%23'),
      secondaryColor: widgetConfig.secondaryColor.replace('#', '%23'),
      title: widgetConfig.title,
      description: widgetConfig.description,
      size: widgetConfig.size
    })
    
    return `<iframe 
  src="https://nmbr-platform.vercel.app/widget/hope-foundation?${params.toString()}"
  width="${widgetConfig.size === 'small' ? '300' : widgetConfig.size === 'large' ? '500' : '400'}" 
  height="600" 
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
</iframe>`
  }

  const generateJavaScriptCode = () => {
    return `<div id="nmbr-widget"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://nmbr-platform.vercel.app/widget.js';
    script.onload = function() {
      NMBRWidget.init({
        container: '#nmbr-widget',
        organization: 'hope-foundation',
        primaryColor: '${widgetConfig.primaryColor}',
        secondaryColor: '${widgetConfig.secondaryColor}',
        title: '${widgetConfig.title}',
        description: '${widgetConfig.description}',
        size: '${widgetConfig.size}'
      });
    };
    document.head.appendChild(script);
  })();
</script>`
  }

  // Auto-save with proper debouncing
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timeoutId = setTimeout(() => {
        saveConfig()
      }, 2000) // Auto-save after 2 seconds of no changes

      return () => clearTimeout(timeoutId)
    }
  }, [hasUnsavedChanges]) // Only depend on hasUnsavedChanges, not widgetConfig
  return (
    <div className="space-y-8">
      {/* Success Message */}
      {copySuccess && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <div className="w-4 h-4 text-green-500">✅</div>
          <span className="text-green-700 text-sm">{copySuccess}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setCopySuccess("")}
            className="ml-auto text-green-500 hover:text-green-700"
          >
            ×
          </Button>
        </div>
      )}

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard" className="flex items-center gap-1 text-slate-600 hover:text-slate-900">
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-slate-900 font-medium">Widget</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Widget</h1>
          <p className="text-gray-600">Customize and embed your NMBR widget on your website</p>
          {hasUnsavedChanges && (
            <p className="text-sm text-orange-600 mt-1">• You have unsaved changes</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <Button 
              variant="outline" 
              onClick={saveConfig}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          )}
          <Button 
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Hide Preview' : 'Preview'}
          </Button>
          <Button
            onClick={() => window.open('/widget', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Live Widget
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Configuration */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Widget Configuration
              </CardTitle>
              <CardDescription>Customize how your widget appears and behaves</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="appearance" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="behavior">Behavior</TabsTrigger>
                </TabsList>

                <TabsContent value="appearance" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="primary-color" 
                          type="color" 
                          value={widgetConfig.primaryColor} 
                          onChange={(e) => updateConfig('primaryColor', e.target.value)}
                          className="w-12 h-10 p-1 cursor-pointer" 
                        />
                        <Input 
                          value={widgetConfig.primaryColor} 
                          onChange={(e) => updateConfig('primaryColor', e.target.value)}
                          className="flex-1" 
                          placeholder="#2563eb"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondary-color">Secondary Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="secondary-color" 
                          type="color" 
                          value={widgetConfig.secondaryColor} 
                          onChange={(e) => updateConfig('secondaryColor', e.target.value)}
                          className="w-12 h-10 p-1 cursor-pointer" 
                        />
                        <Input 
                          value={widgetConfig.secondaryColor} 
                          onChange={(e) => updateConfig('secondaryColor', e.target.value)}
                          className="flex-1" 
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="widget-title">Widget Title</Label>
                    <Input 
                      id="widget-title" 
                      value={widgetConfig.title}
                      onChange={(e) => updateConfig('title', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="widget-description">Widget Description</Label>
                    <Textarea
                      id="widget-description"
                      value={widgetConfig.description}
                      onChange={(e) => updateConfig('description', e.target.value)}
                      className="min-h-20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="widget-size">Widget Size</Label>
                    <Select value={widgetConfig.size} onValueChange={(value) => updateConfig('size', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (300px)</SelectItem>
                        <SelectItem value="medium">Medium (400px)</SelectItem>
                        <SelectItem value="large">Large (500px)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="search-placeholder">Search Placeholder Text</Label>
                    <Input 
                      id="search-placeholder" 
                      value={widgetConfig.searchPlaceholder}
                      onChange={(e) => updateConfig('searchPlaceholder', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cta-text">Call-to-Action Text</Label>
                    <Input 
                      id="cta-text" 
                      value={widgetConfig.ctaText}
                      onChange={(e) => updateConfig('ctaText', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="donate-text">Donate Button Text</Label>
                    <Input 
                      id="donate-text" 
                      value={widgetConfig.donateText}
                      onChange={(e) => updateConfig('donateText', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="success-message">Success Message</Label>
                    <Textarea
                      id="success-message"
                      value={widgetConfig.successMessage}
                      onChange={(e) => updateConfig('successMessage', e.target.value)}
                      className="min-h-20"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="behavior" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Show Video Button</Label>
                        <p className="text-sm text-gray-600">Display video play button on story images</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={widgetConfig.showVideoButton}
                        onChange={(e) => updateConfig('showVideoButton', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Require Email for Updates</Label>
                        <p className="text-sm text-gray-600">Make email required when subscribing</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={widgetConfig.requireEmail}
                        onChange={(e) => updateConfig('requireEmail', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Show Progress Bar</Label>
                        <p className="text-sm text-gray-600">Display fundraising progress on active campaigns</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={widgetConfig.showProgressBar}
                        onChange={(e) => updateConfig('showProgressBar', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="default-amounts">Default Donation Amounts ($)</Label>
                      <Input 
                        id="default-amounts" 
                        value={widgetConfig.defaultAmounts}
                        onChange={(e) => updateConfig('defaultAmounts', e.target.value)}
                        placeholder="Comma-separated values" 
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Embed Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Embed Code
              </CardTitle>
              <CardDescription>Copy this code to embed the widget on your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="iframe" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="iframe">iFrame</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                </TabsList>

                <TabsContent value="iframe" className="space-y-4">
                  <div className="space-y-2">
                    <Label>iFrame Embed Code</Label>
                    <div className="relative">
                      <Textarea
                        readOnly
                        value={generateIframeCode()}
                        className="min-h-32 font-mono text-sm"
                      />
                      <Button 
                        size="sm" 
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(generateIframeCode(), 'iFrame code')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="javascript" className="space-y-4">
                  <div className="space-y-2">
                    <Label>JavaScript Embed Code</Label>
                    <div className="relative">
                      <Textarea
                        readOnly
                        value={generateJavaScriptCode()}
                        className="min-h-32 font-mono text-sm"
                      />
                      <Button 
                        size="sm" 
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(generateJavaScriptCode(), 'JavaScript code')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Integration Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Place the widget on your donation or about page for maximum visibility</li>
                  <li>• Test the widget on different devices to ensure responsive design</li>
                  <li>• Consider adding context around the widget to explain NMBR bracelets</li>
                  <li>• Monitor widget analytics in your dashboard to track engagement</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </CardTitle>
                <CardDescription>See how your widget will appear on your website</CardDescription>
              </CardHeader>
              <CardContent>
              <div className="bg-gray-100 p-6 rounded-lg">
                <div 
                  className="bg-white rounded-lg shadow-lg p-6 mx-auto"
                  style={{ 
                    maxWidth: widgetConfig.size === 'small' ? '300px' : widgetConfig.size === 'large' ? '500px' : '400px'
                  }}
                >
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div 
                        className="w-8 h-8 rounded flex items-center justify-center"
                        style={{ backgroundColor: widgetConfig.primaryColor }}
                      >
                        <span className="text-white font-bold text-sm">HF</span>
                      </div>
                      <span className="font-semibold text-gray-900">Hope Foundation</span>
                    </div>
                    <h3 
                      className="text-lg font-bold"
                      style={{ color: widgetConfig.primaryColor }}
                    >
                      {widgetConfig.title}
                    </h3>
                    <p className="text-sm text-gray-600">{widgetConfig.description}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm">NMBR Code</Label>
                      <div className="flex space-x-2">
                        <Input 
                          placeholder={widgetConfig.searchPlaceholder} 
                          className="text-sm" 
                        />
                        <Button 
                          size="sm" 
                          style={{ 
                            backgroundColor: widgetConfig.primaryColor,
                            color: widgetConfig.secondaryColor
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-center text-xs text-gray-500">
                      <p>Look for the code on your bracelet and enter it above</p>
                    </div>
                  </div>
                </div>
              </div>
              </CardContent>
            </Card>

            {/* Analytics Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Widget Analytics</CardTitle>
                <CardDescription>Track how your widget is performing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">1,247</div>
                    <div className="text-sm text-gray-600">Widget Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">89</div>
                    <div className="text-sm text-gray-600">NMBR Searches</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">34</div>
                    <div className="text-sm text-gray-600">New Subscribers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">$1,250</div>
                    <div className="text-sm text-gray-600">Donations</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
