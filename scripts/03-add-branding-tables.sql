-- Add branding settings table for multi-tenant customization
CREATE TABLE IF NOT EXISTS organization_branding (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Color Settings
    primary_color VARCHAR(7) DEFAULT '#3b82f6',
    secondary_color VARCHAR(7) DEFAULT '#64748b', 
    accent_color VARCHAR(7) DEFAULT '#10b981',
    background_color VARCHAR(7) DEFAULT '#ffffff',
    text_color VARCHAR(7) DEFAULT '#1f2937',
    
    -- Typography
    heading_font VARCHAR(50) DEFAULT 'Inter',
    body_font VARCHAR(50) DEFAULT 'Inter',
    font_size VARCHAR(20) DEFAULT 'medium',
    
    -- Assets
    logo_url TEXT,
    favicon_url TEXT,
    background_image_url TEXT,
    
    -- Widget Styling
    widget_style VARCHAR(20) DEFAULT 'modern',
    border_radius VARCHAR(20) DEFAULT 'medium',
    shadow VARCHAR(20) DEFAULT 'medium',
    
    -- Advanced Options
    custom_css TEXT,
    custom_domain VARCHAR(255),
    white_label BOOLEAN DEFAULT FALSE,
    
    -- Email Branding
    email_header_color VARCHAR(7) DEFAULT '#3b82f6',
    email_footer_text TEXT DEFAULT '© 2024 Organization. All rights reserved.',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(organization_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_organization_branding_org_id ON organization_branding(organization_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_branding_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organization_branding_updated_at
    BEFORE UPDATE ON organization_branding
    FOR EACH ROW
    EXECUTE FUNCTION update_branding_updated_at();

-- Insert default branding for existing organizations
INSERT INTO organization_branding (organization_id, primary_color, secondary_color)
SELECT id, '#3b82f6', '#64748b' 
FROM organizations 
WHERE id NOT IN (SELECT organization_id FROM organization_branding);
