-- Comprehensive Row Level Security (RLS) Policies
-- This file contains all RLS policies for the NMBR Platform database

-- Enable RLS on all tables
ALTER TABLE nonprofits ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Enable RLS on authentication tables (if they exist)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
        ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_sessions') THEN
        ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_permissions') THEN
        ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'organization_members') THEN
        ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
        ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_preferences') THEN
        ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Allow public read access to nonprofits" ON nonprofits;
DROP POLICY IF EXISTS "Allow public read access to stories" ON stories;
DROP POLICY IF EXISTS "Allow public insert for subscribers" ON subscribers;
DROP POLICY IF EXISTS "Allow public insert for donations" ON donations;

-- ==============================================
-- NONPROFITS TABLE POLICIES
-- ==============================================

-- Public read access for widget functionality
CREATE POLICY "Public can read nonprofits" ON nonprofits
    FOR SELECT USING (true);

-- Authenticated users can read all nonprofits
CREATE POLICY "Authenticated users can read nonprofits" ON nonprofits
    FOR SELECT USING (auth.role() = 'authenticated');

-- Organization admins can update their own organization
CREATE POLICY "Org admins can update their organization" ON nonprofits
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid() 
            AND up.organization_id = nonprofits.id
            AND up.role IN ('org_admin', 'admin', 'super_admin')
        )
    );

-- Admins can update any organization
CREATE POLICY "Admins can update any organization" ON nonprofits
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid() 
            AND up.role IN ('admin', 'super_admin')
        )
    );

-- Admins can create organizations
CREATE POLICY "Admins can create organizations" ON nonprofits
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid() 
            AND up.role IN ('admin', 'super_admin')
        )
    );

-- Admins can delete organizations
CREATE POLICY "Admins can delete organizations" ON nonprofits
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid() 
            AND up.role IN ('admin', 'super_admin')
        )
    );

-- ==============================================
-- STORIES TABLE POLICIES
-- ==============================================

-- Public read access for widget functionality
CREATE POLICY "Public can read stories" ON stories
    FOR SELECT USING (true);

-- Authenticated users can read all stories
CREATE POLICY "Authenticated users can read stories" ON stories
    FOR SELECT USING (auth.role() = 'authenticated');

-- Organization members can create stories for their organization
CREATE POLICY "Org members can create stories" ON stories
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid() 
            AND up.organization_id = stories.org_id
            AND up.role IN ('org_member', 'org_admin', 'admin', 'super_admin')
        )
    );

-- Organization members can update stories in their organization
CREATE POLICY "Org members can update their stories" ON stories
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid() 
            AND up.organization_id = stories.org_id
            AND up.role IN ('org_member', 'org_admin', 'admin', 'super_admin')
        )
    );

-- Organization admins can delete stories in their organization
CREATE POLICY "Org admins can delete their stories" ON stories
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid() 
            AND up.organization_id = stories.org_id
            AND up.role IN ('org_admin', 'admin', 'super_admin')
        )
    );

-- Admins can manage all stories
CREATE POLICY "Admins can manage all stories" ON stories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid() 
            AND up.role IN ('admin', 'super_admin')
        )
    );

-- ==============================================
-- SUBSCRIBERS TABLE POLICIES
-- ==============================================

-- Public can insert subscribers (for widget signup)
CREATE POLICY "Public can subscribe" ON subscribers
    FOR INSERT WITH CHECK (true);

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscribers
    FOR SELECT USING (
        email = (
            SELECT email FROM user_profiles 
            WHERE id = auth.uid()
        )
    );

-- Organization members can view subscribers for their organization
CREATE POLICY "Org members can view org subscribers" ON subscribers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid() 
            AND up.organization_id = subscribers.org_id
            AND up.role IN ('org_member', 'org_admin', 'admin', 'super_admin')
        )
    );

-- Organization admins can manage subscribers for their organization
CREATE POLICY "Org admins can manage org subscribers" ON subscribers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid() 
            AND up.organization_id = subscribers.org_id
            AND up.role IN ('org_admin', 'admin', 'super_admin')
        )
    );

-- Admins can manage all subscribers
CREATE POLICY "Admins can manage all subscribers" ON subscribers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid() 
            AND up.role IN ('admin', 'super_admin')
        )
    );

-- ==============================================
-- DONATIONS TABLE POLICIES
-- ==============================================

-- Public can insert donations (for widget donations)
CREATE POLICY "Public can donate" ON donations
    FOR INSERT WITH CHECK (true);

-- Users can view their own donations
CREATE POLICY "Users can view own donations" ON donations
    FOR SELECT USING (
        donor_email = (
            SELECT email FROM user_profiles 
            WHERE id = auth.uid()
        )
    );

-- Organization members can view donations for their organization
CREATE POLICY "Org members can view org donations" ON donations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid() 
            AND up.organization_id = donations.org_id
            AND up.role IN ('org_member', 'org_admin', 'admin', 'super_admin')
        )
    );

-- Organization admins can manage donations for their organization
CREATE POLICY "Org admins can manage org donations" ON donations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid() 
            AND up.organization_id = donations.org_id
            AND up.role IN ('org_admin', 'admin', 'super_admin')
        )
    );

