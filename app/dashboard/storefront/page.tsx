"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Store,
  Settings,
  Palette,
  Eye,
  Share,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Hash,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  DollarSign,
  BarChart3,
  Zap,
  Target,
  Heart,
  Sparkles
} from "lucide-react"
import { useOrganization } from "@/contexts/OrganizationContext"
import { productTemplates, type ProductTemplate } from "@/lib/product-templates"

interface StorefrontConfig {
  id: string
  name: string
  domain: string
  description: string
  logo: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
  theme: 'modern' | 'classic' | 'minimal' | 'bold'
  layout: 'grid' | 'list' | 'masonry'
  products: ProductTemplate[]
  isPublished: boolean
  analytics: {
    views: number
    orders: number
    revenue: number
    conversionRate: number
  }
}

export default function StorefrontPage() {
  const { terminology, orgType } = useOrganization()
  const [storefront, setStorefront] = useState<StorefrontConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  useEffect(() => {
    // Mock storefront data - in real app, this would fetch from API
    const mockStorefront: StorefrontConfig = {
      id: 'store-1',
      name: `${terminology.organization} Store`,
      domain: 'your-org.nmbr.store',
      description: `Shop ${terminology.fundraising.toLowerCase()} merchandise and support our cause`,
      logo: '',
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#f59e0b',
        background: '#ffffff'
      },
      theme: 'modern',
      layout: 'grid',
      products: productTemplates.slice(0, 6), // First 6 products
      isPublished: false,
      analytics: {
        views: 0,
        orders: 0,
        revenue: 0,
        conversionRate: 0
      }
    }
    
    setStorefront(mockStorefront)
    setLoading(false)
  }, [terminology])

  const handleAddProduct = (productId: string) => {
    if (!selectedProducts.includes(productId)) {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(id => id !== productId))
  }

  const handlePublish = () => {
    if (storefront) {
      setStorefront({ ...storefront, isPublished: true })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your storefront...</p>
        </div>
      </div>
    )
  }

  if (!storefront) {
    return (
      <div className="text-center py-12">
        <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Storefront Found</h3>
        <p className="text-muted-foreground mb-4">
          Create your first storefront to start selling products with NMBR codes
        </p>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Storefront
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Storefront Management</h1>
          <p className="text-muted-foreground">
            Design and manage your white-label storefront for {terminology.fundraising.toLowerCase()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" onClick={() => setShowSettings(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button onClick={handlePublish} disabled={storefront.isPublished}>
            <Zap className="w-4 h-4 mr-2" />
            {storefront.isPublished ? 'Published' : 'Publish'}
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{storefront.analytics.views}</div>
                <div className="text-sm text-muted-foreground">Store Views</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{storefront.analytics.orders}</div>
                <div className="text-sm text-muted-foreground">Orders</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">${storefront.analytics.revenue}</div>
                <div className="text-sm text-muted-foreground">Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{storefront.analytics.conversionRate}%</div>
                <div className="text-sm text-muted-foreground">Conversion Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Store Products</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {storefront.products.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center">
                    <Package className="w-12 h-12 text-muted-foreground" />
                  </div>
                  {product.bestseller && (
                    <Badge className="absolute top-2 left-2 bg-orange-500">
                      Bestseller
                    </Badge>
                  )}
                  {product.nmbrReady && (
                    <Badge className="absolute top-2 right-2 bg-green-500">
                      <Hash className="w-3 h-3 mr-1" />
                      NMBR
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">${product.price}</span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Design Tab */}
        <TabsContent value="design" className="space-y-6">
          <h2 className="text-xl font-semibold">Store Design</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme & Colors</CardTitle>
                <CardDescription>Customize your store's appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Theme</Label>
                  <Select value={storefront.theme}>
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
                
                <div>
                  <Label>Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="color" 
                      value={storefront.colors.primary}
                      className="w-12 h-10"
                    />
                    <Input value={storefront.colors.primary} className="flex-1" />
                  </div>
                </div>
                
                <div>
                  <Label>Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="color" 
                      value={storefront.colors.secondary}
                      className="w-12 h-10"
                    />
                    <Input value={storefront.colors.secondary} className="flex-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Layout & Branding</CardTitle>
                <CardDescription>Configure your store layout and branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Store Name</Label>
                  <Input value={storefront.name} />
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Textarea 
                    value={storefront.description}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label>Product Layout</Label>
                  <Select value={storefront.layout}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="list">List</SelectItem>
                      <SelectItem value="masonry">Masonry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <h2 className="text-xl font-semibold">Store Settings</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Domain & SEO</CardTitle>
                <CardDescription>Configure your store's domain and search settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Store Domain</Label>
                  <div className="flex items-center gap-2">
                    <Input value={storefront.domain} />
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label>Custom Domain (Optional)</Label>
                  <Input placeholder="your-org.com/shop" />
                </div>
                
                <div>
                  <Label>Meta Description</Label>
                  <Textarea 
                    placeholder="Describe your store for search engines"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment & Shipping</CardTitle>
                <CardDescription>Configure payment processing and shipping options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Payment Methods</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Credit/Debit Cards</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">PayPal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm">Apple Pay</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm">Google Pay</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>Shipping Regions</Label>
                  <Select defaultValue="us">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States Only</SelectItem>
                      <SelectItem value="na">North America</SelectItem>
                      <SelectItem value="global">Global</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-xl font-semibold">Store Analytics</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Key metrics for your store</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Store Views</span>
                    <span className="font-semibold">{storefront.analytics.views}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Orders</span>
                    <span className="font-semibold">{storefront.analytics.orders}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Revenue</span>
                    <span className="font-semibold">${storefront.analytics.revenue}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Conversion Rate</span>
                    <span className="font-semibold">{storefront.analytics.conversionRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Your best-performing products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {storefront.products.slice(0, 3).map((product, index) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                        <span className="text-sm font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{product.name}</div>
                        <div className="text-xs text-muted-foreground">${product.price}</div>
                      </div>
                      <div className="text-sm font-semibold">0 sales</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Store Preview</DialogTitle>
            <DialogDescription>
              Preview your storefront on different devices
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              <Button size="sm" variant="outline">
                <Monitor className="w-4 h-4 mr-2" />
                Desktop
              </Button>
              <Button size="sm" variant="outline">
                <Tablet className="w-4 h-4 mr-2" />
                Tablet
              </Button>
              <Button size="sm" variant="outline">
                <Smartphone className="w-4 h-4 mr-2" />
                Mobile
              </Button>
            </div>
            
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="text-center py-12">
                <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Store Preview</h3>
                <p className="text-muted-foreground">
                  Your storefront preview will appear here
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Store Settings</DialogTitle>
            <DialogDescription>
              Configure your storefront settings and preferences
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Store Name</Label>
              <Input value={storefront.name} />
            </div>
            
            <div>
              <Label>Store Description</Label>
              <Textarea 
                value={storefront.description}
                rows={3}
              />
            </div>
            
            <div>
              <Label>Store Domain</Label>
              <Input value={storefront.domain} />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSettings(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowSettings(false)}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
