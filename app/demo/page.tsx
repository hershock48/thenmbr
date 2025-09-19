"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GlobalHeader } from "@/components/layout/global-header"
import { GlobalFooter } from "@/components/layout/global-footer"
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  BarChart3,
  ShoppingCart,
  Heart,
  TrendingUp,
  Hash,
  Globe,
  Store,
  Zap,
  Target,
  Award,
  Coffee,
  Building2,
  Smartphone,
  ExternalLink,
  Clock,
  Play,
  Eye,
  MousePointer,
  DollarSign,
  Percent,
  Mail,
  MessageSquare,
  Shield
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Demo data
const demoStories = {
  nonprofit: [
    {
      id: "nmbr-001",
      title: "Maria's Water Well",
      description: "Follow Maria's journey as her community gets access to clean water for the first time",
      image: "/images/maria-story.jpg",
      updates: [
        { date: "2024-01-15", title: "Well Construction Begins", content: "The drilling team arrived today. Maria is so excited to finally have clean water!" },
        { date: "2024-01-22", title: "First Water Flows", content: "Incredible! Clean water is flowing for the first time. The whole village celebrated!" },
        { date: "2024-02-01", title: "Community Training", content: "Maria and her neighbors learned how to maintain the well. This will last for generations." }
      ],
      donations: { raised: 2847, goal: 5000, donors: 127 },
      products: [
        { id: "water-bottle", name: "Maria's Water Bottle", price: 25, nmbr: "NMBR:001" },
        { id: "well-plaque", name: "Well Dedication Plaque", price: 150, nmbr: "NMBR:001" }
      ]
    },
    {
      id: "nmbr-002", 
      title: "Genesis School Project",
      description: "Watch Genesis build her dream school and transform her community's future",
      image: "/images/genesis-story.jpg",
      updates: [
        { date: "2024-01-10", title: "School Foundation Laid", content: "The foundation is complete! Genesis can't wait to see her school take shape." },
        { date: "2024-01-25", title: "Walls Going Up", content: "The walls are rising fast. Every brick represents hope for the children." },
        { date: "2024-02-05", title: "First Class Begins", content: "School is open! 50 children are now learning in Genesis's dream school." }
      ],
      donations: { raised: 12450, goal: 15000, donors: 89 },
      products: [
        { id: "school-supplies", name: "School Supply Kit", price: 35, nmbr: "NMBR:002" },
        { id: "desk-sponsor", name: "Desk Sponsorship", price: 75, nmbr: "NMBR:002" }
      ]
    }
  ],
  business: [
    {
      id: "nmbr-003",
      title: "Ethiopian Coffee Co-op",
      description: "Experience the journey of premium coffee from farm to cup, supporting local farmers",
      image: "/images/coffee-story.jpg", 
      updates: [
        { date: "2024-01-12", title: "Harvest Season Begins", content: "The coffee cherries are perfectly ripe. Our farmers are excited about this year's crop!" },
        { date: "2024-01-20", title: "Processing Excellence", content: "Our new processing facility is working beautifully. The quality is exceptional." },
        { date: "2024-02-01", title: "First Shipment Ready", content: "The first batch is ready for our customers. Every bag tells a story of impact." }
      ],
      sales: { revenue: 18420, orders: 156, conversion: 12.3 },
      products: [
        { id: "coffee-bag", name: "Ethiopian Co-op Roast", price: 18, nmbr: "NMBR:003" },
        { id: "coffee-subscription", name: "Monthly Coffee Subscription", price: 45, nmbr: "NMBR:003" }
      ]
    },
    {
      id: "nmbr-004",
      title: "Sustainable Fashion Line",
      description: "Follow the creation of eco-friendly clothing that supports fair trade practices",
      image: "/images/fashion-story.jpg",
      updates: [
        { date: "2024-01-08", title: "Fabric Selection", content: "We've chosen the most sustainable fabrics. Every thread tells a story of environmental care." },
        { date: "2024-01-18", title: "Production Begins", content: "Our skilled artisans are creating beautiful pieces. Each item is made with love." },
        { date: "2024-01-30", title: "Collection Launch", content: "The collection is live! Our customers love knowing the story behind their clothes." }
      ],
      sales: { revenue: 32150, orders: 234, conversion: 18.7 },
      products: [
        { id: "eco-shirt", name: "Sustainable Cotton T-Shirt", price: 32, nmbr: "NMBR:004" },
        { id: "eco-dress", name: "Ethical Fashion Dress", price: 68, nmbr: "NMBR:004" }
      ]
    }
  ]
}

const initialAttributionData = {
  nonprofit: {
    totalViews: 1247,
    productClicks: 89,
    conversions: 23,
    revenue: 2847,
    conversionRate: 18.5
  },
  business: {
    totalViews: 2156,
    productClicks: 156,
    conversions: 28,
    revenue: 18420,
    conversionRate: 12.3
  }
}

