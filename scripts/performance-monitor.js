#!/usr/bin/env node

/**
 * Performance Monitoring Script
 * Monitors application performance and generates reports
 */

const fs = require('fs')
const path = require('path')
const { performance } = require('perf_hooks')

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

// Performance monitoring configuration
const config = {
  baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
  monitoringInterval: 30000, // 30 seconds
  reportInterval: 300000, // 5 minutes
  maxRetries: 3,
  timeout: 10000
}

// Performance metrics storage
const metrics = {
  api: [],
  database: [],
  system: [],
  alerts: []
}

// Performance thresholds
const thresholds = {
  apiResponseTime: { warning: 1000, critical: 5000 },
  memoryUsage: { warning: 80, critical: 90 },
  cpuUsage: { warning: 80, critical: 90 },
  errorRate: { warning: 5, critical: 10 }
}

// Check API health
async function checkApiHealth() {
  try {
    const startTime = performance.now()
    const response = await fetch(`${config.baseUrl}/api/health`, {
      method: 'GET',
      timeout: config.timeout
    })
    const endTime = performance.now()
    const responseTime = endTime - startTime

    const metric = {
      timestamp: Date.now(),
      endpoint: '/api/health',
      method: 'GET',
      responseTime,
      statusCode: response.status,
      success: response.ok
    }

    metrics.api.push(metric)
    
    // Check thresholds
    if (responseTime > thresholds.apiResponseTime.critical) {
      metrics.alerts.push({
        type: 'api_response_time',
        severity: 'critical',
        message: `API response time critical: ${responseTime.toFixed(2)}ms`,
        value: responseTime,
        threshold: thresholds.apiResponseTime.critical
      })
    } else if (responseTime > thresholds.apiResponseTime.warning) {
      metrics.alerts.push({
        type: 'api_response_time',
        severity: 'warning',
        message: `API response time warning: ${responseTime.toFixed(2)}ms`,
        value: responseTime,
        threshold: thresholds.apiResponseTime.warning
      })
    }

    return { success: true, responseTime, statusCode: response.status }
  } catch (error) {
    metrics.alerts.push({
      type: 'api_health',
      severity: 'critical',
      message: `API health check failed: ${error.message}`,
      value: 0,
      threshold: 0
    })
    return { success: false, error: error.message }
  }
}

// Check system resources
function checkSystemResources() {
  const memUsage = process.memoryUsage()
  const cpuUsage = process.cpuUsage()
  
  const memoryUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100
  
  const metric = {
    timestamp: Date.now(),
    memory: {
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external,
      rss: memUsage.rss,
      usagePercent: memoryUsagePercent
    },
    cpu: {
      user: cpuUsage.user,
      system: cpuUsage.system
    }
  }

  metrics.system.push(metric)

  // Check memory thresholds
  if (memoryUsagePercent > thresholds.memoryUsage.critical) {
    metrics.alerts.push({
      type: 'memory_usage',
      severity: 'critical',
      message: `Memory usage critical: ${memoryUsagePercent.toFixed(2)}%`,
      value: memoryUsagePercent,
      threshold: thresholds.memoryUsage.critical
    })
  } else if (memoryUsagePercent > thresholds.memoryUsage.warning) {
    metrics.alerts.push({
      type: 'memory_usage',
      severity: 'warning',
      message: `Memory usage warning: ${memoryUsagePercent.toFixed(2)}%`,
      value: memoryUsagePercent,
      threshold: thresholds.memoryUsage.warning
    })
  }

  return metric
}

// Check database performance
async function checkDatabasePerformance() {
  try {
    const startTime = performance.now()
    const response = await fetch(`${config.baseUrl}/api/monitoring/database/stats`, {
      method: 'GET',
      timeout: config.timeout
    })
    const endTime = performance.now()
    const responseTime = endTime - startTime

    if (response.ok) {
      const data = await response.json()
      
      const metric = {
        timestamp: Date.now(),
        responseTime,
        success: true,
        data: data
      }

      metrics.database.push(metric)
      return { success: true, responseTime, data }
    } else {
      throw new Error(`Database check failed with status: ${response.status}`)
    }
  } catch (error) {
    metrics.alerts.push({
      type: 'database_health',
      severity: 'critical',
      message: `Database performance check failed: ${error.message}`,
      value: 0,
      threshold: 0
    })
    return { success: false, error: error.message }
  }
}

// Generate performance report
function generateReport() {
  const now = Date.now()
  const fiveMinutesAgo = now - 300000
  
  // Filter recent metrics
  const recentApi = metrics.api.filter(m => m.timestamp > fiveMinutesAgo)
  const recentSystem = metrics.system.filter(m => m.timestamp > fiveMinutesAgo)
  const recentAlerts = metrics.alerts.filter(a => a.timestamp > fiveMinutesAgo)

  // Calculate statistics
  const apiStats = {
    total: recentApi.length,
    successful: recentApi.filter(m => m.success).length,
    failed: recentApi.filter(m => !m.success).length,
    averageResponseTime: recentApi.length > 0 
      ? recentApi.reduce((sum, m) => sum + m.responseTime, 0) / recentApi.length 
      : 0,
    maxResponseTime: recentApi.length > 0 
      ? Math.max(...recentApi.map(m => m.responseTime)) 
      : 0,
    minResponseTime: recentApi.length > 0 
      ? Math.min(...recentApi.map(m => m.responseTime)) 
      : 0
  }

  const systemStats = {
    total: recentSystem.length,
    averageMemoryUsage: recentSystem.length > 0 
      ? recentSystem.reduce((sum, m) => sum + m.memory.usagePercent, 0) / recentSystem.length 
      : 0,
    maxMemoryUsage: recentSystem.length > 0 
      ? Math.max(...recentSystem.map(m => m.memory.usagePercent)) 
      : 0,
    minMemoryUsage: recentSystem.length > 0 
      ? Math.min(...recentSystem.map(m => m.memory.usagePercent)) 
      : 0
  }

  const alertStats = {
    total: recentAlerts.length,
    critical: recentAlerts.filter(a => a.severity === 'critical').length,
    warning: recentAlerts.filter(a => a.severity === 'warning').length,
    byType: recentAlerts.reduce((acc, alert) => {
      acc[alert.type] = (acc[alert.type] || 0) + 1
      return acc
    }, {})
  }

  return {
    timestamp: now,
    period: '5m',
    api: apiStats,
    system: systemStats,
    alerts: alertStats,
    health: alertStats.critical > 0 ? 'critical' : alertStats.warning > 0 ? 'warning' : 'healthy'
  }
}

