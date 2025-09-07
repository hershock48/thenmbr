import { PerformanceAlert, AlertSeverity, AlertStatus } from './performance-monitor'

// Alert notification interfaces
export interface AlertNotification {
  id: string
  alertId: string
  channel: NotificationChannel
  status: NotificationStatus
  sentAt: number
  deliveredAt?: number
  error?: string
  retryCount: number
  metadata?: Record<string, any>
}

export interface NotificationChannel {
  type: ChannelType
  config: Record<string, any>
  enabled: boolean
  rateLimit?: {
    maxPerHour: number
    maxPerDay: number
  }
}

export interface AlertRule {
  id: string
  name: string
  description: string
  conditions: AlertCondition[]
  actions: AlertAction[]
  enabled: boolean
  cooldown: number // minutes
  lastTriggered?: number
  metadata?: Record<string, any>
}

export interface AlertCondition {
  metric: string
  operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq'
  value: number
  duration: number // seconds
}

export interface AlertAction {
  type: ActionType
  config: Record<string, any>
  enabled: boolean
}

// Enums
export enum ChannelType {
  EMAIL = 'email',
  SLACK = 'slack',
  WEBHOOK = 'webhook',
  SMS = 'sms',
  PUSH = 'push',
  DISCORD = 'discord',
  TEAMS = 'teams'
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  RATE_LIMITED = 'rate_limited'
}

export enum ActionType {
  SEND_NOTIFICATION = 'send_notification',
  CREATE_TICKET = 'create_ticket',
  SCALE_SERVICE = 'scale_service',
  RESTART_SERVICE = 'restart_service',
  EXECUTE_SCRIPT = 'execute_script'
}

// Alerting service
export class AlertingService {
  private notifications: AlertNotification[] = []
  private channels: Map<string, NotificationChannel> = new Map()
  private rules: Map<string, AlertRule> = new Map()
  private rateLimits: Map<string, { hourly: number; daily: number; lastReset: number }> = new Map()

  constructor() {
    this.initializeDefaultChannels()
    this.initializeDefaultRules()
    this.startRateLimitReset()
  }

  // Add notification channel
  addChannel(id: string, channel: NotificationChannel): void {
    this.channels.set(id, channel)
  }

  // Remove notification channel
  removeChannel(id: string): boolean {
    return this.channels.delete(id)
  }

  // Add alert rule
  addRule(rule: AlertRule): void {
    this.rules.set(rule.id, rule)
  }

  // Remove alert rule
  removeRule(id: string): boolean {
    return this.rules.delete(id)
  }

  // Process alert
  async processAlert(alert: PerformanceAlert): Promise<void> {
    // Check if alert should be suppressed
    if (this.shouldSuppressAlert(alert)) {
      return
    }

    // Find applicable rules
    const applicableRules = this.findApplicableRules(alert)
    
    for (const rule of applicableRules) {
      if (this.shouldTriggerRule(rule, alert)) {
        await this.executeRule(rule, alert)
        rule.lastTriggered = Date.now()
      }
    }
  }

  // Send notification
  async sendNotification(
    channelId: string,
    alert: PerformanceAlert,
    customMessage?: string
  ): Promise<boolean> {
    const channel = this.channels.get(channelId)
    if (!channel || !channel.enabled) {
      return false
    }

    // Check rate limits
    if (!this.checkRateLimit(channelId, channel)) {
      this.recordNotification(channelId, alert.id, NotificationStatus.RATE_LIMITED)
      return false
    }

    try {
      const message = customMessage || this.generateAlertMessage(alert)
      const success = await this.sendToChannel(channel, message, alert)
      
      if (success) {
        this.recordNotification(channelId, alert.id, NotificationStatus.SENT)
        this.updateRateLimit(channelId)
        return true
      } else {
        this.recordNotification(channelId, alert.id, NotificationStatus.FAILED, 'Send failed')
        return false
      }
    } catch (error) {
      this.recordNotification(channelId, alert.id, NotificationStatus.FAILED, error instanceof Error ? error.message : 'Unknown error')
      return false
    }
  }

