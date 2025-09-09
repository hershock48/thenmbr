"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Heart, 
  Star, 
  Package,
  Truck,
  Shield,
  Hash,
  ExternalLink,
  Plus,
  Minus
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Product, ProductStoryLink } from "@/types/commerce"

interface StorefrontPageProps {
  params: {
    orgSlug: string
  }
}

// Mock data - in real app, this would come from API
const mockProducts: Product[] = [
  {
    id: '1',
    orgId: 'org-1',
    title: "Maria's Co-op Roast",
    slug: 'marias-coop-roast',
    description: "Premium coffee beans from Maria's cooperative, supporting local farmers and sustainable agriculture.",
    price: 18.00,
    currency: 'USD',
    variants: [
      { id: 'v1', name: '12oz Bag', price: 18.00, sku: 'COFFEE-12OZ', stock: 50, attributes: { size: '12oz' } },
      { id: 'v2', name: '2lb Bag', price: 32.00, sku: 'COFFEE-2LB', stock: 25, attributes: { size: '2lb' } }
    ],
    stock: 75,
    media: [
      { id: 'm1', type: 'image', url: '/images/coffee-bag.jpg', alt: 'Coffee bag', order: 0 }
    ],
    status: 'active',
    fulfillmentMode: 'physical',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    orgId: 'org-1',
    title: "Community Garden Seeds",
    slug: 'community-garden-seeds',
    description: "Heirloom seed packets to start your own community garden. Each purchase supports our urban farming initiative.",
    price: 12.00,
    currency: 'USD',
    variants: [
      { id: 'v3', name: 'Starter Pack', price: 12.00, sku: 'SEEDS-STARTER', stock: 100, attributes: { type: 'Starter' } },
      { id: 'v4', name: 'Family Pack', price: 25.00, sku: 'SEEDS-FAMILY', stock: 50, attributes: { type: 'Family' } }
    ],
    stock: 150,
    media: [
      { id: 'm2', type: 'image', url: '/images/seed-packets.jpg', alt: 'Seed packets', order: 0 }
    ],
    status: 'active',
    fulfillmentMode: 'physical',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  }
]

const mockStoryLinks: ProductStoryLink[] = [
  { id: '1', productId: '1', nmbrId: 'nmbr-4', priority: 10, createdAt: '2024-01-15T00:00:00Z' },
  { id: '2', productId: '2', nmbrId: 'nmbr-2', priority: 8, createdAt: '2024-01-10T00:00:00Z' }
]

export default function StorefrontPage({ params }: StorefrontPageProps) {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [cart, setCart] = useState<Record<string, number>>({})
  const [orgInfo, setOrgInfo] = useState({
    name: 'Green Thumbs Initiative',
    logo: '/logos/green-thumbs.png',
    description: 'Supporting sustainable agriculture and community development'
  })

  useEffect(() => {
    // Filter products based on search term
    let filtered = products.filter(product => 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'featured':
        // Sort by story link priority
        filtered.sort((a, b) => {
          const aPriority = mockStoryLinks.find(link => link.productId === a.id)?.priority || 0
          const bPriority = mockStoryLinks.find(link => link.productId === b.id)?.priority || 0
          return bPriority - aPriority
        })
        break
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, sortBy])

  const addToCart = (productId: string, variantId?: string) => {
    const key = variantId ? `${productId}-${variantId}` : productId
    setCart(prev => ({
      ...prev,
      [key]: (prev[key] || 0) + 1
    }))
  }

  const removeFromCart = (productId: string, variantId?: string) => {
    const key = variantId ? `${productId}-${variantId}` : productId
    setCart(prev => {
      const newCart = { ...prev }
      if (newCart[key] > 1) {
        newCart[key] -= 1
      } else {
        delete newCart[key]
      }
      return newCart
    })
  }

  const getCartCount = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0)
  }

  const getProductStory = (productId: string) => {
    const storyLink = mockStoryLinks.find(link => link.productId === productId)
    if (!storyLink) return null
    
    // Mock story data - in real app, this would come from API
    return {
      id: storyLink.nmbrId,
      title: "Maria's Coffee Journey",
      excerpt: "Follow Maria's journey from coffee farmer to cooperative leader...",
      image: '/images/maria-story.jpg'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Image 
                  src={orgInfo.logo} 
                  alt={orgInfo.name}
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <div>
                  <h1 className="text-xl font-bold">{orgInfo.name}</h1>
                  <p className="text-sm text-muted-foreground">Store</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Wishlist
              </Button>
              <Button size="sm" className="relative">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
                {getCartCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {getCartCount()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Support Our Mission Through Purchase</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every purchase directly supports the stories and causes you care about. 
            See the impact your purchase makes.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const story = getProductStory(product.id)
              
              return (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="relative aspect-square overflow-hidden rounded-t-lg">
                      <Image
                        src={product.media[0]?.url || '/placeholder-product.jpg'}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {story && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-primary/90 text-primary-foreground">
                            <Hash className="w-3 h-3 mr-1" />
                            Story Linked
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-2">{product.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                      </div>
                      
                      {/* Story Card */}
                      {story && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Image
                              src={story.image}
                              alt={story.title}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                            <span className="text-sm font-medium">{story.title}</span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{story.excerpt}</p>
                          <Button variant="ghost" size="sm" className="h-6 px-2 mt-2">
                            Read Story
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      )}
                      
                      {/* Variants */}
                      {product.variants.length > 1 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Options:</p>
                          <div className="space-y-1">
                            {product.variants.map((variant) => (
                              <div key={variant.id} className="flex items-center justify-between text-sm">
                                <span>{variant.name} - ${variant.price}</span>
                                <div className="flex items-center gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-6 w-6 p-0"
                                    onClick={() => removeFromCart(product.id, variant.id)}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="w-6 text-center">{cart[`${product.id}-${variant.id}`] || 0}</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-6 w-6 p-0"
                                    onClick={() => addToCart(product.id, variant.id)}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Single variant or no variants */}
                      {product.variants.length <= 1 && (
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold">${product.price}</div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => removeFromCart(product.id)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center">{cart[product.id] || 0}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => addToCart(product.id)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <Button className="w-full" asChild>
                        <Link href={`/store/${params.orgSlug}/${product.slug}`}>
                          View Product
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <Truck className="w-8 h-8 text-primary" />
              <h3 className="font-semibold">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">On orders over $50</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              <h3 className="font-semibold">Secure Checkout</h3>
              <p className="text-sm text-muted-foreground">Protected by Stripe</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Package className="w-8 h-8 text-primary" />
              <h3 className="font-semibold">Impact Guaranteed</h3>
              <p className="text-sm text-muted-foreground">100% goes to the cause</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image 
                src={orgInfo.logo} 
                alt={orgInfo.name}
                width={24}
                height={24}
                className="rounded"
              />
              <span className="text-sm text-muted-foreground">
                © 2024 {orgInfo.name}. Powered by NMBR.
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
              <Link href="#" className="hover:text-foreground">Terms of Service</Link>
              <Link href="#" className="hover:text-foreground">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
