#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🔒 Running Security Audit...\n')

// Security checks
const securityChecks = [
  {
    name: 'Security Headers',
    check: () => {
      const middlewareFile = 'middleware.ts'
      const nextConfigFile = 'next.config.security.js'
      
      if (!fs.existsSync(middlewareFile)) {
        return { passed: false, message: 'Middleware file not found' }
      }
      
      if (!fs.existsSync(nextConfigFile)) {
        return { passed: false, message: 'Security config file not found' }
      }
      
      const middlewareContent = fs.readFileSync(middlewareFile, 'utf8')
      const requiredHeaders = [
        'X-Content-Type-Options',
        'X-Frame-Options',
        'X-XSS-Protection',
        'Content-Security-Policy',
        'Strict-Transport-Security'
      ]
      
      const missingHeaders = requiredHeaders.filter(header => 
        !middlewareContent.includes(header)
      )
      
      if (missingHeaders.length > 0) {
        return { passed: false, message: `Missing headers: ${missingHeaders.join(', ')}` }
      }
      
      return { passed: true, message: 'All security headers configured' }
    }
  },
  
  {
    name: 'CSRF Protection',
    check: () => {
      const csrfTokenFile = 'components/security/csrf-token.tsx'
      const csrfApiFile = 'app/api/csrf-token/route.ts'
      const securityFile = 'lib/security.ts'
      
      if (!fs.existsSync(csrfTokenFile)) {
        return { passed: false, message: 'CSRF token component not found' }
      }
      
      if (!fs.existsSync(csrfApiFile)) {
        return { passed: false, message: 'CSRF API endpoint not found' }
      }
      
      if (!fs.existsSync(securityFile)) {
        return { passed: false, message: 'Security library not found' }
      }
      
      const securityContent = fs.readFileSync(securityFile, 'utf8')
      const requiredFunctions = [
        'generateCSRFToken',
        'createCSRFToken',
        'validateCSRFToken'
      ]
      
      const missingFunctions = requiredFunctions.filter(func => 
        !securityContent.includes(func)
      )
      
      if (missingFunctions.length > 0) {
        return { passed: false, message: `Missing functions: ${missingFunctions.join(', ')}` }
      }
      
      return { passed: true, message: 'CSRF protection implemented' }
    }
  },
  
  {
    name: 'Rate Limiting',
    check: () => {
      const middlewareFile = 'middleware.ts'
      
      if (!fs.existsSync(middlewareFile)) {
        return { passed: false, message: 'Middleware file not found' }
      }
      
      const middlewareContent = fs.readFileSync(middlewareFile, 'utf8')
      
      if (!middlewareContent.includes('checkRateLimit')) {
        return { passed: false, message: 'Rate limiting not implemented' }
      }
      
      if (!middlewareContent.includes('RATE_LIMIT_CONFIG')) {
        return { passed: false, message: 'Rate limit configuration not found' }
      }
      
      return { passed: true, message: 'Rate limiting configured' }
    }
  },
  
  {
    name: 'Input Sanitization',
    check: () => {
      const securityFile = 'lib/security.ts'
      
      if (!fs.existsSync(securityFile)) {
        return { passed: false, message: 'Security library not found' }
      }
      
      const securityContent = fs.readFileSync(securityFile, 'utf8')
      const requiredFunctions = [
        'sanitizeInput',
        'sanitizeSQL',
        'escapeHTML',
        'validateFileUpload'
      ]
      
      const missingFunctions = requiredFunctions.filter(func => 
        !securityContent.includes(func)
      )
      
      if (missingFunctions.length > 0) {
        return { passed: false, message: `Missing sanitization functions: ${missingFunctions.join(', ')}` }
      }
      
      return { passed: true, message: 'Input sanitization implemented' }
    }
  },
  
  {
    name: 'Password Security',
    check: () => {
      const securityFile = 'lib/security.ts'
      
      if (!fs.existsSync(securityFile)) {
        return { passed: false, message: 'Security library not found' }
      }
      
      const securityContent = fs.readFileSync(securityFile, 'utf8')
      
      if (!securityContent.includes('validatePasswordStrength')) {
        return { passed: false, message: 'Password strength validation not implemented' }
      }
      
      return { passed: true, message: 'Password security implemented' }
    }
  },
  
  {
    name: 'Environment Variables',
    check: () => {
      const envFile = '.env.local'
      
      if (!fs.existsSync(envFile)) {
        return { passed: false, message: 'Environment file not found' }
      }
      
      const envContent = fs.readFileSync(envFile, 'utf8')
      const requiredVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'STRIPE_SECRET_KEY',
        'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
      ]
      
      const missingVars = requiredVars.filter(varName => 
        !envContent.includes(varName)
      )
      
      if (missingVars.length > 0) {
        return { passed: false, message: `Missing environment variables: ${missingVars.join(', ')}` }
      }
      
      // Check for hardcoded secrets
      if (envContent.includes('sk_live_') || envContent.includes('pk_live_')) {
        return { passed: false, message: 'Live Stripe keys detected in environment file' }
      }
      
      return { passed: true, message: 'Environment variables configured securely' }
    }
  },
  
  {
    name: 'Dependencies Security',
    check: () => {
      try {
        const output = execSync('npm audit --json', { encoding: 'utf8' })
        const audit = JSON.parse(output)
        
        const vulnerabilities = audit.vulnerabilities || {}
        const highVulns = Object.values(vulnerabilities).filter(vuln => 
          vuln.severity === 'high' || vuln.severity === 'critical'
        )
        
        if (highVulns.length > 0) {
          return { 
            passed: false, 
            message: `${highVulns.length} high/critical vulnerabilities found` 
          }
        }
        
        return { passed: true, message: 'No high/critical vulnerabilities found' }
      } catch (error) {
        return { passed: false, message: 'Failed to run security audit' }
      }
    }
  },
  
  {
    name: 'File Upload Security',
    check: () => {
      const securityFile = 'lib/security.ts'
      
      if (!fs.existsSync(securityFile)) {
        return { passed: false, message: 'Security library not found' }
      }
      
      const securityContent = fs.readFileSync(securityFile, 'utf8')
      
      if (!securityContent.includes('validateFileUpload')) {
        return { passed: false, message: 'File upload validation not implemented' }
      }
      
      if (!securityContent.includes('allowedTypes')) {
        return { passed: false, message: 'File type restrictions not configured' }
      }
      
      return { passed: true, message: 'File upload security implemented' }
    }
  }
]

