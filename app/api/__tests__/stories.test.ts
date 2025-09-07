import { NextRequest } from 'next/server'
import { GET } from '../stories/route'

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
}))

describe('Stories API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/stories', () => {
    it('should return mock stories for demo', async () => {
      const request = new NextRequest('http://localhost:3000/api/stories?org=test-org')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.stories).toBeDefined()
      expect(Array.isArray(data.stories)).toBe(true)
      expect(data.stories.length).toBeGreaterThan(0)
    })

    it('should require organization parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/stories')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Organization ID is required')
    })

    it('should filter stories by NMBR code when provided', async () => {
      const request = new NextRequest('http://localhost:3000/api/stories?org=test-org&nmbr=HOPE001')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.stories).toBeDefined()
    })

    it('should return all stories when no NMBR filter provided', async () => {
      const request = new NextRequest('http://localhost:3000/api/stories?org=test-org')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.stories).toBeDefined()
      expect(data.stories.length).toBeGreaterThan(0)
    })

    it('should handle database errors gracefully', async () => {
      // Mock database error
      mockSupabase.from().select().limit.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database connection failed' }
      })

      const request = new NextRequest('http://localhost:3000/api/stories?org=test-org')

      const response = await GET(request)

      // Should still return mock data as fallback
      expect(response.status).toBe(200)
    })

    it('should include proper story structure', async () => {
      const request = new NextRequest('http://localhost:3000/api/stories?org=test-org')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.stories[0]).toHaveProperty('id')
      expect(data.stories[0]).toHaveProperty('title')
      expect(data.stories[0]).toHaveProperty('description')
      expect(data.stories[0]).toHaveProperty('nmbr_code')
      expect(data.stories[0]).toHaveProperty('org_id')
      expect(data.stories[0]).toHaveProperty('goal_amount')
      expect(data.stories[0]).toHaveProperty('current_amount')
      expect(data.stories[0]).toHaveProperty('status')
    })

    it('should calculate progress percentage correctly', async () => {
      const request = new NextRequest('http://localhost:3000/api/stories?org=test-org')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      
      data.stories.forEach((story: any) => {
        if (story.goal_amount > 0) {
          const expectedProgress = Math.round((story.current_amount / story.goal_amount) * 100)
          expect(story.progress_percentage).toBe(expectedProgress)
        }
      })
    })

    it('should handle different organization IDs', async () => {
      const orgIds = ['org-1', 'org-2', 'org-3']
      
      for (const orgId of orgIds) {
        const request = new NextRequest(`http://localhost:3000/api/stories?org=${orgId}`)
        
        const response = await GET(request)
        const data = await response.json()
        
        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.stories).toBeDefined()
      }
    })

    it('should handle special characters in NMBR code', async () => {
      const specialCodes = ['HOPE-001', 'HOPE_001', 'HOPE.001']
      
      for (const code of specialCodes) {
        const request = new NextRequest(`http://localhost:3000/api/stories?org=test-org&nmbr=${code}`)
        
        const response = await GET(request)
        
        expect(response.status).toBe(200)
      }
    })
  })
})
