// Import Resend with fallback for missing dependency
let Resend: any = null
try {
  Resend = require('resend').Resend
} catch (error) {
  console.warn('Resend package not installed, using mock email service')
}

// Initialize Resend with API key (only if available)
const resend = Resend ? new Resend(process.env.RESEND_API_KEY) : null

export interface EmailData {
  to: string
  subject: string
  html: string
  from?: string
  replyTo?: string
}

export interface NewsletterEmailData extends EmailData {
  subscriberId: string
  campaignId: string
  storyId: string
  unsubscribeUrl: string
}

export class EmailService {
  private static instance: EmailService
  private resend: any

  constructor() {
    this.resend = Resend ? new Resend(process.env.RESEND_API_KEY) : null
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  async sendNewsletter(data: NewsletterEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!this.resend || !process.env.RESEND_API_KEY) {
        console.warn('Resend not available or RESEND_API_KEY not configured, using mock email service')
        return this.mockSendNewsletter(data)
      }

      const result = await this.resend.emails.send({
        from: data.from || process.env.SMTP_FROM || 'NMBR Platform <noreply@nmbrplatform.com>',
        to: data.to,
        subject: data.subject,
        html: data.html,
        reply_to: data.replyTo,
        headers: {
          'List-Unsubscribe': `<${data.unsubscribeUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
        }
      })

      if (result.error) {
        console.error('Resend error:', result.error)
        return { success: false, error: result.error.message }
      }

      return { success: true, messageId: result.data?.id }
    } catch (error) {
      console.error('Email service error:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  async sendWelcomeEmail(data: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!this.resend || !process.env.RESEND_API_KEY) {
        return this.mockSendEmail(data)
      }

      const result = await this.resend.emails.send({
        from: data.from || process.env.SMTP_FROM || 'NMBR Platform <noreply@nmbrplatform.com>',
        to: data.to,
        subject: data.subject,
        html: data.html,
        reply_to: data.replyTo
      })

      if (result.error) {
        return { success: false, error: result.error.message }
      }

      return { success: true, messageId: result.data?.id }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  async sendPasswordReset(data: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!this.resend || !process.env.RESEND_API_KEY) {
        return this.mockSendEmail(data)
      }

      const result = await this.resend.emails.send({
        from: data.from || process.env.SMTP_FROM || 'NMBR Platform <noreply@nmbrplatform.com>',
        to: data.to,
        subject: data.subject,
        html: data.html,
        reply_to: data.replyTo
      })

      if (result.error) {
        return { success: false, error: result.error.message }
      }

      return { success: true, messageId: result.data?.id }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  private async mockSendNewsletter(data: NewsletterEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    console.log('📧 MOCK EMAIL SEND (Newsletter)')
    console.log('To:', data.to)
    console.log('Subject:', data.subject)
    console.log('Campaign ID:', data.campaignId)
    console.log('Story ID:', data.storyId)
    console.log('Unsubscribe URL:', data.unsubscribeUrl)
    console.log('---')
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return { 
      success: true, 
      messageId: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` 
    }
  }

  private async mockSendEmail(data: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    console.log('📧 MOCK EMAIL SEND')
    console.log('To:', data.to)
    console.log('Subject:', data.subject)
    console.log('---')
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return { 
      success: true, 
      messageId: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` 
    }
  }

  // Batch sending for newsletters
  async sendNewsletterBatch(emails: NewsletterEmailData[]): Promise<{
    successful: number
    failed: number
    results: Array<{ email: string; success: boolean; messageId?: string; error?: string }>
  }> {
    const results = []
    let successful = 0
    let failed = 0

    for (const emailData of emails) {
      const result = await this.sendNewsletter(emailData)
      results.push({
        email: emailData.to,
        success: result.success,
        messageId: result.messageId,
        error: result.error
      })

      if (result.success) {
        successful++
      } else {
        failed++
      }

      // Rate limiting - wait 100ms between emails
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    return { successful, failed, results }
  }
}

export const emailService = EmailService.getInstance()
