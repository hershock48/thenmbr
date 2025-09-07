import { createClient } from '@supabase/supabase-js'
import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { performanceMonitor } from './performance-monitor'

const execAsync = promisify(exec)

// Backup interfaces
export interface BackupConfig {
  id: string
  name: string
  type: BackupType
  enabled: boolean
  schedule: string
  retention: {
    days: number
    maxBackups: number
  }
  storage: {
    provider: StorageProvider
    config: Record<string, any>
  }
  encryption: {
    enabled: boolean
    key?: string
  }
  compression: boolean
  metadata?: Record<string, any>
}

export interface BackupJob {
  id: string
  configId: string
  type: BackupType
  status: BackupStatus
  startedAt: number
  completedAt?: number
  duration?: number
  size?: number
  location?: string
  checksum?: string
  error?: string
  metadata?: Record<string, any>
}

export interface BackupRestore {
  id: string
  backupId: string
  status: RestoreStatus
  startedAt: number
  completedAt?: number
  duration?: number
  error?: string
  metadata?: Record<string, any>
}

// Enums
export enum BackupType {
  DATABASE = 'database',
  FILES = 'files',
  CONFIGURATION = 'configuration',
  FULL = 'full',
  INCREMENTAL = 'incremental'
}

export enum BackupStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum RestoreStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum StorageProvider {
  S3 = 's3',
  LOCAL = 'local',
  GCS = 'gcs',
  AZURE = 'azure'
}

// Backup service
export class BackupService {
  private configs: Map<string, BackupConfig> = new Map()
  private jobs: Map<string, BackupJob> = new Map()
  private restores: Map<string, BackupRestore> = new Map()
  private supabase: any
  private s3Client?: S3Client
  private backupDir: string
  private isRunning = false

  constructor() {
    this.backupDir = process.env.BACKUP_DIR || './backups'
    this.initializeSupabase()
    this.initializeS3()
    this.loadConfigs()
    this.startScheduler()
  }

