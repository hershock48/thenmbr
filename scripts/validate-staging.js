#!/usr/bin/env node

/**
 * Staging Environment Validation Script
 * Validates staging environment configuration and setup
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

// Validation results
const validationResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  errors: []
}

function addResult(passed, message, isWarning = false) {
  if (passed) {
    validationResults.passed++
    logSuccess(message)
  } else if (isWarning) {
    validationResults.warnings++
    logWarning(message)
  } else {
    validationResults.failed++
    validationResults.errors.push(message)
    logError(message)
  }
}

// Check if file exists
function checkFileExists(filePath, description) {
  const exists = fs.existsSync(filePath)
  addResult(exists, `${description}: ${filePath}`)
  return exists
}

// Check if directory exists
function checkDirectoryExists(dirPath, description) {
  const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()
  addResult(exists, `${description}: ${dirPath}`)
  return exists
}

// Check environment variables
function checkEnvironmentVariables() {
  log(`\n${colors.bold}🔍 Checking Environment Variables${colors.reset}`, 'blue')
  
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
  ]

  const stagingEnvPath = '.env.staging'
  
  if (!fs.existsSync(stagingEnvPath)) {
    addResult(false, 'Staging environment file (.env.staging) not found')
    return
  }

  const envContent = fs.readFileSync(stagingEnvPath, 'utf8')
  
  requiredEnvVars.forEach(envVar => {
    const hasVar = envContent.includes(envVar)
    const isConfigured = hasVar && !envContent.includes(`your-staging-${envVar.toLowerCase()}`)
    
    if (hasVar && isConfigured) {
      addResult(true, `Environment variable configured: ${envVar}`)
    } else if (hasVar) {
      addResult(false, `Environment variable not configured: ${envVar}`, true)
    } else {
      addResult(false, `Missing environment variable: ${envVar}`)
    }
  })
}

// Check staging-specific files
function checkStagingFiles() {
  log(`\n${colors.bold}📁 Checking Staging Files${colors.reset}`, 'blue')
  
  const requiredFiles = [
    { path: 'next.config.staging.js', description: 'Staging Next.js config' },
    { path: 'tsconfig.staging.json', description: 'Staging TypeScript config' },
    { path: 'staging.env.example', description: 'Staging environment template' },
    { path: 'scripts/setup-staging.js', description: 'Staging setup script' },
    { path: 'scripts/validate-staging.js', description: 'Staging validation script' },
    { path: 'scripts/health-check.js', description: 'Health check script' }
  ]

  requiredFiles.forEach(file => {
    checkFileExists(file.path, file.description)
  })
}

// Check staging directories
function checkStagingDirectories() {
  log(`\n${colors.bold}📂 Checking Staging Directories${colors.reset}`, 'blue')
  
  const requiredDirs = [
    { path: 'staging', description: 'Staging root directory' },
    { path: 'staging/logs', description: 'Staging logs directory' },
    { path: 'staging/uploads', description: 'Staging uploads directory' },
    { path: 'staging/backups', description: 'Staging backups directory' },
    { path: 'staging/temp', description: 'Staging temp directory' },
    { path: 'staging/cache', description: 'Staging cache directory' }
  ]

  requiredDirs.forEach(dir => {
    checkDirectoryExists(dir.path, dir.description)
  })
}

// Check package.json scripts
function checkPackageJsonScripts() {
  log(`\n${colors.bold}📦 Checking Package.json Scripts${colors.reset}`, 'blue')
  
  if (!fs.existsSync('package.json')) {
    addResult(false, 'package.json not found')
    return
  }

  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  const scripts = packageJson.scripts || {}

  const requiredScripts = [
    'build:staging',
    'start:staging',
    'dev:staging',
    'deploy:staging',
    'staging:setup',
    'staging:health'
  ]

  requiredScripts.forEach(script => {
    const hasScript = scripts.hasOwnProperty(script)
    addResult(hasScript, `Package.json script: ${script}`)
  })
}

// Check TypeScript configuration
function checkTypeScriptConfig() {
  log(`\n${colors.bold}🔧 Checking TypeScript Configuration${colors.reset}`, 'blue')
  
  if (!fs.existsSync('tsconfig.staging.json')) {
    addResult(false, 'tsconfig.staging.json not found')
    return
  }

  try {
    const tsConfig = JSON.parse(fs.readFileSync('tsconfig.staging.json', 'utf8'))
    
    // Check if it extends the base config
    const extendsBase = tsConfig.extends === './tsconfig.json'
    addResult(extendsBase, 'TypeScript config extends base config')
    
    // Check staging-specific settings
    const hasStagingPaths = tsConfig.include && tsConfig.include.includes('staging/**/*.ts')
    addResult(hasStagingPaths, 'TypeScript config includes staging files')
    
  } catch (error) {
    addResult(false, `Invalid TypeScript configuration: ${error.message}`)
  }
}

