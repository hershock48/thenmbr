'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database, 
  Users, 
  Zap,
  RefreshCw,
  Shield,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Server,
  Eye,
  Filter
} from 'lucide-react'
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext'
import { LogLevel, LogCategory } from '@/lib/monitoring'

interface LogEntry {
  id: string
  timestamp: string
  level: LogLevel
  category: LogCategory
  message: string
  context: Record<string, any>
  userId?: string
  sessionId?: string
  requestId?: string
  ipAddress?: string
  userAgent?: string
  organizationId?: string
  endpoint?: string
  method?: string
  statusCode?: number
  duration?: number
  error?: {
    name: string
    message: string
    stack?: string
    code?: string
  }
  tags?: string[]
  metadata?: Record<string, any>
}

interface MonitoringStats {
  totalLogs: number
  logsByLevel: Record<LogLevel, number>
  logsByCategory: Record<LogCategory, number>
  errorRate: number
  averageResponseTime: number
  activeUsers: number
  systemHealth: {
    status: 'healthy' | 'degraded' | 'unhealthy'
    uptime: number
    memoryUsage: number
    cpuUsage: number
    diskUsage: number
    databaseConnections: number
    errorRate: number
    responseTime: number
    throughput: number
  }
  recentErrors: LogEntry[]
  topEndpoints: Array<{
    endpoint: string
    requests: number
    averageResponseTime: number
    errorRate: number
  }>
}

