#!/usr/bin/env node

/**
 * Health Check Script
 * Validates application health after deployment
 */

const https = require('https')
const http = require('http')

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    
    const req = client.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Health-Check-Script/1.0'
      }
    }, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        })
      })
    })
    
    req.on('error', (error) => {
      reject(error)
    })
    
    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })
  })
}

async function checkHealthEndpoint(url) {
  try {
    log(`\n🔍 Checking health endpoint: ${url}`, 'blue')
    
    const response = await makeRequest(`${url}/api/health`)
    
    if (response.statusCode === 200) {
      log('✅ Health endpoint is responding', 'green')
      
      try {
        const healthData = JSON.parse(response.data)
        log(`   Status: ${healthData.status}`, 'green')
        log(`   Timestamp: ${healthData.timestamp}`, 'green')
        
        if (healthData.database) {
          log(`   Database: ${healthData.database.status}`, 
              healthData.database.status === 'connected' ? 'green' : 'red')
        }
        
        if (healthData.redis) {
          log(`   Redis: ${healthData.redis.status}`, 
              healthData.redis.status === 'connected' ? 'green' : 'red')
        }
        
        return true
      } catch (parseError) {
        log('⚠️  Health endpoint responded but data is not valid JSON', 'yellow')
        return false
      }
    } else {
      log(`❌ Health endpoint returned status ${response.statusCode}`, 'red')
      return false
    }
  } catch (error) {
    log(`❌ Health endpoint check failed: ${error.message}`, 'red')
    return false
  }
}

async function checkMainPage(url) {
  try {
    log(`\n🔍 Checking main page: ${url}`, 'blue')
    
    const response = await makeRequest(url)
    
    if (response.statusCode === 200) {
      log('✅ Main page is accessible', 'green')
      
      // Check for important content
      if (response.data.includes('NMBR') || response.data.includes('Next.js')) {
        log('✅ Page contains expected content', 'green')
        return true
      } else {
        log('⚠️  Page accessible but content may be incorrect', 'yellow')
        return false
      }
    } else {
      log(`❌ Main page returned status ${response.statusCode}`, 'red')
      return false
    }
  } catch (error) {
    log(`❌ Main page check failed: ${error.message}`, 'red')
    return false
  }
}

async function checkAPIEndpoints(url) {
  const endpoints = [
    '/api/health',
    '/api/stories',
    '/api/subscribers'
  ]
  
  let allPassed = true
  
  for (const endpoint of endpoints) {
    try {
      log(`\n🔍 Checking API endpoint: ${endpoint}`, 'blue')
      
      const response = await makeRequest(`${url}${endpoint}`)
      
      if (response.statusCode === 200 || response.statusCode === 401) {
        log(`✅ ${endpoint} is responding`, 'green')
      } else {
        log(`❌ ${endpoint} returned status ${response.statusCode}`, 'red')
        allPassed = false
      }
    } catch (error) {
      log(`❌ ${endpoint} check failed: ${error.message}`, 'red')
      allPassed = false
    }
  }
  
  return allPassed
}

async function checkSecurityHeaders(url) {
  try {
    log(`\n🔍 Checking security headers: ${url}`, 'blue')
    
    const response = await makeRequest(url)
    const headers = response.headers
    
    const securityHeaders = {
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'DENY',
      'x-xss-protection': '1; mode=block',
      'referrer-policy': 'strict-origin-when-cross-origin'
    }
    
    let allPresent = true
    
    for (const [header, expectedValue] of Object.entries(securityHeaders)) {
      const actualValue = headers[header]
      if (actualValue) {
        if (actualValue.includes(expectedValue)) {
          log(`✅ ${header}: ${actualValue}`, 'green')
        } else {
          log(`⚠️  ${header}: ${actualValue} (expected: ${expectedValue})`, 'yellow')
        }
      } else {
        log(`❌ ${header}: Missing`, 'red')
        allPresent = false
      }
    }
    
    return allPresent
  } catch (error) {
    log(`❌ Security headers check failed: ${error.message}`, 'red')
    return false
  }
}

async function runHealthChecks() {
  const args = process.argv.slice(2)
  const url = args[0] || process.env.HEALTH_CHECK_URL || 'http://localhost:3000'
  
  log(`${colors.bold}🚀 Starting Health Checks for: ${url}${colors.reset}`, 'blue')
  
  const checks = [
    { name: 'Health Endpoint', fn: () => checkHealthEndpoint(url) },
    { name: 'Main Page', fn: () => checkMainPage(url) },
    { name: 'API Endpoints', fn: () => checkAPIEndpoints(url) },
    { name: 'Security Headers', fn: () => checkSecurityHeaders(url) }
  ]
  
  const results = []
  
  for (const check of checks) {
    try {
      const passed = await check.fn()
      results.push({ name: check.name, passed })
    } catch (error) {
      log(`❌ ${check.name} failed with error: ${error.message}`, 'red')
      results.push({ name: check.name, passed: false })
    }
  }
  
  // Summary
  log(`\n${colors.bold}📊 Health Check Summary:${colors.reset}`, 'blue')
  
  const passed = results.filter(r => r.passed).length
  const total = results.length
  
  results.forEach(result => {
    const status = result.passed ? '✅' : '❌'
    const color = result.passed ? 'green' : 'red'
    log(`   ${status} ${result.name}`, color)
  })
  
  log(`\n${colors.bold}Result: ${passed}/${total} checks passed${colors.reset}`, 
      passed === total ? 'green' : 'red')
  
  if (passed === total) {
    log('\n🎉 All health checks passed! Application is healthy.', 'green')
    process.exit(0)
  } else {
    log('\n💥 Some health checks failed! Application may have issues.', 'red')
    process.exit(1)
  }
}

// Run health checks
runHealthChecks().catch(error => {
  log(`\n💥 Health check script failed: ${error.message}`, 'red')
  process.exit(1)
})
