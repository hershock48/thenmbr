-- Subscription Management Schema for NMBR Platform
-- This works with your existing database structure (nonprofits, stories tables)

-- First, let's add missing columns to existing tables if they don't exist
ALTER TABLE stories ADD COLUMN IF NOT EXISTS goal_amount DECIMAL(10,2) DEFAULT 1000;
ALTER TABLE stories ADD COLUMN IF NOT EXISTS current_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE stories ADD COLUMN IF NOT EXISTS subscribers INTEGER DEFAULT 0;
ALTER TABLE stories ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';

-- Update existing subscribers table to work with our new system
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'widget';
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS last_engagement_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS total_donations INTEGER DEFAULT 0;
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS total_donated_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create NMBR Subscriptions table - tracks which stories each subscriber follows
CREATE TABLE IF NOT EXISTS nmbr_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_email_sent_at TIMESTAMP WITH TIME ZONE,
  email_frequency VARCHAR(20) DEFAULT 'weekly', -- 'daily', 'weekly', 'monthly'
  engagement_score INTEGER DEFAULT 0, -- Track how engaged they are
  
  -- Ensure unique subscription per subscriber per story
  UNIQUE(subscriber_id, story_id)
);

-- Email Campaigns table - track email sends
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES nonprofits(id) ON DELETE CASCADE,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  campaign_type VARCHAR(50) NOT NULL, -- 'story_update', 'milestone', 'completion', 'general'
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'scheduled', 'sending', 'sent', 'failed'
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  total_recipients INTEGER DEFAULT 0,
  total_sent INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  total_donated INTEGER DEFAULT 0,
  total_donation_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Events table - track individual email interactions
CREATE TABLE IF NOT EXISTS email_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES email_campaigns(id) ON DELETE CASCADE,
  subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'unsubscribed'
  event_data JSONB, -- Store additional event data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscribers_org_email ON subscribers(org_id, email);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(status);
CREATE INDEX IF NOT EXISTS idx_nmbr_subscriptions_subscriber ON nmbr_subscriptions(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_nmbr_subscriptions_story ON nmbr_subscriptions(story_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_org ON email_campaigns(org_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_story ON email_campaigns(story_id);
CREATE INDEX IF NOT EXISTS idx_email_events_campaign ON email_events(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_events_subscriber ON email_events(subscriber_id);

-- RLS Policies
ALTER TABLE nmbr_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;

-- NMBR Subscriptions policies
CREATE POLICY "Nonprofits can view their nmbr subscriptions" ON nmbr_subscriptions
  FOR SELECT USING (subscriber_id IN (
    SELECT id FROM subscribers WHERE org_id IN (
      SELECT id FROM nonprofits WHERE id = org_id
    )
  ));

CREATE POLICY "Nonprofits can manage their nmbr subscriptions" ON nmbr_subscriptions
  FOR ALL USING (subscriber_id IN (
    SELECT id FROM subscribers WHERE org_id IN (
      SELECT id FROM nonprofits WHERE id = org_id
    )
  ));

-- Email Campaigns policies
CREATE POLICY "Nonprofits can view their email campaigns" ON email_campaigns
  FOR SELECT USING (org_id IN (
    SELECT id FROM nonprofits WHERE id = org_id
  ));

CREATE POLICY "Nonprofits can manage their email campaigns" ON email_campaigns
  FOR ALL USING (org_id IN (
    SELECT id FROM nonprofits WHERE id = org_id
  ));

-- Email Events policies
CREATE POLICY "Nonprofits can view their email events" ON email_events
  FOR SELECT USING (campaign_id IN (
    SELECT id FROM email_campaigns WHERE org_id IN (
      SELECT id FROM nonprofits WHERE id = org_id
    )
  ));

-- Functions for analytics
CREATE OR REPLACE FUNCTION get_subscriber_stats(org_uuid UUID)
RETURNS TABLE (
  total_subscribers BIGINT,
  active_subscribers BIGINT,
  total_story_subscriptions BIGINT,
  avg_engagement_score NUMERIC,
  total_donations BIGINT,
  total_donation_amount NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(s.id) as total_subscribers,
    COUNT(CASE WHEN s.status = 'active' THEN 1 END) as active_subscribers,
    COUNT(ns.id) as total_story_subscriptions,
    AVG(ns.engagement_score) as avg_engagement_score,
    COUNT(CASE WHEN s.total_donations > 0 THEN 1 END) as total_donations,
    COALESCE(SUM(s.total_donated_amount), 0) as total_donation_amount
  FROM subscribers s
  LEFT JOIN nmbr_subscriptions ns ON s.id = ns.subscriber_id
  WHERE s.org_id = org_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to get story-specific subscriber stats
CREATE OR REPLACE FUNCTION get_story_subscriber_stats(story_uuid UUID)
RETURNS TABLE (
  total_subscribers BIGINT,
  active_subscribers BIGINT,
  avg_engagement_score NUMERIC,
  donations_from_subscribers BIGINT,
  donation_amount_from_subscribers NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(ns.id) as total_subscribers,
    COUNT(CASE WHEN s.status = 'active' THEN 1 END) as active_subscribers,
    AVG(ns.engagement_score) as avg_engagement_score,
    COUNT(CASE WHEN s.total_donations > 0 THEN 1 END) as donations_from_subscribers,
    COALESCE(SUM(s.total_donated_amount), 0) as donation_amount_from_subscribers
  FROM nmbr_subscriptions ns
  JOIN subscribers s ON ns.subscriber_id = s.id
  WHERE ns.story_id = story_uuid;
END;
$$ LANGUAGE plpgsql;

-- Update trigger for subscribers updated_at
CREATE TRIGGER update_subscribers_updated_at BEFORE UPDATE ON subscribers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
