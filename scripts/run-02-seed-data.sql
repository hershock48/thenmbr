-- Basic seed data for development and testing

-- Insert super admin user
INSERT INTO super_admins (email, password_hash, first_name, last_name)
VALUES ('admin@nmbr.com', '$2b$10$example_hash_here', 'NMBR', 'Admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample organization
INSERT INTO organizations (name, slug, description, website_url, logo_url)
VALUES (
  'Hope Foundation',
  'hope-foundation',
  'Bringing hope and clean water to communities in need around the world.',
  'https://hopefoundation.org',
  '/hope-foundation-logo.jpg'
) ON CONFLICT (slug) DO NOTHING;

-- Note: Additional user and NMBR data can be added here as needed
-- Template for adding users:
-- INSERT INTO users (organization_id, email, password_hash, first_name, last_name, role)
-- SELECT id, 'user@hopefoundation.org', '$2b$10$example_hash', 'John', 'Doe', 'admin'
-- FROM organizations WHERE slug = 'hope-foundation';
