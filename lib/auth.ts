import { createClient } from '@supabase/supabase-js'
import { supabase } from './supabase'

// User roles and permissions
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  ORG_ADMIN = 'org_admin',
  ORG_MEMBER = 'org_member',
  DONOR = 'donor',
  GUEST = 'guest'
}

export enum Permission {
  // User management
  MANAGE_USERS = 'manage_users',
  VIEW_USERS = 'view_users',
  
  // Organization management
  MANAGE_ORGS = 'manage_orgs',
  VIEW_ORGS = 'view_orgs',
  MANAGE_ORG_MEMBERS = 'manage_org_members',
  
  // Story management
  MANAGE_STORIES = 'manage_stories',
  VIEW_STORIES = 'view_stories',
  CREATE_STORIES = 'create_stories',
  EDIT_STORIES = 'edit_stories',
  DELETE_STORIES = 'delete_stories',
  
  // Newsletter management
  MANAGE_NEWSLETTERS = 'manage_newsletters',
  VIEW_NEWSLETTERS = 'view_newsletters',
  SEND_NEWSLETTERS = 'send_newsletters',
  
  // Subscriber management
  MANAGE_SUBSCRIBERS = 'manage_subscribers',
  VIEW_SUBSCRIBERS = 'view_subscribers',
  EXPORT_SUBSCRIBERS = 'export_subscribers',
  
  // Donation management
  MANAGE_DONATIONS = 'manage_donations',
  VIEW_DONATIONS = 'view_donations',
  PROCESS_DONATIONS = 'process_donations',
  
  // Analytics and reporting
  VIEW_ANALYTICS = 'view_analytics',
  VIEW_REPORTS = 'view_reports',
  EXPORT_DATA = 'export_data',
  
  // System administration
  MANAGE_SYSTEM = 'manage_system',
  VIEW_LOGS = 'view_logs',
  MANAGE_SETTINGS = 'manage_settings'
}

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: Object.values(Permission),
  
  [UserRole.ADMIN]: [
    Permission.MANAGE_USERS,
    Permission.VIEW_USERS,
    Permission.MANAGE_ORGS,
    Permission.VIEW_ORGS,
    Permission.MANAGE_ORG_MEMBERS,
    Permission.MANAGE_STORIES,
    Permission.VIEW_STORIES,
    Permission.MANAGE_NEWSLETTERS,
    Permission.VIEW_NEWSLETTERS,
    Permission.SEND_NEWSLETTERS,
    Permission.MANAGE_SUBSCRIBERS,
    Permission.VIEW_SUBSCRIBERS,
    Permission.EXPORT_SUBSCRIBERS,
    Permission.MANAGE_DONATIONS,
    Permission.VIEW_DONATIONS,
    Permission.PROCESS_DONATIONS,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_REPORTS,
    Permission.EXPORT_DATA,
    Permission.VIEW_LOGS,
    Permission.MANAGE_SETTINGS
  ],
  
  [UserRole.ORG_ADMIN]: [
    Permission.VIEW_USERS,
    Permission.VIEW_ORGS,
    Permission.MANAGE_ORG_MEMBERS,
    Permission.MANAGE_STORIES,
    Permission.VIEW_STORIES,
    Permission.CREATE_STORIES,
    Permission.EDIT_STORIES,
    Permission.DELETE_STORIES,
    Permission.MANAGE_NEWSLETTERS,
    Permission.VIEW_NEWSLETTERS,
    Permission.SEND_NEWSLETTERS,
    Permission.MANAGE_SUBSCRIBERS,
    Permission.VIEW_SUBSCRIBERS,
    Permission.EXPORT_SUBSCRIBERS,
    Permission.VIEW_DONATIONS,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_REPORTS,
    Permission.EXPORT_DATA
  ],
  
  [UserRole.ORG_MEMBER]: [
    Permission.VIEW_STORIES,
    Permission.CREATE_STORIES,
    Permission.EDIT_STORIES,
    Permission.VIEW_NEWSLETTERS,
    Permission.VIEW_SUBSCRIBERS,
    Permission.VIEW_DONATIONS,
    Permission.VIEW_ANALYTICS
  ],
  
  [UserRole.DONOR]: [
    Permission.VIEW_STORIES,
    Permission.VIEW_NEWSLETTERS
  ],
  
  [UserRole.GUEST]: []
}

// User interface
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  organizationId?: string
  organizationRole?: string
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
  permissions: Permission[]
}

// Authentication state
export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

// Session management
export interface Session {
  accessToken: string
  refreshToken: string
  expiresAt: number
  user: User
}

