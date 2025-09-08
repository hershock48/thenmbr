'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Nonprofit } from '@/types'
import { authService, User, UserRole, Permission, AuthState } from '@/lib/auth'

interface EnhancedAuthContextType extends AuthState {
  // Legacy properties for backward compatibility
  org: Nonprofit | null
  setOrg: (org: Nonprofit | null) => void
  
  // Enhanced authentication methods
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, orgName: string, website?: string) => Promise<{ error: string | null }>
  signOut: () => Promise<{ error: string | null }>
  
  // Permission and role management
  hasPermission: (permission: Permission) => boolean
  hasAnyPermission: (permissions: Permission[]) => boolean
  hasAllPermissions: (permissions: Permission[]) => boolean
  canAccessOrganization: (organizationId: string) => boolean
  isAdmin: () => boolean
  isOrgAdmin: () => boolean
  isOrgMember: () => boolean
  isDonor: () => boolean
  
  // User management
  updateProfile: (updates: Partial<{
    firstName: string
    lastName: string
    organizationId: string
    organizationRole: string
  }>) => Promise<{ error: string | null }>
  refreshUser: () => Promise<void>
  
  // Organization management
  switchOrganization: (orgId: string) => Promise<{ error: string | null }>
  getAvailableOrganizations: () => Promise<{ organizations: Nonprofit[]; error: string | null }>
}

const EnhancedAuthContext = createContext<EnhancedAuthContextType | undefined>(undefined)

