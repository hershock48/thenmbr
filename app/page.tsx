"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Heart, Users, BarChart3, ArrowRight, CheckCircle, Star, Shield, Zap, Sparkles, Target, Gift, LogOut, ShoppingCart, Mail, TrendingUp, Globe, Clock } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function HomePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [stats, setStats] = useState({
    nonprofits: 500,
    stories: 2500,
    donors: 15000,
    raised: 2500000
  })

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      // Could add a toast notification here in a real app
    }
  }

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubscribing(true)
    setSubscriptionStatus('idle')

    try {
      // Simulate API call - in real app this would call your newsletter API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, just show success
      setSubscriptionStatus('success')
      setEmail('')
      
      // Reset success message after 3 seconds
      setTimeout(() => setSubscriptionStatus('idle'), 3000)
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      setSubscriptionStatus('error')
      
      // Reset error message after 3 seconds
      setTimeout(() => setSubscriptionStatus('idle'), 3000)
    } finally {
      setIsSubscribing(false)
    }
  }

  // Simulate dynamic stats loading
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        setStats(prevStats => ({
          nonprofits: prevStats.nonprofits + Math.floor(Math.random() * 3),
          stories: prevStats.stories + Math.floor(Math.random() * 5),
          donors: prevStats.donors + Math.floor(Math.random() * 10),
          raised: prevStats.raised + Math.floor(Math.random() * 1000)
        }))
      } catch (error) {
        console.error('Error updating stats:', error)
      }
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-50 supports-[backdrop-filter]:bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-base sm:text-lg">N</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">#</span>
                </div>
              </div>
              <span className="text-lg sm:text-2xl font-bold text-foreground hidden sm:block">The NMBR</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {user ? (
                <>
                  <Link href="/select-org">
                    <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white shadow-lg text-sm sm:text-base px-3 sm:px-4">
                      <span className="hidden sm:inline">Dashboard</span>
                      <span className="sm:hidden">Dashboard</span>
                      <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    onClick={handleSignOut}
                    className="text-muted-foreground hover:text-foreground hidden sm:inline-flex"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground hidden sm:inline-flex">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white shadow-lg text-sm sm:text-base px-3 sm:px-4">
                      <span className="hidden sm:inline">Start Your Story</span>
                      <span className="sm:hidden">Start</span>
                      <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 via-background to-purple-50/50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(8,145,178,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]"></div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-50 to-purple-50 border border-cyan-200 rounded-full px-3 sm:px-4 py-2 mb-6 sm:mb-8">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span className="text-sm font-medium text-cyan-700">Trusted by {stats.nonprofits.toLocaleString()}+ nonprofits worldwide</span>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Every Donation Has a
              <span className="block bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Human Story
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Turn anonymous donations into meaningful connections. Give every supporter a personal story to follow, love, and champion. Watch your impact multiply when donors see exactly who they're helping.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 sm:mt-10">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105" aria-label="Start your free trial to create impact stories">
                <Gift className="w-5 h-5 mr-2" aria-hidden="true" />
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="border-2 border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300 transition-all duration-300" aria-label="See the platform in action with a demo">
                <Target className="w-5 h-5 mr-2" aria-hidden="true" />
                See It In Action
              </Button>
            </Link>
          </div>

          <div className="mt-12 sm:mt-16">
            <p className="text-sm text-muted-foreground mb-4">Trusted by amazing organizations</p>
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 opacity-60">
              <div className="text-2xl font-bold text-cyan-600 hover:opacity-100 transition-opacity">WaterAid</div>
              <div className="text-2xl font-bold text-purple-600 hover:opacity-100 transition-opacity">UNICEF</div>
              <div className="text-2xl font-bold text-blue-600 hover:opacity-100 transition-opacity">Red Cross</div>
              <div className="text-2xl font-bold text-green-600 hover:opacity-100 transition-opacity">Doctors Without Borders</div>
            </div>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Nonprofits</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">Stories Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">$2M+</div>
              <div className="text-sm text-muted-foreground">Raised</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">95%</div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to transform your fundraising and create lasting donor relationships
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">1. Create Your Stories</h3>
              <p className="text-muted-foreground leading-relaxed">
                Upload photos, write compelling stories, and assign unique numbers to each person or cause you're helping. Make every story personal and powerful.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">2. Share & Connect</h3>
              <p className="text-muted-foreground leading-relaxed">
                Embed our beautiful widget on your website. Donors search by number, find their person, and instantly connect with the story that moves them most.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">3. Watch Impact Grow</h3>
              <p className="text-muted-foreground leading-relaxed">
                See donations increase, track engagement, and build lasting relationships. Your supporters become champions, not just donors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed specifically for nonprofits who want to create deeper, more meaningful donor relationships
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-cyan-100 hover:border-cyan-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Personalized Stories</CardTitle>
                <CardDescription className="text-base">
                  Create compelling, personalized stories that make every donor feel like they're making a real difference in someone's life.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-purple-100 hover:border-purple-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Smart Widget</CardTitle>
                <CardDescription className="text-base">
                  Beautiful, customizable widget that matches your brand perfectly. Easy to embed, impossible to ignore.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-green-100 hover:border-green-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Real-Time Analytics</CardTitle>
                <CardDescription className="text-base">
                  Track engagement, donations, and impact in real-time. See exactly which stories resonate most with your supporters.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-blue-100 hover:border-blue-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Donor Management</CardTitle>
                <CardDescription className="text-base">
                  Keep track of every supporter, their preferences, and their journey. Build lasting relationships that go beyond the donation.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-orange-100 hover:border-orange-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Instant Setup</CardTitle>
                <CardDescription className="text-base">
                  Get up and running in minutes, not months. Our intuitive dashboard makes it easy to create and manage your impact stories.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-pink-100 hover:border-pink-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Secure & Reliable</CardTitle>
                <CardDescription className="text-base">
                  Bank-level security for all transactions and data. Your supporters' information is always safe and protected.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-indigo-100 hover:border-indigo-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Physical Marketplace</CardTitle>
                <CardDescription className="text-base">
                  Order custom numbered bracelets, wristbands, and merchandise. Connect your digital stories to tangible items that supporters can wear with pride.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-teal-100 hover:border-teal-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Newsletter Builder</CardTitle>
                <CardDescription className="text-base">
                  Create stunning, professional newsletters with drag-and-drop editor. Keep supporters engaged with beautiful, branded communications.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-rose-100 hover:border-rose-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Advanced Analytics</CardTitle>
                <CardDescription className="text-base">
                  Deep insights into donor behavior, engagement patterns, and campaign performance. Make data-driven decisions to maximize impact.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Stay Updated with Impact Stories
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get the latest insights, success stories, and fundraising tips delivered to your inbox. Join thousands of nonprofits making a difference.
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row gap-3" role="form" aria-label="Newsletter subscription">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 h-12 text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubscribing}
                aria-label="Email address for newsletter subscription"
                aria-describedby="newsletter-description"
              />
              <Button 
                type="submit"
                className="h-12 px-8 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isSubscribing || !email.trim()}
                aria-label={isSubscribing ? 'Subscribing to newsletter' : 'Subscribe to newsletter'}
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
              </Button>
            </form>
            
            {/* Status Messages */}
            {subscriptionStatus === 'success' && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm" role="alert" aria-live="polite">
                ✅ Successfully subscribed! Check your email for confirmation.
              </div>
            )}
            {subscriptionStatus === 'error' && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert" aria-live="polite">
                ❌ Subscription failed. Please try again.
              </div>
            )}
            
            <p id="newsletter-description" className="text-sm text-muted-foreground mt-3">
              Join {stats.stories.toLocaleString()}+ nonprofits. Unsubscribe anytime.
            </p>
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Weekly insights</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Success stories</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Fundraising tips</span>
            </div>
          </div>
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
                <Gift className="w-5 h-5 mr-2" />
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
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="text-lg font-bold text-foreground">The NMBR</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Transforming fundraising through personalized impact stories that connect donors directly to the people they help.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/demo" className="hover:text-foreground transition-colors">Live Demo</Link></li>
                <li><Link href="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/dashboard/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 The NMBR. All rights reserved. Making every donation personal.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
