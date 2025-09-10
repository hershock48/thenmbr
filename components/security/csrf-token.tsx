'use client'

import { useEffect, useState } from 'react'

interface CSRFTokenProps {
  name?: string
  className?: string
}

export function CSRFToken({ name = 'csrf_token', className }: CSRFTokenProps) {
  const [token, setToken] = useState<string>('')

  useEffect(() => {
    // Fetch CSRF token from server
    const fetchCSRFToken = async () => {
      try {
        const response = await fetch('/api/csrf-token', {
          method: 'GET',
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          setToken(data.token)
        }
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error)
      }
    }

    fetchCSRFToken()
  }, [])

  if (!token) {
    return null
  }

  return (
    <input
      type="hidden"
      name={name}
      value={token}
      className={className}
      aria-label="CSRF token"
    />
  )
}

export default CSRFToken
