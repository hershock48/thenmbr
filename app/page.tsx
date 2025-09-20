"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users,
  DollarSign, 
  BarChart3,
  ShoppingCart,
  Mail,
  MessageSquare,
  Bell,
  Globe,
  Hash,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Award,
  Coffee,
  Heart,
  Building2,
  Smartphone,
  ExternalLink,
  Clock,
  Store
} from "lucide-react"

const pricingTiers = [
  {
    name: "Starter",
    price: 99,
    annualPrice: 990,
    description: "Perfect for small nonprofits getting started",
    features: [
      "1-3 active NMBRs",
      "2 team seats", 
      "Basic analytics",
      "Email campaigns",
      "Basic branding",
      "5% platform fee"
    ],
    cta: "Start Free Trial",
    popular: false
  },
  {
    name: "Growth", 
    price: 199,
    annualPrice: 1990,
    description: "For growing nonprofits ready to scale",
    features: [
      "5 active NMBRs",
      "Unlimited team seats",
      "Advanced analytics", 
      "Enhanced branding",
      "Marketplace ordering",
      "3% platform fee"
    ],
    cta: "Start Free Trial",
    popular: true
  },
  {
    name: "Professional",
    price: 399,
    annualPrice: 3990,
    description: "For established nonprofits with complex needs",
    features: [
      "10 active NMBRs",
      "White-label storefronts",
      "Built-in email",
      "Advanced analytics",
      "API access",
      "1% platform fee"
    ],
    cta: "Start Free Trial",
    popular: false
  },
  {
    name: "Enterprise",
    price: "Custom",
    annualPrice: "750-1,000+",
    description: "For large nonprofits with custom requirements",
    features: [
      "Unlimited active NMBRs",
      "SSO & SCIM",
      "Dedicated support",
      "Custom integrations",
      "0% platform fee",
      "Custom features"
    ],
    cta: "Contact Sales",
    popular: false
  }
]


