import { NextRequest } from 'next/server'
import { POST } from '../email/send/route'

// Mock Supabase
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        limit: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      limit: jest.fn(() => Promise.resolve({ data: [], error: null })),
    })),
    insert: jest.fn(() => Promise.resolve({ data: { id: 'test-id' }, error: null })),
  })),
}

jest.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
}))

// Mock error handler
jest.mock('@/lib/error-handler', () => ({
  withRequestLogging: (handler: any) => handler,
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
  handleDatabaseError: jest.fn((error) => error),
  ValidationError: class ValidationError extends Error {
    constructor(message: string) {
      super(message)
      this.name = 'ValidationError'
    }
  },
}))

// Mock email templates
jest.mock('@/lib/email-templates', () => ({
  generateWelcomeEmail: jest.fn(() => ({
    subject: 'Welcome to NMBR Updates',
    html: '<h1>Welcome!</h1>',
    text: 'Welcome!'
  })),
  generateStoryUpdateEmail: jest.fn(() => ({
    subject: 'Story Update',
    html: '<h1>Update</h1>',
    text: 'Update'
  })),
  generateMilestoneEmail: jest.fn(() => ({
    subject: 'Milestone Reached!',
    html: '<h1>Milestone</h1>',
    text: 'Milestone'
  })),
}))

describe('Email Send API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/email/send', () => {
    it('should send welcome email successfully', async () => {
      const requestBody = {
        type: 'welcome',
        to: 'test@example.com',
        data: {
          firstName: 'John',
          storyTitle: 'Clean Water Project',
          organizationName: 'Hope Foundation'
        }
      }

      const request = new NextRequest('http://localhost:3000/api/email/send', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Email sent successfully')
      expect(data.emailId).toBeDefined()
    })

    it('should send story update email successfully', async () => {
      const requestBody = {
        type: 'story_update',
        to: 'test@example.com',
        data: {
          firstName: 'John',
          storyTitle: 'Clean Water Project',
          updateContent: 'Great progress on the well!',
          organizationName: 'Hope Foundation'
        }
      }

      const request = new NextRequest('http://localhost:3000/api/email/send', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Email sent successfully')
    })

    it('should send milestone email successfully', async () => {
      const requestBody = {
        type: 'milestone',
        to: 'test@example.com',
        data: {
          firstName: 'John',
          storyTitle: 'Clean Water Project',
          milestoneAmount: 5000,
          organizationName: 'Hope Foundation'
        }
      }

      const request = new NextRequest('http://localhost:3000/api/email/send', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Email sent successfully')
    })

    it('should validate required fields', async () => {
      const requestBody = {
        type: 'welcome',
        // Missing 'to' field
        data: {
          firstName: 'John'
        }
      }

      const request = new NextRequest('http://localhost:3000/api/email/send', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
    })

    it('should validate email type', async () => {
      const requestBody = {
        type: 'invalid_type',
        to: 'test@example.com',
        data: {
          firstName: 'John'
        }
      }

      const request = new NextRequest('http://localhost:3000/api/email/send', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
    })

    it('should validate email format', async () => {
      const requestBody = {
        type: 'welcome',
        to: 'invalid-email',
        data: {
          firstName: 'John'
        }
      }

      const request = new NextRequest('http://localhost:3000/api/email/send', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
    })

    it('should handle database errors', async () => {
      mockSupabase.from().insert.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      })

      const requestBody = {
        type: 'welcome',
        to: 'test@example.com',
        data: {
          firstName: 'John'
        }
      }

      const request = new NextRequest('http://localhost:3000/api/email/send', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)

      expect(response.status).toBe(500)
    })

    it('should handle template generation errors', async () => {
      // Mock template generation error
      const { generateWelcomeEmail } = require('@/lib/email-templates')
      generateWelcomeEmail.mockImplementationOnce(() => {
        throw new Error('Template generation failed')
      })

      const requestBody = {
        type: 'welcome',
        to: 'test@example.com',
        data: {
          firstName: 'John'
        }
      }

      const request = new NextRequest('http://localhost:3000/api/email/send', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)

      expect(response.status).toBe(500)
    })

    it('should log email events to database', async () => {
      const requestBody = {
        type: 'welcome',
        to: 'test@example.com',
        data: {
          firstName: 'John',
          storyTitle: 'Clean Water Project',
          organizationName: 'Hope Foundation'
        }
      }

      const request = new NextRequest('http://localhost:3000/api/email/send', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      await POST(request)

      // Verify database insert was called for email event
      expect(mockSupabase.from).toHaveBeenCalledWith('email_events')
      expect(mockSupabase.from().insert).toHaveBeenCalledWith(
        expect.objectContaining({
          event_type: 'sent',
          email_type: 'welcome',
          recipient_email: 'test@example.com',
          status: 'success'
        })
      )
    })

    it('should handle multiple recipients', async () => {
      const requestBody = {
        type: 'welcome',
        to: ['test1@example.com', 'test2@example.com'],
        data: {
          firstName: 'John'
        }
      }

      const request = new NextRequest('http://localhost:3000/api/email/send', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.recipients).toBe(2)
    })
  })
})
