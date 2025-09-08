"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Heart, 
  Target, 
  BarChart3, 
  Users, 
  Zap, 
  Shield, 
  ShoppingCart, 
  Mail, 
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Star
} from "lucide-react"
import Link from "next/link"

export default function FeaturesPage() {
  const features = [
    {
      icon: Heart,
      title: "Personalized Stories",
      description: "Create compelling, personalized stories that make every donor feel like they're making a real difference in someone's life.",
      category: "Core Features",
      highlight: true
    },
    {
      icon: Target,
      title: "Smart Widget",
      description: "Beautiful, customizable widget that matches your brand perfectly. Easy to embed, impossible to ignore.",
      category: "Core Features",
      highlight: true
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Track engagement, donations, and impact in real-time. See exactly which stories resonate most with your supporters.",
      category: "Analytics",
      highlight: true
    },
    {
      icon: Users,
      title: "Donor Management",
      description: "Keep track of every supporter, their preferences, and their journey. Build lasting relationships that go beyond the donation.",
      category: "Management"
    },
    {
      icon: Zap,
      title: "Instant Setup",
      description: "Get up and running in minutes, not months. Our intuitive dashboard makes it easy to create and manage your impact stories.",
      category: "Ease of Use"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Bank-level security for all transactions and data. Your supporters' information is always safe and protected.",
      category: "Security"
    },
    {
      icon: ShoppingCart,
      title: "Physical Marketplace",
      description: "Order custom numbered bracelets, wristbands, and merchandise. Connect your digital stories to tangible items that supporters can wear with pride.",
      category: "Physical Products"
    },
    {
      icon: Mail,
      title: "Newsletter Builder",
      description: "Create stunning, professional newsletters with drag-and-drop editor. Keep supporters engaged with beautiful, branded communications.",
      category: "Communication"
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Deep insights into donor behavior, engagement patterns, and campaign performance. Make data-driven decisions to maximize impact.",
      category: "Analytics"
    }
  ]

  const categories = [...new Set(features.map(f => f.category))]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-50 supports-[backdrop-filter]:bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-base sm:text-lg">N</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">#</span>
                </div>
              </div>
              <span className="text-lg sm:text-2xl font-bold text-foreground hidden sm:block">The NMBR</span>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/demo">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground hidden sm:inline-flex">
                  Demo
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white shadow-lg text-sm sm:text-base px-3 sm:px-4">
                  <span className="hidden sm:inline">Start Your Story</span>
                  <span className="sm:hidden">Start</span>
                  <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Everything You Need to
            <span className="block bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Succeed
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Powerful tools designed specifically for nonprofits who want to create deeper, more meaningful donor relationships. 
            See how our features can transform your fundraising.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <Target className="w-5 h-5 mr-2" />
                See It In Action
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" size="lg" className="border-2 border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300 transition-all duration-300">
                <Heart className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features by Category */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          {categories.map((category) => (
            <div key={category} className="mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features
                  .filter(feature => feature.category === category)
                  .map((feature, index) => (
                    <Card 
                      key={index} 
                      className={`group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                        feature.highlight 
                          ? 'border-cyan-200 hover:border-cyan-300 bg-gradient-to-br from-cyan-50/50 to-transparent' 
                          : 'border-border hover:border-muted-foreground/20'
                      }`}
                    >
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${
                          feature.highlight 
                            ? 'bg-gradient-to-br from-cyan-500 to-cyan-600' 
                            : 'bg-gradient-to-br from-muted to-muted-foreground/20'
                        }`}>
                          <feature.icon className={`w-6 h-6 ${feature.highlight ? 'text-white' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">{feature.title}</CardTitle>
                          {feature.highlight && (
                            <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-100">
                              <Star className="w-3 h-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-base">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Fundraising?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of nonprofits who've already discovered the power of personalized impact stories. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <Heart className="w-5 h-5 mr-2" />
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="border-2 border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300 transition-all duration-300">
                <Target className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-lg font-bold text-foreground">The NMBR</span>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Making every donation personal. Transforming fundraising through meaningful connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white shadow-lg">
                <Heart className="w-4 h-4 mr-2" />
                Start Your Free Trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300">
                <Target className="w-4 h-4 mr-2" />
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
