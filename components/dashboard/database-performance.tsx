'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Database, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Eye,
  Filter,
  Trash2
} from 'lucide-react'
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext'

interface QueryMetrics {
  query: string
  duration: number
  rowsReturned: number
  cacheHit: boolean
  retries: number
  error?: string
  timestamp: string
}

interface DatabaseStats {
  totalQueries: number
  averageDuration: number
  slowQueries: number
  cacheHitRate: number
  errorRate: number
  topTables: Array<{
    table: string
    queries: number
    averageDuration: number
    errorRate: number
  }>
  recentQueries: QueryMetrics[]
  slowQueries: QueryMetrics[]
  cacheStats: {
    hits: number
    misses: number
    hitRate: number
    totalItems: number
    memoryUsage: number
  }
}

export function DatabasePerformance() {
  const { user, hasPermission, isAdmin } = useEnhancedAuth()
  const [stats, setStats] = useState<DatabaseStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTable, setSelectedTable] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<string>('1h')
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Check if user has permission to view database performance
  if (!hasPermission('VIEW_LOGS') && !isAdmin()) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <Database className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          You don't have permission to view database performance information.
        </AlertDescription>
      </Alert>
    )
  }

  const fetchDatabaseStats = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch database statistics
      const statsResponse = await fetch('/api/monitoring/database/stats?' + new URLSearchParams({
        table: selectedTable !== 'all' ? selectedTable : '',
        timeRange
      }))
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch database statistics')
    } finally {
      setIsLoading(false)
    }
  }

  const clearCache = async () => {
    try {
      const response = await fetch('/api/monitoring/database/cache/clear', {
        method: 'POST'
      })
      
      if (response.ok) {
        // Refresh stats after clearing cache
        await fetchDatabaseStats()
      }
    } catch (err) {
      console.error('Failed to clear cache:', err)
    }
  }

  useEffect(() => {
    fetchDatabaseStats()
    
    // Auto-refresh every 15 seconds if enabled
    let interval: NodeJS.Timeout | null = null
    if (autoRefresh) {
      interval = setInterval(fetchDatabaseStats, 15000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [selectedTable, timeRange, autoRefresh])

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatDuration = (duration: number) => {
    if (duration < 1000) return `${duration}ms`
    return `${(duration / 1000).toFixed(2)}s`
  }

  const getDurationColor = (duration: number) => {
    if (duration < 100) return 'text-green-600'
    if (duration < 500) return 'text-yellow-600'
    if (duration < 1000) return 'text-orange-600'
    return 'text-red-600'
  }

  const getErrorRateColor = (errorRate: number) => {
    if (errorRate < 1) return 'text-green-600'
    if (errorRate < 5) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Database Performance</h2>
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
          Error loading database statistics: {error}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Database Performance</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </Button>
          <Button onClick={fetchDatabaseStats} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={clearCache} variant="outline" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cache
          </Button>
        </div>
      </div>

      {/* Database Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalQueries.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Last {timeRange}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getDurationColor(stats.averageDuration)}`}>
                {formatDuration(stats.averageDuration)}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.averageDuration < 500 ? 'Good performance' : 'Needs optimization'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.cacheHitRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.cacheHitRate > 80 ? 'Excellent' : 'Needs improvement'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getErrorRateColor(stats.errorRate)}`}>
                {stats.errorRate.toFixed(2)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.errorRate < 1 ? 'Excellent' : 'Needs attention'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cache Statistics */}
      {stats?.cacheStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cache Hits</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.cacheStats.hits.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Successful cache retrievals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cache Misses</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.cacheStats.misses.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Failed cache retrievals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cache Items</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.cacheStats.totalItems.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Items in cache
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(stats.cacheStats.memoryUsage / 1024 / 1024).toFixed(1)}MB</div>
              <p className="text-xs text-muted-foreground">
                Cache memory usage
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Database Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Table:</label>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="all">All Tables</option>
                <option value="subscribers">Subscribers</option>
                <option value="stories">Stories</option>
                <option value="donations">Donations</option>
                <option value="nonprofits">Nonprofits</option>
                <option value="email_campaigns">Email Campaigns</option>
                <option value="nmbr_subscriptions">NMBR Subscriptions</option>
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

      {/* Top Tables */}
      {stats?.topTables && stats.topTables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Top Tables by Query Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.topTables.map((table, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <code className="text-sm font-mono">{table.table}</code>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {table.queries.toLocaleString()} queries • 
                    {formatDuration(table.averageDuration)} avg • 
                    <span className={getErrorRateColor(table.errorRate)}>
                      {table.errorRate.toFixed(1)}% errors
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Queries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Recent Queries
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentQueries && stats.recentQueries.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stats.recentQueries.map((query, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Database className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium font-mono text-sm">{query.query}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatTimestamp(query.timestamp)} • 
                        {query.rowsReturned} rows • 
                        {query.retries > 0 && `${query.retries} retries`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {query.cacheHit && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Cache Hit
                      </Badge>
                    )}
                    <div className="text-right">
                      <p className={`text-sm font-medium ${getDurationColor(query.duration)}`}>
                        {formatDuration(query.duration)}
                      </p>
                      {query.error && (
                        <p className="text-xs text-red-600">Error</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>No recent queries found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Slow Queries */}
      {stats?.slowQueries && stats.slowQueries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingDown className="h-5 w-5 mr-2" />
              Slow Queries (>1s)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.slowQueries.map((query, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <div>
                      <p className="font-medium font-mono text-sm text-red-800">{query.query}</p>
                      <p className="text-sm text-red-600">
                        {formatTimestamp(query.timestamp)} • 
                        {query.rowsReturned} rows
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">
                      {formatDuration(query.duration)}
                    </p>
                    <p className="text-xs text-red-500">Slow Query</p>
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

export default DatabasePerformance
