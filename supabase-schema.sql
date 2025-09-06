
-- NMBR Widget Platform Database Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Nonprofits table
CREATE TABLE nonprofits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    brand_color VARCHAR(7) DEFAULT '#3B82F6',
    stripe_account_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stories table
CREATE TABLE stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES nonprofits(id) ON DELETE CASCADE,
    nmbr_code VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(org_id, nmbr_code)
);

-- Subscribers table
CREATE TABLE subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    org_id UUID NOT NULL REFERENCES nonprofits(id) ON DELETE CASCADE,
    story_id UUID REFERENCES stories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations table
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES nonprofits(id) ON DELETE CASCADE,
    story_id UUID REFERENCES stories(id) ON DELETE SET NULL,
    amount INTEGER NOT NULL, -- Amount in cents
    platform_fee INTEGER NOT NULL, -- Platform fee in cents
    donor_email VARCHAR(255),
    stripe_txn_id VARCHAR(255) UNIQUE,
    stripe_payment_intent_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_stories_org_nmbr ON stories(org_id, nmbr_code);
CREATE INDEX idx_subscribers_org ON subscribers(org_id);
CREATE INDEX idx_donations_org ON donations(org_id);
CREATE INDEX idx_donations_story ON donations(story_id);

-- RLS (Row Level Security) policies
ALTER TABLE nonprofits ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to nonprofits and stories (for widget)
CREATE POLICY "Allow public read access to nonprofits" ON nonprofits
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to stories" ON stories
    FOR SELECT USING (true);

-- Allow public insert for subscribers and donations
CREATE POLICY "Allow public insert for subscribers" ON subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert for donations" ON donations
    FOR INSERT WITH CHECK (true);

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_nonprofits_updated_at BEFORE UPDATE ON nonprofits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
