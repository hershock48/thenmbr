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
          await fetchOrg(session.user.id)
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

      if (orgId) {
        const { data, error } = await supabase
          .from('nonprofits')
          .select('*')
          .eq('id', orgId)
          .single()

        if (!error && data) {
          setOrg(data)
        }
      }
    } catch (error) {
      console.error('Error fetching org:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, orgName: string, website?: string) => {
    try {
      // First create the organization
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

      // Then create the user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            org_id: org.id,
            role: 'admin'
          }
        }
      })

      if (error) {
        console.error('Auth signup error:', error)
        throw error
      }

      console.log('Signup successful:', data)
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
