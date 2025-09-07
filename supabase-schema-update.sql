-- Add missing fields to nonprofits table
ALTER TABLE nonprofits ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE nonprofits ADD COLUMN IF NOT EXISTS secondary_color VARCHAR(7);
ALTER TABLE nonprofits ADD COLUMN IF NOT EXISTS accent_color VARCHAR(7);
ALTER TABLE nonprofits ADD COLUMN IF NOT EXISTS font_family VARCHAR(100);
ALTER TABLE nonprofits ADD COLUMN IF NOT EXISTS show_powered_by BOOLEAN DEFAULT true;

-- Add missing fields to stories table
ALTER TABLE stories ADD COLUMN IF NOT EXISTS goal_amount INTEGER;
ALTER TABLE stories ADD COLUMN IF NOT EXISTS current_amount INTEGER DEFAULT 0;
ALTER TABLE stories ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';

-- Update existing records
UPDATE nonprofits SET 
  website = 'https://example.org',
  secondary_color = '#1e40af',
  accent_color = '#60a5fa',
  font_family = 'Inter',
  show_powered_by = true
WHERE website IS NULL;