export function EnhancedAuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null
  })
  
  const [org, setOrg] = useState<Nonprofit | null>(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
        
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // Get enhanced user profile
          const { user, error } = await authService.getCurrentUser()
          
          if (error) {
            console.error('Error getting user profile:', error)
            setAuthState(prev => ({ 
              ...prev, 
              isLoading: false, 
              error,
              isAuthenticated: false,
              user: null
            }))
            return
          }
          
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: !!user,
            error: null
          })
          
          // Fetch organization if user has one
          if (user?.organizationId) {
            await fetchOrganization(user.organizationId)
          }
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            error: null
          })
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        setAuthState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Unknown error',
          isAuthenticated: false,
          user: null
        }))
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session?.user) {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            error: null
          })
          setOrg(null)
          return
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          try {
            setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
            
            const { user, error } = await authService.getCurrentUser()
            
            if (error) {
              console.error('Error getting user profile:', error)
              setAuthState(prev => ({ 
                ...prev, 
                isLoading: false, 
                error,
                isAuthenticated: false,
                user: null
              }))
              return
            }
            
            setAuthState({
              user,
              isLoading: false,
              isAuthenticated: !!user,
              error: null
            })
            
            // Fetch organization if user has one
            if (user?.organizationId) {
              await fetchOrganization(user.organizationId)
            }
          } catch (error) {
            console.error('Error in auth state change:', error)
            setAuthState(prev => ({ 
              ...prev, 
              isLoading: false, 
              error: error instanceof Error ? error.message : 'Unknown error',
              isAuthenticated: false,
              user: null
            }))
          }
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchOrganization = async (orgId: string) => {
    try {
      const { data, error } = await supabase
        .from('nonprofits')
        .select('*')
        .eq('id', orgId)
        .single()

      if (error) {
        console.error('Error fetching organization:', error)
        return
      }

      setOrg(data)
    } catch (error) {
      console.error('Error in fetchOrganization:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const { user, error } = await authService.signIn(email, password)
      
      if (error) {
        setAuthState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error,
          isAuthenticated: false,
          user: null
        }))
        return { error }
      }
      
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: !!user,
        error: null
      })
      
      // Fetch organization if user has one
      if (user?.organizationId) {
        await fetchOrganization(user.organizationId)
      }
      
      // User login - could add analytics tracking here
      if (user) {
        console.log('User logged in successfully')
      }
      
      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage,
        isAuthenticated: false,
        user: null
      }))
      return { error: errorMessage }
    }
  }

  const signUp = async (email: string, password: string, orgName: string, website?: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
      
      console.log('Starting enhanced signup process...')
      
      // Create organization first
      const { data: orgData, error: orgError } = await supabase
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
        setAuthState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: orgError.message,
          isAuthenticated: false,
          user: null
        }))
        return { error: orgError.message }
      }

      console.log('Organization created:', orgData)
      
      // Create user with organization
      const { user, error } = await authService.signUp(email, password, {
        firstName: orgName, // Use org name as placeholder
        lastName: '',
        organizationId: orgData.id
      })
      
      if (error) {
        // Clean up organization if user creation fails
        await supabase.from('nonprofits').delete().eq('id', orgData.id)
        
        setAuthState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error,
          isAuthenticated: false,
          user: null
        }))
        return { error }
      }
      
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: !!user,
        error: null
      })
      
      setOrg(orgData)
      
      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage,
        isAuthenticated: false,
        user: null
      }))
      return { error: errorMessage }
    }
  }

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const { error } = await authService.signOut()
      
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: error
      })
      
      setOrg(null)
      
      return { error }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage
      }))
      return { error: errorMessage }
    }
  }

  const hasPermission = (permission: Permission): boolean => {
    return authService.hasPermission(authState.user, permission)
  }

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return authService.hasAnyPermission(authState.user, permissions)
  }

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return authService.hasAllPermissions(authState.user, permissions)
  }

  const canAccessOrganization = (organizationId: string): boolean => {
    return authService.canAccessOrganization(authState.user, organizationId)
  }

  const isAdmin = (): boolean => {
    return authState.user?.role === UserRole.ADMIN || authState.user?.role === UserRole.SUPER_ADMIN
  }

  const isOrgAdmin = (): boolean => {
    return authState.user?.role === UserRole.ORG_ADMIN
  }

  const isOrgMember = (): boolean => {
    return authState.user?.role === UserRole.ORG_MEMBER
  }

  const isDonor = (): boolean => {
    return authState.user?.role === UserRole.DONOR
  }

  const updateProfile = async (updates: Partial<{
    firstName: string
    lastName: string
    organizationId: string
    organizationRole: string
  }>) => {
    if (!authState.user) {
      return { error: 'User not authenticated' }
    }

    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const { user, error } = await authService.updateProfile(authState.user.id, updates)
      
      if (error) {
        setAuthState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error
        }))
        return { error }
      }
      
      setAuthState(prev => ({
        ...prev,
        user,
        isLoading: false,
        error: null
      }))
      
      // Update organization if organizationId changed
      if (updates.organizationId && updates.organizationId !== org?.id) {
        await fetchOrganization(updates.organizationId)
      }
      
      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage
      }))
      return { error: errorMessage }
    }
  }

  const refreshUser = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const { user, error } = await authService.getCurrentUser()
      
      if (error) {
        setAuthState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error,
          isAuthenticated: false,
          user: null
        }))
        return
      }
      
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: !!user,
        error: null
      })
      
      // Fetch organization if user has one
      if (user?.organizationId) {
        await fetchOrganization(user.organizationId)
      }
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        isAuthenticated: false,
        user: null
      }))
    }
  }

  const switchOrganization = async (orgId: string) => {
    try {
      if (!authState.user) {
        return { error: 'User not authenticated' }
      }

      // Check if user can access this organization
      if (!canAccessOrganization(orgId)) {
        return { error: 'Access denied to this organization' }
      }

      // Update user's organization
      const { error } = await updateProfile({ organizationId: orgId })
      
      if (error) {
        return { error }
      }

      // Fetch the new organization
      await fetchOrganization(orgId)
      
      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'An error occurred' }
    }
  }

  const getAvailableOrganizations = async () => {
    try {
      if (!authState.user) {
        return { organizations: [], error: 'User not authenticated' }
      }

      // Super admin and admin can see all organizations
      if (isAdmin()) {
        const { data, error } = await supabase
          .from('nonprofits')
          .select('*')
          .order('name', { ascending: true })

        if (error) {
          return { organizations: [], error: error.message }
        }

        return { organizations: data || [], error: null }
      }

      // Regular users can only see their organization
      if (authState.user.organizationId) {
        const { data, error } = await supabase
          .from('nonprofits')
          .select('*')
          .eq('id', authState.user.organizationId)
          .single()

        if (error) {
          return { organizations: [], error: error.message }
        }

        return { organizations: data ? [data] : [], error: null }
      }

      return { organizations: [], error: null }
    } catch (error) {
      return { organizations: [], error: error instanceof Error ? error.message : 'An error occurred' }
    }
  }

  const value: EnhancedAuthContextType = {
    ...authState,
    org,
    setOrg,
    signIn,
    signUp,
    signOut,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessOrganization,
    isAdmin,
    isOrgAdmin,
    isOrgMember,
    isDonor,
    updateProfile,
    refreshUser,
    switchOrganization,
    getAvailableOrganizations
  }

  return (
    <EnhancedAuthContext.Provider value={value}>
      {children}
    </EnhancedAuthContext.Provider>
  )
}

export function useEnhancedAuth() {
  const context = useContext(EnhancedAuthContext)
  if (context === undefined) {
    throw new Error('useEnhancedAuth must be used within an EnhancedAuthProvider')
  }
  return context
}
