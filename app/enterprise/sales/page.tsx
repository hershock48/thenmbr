"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  DollarSign, 
  BarChart3,
  ShoppingCart,
  Mail,
  MessageSquare,
  Bell,
  Globe,
  Hash,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Award,
  Coffee,
  Heart,
  Building2,
  Smartphone,
  ExternalLink,
  Clock,
  Crown,
  Rocket,
  Gift,
  Phone,
  Calendar,
  FileText,
  Download,
  Play
} from "lucide-react"

const enterpriseFeatures = [
  {
    icon: <Globe className="w-8 h-8 text-blue-600" />,
    title: "Global Marketplace Access",
    description: "Sell to customers worldwide with our integrated global marketplace",
    value: "$50K+ additional monthly revenue"
  },
  {
    icon: <Shield className="w-8 h-8 text-green-600" />,
    title: "Enterprise Security",
    description: "Bank-level security with SSO, advanced permissions, and compliance",
    value: "99.9% uptime SLA"
  },
  {
    icon: <Target className="w-8 h-8 text-purple-600" />,
    title: "Advanced Attribution",
    description: "Complete story-to-sale tracking with detailed ROI analytics",
    value: "300% better conversion rates"
  },
  {
    icon: <Users className="w-8 h-8 text-orange-600" />,
    title: "Dedicated Support",
    description: "24/7 dedicated support team and account manager",
    value: "2-hour response time"
  },
  {
    icon: <Zap className="w-8 h-8 text-yellow-600" />,
    title: "Custom Integrations",
    description: "Seamless integration with your existing tech stack",
    value: "50+ pre-built connectors"
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-red-600" />,
    title: "Advanced Analytics",
    description: "Real-time revenue forecasting and performance optimization",
    value: "40% increase in efficiency"
  }
]

const successStories = [
  {
    company: "Global Nonprofit",
    industry: "International Development",
    revenue: "$2.3M",
    growth: "340%",
    testimonial: "NMBR transformed our fundraising. We went from $500K to $2.3M in annual revenue in just 18 months.",
    logo: "🌍"
  },
  {
    company: "Fortune 500 Retailer",
    industry: "Consumer Goods",
    revenue: "$8.7M",
    growth: "280%",
    testimonial: "The attribution tracking alone paid for the platform in the first quarter. Game-changing ROI.",
    logo: "🏢"
  },
  {
    company: "Healthcare Foundation",
    industry: "Healthcare",
    revenue: "$1.2M",
    growth: "450%",
    testimonial: "Our donor engagement increased 5x. The story-driven approach resonates perfectly with our mission.",
    logo: "🏥"
  }
]

const pricingTiers = [
  {
    name: "Professional",
    price: 399,
    description: "For established organizations",
    features: [
      "10 NMBRs",
      "Push notifications",
      "Supporter feed",
      "Commerce analytics",
      "Attribution tracking",
      "1% platform fee"
    ],
    cta: "Start Free Trial"
  },
  {
    name: "Enterprise",
    price: 750,
    description: "For large organizations",
    features: [
      "Unlimited NMBRs",
      "Global marketplace",
      "Custom integrations",
      "Dedicated support",
      "0% platform fee",
      "Custom features"
    ],
    cta: "Contact Sales",
    popular: true
  },
  {
    name: "Custom",
    price: "Custom",
    description: "For enterprise needs",
    features: [
      "Everything in Enterprise",
      "Custom development",
      "White-label options",
      "Dedicated infrastructure",
      "Custom pricing",
      "Priority support"
    ],
    cta: "Schedule Consultation"
  }
]

