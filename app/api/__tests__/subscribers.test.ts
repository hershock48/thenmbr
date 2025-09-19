import { NextRequest } from 'next/server'
import { POST, GET, DELETE } from '../subscribers/route'

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
  validateEmail: jest.fn((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
  validateRequired: jest.fn((value, field) => {
    if (!value) throw new Error(`${field} is required`)
  }),
}))

describe('Subscribers API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/subscribers', () => {
    it('should create a new subscriber successfully', async () => {
      const requestBody = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        storyId: '123e4567-e89b-12d3-a456-426614174000',
        orgId: '123e4567-e89b-12d3-a456-426614174001'
      }

      const request = new NextRequest('http://localhost:3000/api/subscribers', {
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
      expect(data.message).toBe('Subscriber created successfully')
      expect(data.subscriber).toBeDefined()
    })

    it('should handle duplicate subscriber', async () => {
      // Mock existing subscriber
      mockSupabase.from().select().eq().single.mockResolvedValueOnce({
        data: { id: 'existing-id' },
        error: null
      })

      const requestBody = {
        email: 'existing@example.com',
        firstName: 'John',
        lastName: 'Doe',
        storyId: '123e4567-e89b-12d3-a456-426614174000',
        orgId: '123e4567-e89b-12d3-a456-426614174001'
      }

      const request = new NextRequest('http://localhost:3000/api/subscribers', {
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
      expect(data.message).toBe('Subscriber already exists')
    })

    it('should validate required fields', async () => {
      const requestBody = {
        email: '',
        firstName: 'John',
        lastName: 'Doe'
      }

      const request = new NextRequest('http://localhost:3000/api/subscribers', {
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
        email: 'invalid-email',
        firstName: 'John',
        lastName: 'Doe',
        storyId: '123e4567-e89b-12d3-a456-426614174000',
        orgId: '123e4567-e89b-12d3-a456-426614174001'
      }

      const request = new NextRequest('http://localhost:3000/api/subscribers', {
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
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        storyId: '123e4567-e89b-12d3-a456-426614174000',
        orgId: '123e4567-e89b-12d3-a456-426614174001'
      }

      const request = new NextRequest('http://localhost:3000/api/subscribers', {
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

  describe('GET /api/subscribers', () => {
    it('should fetch subscribers successfully', async () => {
      const mockSubscribers = [
        { id: '1', email: 'test1@example.com', firstName: 'John' },
        { id: '2', email: 'test2@example.com', firstName: 'Jane' }
      ]

      mockSupabase.from().select().limit.mockResolvedValueOnce({
        data: mockSubscribers,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/subscribers?orgId=123&storyId=456')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.subscribers).toEqual(mockSubscribers)
    })

    it('should handle missing orgId parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/subscribers')

      const response = await GET(request)

      expect(response.status).toBe(400)
    })

    it('should handle database errors', async () => {
      mockSupabase.from().select().limit.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      })

      const request = new NextRequest('http://localhost:3000/api/subscribers?orgId=123')

      const response = await GET(request)

      expect(response.status).toBe(500)
    })
  })

  describe('DELETE /api/subscribers', () => {
    it('should unsubscribe successfully', async () => {
      mockSupabase.from().delete().eq.mockResolvedValueOnce({
        data: null,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/subscribers', {
        method: 'DELETE',
        body: JSON.stringify({
          email: 'test@example.com',
          storyId: '123e4567-e89b-12d3-a456-426614174000'
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Successfully unsubscribed')
    })

    it('should handle missing required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/subscribers', {
        method: 'DELETE',
        body: JSON.stringify({}),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await DELETE(request)

      expect(response.status).toBe(400)
    })

    it('should handle database errors', async () => {
      mockSupabase.from().delete().eq.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      })

      const request = new NextRequest('http://localhost:3000/api/subscribers', {
        method: 'DELETE',
        body: JSON.stringify({
          email: 'test@example.com',
          storyId: '123e4567-e89b-12d3-a456-426614174000'
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await DELETE(request)

      expect(response.status).toBe(500)
    })
  })
})