-- Admins can manage all donations
CREATE POLICY "Admins can manage all donations" ON donations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid() 
            AND up.role IN ('admin', 'super_admin')
        )
    );

-- ==============================================
-- USER PROFILES TABLE POLICIES (if exists)
-- ==============================================

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
        -- Users can view their own profile
        CREATE POLICY "Users can view own profile" ON user_profiles
            FOR SELECT USING (auth.uid() = id);

        -- Users can update their own profile
        CREATE POLICY "Users can update own profile" ON user_profiles
            FOR UPDATE USING (auth.uid() = id);

        -- Admins can view all profiles
        CREATE POLICY "Admins can view all profiles" ON user_profiles
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM user_profiles up
                    WHERE up.id = auth.uid() 
                    AND up.role IN ('admin', 'super_admin')
                )
            );

        -- Org admins can view org members
        CREATE POLICY "Org admins can view org members" ON user_profiles
            FOR SELECT USING (
                organization_id IN (
                    SELECT organization_id FROM user_profiles
                    WHERE id = auth.uid() 
                    AND role IN ('org_admin', 'admin', 'super_admin')
                )
            );

        -- Admins can manage all profiles
        CREATE POLICY "Admins can manage all profiles" ON user_profiles
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM user_profiles up
                    WHERE up.id = auth.uid() 
                    AND up.role IN ('admin', 'super_admin')
                )
            );
    END IF;
END $$;

-- ==============================================
-- USER SESSIONS TABLE POLICIES (if exists)
-- ==============================================

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_sessions') THEN
        -- Users can view their own sessions
        CREATE POLICY "Users can view own sessions" ON user_sessions
            FOR SELECT USING (user_id = auth.uid());

        -- Users can delete their own sessions
        CREATE POLICY "Users can delete own sessions" ON user_sessions
            FOR DELETE USING (user_id = auth.uid());

        -- Admins can view all sessions
        CREATE POLICY "Admins can view all sessions" ON user_sessions
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM user_profiles up
                    WHERE up.id = auth.uid() 
                    AND up.role IN ('admin', 'super_admin')
                )
            );
    END IF;
END $$;

-- ==============================================
-- USER PERMISSIONS TABLE POLICIES (if exists)
-- ==============================================

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_permissions') THEN
        -- Users can view their own permissions
        CREATE POLICY "Users can view own permissions" ON user_permissions
            FOR SELECT USING (user_id = auth.uid());

        -- Admins can manage all permissions
        CREATE POLICY "Admins can manage all permissions" ON user_permissions
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM user_profiles up
                    WHERE up.id = auth.uid() 
                    AND up.role IN ('admin', 'super_admin')
                )
            );
    END IF;
END $$;

-- ==============================================
-- ORGANIZATION MEMBERS TABLE POLICIES (if exists)
-- ==============================================

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'organization_members') THEN
        -- Users can view their own memberships
        CREATE POLICY "Users can view own memberships" ON organization_members
            FOR SELECT USING (user_id = auth.uid());

        -- Org admins can view org members
        CREATE POLICY "Org admins can view org members" ON organization_members
            FOR SELECT USING (
                organization_id IN (
                    SELECT organization_id FROM user_profiles
                    WHERE id = auth.uid() 
                    AND role IN ('org_admin', 'admin', 'super_admin')
                )
            );

        -- Org admins can manage org members
        CREATE POLICY "Org admins can manage org members" ON organization_members
            FOR ALL USING (
                organization_id IN (
                    SELECT organization_id FROM user_profiles
                    WHERE id = auth.uid() 
                    AND role IN ('org_admin', 'admin', 'super_admin')
                )
            );
    END IF;
END $$;

-- ==============================================
-- AUDIT LOGS TABLE POLICIES (if exists)
-- ==============================================

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
        -- Users can view their own audit logs
        CREATE POLICY "Users can view own audit logs" ON audit_logs
            FOR SELECT USING (user_id = auth.uid());

        -- Admins can view all audit logs
        CREATE POLICY "Admins can view all audit logs" ON audit_logs
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM user_profiles up
                    WHERE up.id = auth.uid() 
                    AND up.role IN ('admin', 'super_admin')
                )
            );

        -- System can insert audit logs (for triggers)
        CREATE POLICY "System can insert audit logs" ON audit_logs
            FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- ==============================================
-- USER PREFERENCES TABLE POLICIES (if exists)
-- ==============================================

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_preferences') THEN
        -- Users can manage their own preferences
        CREATE POLICY "Users can manage own preferences" ON user_preferences
            FOR ALL USING (user_id = auth.uid());
    END IF;
END $$;

