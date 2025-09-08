#!/usr/bin/env node

/**
 * Add org_type column to nonprofits table
 * Run this script to add the missing org_type column
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function addOrgTypeColumn() {
  console.log('🚀 Adding org_type column to nonprofits table...')
  
  try {
    // Add the org_type column
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE nonprofits 
        ADD COLUMN IF NOT EXISTS org_type VARCHAR(20) DEFAULT 'nonprofit' 
        CHECK (org_type IN ('nonprofit', 'grassroots', 'business'));
      `
    })

    if (error) {
      console.error('❌ Error adding org_type column:', error)
      return
    }

    console.log('✅ Successfully added org_type column')

    // Add index for better performance
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_nonprofits_org_type ON nonprofits(org_type);
      `
    })

    if (indexError) {
      console.error('⚠️ Warning: Could not create index:', indexError)
    } else {
      console.log('✅ Successfully created index on org_type')
    }

    // Update existing records to have the default type
    const { error: updateError } = await supabase
      .from('nonprofits')
      .update({ org_type: 'nonprofit' })
      .is('org_type', null)

    if (updateError) {
      console.error('⚠️ Warning: Could not update existing records:', updateError)
    } else {
      console.log('✅ Updated existing records with default org_type')
    }

    console.log('🎉 Migration completed successfully!')
    console.log('You can now create organizations with different types.')
    
  } catch (error) {
    console.error('❌ Error running migration:', error)
  }
}

addOrgTypeColumn()
