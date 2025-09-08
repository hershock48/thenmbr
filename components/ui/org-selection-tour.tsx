"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Building2, 
  Plus,
  Users,
  CheckCircle
} from "lucide-react"

interface OrgTourStep {
  id: string
  title: string
  description: string
  target: string
  position: 'top' | 'bottom' | 'left' | 'right'
  icon: React.ReactNode
  highlight?: boolean
}

const orgTourSteps: OrgTourStep[] = [
  {
    id: 'welcome',
    title: 'Organization Management 🏢',
    description: 'You can manage multiple organizations with one account! This gives you flexibility to work with different causes and organizations.',
    target: 'org-selection-welcome',
    position: 'bottom',
    icon: <Building2 className="w-6 h-6" />,
    highlight: true
  },
  {
    id: 'org-grid',
    title: 'Your Organizations',
    description: 'Here are all the organizations you can manage. Click on any organization to select it and continue to the dashboard.',
    target: 'organizations-grid',
    position: 'top',
    icon: <Users className="w-6 h-6" />
  },
  {
    id: 'create-new',
    title: 'Add New Organizations',
    description: 'Need to manage another organization? Click "Create New Organization" to add a new one to your account.',
    target: 'create-new-org',
    position: 'top',
    icon: <Plus className="w-6 h-6" />
  },
  {
    id: 'complete',
    title: 'Ready to Go! 🚀',
    description: 'Select an organization to continue to your dashboard, or create a new one to get started!',
    target: 'org-selection-welcome',
    position: 'bottom',
    icon: <CheckCircle className="w-6 h-6" />,
    highlight: true
  }
]

interface OrgSelectionTourProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export function OrgSelectionTour({ isOpen, onClose, onComplete }: OrgSelectionTourProps) {
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
    const step = orgTourSteps[currentStep]
    if (step) {
      const element = document.querySelector(`[data-tour="${step.target}"]`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  const nextStep = () => {
    if (currentStep < orgTourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Trigger tour completion achievement
      try {
        const { useAchievements } = require('@/components/ui/achievement-system')
        const { updateAchievement } = useAchievements()
        updateAchievement('tour-completed', 1)
      } catch (err) {
        console.log('Achievement system not available:', err)
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

  const currentStepData = orgTourSteps[currentStep]
  const progress = ((currentStep + 1) / orgTourSteps.length) * 100

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
      
      {/* Tour Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-gradient-to-br from-white to-cyan-50">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {currentStepData.icon}
                <span className="text-sm font-medium text-muted-foreground">
                  Step {currentStep + 1} of {orgTourSteps.length}
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
                {orgTourSteps.map((_, index) => (
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
                <span>{currentStep === orgTourSteps.length - 1 ? 'Got It!' : 'Next'}</span>
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
        <div className="fixed inset-0 z-40 pointer-events-none">
          {(() => {
            const element = document.querySelector(`[data-tour="${currentStepData.target}"]`)
            if (element) {
              const rect = element.getBoundingClientRect()
              return (
                <div
                  className="absolute border-2 border-cyan-500 rounded-lg shadow-lg bg-cyan-500/10 backdrop-blur-sm"
                  style={{
                    left: rect.left - 8,
                    top: rect.top - 8,
                    width: rect.width + 16,
                    height: rect.height + 16,
                    animation: 'pulse 2s infinite'
                  }}
                />
              )
            }
            return null
          })()}
        </div>
      )}
    </>
  )
}