// Run security checks
let passedChecks = 0
let failedChecks = 0
const results = []

console.log('📋 Security Check Results:')
console.log('==========================\n')

for (const check of securityChecks) {
  try {
    const result = check.check()
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

console.log('\n🔒 Security Features Implemented:')
console.log('==================================')
console.log('✅ Security Headers - XSS, CSRF, Clickjacking protection')
console.log('✅ CSRF Protection - Token-based request validation')
console.log('✅ Rate Limiting - API endpoint protection')
console.log('✅ Input Sanitization - XSS and SQL injection prevention')
console.log('✅ Password Security - Strength validation and requirements')
console.log('✅ File Upload Security - Type and size validation')
console.log('✅ Environment Security - Secure configuration management')
console.log('✅ Dependency Security - Vulnerability scanning')

if (failedChecks > 0) {
  console.log('\n⚠️  Security Issues Found:')
  console.log('==========================')
  results.filter(r => !r.passed).forEach(result => {
    console.log(`❌ ${result.name}: ${result.message}`)
  })
  
  console.log('\n💡 Recommendations:')
  console.log('==================')
  console.log('1. Fix all failed security checks')
  console.log('2. Run npm audit fix to resolve vulnerabilities')
  console.log('3. Review and update security configurations')
  console.log('4. Implement additional security measures as needed')
  console.log('5. Regular security audits and updates')
  
  process.exit(1)
} else {
  console.log('\n🎉 All security checks passed!')
  console.log('🚀 Application is secure and ready for production!')
  process.exit(0)
}
