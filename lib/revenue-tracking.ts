// Revenue Tracking System for NMBR Marketplace
// Tracks revenue, commissions, and financial analytics

export interface RevenueTransaction {
  id: string
  organizationId: string
  orderId: string
  productId: string
  productName: string
  category: string
  quantity: number
  basePrice: number
  dropshipCost: number
  platformFee: number
  markup: number
  subtotal: number
  tax: number
  shipping: number
  processing: number
  total: number
  profit: number
  commission: number
  partner: 'printful' | 'gooten' | 'customink'
  status: 'pending' | 'completed' | 'refunded' | 'cancelled'
  createdAt: Date
  completedAt?: Date
  refundedAt?: Date
  refundAmount?: number
}

export interface RevenueMetrics {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  totalProfit: number
  totalCommissions: number
  platformFees: number
  dropshipCosts: number
  processingFees: number
  shippingFees: number
  taxes: number
  refunds: number
  netRevenue: number
  profitMargin: number
  conversionRate: number
  customerLifetimeValue: number
}

export interface RevenueByCategory {
  category: string
  revenue: number
  orders: number
  profit: number
  profitMargin: number
  averageOrderValue: number
}

export interface RevenueByPartner {
  partner: string
  revenue: number
  orders: number
  commission: number
  averageOrderValue: number
}

export interface RevenueByTimeframe {
  timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly'
  period: string
  revenue: number
  orders: number
  profit: number
  growth: number
}

class RevenueTracker {
  private static instance: RevenueTracker
  private transactions: Map<string, RevenueTransaction> = new Map()
  private organizationMetrics: Map<string, RevenueMetrics> = new Map()

  constructor() {
    this.loadMockData()
  }

  static getInstance(): RevenueTracker {
    if (!RevenueTracker.instance) {
      RevenueTracker.instance = new RevenueTracker()
    }
    return RevenueTracker.instance
  }

  // Add a new revenue transaction
  addTransaction(transaction: Omit<RevenueTransaction, 'id' | 'createdAt'>): RevenueTransaction {
    const id = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newTransaction: RevenueTransaction = {
      ...transaction,
      id,
      createdAt: new Date()
    }
    
    this.transactions.set(id, newTransaction)
    this.updateOrganizationMetrics(transaction.organizationId)
    
    return newTransaction
  }

  // Update transaction status
  updateTransactionStatus(
    transactionId: string,
    status: RevenueTransaction['status'],
    additionalData?: { refundAmount?: number }
  ): boolean {
    const transaction = this.transactions.get(transactionId)
    if (!transaction) return false

    const updatedTransaction = {
      ...transaction,
      status,
      ...(status === 'completed' && { completedAt: new Date() }),
      ...(status === 'refunded' && { 
        refundedAt: new Date(),
        refundAmount: additionalData?.refundAmount || transaction.total
      })
    }

    this.transactions.set(transactionId, updatedTransaction)
    this.updateOrganizationMetrics(transaction.organizationId)
    
    return true
  }