// Authentication service class
export class AuthService {
  private supabase = supabase
  
  // Sign up with email and password
  async signUp(email: string, password: string, userData: {
    firstName: string
    lastName: string
    organizationId?: string
  }): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            organization_id: userData.organizationId
          }
        }
      })
      
      if (error) {
        return { user: null, error: error.message }
      }
      
      if (data.user) {
        // Create user profile in database
        const { data: profile, error: profileError } = await this.supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: UserRole.DONOR,
            organization_id: userData.organizationId,
            is_active: true
          })
          .select()
          .single()
        
        if (profileError) {
          return { user: null, error: profileError.message }
        }
        
        const user = this.mapProfileToUser(profile)
        return { user, error: null }
      }
      
      return { user: null, error: 'Failed to create user' }
    } catch (error) {
      return { user: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
  
  // Sign in with email and password
  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        return { user: null, error: error.message }
      }
      
      if (data.user) {
        const user = await this.getUserProfile(data.user.id)
        return { user, error: null }
      }
      
      return { user: null, error: 'Failed to sign in' }
    } catch (error) {
      return { user: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
  
  // Sign out
  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await this.supabase.auth.signOut()
      return { error: error?.message || null }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
  
  // Get current user
  async getCurrentUser(): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser()
      
      if (error) {
        return { user: null, error: error.message }
      }
      
      if (!user) {
        return { user: null, error: null }
      }
      
      const userProfile = await this.getUserProfile(user.id)
      return { user: userProfile, error: null }
    } catch (error) {
      return { user: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
  
  // Get user profile from database
  private async getUserProfile(userId: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select(`
          *,
          organizations (
            id,
            name,
            slug
          )
        `)
        .eq('id', userId)
        .single()
      
      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }
      
      return this.mapProfileToUser(data)
    } catch (error) {
      console.error('Error in getUserProfile:', error)
      return null
    }
  }
  
  // Map database profile to User interface
  private mapProfileToUser(profile: any): User {
    const role = profile.role as UserRole || UserRole.DONOR
    const permissions = ROLE_PERMISSIONS[role] || []
    
    return {
      id: profile.id,
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
      role,
      organizationId: profile.organization_id,
      organizationRole: profile.organization_role,
      isActive: profile.is_active,
      lastLoginAt: profile.last_login_at,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
      permissions
    }
  }
  
  // Check if user has permission
  hasPermission(user: User | null, permission: Permission): boolean {
    if (!user || !user.isActive) {
      return false
    }
    
    return user.permissions.includes(permission)
  }
  
  // Check if user has any of the permissions
  hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
    if (!user || !user.isActive) {
      return false
    }
    
    return permissions.some(permission => user.permissions.includes(permission))
  }
  
  // Check if user has all permissions
  hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
    if (!user || !user.isActive) {
      return false
    }
    
    return permissions.every(permission => user.permissions.includes(permission))
  }
  
  // Check if user can access organization
  canAccessOrganization(user: User | null, organizationId: string): boolean {
    if (!user || !user.isActive) {
      return false
    }
    
    // Super admin and admin can access all organizations
    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) {
      return true
    }
    
    // User must be part of the organization
    return user.organizationId === organizationId
  }
  
  // Update user profile
  async updateProfile(userId: string, updates: Partial<{
    firstName: string
    lastName: string
    organizationId: string
    organizationRole: string
  }>): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .update({
          first_name: updates.firstName,
          last_name: updates.lastName,
          organization_id: updates.organizationId,
          organization_role: updates.organizationRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()
      
      if (error) {
        return { user: null, error: error.message }
      }
      
      const user = this.mapProfileToUser(data)
      return { user, error: null }
    } catch (error) {
      return { user: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
  
  // Update user role
  async updateUserRole(userId: string, role: UserRole): Promise<{ error: string | null }> {
    try {
      const { error } = await this.supabase
        .from('user_profiles')
        .update({
          role,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
      
      if (error) {
        return { error: error.message }
      }
      
      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
  
  // Deactivate user
  async deactivateUser(userId: string): Promise<{ error: string | null }> {
    try {
      const { error } = await this.supabase
        .from('user_profiles')
        .update({
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
      
      if (error) {
        return { error: error.message }
      }
      
      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
  
  // Get users by organization
  async getUsersByOrganization(organizationId: string): Promise<{ users: User[]; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      if (error) {
        return { users: [], error: error.message }
      }
      
      const users = data.map(profile => this.mapProfileToUser(profile))
      return { users, error: null }
    } catch (error) {
      return { users: [], error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

// Export singleton instance
export const authService = new AuthService()