// Check Next.js configuration
function checkNextJsConfig() {
  log(`\n${colors.bold}⚙️  Checking Next.js Configuration${colors.reset}`, 'blue')
  
  if (!fs.existsSync('next.config.staging.js')) {
    addResult(false, 'next.config.staging.js not found')
    return
  }

  try {
    const configContent = fs.readFileSync('next.config.staging.js', 'utf8')
    
    // Check for staging-specific settings
    const hasStagingEnv = configContent.includes('APP_ENV')
    addResult(hasStagingEnv, 'Next.js config has staging environment settings')
    
    const hasStagingHeaders = configContent.includes('X-Environment')
    addResult(hasStagingHeaders, 'Next.js config has staging headers')
    
    const hasStagingImages = configContent.includes('staging.nmbrplatform.com')
    addResult(hasStagingImages, 'Next.js config has staging image domains')
    
  } catch (error) {
    addResult(false, `Error reading Next.js configuration: ${error.message}`)
  }
}

// Check Docker configuration
function checkDockerConfig() {
  log(`\n${colors.bold}🐳 Checking Docker Configuration${colors.reset}`, 'blue')
  
  const dockerFiles = [
    { path: 'Dockerfile', description: 'Dockerfile' },
    { path: 'docker-compose.yml', description: 'Docker Compose file' },
    { path: '.dockerignore', description: 'Docker ignore file' }
  ]

  dockerFiles.forEach(file => {
    const exists = checkFileExists(file.path, file.description)
    if (exists) {
      // Check if file has content
      const content = fs.readFileSync(file.path, 'utf8')
      const hasContent = content.trim().length > 0
      addResult(hasContent, `${file.description} has content`)
    }
  })
}

// Check CI/CD configuration
function checkCICDConfig() {
  log(`\n${colors.bold}🔄 Checking CI/CD Configuration${colors.reset}`, 'blue')
  
  const cicdFiles = [
    { path: '.github/workflows/ci-cd.yml', description: 'Main CI/CD workflow' },
    { path: '.github/workflows/pr-validation.yml', description: 'PR validation workflow' },
    { path: '.github/workflows/release.yml', description: 'Release workflow' },
    { path: 'vercel.json', description: 'Vercel configuration' }
  ]

  cicdFiles.forEach(file => {
    checkFileExists(file.path, file.description)
  })
}

// Check staging health
function checkStagingHealth() {
  log(`\n${colors.bold}🏥 Checking Staging Health${colors.reset}`, 'blue')
  
  // Check if health check script is executable
  const healthScriptPath = 'scripts/health-check.js'
  if (fs.existsSync(healthScriptPath)) {
    try {
      const stats = fs.statSync(healthScriptPath)
      const isExecutable = !!(stats.mode & parseInt('111', 8))
      addResult(isExecutable, 'Health check script is executable')
    } catch (error) {
      addResult(false, 'Cannot check health script permissions')
    }
  } else {
    addResult(false, 'Health check script not found')
  }
}

// Check staging database setup
function checkStagingDatabase() {
  log(`\n${colors.bold}🗄️  Checking Staging Database Setup${colors.reset}`, 'blue')
  
  const dbScriptPath = 'scripts/setup-staging-db.js'
  const hasDbScript = checkFileExists(dbScriptPath, 'Staging database setup script')
  
  if (hasDbScript) {
    try {
      const stats = fs.statSync(dbScriptPath)
      const isExecutable = !!(stats.mode & parseInt('111', 8))
      addResult(isExecutable, 'Database setup script is executable')
    } catch (error) {
      addResult(false, 'Cannot check database script permissions')
    }
  }
}

// Run all validations
async function validateStaging() {
  log(`${colors.bold}🔍 Validating NMBR Platform Staging Environment${colors.reset}`, 'blue')
  
  try {
    checkStagingFiles()
    checkStagingDirectories()
    checkPackageJsonScripts()
    checkEnvironmentVariables()
    checkTypeScriptConfig()
    checkNextJsConfig()
    checkDockerConfig()
    checkCICDConfig()
    checkStagingHealth()
    checkStagingDatabase()

    // Summary
    log(`\n${colors.bold}📊 Validation Summary${colors.reset}`, 'blue')
    log(`✅ Passed: ${validationResults.passed}`, 'green')
    log(`⚠️  Warnings: ${validationResults.warnings}`, 'yellow')
    log(`❌ Failed: ${validationResults.failed}`, 'red')

    if (validationResults.errors.length > 0) {
      log(`\n${colors.bold}❌ Errors Found:${colors.reset}`, 'red')
      validationResults.errors.forEach(error => {
        log(`  • ${error}`, 'red')
      })
    }

    if (validationResults.failed === 0) {
      log(`\n${colors.bold}🎉 Staging environment validation passed!${colors.reset}`, 'green')
      log('Your staging environment is ready to use.', 'cyan')
      process.exit(0)
    } else {
      log(`\n${colors.bold}💥 Staging environment validation failed!${colors.reset}`, 'red')
      log('Please fix the errors above before proceeding.', 'yellow')
      process.exit(1)
    }

  } catch (error) {
    logError(`Validation failed: ${error.message}`)
    process.exit(1)
  }
}

// Run validation
validateStaging()
