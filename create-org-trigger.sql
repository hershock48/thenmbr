-- Create a function to handle user signup and organization creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  org_id UUID;
BEGIN
  -- Check if user has org_name in their metadata
  IF NEW.raw_user_meta_data->>'org_name' IS NOT NULL THEN
    -- Create organization
    INSERT INTO nonprofits (
      name,
      website,
      brand_color,
      created_at,
      updated_at
    ) VALUES (
      NEW.raw_user_meta_data->>'org_name',
      NEW.raw_user_meta_data->>'website',
      COALESCE(NEW.raw_user_meta_data->>'brand_color', '#3B82F6'),
      NOW(),
      NOW()
    ) RETURNING id INTO org_id;
    
    -- Update user metadata with org_id
    UPDATE auth.users 
    SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object('org_id', org_id)
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that fires when a new user is confirmed
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Also create a trigger for when user metadata is updated (in case of email confirmation)
CREATE OR REPLACE FUNCTION handle_user_metadata_update()
RETURNS TRIGGER AS $$
DECLARE
  org_id UUID;
BEGIN
  -- Check if org_name was added to metadata and org_id doesn't exist yet
  IF NEW.raw_user_meta_data->>'org_name' IS NOT NULL 
     AND NEW.raw_user_meta_data->>'org_id' IS NULL THEN
    -- Create organization
    INSERT INTO nonprofits (
      name,
      website,
      brand_color,
      created_at,
      updated_at
    ) VALUES (
      NEW.raw_user_meta_data->>'org_name',
      NEW.raw_user_meta_data->>'website',
      COALESCE(NEW.raw_user_meta_data->>'brand_color', '#3B82F6'),
      NOW(),
      NOW()
    ) RETURNING id INTO org_id;
    
    -- Update user metadata with org_id
    UPDATE auth.users 
    SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object('org_id', org_id)
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_user_metadata_update();
