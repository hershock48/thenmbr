export interface Product {
  id: string
  orgId: string
  title: string
  slug: string
  description: string
  price: number
  currency: string
  variants: ProductVariant[]
  stock: number
  media: ProductMedia[]
  status: 'draft' | 'active' | 'archived'
  fulfillmentMode: 'physical' | 'digital' | 'service'
  shippingProfileId?: string
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  name: string
  price: number
  sku: string
  stock: number
  attributes: Record<string, string> // e.g., { size: 'Large', color: 'Blue' }
}

export interface ProductMedia {
  id: string
  type: 'image' | 'video'
  url: string
  alt?: string
  order: number
}

export interface ProductStoryLink {
  id: string
  productId: string
  nmbrId: string
  priority: number // Higher number = higher priority
  createdAt: string
}

export interface Order {
  id: string
  orgId: string
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  currency: string
  destinationAccountId: string // Stripe Connect account
  applicationFeeAmount: number // Platform fee
  customerEmail: string
  customerName?: string
  shippingAddress?: Address
  billingAddress?: Address
  attribution: OrderAttribution
  stripeChargeId: string
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  variantId?: string
  quantity: number
  price: number
  total: number
}

export interface OrderAttribution {
  nmbrId?: string
  updateId?: string
  campaignId?: string
  recipientIdHash?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  referrer?: string
  clickedAt?: string
  sessionId?: string
}

export interface Address {
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface Campaign {
  id: string
  orgId: string
  name: string
  type: 'newsletter' | 'update' | 'promotional'
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface Update {
  id: string
  campaignId: string
  nmbrId: string
  subject: string
  content: string
  sentAt?: string
  createdAt: string
  updatedAt: string
}

export interface UpdateSend {
  id: string
  updateId: string
  recipientId: string
  messageId: string
  delivered: boolean
  openedAt?: string
  clickedAt?: string
  createdAt: string
}

export interface StorefrontSettings {
  orgId: string
  domain: string // Custom domain or subdomain
  branding: {
    logo?: string
    primaryColor: string
    secondaryColor: string
    fontFamily: string
    showPoweredBy: boolean
  }
  settings: {
    currency: string
    taxEnabled: boolean
    shippingEnabled: boolean
    allowGuestCheckout: boolean
  }
  stripeAccountId?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface MarketplaceSettings {
  orgId: string
  isActive: boolean
  bio?: string
  impactStats: {
    totalRaised: number
    totalOrders: number
    totalSupporters: number
  }
  featuredNmbrs: string[]
  categories: string[]
  createdAt: string
  updatedAt: string
}

export interface CommerceAnalytics {
  revenue: {
    total: number
    byNmbr: Record<string, number>
    byUpdate: Record<string, number>
    byProduct: Record<string, number>
    byTimeframe: {
      daily: Record<string, number>
      weekly: Record<string, number>
      monthly: Record<string, number>
    }
  }
  orders: {
    total: number
    averageOrderValue: number
    conversionRate: number
    repeatPurchaseRate: number
  }
  attribution: {
    emailClicks: number
    emailConversions: number
    emailRevenue: number
    topPerformingUpdates: Array<{
      updateId: string
      nmbrId: string
      clicks: number
      conversions: number
      revenue: number
    }>
  }
}
