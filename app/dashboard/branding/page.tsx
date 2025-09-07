"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Palette, Type, ImageIcon, Code, Eye, Save, Upload, Copy } from "lucide-react"
import { WidgetContainer } from "@/components/widget/widget-container"

export default function BrandingPage() {
  const [brandingSettings, setBrandingSettings] = useState({
    // Colors
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b",
    accentColor: "#10b981",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",

    // Typography
    headingFont: "Inter",
    bodyFont: "Inter",
    fontSize: "medium",

    // Logo & Images
    logo: "/hope-foundation-logo.jpg",
    favicon: "",
    backgroundImage: "",

    // Widget Customization
    widgetStyle: "modern",
    borderRadius: "medium",
    shadow: "medium",

    // Advanced
    customCSS: "",
    customDomain: "",
    whiteLabel: false,

    // Email Branding
    emailHeaderColor: "#3b82f6",
    emailFooterText: "© 2024 Hope Foundation. All rights reserved.",
  })

  const [activeTab, setActiveTab] = useState("colors")
  const [showPreview, setShowPreview] = useState(false)

  const handleSettingChange = (key: string, value: any) => {
    setBrandingSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // In real app, this would save to database
    console.log("Saving branding settings:", brandingSettings)
    alert("Branding settings saved successfully!")
  }

  const generateEmbedCode = () => {
    const embedCode = `<iframe 
  src="https://widget.nmbr.com/hope-foundation" 
  width="400" 
  height="600" 
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
</iframe>`

    navigator.clipboard.writeText(embedCode)
    alert("Embed code copied to clipboard!")
  }

  const mockOrganization = {
    id: "1",
    name: "Hope Foundation",
    slug: "hope-foundation",
    primaryColor: brandingSettings.primaryColor,
    secondaryColor: brandingSettings.secondaryColor,
    logo: brandingSettings.logo,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Brand Customization</h1>
          <p className="text-muted-foreground">Customize your widget and communications to match your brand</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? "Hide" : "Show"} Preview
          </Button>
          <Button variant="outline" onClick={generateEmbedCode}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Embed Code
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Settings Panel */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Color Palette
                  </CardTitle>
                  <CardDescription>Define your brand colors for consistent theming</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primary-color"
                          type="color"
                          value={brandingSettings.primaryColor}
                          onChange={(e) => handleSettingChange("primaryColor", e.target.value)}
                          className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                          value={brandingSettings.primaryColor}
                          onChange={(e) => handleSettingChange("primaryColor", e.target.value)}
                          placeholder="#3b82f6"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondary-color">Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondary-color"
                          type="color"
                          value={brandingSettings.secondaryColor}
                          onChange={(e) => handleSettingChange("secondaryColor", e.target.value)}
                          className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                          value={brandingSettings.secondaryColor}
                          onChange={(e) => handleSettingChange("secondaryColor", e.target.value)}
                          placeholder="#64748b"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accent-color">Accent Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="accent-color"
                          type="color"
                          value={brandingSettings.accentColor}
                          onChange={(e) => handleSettingChange("accentColor", e.target.value)}
                          className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                          value={brandingSettings.accentColor}
                          onChange={(e) => handleSettingChange("accentColor", e.target.value)}
                          placeholder="#10b981"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="text-color">Text Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="text-color"
                          type="color"
                          value={brandingSettings.textColor}
                          onChange={(e) => handleSettingChange("textColor", e.target.value)}
                          className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                          value={brandingSettings.textColor}
                          onChange={(e) => handleSettingChange("textColor", e.target.value)}
                          placeholder="#1f2937"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Color Preview</h4>
                    <div className="flex gap-2">
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-gray-200"
                        style={{ backgroundColor: brandingSettings.primaryColor }}
                        title="Primary"
                      />
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-gray-200"
                        style={{ backgroundColor: brandingSettings.secondaryColor }}
                        title="Secondary"
                      />
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-gray-200"
                        style={{ backgroundColor: brandingSettings.accentColor }}
                        title="Accent"
                      />
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-gray-200"
                        style={{ backgroundColor: brandingSettings.textColor }}
                        title="Text"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="typography" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Typography
                  </CardTitle>
                  <CardDescription>Choose fonts and text styling for your brand</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="heading-font">Heading Font</Label>
                      <Select
                        value={brandingSettings.headingFont}
                        onValueChange={(value) => handleSettingChange("headingFont", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Open Sans">Open Sans</SelectItem>
                          <SelectItem value="Lato">Lato</SelectItem>
                          <SelectItem value="Montserrat">Montserrat</SelectItem>
                          <SelectItem value="Poppins">Poppins</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="body-font">Body Font</Label>
                      <Select
                        value={brandingSettings.bodyFont}
                        onValueChange={(value) => handleSettingChange("bodyFont", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Open Sans">Open Sans</SelectItem>
                          <SelectItem value="Lato">Lato</SelectItem>
                          <SelectItem value="Source Sans Pro">Source Sans Pro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="font-size">Font Size</Label>
                    <Select
                      value={brandingSettings.fontSize}
                      onValueChange={(value) => handleSettingChange("fontSize", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Typography Preview</h4>
                    <div className="space-y-2">
                      <h3
                        className="text-xl font-bold"
                        style={{ fontFamily: brandingSettings.headingFont, color: brandingSettings.textColor }}
                      >
                        Sample Heading Text
                      </h3>
                      <p
                        className="text-sm"
                        style={{ fontFamily: brandingSettings.bodyFont, color: brandingSettings.textColor }}
                      >
                        This is how your body text will appear in the widget and communications.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assets" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Brand Assets
                  </CardTitle>
                  <CardDescription>Upload your logo and other brand assets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo">Organization Logo</Label>
                    <div className="flex items-center gap-4">
                      <img
                        src={brandingSettings.logo || "/placeholder.svg?height=40&width=40"}
                        alt="Logo preview"
                        className="w-10 h-10 rounded border"
                      />
                      <Button variant="outline" size="sm">
                        <Upload className="h-3 w-3 mr-1" />
                        Upload Logo
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Recommended: 200x200px, PNG or SVG format</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="favicon">Favicon</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded border flex items-center justify-center">
                        <span className="text-xs text-gray-500">ICO</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Upload className="h-3 w-3 mr-1" />
                        Upload Favicon
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">32x32px ICO file for browser tabs</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="widget-style">Widget Style</Label>
                    <Select
                      value={brandingSettings.widgetStyle}
                      onValueChange={(value) => handleSettingChange("widgetStyle", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="border-radius">Border Radius</Label>
                      <Select
                        value={brandingSettings.borderRadius}
                        onValueChange={(value) => handleSettingChange("borderRadius", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shadow">Shadow</Label>
                      <Select
                        value={brandingSettings.shadow}
                        onValueChange={(value) => handleSettingChange("shadow", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Advanced Customization
                  </CardTitle>
                  <CardDescription>Custom CSS, domains, and white-label options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="custom-css">Custom CSS</Label>
                    <Textarea
                      id="custom-css"
                      placeholder="/* Add your custom CSS here */
.widget-container {
  /* Custom styles */
}"
                      value={brandingSettings.customCSS}
                      onChange={(e) => handleSettingChange("customCSS", e.target.value)}
                      rows={6}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Advanced users can add custom CSS to further customize the widget appearance
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom-domain">Custom Domain</Label>
                    <Input
                      id="custom-domain"
                      placeholder="widget.yourorganization.org"
                      value={brandingSettings.customDomain}
                      onChange={(e) => handleSettingChange("customDomain", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Use your own domain for the widget (requires DNS configuration)
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="white-label">White Label Mode</Label>
                      <p className="text-xs text-muted-foreground">Remove NMBR branding from the widget</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="white-label"
                        checked={brandingSettings.whiteLabel}
                        onCheckedChange={(checked) => handleSettingChange("whiteLabel", checked)}
                      />
                      <Badge variant="secondary">Pro Feature</Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Email Branding</h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="email-header-color">Email Header Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="email-header-color"
                            type="color"
                            value={brandingSettings.emailHeaderColor}
                            onChange={(e) => handleSettingChange("emailHeaderColor", e.target.value)}
                            className="w-16 h-10 p-1 border rounded"
                          />
                          <Input
                            value={brandingSettings.emailHeaderColor}
                            onChange={(e) => handleSettingChange("emailHeaderColor", e.target.value)}
                            placeholder="#3b82f6"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email-footer">Email Footer Text</Label>
                        <Input
                          id="email-footer"
                          value={brandingSettings.emailFooterText}
                          onChange={(e) => handleSettingChange("emailFooterText", e.target.value)}
                          placeholder="© 2024 Your Organization. All rights reserved."
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>See how your widget will look with current settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <WidgetContainer organization={mockOrganization} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Embed Code</CardTitle>
                <CardDescription>Copy this code to embed the widget on your website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <code>{`<iframe 
  src="https://widget.nmbr.com/hope-foundation" 
  width="400" 
  height="600" 
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
</iframe>`}</code>
                </div>
                <Button variant="outline" size="sm" className="mt-2 bg-transparent" onClick={generateEmbedCode}>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy Code
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
