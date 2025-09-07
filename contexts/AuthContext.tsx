'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Nonprofit } from '@/types'

interface AuthContextType {
  user: User | null
  org: Nonprofit | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, orgName: string, website?: string) => Promise<void>
  signOut: () => Promise<void>
  setOrg: (org: Nonprofit | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [org, setOrg] = useState<Nonprofit | null>(null)
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
          .from('nonprofits')
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

  const signUp = async (email: string, password: string, orgName: string, website?: string) => {
    console.log('AuthContext signUp called with:', { email, orgName, website })
    try {
      console.log('Starting signup process...')
      
      // First create the user account
      console.log('Creating user account...')
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            org_name: orgName,
            website: website || null,
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
          .from('nonprofits')
          .insert({
            name: orgName,
            website: website || null,
            brand_color: '#3B82F6'
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

  const value = {
    user,
    org,
    loading,
    signIn,
    signUp,
    signOut,
    setOrg,
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
