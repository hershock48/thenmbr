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
  Zap,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Server,
  Eye,
  Filter
} from 'lucide-react'
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext'

interface PerformanceMetric {
  timestamp: string
  endpoint: string
  method: string
  duration: number
  statusCode: number
  memoryUsage: number
  cpuUsage?: number
  requestSize: number
  responseSize: number
  databaseQueries: number
  cacheHits: number
  cacheMisses: number
}

interface PerformanceStats {
  totalRequests: number
  averageResponseTime: number
  slowestEndpoints: Array<{
    endpoint: string
    averageDuration: number
    maxDuration: number
    requestCount: number
  }>
  errorRate: number
  throughput: number
  memoryUsage: {
    current: number
    peak: number
    average: number
  }
  databasePerformance: {
    averageQueryTime: number
    totalQueries: number
    slowQueries: number
  }
  cachePerformance: {
    hitRate: number
    totalHits: number
    totalMisses: number
  }
}

export function PerformanceMonitor() {
  const { user, hasPermission, isAdmin } = useEnhancedAuth()
  const [stats, setStats] = useState<PerformanceStats | null>(null)
  const [recentMetrics, setRecentMetrics] = useState<PerformanceMetric[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<string>('1h')
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Check if user has permission to view performance monitoring
  if (!hasPermission('VIEW_LOGS') && !isAdmin()) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <Server className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          You don't have permission to view performance monitoring.
        </AlertDescription>
      </Alert>
    )
  }

  const fetchPerformanceData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch performance statistics
      const statsResponse = await fetch('/api/monitoring/performance/stats?' + new URLSearchParams({
        endpoint: selectedEndpoint !== 'all' ? selectedEndpoint : '',
        timeRange
      }))
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Fetch recent performance metrics
      const metricsResponse = await fetch('/api/monitoring/performance/metrics?' + new URLSearchParams({
        endpoint: selectedEndpoint !== 'all' ? selectedEndpoint : '',
        timeRange,
        limit: '50'
      }))
      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json()
        setRecentMetrics(metricsData)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch performance data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPerformanceData()
    
    // Auto-refresh every 15 seconds if enabled
    let interval: NodeJS.Timeout | null = null
    if (autoRefresh) {
      interval = setInterval(fetchPerformanceData, 15000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [selectedEndpoint, timeRange, autoRefresh])

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatDuration = (duration: number) => {
    if (duration < 1000) return `${duration}ms`
    return `${(duration / 1000).toFixed(2)}s`
  }

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return 'text-green-600'
    if (statusCode >= 300 && statusCode < 400) return 'text-blue-600'
    if (statusCode >= 400 && statusCode < 500) return 'text-yellow-600'
    if (statusCode >= 500) return 'text-red-600'
    return 'text-gray-600'
  }

  const getPerformanceColor = (duration: number) => {
    if (duration < 100) return 'text-green-600'
    if (duration < 500) return 'text-yellow-600'
    if (duration < 1000) return 'text-orange-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Performance Monitor</h2>
          <Button disabled>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
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
          Error loading performance data: {error}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Performance Monitor</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </Button>
          <Button onClick={fetchPerformanceData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRequests.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Last {timeRange}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getPerformanceColor(stats.averageResponseTime)}`}>
                {formatDuration(stats.averageResponseTime)}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.averageResponseTime < 500 ? 'Good performance' : 'Needs optimization'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.errorRate > 5 ? 'text-red-600' : 'text-green-600'}`}>
                {stats.errorRate.toFixed(2)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.errorRate > 5 ? 'High error rate' : 'Normal'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Throughput</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.throughput.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                requests per second
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Memory Usage */}
      {stats?.memoryUsage && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Memory</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.memoryUsage.current.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.memoryUsage.current > 80 ? 'High usage' : 'Normal'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peak Memory</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.memoryUsage.peak.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Highest usage
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Memory</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.memoryUsage.average.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Average usage
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Database Performance */}
      {stats?.databasePerformance && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Database Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{formatDuration(stats.databasePerformance.averageQueryTime)}</div>
                <p className="text-sm text-muted-foreground">Average Query Time</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.databasePerformance.totalQueries.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Total Queries</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.databasePerformance.slowQueries}</div>
                <p className="text-sm text-muted-foreground">Slow Queries</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cache Performance */}
      {stats?.cachePerformance && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Cache Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.cachePerformance.hitRate.toFixed(1)}%</div>
                <p className="text-sm text-muted-foreground">Hit Rate</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.cachePerformance.totalHits.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Cache Hits</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.cachePerformance.totalMisses.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Cache Misses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Performance Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Endpoint:</label>
              <select
                value={selectedEndpoint}
                onChange={(e) => setSelectedEndpoint(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="all">All Endpoints</option>
                <option value="/api/subscribers">Subscribers API</option>
                <option value="/api/stories">Stories API</option>
                <option value="/api/newsletters">Newsletters API</option>
                <option value="/api/email">Email API</option>
                <option value="/api/donations">Donations API</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Time Range:</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="15m">Last 15 minutes</option>
                <option value="1h">Last hour</option>
                <option value="6h">Last 6 hours</option>
                <option value="24h">Last 24 hours</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Recent Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentMetrics.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>No performance metrics found</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium font-mono text-sm">
                        {metric.method} {metric.endpoint}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatTimestamp(metric.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className={`text-sm font-medium ${getPerformanceColor(metric.duration)}`}>
                        {formatDuration(metric.duration)}
                      </p>
                      <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${getStatusColor(metric.statusCode)}`}>
                        {metric.statusCode}
                      </p>
                      <p className="text-xs text-muted-foreground">Status</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {metric.memoryUsage.toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">Memory</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Slowest Endpoints */}
      {stats?.slowestEndpoints && stats.slowestEndpoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingDown className="h-5 w-5 mr-2" />
              Slowest Endpoints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.slowestEndpoints.map((endpoint, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <code className="text-sm font-mono">{endpoint.endpoint}</code>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Avg: {formatDuration(endpoint.averageDuration)} • 
                    Max: {formatDuration(endpoint.maxDuration)} • 
                    {endpoint.requestCount} requests
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

export default PerformanceMonitor
