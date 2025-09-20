"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardOverviewPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the main dashboard page
    router.replace('/dashboard')
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Redirecting to Dashboard</h3>
        <p className="text-gray-600">Taking you to the main dashboard...</p>
      </div>
    </div>
  )
}
