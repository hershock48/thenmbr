// Referral System for NMBR Marketplace
// Handles referral tracking, rewards, and community building

export interface ReferralCode {
  id: string
  code: string
  organizationId: string
  organizationName: string
  createdBy: string
  createdAt: Date
  expiresAt?: Date
  isActive: boolean
  maxUses?: number
  currentUses: number
  rewardType: 'percentage' | 'fixed' | 'product'
  rewardValue: number
  rewardProductId?: string
  description: string
  terms: string
}

export interface ReferralUsage {
  id: string
  referralCodeId: string
  referredUserId: string
  referredUserEmail: string
  referringUserId: string
  referringUserEmail: string
  organizationId: string
  orderId?: string
  orderValue?: number
  rewardEarned: number
  status: 'pending' | 'completed' | 'cancelled' | 'expired'
  createdAt: Date
  completedAt?: Date
  rewardClaimedAt?: Date
}

export interface ReferralStats {
  totalReferrals: number
  successfulReferrals: number
  pendingReferrals: number
  totalRewardsEarned: number
  totalRewardsPaid: number
  conversionRate: number
  averageOrderValue: number
  topReferrers: Array<{
    userId: string
    userName: string
    referralCount: number
    totalRewards: number
  }>
  recentReferrals: ReferralUsage[]
}

export interface ReferralReward {
  id: string
  referralUsageId: string
  userId: string
  amount: number
  type: 'credit' | 'product' | 'discount'
  status: 'pending' | 'claimed' | 'expired'
  expiresAt: Date
  claimedAt?: Date
  description: string
}

class ReferralSystem {
  private static instance: ReferralSystem
  private referralCodes: Map<string, ReferralCode> = new Map()
  private referralUsages: Map<string, ReferralUsage> = new Map()
  private referralRewards: Map<string, ReferralReward> = new Map()

  constructor() {
    this.loadMockData()
  }

  static getInstance(): ReferralSystem {
    if (!ReferralSystem.instance) {
      ReferralSystem.instance = new ReferralSystem()
    }
    return ReferralSystem.instance
  }

  // Create a new referral code
  createReferralCode(
    organizationId: string,
    organizationName: string,
    createdBy: string,
    config: {
      code?: string
      rewardType: 'percentage' | 'fixed' | 'product'
      rewardValue: number
      rewardProductId?: string
      maxUses?: number
      expiresInDays?: number
      description: string
      terms: string
    }
  ): ReferralCode {
    const code = config.code || this.generateReferralCode()
    const expiresAt = config.expiresInDays ? 
      new Date(Date.now() + config.expiresInDays * 24 * 60 * 60 * 1000) : 
      undefined

    const referralCode: ReferralCode = {
      id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      code,
      organizationId,
      organizationName,
      createdBy,
      createdAt: new Date(),
      expiresAt,
      isActive: true,
      maxUses: config.maxUses,
      currentUses: 0,
      rewardType: config.rewardType,
      rewardValue: config.rewardValue,
      rewardProductId: config.rewardProductId,
      description: config.description,
      terms: config.terms
    }

    this.referralCodes.set(referralCode.id, referralCode)
    return referralCode
  }

