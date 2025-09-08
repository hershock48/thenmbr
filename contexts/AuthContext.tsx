'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Organization, OrganizationType, ORGANIZATION_TYPES } from '@/types'
import { getTerminologyByOrgType, getDefaultSettingsByOrgType } from '@/lib/content-system'

interface AuthContextType {
  user: User | null
  org: Organization | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, orgName: string, website?: string, orgType?: OrganizationType) => Promise<void>
  signOut: () => Promise<void>
  setOrg: (org: Organization | null) => void
  getOrgType: () => OrganizationType | null
  getTerminology: () => Record<string, string>
  getDefaultSettings: () => Record<string, any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [org, setOrg] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchOrg(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          // Don't automatically fetch org - let user select
          setLoading(false)
        } else {
          setOrg(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchOrg = async (userId: string) => {
    try {
      // Get user's org_id from their metadata
      const { data: { user } } = await supabase.auth.getUser()
      const orgId = user?.user_metadata?.org_id

      console.log('Fetching org for user:', userId, 'orgId:', orgId)

      if (orgId) {
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', orgId)
          .single()

        console.log('Org fetch result:', { data, error })

        if (!error && data) {
          setOrg(data)
          console.log('Organization set:', data)
        } else {
          console.error('Organization not found or error:', error)
          // Don't set org if it doesn't exist, but don't get stuck loading
        }
      } else {
        console.log('No org_id found in user metadata')
      }
    } catch (error) {
      console.error('Error fetching org:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    
    // Trigger first login achievement
    if (data.user) {
      try {
        const { useAchievements } = await import('@/components/ui/achievement-system')
        const { updateAchievement } = useAchievements()
        updateAchievement('first-login', 1)
      } catch (err) {
        console.log('Achievement system not available:', err)
      }
    }
  }

  const signUp = async (email: string, password: string, orgName: string, website?: string, orgType: OrganizationType = 'nonprofit') => {
    console.log('AuthContext signUp called with:', { email, orgName, website, orgType })
    try {
      console.log('Starting signup process...')
      
      // Get default settings for organization type
      const defaultSettings = getDefaultSettingsByOrgType(orgType)
      
      // First create the user account
      console.log('Creating user account...')
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            org_name: orgName,
            website: website || null,
            org_type: orgType,
            role: 'admin'
          }
        }
      })

      if (error) {
        console.error('Auth signup error:', error)
        throw error
      }

      console.log('Signup successful:', data)
      
      // Check if email confirmation is required
      if (data.user && !data.session) {
        console.log('Email confirmation required. Please check your email.')
        // Don't throw an error, just inform the user
        return
      }
      
      // If user is immediately authenticated, create the organization
      if (data.user && data.session) {
        console.log('User authenticated, creating organization...')
        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .insert({
            name: orgName,
            website: website || null,
            organization_type: orgType,
            brand_color: '#3B82F6',
            show_powered_by: defaultSettings.showPoweredBy,
            metadata: {
              // Add type-specific metadata
              ...(orgType === 'nonprofit' && { tax_exempt_status: false }),
              ...(orgType === 'business' && { industry: 'General' }),
              ...(orgType === 'grassroots' && { community_focus: 'General' })
            }
          })
          .select()
          .single()

        if (orgError) {
          console.error('Org creation error:', orgError)
          throw orgError
        }

        console.log('Organization created:', org)
      }
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Helper functions for organization type management
  const getOrgType = (): OrganizationType | null => {
    return org?.organization_type || null
  }

  const getTerminology = (): Record<string, string> => {
    const orgType = getOrgType()
    if (!orgType) return {}
    return getTerminologyByOrgType(orgType)
  }

  const getDefaultSettings = (): Record<string, any> => {
    const orgType = getOrgType()
    if (!orgType) return {}
    return getDefaultSettingsByOrgType(orgType)
  }

  const value = {
    user,
    org,
    loading,
    signIn,
    signUp,
    signOut,
    setOrg,
    getOrgType,
    getTerminology,
    getDefaultSettings,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