  // Get notification history
  getNotifications(filters: {
    channelId?: string
    alertId?: string
    status?: NotificationStatus
    startTime?: number
    endTime?: number
    limit?: number
  } = {}): AlertNotification[] {
    let filtered = [...this.notifications]

    if (filters.channelId) {
      filtered = filtered.filter(n => n.channel === filters.channelId)
    }

    if (filters.alertId) {
      filtered = filtered.filter(n => n.alertId === filters.alertId)
    }

    if (filters.status) {
      filtered = filtered.filter(n => n.status === filters.status)
    }

    if (filters.startTime) {
      filtered = filtered.filter(n => n.sentAt >= filters.startTime!)
    }

    if (filters.endTime) {
      filtered = filtered.filter(n => n.sentAt <= filters.endTime!)
    }

    // Sort by sent time (newest first)
    filtered.sort((a, b) => b.sentAt - a.sentAt)

    // Apply limit
    if (filters.limit) {
      filtered = filtered.slice(0, filters.limit)
    }

    return filtered
  }

  // Get alert rules
  getRules(): AlertRule[] {
    return Array.from(this.rules.values())
  }

  // Get channels
  getChannels(): NotificationChannel[] {
    return Array.from(this.channels.values())
  }

  // Test notification channel
  async testChannel(channelId: string, testMessage: string): Promise<boolean> {
    const channel = this.channels.get(channelId)
    if (!channel) {
      return false
    }

    try {
      return await this.sendToChannel(channel, testMessage, null)
    } catch (error) {
      return false
    }
  }

  // Private methods
  private shouldSuppressAlert(alert: PerformanceAlert): boolean {
    // Check if alert is already suppressed
    if (alert.status === AlertStatus.SUPPRESSED) {
      return true
    }

    // Check for duplicate alerts in the last 5 minutes
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000)
    const recentAlerts = this.notifications.filter(n => 
      n.alertId === alert.id && 
      n.sentAt > fiveMinutesAgo
    )