  // Get revenue metrics for an organization
  getRevenueMetrics(organizationId: string, timeframe?: { start: Date; end: Date }): RevenueMetrics {
    const transactions = this.getTransactionsForOrganization(organizationId, timeframe)
    
    const totalRevenue = transactions.reduce((sum, t) => sum + t.subtotal, 0)
    const totalOrders = transactions.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    const totalProfit = transactions.reduce((sum, t) => sum + t.profit, 0)
    const totalCommissions = transactions.reduce((sum, t) => sum + t.commission, 0)
    const platformFees = transactions.reduce((sum, t) => sum + t.platformFee, 0)
    const dropshipCosts = transactions.reduce((sum, t) => sum + t.dropshipCost, 0)
    const processingFees = transactions.reduce((sum, t) => sum + t.processing, 0)
    const shippingFees = transactions.reduce((sum, t) => sum + t.shipping, 0)
    const taxes = transactions.reduce((sum, t) => sum + t.tax, 0)
    const refunds = transactions
      .filter(t => t.status === 'refunded')
      .reduce((sum, t) => sum + (t.refundAmount || 0), 0)
    
    const netRevenue = totalRevenue - platformFees - dropshipCosts - processingFees - shippingFees - taxes - refunds
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0
    
    // Calculate conversion rate (simplified)
    const conversionRate = totalOrders > 0 ? Math.min(95, 60 + (totalOrders * 0.1)) : 0
    
    // Calculate customer lifetime value (simplified)
    const customerLifetimeValue = averageOrderValue * 2.5

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      totalProfit,
      totalCommissions,
      platformFees,
      dropshipCosts,
      processingFees,
      shippingFees,
      taxes,
      refunds,
      netRevenue,
      profitMargin,
      conversionRate,
      customerLifetimeValue
    }
  }

  // Get revenue breakdown by category
  getRevenueByCategory(organizationId: string, timeframe?: { start: Date; end: Date }): RevenueByCategory[] {
    const transactions = this.getTransactionsForOrganization(organizationId, timeframe)
    const categoryMap = new Map<string, {
      revenue: number
      orders: number
      profit: number
    }>()

    transactions.forEach(transaction => {
      const existing = categoryMap.get(transaction.category) || {
        revenue: 0,
        orders: 0,
        profit: 0
      }
      
      categoryMap.set(transaction.category, {
        revenue: existing.revenue + transaction.subtotal,
        orders: existing.orders + 1,
        profit: existing.profit + transaction.profit
      })
    })

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      revenue: data.revenue,
      orders: data.orders,
      profit: data.profit,
      profitMargin: data.revenue > 0 ? (data.profit / data.revenue) * 100 : 0,
      averageOrderValue: data.orders > 0 ? data.revenue / data.orders : 0
    }))
  }

  // Get revenue breakdown by dropship partner
  getRevenueByPartner(organizationId: string, timeframe?: { start: Date; end: Date }): RevenueByPartner[] {
    const transactions = this.getTransactionsForOrganization(organizationId, timeframe)
    const partnerMap = new Map<string, {
      revenue: number
      orders: number
      commission: number
    }>()

    transactions.forEach(transaction => {
      const existing = partnerMap.get(transaction.partner) || {
        revenue: 0,
        orders: 0,
        commission: 0
      }
      
      partnerMap.set(transaction.partner, {
        revenue: existing.revenue + transaction.subtotal,
        orders: existing.orders + 1,
        commission: existing.commission + transaction.commission
      })
    })

    return Array.from(partnerMap.entries()).map(([partner, data]) => ({
      partner,
      revenue: data.revenue,
      orders: data.orders,
      commission: data.commission,
      averageOrderValue: data.orders > 0 ? data.revenue / data.orders : 0
    }))
  }

  // Get revenue trends over time
  getRevenueTrends(
    organizationId: string,
    timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly',
    periods: number = 12
  ): RevenueByTimeframe[] {
    const transactions = this.getTransactionsForOrganization(organizationId)
    const trends: RevenueByTimeframe[] = []
    
    const now = new Date()
    const periodMap = new Map<string, {
      revenue: number
      orders: number
      profit: number
    }>()

    // Group transactions by time period
    transactions.forEach(transaction => {
      const period = this.getTimePeriod(transaction.createdAt, timeframe)
      const existing = periodMap.get(period) || {
        revenue: 0,
        orders: 0,
        profit: 0
      }
      
      periodMap.set(period, {
        revenue: existing.revenue + transaction.subtotal,
        orders: existing.orders + 1,
        profit: existing.profit + transaction.profit
      })
    })

    // Generate trends for the specified number of periods
    for (let i = periods - 1; i >= 0; i--) {
      const periodDate = new Date(now)
      switch (timeframe) {
        case 'daily':
          periodDate.setDate(periodDate.getDate() - i)
          break
        case 'weekly':
          periodDate.setDate(periodDate.getDate() - (i * 7))
          break
        case 'monthly':
          periodDate.setMonth(periodDate.getMonth() - i)
          break
        case 'yearly':
          periodDate.setFullYear(periodDate.getFullYear() - i)
          break
      }
      
      const period = this.getTimePeriod(periodDate, timeframe)
      const data = periodMap.get(period) || { revenue: 0, orders: 0, profit: 0 }
      
      const previousPeriod = trends[trends.length - 1]
      const growth = previousPeriod ? 
        ((data.revenue - previousPeriod.revenue) / previousPeriod.revenue) * 100 : 0
      
      trends.push({
        timeframe,
        period,
        revenue: data.revenue,
        orders: data.orders,
        profit: data.profit,
        growth
      })
    }

    return trends.reverse()
  }

  // Get top performing products
  getTopProducts(organizationId: string, limit: number = 10, timeframe?: { start: Date; end: Date }) {
    const transactions = this.getTransactionsForOrganization(organizationId, timeframe)
    const productMap = new Map<string, {
      name: string
      category: string
      revenue: number
      orders: number
      profit: number
    }>()

    transactions.forEach(transaction => {
      const existing = productMap.get(transaction.productId) || {
        name: transaction.productName,
        category: transaction.category,
        revenue: 0,
        orders: 0,
        profit: 0
      }
      
      productMap.set(transaction.productId, {
        name: transaction.productName,
        category: transaction.category,
        revenue: existing.revenue + transaction.subtotal,
        orders: existing.orders + 1,
        profit: existing.profit + transaction.profit
      })
    })

    return Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit)
  }

  // Private helper methods
  private getTransactionsForOrganization(
    organizationId: string,
    timeframe?: { start: Date; end: Date }
  ): RevenueTransaction[] {
    let transactions = Array.from(this.transactions.values())
      .filter(t => t.organizationId === organizationId)

    if (timeframe) {
      transactions = transactions.filter(t => 
        t.createdAt >= timeframe.start && t.createdAt <= timeframe.end
      )
    }

    return transactions
  }

  private updateOrganizationMetrics(organizationId: string): void {
    const metrics = this.getRevenueMetrics(organizationId)
    this.organizationMetrics.set(organizationId, metrics)
  }

  private getTimePeriod(date: Date, timeframe: string): string {
    switch (timeframe) {
      case 'daily':
        return date.toISOString().split('T')[0]
      case 'weekly':
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        return weekStart.toISOString().split('T')[0]
      case 'monthly':
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      case 'yearly':
        return String(date.getFullYear())
      default:
        return date.toISOString().split('T')[0]
    }
  }

  private loadMockData(): void {
    // Load some mock data for demonstration
    const mockTransactions: Omit<RevenueTransaction, 'id' | 'createdAt'>[] = [
      {
        organizationId: 'org-1',
        orderId: 'order-1',
        productId: 'tshirt-unisex-basic',
        productName: 'Unisex Basic T-Shirt',
        category: 'apparel',
        quantity: 2,
        basePrice: 12.99,
        dropshipCost: 8.50,
        platformFee: 0.65,
        markup: 1.28,
        subtotal: 15.92,
        tax: 1.27,
        shipping: 5.99,
        processing: 0.46,
        total: 23.64,
        profit: 0.63,
        commission: 0.65,
        partner: 'printful',
        status: 'completed',
        completedAt: new Date(Date.now() - 86400000) // 1 day ago
      },
      {
        organizationId: 'org-1',
        orderId: 'order-2',
        productId: 'mug-ceramic-white',
        productName: 'White Ceramic Mug',
        category: 'drinkware',
        quantity: 1,
        basePrice: 8.99,
        dropshipCost: 5.20,
        platformFee: 0.45,
        markup: 0.78,
        subtotal: 10.22,
        tax: 0.82,
        shipping: 0, // Free shipping over $50
        processing: 0.30,
        total: 11.34,
        profit: 0.33,
        commission: 0.45,
        partner: 'printful',
        status: 'completed',
        completedAt: new Date(Date.now() - 172800000) // 2 days ago
      }
    ]

    mockTransactions.forEach(transaction => {
      this.addTransaction(transaction)
    })
  }
}

export const revenueTracker = RevenueTracker.getInstance()
