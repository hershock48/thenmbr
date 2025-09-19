import { OrganizationType, ORGANIZATION_TYPES } from '@/types'

// Content configuration for each organization type
export interface ContentConfig {
  hero: {
    headline: string
    subheadline: string
    cta: string
    ctaSecondary?: string
  }
  features: {
    title: string
    items: Array<{
      title: string
      description: string
      icon: string
    }>
  }
  pricing: {
    title: string
    subtitle: string
    plans: Array<{
      name: string
      price: string
      description: string
      features: string[]
      cta: string
    }>
  }
  testimonials: {
    title: string
    items: Array<{
      quote: string
      author: string
      role: string
      organization: string
    }>
  }
  faq: {
    title: string
    items: Array<{
      question: string
      answer: string
    }>
  }
}

// Content configurations for each organization type
export const CONTENT_CONFIGS: Record<OrganizationType, ContentConfig> = {
  nonprofit: {
    hero: {
      headline: "Transform Fundraising with Personalized Impact Stories",
      subheadline: "Connect donors directly to the people they help through compelling stories that drive donations and build lasting relationships.",
      cta: "Start Fundraising",
      ctaSecondary: "See How It Works"
    },
    features: {
      title: "Everything You Need to Maximize Donations",
      items: [
        {
          title: "Impact Story Creation",
          description: "Create compelling stories that showcase your mission and connect donors to real impact.",
          icon: "Heart"
        },
        {
          title: "Donor Management",
          description: "Track donor engagement, manage relationships, and build lasting connections.",
          icon: "Users"
        },
        {
          title: "Fundraising Campaigns",
          description: "Launch targeted campaigns with personalized messaging and automated follow-ups.",
          icon: "Target"
        },
        {
          title: "Tax Compliance",
          description: "Automated tax receipts and compliance tools for 501(c)(3) organizations.",
          icon: "Shield"
        }
      ]
    },
    pricing: {
      title: "Pricing for Nonprofits",
      subtitle: "Transparent pricing with no hidden fees. More donations, less overhead.",
      plans: [
        {
          name: "Starter",
          price: "$29/month",
          description: "Perfect for small nonprofits getting started",
          features: ["Up to 100 stories", "Basic donor management", "Email support"],
          cta: "Start Free Trial"
        },
        {
          name: "Professional",
          price: "$79/month",
          description: "For growing nonprofits with active fundraising",
          features: ["Unlimited stories", "Advanced analytics", "Priority support"],
          cta: "Start Free Trial"
        }
      ]
    },
    testimonials: {
      title: "Trusted by Nonprofits Worldwide",
      items: [
        {
          quote: "The NMBR helped us increase donations by 40% in just 3 months.",
          author: "Sarah Johnson",
          role: "Development Director",
          organization: "Hope Foundation"
        },
        {
          quote: "Finally, a platform that makes storytelling easy and effective.",
          author: "Michael Chen",
          role: "Executive Director",
          organization: "Community Care"
        }
      ]
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        {
          question: "Is this platform suitable for 501(c)(3) organizations?",
          answer: "Yes, we're specifically designed for nonprofits with full tax compliance features."
        },
        {
          question: "How does the donation processing work?",
          answer: "We integrate with Stripe to process donations securely and provide tax receipts automatically."
        }
      ]
    }
  },
  grassroots: {
    hero: {
      headline: "Amplify Your Community Project with Powerful Storytelling",
      subheadline: "Share your impact, engage supporters, and build community around your grassroots initiative.",
      cta: "Start Your Project",
      ctaSecondary: "See Examples"
    },
    features: {
      title: "Tools for Community Impact",
      items: [
        {
          title: "Community Stories",
          description: "Share authentic stories that showcase your community's impact and progress.",
          icon: "Heart"
        },
        {
          title: "Supporter Engagement",
          description: "Build a community of supporters who care about your cause and want to help.",
          icon: "Users"
        },
        {
          title: "Project Management",
          description: "Track progress, share updates, and keep your community informed.",
          icon: "Target"
        },
        {
          title: "Fiscal Sponsorship",
          description: "Process donations through our fiscal sponsorship program.",
          icon: "Shield"
        }
      ]
    },
    pricing: {
      title: "Pricing for Grassroots Organizations",
      subtitle: "Affordable tools for community projects and informal groups.",
      plans: [
        {
          name: "Community",
          price: "$19/month",
          description: "Perfect for community projects and local initiatives",
          features: ["Up to 50 stories", "Community management", "Email support"],
          cta: "Start Free Trial"
        },
        {
          name: "Movement",
          price: "$49/month",
          description: "For larger grassroots movements and campaigns",
          features: ["Unlimited stories", "Advanced analytics", "Priority support"],
          cta: "Start Free Trial"
        }
      ]
    },
    testimonials: {
      title: "Empowering Community Change",
      items: [
        {
          quote: "The NMBR helped us build a community of 500+ supporters for our local initiative.",
          author: "Maria Rodriguez",
          role: "Community Organizer",
          organization: "Green Neighborhood"
        },
        {
          quote: "Finally, a platform that understands grassroots organizing.",
          author: "David Kim",
          role: "Movement Leader",
          organization: "Youth for Change"
        }
      ]
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        {
          question: "Do I need to be a registered nonprofit?",
          answer: "No, we support informal groups and community projects through our fiscal sponsorship program."
        },
        {
          question: "How does fiscal sponsorship work?",
          answer: "We process donations on your behalf and provide you with the funds, handling all tax requirements."
        }
      ]
    }
  },
  business: {
    hero: {
      headline: "Connect with Customers Through Authentic Impact Stories",
      subheadline: "Build trust, engage customers, and showcase your social impact through compelling storytelling.",
      cta: "Start Storytelling",
      ctaSecondary: "View Demo"
    },
    features: {
      title: "Tools for Business Impact",
      items: [
        {
          title: "Brand Storytelling",
          description: "Create authentic stories that showcase your company's values and social impact.",
          icon: "Heart"
        },
        {
          title: "Customer Engagement",
          description: "Build deeper connections with customers through shared values and impact.",
          icon: "Users"
        },
        {
          title: "CSR Tracking",
          description: "Track and showcase your corporate social responsibility initiatives.",
          icon: "Target"
        },
        {
          title: "Product Integration",
          description: "Connect your products to impact stories and social causes.",
          icon: "Shield"
        }
      ]
    },
    pricing: {
      title: "Pricing for Businesses",
      subtitle: "Professional tools for corporate storytelling and customer engagement.",
      plans: [
        {
          name: "Professional",
          price: "$99/month",
          description: "Perfect for small to medium businesses",
          features: ["Unlimited stories", "Customer management", "Email support"],
          cta: "Start Free Trial"
        },
        {
          name: "Enterprise",
          price: "$299/month",
          description: "For large corporations with complex needs",
          features: ["Advanced analytics", "Custom integrations", "Dedicated support"],
          cta: "Contact Sales"
        }
      ]
    },
    testimonials: {
      title: "Trusted by Businesses Worldwide",
      items: [
        {
          quote: "The NMBR helped us increase customer engagement by 60% through authentic storytelling.",
          author: "Jennifer Lee",
          role: "Marketing Director",
          organization: "EcoTech Solutions"
        },
        {
          quote: "Our customers love seeing the real impact of our products.",
          author: "Robert Martinez",
          role: "CEO",
          organization: "Sustainable Goods"
        }
      ]
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        {
          question: "How does this integrate with our existing marketing tools?",
          answer: "We integrate with popular marketing platforms like HubSpot, Salesforce, and Mailchimp."
        },
        {
          question: "Can we track ROI on our storytelling efforts?",
          answer: "Yes, we provide detailed analytics on engagement, conversions, and customer sentiment."
        }
      ]
    }
  }
}

