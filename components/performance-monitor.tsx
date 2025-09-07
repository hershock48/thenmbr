'use client'

import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  fcp: number | null
  lcp: number | null
  fid: number | null
  cls: number | null
  ttfb: number | null
  navigationStart: number
  loadEventEnd: number
  domContentLoaded: number
  firstPaint: number | null
  firstContentfulPaint: number | null
}

export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    navigationStart: 0,
    loadEventEnd: 0,
    domContentLoaded: 0,
    firstPaint: null,
    firstContentfulPaint: null
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Get basic performance metrics
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const paintEntries = performance.getEntriesByType('paint')
    
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint')
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint')

    setMetrics(prev => ({
      ...prev,
      navigationStart: navigation?.startTime || 0,
      loadEventEnd: navigation?.loadEventEnd || 0,
      domContentLoaded: navigation?.domContentLoadedEventEnd || 0,
      firstPaint: firstPaint?.startTime || null,
      firstContentfulPaint: firstContentfulPaint?.startTime || null
    }))

    // Observe Core Web Vitals
    if ('PerformanceObserver' in window) {
      // First Contentful Paint (FCP)
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const fcp = entries[entries.length - 1]
        setMetrics(prev => ({ ...prev, fcp: fcp.startTime }))
      })
      fcpObserver.observe({ entryTypes: ['paint'] })

      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lcp = entries[entries.length - 1]
        setMetrics(prev => ({ ...prev, lcp: lcp.startTime }))
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const fid = entries[0]
        setMetrics(prev => ({ ...prev, fid: fid.processingStart - fid.startTime }))
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift (CLS)
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
            setMetrics(prev => ({ ...prev, cls: clsValue }))
          }
        }
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })

      // Time to First Byte (TTFB)
      if (navigation) {
        setMetrics(prev => ({ 
          ...prev, 
          ttfb: navigation.responseStart - navigation.requestStart 
        }))
      }

      // Cleanup observers
      return () => {
        fcpObserver.disconnect()
        lcpObserver.disconnect()
        fidObserver.disconnect()
        clsObserver.disconnect()
      }
    }
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const getScore = (value: number | null, thresholds: { good: number; poor: number }) => {
    if (value === null) return 'N/A'
    if (value <= thresholds.good) return 'Good'
    if (value <= thresholds.poor) return 'Needs Improvement'
    return 'Poor'
  }

  const getScoreColor = (score: string) => {
    switch (score) {
      case 'Good': return 'text-green-600'
      case 'Needs Improvement': return 'text-yellow-600'
      case 'Poor': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">Performance Metrics</h3>
      
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>FCP:</span>
          <span className={getScoreColor(getScore(metrics.fcp, { good: 1800, poor: 3000 }))}>
            {metrics.fcp ? `${Math.round(metrics.fcp)}ms` : 'N/A'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>LCP:</span>
          <span className={getScoreColor(getScore(metrics.lcp, { good: 2500, poor: 4000 }))}>
            {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'N/A'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>FID:</span>
          <span className={getScoreColor(getScore(metrics.fid, { good: 100, poor: 300 }))}>
            {metrics.fid ? `${Math.round(metrics.fid)}ms` : 'N/A'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>CLS:</span>
          <span className={getScoreColor(getScore(metrics.cls, { good: 0.1, poor: 0.25 }))}>
            {metrics.cls ? metrics.cls.toFixed(3) : 'N/A'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>TTFB:</span>
          <span className={getScoreColor(getScore(metrics.ttfb, { good: 800, poor: 1800 }))}>
            {metrics.ttfb ? `${Math.round(metrics.ttfb)}ms` : 'N/A'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Load Time:</span>
          <span>
            {metrics.loadEventEnd ? `${Math.round(metrics.loadEventEnd)}ms` : 'N/A'}
          </span>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <div>First Paint: {metrics.firstPaint ? `${Math.round(metrics.firstPaint)}ms` : 'N/A'}</div>
          <div>FCP: {metrics.firstContentfulPaint ? `${Math.round(metrics.firstContentfulPaint)}ms` : 'N/A'}</div>
        </div>
      </div>
    </div>
  )
}

export default PerformanceMonitor
