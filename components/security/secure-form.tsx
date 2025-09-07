'use client'

import { FormEvent, ReactNode } from 'react'
import CSRFToken from './csrf-token'

interface SecureFormProps {
  children: ReactNode
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  action?: string
  className?: string
  csrfTokenName?: string
}

export function SecureForm({ 
  children, 
  onSubmit, 
  method = 'POST', 
  action,
  className,
  csrfTokenName = 'csrf_token'
}: SecureFormProps) {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Get CSRF token from form
    const formData = new FormData(e.currentTarget)
    const csrfToken = formData.get(csrfTokenName) as string
    
    if (!csrfToken) {
      console.error('CSRF token not found in form')
      return
    }
    
    // Add CSRF token to headers for API calls
    if (method !== 'GET') {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      }
      
      // Add session ID if available
      const sessionId = localStorage.getItem('session_id')
      if (sessionId) {
        headers['X-Session-ID'] = sessionId
      }
      
      // Update form data with headers
      Object.defineProperty(e.currentTarget, 'headers', {
        value: headers,
        writable: false
      })
    }
    
    // Call the original onSubmit handler
    onSubmit(e)
  }

  return (
    <form
      method={method}
      action={action}
      onSubmit={handleSubmit}
      className={className}
    >
      <CSRFToken name={csrfTokenName} />
      {children}
    </form>
  )
}

export default SecureForm
