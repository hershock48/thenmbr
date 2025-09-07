import { cn, formatCurrency, formatDate, generateId, slugify, truncateText, debounce, throttle } from '../utils'

describe('Utility Functions', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
      expect(cn('class1', undefined, 'class2')).toBe('class1 class2')
      expect(cn('class1', false, 'class2')).toBe('class1 class2')
      expect(cn('class1', null, 'class2')).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', { 'active': true, 'disabled': false })).toBe('base active')
      expect(cn('base', { 'active': false, 'disabled': true })).toBe('base disabled')
    })
  })

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(100)).toBe('$100.00')
      expect(formatCurrency(100.5)).toBe('$100.50')
      expect(formatCurrency(1000)).toBe('$1,000.00')
      expect(formatCurrency(0)).toBe('$0.00')
    })

    it('should handle different currencies', () => {
      expect(formatCurrency(100, 'EUR')).toBe('€100.00')
      expect(formatCurrency(100, 'GBP')).toBe('£100.00')
    })
  })

  describe('formatDate', () => {
    it('should format dates correctly', () => {
      const date = new Date('2023-12-25T10:30:00Z')
      expect(formatDate(date)).toBe('Dec 25, 2023')
      expect(formatDate(date, 'short')).toBe('12/25/23')
      expect(formatDate(date, 'long')).toBe('December 25, 2023')
    })
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      
      expect(id1).toBeDefined()
      expect(id2).toBeDefined()
      expect(id1).not.toBe(id2)
      expect(id1.length).toBeGreaterThan(0)
    })
  })

  describe('slugify', () => {
    it('should create URL-friendly slugs', () => {
      expect(slugify('Hello World')).toBe('hello-world')
      expect(slugify('Test & Test')).toBe('test-test')
      expect(slugify('Special@Characters!')).toBe('specialcharacters')
    })
  })

  describe('truncateText', () => {
    it('should truncate text correctly', () => {
      expect(truncateText('Hello world', 5)).toBe('Hello...')
      expect(truncateText('Hello', 10)).toBe('Hello')
      expect(truncateText('Hello world', 5, '---')).toBe('Hello---')
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should debounce function calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)

      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('throttle', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should throttle function calls', () => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn()
      throttledFn()
      throttledFn()

      expect(mockFn).toHaveBeenCalledTimes(1)

      jest.advanceTimersByTime(100)

      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(2)
    })
  })
})