export function MonitoringDashboard() {
  const { user, hasPermission, isAdmin } = useEnhancedAuth()
  const [stats, setStats] = useState<MonitoringStats | null>(null)
  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = useState<LogCategory | 'all'>('all')
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Check if user has permission to view monitoring
  if (!hasPermission('VIEW_LOGS') && !isAdmin()) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <Shield className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          You don't have permission to view monitoring information.
        </AlertDescription>
      </Alert>
    )
  }

  const fetchMonitoringData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch monitoring statistics
      const statsResponse = await fetch('/api/monitoring/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Fetch recent logs
      const logsResponse = await fetch('/api/monitoring/logs?' + new URLSearchParams({
        limit: '100',
        level: selectedLevel !== 'all' ? selectedLevel : '',
        category: selectedCategory !== 'all' ? selectedCategory : ''
      }))
      if (logsResponse.ok) {
        const logsData = await logsResponse.json()
        setRecentLogs(logsData)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch monitoring data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMonitoringData()
    
    // Auto-refresh every 10 seconds if enabled
    let interval: NodeJS.Timeout | null = null
    if (autoRefresh) {
      interval = setInterval(fetchMonitoringData, 10000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [selectedLevel, selectedCategory, autoRefresh])

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case LogLevel.DEBUG: return 'bg-gray-100 text-gray-800 border-gray-200'
      case LogLevel.INFO: return 'bg-blue-100 text-blue-800 border-blue-200'
      case LogLevel.WARN: return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case LogLevel.ERROR: return 'bg-red-100 text-red-800 border-red-200'
      case LogLevel.FATAL: return 'bg-red-200 text-red-900 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryIcon = (category: LogCategory) => {
    switch (category) {
      case LogCategory.AUTH: return <Shield className="h-4 w-4" />
      case LogCategory.API: return <Zap className="h-4 w-4" />
      case LogCategory.DATABASE: return <Database className="h-4 w-4" />
      case LogCategory.SECURITY: return <Shield className="h-4 w-4" />
      case LogCategory.PERFORMANCE: return <TrendingUp className="h-4 w-4" />
      case LogCategory.BUSINESS: return <BarChart3 className="h-4 w-4" />
      case LogCategory.SYSTEM: return <Server className="h-4 w-4" />
      case LogCategory.USER_ACTION: return <Users className="h-4 w-4" />
      case LogCategory.ERROR: return <AlertTriangle className="h-4 w-4" />
      case LogCategory.AUDIT: return <Eye className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600'
      case 'degraded': return 'text-yellow-600'
      case 'unhealthy': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Monitoring Dashboard</h2>
          <Button disabled>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
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
          Error loading monitoring data: {error}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Monitoring Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </Button>
          <Button onClick={fetchMonitoringData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      {stats?.systemHealth && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getHealthStatusColor(stats.systemHealth.status)}`}>
                {stats.systemHealth.status.toUpperCase()}
              </div>
              <p className="text-xs text-muted-foreground">
                Uptime: {Math.floor(stats.systemHealth.uptime / 3600)}h
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.systemHealth.memoryUsage.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.systemHealth.memoryUsage > 80 ? 'High usage' : 'Normal'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.systemHealth.cpuUsage.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.systemHealth.cpuUsage > 80 ? 'High load' : 'Normal'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.systemHealth.errorRate.toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.systemHealth.errorRate > 5 ? 'High error rate' : 'Normal'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Log Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLogs.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Last 24 hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.errorRate.toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.errorRate > 5 ? 'High error rate' : 'Normal'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageResponseTime.toFixed(0)}ms</div>
              <p className="text-xs text-muted-foreground">
                {stats.averageResponseTime > 1000 ? 'Slow responses' : 'Good performance'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                Currently online
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Log Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Log Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <label htmlFor="level-select" className="text-sm font-medium">Level:</label>
              <select
                id="level-select"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as LogLevel | 'all')}
                className="px-3 py-1 border rounded-md text-sm"
                aria-label="Select log level"
              >
                <option value="all">All Levels</option>
                <option value={LogLevel.DEBUG}>Debug</option>
                <option value={LogLevel.INFO}>Info</option>
                <option value={LogLevel.WARN}>Warn</option>
                <option value={LogLevel.ERROR}>Error</option>
                <option value={LogLevel.FATAL}>Fatal</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="category-select" className="text-sm font-medium">Category:</label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as LogCategory | 'all')}
                className="px-3 py-1 border rounded-md text-sm"
                aria-label="Select log category"
              >
                <option value="all">All Categories</option>
                <option value={LogCategory.AUTH}>Auth</option>
                <option value={LogCategory.API}>API</option>
                <option value={LogCategory.DATABASE}>Database</option>
                <option value={LogCategory.SECURITY}>Security</option>
                <option value={LogCategory.PERFORMANCE}>Performance</option>
                <option value={LogCategory.BUSINESS}>Business</option>
                <option value={LogCategory.SYSTEM}>System</option>
                <option value={LogCategory.USER_ACTION}>User Action</option>
                <option value={LogCategory.ERROR}>Error</option>
                <option value={LogCategory.AUDIT}>Audit</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Recent Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>No logs found</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {getCategoryIcon(log.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={getLevelColor(log.level)}>
                        {log.level}
                      </Badge>
                      <Badge variant="outline">
                        {log.category}
                      </Badge>
                      {log.endpoint && (
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {log.method} {log.endpoint}
                        </code>
                      )}
                    </div>
                    <p className="text-sm font-medium">{log.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimestamp(log.timestamp)}
                      {log.duration && ` • ${log.duration}ms`}
                      {log.statusCode && ` • ${log.statusCode}`}
                    </p>
                    {log.error && (
                      <details className="mt-2">
                        <summary className="text-xs text-red-600 cursor-pointer">
                          Error Details
                        </summary>
                        <pre className="text-xs bg-red-50 p-2 rounded mt-1 overflow-x-auto">
                          {log.error.name}: {log.error.message}
                          {log.error.stack && `\n${log.error.stack}`}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Endpoints */}
      {stats?.topEndpoints && stats.topEndpoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Top Endpoints by Request Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.topEndpoints.map((endpoint, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <code className="text-sm font-mono">{endpoint.endpoint}</code>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {endpoint.requests.toLocaleString()} requests • 
                    {endpoint.averageResponseTime.toFixed(0)}ms avg • 
                    {endpoint.errorRate.toFixed(1)}% errors
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default MonitoringDashboard
