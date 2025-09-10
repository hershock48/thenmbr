"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window === 'undefined') return

    const adminSession = localStorage.getItem('admin_session')
    
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession)
        const sessionAge = Date.now() - new Date(session.loginTime).getTime()
        const maxAge = 24 * 60 * 60 * 1000 // 24 hours
        
        if (sessionAge < maxAge) {
          // Session is valid, go to dashboard
          router.push('/admin/dashboard')
        } else {
          // Session expired, go to auth
          localStorage.removeItem('admin_session')
          router.push('/admin/auth')
        }
      } catch (error) {
        // Invalid session, go to auth
        localStorage.removeItem('admin_session')
        router.push('/admin/auth')
      }
    } else {
      // No session, go to auth
      router.push('/admin/auth')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Checking Access...</h1>
        <p className="text-gray-600">Please wait while we verify your admin permissions.</p>
      </div>
    </div>
  )
}
