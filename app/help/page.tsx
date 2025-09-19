"use client"

import type React from "react"

import { useState } from "react"
import {
  Search,
  Book,
  MessageCircle,
  FileText,
  Settings,
  BarChart3,
  QrCode,
  Users,
  ChevronRight,
  Play,
  Mail,
  Phone,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

const categories = [
  {
    title: "Getting Started",
    description: "Learn the basics of story-driven commerce",
    icon: Book,
    articles: 12,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Story Creation",
    description: "Create compelling product stories",
    icon: FileText,
    articles: 8,
    color: "bg-secondary/10 text-secondary",
  },
  {
    title: "QR Code Management",
    description: "Generate and track QR codes",
    icon: QrCode,
    articles: 6,
    color: "bg-accent/10 text-accent",
  },
  {
    title: "Analytics & Reporting",
    description: "Track performance and ROI",
    icon: BarChart3,
    articles: 10,
    color: "bg-muted/50 text-muted-foreground",
  },
  {
    title: "Integrations",
    description: "Connect with e-commerce platforms",
    icon: Settings,
    articles: 7,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Team Management",
    description: "Manage users and permissions",
    icon: Users,
    articles: 5,
    color: "bg-secondary/10 text-secondary",
  },
]

const popularArticles = [
  {
    title: "How to Create Your First Product Story",
    category: "Getting Started",
    readTime: "5 min read",
    views: 1234,
  },
  {
    title: "Setting Up QR Codes for Maximum Engagement",
    category: "QR Code Management",
    readTime: "8 min read",
    views: 987,
  },
  {
    title: "Understanding Story-to-Purchase Analytics",
    category: "Analytics & Reporting",
    readTime: "6 min read",
    views: 856,
  },
  {
    title: "Connecting Your Shopify Store",
    category: "Integrations",
    readTime: "10 min read",
    views: 743,
  },
]

const videoTutorials = [
  {
    title: "Platform Overview: Story-Driven Commerce Basics",
    duration: "12:34",
    thumbnail: "/video-tutorial-thumbnail.png",
    category: "Getting Started",
  },
  {
    title: "Creating Your First Story Campaign",
    duration: "8:45",
    thumbnail: "/story-creation-tutorial.jpg",
    category: "Story Creation",
  },
  {
    title: "Advanced Analytics Deep Dive",
    duration: "15:22",
    thumbnail: "/analytics-dashboard-tutorial.png",
    category: "Analytics",
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Contact form submitted:", contactForm)
    // Reset form
    setContactForm({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Find answers, learn best practices, and get the most out of your story-driven commerce platform
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for articles, tutorials, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-4 text-lg bg-background text-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Categories Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.title} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${category.color}`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary">{category.articles} articles</Badge>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground group-hover:text-primary transition-colors">
                    View articles
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Popular Articles */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularArticles.map((article, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{article.category}</Badge>
                    <span className="text-sm text-muted-foreground">{article.views} views</span>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{article.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {article.readTime}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Video Tutorials */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Video Tutorials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoTutorials.map((video, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="relative">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <div className="bg-primary text-primary-foreground rounded-full p-4 group-hover:scale-110 transition-transform">
                      <Play className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                </div>
                <CardHeader>
                  <Badge variant="outline" className="w-fit">
                    {video.category}
                  </Badge>
                  <CardTitle className="group-hover:text-primary transition-colors">{video.title}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-8">Still Need Help?</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Options */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                    Live Chat
                  </CardTitle>
                  <CardDescription>Get instant help from our support team</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Start Live Chat</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-primary" />
                    Email Support
                  </CardTitle>
                  <CardDescription>
                    Send us a detailed message and we'll get back to you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    Send Email
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-primary" />
                    Phone Support
                  </CardTitle>
                  <CardDescription>Call us during business hours (9 AM - 6 PM EST)</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    +1 (555) 123-4567
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you as soon as possible</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Name</label>
                      <Input
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                      <Input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Subject</label>
                    <Input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Message</label>
                    <Textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
