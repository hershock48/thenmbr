-- Migration script to add multi-tenant support to existing database
-- This script adds organization type support and migrates existing data

-- Step 1: Create new organizations table with multi-tenant support
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  website TEXT,
  email TEXT NOT NULL,
  organization_type TEXT NOT NULL CHECK (organization_type IN ('nonprofit', 'grassroots', 'business')),
  logo_url TEXT,
  brand_color TEXT NOT NULL DEFAULT '#3B82F6',
  secondary_color TEXT,
  accent_color TEXT,
  font_family TEXT,
  show_powered_by BOOLEAN DEFAULT true,
  stripe_account_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Migrate existing nonprofits data to organizations table
INSERT INTO organizations (
  id,
  name,
  website,
  email,
  organization_type,
  logo_url,
  brand_color,
  secondary_color,
  accent_color,
  font_family,
  show_powered_by,
  stripe_account_id,
  created_at,
  updated_at
)
SELECT 
  id,
  name,
  website,
  COALESCE(email, 'admin@' || LOWER(REPLACE(name, ' ', '')) || '.org') as email,
  'nonprofit' as organization_type,
  logo_url,
  brand_color,
  secondary_color,
  accent_color,
  font_family,
  show_powered_by,
  stripe_account_id,
  created_at,
  updated_at
FROM nonprofits
WHERE NOT EXISTS (
  SELECT 1 FROM organizations WHERE organizations.id = nonprofits.id
);

-- Step 3: Update foreign key references
-- Update stories table to reference organizations instead of nonprofits
ALTER TABLE stories 
DROP CONSTRAINT IF EXISTS stories_org_id_fkey;

ALTER TABLE stories 
ADD CONSTRAINT stories_org_id_fkey 
FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE;

-- Update subscribers table
ALTER TABLE subscribers 
DROP CONSTRAINT IF EXISTS subscribers_org_id_fkey;

ALTER TABLE subscribers 
ADD CONSTRAINT subscribers_org_id_fkey 
FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE;

-- Update donations table
ALTER TABLE donations 
DROP CONSTRAINT IF EXISTS donations_org_id_fkey;

ALTER TABLE donations 
ADD CONSTRAINT donations_org_id_fkey 
FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE;

-- Step 4: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_organizations_type ON organizations(organization_type);
CREATE INDEX IF NOT EXISTS idx_organizations_email ON organizations(email);
CREATE INDEX IF NOT EXISTS idx_organizations_created_at ON organizations(created_at);

-- Step 5: Create RLS policies for organizations table
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Policy for users to see their own organizations
CREATE POLICY "Users can view their own organizations" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT org_id FROM user_organizations 
      WHERE user_id = auth.uid()
    )
  );

-- Policy for users to update their own organizations
CREATE POLICY "Users can update their own organizations" ON organizations
  FOR UPDATE USING (
    id IN (
      SELECT org_id FROM user_organizations 
      WHERE user_id = auth.uid()
    )
  );

-- Policy for users to insert organizations (for signup)
CREATE POLICY "Users can insert organizations" ON organizations
  FOR INSERT WITH CHECK (true);

-- Step 6: Create user_organizations junction table for multi-org support
CREATE TABLE IF NOT EXISTS user_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, org_id)
);

-- Enable RLS for user_organizations
ALTER TABLE user_organizations ENABLE ROW LEVEL SECURITY;

-- Policy for users to see their organization memberships
CREATE POLICY "Users can view their organization memberships" ON user_organizations
  FOR SELECT USING (user_id = auth.uid());

-- Policy for users to insert organization memberships
CREATE POLICY "Users can insert organization memberships" ON user_organizations
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Step 7: Create functions for organization type management
CREATE OR REPLACE FUNCTION get_organization_type(org_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT organization_type 
    FROM organizations 
    WHERE id = org_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_organization_terminology(org_id UUID)
RETURNS JSONB AS $$
DECLARE
  org_type TEXT;
  terminology JSONB;
BEGIN
  org_type := get_organization_type(org_id);
  
  CASE org_type
    WHEN 'nonprofit' THEN
      terminology := '{
        "donations": "Donations",
        "subscribers": "Donors",
        "fundraising": "Fundraising",
        "campaigns": "Campaigns",
        "supporters": "Supporters",
        "community": "Community",
        "projects": "Projects",
        "sales": "Donations",
        "customers": "Donors",
        "products": "Causes",
        "engagement": "Engagement"
      }'::jsonb;
    WHEN 'grassroots' THEN
      terminology := '{
        "donations": "Support",
        "subscribers": "Supporters",
        "fundraising": "Community Funding",
        "campaigns": "Projects",
        "supporters": "Supporters",
        "community": "Community",
        "projects": "Projects",
        "sales": "Support",
        "customers": "Supporters",
        "products": "Projects",
        "engagement": "Community Engagement"
      }'::jsonb;
    WHEN 'business' THEN
      terminology := '{
        "donations": "Sales",
        "subscribers": "Customers",
        "fundraising": "Engagement",
        "campaigns": "Campaigns",
        "supporters": "Customers",
        "community": "Community",
        "projects": "Initiatives",
        "sales": "Sales",
        "customers": "Customers",
        "products": "Products",
        "engagement": "Customer Engagement"
      }'::jsonb;
    ELSE
      terminology := '{}'::jsonb;
  END CASE;
  
  RETURN terminology;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 8: Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 9: Create views for backward compatibility
CREATE OR REPLACE VIEW nonprofits AS
SELECT 
  id,
  name,
  website,
  email,
  logo_url,
  brand_color,
  secondary_color,
  accent_color,
  font_family,
  show_powered_by,
  stripe_account_id,
  created_at,
  updated_at
FROM organizations
WHERE organization_type = 'nonprofit';

-- Step 10: Add comments for documentation
COMMENT ON TABLE organizations IS 'Multi-tenant organizations table supporting nonprofits, grassroots, and businesses';
COMMENT ON COLUMN organizations.organization_type IS 'Type of organization: nonprofit, grassroots, or business';
COMMENT ON COLUMN organizations.metadata IS 'Type-specific metadata stored as JSONB';
COMMENT ON TABLE user_organizations IS 'Junction table for user-organization relationships with roles';
COMMENT ON FUNCTION get_organization_type(UUID) IS 'Returns the organization type for a given organization ID';
COMMENT ON FUNCTION get_organization_terminology(UUID) IS 'Returns terminology mapping for a given organization ID';

-- Step 11: Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON organizations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_organizations TO authenticated;
GRANT EXECUTE ON FUNCTION get_organization_type(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_organization_terminology(UUID) TO authenticated;

-- Step 12: Create sample data for testing (optional)
-- This can be removed in production
INSERT INTO organizations (name, email, organization_type, brand_color, metadata)
VALUES 
  ('Sample Nonprofit', 'admin@samplenonprofit.org', 'nonprofit', '#3B82F6', '{"ein": "12-3456789", "tax_exempt_status": true}'),
  ('Community Project', 'admin@communityproject.org', 'grassroots', '#10B981', '{"community_focus": "Environmental", "fiscal_sponsor": "The NMBR"}'),
  ('Impact Business', 'admin@impactbusiness.com', 'business', '#8B5CF6', '{"industry": "Technology", "business_registration": "LLC"})
ON CONFLICT (id) DO NOTHING;

-- Migration complete
SELECT 'Multi-tenant migration completed successfully' as status;
