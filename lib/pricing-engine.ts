// Dynamic Pricing Engine for NMBR Marketplace
// Handles platform fees, dropship markups, and commission calculations

export interface PricingConfig {
  platformFeePercentage: number
  dropshipMarkupPercentage: number
  minimumMarkup: number
  maximumMarkup: number
  currency: string
  taxRate: number
  shippingFee: number
  processingFee: number
}

export interface ProductPricing {
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
}

export interface RevenueBreakdown {
  grossRevenue: number
  platformFees: number
  dropshipCosts: number
  processingFees: number
  shippingFees: number
  taxes: number
  netRevenue: number
  profitMargin: number
}

export interface CommissionTier {
  tier: 'starter' | 'growth' | 'enterprise'
  platformFeePercentage: number
  dropshipMarkupPercentage: number
  minimumMonthlyRevenue: number
  maximumMonthlyRevenue?: number
  features: string[]
}

class PricingEngine {
  private static instance: PricingEngine
  private config: PricingConfig
  private commissionTiers: CommissionTier[]

  constructor() {
    this.config = {
      platformFeePercentage: 5.0, // 5% platform fee
      dropshipMarkupPercentage: 15.0, // 15% markup on dropship costs
      minimumMarkup: 2.0, // $2 minimum markup
      maximumMarkup: 50.0, // $50 maximum markup
      currency: 'USD',
      taxRate: 0.08, // 8% tax rate
      shippingFee: 5.99, // $5.99 shipping
      processingFee: 0.029 // 2.9% processing fee
    }

    this.commissionTiers = [
      {
        tier: 'starter',
        platformFeePercentage: 7.0,
        dropshipMarkupPercentage: 20.0,
        minimumMonthlyRevenue: 0,
        maximumMonthlyRevenue: 1000,
        features: ['Basic analytics', 'Email support', 'Standard templates']
      },
      {
        tier: 'growth',
        platformFeePercentage: 5.0,
        dropshipMarkupPercentage: 15.0,
        minimumMonthlyRevenue: 1000,
        maximumMonthlyRevenue: 10000,
        features: ['Advanced analytics', 'Priority support', 'Custom templates', 'API access']
      },
      {
        tier: 'enterprise',
        platformFeePercentage: 3.0,
        dropshipMarkupPercentage: 10.0,
        minimumMonthlyRevenue: 10000,
        features: ['White-label solution', 'Dedicated support', 'Custom integrations', 'Volume discounts']
      }
    ]
  }

  static getInstance(): PricingEngine {
    if (!PricingEngine.instance) {
      PricingEngine.instance = new PricingEngine()
    }
    return PricingEngine.instance
  }

  // Calculate pricing for a product
  calculateProductPricing(
    basePrice: number,
    dropshipCost: number,
    organizationTier: 'starter' | 'growth' | 'enterprise' = 'starter',
    quantity: number = 1
  ): ProductPricing {
    const tier = this.commissionTiers.find(t => t.tier === organizationTier) || this.commissionTiers[0]
    
    // Calculate platform fee
    const platformFee = (basePrice * tier.platformFeePercentage) / 100
    
    // Calculate dropship markup
    const markupPercentage = tier.dropshipMarkupPercentage
    const calculatedMarkup = (dropshipCost * markupPercentage) / 100
    const markup = Math.max(
      this.config.minimumMarkup,
      Math.min(calculatedMarkup, this.config.maximumMarkup)
    )
    
    // Calculate subtotal
    const subtotal = basePrice + platformFee + markup
    
    // Calculate tax
    const tax = subtotal * this.config.taxRate
    
    // Calculate shipping (free over $50)
    const shipping = subtotal >= 50 ? 0 : this.config.shippingFee
    
    // Calculate processing fee
    const processing = subtotal * this.config.processingFee
    
    // Calculate total
    const total = subtotal + tax + shipping + processing
    
    // Calculate profit and commission
    const profit = markup - platformFee
    const commission = platformFee
    
    return {
      basePrice,
      dropshipCost,
      platformFee,
      markup,
      subtotal,
      tax,
      shipping,
      processing,
      total,
      profit,
      commission
    }
  }

