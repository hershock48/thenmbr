"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Heart, Search, Home, Grid3X3, User, Bell, Share2, BookOpen, Clock, MapPin, Wifi, WifiOff } from "lucide-react"

export default function MobilePWA() {
  const [activeTab, setActiveTab] = useState("home")
  const [isOnline, setIsOnline] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  // Mock story data
  const stories = [
    {
      id: "1",
      title: "Clean Water for Rural Communities",
      excerpt: "How your donation helped bring fresh water to 500 families in Kenya...",
      image: "/water-well-village.jpg",
      category: "Water",
      readTime: "3 min",
      location: "Kenya",
      impact: "500 families served",
    },
    {
      id: "2",
      title: "Education Changes Everything",
      excerpt: "Meet Sarah, whose scholarship opened doors to a brighter future...",
      image: "/school-children-books.jpg",
      category: "Education",
      readTime: "5 min",
      location: "Guatemala",
      impact: "25 students supported",
    },
    {
      id: "3",
      title: "Healthcare in Remote Areas",
      excerpt: "Mobile clinics bring essential medical care to underserved regions...",
      image: "/medical-equipment-clinic.jpg",
      category: "Healthcare",
      readTime: "4 min",
      location: "Bangladesh",
      impact: "1,200 patients treated",
    },
  ]

  const categories = ["All", "Water", "Education", "Healthcare", "Community"]

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const toggleFavorite = (storyId: string) => {
    setFavorites((prev) => (prev.includes(storyId) ? prev.filter((id) => id !== storyId) : [...prev, storyId]))
  }

  const filteredStories = stories.filter(
    (story) =>
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-secondary text-secondary-foreground px-4 py-2 text-sm flex items-center gap-2">
          <WifiOff className="h-4 w-4" />
          You're offline. Stories are cached for reading.
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">N</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-secondary-foreground text-xs font-bold">#</span>
              </div>
            </div>
            <h1 className="text-lg font-bold text-foreground">Stories</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-primary" />
              ) : (
                <WifiOff className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="p-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className="whitespace-nowrap cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Story Grid */}
      <main className="px-4 pb-20">
        <div className="grid gap-4">
          {filteredStories.map((story) => (
            <Card key={story.id} className="overflow-hidden border-border bg-card hover:shadow-md transition-shadow">
              <div className="aspect-video relative overflow-hidden">
                <img src={story.image || "/placeholder.svg"} alt={story.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 w-8 p-0 bg-background/80 backdrop-blur"
                    onClick={() => toggleFavorite(story.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        favorites.includes(story.id) ? "fill-red-500 text-red-500" : "text-foreground"
                      }`}
                    />
                  </Button>
                  <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-background/80 backdrop-blur">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                    {story.category}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-card-foreground mb-2 line-clamp-2">{story.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{story.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {story.readTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {story.location}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-primary">{story.impact}</span>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Read Story
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-2">No stories found</div>
            <div className="text-sm text-muted-foreground">Try adjusting your search</div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <div className="flex items-center justify-around py-2">
          {[
            { id: "home", icon: Home, label: "Home" },
            { id: "categories", icon: Grid3X3, label: "Categories" },
            { id: "favorites", icon: Heart, label: "Favorites" },
            { id: "profile", icon: User, label: "Profile" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                activeTab === tab.id ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
