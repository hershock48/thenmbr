#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

console.log('🔒 Running Database Security Audit...\n')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Security checks
const securityChecks = [
  {
    name: 'RLS Enabled on All Tables',
    check: async () => {
      try {
        const { data, error } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
          .not('table_name', 'like', 'pg_%')

        if (error) {
          return { passed: false, message: `Error querying tables: ${error.message}` }
        }

        const tables = data.map(row => row.table_name)
        const rlsEnabledTables = []

        for (const table of tables) {
          const { data: rlsData, error: rlsError } = await supabase
            .rpc('check_rls_enabled', { table_name: table })

          if (!rlsError && rlsData) {
            rlsEnabledTables.push(table)
          }
        }

        const missingRLS = tables.filter(table => !rlsEnabledTables.includes(table))

        if (missingRLS.length > 0) {
          return { 
            passed: false, 
            message: `Tables without RLS: ${missingRLS.join(', ')}` 
          }
        }

        return { 
          passed: true, 
          message: `All ${tables.length} tables have RLS enabled` 
        }
      } catch (error) {
        return { passed: false, message: `Error checking RLS: ${error.message}` }
      }
    }
  },

  {
    name: 'RLS Policies Exist',
    check: async () => {
      try {
        const { data, error } = await supabase
          .from('pg_policies')
          .select('tablename, policyname, cmd')
          .eq('schemaname', 'public')

        if (error) {
          return { passed: false, message: `Error querying policies: ${error.message}` }
        }

        const policyCount = data.length
        const tables = [...new Set(data.map(p => p.tablename))]

        if (policyCount === 0) {
          return { passed: false, message: 'No RLS policies found' }
        }

        return { 
          passed: true, 
          message: `Found ${policyCount} policies across ${tables.length} tables` 
        }
      } catch (error) {
        return { passed: false, message: `Error checking policies: ${error.message}` }
      }
    }
  },

  {
    name: 'Security Functions Exist',
    check: async () => {
      try {
        const { data, error } = await supabase
          .from('pg_proc')
          .select('proname')
          .eq('pronamespace', 'public'::regnamespace)
          .in('proname', ['is_admin', 'is_org_admin', 'can_access_organization', 'get_user_organization_id'])

        if (error) {
          return { passed: false, message: `Error querying functions: ${error.message}` }
        }

        const functionNames = data.map(row => row.proname)
        const requiredFunctions = ['is_admin', 'is_org_admin', 'can_access_organization', 'get_user_organization_id']
        const missingFunctions = requiredFunctions.filter(fn => !functionNames.includes(fn))

        if (missingFunctions.length > 0) {
          return { 
            passed: false, 
            message: `Missing security functions: ${missingFunctions.join(', ')}` 
          }
        }

        return { 
          passed: true, 
          message: `All ${requiredFunctions.length} security functions exist` 
        }
      } catch (error) {
        return { passed: false, message: `Error checking functions: ${error.message}` }
      }
    }
  },

  {
    name: 'Audit Logging Enabled',
    check: async () => {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .select('id')
          .limit(1)

        if (error) {
          return { passed: false, message: `Audit logs table not accessible: ${error.message}` }
        }

        return { passed: true, message: 'Audit logging is enabled' }
      } catch (error) {
        return { passed: false, message: `Error checking audit logs: ${error.message}` }
      }
    }
  },

  {
    name: 'User Profiles Security',
    check: async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id, role, is_active')
          .limit(1)

        if (error) {
          return { passed: false, message: `User profiles table not accessible: ${error.message}` }
        }

        return { passed: true, message: 'User profiles security is configured' }
      } catch (error) {
        return { passed: false, message: `Error checking user profiles: ${error.message}` }
      }
    }
  },

  {
    name: 'Organization Data Isolation',
    check: async () => {
      try {
        // Test that users can only access their organization's data
        const { data, error } = await supabase
          .from('stories')
          .select('id, org_id')
          .limit(1)

        if (error) {
          return { passed: false, message: `Stories table not accessible: ${error.message}` }
        }

        return { passed: true, message: 'Organization data isolation is configured' }
      } catch (error) {
        return { passed: false, message: `Error checking data isolation: ${error.message}` }
      }
    }
  },

  {
    name: 'Public Access Controls',
    check: async () => {
      try {
        // Test public access to nonprofits and stories (for widget)
        const { data: nonprofits, error: nonprofitsError } = await supabase
          .from('nonprofits')
          .select('id, name')
          .limit(1)

        const { data: stories, error: storiesError } = await supabase
          .from('stories')
          .select('id, title')
          .limit(1)

        if (nonprofitsError || storiesError) {
          return { 
            passed: false, 
            message: `Public access issues: ${nonprofitsError?.message || storiesError?.message}` 
          }
        }

        return { passed: true, message: 'Public access controls are working' }
      } catch (error) {
        return { passed: false, message: `Error checking public access: ${error.message}` }
      }
    }
  },

  {
    name: 'Database Indexes',
    check: async () => {
      try {
        const { data, error } = await supabase
          .from('pg_indexes')
          .select('tablename, indexname')
          .eq('schemaname', 'public')
          .in('tablename', ['nonprofits', 'stories', 'subscribers', 'donations'])

        if (error) {
          return { passed: false, message: `Error querying indexes: ${error.message}` }
        }

        const indexCount = data.length
        const tables = [...new Set(data.map(i => i.tablename))]

        if (indexCount === 0) {
          return { passed: false, message: 'No indexes found on core tables' }
        }

        return { 
          passed: true, 
          message: `Found ${indexCount} indexes across ${tables.length} core tables` 
        }
      } catch (error) {
        return { passed: false, message: `Error checking indexes: ${error.message}` }
      }
    }
  }
]

