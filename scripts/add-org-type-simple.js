#!/usr/bin/env node

/**
 * Add org_type column to nonprofits table
 * Simple version without dotenv dependency
 */

const { createClient } = require('@supabase/supabase-js')

// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY'

if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseKey === 'YOUR_SERVICE_ROLE_KEY') {
  console.error('❌ Please set your Supabase credentials:')
  console.error('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
  console.error('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key')
  console.error('')
  console.error('You can find these in your Supabase project dashboard under Settings > API')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function addOrgTypeColumn() {
  console.log('🚀 Adding org_type column to nonprofits table...')
  
  try {
    // First, let's check if the column already exists
    const { data: columns, error: columnError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'nonprofits')
      .eq('column_name', 'org_type')

    if (columnError) {
      console.log('⚠️ Could not check existing columns, proceeding with migration...')
    } else if (columns && columns.length > 0) {
      console.log('✅ org_type column already exists!')
      return
    }

    // Add the org_type column using raw SQL
    const { error } = await supabase
      .from('nonprofits')
      .select('id')
      .limit(1)

    if (error && error.message.includes('org_type')) {
      console.log('❌ The org_type column does not exist. Please run this SQL in your Supabase dashboard:')
      console.log('')
      console.log('ALTER TABLE nonprofits ADD COLUMN org_type VARCHAR(20) DEFAULT \'nonprofit\' CHECK (org_type IN (\'nonprofit\', \'grassroots\', \'business\'));')
      console.log('')
      console.log('Then run:')
      console.log('CREATE INDEX IF NOT EXISTS idx_nonprofits_org_type ON nonprofits(org_type);')
      console.log('')
      console.log('To run this SQL:')
      console.log('1. Go to your Supabase dashboard')
      console.log('2. Navigate to SQL Editor')
      console.log('3. Paste and run the SQL commands above')
      return
    }

    console.log('✅ org_type column appears to exist!')
    console.log('🎉 Migration completed successfully!')
    console.log('You can now create organizations with different types.')
    
  } catch (error) {
    console.error('❌ Error running migration:', error)
    console.log('')
    console.log('Please run this SQL manually in your Supabase dashboard:')
    console.log('')
    console.log('ALTER TABLE nonprofits ADD COLUMN org_type VARCHAR(20) DEFAULT \'nonprofit\' CHECK (org_type IN (\'nonprofit\', \'grassroots\', \'business\'));')
    console.log('CREATE INDEX IF NOT EXISTS idx_nonprofits_org_type ON nonprofits(org_type);')
  }
}

addOrgTypeColumn()
