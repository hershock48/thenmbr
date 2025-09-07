-- Additional demo data for testing and development

-- Get the Hope Foundation organization ID
DO $$
DECLARE
  hope_org_id UUID;
  hope_user_id UUID;
  water_nmbr_id UUID;
  education_nmbr_id UUID;
  medical_nmbr_id UUID;
BEGIN
  -- Get organization ID
  SELECT id INTO hope_org_id FROM organizations WHERE slug = 'hope-foundation';
  
  IF hope_org_id IS NOT NULL THEN
    -- Insert demo user
    INSERT INTO users (organization_id, email, password_hash, first_name, last_name, role)
    VALUES (hope_org_id, 'demo@hopefoundation.org', '$2b$10$demo_hash_here', 'Demo', 'User', 'admin')
    ON CONFLICT (email) DO NOTHING
    RETURNING id INTO hope_user_id;
    
    -- Insert sample NMBR stories
    INSERT INTO nmbrs (organization_id, code, title, story, image_url, goal_amount, raised_amount, is_active)
    VALUES 
      (hope_org_id, 'WATER001', 'Clean Water for Village', 'This NMBR represents our mission to bring clean, safe drinking water to remote villages. Each bracelet helps fund well construction and water purification systems.', '/water-well-village.jpg', 5000.00, 2350.00, true),
      (hope_org_id, 'EDU002', 'School Books for Children', 'Education is the key to breaking the cycle of poverty. This NMBR funds textbooks, supplies, and educational materials for children in underserved communities.', '/school-children-books.jpg', 3000.00, 1200.00, true),
      (hope_org_id, 'MED003', 'Medical Equipment for Clinic', 'Essential medical equipment saves lives. This NMBR helps purchase vital medical supplies and equipment for rural health clinics.', '/medical-equipment-clinic.jpg', 8000.00, 4500.00, true)
    ON CONFLICT (code) DO NOTHING
    RETURNING id INTO water_nmbr_id;
    
    -- Insert sample subscribers and donations (optional)
    -- This would typically be done through the application, not directly in SQL
  END IF;
END $$;
