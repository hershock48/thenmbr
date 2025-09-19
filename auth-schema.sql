-- Enhanced Authentication and Authorization Schema
-- This extends the existing database with user management and role-based access control

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'donor' CHECK (role IN ('super_admin', 'admin', 'org_admin', 'org_member', 'donor', 'guest')),
  organization_id UUID REFERENCES nonprofits(id) ON DELETE SET NULL,
  organization_role VARCHAR(100),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- User sessions table for tracking active sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  session_token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- User permissions table for granular permissions
CREATE TABLE IF NOT EXISTS user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  permission VARCHAR(100) NOT NULL,
  granted_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(user_id, permission)
);

-- Organization members table for managing org membership
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES nonprofits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
  invited_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(organization_id, user_id)
);

-- Audit log table for tracking user actions
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  organization_id UUID REFERENCES nonprofits(id) ON DELETE SET NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  preferences JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_organization_id ON user_profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON user_profiles(is_active);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_permission ON user_permissions(permission);
CREATE INDEX IF NOT EXISTS idx_user_permissions_is_active ON user_permissions(is_active);

CREATE INDEX IF NOT EXISTS idx_organization_members_org_id ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_is_active ON organization_members(is_active);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_organization_id ON audit_logs(organization_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() 
      AND up.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Org admins can view org members" ON user_profiles
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles
      WHERE id = auth.uid() 
      AND role IN ('org_admin', 'admin', 'super_admin')
    )
  );

-- User sessions policies
CREATE POLICY "Users can view their own sessions" ON user_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own sessions" ON user_sessions
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all sessions" ON user_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() 
      AND up.role IN ('admin', 'super_admin')
    )
  );

-- User permissions policies
CREATE POLICY "Users can view their own permissions" ON user_permissions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all permissions" ON user_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() 
      AND up.role IN ('admin', 'super_admin')
    )
  );

-- Organization members policies
CREATE POLICY "Users can view their own memberships" ON organization_members
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Org admins can view org members" ON organization_members
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles
      WHERE id = auth.uid() 
      AND role IN ('org_admin', 'admin', 'super_admin')
    )
  );

CREATE POLICY "Org admins can manage org members" ON organization_members
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles
      WHERE id = auth.uid() 
      AND role IN ('org_admin', 'admin', 'super_admin')
    )
  );

-- Audit logs policies
CREATE POLICY "Users can view their own audit logs" ON audit_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() 
      AND up.role IN ('admin', 'super_admin')
    )
  );

-- User preferences policies
CREATE POLICY "Users can manage their own preferences" ON user_preferences
  FOR ALL USING (user_id = auth.uid());

-- Functions for user management

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    organization_id
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'donor'),
    (NEW.raw_user_meta_data->>'organization_id')::UUID
  );
  
  -- Create user preferences
  INSERT INTO user_preferences (user_id) VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Function to update last login
CREATE OR REPLACE FUNCTION update_last_login(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE user_profiles 
  SET last_login_at = NOW(), updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check user permissions
CREATE OR REPLACE FUNCTION user_has_permission(user_id UUID, permission_name VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  user_role VARCHAR;
  has_permission BOOLEAN := FALSE;
BEGIN
  -- Get user role
  SELECT role INTO user_role FROM user_profiles WHERE id = user_id;
  
  -- Check role-based permissions
  CASE user_role
    WHEN 'super_admin' THEN has_permission := TRUE;
    WHEN 'admin' THEN has_permission := permission_name IN (
      'manage_users', 'view_users', 'manage_orgs', 'view_orgs', 'manage_org_members',
      'manage_stories', 'view_stories', 'manage_newsletters', 'view_newsletters',
      'send_newsletters', 'manage_subscribers', 'view_subscribers', 'export_subscribers',
      'manage_donations', 'view_donations', 'process_donations', 'view_analytics',
      'view_reports', 'export_data', 'view_logs', 'manage_settings'
    );
    WHEN 'org_admin' THEN has_permission := permission_name IN (
      'view_users', 'view_orgs', 'manage_org_members', 'manage_stories', 'view_stories',
      'create_stories', 'edit_stories', 'delete_stories', 'manage_newsletters',
      'view_newsletters', 'send_newsletters', 'manage_subscribers', 'view_subscribers',
      'export_subscribers', 'view_donations', 'view_analytics', 'view_reports', 'export_data'
    );
    WHEN 'org_member' THEN has_permission := permission_name IN (
      'view_stories', 'create_stories', 'edit_stories', 'view_newsletters',
      'view_subscribers', 'view_donations', 'view_analytics'
    );
    WHEN 'donor' THEN has_permission := permission_name IN (
      'view_stories', 'view_newsletters'
    );
    ELSE has_permission := FALSE;
  END CASE;
  
  -- Check additional user-specific permissions
  IF NOT has_permission THEN
    SELECT EXISTS(
      SELECT 1 FROM user_permissions 
      WHERE user_id = user_id 
      AND permission = permission_name 
      AND is_active = TRUE 
      AND (expires_at IS NULL OR expires_at > NOW())
    ) INTO has_permission;
  END IF;
  
  RETURN has_permission;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log user actions
CREATE OR REPLACE FUNCTION log_user_action(
  action_name VARCHAR,
  resource_type VARCHAR DEFAULT NULL,
  resource_id UUID DEFAULT NULL,
  details JSONB DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  current_user_id UUID;
  current_org_id UUID;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  
  -- Get user's organization ID
  SELECT organization_id INTO current_org_id 
  FROM user_profiles 
  WHERE id = current_user_id;
  
  -- Insert audit log
  INSERT INTO audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    organization_id,
    details
  ) VALUES (
    current_user_id,
    action_name,
    resource_type,
    resource_id,
    current_org_id,
    details
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS VOID AS $$
BEGIN
  DELETE FROM user_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a scheduled job to clean up expired sessions (if pg_cron is available)
-- SELECT cron.schedule('cleanup-sessions', '0 * * * *', 'SELECT cleanup_expired_sessions();');

-- Insert default super admin user (replace with actual admin email)
-- This should be done manually after the first admin user is created
-- INSERT INTO user_profiles (id, email, first_name, last_name, role, is_active)
-- VALUES ('00000000-0000-0000-0000-000000000000', 'admin@nmbr-platform.com', 'Super', 'Admin', 'super_admin', true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