  // Calculate bulk pricing discounts
  calculateBulkPricing(
    basePrice: number,
    dropshipCost: number,
    quantity: number,
    organizationTier: 'starter' | 'growth' | 'enterprise' = 'starter'
  ): ProductPricing {
    // Apply quantity discounts
    let discountPercentage = 0
    if (quantity >= 100) discountPercentage = 15
    else if (quantity >= 50) discountPercentage = 10
    else if (quantity >= 25) discountPercentage = 5
    
    const discountedBasePrice = basePrice * (1 - discountPercentage / 100)
    const discountedDropshipCost = dropshipCost * (1 - discountPercentage / 100)
    
    return this.calculateProductPricing(
      discountedBasePrice,
      discountedDropshipCost,
      organizationTier,
      quantity
    )
  }

  // Calculate revenue breakdown for an organization
  calculateRevenueBreakdown(
    orders: Array<{
      subtotal: number
      platformFee: number
      dropshipCost: number
      processingFee: number
      shippingFee: number
      tax: number
    }>
  ): RevenueBreakdown {
    const grossRevenue = orders.reduce((sum, order) => sum + order.subtotal, 0)
    const platformFees = orders.reduce((sum, order) => sum + order.platformFee, 0)
    const dropshipCosts = orders.reduce((sum, order) => sum + order.dropshipCost, 0)
    const processingFees = orders.reduce((sum, order) => sum + order.processingFee, 0)
    const shippingFees = orders.reduce((sum, order) => sum + order.shippingFee, 0)
    const taxes = orders.reduce((sum, order) => sum + order.tax, 0)
    
    const netRevenue = grossRevenue - platformFees - dropshipCosts - processingFees - shippingFees - taxes
    const profitMargin = grossRevenue > 0 ? (netRevenue / grossRevenue) * 100 : 0
    
    return {
      grossRevenue,
      platformFees,
      dropshipCosts,
      processingFees,
      shippingFees,
      taxes,
      netRevenue,
      profitMargin
    }
  }

  // Get commission tier for an organization
  getCommissionTier(monthlyRevenue: number): CommissionTier {
    return this.commissionTiers.find(tier => 
      monthlyRevenue >= tier.minimumMonthlyRevenue && 
      (!tier.maximumMonthlyRevenue || monthlyRevenue < tier.maximumMonthlyRevenue)
    ) || this.commissionTiers[0]
  }

  // Calculate commission for dropship partner
  calculateDropshipCommission(
    orderValue: number,
    partner: 'printful' | 'gooten' | 'customink'
  ): number {
    const partnerRates = {
      printful: 0.05, // 5% commission
      gooten: 0.04,   // 4% commission
      customink: 0.06 // 6% commission
    }
    
    return orderValue * partnerRates[partner]
  }

  // Update pricing configuration
  updateConfig(newConfig: Partial<PricingConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  // Get current configuration
  getConfig(): PricingConfig {
    return { ...this.config }
  }

  // Get all commission tiers
  getCommissionTiers(): CommissionTier[] {
    return [...this.commissionTiers]
  }

  // Calculate profit margin for a product
  calculateProfitMargin(pricing: ProductPricing): number {
    return pricing.profit > 0 ? (pricing.profit / pricing.total) * 100 : 0
  }

  // Calculate break-even quantity
  calculateBreakEvenQuantity(
    basePrice: number,
    dropshipCost: number,
    fixedCosts: number,
    organizationTier: 'starter' | 'growth' | 'enterprise' = 'starter'
  ): number {
    const pricing = this.calculateProductPricing(basePrice, dropshipCost, organizationTier)
    const profitPerUnit = pricing.profit
    
    return profitPerUnit > 0 ? Math.ceil(fixedCosts / profitPerUnit) : Infinity
  }

  // Generate pricing report
  generatePricingReport(
    products: Array<{
      id: string
      name: string
      basePrice: number
      dropshipCost: number
      category: string
    }>,
    organizationTier: 'starter' | 'growth' | 'enterprise' = 'starter'
  ) {
    return products.map(product => {
      const pricing = this.calculateProductPricing(
        product.basePrice,
        product.dropshipCost,
        organizationTier
      )
      
      return {
        ...product,
        pricing,
        profitMargin: this.calculateProfitMargin(pricing)
      }
    })
  }
}

export const pricingEngine = PricingEngine.getInstance()
