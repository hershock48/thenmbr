"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  X, 
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
  Zap,
  Shield,
  Globe,
  Clock,
  Target,
  Award,
  Crown
} from "lucide-react"
import Link from "next/link"

const competitors = [
  {
    name: "Shopify",
    category: "E-Commerce Platform",
    logo: "🛍️",
    description: "Popular e-commerce platform for online stores",
    strengths: [
      "Easy store setup",
      "Payment processing",
      "Inventory management",
      "App marketplace"
    ],
    weaknesses: [
      "No story-driven marketing",
      "Limited attribution tracking",
      "Generic customer experience",
      "No NMBR integration"
    ],
    pricing: "From $29/month",
    rating: 4.2,
    users: "4.6M+ stores"
  },
  {
    name: "Mailchimp",
    category: "Email Marketing",
    logo: "📧",
    description: "Email marketing and automation platform",
    strengths: [
      "Email automation",
      "Audience segmentation",
      "A/B testing",
      "Analytics dashboard"
    ],
    weaknesses: [
      "No story integration",
      "Limited commerce features",
      "No attribution tracking",
      "Generic templates"
    ],
    pricing: "From $10/month",
    rating: 4.1,
    users: "13M+ users"
  },
  {
    name: "WooCommerce",
    category: "WordPress E-Commerce",
    logo: "🛒",
    description: "WordPress plugin for e-commerce functionality",
    strengths: [
      "WordPress integration",
      "Customizable",
      "Large plugin ecosystem",
      "Open source"
    ],
    weaknesses: [
      "Technical complexity",
      "No built-in marketing",
      "Limited attribution",
      "Requires hosting"
    ],
    pricing: "Free + hosting",
    rating: 4.3,
    users: "5M+ sites"
  },
  {
    name: "Constant Contact",
    category: "Email Marketing",
    logo: "📬",
    description: "Email marketing and social media management",
    strengths: [
      "User-friendly interface",
      "Social media tools",
      "Event management",
      "Customer support"
    ],
    weaknesses: [
      "No story features",
      "Limited automation",
      "No commerce integration",
      "Basic analytics"
    ],
    pricing: "From $12/month",
    rating: 3.9,
    users: "650K+ users"
  }
]

const nmbrAdvantages = [
  {
    icon: <Hash className="w-6 h-6 text-primary" />,
    title: "Story-Driven Commerce",
    description: "The only platform that combines storytelling with commerce and attribution tracking",
    competitors: "None offer this combination"
  },
  {
    icon: <Target className="w-6 h-6 text-green-600" />,
    title: "Complete Attribution Tracking",
    description: "Track every interaction from story view to purchase with detailed analytics",
    competitors: "Limited or no attribution"
  },
  {
    icon: <Users className="w-6 h-6 text-blue-600" />,
    title: "Multi-Channel Engagement",
    description: "Email, SMS, push notifications, and in-platform supporter feed",
    competitors: "Single channel focus"
  },
  {
    icon: <ShoppingCart className="w-6 h-6 text-purple-600" />,
    title: "White-Label Storefronts",
    description: "Custom branded storefronts with story integration",
    competitors: "Generic storefronts only"
  },
  {
    icon: <Globe className="w-6 h-6 text-orange-600" />,
    title: "Global Marketplace",
    description: "Sell through our global marketplace with built-in distribution",
    competitors: "No marketplace integration"
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-red-600" />,
    title: "Advanced Analytics",
    description: "Revenue forecasting, cohort analysis, and predictive insights",
    competitors: "Basic reporting only"
  }
]

const comparisonFeatures = [
  {
    feature: "Story-Driven Marketing",
    nmbr: true,
    shopify: false,
    mailchimp: false,
    woocommerce: false,
    constantContact: false
  },
  {
    feature: "Attribution Tracking",
    nmbr: true,
    shopify: false,
    mailchimp: false,
    woocommerce: false,
    constantContact: false
  },
  {
    feature: "White-Label Storefronts",
    nmbr: true,
    shopify: false,
    mailchimp: false,
    woocommerce: false,
    constantContact: false
  },
  {
    feature: "Multi-Channel Communication",
    nmbr: true,
    shopify: false,
    mailchimp: true,
    woocommerce: false,
    constantContact: true
  },
  {
    feature: "Global Marketplace",
    nmbr: true,
    shopify: false,
    mailchimp: false,
    woocommerce: false,
    constantContact: false
  },
  {
    feature: "Revenue Forecasting",
    nmbr: true,
    shopify: false,
    mailchimp: false,
    woocommerce: false,
    constantContact: false
  },
  {
    feature: "E-Commerce Platform",
    nmbr: true,
    shopify: true,
    mailchimp: false,
    woocommerce: true,
    constantContact: false
  },
  {
    feature: "Email Marketing",
    nmbr: true,
    shopify: false,
    mailchimp: true,
    woocommerce: false,
    constantContact: true
  },
  {
    feature: "Analytics Dashboard",
    nmbr: true,
    shopify: true,
    mailchimp: true,
    woocommerce: true,
    constantContact: true
  },
  {
    feature: "Mobile App",
    nmbr: true,
    shopify: true,
    mailchimp: true,
    woocommerce: false,
    constantContact: true
  }
]

