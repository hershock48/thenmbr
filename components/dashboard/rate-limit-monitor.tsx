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
  Users, 
  Zap,
  RefreshCw,
  Shield,
  Ban
} from 'lucide-react'
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext'

interface RateLimitStatus {
  key: string
  allowed: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
  totalHits: number
  blocked: boolean
  endpoint?: string
  userAgent?: string
  ipAddress?: string
}

interface RateLimitStats {
  totalActiveLimits: number
  blockedUsers: number
  totalRequests: number
  averageRequestsPerMinute: number
  topEndpoints: Array<{
    endpoint: string
    requests: number
  }>
  recentBlocks: Array<{
    key: string
    endpoint: string
    blockedAt: string
    reason: string
  }>
}

export function RateLimitMonitor() {
  const { user, hasPermission, isAdmin } = useEnhancedAuth()
  const [rateLimitStats, setRateLimitStats] = useState<RateLimitStats | null>(null)
  const [activeLimits, setActiveLimits] = useState<RateLimitStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user has permission to view rate limiting
  if (!hasPermission('VIEW_LOGS') && !isAdmin()) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <Shield className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          You don't have permission to view rate limiting information.
        </AlertDescription>
      </Alert>
    )
  }

  const fetchRateLimitData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch rate limit statistics
      const statsResponse = await fetch('/api/rate-limit/stats')
      if (statsResponse.ok) {
        const stats = await statsResponse.json()
        setRateLimitStats(stats)
      }

      // Fetch active rate limits
      const limitsResponse = await fetch('/api/rate-limit/status')
      if (limitsResponse.ok) {
        const limits = await limitsResponse.json()
        setActiveLimits(limits)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rate limit data')
    } finally {
      setIsLoading(false)
    }
  }

  const resetRateLimit = async (key: string) => {
    try {
      const response = await fetch('/api/rate-limit/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key }),
      })

      if (response.ok) {
        // Refresh data after reset
        await fetchRateLimitData()
      }
    } catch (err) {
      console.error('Failed to reset rate limit:', err)
    }
  }

  useEffect(() => {
    fetchRateLimitData()
    
    // Refresh every 10 seconds
    const interval = setInterval(fetchRateLimitData, 10000)
    return () => clearInterval(interval)
  }, [])

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const getStatusColor = (status: RateLimitStatus) => {
    if (status.blocked) return 'bg-red-100 text-red-800 border-red-200'
    if (status.remaining < 10) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-green-100 text-green-800 border-green-200'
  }

  const getStatusIcon = (status: RateLimitStatus) => {
    if (status.blocked) return <Ban className="h-4 w-4" />
    if (status.remaining < 10) return <AlertTriangle className="h-4 w-4" />
    return <CheckCircle className="h-4 w-4" />
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Rate Limit Monitor</h2>
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
          Error loading rate limit data: {error}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Rate Limit Monitor</h2>
        <Button onClick={fetchRateLimitData} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Rate Limit Statistics */}
      {rateLimitStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Limits</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rateLimitStats.totalActiveLimits}</div>
              <p className="text-xs text-muted-foreground">
                Currently tracked
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blocked Users</CardTitle>
              <Ban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{rateLimitStats.blockedUsers}</div>
              <p className="text-xs text-muted-foreground">
                Currently blocked
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rateLimitStats.totalRequests.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Last 15 minutes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Requests/Min</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rateLimitStats.averageRequestsPerMinute.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                Average rate
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Endpoints */}
      {rateLimitStats?.topEndpoints && rateLimitStats.topEndpoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Top Endpoints by Request Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rateLimitStats.topEndpoints.map((endpoint, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <code className="text-sm font-mono">{endpoint.endpoint}</code>
                  </div>
                  <div className="text-sm font-medium">
                    {endpoint.requests.toLocaleString()} requests
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Blocks */}
      {rateLimitStats?.recentBlocks && rateLimitStats.recentBlocks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Ban className="h-5 w-5 mr-2" />
              Recent Rate Limit Blocks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rateLimitStats.recentBlocks.map((block, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                  <div>
                    <p className="font-medium text-red-800">{block.endpoint}</p>
                    <p className="text-sm text-red-600">
                      {formatTimestamp(new Date(block.blockedAt).getTime())} • {block.reason}
                    </p>
                  </div>
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    Blocked
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Rate Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Active Rate Limits
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeLimits.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>No active rate limits</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeLimits.map((limit, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(limit)}
                    <div>
                      <p className="font-medium font-mono text-sm">{limit.key}</p>
                      <p className="text-sm text-muted-foreground">
                        {limit.totalHits} requests • Resets {formatTimestamp(limit.resetTime)}
                        {limit.retryAfter && ` • Unblock in ${limit.retryAfter}s`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(limit)}>
                      {limit.remaining} remaining
                    </Badge>
                    {limit.blocked && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resetRateLimit(limit.key)}
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rate Limit Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Rate Limit Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Authentication Endpoints</h4>
              <p className="text-sm text-muted-foreground">5 requests per 15 minutes</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">API Endpoints</h4>
              <p className="text-sm text-muted-foreground">100 requests per 15 minutes</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Widget Endpoints</h4>
              <p className="text-sm text-muted-foreground">200 requests per 15 minutes</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Email Sending</h4>
              <p className="text-sm text-muted-foreground">10 requests per hour</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">File Uploads</h4>
              <p className="text-sm text-muted-foreground">20 requests per hour</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Newsletter Sending</h4>
              <p className="text-sm text-muted-foreground">5 requests per hour</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RateLimitMonitor
