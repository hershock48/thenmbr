#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Analyzes the Next.js bundle and provides optimization recommendations
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🔍 Analyzing bundle size and performance...\n')

// Check if bundle analyzer is installed
try {
  require.resolve('@next/bundle-analyzer')
} catch (e) {
  console.log('📦 Installing bundle analyzer...')
  execSync('npm install --save-dev @next/bundle-analyzer', { stdio: 'inherit' })
}

// Run bundle analysis
console.log('📊 Generating bundle analysis...')
execSync('ANALYZE=true npm run build', { stdio: 'inherit' })

// Check bundle sizes
const buildDir = path.join(process.cwd(), '.next')
const staticDir = path.join(buildDir, 'static')

if (fs.existsSync(staticDir)) {
  console.log('\n📈 Bundle Size Analysis:')
  
  // Find the main JS chunks
  const chunks = fs.readdirSync(staticDir)
    .filter(file => file.startsWith('chunks/') && file.endsWith('.js'))
    .map(file => {
      const filePath = path.join(staticDir, file)
      const stats = fs.statSync(filePath)
      return {
        name: file,
        size: stats.size,
        sizeKB: Math.round(stats.size / 1024)
      }
    })
    .sort((a, b) => b.size - a.size)

  console.log('\n📦 Largest JavaScript Chunks:')
  chunks.slice(0, 10).forEach((chunk, index) => {
    const size = chunk.sizeKB > 1024 
      ? `${(chunk.sizeKB / 1024).toFixed(1)} MB` 
      : `${chunk.sizeKB} KB`
    console.log(`  ${index + 1}. ${chunk.name}: ${size}`)
  })

  // Check for potential optimizations
  console.log('\n💡 Optimization Recommendations:')
  
  const largeChunks = chunks.filter(chunk => chunk.sizeKB > 100)
  if (largeChunks.length > 0) {
    console.log('  ⚠️  Large chunks detected (>100KB):')
    largeChunks.forEach(chunk => {
      console.log(`     - ${chunk.name}: ${chunk.sizeKB} KB`)
    })
    console.log('     Consider code splitting or lazy loading these components')
  }

  const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0)
  const totalSizeKB = Math.round(totalSize / 1024)
  
  console.log(`\n📊 Total JavaScript Size: ${totalSizeKB > 1024 ? `${(totalSizeKB / 1024).toFixed(1)} MB` : `${totalSizeKB} KB`}`)
  
  if (totalSizeKB > 500) {
    console.log('  ⚠️  Total bundle size is large. Consider:')
    console.log('     - Implementing code splitting')
    console.log('     - Lazy loading heavy components')
    console.log('     - Tree shaking unused code')
    console.log('     - Optimizing images and assets')
  } else {
    console.log('  ✅ Bundle size looks good!')
  }
}

// Check for unused dependencies
console.log('\n🔍 Checking for unused dependencies...')
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  const dependencies = Object.keys(packageJson.dependencies || {})
  
  console.log(`  📦 Total dependencies: ${dependencies.length}`)
  
  // Check for common heavy dependencies that might be unused
  const heavyDeps = [
    'lodash',
    'moment',
    'jquery',
    'bootstrap',
    'material-ui',
    '@mui/material',
    'antd',
    'react-bootstrap'
  ]
  
  const unusedHeavyDeps = heavyDeps.filter(dep => 
    dependencies.includes(dep) && 
    !fs.readFileSync('package.json', 'utf8').includes(`"${dep}"`)
  )
  
  if (unusedHeavyDeps.length > 0) {
    console.log('  ⚠️  Potentially unused heavy dependencies:')
    unusedHeavyDeps.forEach(dep => console.log(`     - ${dep}`))
  } else {
    console.log('  ✅ No obviously unused heavy dependencies found')
  }
} catch (e) {
  console.log('  ❌ Could not analyze dependencies')
}

console.log('\n🎉 Bundle analysis complete!')
console.log('\n📋 Next Steps:')
console.log('  1. Review the bundle analyzer report in your browser')
console.log('  2. Identify large chunks and optimize them')
console.log('  3. Implement code splitting for heavy components')
console.log('  4. Remove unused dependencies')
console.log('  5. Optimize images and assets')
console.log('  6. Consider using dynamic imports for non-critical code')
