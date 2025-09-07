#!/usr/bin/env node

/**
 * Backup Automation Script
 * Automated backup management and monitoring
 */

const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const { promisify } = require('util')

const execAsync = promisify(exec)

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

// Backup configuration
const config = {
  baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
  backupDir: process.env.BACKUP_DIR || './backups',
  retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30'),
  maxBackups: parseInt(process.env.BACKUP_MAX_BACKUPS || '30'),
  compression: process.env.BACKUP_COMPRESSION === 'true',
  encryption: process.env.BACKUP_ENCRYPTION === 'true',
  encryptionKey: process.env.BACKUP_ENCRYPTION_KEY || 'default-key'
}

// Backup types
const BACKUP_TYPES = {
  DATABASE: 'database',
  FILES: 'files',
  CONFIGURATION: 'configuration',
  FULL: 'full'
}

// Create backup directory
async function ensureBackupDir() {
  if (!fs.existsSync(config.backupDir)) {
    await fs.mkdir(config.backupDir, { recursive: true })
    logSuccess(`Created backup directory: ${config.backupDir}`)
  }
}

// Database backup
async function backupDatabase() {
  logInfo('Starting database backup...')
  
  const dbUrl = process.env.SUPABASE_DB_URL
  if (!dbUrl) {
    throw new Error('Database URL not configured')
  }

  const url = new URL(dbUrl)
  const host = url.hostname
  const port = url.port || '5432'
  const database = url.pathname.slice(1)
  const username = url.username
  const password = url.password

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `database-${timestamp}.sql`
  const filepath = path.join(config.backupDir, filename)

  const command = `PGPASSWORD="${password}" pg_dump -h ${host} -p ${port} -U ${username} -d ${database} --no-password --verbose --clean --if-exists --create -f "${filepath}"`

  try {
    const { stdout, stderr } = await execAsync(command)
    
    if (stderr && !stderr.includes('WARNING')) {
      throw new Error(`Database backup failed: ${stderr}`)
    }

    const stats = await fs.stat(filepath)
    logSuccess(`Database backup completed: ${filename} (${formatSize(stats.size)})`)
    
    return { filename, filepath, size: stats.size }
  } catch (error) {
    logError(`Database backup failed: ${error.message}`)
    throw error
  }
}

