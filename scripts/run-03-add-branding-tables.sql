-- Advanced branding system for white-label customization

CREATE TABLE IF NOT EXISTS organization_branding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE UNIQUE,
  
  -- Color Settings
  primary_color VARCHAR(7) DEFAULT '#0891b2',
  secondary_color VARCHAR(7) DEFAULT '#f97316',
  accent_color VARCHAR(7) DEFAULT '#10b981',
  background_color VARCHAR(7) DEFAULT '#ffffff',
  text_color VARCHAR(7) DEFAULT '#1f2937',
  
  -- Typography
  font_family VARCHAR(100) DEFAULT 'Inter',
  heading_font VARCHAR(100) DEFAULT 'Inter',
  
  -- Assets
  logo_url VARCHAR(500),
  favicon_url VARCHAR(500),
  hero_image_url VARCHAR(500),
  
  -- Widget Styling
  widget_border_radius INTEGER DEFAULT 8,
  widget_shadow_intensity VARCHAR(20) DEFAULT 'medium',
  button_style VARCHAR(20) DEFAULT 'rounded',
  
  -- Custom CSS
  custom_css TEXT,
  
  -- White Label Options
  show_powered_by BOOLEAN DEFAULT TRUE,
  custom_footer_text TEXT,
  
  -- Email Branding
  email_header_color VARCHAR(7) DEFAULT '#0891b2',
  email_logo_url VARCHAR(500),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_organization_branding_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER organization_branding_updated_at_trigger
  BEFORE UPDATE ON organization_branding
  FOR EACH ROW
  EXECUTE FUNCTION update_organization_branding_updated_at();

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_organization_branding_organization_id ON organization_branding(organization_id);
