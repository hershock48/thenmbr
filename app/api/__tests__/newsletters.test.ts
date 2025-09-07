import { NextRequest } from 'next/server'
import { GET, POST, PUT, DELETE } from '../newsletters/route'

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
    update: jest.fn(() => Promise.resolve({ data: null, error: null })),
    delete: jest.fn(() => Promise.resolve({ data: null, error: null })),
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

// Mock newsletter templates
jest.mock('@/lib/newsletter-templates', () => ({
  newsletterTemplates: [
    {
      id: 'template-1',
      name: 'Clean Water',
      category: 'environment',
      preview: 'template-preview.jpg'
    }
  ],
  newsletterThemes: [
    {
      id: 'theme-1',
      name: 'Ocean Blue',
      primaryColor: '#0066cc',
      secondaryColor: '#004499'
    }
  ]
}))

describe('Newsletters API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/newsletters', () => {
    it('should fetch newsletters successfully', async () => {
      const mockNewsletters = [
        {
          id: 'newsletter-1',
          name: 'Clean Water Update',
          type: 'story_update',
          status: 'draft',
          created_at: '2023-12-01T00:00:00Z'
        },
        {
          id: 'newsletter-2',
          name: 'Milestone Celebration',
          type: 'milestone',
          status: 'sent',
          created_at: '2023-12-02T00:00:00Z'
        }
      ]

      mockSupabase.from().select().limit.mockResolvedValueOnce({
        data: mockNewsletters,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/newsletters?orgId=123')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.newsletters).toEqual(mockNewsletters)
    })

    it('should require organization ID', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletters')

      const response = await GET(request)

      expect(response.status).toBe(400)
    })

    it('should handle database errors', async () => {
      mockSupabase.from().select().limit.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      })

      const request = new NextRequest('http://localhost:3000/api/newsletters?orgId=123')

      const response = await GET(request)

      expect(response.status).toBe(500)
    })
  })

  describe('POST /api/newsletters', () => {
    it('should create newsletter successfully', async () => {
      const requestBody = {
        name: 'New Newsletter',
        type: 'story_update',
        subject: 'Story Update',
        content: '<h1>Update</h1>',
        storyId: '123e4567-e89b-12d3-a456-426614174000',
        organizationId: '123e4567-e89b-12d3-a456-426614174001'
      }

      const request = new NextRequest('http://localhost:3000/api/newsletters', {
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
      expect(data.message).toBe('Newsletter created successfully')
      expect(data.newsletter).toBeDefined()
    })

    it('should validate required fields', async () => {
      const requestBody = {
        // Missing required fields
        type: 'story_update'
      }

      const request = new NextRequest('http://localhost:3000/api/newsletters', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
    })

    it('should validate newsletter type', async () => {
      const requestBody = {
        name: 'Test Newsletter',
        type: 'invalid_type',
        subject: 'Test Subject',
        content: 'Test Content',
        storyId: '123e4567-e89b-12d3-a456-426614174000',
        organizationId: '123e4567-e89b-12d3-a456-426614174001'
      }

      const request = new NextRequest('http://localhost:3000/api/newsletters', {
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
        name: 'Test Newsletter',
        type: 'story_update',
        subject: 'Test Subject',
        content: 'Test Content',
        storyId: '123e4567-e89b-12d3-a456-426614174000',
        organizationId: '123e4567-e89b-12d3-a456-426614174001'
      }

      const request = new NextRequest('http://localhost:3000/api/newsletters', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)

      expect(response.status).toBe(500)
    })
  })

  describe('PUT /api/newsletters', () => {
    it('should update newsletter successfully', async () => {
      const requestBody = {
        id: 'newsletter-1',
        name: 'Updated Newsletter',
        subject: 'Updated Subject',
        content: '<h1>Updated Content</h1>'
      }

      const request = new NextRequest('http://localhost:3000/api/newsletters', {
        method: 'PUT',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Newsletter updated successfully')
    })

    it('should require newsletter ID', async () => {
      const requestBody = {
        name: 'Updated Newsletter',
        subject: 'Updated Subject'
      }

      const request = new NextRequest('http://localhost:3000/api/newsletters', {
        method: 'PUT',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await PUT(request)

      expect(response.status).toBe(400)
    })

    it('should handle database errors', async () => {
      mockSupabase.from().update.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      })

      const requestBody = {
        id: 'newsletter-1',
        name: 'Updated Newsletter'
      }

      const request = new NextRequest('http://localhost:3000/api/newsletters', {
        method: 'PUT',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await PUT(request)

      expect(response.status).toBe(500)
    })
  })

  describe('DELETE /api/newsletters', () => {
    it('should delete newsletter successfully', async () => {
      const requestBody = {
        id: 'newsletter-1'
      }

      const request = new NextRequest('http://localhost:3000/api/newsletters', {
        method: 'DELETE',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Newsletter deleted successfully')
    })

    it('should require newsletter ID', async () => {
      const requestBody = {}

      const request = new NextRequest('http://localhost:3000/api/newsletters', {
        method: 'DELETE',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await DELETE(request)

      expect(response.status).toBe(400)
    })

    it('should handle database errors', async () => {
      mockSupabase.from().delete.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      })

      const requestBody = {
        id: 'newsletter-1'
      }

      const request = new NextRequest('http://localhost:3000/api/newsletters', {
        method: 'DELETE',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await DELETE(request)

      expect(response.status).toBe(500)
    })
  })
})