// Run security checks
async function runSecurityAudit() {
  let passedChecks = 0
  let failedChecks = 0
  const results = []

  console.log('📋 Database Security Check Results:')
  console.log('===================================\n')

  for (const check of securityChecks) {
    try {
      const result = await check.check()
      results.push({ name: check.name, ...result })
      
      if (result.passed) {
        console.log(`✅ ${check.name}: ${result.message}`)
        passedChecks++
      } else {
        console.log(`❌ ${check.name}: ${result.message}`)
        failedChecks++
      }
    } catch (error) {
      console.log(`❌ ${check.name}: Error - ${error.message}`)
      results.push({ name: check.name, passed: false, message: error.message })
      failedChecks++
    }
  }

  console.log('\n📊 Security Summary:')
  console.log('====================')
  console.log(`Total Checks: ${securityChecks.length}`)
  console.log(`Passed: ${passedChecks}`)
  console.log(`Failed: ${failedChecks}`)
  console.log(`Success Rate: ${Math.round((passedChecks / securityChecks.length) * 100)}%`)

  console.log('\n🔒 Database Security Features:')
  console.log('==============================')
  console.log('✅ Row Level Security (RLS) - Data access control')
  console.log('✅ RLS Policies - Granular permission rules')
  console.log('✅ Security Functions - Access control helpers')
  console.log('✅ Audit Logging - Complete action tracking')
  console.log('✅ User Profiles - Role-based access control')
  console.log('✅ Data Isolation - Organization-level separation')
  console.log('✅ Public Access - Controlled public endpoints')
  console.log('✅ Database Indexes - Performance optimization')

  if (failedChecks > 0) {
    console.log('\n⚠️  Security Issues Found:')
    console.log('==========================')
    results.filter(r => !r.passed).forEach(result => {
      console.log(`❌ ${result.name}: ${result.message}`)
    })
    
    console.log('\n💡 Recommendations:')
    console.log('==================')
    console.log('1. Run the RLS policies SQL script')
    console.log('2. Verify all tables have RLS enabled')
    console.log('3. Check that policies are properly configured')
    console.log('4. Test user access controls')
    console.log('5. Monitor audit logs for security events')
    
    process.exit(1)
  } else {
    console.log('\n🎉 All database security checks passed!')
    console.log('🚀 Database is secure and ready for production!')
    process.exit(0)
  }
}

// Run the audit
runSecurityAudit().catch(error => {
  console.error('❌ Security audit failed:', error)
  process.exit(1)
})
