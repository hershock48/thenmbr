import { NextRequest, NextResponse } from 'next/server'

// Performance metrics interfaces
export interface PerformanceMetric {
  id: string
  timestamp: number
  type: PerformanceMetricType
  name: string
  value: number
  unit: string
  tags: Record<string, string>
  metadata?: Record<string, any>
}

export interface PerformanceAlert {
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

export interface PerformanceThreshold {
  metric: string
  warning: number
  critical: number
  unit: string
  enabled: boolean
}

export interface PerformanceReport {
  timestamp: number
  period: string
  metrics: {
    average: Record<string, number>
    min: Record<string, number>
    max: Record<string, number>
    p95: Record<string, number>
    p99: Record<string, number>
  }
  alerts: PerformanceAlert[]
  health: 'healthy' | 'warning' | 'critical'
  recommendations: string[]
}

// Enums
export enum PerformanceMetricType {
  RESPONSE_TIME = 'response_time',
  THROUGHPUT = 'throughput',
  ERROR_RATE = 'error_rate',
  MEMORY_USAGE = 'memory_usage',
  CPU_USAGE = 'cpu_usage',
  DATABASE_QUERY_TIME = 'database_query_time',
  CACHE_HIT_RATE = 'cache_hit_rate',
  API_RESPONSE_TIME = 'api_response_time',
  PAGE_LOAD_TIME = 'page_load_time',
  BUNDLE_SIZE = 'bundle_size',
  CONNECTION_COUNT = 'connection_count',
  REQUEST_SIZE = 'request_size',
  RESPONSE_SIZE = 'response_size'
}

export enum AlertType {
  THRESHOLD_EXCEEDED = 'threshold_exceeded',
  ANOMALY_DETECTED = 'anomaly_detected',
  ERROR_SPIKE = 'error_spike',
  PERFORMANCE_DEGRADATION = 'performance_degradation',
  RESOURCE_EXHAUSTION = 'resource_exhaustion',
  SERVICE_DOWN = 'service_down'
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum AlertStatus {
  ACTIVE = 'active',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
  SUPPRESSED = 'suppressed'
}

// Performance monitoring service
export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private alerts: PerformanceAlert[] = []
  private thresholds: Map<string, PerformanceThreshold> = new Map()
  private maxMetrics = 10000
  private maxAlerts = 1000

  constructor() {
    this.initializeDefaultThresholds()
    this.startCleanupInterval()
  }

  // Record performance metrics
  recordMetric(
    type: PerformanceMetricType,
    name: string,
    value: number,
    unit: string = 'ms',
    tags: Record<string, string> = {},
    metadata?: Record<string, any>
  ): void {
    const metric: PerformanceMetric = {
      id: this.generateId(),
      timestamp: Date.now(),
      type,
      name,
      value,
      unit,
      tags,
      metadata
    }

    this.metrics.push(metric)
    this.checkThresholds(metric)
    this.cleanupOldMetrics()
  }

  // Record API response time
  recordApiResponseTime(
    endpoint: string,
    method: string,
    responseTime: number,
    statusCode: number,
    metadata?: Record<string, any>
  ): void {
    this.recordMetric(
      PerformanceMetricType.API_RESPONSE_TIME,
      `${method} ${endpoint}`,
      responseTime,
      'ms',
      {
        endpoint,
        method,
        status_code: statusCode.toString()
      },
      metadata
    )

    // Record error rate
    if (statusCode >= 400) {
      this.recordMetric(
        PerformanceMetricType.ERROR_RATE,
        `${method} ${endpoint}`,
        1,
        'count',
        {
          endpoint,
          method,
          status_code: statusCode.toString()
        }
      )
    }
  }

  // Record database query performance
  recordDatabaseQuery(
    query: string,
    duration: number,
    rowsReturned: number,
    metadata?: Record<string, any>
  ): void {
    this.recordMetric(
      PerformanceMetricType.DATABASE_QUERY_TIME,
      query,
      duration,
      'ms',
      {
        query_type: this.getQueryType(query),
        rows_returned: rowsReturned.toString()
      },
      metadata
    )
  }