  // Initialize Supabase client
  private initializeSupabase() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey)
    }
  }

  // Initialize S3 client
  private initializeS3() {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
    const region = process.env.AWS_REGION || 'us-east-1'

    if (accessKeyId && secretAccessKey) {
      this.s3Client = new S3Client({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey
        }
      })
    }
  }

  // Load backup configurations
  private loadConfigs() {
    // Default configurations
    this.addConfig({
      id: 'database-daily',
      name: 'Daily Database Backup',
      type: BackupType.DATABASE,
      enabled: true,
      schedule: '0 2 * * *', // 2 AM daily
      retention: { days: 30, maxBackups: 30 },
      storage: { provider: StorageProvider.S3, config: { bucket: process.env.BACKUP_S3_BUCKET } },
      encryption: { enabled: true },
      compression: true
    })

    this.addConfig({
      id: 'files-daily',
      name: 'Daily Files Backup',
      type: BackupType.FILES,
      enabled: true,
      schedule: '0 3 * * *', // 3 AM daily
      retention: { days: 14, maxBackups: 14 },
      storage: { provider: StorageProvider.S3, config: { bucket: process.env.BACKUP_S3_BUCKET } },
      encryption: { enabled: true },
      compression: true
    })

    this.addConfig({
      id: 'config-weekly',
      name: 'Weekly Configuration Backup',
      type: BackupType.CONFIGURATION,
      enabled: true,
      schedule: '0 4 * * 0', // 4 AM weekly
      retention: { days: 90, maxBackups: 12 },
      storage: { provider: StorageProvider.S3, config: { bucket: process.env.BACKUP_S3_BUCKET } },
      encryption: { enabled: true },
      compression: true
    })
  }

  // Add backup configuration
  addConfig(config: BackupConfig): void {
    this.configs.set(config.id, config)
    this.saveConfigs()
  }

  // Remove backup configuration
  removeConfig(id: string): boolean {
    const removed = this.configs.delete(id)
    if (removed) {
      this.saveConfigs()
    }
    return removed
  }

  // Get backup configurations
  getConfigs(): BackupConfig[] {
    return Array.from(this.configs.values())
  }

  // Get backup jobs
  getJobs(filters: {
    configId?: string
    type?: BackupType
    status?: BackupStatus
    startTime?: number
    endTime?: number
    limit?: number
  } = {}): BackupJob[] {
    let filtered = Array.from(this.jobs.values())

    if (filters.configId) {
      filtered = filtered.filter(job => job.configId === filters.configId)
    }

    if (filters.type) {
      filtered = filtered.filter(job => job.type === filters.type)
    }

    if (filters.status) {
      filtered = filtered.filter(job => job.status === filters.status)
    }

    if (filters.startTime) {
      filtered = filtered.filter(job => job.startedAt >= filters.startTime!)
    }

    if (filters.endTime) {
      filtered = filtered.filter(job => job.startedAt <= filters.endTime!)
    }

    // Sort by start time (newest first)
    filtered.sort((a, b) => b.startedAt - a.startedAt)

    // Apply limit
    if (filters.limit) {
      filtered = filtered.slice(0, filters.limit)
    }

    return filtered
  }

  // Get restore jobs
  getRestores(filters: {
    backupId?: string
    status?: RestoreStatus
    startTime?: number
    endTime?: number
    limit?: number
  } = {}): BackupRestore[] {
    let filtered = Array.from(this.restores.values())

    if (filters.backupId) {
      filtered = filtered.filter(restore => restore.backupId === filters.backupId)
    }

    if (filters.status) {
      filtered = filtered.filter(restore => restore.status === filters.status)
    }

    if (filters.startTime) {
      filtered = filtered.filter(restore => restore.startedAt >= filters.startTime!)
    }

    if (filters.endTime) {
      filtered = filtered.filter(restore => restore.startedAt <= filters.endTime!)
    }

    // Sort by start time (newest first)
    filtered.sort((a, b) => b.startedAt - a.startedAt)

    // Apply limit
    if (filters.limit) {
      filtered = filtered.slice(0, filters.limit)
    }

    return filtered
  }

  // Create backup
  async createBackup(configId: string, type?: BackupType): Promise<BackupJob> {
    const config = this.configs.get(configId)
    if (!config) {
      throw new Error(`Backup configuration not found: ${configId}`)
    }

    if (!config.enabled) {
      throw new Error(`Backup configuration is disabled: ${configId}`)
    }

    const job: BackupJob = {
      id: this.generateId(),
      configId,
      type: type || config.type,
      status: BackupStatus.PENDING,
      startedAt: Date.now(),
      metadata: {}
    }

    this.jobs.set(job.id, job)

    // Execute backup asynchronously
    this.executeBackup(job, config).catch(error => {
      job.status = BackupStatus.FAILED
      job.error = error.message
      job.completedAt = Date.now()
      job.duration = job.completedAt - job.startedAt
    })

    return job
  }

  // Execute backup
  private async executeBackup(job: BackupJob, config: BackupConfig): Promise<void> {
    try {
      job.status = BackupStatus.RUNNING
      const startTime = Date.now()

      let backupData: Buffer
      let filename: string

      switch (job.type) {
        case BackupType.DATABASE:
          backupData = await this.backupDatabase()
          filename = `database-${new Date().toISOString().replace(/[:.]/g, '-')}.sql`
          break

        case BackupType.FILES:
          backupData = await this.backupFiles()
          filename = `files-${new Date().toISOString().replace(/[:.]/g, '-')}.tar.gz`
          break

        case BackupType.CONFIGURATION:
          backupData = await this.backupConfiguration()
          filename = `config-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
          break

        case BackupType.FULL:
          backupData = await this.backupFull()
          filename = `full-${new Date().toISOString().replace(/[:.]/g, '-')}.tar.gz`
          break

        default:
          throw new Error(`Unsupported backup type: ${job.type}`)
      }

      // Compress if enabled
      if (config.compression) {
        backupData = await this.compress(backupData)
        filename += '.gz'
      }

      // Encrypt if enabled
      if (config.encryption.enabled) {
        backupData = await this.encrypt(backupData, config.encryption.key)
        filename += '.enc'
      }

      // Calculate checksum
      job.checksum = crypto.createHash('sha256').update(backupData).digest('hex')

      // Upload to storage
      job.location = await this.uploadToStorage(backupData, filename, config.storage)

      // Update job status
      job.status = BackupStatus.COMPLETED
      job.completedAt = Date.now()
      job.duration = job.completedAt - job.startedAt
      job.size = backupData.length

      // Record performance metrics
      performanceMonitor.recordMetric(
        'backup_duration',
        `backup_${job.type}`,
        job.duration,
        'ms',
        { configId: config.id, size: job.size }
      )

      // Cleanup old backups
      await this.cleanupOldBackups(config)

    } catch (error) {
      job.status = BackupStatus.FAILED
      job.error = error instanceof Error ? error.message : 'Unknown error'
      job.completedAt = Date.now()
      job.duration = job.completedAt - job.startedAt

      // Record error metrics
      performanceMonitor.recordMetric(
        'backup_error',
        `backup_${job.type}`,
        1,
        'count',
        { configId: config.id, error: job.error }
      )
    }
  }

  // Backup database
  private async backupDatabase(): Promise<Buffer> {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized')
    }

    const dbUrl = process.env.SUPABASE_DB_URL
    if (!dbUrl) {
      throw new Error('Database URL not configured')
    }

    // Extract connection details from URL
    const url = new URL(dbUrl)
    const host = url.hostname
    const port = url.port || '5432'
    const database = url.pathname.slice(1)
    const username = url.username
    const password = url.password

    // Create pg_dump command
    const command = `PGPASSWORD="${password}" pg_dump -h ${host} -p ${port} -U ${username} -d ${database} --no-password --verbose --clean --if-exists --create`

    const { stdout, stderr } = await execAsync(command)
    
    if (stderr && !stderr.includes('WARNING')) {
      throw new Error(`Database backup failed: ${stderr}`)
    }

    return Buffer.from(stdout, 'utf8')
  }

  // Backup files
  private async backupFiles(): Promise<Buffer> {
    const filesDir = process.env.FILES_DIR || './uploads'
    const command = `tar -czf - -C ${filesDir} .`

    const { stdout, stderr } = await execAsync(command)
    
    if (stderr) {
      throw new Error(`Files backup failed: ${stderr}`)
    }

    return stdout
  }

  // Backup configuration
  private async backupConfiguration(): Promise<Buffer> {
    const configFiles = [
      '.env.local',
      '.env.production',
      'next.config.js',
      'package.json',
      'tsconfig.json',
      'tailwind.config.js'
    ]

    const configData: Record<string, any> = {}

    for (const file of configFiles) {
      try {
        const content = await fs.readFile(file, 'utf8')
        configData[file] = content
      } catch (error) {
        // Skip files that don't exist
        continue
      }
    }

    return Buffer.from(JSON.stringify(configData, null, 2), 'utf8')
  }

  // Full backup
  private async backupFull(): Promise<Buffer> {
    const command = `tar -czf - --exclude=node_modules --exclude=.git --exclude=backups .`

    const { stdout, stderr } = await execAsync(command)
    
    if (stderr) {
      throw new Error(`Full backup failed: ${stderr}`)
    }

    return stdout
  }

  // Compress data
  private async compress(data: Buffer): Promise<Buffer> {
    const zlib = require('zlib')
    return new Promise((resolve, reject) => {
      zlib.gzip(data, (err: Error | null, result: Buffer) => {
        if (err) reject(err)
        else resolve(result)
      })
    })
  }

  // Encrypt data
  private async encrypt(data: Buffer, key?: string): Promise<Buffer> {
    const encryptionKey = key || process.env.BACKUP_ENCRYPTION_KEY || 'default-key'
    const cipher = crypto.createCipher('aes-256-cbc', encryptionKey)
    
    let encrypted = cipher.update(data)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    
    return encrypted
  }

  // Upload to storage
  private async uploadToStorage(data: Buffer, filename: string, storage: BackupConfig['storage']): Promise<string> {
    const timestamp = new Date().toISOString().split('T')[0]
    const key = `backups/${timestamp}/${filename}`

    switch (storage.provider) {
      case StorageProvider.S3:
        if (!this.s3Client) {
          throw new Error('S3 client not initialized')
        }

        const command = new PutObjectCommand({
          Bucket: storage.config.bucket,
          Key: key,
          Body: data,
          ContentType: 'application/octet-stream',
          Metadata: {
            'backup-type': 'database',
            'created-at': new Date().toISOString()
          }
        })

        await this.s3Client.send(command)
        return `s3://${storage.config.bucket}/${key}`

      case StorageProvider.LOCAL:
        const localPath = path.join(this.backupDir, key)
        await fs.mkdir(path.dirname(localPath), { recursive: true })
        await fs.writeFile(localPath, data)
        return localPath

      default:
        throw new Error(`Unsupported storage provider: ${storage.provider}`)
    }
  }

  // Cleanup old backups
  private async cleanupOldBackups(config: BackupConfig): Promise<void> {
    const cutoffTime = Date.now() - (config.retention.days * 24 * 60 * 60 * 1000)
    const oldJobs = this.getJobs({
      configId: config.id,
      endTime: cutoffTime
    })

    for (const job of oldJobs) {
      if (job.location && job.status === BackupStatus.COMPLETED) {
        await this.deleteBackup(job.location, config.storage)
        this.jobs.delete(job.id)
      }
    }
  }

  // Delete backup
  private async deleteBackup(location: string, storage: BackupConfig['storage']): Promise<void> {
    switch (storage.provider) {
      case StorageProvider.S3:
        if (!this.s3Client) return

        const s3Url = new URL(location)
        const bucket = s3Url.hostname
        const key = s3Url.pathname.slice(1)

        const command = new DeleteObjectCommand({
          Bucket: bucket,
          Key: key
        })

        await this.s3Client.send(command)
        break

      case StorageProvider.LOCAL:
        await fs.unlink(location)
        break
    }
  }

  // Restore backup
  async restoreBackup(backupId: string, targetLocation?: string): Promise<BackoreRestore> {
    const job = this.jobs.get(backupId)
    if (!job) {
      throw new Error(`Backup job not found: ${backupId}`)
    }

    if (job.status !== BackupStatus.COMPLETED) {
      throw new Error(`Backup job not completed: ${backupId}`)
    }

    const restore: BackupRestore = {
      id: this.generateId(),
      backupId,
      status: RestoreStatus.PENDING,
      startedAt: Date.now(),
      metadata: {}
    }

    this.restores.set(restore.id, restore)

    // Execute restore asynchronously
    this.executeRestore(restore, job, targetLocation).catch(error => {
      restore.status = RestoreStatus.FAILED
      restore.error = error.message
      restore.completedAt = Date.now()
      restore.duration = restore.completedAt - restore.startedAt
    })

    return restore
  }

  // Execute restore
  private async executeRestore(restore: BackupRestore, job: BackupJob, targetLocation?: string): Promise<void> {
    try {
      restore.status = RestoreStatus.RUNNING

      // Download backup data
      const backupData = await this.downloadFromStorage(job.location!, job.configId)

      // Decrypt if needed
      let decryptedData = backupData
      if (job.location!.endsWith('.enc')) {
        decryptedData = await this.decrypt(backupData)
      }

      // Decompress if needed
      let decompressedData = decryptedData
      if (job.location!.endsWith('.gz')) {
        decompressedData = await this.decompress(decryptedData)
      }

      // Restore based on type
      switch (job.type) {
        case BackupType.DATABASE:
          await this.restoreDatabase(decompressedData)
          break

        case BackupType.FILES:
          await this.restoreFiles(decompressedData, targetLocation)
          break

        case BackupType.CONFIGURATION:
          await this.restoreConfiguration(decompressedData)
          break

        case BackupType.FULL:
          await this.restoreFull(decompressedData, targetLocation)
          break

        default:
          throw new Error(`Unsupported restore type: ${job.type}`)
      }

      restore.status = RestoreStatus.COMPLETED
      restore.completedAt = Date.now()
      restore.duration = restore.completedAt - restore.startedAt

    } catch (error) {
      restore.status = RestoreStatus.FAILED
      restore.error = error instanceof Error ? error.message : 'Unknown error'
      restore.completedAt = Date.now()
      restore.duration = restore.completedAt - restore.startedAt
    }
  }

  // Download from storage
  private async downloadFromStorage(location: string, configId: string): Promise<Buffer> {
    const config = this.configs.get(configId)
    if (!config) {
      throw new Error(`Backup configuration not found: ${configId}`)
    }

    switch (config.storage.provider) {
      case StorageProvider.S3:
        // Implementation for S3 download
        throw new Error('S3 download not implemented')

      case StorageProvider.LOCAL:
        return await fs.readFile(location)

      default:
        throw new Error(`Unsupported storage provider: ${config.storage.provider}`)
    }
  }

  // Decrypt data
  private async decrypt(data: Buffer): Promise<Buffer> {
    const encryptionKey = process.env.BACKUP_ENCRYPTION_KEY || 'default-key'
    const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey)
    
    let decrypted = decipher.update(data)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    
    return decrypted
  }

  // Decompress data
  private async decompress(data: Buffer): Promise<Buffer> {
    const zlib = require('zlib')
    return new Promise((resolve, reject) => {
      zlib.gunzip(data, (err: Error | null, result: Buffer) => {
        if (err) reject(err)
        else resolve(result)
      })
    })
  }

  // Restore database
  private async restoreDatabase(data: Buffer): Promise<void> {
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

    const command = `PGPASSWORD="${password}" psql -h ${host} -p ${port} -U ${username} -d ${database} --no-password`

    const { stdin } = require('child_process').spawn('sh', ['-c', command])
    stdin.write(data)
    stdin.end()
  }

  // Restore files
  private async restoreFiles(data: Buffer, targetLocation?: string): Promise<void> {
    const targetDir = targetLocation || process.env.FILES_DIR || './uploads'
    const command = `tar -xzf - -C ${targetDir}`

    const { stdin } = require('child_process').spawn('sh', ['-c', command])
    stdin.write(data)
    stdin.end()
  }

  // Restore configuration
  private async restoreConfiguration(data: Buffer): Promise<void> {
    const configData = JSON.parse(data.toString('utf8'))

    for (const [filename, content] of Object.entries(configData)) {
      await fs.writeFile(filename, content as string)
    }
  }

  // Restore full backup
  private async restoreFull(data: Buffer, targetLocation?: string): Promise<void> {
    const targetDir = targetLocation || './'
    const command = `tar -xzf - -C ${targetDir}`

    const { stdin } = require('child_process').spawn('sh', ['-c', command])
    stdin.write(data)
    stdin.end()
  }

  // Start backup scheduler
  private startScheduler(): void {
    setInterval(() => {
      if (this.isRunning) return

      this.isRunning = true
      this.runScheduledBackups()
        .finally(() => {
          this.isRunning = false
        })
    }, 60000) // Check every minute
  }

  // Run scheduled backups
  private async runScheduledBackups(): Promise<void> {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()

    for (const config of this.configs.values()) {
      if (!config.enabled) continue

      // Simple cron-like scheduling (hour:minute)
      const [hour, minute] = config.schedule.split(' ')[1].split(':').map(Number)
      const scheduledTime = hour * 60 + minute

      if (Math.abs(currentTime - scheduledTime) < 1) {
        // Check if backup already ran today
        const today = now.toISOString().split('T')[0]
        const todayJobs = this.getJobs({
          configId: config.id,
          startTime: new Date(today).getTime()
        })

        if (todayJobs.length === 0) {
          await this.createBackup(config.id)
        }
      }
    }
  }

  // Save configurations
  private saveConfigs(): void {
    const configs = Array.from(this.configs.values())
    // In a real implementation, save to database or file
    console.log('Saving backup configurations:', configs.length)
  }

  // Generate unique ID
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
  }
}

// Export singleton instance
export const backupService = new BackupService()

export default BackupService
