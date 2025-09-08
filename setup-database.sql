-- NMBR Platform Database Schema
-- Simplified version that matches the application code

-- Create nonprofits table (as expected by the code)
CREATE TABLE IF NOT EXISTS nonprofits (
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
CREATE TABLE IF NOT EXISTS users (
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
CREATE TABLE IF NOT EXISTS nmbrs (
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

-- Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nmbr_id UUID REFERENCES nmbrs(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(nmbr_id, email)
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
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
CREATE INDEX IF NOT EXISTS idx_nonprofits_name ON nonprofits(name);
CREATE INDEX IF NOT EXISTS idx_nmbrs_nonprofit_id ON nmbrs(nonprofit_id);
CREATE INDEX IF NOT EXISTS idx_nmbrs_code ON nmbrs(code);
CREATE INDEX IF NOT EXISTS idx_subscribers_nmbr_id ON subscribers(nmbr_id);
CREATE INDEX IF NOT EXISTS idx_donations_nmbr_id ON donations(nmbr_id);

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
