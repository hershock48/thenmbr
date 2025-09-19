'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Database, 
  FileText, 
  Settings, 
  Download, 
  Upload, 
  Trash2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  HardDrive,
  Shield,
  Archive
} from 'lucide-react'
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext'
import { BackupType, BackupStatus, RestoreStatus, StorageProvider } from '@/lib/backup-service'

interface BackupConfig {
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
  }
  compression: boolean
}

interface BackupJob {
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
}

interface BackupRestore {
  id: string
  backupId: string
  status: RestoreStatus
  startedAt: number
  completedAt?: number
  duration?: number
  error?: string
}

export function BackupManagement() {
  const { user, hasPermission, isAdmin } = useEnhancedAuth()
  const [configs, setConfigs] = useState<BackupConfig[]>([])
  const [jobs, setJobs] = useState<BackupJob[]>([])
  const [restores, setRestores] = useState<BackupRestore[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState<'configs' | 'jobs' | 'restores'>('configs')
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Check if user has permission to manage backups
  if (!hasPermission('MANAGE_SYSTEM') && !isAdmin()) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <Shield className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          You don't have permission to manage backups.
        </AlertDescription>
      </Alert>
    )
  }

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch backup configurations
      const configsResponse = await fetch('/api/backup/configs')
      if (configsResponse.ok) {
        const configsData = await configsResponse.json()
        setConfigs(configsData.configs || [])
      }

      // Fetch backup jobs
      const jobsResponse = await fetch('/api/backup/jobs')
      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json()
        setJobs(jobsData.jobs || [])
      }

      // Fetch restore jobs
      const restoresResponse = await fetch('/api/backup/restores')
      if (restoresResponse.ok) {
        const restoresData = await restoresResponse.json()
        setRestores(restoresData.restores || [])
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch backup data')
    } finally {
      setIsLoading(false)
    }
  }

  const createBackup = async (configId: string) => {
    try {
      const response = await fetch(`/api/backup/configs/${configId}/backup`, {
        method: 'POST'
      })
      
      if (response.ok) {
        await fetchData()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create backup')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create backup')
    }
  }

  const restoreBackup = async (backupId: string) => {
    try {
      const response = await fetch(`/api/backup/jobs/${backupId}/restore`, {
        method: 'POST'
      })
      
      if (response.ok) {
        await fetchData()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to restore backup')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore backup')
    }
  }

  const deleteBackup = async (backupId: string) => {
    try {
      const response = await fetch(`/api/backup/jobs/${backupId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchData()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to delete backup')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete backup')
    }
  }

  const toggleConfig = async (configId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/backup/configs/${configId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
      })
      
      if (response.ok) {
        await fetchData()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update configuration')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update configuration')
    }
  }

  useEffect(() => {
    fetchData()
    
    // Auto-refresh every 30 seconds if enabled
    let interval: NodeJS.Timeout | null = null
    if (autoRefresh) {
      interval = setInterval(fetchData, 30000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatDuration = (duration?: number) => {
    if (!duration) return 'N/A'
    const seconds = Math.floor(duration / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }

  const formatSize = (size?: number) => {
    if (!size) return 'N/A'
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let unitIndex = 0
    let fileSize = size
    
    while (fileSize >= 1024 && unitIndex < units.length - 1) {
      fileSize /= 1024
      unitIndex++
    }
    
    return `${fileSize.toFixed(2)} ${units[unitIndex]}`
  }

  const getStatusColor = (status: BackupStatus | RestoreStatus) => {
    switch (status) {
      case BackupStatus.COMPLETED:
      case RestoreStatus.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-200'
      case BackupStatus.RUNNING:
      case RestoreStatus.RUNNING:
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case BackupStatus.FAILED:
      case RestoreStatus.FAILED:
        return 'bg-red-100 text-red-800 border-red-200'
      case BackupStatus.PENDING:
      case RestoreStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case BackupStatus.CANCELLED:
      case RestoreStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: BackupStatus | RestoreStatus) => {
    switch (status) {
      case BackupStatus.COMPLETED:
      case RestoreStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4" />
      case BackupStatus.RUNNING:
      case RestoreStatus.RUNNING:
        return <RefreshCw className="h-4 w-4 animate-spin" />
      case BackupStatus.FAILED:
      case RestoreStatus.FAILED:
        return <XCircle className="h-4 w-4" />
      case BackupStatus.PENDING:
      case RestoreStatus.PENDING:
        return <Clock className="h-4 w-4" />
      case BackupStatus.CANCELLED:
      case RestoreStatus.CANCELLED:
        return <Pause className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getTypeIcon = (type: BackupType) => {
    switch (type) {
      case BackupType.DATABASE:
        return <Database className="h-4 w-4" />
      case BackupType.FILES:
        return <FileText className="h-4 w-4" />
      case BackupType.CONFIGURATION:
        return <Settings className="h-4 w-4" />
      case BackupType.FULL:
        return <Archive className="h-4 w-4" />
      case BackupType.INCREMENTAL:
        return <HardDrive className="h-4 w-4" />
      default:
        return <Archive className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Backup Management</h2>
          <Button disabled>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Error loading backup data: {error}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Backup Management</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </Button>
          <Button onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Configs</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{configs.length}</div>
            <p className="text-xs text-muted-foreground">
              {configs.filter(c => c.enabled).length} enabled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.length}</div>
            <p className="text-xs text-muted-foreground">
              {jobs.filter(j => j.status === BackupStatus.COMPLETED).length} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running Jobs</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {jobs.filter(j => j.status === BackupStatus.RUNNING).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Jobs</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {jobs.filter(j => j.status === BackupStatus.FAILED).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'configs'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setSelectedTab('configs')}
        >
          Configurations
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'jobs'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setSelectedTab('jobs')}
        >
          Backup Jobs
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'restores'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setSelectedTab('restores')}
        >
          Restore Jobs
        </button>
      </div>

      {/* Configurations Tab */}
      {selectedTab === 'configs' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Backup Configurations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {configs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No backup configurations found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {configs.map((config) => (
                  <div
                    key={config.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(config.type)}
                        <div>
                          <h3 className="font-medium">{config.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {config.type} • {config.schedule} • {config.retention.days} days retention
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={config.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {config.enabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                            {config.encryption.enabled && (
                              <Badge className="bg-blue-100 text-blue-800">
                                <Shield className="h-3 w-3 mr-1" />
                                Encrypted
                              </Badge>
                            )}
                            {config.compression && (
                              <Badge className="bg-purple-100 text-purple-800">
                                Compressed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleConfig(config.id, !config.enabled)}
                        >
                          {config.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          {config.enabled ? 'Disable' : 'Enable'}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => createBackup(config.id)}
                          disabled={!config.enabled}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Run Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Backup Jobs Tab */}
      {selectedTab === 'jobs' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Archive className="h-5 w-5 mr-2" />
              Backup Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Archive className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No backup jobs found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(job.type)}
                        <div>
                          <h3 className="font-medium">{job.type} Backup</h3>
                          <p className="text-sm text-muted-foreground">
                            Started: {formatTimestamp(job.startedAt)}
                            {job.completedAt && (
                              <> • Completed: {formatTimestamp(job.completedAt)}</>
                            )}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getStatusColor(job.status)}>
                              {getStatusIcon(job.status)}
                              <span className="ml-1">{job.status}</span>
                            </Badge>
                            {job.duration && (
                              <span className="text-xs text-muted-foreground">
                                Duration: {formatDuration(job.duration)}
                              </span>
                            )}
                            {job.size && (
                              <span className="text-xs text-muted-foreground">
                                Size: {formatSize(job.size)}
                              </span>
                            )}
                          </div>
                          {job.error && (
                            <p className="text-sm text-red-600 mt-1">
                              Error: {job.error}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {job.status === BackupStatus.COMPLETED && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => restoreBackup(job.id)}
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Restore
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteBackup(job.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Restore Jobs Tab */}
      {selectedTab === 'restores' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <RotateCcw className="h-5 w-5 mr-2" />
              Restore Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {restores.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <RotateCcw className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No restore jobs found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {restores.map((restore) => (
                  <div
                    key={restore.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <RotateCcw className="h-4 w-4" />
                        <div>
                          <h3 className="font-medium">Restore Job</h3>
                          <p className="text-sm text-muted-foreground">
                            Started: {formatTimestamp(restore.startedAt)}
                            {restore.completedAt && (
                              <> • Completed: {formatTimestamp(restore.completedAt)}</>
                            )}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getStatusColor(restore.status)}>
                              {getStatusIcon(restore.status)}
                              <span className="ml-1">{restore.status}</span>
                            </Badge>
                            {restore.duration && (
                              <span className="text-xs text-muted-foreground">
                                Duration: {formatDuration(restore.duration)}
                              </span>
                            )}
                          </div>
                          {restore.error && (
                            <p className="text-sm text-red-600 mt-1">
                              Error: {restore.error}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default BackupManagement
