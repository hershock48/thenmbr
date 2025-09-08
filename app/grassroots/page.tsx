"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, BarChart3, ArrowRight, Star, Target, Handshake, Shield, Zap, Sprout } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function GrassrootsPage() {
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
              <Link href="/signup?audience=grassroots">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg text-sm sm:text-base px-3 sm:px-4">
                  <span className="hidden sm:inline">Launch Your Project</span>
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
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-background to-teal-50/50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(20,184,166,0.1),transparent_50%)]"></div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-full px-3 sm:px-4 py-2 mb-6 sm:mb-8">
            <Users className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Empowering 300+ grassroots projects globally</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Turn Community Ideas Into
            <span className="block bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              Powerful Movements
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Transform local initiatives into compelling stories that inspire community support. Connect supporters
            directly to the projects they care about and watch your grassroots impact grow organically.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/signup?audience=grassroots">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Users className="w-5 h-5 mr-2" />
                Launch Your Project
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 bg-transparent"
              >
                <Target className="w-5 h-5 mr-2" />
                Explore Projects
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-600">300+</div>
              <div className="text-sm text-muted-foreground">Active Projects</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">$850K+</div>
              <div className="text-sm text-muted-foreground">Community Funding</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">25K+</div>
              <div className="text-sm text-muted-foreground">Community Members</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">4.1x</div>
              <div className="text-sm text-muted-foreground">Average Support Increase</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Built for Community Organizers</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple yet powerful tools designed for grassroots organizations who want to build authentic community
              connections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border hover:border-emerald-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-foreground">Community Building</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Build strong community connections through authentic storytelling that brings people together around
                  shared causes.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border hover:border-emerald-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-foreground">Project Management</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Simple tools to manage your grassroots projects, track progress, and keep supporters engaged
                  throughout the journey.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border hover:border-emerald-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-foreground">Supporter Analytics</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Understand your community better with insights into supporter engagement and project impact metrics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border hover:border-emerald-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Handshake className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-foreground">Volunteer Coordination</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Organize volunteers, coordinate events, and manage community participation with integrated tools.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border hover:border-emerald-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-foreground">Transparent Operations</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Build trust with complete transparency in funding, progress updates, and community impact reporting.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border hover:border-emerald-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-foreground">Quick Launch</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Get your grassroots project online in minutes with our simple setup process and community-focused
                  templates.
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
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Real Impact from Real Communities</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how grassroots organizers are building stronger communities and creating lasting change
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src="/school-children-books.jpg"
                    alt="Community Learning Hub"
                    width={60}
                    height={60}
                    className="rounded-lg"
                  />
                  <div>
                    <CardTitle className="text-lg">Community Learning Hub</CardTitle>
                    <CardDescription>After-school program in underserved neighborhood</CardDescription>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">180%</div>
                    <div className="text-sm text-muted-foreground">Support Increase</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">45</div>
                    <div className="text-sm text-muted-foreground">Active Volunteers</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="text-muted-foreground italic">
                  "The NMBR helped us show our community exactly how their support translates into real educational
                  opportunities for local kids. We went from struggling to find volunteers to having a waiting list."
                </blockquote>
                <div className="flex items-center mt-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground">Maria Santos, Community Organizer</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src="/medical-equipment-clinic.jpg"
                    alt="Mobile Health Clinic"
                    width={60}
                    height={60}
                    className="rounded-lg"
                  />
                  <div>
                    <CardTitle className="text-lg">Mobile Health Clinic</CardTitle>
                    <CardDescription>Healthcare access for rural communities</CardDescription>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">$65K</div>
                    <div className="text-sm text-muted-foreground">Community Raised</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">1,200+</div>
                    <div className="text-sm text-muted-foreground">People Served</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="text-muted-foreground italic">
                  "By sharing individual patient stories (with permission), our community could see the direct impact of
                  their contributions. The personal connection drove incredible grassroots support."
                </blockquote>
                <div className="flex items-center mt-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground">Dr. James Wilson, Project Lead</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Success Metrics */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-6">Join the Movement</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-bold">87%</div>
                <div className="text-emerald-100">of projects exceed funding goals</div>
              </div>
              <div>
                <div className="text-3xl font-bold">4.1x</div>
                <div className="text-emerald-100">average community support increase</div>
              </div>
              <div>
                <div className="text-3xl font-bold">92%</div>
                <div className="text-emerald-100">volunteer retention rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold">25K+</div>
                <div className="text-emerald-100">community members engaged</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-muted/50 to-card/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Ready to Build Your Community Movement?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of grassroots organizers who are creating lasting change in their communities. Start
            connecting your supporters to the projects they care about most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup?audience=grassroots">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Users className="w-5 h-5 mr-2" />
                Launch Your Project
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 bg-transparent"
              >
                <Target className="w-5 h-5 mr-2" />
                Explore Projects
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
            Empowering grassroots movements. Building stronger communities through authentic storytelling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup?audience=grassroots">
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg">
                <Sprout className="w-4 h-4 mr-2" />
                Start Your Project
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 bg-transparent"
              >
                <Users className="w-4 h-4 mr-2" />
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
