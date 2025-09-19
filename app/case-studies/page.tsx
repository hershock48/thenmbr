"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ArrowRight, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Heart,
  Globe,
  Award,
  Quote
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const caseStudies = [
  {
    id: "clean-water-initiative",
    title: "Clean Water Initiative: 60% Increase in Donor Engagement",
    organization: "Clean Water Initiative",
    category: "Environmental",
    challenge: "Low donor retention and limited engagement with traditional fundraising appeals",
    solution: "Implemented NMBR codes on event t-shirts and water bottles, connecting donors directly to impact stories",
    results: {
      donorEngagement: "60%",
      revenueIncrease: "45%",
      donorRetention: "40%",
      totalRaised: "$127,000"
    },
    testimonial: {
      quote: "NMBR technology transformed our fundraising. We added codes to our event t-shirts and saw a 60% increase in donor engagement. Now every product we sell tells our story and connects donors to our impact.",
      author: "Sarah Johnson",
      role: "Development Director"
    },
    image: "/api/placeholder/400/300",
    tags: ["Environmental", "Event Fundraising", "Donor Engagement"]
  },
  {
    id: "youth-education-foundation",
    title: "Youth Education Foundation: 300% Growth in Monthly Donations",
    organization: "Youth Education Foundation",
    category: "Education",
    challenge: "Struggling to show tangible impact of donations and build long-term donor relationships",
    solution: "Created personalized NMBR codes for each sponsored student, allowing donors to follow their journey",
    results: {
      donorEngagement: "85%",
      revenueIncrease: "300%",
      donorRetention: "70%",
      totalRaised: "$89,000"
    },
    testimonial: {
      quote: "The NMBR platform helped us show donors exactly how their money helps real students. Our monthly donations tripled because people could see the direct impact of their support.",
      author: "Michael Chen",
      role: "Executive Director"
    },
    image: "/api/placeholder/400/300",
    tags: ["Education", "Student Sponsorship", "Monthly Giving"]
  },
  {
    id: "animal-rescue-shelter",
    title: "Paws & Hearts Rescue: 200% Increase in Adoption Donations",
    organization: "Paws & Hearts Rescue",
    category: "Animal Welfare",
    challenge: "Need to increase donations while showing the real impact on rescued animals",
    solution: "Added NMBR codes to adoption merchandise and fundraising products, linking to individual animal stories",
    results: {
      donorEngagement: "75%",
      revenueIncrease: "200%",
      donorRetention: "55%",
      totalRaised: "$156,000"
    },
    testimonial: {
      quote: "Our supporters love being able to follow the journey of the animals they help rescue. NMBR codes on our merchandise create an emotional connection that drives donations.",
      author: "Lisa Rodriguez",
      role: "Fundraising Coordinator"
    },
    image: "/api/placeholder/400/300",
    tags: ["Animal Welfare", "Adoption", "Merchandise"]
  },
  {
    id: "homeless-shelter-network",
    title: "Hope Haven Network: 150% Growth in Corporate Partnerships",
    organization: "Hope Haven Network",
    category: "Social Services",
    challenge: "Difficulty demonstrating impact to corporate sponsors and individual donors",
    solution: "Implemented NMBR codes on all fundraising materials and corporate partnership products",
    results: {
      donorEngagement: "80%",
      revenueIncrease: "150%",
      donorRetention: "65%",
      totalRaised: "$234,000"
    },
    testimonial: {
      quote: "Corporate partners can now see exactly how their support helps real families. The transparency and storytelling capabilities of NMBR have been game-changing for our partnerships.",
      author: "David Thompson",
      role: "Partnership Director"
    },
    image: "/api/placeholder/400/300",
    tags: ["Social Services", "Corporate Partnerships", "Transparency"]
  }
]

const stats = [
  {
    icon: TrendingUp,
    value: "78%",
    label: "Average Increase in Donor Engagement",
    description: "When using NMBR technology"
  },
  {
    icon: DollarSign,
    value: "$2.3M",
    label: "Total Funds Raised",
    description: "Through NMBR-powered products"
  },
  {
    icon: Users,
    value: "500+",
    label: "Nonprofits Using NMBR",
    description: "Across various causes and sectors"
  },
  {
    icon: Heart,
    value: "85%",
    label: "Donor Satisfaction Rate",
    description: "When engaging with NMBR stories"
  }
]

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs">#</span>
                </div>
              </div>
              <span className="text-xl font-bold text-foreground">The NMBR</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/demo" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Demo
              </Link>
              <Link href="/case-studies" className="text-sm font-medium text-foreground">
                Success Stories
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Start Free Trial</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit mx-auto">
                <Award className="w-4 h-4 mr-2" />
                Real Results from Real Organizations
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
                Success Stories That
                <span className="text-primary"> Inspire Action</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                See how nonprofits are using NMBR technology to increase donations, 
                engage donors, and create lasting impact through story-driven fundraising.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-primary/10">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm font-medium text-foreground mb-1">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.description}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Real Organizations, Real Results</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover how nonprofits across different sectors are using NMBR technology 
              to transform their fundraising and create deeper donor connections.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {caseStudies.map((study) => (
              <Card key={study.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{study.category}</Badge>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Success Story
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{study.title}</CardTitle>
                      <CardDescription className="text-lg font-medium text-primary">
                        {study.organization}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Challenge & Solution */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Challenge:</h4>
                      <p className="text-sm text-muted-foreground">{study.challenge}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Solution:</h4>
                      <p className="text-sm text-muted-foreground">{study.solution}</p>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{study.results.donorEngagement}</div>
                      <div className="text-xs text-green-700">Donor Engagement</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{study.results.revenueIncrease}</div>
                      <div className="text-xs text-blue-700">Revenue Increase</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{study.results.donorRetention}</div>
                      <div className="text-xs text-purple-700">Donor Retention</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{study.results.totalRaised}</div>
                      <div className="text-xs text-orange-700">Total Raised</div>
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Quote className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div className="space-y-2">
                        <p className="text-sm italic text-muted-foreground">
                          "{study.testimonial.quote}"
                        </p>
                        <div className="text-sm">
                          <div className="font-semibold text-foreground">{study.testimonial.author}</div>
                          <div className="text-muted-foreground">{study.testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {study.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold">Ready to Create Your Success Story?</h2>
            <p className="text-xl opacity-90">
              Join hundreds of nonprofits already using NMBR to create sustainable 
              donor relationships and increase their impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                <Link href="/signup">
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white/50 text-white hover:bg-white hover:text-primary bg-white/10 backdrop-blur-sm" asChild>
                <Link href="/demo">
                  <Globe className="w-5 h-5 mr-2" />
                  See Live Demo
                </Link>
              </Button>
            </div>
            <p className="text-sm opacity-75">
              Setup takes less than 5 minutes • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 NMBR Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
