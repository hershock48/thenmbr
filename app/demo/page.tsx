'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Heart, Users, DollarSign, ArrowRight, CheckCircle, Star, Shield, Zap, Target, Gift, Settings, LogIn, UserPlus, Eye, Play } from "lucide-react"
import Link from "next/link"

export default function DemoPage() {
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
              <span className="text-lg sm:text-2xl font-bold text-foreground hidden xs:block">The NMBR</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
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
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 via-background to-purple-50/50 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(8,145,178,0.1),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)] animate-pulse delay-1000"></div>

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-50 to-purple-50 border border-cyan-200 rounded-full px-3 sm:px-4 py-2 mb-6 sm:mb-8">
              <Play className="w-4 h-4 text-cyan-600" />
              <span className="text-sm font-medium text-cyan-700">Live Interactive Demo</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              See The Magic in
              <span className="block bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Real Time
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Experience how your donors will connect with personalized impact stories. Try our live widget below and see why nonprofits are falling in love with The NMBR.
            </p>
          </div>

          {/* Live Widget Demo */}
          <Card className="mb-12 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Target className="w-6 h-6 text-cyan-600" />
                Try Our Live Widget
              </CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                This is exactly what your donors will see on your website. Search for a story using the numbers 1, 2, or 3.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white rounded-lg border-2 border-cyan-200 p-6 shadow-lg">
                <div className="mb-4">
                  <Label htmlFor="demo-search" className="text-sm font-medium text-gray-700 mb-2 block">
                    Search for a story by number:
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="demo-search"
                      placeholder="Try: 1, 2, or 3"
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const value = (e.target as HTMLInputElement).value;
                          if (value === '1' || value === '2' || value === '3') {
                            window.open(`/widget?org=demo-org-123&type=story-search&nmbr=${value}`, '_blank');
                          }
                        }
                      }}
                    />
                    <Button 
                      onClick={() => {
                        const input = document.getElementById('demo-search') as HTMLInputElement;
                        const value = input.value;
                        if (value === '1' || value === '2' || value === '3') {
                          window.open(`/widget?org=demo-org-123&type=story-search&nmbr=${value}`, '_blank');
                        }
                      }}
                      className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Find Story
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-12 border-2 border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300 transition-all duration-300"
                    onClick={() => window.open('/widget?org=demo-org-123&type=story-search&nmbr=1', '_blank')}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Story #1
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300"
                    onClick={() => window.open('/widget?org=demo-org-123&type=story-search&nmbr=2', '_blank')}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Story #2
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-300"
                    onClick={() => window.open('/widget?org=demo-org-123&type=story-search&nmbr=3', '_blank')}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Story #3
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Backend Management System */}
          <Card className="mb-12 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Settings className="w-6 h-6 text-purple-600" />
                Your Complete Management System
              </CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                Our powerful dashboard gives you everything you need to create, manage, and grow your impact stories.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Story Management</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Create compelling impact stories</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Upload photos and videos</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Assign unique numbers to each story</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Track progress and updates</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Branding & Customization</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Match your organization's colors</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Upload your logo and fonts</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Preview changes in real-time</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Seamless brand integration</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Donor Management</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Track every supporter</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Segment by story preferences</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Automated follow-up sequences</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Export data and reports</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Analytics & Insights</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Real-time engagement metrics</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Donation tracking and trends</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Story performance analysis</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> ROI and impact reports</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
                <Link href="/login" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg">
                    <LogIn className="w-4 h-4 mr-2" />
                    Access Your Dashboard
                  </Button>
                </Link>
                <Link href="/signup" className="flex-1">
                  <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Your Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Why Choose The NMBR */}
          <Card className="bg-gradient-to-br from-green-500/10 to-cyan-500/10 border-green-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Star className="w-6 h-6 text-green-600" />
                Why Nonprofits Choose The NMBR
              </CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                Join hundreds of organizations who've transformed their fundraising with personalized impact stories.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Deeper Connections</h3>
                  <p className="text-muted-foreground text-sm">
                    Turn one-time donors into lifelong supporters by giving them a personal story to follow and champion.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Higher Engagement</h3>
                  <p className="text-muted-foreground text-sm">
                    See 3x more engagement when donors can connect with specific people and causes they care about.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Easy Implementation</h3>
                  <p className="text-muted-foreground text-sm">
                    Get up and running in minutes with our intuitive dashboard and simple widget integration.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                <Gift className="w-4 h-4 mr-2" />
                Start Your Free Trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300">
                <Eye className="w-4 h-4 mr-2" />
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
