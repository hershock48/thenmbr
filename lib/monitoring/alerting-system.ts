/**
 * Comprehensive Monitoring and Alerting System
 * Provides real-time monitoring, alerting, and notification capabilities
 */

export interface AlertRule {
  id: string
  name: string
  description: string
  metric: string
  condition: 'greater_than' | 'less_than' | 'equals' | 'not_equals' | 'contains' | 'not_contains'
  threshold: number | string
  severity: 'low' | 'medium' | 'high' | 'critical'
  enabled: boolean
  cooldown: number // minutes
  lastTriggered?: number
  tags: string[]
  notificationChannels: string[]
}

export interface Alert {
  id: string
  ruleId: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'acknowledged' | 'resolved' | 'suppressed'
  triggeredAt: number
  acknowledgedAt?: number
  resolvedAt?: number
  acknowledgedBy?: string
  resolvedBy?: string
  metadata: Record<string, any>
  tags: string[]
}

export interface NotificationChannel {
  id: string
  name: string
  type: 'email' | 'slack' | 'webhook' | 'sms' | 'push'
  config: Record<string, any>
  enabled: boolean
  rateLimit: number // per hour
  lastSent?: number
}

export interface Metric {
  name: string
  value: number | string
  timestamp: number
  tags: Record<string, string>
  metadata?: Record<string, any>
}

export interface AlertingConfig {
  globalCooldown: number // minutes
  maxAlertsPerHour: number
  enableEscalation: boolean
  escalationDelay: number // minutes
  enableSuppression: boolean
  suppressionDuration: number // minutes
}

export class AlertingSystem {
  private rules: Map<string, AlertRule> = new Map()
  private alerts: Map<string, Alert> = new Map()
  private channels: Map<string, NotificationChannel> = new Map()
  private metrics: Metric[] = []
  private config: AlertingConfig
  private isRunning: boolean = false
  private checkInterval: NodeJS.Timeout | null = null

  constructor(config: Partial<AlertingConfig> = {}) {
    this.config = {
      globalCooldown: 5,
      maxAlertsPerHour: 100,
      enableEscalation: true,
      escalationDelay: 30,
      enableSuppression: true,
      suppressionDuration: 60,
      ...config
    }
  }

  // Start the alerting system
  start(): void {
    if (this.isRunning) return

    this.isRunning = true
    this.checkInterval = setInterval(() => {
      this.checkRules()
    }, 30000) // Check every 30 seconds

    console.log('🚨 Alerting system started')
  }

  // Stop the alerting system
  stop(): void {
    if (!this.isRunning) return

    this.isRunning = false
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }

