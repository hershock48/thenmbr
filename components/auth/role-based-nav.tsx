'use client'

import { ReactNode } from 'react'
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext'
import { UserRole, Permission } from '@/lib/auth'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon?: ReactNode
  permissions?: Permission[]
  requireAll?: boolean
  roles?: UserRole[]
  children?: NavItem[]
}

interface RoleBasedNavProps {
  items: NavItem[]
  className?: string
  itemClassName?: string
  activeClassName?: string
  inactiveClassName?: string
}

export function RoleBasedNav({
  items,
  className,
  itemClassName,
  activeClassName,
  inactiveClassName
}: RoleBasedNavProps) {
  const { user, hasPermission, hasAnyPermission, hasAllPermissions } = useEnhancedAuth()

  const canAccessItem = (item: NavItem): boolean => {
    if (!user) return false

    // Check role restrictions
    if (item.roles && !item.roles.includes(user.role)) {
      return false
    }

    // Check permission requirements
    if (item.permissions && item.permissions.length > 0) {
      if (item.requireAll) {
        return hasAllPermissions(item.permissions)
      } else {
        return hasAnyPermission(item.permissions)
      }
    }

    return true
  }

  const renderNavItem = (item: NavItem, level: number = 0): ReactNode => {
    const canAccess = canAccessItem(item)
    
    if (!canAccess) {
      return null
    }

    const hasChildren = item.children && item.children.length > 0
    const accessibleChildren = hasChildren 
      ? item.children!.filter(child => canAccessItem(child))
      : []

    return (
      <div key={item.href} className={cn(
        'nav-item',
        level > 0 && 'ml-4',
        itemClassName
      )}>
        <a
          href={item.href}
          className={cn(
            'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
            activeClassName || 'text-gray-700 hover:bg-gray-100',
            inactiveClassName || 'text-gray-500 hover:text-gray-700'
          )}
        >
          {item.icon && (
            <span className="flex-shrink-0">
              {item.icon}
            </span>
          )}
          <span>{item.label}</span>
        </a>
        
        {hasChildren && accessibleChildren.length > 0 && (
          <div className="mt-1 space-y-1">
            {accessibleChildren.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <nav className={cn('space-y-1', className)}>
      {items.map(item => renderNavItem(item))}
    </nav>
  )
}

// Predefined navigation items for different user roles
export const getNavigationItems = (): NavItem[] => [
  // Dashboard - accessible to all authenticated users
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <div className="h-4 w-4">📊</div>
  },
  
  // Stories - accessible to org members and above
  {
    label: 'Stories',
    href: '/dashboard/stories',
    icon: <div className="h-4 w-4">📖</div>,
    roles: [UserRole.ORG_MEMBER, UserRole.ORG_ADMIN, UserRole.ADMIN, UserRole.SUPER_ADMIN],
    children: [
      {
        label: 'All Stories',
        href: '/dashboard/stories',
        permissions: [Permission.VIEW_STORIES]
      },
      {
        label: 'Create Story',
        href: '/dashboard/stories/create',
        permissions: [Permission.CREATE_STORIES]
      },
      {
        label: 'Story Analytics',
        href: '/dashboard/stories/analytics',
        permissions: [Permission.VIEW_ANALYTICS]
      }
    ]
  },
  
  // Subscribers - accessible to org members and above
  {
    label: 'Subscribers',
    href: '/dashboard/subscribers',
    icon: <div className="h-4 w-4">👥</div>,
    roles: [UserRole.ORG_MEMBER, UserRole.ORG_ADMIN, UserRole.ADMIN, UserRole.SUPER_ADMIN],
    children: [
      {
        label: 'All Subscribers',
        href: '/dashboard/subscribers',
        permissions: [Permission.VIEW_SUBSCRIBERS]
      },
      {
        label: 'Import Subscribers',
        href: '/dashboard/subscribers/import',
        permissions: [Permission.MANAGE_SUBSCRIBERS]
      },
      {
        label: 'Export Subscribers',
        href: '/dashboard/subscribers/export',
        permissions: [Permission.EXPORT_SUBSCRIBERS]
      }
    ]
  },
  
  // Newsletters - accessible to org members and above
  {
    label: 'Newsletters',
    href: '/dashboard/newsletters',
    icon: <div className="h-4 w-4">📧</div>,
    roles: [UserRole.ORG_MEMBER, UserRole.ORG_ADMIN, UserRole.ADMIN, UserRole.SUPER_ADMIN],
    children: [
      {
        label: 'All Newsletters',
        href: '/dashboard/newsletters',
        permissions: [Permission.VIEW_NEWSLETTERS]
      },
      {
        label: 'Create Newsletter',
        href: '/dashboard/newsletters/create',
        permissions: [Permission.MANAGE_NEWSLETTERS]
      },
      {
        label: 'Templates',
        href: '/dashboard/newsletters/templates',
        permissions: [Permission.MANAGE_NEWSLETTERS]
      }
    ]
  },
  
  // Donations - accessible to org members and above
  {
    label: 'Donations',
    href: '/dashboard/donations',
    icon: <div className="h-4 w-4">💰</div>,
    roles: [UserRole.ORG_MEMBER, UserRole.ORG_ADMIN, UserRole.ADMIN, UserRole.SUPER_ADMIN],
    children: [
      {
        label: 'All Donations',
        href: '/dashboard/donations',
        permissions: [Permission.VIEW_DONATIONS]
      },
      {
        label: 'Donation Analytics',
        href: '/dashboard/donations/analytics',
        permissions: [Permission.VIEW_ANALYTICS]
      },
      {
        label: 'Refunds',
        href: '/dashboard/donations/refunds',
        permissions: [Permission.MANAGE_DONATIONS]
      }
    ]
  },
  
  // Analytics - accessible to org members and above
  {
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: <div className="h-4 w-4">📈</div>,
    roles: [UserRole.ORG_MEMBER, UserRole.ORG_ADMIN, UserRole.ADMIN, UserRole.SUPER_ADMIN],
    permissions: [Permission.VIEW_ANALYTICS]
  },
  
  // Organization Management - accessible to org admins and above
  {
    label: 'Organization',
    href: '/dashboard/organization',
    icon: <div className="h-4 w-4">🏢</div>,
    roles: [UserRole.ORG_ADMIN, UserRole.ADMIN, UserRole.SUPER_ADMIN],
    children: [
      {
        label: 'Settings',
        href: '/dashboard/organization/settings',
        permissions: [Permission.MANAGE_ORGS]
      },
      {
        label: 'Members',
        href: '/dashboard/organization/members',
        permissions: [Permission.MANAGE_ORG_MEMBERS]
      },
      {
        label: 'Billing',
        href: '/dashboard/organization/billing',
        permissions: [Permission.MANAGE_ORGS]
      }
    ]
  },
  
  // User Management - accessible to admins only
  {
    label: 'Users',
    href: '/dashboard/users',
    icon: <div className="h-4 w-4">👤</div>,
    roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
    children: [
      {
        label: 'All Users',
        href: '/dashboard/users',
        permissions: [Permission.VIEW_USERS]
      },
      {
        label: 'Create User',
        href: '/dashboard/users/create',
        permissions: [Permission.MANAGE_USERS]
      },
      {
        label: 'Roles & Permissions',
        href: '/dashboard/users/roles',
        permissions: [Permission.MANAGE_USERS]
      }
    ]
  },
  
  // System Administration - accessible to super admins only
  {
    label: 'System',
    href: '/dashboard/system',
    icon: <div className="h-4 w-4">⚙️</div>,
    roles: [UserRole.SUPER_ADMIN],
    children: [
      {
        label: 'System Settings',
        href: '/dashboard/system/settings',
        permissions: [Permission.MANAGE_SYSTEM]
      },
      {
        label: 'Logs',
        href: '/dashboard/system/logs',
        permissions: [Permission.VIEW_LOGS]
      },
      {
        label: 'Backups',
        href: '/dashboard/system/backups',
        permissions: [Permission.MANAGE_SYSTEM]
      }
    ]
  }
]

export default RoleBasedNav