// Helper functions for dynamic content
export const getContentByOrgType = (orgType: OrganizationType): ContentConfig => {
  return CONTENT_CONFIGS[orgType]
}

export const getTerminologyByOrgType = (orgType: OrganizationType) => {
  return ORGANIZATION_TYPES[orgType].terminology
}

export const getFeaturesByOrgType = (orgType: OrganizationType) => {
  return ORGANIZATION_TYPES[orgType].features
}

export const getIntegrationsByOrgType = (orgType: OrganizationType) => {
  return ORGANIZATION_TYPES[orgType].integrations
}

export const getComplianceByOrgType = (orgType: OrganizationType) => {
  return ORGANIZATION_TYPES[orgType].compliance
}

export const getDefaultSettingsByOrgType = (orgType: OrganizationType) => {
  return ORGANIZATION_TYPES[orgType].defaultSettings
}

// Content resolver for dynamic text replacement
export const resolveContent = (content: string, orgType: OrganizationType): string => {
  const terminology = getTerminologyByOrgType(orgType)
  
  // Replace common terms with org-type specific terminology
  return content
    .replace(/\bdonations\b/gi, terminology.donations)
    .replace(/\bsubscribers\b/gi, terminology.subscribers)
    .replace(/\bfundraising\b/gi, terminology.fundraising)
    .replace(/\bcampaigns\b/gi, terminology.campaigns)
    .replace(/\bsupporters\b/gi, terminology.supporters)
    .replace(/\bcommunity\b/gi, terminology.community)
    .replace(/\bprojects\b/gi, terminology.projects)
    .replace(/\bsales\b/gi, terminology.sales)
    .replace(/\bcustomers\b/gi, terminology.customers)
    .replace(/\bproducts\b/gi, terminology.products)
    .replace(/\bengagement\b/gi, terminology.engagement)
}

// Content caching system
const contentCache = new Map<OrganizationType, ContentConfig>()

export const getCachedContent = (orgType: OrganizationType): ContentConfig => {
  if (!contentCache.has(orgType)) {
    contentCache.set(orgType, getContentByOrgType(orgType))
  }
  return contentCache.get(orgType)!
}

export const clearContentCache = () => {
  contentCache.clear()
}

// Content versioning
export const CONTENT_VERSION = '1.0.0'

export const getContentVersion = (): string => {
  return CONTENT_VERSION
}
