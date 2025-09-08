"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, DollarSign, ArrowLeft, CheckCircle, Star, Target, Gift } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function WidgetPage() {
  const searchParams = useSearchParams()
  const org = searchParams.get('org')
  const type = searchParams.get('type')
  const nmbr = searchParams.get('nmbr')
  
  const [story, setStory] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Demo stories data
  const demoStories = {
    '1': {
      id: '1',
      title: 'Maria\'s Education Journey',
      description: 'Help Maria, a 12-year-old girl from Guatemala, continue her education. She dreams of becoming a teacher and helping other children in her community.',
      image: '/placeholder.jpg',
      currentAmount: 750,
      goalAmount: 1000,
      progress: 75,
      donorCount: 23,
      organization: 'Education for All',
      location: 'Guatemala',
      category: 'Education'
    },
    '2': {
      id: '2',
      title: 'Clean Water for Village',
      description: 'Bring clean, safe drinking water to a remote village in Kenya. This project will install a well and water purification system for 200 families.',
      image: '/placeholder.jpg',
      currentAmount: 2400,
      goalAmount: 5000,
      progress: 48,
      donorCount: 45,
      organization: 'Water for Life',
      location: 'Kenya',
      category: 'Water & Sanitation'
    },
    '3': {
      id: '3',
      title: 'Medical Equipment Fund',
      description: 'Provide essential medical equipment to a rural clinic in India. Help save lives with modern diagnostic tools and treatment equipment.',
      image: '/placeholder.jpg',
      currentAmount: 1200,
      goalAmount: 3000,
      progress: 40,
      donorCount: 18,
      organization: 'Health First',
      location: 'India',
      category: 'Healthcare'
    }
  }

  useEffect(() => {
    if (nmbr && demoStories[nmbr as keyof typeof demoStories]) {
      setStory(demoStories[nmbr as keyof typeof demoStories])
    }
    setLoading(false)
  }, [nmbr])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Story Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The story you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/demo">
              <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Demo
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-50 supports-[backdrop-filter]:bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/demo" className="flex items-center space-x-2 sm:space-x-3">
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
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                <CheckCircle className="w-3 h-3 mr-1" />
                Demo Mode
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Story Content */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-xl">
            <div className="aspect-video bg-gradient-to-br from-cyan-100 to-purple-100 flex items-center justify-center">
              <div className="text-center">
                <Heart className="w-16 h-16 text-cyan-600 mx-auto mb-4" />
                <p className="text-muted-foreground">Story Image Placeholder</p>
              </div>
            </div>
            
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <Badge className="mb-3 bg-cyan-100 text-cyan-700 hover:bg-cyan-100">
                    {story.category}
                  </Badge>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{story.title}</h1>
                  <p className="text-muted-foreground text-lg">{story.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">#{story.id}</div>
                  <div className="text-sm text-muted-foreground">Story Number</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground mb-1">${story.currentAmount.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Raised</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground mb-1">{story.donorCount}</div>
                  <div className="text-sm text-muted-foreground">Supporters</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground mb-1">{story.progress}%</div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Progress to ${story.goalAmount.toLocaleString()} goal</span>
                  <span>{story.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${story.progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Organization</h3>
                  <p className="text-muted-foreground">{story.organization}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Location</h3>
                  <p className="text-muted-foreground">{story.location}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white shadow-lg">
                  <Heart className="w-4 h-4 mr-2" />
                  Support This Story
                </Button>
                <Button variant="outline" className="flex-1 border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300">
                  <Users className="w-4 h-4 mr-2" />
                  Share with Friends
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Demo Info */}
          <Card className="mt-8 bg-gradient-to-br from-cyan-50 to-purple-50 border-cyan-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">This is a Demo Story</h3>
                  <p className="text-muted-foreground mb-4">
                    This is exactly what your donors will see when they search for a story on your website. 
                    The widget is fully customizable to match your brand and can be embedded anywhere.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/demo">
                      <Button variant="outline" className="border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Demo
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white">
                        <Gift className="w-4 h-4 mr-2" />
                        Create Your Own Stories
                      </Button>
                    </Link>
                  </div>
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
        </div>
      </footer>
    </div>
  )
}