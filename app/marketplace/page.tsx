"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  MapPin
} from "lucide-react"
import Link from "next/link"

// Product Categories
const categories = [
  { id: 'all', name: 'All Products', icon: Package, count: 156 },
  { id: 'apparel', name: 'Apparel', icon: Shirt, count: 45 },
  { id: 'drinkware', name: 'Drinkware', icon: Coffee, count: 23 },
  { id: 'accessories', name: 'Accessories', icon: Sticker, count: 34 },
  { id: 'office', name: 'Office', icon: BookOpen, count: 28 },
  { id: 'events', name: 'Events', icon: Calendar, count: 26 }
]

// Product Templates
const productTemplates = [
  {
    id: 'tshirt-basic',
    name: 'Classic T-Shirt',
    category: 'apparel',
    price: 12.99,
    image: '/api/placeholder/300/300',
    description: '100% cotton, perfect for any cause',
    features: ['NMBR code integration', 'Customizable design', 'Multiple sizes'],
    rating: 4.8,
    reviews: 124,
    bestseller: true,
    nmbrReady: true
  },
  {
    id: 'mug-white',
    name: 'White Ceramic Mug',
    category: 'drinkware',
    price: 8.99,
    image: '/api/placeholder/300/300',
    description: '11oz ceramic mug with full-wrap design',
    features: ['Dishwasher safe', 'Microwave safe', 'NMBR code on bottom'],
    rating: 4.9,
    reviews: 89,
    bestseller: true,
    nmbrReady: true
  },
  {
    id: 'sticker-vinyl',
    name: 'Vinyl Sticker Pack',
    category: 'accessories',
    price: 4.99,
    image: '/api/placeholder/300/300',
    description: 'Set of 10 weatherproof vinyl stickers',
    features: ['Weatherproof', 'Multiple designs', 'Easy application'],
    rating: 4.7,
    reviews: 67,
    bestseller: false,
    nmbrReady: true
  },
  {
    id: 'notebook-spiral',
    name: 'Spiral Notebook',
    category: 'office',
    price: 6.99,
    image: '/api/placeholder/300/300',
    description: '80-page spiral bound notebook',
    features: ['College ruled', 'Durable cover', 'NMBR code on back'],
    rating: 4.6,
    reviews: 43,
    bestseller: false,
    nmbrReady: true
  },
  {
    id: 'tote-cotton',
    name: 'Cotton Tote Bag',
    category: 'accessories',
    price: 9.99,
    image: '/api/placeholder/300/300',
    description: 'Eco-friendly cotton tote bag',
    features: ['100% cotton', 'Reinforced handles', 'Large design area'],
    rating: 4.8,
    reviews: 91,
    bestseller: true,
    nmbrReady: true
  },
  {
    id: 'water-bottle',
    name: 'Insulated Water Bottle',
    category: 'drinkware',
    price: 15.99,
    image: '/api/placeholder/300/300',
    description: '20oz insulated stainless steel bottle',
    features: ['Keeps cold 24hrs', 'Leak-proof', 'NMBR code on side'],
    rating: 4.9,
    reviews: 156,
    bestseller: true,
    nmbrReady: true
  }
]

// Dropship Partners
const dropshipPartners = [
  {
    name: 'Printful',
    logo: '/api/placeholder/120/40',
    description: 'Global print-on-demand leader',
    features: ['200+ products', 'Global shipping', 'Quality guarantee'],
    integration: 'Connected',
    status: 'active'
  },
  {
    name: 'Gooten',
    logo: '/api/placeholder/120/40',
    description: 'Sustainable print solutions',
    features: ['Eco-friendly', 'Fast fulfillment', 'Competitive pricing'],
    integration: 'Connected',
    status: 'active'
  },
  {
    name: 'CustomInk',
    logo: '/api/placeholder/120/40',
    description: 'Bulk order specialist',
    features: ['Bulk discounts', 'Custom designs', 'Fast turnaround'],
    integration: 'Pending',
    status: 'pending'
  }
]

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [showCustomizeDialog, setShowCustomizeDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const filteredProducts = productTemplates.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCustomize = (product) => {
    setSelectedProduct(product)
    setShowCustomizeDialog(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-background to-purple-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">NMBR Marketplace</h1>
              <p className="text-muted-foreground mt-2">
                Add NMBR codes to any product and turn merchandise into fundraising tools
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload Design
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Product
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Search Products</label>
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

                {/* Categories */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Categories</label>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const Icon = category.icon
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                            selectedCategory === category.id
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span className="text-sm">{category.name}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {category.count}
                          </Badge>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Dropship Partners */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Dropship Partners
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dropshipPartners.map((partner, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{partner.name}</div>
                      <div className="text-xs text-muted-foreground">{partner.description}</div>
                    </div>
                    <Badge variant={partner.status === 'active' ? 'default' : 'secondary'}>
                      {partner.integration}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold">156</div>
                      <div className="text-sm text-muted-foreground">Products</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold">3</div>
                      <div className="text-sm text-muted-foreground">Dropship Partners</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="text-2xl font-bold">100%</div>
                      <div className="text-sm text-muted-foreground">NMBR Ready</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="text-2xl font-bold">24hr</div>
                      <div className="text-sm text-muted-foreground">Avg. Fulfillment</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center">
                      <Package className="w-16 h-16 text-muted-foreground" />
                    </div>
                    {product.bestseller && (
                      <Badge className="absolute top-2 left-2 bg-orange-500">
                        Bestseller
                      </Badge>
                    )}
                    {product.nmbrReady && (
                      <Badge className="absolute top-2 right-2 bg-green-500">
                        <Hash className="w-3 h-3 mr-1" />
                        NMBR Ready
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{product.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{product.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">${product.price}</span>
                        <span className="text-xs text-muted-foreground">{product.reviews} reviews</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleCustomize(product)}
                        >
                          <Palette className="w-4 h-4 mr-2" />
                          Customize
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <Card className="text-center py-12">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}>
                  Clear Filters
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Customize Dialog */}
      <Dialog open={showCustomizeDialog} onOpenChange={setShowCustomizeDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Customize Product</DialogTitle>
            <DialogDescription>
              Design your product and integrate NMBR codes for story-driven fundraising
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Preview */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Product Preview</h3>
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <Package className="w-24 h-24 text-muted-foreground" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedProduct.name} - ${selectedProduct.price}
                  </div>
                </div>

                {/* Customization Options */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Customization</h3>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Design Upload</label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Upload your design or logo</p>
                      <Button size="sm" className="mt-2">
                        Choose File
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">NMBR Code Placement</label>
                    <Select defaultValue="bottom-right">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="back">Back of Product</SelectItem>
                        <SelectItem value="custom">Custom Position</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Call-to-Action Text</label>
                    <Input 
                      placeholder="e.g., 'Scan to see your impact'"
                      defaultValue="Scan to see your impact"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate NMBR Code
                    </Button>
                    <Button variant="outline">
                      Preview
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCustomizeDialog(false)}>
                  Cancel
                </Button>
                <Button>
                  Add to Store
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}