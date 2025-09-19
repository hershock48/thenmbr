// AI Usage Context for managing AI Review limits and tier information
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { aiService, type UsageStats } from '@/lib/ai-service'

interface AIUsageContextType {
  usage: UsageStats | null
  loading: boolean
  canUseAI: boolean
  checkUsage: () => Promise<void>
  upgradeTier: (tier: 'free' | 'starter' | 'growth' | 'pro') => Promise<void>
  error: string | null
}

const AIUsageContext = createContext<AIUsageContextType | undefined>(undefined)

export function AIUsageProvider({ children }: { children: React.ReactNode }) {
  const [usage, setUsage] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkUsage = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get current user ID (in a real app, this would come from auth context)
      const userId = 'current-user' // This should come from your auth system
      const usageStats = await aiService.getUserUsageStats(userId)
      setUsage(usageStats)
    } catch (err) {
      console.error('Failed to check AI usage:', err)
      setError('Failed to load AI usage information')
    } finally {
      setLoading(false)
    }
  }

  const upgradeTier = async (tier: 'free' | 'starter' | 'growth' | 'pro') => {
    try {
      setLoading(true)
      setError(null)
      
      const userId = 'current-user'
      await aiService.upgradeUserTier(userId, tier)
      await checkUsage() // Refresh usage stats
    } catch (err) {
      console.error('Failed to upgrade tier:', err)
      setError('Failed to upgrade tier')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkUsage()
  }, [])

  const canUseAI = usage?.canUseAI ?? false

  const value: AIUsageContextType = {
    usage,
    loading,
    canUseAI,
    checkUsage,
    upgradeTier,
    error
  }

  return (
    <AIUsageContext.Provider value={value}>
      {children}
    </AIUsageContext.Provider>
  )
}

export function useAIUsage() {
  const context = useContext(AIUsageContext)
  if (context === undefined) {
    throw new Error('useAIUsage must be used within an AIUsageProvider')
  }
  return context
}
