"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Filter, 
  Heart, 
  Star, 
  Hash,
  ExternalLink,
  Globe,
  Users,
  DollarSign,
  MapPin,
  TrendingUp,
  Award
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Product, ProductStoryLink } from "@/types/commerce"

// Mock data - in real app, this would come from API
const mockProducts: (Product & { org: { name: string; logo: string; country: string } })[] = [
  {
    id: '1',
    orgId: 'org-1',
    title: "Maria's Co-op Roast",
    slug: 'marias-coop-roast',
    description: "Premium coffee beans from Maria's cooperative, supporting local farmers and sustainable agriculture.",
    price: 18.00,
    currency: 'USD',
    variants: [
      { id: 'v1', name: '12oz Bag', price: 18.00, sku: 'COFFEE-12OZ', stock: 50, attributes: { size: '12oz' } }
    ],
    stock: 50,
    media: [
      { id: 'm1', type: 'image', url: '/images/coffee-bag.jpg', alt: 'Coffee bag', order: 0 }
    ],
    status: 'active',
    fulfillmentMode: 'physical',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    org: {
      name: 'Green Thumbs Initiative',
      logo: '/logos/green-thumbs.png',
      country: 'Guatemala'
    }
  },
  {
    id: '2',
    orgId: 'org-2',
    title: "Handwoven Textiles",
    slug: 'handwoven-textiles',
    description: "Beautiful handwoven textiles made by women artisans in rural communities.",
    price: 45.00,
    currency: 'USD',
    variants: [
      { id: 'v2', name: 'Scarf', price: 45.00, sku: 'TEXTILE-SCARF', stock: 30, attributes: { type: 'Scarf' } }
    ],
    stock: 30,
    media: [
      { id: 'm2', type: 'image', url: '/images/textile-scarf.jpg', alt: 'Handwoven scarf', order: 0 }
    ],
    status: 'active',
    fulfillmentMode: 'physical',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
    org: {
      name: 'Women Weavers Collective',
      logo: '/logos/weavers.png',
      country: 'Peru'
    }
  },
  {
    id: '3',
    orgId: 'org-3',
    title: "Artisan Pottery",
    slug: 'artisan-pottery',
    description: "Traditional pottery made by master craftsmen using centuries-old techniques.",
    price: 65.00,
    currency: 'USD',
    variants: [
      { id: 'v3', name: 'Vase', price: 65.00, sku: 'POTTERY-VASE', stock: 20, attributes: { type: 'Vase' } }
    ],
    stock: 20,
    media: [
      { id: 'm3', type: 'image', url: '/images/pottery-vase.jpg', alt: 'Artisan vase', order: 0 }
    ],
    status: 'active',
    fulfillmentMode: 'physical',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
    org: {
      name: 'Craft Heritage Foundation',
      logo: '/logos/craft-heritage.png',
      country: 'Mexico'
    }
  }
]

const mockStoryLinks: ProductStoryLink[] = [
  { id: '1', productId: '1', nmbrId: 'nmbr-4', priority: 10, createdAt: '2024-01-15T00:00:00Z' },
  { id: '2', productId: '2', nmbrId: 'nmbr-7', priority: 8, createdAt: '2024-01-10T00:00:00Z' },
  { id: '3', productId: '3', nmbrId: 'nmbr-12', priority: 9, createdAt: '2024-01-05T00:00:00Z' }
]

const categories = [
  { id: 'all', name: 'All Products', count: 150 },
  { id: 'food', name: 'Food & Beverages', count: 45 },
  { id: 'textiles', name: 'Textiles & Clothing', count: 32 },
  { id: 'crafts', name: 'Handicrafts', count: 28 },
  { id: 'jewelry', name: 'Jewelry', count: 20 },
  { id: 'home', name: 'Home & Garden', count: 25 }
]

const countries = [
  'All Countries',
  'Guatemala',
  'Peru',
  'Mexico',
  'India',
  'Kenya',
  'Nepal'
]

export default function MarketplacePage() {
  const [products, setProducts] = useState(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCountry, setSelectedCountry] = useState('All Countries')
  const [sortBy, setSortBy] = useState('featured')
  const [activeTab, setActiveTab] = useState('products')

  useEffect(() => {
    let filtered = products

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.org.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      // In real app, this would filter by actual category data
      filtered = filtered // Placeholder
    }

    // Filter by country
    if (selectedCountry !== 'All Countries') {
      filtered = filtered.filter(product => product.org.country === selectedCountry)
    }

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
  }, [products, searchTerm, selectedCategory, selectedCountry, sortBy])

  const getProductStory = (productId: string) => {
    const storyLink = mockStoryLinks.find(link => link.productId === productId)
    if (!storyLink) return null
    
    // Mock story data
    return {
      id: storyLink.nmbrId,
      title: "Artisan Story",
      excerpt: "Learn about the craftspeople behind this product...",
      image: '/images/story-placeholder.jpg'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">NMBR Marketplace</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover products with stories. Every purchase supports real people and communities around the world.
            </p>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">150+</div>
              <div className="text-sm text-muted-foreground">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">25</div>
              <div className="text-sm text-muted-foreground">Organizations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">12</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">$50K+</div>
              <div className="text-sm text-muted-foreground">Raised</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search products, organizations, or stories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
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
                
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>

            {/* Products Grid */}
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
                              Story
                            </Badge>
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg line-clamp-2">{product.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Image
                              src={product.org.logo}
                              alt={product.org.name}
                              width={16}
                              height={16}
                              className="rounded-full"
                            />
                            <span className="text-sm text-muted-foreground">{product.org.name}</span>
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{product.org.country}</span>
                          </div>
                        </div>
                        
                        {/* Story Card */}
                        {story && (
                          <div className="p-2 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Image
                                src={story.image}
                                alt={story.title}
                                width={20}
                                height={20}
                                className="rounded-full"
                              />
                              <span className="text-xs font-medium">{story.title}</span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{story.excerpt}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold">${product.price}</div>
                          <Button size="sm" asChild>
                            <Link href={`/marketplace/${product.slug}`}>
                              View
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="organizations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'Green Thumbs Initiative',
                  logo: '/logos/green-thumbs.png',
                  country: 'Guatemala',
                  products: 12,
                  raised: 15000,
                  description: 'Supporting sustainable agriculture and community development'
                },
                {
                  name: 'Women Weavers Collective',
                  logo: '/logos/weavers.png',
                  country: 'Peru',
                  products: 8,
                  raised: 8500,
                  description: 'Empowering women artisans through traditional weaving'
                },
                {
                  name: 'Craft Heritage Foundation',
                  logo: '/logos/craft-heritage.png',
                  country: 'Mexico',
                  products: 15,
                  raised: 22000,
                  description: 'Preserving traditional crafts and supporting artisans'
                }
              ].map((org, index) => (
                <Card key={index} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Image
                        src={org.logo}
                        alt={org.name}
                        width={48}
                        height={48}
                        className="rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold">{org.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {org.country}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">{org.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <div className="text-lg font-bold">{org.products}</div>
                        <div className="text-xs text-muted-foreground">Products</div>
                      </div>
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <div className="text-lg font-bold">${org.raised.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Raised</div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/org/${org.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        View Organization
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}