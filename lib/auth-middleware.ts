import { NextRequest, NextResponse } from 'next/server'
import { supabase } from './supabase'
import { authService, Permission, UserRole } from './auth'

// Authentication middleware
export function withAuthentication(handler: (req: NextRequest, user: any) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      // Get authorization header
      const authHeader = req.headers.get('authorization')
      const token = authHeader?.replace('Bearer ', '')
      
      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      // Verify token with Supabase
      const { data: { user }, error } = await supabase.auth.getUser(token)
      
      if (error || !user) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        )
      }

      // Get user profile with permissions
      const { user: userProfile, error: profileError } = await authService.getCurrentUser()
      
      if (profileError || !userProfile) {
        return NextResponse.json(
          { error: 'User profile not found' },
          { status: 401 }
        )
      }

      // Check if user is active
      if (!userProfile.isActive) {
        return NextResponse.json(
          { error: 'Account is deactivated' },
          { status: 403 }
        )
      }

      // Add user to request context
      const authenticatedReq = req as NextRequest & { user: typeof userProfile }
      authenticatedReq.user = userProfile

      return handler(authenticatedReq, userProfile)
    } catch (error) {
      console.error('Authentication error:', error)
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      )
    }
  }
}

// Permission-based middleware
export function withPermission(permission: Permission) {
  return (handler: (req: NextRequest, user: any) => Promise<NextResponse>) => {
    return withAuthentication(async (req: NextRequest, user: any) => {
      if (!authService.hasPermission(user, permission)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }

      return handler(req, user)
    })
  }
}

// Multiple permissions middleware
export function withPermissions(permissions: Permission[], requireAll: boolean = false) {
  return (handler: (req: NextRequest, user: any) => Promise<NextResponse>) => {
    return withAuthentication(async (req: NextRequest, user: any) => {
      const hasAccess = requireAll 
        ? authService.hasAllPermissions(user, permissions)
        : authService.hasAnyPermission(user, permissions)

      if (!hasAccess) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }

      return handler(req, user)
    })
  }
}

// Role-based middleware
export function withRole(role: UserRole) {
  return (handler: (req: NextRequest, user: any) => Promise<NextResponse>) => {
    return withAuthentication(async (req: NextRequest, user: any) => {
      if (user.role !== role) {
        return NextResponse.json(
          { error: 'Insufficient role' },
          { status: 403 }
        )
      }

      return handler(req, user)
    })
  }
}

// Multiple roles middleware
export function withRoles(roles: UserRole[]) {
  return (handler: (req: NextRequest, user: any) => Promise<NextResponse>) => {
    return withAuthentication(async (req: NextRequest, user: any) => {
      if (!roles.includes(user.role)) {
        return NextResponse.json(
          { error: 'Insufficient role' },
          { status: 403 }
        )
      }

      return handler(req, user)
    })
  }
}

// Organization access middleware
export function withOrganizationAccess(organizationIdParam: string = 'orgId') {
  return (handler: (req: NextRequest, user: any) => Promise<NextResponse>) => {
    return withAuthentication(async (req: NextRequest, user: any) => {
      const organizationId = req.nextUrl.searchParams.get(organizationIdParam) || 
                           req.headers.get('x-organization-id')

      if (!organizationId) {
        return NextResponse.json(
          { error: 'Organization ID required' },
          { status: 400 }
        )
      }

      if (!authService.canAccessOrganization(user, organizationId)) {
        return NextResponse.json(
          { error: 'Access denied to this organization' },
          { status: 403 }
        )
      }

      return handler(req, user)
    })
  }
}

// Admin-only middleware
export function withAdminAccess(handler: (req: NextRequest, user: any) => Promise<NextResponse>) {
  return withRoles([UserRole.ADMIN, UserRole.SUPER_ADMIN])(handler)
}

// Super admin-only middleware
export function withSuperAdminAccess(handler: (req: NextRequest, user: any) => Promise<NextResponse>) {
  return withRole(UserRole.SUPER_ADMIN)(handler)
}

// Organization admin middleware
export function withOrgAdminAccess(handler: (req: NextRequest, user: any) => Promise<NextResponse>) {
  return withRoles([UserRole.ORG_ADMIN, UserRole.ADMIN, UserRole.SUPER_ADMIN])(handler)
}

// Optional authentication middleware (doesn't fail if no auth)
export function withOptionalAuth(handler: (req: NextRequest, user: any | null) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const authHeader = req.headers.get('authorization')
      const token = authHeader?.replace('Bearer ', '')
      
      if (!token) {
        return handler(req, null)
      }

      const { data: { user }, error } = await supabase.auth.getUser(token)
      
      if (error || !user) {
        return handler(req, null)
      }

      const { user: userProfile } = await authService.getCurrentUser()
      
      return handler(req, userProfile)
    } catch (error) {
      console.error('Optional auth error:', error)
      return handler(req, null)
    }
  }
}

// Rate limiting per user
export function withUserRateLimit(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
  return (handler: (req: NextRequest, user: any) => Promise<NextResponse>) => {
    return withAuthentication(async (req: NextRequest, user: any) => {
      const rateLimit = authService.checkRateLimit(user.id, maxRequests, windowMs)
      
      if (!rateLimit.allowed) {
        return NextResponse.json(
          { error: 'Rate limit exceeded' },
          { 
            status: 429,
            headers: {
              'X-RateLimit-Limit': maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': rateLimit.resetTime.toString(),
              'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString()
            }
          }
        )
      }

      const response = await handler(req, user)
      
      // Add rate limit headers
      response.headers.set('X-RateLimit-Limit', maxRequests.toString())
      response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString())
      response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString())
      
      return response
    })
  }
}

// Audit logging middleware
export function withAuditLog(action: string) {
  return (handler: (req: NextRequest, user: any) => Promise<NextResponse>) => {
    return withAuthentication(async (req: NextRequest, user: any) => {
      const startTime = Date.now()
      
      try {
        const response = await handler(req, user)
        
        // Log successful action
        console.log(`AUDIT: ${action} - User: ${user.id} - Status: ${response.status} - Duration: ${Date.now() - startTime}ms`)
        
        return response
      } catch (error) {
        // Log failed action
        console.error(`AUDIT: ${action} - User: ${user.id} - Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        throw error
      }
    })
  }
}

// Combined middleware helper
export function createAuthMiddleware(options: {
  permissions?: Permission[]
  requireAll?: boolean
  roles?: UserRole[]
  organizationAccess?: boolean
  rateLimit?: number
  auditAction?: string
}) {
  let middleware = withAuthentication

  if (options.permissions) {
    middleware = withPermissions(options.permissions, options.requireAll)
  } else if (options.roles) {
    middleware = withRoles(options.roles)
  }

  if (options.organizationAccess) {
    middleware = withOrganizationAccess()
  }

  if (options.rateLimit) {
    middleware = withUserRateLimit(options.rateLimit)
  }

  if (options.auditAction) {
    middleware = withAuditLog(options.auditAction)
  }

  return middleware
}
