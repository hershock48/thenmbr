"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Heart,
  Users,
  DollarSign,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Target,
  Gift,
  Settings,
  LogIn,
  UserPlus,
  Eye,
  Play,
  ShoppingBag,
  Coffee,
  Palette,
  QrCode,
  Smartphone,
  Globe,
  Clock,
  TrendingUp,
  Shield,
  Code,
  Store,
  ExternalLink,
  ChevronRight,
  X,
  MessageSquare,
  Hash,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function DemoPage() {
  const [audienceType, setAudienceType] = useState<'nonprofit' | 'business'>('nonprofit')
  const [demoOrgId, setDemoOrgId] = useState('demo-org-123')
  const [selectedStory, setSelectedStory] = useState<string | null>(null)
  const [showWidget, setShowWidget] = useState(false)
  const [widgetStoryId, setWidgetStoryId] = useState<string | null>(null)

  // Story content based on story ID
  const getStoryContent = (storyId: string) => {
    if (audienceType === 'business') {
      const businessStories = {
        '1': {
          title: 'Ethiopian Coffee',
          subtitle: 'Handcrafted by the Tesfaye family',
          heroText: 'Meet the Tesfaye family from the highlands of Ethiopia. For three generations, they\'ve been perfecting the art of coffee cultivation. Each bean is hand-picked at the peak of ripeness, sun-dried on traditional raised beds, and roasted in small batches to bring you the most authentic Ethiopian coffee experience. But behind every cup lies a story of struggle, determination, and hope that most coffee drinkers never see.',
          middleText: 'But everything changed when we partnered with local cooperatives to source directly from families like the Tesfayes. Now, every cup you drink tells their story of resilience, tradition, and hope. The family has been able to invest in better equipment, send their children to school, and build a sustainable future for their community.',
          endText: 'Today, the Tesfaye family\'s coffee is enjoyed by thousands of coffee lovers worldwide. Each purchase directly supports their family and community, creating a ripple effect of positive change. When you choose our coffee, you\'re not just buying a product – you\'re becoming part of their story.',
          stats: { label: 'Coffee Club Members', value: '1,247', progress: 75 },
          buttonText: 'Join Coffee Club'
        },
        '2': {
          title: 'Bamboo Phone Case',
          subtitle: 'Made by artisans in Vietnam',
          heroText: 'In the bustling markets of Ho Chi Minh City, master craftsman Nguyen Van Minh has been perfecting the art of bamboo weaving for over 20 years. Each phone case is hand-woven using traditional techniques passed down through generations, creating a unique blend of modern functionality and ancient craftsmanship.',
          middleText: 'When we discovered Nguyen\'s workshop, we knew we had found something special. His dedication to sustainable materials and traditional methods inspired us to create a partnership that would bring his beautiful work to customers worldwide while supporting his family and preserving cultural heritage.',
          endText: 'Today, Nguyen\'s bamboo phone cases protect devices while telling a story of environmental responsibility and cultural preservation. Each purchase supports sustainable practices and helps keep traditional Vietnamese craftsmanship alive for future generations.',
          stats: { label: 'Cases Sold', value: '3,456', progress: 60 },
          buttonText: 'Shop Collection'
        },
        '3': {
          title: 'Handmade Ceramics',
          subtitle: 'Crafted by the Rodriguez family',
          heroText: 'In the mountains of Oaxaca, Mexico, the Rodriguez family has been creating beautiful ceramics for over 100 years. Each piece is hand-thrown on a traditional potter\'s wheel, painted with natural pigments, and fired in a wood-burning kiln using techniques unchanged for centuries.',
          middleText: 'When we met Maria Rodriguez, she was struggling to keep the family tradition alive. Her children had moved to the city for work, and the local market for traditional ceramics was shrinking. We saw an opportunity to help preserve this beautiful art form while creating sustainable income for the family.',
          endText: 'Today, the Rodriguez family\'s ceramics grace tables around the world, each piece carrying the soul of Mexican craftsmanship. Their children have returned to help with the business, ensuring that this precious tradition will continue for generations to come.',
          stats: { label: 'Pieces Sold', value: '892', progress: 45 },
          buttonText: 'View Gallery'
        }
      }
      return businessStories[storyId as keyof typeof businessStories] || businessStories['1']
    } else {
      const nonprofitStories = {
        '1': {
          title: 'Maria\'s Water Well',
          subtitle: 'Clean water for 200 families',
          heroText: 'Maria lives in a small village in Guatemala where clean water was once a luxury. Every morning, she would wake before dawn to walk three miles to the nearest water source, carrying heavy buckets that left her hands calloused and her back aching. The water was often contaminated, but it was all her family had. Her children, Ana and Carlos, would sometimes miss school to help with this daily struggle, their dreams of becoming a teacher and doctor seeming impossibly distant.',
          middleText: 'But everything changed when our supporters stepped in. Thanks to your generous donations, we were able to build a well right in Maria\'s village. The transformation was immediate and profound. Maria\'s children no longer had to walk miles for water, and for the first time in their lives, they could focus entirely on their education. Ana now dreams of becoming a teacher, and Carlos is determined to become a doctor to help others in their community.',
          endText: 'Today, Maria\'s village has clean water for 200 families. Children are attending school regularly, and the community is thriving. Maria herself has become a water committee leader, teaching others about hygiene and maintenance. Your support didn\'t just change one family – it transformed an entire community.',
          stats: { label: 'Families Helped', value: '200', progress: 100 },
          buttonText: 'Follow Story'
        },
        '2': {
          title: 'Ahmed\'s Education',
          subtitle: 'Medical school sponsorship',
          heroText: 'Ahmed grew up in a refugee camp in Jordan, where education was a luxury few could afford. Despite his brilliant mind and determination to become a doctor, his family couldn\'t afford the school fees. He watched his dreams slip away as he worked odd jobs to help support his family, never giving up hope that one day he might be able to help others through medicine.',
          middleText: 'When our scholarship program reached Ahmed\'s camp, everything changed. Your donations made it possible for him to attend medical school, covering not just tuition but also books, supplies, and living expenses. For the first time in his life, Ahmed could focus entirely on his studies without worrying about how to pay for his education.',
          endText: 'Today, Ahmed is in his third year of medical school, maintaining top grades while volunteering at the camp clinic. He dreams of returning to his homeland as a doctor to help rebuild his community. Your support didn\'t just change one life – it created a ripple effect that will heal countless others.',
          stats: { label: 'Students Sponsored', value: '45', progress: 80 },
          buttonText: 'Follow Journey'
        },
        '3': {
          title: 'Sarah\'s Recovery',
          subtitle: 'Medical treatment and rehabilitation',
          heroText: 'Sarah was just 8 years old when she was diagnosed with a rare heart condition that required immediate surgery. Her family, already struggling to make ends meet, faced an impossible choice: watch their daughter suffer or find a way to pay for life-saving treatment that seemed completely out of reach.',
          middleText: 'Thanks to your generous support, Sarah received the surgery she desperately needed. The procedure was successful, but her journey was far from over. She needed months of rehabilitation, physical therapy, and ongoing medical care to fully recover and return to the active childhood she deserved.',
          endText: 'Today, Sarah is a healthy, happy 10-year-old who loves to dance and play soccer. She\'s back in school full-time and dreams of becoming a doctor herself one day. Her family is forever grateful for the second chance you gave their daughter, and Sarah\'s story continues to inspire others facing similar challenges.',
          stats: { label: 'Lives Saved', value: '127', progress: 90 },
          buttonText: 'Follow Recovery'
        }
      }
      return nonprofitStories[storyId as keyof typeof nonprofitStories] || nonprofitStories['1']
    }
  }

  useEffect(() => {
    // Check URL parameters and localStorage for audience type
    const urlParams = new URLSearchParams(window.location.search)
    const audienceParam = urlParams.get("audience") as 'nonprofit' | 'business'
    const storedAudience = localStorage.getItem("selectedAudience") as 'nonprofit' | 'business'

    if (audienceParam && ['nonprofit', 'business'].includes(audienceParam)) {
      setAudienceType(audienceParam)
      setDemoOrgId(audienceParam === 'business' ? 'demo-business-456' : 'demo-org-123')
    } else if (storedAudience && ['nonprofit', 'business'].includes(storedAudience)) {
      setAudienceType(storedAudience)
      setDemoOrgId(storedAudience === 'business' ? 'demo-business-456' : 'demo-org-123')
    }
  }, [])

  const getContent = () => {
    if (audienceType === 'business') {
      return {
        heroTitle: "See How Your Customers Will Experience Your Products",
        heroSubtitle: "Watch how customers search NMBRs to discover the stories behind your products and make more meaningful purchases.",
        widgetTitle: "Try Our Product Story Widget",
        widgetDescription: "This is exactly what your customers will see when they search NMBRs on your website.",
        searchLabel: "Search for a product story by number:",
        searchPlaceholder: "Try: 1, 2, or 3",
        stories: [
          { id: "1", title: "Ethiopian Coffee", icon: Coffee, description: "Handcrafted by the Tesfaye family" },
          { id: "2", title: "Bamboo Phone Case", icon: ShoppingBag, description: "Made by artisans in Vietnam" },
          { id: "3", title: "Ceramic Dinnerware", icon: Palette, description: "Created by Elena Rodriguez" },
        ],
        benefits: [
          "3x higher customer engagement",
          "40% increase in repeat purchases",
          "25% higher average order value"
        ],
        pricing: {
          diy: { price: "$99", fee: "2%", features: ["Custom widget", "Full control", "API access"] },
          marketplace: { price: "$199", fee: "1%", features: ["Pre-built solutions", "Quick setup", "Dedicated support"] }
        }
      }
    } else {
      return {
        heroTitle: "See How Your Donors Will Experience Your Impact",
        heroSubtitle: "Watch how donors search NMBRs to connect with the people they're helping and make more meaningful donations.",
        widgetTitle: "Try Our Impact Story Widget",
        widgetDescription: "This is exactly what your donors will see when they search NMBRs on your website.",
        searchLabel: "Search for an impact story by number:",
        searchPlaceholder: "Try: 1, 2, or 3",
        stories: [
          { id: "1", title: "Maria's Water Well", icon: Heart, description: "Clean water for 200 families" },
          { id: "2", title: "Ahmed's Education", icon: Users, description: "Medical school sponsorship" },
          { id: "3", title: "Sarah's Treatment", icon: Target, description: "Cancer treatment support" },
        ],
        benefits: [
          "5x higher donor retention",
          "60% increase in average donation",
          "3x more social sharing"
        ],
        pricing: {
          diy: { price: "$99", fee: "2%", features: ["Custom widget", "Full control", "API access"] },
          marketplace: { price: "$199", fee: "1%", features: ["Pre-built solutions", "Quick setup", "Dedicated support"] }
        }
      }
    }
  }

  const content = getContent()

  const handleStorySearch = (storyId: string) => {
    setSelectedStory(storyId)
    setWidgetStoryId(storyId)
    setShowWidget(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-base sm:text-lg">N</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">#</span>
                </div>
              </div>
              <span className="text-lg sm:text-2xl font-bold text-slate-900 hidden xs:block">The NMBR</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {/* Audience Selector */}
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => {
                    setAudienceType("nonprofit")
                    setDemoOrgId("demo-org-123")
                    localStorage.setItem("selectedAudience", "nonprofit")
                  }}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                    audienceType === "nonprofit"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Nonprofits
                </button>
                <button
                  onClick={() => {
                    setAudienceType("business")
                    setDemoOrgId("demo-business-456")
                    localStorage.setItem("selectedAudience", "business")
                  }}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                    audienceType === "business"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Businesses
                </button>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link href="/login">
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hidden sm:inline-flex">
                    Sign In
                  </Button>
                </Link>
                <Link href={`/signup?audience=${audienceType}`}>
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg text-sm sm:text-base px-3 sm:px-4">
                    <span className="hidden sm:inline">Get Started</span>
                    <span className="sm:hidden">Start</span>
                    <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 mb-8">
              <Play className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Live Interactive Demo</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6">
              {content.heroTitle}
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
              {content.heroSubtitle}
            </p>
          </div>

          {/* Demo Widget Section */}
          <Card className="mb-12 border-emerald-200 shadow-lg bg-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
                <Hash className="w-6 h-6 text-emerald-600" />
                {content.widgetTitle}
              </CardTitle>
              <CardDescription className="text-slate-600 text-base">
                {content.widgetDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search Interface */}
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
                <div className="mb-4">
                  <Label htmlFor="demo-search" className="text-sm font-medium text-slate-700 mb-2 block">
                    {content.searchLabel}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="demo-search"
                      placeholder={content.searchPlaceholder}
                      className="flex-1 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          const value = (e.target as HTMLInputElement).value
                          if (value === "1" || value === "2" || value === "3") {
                            handleStorySearch(value)
                          }
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        const input = document.getElementById("demo-search") as HTMLInputElement
                        const value = input.value
                        if (value === "1" || value === "2" || value === "3") {
                          handleStorySearch(value)
                        }
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Find Story
                    </Button>
                  </div>
                </div>

                {/* Story Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {content.stories.map((story) => (
                    <Button
                      key={story.id}
                      variant="outline"
                      className="h-16 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 bg-transparent"
                      onClick={() => handleStorySearch(story.id)}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <story.icon className="w-5 h-5" />
                        <div className="text-center">
                          <div className="font-medium">{story.title}</div>
                          <div className="text-xs text-slate-500">{story.description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-emerald-50 rounded-lg p-4">
                <h4 className="font-semibold text-emerald-900 mb-3">Why This Works</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  {content.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card className="mb-12 border-slate-200 shadow-lg bg-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
                <Settings className="w-6 h-6 text-slate-600" />
                How It Works
              </CardTitle>
              <CardDescription className="text-slate-600 text-base">
              {audienceType === 'business' 
                ? "Three simple steps to give your products unique NMBRs and compelling stories that drive sales."
                : "Three simple steps to give your donations unique NMBRs and personal connections that increase giving."
              }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Code className="w-8 h-8 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">1. Create Stories</h3>
                  <p className="text-slate-600 text-sm">
                    {audienceType === 'business' 
                      ? "Upload product photos and write compelling stories about the people, process, or impact behind each item."
                      : "Upload photos and write compelling stories about the people or causes donors will help."
                    }
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Hash className="w-8 h-8 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">2. Generate NMBRs</h3>
                  <p className="text-slate-600 text-sm">
                    {audienceType === 'business' 
                      ? "Get unique numbers (NMBRs) for each product. Add them to your existing packaging, hang tags, or product displays."
                      : "Get unique numbers (NMBRs) for each story. Add them to your existing donation cards, bracelets, or promotional materials."
                    }
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">3. Embed Widget</h3>
                  <p className="text-slate-600 text-sm">
                    {audienceType === 'business' 
                      ? "Add our widget to your website. Customers search NMBRs to discover stories and make purchases."
                      : "Add our widget to your website. Donors search NMBRs to follow stories and make donations."
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="mb-12 border-slate-200 shadow-lg bg-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
                <DollarSign className="w-6 h-6 text-slate-600" />
                Simple, Transparent Pricing
              </CardTitle>
              <CardDescription className="text-slate-600 text-base">
                Choose the plan that works best for your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* DIY Plan */}
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Code className="w-6 h-6 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">DIY Integration</h3>
                    <p className="text-slate-600 text-sm">I have a website and want to add this myself</p>
                  </div>
                  
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-slate-900 mb-2">{content.pricing.diy.price}<span className="text-lg text-slate-600">/month</span></div>
                    <div className="text-slate-600 mb-4">+ {content.pricing.diy.fee} transaction fee</div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {content.pricing.diy.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link href={`/signup?audience=${audienceType}&plan=diy`}>
                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                      Start Free Trial
                    </Button>
                  </Link>
                </Card>

                {/* Marketplace Plan */}
                <Card className="p-6 hover:shadow-lg transition-shadow border-2 border-emerald-200">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Store className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Marketplace Solutions</h3>
                    <p className="text-slate-600 text-sm">I want a ready-made solution</p>
                    <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-2 py-1 rounded-full mt-2">
                      <Star className="w-3 h-3" />
                      Most Popular
                    </div>
                  </div>
                  
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-slate-900 mb-2">{content.pricing.marketplace.price}<span className="text-lg text-slate-600">/month</span></div>
                    <div className="text-slate-600 mb-4">+ {content.pricing.marketplace.fee} transaction fee</div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {content.pricing.marketplace.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link href={`/signup?audience=${audienceType}&plan=marketplace`}>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                      Get Started
                    </Button>
                  </Link>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="border-slate-200 shadow-lg bg-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
                <Star className="w-6 h-6 text-emerald-600" />
                Ready to Get Started?
              </CardTitle>
              <CardDescription className="text-slate-600 text-base">
                {audienceType === 'business' 
                  ? "Join hundreds of businesses creating deeper connections with their customers through authentic storytelling."
                  : "Join hundreds of nonprofits creating deeper connections with their donors through personal impact stories."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={`/signup?audience=${audienceType}`}>
                  <Button
                    size="lg"
                    className="bg-slate-900 hover:bg-slate-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-8 py-4 text-lg font-semibold"
                  >
                    <Gift className="w-5 h-5 mr-2" />
                    Start Your Free Trial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-slate-300 text-slate-600 hover:bg-slate-50 bg-transparent transition-all duration-300 px-8 py-4 text-lg"
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    Back to Homepage
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="bg-slate-50 border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center space-x-2 mb-4 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-lg font-bold text-slate-900">The NMBR</span>
          </Link>
          <p className="text-sm text-slate-600 mb-6">
            {audienceType === 'business' 
              ? "Turn every product into a personal story that customers can follow."
              : "Turn every donation into a personal connection that donors can follow."
            }
          </p>
        </div>
      </footer>

      {/* Widget Popup */}
      {showWidget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">
                  {content.widgetTitle}
                </h3>
                <button
                  onClick={() => setShowWidget(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-slate-600 mt-2">
                {content.widgetDescription}
              </p>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {/* Widget Content */}
              <div className="bg-slate-50 rounded-xl p-6 mb-6">
                <div className="text-center mb-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">
                    {audienceType === 'business' ? 'Product Story' : 'Impact Story'}
                  </h4>
                  <p className="text-slate-600">
                    {audienceType === 'business' 
                      ? 'This is what your customer sees when they search a NMBR'
                      : 'This is what your donor sees when they search a NMBR'
                    }
                  </p>
                </div>
                
                {/* Story Display */}
                <div className="bg-white rounded-lg overflow-hidden border border-slate-200">
                  {/* Hero Image */}
                  <div className="relative h-48 bg-gradient-to-r from-slate-100 to-slate-200">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          {audienceType === 'business' ? (
                            <Coffee className="w-8 h-8" />
                          ) : (
                            <Heart className="w-8 h-8" />
                          )}
                        </div>
                        <h5 className="text-xl font-bold">
                          {widgetStoryId ? getStoryContent(widgetStoryId).title : (audienceType === 'business' ? 'Ethiopian Coffee' : 'Maria\'s Water Well')}
                        </h5>
                        <p className="text-sm opacity-90">
                          {widgetStoryId ? getStoryContent(widgetStoryId).subtitle : (audienceType === 'business' 
                            ? 'Handcrafted by the Tesfaye family'
                            : 'Clean water for 200 families'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Story Content */}
                  <div className="p-6">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-slate-700 leading-relaxed mb-4">
                        {widgetStoryId ? getStoryContent(widgetStoryId).heroText : (audienceType === 'business' 
                          ? 'Meet the Tesfaye family from the highlands of Ethiopia. For three generations, they\'ve been perfecting the art of coffee cultivation. Each bean is hand-picked at the peak of ripeness, sun-dried on traditional raised beds, and roasted in small batches to bring you the most authentic Ethiopian coffee experience. But behind every cup lies a story of struggle, determination, and hope that most coffee drinkers never see.'
                          : 'Maria lives in a small village in Guatemala where clean water was once a luxury. Every morning, she would wake before dawn to walk three miles to the nearest water source, carrying heavy buckets that left her hands calloused and her back aching. The water was often contaminated, but it was all her family had. Her children, Ana and Carlos, would sometimes miss school to help with this daily struggle, their dreams of becoming a teacher and doctor seeming impossibly distant.'
                        )}
                      </p>
                      
                      {/* Value Prop Callout 1 */}
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded-r-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <TrendingUp className="w-3 h-3 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-900 mb-1">
                              {audienceType === 'business' ? 'Customer Journey Analytics' : 'Real-time Impact Tracking'}
                            </p>
                            <p className="text-xs text-blue-700">
                              {audienceType === 'business' 
                                ? 'Track how customers engage with your product stories and optimize for higher conversion rates.'
                                : 'See exactly how your support transforms lives with detailed progress updates and photos.'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-slate-700 leading-relaxed mb-4">
                        {widgetStoryId ? getStoryContent(widgetStoryId).middleText : (audienceType === 'business' 
                          ? 'But everything changed when we partnered with local cooperatives to source directly from families like the Tesfayes. Now, every cup you drink tells their story of resilience, tradition, and hope. The family has been able to invest in better equipment, send their children to school, and build a sustainable future for their community.'
                          : 'But everything changed when our supporters stepped in. Thanks to your generous donations, we were able to build a well right in Maria\'s village. The transformation was immediate and profound. Maria\'s children no longer had to walk miles for water, and for the first time in their lives, they could focus entirely on their education. Ana now dreams of becoming a teacher, and Carlos is determined to become a doctor to help others in their community.'
                        )}
                      </p>
                      
                      {/* Value Prop Callout 2 */}
                      <div className="bg-green-50 border-l-4 border-green-400 p-4 my-4 rounded-r-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <MessageSquare className="w-3 h-3 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-900 mb-1">AI-Powered Storytelling</p>
                            <p className="text-xs text-green-700">
                              {audienceType === 'business' 
                                ? 'Our AI helps you craft compelling product narratives that drive sales and build brand loyalty.'
                                : 'Our AI helps you craft compelling narratives that connect emotionally with your audience.'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-slate-700 leading-relaxed mb-4">
                        {widgetStoryId ? getStoryContent(widgetStoryId).endText : (audienceType === 'business' 
                          ? 'Today, the Tesfaye family\'s coffee is enjoyed by thousands of coffee lovers worldwide. Each purchase directly supports their family and community, creating a ripple effect of positive change. When you choose our coffee, you\'re not just buying a product – you\'re becoming part of their story.'
                          : 'Today, Maria\'s village has clean water for 200 families. Children are attending school regularly, and the community is thriving. Maria herself has become a water committee leader, teaching others about hygiene and maintenance. Your support didn\'t just change one family – it transformed an entire community.'
                        )}
                      </p>
                      
                      {/* Value Prop Callout 3 */}
                      <div className="bg-purple-50 border-l-4 border-purple-400 p-4 my-4 rounded-r-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Users className="w-3 h-3 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-purple-900 mb-1">
                              {audienceType === 'business' ? 'Customer Engagement Tools' : 'Engagement Analytics'}
                            </p>
                            <p className="text-xs text-purple-700">
                              {audienceType === 'business' 
                                ? 'Build a community of loyal customers through newsletters, product updates, and exclusive offers.'
                                : 'Track how supporters engage with stories and optimize for maximum impact and donations.'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress/Stats */}
                      <div className="bg-slate-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">
                            {widgetStoryId ? getStoryContent(widgetStoryId).stats.label : (audienceType === 'business' ? 'Coffee Club Members' : 'Families Helped')}
                          </span>
                          <span className="font-bold text-slate-900">
                            {widgetStoryId ? getStoryContent(widgetStoryId).stats.value : (audienceType === 'business' ? '1,247' : '200')}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                          <div className={`h-2 rounded-full ${
                            audienceType === 'business' ? 'bg-blue-500' : 'bg-rose-500'
                          }`} style={{width: `${widgetStoryId ? getStoryContent(widgetStoryId).stats.progress : 75}%`}}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          NMBR {widgetStoryId}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {audienceType === 'business' ? 'Product Story' : 'Impact Story'}
                        </span>
                      </div>
                      <Button size="sm" className="text-xs">
                        {widgetStoryId ? getStoryContent(widgetStoryId).buttonText : (audienceType === 'business' ? 'Join Coffee Club' : 'Follow Story')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* What We Offer */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    This is just the beginning. Here's what we provide:
                  </h4>
                  <p className="text-slate-600">
                    {audienceType === 'business' 
                      ? 'Complete customer engagement and analytics platform'
                      : 'Complete donor engagement and impact tracking platform'
                    }
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                      </div>
                      <h5 className="font-semibold text-slate-900">Analytics & Insights</h5>
                    </div>
                    <p className="text-sm text-slate-600">
                      Track engagement, conversion rates, and {audienceType === 'business' ? 'customer lifetime value' : 'donor retention'} with detailed analytics.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-green-600" />
                      </div>
                      <h5 className="font-semibold text-slate-900">AI Newsletter Builder</h5>
                    </div>
                    <p className="text-sm text-slate-600">
                      AI-powered newsletter builder with templates, automation, and {audienceType === 'business' ? 'product promotion' : 'donation appeals'}.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-purple-600" />
                      </div>
                      <h5 className="font-semibold text-slate-900">Engagement Tracking</h5>
                    </div>
                    <p className="text-sm text-slate-600">
                      Monitor how {audienceType === 'business' ? 'customers' : 'donors'} interact with stories and optimize for better engagement.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-orange-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Target className="w-4 h-4 text-orange-600" />
                      </div>
                      <h5 className="font-semibold text-slate-900">Conversion Tools</h5>
                    </div>
                    <p className="text-sm text-slate-600">
                      Built-in {audienceType === 'business' ? 'e-commerce and subscription' : 'donation and recurring giving'} tools to convert engagement into action.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-red-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-4 h-4 text-red-600" />
                      </div>
                      <h5 className="font-semibold text-slate-900">Mobile-First Widgets</h5>
                    </div>
                    <p className="text-sm text-slate-600">
                      Responsive widgets that work perfectly on any device, ensuring maximum engagement from mobile users.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-indigo-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Hash className="w-4 h-4 text-indigo-600" />
                      </div>
                      <h5 className="font-semibold text-slate-900">Physical Integration</h5>
                    </div>
                    <p className="text-sm text-slate-600">
                      {audienceType === 'business' 
                        ? 'Add NMBRs to your existing packaging, business cards, and promotional materials to drive traffic to your stories.'
                        : 'Add NMBRs to your existing donation cards, bracelets, and promotional materials to connect donors to impact stories.'
                      }
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-cyan-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <Settings className="w-4 h-4 text-cyan-600" />
                      </div>
                      <h5 className="font-semibold text-slate-900">Custom Branding</h5>
                    </div>
                    <p className="text-sm text-slate-600">
                      Fully customizable widgets that match your brand colors, fonts, and style to maintain brand consistency.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-pink-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-4 h-4 text-pink-600" />
                      </div>
                      <h5 className="font-semibold text-slate-900">Multi-Language Support</h5>
                    </div>
                    <p className="text-sm text-slate-600">
                      Reach global audiences with automatic translation and localization for stories and newsletters.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-4 h-4 text-yellow-600" />
                      </div>
                      <h5 className="font-semibold text-slate-900">Enterprise Security</h5>
                    </div>
                    <p className="text-sm text-slate-600">
                      Bank-level security, GDPR compliance, and data protection to keep your {audienceType === 'business' ? 'customer' : 'donor'} information safe.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1">
                  <Link href={`/signup?audience=${audienceType}`}>
                    Start Your Free Trial
                  </Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/contact">
                    Get Pricing Info
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}