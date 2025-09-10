import { GlobalHeader } from "@/components/layout/global-header"
import { GlobalFooter } from "@/components/layout/global-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function BlogPage() {
  const posts = [
    {
      title: "The Future of Personalized Fundraising",
      excerpt: "How numbered stories are revolutionizing donor engagement and increasing donation amounts by 300%.",
      author: "Sarah Johnson",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "Fundraising"
    },
    {
      title: "Building Trust Through Transparency",
      excerpt: "Why donors give more when they can see exactly how their money is being used to help real people.",
      author: "Michael Chen",
      date: "2024-01-10",
      readTime: "4 min read",
      category: "Impact"
    },
    {
      title: "Case Study: Hope Foundation's Success",
      excerpt: "How Hope Foundation increased their fundraising by 250% using NMBR Platform's personalized approach.",
      author: "Emily Rodriguez",
      date: "2024-01-05",
      readTime: "6 min read",
      category: "Case Study"
    },
    {
      title: "The Psychology of Giving",
      excerpt: "Understanding what motivates people to donate and how personal connections drive generosity.",
      author: "Dr. James Wilson",
      date: "2024-01-01",
      readTime: "7 min read",
      category: "Research"
    },
    {
      title: "Getting Started with NMBR Platform",
      excerpt: "A step-by-step guide to setting up your first numbered story campaign and maximizing its impact.",
      author: "NMBR Team",
      date: "2023-12-28",
      readTime: "8 min read",
      category: "Tutorial"
    },
    {
      title: "Measuring Impact: Beyond the Numbers",
      excerpt: "How to track and communicate the real-world impact of your fundraising efforts to donors.",
      author: "Lisa Park",
      date: "2023-12-20",
      readTime: "5 min read",
      category: "Analytics"
    }
  ]

  const categories = ["All", "Fundraising", "Impact", "Case Study", "Research", "Tutorial", "Analytics"]

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader variant="default" />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">NMBR Blog</h1>
          <p className="text-xl text-muted-foreground">
            Insights, stories, and best practices for modern fundraising
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "All" ? "default" : "outline"}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
        
        {/* Featured Post */}
        <Card className="mb-12 bg-gradient-to-r from-cyan-50 to-purple-50 border-cyan-200">
          <CardContent className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs font-medium rounded">
                Featured
              </span>
              <span className="text-sm text-muted-foreground">{posts[0].category}</span>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-4">{posts[0].title}</h3>
            <p className="text-lg text-muted-foreground mb-6">{posts[0].excerpt}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {posts[0].author}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(posts[0].date).toLocaleDateString()}
              </div>
              <span>{posts[0].readTime}</span>
            </div>
            <Button>
              Read More
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
        
        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(1).map((post, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                    {post.category}
                  </span>
                </div>
                <CardTitle className="text-lg">{post.title}</CardTitle>
                <CardDescription>{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{post.readTime}</span>
                  <Button variant="ghost" size="sm">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Newsletter Signup */}
        <Card className="mt-12 bg-gradient-to-r from-cyan-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
            <p className="text-cyan-100 mb-6">
              Get the latest insights and tips delivered to your inbox
            </p>
            <div className="flex max-w-md mx-auto gap-2">
              <input
                type="email"
                id="newsletter-email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500"
                aria-label="Email address for newsletter subscription"
              />
              <Button variant="secondary">Subscribe</Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <GlobalFooter />
    </div>
  )
}
