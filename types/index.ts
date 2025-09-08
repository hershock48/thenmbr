// Organization Types
export type OrganizationType = 'nonprofit' | 'grassroots' | 'business'

// Organization Type Configuration
export interface OrganizationTypeConfig {
  id: OrganizationType
  name: string
  description: string
  terminology: {
    donations: string
    subscribers: string
    fundraising: string
    campaigns: string
    supporters: string
    community: string
    projects: string
    sales: string
    customers: string
    products: string
    engagement: string
  }
  features: string[]
  integrations: string[]
  compliance: {
    requiresEIN: boolean
    requiresTaxExempt: boolean
    requiresBusinessRegistration: boolean
    fiscalSponsorship: boolean
  }
  defaultSettings: {
    showPoweredBy: boolean
    allowDonations: boolean
    allowSubscriptions: boolean
    allowProductSales: boolean
    requireEmailVerification: boolean
  }
}

// Organization Type Configurations
export const ORGANIZATION_TYPES: Record<OrganizationType, OrganizationTypeConfig> = {
  nonprofit: {
    id: 'nonprofit',
    name: 'Nonprofit (501c3)',
    description: 'Registered nonprofit organization with tax-exempt status',
    terminology: {
      donations: 'Donations',
      subscribers: 'Donors',
      fundraising: 'Fundraising',
      campaigns: 'Campaigns',
      supporters: 'Supporters',
      community: 'Community',
      projects: 'Projects',
      sales: 'Donations',
      customers: 'Donors',
      products: 'Causes',
      engagement: 'Engagement'
    },
    features: ['donations', 'donor_management', 'fundraising', 'tax_compliance', 'impact_tracking'],
    integrations: ['stripe', 'mailchimp', 'salesforce', 'quickbooks'],
    compliance: {
      requiresEIN: true,
      requiresTaxExempt: true,
      requiresBusinessRegistration: false,
      fiscalSponsorship: false
    },
    defaultSettings: {
      showPoweredBy: true,
      allowDonations: true,
      allowSubscriptions: true,
      allowProductSales: false,
      requireEmailVerification: true
    }
  },
  grassroots: {
    id: 'grassroots',
    name: 'Grassroots Organization',
    description: 'Community project or informal group without formal registration',
    terminology: {
      donations: 'Support',
      subscribers: 'Supporters',
      fundraising: 'Community Funding',
      campaigns: 'Projects',
      supporters: 'Supporters',
      community: 'Community',
      projects: 'Projects',
      sales: 'Support',
      customers: 'Supporters',
      products: 'Projects',
      engagement: 'Community Engagement'
    },
    features: ['community_support', 'project_management', 'fiscal_sponsorship', 'community_engagement'],
    integrations: ['stripe', 'mailchimp', 'community_platforms'],
    compliance: {
      requiresEIN: false,
      requiresTaxExempt: false,
      requiresBusinessRegistration: false,
      fiscalSponsorship: true
    },
    defaultSettings: {
      showPoweredBy: true,
      allowDonations: true,
      allowSubscriptions: true,
      allowProductSales: false,
      requireEmailVerification: false
    }
  },
  business: {
    id: 'business',
    name: 'Business',
    description: 'For-profit business focused on social impact and customer engagement',
    terminology: {
      donations: 'Sales',
      subscribers: 'Customers',
      fundraising: 'Engagement',
      campaigns: 'Campaigns',
      supporters: 'Customers',
      community: 'Community',
      projects: 'Initiatives',
      sales: 'Sales',
      customers: 'Customers',
      products: 'Products',
      engagement: 'Customer Engagement'
    },
    features: ['product_sales', 'customer_management', 'csr_tracking', 'brand_storytelling', 'customer_engagement'],
    integrations: ['stripe', 'shopify', 'mailchimp', 'salesforce', 'hubspot'],
    compliance: {
      requiresEIN: false,
      requiresTaxExempt: false,
      requiresBusinessRegistration: true,
      fiscalSponsorship: false
    },
    defaultSettings: {
      showPoweredBy: false,
      allowDonations: false,
      allowSubscriptions: true,
      allowProductSales: true,
      requireEmailVerification: true
    }
  }
}

// Updated Organization Interface
export interface Organization {
  id: string
  name: string
  website?: string
  email: string
  organization_type: OrganizationType
  logo_url?: string
  brand_color: string
  secondary_color?: string
  accent_color?: string
  font_family?: string
  show_powered_by?: boolean
  stripe_account_id?: string
  // Type-specific metadata
  metadata?: {
    ein?: string // For nonprofits
    tax_exempt_status?: boolean // For nonprofits
    business_registration?: string // For businesses
    industry?: string // For businesses
    project_description?: string // For grassroots
    community_focus?: string // For grassroots
    fiscal_sponsor?: string // For grassroots
  }
  created_at: string
  updated_at: string
}

// Legacy interface for backward compatibility
export interface Nonprofit extends Organization {
  organization_type: 'nonprofit'
}

export interface Story {
  id: string
  org_id: string
  nmbr_code: string
  title: string
  description?: string
  photo_url?: string
  created_at: string
  updated_at: string
}

export interface Subscriber {
  id: string
  email: string
  org_id: string
  story_id?: string
  created_at: string
}

export interface Donation {
  id: string
  org_id: string
  story_id?: string
  amount: number
  platform_fee: number
  donor_email?: string
  stripe_txn_id?: string
  stripe_payment_intent_id?: string
  status: 'pending' | 'succeeded' | 'failed' | 'canceled'
  created_at: string
}

export interface WidgetProps {
  org: string
  type: 'story-search' | 'donate' | 'subscribe'
  nmbr?: string
  amount?: number
  showPoweredBy?: boolean
}
