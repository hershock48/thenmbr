"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Target, 
  Users, 
  Heart, 
  BarChart3,
  Gift,
  Share2,
  Eye,
  Edit,
  Plus
} from "lucide-react"

interface TourStep {
  id: string
  title: string
  description: string
  target: string
  position: 'top' | 'bottom' | 'left' | 'right'
  icon: React.ReactNode
  highlight?: boolean
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to NMBR Platform! 🎉',
    description: 'Let\'s take a quick tour of your dashboard to help you get started with creating impactful stories and raising funds.',
    target: 'tour-welcome',
    position: 'bottom',
    icon: <Sparkles className="w-6 h-6" />,
    highlight: true
  },
  {
    id: 'stats',
    title: 'Your Impact Dashboard',
    description: 'Track your organization\'s performance with real-time statistics. Monitor stories, subscribers, and funds raised.',
    target: 'stats-cards',
    position: 'bottom',
    icon: <BarChart3 className="w-6 h-6" />
  },
  {
    id: 'stories',
    title: 'Manage Your Stories',
    description: 'Create and manage compelling stories that inspire action. Each story can be shared to raise awareness and funds.',
    target: 'stories-section',
    position: 'top',
    icon: <Target className="w-6 h-6" />
  },
  {
    id: 'actions',
    title: 'Quick Actions',
    description: 'Create new stories, view analytics, and manage your content with these quick action buttons.',
    target: 'quick-actions',
    position: 'left',
    icon: <Plus className="w-6 h-6" />
  },
  {
    id: 'story-card',
    title: 'Story Management',
    description: 'Each story card shows key metrics, status, and quick actions. Click to edit, view, or share your stories.',
    target: 'story-card-example',
    position: 'top',
    icon: <Edit className="w-6 h-6" />
  },
  {
    id: 'org-management',
    title: 'Multi-Organization Management',
    description: 'You can manage multiple organizations with one account! Click "Switch Org" to change organizations or add new ones.',
    target: 'switch-org-button',
    position: 'bottom',
    icon: <Users className="w-6 h-6" />
  },
  {
    id: 'complete',
    title: 'You\'re All Set! 🚀',
    description: 'You now know your way around the dashboard. Start creating impactful stories and making a difference!',
    target: 'tour-complete',
    position: 'bottom',
    icon: <Heart className="w-6 h-6" />,
    highlight: true
  }
]

interface OnboardingTourProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export function OnboardingTour({ isOpen, onClose, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      // Add a small delay for smooth animation
      setTimeout(() => {
        highlightCurrentStep()
      }, 100)
    } else {
      setIsVisible(false)
    }
  }, [isOpen, currentStep])

  const highlightCurrentStep = () => {
    const step = tourSteps[currentStep]
    if (step) {
      const element = document.querySelector(`[data-tour="${step.target}"]`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  const nextStep = async () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Mark tour as completed and trigger achievement
      try {
        // Use static import instead of dynamic import
        const { useAchievements } = require('@/components/ui/achievement-system')
        const { updateAchievement } = useAchievements()
        updateAchievement('tour-completed', 1)
      } catch (err) {
        console.log('Achievement system not available:', err)
        // Fallback: just mark tour as completed in localStorage
        localStorage.setItem('nmbr-tour-completed', 'true')
      }
      onComplete()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipTour = () => {
    onComplete()
  }

  if (!isOpen || !isVisible) return null

  const currentStepData = tourSteps[currentStep]
  const progress = ((currentStep + 1) / tourSteps.length) * 100

  return (
    <>
      {/* Overlay - Much lighter and less blurry */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-40" />
      
      {/* Tour Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-gradient-to-br from-white to-cyan-50">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {currentStepData.icon}
                <span className="text-sm font-medium text-muted-foreground">
                  Step {currentStep + 1} of {tourSteps.length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={skipTour}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-foreground mb-2">
                {currentStepData.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {currentStepData.description}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              <div className="flex space-x-2">
                {tourSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep 
                        ? 'bg-cyan-500' 
                        : index < currentStep 
                          ? 'bg-cyan-300' 
                          : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={nextStep}
                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              >
                <span>{currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Skip Option */}
            <div className="text-center mt-4">
              <Button
                variant="ghost"
                onClick={skipTour}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Skip tour
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Highlight Overlay for Current Step */}
      {currentStepData && (
        <div className="fixed inset-0 z-45 pointer-events-none">
          {(() => {
            const element = document.querySelector(`[data-tour="${currentStepData.target}"]`)
            if (element) {
              const rect = element.getBoundingClientRect()
              return (
                <>
                  {/* Subtle highlight ring */}
                  <div
                    className="absolute border-2 border-cyan-400 rounded-lg shadow-xl bg-cyan-400/5"
                    style={{
                      left: rect.left - 12,
                      top: rect.top - 12,
                      width: rect.width + 24,
                      height: rect.height + 24,
                      animation: 'pulse 2s infinite'
                    }}
                  />
                  {/* Bright spot to make element more visible */}
                  <div
                    className="absolute border border-cyan-300 rounded-lg bg-cyan-300/20"
                    style={{
                      left: rect.left - 4,
                      top: rect.top - 4,
                      width: rect.width + 8,
                      height: rect.height + 8,
                    }}
                  />
                </>
              )
            }
            return null
          })()}
        </div>
      )}
    </>
  )
}

// Tour trigger component for dashboard
export function TourTrigger() {
  const [showTour, setShowTour] = useState(false)

  const startTour = () => {
    setShowTour(true)
  }

  const completeTour = () => {
    setShowTour(false)
    // Store in localStorage that user has completed tour
    localStorage.setItem('nmbr-tour-completed', 'true')
  }

  return (
    <>
      <Button
        onClick={startTour}
        variant="outline"
        className="flex items-center space-x-2 border-cyan-200 text-cyan-600 hover:bg-cyan-50"
      >
        <Sparkles className="w-4 h-4" />
        <span>Take a Tour</span>
      </Button>
      
      <OnboardingTour
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        onComplete={completeTour}
      />
    </>
  )
}
