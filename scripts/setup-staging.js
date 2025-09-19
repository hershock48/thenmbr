#!/usr/bin/env node

/**
 * Staging Environment Setup Script
 * Sets up and configures the staging environment
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logStep(step, message) {
  log(`\n${colors.bold}${step}. ${message}${colors.reset}`, 'blue')
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan')
}

// Check if required files exist
function checkRequiredFiles() {
  const requiredFiles = [
    'package.json',
    'next.config.js',
    'tsconfig.json',
    'staging.env.example'
  ]

  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file))
  
  if (missingFiles.length > 0) {
    logError(`Missing required files: ${missingFiles.join(', ')}`)
    process.exit(1)
  }

  logSuccess('All required files found')
}

// Create staging environment file
function createStagingEnv() {
  const stagingEnvPath = '.env.staging'
  const examplePath = 'staging.env.example'

  if (fs.existsSync(stagingEnvPath)) {
    logWarning('.env.staging already exists. Backing up to .env.staging.backup')
    fs.copyFileSync(stagingEnvPath, '.env.staging.backup')
  }

  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, stagingEnvPath)
    logSuccess('Created .env.staging from template')
    logInfo('Please update .env.staging with your actual staging values')
  } else {
    logError('staging.env.example not found')
    process.exit(1)
  }
}

// Create staging-specific directories
function createStagingDirectories() {
  const directories = [
    'staging',
    'staging/logs',
    'staging/uploads',
    'staging/backups',
    'staging/temp',
    'staging/cache'
  ]

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
      logSuccess(`Created directory: ${dir}`)
    } else {
      logInfo(`Directory already exists: ${dir}`)
    }
  })
}

// Update package.json with staging scripts
function updatePackageJson() {
  const packageJsonPath = 'package.json'
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

  const stagingScripts = {
    'build:staging': 'NODE_ENV=staging next build',
    'start:staging': 'NODE_ENV=staging next start -p 3001',
    'dev:staging': 'NODE_ENV=staging next dev -p 3001',
    'type-check:staging': 'NODE_ENV=staging tsc --noEmit --project tsconfig.staging.json',
    'lint:staging': 'NODE_ENV=staging next lint',
    'test:staging': 'NODE_ENV=staging npm run test',
    'deploy:staging': 'vercel --prod --target staging',
    'staging:setup': 'node scripts/setup-staging.js',
    'staging:reset': 'node scripts/reset-staging.js',
    'staging:health': 'node scripts/health-check.js staging.nmbrplatform.com'
  }

  if (!packageJson.scripts) {
    packageJson.scripts = {}
  }

  Object.assign(packageJson.scripts, stagingScripts)
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  logSuccess('Updated package.json with staging scripts')
}

// Create staging-specific configuration files
function createStagingConfigs() {
  // Create staging-specific next.config.js
  const nextConfigStaging = `const stagingConfig = require('./next.config.staging.js')
module.exports = stagingConfig
`
  
  if (!fs.existsSync('next.config.staging.local.js')) {
    fs.writeFileSync('next.config.staging.local.js', nextConfigStaging)
    logSuccess('Created next.config.staging.local.js')
  }

  // Create staging-specific middleware
  const stagingMiddleware = `import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Staging-specific middleware
  const response = NextResponse.next()
  
  // Add staging headers
  response.headers.set('X-Environment', 'staging')
  response.headers.set('X-Staging-Version', '1.0.0-staging')
  
  // Staging-specific redirects
  if (request.nextUrl.pathname === '/staging') {
    return NextResponse.redirect(new URL('/staging/dashboard', request.url))
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
`
  
  if (!fs.existsSync('middleware.staging.ts')) {
    fs.writeFileSync('middleware.staging.ts', stagingMiddleware)
    logSuccess('Created middleware.staging.ts')
  }
}

// Install staging-specific dependencies
function installStagingDependencies() {
  const stagingDependencies = [
    'dotenv-cli',
    'cross-env',
    'concurrently'
  ]

  logInfo('Installing staging-specific dependencies...')
  
  try {
    execSync(`npm install --save-dev ${stagingDependencies.join(' ')}`, { stdio: 'inherit' })
    logSuccess('Installed staging dependencies')
  } catch (error) {
    logWarning('Failed to install some staging dependencies. You may need to install them manually.')
  }
}

// Create staging database setup script
function createStagingDatabaseScript() {
  const dbScript = `#!/usr/bin/env node

/**
 * Staging Database Setup Script
 * Sets up the staging database with sample data
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.staging' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration in .env.staging')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupStagingDatabase() {
  console.log('🚀 Setting up staging database...')
  
  try {
    // Create sample organizations
    const { data: orgs, error: orgError } = await supabase
      .from('nonprofits')
      .insert([
        {
          name: 'Staging Test Organization',
          slug: 'staging-test-org',
          description: 'A test organization for staging environment',
          website: 'https://staging-test-org.com',
          logo_url: 'https://via.placeholder.com/150',
          contact_email: 'test@staging-test-org.com',
          status: 'active'
        }
      ])
      .select()

    if (orgError) {
      console.error('❌ Error creating organizations:', orgError)
      return
    }

    console.log('✅ Created sample organizations')

    // Create sample stories
    const { data: stories, error: storyError } = await supabase
      .from('stories')
      .insert([
        {
          title: 'Staging Test Story',
          slug: 'staging-test-story',
          description: 'A test story for staging environment',
          content: 'This is a test story content for staging.',
          organization_id: orgs[0].id,
          status: 'published',
          featured: true
        }
      ])
      .select()

    if (storyError) {
      console.error('❌ Error creating stories:', storyError)
      return
    }

    console.log('✅ Created sample stories')

    // Create sample subscribers
    const { data: subscribers, error: subError } = await supabase
      .from('subscribers')
      .insert([
        {
          email: 'test@staging.com',
          first_name: 'Staging',
          last_name: 'Test',
          org_id: orgs[0].id,
          source: 'staging',
          status: 'active'
        }
      ])
      .select()

    if (subError) {
      console.error('❌ Error creating subscribers:', subError)
      return
    }

    console.log('✅ Created sample subscribers')

    console.log('🎉 Staging database setup complete!')
    
  } catch (error) {
    console.error('❌ Error setting up staging database:', error)
  }
}

setupStagingDatabase()
`

  fs.writeFileSync('scripts/setup-staging-db.js', dbScript)
  fs.chmodSync('scripts/setup-staging-db.js', '755')
  logSuccess('Created staging database setup script')
}

// Create staging reset script
function createStagingResetScript() {
  const resetScript = `#!/usr/bin/env node

/**
 * Staging Environment Reset Script
 * Resets the staging environment to a clean state
 */

