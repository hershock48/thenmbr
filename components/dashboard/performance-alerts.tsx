'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap,
  RefreshCw,
  Bell,
  BellOff,
  Settings,
  Filter,
  TrendingUp,
  TrendingDown,
  Activity,
  Server,
  Database,
  Globe
} from 'lucide-react'
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext'
import { AlertSeverity, AlertStatus, AlertType } from '@/lib/performance-monitor'

interface PerformanceAlert {
  id: string
  timestamp: number
  type: AlertType
  severity: AlertSeverity
  title: string
  description: string
  metric: string
  threshold: number
  currentValue: number
  status: AlertStatus
  resolvedAt?: number
  metadata?: Record<string, any>
}

interface AlertStats {
  total: number
  active: number
  resolved: number
  critical: number
  high: number
  medium: number
  low: number
  byType: Record<AlertType, number>
  byStatus: Record<AlertStatus, number>
}

export function PerformanceAlerts() {
  const { user, hasPermission, isAdmin } = useEnhancedAuth()
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([])
  const [stats, setStats] = useState<AlertStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<AlertStatus | 'all'>('all')
  const [selectedType, setSelectedType] = useState<AlertType | 'all'>('all')
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Check if user has permission to view performance alerts
  if (!hasPermission('VIEW_LOGS') && !isAdmin()) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <Bell className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          You don't have permission to view performance alerts.
        </AlertDescription>
      </Alert>
    )
  }

  const fetchAlerts = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch alerts
      const alertsResponse = await fetch('/api/monitoring/alerts?' + new URLSearchParams({
        severity: selectedSeverity !== 'all' ? selectedSeverity : '',
        status: selectedStatus !== 'all' ? selectedStatus : '',
        type: selectedType !== 'all' ? selectedType : '',
        limit: '100'
      }))
      
      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json()
        setAlerts(alertsData.alerts || [])
        setStats(alertsData.stats || null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts')
    } finally {
      setIsLoading(false)
    }
  }

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/monitoring/alerts/${alertId}/acknowledge`, {
        method: 'POST'
      })
      
      if (response.ok) {
        await fetchAlerts()
      }
    } catch (err) {
      console.error('Failed to acknowledge alert:', err)
    }
  }

  const resolveAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/monitoring/alerts/${alertId}/resolve`, {
        method: 'POST'
      })
      
      if (response.ok) {
        await fetchAlerts()
      }
    } catch (err) {
      console.error('Failed to resolve alert:', err)
    }
  }

  const suppressAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/monitoring/alerts/${alertId}/suppress`, {
        method: 'POST'
      })
      
      if (response.ok) {
        await fetchAlerts()
      }
    } catch (err) {
      console.error('Failed to suppress alert:', err)
    }
  }

  useEffect(() => {
    fetchAlerts()
    
    // Auto-refresh every 10 seconds if enabled
    let interval: NodeJS.Timeout | null = null
    if (autoRefresh) {
      interval = setInterval(fetchAlerts, 10000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [selectedSeverity, selectedStatus, selectedType, autoRefresh])

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.LOW: return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case AlertSeverity.MEDIUM: return 'bg-orange-100 text-orange-800 border-orange-200'
      case AlertSeverity.HIGH: return 'bg-red-100 text-red-800 border-red-200'
      case AlertSeverity.CRITICAL: return 'bg-red-200 text-red-900 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.LOW: return <Activity className="h-4 w-4" />
      case AlertSeverity.MEDIUM: return <AlertTriangle className="h-4 w-4" />
      case AlertSeverity.HIGH: return <AlertTriangle className="h-4 w-4" />
      case AlertSeverity.CRITICAL: return <AlertTriangle className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: AlertStatus) => {
    switch (status) {
      case AlertStatus.ACTIVE: return 'bg-red-100 text-red-800 border-red-200'
      case AlertStatus.ACKNOWLEDGED: return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case AlertStatus.RESOLVED: return 'bg-green-100 text-green-800 border-green-200'
      case AlertStatus.SUPPRESSED: return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: AlertType) => {
    switch (type) {
      case AlertType.THRESHOLD_EXCEEDED: return <TrendingUp className="h-4 w-4" />
      case AlertType.ANOMALY_DETECTED: return <Activity className="h-4 w-4" />
      case AlertType.ERROR_SPIKE: return <AlertTriangle className="h-4 w-4" />
      case AlertType.PERFORMANCE_DEGRADATION: return <TrendingDown className="h-4 w-4" />
      case AlertType.RESOURCE_EXHAUSTION: return <Server className="h-4 w-4" />
      case AlertType.SERVICE_DOWN: return <Database className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Performance Alerts</h2>
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
          Error loading alerts: {error}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Performance Alerts</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </Button>
          <Button onClick={fetchAlerts} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Alert Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                All time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.active}</div>
              <p className="text-xs text-muted-foreground">
                Requiring attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
              <p className="text-xs text-muted-foreground">
                Immediate action required
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Alerts</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              <p className="text-xs text-muted-foreground">
                Successfully resolved
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alert Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Alert Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="severity-select" className="text-sm font-medium">Severity:</label>
              <select
                id="severity-select"
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value as AlertSeverity | 'all')}
                className="px-3 py-1 border rounded-md text-sm"
                aria-label="Select alert severity"
              >
                <option value="all">All Severities</option>
                <option value={AlertSeverity.LOW}>Low</option>
                <option value={AlertSeverity.MEDIUM}>Medium</option>
                <option value={AlertSeverity.HIGH}>High</option>
                <option value={AlertSeverity.CRITICAL}>Critical</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="status-select" className="text-sm font-medium">Status:</label>
              <select
                id="status-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as AlertStatus | 'all')}
                className="px-3 py-1 border rounded-md text-sm"
                aria-label="Select alert status"
              >
                <option value="all">All Statuses</option>
                <option value={AlertStatus.ACTIVE}>Active</option>
                <option value={AlertStatus.ACKNOWLEDGED}>Acknowledged</option>
                <option value={AlertStatus.RESOLVED}>Resolved</option>
                <option value={AlertStatus.SUPPRESSED}>Suppressed</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="type-select" className="text-sm font-medium">Type:</label>
              <select
                id="type-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as AlertType | 'all')}
                className="px-3 py-1 border rounded-md text-sm"
                aria-label="Select alert type"
              >
                <option value="all">All Types</option>
                <option value={AlertType.THRESHOLD_EXCEEDED}>Threshold Exceeded</option>
                <option value={AlertType.ANOMALY_DETECTED}>Anomaly Detected</option>
                <option value={AlertType.ERROR_SPIKE}>Error Spike</option>
                <option value={AlertType.PERFORMANCE_DEGRADATION}>Performance Degradation</option>
                <option value={AlertType.RESOURCE_EXHAUSTION}>Resource Exhaustion</option>
                <option value={AlertType.SERVICE_DOWN}>Service Down</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Recent Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>No alerts found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border rounded-lg ${
                    alert.severity === AlertSeverity.CRITICAL 
                      ? 'border-red-300 bg-red-50' 
                      : alert.severity === AlertSeverity.HIGH
                      ? 'border-orange-300 bg-orange-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {getTypeIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium">{alert.title}</h3>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {alert.description}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          <p>Metric: {alert.metric}</p>
                          <p>Current: {alert.currentValue} | Threshold: {alert.threshold}</p>
                          <p>Time: {formatTimestamp(alert.timestamp)}</p>
                          {alert.resolvedAt && (
                            <p>Resolved: {formatTimestamp(alert.resolvedAt)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {alert.status === AlertStatus.ACTIVE && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => acknowledgeAlert(alert.id)}
                          >
                            <Bell className="h-4 w-4 mr-1" />
                            Acknowledge
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => resolveAlert(alert.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => suppressAlert(alert.id)}
                          >
                            <BellOff className="h-4 w-4 mr-1" />
                            Suppress
                          </Button>
                        </>
                      )}
                      {alert.status === AlertStatus.ACKNOWLEDGED && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resolveAlert(alert.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PerformanceAlerts
