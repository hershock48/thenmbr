'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { validateField, ValidationRule, VALIDATION_MESSAGES } from '@/lib/validation'

interface ValidatedInputProps {
  name: string
  label?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select'
  value: any
  onChange: (value: any) => void
  onBlur?: () => void
  rules: ValidationRule
  placeholder?: string
  disabled?: boolean
  className?: string
  options?: { value: string; label: string }[] // For select inputs
  showValidation?: boolean
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  rules,
  placeholder,
  disabled = false,
  className,
  options = [],
  showValidation = true,
  validateOnChange = false,
  validateOnBlur = true
}) => {
  const [error, setError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean>(false)
  const [hasBlurred, setHasBlurred] = useState<boolean>(false)

  const validate = (val: any) => {
    const errorMessage = validateField(val, rules)
    setError(errorMessage)
    setIsValid(!errorMessage && val !== '' && val != null)
    return !errorMessage
  }

  const handleChange = (newValue: any) => {
    onChange(newValue)
    
    if (validateOnChange || hasBlurred) {
      validate(newValue)
    }
  }

  const handleBlur = () => {
    setHasBlurred(true)
    
    if (validateOnBlur) {
      validate(value)
    }
    
    if (onBlur) {
      onBlur()
    }
  }

  // Validate on mount if there's a value
  useEffect(() => {
    if (value && (validateOnChange || hasBlurred)) {
      validate(value)
    }
  }, [value, validateOnChange, hasBlurred])

  const shouldShowError = showValidation && hasBlurred && error
  const shouldShowSuccess = showValidation && hasBlurred && isValid && !error

  const inputClasses = cn(
    className,
    shouldShowError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
    shouldShowSuccess && 'border-green-500 focus:border-green-500 focus:ring-green-500'
  )

  const renderInput = () => {
    const commonProps = {
      id: name,
      name,
      value: value || '',
      onChange: (e: any) => handleChange(e.target.value),
      onBlur: handleBlur,
      placeholder,
      disabled,
      className: inputClasses
    }

    switch (type) {
      case 'textarea':
        return <Textarea {...commonProps} />
      
      case 'select':
        return (
          <Select value={value || ''} onValueChange={handleChange} disabled={disabled}>
            <SelectTrigger className={inputClasses}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      
      default:
        return <Input {...commonProps} type={type} />
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
          {rules.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div className="relative">
        {renderInput()}
        
        {shouldShowError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
        )}
        
        {shouldShowSuccess && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        )}
      </div>
      
      {shouldShowError && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      
      {shouldShowSuccess && (
        <p className="text-sm text-green-500 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Looks good!
        </p>
      )}
    </div>
  )
}

// Form validation hook
export const useFormValidation = (schema: Record<string, ValidationRule>) => {
  const [values, setValues] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isValidating, setIsValidating] = useState(false)

  const setValue = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const setTouchedField = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }))
  }

  const validateFieldValue = (name: string, value: any): boolean => {
    const rules = schema[name]
    if (!rules) return true

    const error = validateField(value, rules)
    setErrors(prev => ({ ...prev, [name]: error || '' }))
    return !error
  }

  const validateForm = async () => {
    setIsValidating(true)
    const newErrors: Record<string, string> = {}
    let isValid = true

    for (const [name, rules] of Object.entries(schema)) {
      const value = values[name]
      const error = validateField(value, rules)
      if (error) {
        newErrors[name] = error
        isValid = false
      }
    }

    setErrors(newErrors)
    setIsValidating(false)
    return isValid
  }

  const getFieldError = (name: string): string | undefined => {
    return errors[name] || undefined
  }

  const hasFieldError = (name: string): boolean => {
    return !!errors[name]
  }

  const isFieldTouched = (name: string): boolean => {
    return !!touched[name]
  }

  const hasErrors = (): boolean => {
    return Object.values(errors).some(error => !!error)
  }

  const reset = () => {
    setValues({})
    setErrors({})
    setTouched({})
  }

  return {
    values,
    errors,
    touched,
    isValidating,
    setValue,
    setTouchedField,
    validateField,
    validateForm,
    getFieldError,
    hasFieldError,
    isFieldTouched,
    hasErrors,
    reset
  }
}

export default ValidatedInput
