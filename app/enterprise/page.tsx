"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  CheckCircle, 
  Star, 
  Shield, 
  Zap, 
  Users, 
  Globe,
  BarChart3,
  Mail,
  MessageSquare,
  ShoppingCart,
  Hash,
  Crown,
  ArrowRight,
  ExternalLink,
  Building2,
  Phone,
  Mail as MailIcon,
  Clock,
  Award,
  Target,
  TrendingUp,
  DollarSign,
  Lock,
  Settings,
  Headphones
} from "lucide-react"
import Link from "next/link"

const enterpriseFeatures = [
  {
    category: "Scale & Performance",
    features: [
      { name: "Unlimited NMBRs", description: "Create as many stories as you need" },
      { name: "Unlimited Team Seats", description: "Add unlimited team members" },
      { name: "Global Marketplace Access", description: "Sell through our global marketplace" },
      { name: "Custom Integrations", description: "Connect with your existing tools" },
      { name: "API Access", description: "Full API access for custom development" },
      { name: "White-label Solutions", description: "Complete white-label customization" }
    ]
  },
  {
    category: "Advanced Analytics",
    features: [
      { name: "Custom Dashboards", description: "Build custom analytics dashboards" },
      { name: "Advanced Attribution", description: "Deep attribution tracking and analysis" },
      { name: "Revenue Forecasting", description: "AI-powered revenue predictions" },
      { name: "Custom Reports", description: "Generate custom reports and exports" },
      { name: "Real-time Monitoring", description: "Live performance monitoring" },
      { name: "Data Warehousing", description: "Export data to your data warehouse" }
    ]
  },
  {
    category: "Enterprise Security",
    features: [
      { name: "SSO Integration", description: "Single sign-on with your identity provider" },
      { name: "Advanced Permissions", description: "Granular role-based access control" },
      { name: "Audit Logs", description: "Complete audit trail of all activities" },
      { name: "Data Encryption", description: "End-to-end encryption for all data" },
      { name: "Compliance Tools", description: "GDPR, SOC 2, and industry compliance" },
      { name: "Private Cloud", description: "Deploy in your own private cloud" }
    ]
  },
  {
    category: "Dedicated Support",
    features: [
      { name: "Dedicated Account Manager", description: "Personal account management" },
      { name: "Priority Support", description: "24/7 priority support response" },
      { name: "Custom Training", description: "Tailored training for your team" },
      { name: "Implementation Support", description: "Hands-on implementation assistance" },
      { name: "Custom Development", description: "Custom feature development" },
      { name: "SLA Guarantee", description: "99.9% uptime SLA with penalties" }
    ]
  }
]

const pricingTiers = [
  {
    name: "Professional",
    price: 399,
    description: "For growing organizations",
    features: [
      "10 NMBRs",
      "Push notifications",
      "Supporter feed",
      "Commerce analytics",
      "Attribution tracking",
      "1% platform fee"
    ],
    cta: "Upgrade to Professional"
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
      "Private cloud deployment",
      "Custom development",
      "Dedicated infrastructure",
      "White-label solutions",
      "Custom pricing"
    ],
    cta: "Contact Sales"
  }
]

const caseStudies = [
  {
    company: "Global Nonprofit",
    industry: "International Development",
    challenge: "Managing 50+ stories across 20 countries with complex attribution tracking",
    solution: "Custom enterprise deployment with multi-language support and advanced analytics",
    results: "300% increase in donor engagement, 150% increase in revenue per story",
    logo: "🌍"
  },
  {
    company: "Fortune 500 Retailer",
    industry: "Consumer Goods",
    challenge: "Integrating story-driven commerce with existing e-commerce platform",
    solution: "Custom API integration with white-label storefront and advanced attribution",
    results: "40% increase in conversion rates, $2M+ additional revenue in Q1",
    logo: "🏪"
  },
  {
    company: "Healthcare Foundation",
    industry: "Healthcare",
    challenge: "HIPAA compliance while maintaining donor engagement through stories",
    solution: "Private cloud deployment with advanced security and compliance tools",
    results: "200% increase in donor retention, 100% compliance audit pass rate",
    logo: "🏥"
  }
]

