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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  ShoppingCart, 
  Heart, 
  Palette, 
  Hash, 
  Image, 
  Plus, 
  Minus, 
  CheckCircle,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ArrowRight,
  Store,
  RefreshCw,
  Settings,
  Zap,
  Globe,
  Search,
  Filter,
  Grid,
  List,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  ExternalLink,
  AlertCircle,
  Key,
  Wifi,
  WifiOff
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { realDropshipService, RealProduct } from "@/lib/real-dropship-service"
import { productTemplates, ProductTemplate, getProductsByCategory, searchProducts } from "@/lib/product-templates"

interface MarketplaceStats {
  totalProducts: number
  connectedProviders: number
  totalRevenue: number
  activeStores: number
}

interface IntegrationStatus {
  provider: string
  connected: boolean
  productsAvailable: number
  apiKey?: string
}

interface CartItem {
  id: string
  product: ProductTemplate | RealProduct
  quantity: number
  customization: {
    color?: string
    size?: string
    design?: string
    text?: string
  }
  totalPrice: number
}

const categories = [
  { id: 'all', name: 'All Products', icon: Grid },
  { id: 'apparel', name: 'Apparel', icon: Heart },
  { id: 'drinkware', name: 'Drinkware', icon: Package },
  { id: 'accessories', name: 'Accessories', icon: Star },
  { id: 'office', name: 'Office', icon: Hash },
  { id: 'events', name: 'Events', icon: Users }
]

const viewModes = [
  { id: 'grid', name: 'Grid View', icon: Grid },
  { id: 'list', name: 'List View', icon: List }
]

export default function MarketplacePage() {
  const { org } = useAuth()
  
  // State management
  const [products, setProducts] = useState<(ProductTemplate | RealProduct)[]>([])
  const [filteredProducts, setFilteredProducts] = useState<(ProductTemplate | RealProduct)[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showIntegrationDialog, setShowIntegrationDialog] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)

  // Load products and integrations on mount
  useEffect(() => {
    loadProducts()
    loadIntegrations()
  }, [])

  // Filter products when category or search changes
  useEffect(() => {
    let filtered = products

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, searchQuery])

  const loadProducts = async () => {
    setIsLoading(true)
    try {
      // Load real products from dropship services
      const realProducts = await realDropshipService.getRealProducts()
      
      // Combine with template products
      const allProducts = [...productTemplates, ...realProducts]
      setProducts(allProducts)
    } catch (error) {
      console.error('Error loading products:', error)
      // Fallback to template products only
      setProducts(productTemplates)
    } finally {
      setIsLoading(false)
    }
  }

  const loadIntegrations = () => {
    const status = realDropshipService.getIntegrationStatus()
    setIntegrations(status)
  }

  const handleConnectProvider = async () => {
    if (!apiKey.trim()) return

    setIsConnecting(true)
    try {
      // Store API key in localStorage for demo purposes
      localStorage.setItem(`${selectedProvider.toLowerCase()}_api_key`, apiKey)
      
      // Reload integrations
      loadIntegrations()
      
      // Reload products to get real data
      await loadProducts()
      
      setShowIntegrationDialog(false)
      setApiKey('')
      setSelectedProvider('')
    } catch (error) {
      console.error('Error connecting provider:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const addToCart = (product: ProductTemplate | RealProduct) => {
    const cartItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      product,
      quantity: 1,
      customization: {
        color: product.colors?.[0],
        size: product.sizes?.[0]
      },
      totalPrice: product.price || product.basePrice
    }

    setCart(prev => [...prev, cartItem])
  }

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setCart(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, quantity, totalPrice: (product.price || product.basePrice) * quantity }
        : item
    ))
  }

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0)
  }

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.icon || Grid
  }

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'printful': return Package
      case 'gooten': return Globe
      case 'customink': return Palette
      default: return Store
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white py-8 rounded-lg">
        <div className="px-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">NMBR Marketplace</h1>
            <p className="text-lg text-cyan-100 max-w-3xl mx-auto">
              Turn any product into a story-driven fundraising tool. 
              Connect your supporters to real impact with every purchase.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
                <Package className="w-8 h-8 text-cyan-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Connected Providers</p>
                  <p className="text-2xl font-bold">{integrations.filter(i => i.connected).length}</p>
                </div>
                <Wifi className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cart Items</p>
                  <p className="text-2xl font-bold">{cart.length}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">${calculateTotal().toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integration Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Dropship Integrations
            </CardTitle>
            <CardDescription>
              Connect to real print-on-demand services for live product data and fulfillment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {integrations.map((integration) => {
                const Icon = getProviderIcon(integration.provider)
                return (
                  <div key={integration.provider} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6" />
                      <div>
                        <p className="font-medium">{integration.provider}</p>
                        <p className="text-sm text-muted-foreground">
                          {integration.productsAvailable} products available
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.connected ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedProvider(integration.provider)
                            setShowIntegrationDialog(true)
                          }}
                        >
                          <Key className="w-3 h-3 mr-1" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

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
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </Button>
              )
            })}
          </div>
          <div className="flex gap-2">
            {viewModes.map((mode) => {
              const Icon = mode.icon
              return (
                <Button
                  key={mode.id}
                  variant={viewMode === mode.id ? "default" : "outline"}
                  onClick={() => setViewMode(mode.id as 'grid' | 'list')}
                  size="icon"
                >
                  <Icon className="w-4 h-4" />
                </Button>
              )
            })}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try adjusting your search terms' : 'Connect to dropship providers to see real products'}
            </p>
            <Button onClick={() => setShowIntegrationDialog(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Connect Providers
            </Button>
          </Card>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-purple-100 rounded-xl flex items-center justify-center">
                      {getCategoryIcon(product.category)({ className: "w-8 h-8 text-cyan-600" })}
                    </div>
                    <div className="flex gap-2">
                      {product.bestseller && (
                        <Badge className="bg-orange-500 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Bestseller
                        </Badge>
                      )}
                      {product.nmbrReady && (
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          NMBR Ready
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Features */}
                    <div className="flex flex-wrap gap-1">
                      {product.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {product.features.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{product.features.length - 2} more
                        </Badge>
                      )}
                    </div>

                    {/* Colors */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {product.colors.slice(0, 4).map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border border-gray-200"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                        {product.colors.length > 4 && (
                          <div className="w-4 h-4 rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center text-xs">
                            +{product.colors.length - 4}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold">
                          ${product.price || product.basePrice}
                        </span>
                        <span className="text-sm text-muted-foreground ml-1">each</span>
                      </div>
                      <Button 
                        onClick={() => addToCart(product)}
                        size="sm"
                        className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>

                    {/* Provider Info */}
                    {product.provider && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Globe className="w-3 h-3" />
                        <span>via {product.provider}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Cart Sidebar */}
        {cart.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Shopping Cart ({cart.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-purple-100 rounded-lg flex items-center justify-center">
                        {getCategoryIcon(item.product.category)({ className: "w-6 h-6 text-cyan-600" })}
                      </div>
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${item.product.price || item.product.basePrice} each
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromCart(item.id)}
                        className="ml-2"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <Button className="w-full mt-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700">
                    <Truck className="w-4 h-4 mr-2" />
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Integration Dialog */}
      <Dialog open={showIntegrationDialog} onOpenChange={setShowIntegrationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect {selectedProvider}</DialogTitle>
            <DialogDescription>
              Enter your {selectedProvider} API key to access real products and enable fulfillment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder={`Enter your ${selectedProvider} API key`}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowIntegrationDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleConnectProvider}
                disabled={!apiKey.trim() || isConnecting}
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 mr-2" />
                    Connect
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}