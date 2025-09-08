"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, ArrowRight, Heart, Target, Zap } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      description: "Perfect for small nonprofits getting started",
      features: [
        "Up to 10 impact stories",
        "Basic widget customization",
        "Email support",
        "Basic analytics",
        "Standard templates"
      ],
      limitations: [
        "Limited to 10 stories",
        "Basic branding only"
      ],
      popular: false,
      cta: "Get Started Free"
    },
    {
      name: "Professional",
      price: "$29",
      period: "per month",
      description: "Ideal for growing organizations",
      features: [
        "Unlimited impact stories",
        "Advanced widget customization",
        "Priority email support",
        "Advanced analytics & reporting",
        "Custom branding & themes",
        "Newsletter builder",
        "Donor management tools",
        "API access"
      ],
      limitations: [],
      popular: true,
      cta: "Start Free Trial"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large organizations with complex needs",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Phone & video support",
        "Custom integrations",
        "White-label solutions",
        "Advanced security features",
        "Custom reporting",
        "Training & onboarding"
      ],
      limitations: [],
      popular: false,
      cta: "Contact Sales"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-50 supports-[backdrop-filter]:bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
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
              <Link href="/features">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground hidden sm:inline-flex">
                  Features
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground hidden sm:inline-flex">
                  Demo
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
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Simple, Transparent
            <span className="block bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Choose the plan that fits your organization's needs. All plans include our core features to help you create meaningful donor connections.
          </p>
          <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-50 to-purple-50 border border-cyan-200 rounded-full px-4 py-2 mb-8">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-foreground">14-day free trial on all paid plans</span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                  plan.popular 
                    ? 'border-cyan-200 hover:border-cyan-300 bg-gradient-to-br from-cyan-50/50 to-transparent shadow-lg' 
                    : 'border-border hover:border-muted-foreground/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-foreground mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">{plan.period}</span>
                  </div>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.limitations.length > 0 && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">Limitations:</p>
                      <ul className="space-y-1">
                        {plan.limitations.map((limitation, limitIndex) => (
                          <li key={limitIndex} className="text-xs text-muted-foreground">
                            • {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="pt-6">
                    <Link href={plan.name === "Enterprise" ? "/contact" : "/signup"}>
                      <Button 
                        className={`w-full ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white shadow-lg' 
                            : 'bg-muted hover:bg-muted/80 text-foreground'
                        }`}
                      >
                        {plan.cta}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Can I change plans anytime?</h3>
              <p className="text-muted-foreground">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">What happens to my data if I cancel?</h3>
              <p className="text-muted-foreground">Your data is always yours. We'll provide you with a complete export of all your stories, donor information, and analytics before cancellation.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Do you offer nonprofit discounts?</h3>
              <p className="text-muted-foreground">Yes! We offer special pricing for registered nonprofits. Contact our sales team to learn about our nonprofit discount program.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Is there a setup fee?</h3>
              <p className="text-muted-foreground">No setup fees! We believe in transparent pricing. You only pay for your chosen plan, nothing more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of nonprofits who've already discovered the power of personalized impact stories. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <Heart className="w-5 h-5 mr-2" />
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="border-2 border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300 transition-all duration-300">
                <Target className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </Link>
          </div>
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
                <Heart className="w-4 h-4 mr-2" />
                Start Your Free Trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300">
                <Target className="w-4 h-4 mr-2" />
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
