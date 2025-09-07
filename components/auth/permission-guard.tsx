'use client'

import { ReactNode } from 'react'
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext'
import { Permission } from '@/lib/auth'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface PermissionGuardProps {
  children: ReactNode
  permissions?: Permission[]
  requireAll?: boolean
  fallback?: ReactNode
  redirectTo?: string
  showAccessDenied?: boolean
}

export function PermissionGuard({
  children,
  permissions = [],
  requireAll = false,
  fallback,
  redirectTo,
  showAccessDenied = true
}: PermissionGuardProps) {
  const { user, hasPermission, hasAnyPermission, hasAllPermissions, isLoading } = useEnhancedAuth()

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Check if user is authenticated
  if (!user) {
    if (redirectTo) {
      // Redirect will be handled by the parent component
      return null
    }
    
    return (
      <Alert className="border-red-200 bg-red-50">
        <Shield className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          You must be logged in to access this page.
        </AlertDescription>
      </Alert>
    )
  }

  // Check permissions
  let hasAccess = false
  
  if (permissions.length === 0) {
    // No specific permissions required, just need to be authenticated
    hasAccess = true
  } else if (requireAll) {
    // User must have ALL permissions
    hasAccess = hasAllPermissions(permissions)
  } else {
    // User must have ANY of the permissions
    hasAccess = hasAnyPermission(permissions)
  }

  // If user has access, render children
  if (hasAccess) {
    return <>{children}</>
  }

  // If custom fallback is provided, use it
  if (fallback) {
    return <>{fallback}</>
  }

  // If redirect is specified, return null (redirect will be handled by parent)
  if (redirectTo) {
    return null
  }

  // Show access denied message
  if (!showAccessDenied) {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md mx-auto p-6">
        <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div className="space-y-2">
          <Button asChild variant="outline">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link href="/contact">
              Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

// Higher-order component for route protection
export function withPermissionGuard<P extends object>(
  Component: React.ComponentType<P>,
  permissions: Permission[],
  requireAll: boolean = false
) {
  return function PermissionGuardedComponent(props: P) {
    return (
      <PermissionGuard permissions={permissions} requireAll={requireAll}>
        <Component {...props} />
      </PermissionGuard>
    )
  }
}

// Hook for checking permissions in components
export function usePermissions() {
  const { user, hasPermission, hasAnyPermission, hasAllPermissions, isAdmin, isOrgAdmin, isOrgMember, isDonor } = useEnhancedAuth()

  return {
    user,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    isOrgAdmin,
    isOrgMember,
    isDonor,
    canAccess: (permissions: Permission[], requireAll: boolean = false) => {
      if (requireAll) {
        return hasAllPermissions(permissions)
      }
      return hasAnyPermission(permissions)
    }
  }
}

export default PermissionGuard
