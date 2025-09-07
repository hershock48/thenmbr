-- Update existing organizations table with branding columns

-- Add branding columns to organizations table if they don't exist
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS secondary_color VARCHAR(7) DEFAULT '#f97316',
ADD COLUMN IF NOT EXISTS accent_color VARCHAR(7) DEFAULT '#10b981',
ADD COLUMN IF NOT EXISTS font_family VARCHAR(100) DEFAULT 'Inter',
ADD COLUMN IF NOT EXISTS show_powered_by BOOLEAN DEFAULT TRUE;

-- Update existing organizations with default branding values
UPDATE organizations 
SET 
  secondary_color = COALESCE(secondary_color, '#f97316'),
  accent_color = COALESCE(accent_color, '#10b981'),
  font_family = COALESCE(font_family, 'Inter'),
  show_powered_by = COALESCE(show_powered_by, TRUE)
WHERE secondary_color IS NULL OR accent_color IS NULL OR font_family IS NULL OR show_powered_by IS NULL;
