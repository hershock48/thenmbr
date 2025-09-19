// Mobile App Types for NMBR Platform

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  organizationId: string
  organizationName: string
  role: 'admin' | 'member' | 'supporter'
  isActive: boolean
  createdAt: Date
}

export interface Organization {
  id: string
  name: string
  type: 'nonprofit' | 'business' | 'individual'
  description: string
  logo?: string
  website?: string
  mission: string
  isVerified: boolean
  createdAt: Date
}

export interface Product {
  id: string
  name: string
  category: string
  price: number
  image: string
  description: string
  features: string[]
  inStock: boolean
  nmbrReady: boolean
  provider: 'printful' | 'gooten' | 'customink'
}

export interface Story {
  id: string
  title: string
  content: string
  image?: string
  authorId: string
  authorName: string
  organizationId: string
  views: number
  likes: number
  shares: number
  createdAt: Date
  isPublished: boolean
}

export interface ReferralCode {
  id: string
  code: string
  organizationId: string
  rewardType: 'percentage' | 'fixed' | 'product'
  rewardValue: number
  isActive: boolean
  currentUses: number
  maxUses?: number
  expiresAt?: Date
}

export interface RevenueMetrics {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  totalProfit: number
  profitMargin: number
  conversionRate: number
}

export interface CommunityMember {
  id: string
  name: string
  email: string
  avatar?: string
  totalReferrals: number
  totalRewards: number
  level: 'bronze' | 'silver' | 'gold' | 'platinum'
  badges: string[]
  isActive: boolean
}

export interface NavigationProps {
  navigation: any
  route: any
}

export interface TabBarIconProps {
  focused: boolean
  color: string
  size: number
}

export interface ScreenProps {
  navigation: any
  route: any
  user?: User
  organization?: Organization
}
