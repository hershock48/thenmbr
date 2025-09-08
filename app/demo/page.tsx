"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Search,
  Heart,
  Users,
  DollarSign,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Target,
  Gift,
  Settings,
  LogIn,
  UserPlus,
  Eye,
  Play,
} from "lucide-react"
import Link from "next/link"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-base sm:text-lg">N</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">#</span>
                </div>
              </div>
              <span className="text-lg sm:text-2xl font-bold text-slate-900 hidden xs:block">The NMBR</span>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hidden sm:inline-flex">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg text-sm sm:text-base px-3 sm:px-4">
                  <span className="hidden sm:inline">Start Your Story</span>
                  <span className="sm:hidden">Start</span>
                  <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white"></div>

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 mb-8">
              <Play className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Live Interactive Demo</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6">
              See The Magic in
              <span className="block text-emerald-600">Real Time</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Experience how your supporters will connect with personalized impact stories. Try our live widget below
              and see why organizations choose The NMBR.
            </p>
          </div>

          <Card className="mb-12 border-emerald-200 shadow-lg bg-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
                <Target className="w-6 h-6 text-emerald-600" />
                Try Our Live Widget
              </CardTitle>
              <CardDescription className="text-slate-600 text-base">
                This is exactly what your supporters will see on your website. Search for a story using the numbers 1,
                2, or 3.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
                <div className="mb-4">
                  <Label htmlFor="demo-search" className="text-sm font-medium text-slate-700 mb-2 block">
                    Search for a story by number:
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="demo-search"
                      placeholder="Try: 1, 2, or 3"
                      className="flex-1 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          const value = (e.target as HTMLInputElement).value
                          if (value === "1" || value === "2" || value === "3") {
                            window.open(`/widget?org=demo-org-123&type=story-search&nmbr=${value}`, "_blank")
                          }
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        const input = document.getElementById("demo-search") as HTMLInputElement
                        const value = input.value
                        if (value === "1" || value === "2" || value === "3") {
                          window.open(`/widget?org=demo-org-123&type=story-search&nmbr=${value}`, "_blank")
                        }
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Find Story
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-12 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 bg-transparent"
                    onClick={() => window.open("/widget?org=demo-org-123&type=story-search&nmbr=1", "_blank")}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Story #1
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 bg-transparent"
                    onClick={() => window.open("/widget?org=demo-org-123&type=story-search&nmbr=2", "_blank")}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Story #2
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 bg-transparent"
                    onClick={() => window.open("/widget?org=demo-org-123&type=story-search&nmbr=3", "_blank")}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Story #3
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-12 border-slate-200 shadow-lg bg-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
                <Settings className="w-6 h-6 text-slate-600" />
                Complete Management System
              </CardTitle>
              <CardDescription className="text-slate-600 text-base">
                Everything you need to create, manage, and grow your impact stories.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    Story Management
                  </h3>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Create compelling impact stories
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Upload photos and videos
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Assign unique numbers to each story
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Track progress and updates
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    Branding & Customization
                  </h3>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Match your organization's colors
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Upload your logo and fonts
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Preview changes in real-time
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Seamless brand integration
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    Supporter Management
                  </h3>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Track every supporter
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Segment by story preferences
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Automated follow-up sequences
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Export data and reports
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    Analytics & Insights
                  </h3>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Real-time engagement metrics
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Tracking and trends
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Story performance analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> ROI and impact reports
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
                <Link href="/login" className="flex-1">
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                    <LogIn className="w-4 h-4 mr-2" />
                    Access Your Dashboard
                  </Button>
                </Link>
                <Link href="/signup" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Your Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-lg bg-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
                <Star className="w-6 h-6 text-emerald-600" />
                Why Organizations Choose The NMBR
              </CardTitle>
              <CardDescription className="text-slate-600 text-base">
                Join hundreds of organizations transforming their engagement with personalized impact stories.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Deeper Connections</h3>
                  <p className="text-slate-600 text-sm">
                    Turn one-time supporters into lifelong advocates by giving them a personal story to follow and
                    champion.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Higher Engagement</h3>
                  <p className="text-slate-600 text-sm">
                    See 3x more engagement when supporters can connect with specific people and causes they care about.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Easy Implementation</h3>
                  <p className="text-slate-600 text-sm">
                    Get up and running in minutes with our intuitive dashboard and simple widget integration.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="bg-slate-50 border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center space-x-2 mb-4 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-lg font-bold text-slate-900">The NMBR</span>
          </Link>
          <p className="text-sm text-slate-600 mb-6">
            Making every donation personal. Transforming engagement through meaningful connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Gift className="w-4 h-4 mr-2" />
                Start Your Free Trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-50 bg-transparent">
                <Eye className="w-4 h-4 mr-2" />
                Back to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
