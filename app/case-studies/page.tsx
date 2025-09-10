"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ArrowRight, 
  ExternalLink, 
  Star, 
  TrendingUp, 
  Users, 
  DollarSign,
  Hash,
  Mail,
  ShoppingCart,
  BarChart3,
  CheckCircle,
  Quote,
  Building2,
  Globe,
  Heart,
  Coffee,
  Sprout
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const caseStudies = [
  {
    id: 'marias-coffee',
    title: "Maria's Coffee Cooperative",
    subtitle: "From Local Farmer to Global Brand",
    industry: "Agriculture & Fair Trade",
    challenge: "Maria's coffee cooperative needed to compete with large coffee brands while maintaining their authentic story and fair trade values. They struggled to connect with customers who valued sustainability and social impact.",
    solution: "NMBR helped Maria's cooperative create compelling stories about their farmers, sustainable practices, and community impact. They launched a white-label storefront with story-driven product pages and integrated email campaigns.",
    results: {
      revenue: 2847,
      orders: 127,
      conversionRate: 4.2,
      subscriberGrowth: 300,
      avgOrderValue: 22.4
    },
    quote: "NMBR transformed how we tell our story. Customers don't just buy our coffee - they become part of our mission to support sustainable farming communities.",
    author: "Maria Rodriguez",
    role: "Cooperative Director",
    logo: "☕",
    color: "from-amber-500 to-orange-600",
    metrics: [
      { label: "Monthly Revenue", value: "$2,847", change: "+340%" },
      { label: "Orders", value: "127", change: "+280%" },
      { label: "Conversion Rate", value: "4.2%", change: "+2.1%" },
      { label: "Subscribers", value: "300+", change: "+400%" }
    ],
    features: [
      "White-label storefront",
      "Story-driven product pages", 
      "Email campaign automation",
      "Attribution tracking",
      "Multi-language support"
    ]
  },
  {
    id: 'green-thumbs',
    title: "Green Thumbs Initiative",
    subtitle: "Growing Community Through Story",
    industry: "Environmental Nonprofit",
    challenge: "Green Thumbs needed to increase donor engagement and create sustainable revenue streams beyond traditional fundraising. They wanted to show the direct impact of donations through compelling stories.",
    solution: "NMBR enabled Green Thumbs to create detailed impact stories linked to specific products and programs. They launched targeted email campaigns and integrated product sales with their fundraising efforts.",
    results: {
      revenue: 15600,
      orders: 89,
      conversionRate: 3.8,
      subscriberGrowth: 450,
      avgOrderValue: 175
    },
    quote: "NMBR helped us turn our impact stories into revenue. Now every donation and purchase directly supports our community garden programs.",
    author: "Dr. Sarah Chen",
    role: "Executive Director",
    logo: "🌱",
    color: "from-green-500 to-emerald-600",
    metrics: [
      { label: "Quarterly Revenue", value: "$15,600", change: "+250%" },
      { label: "Donor Retention", value: "78%", change: "+35%" },
      { label: "Average Donation", value: "$175", change: "+120%" },
      { label: "Story Engagement", value: "89%", change: "+200%" }
    ],
    features: [
      "Impact story tracking",
      "Donor engagement tools",
      "Product fundraising",
      "Community garden integration",
      "Volunteer coordination"
    ]
  },
  {
    id: 'local-business',
    title: "Artisan Craft Collective",
    subtitle: "Small Business, Big Impact",
    industry: "Local Retail & Crafts",
    challenge: "A local artisan collective struggled to compete with online marketplaces and large retailers. They needed a way to tell their story and connect with customers who valued handmade, local products.",
    solution: "NMBR provided a custom storefront with detailed artisan profiles, behind-the-scenes stories, and integrated social media. They launched targeted campaigns to local communities and craft enthusiasts.",
    results: {
      revenue: 8900,
      orders: 156,
      conversionRate: 5.1,
      subscriberGrowth: 200,
      avgOrderValue: 57
    },
    quote: "NMBR gave us a platform to compete with the big guys. Our customers love hearing the stories behind each handmade piece.",
    author: "James Wilson",
    role: "Collective Founder",
    logo: "🎨",
    color: "from-purple-500 to-pink-600",
    metrics: [
      { label: "Monthly Revenue", value: "$8,900", change: "+180%" },
      { label: "Online Orders", value: "156", change: "+220%" },
      { label: "Conversion Rate", value: "5.1%", change: "+3.2%" },
      { label: "Local Reach", value: "2,000+", change: "+150%" }
    ],
    features: [
      "Artisan profiles",
      "Behind-the-scenes content",
      "Local community targeting",
      "Social media integration",
      "Custom product showcases"
    ]
  }
]

