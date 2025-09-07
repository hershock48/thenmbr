import { NextRequest } from 'next/server'

// Log levels
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

// Log categories
export enum LogCategory {
  AUTH = 'auth',
  API = 'api',
  DATABASE = 'database',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  BUSINESS = 'business',
  SYSTEM = 'system',
  USER_ACTION = 'user_action',
  ERROR = 'error',
  AUDIT = 'audit'
}

// Log entry interface
export interface LogEntry {
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

// Performance metrics
export interface PerformanceMetrics {
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

// Business metrics
export interface BusinessMetrics {
  timestamp: string
  event: string
  userId?: string
  organizationId?: string
  value?: number
  properties: Record<string, any>
}

// System health metrics
export interface SystemHealth {
  timestamp: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  uptime: number
  memoryUsage: number
  cpuUsage: number
  diskUsage: number
  databaseConnections: number
  activeUsers: number
  errorRate: number
  responseTime: number
  throughput: number
}

// Monitoring service class
export class MonitoringService {
  private logs: LogEntry[] = []
  private performanceMetrics: PerformanceMetrics[] = []
  private businessMetrics: BusinessMetrics[] = []
  private systemHealth: SystemHealth[] = []
  private maxLogs = 10000
  private maxMetrics = 5000

  // Logging methods
  log(level: LogLevel, category: LogCategory, message: string, context: Record<string, any> = {}): void {
    const logEntry: LogEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      context,
      tags: this.extractTags(message, context)
    }

    this.addLog(logEntry)
    this.outputToConsole(logEntry)
  }

  debug(category: LogCategory, message: string, context: Record<string, any> = {}): void {
    this.log(LogLevel.DEBUG, category, message, context)
  }

  info(category: LogCategory, message: string, context: Record<string, any> = {}): void {
    this.log(LogLevel.INFO, category, message, context)
  }

  warn(category: LogCategory, message: string, context: Record<string, any> = {}): void {
    this.log(LogLevel.WARN, category, message, context)
  }

  error(category: LogCategory, message: string, error?: Error, context: Record<string, any> = {}): void {
    const logEntry: LogEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      category,
      message,
      context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: (error as any).code
      } : undefined,
      tags: this.extractTags(message, context)
    }

