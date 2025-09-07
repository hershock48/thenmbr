-- Seed data for development and testing

-- Insert sample super admin
INSERT INTO super_admins (email, password_hash, first_name, last_name, role) VALUES
('admin@nmbr.com', '$2b$10$example_hash_here', 'NMBR', 'Admin', 'super_admin');

-- Insert sample organization
INSERT INTO organizations (name, slug, email, phone, website, primary_color, secondary_color) VALUES
('Hope Foundation', 'hope-foundation', 'contact@hopefoundation.org', '+1-555-0123', 'https://hopefoundation.org', '#2563eb', '#ffffff');

-- Get the organization ID for the sample org
-- Note: In a real implementation, you'd use the actual UUID from the previous insert
-- INSERT INTO users (organization_id, email, password_hash, first_name, last_name, role) VALUES
-- ((SELECT id FROM organizations WHERE slug = 'hope-foundation'), 'admin@hopefoundation.org', '$2b$10$example_hash_here', 'Jane', 'Smith', 'admin');

-- Sample NMBR codes
-- INSERT INTO nmbrs (organization_id, nmbr_code, title, story, goal_amount, created_by) VALUES
-- ((SELECT id FROM organizations WHERE slug = 'hope-foundation'), 'HOPE001', 'Clean Water for Village', 'This bracelet represents our mission to bring clean water to a remote village...', 5000.00, (SELECT id FROM users WHERE email = 'admin@hopefoundation.org'));