export default function EnterpriseSalesPage() {
  const [formData, setFormData] = useState({
    company: '',
    email: '',
    phone: '',
    industry: '',
    employees: '',
    currentRevenue: '',
    needs: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Crown className="w-4 h-4 mr-2" />
                  Enterprise Solutions
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
                  Scale Your
                  <span className="text-primary"> Enterprise</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Join Fortune 500 companies and global nonprofits using NMBR to generate 
                  millions in additional revenue through story-driven commerce.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8 py-6">
                  Schedule Demo
                  <Calendar className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Download Case Study
                  <Download className="w-5 h-5 ml-2" />
                </Button>
              </div>
              
              <div className="flex items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Free consultation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Custom pricing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Dedicated support</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-card rounded-3xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">Enterprise ROI Calculator</h3>
                    <p className="text-muted-foreground">See your potential revenue increase</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <div className="text-3xl font-bold text-primary">$2.3M</div>
                      <div className="text-sm text-muted-foreground">Average Annual Revenue</div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <div className="text-3xl font-bold text-green-600">340%</div>
                      <div className="text-sm text-muted-foreground">Average Growth</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Attribution Tracking ROI</span>
                      <span className="text-sm font-medium">300%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  
                  <Button className="w-full" size="lg">
                    Calculate Your ROI
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-4xl font-bold">Enterprise-Grade Features</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to scale your story-driven commerce to enterprise levels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enterpriseFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-muted/50 rounded-xl flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary mb-2">{feature.value}</div>
                  <Button variant="outline" size="sm" className="w-full">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-4xl font-bold">Enterprise Success Stories</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how leading organizations are using NMBR to drive massive revenue growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">{story.logo}</div>
                    <div>
                      <CardTitle className="text-xl">{story.company}</CardTitle>
                      <CardDescription>{story.industry}</CardDescription>
                    </div>
                  </div>
                  <blockquote className="text-lg italic text-muted-foreground">
                    "{story.testimonial}"
                  </blockquote>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{story.revenue}</div>
                      <div className="text-sm text-muted-foreground">Annual Revenue</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{story.growth}</div>
                      <div className="text-sm text-muted-foreground">Growth Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-4xl font-bold">Enterprise Pricing</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Flexible pricing options designed for organizations of all sizes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`relative ${tier.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="space-y-1 mt-4">
                    <div className="text-4xl font-bold">
                      {typeof tier.price === 'number' ? `$${tier.price}` : tier.price}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {typeof tier.price === 'number' ? 'per month' : 'contact us'}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${tier.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                    variant={tier.popular ? 'default' : 'outline'}
                  >
                    {tier.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h3 className="text-4xl font-bold">Ready to Scale Your Revenue?</h3>
              <p className="text-xl text-muted-foreground">
                Let's discuss how NMBR can transform your organization's revenue potential
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Get Started Today</h3>
                  <p className="text-muted-foreground mb-6">
                    Fill out the form and our enterprise team will contact you within 2 hours 
                    to discuss your specific needs and create a custom proposal.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Free consultation and ROI analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Custom pricing based on your needs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Dedicated implementation support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>24/7 enterprise support</span>
                  </div>
                </div>
                
                <div className="p-6 bg-muted/50 rounded-xl">
                  <h3 className="font-semibold mb-2">Need Immediate Assistance?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Call our enterprise team directly
                  </p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span className="font-mono">1-800-NMBR-ENT</span>
                  </div>
                </div>
              </div>
              
              <Card className="p-8">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Your company name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@company.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        placeholder="e.g., Healthcare, Retail"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employees">Number of Employees</Label>
                      <Input
                        id="employees"
                        name="employees"
                        value={formData.employees}
                        onChange={handleInputChange}
                        placeholder="e.g., 100-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currentRevenue">Current Annual Revenue</Label>
                      <Input
                        id="currentRevenue"
                        name="currentRevenue"
                        value={formData.currentRevenue}
                        onChange={handleInputChange}
                        placeholder="e.g., $1M - $10M"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="needs">Tell us about your needs</Label>
                    <Textarea
                      id="needs"
                      name="needs"
                      value={formData.needs}
                      onChange={handleInputChange}
                      placeholder="Describe your current challenges and goals..."
                      rows={4}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" size="lg">
                    Schedule Enterprise Demo
                    <Calendar className="w-4 h-4 ml-2" />
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    By submitting this form, you agree to our privacy policy and terms of service.
                  </p>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
