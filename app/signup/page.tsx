"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Heart, Users, CheckCircle, Sparkles, Building2, ArrowLeft, Info } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Confetti } from "@/components/ui/confetti"
import { supabase } from "@/lib/supabase"
import type { OrganizationType } from "@/types"

interface OrganizationTypeOption {
  id: OrganizationType
  name: string
  description: string
  icon: any
  color: string
  features: string[]
  terminology: {
    donations: string
    supporters: string
    action: string
  }
}

const organizationTypes: OrganizationTypeOption[] = [
  {
    id: "nonprofit",
    name: "Nonprofit (501c3)",
    description: "Tax-exempt organizations focused on charitable causes and community impact",
    icon: Heart,
    color: "from-rose-500 to-pink-600",
    features: ["Tax-deductible donations", "Donor management", "Grant tracking", "Compliance tools"],
    terminology: {
      donations: "Donations",
      supporters: "Donors",
      action: "fundraising",
    },
  },
  {
    id: "grassroots",
    name: "Grassroots Organization",
    description: "Community-driven projects and informal groups making local impact",
    icon: Users,
    color: "from-emerald-500 to-teal-600",
    features: ["Community engagement", "Project management", "Volunteer coordination", "Local impact tracking"],
    terminology: {
      donations: "Support",
      supporters: "Community Members",
      action: "community building",
    },
  },
  {
    id: "business",
    name: "Business",
    description: "Companies focused on corporate social responsibility and customer engagement",
    icon: Building2,
    color: "from-blue-500 to-indigo-600",
    features: ["Customer engagement", "CSR tracking", "Brand storytelling", "Impact marketing"],
    terminology: {
      donations: "Purchases",
      supporters: "Customers",
      action: "customer engagement",
    },
  },
]

