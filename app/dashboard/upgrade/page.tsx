"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Gift
} from "lucide-react"

const currentTier = {
  name: "Growth",
  price: 99,
  features: [
    "5 impact stories",
    "Unlimited team seats",
    "Advanced analytics", 
    "SMS updates",
    "White-label donation pages",
    "3% platform fee"
  ]
}

const upgradeTiers = [
  {
    name: "Professional",
    price: 199,
    annualPrice: 1990,
    description: "For established nonprofits with complex needs",
    features: [
      "10 impact stories",
      "Push notifications",
      "Supporter feed",
      "Donation analytics",
      "Attribution tracking",
      "1% platform fee"
    ],
    cta: "Upgrade to Professional",
    popular: false,
    savings: "Save $398 annually",
    roi: "300% impact increase in 6 months"
  },
  {
    name: "Enterprise",
    price: 399,
    annualPrice: 3990,
    description: "For large nonprofits with custom requirements",
    features: [
      "Unlimited impact stories",
      "Global marketplace",
      "Custom integrations",
      "Dedicated support",
      "0% platform fee",
      "Custom features"
    ],
    cta: "Contact Sales",
    popular: true,
    savings: "Save $0 annually",
    roi: "500% impact increase in 3 months"
  }
]

const upgradeReasons = [
  {
    icon: <TrendingUp className="w-6 h-6 text-green-600" />,
    title: "You're Growing Fast",
    description: "Your current plan is limiting your impact potential. Upgrade to scale without restrictions.",
    metric: "127% growth in last 30 days",
    color: "green"
  },
  {
    icon: <Heart className="w-6 h-6 text-blue-600" />,
    title: "Missing Donation Opportunities",
    description: "You're leaving donations on the table with limited attribution tracking and analytics.",
    metric: "$2,847 potential monthly donations",
    color: "blue"
  },
  {
    icon: <Users className="w-6 h-6 text-purple-600" />,
    title: "Team Collaboration Needs",
    description: "Your team needs advanced features to work more efficiently and drive better impact.",
    metric: "5 team members need access",
    color: "purple"
  },
  {
    icon: <Target className="w-6 h-6 text-orange-600" />,
    title: "Advanced Targeting Required",
    description: "You need sophisticated donor targeting and campaign optimization tools.",
    metric: "4.2% conversion rate potential",
    color: "orange"
  }
]

const roiCalculator = {
  currentRevenue: 2847,
  projectedRevenue: 8541,
  additionalRevenue: 5694,
  paybackPeriod: "2.1 months",
  annualSavings: 1188
}

export default function UpgradePage() {
  const [selectedTier, setSelectedTier] = useState('professional')
  const [showROICalculator, setShowROICalculator] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit mx-auto">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Your Plan
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
                Scale Your
                <span className="text-primary"> Impact</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                You're outgrowing your current plan. Upgrade to unlock advanced features 
                and maximize your impact potential.
              </p>
            </div>
            
            {/* Current Plan Status */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">Current Plan: {currentTier.name}</h3>
                  <p className="text-muted-foreground">$199/month</p>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  <Users className="w-4 h-4 mr-2" />
                  {currentTier.features.length} features
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">$2,847</div>
                  <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">127</div>
                  <div className="text-sm text-muted-foreground">Orders This Month</div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  You're using <strong>100%</strong> of your current plan's capacity
                </p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Upgrade Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-4xl font-bold">Why You Should Upgrade Now</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Based on your current usage and growth trajectory, here's why upgrading makes sense
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {upgradeReasons.map((reason, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 bg-${reason.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                    {reason.icon}
                  </div>
                  <CardTitle className="text-lg">{reason.title}</CardTitle>
                  <CardDescription>{reason.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary mb-2">{reason.metric}</div>
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

      {/* ROI Calculator */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-4xl font-bold">ROI Calculator</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See exactly how much additional revenue you can generate with an upgrade
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Current vs. Projected Revenue</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-semibold">Current Monthly Revenue</div>
                        <div className="text-sm text-muted-foreground">With {currentTier.name} plan</div>
                      </div>
                      <div className="text-2xl font-bold">${roiCalculator.currentRevenue.toLocaleString()}</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div>
                        <div className="font-semibold text-green-900 dark:text-green-100">Projected Monthly Revenue</div>
                        <div className="text-sm text-green-700 dark:text-green-300">With Professional plan</div>
                      </div>
                      <div className="text-2xl font-bold text-green-600">${roiCalculator.projectedRevenue.toLocaleString()}</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <div>
                        <div className="font-semibold text-primary">Additional Monthly Revenue</div>
                        <div className="text-sm text-muted-foreground">Potential increase</div>
                      </div>
                      <div className="text-2xl font-bold text-primary">+${roiCalculator.additionalRevenue.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-6">Upgrade Benefits</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Payback period: <strong>{roiCalculator.paybackPeriod}</strong></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Annual savings: <strong>${roiCalculator.annualSavings.toLocaleString()}</strong></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>ROI: <strong>300% in 6 months</strong></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Platform fee reduction: <strong>2%</strong></span>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
                    <h3 className="font-semibold mb-2">Total Annual Value</h3>
                    <div className="text-3xl font-bold text-primary mb-2">$68,328</div>
                    <p className="text-sm text-muted-foreground">
                      Additional revenue potential per year
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Upgrade Options */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-4xl font-bold">Choose Your Upgrade Path</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Select the plan that best fits your growth trajectory and revenue goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {upgradeTiers.map((tier, index) => (
              <Card key={index} className={`relative ${tier.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <Star className="w-4 h-4 mr-1" />
                      Recommended
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="space-y-1 mt-4">
                    <div className="text-4xl font-bold">${tier.price}</div>
                    <div className="text-sm text-muted-foreground">per month</div>
                    <div className="text-sm text-green-600 font-medium">{tier.savings}</div>
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
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm font-semibold mb-1">ROI Projection</div>
                    <div className="text-lg font-bold text-primary">{tier.roi}</div>
                  </div>
                  
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

      {/* Urgency Section */}
      <section className="py-20 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="destructive" className="w-fit mx-auto">
                <Clock className="w-4 h-4 mr-2" />
                Limited Time Offer
              </Badge>
              <h3 className="text-4xl font-bold">Don't Miss Out on Revenue</h3>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Every day you wait is potential revenue lost. Upgrade now and start generating 
                additional income immediately.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">$189 Lost Daily</h3>
                <p className="text-sm text-muted-foreground">Average revenue lost per day without upgrade</p>
              </div>
              
              <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">127% Growth Rate</h3>
                <p className="text-sm text-muted-foreground">Your current growth requires more capacity</p>
              </div>
              
              <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Free Migration</h3>
                <p className="text-sm text-muted-foreground">We'll handle the upgrade process for you</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                Upgrade Now
                <Rocket className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Schedule Demo
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
