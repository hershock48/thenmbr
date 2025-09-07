-- Sample data for testing the NMBR Widget Platform

-- Insert sample nonprofit
INSERT INTO nonprofits (id, name, logo_url, brand_color, stripe_account_id) VALUES
('demo-org-123', 'Demo Nonprofit', 'https://via.placeholder.com/200x100/3B82F6/FFFFFF?text=Demo+Org', '#3B82F6', 'acct_demo123');

-- Insert sample stories
INSERT INTO stories (org_id, nmbr_code, title, description, photo_url) VALUES
('demo-org-123', 'STORY001', 'Help Local Families', 'Support families in need with essential supplies and resources during difficult times.', 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=Family+Support'),
('demo-org-123', 'STORY002', 'Education Initiative', 'Provide educational materials and programs to underserved communities.', 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Education'),
('demo-org-123', 'STORY003', 'Environmental Cleanup', 'Join our efforts to clean up local parks and waterways.', 'https://via.placeholder.com/400x300/059669/FFFFFF?text=Environment'),
('demo-org-123', 'STORY004', 'Animal Rescue', 'Help rescue and care for abandoned animals in our community.', 'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Animal+Rescue'),
('demo-org-123', 'STORY005', 'Community Garden', 'Support our community garden initiative to provide fresh food for families.', 'https://via.placeholder.com/400x300/DC2626/FFFFFF?text=Community+Garden');

-- Insert sample subscribers (optional for testing)
INSERT INTO subscribers (email, org_id, story_id) VALUES
('test@example.com', 'demo-org-123', (SELECT id FROM stories WHERE nmbr_code = 'STORY001' LIMIT 1)),
('subscriber@demo.org', 'demo-org-123', (SELECT id FROM stories WHERE nmbr_code = 'STORY002' LIMIT 1));

-- Insert sample donations (optional for testing)
INSERT INTO donations (org_id, story_id, amount, platform_fee, donor_email, status) VALUES
('demo-org-123', (SELECT id FROM stories WHERE nmbr_code = 'STORY001' LIMIT 1), 2500, 125, 'donor@example.com', 'succeeded'),
('demo-org-123', (SELECT id FROM stories WHERE nmbr_code = 'STORY002' LIMIT 1), 5000, 250, 'supporter@demo.org', 'succeeded');