const fs = require('fs')
const { execSync } = require('child_process')

console.log('🔄 Resetting staging environment...')

// Clean staging directories
const stagingDirs = ['staging/logs', 'staging/uploads', 'staging/temp', 'staging/cache']

stagingDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    execSync(\`rm -rf \${dir}/*\`, { stdio: 'inherit' })
    console.log(\`✅ Cleaned \${dir}\`)
  }
})

// Reset staging database (if configured)
if (process.env.RESET_DATABASE === 'true') {
  console.log('🗄️  Resetting staging database...')
  try {
    execSync('node scripts/setup-staging-db.js', { stdio: 'inherit' })
    console.log('✅ Staging database reset complete')
  } catch (error) {
    console.error('❌ Error resetting staging database:', error.message)
  }
}

console.log('🎉 Staging environment reset complete!')
`

  fs.writeFileSync('scripts/reset-staging.js', resetScript)
  fs.chmodSync('scripts/reset-staging.js', '755')
  logSuccess('Created staging reset script')
}

// Main setup function
async function setupStaging() {
  log(`${colors.bold}🚀 Setting up NMBR Platform Staging Environment${colors.reset}`, 'blue')
  
  try {
    logStep(1, 'Checking required files')
    checkRequiredFiles()

    logStep(2, 'Creating staging environment file')
    createStagingEnv()

    logStep(3, 'Creating staging directories')
    createStagingDirectories()

    logStep(4, 'Updating package.json')
    updatePackageJson()

    logStep(5, 'Creating staging configurations')
    createStagingConfigs()

    logStep(6, 'Installing staging dependencies')
    installStagingDependencies()

    logStep(7, 'Creating database setup script')
    createStagingDatabaseScript()

    logStep(8, 'Creating reset script')
    createStagingResetScript()

    log(`\n${colors.bold}🎉 Staging environment setup complete!${colors.reset}`, 'green')
    
    log(`\n${colors.bold}Next steps:${colors.reset}`, 'blue')
    log('1. Update .env.staging with your actual staging values', 'cyan')
    log('2. Run: npm run staging:setup', 'cyan')
    log('3. Run: npm run build:staging', 'cyan')
    log('4. Run: npm run start:staging', 'cyan')
    log('5. Visit: http://localhost:3001', 'cyan')
    
    log(`\n${colors.bold}Available staging commands:${colors.reset}`, 'blue')
    log('• npm run dev:staging - Start development server on port 3001', 'cyan')
    log('• npm run build:staging - Build for staging', 'cyan')
    log('• npm run start:staging - Start staging server', 'cyan')
    log('• npm run deploy:staging - Deploy to staging', 'cyan')
    log('• npm run staging:health - Check staging health', 'cyan')
    log('• npm run staging:reset - Reset staging environment', 'cyan')

  } catch (error) {
    logError(`Setup failed: ${error.message}`)
    process.exit(1)
  }
}

// Run setup
setupStaging()
