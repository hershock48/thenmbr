"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"

interface TrialInfo {
  startDate: Date
  endDate: Date
  daysRemaining: number
  isActive: boolean
  usage: {
    nmbrsCreated: number
    maxNmbrs: number
    emailsCaptured: number
    dashboardVisits: number
  }
  plan: 'starter' | 'growth' | 'professional'
  conversionTriggers: {
    showUsagePrompt: boolean
    showFeatureTeaser: boolean
    showCountdown: boolean
    showUpgradeModal: boolean
  }
}

interface TrialContextType {
  trialInfo: TrialInfo
  updateUsage: (usage: Partial<TrialInfo['usage']>) => void
  triggerConversionPrompt: (type: keyof TrialInfo['conversionTriggers']) => void
  dismissConversionPrompt: (type: keyof TrialInfo['conversionTriggers']) => void
  isNearExpiration: boolean
  shouldShowUrgency: boolean
}

const TrialContext = createContext<TrialContextType | undefined>(undefined)

export function TrialProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [trialInfo, setTrialInfo] = useState<TrialInfo>({
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    daysRemaining: 14,
    isActive: true,
    usage: {
      nmbrsCreated: 0,
      maxNmbrs: 3, // Starter plan limit
      emailsCaptured: 0,
      dashboardVisits: 0
    },
    plan: 'starter',
    conversionTriggers: {
      showUsagePrompt: false,
      showFeatureTeaser: false,
      showCountdown: false,
      showUpgradeModal: false
    }
  })

  // Calculate days remaining
  useEffect(() => {
    const calculateDaysRemaining = () => {
      const now = new Date()
      const timeDiff = trialInfo.endDate.getTime() - now.getTime()
      const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24))
      
      setTrialInfo(prev => ({
        ...prev,
        daysRemaining: Math.max(0, daysRemaining),
        isActive: daysRemaining > 0
      }))
    }

    calculateDaysRemaining()
    const interval = setInterval(calculateDaysRemaining, 1000 * 60 * 60) // Check hourly

    return () => clearInterval(interval)
  }, [trialInfo.endDate])

  // Auto-trigger conversion prompts based on usage and time
  useEffect(() => {
    const triggers = { ...trialInfo.conversionTriggers }
    
    // Show usage prompt when they've used most of their NMBRs
    if (trialInfo.usage.nmbrsCreated >= trialInfo.usage.maxNmbrs - 1) {
      triggers.showUsagePrompt = true
    }
    
    // Show countdown when 3 days or less remaining
    if (trialInfo.daysRemaining <= 3) {
      triggers.showCountdown = true
    }
    
    // Show feature teaser after 5 days
    const daysSinceStart = Math.floor((Date.now() - trialInfo.startDate.getTime()) / (1000 * 3600 * 24))
    if (daysSinceStart >= 5) {
      triggers.showFeatureTeaser = true
    }
    
    // Show upgrade modal when 1 day remaining
    if (trialInfo.daysRemaining === 1) {
      triggers.showUpgradeModal = true
    }

    setTrialInfo(prev => ({ ...prev, conversionTriggers: triggers }))
  }, [trialInfo.usage.nmbrsCreated, trialInfo.daysRemaining, trialInfo.startDate])

  const updateUsage = (usage: Partial<TrialInfo['usage']>) => {
    setTrialInfo(prev => ({
      ...prev,
      usage: { ...prev.usage, ...usage }
    }))
  }

  const triggerConversionPrompt = (type: keyof TrialInfo['conversionTriggers']) => {
    setTrialInfo(prev => ({
      ...prev,
      conversionTriggers: {
        ...prev.conversionTriggers,
        [type]: true
      }
    }))
  }

  const dismissConversionPrompt = (type: keyof TrialInfo['conversionTriggers']) => {
    setTrialInfo(prev => ({
      ...prev,
      conversionTriggers: {
        ...prev.conversionTriggers,
        [type]: false
      }
    }))
  }

  const isNearExpiration = trialInfo.daysRemaining <= 3
  const shouldShowUrgency = trialInfo.daysRemaining <= 1 || trialInfo.usage.nmbrsCreated >= trialInfo.usage.maxNmbrs

  return (
    <TrialContext.Provider value={{
      trialInfo,
      updateUsage,
      triggerConversionPrompt,
      dismissConversionPrompt,
      isNearExpiration,
      shouldShowUrgency
    }}>
      {children}
    </TrialContext.Provider>
  )
}

export function useTrial() {
  const context = useContext(TrialContext)
  if (context === undefined) {
    throw new Error('useTrial must be used within a TrialProvider')
  }
  return context
}
