-- Team-Based Fundraiser Schema
-- For YOTERA x Be A Number Uganda Trip 2025

-- Teams table (represents a group trip/campaign)
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES nonprofits(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    goal_cents INTEGER DEFAULT 0,
    start_at TIMESTAMP WITH TIME ZONE,
    end_at TIMESTAMP WITH TIME ZONE,
    visibility VARCHAR(50) DEFAULT 'public',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fundraisers table (individual student pages)
CREATE TABLE IF NOT EXISTS fundraisers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID, -- Reference to users table (if you have one)
    nmbr_code VARCHAR(50) UNIQUE NOT NULL,
    handle VARCHAR(255) UNIQUE NOT NULL,
    goal_cents INTEGER DEFAULT 0,
    page_title VARCHAR(255) NOT NULL,
    page_subtitle VARCHAR(500),
    story TEXT,
    hero_url TEXT,
    status VARCHAR(50) DEFAULT 'draft', -- draft, approved, live, archived
    qr_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update donations to support fundraisers
ALTER TABLE donations ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE SET NULL;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS fundraiser_id UUID REFERENCES fundraisers(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_teams_org ON teams(org_id);
CREATE INDEX IF NOT EXISTS idx_teams_slug ON teams(slug);
CREATE INDEX IF NOT EXISTS idx_fundraisers_team ON fundraisers(team_id);
CREATE INDEX IF NOT EXISTS idx_fundraisers_nmbr ON fundraisers(nmbr_code);
CREATE INDEX IF NOT EXISTS idx_fundraisers_handle ON fundraisers(handle);
CREATE INDEX IF NOT EXISTS idx_donations_team ON donations(team_id);
CREATE INDEX IF NOT EXISTS idx_donations_fundraiser ON donations(fundraiser_id);

-- RLS Policies
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE fundraisers ENABLE ROW LEVEL SECURITY;

-- Allow public read access to teams and fundraisers
CREATE POLICY "Allow public read access to teams" ON teams
    FOR SELECT USING (visibility = 'public' OR true);

CREATE POLICY "Allow public read access to fundraisers" ON fundraisers
    FOR SELECT USING (status = 'live' OR true);

-- Allow public insert for donations linked to fundraisers
CREATE POLICY "Allow public insert for donations via fundraisers" ON donations
    FOR INSERT WITH CHECK (true);

-- Triggers for updated_at
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fundraisers_updated_at BEFORE UPDATE ON fundraisers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

