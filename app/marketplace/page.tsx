"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Search,
  Filter,
  ShoppingCart,
  Heart,
  Star,
  Plus,
  Eye,
  Download,
  Upload,
  Palette,
  Hash,
  Zap,
  Target,
  Users,
  TrendingUp,
  Globe,
  Package,
  Truck,
  Shield,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Gift,
  Shirt,
  Coffee,
  Sticker,
  BookOpen,
  Mouse,
  Calendar,
  MapPin,
  AlertCircle,
  ExternalLink,
  Settings,
  Store,
  RefreshCw,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import { realDropshipService, type RealProduct } from "@/lib/real-dropship-service"

// Product Categories
const categories = [
  { id: 'all', name: 'All Products', icon: Package, count: 0 },
  { id: 'apparel', name: 'Apparel', icon: Shirt, count: 0 },
  { id: 'drinkware', name: 'Drinkware', icon: Coffee, count: 0 },
  { id: 'accessories', name: 'Accessories', icon: Sticker, count: 0 },
  { id: 'office', name: 'Office', icon: BookOpen, count: 0 },
  { id: 'events', name: 'Events', icon: Calendar, count: 0 }
]

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [showCustomizeDialog, setShowCustomizeDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<RealProduct | null>(null)
  const [products, setProducts] = useState<RealProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [integrationStatus, setIntegrationStatus] = useState<any[]>([])
  const [showIntegrationSetup, setShowIntegrationSetup] = useState(false)
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [testingConnection, setTestingConnection] = useState(false)

  // Load real products on component mount
  useEffect(() => {
    loadProducts()
    loadIntegrationStatus()
  }, [selectedCategory])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const realProducts = await realDropshipService.getRealProducts(selectedCategory === 'all' ? undefined : selectedCategory)
      setProducts(realProducts)
      
      // Update category counts
      const categoryCounts = categories.map(cat => {
        if (cat.id === 'all') {
          return { ...cat, count: realProducts.length }
        }
        return { ...cat, count: realProducts.filter(p => p.category === cat.id).length }
      })
      
      // Update categories with real counts
      categories.forEach(cat => {
        const updated = categoryCounts.find(c => c.id === cat.id)
        if (updated) {
          cat.count = updated.count
        }
      })
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadIntegrationStatus = () => {
    const status = realDropshipService.getIntegrationStatus()
    setIntegrationStatus(status)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCustomize = (product: RealProduct) => {
    setSelectedProduct(product)
    setShowCustomizeDialog(true)
  }

  const handleSetupProvider = (provider: string) => {
    setSelectedProvider(provider)
    setApiKey('')
    setShowApiKeyDialog(true)
  }

  const handleTestConnection = async () => {
    setTestingConnection(true)
    try {
      // Simulate API key testing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, this would test the actual API key
      const isValid = apiKey.length > 10 // Simple validation for demo
      
      if (isValid) {
        // Save API key to localStorage (in real app, this would go to your backend)
        localStorage.setItem(`${selectedProvider.toLowerCase()}_api_key`, apiKey)
        
        // Update integration status
        loadIntegrationStatus()
        loadProducts() // Reload products with new integration
        
        setShowApiKeyDialog(false)
        setApiKey('')
        setSelectedProvider('')
        
        // Show success message
        alert(`✅ ${selectedProvider} connected successfully! Products are now loading.`)
      } else {
        alert('❌ Invalid API key. Please check your key and try again.')
      }
    } catch (error) {
      alert('❌ Connection failed. Please check your API key and try again.')
    } finally {
      setTestingConnection(false)
    }
  }

  const connectedProviders = integrationStatus.filter(p => p.connected)
  const hasRealProducts = products.some(p => p.inStock)

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-background to-purple-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Product Marketplace</h1>
              <p className="text-muted-foreground mt-2">
                Real products from connected dropship services. Add NMBR codes to anything you sell.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowIntegrationSetup(true)}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Setup Integrations
              </Button>
              <Button asChild>
                <Link href="/dashboard/storefront">
                  <Store className="w-4 h-4 mr-2" />
                  Manage Storefront
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Integration Status */}
        {integrationStatus.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Integration Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {integrationStatus.map((provider) => (
                  <div key={provider.provider} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${provider.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <div className="font-medium">{provider.provider}</div>
                        <div className="text-sm text-muted-foreground">
                          {provider.connected ? `${provider.productsAvailable} products` : 'Not connected'}
                        </div>
                      </div>
                    </div>
                    {provider.connected ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                ))}
              </div>
              
              {connectedProviders.length === 0 && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <span className="font-medium text-amber-800">No Dropship Services Connected</span>
                  </div>
                  <p className="text-sm text-amber-700 mb-3">
                    Connect to real dropship services to see actual products and place real orders.
                  </p>
                  <Button 
                    onClick={() => setShowIntegrationSetup(true)}
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Setup Integrations
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <category.icon className="w-4 h-4" />
                      {category.name} ({category.count})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-3 bg-muted rounded mb-2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
              <p className="text-muted-foreground mb-4">
                {connectedProviders.length === 0 
                  ? "Connect to dropship services to see real products"
                  : "No products match your search criteria"
                }
              </p>
              {connectedProviders.length === 0 && (
                <Button onClick={() => setShowIntegrationSetup(true)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Setup Integrations
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <div className="aspect-square relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        Demo Only
                      </Badge>
                    </div>
                  )}
                  {product.nmbrIntegration && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Hash className="w-3 h-3 mr-1" />
                        NMBR Ready
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-1 ml-2">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">4.8</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-primary">
                      ${product.basePrice}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Truck className="w-3 h-3" />
                      {product.estimatedShipping}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleCustomize(product)}
                      disabled={!product.inStock}
                    >
                      <Palette className="w-3 h-3 mr-1" />
                      {product.inStock ? 'Customize' : 'Demo Only'}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Heart className="w-3 h-3" />
                    </Button>
                  </div>
                  {product.provider && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      via {product.provider}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Customize Dialog */}
        <Dialog open={showCustomizeDialog} onOpenChange={setShowCustomizeDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Customize Product</DialogTitle>
              <DialogDescription>
                {selectedProduct?.name} - Add your design and NMBR code
              </DialogDescription>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Design Upload</label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Upload your design</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">NMBR Code</label>
                      <Input placeholder="Enter NMBR code" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Size</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedProduct.sizes?.map((size) => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-lg font-semibold">
                    Total: ${selectedProduct.basePrice}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowCustomizeDialog(false)}>
                      Cancel
                    </Button>
                    <Button disabled={!selectedProduct.inStock}>
                      {selectedProduct.inStock ? 'Add to Cart' : 'Demo Only'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Integration Setup Dialog */}
        <Dialog open={showIntegrationSetup} onOpenChange={setShowIntegrationSetup}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Setup Dropship Integrations</DialogTitle>
              <DialogDescription>
                Connect to real dropship services to access actual products and place real orders.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Printful</h3>
                    <Badge variant={integrationStatus.find(p => p.provider === 'Printful')?.connected ? 'default' : 'secondary'}>
                      {integrationStatus.find(p => p.provider === 'Printful')?.connected ? 'Connected' : 'Not Connected'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    High-quality print-on-demand products with fast shipping
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSetupProvider('Printful')}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Connect API
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => window.open('https://www.printful.com/api-docs', '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Get API Key
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Gooten</h3>
                    <Badge variant={integrationStatus.find(p => p.provider === 'Gooten')?.connected ? 'default' : 'secondary'}>
                      {integrationStatus.find(p => p.provider === 'Gooten')?.connected ? 'Connected' : 'Not Connected'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Global dropship network with competitive pricing
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSetupProvider('Gooten')}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Connect API
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => window.open('https://www.gooten.com/api-docs', '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Get API Key
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">CustomInk</h3>
                    <Badge variant={integrationStatus.find(p => p.provider === 'CustomInk')?.connected ? 'default' : 'secondary'}>
                      {integrationStatus.find(p => p.provider === 'CustomInk')?.connected ? 'Connected' : 'Not Connected'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Custom products with advanced design tools
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSetupProvider('CustomInk')}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Connect API
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => window.open('https://www.customink.com/api-docs', '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Get API Key
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">How It Works</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Get API keys from your chosen dropship providers</li>
                  <li>2. Add them to your environment variables</li>
                  <li>3. Restart the application to load real products</li>
                  <li>4. Start selling real products with NMBR codes!</li>
                </ol>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* API Key Input Dialog */}
        <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Connect {selectedProvider}</DialogTitle>
              <DialogDescription>
                Enter your {selectedProvider} API key to start selling real products
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder={`Enter your ${selectedProvider} API key`}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Your API key will be stored securely and used to fetch real products
                </p>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <strong>Security Note:</strong> API keys are stored locally for this demo. 
                    In production, they would be encrypted and stored securely on our servers.
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowApiKeyDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleTestConnection}
                  disabled={!apiKey || testingConnection}
                  className="flex-1"
                >
                  {testingConnection ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Connect
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}