    return recentAlerts.length > 0
  }

  private findApplicableRules(alert: PerformanceAlert): AlertRule[] {
    return Array.from(this.rules.values()).filter(rule => {
      if (!rule.enabled) return false

      // Check if rule conditions match the alert
      return rule.conditions.some(condition => 
        condition.metric === alert.metric &&
        this.evaluateCondition(condition, alert.currentValue)
      )
    })
  }

  private shouldTriggerRule(rule: AlertRule, alert: PerformanceAlert): boolean {
    // Check cooldown period
    if (rule.lastTriggered) {
      const cooldownMs = rule.cooldown * 60 * 1000
      if (Date.now() - rule.lastTriggered < cooldownMs) {
        return false
      }
    }

    return true
  }

  private async executeRule(rule: AlertRule, alert: PerformanceAlert): Promise<void> {
    for (const action of rule.actions) {
      if (!action.enabled) continue

      try {
        await this.executeAction(action, alert)
      } catch (error) {
        console.error(`Failed to execute action ${action.type}:`, error)
      }
    }
  }

  private async executeAction(action: AlertAction, alert: PerformanceAlert): Promise<void> {
    switch (action.type) {
      case ActionType.SEND_NOTIFICATION:
        const channelId = action.config.channelId
        if (channelId) {
          await this.sendNotification(channelId, alert, action.config.message)
        }
        break

      case ActionType.CREATE_TICKET:
        await this.createTicket(alert, action.config)
        break

      case ActionType.SCALE_SERVICE:
        await this.scaleService(action.config)
        break

      case ActionType.RESTART_SERVICE:
        await this.restartService(action.config)
        break

      case ActionType.EXECUTE_SCRIPT:
        await this.executeScript(action.config, alert)
        break
    }
  }

  private evaluateCondition(condition: AlertCondition, value: number): boolean {
    switch (condition.operator) {
      case 'gt': return value > condition.value
      case 'gte': return value >= condition.value
      case 'lt': return value < condition.value
      case 'lte': return value <= condition.value
      case 'eq': return value === condition.value
      case 'neq': return value !== condition.value
      default: return false
    }
  }

  private async sendToChannel(
    channel: NotificationChannel,
    message: string,
    alert: PerformanceAlert | null
  ): Promise<boolean> {
    switch (channel.type) {
      case ChannelType.EMAIL:
        return await this.sendEmail(channel.config, message, alert)
      case ChannelType.SLACK:
        return await this.sendSlack(channel.config, message, alert)
      case ChannelType.WEBHOOK:
        return await this.sendWebhook(channel.config, message, alert)
      case ChannelType.SMS:
        return await this.sendSMS(channel.config, message, alert)
      case ChannelType.PUSH:
        return await this.sendPush(channel.config, message, alert)
      case ChannelType.DISCORD:
        return await this.sendDiscord(channel.config, message, alert)
      case ChannelType.TEAMS:
        return await this.sendTeams(channel.config, message, alert)
      default:
        return false
    }
  }

  private async sendEmail(config: Record<string, any>, message: string, alert: PerformanceAlert | null): Promise<boolean> {
    // Implement email sending logic
    console.log('Sending email notification:', { config, message, alert })
    return true
  }

  private async sendSlack(config: Record<string, any>, message: string, alert: PerformanceAlert | null): Promise<boolean> {
    // Implement Slack sending logic
    console.log('Sending Slack notification:', { config, message, alert })
    return true
  }

  private async sendWebhook(config: Record<string, any>, message: string, alert: PerformanceAlert | null): Promise<boolean> {
    // Implement webhook sending logic
    console.log('Sending webhook notification:', { config, message, alert })
    return true
  }

  private async sendSMS(config: Record<string, any>, message: string, alert: PerformanceAlert | null): Promise<boolean> {
    // Implement SMS sending logic
    console.log('Sending SMS notification:', { config, message, alert })
    return true
  }

  private async sendPush(config: Record<string, any>, message: string, alert: PerformanceAlert | null): Promise<boolean> {
    // Implement push notification logic
    console.log('Sending push notification:', { config, message, alert })
    return true
  }

  private async sendDiscord(config: Record<string, any>, message: string, alert: PerformanceAlert | null): Promise<boolean> {
    // Implement Discord sending logic
    console.log('Sending Discord notification:', { config, message, alert })
    return true
  }

  private async sendTeams(config: Record<string, any>, message: string, alert: PerformanceAlert | null): Promise<boolean> {
    // Implement Teams sending logic
    console.log('Sending Teams notification:', { config, message, alert })
    return true
  }

  private async createTicket(alert: PerformanceAlert, config: Record<string, any>): Promise<void> {
    // Implement ticket creation logic
    console.log('Creating ticket for alert:', alert)
  }

  private async scaleService(config: Record<string, any>): Promise<void> {
    // Implement service scaling logic
    console.log('Scaling service:', config)
  }

  private async restartService(config: Record<string, any>): Promise<void> {
    // Implement service restart logic
    console.log('Restarting service:', config)
  }

  private async executeScript(config: Record<string, any>, alert: PerformanceAlert): Promise<void> {
    // Implement script execution logic
    console.log('Executing script:', config, alert)
  }

  private generateAlertMessage(alert: PerformanceAlert): string {
    const severityEmoji = {
      [AlertSeverity.LOW]: '🟡',
      [AlertSeverity.MEDIUM]: '🟠',
      [AlertSeverity.HIGH]: '🔴',
      [AlertSeverity.CRITICAL]: '🚨'
    }

    return `${severityEmoji[alert.severity]} **${alert.title}**

**Description:** ${alert.description}
**Metric:** ${alert.metric}
**Current Value:** ${alert.currentValue}
**Threshold:** ${alert.threshold}
**Severity:** ${alert.severity.toUpperCase()}
**Time:** ${new Date(alert.timestamp).toISOString()}

${alert.metadata ? `**Metadata:** ${JSON.stringify(alert.metadata, null, 2)}` : ''}`
  }

  private checkRateLimit(channelId: string, channel: NotificationChannel): boolean {
    if (!channel.rateLimit) return true

    const rateLimit = this.rateLimits.get(channelId) || { hourly: 0, daily: 0, lastReset: Date.now() }
    const now = Date.now()

    // Reset counters if needed
    if (now - rateLimit.lastReset > 24 * 60 * 60 * 1000) {
      rateLimit.daily = 0
    }
    if (now - rateLimit.lastReset > 60 * 60 * 1000) {
      rateLimit.hourly = 0
    }

    return rateLimit.hourly < channel.rateLimit.maxPerHour && 
           rateLimit.daily < channel.rateLimit.maxPerDay
  }

  private updateRateLimit(channelId: string): void {
    const rateLimit = this.rateLimits.get(channelId) || { hourly: 0, daily: 0, lastReset: Date.now() }
    rateLimit.hourly++
    rateLimit.daily++
    this.rateLimits.set(channelId, rateLimit)
  }

  private recordNotification(
    channelId: string,
    alertId: string,
    status: NotificationStatus,
    error?: string
  ): void {
    const notification: AlertNotification = {
      id: this.generateId(),
      alertId,
      channel: channelId,
      status,
      sentAt: Date.now(),
      retryCount: 0,
      error
    }

    this.notifications.push(notification)
  }

  private initializeDefaultChannels(): void {
    // Email channel
    this.addChannel('email', {
      type: ChannelType.EMAIL,
      config: {
        smtp: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.SMTP_USER,
          password: process.env.SMTP_PASSWORD
        },
        from: process.env.SMTP_FROM,
        to: process.env.ALERT_EMAIL_RECIPIENTS?.split(',') || []
      },
      enabled: true,
      rateLimit: { maxPerHour: 10, maxPerDay: 100 }
    })

    // Slack channel
    this.addChannel('slack', {
      type: ChannelType.SLACK,
      config: {
        webhookUrl: process.env.SLACK_WEBHOOK_URL,
        channel: process.env.SLACK_ALERT_CHANNEL || '#alerts'
      },
      enabled: !!process.env.SLACK_WEBHOOK_URL,
      rateLimit: { maxPerHour: 20, maxPerDay: 200 }
    })

    // Webhook channel
    this.addChannel('webhook', {
      type: ChannelType.WEBHOOK,
      config: {
        url: process.env.ALERT_WEBHOOK_URL,
        headers: {
          'Authorization': `Bearer ${process.env.ALERT_WEBHOOK_TOKEN}`,
          'Content-Type': 'application/json'
        }
      },
      enabled: !!process.env.ALERT_WEBHOOK_URL,
      rateLimit: { maxPerHour: 50, maxPerDay: 500 }
    })
  }

  private initializeDefaultRules(): void {
    // Critical alerts rule
    this.addRule({
      id: 'critical-alerts',
      name: 'Critical Alerts',
      description: 'Send notifications for critical alerts',
      conditions: [
        { metric: 'severity', operator: 'eq', value: AlertSeverity.CRITICAL, duration: 0 }
      ],
      actions: [
        { type: ActionType.SEND_NOTIFICATION, config: { channelId: 'slack' }, enabled: true },
        { type: ActionType.SEND_NOTIFICATION, config: { channelId: 'email' }, enabled: true }
      ],
      enabled: true,
      cooldown: 5
    })

    // High severity alerts rule
    this.addRule({
      id: 'high-alerts',
      name: 'High Severity Alerts',
      description: 'Send notifications for high severity alerts',
      conditions: [
        { metric: 'severity', operator: 'eq', value: AlertSeverity.HIGH, duration: 0 }
      ],
      actions: [
        { type: ActionType.SEND_NOTIFICATION, config: { channelId: 'slack' }, enabled: true }
      ],
      enabled: true,
      cooldown: 15
    })
  }

  private startRateLimitReset(): void {
    setInterval(() => {
      const now = Date.now()
      for (const [channelId, rateLimit] of this.rateLimits.entries()) {
        if (now - rateLimit.lastReset > 60 * 60 * 1000) {
          rateLimit.hourly = 0
        }
        if (now - rateLimit.lastReset > 24 * 60 * 60 * 1000) {
          rateLimit.daily = 0
          rateLimit.lastReset = now
        }
      }
    }, 60 * 60 * 1000) // Every hour
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
  }
}

// Export singleton instance
export const alertingService = new AlertingService()

export default AlertingService
