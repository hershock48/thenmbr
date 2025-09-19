"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GlobalHeader } from "@/components/layout/global-header"
import { GlobalFooter } from "@/components/layout/global-footer"
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
  Star,
  Globe,
  Calendar,
  Smartphone,
  Clock,
  Lock,
  FileCheck,
  Package,
  Truck,
  MessageSquare,
  Video,
} from "lucide-react"
import Link from "next/link"

export default function FeaturesPage() {
  const features = [
    {
      icon: Heart,
      title: "Personalized Stories",
      description:
        "Create compelling, personalized stories that make every donor feel like they're making a real difference in someone's life.",
      category: "Core Features",
      highlight: true,
    },
    {
      icon: Target,
      title: "Smart Widget",
      description:
        "Beautiful, customizable widget that matches your brand perfectly. Easy to embed, impossible to ignore.",
      category: "Core Features",
      highlight: true,
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description:
        "Track engagement, donations, and impact in real-time. See exactly which stories resonate most with your supporters.",
      category: "Analytics",
      highlight: true,
    },
    {
      icon: Users,
      title: "Donor Management",
      description:
        "Keep track of every supporter, their preferences, and their journey. Build lasting relationships that go beyond the donation.",
      category: "Management",
    },
    {
      icon: Zap,
      title: "Instant Setup",
      description:
        "Get up and running in minutes, not months. Our intuitive dashboard makes it easy to create and manage your impact stories.",
      category: "Ease of Use",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description:
        "Bank-level security for all transactions and data. Your supporters' information is always safe and protected.",
      category: "Security",
    },
    {
      icon: ShoppingCart,
      title: "Physical Marketplace",
      description:
        "Order custom numbered bracelets, wristbands, and merchandise. Connect your digital stories to tangible items that supporters can wear with pride.",
      category: "Physical Products",
    },
    {
      icon: Mail,
      title: "Newsletter Builder",
      description:
        "Create stunning, professional newsletters with drag-and-drop editor. Keep supporters engaged with beautiful, branded communications.",
      category: "Communication",
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description:
        "Deep insights into donor behavior, engagement patterns, and campaign performance. Make data-driven decisions to maximize impact.",
      category: "Analytics",
    },
    {
      icon: Star,
      title: "Custom Branding",
      description:
        "Complete control over your visual identity. Custom colors, fonts, logos, and themes that make every interaction distinctly yours.",
      category: "Core Features",
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description:
        "Reach supporters in their preferred language. Automatic translation and localization to connect with diverse communities worldwide.",
      category: "Analytics",
    },
    {
      icon: Calendar,
      title: "Campaign Scheduling",
      description:
        "Plan and automate your fundraising campaigns. Set start dates, end dates, and automated follow-ups for maximum impact.",
      category: "Management",
    },
    {
      icon: Heart,
      title: "Impact Tracking",
      description:
        "Show donors exactly how their contribution made a difference. Real-time updates on lives changed and communities transformed.",
      category: "Management",
    },
    {
      icon: Smartphone,
      title: "Mobile App",
      description:
        "Manage your campaigns on the go. Full-featured mobile app for iOS and Android keeps you connected to your impact stories anywhere.",
      category: "Ease of Use",
    },
    {
      icon: Clock,
      title: "One-Click Setup",
      description:
        "Get started in under 5 minutes. Import your existing donor data, customize your stories, and launch your first campaign instantly.",
      category: "Ease of Use",
    },
    {
      icon: Lock,
      title: "GDPR Compliance",
      description:
        "Full compliance with privacy regulations. Automatic data protection, consent management, and secure data handling for global operations.",
      category: "Security",
    },
    {
      icon: FileCheck,
      title: "Audit Trails",
      description:
        "Complete transaction history and audit logs. Track every interaction, donation, and change for transparency and accountability.",
      category: "Security",
    },
    {
      icon: Package,
      title: "Custom Merchandise",
      description:
        "Design and order branded merchandise that connects to your digital stories. From bracelets to apparel, create lasting connections.",
      category: "Physical Products",
    },
    {
      icon: Truck,
      title: "Fulfillment Services",
      description:
        "White-label fulfillment for your physical products. We handle inventory, shipping, and customer service so you can focus on impact.",
      category: "Physical Products",
    },
    {
      icon: MessageSquare,
      title: "Two-Way Messaging",
      description:
        "Enable conversations between donors and beneficiaries. Create meaningful connections that extend beyond the initial donation.",
      category: "Communication",
    },
    {
      icon: Video,
      title: "Video Stories",
      description:
        "Bring your impact stories to life with video. Create compelling visual narratives that inspire action and deepen emotional connections.",
      category: "Communication",
    },
  ]

  const categories = [...new Set(features.map((f) => f.category))]

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader variant="default" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Everything You Need to
              <span className="block text-primary">Turn Stories Into Revenue</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Powerful tools designed specifically for nonprofits who want to create deeper, more meaningful donor
              relationships through story-driven fundraising.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                >
                  <Target className="w-5 h-5 mr-2" />
                  See It In Action
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" size="lg" className="border-2 bg-transparent">
                  <Heart className="w-5 h-5 mr-2" />
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features by Category */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {categories.map((category) => (
            <div key={category} className="mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">{category}</h2>
              <div className="flex flex-wrap justify-center gap-6">
                {features
                  .filter((feature) => feature.category === category)
                  .map((feature, index) => (
                    <Card
                      key={index}
                      className={`group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] w-full max-w-sm md:w-80 lg:w-72 ${
                        feature.highlight
                          ? "border-primary/20 hover:border-primary/30 bg-gradient-to-br from-primary/5 to-transparent"
                          : "border-border hover:border-muted-foreground/20"
                      }`}
                    >
                      <CardHeader>
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${
                            feature.highlight ? "bg-primary/10" : "bg-muted"
                          }`}
                        >
                          <feature.icon
                            className={`w-6 h-6 ${feature.highlight ? "text-primary" : "text-muted-foreground"}`}
                          />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">{feature.title}</CardTitle>
                          {feature.highlight && (
                            <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20">
                              <Star className="w-3 h-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-base">{feature.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Ready to Transform Your Fundraising?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of nonprofits who've already discovered the power of story-driven fundraising. Start your
            journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
              >
                <Heart className="w-5 h-5 mr-2" />
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="border-2 bg-transparent">
                <Target className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <GlobalFooter />
    </div>
  )
}
