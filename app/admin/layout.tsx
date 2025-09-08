"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip authentication check for auth pages
    if (pathname === '/admin/auth') {
      setIsLoading(false)
      return
    }

    // Check if admin session exists
    const adminSession = localStorage.getItem('admin_session')
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession)
        // Check if session is still valid (not expired)
        const sessionAge = Date.now() - new Date(session.loginTime).getTime()
        const maxAge = 24 * 60 * 60 * 1000 // 24 hours
        
        if (sessionAge < maxAge) {
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem('admin_session')
          router.push('/admin/auth')
        }
      } catch (error) {
        localStorage.removeItem('admin_session')
        router.push('/admin/auth')
      }
    } else {
      router.push('/admin/auth')
    }
    setIsLoading(false)
  }, [router, pathname])

  // Skip authentication check for auth pages
  if (pathname === '/admin/auth') {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authenticating...</h2>
          <p className="text-gray-600">Please wait while we verify your access.</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to /admin/auth
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
