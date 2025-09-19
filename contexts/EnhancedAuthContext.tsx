"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"

interface EnhancedAuthContextType {
  user: any
  org: any
  loading: boolean
  permissions: string[]
  roles: string[]
  canAccess: (permission: string) => boolean
  hasRole: (role: string) => boolean
}

const EnhancedAuthContext = createContext<EnhancedAuthContextType | undefined>(undefined)

export function EnhancedAuthProvider({ children }: { children: React.ReactNode }) {
  const { user, org, loading } = useAuth()
  const [permissions, setPermissions] = useState<string[]>([])
  const [roles, setRoles] = useState<string[]>([])

  useEffect(() => {
    if (user && org) {
      // In a real app, this would fetch from your database
      // For now, we'll use mock data based on organization type
      const mockPermissions = [
        'read:stories',
        'write:stories',
        'read:analytics',
        'read:subscribers',
        'write:newsletters'
      ]

      const mockRoles = org.organization_type === 'nonprofit' 
        ? ['nonprofit_admin', 'fundraiser']
        : ['business_admin', 'marketer']

      setPermissions(mockPermissions)
      setRoles(mockRoles)
    } else {
      setPermissions([])
      setRoles([])
    }
  }, [user, org])

  const canAccess = (permission: string): boolean => {
    return permissions.includes(permission)
  }

  const hasRole = (role: string): boolean => {
    return roles.includes(role)
  }

  return (
    <EnhancedAuthContext.Provider
      value={{
        user,
        org,
        loading,
        permissions,
        roles,
        canAccess,
        hasRole
      }}
    >
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
