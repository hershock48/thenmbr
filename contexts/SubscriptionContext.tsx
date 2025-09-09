"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface SubscriptionTier {
  id: string
  name: string
  monthlyPrice: number
  annualPrice: number
  activeNmbrs: number // -1 for unlimited
  platformFee: number
  seats: number // -1 for unlimited
  features: string[]
  isActive: boolean
}

export interface OrganizationSubscription {
  id: string
  organizationId: string
  tierId: string
  tier: SubscriptionTier
  status: 'active' | 'inactive' | 'trial' | 'cancelled'
  currentPeriodStart: string
  currentPeriodEnd: string
  trialEndsAt?: string
  activeNmbrsUsed: number
  seatsUsed: number
  createdAt: string
  updatedAt: string
}

interface SubscriptionContextType {
  subscription: OrganizationSubscription | null
  tier: SubscriptionTier | null
  isLoading: boolean
  canCreateNmbr: () => boolean
  canAddSeat: () => boolean
  canUseFeature: (feature: string) => boolean
  getRemainingNmbrs: () => number
  getRemainingSeats: () => number
  upgradeSubscription: (tierId: string) => Promise<void>
  downgradeSubscription: (tierId: string) => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

// Mock subscription tiers
const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 99,
    annualPrice: 990,
    activeNmbrs: 3,
    platformFee: 5,
    seats: 2,
    features: ['basic_analytics', 'csv_exports', 'basic_branding'],
    isActive: true
  },
  {
    id: 'growth',
    name: 'Growth',
    monthlyPrice: 199,
    annualPrice: 1990,
    activeNmbrs: 5,
    platformFee: 3,
    seats: -1, // unlimited
    features: ['basic_analytics', 'csv_exports', 'advanced_branding', 'integrations', 'marketplace'],
    isActive: true
  },
  {
    id: 'professional',
    name: 'Professional',
    monthlyPrice: 399,
    annualPrice: 3990,
    activeNmbrs: 10,
    platformFee: 1,
    seats: -1, // unlimited
    features: ['basic_analytics', 'csv_exports', 'advanced_branding', 'integrations', 'marketplace', 'white_label', 'api_access', 'built_in_email', 'team_roles'],
    isActive: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 750,
    annualPrice: 9000,
    activeNmbrs: -1, // unlimited
    platformFee: 0,
    seats: -1, // unlimited
    features: ['basic_analytics', 'csv_exports', 'advanced_branding', 'integrations', 'marketplace', 'white_label', 'api_access', 'built_in_email', 'team_roles', 'sso', 'advanced_security'],
    isActive: true
  }
]

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<OrganizationSubscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock loading subscription data
    const loadSubscription = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock subscription data - in real app, this would come from API
      const mockSubscription: OrganizationSubscription = {
        id: 'sub_123',
        organizationId: 'org_123',
        tierId: 'growth',
        tier: SUBSCRIPTION_TIERS.find(t => t.id === 'growth')!,
        status: 'active',
        currentPeriodStart: '2024-01-01T00:00:00Z',
        currentPeriodEnd: '2024-02-01T00:00:00Z',
        activeNmbrsUsed: 2,
        seatsUsed: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
      
      setSubscription(mockSubscription)
      setIsLoading(false)
    }

    loadSubscription()
  }, [])

  const canCreateNmbr = (): boolean => {
    if (!subscription || !subscription.tier) return false
    if (subscription.tier.activeNmbrs === -1) return true // unlimited
    return subscription.activeNmbrsUsed < subscription.tier.activeNmbrs
  }

  const canAddSeat = (): boolean => {
    if (!subscription || !subscription.tier) return false
    if (subscription.tier.seats === -1) return true // unlimited
    return subscription.seatsUsed < subscription.tier.seats
  }

  const canUseFeature = (feature: string): boolean => {
    if (!subscription || !subscription.tier) return false
    return subscription.tier.features.includes(feature)
  }

  const getRemainingNmbrs = (): number => {
    if (!subscription || !subscription.tier) return 0
    if (subscription.tier.activeNmbrs === -1) return -1 // unlimited
    return Math.max(0, subscription.tier.activeNmbrs - subscription.activeNmbrsUsed)
  }

  const getRemainingSeats = (): number => {
    if (!subscription || !subscription.tier) return 0
    if (subscription.tier.seats === -1) return -1 // unlimited
    return Math.max(0, subscription.tier.seats - subscription.seatsUsed)
  }

  const upgradeSubscription = async (tierId: string): Promise<void> => {
    // Mock upgrade - in real app, this would call API
    const newTier = SUBSCRIPTION_TIERS.find(t => t.id === tierId)
    if (newTier && subscription) {
      setSubscription({
        ...subscription,
        tierId,
        tier: newTier,
        updatedAt: new Date().toISOString()
      })
    }
  }

  const downgradeSubscription = async (tierId: string): Promise<void> => {
    // Mock downgrade - in real app, this would call API
    const newTier = SUBSCRIPTION_TIERS.find(t => t.id === tierId)
    if (newTier && subscription) {
      setSubscription({
        ...subscription,
        tierId,
        tier: newTier,
        updatedAt: new Date().toISOString()
      })
    }
  }

  const value: SubscriptionContextType = {
    subscription,
    tier: subscription?.tier || null,
    isLoading,
    canCreateNmbr,
    canAddSeat,
    canUseFeature,
    getRemainingNmbrs,
    getRemainingSeats,
    upgradeSubscription,
    downgradeSubscription
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}
