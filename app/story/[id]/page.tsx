"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Share2, ShoppingCart, MapPin, Leaf, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock story data - in real app this would come from API based on story ID
const storyData = {
  id: "1",
  productName: "Ethiopian Highland Coffee",
  brandName: "Mountain Peak Coffee Co.",
  heroImage: "/coffee-farm-hero.jpg",
  productImage: "/coffee-bag-product.jpg",
  story: {
    title: "From Addis Ababa to Your Cup",
    content:
      "Meet Almaz, a third-generation coffee farmer in the Ethiopian highlands. Her family has been growing coffee on the same mountainside for over 60 years. When you purchased this bag, you directly supported her sustainable farming practices and helped fund a new water well for her village.",
    location: "Sidama Region, Ethiopia",
    farmerName: "Almaz Tadesse",
    farmerImage: "/farmer-portrait.jpg",
  },
  impact: {
    peopleHelped: 127,
    treesPlanted: 45,
    waterSaved: "2,340L",
    co2Offset: "12kg",
  },
  metrics: {
    qualityScore: 94,
    sustainabilityRating: "A+",
    fairTradeVerified: true,
  },
  purchaseInfo: {
    price: "$24.99",
    inStock: true,
    nextDelivery: "2-3 days",
  },
}

export default function StoryDiscoveryPage({ params }: { params: { id: string } }) {
  const [isLiked, setIsLiked] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = `Check out this amazing story behind ${storyData.productName}!`

    switch (platform) {
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
        break
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      case "instagram":
        navigator.clipboard.writeText(url)
        alert("Link copied! Share on Instagram Stories")
        break
    }
    setShowShareMenu(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className={isLiked ? "text-red-500" : "text-muted-foreground"}
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="text-muted-foreground"
              >
                <Share2 className="h-5 w-5" />
              </Button>
              {showShareMenu && (
                <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-lg shadow-lg p-2 min-w-[120px]">
                  <button
                    onClick={() => handleShare("twitter")}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded"
                  >
                    Twitter
                  </button>
                  <button
                    onClick={() => handleShare("facebook")}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded"
                  >
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare("instagram")}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded"
                  >
                    Instagram
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-64 md:h-80">
        <Image src="/placeholder-ez0ch.png" alt={storyData.story.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <Badge variant="secondary" className="mb-2 bg-primary text-primary-foreground">
            {storyData.brandName}
          </Badge>
          <h1 className="text-2xl font-bold text-balance">{storyData.story.title}</h1>
          <div className="flex items-center gap-2 mt-2 text-sm opacity-90">
            <MapPin className="h-4 w-4" />
            <span>{storyData.story.location}</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src="/placeholder-73clh.png"
                  alt={storyData.productName}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{storyData.productName}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    Quality Score: {storyData.metrics.qualityScore}
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
                    {storyData.metrics.sustainabilityRating}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-primary mt-2">{storyData.purchaseInfo.price}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12">
                <Image
                  src="/ethiopian-woman-farmer-portrait.jpg"
                  alt={storyData.story.farmerName}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div>
                <p className="font-medium">{storyData.story.farmerName}</p>
                <p className="text-sm text-muted-foreground">Coffee Farmer</p>
              </div>
            </div>
            <p className="text-foreground leading-relaxed">{storyData.story.content}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              Your Impact
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{storyData.impact.peopleHelped}</div>
                <div className="text-sm text-muted-foreground">People Helped</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{storyData.impact.treesPlanted}</div>
                <div className="text-sm text-muted-foreground">Trees Planted</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{storyData.impact.waterSaved}</div>
                <div className="text-sm text-muted-foreground">Water Saved</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{storyData.impact.co2Offset}</div>
                <div className="text-sm text-muted-foreground">CO₂ Offset</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Love this story?</h3>
                <p className="text-sm text-muted-foreground">Support {storyData.story.farmerName} again</p>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                In Stock
              </Badge>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Order Again - {storyData.purchaseInfo.price}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Delivery in {storyData.purchaseInfo.nextDelivery}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">More Stories You'll Love</h3>
            <div className="space-y-3">
              <div className="flex gap-3 p-3 bg-muted rounded-lg">
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image src="/lush-tea-plantation.png" alt="Related story" fill className="object-cover rounded" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Himalayan Tea Gardens</p>
                  <p className="text-xs text-muted-foreground">Supporting mountain communities</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-muted rounded-lg">
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image src="/cocoa-farm.jpg" alt="Related story" fill className="object-cover rounded" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Fair Trade Chocolate</p>
                  <p className="text-xs text-muted-foreground">Empowering cocoa farmers</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