const testimonials = [
  {
    quote: "NMBR transformed our fundraising. We went from struggling to meet goals to exceeding them by 300% in just 6 months.",
    author: "Maria Rodriguez",
    role: "Cooperative Director",
    company: "Maria's Coffee",
    rating: 5
  },
  {
    quote: "The attribution tracking is incredible. We can see exactly which stories drive the most engagement and revenue.",
    author: "Dr. Sarah Chen", 
    role: "Executive Director",
    company: "Green Thumbs Initiative",
    rating: 5
  },
  {
    quote: "As a small business, NMBR gave us the tools to compete with much larger companies. Our customers love the personal touch.",
    author: "James Wilson",
    role: "Collective Founder", 
    company: "Artisan Craft Collective",
    rating: 5
  }
]

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              <Star className="w-4 h-4 mr-2" />
              Success Stories
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Real Results from
              <span className="text-primary"> Real Organizations</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              See how organizations like yours are using NMBR to turn their stories into sustainable revenue streams and meaningful impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Your Success Story
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <ExternalLink className="w-5 h-5 mr-2" />
                View Live Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-20">
            {caseStudies.map((study, index) => (
              <div key={study.id} className={`${index % 2 === 1 ? 'lg:flex-row-reverse' : ''} flex flex-col lg:flex-row gap-12 items-center`}>
                <div className="flex-1">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-4xl">{study.logo}</div>
                        <div>
                          <CardTitle className="text-2xl">{study.title}</CardTitle>
                          <CardDescription className="text-lg">{study.subtitle}</CardDescription>
                          <Badge variant="outline" className="mt-2">{study.industry}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-2">Challenge</h3>
                        <p className="text-muted-foreground">{study.challenge}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Solution</h3>
                        <p className="text-muted-foreground">{study.solution}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <Quote className="w-6 h-6 text-primary mb-2" />
                        <p className="italic mb-2">"{study.quote}"</p>
                        <p className="text-sm font-medium">— {study.author}, {study.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex-1">
                  <div className="space-y-6">
                    {/* Results Metrics */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          Results
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          {study.metrics.map((metric, idx) => (
                            <div key={idx} className="text-center">
                              <div className="text-2xl font-bold text-primary">{metric.value}</div>
                              <div className="text-sm text-muted-foreground">{metric.label}</div>
                              <div className="text-xs text-green-600 font-medium">{metric.change}</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Features Used */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                          Features Used
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {study.features.map((feature, idx) => (
                            <Badge key={idx} variant="secondary">{feature}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">What Our Customers Say</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Don't just take our word for it - hear from the organizations using NMBR to drive real results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-primary mb-4" />
                  <p className="italic mb-4">"{testimonial.quote}"</p>
                  <div className="border-t pt-4">
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-sm text-primary font-medium">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Proven Results Across Industries</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Organizations across different sectors are seeing remarkable results with NMBR
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">300%</div>
                <p className="text-sm text-muted-foreground">Average Revenue Increase</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">4.2%</div>
                <p className="text-sm text-muted-foreground">Average Conversion Rate</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">$2.8M</div>
                <p className="text-sm text-muted-foreground">Total Revenue Generated</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Hash className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
                <p className="text-sm text-muted-foreground">Active Stories</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h3 className="text-4xl font-bold">Ready to Write Your Success Story?</h3>
            <p className="text-xl opacity-90">
              Join hundreds of organizations already using NMBR to create sustainable revenue streams from their impact stories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary">
                <ExternalLink className="w-5 h-5 mr-2" />
                View Live Demo
              </Button>
            </div>
            <p className="text-sm opacity-75">
              Setup takes less than 5 minutes • No credit card required
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
