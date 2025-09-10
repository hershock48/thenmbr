// Enhanced AI Service for Newsletter Content Analysis
// Professional implementation with usage tracking and tier management

import OpenAI from 'openai'

export interface AISuggestion {
  id: string
  blockId: string
  type: 'tone' | 'clarity' | 'engagement' | 'length' | 'cta' | 'subject' | 'overall'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  suggestion: string
  currentText: string
  improvedText: string
  reasoning: string
}

export interface NewsletterContent {
  subject: string
  blocks: Array<{
    id: string
    type: string
    content: string
  }>
}

export interface UsageStats {
  monthlyUsage: number
  monthlyLimit: number
  tier: 'free' | 'starter' | 'growth' | 'pro'
  canUseAI: boolean
  resetDate: string
}

class AIService {
  private static instance: AIService
  private openai: OpenAI | null = null
  private isInitialized: boolean = false

  constructor() {
    this.initializeOpenAI()
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }

  private initializeOpenAI() {
    if (process.env.OPENAI_API_KEY) {
      try {
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        })
        this.isInitialized = true
        console.log('✅ OpenAI service initialized successfully')
      } catch (error) {
        console.error('❌ Failed to initialize OpenAI:', error)
        this.isInitialized = false
      }
    } else {
      console.warn('⚠️ OPENAI_API_KEY not found. AI Review will use mock suggestions.')
      this.isInitialized = false
    }
  }

  // Get user's current usage stats
  async getUserUsageStats(userId: string): Promise<UsageStats> {
    // In a real app, this would fetch from your database
    // For now, we'll use localStorage to simulate user data
    const stored = localStorage.getItem(`ai_usage_${userId}`)
    
    if (stored) {
      const data = JSON.parse(stored)
      const now = new Date()
      const resetDate = new Date(data.resetDate)
      
      // Check if we need to reset monthly usage
      if (now > resetDate) {
        const newResetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        const resetData = {
          monthlyUsage: 0,
          monthlyLimit: data.monthlyLimit,
          tier: data.tier,
          resetDate: newResetDate.toISOString()
        }
        localStorage.setItem(`ai_usage_${userId}`, JSON.stringify(resetData))
        return { ...resetData, canUseAI: true }
      }
      
      return {
        ...data,
        canUseAI: data.monthlyUsage < data.monthlyLimit
      }
    }
    
    // Default to free tier for new users
    const defaultStats: UsageStats = {
      monthlyUsage: 0,
      monthlyLimit: 10, // Free tier: 10 AI reviews per month
      tier: 'free',
      canUseAI: true,
      resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
    }
    
    localStorage.setItem(`ai_usage_${userId}`, JSON.stringify(defaultStats))
    return defaultStats
  }

  // Check if user can use AI Review
  async canUserUseAI(userId: string): Promise<{ canUse: boolean; reason?: string; usage?: UsageStats }> {
    const usage = await this.getUserUsageStats(userId)
    
    if (!usage.canUseAI) {
      const resetDate = new Date(usage.resetDate).toLocaleDateString()
      return {
        canUse: false,
        reason: `You've reached your monthly limit of ${usage.monthlyLimit} AI reviews. Limit resets on ${resetDate}.`,
        usage
      }
    }
    
    return { canUse: true, usage }
  }

  // Increment usage after successful AI review
  async incrementUsage(userId: string): Promise<void> {
    const usage = await this.getUserUsageStats(userId)
    const newUsage = {
      ...usage,
      monthlyUsage: usage.monthlyUsage + 1,
      canUseAI: (usage.monthlyUsage + 1) < usage.monthlyLimit
    }
    localStorage.setItem(`ai_usage_${userId}`, JSON.stringify(newUsage))
  }

  // Main AI analysis function
  async analyzeNewsletterContent(
    content: NewsletterContent, 
    userId: string
  ): Promise<{ suggestions: AISuggestion[]; usage: UsageStats }> {
    
    // Check if user can use AI
    const { canUse, reason, usage } = await this.canUserUseAI(userId)
    if (!canUse) {
      throw new Error(reason || 'AI Review not available')
    }

    // Check if OpenAI is available
    if (!this.isInitialized || !this.openai) {
      console.warn('OpenAI not available, using mock suggestions')
      const mockSuggestions = this.generateMockSuggestions(content)
      await this.incrementUsage(userId)
      return { suggestions: mockSuggestions, usage: await this.getUserUsageStats(userId) }
    }

    try {
      const suggestions = await this.performAIAnalysis(content)
      await this.incrementUsage(userId)
      return { suggestions, usage: await this.getUserUsageStats(userId) }
    } catch (error) {
      console.error('AI analysis failed:', error)
      // Fallback to mock suggestions
      const mockSuggestions = this.generateMockSuggestions(content)
      await this.incrementUsage(userId)
      return { suggestions: mockSuggestions, usage: await this.getUserUsageStats(userId) }
    }
  }

  private async performAIAnalysis(content: NewsletterContent): Promise<AISuggestion[]> {
    if (!this.openai) throw new Error('OpenAI not initialized')

    const prompt = this.buildAnalysisPrompt(content)
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert newsletter copywriter and marketing strategist specializing in nonprofit communications. 

Your task: Analyze newsletter content and provide 3-5 specific, actionable suggestions for improvement.

Focus on:
1. Engagement and emotional connection with donors
2. Clarity and readability
3. Call-to-action effectiveness
4. Tone and voice consistency
5. Length and structure optimization

Return your analysis as a JSON array of suggestion objects with this exact structure:
[
  {
    "id": "unique-id",
    "blockId": "block-id-or-overall",
    "type": "tone|clarity|engagement|length|cta|subject|overall",
    "priority": "high|medium|low",
    "title": "Brief title of the issue",
    "description": "What needs improvement",
    "suggestion": "Specific improvement suggestion",
    "currentText": "Current text (if applicable)",
    "improvedText": "Suggested improved text",
    "reasoning": "Why this change will help"
  }
]`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    })

    const responseContent = response.choices[0]?.message?.content
    if (!responseContent) throw new Error('No response from OpenAI')

    const parsed = JSON.parse(responseContent)
    return Array.isArray(parsed.suggestions) ? parsed.suggestions : []
  }

  private buildAnalysisPrompt(content: NewsletterContent): string {
    const blocksText = content.blocks.map(block => 
      `${block.type.toUpperCase()}: ${block.content}`
    ).join('\n\n')

    return `Analyze this nonprofit newsletter content:

SUBJECT: ${content.subject}

CONTENT:
${blocksText}

Provide specific suggestions to improve donor engagement and fundraising effectiveness. Focus on making the content more compelling, clear, and actionable for potential donors.`
  }

  private generateMockSuggestions(content: NewsletterContent): AISuggestion[] {
    const suggestions: AISuggestion[] = []
    
    // Analyze subject line
    if (content.subject.length < 20) {
      suggestions.push({
        id: 'mock-subject-1',
        blockId: 'subject',
        type: 'subject',
        priority: 'high',
        title: 'Subject Line Too Short',
        description: 'Your subject line is quite brief and may not capture attention',
        suggestion: 'Expand your subject line to be more descriptive and compelling',
        currentText: content.subject,
        improvedText: `${content.subject} - See How Your Support Makes a Real Difference`,
        reasoning: 'Longer subject lines (30-50 characters) typically have higher open rates for nonprofit emails'
      })
    }

    // Analyze content blocks
    content.blocks.forEach((block, index) => {
      if (block.type === 'text' && block.content.length < 100) {
        suggestions.push({
          id: `mock-content-${index}`,
          blockId: block.id,
          type: 'length',
          priority: 'medium',
          title: 'Content Too Brief',
          description: 'This section could provide more detail to engage donors',
          suggestion: 'Add more specific details about impact and beneficiaries',
          currentText: block.content,
          improvedText: `${block.content} Your donation directly helps real people in need, creating measurable change in our community.`,
          reasoning: 'Detailed impact stories increase donor confidence and engagement'
        })
      }

      if (block.type === 'button' && !block.content.toLowerCase().includes('donate')) {
        suggestions.push({
          id: `mock-cta-${index}`,
          blockId: block.id,
          type: 'cta',
          priority: 'high',
          title: 'Call-to-Action Could Be Stronger',
          description: 'Your button text doesn\'t clearly indicate the donation action',
          suggestion: 'Make the call-to-action more direct and action-oriented',
          currentText: block.content,
          improvedText: 'Donate Now - Make a Difference',
          reasoning: 'Clear, action-oriented CTAs increase conversion rates by 20-30%'
        })
      }
    })

    // Add overall suggestion if we have content
    if (content.blocks.length > 0) {
      suggestions.push({
        id: 'mock-overall-1',
        blockId: 'overall',
        type: 'overall',
        priority: 'medium',
        title: 'Add Impact Story',
        description: 'Consider including a specific beneficiary story',
        suggestion: 'Add a brief story about someone your organization has helped',
        currentText: 'No specific story included',
        improvedText: 'Include: "Meet Sarah, a single mother who... [brief impact story]"',
        reasoning: 'Personal stories increase emotional connection and donation likelihood by 40%'
      })
    }

    return suggestions.slice(0, 5) // Limit to 5 suggestions
  }

  // Upgrade user tier (for admin/testing purposes)
  async upgradeUserTier(userId: string, newTier: 'free' | 'starter' | 'growth' | 'pro'): Promise<void> {
    const limits = {
      free: 10,
      starter: 100,
      growth: 500,
      pro: 999999 // Unlimited
    }
    
    const usage = await this.getUserUsageStats(userId)
    const newUsage = {
      ...usage,
      tier: newTier,
      monthlyLimit: limits[newTier]
    }
    
    localStorage.setItem(`ai_usage_${userId}`, JSON.stringify(newUsage))
  }
}

export const aiService = AIService.getInstance()