const testimonials = [
  {
    quote: "NMBR is the only platform that truly understands how to turn stories into revenue. We've tried everything else, but nothing comes close.",
    author: "Sarah Chen",
    role: "Marketing Director",
    company: "Green Thumbs Initiative",
    rating: 5
  },
  {
    quote: "The attribution tracking alone makes NMBR worth it. We can finally see exactly how our stories drive sales.",
    author: "Mike Rodriguez",
    role: "CEO",
    company: "Artisan Collective",
    rating: 5
  },
  {
    quote: "We switched from Shopify + Mailchimp to NMBR and saw a 300% increase in conversion rates. The story integration is game-changing.",
    author: "Lisa Wang",
    role: "Founder",
    company: "Sustainable Goods Co",
    rating: 5
  }
]

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              <Award className="w-4 h-4 mr-2" />
              Platform Comparison
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Why NMBR is
              <span className="text-primary"> Different</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              See how NMBR compares to other platforms. We're not just another e-commerce or email marketing tool - 
              we're the only platform that combines storytelling, commerce, and attribution tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Free Trial
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

      {/* NMBR Advantages */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">What Makes NMBR Unique?</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              While other platforms focus on single functions, NMBR combines everything you need in one integrated solution
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {nmbrAdvantages.map((advantage, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {advantage.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center">{advantage.title}</h3>
                  <p className="text-muted-foreground text-center mb-4">{advantage.description}</p>
                  <div className="text-center">
                    <Badge variant="outline" className="text-xs">
                      {advantage.competitors}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Competitor Overview */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">How We Compare</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how NMBR stacks up against popular alternatives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {competitors.map((competitor) => (
              <Card key={competitor.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">{competitor.logo}</div>
                    <div>
                      <CardTitle className="text-lg">{competitor.name}</CardTitle>
                      <CardDescription className="text-xs">{competitor.category}</CardDescription>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{competitor.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{competitor.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Users</span>
                    <span className="font-medium">{competitor.users}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Pricing</span>
                    <span className="font-medium">{competitor.pricing}</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Strengths</h3>
                    <ul className="space-y-1">
                      {competitor.strengths.slice(0, 2).map((strength, index) => (
                        <li key={index} className="flex items-center gap-2 text-xs">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Limitations</h3>
                    <ul className="space-y-1">
                      {competitor.weaknesses.slice(0, 2).map((weakness, index) => (
                        <li key={index} className="flex items-center gap-2 text-xs">
                          <X className="w-3 h-3 text-red-600" />
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Feature Comparison</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Detailed comparison of key features across platforms
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold">
                    <div className="flex items-center justify-center gap-2">
                      <Crown className="w-5 h-5 text-primary" />
                      NMBR
                    </div>
                  </th>
                  <th className="text-center p-4 font-semibold">Shopify</th>
                  <th className="text-center p-4 font-semibold">Mailchimp</th>
                  <th className="text-center p-4 font-semibold">WooCommerce</th>
                  <th className="text-center p-4 font-semibold">Constant Contact</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{row.feature}</td>
                    <td className="p-4 text-center">
                      {row.nmbr ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-600 mx-auto" />
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {row.shopify ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-600 mx-auto" />
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {row.mailchimp ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-600 mx-auto" />
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {row.woocommerce ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-600 mx-auto" />
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {row.constantContact ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-600 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">What Our Customers Say</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Don't just take our word for it - hear from customers who switched from other platforms
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

      {/* Why Switch Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold mb-4">Ready to Make the Switch?</h3>
              <p className="text-xl text-muted-foreground">
                Join thousands of organizations who've discovered the power of story-driven commerce
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-2">300%</h3>
                  <p className="text-sm text-muted-foreground">Average Revenue Increase</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-600 mb-2">4.2%</h3>
                  <p className="text-sm text-muted-foreground">Average Conversion Rate</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-600 mb-2">5 min</h3>
                  <p className="text-sm text-muted-foreground">Average Setup Time</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Schedule Demo
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
