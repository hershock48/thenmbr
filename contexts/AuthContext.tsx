"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import type { Nonprofit, OrganizationType } from "@/types"

interface AuthContextType {
  user: User | null
  org: Nonprofit | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (
    email: string,
    password: string,
    orgName: string,
    website?: string,
    orgType?: OrganizationType,
    additionalData?: Record<string, any>,
  ) => Promise<void>
  signOut: () => Promise<void>
  setOrg: (org: Nonprofit | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [org, setOrg] = useState<Nonprofit | null>(null)
  const [loading, setLoading] = useState(true)
  // Achievement system removed - could add analytics tracking here

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
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        // Don't automatically fetch org - let user select
        setLoading(false)
      } else {
        setOrg(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchOrg = async (userId: string) => {
    try {
      // Get user's org_id from their metadata
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const orgId = user?.user_metadata?.org_id

      console.log("Fetching org for user:", userId, "orgId:", orgId)

      if (orgId) {
        const { data, error } = await supabase.from("nonprofits").select("*").eq("id", orgId).single()

        console.log("Org fetch result:", { data, error })

        if (!error && data) {
          setOrg(data)
          console.log("Organization set:", data)
        } else {
          console.error("Organization not found or error:", error)
          // Don't set org if it doesn't exist, but don't get stuck loading
        }
      } else {
        console.log("No org_id found in user metadata")
      }
    } catch (error) {
      console.error("Error fetching org:", error)
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

    // First login tracked
    if (data.user) {
      console.log('User signed in successfully')
    }
  }

  const signUp = async (
    email: string,
    password: string,
    orgName: string,
    website?: string,
    orgType: OrganizationType = "nonprofit",
    additionalData?: Record<string, any>,
  ) => {
    console.log("AuthContext signUp called with:", { email, orgName, website, orgType, additionalData })
    try {
      console.log("Starting signup process...")

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            org_name: orgName,
            website: website || null,
            organization_type: orgType,
            role: "admin",
            ...additionalData,
          },
        },
      })

      if (error) {
        console.error("Auth signup error:", error)
        throw error
      }

      console.log("Signup successful:", data)

      if (data.user && !data.session) {
        console.log("Email confirmation required. Please check your email.")
        return
      }

      if (data.user && data.session) {
        console.log("User authenticated, creating organization...")
        const orgData: any = {
          name: orgName,
          website: website || null,
          organization_type: orgType,
          brand_color: "#3B82F6",
          is_active: true,
        }

        // Add type-specific fields
        if (additionalData) {
          if (orgType === "nonprofit") {
            if (additionalData.einNumber) orgData.ein_number = additionalData.einNumber
            if (additionalData.fiscalSponsor) orgData.fiscal_sponsor = additionalData.fiscalSponsor
            orgData.tax_exempt_status = additionalData.taxExemptStatus || false
          } else if (orgType === "business") {
            if (additionalData.industry) orgData.industry = additionalData.industry
            if (additionalData.businessRegistration) orgData.business_registration = additionalData.businessRegistration
            if (additionalData.csrFocusAreas) orgData.csr_focus_areas = additionalData.csrFocusAreas
          }
        }

        const { data: org, error: orgError } = await supabase.from("nonprofits").insert(orgData).select().single()

        if (orgError) {
          console.error("Org creation error:", orgError)
          throw orgError
        }

        console.log("Organization created:", org)
      }
    } catch (error) {
      console.error("Signup error:", error)
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
