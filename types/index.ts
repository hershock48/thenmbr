export interface Nonprofit {
  id: string
  name: string
  logo_url?: string
  brand_color: string
  secondary_color?: string
  accent_color?: string
  font_family?: string
  show_powered_by?: boolean
  stripe_account_id?: string
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
