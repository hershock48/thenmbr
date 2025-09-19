-- Add organization type to nonprofits table
-- This migration adds the org_type field to distinguish between nonprofits, grassroots, and businesses

ALTER TABLE nonprofits 
ADD COLUMN IF NOT EXISTS org_type VARCHAR(20) DEFAULT 'nonprofit' CHECK (org_type IN ('nonprofit', 'grassroots', 'business'));

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_nonprofits_org_type ON nonprofits(org_type);

-- Update existing records to have the default type
UPDATE nonprofits 
SET org_type = 'nonprofit' 
WHERE org_type IS NULL;