export default function HomePage() {

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs">#</span>
                </div>
              </div>
              <span className="text-xl font-bold text-foreground">The NMBR</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/demo" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Demo
              </Link>
              <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Start Free Trial</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Heart className="w-4 h-4 mr-2" />
                  The Complete Donor Connection Platform
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
                  Connect Every Donor to Their
                  <span className="text-primary"> Impact Story</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Each NMBR creates a lasting bridge between donor and beneficiary. When someone searches their number, 
                  they connect to the ongoing story of the person they helped - creating relationships that last far beyond the initial donation.
                </p>
                
                {/* Market Timing & Urgency */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-2">
                      <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                        Why Now? The Future of Nonprofit Commerce
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        <strong>78% of donors</strong> want to know exactly how their money helps real people. 
                        NMBR technology creates that connection instantly - whether it's on a t-shirt, mug, or custom product. 
                        Join 500+ nonprofits already using this $2.3T giving market strategy.
                      </p>
                    </div>
                </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary" asChild>
                  <Link href="/signup">
                    Start Your Fundraising Platform
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                    </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2" asChild>
                <Link href="/demo/attribution">
                  <Smartphone className="w-5 h-5 mr-2" />
                  See How It Works
                  </Link>
                  </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Free 14-day trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Setup in 5 minutes</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-card rounded-3xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Hash className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">NMBR-001: Maria's Coffee</h3>
                      <p className="text-sm text-muted-foreground">Story-driven product sales</p>
          </div>
        </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">$2,847</div>
                      <div className="text-sm text-muted-foreground">Revenue this month</div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">127</div>
                      <div className="text-sm text-muted-foreground">Orders</div>
                    </div>
          </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email Campaign Performance</span>
                      <span className="text-sm font-medium">4.2% conversion</span>
          </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '42%' }}></div>
          </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">
                Trusted by 500+ Nonprofits Worldwide
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See how organizations are using NMBR technology to increase donations and donor engagement
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-2">40%</div>
                <div className="text-sm font-medium text-green-800">Average Increase in Donor Retention</div>
                <div className="text-xs text-green-600 mt-1">When using NMBR technology</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">$2.3M</div>
                <div className="text-sm font-medium text-blue-800">Total Funds Raised</div>
                <div className="text-xs text-blue-600 mt-1">Through NMBR-powered products</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
                <div className="text-sm font-medium text-purple-800">Donor Engagement Rate</div>
                <div className="text-xs text-purple-600 mt-1">When entering NMBR codes</div>
              </div>
            </div>

            {/* Organization Logos */}
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Trusted by leading organizations</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="text-lg font-semibold text-cyan-600">WaterAid</div>
                <div className="text-lg font-semibold text-purple-600">UNICEF</div>
                <div className="text-lg font-semibold text-red-600">Red Cross</div>
                <div className="text-lg font-semibold text-green-600">Doctors Without Borders</div>
                <div className="text-lg font-semibold text-blue-600">World Wildlife Fund</div>
                <div className="text-lg font-semibold text-orange-600">Oxfam</div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="max-w-3xl mx-auto">
              <blockquote className="text-lg italic text-muted-foreground mb-4">
                "NMBR technology transformed our fundraising. We added codes to our event t-shirts and saw a 60% increase in donor engagement. 
                Now every product we sell tells our story and connects donors to our impact."
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SJ</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-foreground">Sarah Johnson</div>
                  <div className="text-sm text-muted-foreground">Development Director, Clean Water Initiative</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-4xl font-bold">The Complete Story-Driven Fundraising Platform</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to turn any product into a fundraising tool. Add NMBR codes to t-shirts, mugs, 
              stickers, or custom merchandise - then watch as donors connect with your impact stories and become lifelong supporters.
            </p>
            <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
              <p className="text-lg font-medium text-foreground mb-2">
                Every donor. Every impact. Every story.
              </p>
              <p className="text-muted-foreground">
                NMBR links donations and support directly to the story behind them. 
                A donation isn't just money — it's NMBR:004, Maria's education fund in Honduras. 
                A sponsorship isn't just support — it's NMBR:027, Genesis' journey through school.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Hash className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Story Management</CardTitle>
                <CardDescription>
                  Create, manage, and track compelling stories that drive engagement and sales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Dynamic story creation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>AI-powered content assistance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Multi-media support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Product Marketplace</CardTitle>
                <CardDescription>
                  Add NMBR codes to any product - t-shirts, mugs, stickers, or custom merchandise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Customizable product templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Dropship integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>White-label storefronts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                    </div>
                <CardTitle>Multi-Channel Communications</CardTitle>
                <CardDescription>
                  Email, SMS, push notifications, and donor feeds to engage your supporters
                    </CardDescription>
                  </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Email campaigns with impact updates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>SMS updates and alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Donor feed (story wall)</span>
                  </li>
                </ul>
              </CardContent>
                </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>
                  Complete attribution tracking from story to donation with detailed insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Donations by story and campaign</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Donor journey tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Impact measurement optimization</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Donor Targeting</CardTitle>
                <CardDescription>
                  Send targeted campaigns to specific NMBR supporters or your entire donor base
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>NMBR-specific campaigns</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Donor behavior segmentation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Personalized impact updates</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Enterprise Security</CardTitle>
                <CardDescription>
                  Bank-level security with role-based access and compliance features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>SSO and advanced security</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Role-based permissions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Data encryption</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Competitive Differentiation */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="w-fit mx-auto">
              <Award className="w-4 h-4 mr-2" />
              Why NMBR is Different
            </Badge>
            <h3 className="text-4xl font-bold">The Only Platform That Does It All</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              While others focus on single functions, NMBR combines everything you need 
              in one integrated solution. No more juggling multiple tools or losing attribution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Hash className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Story-Driven Commerce</CardTitle>
                    <CardDescription className="text-sm">Unique to NMBR</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  The only platform that seamlessly integrates storytelling with commerce and attribution tracking.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Story-to-sale attribution</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Dynamic product integration</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Revenue forecasting</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Complete Attribution</CardTitle>
                    <CardDescription className="text-sm">vs. Limited tracking</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Track every interaction from story view to purchase with detailed analytics and ROI measurement.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>End-to-end customer journey</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Campaign performance tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>ROI calculation</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 hover:border-green-300 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Multi-Channel Platform</CardTitle>
                    <CardDescription className="text-sm">vs. Single-purpose tools</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Email, SMS, push notifications, and in-platform feed - all in one unified experience.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Unified communication hub</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Cross-channel analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Consistent brand experience</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Competitive Comparison */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">How We Compare</h3>
              <p className="text-muted-foreground">See why organizations switch from single-purpose tools to NMBR</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <div className="text-3xl mb-2">💝</div>
                <h3 className="font-semibold mb-2">Classy</h3>
                <p className="text-sm text-muted-foreground mb-3">Fundraising platform only</p>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">✗</span>
                    <span>No story integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Limited attribution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">✗</span>
                    <span>No multi-channel</span>
                  </div>
                </div>
              </div>

              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <div className="text-3xl mb-2">💰</div>
                <h3 className="font-semibold mb-2">Donorbox</h3>
                <p className="text-sm text-muted-foreground mb-3">Donation processing only</p>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">✗</span>
                    <span>No fundraising features</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">✗</span>
                    <span>No story integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Limited attribution</span>
                  </div>
                </div>
              </div>

              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <div className="text-3xl mb-2">🤝</div>
                <h3 className="font-semibold mb-2">GiveLively</h3>
                <p className="text-sm text-muted-foreground mb-3">Free fundraising tools</p>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Limited features</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">✗</span>
                    <span>No built-in marketing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">✗</span>
                    <span>No story features</span>
                  </div>
                </div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20 rounded-lg">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-semibold mb-2 text-primary">NMBR</h3>
                <p className="text-sm text-muted-foreground mb-3">Complete platform</p>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Story-driven fundraising</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Complete attribution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Multi-channel platform</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Timing & Urgency */}
      <section className="py-20 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="destructive" className="w-fit mx-auto">
              <Clock className="w-4 h-4 mr-2" />
              Market Opportunity
            </Badge>
            <h3 className="text-4xl font-bold">The Perfect Storm for Story-Driven Fundraising</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Post-COVID market shifts have created unprecedented opportunities for authentic, 
              story-driven nonprofits. Don't miss this $2.3T giving market transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="text-center p-6 border-orange-200 hover:border-orange-300 transition-colors">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-orange-600 mb-2">78%</h3>
              <p className="text-sm text-muted-foreground">of donors prefer nonprofits that share their impact stories and show real results</p>
            </Card>

            <Card className="text-center p-6 border-blue-200 hover:border-blue-300 transition-colors">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-2">$2.3T</h3>
              <p className="text-sm text-muted-foreground">global giving market opportunity for authentic impact experiences</p>
            </Card>

            <Card className="text-center p-6 border-green-200 hover:border-green-300 transition-colors">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">300%</h3>
              <p className="text-sm text-muted-foreground">average donation increase for story-driven nonprofits</p>
            </Card>

            <Card className="text-center p-6 border-purple-200 hover:border-purple-300 transition-colors">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600 mb-2">4.2%</h3>
              <p className="text-sm text-muted-foreground">average conversion rate with story-driven fundraising campaigns</p>
            </Card>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Why Organizations Are Switching Now</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-red-600 text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Donor Behavior Shift</h3>
                      <p className="text-sm text-muted-foreground">
                        Post-COVID, donors prioritize authenticity and meaningful connections over traditional fundraising appeals.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-orange-600 text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Attribution Crisis</h3>
                      <p className="text-sm text-muted-foreground">
                        Traditional tools can't track the full donor journey from story to donation, losing valuable insights.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Tool Fragmentation</h3>
                      <p className="text-sm text-muted-foreground">
                        Managing multiple platforms creates data silos and operational complexity that hurts performance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6">
                <h3 className="font-semibold mb-4 text-center">The NMBR Advantage</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Complete story-to-donation attribution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Unified multi-channel platform</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">AI-powered content optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Real-time impact forecasting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Enterprise-grade security</span>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Button size="lg" className="w-full" asChild>
                    <Link href="/signup">
                      Start Your Free Trial
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    No credit card required • 14-day free trial • Setup in 5 minutes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace vs Storefront */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-4xl font-bold">Two Ways to Sell Through Stories</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the approach that fits your organization's goals and audience
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <Card className="p-8 border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Store className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-2xl font-bold mb-2">Your Storefront</h4>
                <p className="text-muted-foreground">
                  A white-labeled shop, branded as your own, running on NMBR rails
                </p>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                  Your domain, your branding, your customers
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                  Complete control over pricing and inventory
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                  Direct customer relationships and data
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                  Full story-to-sale attribution tracking
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-2 border-secondary/20 hover:border-secondary/40 transition-colors">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-secondary" />
                </div>
                <h4 className="text-2xl font-bold mb-2">The NMBR Marketplace</h4>
                <p className="text-muted-foreground">
                  Our global catalog of story-driven goods, where your products can reach new audiences
                </p>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                  Access to engaged, story-driven customers
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                  Cross-promotion with other organizations
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                  Built-in discovery and recommendation engine
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                  You keep your brand. We give you extra reach.
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-4xl font-bold">How It Works</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From story creation to lasting donor connections in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <Hash className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">1. Create Your Stories</h3>
              <p className="text-muted-foreground">
                Build compelling stories with AI assistance and assign each one a unique NMBR. 
                These numbers become the bridge between your donors and the people they help.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">2. Distribute Your NMBRs</h3>
              <p className="text-muted-foreground">
                Give NMBRs to donors through products, events, or direct distribution. 
                Each number connects them to their specific impact story and enables ongoing communication.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">3. Build Lasting Relationships</h3>
              <p className="text-muted-foreground">
                When donors search their NMBR, they connect to ongoing story updates and can subscribe to newsletters. 
                Turn one-time donors into lifelong supporters through continuous story engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Attribution Tracking */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-4xl font-bold">Track Every Story-to-Sale Journey</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Unlike Shopify or Mailchimp, NMBR captures the full loop from story to revenue
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h4 className="text-2xl font-bold mb-4">Complete Attribution Tracking</h4>
                  <p className="text-muted-foreground mb-6">
                    See exactly how every story moves hearts — and drives action. 
                    Track which story updates were opened, which products were clicked, 
                    which NMBR they're tied to, and the final purchase or donation.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                      Which story update was opened
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                      Which product was clicked
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                      Which NMBR it's tied to
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                      The final purchase or donation
                    </li>
                  </ul>
                </div>
                <div className="bg-muted/50 p-6 rounded-lg">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-primary mb-2">NMBR:004</div>
                    <div className="text-sm text-muted-foreground">Maria's Co-op Coffee</div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Story Views:</span>
                      <span className="font-semibold">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Product Clicks:</span>
                      <span className="font-semibold">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversions:</span>
                      <span className="font-semibold text-green-600">23</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>Revenue:</span>
                      <span className="font-semibold text-green-600">$414</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-4xl font-bold">Simple, Transparent Pricing</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the plan that fits your organization. All plans include our core platform features.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="bg-primary/10 text-primary px-6 py-2 rounded-full font-medium">
                Nonprofit Pricing
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pricingTiers.map((tier) => (
                  <Card key={tier.name} className={`relative ${tier.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground px-3 py-1">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-2xl">{tier.name}</CardTitle>
                      <CardDescription className="text-sm">{tier.description}</CardDescription>
                      <div className="space-y-1">
                        <div className="text-4xl font-bold">${tier.price}</div>
                        <div className="text-sm text-muted-foreground">per month</div>
                        <div className="text-sm text-green-600 font-medium">
                          ${tier.annualPrice}/year billed annually (save 17%)
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-3">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className={`w-full ${tier.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                        variant={tier.popular ? 'default' : 'outline'}
                        asChild
                      >
                        <Link href={tier.cta === "Contact Sales" ? "/enterprise/sales" : "/signup"}>
                          {tier.cta}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              All plans include 14-day free trial • No setup fees • Cancel anytime
            </p>
            <div className="flex justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Enterprise security</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>99.9% uptime SLA</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h3 className="text-4xl font-bold">Ready to Connect Donors to Their Impact Stories?</h3>
            <p className="text-xl opacity-90">
              Join hundreds of nonprofits already using NMBR to create lasting 
              donor relationships through ongoing story connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white/50 text-white hover:bg-white hover:text-primary bg-white/10 backdrop-blur-sm" asChild>
                <Link href="/case-studies">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  View Success Stories
            </Link>
              </Button>
            </div>
            <p className="text-sm opacity-75">
              Setup takes less than 5 minutes • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Hash className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">NMBR</span>
                  </div>
              <p className="text-sm text-muted-foreground">
                The complete story-driven fundraising platform for nonprofits.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/features" className="hover:text-foreground">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-foreground">Demo</Link></li>
                <li><Link href="/integrations" className="hover:text-foreground">Integrations</Link></li>
                <li><Link href="/compare" className="hover:text-foreground">Compare</Link></li>
                <li><Link href="/api-docs" className="hover:text-foreground">API</Link></li>
                <li><Link href="/marketplace" className="hover:text-foreground">Marketplace</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/docs" className="hover:text-foreground">Documentation</Link></li>
                <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="/help" className="hover:text-foreground">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                <li><Link href="/case-studies" className="hover:text-foreground">Success Stories</Link></li>
                <li><Link href="/enterprise" className="hover:text-foreground">Enterprise</Link></li>
                <li><Link href="/careers" className="hover:text-foreground">Careers</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 NMBR Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
