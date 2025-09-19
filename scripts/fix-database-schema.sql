-- Fix database schema issues
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

-- Update existing demo records
UPDATE nonprofits SET 
  website = 'https://beanumber.org',
  secondary_color = '#1e40af',
  accent_color = '#60a5fa',
  font_family = 'Inter',
  show_powered_by = true
WHERE id = 'demo-org-123';

-- Add demo stories with proper data
INSERT INTO stories (id, org_id, nmbr_code, title, description, photo_url, goal_amount, current_amount, status) VALUES
('story-1', 'demo-org-123', '1', 'Clean Water for Maria', 'Maria lives in a remote village where clean water is scarce. Your support helps provide her family with access to safe, clean drinking water through our community well project.', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400', 5000, 3200, 'active'),
('story-2', 'demo-org-123', '2', 'Education for Ahmed', 'Ahmed dreams of becoming a doctor to help his community. Your sponsorship provides him with school supplies, books, and educational support to make his dream a reality.', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400', 3000, 1800, 'active'),
('story-3', 'demo-org-123', '3', 'Medical Care for Sarah', 'Sarah needs ongoing medical treatment for a chronic condition. Your donation helps cover her medication costs and regular check-ups with local healthcare providers.', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400', 4000, 2500, 'active')
ON CONFLICT (org_id, nmbr_code) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  photo_url = EXCLUDED.photo_url,
  goal_amount = EXCLUDED.goal_amount,
  current_amount = EXCLUDED.current_amount,
  status = EXCLUDED.status;
