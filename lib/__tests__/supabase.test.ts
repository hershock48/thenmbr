import { supabase, supabaseAdmin } from '../supabase'

// Mock the Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
          limit: jest.fn(() => Promise.resolve({ data: [], error: null })),
        })),
        limit: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      update: jest.fn(() => Promise.resolve({ data: null, error: null })),
      delete: jest.fn(() => Promise.resolve({ data: null, error: null })),
    })),
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      signInWithPassword: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      signUp: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      signOut: jest.fn(() => Promise.resolve({ error: null })),
    },
  })),
}))

describe('Supabase Client', () => {
  describe('supabase', () => {
    it('should be defined', () => {
      expect(supabase).toBeDefined()
    })

    it('should have auth methods', () => {
      expect(supabase.auth).toBeDefined()
      expect(supabase.auth.getUser).toBeDefined()
      expect(supabase.auth.signInWithPassword).toBeDefined()
      expect(supabase.auth.signUp).toBeDefined()
      expect(supabase.auth.signOut).toBeDefined()
    })

    it('should have from method for database queries', () => {
      expect(supabase.from).toBeDefined()
      expect(typeof supabase.from).toBe('function')
    })
  })

  describe('supabaseAdmin', () => {
    it('should be defined', () => {
      expect(supabaseAdmin).toBeDefined()
    })

    it('should have from method for admin database queries', () => {
      expect(supabaseAdmin.from).toBeDefined()
      expect(typeof supabaseAdmin.from).toBe('function')
    })
  })

  describe('Environment Variables', () => {
    it('should use correct environment variables', () => {
      expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined()
      expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined()
    })
  })
})
