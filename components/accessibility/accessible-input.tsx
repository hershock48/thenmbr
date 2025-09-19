'use client'

import { forwardRef, InputHTMLAttributes, ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'

interface AccessibleInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
  required?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  className?: string
  containerClassName?: string
}

export const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  ({
    label,
    error,
    helperText,
    required = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    className,
    containerClassName,
    id,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${inputId}-error` : undefined
    const helperId = helperText ? `${inputId}-helper` : undefined
    const describedBy = [errorId, helperId].filter(Boolean).join(' ')

    const baseClasses = [
      'block w-full px-3 py-2',
      'border border-gray-300 rounded-md',
      'text-sm placeholder-gray-500',
      'transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
      'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
      'aria-invalid:border-red-500 aria-invalid:ring-red-500'
    ]

    const iconClasses = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''
    const widthClasses = fullWidth ? 'w-full' : ''

    const inputClasses = cn(
      baseClasses,
      iconClasses,
      widthClasses,
      error && 'border-red-500 ring-red-500',
      className
    )

    const containerClasses = cn(
      'relative',
      fullWidth && 'w-full',
      containerClassName
    )

    return (
      <div className={containerClasses}>
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
        
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400" aria-hidden="true">
                {icon}
              </span>
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            type="text"
            className={inputClasses}
            aria-invalid={!!error}
            aria-describedby={describedBy || undefined}
            aria-required={required}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          
          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400" aria-hidden="true">
                {icon}
              </span>
            </div>
          )}
        </div>
        
        {error && (
          <p
            id={errorId}
            className="mt-1 text-sm text-red-600"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p
            id={helperId}
            className="mt-1 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

AccessibleInput.displayName = 'AccessibleInput'

export default AccessibleInput
