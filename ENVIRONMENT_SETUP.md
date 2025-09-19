# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

OPENAI_API_KEY=sk-your-openai-key-here

# Email Service Configuration
RESEND_API_KEY=re_your-resend-key-here

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key-here
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key-here
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
\`\`\`

## Setup Instructions

### 1. Supabase Setup
1. Go to https://supabase.com
2. Create a new project
3. Copy the project URL and anon key from Settings > API
4. Copy the service role key from Settings > API (keep this secret!)

### 2. OpenAI Setup
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key (starts with `sk-`)

### 3. Resend Setup
1. Go to https://resend.com
2. Sign up and verify your domain
3. Create an API key
4. Copy the key (starts with `re_`)

### 4. Stripe Setup
1. Go to https://stripe.com
2. Create an account and get your API keys
3. Set up webhooks for payment processing

## Database Schema

Run these SQL commands in your Supabase SQL editor:

\`\`\`sql
-- Organizations table
CREATE TABLE organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  organization_type TEXT NOT NULL CHECK (organization_type IN ('nonprofit', 'grassroots', 'business')),
  industry TEXT,
  ein_number TEXT,
  tax_exempt_status BOOLEAN DEFAULT false,
  fiscal_sponsor TEXT,
  business_registration TEXT,
  csr_focus_areas TEXT[],
  logo_url TEXT,
  brand_color TEXT DEFAULT '#2563eb',
  secondary_color TEXT,
  accent_color TEXT,
  font_family TEXT,
  show_powered_by BOOLEAN DEFAULT true,
  stripe_account_id TEXT,
  website TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stories table
CREATE TABLE stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  nmbr_code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  goal_amount DECIMAL(10,2) DEFAULT 0,
  current_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscribers table
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Newsletters table
CREATE TABLE newsletters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  content JSONB,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

## Testing the Setup

After setting up the environment variables:

1. Run `npm run dev`
2. Check the browser console for any configuration errors
3. Test the signup flow
4. Test the AI Review feature
5. Test email sending

## Troubleshooting

- **Supabase errors**: Check that your URL and keys are correct
- **OpenAI errors**: Verify your API key has sufficient credits
- **Resend errors**: Check that your domain is verified
- **Stripe errors**: Ensure you're using test keys in development