// Files backup
async function backupFiles() {
  logInfo('Starting files backup...')
  
  const filesDir = process.env.FILES_DIR || './uploads'
  if (!fs.existsSync(filesDir)) {
    logWarning(`Files directory does not exist: ${filesDir}`)
    return null
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `files-${timestamp}.tar.gz`
  const filepath = path.join(config.backupDir, filename)

  const command = `tar -czf "${filepath}" -C "${filesDir}" .`

  try {
    const { stdout, stderr } = await execAsync(command)
    
    if (stderr) {
      throw new Error(`Files backup failed: ${stderr}`)
    }

    const stats = await fs.stat(filepath)
    logSuccess(`Files backup completed: ${filename} (${formatSize(stats.size)})`)
    
    return { filename, filepath, size: stats.size }
  } catch (error) {
    logError(`Files backup failed: ${error.message}`)
    throw error
  }
}

// Configuration backup
async function backupConfiguration() {
  logInfo('Starting configuration backup...')
  
  const configFiles = [
    '.env.local',
    '.env.production',
    'next.config.js',
    'package.json',
    'tsconfig.json',
    'tailwind.config.js',
    'vercel.json',
    'docker-compose.yml',
    'Dockerfile'
  ]

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `config-${timestamp}.json`
  const filepath = path.join(config.backupDir, filename)

  const configData = {}

  for (const file of configFiles) {
    try {
      const content = await fs.readFile(file, 'utf8')
      configData[file] = content
    } catch (error) {
      // Skip files that don't exist
      continue
    }
  }

  await fs.writeFile(filepath, JSON.stringify(configData, null, 2))
  
  const stats = await fs.stat(filepath)
  logSuccess(`Configuration backup completed: ${filename} (${formatSize(stats.size)})`)
  
  return { filename, filepath, size: stats.size }
}

// Full backup
async function backupFull() {
  logInfo('Starting full backup...')
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `full-${timestamp}.tar.gz`
  const filepath = path.join(config.backupDir, filename)

  const command = `tar -czf "${filepath}" --exclude=node_modules --exclude=.git --exclude=backups --exclude=.next .`

  try {
    const { stdout, stderr } = await execAsync(command)
    
    if (stderr) {
      throw new Error(`Full backup failed: ${stderr}`)
    }

    const stats = await fs.stat(filepath)
    logSuccess(`Full backup completed: ${filename} (${formatSize(stats.size)})`)
    
    return { filename, filepath, size: stats.size }
  } catch (error) {
    logError(`Full backup failed: ${error.message}`)
    throw error
  }
}

// Compress file
async function compressFile(filepath) {
  if (!config.compression) return filepath

  logInfo('Compressing backup...')
  
  const compressedPath = filepath + '.gz'
  const command = `gzip -c "${filepath}" > "${compressedPath}"`

  try {
    await execAsync(command)
    await fs.unlink(filepath) // Remove original file
    logSuccess('Backup compressed successfully')
    return compressedPath
  } catch (error) {
    logError(`Compression failed: ${error.message}`)
    throw error
  }
}

// Encrypt file
async function encryptFile(filepath) {
  if (!config.encryption) return filepath

  logInfo('Encrypting backup...')
  
  const encryptedPath = filepath + '.enc'
  const command = `openssl enc -aes-256-cbc -salt -in "${filepath}" -out "${encryptedPath}" -pass pass:"${config.encryptionKey}"`

  try {
    await execAsync(command)
    await fs.unlink(filepath) // Remove unencrypted file
    logSuccess('Backup encrypted successfully')
    return encryptedPath
  } catch (error) {
    logError(`Encryption failed: ${error.message}`)
    throw error
  }
}

// Upload to S3
async function uploadToS3(filepath, filename) {
  const s3Bucket = process.env.BACKUP_S3_BUCKET
  if (!s3Bucket) {
    logWarning('S3 bucket not configured, skipping upload')
    return null
  }

  logInfo('Uploading to S3...')
  
  const s3Key = `backups/${new Date().toISOString().split('T')[0]}/${filename}`
  const command = `aws s3 cp "${filepath}" "s3://${s3Bucket}/${s3Key}"`

  try {
    await execAsync(command)
    logSuccess(`Uploaded to S3: s3://${s3Bucket}/${s3Key}`)
    return `s3://${s3Bucket}/${s3Key}`
  } catch (error) {
    logError(`S3 upload failed: ${error.message}`)
    throw error
  }
}

// Cleanup old backups
async function cleanupOldBackups() {
  logInfo('Cleaning up old backups...')
  
  const files = await fs.readdir(config.backupDir)
  const backupFiles = files.filter(file => 
    file.match(/\.(sql|tar\.gz|json)(\.gz)?(\.enc)?$/)
  )

  // Sort by modification time (oldest first)
  const sortedFiles = await Promise.all(
    backupFiles.map(async (file) => {
      const filepath = path.join(config.backupDir, file)
      const stats = await fs.stat(filepath)
      return { file, filepath, mtime: stats.mtime }
    })
  )
  sortedFiles.sort((a, b) => a.mtime - b.mtime)

  // Remove old backups
  const cutoffTime = new Date()
  cutoffTime.setDate(cutoffTime.getDate() - config.retentionDays)

  let removedCount = 0
  for (const { file, filepath, mtime } of sortedFiles) {
    if (mtime < cutoffTime || removedCount < sortedFiles.length - config.maxBackups) {
      await fs.unlink(filepath)
      logInfo(`Removed old backup: ${file}`)
      removedCount++
    }
  }

  if (removedCount > 0) {
    logSuccess(`Cleaned up ${removedCount} old backups`)
  } else {
    logInfo('No old backups to clean up')
  }
}

// Generate backup report
async function generateReport(backups) {
  const report = {
    timestamp: new Date().toISOString(),
    config: {
      backupDir: config.backupDir,
      retentionDays: config.retentionDays,
      maxBackups: config.maxBackups,
      compression: config.compression,
      encryption: config.encryption
    },
    backups: backups.map(backup => ({
      type: backup.type,
      filename: backup.filename,
      size: backup.size,
      location: backup.location,
      success: backup.success,
      error: backup.error
    })),
    summary: {
      total: backups.length,
      successful: backups.filter(b => b.success).length,
      failed: backups.filter(b => !b.success).length,
      totalSize: backups.reduce((sum, b) => sum + (b.size || 0), 0)
    }
  }

  const reportPath = path.join(config.backupDir, `backup-report-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2))
  
  logSuccess(`Backup report generated: ${reportPath}`)
  return report
}

// Format file size
function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let unitIndex = 0
  let size = bytes
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`
}

// Main backup function
async function runBackup(backupType) {
  log(`${colors.bold}🚀 Starting ${backupType} backup${colors.reset}`, 'blue')
  
  await ensureBackupDir()
  
  const backups = []
  let success = true

  try {
    let backup
    switch (backupType) {
      case BACKUP_TYPES.DATABASE:
        backup = await backupDatabase()
        break
      case BACKUP_TYPES.FILES:
        backup = await backupFiles()
        break
      case BACKUP_TYPES.CONFIGURATION:
        backup = await backupConfiguration()
        break
      case BACKUP_TYPES.FULL:
        backup = await backupFull()
        break
      default:
        throw new Error(`Unknown backup type: ${backupType}`)
    }

    if (backup) {
      // Compress if enabled
      if (config.compression) {
        backup.filepath = await compressFile(backup.filepath)
        backup.filename = path.basename(backup.filepath)
      }

      // Encrypt if enabled
      if (config.encryption) {
        backup.filepath = await encryptFile(backup.filepath)
        backup.filename = path.basename(backup.filepath)
      }

      // Upload to S3 if configured
      backup.location = await uploadToS3(backup.filepath, backup.filename)

      backups.push({
        type: backupType,
        filename: backup.filename,
        size: backup.size,
        location: backup.location,
        success: true
      })
    }

  } catch (error) {
    logError(`Backup failed: ${error.message}`)
    backups.push({
      type: backupType,
      filename: null,
      size: 0,
      location: null,
      success: false,
      error: error.message
    })
    success = false
  }

  // Cleanup old backups
  await cleanupOldBackups()

  // Generate report
  const report = await generateReport(backups)

  // Display summary
  log(`\n${colors.bold}📊 Backup Summary${colors.reset}`, 'blue')
  log(`Total: ${report.summary.total}`)
  log(`Successful: ${report.summary.successful}`, 'green')
  log(`Failed: ${report.summary.failed}`, 'red')
  log(`Total Size: ${formatSize(report.summary.totalSize)}`)

  if (success) {
    log(`\n${colors.bold}🎉 Backup completed successfully!${colors.reset}`, 'green')
  } else {
    log(`\n${colors.bold}💥 Backup completed with errors${colors.reset}`, 'red')
    process.exit(1)
  }
}

// Command line interface
const args = process.argv.slice(2)
const command = args[0]
const backupType = args[1]

switch (command) {
  case 'database':
    runBackup(BACKUP_TYPES.DATABASE)
    break
  case 'files':
    runBackup(BACKUP_TYPES.FILES)
    break
  case 'config':
    runBackup(BACKUP_TYPES.CONFIGURATION)
    break
  case 'full':
    runBackup(BACKUP_TYPES.FULL)
    break
  case 'all':
    Promise.all([
      runBackup(BACKUP_TYPES.DATABASE),
      runBackup(BACKUP_TYPES.FILES),
      runBackup(BACKUP_TYPES.CONFIGURATION)
    ])
    break
  case 'cleanup':
    ensureBackupDir().then(cleanupOldBackups)
    break
  default:
    log(`${colors.bold}Backup Automation Script${colors.reset}`, 'blue')
    log('Usage: node backup-automation.js <command> [type]')
    log('')
    log('Commands:')
    log('  database    - Backup database')
    log('  files       - Backup files')
    log('  config      - Backup configuration')
    log('  full        - Full system backup')
    log('  all         - Run all backups')
    log('  cleanup     - Clean up old backups')
    log('')
    log('Examples:')
    log('  node backup-automation.js database')
    log('  node backup-automation.js files')
    log('  node backup-automation.js all')
    log('  node backup-automation.js cleanup')
    break
}