export default function EnterprisePage() {
  const [formData, setFormData] = useState({
    company: '',
    email: '',
    phone: '',
    name: '',
    role: '',
    message: '',
    employees: '',
    currentSolution: '',
    timeline: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Enterprise contact form submitted:', formData)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              <Crown className="w-4 h-4 mr-2" />
              Enterprise Solutions
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Scale Your Impact with
              <span className="text-primary"> Enterprise NMBR</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              The complete story-driven commerce platform for large organizations. 
              Unlimited scale, custom integrations, and dedicated support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                Contact Sales
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <ExternalLink className="w-5 h-5 mr-2" />
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Why Enterprise Organizations Choose NMBR</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built for scale, security, and performance. Everything you need to turn your stories into sustainable revenue streams.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Unlimited Scale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Unlimited NMBRs, team seats, and global marketplace access for organizations of any size.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>Enterprise Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  SSO, advanced permissions, audit logs, and compliance tools for enterprise security requirements.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>Custom Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with your existing tools and workflows through our comprehensive API and custom integrations.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Headphones className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle>Dedicated Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Dedicated account manager, priority support, and custom training for your team.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Matrix */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Enterprise Features</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to scale your story-driven commerce platform
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {enterpriseFeatures.map((category) => (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">{feature.name}</p>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Enterprise Pricing</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Flexible pricing options for organizations of all sizes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier) => (
              <Card key={tier.name} className={`relative ${tier.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription className="text-sm">{tier.description}</CardDescription>
                  <div className="space-y-1">
                    <div className="text-4xl font-bold">
                      {typeof tier.price === 'number' ? `$${tier.price}` : tier.price}
                    </div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
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
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Enterprise Success Stories</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how leading organizations use NMBR to scale their impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{study.logo}</div>
                    <div>
                      <CardTitle className="text-lg">{study.company}</CardTitle>
                      <CardDescription>{study.industry}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">Challenge</h3>
                    <p className="text-sm">{study.challenge}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">Solution</h3>
                    <p className="text-sm">{study.solution}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">Results</h3>
                    <p className="text-sm font-medium text-green-600">{study.results}</p>
                  </div>
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
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold mb-4">Ready to Scale Your Impact?</h3>
              <p className="text-xl text-muted-foreground">
                Let's discuss how NMBR Enterprise can help your organization achieve its goals
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Why Choose NMBR Enterprise?</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Proven ROI</p>
                        <p className="text-sm text-muted-foreground">Average 300% increase in revenue per story</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Enterprise Security</p>
                        <p className="text-sm text-muted-foreground">SOC 2 compliant with advanced security features</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Dedicated Support</p>
                        <p className="text-sm text-muted-foreground">24/7 priority support with dedicated account manager</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Custom Integrations</p>
                        <p className="text-sm text-muted-foreground">Connect with your existing tools and workflows</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-6">
                  <h3 className="font-semibold mb-3">Get in Touch</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <MailIcon className="w-4 h-4 text-muted-foreground" />
                      <span>enterprise@thenmbr.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>Mon-Fri 9AM-6PM EST</span>
                    </div>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Sales</CardTitle>
                  <CardDescription>
                    Fill out the form and our enterprise team will get back to you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="role">Role *</Label>
                        <Input
                          id="role"
                          value={formData.role}
                          onChange={(e) => setFormData({...formData, role: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company *</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="employees">Company Size</Label>
                        <Input
                          id="employees"
                          value={formData.employees}
                          onChange={(e) => setFormData({...formData, employees: e.target.value})}
                          placeholder="e.g., 100-500 employees"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="currentSolution">Current Solution</Label>
                      <Input
                        id="currentSolution"
                        value={formData.currentSolution}
                        onChange={(e) => setFormData({...formData, currentSolution: e.target.value})}
                        placeholder="What tools are you currently using?"
                      />
                    </div>
                    <div>
                      <Label htmlFor="timeline">Implementation Timeline</Label>
                      <Input
                        id="timeline"
                        value={formData.timeline}
                        onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                        placeholder="When do you need to be live?"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Tell us about your specific needs and goals..."
                        rows={4}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Contact Sales Team
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
