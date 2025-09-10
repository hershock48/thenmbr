"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useAuth } from "@/contexts/AuthContext"
import type { OrganizationType } from "@/types"
import {
  Heart,
  Users,
  Mail,
  BarChart3,
  Settings,
  CreditCard,
  Share2,
  LayoutDashboard,
  ShoppingCart,
  Building2,
  Handshake,
  TrendingUp,
  Target,
  UserCheck,
  Megaphone,
  FolderOpen,
  QrCode,
  MessageSquare,
  Crown,
  Rocket,
  DollarSign,
  Store,
  Smartphone,
  Code,
  Zap,
  Globe,
} from "lucide-react"

interface OrganizationTerminology {
  donations: string
  subscribers: string
  fundraising: string
  campaigns: string
  supporters: string
  stories: string
  analytics: string
  engagement: string
}

interface NavigationItem {
  name: string
  href: string
  icon: any
  badge?: string | number
  description: string
}

interface OrganizationContextType {
  orgType: OrganizationType
  terminology: OrganizationTerminology
  navigation: NavigationItem[]
  getTerminology: (key: keyof OrganizationTerminology) => string
  getNavigationForType: () => NavigationItem[]
  getMetricsForType: () => Array<{
    name: string
    key: string
    icon: any
    color: string
    description: string
  }>
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

const organizationConfigs = {
  nonprofit: {
    terminology: {
      donations: "Donations",
      subscribers: "Donors",
      fundraising: "Fundraising",
      campaigns: "Campaigns",
      supporters: "Donors",
      stories: "Impact Stories",
      analytics: "Donor Analytics",
      engagement: "Donor Engagement",
    },
    navigation: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        description: "Overview of your fundraising activities",
      },
      {
        name: "Impact Stories",
        href: "/dashboard/nmbrs",
        icon: Heart,
        description: "Manage your impact stories and beneficiaries",
      },
      { name: "Donors", href: "/dashboard/subscribers", icon: Users, description: "Manage your donor relationships" },
      { name: "Newsletters", href: "/dashboard/newsletters", icon: Mail, description: "Send updates to your donors" },
      { name: "Communications", href: "/dashboard/communications", icon: MessageSquare, description: "Multi-channel communication tools" },
      { name: "Commerce", href: "/dashboard/commerce", icon: ShoppingCart, description: "Track sales and revenue from stories" },
      { name: "Revenue Analytics", href: "/dashboard/revenue", icon: DollarSign, description: "Track and optimize your revenue performance" },
      { name: "Upgrade Plan", href: "/dashboard/upgrade", icon: Crown, description: "Scale your revenue with advanced features" },
      {
        name: "Fundraising Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3,
        description: "Track donations and campaign performance",
      },
      { name: "Marketplace", href: "/marketplace", icon: ShoppingCart, description: "Browse and customize products with NMBR codes" },
      { name: "Storefront", href: "/dashboard/storefront", icon: Store, description: "Manage your white-label storefront" },
      { name: "Community", href: "/community", icon: Users, description: "Connect with other nonprofits and share success stories" },
      { name: "Advanced Analytics", href: "/dashboard/advanced-analytics", icon: BarChart3, description: "Deep insights into your fundraising performance" },
      { name: "Referrals", href: "/dashboard/referrals", icon: Share2, description: "Grow through referrals and affiliate partnerships" },
      { name: "Mobile App", href: "/mobile", icon: Smartphone, description: "Download and manage the NMBR mobile app" },
      { name: "API Documentation", href: "/api-docs", icon: Code, description: "Integrate NMBR with your existing systems" },
      { name: "Automation", href: "/dashboard/automation", icon: Zap, description: "Automate your fundraising processes and workflows" },
      { name: "Global Settings", href: "/dashboard/global-settings", icon: Globe, description: "Configure global localization, compliance, and scaling" },
      {
        name: "Donation Widget",
        href: "/dashboard/widget",
        icon: Share2,
        description: "Embed donation tools on your website",
      },
      {
        name: "Billing",
        href: "/dashboard/billing",
        icon: CreditCard,
        description: "Manage your subscription and payments",
      },
      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        description: "Configure your organization settings",
      },
    ],
    metrics: [
      {
        name: "Total Donations",
        key: "donations",
        icon: Heart,
        color: "text-rose-600",
        description: "Total amount raised",
      },
      {
        name: "Active Donors",
        key: "donors",
        icon: Users,
        color: "text-blue-600",
        description: "Number of active donors",
      },
      {
        name: "Campaigns",
        key: "campaigns",
        icon: Target,
        color: "text-green-600",
        description: "Active fundraising campaigns",
      },
      {
        name: "Impact Stories",
        key: "stories",
        icon: Megaphone,
        color: "text-purple-600",
        description: "Published impact stories",
      },
    ],
  },
  grassroots: {
    terminology: {
      donations: "Support",
      subscribers: "Supporters",
      fundraising: "Community Funding",
      campaigns: "Projects",
      supporters: "Community Members",
      stories: "Project Stories",
      analytics: "Community Analytics",
      engagement: "Community Engagement",
    },
    navigation: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        description: "Overview of your community projects",
      },
      {
        name: "Project Stories",
        href: "/dashboard/nmbrs",
        icon: FolderOpen,
        description: "Manage your project stories and updates",
      },
      {
        name: "Supporters",
        href: "/dashboard/subscribers",
        icon: Users,
        description: "Manage your community supporters",
      },
      {
        name: "Updates",
        href: "/dashboard/newsletters",
        icon: Mail,
        description: "Send project updates to supporters",
      },
      { name: "Communications", href: "/dashboard/communications", icon: MessageSquare, description: "Multi-channel communication tools" },
      { name: "Commerce", href: "/dashboard/commerce", icon: ShoppingCart, description: "Track sales and revenue from stories" },
      {
        name: "Community Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3,
        description: "Track support and project engagement",
      },
      { name: "Marketplace", href: "/marketplace", icon: ShoppingCart, description: "Order project merchandise" },
      {
        name: "Support Widget",
        href: "/dashboard/widget",
        icon: Share2,
        description: "Embed support tools on your website",
      },
      {
        name: "Billing",
        href: "/dashboard/billing",
        icon: CreditCard,
        description: "Manage your subscription and payments",
      },
      { name: "Settings", href: "/dashboard/settings", icon: Settings, description: "Configure your project settings" },
    ],
    metrics: [
      {
        name: "Community Support",
        key: "support",
        icon: Handshake,
        color: "text-emerald-600",
        description: "Total community support received",
      },
      {
        name: "Active Supporters",
        key: "supporters",
        icon: Users,
        color: "text-teal-600",
        description: "Number of active supporters",
      },
      {
        name: "Active Projects",
        key: "projects",
        icon: FolderOpen,
        color: "text-green-600",
        description: "Ongoing community projects",
      },
      {
        name: "Project Updates",
        key: "updates",
        icon: Megaphone,
        color: "text-blue-600",
        description: "Published project updates",
      },
    ],
  },
  business: {
    terminology: {
      donations: "Sales",
      subscribers: "Customers",
      fundraising: "Customer Engagement",
      campaigns: "Campaigns",
      supporters: "Customers",
      stories: "Brand Stories",
      analytics: "Customer Analytics",
      engagement: "Customer Engagement",
    },
    navigation: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        description: "Overview of your customer engagement",
      },
      {
        name: "Brand Stories",
        href: "/dashboard/stories",
        icon: Building2,
        description: "Manage your brand and product stories",
      },
      {
        name: "Customers",
        href: "/dashboard/subscribers",
        icon: UserCheck,
        description: "Manage your customer relationships",
      },
      {
        name: "Campaigns",
        href: "/dashboard/newsletters",
        icon: Megaphone,
        description: "Send campaigns to your customers",
      },
      { name: "Communications", href: "/dashboard/communications", icon: MessageSquare, description: "Multi-channel communication tools" },
      { name: "Commerce", href: "/dashboard/commerce", icon: ShoppingCart, description: "Track sales and revenue from stories" },
      { name: "Revenue Analytics", href: "/dashboard/revenue", icon: DollarSign, description: "Track and optimize your revenue performance" },
      { name: "Upgrade Plan", href: "/dashboard/upgrade", icon: Crown, description: "Scale your revenue with advanced features" },
      {
        name: "Customer Analytics",
        href: "/dashboard/analytics",
        icon: TrendingUp,
        description: "Track sales and customer engagement",
      },
      {
        name: "QR Codes",
        href: "/dashboard/qr-codes",
        icon: QrCode,
        description: "Manage QR codes and track scans",
      },
      {
        name: "Integrations",
        href: "/dashboard/integrations",
        icon: Settings,
        description: "Connect your e-commerce platforms",
      },
      { name: "Marketplace", href: "/dashboard/marketplace", icon: ShoppingCart, description: "Order branded merchandise" },
      {
        name: "Engagement Widget",
        href: "/dashboard/widget",
        icon: Share2,
        description: "Embed engagement tools on your website",
      },
      {
        name: "Billing",
        href: "/dashboard/billing",
        icon: CreditCard,
        description: "Manage your subscription and payments",
      },
      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        description: "Configure your business settings",
      },
    ],
    metrics: [
      {
        name: "Total Sales",
        key: "sales",
        icon: TrendingUp,
        color: "text-blue-600",
        description: "Total sales generated",
      },
      {
        name: "Active Customers",
        key: "customers",
        icon: UserCheck,
        color: "text-indigo-600",
        description: "Number of active customers",
      },
      {
        name: "Active Campaigns",
        key: "campaigns",
        icon: Megaphone,
        color: "text-purple-600",
        description: "Running marketing campaigns",
      },
      {
        name: "Brand Stories",
        key: "stories",
        icon: Building2,
        color: "text-cyan-600",
        description: "Published brand stories",
      },
    ],
  },
}

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const { org } = useAuth()
  const orgType: OrganizationType = org?.organization_type || "nonprofit"
  const config = organizationConfigs[orgType]

  const getTerminology = (key: keyof OrganizationTerminology): string => {
    return config.terminology[key]
  }

  const getNavigationForType = (): NavigationItem[] => {
    return config.navigation
  }

  const getMetricsForType = () => {
    return config.metrics
  }

  const value: OrganizationContextType = {
    orgType,
    terminology: config.terminology,
    navigation: config.navigation,
    getTerminology,
    getNavigationForType,
    getMetricsForType,
  }

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>
}

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error("useOrganization must be used within an OrganizationProvider")
  }
  return context
}
