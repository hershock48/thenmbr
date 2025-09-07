import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Eye, Code, Settings, ExternalLink, Home } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"

export default function WidgetPage() {
  return (
    <div className="space-y-8">
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
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button>
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
                        <Input id="primary-color" type="color" value="#2563eb" className="w-12 h-10 p-1" />
                        <Input value="#2563eb" className="flex-1" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondary-color">Secondary Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input id="secondary-color" type="color" value="#ffffff" className="w-12 h-10 p-1" />
                        <Input value="#ffffff" className="flex-1" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="widget-title">Widget Title</Label>
                    <Input id="widget-title" defaultValue="Find Your NMBR Story" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="widget-description">Widget Description</Label>
                    <Textarea
                      id="widget-description"
                      defaultValue="Enter your bracelet code to discover the story behind it"
                      className="min-h-20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="widget-size">Widget Size</Label>
                    <Select defaultValue="medium">
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
                    <Input id="search-placeholder" defaultValue="e.g., HOPE001" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cta-text">Call-to-Action Text</Label>
                    <Input id="cta-text" defaultValue="Get Updates" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="donate-text">Donate Button Text</Label>
                    <Input id="donate-text" defaultValue="Donate" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="success-message">Success Message</Label>
                    <Textarea
                      id="success-message"
                      defaultValue="Thank you for your support! You'll receive updates about the impact of your contribution."
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
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Require Email for Updates</Label>
                        <p className="text-sm text-gray-600">Make email required when subscribing</p>
                      </div>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Show Progress Bar</Label>
                        <p className="text-sm text-gray-600">Display fundraising progress on active campaigns</p>
                      </div>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="default-amounts">Default Donation Amounts ($)</Label>
                      <Input id="default-amounts" defaultValue="25, 50, 100" placeholder="Comma-separated values" />
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
                        value={`<iframe 
  src="https://nmbr-platform.vercel.app/widget/hope-foundation?primaryColor=%232563eb&secondaryColor=%23ffffff"
  width="400" 
  height="600" 
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
</iframe>`}
                        className="min-h-32 font-mono text-sm"
                      />
                      <Button size="sm" className="absolute top-2 right-2">
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
                        value={`<div id="nmbr-widget"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://nmbr-platform.vercel.app/widget.js';
    script.onload = function() {
      NMBRWidget.init({
        container: '#nmbr-widget',
        organization: 'hope-foundation',
        primaryColor: '#2563eb',
        secondaryColor: '#ffffff'
      });
    };
    document.head.appendChild(script);
  })();
</script>`}
                        className="min-h-32 font-mono text-sm"
                      />
                      <Button size="sm" className="absolute top-2 right-2">
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
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-sm">HF</span>
                      </div>
                      <span className="font-semibold text-gray-900">Hope Foundation</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Find Your NMBR Story</h3>
                    <p className="text-sm text-gray-600">Enter your bracelet code to discover the story behind it</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm">NMBR Code</Label>
                      <div className="flex space-x-2">
                        <Input placeholder="e.g., HOPE001" className="text-sm" />
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
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
      </div>
    </div>
  )
}
