"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ShoppingCart, 
  Hash, 
  ExternalLink, 
  Plus, 
  Minus,
  Image as ImageIcon,
  Settings,
  Trash2
} from "lucide-react"
import Image from "next/image"
import { Product, ProductStoryLink } from "@/types/commerce"
import { generateProductLink } from "@/lib/attribution"

interface ProductBlockProps {
  product: Product
  story?: {
    id: string
    title: string
    excerpt: string
    image: string
  }
  attribution: {
    nmbrId: string
    updateId: string
    campaignId: string
    recipientId: string
  }
  orgSlug: string
  isPreview?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export function ProductBlock({ 
  product, 
  story, 
  attribution, 
  orgSlug, 
  isPreview = false,
  onEdit,
  onDelete
}: ProductBlockProps) {
  const [quantity, setQuantity] = useState(1)
  
  const productLink = generateProductLink(
    product.slug,
    orgSlug,
    attribution,
    false // not marketplace
  )

  const checkoutLink = generateProductLink(
    product.slug,
    orgSlug,
    attribution,
    false
  ) + `&qty=${quantity}`

  if (isPreview) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{product.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">${product.price}</div>
                  <div className="text-sm text-muted-foreground">{product.stock} in stock</div>
                </div>
              </div>
              
              {story && (
                <div className="mb-3 p-2 bg-background rounded border">
                  <div className="flex items-center gap-2 mb-1">
                    <Image
                      src={story.image}
                      alt={story.title}
                      width={16}
                      height={16}
                      className="rounded-full"
                    />
                    <span className="text-sm font-medium">{story.title}</span>
                    <Badge variant="outline" size="sm">
                      <Hash className="w-3 h-3 mr-1" />
                      Story
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{story.excerpt}</p>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Button size="sm" className="flex-1">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Buy Now
                </Button>
                <Button size="sm" variant="outline">
                  View Product
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Product Block</CardTitle>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="ghost" onClick={onEdit}>
              <Settings className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          {product.title} - ${product.price}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
            {product.media[0] ? (
              <Image
                src={product.media[0].url}
                alt={product.title}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
            ) : (
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{product.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg font-bold">${product.price}</span>
              <Badge variant="outline">{product.stock} in stock</Badge>
            </div>
          </div>
        </div>

        {story && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Image
                src={story.image}
                alt={story.title}
                width={20}
                height={20}
                className="rounded-full"
              />
              <span className="text-sm font-medium">{story.title}</span>
              <Badge variant="outline" size="sm">
                <Hash className="w-3 h-3 mr-1" />
                Story Linked
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{story.excerpt}</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button size="sm" className="flex-1" asChild>
            <a href={checkoutLink} target="_blank" rel="noopener noreferrer">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Buy Now
            </a>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a href={productLink} target="_blank" rel="noopener noreferrer">
              View Product
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface ProductBlockEditorProps {
  onSave: (product: Product, story?: any) => void
  onCancel: () => void
}

export function ProductBlockEditor({ onSave, onCancel }: ProductBlockEditorProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedStory, setSelectedStory] = useState<any>(null)
  const [products] = useState<Product[]>([
    {
      id: '1',
      orgId: 'org-1',
      title: "Maria's Co-op Roast",
      slug: 'marias-coop-roast',
      description: "Premium coffee beans from Maria's cooperative, supporting local farmers and sustainable agriculture.",
      price: 18.00,
      currency: 'USD',
      variants: [],
      stock: 50,
      media: [{ id: 'm1', type: 'image', url: '/images/coffee-bag.jpg', alt: 'Coffee bag', order: 0 }],
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
      description: "Heirloom seed packets to start your own community garden.",
      price: 12.00,
      currency: 'USD',
      variants: [],
      stock: 100,
      media: [{ id: 'm2', type: 'image', url: '/images/seed-packets.jpg', alt: 'Seed packets', order: 0 }],
      status: 'active',
      fulfillmentMode: 'physical',
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-10T00:00:00Z'
    }
  ])

  const [stories] = useState([
    {
      id: 'nmbr-4',
      title: "Maria's Coffee Journey",
      excerpt: "Follow Maria's journey from coffee farmer to cooperative leader...",
      image: '/images/maria-story.jpg'
    },
    {
      id: 'nmbr-2',
      title: "Community Garden Project",
      excerpt: "See how our community garden is growing and supporting local families...",
      image: '/images/garden-story.jpg'
    }
  ])

  const handleSave = () => {
    if (selectedProduct) {
      onSave(selectedProduct, selectedStory)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Product Block</CardTitle>
        <CardDescription>Select a product to feature in your newsletter</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="product-select">Select Product</Label>
          <Select onValueChange={(value) => {
            const product = products.find(p => p.id === value)
            setSelectedProduct(product || null)
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a product..." />
            </SelectTrigger>
            <SelectContent>
              {products.map(product => (
                <SelectItem key={product.id} value={product.id}>
                  {product.title} - ${product.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedProduct && (
          <div>
            <Label htmlFor="story-select">Link to Story (Optional)</Label>
            <Select onValueChange={(value) => {
              const story = stories.find(s => s.id === value)
              setSelectedStory(story || null)
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a story to link..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No story link</SelectItem>
                {stories.map(story => (
                  <SelectItem key={story.id} value={story.id}>
                    {story.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedProduct && (
          <div className="p-4 border rounded-lg bg-muted/50">
            <h3 className="font-medium mb-2">Preview</h3>
            <div className="flex gap-3">
              <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{selectedProduct.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">{selectedProduct.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold">${selectedProduct.price}</span>
                  {selectedStory && (
                    <Badge variant="outline" size="sm">
                      <Hash className="w-3 h-3 mr-1" />
                      {selectedStory.title}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selectedProduct}>
            Add Product Block
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface ProductGridProps {
  products: Product[]
  stories: Record<string, any>
  attribution: {
    nmbrId: string
    updateId: string
    campaignId: string
    recipientId: string
  }
  orgSlug: string
  isPreview?: boolean
}

export function ProductGrid({ 
  products, 
  stories, 
  attribution, 
  orgSlug, 
  isPreview = false 
}: ProductGridProps) {
  if (products.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Featured Products</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map(product => (
          <ProductBlock
            key={product.id}
            product={product}
            story={stories[product.id]}
            attribution={attribution}
            orgSlug={orgSlug}
            isPreview={isPreview}
          />
        ))}
      </div>
    </div>
  )
}