  // Record cache performance
  recordCachePerformance(
    cacheName: string,
    hitRate: number,
    totalRequests: number,
    metadata?: Record<string, any>
  ): void {
    this.recordMetric(
      PerformanceMetricType.CACHE_HIT_RATE,
      cacheName,
      hitRate,
      'percent',
      {
        cache_name: cacheName,
        total_requests: totalRequests.toString()
      },
      metadata
    )
  }

  // Record system resource usage
  recordSystemResource(
    type: 'memory' | 'cpu',
    usage: number,
    metadata?: Record<string, any>
  ): void {
    const metricType = type === 'memory' 
      ? PerformanceMetricType.MEMORY_USAGE 
      : PerformanceMetricType.CPU_USAGE

    this.recordMetric(
      metricType,
      `system_${type}`,
      usage,
      'percent',
      { resource_type: type },
      metadata
    )
  }

  // Record page load performance
  recordPageLoad(
    page: string,
    loadTime: number,
    metadata?: Record<string, any>
  ): void {
    this.recordMetric(
      PerformanceMetricType.PAGE_LOAD_TIME,
      page,
      loadTime,
      'ms',
      { page },
      metadata
    )
  }

  // Set performance thresholds
  setThreshold(
    metric: string,
    warning: number,
    critical: number,
    unit: string = 'ms',
    enabled: boolean = true
  ): void {
    this.thresholds.set(metric, {
      metric,
      warning,
      critical,
      unit,
      enabled
    })
  }

  // Get performance metrics
  getMetrics(filters: {
    type?: PerformanceMetricType
    name?: string
    startTime?: number
    endTime?: number
    limit?: number
  } = {}): PerformanceMetric[] {
    let filteredMetrics = [...this.metrics]

    if (filters.type) {
      filteredMetrics = filteredMetrics.filter(m => m.type === filters.type)
    }

    if (filters.name) {
      filteredMetrics = filteredMetrics.filter(m => m.name === filters.name)
    }

    if (filters.startTime) {
      filteredMetrics = filteredMetrics.filter(m => m.timestamp >= filters.startTime!)
    }

    if (filters.endTime) {
      filteredMetrics = filteredMetrics.filter(m => m.timestamp <= filters.endTime!)
    }

    // Sort by timestamp (newest first)
    filteredMetrics.sort((a, b) => b.timestamp - a.timestamp)

    // Apply limit
    if (filters.limit) {
      filteredMetrics = filteredMetrics.slice(0, filters.limit)
    }

    return filteredMetrics
  }

  // Get performance alerts
  getAlerts(filters: {
    status?: AlertStatus
    severity?: AlertSeverity
    type?: AlertType
    startTime?: number
    endTime?: number
    limit?: number
  } = {}): PerformanceAlert[] {
    let filteredAlerts = [...this.alerts]

    if (filters.status) {
      filteredAlerts = filteredAlerts.filter(a => a.status === filters.status)
    }

    if (filters.severity) {
      filteredAlerts = filteredAlerts.filter(a => a.severity === filters.severity)
    }

    if (filters.type) {
      filteredAlerts = filteredAlerts.filter(a => a.type === filters.type)
    }

    if (filters.startTime) {
      filteredAlerts = filteredAlerts.filter(a => a.timestamp >= filters.startTime!)
    }

    if (filters.endTime) {
      filteredAlerts = filteredAlerts.filter(a => a.timestamp <= filters.endTime!)
    }

    // Sort by timestamp (newest first)
    filteredAlerts.sort((a, b) => b.timestamp - a.timestamp)

    // Apply limit
    if (filters.limit) {
      filteredAlerts = filteredAlerts.slice(0, filters.limit)
    }

    return filteredAlerts
  }

