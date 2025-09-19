"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Building2,
  Palette,
  Target,
  CreditCard,
  Users,
  Trophy,
  Play,
  X,
} from "lucide-react"
import { OnboardingTour } from "@/components/ui/onboarding-tour"

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
  required: boolean
  component?: React.ReactNode
}

interface OnboardingFlowProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  organizationId?: string
}

export function OnboardingFlow({ isOpen, onClose, onComplete, organizationId }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showTour, setShowTour] = useState(false)
  const [onboardingData, setOnboardingData] = useState({
    organizationName: "",
    description: "",
    website: "",
    primaryColor: "#0891b2",
    secondaryColor: "#7c3aed",
    firstStoryTitle: "",
    firstStoryDescription: "",
    firstStoryGoal: "",
    stripeConnected: false,
    teamMembers: [],
  })

  // Achievement system removed - could add analytics tracking here

  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to NMBR Platform",
      description: "Let's get your organization set up for success",
      icon: <Sparkles className="w-6 h-6" />,
      completed: false,
      required: true,
      component: <WelcomeStep />,
    },
    {
      id: "organization",
      title: "Organization Profile",
      description: "Tell us about your organization",
      icon: <Building2 className="w-6 h-6" />,
      completed: false,
      required: true,
      component: <OrganizationStep data={onboardingData} onChange={setOnboardingData} />,
    },
    {
      id: "branding",
      title: "Brand Customization",
      description: "Customize your organization's appearance",
      icon: <Palette className="w-6 h-6" />,
      completed: false,
      required: false,
      component: <BrandingStep data={onboardingData} onChange={setOnboardingData} />,
    },
    {
      id: "first-story",
      title: "Create Your First Story",
      description: "Set up your first impact story",
      icon: <Target className="w-6 h-6" />,
      completed: false,
      required: true,
      component: <FirstStoryStep data={onboardingData} onChange={setOnboardingData} />,
    },
    {
      id: "payment",
      title: "Payment Setup",
      description: "Connect Stripe to receive donations",
      icon: <CreditCard className="w-6 h-6" />,
      completed: false,
      required: false,
      component: <PaymentStep data={onboardingData} onChange={setOnboardingData} />,
    },
    {
      id: "team",
      title: "Invite Team Members",
      description: "Add collaborators to your organization",
      icon: <Users className="w-6 h-6" />,
      completed: false,
      required: false,
      component: <TeamStep data={onboardingData} onChange={setOnboardingData} />,
    },
    {
      id: "complete",
      title: "Setup Complete",
      description: "Take a tour of your dashboard",
      icon: <Trophy className="w-6 h-6" />,
      completed: false,
      required: true,
      component: <CompletionStep onStartTour={() => setShowTour(true)} />,
    },
  ]

  const [stepStates, setStepStates] = useState(steps)

  useEffect(() => {
    if (isOpen) {
      // Mark first login achievement
      // First login tracked
    }
  }, [isOpen])

  const completedSteps = stepStates.filter((step) => step.completed).length
  const totalSteps = stepStates.length
  const progress = (completedSteps / totalSteps) * 100

  const nextStep = () => {
    if (currentStep < stepStates.length - 1) {
      // Mark current step as completed
      const updatedSteps = stepStates.map((step, index) =>
        index === currentStep ? { ...step, completed: true } : step,
      )
      setStepStates(updatedSteps)
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipStep = () => {
    if (!stepStates[currentStep].required) {
      nextStep()
    }
  }

  const completeOnboarding = async () => {
    // Mark all steps as completed
    const updatedSteps = stepStates.map((step) => ({ ...step, completed: true }))
    setStepStates(updatedSteps)

    // Save onboarding completion
    localStorage.setItem("nmbr-onboarding-completed", "true")
    localStorage.setItem("nmbr-onboarding-data", JSON.stringify(onboardingData))

    // Trigger achievements
    // Brand customization tracked

    onComplete()
  }

  if (!isOpen) return null

  const currentStepData = stepStates[currentStep]

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-white to-cyan-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to NMBR Platform
              </CardTitle>
              <p className="text-muted-foreground">
                Step {currentStep + 1} of {totalSteps} • {Math.round(progress)}% Complete
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          <div className="flex h-[600px]">
            {/* Sidebar with steps */}
            <div className="w-80 border-r bg-gradient-to-b from-gray-50 to-gray-100 p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Overall Progress</span>
                  <span className="text-sm text-gray-500">
                    {completedSteps}/{totalSteps}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="space-y-3">
                {stepStates.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all cursor-pointer ${
                      index === currentStep
                        ? "bg-white shadow-md border-2 border-cyan-200"
                        : index < currentStep
                          ? "bg-green-50 border border-green-200"
                          : "bg-white/50 border border-gray-200"
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        step.completed
                          ? "bg-green-100 text-green-600"
                          : index === currentStep
                            ? "bg-cyan-100 text-cyan-600"
                            : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {step.completed ? <CheckCircle className="w-4 h-4" /> : step.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-medium text-sm ${
                          step.completed ? "text-green-800" : index === currentStep ? "text-cyan-800" : "text-gray-600"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">{step.description}</p>
                      {!step.required && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          Optional
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 p-8 overflow-y-auto">
              <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-gradient-to-br from-cyan-100 to-purple-100 rounded-xl">
                      {currentStepData.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{currentStepData.title}</h2>
                      <p className="text-gray-600">{currentStepData.description}</p>
                    </div>
                  </div>
                </div>

                {/* Step content */}
                <div className="mb-8">{currentStepData.component}</div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center space-x-2 bg-transparent"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </Button>

                  <div className="flex space-x-3">
                    {!currentStepData.required && currentStep < stepStates.length - 1 && (
                      <Button variant="ghost" onClick={skipStep} className="text-gray-500 hover:text-gray-700">
                        Skip for now
                      </Button>
                    )}

                    {currentStep === stepStates.length - 1 ? (
                      <Button
                        onClick={completeOnboarding}
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 flex items-center space-x-2"
                      >
                        <Trophy className="w-4 h-4" />
                        <span>Complete Setup</span>
                      </Button>
                    ) : (
                      <Button
                        onClick={nextStep}
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 flex items-center space-x-2"
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tour integration */}
      <OnboardingTour
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        onComplete={() => {
          setShowTour(false)
          // Tour completion tracked
        }}
      />
    </>
  )
}

// Individual step components
function WelcomeStep() {
  return (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-100 to-purple-100 rounded-full flex items-center justify-center">
        <Sparkles className="w-12 h-12 text-cyan-600" />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Welcome to NMBR Platform! 🎉</h3>
        <p className="text-gray-600 leading-relaxed">
          We're excited to help you create impactful stories and raise funds for your cause. This quick setup will get
          you ready to start making a difference in just a few minutes.
        </p>
      </div>
      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
        <h3 className="font-medium text-cyan-800 mb-2">What you'll accomplish:</h3>
        <ul className="text-sm text-cyan-700 space-y-1">
          <li>✓ Set up your organization profile</li>
          <li>✓ Customize your branding</li>
          <li>✓ Create your first impact story</li>
          <li>✓ Configure payment processing</li>
          <li>✓ Invite team members</li>
        </ul>
      </div>
    </div>
  )
}

function OrganizationStep({ data, onChange }: { data: any; onChange: (data: any) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="orgName" className="text-base font-medium">
          Organization Name *
        </Label>
        <Input
          id="orgName"
          value={data.organizationName}
          onChange={(e) => onChange({ ...data, organizationName: e.target.value })}
          placeholder="Enter your organization name"
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-base font-medium">
          Description
        </Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="Tell us about your organization's mission and goals"
          className="mt-2"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="website" className="text-base font-medium">
          Website
        </Label>
        <Input
          id="website"
          type="url"
          value={data.website}
          onChange={(e) => onChange({ ...data, website: e.target.value })}
          placeholder="https://your-organization.org"
          className="mt-2"
        />
      </div>
    </div>
  )
}

function BrandingStep({ data, onChange }: { data: any; onChange: (data: any) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Choose Your Brand Colors</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="primaryColor" className="text-base font-medium">
              Primary Color
            </Label>
            <div className="flex items-center space-x-3 mt-2">
              <input
                type="color"
                id="primaryColor"
                value={data.primaryColor}
                onChange={(e) => onChange({ ...data, primaryColor: e.target.value })}
                className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
              />
              <Input
                value={data.primaryColor}
                onChange={(e) => onChange({ ...data, primaryColor: e.target.value })}
                placeholder="#0891b2"
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="secondaryColor" className="text-base font-medium">
              Secondary Color
            </Label>
            <div className="flex items-center space-x-3 mt-2">
              <input
                type="color"
                id="secondaryColor"
                value={data.secondaryColor}
                onChange={(e) => onChange({ ...data, secondaryColor: e.target.value })}
                className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
              />
              <Input
                value={data.secondaryColor}
                onChange={(e) => onChange({ ...data, secondaryColor: e.target.value })}
                placeholder="#7c3aed"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="font-medium mb-3">Preview</h3>
        <div
          className="h-24 rounded-lg flex items-center justify-center text-white font-semibold"
          style={{
            background: `linear-gradient(135deg, ${data.primaryColor} 0%, ${data.secondaryColor} 100%)`,
          }}
        >
          {data.organizationName || "Your Organization"}
        </div>
      </div>
    </div>
  )
}

function FirstStoryStep({ data, onChange }: { data: any; onChange: (data: any) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="storyTitle" className="text-base font-medium">
          Story Title *
        </Label>
        <Input
          id="storyTitle"
          value={data.firstStoryTitle}
          onChange={(e) => onChange({ ...data, firstStoryTitle: e.target.value })}
          placeholder="e.g., Clean Water for Rural Village"
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="storyDescription" className="text-base font-medium">
          Story Description
        </Label>
        <Textarea
          id="storyDescription"
          value={data.firstStoryDescription}
          onChange={(e) => onChange({ ...data, firstStoryDescription: e.target.value })}
          placeholder="Describe the impact this story will make..."
          className="mt-2"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="storyGoal" className="text-base font-medium">
          Fundraising Goal
        </Label>
        <div className="relative mt-2">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
          <Input
            id="storyGoal"
            type="number"
            value={data.firstStoryGoal}
            onChange={(e) => onChange({ ...data, firstStoryGoal: e.target.value })}
            placeholder="5000"
            className="pl-8"
          />
        </div>
      </div>
    </div>
  )
}

function PaymentStep({ data, onChange }: { data: any; onChange: (data: any) => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <CreditCard className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">Connect Stripe for Payments</h3>
        <p className="text-gray-600">Connect your Stripe account to start receiving donations securely.</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">Why Stripe?</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>✓ Secure payment processing</li>
          <li>✓ Low transaction fees</li>
          <li>✓ Automatic tax handling</li>
          <li>✓ Global payment support</li>
        </ul>
      </div>

      <Button
        className="w-full bg-[#635bff] hover:bg-[#5a52e8] text-white"
        onClick={() => onChange({ ...data, stripeConnected: true })}
      >
        Connect Stripe Account
      </Button>

      {data.stripeConnected && (
        <div className="flex items-center space-x-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          <span>Stripe account connected successfully!</span>
        </div>
      )}
    </div>
  )
}

function TeamStep({ data, onChange }: { data: any; onChange: (data: any) => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">Invite Team Members</h3>
        <p className="text-gray-600">Add collaborators to help manage your organization and stories.</p>
      </div>

      <div>
        <Label htmlFor="teamEmail" className="text-base font-medium">
          Team Member Email
        </Label>
        <div className="flex space-x-2 mt-2">
          <Input id="teamEmail" type="email" placeholder="colleague@organization.org" className="flex-1" />
          <Button variant="outline">Send Invite</Button>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          💡 You can always invite team members later from your dashboard settings.
        </p>
      </div>
    </div>
  )
}

function CompletionStep({ onStartTour }: { onStartTour: () => void }) {
  return (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
        <Trophy className="w-12 h-12 text-green-600" />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">🎉 Setup Complete!</h3>
        <p className="text-gray-600 leading-relaxed">
          Congratulations! Your organization is now ready to create impactful stories and raise funds. Let's take a
          quick tour of your new dashboard.
        </p>
      </div>

      <div className="bg-gradient-to-r from-cyan-50 to-purple-50 border border-cyan-200 rounded-lg p-6">
        <h3 className="font-medium text-cyan-800 mb-3">What's Next?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2 text-cyan-700">
            <CheckCircle className="w-4 h-4" />
            <span>Take the dashboard tour</span>
          </div>
          <div className="flex items-center space-x-2 text-cyan-700">
            <CheckCircle className="w-4 h-4" />
            <span>Create your first story</span>
          </div>
          <div className="flex items-center space-x-2 text-cyan-700">
            <CheckCircle className="w-4 h-4" />
            <span>Customize your widget</span>
          </div>
          <div className="flex items-center space-x-2 text-cyan-700">
            <CheckCircle className="w-4 h-4" />
            <span>Share with your audience</span>
          </div>
        </div>
      </div>

      <Button
        onClick={onStartTour}
        className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 flex items-center space-x-2"
      >
        <Play className="w-4 h-4" />
        <span>Start Dashboard Tour</span>
      </Button>
    </div>
  )
}

// Onboarding trigger for new users
export function OnboardingTrigger() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    // Check if user has completed onboarding
    const completed = localStorage.getItem("nmbr-onboarding-completed")
    if (!completed) {
      // Show onboarding for new users after a short delay
      setTimeout(() => setShowOnboarding(true), 1000)
    }
  }, [])

  return (
    <>
      <Button
        onClick={() => setShowOnboarding(true)}
        variant="outline"
        className="flex items-center space-x-2 border-purple-200 text-purple-600 hover:bg-purple-50"
      >
        <Sparkles className="w-4 h-4" />
        <span>Setup Guide</span>
      </Button>

      <OnboardingFlow
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={() => setShowOnboarding(false)}
      />
    </>
  )
}
