#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🧪 Running Unit Tests...\n')

// Test files to run
const testFiles = [
  'lib/__tests__/utils.test.ts',
  'lib/__tests__/error-handler.test.ts',
  'lib/__tests__/validation.test.ts',
  'lib/__tests__/api-middleware.test.ts',
  'lib/__tests__/supabase.test.ts',
  'lib/__tests__/stripe.test.ts',
  'components/__tests__/performance-monitor.test.tsx'
]

let passedTests = 0
let failedTests = 0
let totalTests = 0

console.log('📋 Test Summary:')
console.log('================\n')

for (const testFile of testFiles) {
  if (fs.existsSync(testFile)) {
    try {
      console.log(`Running ${testFile}...`)
      const output = execSync(`npx jest ${testFile} --verbose`, { 
        encoding: 'utf8',
        stdio: 'pipe'
      })
      
      // Parse test results
      const lines = output.split('\n')
      const testResults = lines.find(line => line.includes('Tests:'))
      
      if (testResults) {
        const match = testResults.match(/(\d+) passed|(\d+) failed/g)
        if (match) {
          match.forEach(result => {
            if (result.includes('passed')) {
              const count = parseInt(result.match(/(\d+)/)[1])
              passedTests += count
              totalTests += count
            } else if (result.includes('failed')) {
              const count = parseInt(result.match(/(\d+)/)[1])
              failedTests += count
              totalTests += count
            }
          })
        }
      }
      
      console.log(`✅ ${testFile} - PASSED\n`)
    } catch (error) {
      console.log(`❌ ${testFile} - FAILED`)
      console.log(error.message)
      console.log('')
      failedTests++
    }
  } else {
    console.log(`⚠️  ${testFile} - NOT FOUND\n`)
  }
}

console.log('📊 Final Results:')
console.log('=================')
console.log(`Total Tests: ${totalTests}`)
console.log(`Passed: ${passedTests}`)
console.log(`Failed: ${failedTests}`)
console.log(`Success Rate: ${totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0}%`)

if (failedTests > 0) {
  console.log('\n❌ Some tests failed. Please check the output above.')
  process.exit(1)
} else {
  console.log('\n🎉 All tests passed!')
  process.exit(0)
}
