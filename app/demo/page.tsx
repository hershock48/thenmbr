'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Heart, Users, DollarSign, ArrowRight, CheckCircle, Star, Shield, Zap, Target, Gift, Settings, LogIn, UserPlus, Eye, Play, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function DemoPage() {
  const [searchValue, setSearchValue] = useState('')
  const [searchError, setSearchError] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchSuccess, setSearchSuccess] = useState(false)

  const validNumbers = ['1', '2', '3']
  
  const handleSearch = () => {
    if (!searchValue.trim()) {
      setSearchError('Please enter a story number')
      return
    }
    
    if (!validNumbers.includes(searchValue.trim())) {
      setSearchError('Please enter 1, 2, or 3')
      return
    }
    
    setSearchError('')
    setIsSearching(true)
    setSearchSuccess(false)
    
    // Simulate search delay
    setTimeout(() => {
      window.open(`/widget?org=demo-org-123&type=story-search&nmbr=${searchValue.trim()}`, '_blank')
      setIsSearching(false)
      setSearchSuccess(true)
      setSearchValue('')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSearchSuccess(false), 3000)
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
    if (searchError) {
      setSearchError('')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-50 supports-[backdrop-filter]:bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity">
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
              <Link href="/">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180 sm:mr-2" />
                  <span className="hidden sm:inline">Back to Home</span>
                  <span className="sm:hidden">Home</span>
                </Button>
              </Link>
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
                This is exactly what your donors will see on your website. Search for a story using the numbers 1, 2, or 3, or click the buttons below to try different stories.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white rounded-lg border-2 border-cyan-200 p-6 shadow-lg">
                <div className="mb-4">
                  <Label htmlFor="demo-search" className="text-sm font-medium text-gray-700 mb-2 block">
                    Search for a story by number:
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        id="demo-search"
                        placeholder="Try: 1, 2, or 3"
                        value={searchValue}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        className={`flex-1 ${
                          searchError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 
                          searchSuccess ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20' : 
                          'border-gray-300 focus:border-cyan-500 focus:ring-cyan-500/20'
                        }`}
                        disabled={isSearching}
                        aria-describedby={searchError ? "search-error" : searchSuccess ? "search-success" : undefined}
                      />
                      {searchError && (
                        <p id="search-error" className="text-red-600 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {searchError}
                        </p>
                      )}
                      {searchSuccess && (
                        <p id="search-success" className="text-green-600 text-xs mt-1 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Story opened in new tab!
                        </p>
                      )}
                    </div>
                    <Button 
                      onClick={handleSearch}
                      disabled={isSearching || !searchValue.trim()}
                      className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={isSearching ? "Opening story..." : "Search for story"}
                    >
                      {isSearching ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Opening...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Find Story
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-12 border-2 border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300 transition-all duration-300"
                    onClick={() => {
                      setSearchValue('1')
                      handleSearch()
                    }}
                    disabled={isSearching}
                    aria-label="Try Story #1 - Maria's Education Journey"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Story #1
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300"
                    onClick={() => {
                      setSearchValue('2')
                      handleSearch()
                    }}
                    disabled={isSearching}
                    aria-label="Try Story #2 - Clean Water for Village"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Story #2
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-300"
                    onClick={() => {
                      setSearchValue('3')
                      handleSearch()
                    }}
                    disabled={isSearching}
                    aria-label="Try Story #3 - Medical Equipment Fund"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Story #3
                  </Button>
                </div>
                
                {/* Instructions */}
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-bold">i</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900 mb-1">How to try the demo:</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Type 1, 2, or 3 in the search box above</li>
                        <li>• Or click any of the story buttons below</li>
                        <li>• The story will open in a new tab</li>
                        <li>• This shows exactly what your donors will see</li>
                      </ul>
                    </div>
                  </div>
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
