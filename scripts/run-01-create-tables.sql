-- Execute the main schema creation script
-- This creates all core tables for the NMBR platform

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  website_url VARCHAR(500),
  logo_url VARCHAR(500),
  stripe_account_id VARCHAR(255),
  stripe_account_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (nonprofit staff)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NMBR codes table
CREATE TABLE IF NOT EXISTS nmbrs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  code VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  story TEXT NOT NULL,
  image_url VARCHAR(500),
  goal_amount DECIMAL(10,2),
  raised_amount DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nmbr_id UUID REFERENCES nmbrs(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(nmbr_id, email)
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nmbr_id UUID REFERENCES nmbrs(id) ON DELETE CASCADE,
  subscriber_id UUID REFERENCES subscribers(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  donor_email VARCHAR(255),
  donor_first_name VARCHAR(100),
  donor_last_name VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Super admins table (NMBR company staff)
CREATE TABLE IF NOT EXISTS super_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_nmbrs_organization_id ON nmbrs(organization_id);
CREATE INDEX IF NOT EXISTS idx_nmbrs_code ON nmbrs(code);
CREATE INDEX IF NOT EXISTS idx_subscribers_nmbr_id ON subscribers(nmbr_id);
CREATE INDEX IF NOT EXISTS idx_donations_nmbr_id ON donations(nmbr_id);
CREATE INDEX IF NOT EXISTS idx_donations_stripe_payment_intent_id ON donations(stripe_payment_intent_id);
