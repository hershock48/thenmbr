"use client"

import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { useAuth } from "@/contexts/AuthContext"
import { OrganizationProvider } from "@/contexts/OrganizationContext"
import { TrialProvider } from "@/contexts/TrialContext"
import { UsagePrompt } from "@/components/conversion/UsagePrompt"
import { TrialCountdown } from "@/components/conversion/TrialCountdown"
import { FeatureTeaser } from "@/components/conversion/FeatureTeaser"
import { UpgradeModal } from "@/components/conversion/UpgradeModal"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, org, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <OrganizationProvider>
      <TrialProvider>
        <div className="min-h-screen bg-background">
          <Sidebar />
          <div className="lg:pl-64">
            <Header />
            <main className="p-3 sm:p-4 lg:p-6">{children}</main>
          </div>
          
          {/* Conversion Components */}
          <UsagePrompt />
          <TrialCountdown />
          <FeatureTeaser />
          <UpgradeModal />
        </div>
      </TrialProvider>
    </OrganizationProvider>
  )
}