    console.log('🛑 Alerting system stopped')
  }

  // Add alert rule
  addRule(rule: AlertRule): void {
    this.rules.set(rule.id, rule)
    console.log(`📋 Added alert rule: ${rule.name}`)
  }

  // Update alert rule
  updateRule(ruleId: string, updates: Partial<AlertRule>): boolean {
    const rule = this.rules.get(ruleId)
    if (!rule) return false

    const updatedRule = { ...rule, ...updates }
    this.rules.set(ruleId, updatedRule)
    console.log(`📝 Updated alert rule: ${rule.name}`)
    return true
  }

  // Remove alert rule
  removeRule(ruleId: string): boolean {
    const rule = this.rules.get(ruleId)
    if (!rule) return false

    this.rules.delete(ruleId)
    console.log(`🗑️ Removed alert rule: ${rule.name}`)
    return true
  }

  // Add notification channel
  addChannel(channel: NotificationChannel): void {
    this.channels.set(channel.id, channel)
    console.log(`📡 Added notification channel: ${channel.name}`)
  }

  // Update notification channel
  updateChannel(channelId: string, updates: Partial<NotificationChannel>): boolean {
    const channel = this.channels.get(channelId)
    if (!channel) return false

    const updatedChannel = { ...channel, ...updates }
    this.channels.set(channelId, updatedChannel)
    console.log(`📝 Updated notification channel: ${channel.name}`)
    return true
  }

  // Remove notification channel
  removeChannel(channelId: string): boolean {
    const channel = this.channels.get(channelId)
    if (!channel) return false

    this.channels.delete(channelId)
    console.log(`🗑️ Removed notification channel: ${channel.name}`)
    return true
  }

  // Record metric
  recordMetric(metric: Metric): void {
    this.metrics.push(metric)
    
    // Keep only last 1000 metrics to prevent memory issues
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000)
    }
  }

  // Check all rules
  private checkRules(): void {
    if (!this.isRunning) return

    for (const rule of this.rules.values()) {
      if (!rule.enabled) continue

      // Check cooldown
      if (rule.lastTriggered && Date.now() - rule.lastTriggered < rule.cooldown * 60 * 1000) {
        continue
      }

      // Check if rule should trigger
      if (this.shouldTriggerRule(rule)) {
        this.triggerAlert(rule)
        rule.lastTriggered = Date.now()
      }
    }
  }

  // Check if rule should trigger
  private shouldTriggerRule(rule: AlertRule): boolean {
    const recentMetrics = this.getRecentMetrics(rule.metric, 5) // Last 5 minutes
    if (recentMetrics.length === 0) return false

    const latestMetric = recentMetrics[recentMetrics.length - 1]
    
    switch (rule.condition) {
      case 'greater_than':
        return Number(latestMetric.value) > Number(rule.threshold)
      case 'less_than':
        return Number(latestMetric.value) < Number(rule.threshold)
      case 'equals':
        return latestMetric.value === rule.threshold
      case 'not_equals':
        return latestMetric.value !== rule.threshold
      case 'contains':
        return String(latestMetric.value).includes(String(rule.threshold))
      case 'not_contains':
        return !String(latestMetric.value).includes(String(rule.threshold))
      default:
        return false
    }
  }

  // Get recent metrics for a specific metric name
  private getRecentMetrics(metricName: string, minutes: number): Metric[] {
    const cutoff = Date.now() - (minutes * 60 * 1000)
    return this.metrics.filter(m => 
      m.name === metricName && m.timestamp >= cutoff
    )
  }

  // Trigger alert
  private triggerAlert(rule: AlertRule): void {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ruleId: rule.id,
      title: rule.name,
      description: rule.description,
      severity: rule.severity,
      status: 'active',
      triggeredAt: Date.now(),
      metadata: {
        rule: rule,
        threshold: rule.threshold,
        condition: rule.condition
      },
      tags: rule.tags
    }

    this.alerts.set(alert.id, alert)
    console.log(`🚨 Alert triggered: ${alert.title} (${alert.severity})`)

    // Send notifications
    this.sendNotifications(alert, rule)
  }

  // Send notifications for alert
  private async sendNotifications(alert: Alert, rule: AlertRule): Promise<void> {
    for (const channelId of rule.notificationChannels) {
      const channel = this.channels.get(channelId)
      if (!channel || !channel.enabled) continue

      // Check rate limit
      if (this.isRateLimited(channel)) continue

      try {
        await this.sendNotification(channel, alert)
        channel.lastSent = Date.now()
      } catch (error) {
        console.error(`Failed to send notification via ${channel.name}:`, error)
      }
    }
  }

  // Check if channel is rate limited
  private isRateLimited(channel: NotificationChannel): boolean {
    if (!channel.lastSent) return false

    const timeSinceLastSent = Date.now() - channel.lastSent
    const rateLimitMs = (60 * 60 * 1000) / channel.rateLimit // Convert per hour to per ms

    return timeSinceLastSent < rateLimitMs
  }

  // Send notification via channel
  private async sendNotification(channel: NotificationChannel, alert: Alert): Promise<void> {
    const message = this.formatAlertMessage(alert)

    switch (channel.type) {
      case 'email':
        await this.sendEmail(channel, message)
        break
      case 'slack':
        await this.sendSlack(channel, message)
        break
      case 'webhook':
        await this.sendWebhook(channel, message)
        break
      case 'sms':
        await this.sendSMS(channel, message)
        break
      case 'push':
        await this.sendPush(channel, message)
        break
      default:
        console.warn(`Unknown notification channel type: ${channel.type}`)
    }
  }

  // Format alert message
  private formatAlertMessage(alert: Alert): string {
    const severityEmoji = {
      low: '🟡',
      medium: '🟠',
      high: '🔴',
      critical: '🚨'
    }

    return `${severityEmoji[alert.severity]} **${alert.title}**

**Severity:** ${alert.severity.toUpperCase()}
**Status:** ${alert.status.toUpperCase()}
**Triggered:** ${new Date(alert.triggeredAt).toISOString()}

${alert.description}

**Tags:** ${alert.tags.join(', ')}`
  }

  // Send email notification
  private async sendEmail(channel: NotificationChannel, message: string): Promise<void> {
    // Implementation would depend on your email service
    console.log(`📧 Email sent to ${channel.config.email}: ${message}`)
  }

  // Send Slack notification
  private async sendSlack(channel: NotificationChannel, message: string): Promise<void> {
    // Implementation would depend on your Slack integration
    console.log(`💬 Slack message sent to ${channel.config.channel}: ${message}`)
  }

  // Send webhook notification
  private async sendWebhook(channel: NotificationChannel, message: string): Promise<void> {
    const response = await fetch(channel.config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...channel.config.headers
      },
      body: JSON.stringify({
        message,
        timestamp: Date.now(),
        channel: channel.name
      })
    })

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`)
    }

    console.log(`🔗 Webhook sent to ${channel.config.url}`)
  }

  // Send SMS notification
  private async sendSMS(channel: NotificationChannel, message: string): Promise<void> {
    // Implementation would depend on your SMS service
    console.log(`📱 SMS sent to ${channel.config.phone}: ${message}`)
  }

  // Send push notification
  private async sendPush(channel: NotificationChannel, message: string): Promise<void> {
    // Implementation would depend on your push notification service
    console.log(`📱 Push notification sent: ${message}`)
  }

  // Acknowledge alert
  acknowledgeAlert(alertId: string, acknowledgedBy: string): boolean {
    const alert = this.alerts.get(alertId)
    if (!alert || alert.status !== 'active') return false

    alert.status = 'acknowledged'
    alert.acknowledgedAt = Date.now()
    alert.acknowledgedBy = acknowledgedBy

    console.log(`✅ Alert acknowledged: ${alert.title} by ${acknowledgedBy}`)
    return true
  }

  // Resolve alert
  resolveAlert(alertId: string, resolvedBy: string): boolean {
    const alert = this.alerts.get(alertId)
    if (!alert || alert.status === 'resolved') return false

    alert.status = 'resolved'
    alert.resolvedAt = Date.now()
    alert.resolvedBy = resolvedBy

    console.log(`✅ Alert resolved: ${alert.title} by ${resolvedBy}`)
    return true
  }

  // Suppress alert
  suppressAlert(alertId: string, suppressedBy: string): boolean {
    const alert = this.alerts.get(alertId)
    if (!alert || alert.status === 'suppressed') return false

    alert.status = 'suppressed'
    alert.metadata.suppressedBy = suppressedBy
    alert.metadata.suppressedAt = Date.now()

    console.log(`🔇 Alert suppressed: ${alert.title} by ${suppressedBy}`)
    return true
  }

  // Get active alerts
  getActiveAlerts(): Alert[] {
    return Array.from(this.alerts.values()).filter(alert => alert.status === 'active')
  }

  // Get alerts by severity
  getAlertsBySeverity(severity: string): Alert[] {
    return Array.from(this.alerts.values()).filter(alert => alert.severity === severity)
  }

  // Get alerts by rule
  getAlertsByRule(ruleId: string): Alert[] {
    return Array.from(this.alerts.values()).filter(alert => alert.ruleId === ruleId)
  }

  // Get alert statistics
  getAlertStatistics(): {
    total: number
    active: number
    acknowledged: number
    resolved: number
    suppressed: number
    bySeverity: Record<string, number>
  } {
    const alerts = Array.from(this.alerts.values())
    
    return {
      total: alerts.length,
      active: alerts.filter(a => a.status === 'active').length,
      acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
      resolved: alerts.filter(a => a.status === 'resolved').length,
      suppressed: alerts.filter(a => a.status === 'suppressed').length,
      bySeverity: {
        low: alerts.filter(a => a.severity === 'low').length,
        medium: alerts.filter(a => a.severity === 'medium').length,
        high: alerts.filter(a => a.severity === 'high').length,
        critical: alerts.filter(a => a.severity === 'critical').length
      }
    }
  }

  // Export configuration
  exportConfiguration(): string {
    return JSON.stringify({
      rules: Array.from(this.rules.values()),
      channels: Array.from(this.channels.values()),
      config: this.config
    }, null, 2)
  }

  // Import configuration
  importConfiguration(config: string): boolean {
    try {
      const parsed = JSON.parse(config)
      
      if (parsed.rules) {
        parsed.rules.forEach((rule: AlertRule) => this.addRule(rule))
      }
      
      if (parsed.channels) {
        parsed.channels.forEach((channel: NotificationChannel) => this.addChannel(channel))
      }
      
      if (parsed.config) {
        this.config = { ...this.config, ...parsed.config }
      }
      
      return true
    } catch (error) {
      console.error('Failed to import configuration:', error)
      return false
    }
  }
}

// Export singleton instance
export const alertingSystem = new AlertingSystem()

// Export convenience functions
export const createAlertRule = (rule: Omit<AlertRule, 'id'>): AlertRule => ({
  id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  ...rule
})

export const createNotificationChannel = (channel: Omit<NotificationChannel, 'id'>): NotificationChannel => ({
  id: `channel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  ...channel
})

export default AlertingSystem
