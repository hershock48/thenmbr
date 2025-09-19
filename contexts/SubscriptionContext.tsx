"use client"

import { createContext, useContext, useState, useEffect } from "react"

export interface SubscriptionTier {
  id: string
  name: string
  price: number
  features: string[]
  limits: {
    stories: number
    subscribers: number
    newsletters: number
    aiReviews: number
  }
}

export interface Subscription {
  tier: SubscriptionTier
  status: 'active' | 'cancelled' | 'past_due' | 'trialing'
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
}

interface SubscriptionContextType {
  subscription: Subscription | null
  tier: SubscriptionTier | null
  loading: boolean
  canUseFeature: (feature: string) => boolean
  upgradeTier: (tierId: string) => Promise<void>
  cancelSubscription: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

const TIER_INFO: Record<string, SubscriptionTier> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: ['Basic stories', 'Email campaigns', 'Basic analytics'],
    limits: {
      stories: 3,
      subscribers: 100,
      newsletters: 10,
      aiReviews: 5
    }
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 29,
    features: ['10 stories', '500 subscribers', 'Unlimited newsletters', 'AI Review'],
    limits: {
      stories: 10,
      subscribers: 500,
      newsletters: 999999,
      aiReviews: 100
    }
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    price: 99,
    features: ['50 stories', '2000 subscribers', 'Advanced analytics', 'Priority support'],
    limits: {
      stories: 50,
      subscribers: 2000,
      newsletters: 999999,
      aiReviews: 500
    }
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    price: 299,
    features: ['Unlimited stories', 'Unlimited subscribers', 'White-label', 'API access'],
    limits: {
      stories: 999999,
      subscribers: 999999,
      newsletters: 999999,
      aiReviews: 999999
    }
  }
}

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch from your database
    // For now, we'll use localStorage to simulate user data
    const loadSubscription = () => {
      try {
        const stored = localStorage.getItem('subscription')
        if (stored) {
          const parsed = JSON.parse(stored)
          setSubscription({
            ...parsed,
            currentPeriodEnd: new Date(parsed.currentPeriodEnd)
          })
        } else {
          // Default to free tier
          setSubscription({
            tier: TIER_INFO.free,
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            cancelAtPeriodEnd: false
          })
        }
      } catch (error) {
        console.error('Failed to load subscription:', error)
        setSubscription({
          tier: TIER_INFO.free,
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          cancelAtPeriodEnd: false
        })
      } finally {
        setLoading(false)
      }
    }

    loadSubscription()
  }, [])

  const canUseFeature = (feature: string): boolean => {
    if (!subscription) return false
    
    switch (feature) {
      case 'ai_review':
        return subscription.tier.limits.aiReviews > 0
      case 'advanced_analytics':
        return subscription.tier.id !== 'free'
      case 'white_label':
        return subscription.tier.id === 'professional'
      case 'api_access':
        return subscription.tier.id === 'professional'
      default:
        return true
    }
  }

  const upgradeTier = async (tierId: string): Promise<void> => {
    const newTier = TIER_INFO[tierId]
    if (!newTier) throw new Error('Invalid tier ID')

    // In a real app, this would call your payment API
    const newSubscription: Subscription = {
      tier: newTier,
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      cancelAtPeriodEnd: false
    }

    setSubscription(newSubscription)
    localStorage.setItem('subscription', JSON.stringify(newSubscription))
  }

  const cancelSubscription = async (): Promise<void> => {
    if (!subscription) return

    // In a real app, this would call your payment API
    const cancelledSubscription: Subscription = {
      ...subscription,
      status: 'cancelled',
      cancelAtPeriodEnd: true
    }

    setSubscription(cancelledSubscription)
    localStorage.setItem('subscription', JSON.stringify(cancelledSubscription))
  }

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        tier: subscription?.tier || null,
        loading,
        canUseFeature,
        upgradeTier,
        cancelSubscription
      }}
    >
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
