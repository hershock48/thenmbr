"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

type AudienceType = "nonprofit" | "grassroots" | "business"

interface AudienceContent {
  badge: string
  headline: string
  subheadline: string
  description: string
  primaryCta: string
  secondaryCta: string
  icon: any
  color: string
  features: {
    title: string
    description: string
    icon: any
  }[]
}

const audienceContent: Record<AudienceType, AudienceContent> = {
  nonprofit: {
    badge: "Trusted by 500+ nonprofits worldwide",
    headline: "Turn Every Donation Into a",
    subheadline: "Personal Connection",
    description:
      "Give your donors real stories to follow and champion. Watch donations increase when supporters see exactly who they're helping.",
    primaryCta: "Start Free Trial",
    secondaryCta: "See Demo",
    icon: Heart,
    color: "text-rose-600",
    features: [
      {
        title: "Personal Impact Stories",
        description: "Connect donors directly to the people they help with numbered, trackable stories.",
        icon: Heart,
      },
      {
        title: "Donation Analytics",
        description: "Track which stories drive the most engagement and donations.",
        icon: BarChart3,
      },
      {
        title: "Donor Retention Tools",
        description: "Keep supporters engaged with ongoing story updates and impact reports.",
        icon: Target,
      },
    ],
  },
  grassroots: {
    badge: "Empowering 300+ grassroots projects globally",
    headline: "Transform Community Projects Into",
    subheadline: "Compelling Stories",
    description:
      "Build stronger community support through authentic storytelling that connects supporters to local impact.",
    primaryCta: "Launch Project",
    secondaryCta: "View Examples",
    icon: Users,
    color: "text-emerald-600",
    features: [
      {
        title: "Community Storytelling",
        description: "Share authentic project stories that resonate with local supporters.",
        icon: Users,
      },
      {
        title: "Progress Tracking",
        description: "Keep supporters updated on project milestones and community impact.",
        icon: Target,
      },
      {
        title: "Supporter Insights",
        description: "Understand your community better with engagement analytics.",
        icon: BarChart3,
      },
    ],
  },
  business: {
    badge: "Chosen by 200+ forward-thinking businesses",
    headline: "Connect Customers to Your",
    subheadline: "Brand's True Impact",
    description: "Build customer loyalty through transparent storytelling about your products and social impact.",
    primaryCta: "Start Storytelling",
    secondaryCta: "See Examples",
    icon: Building2,
    color: "text-blue-600",
    features: [
      {
        title: "Brand Impact Stories",
        description: "Showcase your company's authentic social and environmental impact.",
        icon: Sparkles,
      },
      {
        title: "Customer Engagement",
        description: "Build deeper relationships through transparent impact storytelling.",
        icon: Handshake,
      },
      {
        title: "ROI Tracking",
        description: "Measure the business impact of your storytelling efforts.",
        icon: TrendingUp,
      },
    ],
  },
}

const audienceOrganizations: Record<AudienceType, string[]> = {
  nonprofit: ["WaterAid", "UNICEF", "Red Cross", "Doctors Without Borders"],
  grassroots: ["Community Gardens Network", "Local Food Co-op", "Neighborhood Watch", "Youth Sports League"],
  business: ["Patagonia", "Ben & Jerry's", "TOMS Shoes", "Warby Parker"],
}