// Display performance report
function displayReport(report) {
  log(`\n${colors.bold}📊 Performance Report - ${new Date(report.timestamp).toLocaleString()}${colors.reset}`, 'blue')
  
  // API Performance
  log(`\n${colors.bold}API Performance:${colors.reset}`, 'cyan')
  log(`  Total Requests: ${report.api.total}`)
  log(`  Successful: ${report.api.successful} (${((report.api.successful / report.api.total) * 100).toFixed(1)}%)`)
  log(`  Failed: ${report.api.failed} (${((report.api.failed / report.api.total) * 100).toFixed(1)}%)`)
  log(`  Average Response Time: ${report.api.averageResponseTime.toFixed(2)}ms`)
  log(`  Max Response Time: ${report.api.maxResponseTime.toFixed(2)}ms`)
  log(`  Min Response Time: ${report.api.minResponseTime.toFixed(2)}ms`)

  // System Performance
  log(`\n${colors.bold}System Performance:${colors.reset}`, 'cyan')
  log(`  Memory Usage: ${report.system.averageMemoryUsage.toFixed(2)}% (avg)`)
  log(`  Max Memory: ${report.system.maxMemoryUsage.toFixed(2)}%`)
  log(`  Min Memory: ${report.system.minMemoryUsage.toFixed(2)}%`)

  // Alerts
  log(`\n${colors.bold}Alerts:${colors.reset}`, 'cyan')
  log(`  Total: ${report.alerts.total}`)
  log(`  Critical: ${report.alerts.critical}`)
  log(`  Warning: ${report.alerts.warning}`)
  
  if (Object.keys(report.alerts.byType).length > 0) {
    log(`  By Type:`)
    Object.entries(report.alerts.byType).forEach(([type, count]) => {
      log(`    ${type}: ${count}`)
    })
  }

  // Health Status
  const healthColor = report.health === 'healthy' ? 'green' : report.health === 'warning' ? 'yellow' : 'red'
  log(`\n${colors.bold}Health Status: ${report.health.toUpperCase()}${colors.reset}`, healthColor)
}

// Save report to file
function saveReport(report) {
  const reportsDir = 'reports/performance'
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true })
  }

  const filename = `performance-report-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  const filepath = path.join(reportsDir, filename)
  
  fs.writeFileSync(filepath, JSON.stringify(report, null, 2))
  logInfo(`Report saved to: ${filepath}`)
}

// Main monitoring loop
async function startMonitoring() {
  log(`${colors.bold}🚀 Starting Performance Monitoring${colors.reset}`, 'blue')
  log(`Base URL: ${config.baseUrl}`)
  log(`Monitoring Interval: ${config.monitoringInterval / 1000}s`)
  log(`Report Interval: ${config.reportInterval / 1000}s`)

  let monitoringCount = 0
  let reportCount = 0

  const monitoringInterval = setInterval(async () => {
    monitoringCount++
    log(`\n${colors.bold}Monitoring Check #${monitoringCount}${colors.reset}`, 'blue')

    try {
      // Check API health
      const apiResult = await checkApiHealth()
      if (apiResult.success) {
        logSuccess(`API Health: ${apiResult.responseTime.toFixed(2)}ms (${apiResult.statusCode})`)
      } else {
        logError(`API Health: ${apiResult.error}`)
      }

      // Check system resources
      const systemResult = checkSystemResources()
      logInfo(`Memory Usage: ${systemResult.memory.usagePercent.toFixed(2)}%`)

      // Check database performance
      const dbResult = await checkDatabasePerformance()
      if (dbResult.success) {
        logSuccess(`Database: ${dbResult.responseTime.toFixed(2)}ms`)
      } else {
        logError(`Database: ${dbResult.error}`)
      }

      // Generate and display report every 5 minutes
      if (monitoringCount % 10 === 0) {
        reportCount++
        const report = generateReport()
        displayReport(report)
        saveReport(report)
      }

    } catch (error) {
      logError(`Monitoring error: ${error.message}`)
    }
  }, config.monitoringInterval)

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    log(`\n${colors.bold}🛑 Shutting down performance monitoring${colors.reset}`, 'yellow')
    clearInterval(monitoringInterval)
    
    // Generate final report
    const finalReport = generateReport()
    displayReport(finalReport)
    saveReport(finalReport)
    
    process.exit(0)
  })
}

// Start monitoring
startMonitoring().catch(error => {
  logError(`Failed to start monitoring: ${error.message}`)
  process.exit(1)
})
