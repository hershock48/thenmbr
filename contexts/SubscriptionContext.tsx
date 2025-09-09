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
  incrementNmbrUsage: () => void
  decrementNmbrUsage: () => void
  incrementSeatUsage: () => void
  decrementSeatUsage: () => void
  purchaseSubscription: (tierId: string, billingPeriod: 'monthly' | 'annual') => Promise<void>
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
    features: ['basic_analytics', 'csv_exports', 'basic_branding', 'email_campaigns'],
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
    features: ['basic_analytics', 'csv_exports', 'advanced_branding', 'integrations', 'marketplace', 'email_campaigns', 'sms_updates'],
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
    features: ['basic_analytics', 'csv_exports', 'advanced_branding', 'integrations', 'marketplace', 'white_label', 'api_access', 'built_in_email', 'team_roles', 'email_campaigns', 'sms_updates', 'push_notifications', 'supporter_feed'],
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
    features: ['basic_analytics', 'csv_exports', 'advanced_branding', 'integrations', 'marketplace', 'white_label', 'api_access', 'built_in_email', 'team_roles', 'sso', 'advanced_security', 'email_campaigns', 'sms_updates', 'push_notifications', 'supporter_feed'],
    isActive: true
  }
]

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<OrganizationSubscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load subscription data from localStorage or API
    const loadSubscription = async () => {
      try {
        // Check localStorage first (for demo purposes)
        const storedSubscription = localStorage.getItem('organization_subscription')
        
        if (storedSubscription) {
          const parsed = JSON.parse(storedSubscription)
          const tier = SUBSCRIPTION_TIERS.find(t => t.id === parsed.tierId)
          if (tier) {
            setSubscription({
              ...parsed,
              tier
            })
          }
        } else {
          // Default to starter tier for new organizations
          const defaultSubscription: OrganizationSubscription = {
            id: 'sub_default',
            organizationId: 'org_default',
            tierId: 'starter',
            tier: SUBSCRIPTION_TIERS.find(t => t.id === 'starter')!,
            status: 'trial',
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
            activeNmbrsUsed: 0,
            seatsUsed: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          setSubscription(defaultSubscription)
          localStorage.setItem('organization_subscription', JSON.stringify(defaultSubscription))
        }
      } catch (error) {
        console.error('Error loading subscription:', error)
        // Fallback to starter tier
        const fallbackSubscription: OrganizationSubscription = {
          id: 'sub_fallback',
          organizationId: 'org_fallback',
          tierId: 'starter',
          tier: SUBSCRIPTION_TIERS.find(t => t.id === 'starter')!,
          status: 'trial',
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          activeNmbrsUsed: 0,
          seatsUsed: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setSubscription(fallbackSubscription)
      } finally {
        setIsLoading(false)
      }
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
      const updatedSubscription = {
        ...subscription,
        tierId,
        tier: newTier,
        updatedAt: new Date().toISOString()
      }
      setSubscription(updatedSubscription)
      localStorage.setItem('organization_subscription', JSON.stringify(updatedSubscription))
    }
  }

  const incrementNmbrUsage = (): void => {
    if (subscription) {
      const updatedSubscription = {
        ...subscription,
        activeNmbrsUsed: subscription.activeNmbrsUsed + 1,
        updatedAt: new Date().toISOString()
      }
      setSubscription(updatedSubscription)
      localStorage.setItem('organization_subscription', JSON.stringify(updatedSubscription))
    }
  }

  const decrementNmbrUsage = (): void => {
    if (subscription) {
      const updatedSubscription = {
        ...subscription,
        activeNmbrsUsed: Math.max(0, subscription.activeNmbrsUsed - 1),
        updatedAt: new Date().toISOString()
      }
      setSubscription(updatedSubscription)
      localStorage.setItem('organization_subscription', JSON.stringify(updatedSubscription))
    }
  }

  const incrementSeatUsage = (): void => {
    if (subscription) {
      const updatedSubscription = {
        ...subscription,
        seatsUsed: subscription.seatsUsed + 1,
        updatedAt: new Date().toISOString()
      }
      setSubscription(updatedSubscription)
      localStorage.setItem('organization_subscription', JSON.stringify(updatedSubscription))
    }
  }

  const decrementSeatUsage = (): void => {
    if (subscription) {
      const updatedSubscription = {
        ...subscription,
        seatsUsed: Math.max(1, subscription.seatsUsed - 1), // Minimum 1 seat
        updatedAt: new Date().toISOString()
      }
      setSubscription(updatedSubscription)
      localStorage.setItem('organization_subscription', JSON.stringify(updatedSubscription))
    }
  }

  const purchaseSubscription = async (tierId: string, billingPeriod: 'monthly' | 'annual'): Promise<void> => {
    const newTier = SUBSCRIPTION_TIERS.find(t => t.id === tierId)
    if (newTier && subscription) {
      const updatedSubscription = {
        ...subscription,
        tierId,
        tier: newTier,
        status: 'active' as const,
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + (billingPeriod === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      }
      setSubscription(updatedSubscription)
      localStorage.setItem('organization_subscription', JSON.stringify(updatedSubscription))
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
    downgradeSubscription,
    incrementNmbrUsage,
    decrementNmbrUsage,
    incrementSeatUsage,
    decrementSeatUsage,
    purchaseSubscription
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