export default function DemoPage() {
  const [selectedStory, setSelectedStory] = useState(0)
  const [showWidget, setShowWidget] = useState(false)
  const [attributionData, setAttributionData] = useState(initialAttributionData.nonprofit)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentStories = demoStories.nonprofit
  const currentStory = currentStories[selectedStory]

  const handleNMBRClick = async (nmbrId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setShowWidget(true)
      // Simulate attribution tracking
      setAttributionData(prev => ({
        ...prev,
        totalViews: prev.totalViews + 1,
        productClicks: prev.productClicks + 1
      }))
    } catch (err) {
      setError('Failed to load story. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProductClick = (productId: string) => {
    // Simulate product click tracking
    setAttributionData(prev => ({
      ...prev,
      productClicks: prev.productClicks + 1
    }))
  }

  const handlePurchase = (productId: string) => {
    // Simulate purchase tracking
    setAttributionData(prev => ({
      ...prev,
      conversions: prev.conversions + 1,
      revenue: prev.revenue + currentStory.products.find(p => p.id === productId)?.price || 0
    }))
  }

  // New handler functions for connected buttons
  const handleStartTrial = () => {
    window.open('/signup', '_blank')
  }

  const handleWatchDemo = () => {
    // Open demo video in modal or new tab
    window.open('https://youtube.com/watch?v=demo', '_blank')
  }

  const handleTalkToSales = () => {
    window.open('/contact', '_blank')
  }

  const handleViewPricing = () => {
    window.open('/pricing', '_blank')
  }

  const handleScheduleDemo = () => {
    window.open('/demo-schedule', '_blank')
  }

  const handleTryAIStoryGenerator = () => {
    // This will be rebuilt with same effort as demo page
    alert('AI Story Generator - Coming Soon! This will be rebuilt with the same effort as this demo page.')
  }

  const handleViewLiveAnalytics = () => {
    // Open analytics dashboard
    window.open('/dashboard/analytics', '_blank')
  }

  const handleCustomizePlatform = () => {
    // Open customization options
    window.open('/dashboard/settings', '_blank')
  }

  const handleViewSecurityDetails = () => {
    // Open security details
    window.open('/security', '_blank')
  }

  const handleViewDocs = () => {
    window.open('/api-docs', '_blank')
  }

  const handleStartChat = () => {
    // Open AI chat interface
    alert('AI Assistant - Coming Soon! This will be rebuilt with the same effort as this demo page.')
  }

  const handleProceedToCheckout = () => {
    // Simulate checkout process
    alert('Proceeding to checkout... This would integrate with your payment processor.')
  }

  const handleCompletePurchase = () => {
    // Simulate purchase completion
    alert('Purchase completed! Thank you for your order.')
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader variant="default" />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit mx-auto">
                <Play className="w-4 h-4 mr-2" />
                Interactive Demo
              </Badge>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Experience Story-Driven Fundraising
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                See how NMBR transforms impact stories into sustainable donor relationships. 
                Click on NMBR codes, explore donation opportunities, and watch real-time impact attribution.
              </p>
            </div>

            {/* Nonprofit Focus Badge */}
            <div className="flex justify-center">
              <div className="bg-primary/10 text-primary px-6 py-2 rounded-full font-medium flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Nonprofit Demo
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button 
                size="lg" 
                className="text-lg px-6 py-4 sm:px-8 sm:py-6 w-full sm:w-auto"
                aria-label="Start your free trial of NMBR platform"
                onClick={handleStartTrial}
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-6 py-4 sm:px-8 sm:py-6 w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                aria-label="Watch a demo video of NMBR platform"
                onClick={handleWatchDemo}
              >
                Watch Demo Video
                <Play className="w-5 h-5 ml-2" aria-hidden="true" />
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground mt-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Setup in 5 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Attribution Dashboard */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Live Attribution Tracking</h2>
            <p className="text-xl text-muted-foreground">
              Watch real-time data as you interact with NMBR codes and products
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{attributionData.totalViews}</div>
                  <div className="text-sm text-muted-foreground">Story Views</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">{attributionData.productClicks}</div>
                  <div className="text-sm text-muted-foreground">Product Clicks</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{attributionData.conversions}</div>
                  <div className="text-sm text-muted-foreground">Conversions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">${attributionData.revenue.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Revenue</div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <div className="text-2xl font-bold text-primary">{attributionData.conversionRate}%</div>
                <div className="text-sm text-muted-foreground">Conversion Rate</div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive NMBR Experience */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Interactive NMBR Experience</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Click on NMBR codes to see stories come alive. Watch how every interaction 
              drives real engagement and donations.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Story Selection */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Choose a Story to Explore</h3>
                <div className="space-y-4">
                  {currentStories.map((story, index) => (
                    <Card 
                      key={story.id} 
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedStory === index ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedStory(index)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Hash className="w-8 h-8 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-lg">{story.title}</h4>
                            <p className="text-muted-foreground text-sm mb-3">{story.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="font-medium text-primary">{story.id.toUpperCase()}</span>
                              <span className="text-green-600">${story.donations.raised.toLocaleString()} raised</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Product Display */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Connected Products</h3>
                <div className="grid grid-cols-1 gap-4">
                  {currentStory.products.map((product) => (
                    <Card key={product.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                          <Hash className="w-6 h-6 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold">{product.name}</h4>
                            <Badge variant="outline" className="text-xs">{product.nmbr}</Badge>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold text-primary">${product.price}</span>
                            <Button 
                              size="sm" 
                              onClick={() => handleProductClick(product.id)}
                              className="ml-auto"
                            >
                              <MousePointer className="w-4 h-4 mr-2" />
                              Click to Track
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-bold mb-2">Try the NMBR Experience</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Click on any NMBR code above to see the story widget in action. 
                    Watch how every interaction is tracked and attributed.
                  </p>
                  <Button 
                    onClick={() => handleNMBRClick(currentStory.id)}
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Open Story Widget
                      </>
                    )}
                  </Button>
                  {error && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Widget Modal */}
      {showWidget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{currentStory.title}</CardTitle>
                <CardDescription>{currentStory.description}</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowWidget(false)}
              >
                ×
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-bold">Story Updates</h4>
                {currentStory.updates.map((update, index) => (
                  <div key={index} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{update.date}</Badge>
                      <h5 className="font-semibold">{update.title}</h5>
                    </div>
                    <p className="text-sm text-muted-foreground">{update.content}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="font-bold">Support This Story</h4>
                <div className="grid grid-cols-1 gap-3">
                  {currentStory.products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                          <Hash className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.nmbr}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">${product.price}</span>
                        <Button 
                          size="sm" 
                          onClick={() => handlePurchase(product.id)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Buy
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mid-Page CTA */}
      <section className="py-12 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl font-bold">See How Easy It Is to Get Started</h3>
            <p className="text-muted-foreground">
              Join hundreds of nonprofits already using NMBR to turn their stories into sustainable donations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-white" onClick={handleStartTrial}>
                <Zap className="w-4 h-4 mr-2" />
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" onClick={handleTalkToSales}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Talk to Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace vs Storefront Demo */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Two Ways to Sell Through Stories</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience both your own branded storefront and the global NMBR marketplace
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="storefront" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="storefront" className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Your Storefront
                </TabsTrigger>
                <TabsTrigger value="marketplace" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  NMBR Marketplace
                </TabsTrigger>
              </TabsList>

              <TabsContent value="storefront" className="space-y-8">
                <Card className="p-8 border-2 border-primary/20">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Store className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Your Branded Storefront</h3>
                    <p className="text-muted-foreground">
                      A white-labeled shop, branded as your own, running on NMBR rails
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h4 className="text-xl font-bold">Storefront Features</h4>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span>Your domain, your branding, your customers</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span>Complete control over pricing and inventory</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span>Direct customer relationships and data</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span>Full story-to-sale attribution tracking</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xl font-bold">Live Storefront Preview</h4>
                      <div className="bg-white border rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                            <Hash className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-bold">Maria's Co-op Coffee</div>
                            <div className="text-sm text-muted-foreground">NMBR:003</div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="text-sm text-muted-foreground">
                            Premium coffee beans from Maria's cooperative, supporting local farmers
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">$18.00</span>
                            <Button size="sm" onClick={() => handleProductClick('coffee-bag')}>
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Your branded store • yourdomain.com
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="marketplace" className="space-y-8">
                <Card className="p-8 border-2 border-secondary/20">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Globe className="w-8 h-8 text-secondary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">NMBR Global Marketplace</h3>
                    <p className="text-muted-foreground">
                      Our global catalog of story-driven goods, where your products can reach new audiences
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h4 className="text-xl font-bold">Marketplace Benefits</h4>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span>Access to engaged, story-driven customers</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span>Cross-promotion with other organizations</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span>Built-in discovery and recommendation engine</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span>You keep your brand. We give you extra reach.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xl font-bold">Marketplace Discovery</h4>
                      <div className="space-y-3">
                        <div className="bg-white border rounded-lg p-4 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                              <Hash className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-bold">Maria's Co-op Coffee</div>
                              <div className="text-sm text-muted-foreground">NMBR:003 • Your Brand</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">$18.00</div>
                              <div className="text-xs text-green-600">23 sold this week</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white border rounded-lg p-4 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                              <Hash className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-bold">Genesis School Supplies</div>
                              <div className="text-sm text-muted-foreground">NMBR:002 • Education First</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">$35.00</div>
                              <div className="text-xs text-green-600">15 sold this week</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white border rounded-lg p-4 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                              <Hash className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-bold">Eco Fashion Dress</div>
                              <div className="text-sm text-muted-foreground">NMBR:004 • Sustainable Style</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">$68.00</div>
                              <div className="text-xs text-green-600">8 sold this week</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* NMBR Uniqueness Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Makes NMBR Different?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how NMBR compares to other platforms and why organizations choose us
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 text-center border border-gray-200 bg-gray-50/50 transition-all duration-300 hover:shadow-md">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 transition-transform duration-200 hover:scale-105">
                  <ShoppingCart className="w-6 h-6 text-gray-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-700">Shopify</h3>
                <p className="text-gray-500 mb-4">E-commerce only</p>
                <ul className="text-sm space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">Online store</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">Payment processing</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <span className="w-4 h-4">×</span>
                    <span>No story integration</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <span className="w-4 h-4">×</span>
                    <span>No attribution tracking</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 text-center border border-gray-200 bg-gray-50/50 transition-all duration-300 hover:shadow-md">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 transition-transform duration-200 hover:scale-105">
                  <Mail className="w-6 h-6 text-gray-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-700">Mailchimp</h3>
                <p className="text-gray-500 mb-4">Email marketing only</p>
                <ul className="text-sm space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">Email campaigns</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">Audience management</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <span className="w-4 h-4">×</span>
                    <span>No e-commerce</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <span className="w-4 h-4">×</span>
                    <span>No story attribution</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 text-center border-2 border-primary bg-gradient-to-br from-primary/10 to-secondary/10 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4 transition-transform duration-200 hover:scale-110">
                  <Hash className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-primary">NMBR</h3>
                <p className="text-muted-foreground mb-4">Complete story-driven commerce</p>
                <ul className="text-sm space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Stories + E-commerce</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Complete attribution</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Marketplace + Storefront</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Multi-channel engagement</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <Badge className="bg-gradient-to-r from-primary to-secondary text-white font-semibold">
                    Winner
                  </Badge>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Commerce Flow Demo */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Complete Commerce Flow</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the full journey from story discovery to purchase completion with real-time tracking
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Shopping Cart */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <ShoppingCart className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Shopping Cart</h3>
                  <Badge variant="outline" className="ml-auto">3 items</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                      <Hash className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Maria's Co-op Coffee</div>
                      <div className="text-sm text-muted-foreground">NMBR:003</div>
                      <div className="text-sm text-green-600">Story: Water well construction</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">$18.00</div>
                      <div className="text-xs text-muted-foreground">Qty: 2</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-secondary/10 rounded flex items-center justify-center">
                      <Hash className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Genesis School Kit</div>
                      <div className="text-sm text-muted-foreground">NMBR:002</div>
                      <div className="text-sm text-green-600">Story: School construction</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">$35.00</div>
                      <div className="text-xs text-muted-foreground">Qty: 1</div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-bold">$71.00</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-muted-foreground">Platform fee (2%)</span>
                      <span className="text-sm">$1.42</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total</span>
                      <span>$72.42</span>
                    </div>
                  </div>

                <Button className="w-full" size="lg" onClick={handleProceedToCheckout}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Proceed to Checkout
                </Button>
                </div>
              </Card>

              {/* Checkout Process */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Checkout Process</h3>
                  <Badge variant="outline" className="ml-auto">Step 2 of 3</Badge>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Payment Information</h4>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg bg-muted/50">
                        <div className="text-sm font-medium">Card ending in 4242</div>
                        <div className="text-xs text-muted-foreground">Expires 12/25</div>
                      </div>
                      <div className="p-3 border rounded-lg bg-muted/50">
                        <div className="text-sm font-medium">Billing Address</div>
                        <div className="text-xs text-muted-foreground">123 Main St, City, State 12345</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Story Attribution</h4>
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Hash className="w-5 h-5 text-primary" />
                        <span className="font-medium">NMBR:003 - Maria's Water Well</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Your purchase will be tracked back to this story. Maria will receive updates about your support.
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Impact Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="font-bold text-green-600">$36.00</div>
                        <div className="text-xs text-muted-foreground">Direct Impact</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="font-bold text-blue-600">2 Stories</div>
                        <div className="text-xs text-muted-foreground">Supported</div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" onClick={handleCompletePurchase}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Purchase
                  </Button>
                </div>
              </Card>
            </div>

            {/* Order Confirmation */}
            <div className="mt-12">
              <Card className="p-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Order Confirmed!</h3>
                  <p className="text-green-700">Thank you for supporting these stories. Your impact is being tracked.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">#NMBR-003</div>
                    <div className="text-sm text-muted-foreground">Maria's Water Well</div>
                    <div className="text-xs text-green-600 mt-1">$36.00 impact</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">#NMBR-002</div>
                    <div className="text-sm text-muted-foreground">Genesis School</div>
                    <div className="text-xs text-green-600 mt-1">$35.00 impact</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">Total</div>
                    <div className="text-sm text-muted-foreground">$72.42</div>
                    <div className="text-xs text-green-600 mt-1">Complete attribution</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white/50 rounded-lg">
                  <h4 className="font-medium mb-2">What happens next?</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• You'll receive story updates via email</li>
                    <li>• Maria and Genesis will be notified of your support</li>
                    <li>• Your impact will be tracked in real-time</li>
                    <li>• You can follow the stories' progress anytime</li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Real-Time Analytics Demo */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Real-Time Analytics</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Watch how every interaction is tracked and attributed in real-time
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Attribution Funnel</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Story Views</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{attributionData.totalViews}</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MousePointer className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Product Clicks</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{attributionData.productClicks}</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">Add to Cart</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">{Math.floor(attributionData.productClicks * 0.3)}</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-orange-600" />
                      <span className="font-medium">Purchases</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">{attributionData.conversions}</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Revenue Attribution</h3>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                    <div className="text-3xl font-bold text-primary mb-2">${attributionData.revenue.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Revenue Generated</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">{attributionData.conversionRate}%</div>
                      <div className="text-xs text-muted-foreground">Conversion Rate</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">${Math.round(attributionData.revenue / attributionData.conversions)}</div>
                      <div className="text-xs text-muted-foreground">Avg Order Value</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-sm font-medium text-yellow-800 mb-1">Attribution Success</div>
                    <div className="text-xs text-yellow-700">
                      Every dollar is tracked back to the specific story that drove the purchase. 
                      No attribution loss, complete transparency.
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic CTAs Throughout */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Immediate Action CTA */}
              <Card className="p-6 text-center border-2 border-primary/20 hover:border-primary/40 transition-all">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Start Your Free Trial</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Get full access to all features for 14 days. No credit card required.
                </p>
                <Button className="w-full" size="lg" onClick={handleStartTrial}>
                  <Play className="w-4 h-4 mr-2" />
                  Start Free Trial
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Setup in under 5 minutes</p>
              </Card>

              {/* Demo CTA */}
              <Card className="p-6 text-center border-2 border-secondary/20 hover:border-secondary/40 transition-all">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-2">See It In Action</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Book a personalized demo with our team. See exactly how NMBR works for your organization.
                </p>
                <Button className="w-full" size="lg" variant="secondary" onClick={handleScheduleDemo}>
                  <Clock className="w-4 h-4 mr-2" />
                  Schedule Demo
                </Button>
                <p className="text-xs text-muted-foreground mt-2">15-minute personalized walkthrough</p>
              </Card>

              {/* Pricing CTA */}
              <Card className="p-6 text-center border-2 border-orange-200 hover:border-orange-300 transition-all">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">View Pricing</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Transparent pricing starting at $29/month. See which plan fits your needs.
                </p>
                <Button className="w-full" size="lg" variant="outline" onClick={handleViewPricing}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Pricing
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Cancel anytime, no contracts</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency & Social Proof CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">Join 500+ Organizations Already Growing With NMBR</h2>
              <p className="text-xl opacity-90">
                Don't let your stories go untold. Start turning them into sustainable donations today.
              </p>
            </div>

            {/* Social Proof Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-8">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">500+</div>
                <div className="text-sm opacity-80">Active Organizations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">$2.3M+</div>
                <div className="text-sm opacity-80">Donations Raised</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">15K+</div>
                <div className="text-sm opacity-80">Stories Told</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">98%</div>
                <div className="text-sm opacity-80">Donor Satisfaction</div>
              </div>
            </div>

            {/* Primary CTA */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4" onClick={handleStartTrial}>
                  <Zap className="w-5 h-5 mr-2" />
                  Start Your Free Trial Now
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" onClick={handleWatchDemo}>
                  <Eye className="w-5 h-5 mr-2" />
                  Watch 2-Minute Demo
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm opacity-80">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>24/7 support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features Showcase */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Advanced Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how NMBR's advanced features give you the edge in story-driven commerce
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* AI Story Generation */}
              <Card className="p-6 border-2 border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">AI Story Generation</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Our AI analyzes your impact data and automatically generates compelling stories that drive engagement.
                </p>
                
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium mb-1">Input: Impact Data</div>
                    <div className="text-xs text-muted-foreground">"Built 3 schools, 150 students enrolled, $45K raised"</div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="text-sm font-medium mb-1">AI Generated Story</div>
                    <div className="text-xs text-muted-foreground">
                      "Meet Maria, a 12-year-old who now walks to her new school every morning. 
                      Thanks to your support, 150 children like Maria have access to quality education..."
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-4" variant="outline" onClick={handleTryAIStoryGenerator}>
                  <Zap className="w-4 h-4 mr-2" />
                  Try AI Story Generator
                </Button>
              </Card>

              {/* Real-Time Analytics */}
              <Card className="p-6 border-2 border-secondary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-secondary to-primary rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Real-Time Analytics</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Track every interaction, conversion, and attribution in real-time with our advanced analytics dashboard.
                </p>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="text-lg font-bold text-green-600">+23%</div>
                      <div className="text-xs text-muted-foreground">Engagement</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="text-lg font-bold text-blue-600">+45%</div>
                      <div className="text-xs text-muted-foreground">Conversions</div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium mb-1">Live Attribution</div>
                    <div className="text-xs text-muted-foreground">
                      Story NMBR:003 → Product Click → Purchase ($89) → Attribution Complete
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-4" variant="outline" onClick={handleViewLiveAnalytics}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Live Analytics
                </Button>
              </Card>

              {/* White-Label Customization */}
              <Card className="p-6 border-2 border-orange-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">White-Label Platform</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Fully customizable platform with your branding, domain, and design. Your customers never know it's NMBR.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Custom domain (yourbrand.com)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Your logo and branding</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Custom color schemes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>API access for integration</span>
                  </div>
                </div>
                
                <Button className="w-full mt-4" variant="outline" onClick={handleCustomizePlatform}>
                  <Award className="w-4 h-4 mr-2" />
                  Customize Platform
                </Button>
              </Card>

              {/* Enterprise Security */}
              <Card className="p-6 border-2 border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Enterprise Security</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Bank-level security with SOC 2 compliance, data encryption, and enterprise-grade infrastructure.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>SOC 2 Type II Certified</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>End-to-end encryption</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>GDPR & CCPA compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>99.9% uptime SLA</span>
                  </div>
                </div>
                
                <Button className="w-full mt-4" variant="outline" onClick={handleViewSecurityDetails}>
                  <Shield className="w-4 h-4 mr-2" />
                  View Security Details
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive API Demo */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Interactive API Demo</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Try our API in real-time and see how easy it is to integrate NMBR into your applications
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Hash className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Create a Story via API</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">API Endpoint</label>
                    <div className="p-3 bg-muted rounded-lg font-mono text-sm">
                      POST https://api.thenmbr.com/v1/stories
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Request Body</label>
                    <div className="p-3 bg-muted rounded-lg font-mono text-sm overflow-x-auto">
                      {`{
  "title": "Maria's Water Well",
  "description": "Help Maria's village access clean water",
  "impact_goal": 5000,
  "current_raised": 3200,
  "nmbr_id": "003"
}`}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => {
                        // Simulate API call
                        console.log('API call simulated')
                      }}
                      className="flex-1"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Test API Call
                    </Button>
                    <Button variant="outline" onClick={handleViewDocs}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Docs
                    </Button>
                  </div>
                  
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-sm font-medium text-green-800 mb-1">Response</div>
                    <div className="text-xs text-green-700 font-mono">
                      {`{
  "success": true,
  "story_id": "story_123",
  "nmbr_id": "003",
  "attribution_url": "https://thenmbr.com/story/003"
}`}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Integration Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Seamless Integrations</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect NMBR with your existing tools and workflows for maximum efficiency
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* E-commerce Integrations */}
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">E-commerce</h3>
                <p className="text-muted-foreground mb-4">Connect with your existing store</p>
                <div className="space-y-2 text-sm text-left">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Shopify</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>WooCommerce</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>BigCommerce</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Custom API</span>
                  </div>
                </div>
              </Card>

              {/* Marketing Integrations */}
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Marketing</h3>
                <p className="text-muted-foreground mb-4">Sync with your marketing tools</p>
                <div className="space-y-2 text-sm text-left">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Mailchimp</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>HubSpot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Salesforce</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Zapier</span>
                  </div>
                </div>
              </Card>

              {/* Analytics Integrations */}
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Analytics</h3>
                <p className="text-muted-foreground mb-4">Connect with analytics platforms</p>
                <div className="space-y-2 text-sm text-left">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Google Analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Mixpanel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Amplitude</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Custom Webhooks</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Analytics Dashboard */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Advanced Analytics & Monitoring</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real-time insights, user behavior tracking, and performance monitoring that drives growth
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Real-Time Metrics */}
              <Card className="p-6 border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Real-Time Metrics</h3>
                  <Badge className="bg-green-100 text-green-800">Live</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">1,247</div>
                      <div className="text-sm text-blue-700">Active Users</div>
                      <div className="text-xs text-green-600">+12% from yesterday</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">$23.4K</div>
                      <div className="text-sm text-green-700">Revenue Today</div>
                      <div className="text-xs text-green-600">+8% from yesterday</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium mb-2">Live Attribution Stream</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>NMBR:003 → Coffee Purchase</span>
                        <span className="text-green-600">$18.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>NMBR:002 → School Kit</span>
                        <span className="text-green-600">$35.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>NMBR:001 → Water Well</span>
                        <span className="text-green-600">$50.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* User Behavior Heatmap */}
              <Card className="p-6 border-2 border-purple-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">User Behavior Heatmap</h3>
                  <Badge className="bg-purple-100 text-purple-800">Hot</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-8 bg-red-500 rounded text-white text-xs flex items-center justify-center">Hot</div>
                    <div className="h-8 bg-yellow-400 rounded text-white text-xs flex items-center justify-center">Warm</div>
                    <div className="h-8 bg-green-400 rounded text-white text-xs flex items-center justify-center">Cool</div>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium mb-2">Top Interaction Zones</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Hero CTA Buttons</span>
                        <span className="text-red-600">2,847 clicks</span>
                      </div>
                      <div className="flex justify-between">
                        <span>NMBR Story Cards</span>
                        <span className="text-orange-600">1,923 clicks</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Commerce Flow</span>
                        <span className="text-yellow-600">1,456 clicks</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Conversion Funnel */}
              <Card className="p-6 border-2 border-orange-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Conversion Funnel</h3>
                  <Badge className="bg-orange-100 text-orange-800">12.3%</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Page Views</span>
                      <span className="text-lg font-bold text-green-600">10,000</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">Story Interactions</span>
                      <span className="text-lg font-bold text-blue-600">3,200</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm font-medium">Add to Cart</span>
                      <span className="text-lg font-bold text-yellow-600">1,200</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium">Purchases</span>
                      <span className="text-lg font-bold text-purple-600">1,230</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium mb-1">Optimization Opportunities</div>
                    <div className="text-xs text-muted-foreground">
                      Cart abandonment at 67% - consider exit-intent popups
                    </div>
                  </div>
                </div>
              </Card>

              {/* Performance Monitoring */}
              <Card className="p-6 border-2 border-green-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Performance Monitoring</h3>
                  <Badge className="bg-green-100 text-green-800">99.9%</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <div className="text-lg font-bold text-green-600">1.2s</div>
                      <div className="text-xs text-green-700">Load Time</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <div className="text-lg font-bold text-blue-600">98</div>
                      <div className="text-xs text-blue-700">Performance Score</div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium mb-2">System Health</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>API Response Time</span>
                        <span className="text-green-600">45ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Database Queries</span>
                        <span className="text-green-600">12ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>CDN Cache Hit</span>
                        <span className="text-green-600">94%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* A/B Testing Framework */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">A/B Testing & Optimization</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Continuously optimize your conversion rates with data-driven experiments
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Current Test */}
              <Card className="p-6 border-2 border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Active Test: Hero CTA</h3>
                  <Badge className="bg-blue-100 text-blue-800">Running</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-sm font-medium mb-1">Version A (Control)</div>
                      <div className="text-xs text-muted-foreground">"Start Free Trial"</div>
                      <div className="text-lg font-bold text-blue-600">12.3%</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm font-medium mb-1">Version B (Test)</div>
                      <div className="text-xs text-muted-foreground">"Get Started Now"</div>
                      <div className="text-lg font-bold text-green-600">15.7%</div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-sm font-medium text-yellow-800 mb-1">Statistical Significance: 95%</div>
                    <div className="text-xs text-yellow-700">Version B is 27% better - ready to deploy!</div>
                  </div>
                </div>
              </Card>

              {/* Test History */}
              <Card className="p-6 border-2 border-secondary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold">Test History</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm">Pricing Page Layout</span>
                    <span className="text-xs text-green-600">+23% conversion</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm">Story Card Design</span>
                    <span className="text-xs text-green-600">+18% engagement</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="text-sm">Checkout Flow</span>
                    <span className="text-xs text-red-600">-5% conversion</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm">Email Subject Lines</span>
                    <span className="text-xs text-green-600">+31% open rate</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Powered Personalization */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">AI-Powered Personalization</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every visitor gets a unique, personalized experience powered by advanced AI
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Dynamic Content Personalization */}
              <Card className="p-6 border-2 border-purple-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Dynamic Content Personalization</h3>
                  <Badge className="bg-purple-100 text-purple-800">AI</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium mb-2">Visitor Profile Analysis</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Industry:</span>
                        <span className="text-purple-600">Nonprofit</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Interest Level:</span>
                        <span className="text-purple-600">High</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Budget Range:</span>
                        <span className="text-purple-600">$100-500/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Preferred Content:</span>
                        <span className="text-purple-600">Success Stories</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="text-sm font-medium mb-2">Personalized Content</div>
                    <div className="text-xs text-purple-700">
                      "Based on your nonprofit focus, here are 3 success stories from similar organizations that increased donations by 340%..."
                    </div>
                  </div>
                </div>
              </Card>

              {/* Smart Automation */}
              <Card className="p-6 border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Smart Automation</h3>
                  <Badge className="bg-blue-100 text-blue-800">Auto</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Auto-generate personalized emails</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Dynamic pricing based on behavior</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Smart follow-up sequences</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Automated A/B testing</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium mb-1">Active Automations</div>
                    <div className="text-xs text-blue-700">
                      12 campaigns running • 3,247 emails sent • 23% open rate
                    </div>
                  </div>
                </div>
              </Card>

              {/* Predictive Analytics */}
              <Card className="p-6 border-2 border-green-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Predictive Analytics</h3>
                  <Badge className="bg-green-100 text-green-800">ML</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <div className="text-lg font-bold text-green-600">87%</div>
                      <div className="text-xs text-green-700">Conversion Probability</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <div className="text-lg font-bold text-blue-600">$2.3K</div>
                      <div className="text-xs text-blue-700">Predicted LTV</div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium mb-2">AI Insights</div>
                    <div className="text-xs text-muted-foreground">
                      "This visitor is 3x more likely to convert if shown the enterprise pricing plan"
                    </div>
                  </div>
                </div>
              </Card>

              {/* Intelligent Recommendations */}
              <Card className="p-6 border-2 border-orange-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Intelligent Recommendations</h3>
                  <Badge className="bg-orange-100 text-orange-800">Smart</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="p-2 bg-orange-50 rounded text-sm">
                      <div className="font-medium">Recommended for you:</div>
                      <div className="text-xs text-orange-700">Nonprofit Success Stories Package</div>
                    </div>
                    <div className="p-2 bg-orange-50 rounded text-sm">
                      <div className="font-medium">Based on your interests:</div>
                      <div className="text-xs text-orange-700">Water Well Construction Stories</div>
                    </div>
                    <div className="p-2 bg-orange-50 rounded text-sm">
                      <div className="font-medium">Similar organizations:</div>
                      <div className="text-xs text-orange-700">Education-focused nonprofits</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chatbot Integration */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">AI-Powered Customer Support</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Intelligent chatbot that understands context and provides personalized assistance
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-6 border-2 border-primary/20">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">NMBR AI Assistant</h3>
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium mb-2">Sample Conversation</div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-end">
                        <div className="bg-primary text-primary-foreground p-2 rounded-lg max-w-xs">
                          "How does NMBR help nonprofits increase donations?"
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-muted p-2 rounded-lg max-w-xs">
                          "NMBR helps nonprofits increase donations by 340% on average through story-driven commerce. We connect your impact stories directly to products and donations, creating emotional connections that drive action. Would you like to see a specific example?"
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-primary text-primary-foreground p-2 rounded-lg max-w-xs">
                          "Yes, show me the water well example"
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-muted p-2 rounded-lg max-w-xs">
                          "Perfect! Here's how Maria's water well story generated $45K in donations: [Shows interactive story widget] The key is connecting the emotional story to tangible impact. Ready to try this with your organization?"
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <div className="text-lg font-bold text-green-600">24/7</div>
                      <div className="text-xs text-green-700">Availability</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <div className="text-lg font-bold text-blue-600">94%</div>
                      <div className="text-xs text-blue-700">Satisfaction Rate</div>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full" variant="outline" onClick={handleStartChat}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start Chat with AI Assistant
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Smart Workflow Automation */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Smart Workflow Automation</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Automate your entire story-to-revenue workflow with intelligent triggers and actions
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Content Automation */}
              <Card className="p-6 text-center border-2 border-purple-200">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Content Automation</h3>
                <p className="text-muted-foreground mb-4">AI generates and optimizes content</p>
                <div className="space-y-2 text-sm text-left">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Auto-generate stories from impact data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Optimize headlines for engagement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Create personalized email campaigns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Generate social media content</span>
                  </div>
                </div>
              </Card>

              {/* Campaign Automation */}
              <Card className="p-6 text-center border-2 border-blue-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Campaign Automation</h3>
                <p className="text-muted-foreground mb-4">Intelligent campaign management</p>
                <div className="space-y-2 text-sm text-left">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Trigger campaigns based on behavior</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Segment audiences automatically</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Optimize send times for each user</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>A/B test subject lines automatically</span>
                  </div>
                </div>
              </Card>

              {/* Analytics Automation */}
              <Card className="p-6 text-center border-2 border-green-200">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Analytics Automation</h3>
                <p className="text-muted-foreground mb-4">Smart insights and reporting</p>
                <div className="space-y-2 text-sm text-left">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Generate automated reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Alert on performance anomalies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Predict future trends</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Recommend optimization actions</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Security & Compliance */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Enterprise Security & Compliance</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Bank-grade security, enterprise compliance, and peace of mind for your organization
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Security Certifications */}
              <Card className="p-6 bg-slate-800 border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Security Certifications</h3>
                  <Badge className="bg-green-100 text-green-800">Certified</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-700 rounded-lg text-center">
                      <div className="text-lg font-bold text-green-400">SOC 2</div>
                      <div className="text-xs text-slate-300">Type II</div>
                    </div>
                    <div className="p-3 bg-slate-700 rounded-lg text-center">
                      <div className="text-lg font-bold text-blue-400">ISO 27001</div>
                      <div className="text-xs text-slate-300">Certified</div>
                    </div>
                    <div className="p-3 bg-slate-700 rounded-lg text-center">
                      <div className="text-lg font-bold text-purple-400">GDPR</div>
                      <div className="text-xs text-slate-300">Compliant</div>
                    </div>
                    <div className="p-3 bg-slate-700 rounded-lg text-center">
                      <div className="text-lg font-bold text-orange-400">CCPA</div>
                      <div className="text-xs text-slate-300">Compliant</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-700 rounded-lg">
                    <div className="text-sm font-medium mb-2 text-white">Security Features</div>
                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>End-to-end encryption</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Multi-factor authentication</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Role-based access control</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Regular security audits</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Data Privacy & Compliance */}
              <Card className="p-6 bg-slate-800 border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Data Privacy & Compliance</h3>
                  <Badge className="bg-blue-100 text-blue-800">GDPR Ready</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Data encryption at rest and in transit</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Right to be forgotten implementation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Data processing consent management</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Privacy by design architecture</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-slate-700 rounded-lg">
                    <div className="text-sm font-medium mb-1 text-white">Compliance Status</div>
                    <div className="text-xs text-slate-300">
                      All data processing activities are GDPR compliant with full audit trails
                    </div>
                  </div>
                </div>
              </Card>

              {/* Single Sign-On (SSO) */}
              <Card className="p-6 bg-slate-800 border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Enterprise SSO</h3>
                  <Badge className="bg-purple-100 text-purple-800">SAML 2.0</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="p-2 bg-slate-700 rounded text-sm">
                      <div className="font-medium text-white">Supported Providers:</div>
                      <div className="text-xs text-slate-300 mt-1">
                        Microsoft Azure AD, Google Workspace, Okta, OneLogin, Ping Identity
                      </div>
                    </div>
                    <div className="p-2 bg-slate-700 rounded text-sm">
                      <div className="font-medium text-white">Authentication Methods:</div>
                      <div className="text-xs text-slate-300 mt-1">
                        SAML 2.0, OAuth 2.0, OpenID Connect, LDAP
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-slate-700 rounded-lg">
                    <div className="text-sm font-medium mb-1 text-white">Enterprise Benefits</div>
                    <div className="text-xs text-slate-300">
                      Centralized user management, enhanced security, seamless integration
                    </div>
                  </div>
                </div>
              </Card>

              {/* Audit Logging & Compliance */}
              <Card className="p-6 bg-slate-800 border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Audit Logging</h3>
                  <Badge className="bg-orange-100 text-orange-800">Compliant</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="p-2 bg-slate-700 rounded text-sm">
                      <div className="font-medium text-white">Comprehensive Logging:</div>
                      <div className="text-xs text-slate-300 mt-1">
                        All user actions, data access, and system changes are logged
                      </div>
                    </div>
                    <div className="p-2 bg-slate-700 rounded text-sm">
                      <div className="font-medium text-white">Retention Policy:</div>
                      <div className="text-xs text-slate-300 mt-1">
                        7 years of audit logs with tamper-proof storage
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-slate-700 rounded-lg">
                    <div className="text-sm font-medium mb-1 text-white">Compliance Reports</div>
                    <div className="text-xs text-slate-300">
                      Automated compliance reporting for SOC 2, GDPR, and industry standards
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Enterprise SLA & Support */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6 bg-slate-800 border-slate-700 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">99.9% Uptime SLA</h3>
                <p className="text-slate-300 mb-4">Guaranteed availability with enterprise support</p>
                <div className="space-y-2 text-sm text-left">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>24/7 monitoring</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Automatic failover</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Real-time alerts</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-slate-800 border-slate-700 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Dedicated Support</h3>
                <p className="text-slate-300 mb-4">Personal success manager and priority support</p>
                <div className="space-y-2 text-sm text-left">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Dedicated account manager</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Priority ticket response</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Phone & email support</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-slate-800 border-slate-700 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Security Guarantee</h3>
                <p className="text-slate-300 mb-4">Comprehensive security coverage and insurance</p>
                <div className="space-y-2 text-sm text-left">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>$10M cyber liability insurance</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Data breach notification</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Incident response team</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Integration Showcase */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Enterprise Integration</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Seamlessly integrate with your existing enterprise infrastructure and workflows
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Microsoft Integration */}
              <Card className="p-6 text-center border-2 border-blue-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Microsoft 365</h3>
                <p className="text-sm text-muted-foreground mb-4">Azure AD, Teams, SharePoint</p>
                <div className="space-y-1 text-xs text-left">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Single Sign-On</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Teams integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>SharePoint sync</span>
                  </div>
                </div>
              </Card>

              {/* Google Workspace */}
              <Card className="p-6 text-center border-2 border-green-200">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Google Workspace</h3>
                <p className="text-sm text-muted-foreground mb-4">Gmail, Drive, Calendar</p>
                <div className="space-y-1 text-xs text-left">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>OAuth 2.0</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Drive integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Calendar sync</span>
                  </div>
                </div>
              </Card>

              {/* Salesforce */}
              <Card className="p-6 text-center border-2 border-blue-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Salesforce</h3>
                <p className="text-sm text-muted-foreground mb-4">CRM, Marketing Cloud</p>
                <div className="space-y-1 text-xs text-left">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Lead sync</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Campaign data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Custom objects</span>
                  </div>
                </div>
              </Card>

              {/* Custom APIs */}
              <Card className="p-6 text-center border-2 border-purple-200">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Custom APIs</h3>
                <p className="text-sm text-muted-foreground mb-4">REST, GraphQL, Webhooks</p>
                <div className="space-y-1 text-xs text-left">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>RESTful APIs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>GraphQL support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Webhook events</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final Conversion CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 text-center bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
              <div className="space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-green-800">Ready to See Results Like These?</h3>
                  <p className="text-lg text-green-700 max-w-2xl mx-auto">
                    "We increased our donation revenue by 340% in just 3 months using NMBR. 
                    The story attribution feature helped us understand exactly which stories 
                    were driving the most support."
                  </p>
                  <p className="text-sm text-green-600 font-medium">- Sarah Chen, Development Director, Water for All</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" onClick={handleStartTrial}>
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Start Your Success Story
                  </Button>
                  <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white" onClick={handleTalkToSales}>
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Talk to Sales
                  </Button>
                </div>

                <div className="pt-4 border-t border-green-200">
                  <p className="text-sm text-green-600">
                    Join 500+ nonprofits already using NMBR to turn their stories into sustainable donations
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
      
      <GlobalFooter />
    </div>
  )
}
