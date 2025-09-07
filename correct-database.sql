-- NMBR Platform Database Schema - CORRECT VERSION
-- This matches exactly what the application code expects

-- Drop existing tables if they exist (to start fresh)
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS subscribers CASCADE;
DROP TABLE IF EXISTS nmbrs CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS nonprofits CASCADE;

-- Create nonprofits table (as expected by the code)
CREATE TABLE nonprofits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    brand_color VARCHAR(7) DEFAULT '#3B82F6',
    stripe_account_id VARCHAR(255),
    stripe_connected BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table for Supabase auth integration
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create nmbrs table (bracelet codes with stories)
CREATE TABLE nmbrs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nonprofit_id UUID REFERENCES nonprofits(id) ON DELETE CASCADE,
    code VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    story TEXT NOT NULL,
    image_url VARCHAR(500),
    goal_amount DECIMAL(10,2),
    raised_amount DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscribers table (with correct column names)
CREATE TABLE subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    org_id UUID REFERENCES nonprofits(id) ON DELETE CASCADE,
    story_id UUID REFERENCES nmbrs(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(org_id, email)
);

-- Create donations table
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nmbr_id UUID REFERENCES nmbrs(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    donor_email VARCHAR(255),
    donor_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    stripe_payment_intent_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_nonprofits_name ON nonprofits(name);
CREATE INDEX idx_nmbrs_nonprofit_id ON nmbrs(nonprofit_id);
CREATE INDEX idx_nmbrs_code ON nmbrs(code);
CREATE INDEX idx_subscribers_org_id ON subscribers(org_id);
CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_donations_nmbr_id ON donations(nmbr_id);

-- Enable Row Level Security (RLS)
ALTER TABLE nonprofits ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE nmbrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (allow all for now - you can tighten these later)
CREATE POLICY "Allow all operations on nonprofits" ON nonprofits FOR ALL USING (true);
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on nmbrs" ON nmbrs FOR ALL USING (true);
CREATE POLICY "Allow all operations on subscribers" ON subscribers FOR ALL USING (true);
CREATE POLICY "Allow all operations on donations" ON donations FOR ALL USING (true);