  // Get performance report
  getPerformanceReport(period: string = '1h'): PerformanceReport {
    const now = Date.now()
    const periodMs = this.getPeriodMs(period)
    const startTime = now - periodMs

    const recentMetrics = this.metrics.filter(m => m.timestamp >= startTime)
    const recentAlerts = this.alerts.filter(a => a.timestamp >= startTime)

    // Calculate aggregated metrics
    const metricsByType = new Map<string, number[]>()
    
    recentMetrics.forEach(metric => {
      if (!metricsByType.has(metric.type)) {
        metricsByType.set(metric.type, [])
      }
      metricsByType.get(metric.type)!.push(metric.value)
    })

    const aggregatedMetrics = {
      average: {} as Record<string, number>,
      min: {} as Record<string, number>,
      max: {} as Record<string, number>,
      p95: {} as Record<string, number>,
      p99: {} as Record<string, number>
    }

    metricsByType.forEach((values, type) => {
      const sorted = values.sort((a, b) => a - b)
      const count = sorted.length

      if (count > 0) {
        aggregatedMetrics.average[type] = values.reduce((sum, val) => sum + val, 0) / count
        aggregatedMetrics.min[type] = sorted[0]
        aggregatedMetrics.max[type] = sorted[count - 1]
        aggregatedMetrics.p95[type] = sorted[Math.floor(count * 0.95)]
        aggregatedMetrics.p99[type] = sorted[Math.floor(count * 0.99)]
      }
    })

    // Determine health status
    const criticalAlerts = recentAlerts.filter(a => a.severity === AlertSeverity.CRITICAL)
    const highAlerts = recentAlerts.filter(a => a.severity === AlertSeverity.HIGH)
    
    let health: 'healthy' | 'warning' | 'critical' = 'healthy'
    if (criticalAlerts.length > 0) {
      health = 'critical'
    } else if (highAlerts.length > 0) {
      health = 'warning'
    }

    // Generate recommendations
    const recommendations = this.generateRecommendations(aggregatedMetrics, recentAlerts)

    return {
      timestamp: now,
      period,
      metrics: aggregatedMetrics,
      alerts: recentAlerts,
      health,
      recommendations
    }
  }

