import { authService, UserRole, Permission } from '../auth'

// Mock Supabase client
jest.mock('../supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn()
        }))
      })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn()
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn()
          }))
        }))
      }))
    }))
  }
}))

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('signUp', () => {
    it('should create user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: UserRole.DONOR,
        organization_id: 'org-123',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }

      const { supabase } = require('../supabase')
      supabase.auth.signUp.mockResolvedValue({
        data: { user: { id: 'user-123', email: 'test@example.com' } },
        error: null
      })
      
      const mockInsert = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: mockUser,
            error: null
          })
        })
      })
      
      supabase.from.mockReturnValue({
        insert: mockInsert
      })

      const result = await authService.signUp('test@example.com', 'password123', {
        firstName: 'John',
        lastName: 'Doe',
        organizationId: 'org-123'
      })

      expect(result.error).toBeNull()
      expect(result.user).toBeDefined()
      expect(result.user?.email).toBe('test@example.com')
    })

    it('should handle signup error', async () => {
      const { supabase } = require('../supabase')
      supabase.auth.signUp.mockResolvedValue({
        data: null,
        error: { message: 'Email already exists' }
      })

      const result = await authService.signUp('test@example.com', 'password123', {
        firstName: 'John',
        lastName: 'Doe'
      })

      expect(result.error).toBe('Email already exists')
      expect(result.user).toBeNull()
    })
  })

  describe('signIn', () => {
    it('should sign in user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: UserRole.DONOR,
        organization_id: 'org-123',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }

      const { supabase } = require('../supabase')
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: 'user-123', email: 'test@example.com' } },
        error: null
      })
      
      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: mockUser,
            error: null
          })
        })
      })
      
      supabase.from.mockReturnValue({
        select: mockSelect
      })

      const result = await authService.signIn('test@example.com', 'password123')

      expect(result.error).toBeNull()
      expect(result.user).toBeDefined()
      expect(result.user?.email).toBe('test@example.com')
    })

    it('should handle signin error', async () => {
      const { supabase } = require('../supabase')
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid credentials' }
      })

      const result = await authService.signIn('test@example.com', 'wrongpassword')

      expect(result.error).toBe('Invalid credentials')
      expect(result.user).toBeNull()
    })
  })

  describe('hasPermission', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.ORG_ADMIN,
      organizationId: 'org-123',
      isActive: true,
      permissions: [Permission.MANAGE_STORIES, Permission.VIEW_STORIES],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }

    it('should return true for user with permission', () => {
      const result = authService.hasPermission(mockUser, Permission.MANAGE_STORIES)
      expect(result).toBe(true)
    })

    it('should return false for user without permission', () => {
      const result = authService.hasPermission(mockUser, Permission.MANAGE_USERS)
      expect(result).toBe(false)
    })

    it('should return false for inactive user', () => {
      const inactiveUser = { ...mockUser, isActive: false }
      const result = authService.hasPermission(inactiveUser, Permission.MANAGE_STORIES)
      expect(result).toBe(false)
    })

    it('should return false for null user', () => {
      const result = authService.hasPermission(null, Permission.MANAGE_STORIES)
      expect(result).toBe(false)
    })
  })

  describe('hasAnyPermission', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.ORG_ADMIN,
      organizationId: 'org-123',
      isActive: true,
      permissions: [Permission.MANAGE_STORIES, Permission.VIEW_STORIES],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }

    it('should return true if user has any of the permissions', () => {
      const result = authService.hasAnyPermission(mockUser, [
        Permission.MANAGE_STORIES,
        Permission.MANAGE_USERS
      ])
      expect(result).toBe(true)
    })

    it('should return false if user has none of the permissions', () => {
      const result = authService.hasAnyPermission(mockUser, [
        Permission.MANAGE_USERS,
        Permission.VIEW_LOGS
      ])
      expect(result).toBe(false)
    })
  })

  describe('hasAllPermissions', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.ORG_ADMIN,
      organizationId: 'org-123',
      isActive: true,
      permissions: [Permission.MANAGE_STORIES, Permission.VIEW_STORIES],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }

    it('should return true if user has all permissions', () => {
      const result = authService.hasAllPermissions(mockUser, [
        Permission.MANAGE_STORIES,
        Permission.VIEW_STORIES
      ])
      expect(result).toBe(true)
    })

    it('should return false if user is missing any permission', () => {
      const result = authService.hasAllPermissions(mockUser, [
        Permission.MANAGE_STORIES,
        Permission.MANAGE_USERS
      ])
      expect(result).toBe(false)
    })
  })

  describe('canAccessOrganization', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.ORG_ADMIN,
      organizationId: 'org-123',
      isActive: true,
      permissions: [],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }

    it('should return true for super admin accessing any organization', () => {
      const superAdmin = { ...mockUser, role: UserRole.SUPER_ADMIN }
      const result = authService.canAccessOrganization(superAdmin, 'any-org-id')
      expect(result).toBe(true)
    })

    it('should return true for admin accessing any organization', () => {
      const admin = { ...mockUser, role: UserRole.ADMIN }
      const result = authService.canAccessOrganization(admin, 'any-org-id')
      expect(result).toBe(true)
    })

    it('should return true for user accessing their own organization', () => {
      const result = authService.canAccessOrganization(mockUser, 'org-123')
      expect(result).toBe(true)
    })

    it('should return false for user accessing different organization', () => {
      const result = authService.canAccessOrganization(mockUser, 'different-org-id')
      expect(result).toBe(false)
    })

    it('should return false for inactive user', () => {
      const inactiveUser = { ...mockUser, isActive: false }
      const result = authService.canAccessOrganization(inactiveUser, 'org-123')
      expect(result).toBe(false)
    })

    it('should return false for null user', () => {
      const result = authService.canAccessOrganization(null, 'org-123')
      expect(result).toBe(false)
    })
  })
})