    this.addLog(logEntry)
    this.outputToConsole(logEntry)
  }

  fatal(category: LogCategory, message: string, error?: Error, context: Record<string, any> = {}): void {
    const logEntry: LogEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level: LogLevel.FATAL,
      category,
      message,
      context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: (error as any).code
      } : undefined,
      tags: this.extractTags(message, context)
    }

    this.addLog(logEntry)
    this.outputToConsole(logEntry)
  }

  // Request logging
  logRequest(req: NextRequest, response: Response, duration: number, context: Record<string, any> = {}): void {
    const logEntry: LogEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      category: LogCategory.API,
      message: `${req.method} ${req.nextUrl.pathname} - ${response.status}`,
      context: {
        ...context,
        method: req.method,
        url: req.nextUrl.href,
        statusCode: response.status,
        duration
      },
      method: req.method,
      endpoint: req.nextUrl.pathname,
      statusCode: response.status,
      duration,
      ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown',
      requestId: req.headers.get('x-request-id') || this.generateId(),
      tags: ['api', 'request']
    }

    this.addLog(logEntry)
  }

  // Performance metrics
  recordPerformance(metrics: PerformanceMetrics): void {
    this.performanceMetrics.push(metrics)
    
    // Keep only recent metrics
    if (this.performanceMetrics.length > this.maxMetrics) {
      this.performanceMetrics = this.performanceMetrics.slice(-this.maxMetrics)
    }

    // Log slow requests
    if (metrics.duration > 5000) { // 5 seconds
      this.warn(LogCategory.PERFORMANCE, 'Slow request detected', {
        endpoint: metrics.endpoint,
        duration: metrics.duration,
        statusCode: metrics.statusCode
      })
    }
  }

  // Business metrics
  recordBusinessEvent(event: string, properties: Record<string, any> = {}, userId?: string, organizationId?: string, value?: number): void {
    const businessMetric: BusinessMetrics = {
      timestamp: new Date().toISOString(),
      event,
      userId,
      organizationId,
      value,
      properties
    }

    this.businessMetrics.push(businessMetric)
    
    // Keep only recent metrics
    if (this.businessMetrics.length > this.maxMetrics) {
      this.businessMetrics = this.businessMetrics.slice(-this.maxMetrics)
    }

    this.info(LogCategory.BUSINESS, `Business event: ${event}`, {
      event,
      userId,
      organizationId,
      value,
      properties
    })
  }

  // System health
  recordSystemHealth(health: SystemHealth): void {
    this.systemHealth.push(health)
    
    // Keep only recent health data
    if (this.systemHealth.length > 100) {
      this.systemHealth = this.systemHealth.slice(-100)
    }

    // Log health issues
    if (health.status === 'unhealthy') {
      this.error(LogCategory.SYSTEM, 'System health critical', undefined, health)
    } else if (health.status === 'degraded') {
      this.warn(LogCategory.SYSTEM, 'System health degraded', health)
    }
  }

  // Query methods
  getLogs(filters: {
    level?: LogLevel
    category?: LogCategory
    userId?: string
    organizationId?: string
    startTime?: string
    endTime?: string
    limit?: number
  } = {}): LogEntry[] {
    let filteredLogs = [...this.logs]

    if (filters.level) {
      filteredLogs = filteredLogs.filter(log => log.level === filters.level)
    }

    if (filters.category) {
      filteredLogs = filteredLogs.filter(log => log.category === filters.category)
    }

    if (filters.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filters.userId)
    }

    if (filters.organizationId) {
      filteredLogs = filteredLogs.filter(log => log.organizationId === filters.organizationId)
    }

    if (filters.startTime) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startTime!)
    }

    if (filters.endTime) {
      filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endTime!)
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Apply limit
    if (filters.limit) {
      filteredLogs = filteredLogs.slice(0, filters.limit)
    }

    return filteredLogs
  }

  getPerformanceMetrics(filters: {
    endpoint?: string
    startTime?: string
    endTime?: string
    limit?: number
  } = {}): PerformanceMetrics[] {
    let filteredMetrics = [...this.performanceMetrics]

    if (filters.endpoint) {
      filteredMetrics = filteredMetrics.filter(metric => metric.endpoint === filters.endpoint)
    }

    if (filters.startTime) {
      filteredMetrics = filteredMetrics.filter(metric => metric.timestamp >= filters.startTime!)
    }

    if (filters.endTime) {
      filteredMetrics = filteredMetrics.filter(metric => metric.timestamp <= filters.endTime!)
    }

    // Sort by timestamp (newest first)
    filteredMetrics.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Apply limit
    if (filters.limit) {
      filteredMetrics = filteredMetrics.slice(0, filters.limit)
    }

    return filteredMetrics
  }

  getBusinessMetrics(filters: {
    event?: string
    userId?: string
    organizationId?: string
    startTime?: string
    endTime?: string
    limit?: number
  } = {}): BusinessMetrics[] {
    let filteredMetrics = [...this.businessMetrics]

    if (filters.event) {
      filteredMetrics = filteredMetrics.filter(metric => metric.event === filters.event)
    }

    if (filters.userId) {
      filteredMetrics = filteredMetrics.filter(metric => metric.userId === filters.userId)
    }

    if (filters.organizationId) {
      filteredMetrics = filteredMetrics.filter(metric => metric.organizationId === filters.organizationId)
    }

    if (filters.startTime) {
      filteredMetrics = filteredMetrics.filter(metric => metric.timestamp >= filters.startTime!)
    }

    if (filters.endTime) {
      filteredMetrics = filteredMetrics.filter(metric => metric.timestamp <= filters.endTime!)
    }

    // Sort by timestamp (newest first)
    filteredMetrics.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Apply limit
    if (filters.limit) {
      filteredMetrics = filteredMetrics.slice(0, filters.limit)
    }

    return filteredMetrics
  }

  getSystemHealth(): SystemHealth | null {
    if (this.systemHealth.length === 0) return null
    return this.systemHealth[this.systemHealth.length - 1]
  }

  // Statistics
  getLogStatistics(): {
    totalLogs: number
    logsByLevel: Record<LogLevel, number>
    logsByCategory: Record<LogCategory, number>
    errorRate: number
    averageResponseTime: number
  } {
    const totalLogs = this.logs.length
    const logsByLevel = {} as Record<LogLevel, number>
    const logsByCategory = {} as Record<LogCategory, number>
    let errorCount = 0
    let totalResponseTime = 0
    let responseCount = 0

    for (const log of this.logs) {
      logsByLevel[log.level] = (logsByLevel[log.level] || 0) + 1
      logsByCategory[log.category] = (logsByCategory[log.category] || 0) + 1
      
      if (log.level === LogLevel.ERROR || log.level === LogLevel.FATAL) {
        errorCount++
      }
      
      if (log.duration) {
        totalResponseTime += log.duration
        responseCount++
      }
    }

    return {
      totalLogs,
      logsByLevel,
      logsByCategory,
      errorRate: totalLogs > 0 ? (errorCount / totalLogs) * 100 : 0,
      averageResponseTime: responseCount > 0 ? totalResponseTime / responseCount : 0
    }
  }

  // Private methods
  private addLog(logEntry: LogEntry): void {
    this.logs.push(logEntry)
    
    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }
  }

  private outputToConsole(logEntry: LogEntry): void {
    const timestamp = new Date(logEntry.timestamp).toISOString()
    const level = logEntry.level.toUpperCase().padEnd(5)
    const category = `[${logEntry.category}]`
    const message = logEntry.message

    const logMessage = `${timestamp} ${level} ${category} ${message}`

    switch (logEntry.level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, logEntry.context)
        break
      case LogLevel.INFO:
        console.info(logMessage, logEntry.context)
        break
      case LogLevel.WARN:
        console.warn(logMessage, logEntry.context)
        break
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(logMessage, logEntry.context, logEntry.error)
        break
    }
  }

  private extractTags(message: string, context: Record<string, any>): string[] {
    const tags: string[] = []
    
    // Extract common tags from message
    if (message.includes('error') || message.includes('failed')) tags.push('error')
    if (message.includes('slow') || message.includes('timeout')) tags.push('performance')
    if (message.includes('security') || message.includes('auth')) tags.push('security')
    if (message.includes('database') || message.includes('query')) tags.push('database')
    if (message.includes('user') || message.includes('login')) tags.push('user')
    
    // Extract tags from context
    if (context.tags) {
      tags.push(...context.tags)
    }
    
    return [...new Set(tags)] // Remove duplicates
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
  }
}

// Export singleton instance
export const monitoring = new MonitoringService()

// Export convenience functions
export const log = {
  debug: (category: LogCategory, message: string, context?: Record<string, any>) => 
    monitoring.debug(category, message, context),
  info: (category: LogCategory, message: string, context?: Record<string, any>) => 
    monitoring.info(category, message, context),
  warn: (category: LogCategory, message: string, context?: Record<string, any>) => 
    monitoring.warn(category, message, context),
  error: (category: LogCategory, message: string, error?: Error, context?: Record<string, any>) => 
    monitoring.error(category, message, error, context),
  fatal: (category: LogCategory, message: string, error?: Error, context?: Record<string, any>) => 
    monitoring.fatal(category, message, error, context)
}

export const metrics = {
  recordPerformance: (metrics: PerformanceMetrics) => monitoring.recordPerformance(metrics),
  recordBusinessEvent: (event: string, properties?: Record<string, any>, userId?: string, organizationId?: string, value?: number) => 
    monitoring.recordBusinessEvent(event, properties, userId, organizationId, value),
  recordSystemHealth: (health: SystemHealth) => monitoring.recordSystemHealth(health)
}

export default monitoring
