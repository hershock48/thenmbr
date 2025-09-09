"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Heart, 
  Share2, 
  Star, 
  Hash,
  ExternalLink,
  Plus,
  Minus,
  ShoppingCart,
  Truck,
  Shield,
  RefreshCw,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Product, ProductStoryLink } from "@/types/commerce"

interface ProductPageProps {
  params: {
    orgSlug: string
    productSlug: string
  }
}

// Mock data - in real app, this would come from API
const mockProduct: Product = {
  id: '1',
  orgId: 'org-1',
  title: "Maria's Co-op Roast",
  slug: 'marias-coop-roast',
  description: "Premium coffee beans from Maria's cooperative, supporting local farmers and sustainable agriculture. This single-origin coffee is grown at high altitude in the mountains of Guatemala, where Maria and her fellow farmers have been perfecting their craft for generations.",
  price: 18.00,
  currency: 'USD',
  variants: [
    { id: 'v1', name: '12oz Bag', price: 18.00, sku: 'COFFEE-12OZ', stock: 50, attributes: { size: '12oz' } },
    { id: 'v2', name: '2lb Bag', price: 32.00, sku: 'COFFEE-2LB', stock: 25, attributes: { size: '2lb' } }
  ],
  stock: 75,
  media: [
    { id: 'm1', type: 'image', url: '/images/coffee-bag.jpg', alt: 'Coffee bag', order: 0 },
    { id: 'm2', type: 'image', url: '/images/coffee-beans.jpg', alt: 'Coffee beans', order: 1 },
    { id: 'm3', type: 'image', url: '/images/coffee-farm.jpg', alt: 'Coffee farm', order: 2 }
  ],
  status: 'active',
  fulfillmentMode: 'physical',
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z'
}

const mockStory = {
  id: 'nmbr-4',
  title: "Maria's Coffee Journey",
  excerpt: "Follow Maria's journey from coffee farmer to cooperative leader, and see how your purchase directly supports her community's sustainable agriculture initiatives.",
  fullStory: "Maria has been growing coffee in the mountains of Guatemala for over 20 years. When she joined the cooperative five years ago, she was able to access better prices and sustainable farming practices. Today, she leads a group of 15 farmers who are committed to organic, fair-trade coffee production. Your purchase directly supports Maria's family and her community's education and healthcare programs.",
  image: '/images/maria-story.jpg',
  impact: {
    farmersSupported: 15,
    familiesImpacted: 45,
    educationFund: 1200,
    healthcareFund: 800
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product>(mockProduct)
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [orgInfo, setOrgInfo] = useState({
    name: 'Green Thumbs Initiative',
    logo: '/logos/green-thumbs.png',
    description: 'Supporting sustainable agriculture and community development'
  })

  const handleAddToCart = () => {
    // In real app, this would add to cart and redirect to checkout
    console.log('Adding to cart:', {
      productId: product.id,
      variantId: selectedVariant.id,
      quantity
    })
  }

  const handleBuyNow = () => {
    // In real app, this would add to cart and redirect to checkout
    console.log('Buy now:', {
      productId: product.id,
      variantId: selectedVariant.id,
      quantity
    })
  }

  const getCurrentPrice = () => {
    return selectedVariant ? selectedVariant.price : product.price
  }

  const getCurrentStock = () => {
    return selectedVariant ? selectedVariant.stock : product.stock
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/store/${params.orgSlug}`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Store
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Image 
                  src={orgInfo.logo} 
                  alt={orgInfo.name}
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="font-medium">{orgInfo.name}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsWishlisted(!isWishlisted)}>
                <Heart className={`w-4 h-4 mr-2 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                Wishlist
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border">
              <Image
                src={product.media[selectedImage]?.url || '/placeholder-product.jpg'}
                alt={product.title}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.media.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.media.map((media, index) => (
                  <button
                    key={media.id}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-muted'
                    }`}
                  >
                    <Image
                      src={media.url}
                      alt={media.alt || product.title}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-primary/90 text-primary-foreground">
                  <Hash className="w-3 h-3 mr-1" />
                  Story Linked
                </Badge>
                <Badge variant="outline">In Stock</Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <p className="text-lg text-muted-foreground">{product.description}</p>
            </div>

            {/* Story Card */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image
                    src={mockStory.image}
                    alt={mockStory.title}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  {mockStory.title}
                </CardTitle>
                <CardDescription>{mockStory.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-primary">{mockStory.impact.farmersSupported}</div>
                    <div className="text-sm text-muted-foreground">Farmers Supported</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-primary">{mockStory.impact.familiesImpacted}</div>
                    <div className="text-sm text-muted-foreground">Families Impacted</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Read Full Story
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Variants */}
            {product.variants.length > 1 && (
              <div>
                <h3 className="font-semibold mb-3">Select Option</h3>
                <div className="space-y-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`w-full p-3 border rounded-lg text-left transition-colors ${
                        selectedVariant.id === variant.id
                          ? 'border-primary bg-primary/5'
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{variant.name}</span>
                        <span className="text-lg font-bold">${variant.price}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {variant.stock} in stock
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setQuantity(Math.min(getCurrentStock(), quantity + 1))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">${getCurrentPrice()}</div>
                <div className="text-sm text-muted-foreground">
                  {getCurrentStock()} in stock
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button size="lg" className="w-full" onClick={handleBuyNow}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Buy Now
              </Button>
              <Button size="lg" variant="outline" className="w-full" onClick={handleAddToCart}>
                Add to Cart
              </Button>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-sm font-medium">Free Shipping</div>
                <div className="text-xs text-muted-foreground">Over $50</div>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-sm font-medium">Secure Checkout</div>
                <div className="text-xs text-muted-foreground">Stripe Protected</div>
              </div>
              <div className="text-center">
                <RefreshCw className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-sm font-medium">Easy Returns</div>
                <div className="text-xs text-muted-foreground">30 days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="story">Story Impact</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                  <div className="prose max-w-none">
                    <p>{product.description}</p>
                    <p className="mt-4">
                      This premium coffee is carefully selected and roasted to bring out the unique 
                      characteristics of the high-altitude growing region. Each bag is packed with 
                      care to ensure maximum freshness and flavor.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="story" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Story Impact</h3>
                  <div className="space-y-4">
                    <p>{mockStory.fullStory}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{mockStory.impact.farmersSupported}</div>
                        <div className="text-sm text-muted-foreground">Farmers Supported</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{mockStory.impact.familiesImpacted}</div>
                        <div className="text-sm text-muted-foreground">Families Impacted</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">${mockStory.impact.educationFund}</div>
                        <div className="text-sm text-muted-foreground">Education Fund</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">${mockStory.impact.healthcareFund}</div>
                        <div className="text-sm text-muted-foreground">Healthcare Fund</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Shipping & Returns</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Shipping</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Free shipping on orders over $50</li>
                        <li>• Standard shipping: 3-5 business days</li>
                        <li>• Express shipping: 1-2 business days</li>
                        <li>• International shipping available</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Returns</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• 30-day return policy</li>
                        <li>• Items must be in original condition</li>
                        <li>• Free return shipping</li>
                        <li>• Full refund within 5-7 business days</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
