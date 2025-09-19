"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, BarChart3, ArrowRight, Star, Target, DollarSign, Shield, Zap, Gift } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function NonprofitsPage() {
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
              <Link href="/signup?audience=nonprofit">
                <Button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-lg text-sm sm:text-base px-3 sm:px-4">
                  <span className="hidden sm:inline">Start Your Impact Story</span>
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
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 via-background to-pink-50/50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(244,63,94,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.1),transparent_50%)]"></div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-full px-3 sm:px-4 py-2 mb-6 sm:mb-8">
            <Heart className="w-4 h-4 text-rose-600" />
            <span className="text-sm font-medium text-rose-700">Trusted by 500+ nonprofits worldwide</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Transform Anonymous Donations Into
            <span className="block bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
              Meaningful Connections
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Give every donor a personal story to follow, love, and champion. Watch your fundraising multiply when
            supporters see exactly who they're helping and the real impact of their generosity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/signup?audience=nonprofit">
              <Button
                size="lg"
                className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Heart className="w-5 h-5 mr-2" />
                Start Your Impact Story
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300 transition-all duration-300 bg-transparent"
              >
                <Target className="w-5 h-5 mr-2" />
                See It In Action
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-rose-600">500+</div>
              <div className="text-sm text-muted-foreground">Nonprofits Trust Us</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-rose-600">$2.3M+</div>
              <div className="text-sm text-muted-foreground">Donations Processed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-rose-600">150K+</div>
              <div className="text-sm text-muted-foreground">Lives Impacted</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-rose-600">3.2x</div>
              <div className="text-sm text-muted-foreground">Average Engagement Increase</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Everything Your Nonprofit Needs</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful fundraising tools designed specifically for nonprofits who want to create deeper, more meaningful
              donor relationships
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border hover:border-rose-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-foreground">Personalized Donor Engagement</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Create compelling, personalized stories that make every donor feel like they're making a real
                  difference in someone's life.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border hover:border-rose-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-foreground">Advanced Fundraising Tools</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Powerful fundraising features with donation tracking, recurring gifts, and campaign management built
                  for nonprofits.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border hover:border-rose-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-foreground">Impact Analytics</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Track donations, engagement, and impact in real-time. See exactly which stories resonate most with
                  your supporters.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border hover:border-rose-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-foreground">Donor Management</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Comprehensive donor database with segmentation, communication tools, and automated follow-up
                  sequences.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border hover:border-rose-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-foreground">Secure & Compliant</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Bank-level security with PCI compliance, automated tax receipts, and full audit trails for
                  transparency.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border hover:border-rose-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-foreground">Easy Integration</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Simple widget integration with your existing website. Get up and running in minutes, not months.
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
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Real Results from Real Nonprofits</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how organizations like yours are transforming their fundraising with personalized impact stories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src="/hope-foundation-logo.jpg"
                    alt="Hope Foundation"
                    width={60}
                    height={60}
                    className="rounded-lg"
                  />
                  <div>
                    <CardTitle className="text-lg">Hope Foundation</CardTitle>
                    <CardDescription>Education nonprofit serving 500+ children</CardDescription>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-rose-600">285%</div>
                    <div className="text-sm text-muted-foreground">Donation Increase</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-rose-600">4.2x</div>
                    <div className="text-sm text-muted-foreground">Donor Retention</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="text-muted-foreground italic">
                  "The NMBR transformed how our donors connect with our mission. Instead of abstract statistics, they
                  now follow specific children's educational journeys. Our recurring donations increased by 285% in just
                  6 months."
                </blockquote>
                <div className="flex items-center mt-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground">Sarah Chen, Executive Director</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src="/water-well-village.jpg"
                    alt="Clean Water Initiative"
                    width={60}
                    height={60}
                    className="rounded-lg"
                  />
                  <div>
                    <CardTitle className="text-lg">Clean Water Initiative</CardTitle>
                    <CardDescription>Water access nonprofit in rural communities</CardDescription>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-rose-600">$1.2M</div>
                    <div className="text-sm text-muted-foreground">Raised in 12 months</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-rose-600">89%</div>
                    <div className="text-sm text-muted-foreground">Donor Satisfaction</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="text-muted-foreground italic">
                  "Donors can now follow specific villages as they get clean water access. The personal connection is
                  incredible - we've built a community of supporters who feel genuinely invested in our work."
                </blockquote>
                <div className="flex items-center mt-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground">Michael Rodriguez, Founder</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Success Metrics */}
          <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-6">Join the Success Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-bold">92%</div>
                <div className="text-rose-100">of nonprofits see increased engagement</div>
              </div>
              <div>
                <div className="text-3xl font-bold">3.2x</div>
                <div className="text-rose-100">average donation increase</div>
              </div>
              <div>
                <div className="text-3xl font-bold">78%</div>
                <div className="text-rose-100">improvement in donor retention</div>
              </div>
              <div>
                <div className="text-3xl font-bold">$2.3M+</div>
                <div className="text-rose-100">total donations processed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-muted/50 to-card/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Ready to Transform Your Fundraising?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of nonprofits who've already discovered the power of personalized impact stories. Start
            connecting your donors to the people they help today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup?audience=nonprofit">
              <Button
                size="lg"
                className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Heart className="w-5 h-5 mr-2" />
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300 transition-all duration-300 bg-transparent"
              >
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
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center border border-primary/20">
              <span className="text-primary-foreground font-bold text-sm drop-shadow-lg">N</span>
            </div>
            <span className="text-lg font-bold text-foreground">The NMBR</span>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Making every donation personal. Transforming nonprofit fundraising through meaningful connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup?audience=nonprofit">
              <Button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-lg">
                <Gift className="w-4 h-4 mr-2" />
                Start Your Free Trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300 bg-transparent"
              >
                <Heart className="w-4 h-4 mr-2" />
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
