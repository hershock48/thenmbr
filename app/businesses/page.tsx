"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Sparkles,
  BarChart3,
  ArrowRight,
  Star,
  Target,
  Handshake,
  TrendingUp,
  Shield,
  Zap,
  Briefcase,
} from "lucide-react"
import Link from "next/link"

export default function BusinessesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg border border-primary/20">
                  <span className="text-primary-foreground font-bold text-base sm:text-lg drop-shadow-lg">N</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center border border-secondary/20">
                  <span className="text-secondary-foreground font-bold text-xs drop-shadow-lg">#</span>
                </div>
              </div>
              <span className="text-lg sm:text-2xl font-bold text-foreground hidden xs:block">The NMBR</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground hidden sm:inline-flex">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup?audience=business">
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg text-sm sm:text-base px-3 sm:px-4">
                  <span className="hidden sm:inline">Tell Your Story</span>
                  <span className="sm:hidden">Start</span>
                  <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-background to-indigo-50/50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.1),transparent_50%)]"></div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full px-3 sm:px-4 py-2 mb-6 sm:mb-8">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Powering story-driven commerce for 200+ brands</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Turn Every Product Into a
            <span className="block bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Story-Driven Experience
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Embed unique NMBRs in your products. Customers scan QR codes or look up numbers to discover compelling
            stories about their purchase. Watch customer loyalty and sales increase when buyers see exactly who they're
            helping.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/signup?audience=business">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Building2 className="w-5 h-5 mr-2" />
                Tell Your Story
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/demo?audience=business">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 bg-transparent"
              >
                <Target className="w-5 h-5 mr-2" />
                View Examples
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">3x</div>
              <div className="text-sm text-muted-foreground">Customer Lifetime Value</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">2-5%</div>
              <div className="text-sm text-muted-foreground">Revenue Share Model</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">30%+</div>
              <div className="text-sm text-muted-foreground">Story Engagement Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">15%+</div>
              <div className="text-sm text-muted-foreground">Story-to-Purchase Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Story-Driven Commerce Platform</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to embed stories in products and track the sales impact of customer engagement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border hover:border-blue-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-foreground">Product Story Embedding</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Generate unique QR codes and numbers for each product. Customers scan to discover the authentic story
                  behind their purchase.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border hover:border-blue-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-foreground">Story-Driven Sales Tracking</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Track which customers engage with stories and measure the direct sales impact. We only succeed when
                  your sales increase.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border hover:border-blue-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-foreground">Customer Journey Analytics</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  See the complete path from product scan to story engagement to repeat purchase. Identify your most
                  valuable story customers.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border hover:border-blue-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Handshake className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-foreground">Customer Engagement</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Build lasting relationships with customers through transparent storytelling about your products and
                  social impact.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border hover:border-blue-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-foreground">Brand Protection</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Maintain brand consistency and protect your reputation with controlled storytelling and content
                  management.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border hover:border-blue-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-foreground">Enterprise Integration</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Seamlessly integrate with your existing CRM, marketing tools, and business systems for unified
                  customer experience.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Real Brands, Real Results</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how businesses are using product-embedded stories to increase customer lifetime value and drive repeat
              sales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-15 h-15 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Artisan Coffee Co.</CardTitle>
                    <CardDescription>Premium coffee roaster</CardDescription>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">3x</div>
                    <div className="text-sm text-muted-foreground">Customer Lifetime Value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">$120K</div>
                    <div className="text-sm text-muted-foreground">Monthly Story-Driven Sales</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="text-muted-foreground italic">
                  "Every coffee bag has a QR code. Customers scan to learn about the specific farmer their purchase
                  supports. This personal connection turned one-time buyers into monthly subscribers."
                </blockquote>
                <div className="flex items-center mt-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground">Maria Rodriguez, Founder</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-15 h-15 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Handshake className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">EcoWear Apparel</CardTitle>
                    <CardDescription>Sustainable fashion brand</CardDescription>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">35%</div>
                    <div className="text-sm text-muted-foreground">Story Engagement Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">18%</div>
                    <div className="text-sm text-muted-foreground">Story-to-Purchase Rate</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="text-muted-foreground italic">
                  "Each garment has a unique number. Customers look it up to see the sustainable materials and ethical
                  manufacturing story. Our repeat purchase rate increased 240%."
                </blockquote>
                <div className="flex items-center mt-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground">Alex Chen, CMO</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Success Metrics */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-6">We Only Win When You Win</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-bold">2-5%</div>
                <div className="text-blue-100">revenue share on story-driven sales</div>
              </div>
              <div>
                <div className="text-3xl font-bold">3x</div>
                <div className="text-blue-100">average customer lifetime value increase</div>
              </div>
              <div>
                <div className="text-3xl font-bold">30%+</div>
                <div className="text-blue-100">of customers engage with product stories</div>
              </div>
              <div>
                <div className="text-3xl font-bold">$31.5B</div>
                <div className="text-blue-100">story-driven commerce market opportunity</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-muted/50 to-card/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Customer Relationships?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join forward-thinking businesses who are building deeper customer connections through authentic impact
            storytelling. Start creating brand advocates today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup?audience=business">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Building2 className="w-5 h-5 mr-2" />
                Start Your Story
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/demo?audience=business">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 bg-transparent"
              >
                <Target className="w-5 h-5 mr-2" />
                View Examples
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center border border-primary/20">
              <span className="text-primary-foreground font-bold text-sm drop-shadow-lg">N</span>
            </div>
            <span className="text-lg font-bold text-foreground">The NMBR</span>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Transforming businesses through authentic storytelling. Building customer relationships that last.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup?audience=business">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg">
                <Briefcase className="w-4 h-4 mr-2" />
                Start Your Story
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 bg-transparent"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
