'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Palette, 
  Layout, 
  Settings, 
  Eye, 
  Save, 
  Upload, 
  Download,
  Plus,
  Trash2,
  Move,
  Copy,
  Edit,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react'
import { productTemplates, ProductTemplate } from '@/lib/product-templates'
import { realDropshipService, RealProduct } from '@/lib/real-dropship-service'

interface StorefrontConfig {
  id: string
  name: string
  domain: string
  theme: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    fontFamily: string
    layout: 'grid' | 'list' | 'masonry'
  }
  branding: {
    logo: string
    favicon: string
    heroImage: string
    heroTitle: string
    heroSubtitle: string
  }
  products: {
    featured: string[]
    categories: string[]
    showPrices: boolean
    showReviews: boolean
    showStock: boolean
  }
  checkout: {
    requireAccount: boolean
    allowGuest: boolean
    showTaxes: boolean
    currency: string
    paymentMethods: string[]
  }
  seo: {
    title: string
    description: string
    keywords: string[]
    ogImage: string
  }
  analytics: {
    googleAnalytics: string
    facebookPixel: string
    customEvents: boolean
  }
}

interface StorefrontBuilderProps {
  organizationId: string
  onSave: (config: StorefrontConfig) => void
  onPreview: (config: StorefrontConfig) => void
  initialConfig?: StorefrontConfig
}