  // Acknowledge alert
  acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert && alert.status === AlertStatus.ACTIVE) {
      alert.status = AlertStatus.ACKNOWLEDGED
      return true
    }
    return false
  }

  // Resolve alert
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert && alert.status !== AlertStatus.RESOLVED) {
      alert.status = AlertStatus.RESOLVED
      alert.resolvedAt = Date.now()
      return true
    }
    return false
  }

  // Suppress alert
  suppressAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert && alert.status === AlertStatus.ACTIVE) {
      alert.status = AlertStatus.SUPPRESSED
      return true
    }
    return false
  }

  // Private methods
  private initializeDefaultThresholds(): void {
    // Response time thresholds
    this.setThreshold('api_response_time', 1000, 5000, 'ms')
    this.setThreshold('page_load_time', 2000, 5000, 'ms')
    this.setThreshold('database_query_time', 500, 2000, 'ms')

    // Error rate thresholds
    this.setThreshold('error_rate', 5, 10, 'percent')

    // Resource usage thresholds
    this.setThreshold('memory_usage', 80, 90, 'percent')
    this.setThreshold('cpu_usage', 80, 90, 'percent')

    // Cache performance thresholds
    this.setThreshold('cache_hit_rate', 70, 50, 'percent')
  }

  private checkThresholds(metric: PerformanceMetric): void {
    const threshold = this.thresholds.get(metric.type)
    if (!threshold || !threshold.enabled) return

    let severity: AlertSeverity | null = null
    let thresholdValue: number | null = null

    if (metric.value >= threshold.critical) {
      severity = AlertSeverity.CRITICAL
      thresholdValue = threshold.critical
    } else if (metric.value >= threshold.warning) {
      severity = AlertSeverity.HIGH
      thresholdValue = threshold.warning
    }

    if (severity && thresholdValue) {
      // Check if there's already an active alert for this metric
      const existingAlert = this.alerts.find(a => 
        a.metric === metric.type && 
        a.status === AlertStatus.ACTIVE &&
        a.name === metric.name
      )

      if (!existingAlert) {
        this.createAlert(
          AlertType.THRESHOLD_EXCEEDED,
          severity,
          `${metric.name} exceeded ${thresholdValue}${threshold.unit}`,
          `The ${metric.type} metric for ${metric.name} has exceeded the ${severity} threshold of ${thresholdValue}${threshold.unit}. Current value: ${metric.value}${metric.unit}`,
          metric.type,
          thresholdValue,
          metric.value,
          metric.metadata
        )
      }
    }
  }

  private createAlert(
    type: AlertType,
    severity: AlertSeverity,
    title: string,
    description: string,
    metric: string,
    threshold: number,
    currentValue: number,
    metadata?: Record<string, any>
  ): void {
    const alert: PerformanceAlert = {
      id: this.generateId(),
      timestamp: Date.now(),
      type,
      severity,
      title,
      description,
      metric,
      threshold,
      currentValue,
      status: AlertStatus.ACTIVE,
      metadata
    }

    this.alerts.push(alert)
    this.cleanupOldAlerts()
  }

  private generateRecommendations(
    metrics: any,
    alerts: PerformanceAlert[]
  ): string[] {
    const recommendations: string[] = []

    // Check response time
    if (metrics.average.api_response_time > 1000) {
      recommendations.push('Consider optimizing API endpoints or implementing caching')
    }

    // Check error rate
    if (metrics.average.error_rate > 5) {
      recommendations.push('High error rate detected. Review error logs and fix issues')
    }

    // Check memory usage
    if (metrics.average.memory_usage > 80) {
      recommendations.push('High memory usage detected. Consider memory optimization or scaling')
    }

    // Check cache hit rate
    if (metrics.average.cache_hit_rate < 70) {
      recommendations.push('Low cache hit rate. Consider optimizing cache strategy')
    }

    // Check for critical alerts
    const criticalAlerts = alerts.filter(a => a.severity === AlertSeverity.CRITICAL)
    if (criticalAlerts.length > 0) {
      recommendations.push('Critical alerts detected. Immediate attention required')
    }

    return recommendations
  }

  private getQueryType(query: string): string {
    const upperQuery = query.toUpperCase()
    if (upperQuery.startsWith('SELECT')) return 'SELECT'
    if (upperQuery.startsWith('INSERT')) return 'INSERT'
    if (upperQuery.startsWith('UPDATE')) return 'UPDATE'
    if (upperQuery.startsWith('DELETE')) return 'DELETE'
    return 'OTHER'
  }

  private getPeriodMs(period: string): number {
    const periods: Record<string, number> = {
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000
    }
    return periods[period] || periods['1h']
  }

  private cleanupOldMetrics(): void {
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics)
    }
  }

  private cleanupOldAlerts(): void {
    if (this.alerts.length > this.maxAlerts) {
      this.alerts = this.alerts.slice(-this.maxAlerts)
    }
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      const cutoff = Date.now() - (24 * 60 * 60 * 1000) // 24 hours
      this.metrics = this.metrics.filter(m => m.timestamp > cutoff)
      this.alerts = this.alerts.filter(a => a.timestamp > cutoff)
    }, 60 * 60 * 1000) // Every hour
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Export convenience functions
export const monitor = {
  recordApiResponse: (endpoint: string, method: string, responseTime: number, statusCode: number, metadata?: Record<string, any>) =>
    performanceMonitor.recordApiResponseTime(endpoint, method, responseTime, statusCode, metadata),
  recordDatabaseQuery: (query: string, duration: number, rowsReturned: number, metadata?: Record<string, any>) =>
    performanceMonitor.recordDatabaseQuery(query, duration, rowsReturned, metadata),
  recordCachePerformance: (cacheName: string, hitRate: number, totalRequests: number, metadata?: Record<string, any>) =>
    performanceMonitor.recordCachePerformance(cacheName, hitRate, totalRequests, metadata),
  recordSystemResource: (type: 'memory' | 'cpu', usage: number, metadata?: Record<string, any>) =>
    performanceMonitor.recordSystemResource(type, usage, metadata),
  recordPageLoad: (page: string, loadTime: number, metadata?: Record<string, any>) =>
    performanceMonitor.recordPageLoad(page, loadTime, metadata)
}

export default PerformanceMonitor