  // Use a referral code
  useReferralCode(
    code: string,
    referredUserId: string,
    referredUserEmail: string,
    referringUserId: string,
    referringUserEmail: string,
    organizationId: string,
    orderId?: string,
    orderValue?: number
  ): ReferralUsage | null {
    const referralCode = this.findReferralCodeByCode(code)
    
    if (!referralCode) {
      throw new Error('Referral code not found')
    }

    if (!referralCode.isActive) {
      throw new Error('Referral code is not active')
    }

    if (referralCode.expiresAt && referralCode.expiresAt < new Date()) {
      throw new Error('Referral code has expired')
    }

    if (referralCode.maxUses && referralCode.currentUses >= referralCode.maxUses) {
      throw new Error('Referral code has reached maximum uses')
    }

    // Check if user has already used this code
    const existingUsage = Array.from(this.referralUsages.values()).find(
      usage => usage.referralCodeId === referralCode.id && 
               usage.referredUserId === referredUserId
    )

    if (existingUsage) {
      throw new Error('User has already used this referral code')
    }

    // Calculate reward
    const rewardEarned = this.calculateReward(referralCode, orderValue || 0)

    const referralUsage: ReferralUsage = {
      id: `usage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      referralCodeId: referralCode.id,
      referredUserId,
      referredUserEmail,
      referringUserId,
      referringUserEmail,
      organizationId,
      orderId,
      orderValue,
      rewardEarned,
      status: 'pending',
      createdAt: new Date()
    }

    this.referralUsages.set(referralUsage.id, referralUsage)
    
    // Update referral code usage count
    referralCode.currentUses++
    this.referralCodes.set(referralCode.id, referralCode)

    // Create reward
    this.createReward(referralUsage)

    return referralUsage
  }

  // Complete a referral (when order is completed)
  completeReferral(referralUsageId: string): boolean {
    const referralUsage = this.referralUsages.get(referralUsageId)
    if (!referralUsage) return false

    referralUsage.status = 'completed'
    referralUsage.completedAt = new Date()
    this.referralUsages.set(referralUsageId, referralUsage)

    // Update reward status
    const reward = this.findRewardByReferralUsageId(referralUsageId)
    if (reward) {
      reward.status = 'claimed'
      reward.claimedAt = new Date()
      this.referralRewards.set(reward.id, reward)
    }

    return true
  }

  // Get referral stats for an organization
  getReferralStats(organizationId: string): ReferralStats {
    const usages = Array.from(this.referralUsages.values())
      .filter(usage => usage.organizationId === organizationId)

    const totalReferrals = usages.length
    const successfulReferrals = usages.filter(u => u.status === 'completed').length
    const pendingReferrals = usages.filter(u => u.status === 'pending').length
    const totalRewardsEarned = usages.reduce((sum, u) => sum + u.rewardEarned, 0)
    const totalRewardsPaid = usages
      .filter(u => u.status === 'completed')
      .reduce((sum, u) => sum + u.rewardEarned, 0)
    
    const conversionRate = totalReferrals > 0 ? (successfulReferrals / totalReferrals) * 100 : 0
    const averageOrderValue = usages
      .filter(u => u.orderValue)
      .reduce((sum, u) => sum + (u.orderValue || 0), 0) / 
      usages.filter(u => u.orderValue).length || 0

    // Get top referrers
    const referrerMap = new Map<string, { count: number; rewards: number; name: string }>()
    usages.forEach(usage => {
      const existing = referrerMap.get(usage.referringUserId) || { count: 0, rewards: 0, name: usage.referringUserEmail }
      referrerMap.set(usage.referringUserId, {
        count: existing.count + 1,
        rewards: existing.rewards + usage.rewardEarned,
        name: existing.name
      })
    })

    const topReferrers = Array.from(referrerMap.entries())
      .map(([userId, data]) => ({
        userId,
        userName: data.name,
        referralCount: data.count,
        totalRewards: data.rewards
      }))
      .sort((a, b) => b.referralCount - a.referralCount)
      .slice(0, 10)

    const recentReferrals = usages
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10)

    return {
      totalReferrals,
      successfulReferrals,
      pendingReferrals,
      totalRewardsEarned,
      totalRewardsPaid,
      conversionRate,
      averageOrderValue,
      topReferrers,
      recentReferrals
    }
  }

  // Get referral codes for an organization
  getReferralCodes(organizationId: string): ReferralCode[] {
    return Array.from(this.referralCodes.values())
      .filter(code => code.organizationId === organizationId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // Get referral usages for an organization
  getReferralUsages(organizationId: string, limit: number = 50): ReferralUsage[] {
    return Array.from(this.referralUsages.values())
      .filter(usage => usage.organizationId === organizationId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)
  }

  // Validate referral code
  validateReferralCode(code: string): { valid: boolean; referralCode?: ReferralCode; error?: string } {
    const referralCode = this.findReferralCodeByCode(code)
    
    if (!referralCode) {
      return { valid: false, error: 'Referral code not found' }
    }

    if (!referralCode.isActive) {
      return { valid: false, error: 'Referral code is not active' }
    }

    if (referralCode.expiresAt && referralCode.expiresAt < new Date()) {
      return { valid: false, error: 'Referral code has expired' }
    }

    if (referralCode.maxUses && referralCode.currentUses >= referralCode.maxUses) {
      return { valid: false, error: 'Referral code has reached maximum uses' }
    }

    return { valid: true, referralCode }
  }

  // Private helper methods
  private generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  private findReferralCodeByCode(code: string): ReferralCode | undefined {
    return Array.from(this.referralCodes.values()).find(rc => rc.code === code)
  }

  private calculateReward(referralCode: ReferralCode, orderValue: number): number {
    switch (referralCode.rewardType) {
      case 'percentage':
        return (orderValue * referralCode.rewardValue) / 100
      case 'fixed':
        return referralCode.rewardValue
      case 'product':
        return 0 // Product rewards are handled separately
      default:
        return 0
    }
  }

  private createReward(referralUsage: ReferralUsage): ReferralReward {
    const reward: ReferralReward = {
      id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      referralUsageId: referralUsage.id,
      userId: referralUsage.referringUserId,
      amount: referralUsage.rewardEarned,
      type: 'credit',
      status: 'pending',
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      description: `Referral reward for ${referralUsage.referredUserEmail}`
    }

    this.referralRewards.set(reward.id, reward)
    return reward
  }

  private findRewardByReferralUsageId(referralUsageId: string): ReferralReward | undefined {
    return Array.from(this.referralRewards.values())
      .find(reward => reward.referralUsageId === referralUsageId)
  }

  private loadMockData(): void {
    // Create some mock referral codes
    const mockReferralCode = this.createReferralCode(
      'org-1',
      'Sample Nonprofit',
      'user-1',
      {
        code: 'WELCOME20',
        rewardType: 'percentage',
        rewardValue: 20,
        maxUses: 100,
        expiresInDays: 30,
        description: 'Welcome discount for new supporters',
        terms: 'Valid for first-time supporters only'
      }
    )

    // Create some mock referral usages
    this.useReferralCode(
      'WELCOME20',
      'user-2',
      'supporter@example.com',
      'user-1',
      'referrer@example.com',
      'org-1',
      'order-1',
      50.00
    )
  }
}

export const referralSystem = ReferralSystem.getInstance()
