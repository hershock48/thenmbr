"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowRight, 
  Heart, 
  Users, 
  CheckCircle, 
  Sparkles, 
  Building2, 
  ArrowLeft, 
  Target,
  BarChart3,
  Mail,
  Zap,
  Globe,
  Clock
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Confetti } from "@/components/ui/confetti"

interface SignupFormData {
  email: string
  password: string
  confirmPassword: string
  organizationName: string
  organizationWebsite: string
  einNumber: string
  projectDescription: string
  expectedMonthlyDonations: string
  primaryCause: string
  selectedPlan: string
  agreeToTerms: boolean
  subscribeToUpdates: boolean
}

const primaryCauses = [
  "Education & Youth Development",
  "Healthcare & Medical Research", 
  "Environmental Conservation",
  "Poverty Alleviation",
  "Human Rights & Social Justice",
  "Disaster Relief & Emergency Response",
  "Arts & Culture",
  "Animal Welfare",
  "Community Development",
  "Religious & Spiritual",
  "Other"
]

const expectedDonationRanges = [
  "Under $1,000/month",
  "$1,000 - $5,000/month", 
  "$5,000 - $25,000/month",
  "$25,000 - $100,000/month",
  "Over $100,000/month"
]

export default function SignupPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
    organizationWebsite: "",
    einNumber: "",
    projectDescription: "",
    expectedMonthlyDonations: "",
    primaryCause: "",
    selectedPlan: "starter",
    agreeToTerms: false,
    subscribeToUpdates: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const totalSteps = 3

  const handleInputChange = (field: keyof SignupFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError("")
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.email.includes("@") && formData.password.length >= 8 && formData.password === formData.confirmPassword
      case 2:
        return formData.organizationName.length > 0 && formData.primaryCause.length > 0
      case 3:
        return formData.projectDescription.length > 50 && formData.agreeToTerms
      default:
        return false
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    } else {
      setError("Please fill in all required fields correctly.")
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    setError("")
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      setError("Please complete all required fields and accept the terms.")
      return
    }

    setLoading(true)
    setError("")

    try {
      await signUp(formData.email, formData.password, {
        organization_name: formData.organizationName,
        organization_website: formData.organizationWebsite,
        ein_number: formData.einNumber,
        project_description: formData.projectDescription,
        expected_monthly_donations: formData.expectedMonthlyDonations,
        primary_cause: formData.primaryCause,
        organization_type: "nonprofit",
        selected_plan: formData.selectedPlan,
        subscribe_to_updates: formData.subscribeToUpdates
      })
      
      setShowSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during signup. Please try again."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <Confetti active={true} />
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to NMBR!</h2>
            <p className="text-muted-foreground mb-6">
              Your nonprofit account has been created successfully. Redirecting to your dashboard...
            </p>
            <LoadingSpinner />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
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
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Heart className="w-4 h-4 mr-2" />
            Nonprofit Signup
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Start Your <span className="text-primary">Story-Driven</span> Fundraising Journey
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Join hundreds of nonprofits already using NMBR to turn their impact stories into sustainable donor relationships and recurring support.
          </p>
          
          {/* Sign In Option */}
          <div className="bg-muted/50 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-muted-foreground mb-3">Already have an account?</p>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                <ArrowRight className="w-4 h-4 mr-2" />
                Sign In to Your Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm font-medium text-muted-foreground">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>

        {/* What You'll Get - Prominent Section */}
        <Card className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">What You'll Get with NMBR</h2>
              <p className="text-muted-foreground">Everything you need to turn stories into sustainable donor relationships</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium">1-3 Active NMBRs</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium">Basic Analytics</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium">Email Capture</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium">Story Pages</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium">Basic Branding</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium">14-day Free Trial</span>
              </div>
            </div>
            
            {/* Trial Limitations & Upgrade Path */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-blue-600 mt-0.5">ℹ️</div>
                <div className="text-sm">
                  <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Trial Details:</p>
                  <ul className="text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• 14-day free trial of Starter plan ($99/month after trial)</li>
                    <li>• Upgrade anytime to Growth ($199/month) or Professional ($399/month)</li>
                    <li>• Cancel anytime during trial with no charges</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {currentStep === 1 && <Mail className="w-5 h-5" />}
                  {currentStep === 2 && <Building2 className="w-5 h-5" />}
                  {currentStep === 3 && <Target className="w-5 h-5" />}
                  {currentStep === 1 && "Create Your Account"}
                  {currentStep === 2 && "Organization Details"}
                  {currentStep === 3 && "Your Impact Story & Launch"}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && "Set up your secure account to get started"}
                  {currentStep === 2 && "Tell us about your nonprofit organization"}
                  {currentStep === 3 && "Describe your impact story and launch your fundraising"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                  </div>
                )}

                {/* Step 1: Account Creation */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@organization.org"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        aria-label="Email address"
                        aria-required="true"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Minimum 8 characters"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Organization Details */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="organizationName">Organization Name *</Label>
                      <Input
                        id="organizationName"
                        placeholder="Your Nonprofit Name"
                        value={formData.organizationName}
                        onChange={(e) => handleInputChange("organizationName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organizationWebsite">Website (Optional)</Label>
                      <Input
                        id="organizationWebsite"
                        placeholder="https://yourorganization.org"
                        value={formData.organizationWebsite}
                        onChange={(e) => handleInputChange("organizationWebsite", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="einNumber">EIN Number (Optional)</Label>
                      <Input
                        id="einNumber"
                        placeholder="12-3456789"
                        value={formData.einNumber}
                        onChange={(e) => handleInputChange("einNumber", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primaryCause">Primary Cause *</Label>
                      <select
                        id="primaryCause"
                        className="w-full p-2 border border-input rounded-md bg-background"
                        value={formData.primaryCause}
                        onChange={(e) => handleInputChange("primaryCause", e.target.value)}
                      >
                        <option value="">Select your primary cause</option>
                        {primaryCauses.map((cause) => (
                          <option key={cause} value={cause}>{cause}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expectedMonthlyDonations">Expected Monthly Donations</Label>
                      <select
                        id="expectedMonthlyDonations"
                        className="w-full p-2 border border-input rounded-md bg-background"
                        value={formData.expectedMonthlyDonations}
                        onChange={(e) => handleInputChange("expectedMonthlyDonations", e.target.value)}
                      >
                        <option value="">Select expected range</option>
                        {expectedDonationRanges.map((range) => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 3: Impact Story */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="projectDescription">Describe Your Impact Story *</Label>
                      <Textarea
                        id="projectDescription"
                        placeholder="Tell us about the people, communities, or causes you help. What makes your work unique? What impact do you want to create? (Minimum 50 characters)"
                        className="min-h-32"
                        value={formData.projectDescription}
                        onChange={(e) => handleInputChange("projectDescription", e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        {formData.projectDescription.length}/50 characters minimum
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 4: Review & Launch */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Account Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Email:</span>
                          <p className="font-medium">{formData.email}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Organization:</span>
                          <p className="font-medium">{formData.organizationName}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Primary Cause:</span>
                          <p className="font-medium">{formData.primaryCause}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expected Donations:</span>
                          <p className="font-medium">{formData.expectedMonthlyDonations || "Not specified"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Your Impact Story</h3>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                        {formData.projectDescription}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          id="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                          className="mt-1"
                        />
                        <Label htmlFor="agreeToTerms" className="text-sm">
                          I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> *
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          id="subscribeToUpdates"
                          checked={formData.subscribeToUpdates}
                          onChange={(e) => handleInputChange("subscribeToUpdates", e.target.checked)}
                          className="mt-1"
                        />
                        <Label htmlFor="subscribeToUpdates" className="text-sm">
                          Subscribe to product updates and fundraising tips
                        </Label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  
                  {currentStep < totalSteps ? (
                    <Button onClick={handleNext} disabled={!validateStep(currentStep)}>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmit} 
                      disabled={loading || !validateStep(3)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {loading ? (
                        <>
                          <LoadingSpinner />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Launch My Fundraising
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Why Choose NMBR */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Why Choose NMBR?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-medium text-sm">Story-Driven Fundraising</h4>
                    <p className="text-xs text-muted-foreground">Connect donors directly to impact</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-medium text-sm">Complete Attribution</h4>
                    <p className="text-xs text-muted-foreground">Track every donation to impact</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-medium text-sm">Donor Relationships</h4>
                    <p className="text-xs text-muted-foreground">Build lasting connections</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-medium text-sm">Easy Setup</h4>
                    <p className="text-xs text-muted-foreground">Get started in minutes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upgrade Options</CardTitle>
                <CardDescription className="text-sm">Unlock more features as you grow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  formData.selectedPlan === "starter" 
                    ? "border-primary bg-primary/10" 
                    : "border-border hover:border-primary/50"
                }`} onClick={() => handleInputChange("selectedPlan", "starter")}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Starter</span>
                    <span className="text-xs text-muted-foreground">Your trial</span>
                  </div>
                  <div className="text-lg font-bold">$99<span className="text-sm text-muted-foreground">/month</span></div>
                  <p className="text-xs text-muted-foreground">1-3 NMBRs, Basic features</p>
                  {formData.selectedPlan === "starter" && (
                    <div className="mt-2 text-xs text-primary font-medium">✓ Selected</div>
                  )}
                </div>
                <div className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  formData.selectedPlan === "growth" 
                    ? "border-primary bg-primary/10" 
                    : "border-primary bg-primary/5 hover:border-primary/70"
                }`} onClick={() => handleInputChange("selectedPlan", "growth")}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Growth</span>
                    <Badge variant="secondary" className="text-xs">Popular</Badge>
                  </div>
                  <div className="text-lg font-bold">$199<span className="text-sm text-muted-foreground">/month</span></div>
                  <p className="text-xs text-muted-foreground">5 NMBRs, Advanced features</p>
                  {formData.selectedPlan === "growth" && (
                    <div className="mt-2 text-xs text-primary font-medium">✓ Selected</div>
                  )}
                </div>
                <div className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  formData.selectedPlan === "professional" 
                    ? "border-primary bg-primary/10" 
                    : "border-border hover:border-primary/50"
                }`} onClick={() => handleInputChange("selectedPlan", "professional")}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Professional</span>
                  </div>
                  <div className="text-lg font-bold">$399<span className="text-sm text-muted-foreground">/month</span></div>
                  <p className="text-xs text-muted-foreground">10 NMBRs, White-label</p>
                  {formData.selectedPlan === "professional" && (
                    <div className="mt-2 text-xs text-primary font-medium">✓ Selected</div>
                  )}
                </div>
                <Link href="/pricing">
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    View All Plans
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Success Stories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Success Stories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Maria's Education Fund</span>
                  <Badge variant="secondary" className="text-xs">+245% ROI</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Clean Water Initiative</span>
                  <Badge variant="secondary" className="text-xs">+200% ROI</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Medical Care Program</span>
                  <Badge variant="secondary" className="text-xs">+200% ROI</Badge>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}
