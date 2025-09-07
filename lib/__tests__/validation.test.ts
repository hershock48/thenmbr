import {
  validateForm,
  validateField,
  validateAPIRequest,
  VALIDATION_SCHEMAS,
  VALIDATION_PATTERNS,
  VALIDATION_MESSAGES,
  ValidationRule,
  ValidationResult
} from '../validation'
import { ValidationError } from '../error-handler'

describe('Validation System', () => {
  describe('validateForm', () => {
    it('should validate a complete form successfully', () => {
      const data = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        storyId: '123e4567-e89b-12d3-a456-426614174000',
        orgId: '123e4567-e89b-12d3-a456-426614174001'
      }
      
      const result = validateForm(data, VALIDATION_SCHEMAS.subscription)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
      expect(result.sanitizedData).toEqual({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        storyId: '123e4567-e89b-12d3-a456-426614174000',
        orgId: '123e4567-e89b-12d3-a456-426614174001'
      })
    })

    it('should validate required fields', () => {
      const data = {
        email: '',
        firstName: 'John',
        lastName: 'Doe'
      }
      
      const result = validateForm(data, VALIDATION_SCHEMAS.subscription)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBe('Email is required')
      expect(result.errors.storyId).toBe('Story ID is required')
      expect(result.errors.orgId).toBe('Organization ID is required')
    })

    it('should validate email format', () => {
      const data = {
        email: 'invalid-email',
        firstName: 'John',
        lastName: 'Doe',
        storyId: '123e4567-e89b-12d3-a456-426614174000',
        orgId: '123e4567-e89b-12d3-a456-426614174001'
      }
      
      const result = validateForm(data, VALIDATION_SCHEMAS.subscription)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBe('Invalid email format')
    })

    it('should validate UUID format', () => {
      const data = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        storyId: 'invalid-uuid',
        orgId: '123e4567-e89b-12d3-a456-426614174001'
      }
      
      const result = validateForm(data, VALIDATION_SCHEMAS.subscription)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.storyId).toBe('Invalid ID format')
    })

    it('should validate string length', () => {
      const data = {
        email: 'test@example.com',
        firstName: '',
        lastName: 'Doe',
        storyId: '123e4567-e89b-12d3-a456-426614174000',
        orgId: '123e4567-e89b-12d3-a456-426614174001'
      }
      
      const result = validateForm(data, VALIDATION_SCHEMAS.subscription)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.firstName).toBe('Must be at least 1 characters long')
    })

    it('should validate pattern matching', () => {
      const data = {
        email: 'test@example.com',
        firstName: 'John123',
        lastName: 'Doe',
        storyId: '123e4567-e89b-12d3-a456-426614174000',
        orgId: '123e4567-e89b-12d3-a456-426614174001'
      }
      
      const result = validateForm(data, VALIDATION_SCHEMAS.subscription)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.firstName).toBe('Invalid format')
    })

    it('should validate custom validation functions', () => {
      const data = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        storyId: '123e4567-e89b-12d3-a456-426614174000',
        orgId: '123e4567-e89b-12d3-a456-426614174001'
      }
      
      const schema = {
        email: {
          required: true,
          type: 'email' as const,
          custom: (value: string) => {
            if (value.includes('test')) {
              return 'Test emails are not allowed'
            }
            return null
          }
        }
      }
      
      const result = validateForm(data, schema)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBe('Test emails are not allowed')
    })

    it('should sanitize data when sanitize is true', () => {
      const data = {
        email: '  TEST@EXAMPLE.COM  ',
        firstName: '  John  ',
        lastName: 'Doe',
        storyId: '123e4567-e89b-12d3-a456-426614174000',
        orgId: '123e4567-e89b-12d3-a456-426614174001'
      }
      
      const result = validateForm(data, VALIDATION_SCHEMAS.subscription)
      
      expect(result.isValid).toBe(true)
      expect(result.sanitizedData.email).toBe('test@example.com')
      expect(result.sanitizedData.firstName).toBe('John')
    })

    it('should skip validation for empty non-required fields', () => {
      const data = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: '',
        storyId: '123e4567-e89b-12d3-a456-426614174000',
        orgId: '123e4567-e89b-12d3-a456-426614174001'
      }
      
      const schema = {
        ...VALIDATION_SCHEMAS.subscription,
        lastName: {
          required: false,
          minLength: 1,
          maxLength: 50,
          pattern: VALIDATION_PATTERNS.name,
          sanitize: true
        }
      }
      
      const result = validateForm(data, schema)
      
      expect(result.isValid).toBe(true)
      expect(result.sanitizedData.lastName).toBe('')
    })
  })

  describe('validateField', () => {
    it('should validate a single field successfully', () => {
      const rules: ValidationRule = {
        required: true,
        type: 'email',
        maxLength: 255
      }
      
      const result = validateField('test@example.com', rules)
      
      expect(result).toBeNull()
    })

    it('should return error for invalid field', () => {
      const rules: ValidationRule = {
        required: true,
        type: 'email',
        maxLength: 255
      }
      
      const result = validateField('invalid-email', rules)
      
      expect(result).toBe('Invalid email format')
    })

    it('should return null for empty non-required field', () => {
      const rules: ValidationRule = {
        required: false,
        type: 'email'
      }
      
      const result = validateField('', rules)
      
      expect(result).toBeNull()
    })

    it('should return error for empty required field', () => {
      const rules: ValidationRule = {
        required: true,
        type: 'email'
      }
      
      const result = validateField('', rules)
      
      expect(result).toBe('This field is required')
    })

    it('should validate number type', () => {
      const rules: ValidationRule = {
        type: 'number'
      }
      
      expect(validateField('123', rules)).toBeNull()
      expect(validateField('abc', rules)).toBe('Must be a valid number')
    })

    it('should validate URL type', () => {
      const rules: ValidationRule = {
        type: 'url'
      }
      
      expect(validateField('https://example.com', rules)).toBeNull()
      expect(validateField('invalid-url', rules)).toBe('Invalid URL format')
    })

    it('should validate phone type', () => {
      const rules: ValidationRule = {
        type: 'phone'
      }
      
      expect(validateField('+1234567890', rules)).toBeNull()
      expect(validateField('invalid-phone', rules)).toBe('Invalid phone number format')
    })

    it('should validate length constraints', () => {
      const rules: ValidationRule = {
        minLength: 3,
        maxLength: 10
      }
      
      expect(validateField('hello', rules)).toBeNull()
      expect(validateField('hi', rules)).toBe('Must be at least 3 characters long')
      expect(validateField('hello world', rules)).toBe('Must be no more than 10 characters long')
    })

    it('should validate pattern matching', () => {
      const rules: ValidationRule = {
        pattern: /^[A-Z]+$/
      }
      
      expect(validateField('HELLO', rules)).toBeNull()
      expect(validateField('hello', rules)).toBe('Invalid format')
    })

    it('should validate custom validation function', () => {
      const rules: ValidationRule = {
        custom: (value: string) => {
          if (value.length < 5) {
            return 'Value must be at least 5 characters'
          }
          return null
        }
      }
      
      expect(validateField('hello', rules)).toBeNull()
      expect(validateField('hi', rules)).toBe('Value must be at least 5 characters')
    })
  })

  describe('validateAPIRequest', () => {
    it('should validate valid data and return sanitized result', () => {
      const data = {
        email: '  TEST@EXAMPLE.COM  ',
        firstName: '  John  ',
        lastName: 'Doe',
        storyId: '123e4567-e89b-12d3-a456-426614174000',
        orgId: '123e4567-e89b-12d3-a456-426614174001'
      }
      
      const result = validateAPIRequest(data, VALIDATION_SCHEMAS.subscription)
      
      expect(result.isValid).toBe(true)
      expect(result.sanitizedData.email).toBe('test@example.com')
      expect(result.sanitizedData.firstName).toBe('John')
    })

    it('should throw ValidationError for invalid data', () => {
      const data = {
        email: 'invalid-email',
        firstName: 'John',
        lastName: 'Doe',
        storyId: 'invalid-uuid',
        orgId: '123e4567-e89b-12d3-a456-426614174001'
      }
      
      expect(() => {
        validateAPIRequest(data, VALIDATION_SCHEMAS.subscription)
      }).toThrow(ValidationError)
    })
  })

  describe('VALIDATION_SCHEMAS', () => {
    it('should have correct userAuth schema', () => {
      expect(VALIDATION_SCHEMAS.userAuth.email.required).toBe(true)
      expect(VALIDATION_SCHEMAS.userAuth.email.type).toBe('email')
      expect(VALIDATION_SCHEMAS.userAuth.password.required).toBe(true)
      expect(VALIDATION_SCHEMAS.userAuth.password.minLength).toBe(8)
    })

    it('should have correct subscription schema', () => {
      expect(VALIDATION_SCHEMAS.subscription.email.required).toBe(true)
      expect(VALIDATION_SCHEMAS.subscription.email.type).toBe('email')
      expect(VALIDATION_SCHEMAS.subscription.storyId.required).toBe(true)
      expect(VALIDATION_SCHEMAS.subscription.storyId.type).toBe('uuid')
    })

    it('should have correct nmbrSearch schema', () => {
      expect(VALIDATION_SCHEMAS.nmbrSearch.code.required).toBe(true)
      expect(VALIDATION_SCHEMAS.nmbrSearch.code.minLength).toBe(3)
      expect(VALIDATION_SCHEMAS.nmbrSearch.code.maxLength).toBe(10)
    })

    it('should have correct donation schema', () => {
      expect(VALIDATION_SCHEMAS.donation.amount.required).toBe(true)
      expect(VALIDATION_SCHEMAS.donation.donorName.required).toBe(true)
      expect(VALIDATION_SCHEMAS.donation.donorEmail.required).toBe(true)
    })

    it('should have correct newsletter schema', () => {
      expect(VALIDATION_SCHEMAS.newsletter.name.required).toBe(true)
      expect(VALIDATION_SCHEMAS.newsletter.subject.required).toBe(true)
      expect(VALIDATION_SCHEMAS.newsletter.content.required).toBe(true)
    })
  })

  describe('VALIDATION_PATTERNS', () => {
    it('should have correct email pattern', () => {
      expect(VALIDATION_PATTERNS.email.test('test@example.com')).toBe(true)
      expect(VALIDATION_PATTERNS.email.test('invalid-email')).toBe(false)
    })

    it('should have correct UUID pattern', () => {
      expect(VALIDATION_PATTERNS.uuid.test('123e4567-e89b-12d3-a456-426614174000')).toBe(true)
      expect(VALIDATION_PATTERNS.uuid.test('invalid-uuid')).toBe(false)
    })

    it('should have correct phone pattern', () => {
      expect(VALIDATION_PATTERNS.phone.test('+1234567890')).toBe(true)
      expect(VALIDATION_PATTERNS.phone.test('invalid-phone')).toBe(false)
    })

    it('should have correct URL pattern', () => {
      expect(VALIDATION_PATTERNS.url.test('https://example.com')).toBe(true)
      expect(VALIDATION_PATTERNS.url.test('invalid-url')).toBe(false)
    })

    it('should have correct name pattern', () => {
      expect(VALIDATION_PATTERNS.name.test('John Doe')).toBe(true)
      expect(VALIDATION_PATTERNS.name.test('John-Doe')).toBe(true)
      expect(VALIDATION_PATTERNS.name.test('John123')).toBe(false)
    })

    it('should have correct NMBR code pattern', () => {
      expect(VALIDATION_PATTERNS.nmbrCode.test('HOPE001')).toBe(true)
      expect(VALIDATION_PATTERNS.nmbrCode.test('hope001')).toBe(false)
      expect(VALIDATION_PATTERNS.nmbrCode.test('HOPE')).toBe(true)
    })

    it('should have correct currency pattern', () => {
      expect(VALIDATION_PATTERNS.currency.test('100')).toBe(true)
      expect(VALIDATION_PATTERNS.currency.test('100.50')).toBe(true)
      expect(VALIDATION_PATTERNS.currency.test('100.555')).toBe(false)
    })

    it('should have correct percentage pattern', () => {
      expect(VALIDATION_PATTERNS.percentage.test('50')).toBe(true)
      expect(VALIDATION_PATTERNS.percentage.test('50.5')).toBe(true)
      expect(VALIDATION_PATTERNS.percentage.test('100')).toBe(true)
      expect(VALIDATION_PATTERNS.percentage.test('101')).toBe(false)
    })
  })

  describe('VALIDATION_MESSAGES', () => {
    it('should have correct validation messages', () => {
      expect(VALIDATION_MESSAGES.required).toBe('This field is required')
      expect(VALIDATION_MESSAGES.email).toBe('Please enter a valid email address')
      expect(VALIDATION_MESSAGES.minLength(5)).toBe('Must be at least 5 characters long')
      expect(VALIDATION_MESSAGES.maxLength(10)).toBe('Must be no more than 10 characters long')
      expect(VALIDATION_MESSAGES.pattern).toBe('Invalid format')
      expect(VALIDATION_MESSAGES.number).toBe('Must be a valid number')
      expect(VALIDATION_MESSAGES.url).toBe('Please enter a valid URL')
      expect(VALIDATION_MESSAGES.phone).toBe('Please enter a valid phone number')
      expect(VALIDATION_MESSAGES.uuid).toBe('Invalid ID format')
    })
  })
})
