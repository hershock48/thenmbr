import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Heart, Users, BarChart3, ArrowRight, CheckCircle, Star, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-50 supports-[backdrop-filter]:bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-primary-foreground font-bold text-base sm:text-lg">N</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-xs">#</span>
                </div>
              </div>
              <span className="text-lg sm:text-2xl font-bold text-foreground hidden xs:block">NMBR Platform</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground hidden sm:inline-flex">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg text-sm sm:text-base px-3 sm:px-4">
                  <span className="hidden sm:inline">Get Started</span>
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
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(8,145,178,0.1),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)] animate-pulse delay-1000"></div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-3 sm:px-4 py-2 mb-6 sm:mb-8">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Trusted by 500+ nonprofits worldwide</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-6 sm:mb-8 text-balance leading-tight">
            Transform Fundraising with{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Numbered Stories
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect donors directly to the impact they create. Our platform lets nonprofits create numbered stories that donors can follow, subscribe to, and support with one-click donations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Link href="/demo">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8 py-4 text-base sm:text-lg">
                <Search className="mr-2 w-5 h-5" />
                Try Live Demo
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="border-2 px-8 py-4 text-base sm:text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Everything You Need to Tell Your Story
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              From creating numbered stories to processing donations, our platform handles it all with beautiful, customizable widgets that integrate seamlessly into your website.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {/* Story Creation */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl sm:text-2xl">Story Search Widget</CardTitle>
                <CardDescription className="text-base">
                  Donors search by NMBR code to discover personalized impact stories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    Instant story lookup by NMBR code
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    Rich media support with photos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    Real-time progress tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    Mobile-responsive design
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Donation Processing */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-xl sm:text-2xl">Donation Widget</CardTitle>
                <CardDescription className="text-base">
                  One-click donations with Stripe Connect and platform fee collection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    Secure Stripe payment processing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    Automatic platform fee collection
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    PCI-compliant security
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    Custom donation amounts
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Email Marketing */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl sm:text-2xl">Subscribe Widget</CardTitle>
                <CardDescription className="text-base">
                  NMBR-specific email lists for targeted donor engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    Segmented email lists by NMBR
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    Automatic subscriber tagging
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    Detailed engagement analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    Export to your email platform
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Management Dashboard Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Complete Nonprofit Management
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Manage everything from one powerful dashboard. Create stories, customize branding, process donations, and track engagement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Story Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Create, edit, and manage your NMBR stories with photos and progress tracking.</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Branding Control</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Upload logos, set colors, and customize fonts to match your brand perfectly.</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Stripe Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Connect your Stripe account for seamless payment processing and fee collection.</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Track donations, subscribers, and engagement with detailed analytics and reports.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ready to Transform Your Fundraising?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12">
            Join hundreds of nonprofits already using NMBR to create deeper donor connections and increase giving by up to 300%.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Link href="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8 py-4 text-base sm:text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="border-2 px-8 py-4 text-base sm:text-lg">
                View Live Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-primary-foreground font-bold text-lg">N</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-xs">#</span>
                </div>
              </div>
              <span className="text-xl font-bold text-foreground">NMBR Platform</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link href="/demo" className="hover:text-foreground transition-colors">Demo</Link>
              <Link href="/login" className="hover:text-foreground transition-colors">Login</Link>
              <Link href="/signup" className="hover:text-foreground transition-colors">Sign Up</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; 2024 NMBR Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
