'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface SkipLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function SkipLink({ href, children, className = '' }: SkipLinkProps) {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && !event.shiftKey) {
        setIsVisible(true)
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && !event.shiftKey) {
        // Hide after a short delay to allow focus to be visible
        setTimeout(() => setIsVisible(false), 100)
      }
    }

    const handleClick = () => {
      setIsVisible(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      document.removeEventListener('click', handleClick)
    }
  }, [])

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault()
    
    // Navigate to the target element
    if (href.startsWith('#')) {
      const targetId = href.slice(1)
      const targetElement = document.getElementById(targetId)
      
      if (targetElement) {
        targetElement.focus()
        targetElement.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      router.push(href)
    }
    
    setIsVisible(false)
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`
        skip-link
        fixed top-0 left-0 z-50
        bg-blue-600 text-white
        px-4 py-2
        text-sm font-medium
        rounded-br-md
        transform -translate-y-full
        transition-transform duration-200
        focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isVisible ? 'translate-y-0' : ''}
        ${className}
      `}
      style={{
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: '1px',
        overflow: 'hidden',
        position: 'absolute',
        whiteSpace: 'nowrap',
        width: '1px'
      }}
    >
      {children}
    </a>
  )
}

export default SkipLink
