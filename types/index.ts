export type OrganizationType = "nonprofit" | "grassroots" | "business"

export interface OrganizationTypeConfig {
  id: OrganizationType
  name: string
  description: string
  icon: string
  color: string
  terminology: {
    donations: string
    subscribers: string
    fundraising: string
    campaigns: string
    supporters: string
  }
  features: string[]
  requiredFields: string[]
  validationRules: Record<string, any>
}

export interface Nonprofit {
  id: string
  name: string
  organization_type: OrganizationType
  industry?: string
  ein_number?: string
  tax_exempt_status?: boolean
  fiscal_sponsor?: string
  business_registration?: string
  csr_focus_areas?: string[]
  logo_url?: string
  brand_color: string
  secondary_color?: string
  accent_color?: string
  font_family?: string
  show_powered_by?: boolean
  stripe_account_id?: string
  website?: string
  is_active?: boolean
  created_at: string
  updated_at: string
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
  status: "pending" | "succeeded" | "failed" | "canceled"
  created_at: string
}

export interface WidgetProps {
  org: string
  type: "story-search" | "donate" | "subscribe"
  nmbr?: string
  amount?: number
  showPoweredBy?: boolean
}

export const ORGANIZATION_TYPES: OrganizationTypeConfig[] = [
  {
    id: "nonprofit",
    name: "Nonprofit Organization",
    description: "501(c)(3) tax-exempt charitable organizations",
    icon: "heart",
    color: "#10B981",
    terminology: {
      donations: "Donations",
      subscribers: "Supporters",
      fundraising: "Fundraising",
      campaigns: "Campaigns",
      supporters: "Donors",
    },
    features: ["Tax-deductible receipts", "Grant tracking", "Volunteer management"],
    requiredFields: ["ein_number", "tax_exempt_status"],
    validationRules: {
      ein_number: { required: true, pattern: /^\d{2}-\d{7}$/ },
    },
  },
  {
    id: "grassroots",
    name: "Grassroots Initiative",
    description: "Community-driven movements and local causes",
    icon: "users",
    color: "#F59E0B",
    terminology: {
      donations: "Contributions",
      subscribers: "Community Members",
      fundraising: "Community Funding",
      campaigns: "Initiatives",
      supporters: "Contributors",
    },
    features: ["Community organizing", "Event coordination", "Social media integration"],
    requiredFields: ["fiscal_sponsor"],
    validationRules: {
      fiscal_sponsor: { required: true },
    },
  },
  {
    id: "business",
    name: "Business/Corporate",
    description: "For-profit companies with social impact initiatives",
    icon: "building",
    color: "#3B82F6",
    terminology: {
      donations: "Investments",
      subscribers: "Stakeholders",
      fundraising: "Impact Funding",
      campaigns: "CSR Programs",
      supporters: "Partners",
    },
    features: ["CSR reporting", "Employee engagement", "Impact measurement"],
    requiredFields: ["business_registration", "csr_focus_areas"],
    validationRules: {
      business_registration: { required: true },
    },
  },
]