-- ==============================================
-- SECURITY FUNCTIONS
-- ==============================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = user_id 
        AND role IN ('admin', 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is org admin
CREATE OR REPLACE FUNCTION is_org_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = user_id 
        AND role IN ('org_admin', 'admin', 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can access organization
CREATE OR REPLACE FUNCTION can_access_organization(org_id UUID, user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    -- Super admins and admins can access all organizations
    IF is_admin(user_id) THEN
        RETURN TRUE;
    END IF;
    
    -- Check if user belongs to the organization
    RETURN EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = user_id 
        AND organization_id = org_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's organization ID
CREATE OR REPLACE FUNCTION get_user_organization_id(user_id UUID DEFAULT auth.uid())
RETURNS UUID AS $$
DECLARE
    org_id UUID;
BEGIN
    SELECT organization_id INTO org_id 
    FROM user_profiles 
    WHERE id = user_id;
    
    RETURN org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
    event_type VARCHAR,
    details JSONB DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    current_user_id UUID;
    current_org_id UUID;
BEGIN
    current_user_id := auth.uid();
    current_org_id := get_user_organization_id(current_user_id);
    
    INSERT INTO audit_logs (
        user_id,
        action,
        resource_type,
        organization_id,
        details
    ) VALUES (
        current_user_id,
        event_type,
        'security_event',
        current_org_id,
        details
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- SECURITY TRIGGERS
-- ==============================================

-- Trigger to log user profile changes
CREATE OR REPLACE FUNCTION log_profile_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (
            user_id,
            action,
            resource_type,
            resource_id,
            details
        ) VALUES (
            NEW.id,
            'profile_updated',
            'user_profile',
            NEW.id,
            jsonb_build_object(
                'old_values', to_jsonb(OLD),
                'new_values', to_jsonb(NEW)
            )
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply trigger to user_profiles if table exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
        DROP TRIGGER IF EXISTS profile_changes_trigger ON user_profiles;
        CREATE TRIGGER profile_changes_trigger
            AFTER UPDATE ON user_profiles
            FOR EACH ROW EXECUTE FUNCTION log_profile_changes();
    END IF;
END $$;

-- ==============================================
-- SECURITY VIEWS
-- ==============================================

-- View for organization statistics (accessible to org members)
CREATE OR REPLACE VIEW organization_stats AS
SELECT 
    n.id as organization_id,
    n.name as organization_name,
    COUNT(DISTINCT s.id) as story_count,
    COUNT(DISTINCT sub.id) as subscriber_count,
    COUNT(DISTINCT d.id) as donation_count,
    COALESCE(SUM(d.amount), 0) as total_donations,
    COALESCE(SUM(d.platform_fee), 0) as total_platform_fees
FROM nonprofits n
LEFT JOIN stories s ON s.org_id = n.id
LEFT JOIN subscribers sub ON sub.org_id = n.id
LEFT JOIN donations d ON d.org_id = n.id
GROUP BY n.id, n.name;

-- Grant access to organization stats
GRANT SELECT ON organization_stats TO authenticated;

-- ==============================================
-- SECURITY MONITORING
-- ==============================================

-- Function to check for suspicious activity
CREATE OR REPLACE FUNCTION check_suspicious_activity()
RETURNS TABLE (
    user_id UUID,
    event_count BIGINT,
    last_event TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        al.user_id,
        COUNT(*) as event_count,
        MAX(al.created_at) as last_event
    FROM audit_logs al
    WHERE al.created_at > NOW() - INTERVAL '1 hour'
    GROUP BY al.user_id
    HAVING COUNT(*) > 100  -- More than 100 events in 1 hour
    ORDER BY event_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- FINAL SECURITY SETTINGS
-- ==============================================

-- Set default privileges for new tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO authenticated;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Create security monitoring view
CREATE OR REPLACE VIEW security_monitoring AS
SELECT 
    'failed_logins' as event_type,
    COUNT(*) as count,
    MAX(created_at) as last_occurrence
FROM audit_logs 
WHERE action = 'login_failed' 
AND created_at > NOW() - INTERVAL '24 hours'

UNION ALL

SELECT 
    'permission_denied' as event_type,
    COUNT(*) as count,
    MAX(created_at) as last_occurrence
FROM audit_logs 
WHERE action = 'permission_denied' 
AND created_at > NOW() - INTERVAL '24 hours'

UNION ALL

SELECT 
    'suspicious_activity' as event_type,
    COUNT(*) as count,
    MAX(created_at) as last_occurrence
FROM audit_logs 
WHERE action LIKE '%suspicious%' 
AND created_at > NOW() - INTERVAL '24 hours';

-- Grant access to security monitoring
GRANT SELECT ON security_monitoring TO authenticated;

-- Final security audit
DO $$
DECLARE
    table_name TEXT;
    policy_count INTEGER;
BEGIN
    -- Check that all tables have RLS enabled
    FOR table_name IN 
        SELECT schemaname||'.'||tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT LIKE 'pg_%'
    LOOP
        IF NOT EXISTS (
            SELECT 1 FROM pg_class 
            WHERE relname = split_part(table_name, '.', 2)
            AND relrowsecurity = true
        ) THEN
            RAISE WARNING 'Table % does not have RLS enabled', table_name;
        END IF;
    END LOOP;
    
    -- Count policies
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE schemaname = 'public';
    
    RAISE NOTICE 'RLS setup complete. Total policies created: %', policy_count;
END $$;
