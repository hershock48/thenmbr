-- Add branding columns to nonprofits table
ALTER TABLE nonprofits 
ADD COLUMN IF NOT EXISTS secondary_color VARCHAR(7) DEFAULT '#1e40af',
ADD COLUMN IF NOT EXISTS accent_color VARCHAR(7) DEFAULT '#60a5fa',
ADD COLUMN IF NOT EXISTS font_family VARCHAR(50) DEFAULT 'Inter',
ADD COLUMN IF NOT EXISTS show_powered_by BOOLEAN DEFAULT true;

-- Update existing records with default values
UPDATE nonprofits 
SET 
  secondary_color = COALESCE(secondary_color, '#1e40af'),
  accent_color = COALESCE(accent_color, '#60a5fa'),
  font_family = COALESCE(font_family, 'Inter'),
  show_powered_by = COALESCE(show_powered_by, true)
WHERE secondary_color IS NULL 
   OR accent_color IS NULL 
   OR font_family IS NULL 
   OR show_powered_by IS NULL;
