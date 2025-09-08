"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Building2, FileText, QrCode, Zap, ArrowRight, ArrowLeft, Upload, Eye, Share2 } from "lucide-react"

const steps = [
  { id: 1, title: "Business Profile", icon: Building2, description: "Tell us about your business" },
  { id: 2, title: "First Story", icon: FileText, description: "Create your first product story" },
  { id: 3, title: "QR Code Test", icon: QrCode, description: "Generate and test your QR code" },
  { id: 4, title: "Integration", icon: Zap, description: "Connect your e-commerce platform" },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [businessData, setBusinessData] = useState({
    name: "",
    industry: "",
    website: "",
    description: "",
  })
  const [storyData, setStoryData] = useState({
    title: "",
    content: "",
    productName: "",
    impact: "",
  })

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCompletedSteps([...completedSteps, currentStep])
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setCompletedSteps([...completedSteps, currentStep])
    // Redirect to dashboard
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">N</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-accent-foreground text-xs font-bold">#</span>
                </div>
              </div>
              <h1 className="text-xl font-semibold text-foreground">Welcome to NMBR</h1>
            </div>
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              Step {currentStep} of {steps.length}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    completedSteps.includes(step.id)
                      ? "bg-primary border-primary text-primary-foreground"
                      : currentStep === step.id
                        ? "bg-accent border-accent text-accent-foreground"
                        : "bg-muted border-border text-muted-foreground"
                  }`}
                >
                  {completedSteps.includes(step.id) ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${completedSteps.includes(step.id) ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Tell Us About Your Business
                </CardTitle>
                <CardDescription>
                  Help us understand your business so we can personalize your experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Business Name</Label>
                  <Input
                    id="business-name"
                    placeholder="Enter your business name"
                    value={businessData.name}
                    onChange={(e) => setBusinessData({ ...businessData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select onValueChange={(value) => setBusinessData({ ...businessData, industry: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coffee">Coffee & Beverages</SelectItem>
                      <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                      <SelectItem value="outdoor">Outdoor & Sports</SelectItem>
                      <SelectItem value="food">Food & Restaurants</SelectItem>
                      <SelectItem value="retail">Retail & E-commerce</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    placeholder="https://yourwebsite.com"
                    value={businessData.website}
                    onChange={(e) => setBusinessData({ ...businessData, website: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us about your business and what makes it special"
                    value={businessData.description}
                    onChange={(e) => setBusinessData({ ...businessData, description: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Create Your First Story
                </CardTitle>
                <CardDescription>Stories connect your customers to the people behind your products</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="story-title">Story Title</Label>
                  <Input
                    id="story-title"
                    placeholder="e.g., Meet Maria, Your Coffee Farmer"
                    value={storyData.title}
                    onChange={(e) => setStoryData({ ...storyData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input
                    id="product-name"
                    placeholder="e.g., Ethiopian Single Origin Coffee"
                    value={storyData.productName}
                    onChange={(e) => setStoryData({ ...storyData, productName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="story-content">Story Content</Label>
                  <Textarea
                    id="story-content"
                    placeholder="Tell the story behind this product. Who made it? Where does it come from? What impact does it create?"
                    className="min-h-32"
                    value={storyData.content}
                    onChange={(e) => setStoryData({ ...storyData, content: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="impact">Impact Statement</Label>
                  <Input
                    id="impact"
                    placeholder="e.g., Your purchase supports 50 farming families"
                    value={storyData.impact}
                    onChange={(e) => setStoryData({ ...storyData, impact: e.target.value })}
                  />
                </div>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Upload photos to make your story more engaging</p>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    Choose Files
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-primary" />
                  Generate & Test Your QR Code
                </CardTitle>
                <CardDescription>Create a QR code that customers can scan to discover your story</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted rounded-lg p-6 text-center">
                  <div className="w-32 h-32 bg-background border-2 border-border rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">QR Code for: {storyData.title || "Your Story"}</p>
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Story
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Download QR
                    </Button>
                  </div>
                </div>
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  <h4 className="font-medium text-accent-foreground mb-2">Test Your QR Code</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Use your phone's camera to scan the QR code above and see how customers will experience your story.
                  </p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    I've Tested My QR Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Connect Your E-commerce Platform
                </CardTitle>
                <CardDescription>Link your store to track story-driven sales and revenue</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-primary font-bold">S</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Shopify</h4>
                          <p className="text-sm text-muted-foreground">Connect your Shopify store</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                          <span className="text-secondary font-bold">W</span>
                        </div>
                        <div>
                          <h4 className="font-medium">WooCommerce</h4>
                          <p className="text-sm text-muted-foreground">Connect your WordPress store</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                          <span className="text-accent font-bold">B</span>
                        </div>
                        <div>
                          <h4 className="font-medium">BigCommerce</h4>
                          <p className="text-sm text-muted-foreground">Connect your BigCommerce store</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    Don't see your platform? You can skip this step and set up integrations later from your dashboard.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            {currentStep < steps.length ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete}>
                Complete Setup
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
