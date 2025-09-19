import { render, screen } from '@testing-library/react'
import PerformanceMonitor from '../performance-monitor'

// Mock performance API
const mockPerformance = {
  now: jest.fn(() => Date.now()),
  getEntriesByType: jest.fn(() => []),
  mark: jest.fn(),
  measure: jest.fn(),
}

Object.defineProperty(window, 'performance', {
  writable: true,
  value: mockPerformance,
})

// Mock PerformanceObserver
const mockObserver = {
  observe: jest.fn(),
  disconnect: jest.fn(),
}

global.PerformanceObserver = jest.fn().mockImplementation(() => mockObserver)

describe('PerformanceMonitor', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.NODE_ENV = 'development'
  })

  afterEach(() => {
    process.env.NODE_ENV = 'test'
  })

  it('should not render in production', () => {
    process.env.NODE_ENV = 'production'
    const { container } = render(<PerformanceMonitor />)
    expect(container.firstChild).toBeNull()
  })

  it('should render in development', () => {
    const { container } = render(<PerformanceMonitor />)
    expect(container.firstChild).not.toBeNull()
  })

  it('should display performance metrics title', () => {
    render(<PerformanceMonitor />)
    expect(screen.getByText('Performance Metrics')).toBeInTheDocument()
  })

  it('should display metric labels', () => {
    render(<PerformanceMonitor />)
    
    expect(screen.getByText('FCP:')).toBeInTheDocument()
    expect(screen.getByText('LCP:')).toBeInTheDocument()
    expect(screen.getByText('FID:')).toBeInTheDocument()
    expect(screen.getByText('CLS:')).toBeInTheDocument()
    expect(screen.getByText('TTFB:')).toBeInTheDocument()
    expect(screen.getByText('Load Time:')).toBeInTheDocument()
  })

  it('should display N/A for metrics initially', () => {
    render(<PerformanceMonitor />)
    
    const naElements = screen.getAllByText('N/A')
    expect(naElements.length).toBeGreaterThan(0)
  })

  it('should set up performance observers', () => {
    render(<PerformanceMonitor />)
    
    expect(PerformanceObserver).toHaveBeenCalledTimes(4) // FCP, LCP, FID, CLS observers
  })

  it('should clean up observers on unmount', () => {
    const { unmount } = render(<PerformanceMonitor />)
    unmount()
    
    expect(mockObserver.disconnect).toHaveBeenCalledTimes(4)
  })
})