export default function HomePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [selectedAudience, setSelectedAudience] = useState<AudienceType>("nonprofit")

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const audienceParam = urlParams.get("audience") as AudienceType
    const storedAudience = localStorage.getItem("selectedAudience") as AudienceType

    if (audienceParam && ["nonprofit", "grassroots", "business"].includes(audienceParam)) {
      setSelectedAudience(audienceParam)
      localStorage.setItem("selectedAudience", audienceParam)
    } else if (storedAudience && ["nonprofit", "grassroots", "business"].includes(storedAudience)) {
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

  const currentContent = audienceContent[selectedAudience]
  const currentOrganizations = audienceOrganizations[selectedAudience]
  const IconComponent = currentContent.icon

  const getAudienceColors = (audience: AudienceType) => {
    switch (audience) {
      case "nonprofit":
        return {
          gradient: "from-rose-600 to-rose-700",
          gradientHover: "from-rose-700 to-rose-800",
          tabSelected: "bg-rose-600",
          sectionBg: "from-rose-600 to-rose-700",
          hashColor: "bg-rose-600",
        }
      case "business":
        return {
          gradient: "from-blue-600 to-blue-700",
          gradientHover: "from-blue-700 to-blue-800",
          tabSelected: "bg-blue-600",
          sectionBg: "from-blue-600 to-blue-700",
          hashColor: "bg-blue-600",
        }
      default:
        return {
          gradient: "from-emerald-600 to-emerald-700",
          gradientHover: "from-emerald-700 to-emerald-800",
          tabSelected: "bg-emerald-600",
          sectionBg: "from-emerald-600 to-emerald-700",
          hashColor: "bg-emerald-600",
        }
    }
  }

  const colors = getAudienceColors(selectedAudience)

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-base sm:text-lg">N</span>
                </div>
                <div
                  className={`absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 ${colors.hashColor} rounded-full flex items-center justify-center`}
                >
                  <span className="text-white font-bold text-xs">#</span>
                </div>
              </div>
              <span className="text-lg sm:text-2xl font-bold text-slate-900 hidden xs:block">The NMBR</span>
            </Link>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link href="/select-org">
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg">
                      Dashboard
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className="text-slate-600 hover:text-slate-900 hidden sm:inline-flex"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hidden sm:inline-flex">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg">
                      Get Started
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-4">
            <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200">
              {Object.entries(audienceContent)
                .filter(([key]) => key !== "grassroots")
                .map(([key, content]) => {
                  const audienceKey = key as AudienceType
                  const isSelected = selectedAudience === audienceKey
                  const tabColors = getAudienceColors(audienceKey)
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedAudience(audienceKey)
                        localStorage.setItem("selectedAudience", audienceKey)
                      }}
                      className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        isSelected
                          ? `${tabColors.tabSelected} text-white shadow-sm`
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {audienceKey === "nonprofit"
                        ? "Nonprofits"
                        : audienceKey === "grassroots"
                          ? "Grassroots"
                          : "Businesses"}
                    </button>
                  )
                })}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white"></div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 mb-8">
            <IconComponent className={`w-4 h-4 ${currentContent.color}`} />
            <span className="text-sm font-medium text-slate-700">{currentContent.badge}</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-slate-900">
              {currentContent.headline}
              <span className={`block bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                {currentContent.subheadline}
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">{currentContent.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
            <Link href="/signup">
              <Button
                size="lg"
                className={`bg-gradient-to-r ${colors.gradient} hover:${colors.gradientHover} text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-8 py-4 text-lg`}
              >
                <IconComponent className="w-5 h-5 mr-2" />
                {currentContent.primaryCta}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 px-8 py-4 text-lg bg-transparent"
              >
                <Target className="w-5 h-5 mr-2" />
                {currentContent.secondaryCta}
              </Button>
            </Link>
          </div>

          <div className="mt-16">
            <p className="text-sm text-slate-500 mb-6">Trusted by amazing organizations</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
              {currentOrganizations.map((org, index) => {
                const colors = ["text-cyan-600", "text-purple-600", "text-red-600", "text-green-600"]
                return (
                  <div key={index} className={`text-2xl font-bold ${colors[index % colors.length]}`}>
                    {org}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything You Need</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful tools designed for{" "}
              {selectedAudience === "nonprofit"
                ? "nonprofits"
                : selectedAudience === "grassroots"
                  ? "grassroots organizations"
                  : "businesses"}{" "}
              who want meaningful connections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentContent.features.map((feature, index) => {
              const FeatureIcon = feature.icon
              return (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white border-slate-200 hover:border-slate-300"
                >
                  <CardHeader className="p-8">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <FeatureIcon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-slate-900 mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-base text-slate-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white border-slate-200 hover:border-slate-300">
              <CardHeader className="p-8">
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-slate-900 mb-2">Quick Setup</CardTitle>
                <CardDescription className="text-base text-slate-600 leading-relaxed">
                  Get started in minutes with our intuitive dashboard and guided setup process.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white border-slate-200 hover:border-slate-300">
              <CardHeader className="p-8">
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-slate-900 mb-2">Secure Platform</CardTitle>
                <CardDescription className="text-base text-slate-600 leading-relaxed">
                  Bank-level security ensures all transactions and data are always protected.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white border-slate-200 hover:border-slate-300">
              <CardHeader className="p-8">
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-slate-900 mb-2">Physical Marketplace</CardTitle>
                <CardDescription className="text-base text-slate-600 leading-relaxed">
                  Connect digital stories to custom merchandise that supporters can proudly wear.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className={`py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br ${colors.sectionBg}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of organizations creating meaningful connections through personalized impact stories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className={`bg-white ${selectedAudience === "nonprofit" ? "text-rose-700 hover:bg-rose-50" : "text-blue-700 hover:bg-blue-50"} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-8 py-4 text-lg font-semibold`}
              >
                <IconComponent className="w-5 h-5 mr-2" />
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                variant="outline"
                size="lg"
                className={`border-2 ${selectedAudience === "nonprofit" ? "border-rose-300 text-white hover:bg-rose-600 hover:border-rose-200" : "border-blue-300 text-white hover:bg-blue-600 hover:border-blue-200"} transition-all duration-300 px-8 py-4 text-lg bg-transparent`}
              >
                <Target className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-slate-50 border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Link href="/" className="inline-flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <div className="relative">
                  <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">N</span>
                  </div>
                  <div
                    className={`absolute -top-1 -right-1 w-3 h-3 ${colors.hashColor} rounded-full flex items-center justify-center`}
                  >
                    <span className="text-white font-bold text-xs">#</span>
                  </div>
                </div>
                <span className="text-lg font-bold text-slate-900">The NMBR</span>
              </Link>
              <p className="text-sm text-slate-600">
                Transforming organizations through personalized impact stories that create meaningful connections.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Product</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="/demo" className="hover:text-slate-900 transition-colors">
                    Live Demo
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="hover:text-slate-900 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-slate-900 transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Support</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="/help" className="hover:text-slate-900 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-slate-900 transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-slate-900 transition-colors">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Company</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="/about" className="hover:text-slate-900 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-slate-900 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-slate-900 transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 mt-8 pt-8 text-center text-sm text-slate-500">
            <p>&copy; 2024 NMBR. All rights reserved. Making every story personal.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
