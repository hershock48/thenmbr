import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  ExternalServiceError,
  DatabaseError,
  PaymentError,
  EmailError,
  Logger,
  handleError,
  createErrorResponse,
  handleDatabaseError,
  handlePaymentError,
  handleEmailError,
  validateEmail,
  validateUUID,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateRange,
  sanitizeString,
  sanitizeEmail,
  sanitizeHTML,
  ErrorType,
  LogLevel
} from '../error-handler'

describe('Error Handler', () => {
  describe('AppError', () => {
    it('should create an AppError with default values', () => {
      const error = new AppError('Test error')
      
      expect(error.message).toBe('Test error')
      expect(error.type).toBe(ErrorType.INTERNAL)
      expect(error.statusCode).toBe(500)
      expect(error.isOperational).toBe(true)
      expect(error.timestamp).toBeDefined()
      expect(error.name).toBe('AppError')
    })

    it('should create an AppError with custom values', () => {
      const context = { userId: '123', action: 'test' }
      const error = new AppError('Custom error', ErrorType.VALIDATION, 400, context, false)
      
      expect(error.message).toBe('Custom error')
      expect(error.type).toBe(ErrorType.VALIDATION)
      expect(error.statusCode).toBe(400)
      expect(error.context).toEqual(context)
      expect(error.isOperational).toBe(false)
    })
  })

  describe('Specific Error Types', () => {
    it('should create ValidationError', () => {
      const error = new ValidationError('Invalid input')
      
      expect(error.message).toBe('Invalid input')
      expect(error.type).toBe(ErrorType.VALIDATION)
      expect(error.statusCode).toBe(400)
      expect(error.name).toBe('ValidationError')
    })

    it('should create AuthenticationError', () => {
      const error = new AuthenticationError('Not authenticated')
      
      expect(error.message).toBe('Not authenticated')
      expect(error.type).toBe(ErrorType.AUTHENTICATION)
      expect(error.statusCode).toBe(401)
      expect(error.name).toBe('AuthenticationError')
    })

    it('should create AuthorizationError', () => {
      const error = new AuthorizationError('Access denied')
      
      expect(error.message).toBe('Access denied')
      expect(error.type).toBe(ErrorType.AUTHORIZATION)
      expect(error.statusCode).toBe(403)
      expect(error.name).toBe('AuthorizationError')
    })

    it('should create NotFoundError', () => {
      const error = new NotFoundError('Resource not found')
      
      expect(error.message).toBe('Resource not found')
      expect(error.type).toBe(ErrorType.NOT_FOUND)
      expect(error.statusCode).toBe(404)
      expect(error.name).toBe('NotFoundError')
    })

    it('should create ConflictError', () => {
      const error = new ConflictError('Resource conflict')
      
      expect(error.message).toBe('Resource conflict')
      expect(error.type).toBe(ErrorType.CONFLICT)
      expect(error.statusCode).toBe(409)
      expect(error.name).toBe('ConflictError')
    })

    it('should create RateLimitError', () => {
      const error = new RateLimitError('Rate limit exceeded')
      
      expect(error.message).toBe('Rate limit exceeded')
      expect(error.type).toBe(ErrorType.RATE_LIMIT)
      expect(error.statusCode).toBe(429)
      expect(error.name).toBe('RateLimitError')
    })

    it('should create ExternalServiceError', () => {
      const error = new ExternalServiceError('Stripe', 'Service unavailable')
      
      expect(error.message).toBe('External service error (Stripe): Service unavailable')
      expect(error.type).toBe(ErrorType.EXTERNAL_SERVICE)
      expect(error.statusCode).toBe(502)
      expect(error.name).toBe('ExternalServiceError')
    })

    it('should create DatabaseError', () => {
      const error = new DatabaseError('Connection failed')
      
      expect(error.message).toBe('Database error: Connection failed')
      expect(error.type).toBe(ErrorType.DATABASE)
      expect(error.statusCode).toBe(500)
      expect(error.name).toBe('DatabaseError')
    })

    it('should create PaymentError', () => {
      const error = new PaymentError('Payment failed')
      
      expect(error.message).toBe('Payment error: Payment failed')
      expect(error.type).toBe(ErrorType.PAYMENT)
      expect(error.statusCode).toBe(402)
      expect(error.name).toBe('PaymentError')
    })

    it('should create EmailError', () => {
      const error = new EmailError('Email failed')
      
      expect(error.message).toBe('Email error: Email failed')
      expect(error.type).toBe(ErrorType.EMAIL)
      expect(error.statusCode).toBe(500)
      expect(error.name).toBe('EmailError')
    })
  })

  describe('Logger', () => {
    let logger: Logger
    let consoleSpy: jest.SpyInstance

    beforeEach(() => {
      logger = new Logger('test-service')
      consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    })

    afterEach(() => {
      consoleSpy.mockRestore()
    })

    it('should log info messages', () => {
      logger.info('Test info message')
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Test info message')
      )
    })

    it('should log error messages', () => {
      const error = new Error('Test error')
      logger.error('Test error message', error)
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Test error message')
      )
    })

    it('should log with context', () => {
      const context = { userId: '123', action: 'test' }
      logger.info('Test message', context)
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('"userId":"123"')
      )
    })
  })

  describe('handleError', () => {
    it('should handle AppError', () => {
      const appError = new AppError('Test error')
      const result = handleError(appError)
      
      expect(result).toBe(appError)
    })

    it('should handle regular Error', () => {
      const error = new Error('Test error')
      const result = handleError(error)
      
      expect(result).toBeInstanceOf(AppError)
      expect(result.message).toBe('Test error')
      expect(result.isOperational).toBe(false)
    })

    it('should handle unknown error', () => {
      const result = handleError('unknown error')
      
      expect(result).toBeInstanceOf(AppError)
      expect(result.message).toBe('An unknown error occurred')
      expect(result.isOperational).toBe(false)
    })
  })

  describe('createErrorResponse', () => {
    it('should create error response', () => {
      const error = new AppError('Test error', ErrorType.VALIDATION, 400)
      const response = createErrorResponse(error)
      
      expect(response.status).toBe(400)
      expect(response.body.error.message).toBe('Test error')
      expect(response.body.error.type).toBe(ErrorType.VALIDATION)
    })

    it('should hide internal errors in production', () => {
      process.env.NODE_ENV = 'production'
      const error = new AppError('Internal error', ErrorType.INTERNAL, 500, undefined, false)
      const response = createErrorResponse(error)
      
      expect(response.body.error.message).toBe('An internal error occurred')
      expect(response.body.error.context).toBeUndefined()
      
      process.env.NODE_ENV = 'test'
    })
  })

  describe('Database Error Handler', () => {
    it('should handle unique constraint violation', () => {
      const error = { code: '23505', message: 'Duplicate key' }
      const result = handleDatabaseError(error)
      
      expect(result).toBeInstanceOf(ConflictError)
      expect(result.message).toBe('Resource already exists')
    })

    it('should handle foreign key constraint violation', () => {
      const error = { code: '23503', message: 'Foreign key violation' }
      const result = handleDatabaseError(error)
      
      expect(result).toBeInstanceOf(ValidationError)
      expect(result.message).toBe('Invalid reference to related resource')
    })

    it('should handle not null constraint violation', () => {
      const error = { code: '23502', message: 'Not null violation' }
      const result = handleDatabaseError(error)
      
      expect(result).toBeInstanceOf(ValidationError)
      expect(result.message).toBe('Required field is missing')
    })

    it('should handle undefined table error', () => {
      const error = { code: '42P01', message: 'Table does not exist' }
      const result = handleDatabaseError(error)
      
      expect(result).toBeInstanceOf(DatabaseError)
      expect(result.message).toBe('Database error: Table does not exist')
    })

    it('should handle insufficient privilege error', () => {
      const error = { code: '42501', message: 'Insufficient privilege' }
      const result = handleDatabaseError(error)
      
      expect(result).toBeInstanceOf(AuthorizationError)
      expect(result.message).toBe('Insufficient database privileges')
    })

    it('should handle unknown database error', () => {
      const error = { code: '99999', message: 'Unknown error' }
      const result = handleDatabaseError(error)
      
      expect(result).toBeInstanceOf(DatabaseError)
      expect(result.message).toBe('Database error: Unknown error')
    })
  })

  describe('Payment Error Handler', () => {
    it('should handle Stripe card error', () => {
      const error = { type: 'StripeCardError', message: 'Card declined' }
      const result = handlePaymentError(error)
      
      expect(result).toBeInstanceOf(PaymentError)
      expect(result.message).toBe('Payment error: Card declined')
    })

    it('should handle Stripe rate limit error', () => {
      const error = { type: 'StripeRateLimitError', message: 'Rate limit exceeded' }
      const result = handlePaymentError(error)
      
      expect(result).toBeInstanceOf(RateLimitError)
      expect(result.message).toBe('Payment service rate limit exceeded')
    })

    it('should handle Stripe invalid request error', () => {
      const error = { type: 'StripeInvalidRequestError', message: 'Invalid request' }
      const result = handlePaymentError(error)
      
      expect(result).toBeInstanceOf(ValidationError)
      expect(result.message).toBe('Invalid payment request: Invalid request')
    })

    it('should handle Stripe API error', () => {
      const error = { type: 'StripeAPIError', message: 'API error' }
      const result = handlePaymentError(error)
      
      expect(result).toBeInstanceOf(ExternalServiceError)
      expect(result.message).toBe('External service error (Stripe): API error')
    })

    it('should handle unknown payment error', () => {
      const error = { message: 'Unknown payment error' }
      const result = handlePaymentError(error)
      
      expect(result).toBeInstanceOf(PaymentError)
      expect(result.message).toBe('Payment error: Unknown payment error')
    })
  })

  describe('Email Error Handler', () => {
    it('should handle rate limit error', () => {
      const error = { response: { status: 429 }, message: 'Rate limit exceeded' }
      const result = handleEmailError(error)
      
      expect(result).toBeInstanceOf(RateLimitError)
      expect(result.message).toBe('Email service rate limit exceeded')
    })

    it('should handle bad request error', () => {
      const error = { response: { status: 400 }, message: 'Bad request' }
      const result = handleEmailError(error)
      
      expect(result).toBeInstanceOf(ValidationError)
      expect(result.message).toBe('Invalid email request: Bad request')
    })

    it('should handle server error', () => {
      const error = { response: { status: 500 }, message: 'Server error' }
      const result = handleEmailError(error)
      
      expect(result).toBeInstanceOf(ExternalServiceError)
      expect(result.message).toBe('External service error (Email Service): Server error')
    })

    it('should handle unknown email error', () => {
      const error = { message: 'Unknown email error' }
      const result = handleEmailError(error)
      
      expect(result).toBeInstanceOf(EmailError)
      expect(result.message).toBe('Email error: Unknown email error')
    })
  })

  describe('Validation Functions', () => {
    describe('validateEmail', () => {
      it('should validate correct email addresses', () => {
        expect(validateEmail('test@example.com')).toBe(true)
        expect(validateEmail('user.name@domain.co.uk')).toBe(true)
        expect(validateEmail('user+tag@example.org')).toBe(true)
      })

      it('should reject invalid email addresses', () => {
        expect(validateEmail('invalid-email')).toBe(false)
        expect(validateEmail('@example.com')).toBe(false)
        expect(validateEmail('test@')).toBe(false)
        expect(validateEmail('')).toBe(false)
        expect(validateEmail('test..test@example.com')).toBe(false)
      })
    })

    describe('validateUUID', () => {
      it('should validate correct UUIDs', () => {
        expect(validateUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true)
        expect(validateUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true)
      })

      it('should reject invalid UUIDs', () => {
        expect(validateUUID('invalid-uuid')).toBe(false)
        expect(validateUUID('123e4567-e89b-12d3-a456-42661417400')).toBe(false)
        expect(validateUUID('')).toBe(false)
        expect(validateUUID('123e4567-e89b-12d3-a456-426614174000-extra')).toBe(false)
      })
    })

    describe('validateRequired', () => {
      it('should validate required values', () => {
        expect(() => validateRequired('value', 'field')).not.toThrow()
        expect(() => validateRequired(0, 'field')).not.toThrow()
        expect(() => validateRequired(false, 'field')).not.toThrow()
      })

      it('should throw for missing values', () => {
        expect(() => validateRequired(null, 'field')).toThrow('field is required')
        expect(() => validateRequired(undefined, 'field')).toThrow('field is required')
        expect(() => validateRequired('', 'field')).toThrow('field is required')
      })
    })

    describe('validateMinLength', () => {
      it('should validate minimum length', () => {
        expect(() => validateMinLength('hello', 3, 'field')).not.toThrow()
        expect(() => validateMinLength('hello', 5, 'field')).not.toThrow()
      })

      it('should throw for insufficient length', () => {
        expect(() => validateMinLength('hi', 3, 'field')).toThrow('field must be at least 3 characters long')
        expect(() => validateMinLength('', 1, 'field')).toThrow('field must be at least 1 characters long')
      })
    })

    describe('validateMaxLength', () => {
      it('should validate maximum length', () => {
        expect(() => validateMaxLength('hello', 10, 'field')).not.toThrow()
        expect(() => validateMaxLength('hello', 5, 'field')).not.toThrow()
      })

      it('should throw for excessive length', () => {
        expect(() => validateMaxLength('hello world', 5, 'field')).toThrow('field must be no more than 5 characters long')
      })
    })

    describe('validateRange', () => {
      it('should validate values in range', () => {
        expect(() => validateRange(5, 1, 10, 'field')).not.toThrow()
        expect(() => validateRange(1, 1, 10, 'field')).not.toThrow()
        expect(() => validateRange(10, 1, 10, 'field')).not.toThrow()
      })

      it('should throw for values outside range', () => {
        expect(() => validateRange(0, 1, 10, 'field')).toThrow('field must be between 1 and 10')
        expect(() => validateRange(11, 1, 10, 'field')).toThrow('field must be between 1 and 10')
      })
    })
  })

  describe('Sanitization Functions', () => {
    describe('sanitizeString', () => {
      it('should trim whitespace and remove angle brackets', () => {
        expect(sanitizeString('  hello  ')).toBe('hello')
        expect(sanitizeString('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script')
        expect(sanitizeString('normal text')).toBe('normal text')
      })
    })

    describe('sanitizeEmail', () => {
      it('should trim and lowercase email', () => {
        expect(sanitizeEmail('  TEST@EXAMPLE.COM  ')).toBe('test@example.com')
        expect(sanitizeEmail('User@Domain.Com')).toBe('user@domain.com')
      })
    })

    describe('sanitizeHTML', () => {
      it('should escape HTML characters', () => {
        expect(sanitizeHTML('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
        expect(sanitizeHTML('normal text')).toBe('normal text')
        expect(sanitizeHTML('& < > " \' /')).toBe('&amp; &lt; &gt; &quot; &#x27; &#x2F;')
      })
    })
  })
})