export default function SignupPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedOrgType, setSelectedOrgType] = useState<OrganizationType | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
    organizationWebsite: "",
    einNumber: "",
    taxExemptStatus: false,
    fiscalSponsor: "",
    businessRegistration: "",
    industry: "",
    csrFocusAreas: [] as string[],
    projectDescription: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [isCheckingConfirmation, setIsCheckingConfirmation] = useState(false)
  const [showExistingAccountMessage, setShowExistingAccountMessage] = useState(false)

  const checkEmailConfirmation = async () => {
    setIsCheckingConfirmation(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          console.log("Email not confirmed yet")
        } else {
          throw error
        }
      } else if (data.user && data.session) {
        console.log("Email confirmed! Redirecting to dashboard...")
        router.push("/dashboard")
        return
      }
    } catch (err) {
      console.error("Error checking confirmation:", err)
    } finally {
      setIsCheckingConfirmation(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (!selectedOrgType) {
      setError("Please select an organization type")
      setLoading(false)
      return
    }

    let formattedWebsite = formData.organizationWebsite
    if (formattedWebsite && !/^https?:\/\//i.test(formattedWebsite)) {
      formattedWebsite = `https://${formattedWebsite}`
    }

    try {
      await signUp(formData.email, formData.password, formData.organizationName, formattedWebsite, selectedOrgType, {
        einNumber: formData.einNumber,
        taxExemptStatus: formData.taxExemptStatus,
        fiscalSponsor: formData.fiscalSponsor,
        businessRegistration: formData.businessRegistration,
        industry: formData.industry,
        csrFocusAreas: formData.csrFocusAreas,
        projectDescription: formData.projectDescription,
      })
      setShowSuccess(true)
    } catch (err: any) {
      console.error("Signup error:", err)

      if (
        err.message?.includes("User already registered") ||
        err.message?.includes("already registered") ||
        err.message?.includes("email address is already registered")
      ) {
        setShowExistingAccountMessage(true)
        setError("")
      } else if (err.message?.includes("Password should be at least")) {
        setError("Password must be at least 6 characters long.")
      } else if (err.message?.includes("Invalid email")) {
        setError("Please enter a valid email address.")
      } else {
        setError("Failed to create account. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Choose Your Organization Type</h2>
              <p className="text-muted-foreground">Select the option that best describes your organization</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {organizationTypes.map((type) => {
                const IconComponent = type.icon
                const isSelected = selectedOrgType === type.id

                return (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      isSelected ? "ring-2 ring-primary border-primary/20 bg-primary/5" : "hover:border-primary/20"
                    }`}
                    onClick={() => setSelectedOrgType(type.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                        >
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{type.name}</CardTitle>
                            {isSelected && <CheckCircle className="w-5 h-5 text-primary" />}
                          </div>
                          <CardDescription className="text-sm mt-1">{type.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">Key Features:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {type.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="w-3 h-3 text-primary mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Button
              onClick={() => setCurrentStep(2)}
              disabled={!selectedOrgType}
              className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )

      case 2:
        const selectedType = organizationTypes.find((type) => type.id === selectedOrgType)

        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)} className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Organization Details</h2>
                <p className="text-muted-foreground">Tell us about your {selectedType?.name.toLowerCase()}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 h-12 text-base"
                    placeholder="your@organization.org"
                  />
                </div>

                <div>
                  <Label htmlFor="orgName" className="text-sm font-medium text-foreground">
                    Organization Name
                  </Label>
                  <Input
                    id="orgName"
                    type="text"
                    required
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                    className="mt-1 h-12 text-base"
                    placeholder={`Your ${selectedType?.name} Name`}
                  />
                </div>

                <div>
                  <Label htmlFor="website" className="text-sm font-medium text-foreground">
                    Website (Optional)
                  </Label>
                  <Input
                    id="website"
                    type="text"
                    value={formData.organizationWebsite}
                    onChange={(e) => setFormData({ ...formData, organizationWebsite: e.target.value })}
                    className="mt-1 h-12 text-base"
                    placeholder="www.yourorganization.org"
                  />
                </div>

                {selectedOrgType === "nonprofit" && (
                  <>
                    <div>
                      <Label htmlFor="einNumber" className="text-sm font-medium text-foreground">
                        EIN Number (Optional)
                      </Label>
                      <Input
                        id="einNumber"
                        type="text"
                        value={formData.einNumber}
                        onChange={(e) => setFormData({ ...formData, einNumber: e.target.value })}
                        className="mt-1 h-12 text-base"
                        placeholder="XX-XXXXXXX"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Your Employer Identification Number for tax-exempt status
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="fiscalSponsor" className="text-sm font-medium text-foreground">
                        Fiscal Sponsor (Optional)
                      </Label>
                      <Input
                        id="fiscalSponsor"
                        type="text"
                        value={formData.fiscalSponsor}
                        onChange={(e) => setFormData({ ...formData, fiscalSponsor: e.target.value })}
                        className="mt-1 h-12 text-base"
                        placeholder="Name of fiscal sponsor organization"
                      />
                    </div>
                  </>
                )}

                {selectedOrgType === "grassroots" && (
                  <div>
                    <Label htmlFor="projectDescription" className="text-sm font-medium text-foreground">
                      Project Description
                    </Label>
                    <Textarea
                      id="projectDescription"
                      value={formData.projectDescription}
                      onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                      className="mt-1 text-base"
                      placeholder="Describe your community project and its impact..."
                      rows={3}
                    />
                  </div>
                )}

                {selectedOrgType === "business" && (
                  <>
                    <div>
                      <Label htmlFor="industry" className="text-sm font-medium text-foreground">
                        Industry
                      </Label>
                      <Input
                        id="industry"
                        type="text"
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className="mt-1 h-12 text-base"
                        placeholder="e.g., Technology, Healthcare, Retail"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessRegistration" className="text-sm font-medium text-foreground">
                        Business Registration (Optional)
                      </Label>
                      <Input
                        id="businessRegistration"
                        type="text"
                        value={formData.businessRegistration}
                        onChange={(e) => setFormData({ ...formData, businessRegistration: e.target.value })}
                        className="mt-1 h-12 text-base"
                        placeholder="Business registration number"
                      />
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-1 h-12 text-base"
                    placeholder="Create a strong password"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="mt-1 h-12 text-base"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <div className="flex items-center space-x-2 mb-3">
                  <Info className="w-4 h-4 text-primary" />
                  <h3 className="font-medium text-foreground">Your Dashboard Preview</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Here's how your dashboard will look for {selectedType?.name.toLowerCase()}:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-background rounded p-2 border">
                    <span className="font-medium">{selectedType?.terminology.donations}</span>
                  </div>
                  <div className="bg-background rounded p-2 border">
                    <span className="font-medium">{selectedType?.terminology.supporters}</span>
                  </div>
                  <div className="bg-background rounded p-2 border">
                    <span className="font-medium">Stories</span>
                  </div>
                  <div className="bg-background rounded p-2 border">
                    <span className="font-medium">Analytics</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground"
              >
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Create My Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </div>
        )

      default:
        return null
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-background to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Confetti />
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Check Your Email!</h2>
            <p className="text-muted-foreground mb-6">
              We've sent you a confirmation link. Please check your email and click the link to activate your account.
            </p>
            <div className="space-y-4">
              <Button onClick={checkEmailConfirmation} disabled={isCheckingConfirmation} className="w-full">
                {isCheckingConfirmation ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-2">Checking...</span>
                  </>
                ) : (
                  "I've Confirmed My Email - Continue"
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Click the button above after you've clicked the confirmation link in your email.
              </p>
              <div className="text-center">
                <Link href="/login" className="text-sm text-blue-600 hover:text-blue-800 underline">
                  Or go to login page
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showExistingAccountMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-background to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Account Already Exists</h2>
            <p className="text-muted-foreground mb-6">
              An account with <strong>{formData.email}</strong> already exists. Please log in instead of creating a new
              account.
            </p>
            <div className="space-y-4">
              <Button onClick={() => router.push("/login")} className="w-full">
                Go to Login
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowExistingAccountMessage(false)
                  setFormData({
                    email: "",
                    password: "",
                    confirmPassword: "",
                    organizationName: "",
                    organizationWebsite: "",
                    einNumber: "",
                    taxExemptStatus: false,
                    fiscalSponsor: "",
                    businessRegistration: "",
                    industry: "",
                    csrFocusAreas: [] as string[],
                    projectDescription: "",
                  })
                }}
                className="w-full"
              >
                Try Different Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-xl">N</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center">
                <span className="text-secondary-foreground font-bold text-xs">#</span>
              </div>
            </div>
            <span className="text-2xl font-bold text-foreground">The NMBR</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Start Your Impact Story</h1>
          <p className="text-muted-foreground">
            Join organizations worldwide transforming engagement with personalized impact stories
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            1
          </div>
          <div className={`w-16 h-1 rounded ${currentStep >= 2 ? "bg-primary" : "bg-muted"}`} />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            2
          </div>
        </div>

        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-8">{renderStepContent()}</CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