export function StorefrontBuilder({ 
  organizationId, 
  onSave, 
  onPreview, 
  initialConfig 
}: StorefrontBuilderProps) {
  const [config, setConfig] = useState<StorefrontConfig>(initialConfig || {
    id: `storefront-${Date.now()}`,
    name: 'My Storefront',
    domain: '',
    theme: {
      primaryColor: '#2563eb',
      secondaryColor: '#ffffff',
      accentColor: '#f59e0b',
      fontFamily: 'Inter',
      layout: 'grid'
    },
    branding: {
      logo: '',
      favicon: '',
      heroImage: '',
      heroTitle: 'Support Our Cause',
      heroSubtitle: 'Every purchase makes a difference'
    },
    products: {
      featured: [],
      categories: ['all'],
      showPrices: true,
      showReviews: true,
      showStock: true
    },
    checkout: {
      requireAccount: false,
      allowGuest: true,
      showTaxes: true,
      currency: 'USD',
      paymentMethods: ['stripe', 'paypal']
    },
    seo: {
      title: 'Support Our Cause - Shop Now',
      description: 'Shop our products and support our mission',
      keywords: ['nonprofit', 'charity', 'support', 'donate'],
      ogImage: ''
    },
    analytics: {
      googleAnalytics: '',
      facebookPixel: '',
      customEvents: true
    }
  })

  const [activeTab, setActiveTab] = useState('design')
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [availableProducts, setAvailableProducts] = useState<(ProductTemplate | RealProduct)[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      // Load both template products and real dropship products
      const templateProducts = productTemplates
      const realProducts = await realDropshipService.getRealProducts()
      setAvailableProducts([...templateProducts, ...realProducts])
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = (section: keyof StorefrontConfig, updates: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }))
  }

  const addFeaturedProduct = (productId: string) => {
    if (!config.products.featured.includes(productId)) {
      updateConfig('products', {
        featured: [...config.products.featured, productId]
      })
    }
  }

  const removeFeaturedProduct = (productId: string) => {
    updateConfig('products', {
      featured: config.products.featured.filter(id => id !== productId)
    })
  }

  const getProductById = (id: string) => {
    return availableProducts.find(p => p.id === id)
  }

  const renderPreview = () => {
    const featuredProducts = config.products.featured
      .map(id => getProductById(id))
      .filter(Boolean)

    return (
      <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${
        previewMode === 'mobile' ? 'w-80' : 
        previewMode === 'tablet' ? 'w-96' : 
        'w-full max-w-4xl'
      }`}>
        {/* Header */}
        <div 
          className="h-16 flex items-center justify-between px-6"
          style={{ backgroundColor: config.theme.primaryColor }}
        >
          <div className="flex items-center space-x-3">
            {config.branding.logo && (
              <img 
                src={config.branding.logo} 
                alt="Logo" 
                className="h-8 w-8 rounded"
              />
            )}
            <span 
              className="text-xl font-bold"
              style={{ color: config.theme.secondaryColor }}
            >
              {config.name}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              style={{ 
                backgroundColor: config.theme.secondaryColor,
                color: config.theme.primaryColor
              }}
            >
              Cart (0)
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <div 
          className="relative h-64 flex items-center justify-center"
          style={{ backgroundColor: config.theme.accentColor }}
        >
          {config.branding.heroImage && (
            <img 
              src={config.branding.heroImage} 
              alt="Hero" 
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
          )}
          <div className="text-center z-10">
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ color: config.theme.secondaryColor }}
            >
              {config.branding.heroTitle}
            </h1>
            <p 
              className="text-lg"
              style={{ color: config.theme.secondaryColor }}
            >
              {config.branding.heroSubtitle}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
          <div className={`grid gap-6 ${
            config.theme.layout === 'grid' ? 'grid-cols-2 md:grid-cols-3' :
            config.theme.layout === 'list' ? 'grid-cols-1' :
            'grid-cols-2 md:grid-cols-3'
          }`}>
            {featuredProducts.map((product) => (
              <Card key={product?.id} className="group hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-gray-400">Product Image</span>
                  </div>
                  <h3 className="font-semibold mb-2">{product?.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product?.description}
                  </p>
                  {config.products.showPrices && (
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">
                        ${product?.basePrice || product?.price}
                      </span>
                      <Button 
                        size="sm"
                        style={{ backgroundColor: config.theme.primaryColor }}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div 
          className="h-16 flex items-center justify-center"
          style={{ backgroundColor: config.theme.primaryColor }}
        >
          <span 
            className="text-sm"
            style={{ color: config.theme.secondaryColor }}
          >
            Powered by NMBR Platform
          </span>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading storefront builder...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Storefront Builder</h2>
          <p className="text-muted-foreground">Create your custom storefront</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => onPreview(config)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={() => onSave(config)}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Storefront
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="checkout">Checkout</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="design" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Theme Colors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={config.theme.primaryColor}
                        onChange={(e) => updateConfig('theme', { primaryColor: e.target.value })}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={config.theme.primaryColor}
                        onChange={(e) => updateConfig('theme', { primaryColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={config.theme.secondaryColor}
                        onChange={(e) => updateConfig('theme', { secondaryColor: e.target.value })}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={config.theme.secondaryColor}
                        onChange={(e) => updateConfig('theme', { secondaryColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accent-color">Accent Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="accent-color"
                        type="color"
                        value={config.theme.accentColor}
                        onChange={(e) => updateConfig('theme', { accentColor: e.target.value })}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={config.theme.accentColor}
                        onChange={(e) => updateConfig('theme', { accentColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="w-5 h-5" />
                    Layout
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="layout">Product Layout</Label>
                    <Select
                      value={config.theme.layout}
                      onValueChange={(value: 'grid' | 'list' | 'masonry') => 
                        updateConfig('theme', { layout: value })
                      }
                    >
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
                  <div className="space-y-2">
                    <Label htmlFor="font-family">Font Family</Label>
                    <Select
                      value={config.theme.fontFamily}
                      onValueChange={(value) => updateConfig('theme', { fontFamily: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Lato">Lato</SelectItem>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Branding
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo URL</Label>
                    <Input
                      id="logo"
                      value={config.branding.logo}
                      onChange={(e) => updateConfig('branding', { logo: e.target.value })}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-title">Hero Title</Label>
                    <Input
                      id="hero-title"
                      value={config.branding.heroTitle}
                      onChange={(e) => updateConfig('branding', { heroTitle: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                    <Input
                      id="hero-subtitle"
                      value={config.branding.heroSubtitle}
                      onChange={(e) => updateConfig('branding', { heroSubtitle: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Product Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Show Prices</Label>
                    <Switch
                      checked={config.products.showPrices}
                      onCheckedChange={(checked) => updateConfig('products', { showPrices: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Reviews</Label>
                    <Switch
                      checked={config.products.showReviews}
                      onCheckedChange={(checked) => updateConfig('products', { showReviews: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Stock Status</Label>
                    <Switch
                      checked={config.products.showStock}
                      onCheckedChange={(checked) => updateConfig('products', { showStock: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Featured Products
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Add Featured Product</Label>
                    <Select onValueChange={addFeaturedProduct}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Featured Products</Label>
                    <div className="space-y-2">
                      {config.products.featured.map((productId) => {
                        const product = getProductById(productId)
                        return product ? (
                          <div key={productId} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">{product.name}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFeaturedProduct(productId)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="checkout" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Checkout Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Require Account</Label>
                    <Switch
                      checked={config.checkout.requireAccount}
                      onCheckedChange={(checked) => updateConfig('checkout', { requireAccount: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Allow Guest Checkout</Label>
                    <Switch
                      checked={config.checkout.allowGuest}
                      onCheckedChange={(checked) => updateConfig('checkout', { allowGuest: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Taxes</Label>
                    <Switch
                      checked={config.checkout.showTaxes}
                      onCheckedChange={(checked) => updateConfig('checkout', { showTaxes: checked })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={config.checkout.currency}
                      onValueChange={(value) => updateConfig('checkout', { currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="seo-title">Page Title</Label>
                    <Input
                      id="seo-title"
                      value={config.seo.title}
                      onChange={(e) => updateConfig('seo', { title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seo-description">Meta Description</Label>
                    <Textarea
                      id="seo-description"
                      value={config.seo.description}
                      onChange={(e) => updateConfig('seo', { description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seo-keywords">Keywords (comma-separated)</Label>
                    <Input
                      id="seo-keywords"
                      value={config.seo.keywords.join(', ')}
                      onChange={(e) => updateConfig('seo', { 
                        keywords: e.target.value.split(',').map(k => k.trim()) 
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant={previewMode === 'desktop' ? 'default' : 'outline'}
                    onClick={() => setPreviewMode('desktop')}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={previewMode === 'tablet' ? 'default' : 'outline'}
                    onClick={() => setPreviewMode('tablet')}
                  >
                    <Tablet className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={previewMode === 'mobile' ? 'default' : 'outline'}
                    onClick={() => setPreviewMode('mobile')}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                {renderPreview()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
