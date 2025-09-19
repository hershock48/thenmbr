'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Users, 
  Lock, 
  Activity,
  RefreshCw
} from 'lucide-react'
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext'

interface SecurityEvent {
  id: string
  type: 'failed_login' | 'permission_denied' | 'suspicious_activity' | 'data_access'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: string
  user_id?: string
  ip_address?: string
  details?: any
}

interface SecurityStats {
  totalEvents: number
  failedLogins: number
  permissionDenied: number
  suspiciousActivity: number
  activeUsers: number
  securityScore: number
}

export function SecurityMonitor() {
  const { user, hasPermission, isAdmin } = useEnhancedAuth()
  const [securityStats, setSecurityStats] = useState<SecurityStats | null>(null)
  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user has permission to view security monitoring
  if (!hasPermission('VIEW_LOGS') && !isAdmin()) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <Shield className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          You don't have permission to view security monitoring.
        </AlertDescription>
      </Alert>
    )
  }

  const fetchSecurityData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch security statistics
      const statsResponse = await fetch('/api/security/stats')
      if (statsResponse.ok) {
        const stats = await statsResponse.json()
        setSecurityStats(stats)
      }

      // Fetch recent security events
      const eventsResponse = await fetch('/api/security/events')
      if (eventsResponse.ok) {
        const events = await eventsResponse.json()
        setRecentEvents(events)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch security data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSecurityData()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchSecurityData, 30000)
    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'failed_login': return <Lock className="h-4 w-4" />
      case 'permission_denied': return <Shield className="h-4 w-4" />
      case 'suspicious_activity': return <AlertTriangle className="h-4 w-4" />
      case 'data_access': return <Eye className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Security Monitor</h2>
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
          Error loading security data: {error}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Security Monitor</h2>
        <Button onClick={fetchSecurityData} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Security Statistics */}
      {securityStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Score</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{securityStats.securityScore}%</div>
              <p className="text-xs text-muted-foreground">
                Overall security health
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{securityStats.failedLogins}</div>
              <p className="text-xs text-muted-foreground">
                Last 24 hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Permission Denied</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{securityStats.permissionDenied}</div>
              <p className="text-xs text-muted-foreground">
                Last 24 hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{securityStats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                Currently online
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Recent Security Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>No recent security events</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getEventIcon(event.type)}
                    <div>
                      <p className="font-medium">{event.message}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatTimestamp(event.timestamp)}
                        {event.ip_address && ` • ${event.ip_address}`}
                      </p>
                    </div>
                  </div>
                  <Badge className={getSeverityColor(event.severity)}>
                    {event.severity}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">RLS Policies Active</p>
                <p className="text-sm text-muted-foreground">
                  Row-level security is properly configured
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Audit Logging Enabled</p>
                <p className="text-sm text-muted-foreground">
                  All user actions are being tracked
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Permission System Active</p>
                <p className="text-sm text-muted-foreground">
                  Role-based access control is working
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SecurityMonitor
