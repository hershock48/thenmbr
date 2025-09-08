"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Heart,
  Users,
  BarChart3,
  ArrowRight,
  Shield,
  Zap,
  Sparkles,
  Target,
  LogOut,
  ShoppingCart,
  Building2,
  Handshake,
  TrendingUp,
  QrCode,
  Smartphone,
  Globe,
  CheckCircle,
  DollarSign,
  Clock,
  Code,
  Store,
  Coffee,
  Hash,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

type AudienceType = "nonprofit" | "business"

export default function HomePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [selectedAudience, setSelectedAudience] = useState<AudienceType>("nonprofit")

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const audienceParam = urlParams.get("audience") as AudienceType
    const storedAudience = localStorage.getItem("selectedAudience") as AudienceType

    if (audienceParam && ["nonprofit", "business"].includes(audienceParam)) {
      setSelectedAudience(audienceParam)
      localStorage.setItem("selectedAudience", audienceParam)
    } else if (storedAudience && ["nonprofit", "business"].includes(storedAudience)) {
      setSelectedAudience(storedAudience)
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const getAudienceContent = () => {
    if (selectedAudience === "business") {
      return {
        heroTitle: "Turn Every Product Into a",
        heroHighlight: "Personal Story",
        heroSubtitle: "Give every product a unique number. Customers search that number to discover the story behind it and make more meaningful purchases.",
        primaryCta: "Start Free Trial",
        secondaryCta: "See How It Works",
        icon: ShoppingCart,
        color: "blue",
        examples: [
          {
            title: "Artisan Coffee",
            description: "Customer searches NMBR 001 → Follows farmer's journey → Subscribes to coffee club",
            icon: Coffee,
          },
          {
            title: "Sustainable Fashion",
            description: "Customer searches NMBR 002 → Learns about materials → Gets notified of new collections",
            icon: Sparkles,
          },
          {
            title: "Handmade Ceramics",
            description: "Customer searches NMBR 003 → Meets the artist → Pre-orders limited edition pieces",
            icon: Target,
          },
        ],
        benefits: [
          "3x higher customer engagement",
          "40% increase in repeat purchases", 
          "25% higher average order value"
        ],
        storytellingTypes: [
          {
            type: "Factual Stories",
            description: "Real stories about your farmers, artisans, or manufacturing process",
            examples: ["Meet the Ethiopian farmer who grows your coffee", "See how our ceramics are hand-thrown", "Follow our sustainable material sourcing"]
          },
          {
            type: "Fictional Stories", 
            description: "Creative narratives that build brand mythology",
            examples: ["Adventure series featuring your products", "Comic strips about your brand characters", "Fantasy stories that showcase your values"]
          }
        ]
      }
    } else {
      return {
        heroTitle: "Turn Every Donation Into a",
        heroHighlight: "Personal Connection",
        heroSubtitle: "Give every donation a unique number. Donors search that number to follow the specific person or cause they're helping and see real impact.",
        primaryCta: "Start Free Trial",
        secondaryCta: "See How It Works",
        icon: Heart,
        color: "rose",
        examples: [
          {
            title: "Clean Water Project",
            description: "Donor searches NMBR 001 → Follows Maria's journey → Donates more",
            icon: Heart,
          },
          {
            title: "Education Fund",
            description: "Donor searches NMBR 002 → Tracks student progress → Feels connected",
            icon: Users,
          },
          {
            title: "Medical Support",
            description: "Donor searches NMBR 003 → Sees patient recovery → Shares story",
            icon: Target,
          },
        ],
        benefits: [
          "5x higher donor retention",
          "60% increase in average donation",
          "3x more social sharing"
        ],
        storytellingTypes: [
          {
            type: "Impact Stories",
            description: "Real stories about the people and communities you help",
            examples: ["Follow Maria's journey to clean water", "See how Ahmed's education is progressing", "Watch Sarah's recovery story unfold"]
          },
          {
            type: "Mission Stories", 
            description: "Narratives that explain your cause and inspire action",
            examples: ["Why we fight for clean water", "The science behind our medical research", "How your donation creates lasting change"]
          }
        ]
      }
    }
  }

  const content = getAudienceContent()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
                    setSelectedAudience("nonprofit")
                    localStorage.setItem("selectedAudience", "nonprofit")
                  }}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                    selectedAudience === "nonprofit"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Nonprofits
                </button>
                <button
                  onClick={() => {
                    setSelectedAudience("business")
                    localStorage.setItem("selectedAudience", "business")
                  }}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                    selectedAudience === "business"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Businesses
                </button>
              </div>

              {user ? (
                <div className="flex items-center space-x-2">
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <Link href="/login">
                    <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hidden sm:inline-flex">
                      Sign In
                    </Button>
                  </Link>
                  <Link href={`/signup?audience=${selectedAudience}`}>
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg text-sm sm:text-base px-3 sm:px-4">
                      <span className="hidden sm:inline">Get Started</span>
                      <span className="sm:hidden">Start</span>
                      <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 mb-8">
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">
                {selectedAudience === "business" 
                  ? "Trusted by 200+ businesses worldwide" 
                  : "Trusted by 500+ nonprofits worldwide"
                }
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6">
              {content.heroTitle}
              <span className={`block ${content.color === "blue" ? "text-blue-600" : "text-rose-600"}`}>
                {content.heroHighlight}
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
              {selectedAudience === 'business' 
                ? "We provide the software to track numbers and tell stories. Add NMBRs to your existing products or buy from our marketplace. Customers search those numbers to discover the story behind your products."
                : "We provide the software to track numbers and tell stories. Add NMBRs to your existing materials or buy from our marketplace. Donors search those numbers to follow the specific person or cause they're helping."
              }
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href={`/signup?audience=${selectedAudience}`}>
                <Button
                  size="lg"
                  className={`${
                    content.color === "blue"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-rose-600 hover:bg-rose-700"
                  } text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-8 py-4 text-lg font-semibold`}
                >
                  <content.icon className="w-5 h-5 mr-2" />
                  {content.primaryCta}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href={`/demo?audience=${selectedAudience}`}>
                <Button
                  variant="outline"
                  size="lg"
                  className={`border-2 ${
                    content.color === "blue"
                      ? "border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
                      : "border-rose-300 text-rose-700 hover:bg-rose-50 hover:border-rose-400"
                  } transition-all duration-300 px-8 py-4 text-lg bg-transparent`}
                >
                  <Target className="w-5 h-5 mr-2" />
                  {content.secondaryCta}
                </Button>
              </Link>
            </div>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
              {content.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Storytelling Types Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Two Ways to Tell Your Story
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {selectedAudience === 'business' 
                ? "Whether you want to share real stories about your process or create engaging fictional content, we give you the tools to build lasting customer relationships."
                : "Whether you want to share real impact stories or explain your mission, we give you the tools to build lasting donor relationships."
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.storytellingTypes.map((storyType, index) => (
              <Card key={index} className="p-8">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                    {storyType.type}
                  </CardTitle>
                  <CardDescription className="text-lg text-slate-600">
                    {storyType.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {storyType.examples.map((example, exampleIndex) => (
                      <div key={exampleIndex} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          content.color === "blue" ? "bg-blue-500" : "bg-rose-500"
                        }`} />
                        <p className="text-slate-700">{example}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {selectedAudience === "business" 
                ? "Three simple steps to give your products unique numbers and compelling stories"
                : "Three simple steps to give your donations unique numbers and personal connections"
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className={`w-16 h-16 ${
                content.color === "blue" ? "bg-blue-100" : "bg-rose-100"
              } rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <Code className={`w-8 h-8 ${
                  content.color === "blue" ? "text-blue-600" : "text-rose-600"
                }`} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">1. Create Stories</h3>
              <p className="text-slate-600">
                {selectedAudience === "business" 
                  ? "Upload product photos and write compelling stories about the people, process, or impact behind each item."
                  : "Upload photos and write compelling stories about the people or causes donors will help."
                }
              </p>
            </div>

            <div className="text-center">
              <div className={`w-16 h-16 ${
                content.color === "blue" ? "bg-blue-100" : "bg-rose-100"
              } rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <Hash className={`w-8 h-8 ${
                  content.color === "blue" ? "text-blue-600" : "text-rose-600"
                }`} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">2. Generate NMBRs</h3>
              <p className="text-slate-600">
                {selectedAudience === "business" 
                  ? "Get unique numbers (NMBRs) for each product. Add them to your existing packaging, hang tags, or product displays."
                  : "Get unique numbers (NMBRs) for each story. Add them to your existing donation cards, bracelets, or promotional materials."
                }
              </p>
            </div>

            <div className="text-center">
              <div className={`w-16 h-16 ${
                content.color === "blue" ? "bg-blue-100" : "bg-rose-100"
              } rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <Globe className={`w-8 h-8 ${
                  content.color === "blue" ? "text-blue-600" : "text-rose-600"
                }`} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">3. Embed Widget</h3>
              <p className="text-slate-600">
                {selectedAudience === "business" 
                  ? "Add our widget to your website. Customers search NMBRs to discover stories and make purchases."
                  : "Add our widget to your website. Donors search NMBRs to follow stories and make donations."
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Examples */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Real Examples
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {selectedAudience === "business" 
                ? "See how businesses are using stories to increase sales and customer loyalty"
                : "See how nonprofits are using stories to increase donations and donor retention"
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.examples.map((example, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 ${
                    content.color === "blue" ? "bg-blue-100" : "bg-rose-100"
                  } rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <example.icon className={`w-6 h-6 ${
                      content.color === "blue" ? "text-blue-600" : "text-rose-600"
                    }`} />
                  </div>
                  <CardTitle className="text-lg">{example.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{example.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Options */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Choose Your Integration
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Two ways to get started - pick what works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* DIY Integration */}
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">DIY Integration</h3>
                <p className="text-slate-600">I have a website and want to add this myself</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>Custom widget for your website</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>Full control over design and branding</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>Advanced analytics and reporting</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>API access for custom integrations</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 mb-2">$99/month</div>
                <div className="text-slate-600 mb-4">+ 2% transaction fee</div>
                <Link href={`/signup?audience=${selectedAudience}&plan=diy`}>
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Marketplace */}
            <Card className="p-8 hover:shadow-lg transition-shadow border-2 border-emerald-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Store className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Marketplace Solutions</h3>
                <p className="text-slate-600">I want a ready-made solution</p>
                <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-sm font-medium px-3 py-1 rounded-full mt-2">
                  <Sparkles className="w-4 h-4" />
                  Most Popular
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>Pre-built widgets and templates</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>Quick setup in minutes</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>No technical knowledge required</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>Dedicated support and onboarding</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 mb-2">$199/month</div>
                <div className="text-slate-600 mb-4">+ 1% transaction fee</div>
                <Link href={`/signup?audience=${selectedAudience}&plan=marketplace`}>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 ${
        content.color === "blue" 
          ? "bg-gradient-to-br from-blue-50 to-indigo-100" 
          : "bg-gradient-to-br from-rose-50 to-pink-100"
      }`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            {selectedAudience === "business" 
              ? "Join hundreds of businesses creating deeper connections with their customers through authentic storytelling."
              : "Join hundreds of nonprofits creating deeper connections with their donors through personal impact stories."
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/signup?audience=${selectedAudience}`}>
              <Button
                size="lg"
                className={`${
                  content.color === "blue"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-rose-600 hover:bg-rose-700"
                } text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-8 py-4 text-lg font-semibold`}
              >
                <content.icon className="w-5 h-5 mr-2" />
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href={`/demo?audience=${selectedAudience}`}>
              <Button
                variant="outline"
                size="lg"
                className={`border-2 ${
                  content.color === "blue"
                    ? "border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
                    : "border-rose-300 text-rose-700 hover:bg-rose-50 hover:border-rose-400"
                } transition-all duration-300 px-8 py-4 text-lg bg-transparent`}
              >
                <Target className="w-5 h-5 mr-2" />
                See Live Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-slate-900 font-bold text-sm">N</span>
                </div>
                <span className="text-lg font-bold">The NMBR</span>
              </div>
              <p className="text-slate-400 text-sm">
                {selectedAudience === "business" 
                  ? "Turn every product into a personal story that customers can follow."
                  : "Turn every donation into a personal connection that donors can follow."
                }
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-white transition-colors">Demo</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/api-docs" className="hover:text-white transition-colors">API Docs</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 The NMBR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}