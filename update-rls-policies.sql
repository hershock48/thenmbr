-- Update RLS policies to allow service role to create organizations
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own organization" ON nonprofits;
DROP POLICY IF EXISTS "Users can update their own organization" ON nonprofits;
DROP POLICY IF EXISTS "Users can insert their own organization" ON nonprofits;

-- Create new policies that allow service role operations
CREATE POLICY "Users can view their own organization" ON nonprofits
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'org_id' = nonprofits.id::text
    )
  );

CREATE POLICY "Users can update their own organization" ON nonprofits
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'org_id' = nonprofits.id::text
    )
  );

CREATE POLICY "Service role can insert organizations" ON nonprofits
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update organizations" ON nonprofits
  FOR UPDATE USING (true);

-- Also allow the trigger function to work
GRANT USAGE ON SCHEMA public TO postgres;
GRANT ALL ON nonprofits TO postgres;

