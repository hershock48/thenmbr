"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  MemoryStick as Memory,
  Cpu,
  Zap,
  RefreshCw,
  Settings,
  BarChart3,
  Server,
} from "lucide-react"

interface PerformanceMetrics {
  // Core Web Vitals
  fcp: number | null
  lcp: number | null
  fid: number | null
  cls: number | null
  ttfb: number | null

  // Navigation Timing
  navigationStart: number
  loadEventEnd: number
  domContentLoaded: number
  firstPaint: number | null
  firstContentfulPaint: number | null

  // System Resources
  memoryUsage: number
  cpuUsage: number

  // API Performance
  apiResponseTime: number
  errorRate: number

  // Database Performance
  dbQueryTime: number
  dbConnections: number

  // Cache Performance
  cacheHitRate: number
  cacheSize: number
}

interface PerformanceAlert {
  id: string
  type: "warning" | "error" | "critical"
  title: string
  description: string
  timestamp: number
  resolved: boolean
}

interface PerformanceTrend {
  timestamp: number
  value: number
  label: string
}

export const AdvancedPerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    navigationStart: 0,
    loadEventEnd: 0,
    domContentLoaded: 0,
    firstPaint: null,
    firstContentfulPaint: null,
    memoryUsage: 0,
    cpuUsage: 0,
    apiResponseTime: 0,
    errorRate: 0,
    dbQueryTime: 0,
    dbConnections: 0,
    cacheHitRate: 0,
    cacheSize: 0,
  })

  const [alerts, setAlerts] = useState<PerformanceAlert[]>([])
  const [trends, setTrends] = useState<PerformanceTrend[]>([])
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(5000)

  // Performance thresholds
  const thresholds = {
    fcp: { good: 1800, poor: 3000 },
    lcp: { good: 2500, poor: 4000 },
    fid: { good: 100, poor: 300 },
    cls: { good: 0.1, poor: 0.25 },
    ttfb: { good: 800, poor: 1800 },
    memoryUsage: { good: 70, poor: 85 },
    cpuUsage: { good: 70, poor: 85 },
    apiResponseTime: { good: 500, poor: 1000 },
    errorRate: { good: 1, poor: 5 },
    dbQueryTime: { good: 200, poor: 500 },
    cacheHitRate: { good: 80, poor: 60 },
  }

  const getScore = useCallback((value: number | null, threshold: { good: number; poor: number }) => {
    if (value === null) return "N/A"
    if (value <= threshold.good) return "Good"
    if (value <= threshold.poor) return "Needs Improvement"
    return "Poor"
  }, [])

  const getScoreColor = useCallback((score: string) => {
    switch (score) {
      case "Good":
        return "text-green-600 bg-green-50"
      case "Needs Improvement":
        return "text-yellow-600 bg-yellow-50"
      case "Poor":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }, [])

  const getScoreIcon = useCallback((score: string) => {
    switch (score) {
      case "Good":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Needs Improvement":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "Poor":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }, [])

  const updateMetrics = useCallback(() => {
    if (typeof window === "undefined") return

    // Get Core Web Vitals
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
    const paintEntries = performance.getEntriesByType("paint")

    const firstPaint = paintEntries.find((entry) => entry.name === "first-paint")
    const firstContentfulPaint = paintEntries.find((entry) => entry.name === "first-contentful-paint")

    // Simulate system metrics (in real app, these would come from API)
    const memoryInfo = (performance as any).memory
    const memoryUsage = memoryInfo ? (memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100 : 0

    setMetrics((prev) => ({
      ...prev,
      navigationStart: navigation?.startTime || 0,
      loadEventEnd: navigation?.loadEventEnd || 0,
      domContentLoaded: navigation?.domContentLoadedEventEnd || 0,
      firstPaint: firstPaint?.startTime || null,
      firstContentfulPaint: firstContentfulPaint?.startTime || null,
      memoryUsage: Math.round(memoryUsage),
      cpuUsage: Math.round(Math.random() * 30 + 20), // Simulated
      apiResponseTime: Math.round(Math.random() * 200 + 100), // Simulated
      errorRate: Math.round(Math.random() * 2), // Simulated
      dbQueryTime: Math.round(Math.random() * 100 + 50), // Simulated
      dbConnections: Math.round(Math.random() * 10 + 5), // Simulated
      cacheHitRate: Math.round(Math.random() * 20 + 70), // Simulated
      cacheSize: Math.round(Math.random() * 1000 + 500), // Simulated
    }))

    // Update trends
    const now = Date.now()
    setTrends((prev) => [
      ...prev.slice(-19), // Keep last 20 data points
      {
        timestamp: now,
        value: memoryUsage,
        label: "Memory Usage",
      },
    ])

    // Check for alerts
    checkAlerts()
  }, [])

  const checkAlerts = useCallback(() => {
    const newAlerts: PerformanceAlert[] = []

    // Check memory usage
    if (metrics.memoryUsage > thresholds.memoryUsage.poor) {
      newAlerts.push({
        id: `memory-${Date.now()}`,
        type: "critical",
        title: "High Memory Usage",
        description: `Memory usage is at ${metrics.memoryUsage}%, exceeding the critical threshold.`,
        timestamp: Date.now(),
        resolved: false,
      })
    }

    // Check API response time
    if (metrics.apiResponseTime > thresholds.apiResponseTime.poor) {
      newAlerts.push({
        id: `api-${Date.now()}`,
        type: "warning",
        title: "Slow API Response",
        description: `API response time is ${metrics.apiResponseTime}ms, exceeding the warning threshold.`,
        timestamp: Date.now(),
        resolved: false,
      })
    }

    // Check error rate
    if (metrics.errorRate > thresholds.errorRate.poor) {
      newAlerts.push({
        id: `error-${Date.now()}`,
        type: "error",
        title: "High Error Rate",
        description: `Error rate is ${metrics.errorRate}%, exceeding the critical threshold.`,
        timestamp: Date.now(),
        resolved: false,
      })
    }

    if (newAlerts.length > 0) {
      setAlerts((prev) => [...prev, ...newAlerts])
    }
  }, [metrics, thresholds])

  useEffect(() => {
    if (!isMonitoring) return

    updateMetrics()
    const interval = setInterval(updateMetrics, refreshInterval)

    return () => clearInterval(interval)
  }, [isMonitoring, refreshInterval, updateMetrics])

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, resolved: true } : alert)))
  }

  const clearAlerts = () => {
    setAlerts([])
  }

  const activeAlerts = alerts.filter((alert) => !alert.resolved)
  const criticalAlerts = activeAlerts.filter((alert) => alert.type === "critical")
  const warningAlerts = activeAlerts.filter((alert) => alert.type === "warning")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Performance Monitor</h2>
          <p className="text-muted-foreground">Real-time performance metrics and system health monitoring</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setIsMonitoring(!isMonitoring)}>
            {isMonitoring ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Activity className="h-4 w-4 mr-2" />}
            {isMonitoring ? "Monitoring" : "Start Monitoring"}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {activeAlerts.length > 0 && (
        <div className="space-y-2">
          {criticalAlerts.map((alert) => (
            <Alert key={alert.id} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>{alert.description}</span>
                <Button variant="outline" size="sm" onClick={() => resolveAlert(alert.id)}>
                  Resolve
                </Button>
              </AlertDescription>
            </Alert>
          ))}
          {warningAlerts.map((alert) => (
            <Alert key={alert.id} variant="default">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>{alert.description}</span>
                <Button variant="outline" size="sm" onClick={() => resolveAlert(alert.id)}>
                  Resolve
                </Button>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Metrics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="web-vitals">Web Vitals</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="api">API Performance</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Core Web Vitals Summary */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Core Web Vitals</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">LCP</span>
                    <Badge className={getScoreColor(getScore(metrics.lcp, thresholds.lcp))}>
                      {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : "N/A"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">FID</span>
                    <Badge className={getScoreColor(getScore(metrics.fid, thresholds.fid))}>
                      {metrics.fid ? `${Math.round(metrics.fid)}ms` : "N/A"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">CLS</span>
                    <Badge className={getScoreColor(getScore(metrics.cls, thresholds.cls))}>
                      {metrics.cls ? metrics.cls.toFixed(3) : "N/A"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Resources */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Resources</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Memory</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={metrics.memoryUsage} className="w-16" />
                      <span className="text-sm font-medium">{metrics.memoryUsage}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">CPU</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={metrics.cpuUsage} className="w-16" />
                      <span className="text-sm font-medium">{metrics.cpuUsage}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Performance */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Performance</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Response Time</span>
                    <Badge className={getScoreColor(getScore(metrics.apiResponseTime, thresholds.apiResponseTime))}>
                      {metrics.apiResponseTime}ms
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Error Rate</span>
                    <Badge className={getScoreColor(getScore(metrics.errorRate, thresholds.errorRate))}>
                      {metrics.errorRate}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Database Performance */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Database</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Query Time</span>
                    <Badge className={getScoreColor(getScore(metrics.dbQueryTime, thresholds.dbQueryTime))}>
                      {metrics.dbQueryTime}ms
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Connections</span>
                    <span className="text-sm font-medium">{metrics.dbConnections}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Web Vitals Tab */}
        <TabsContent value="web-vitals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "First Contentful Paint", value: metrics.fcp, threshold: thresholds.fcp, unit: "ms" },
              { name: "Largest Contentful Paint", value: metrics.lcp, threshold: thresholds.lcp, unit: "ms" },
              { name: "First Input Delay", value: metrics.fid, threshold: thresholds.fid, unit: "ms" },
              { name: "Cumulative Layout Shift", value: metrics.cls, threshold: thresholds.cls, unit: "" },
              { name: "Time to First Byte", value: metrics.ttfb, threshold: thresholds.ttfb, unit: "ms" },
              { name: "Load Time", value: metrics.loadEventEnd, threshold: { good: 2000, poor: 4000 }, unit: "ms" },
            ].map((metric) => {
              const score = getScore(metric.value, metric.threshold)
              return (
                <Card key={metric.name}>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getScoreIcon(score)}
                        <span className="text-2xl font-bold">
                          {metric.value ? `${Math.round(metric.value)}${metric.unit}` : "N/A"}
                        </span>
                      </div>
                      <Badge className={getScoreColor(score)}>{score}</Badge>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs text-muted-foreground">
                        Good: &lt;={metric.threshold.good}
                        {metric.unit} | Poor: &gt;{metric.threshold.poor}
                        {metric.unit}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Memory className="h-5 w-5" />
                  <span>Memory Usage</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Current Usage</span>
                    <span className="font-medium">{metrics.memoryUsage}%</span>
                  </div>
                  <Progress value={metrics.memoryUsage} className="w-full" />
                  <div className="text-xs text-muted-foreground">
                    Threshold: {thresholds.memoryUsage.good}% (Good) | {thresholds.memoryUsage.poor}% (Poor)
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cpu className="h-5 w-5" />
                  <span>CPU Usage</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Current Usage</span>
                    <span className="font-medium">{metrics.cpuUsage}%</span>
                  </div>
                  <Progress value={metrics.cpuUsage} className="w-full" />
                  <div className="text-xs text-muted-foreground">
                    Threshold: {thresholds.cpuUsage.good}% (Good) | {thresholds.cpuUsage.poor}% (Poor)
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* API Performance Tab */}
        <TabsContent value="api" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>API Response Time</CardTitle>
                <CardDescription>Average response time for API endpoints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{metrics.apiResponseTime}ms</span>
                  <Badge className={getScoreColor(getScore(metrics.apiResponseTime, thresholds.apiResponseTime))}>
                    {getScore(metrics.apiResponseTime, thresholds.apiResponseTime)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Rate</CardTitle>
                <CardDescription>Percentage of failed API requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{metrics.errorRate}%</span>
                  <Badge className={getScoreColor(getScore(metrics.errorRate, thresholds.errorRate))}>
                    {getScore(metrics.errorRate, thresholds.errorRate)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Database Tab */}
        <TabsContent value="database" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Query Performance</CardTitle>
                <CardDescription>Average database query execution time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{metrics.dbQueryTime}ms</span>
                  <Badge className={getScoreColor(getScore(metrics.dbQueryTime, thresholds.dbQueryTime))}>
                    {getScore(metrics.dbQueryTime, thresholds.dbQueryTime)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cache Performance</CardTitle>
                <CardDescription>Cache hit rate percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{metrics.cacheHitRate}%</span>
                  <Badge className={getScoreColor(getScore(metrics.cacheHitRate, thresholds.cacheHitRate))}>
                    {getScore(metrics.cacheHitRate, thresholds.cacheHitRate)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdvancedPerformanceMonitor
