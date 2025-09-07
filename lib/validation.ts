/**
 * Comprehensive Input Validation and Sanitization System
 * Provides client-side and server-side validation for all forms
 */

import React, { useState } from 'react'
import { ValidationError, validateEmail, validateUUID, validateRequired, validateMinLength, validateMaxLength, validateRange, sanitizeString, sanitizeEmail, sanitizeHTML } from './error-handler'

// Validation result interface
export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
  sanitizedData: Record<string, any>
}

// Validation rules interface
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
  sanitize?: boolean
  type?: 'email' | 'uuid' | 'number' | 'url' | 'phone'
}

// Validation schema interface
export interface ValidationSchema {
  [fieldName: string]: ValidationRule
}

// Common validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  name: /^[a-zA-Z\s\-'\.]+$/,
  nmbrCode: /^[A-Z0-9]{3,10}$/,
  currency: /^\d+(\.\d{1,2})?$/,
  percentage: /^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/
}

// Common validation schemas
export const VALIDATION_SCHEMAS = {
  // User registration/login
  userAuth: {
    email: {
      required: true,
      type: 'email' as const,
      maxLength: 255,
      sanitize: true
    },
    password: {
      required: true,
      minLength: 8,
      maxLength: 128,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      custom: (value: string) => {
        if (value.length < 8) return 'Password must be at least 8 characters'
        if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter'
        if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter'
        if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number'
        if (!/(?=.*[@$!%*?&])/.test(value)) return 'Password must contain at least one special character'
        return null
      }
    },
    firstName: {
      required: true,
      minLength: 1,
      maxLength: 50,
      pattern: VALIDATION_PATTERNS.name,
      sanitize: true
    },
    lastName: {
      required: true,
      minLength: 1,
      maxLength: 50,
      pattern: VALIDATION_PATTERNS.name,
      sanitize: true
    }
  },

  // NMBR subscription
  subscription: {
    email: {
      required: true,
      type: 'email' as const,
      maxLength: 255,
      sanitize: true
    },
    firstName: {
      required: true,
      minLength: 1,
      maxLength: 50,
      pattern: VALIDATION_PATTERNS.name,
      sanitize: true
    },
    lastName: {
      required: true,
      minLength: 1,
      maxLength: 50,
      pattern: VALIDATION_PATTERNS.name,
      sanitize: true
    },
    storyId: {
      required: true,
      type: 'uuid' as const
    },
    orgId: {
      required: true,
      type: 'uuid' as const
    }
  },

  // NMBR search
  nmbrSearch: {
    code: {
      required: true,
      minLength: 3,
      maxLength: 10,
      pattern: VALIDATION_PATTERNS.nmbrCode,
      sanitize: true
    }
  },

  // Donation form
  donation: {
    amount: {
      required: true,
      custom: (value: any) => {
        const num = parseFloat(value)
        if (isNaN(num)) return 'Amount must be a valid number'
        if (num < 1) return 'Minimum donation amount is $1'
        if (num > 10000) return 'Maximum donation amount is $10,000'
        return null
      }
    },
    donorName: {
      required: true,
      minLength: 1,
      maxLength: 100,
      pattern: VALIDATION_PATTERNS.name,
      sanitize: true
    },
    donorEmail: {
      required: true,
      type: 'email',
      maxLength: 255,
      sanitize: true
    },
    paymentMethodId: {
      required: true,
      minLength: 1,
      maxLength: 100
    }
  },

  // Newsletter creation
  newsletter: {
    name: {
      required: true,
      minLength: 1,
      maxLength: 100,
      sanitize: true
    },
    subject: {
      required: true,
      minLength: 1,
      maxLength: 200,
      sanitize: true
    },
    content: {
      required: true,
      minLength: 10,
      maxLength: 50000,
      sanitize: true
    },
    storyId: {
      required: true,
      type: 'uuid' as const
    },
    organizationId: {
      required: true,
      type: 'uuid' as const
    }
  },

  // Email sending
  emailSend: {
    type: {
      required: true,
      custom: (value: string) => {
        const validTypes = ['welcome', 'story_update', 'milestone', 'completion', 'newsletter']
        if (!validTypes.includes(value)) {
          return `Type must be one of: ${validTypes.join(', ')}`
        }
        return null
      }
    },
    storyId: {
      required: true,
      type: 'uuid' as const
    },
    organizationId: {
      required: true,
      type: 'uuid' as const
    }
  },

  // Organization selection
  orgSelection: {
    organizationId: {
      required: true,
      type: 'uuid' as const
    }
  }
}

// Main validation function
export const validateForm = (data: Record<string, any>, schema: ValidationSchema): ValidationResult => {
  const errors: Record<string, string> = {}
  const sanitizedData: Record<string, any> = {}

  for (const [fieldName, rules] of Object.entries(schema)) {
    const value = data[fieldName]
    let sanitizedValue = value

    // Required validation
    if (rules.required && (value === null || value === undefined || value === '')) {
      errors[fieldName] = `${fieldName} is required`
      continue
    }

    // Skip validation if value is empty and not required
    if (!rules.required && (value === null || value === undefined || value === '')) {
      sanitizedData[fieldName] = sanitizedValue
      continue
    }

    // Sanitization
    if (rules.sanitize && typeof value === 'string') {
      sanitizedValue = sanitizeString(value)
    }

    // Type validation
    if (rules.type) {
      switch (rules.type) {
        case 'email':
          if (!validateEmail(sanitizedValue)) {
            errors[fieldName] = 'Invalid email format'
            continue
          }
          if (rules.sanitize) {
            sanitizedValue = sanitizeEmail(sanitizedValue)
          }
          break
        case 'uuid':
          if (!validateUUID(sanitizedValue)) {
            errors[fieldName] = 'Invalid ID format'
            continue
          }
          break
        case 'number':
          const num = parseFloat(sanitizedValue)
          if (isNaN(num)) {
            errors[fieldName] = 'Must be a valid number'
            continue
          }
          sanitizedValue = num
          break
        case 'url':
          if (!VALIDATION_PATTERNS.url.test(sanitizedValue)) {
            errors[fieldName] = 'Invalid URL format'
            continue
          }
          break
        case 'phone':
          if (!VALIDATION_PATTERNS.phone.test(sanitizedValue)) {
            errors[fieldName] = 'Invalid phone number format'
            continue
          }
          break
      }
    }

    // Length validation
    if (typeof sanitizedValue === 'string') {
      if (rules.minLength && sanitizedValue.length < rules.minLength) {
        errors[fieldName] = `Must be at least ${rules.minLength} characters long`
        continue
      }
      if (rules.maxLength && sanitizedValue.length > rules.maxLength) {
        errors[fieldName] = `Must be no more than ${rules.maxLength} characters long`
        continue
      }
    }

    // Pattern validation
    if (rules.pattern && typeof sanitizedValue === 'string' && !rules.pattern.test(sanitizedValue)) {
      errors[fieldName] = 'Invalid format'
      continue
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(sanitizedValue)
      if (customError) {
        errors[fieldName] = customError
        continue
      }
    }

    sanitizedData[fieldName] = sanitizedValue
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData
  }
}

// Client-side validation hook
export const useFormValidation = (schema: ValidationSchema) => {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isValidating, setIsValidating] = useState(false)

  const validate = async (data: Record<string, any>): Promise<ValidationResult> => {
    setIsValidating(true)
    
    try {
      const result = validateForm(data, schema)
      setErrors(result.errors)
      return result
    } finally {
      setIsValidating(false)
    }
  }

  const clearErrors = () => {
    setErrors({})
  }

  const getFieldError = (fieldName: string): string | undefined => {
    return errors[fieldName]
  }

  const hasErrors = (): boolean => {
    return Object.keys(errors).length > 0
  }

  return {
    errors,
    isValidating,
    validate,
    clearErrors,
    getFieldError,
    hasErrors
  }
}

// Server-side validation for API routes
export const validateAPIRequest = (data: Record<string, any>, schema: ValidationSchema): ValidationResult => {
  const result = validateForm(data, schema)
  
  if (!result.isValid) {
    throw new ValidationError('Validation failed', {
      metadata: { errors: result.errors }
    })
  }

  return result
}

// Real-time validation for form fields
export const validateField = (value: any, rules: ValidationRule): string | null => {
  // Required validation
  if (rules.required && (value === null || value === undefined || value === '')) {
    return 'This field is required'
  }

  // Skip validation if value is empty and not required
  if (!rules.required && (value === null || value === undefined || value === '')) {
    return null
  }

  // Type validation
  if (rules.type) {
    switch (rules.type) {
      case 'email':
        if (!validateEmail(value)) {
          return 'Invalid email format'
        }
        break
      case 'uuid':
        if (!validateUUID(value)) {
          return 'Invalid ID format'
        }
        break
      case 'number':
        if (isNaN(parseFloat(value))) {
          return 'Must be a valid number'
        }
        break
      case 'url':
        if (!VALIDATION_PATTERNS.url.test(value)) {
          return 'Invalid URL format'
        }
        break
      case 'phone':
        if (!VALIDATION_PATTERNS.phone.test(value)) {
          return 'Invalid phone number format'
        }
        break
    }
  }

  // Length validation
  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters long`
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      return `Must be no more than ${rules.maxLength} characters long`
    }
  }

  // Pattern validation
  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    return 'Invalid format'
  }

  // Custom validation
  if (rules.custom) {
    return rules.custom(value)
  }

  return null
}

// Form field validation component props
export interface ValidationFieldProps {
  name: string
  value: any
  onChange: (value: any) => void
  onBlur?: () => void
  rules: ValidationRule
  showError?: boolean
  errorMessage?: string
}

// Common validation messages
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  minLength: (min: number) => `Must be at least ${min} characters long`,
  maxLength: (max: number) => `Must be no more than ${max} characters long`,
  pattern: 'Invalid format',
  number: 'Must be a valid number',
  url: 'Please enter a valid URL',
  phone: 'Please enter a valid phone number',
  uuid: 'Invalid ID format'
}

export default {
  validateForm,
  validateField,
  validateAPIRequest,
  useFormValidation,
  VALIDATION_SCHEMAS,
  VALIDATION_PATTERNS,
  VALIDATION_MESSAGES
}
