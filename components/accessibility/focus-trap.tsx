'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { accessibilityService } from '@/lib/accessibility-service'

interface FocusTrapProps {
  children: ReactNode
  active: boolean
  onEscape?: () => void
  className?: string
}

export function FocusTrap({ children, active, onEscape, className = '' }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = accessibilityService.getFocusableElements().filter(el => 
      container.contains(el)
    )

    if (focusableElements.length === 0) return

    // Focus the first focusable element
    focusableElements[0].focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onEscape) {
        onEscape()
        return
      }

      if (event.key === 'Tab') {
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            event.preventDefault()
            lastElement.focus()
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [active, onEscape])

  if (!active) return null

  return (
    <div
      ref={containerRef}
      className={className}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      {children}
    </div>
  )
}

export default FocusTrap
