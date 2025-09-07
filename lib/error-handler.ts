/**
 * Comprehensive Error Handling and Logging System
 * Provides structured error handling, logging, and monitoring for the NMBR Platform
 */

export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT = 'RATE_LIMIT',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',
  DATABASE = 'DATABASE',
  PAYMENT = 'PAYMENT',
  EMAIL = 'EMAIL',
  INTERNAL = 'INTERNAL',
  NETWORK = 'NETWORK',
  TIMEOUT = 'TIMEOUT'
}

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

export interface ErrorContext {
  userId?: string
  organizationId?: string
  storyId?: string
  action?: string
  metadata?: Record<string, any>
  requestId?: string | null
  userAgent?: string | null
  ip?: string | null
  timestamp?: string
  [key: string]: any // Allow additional properties
}

export interface LogEntry {
  level: LogLevel
  message: string
  error?: Error
  context?: ErrorContext
  stack?: string
  timestamp: string
  service: string
}

export class AppError extends Error {
  public readonly type: ErrorType
  public readonly statusCode: number
  public readonly context?: ErrorContext
  public readonly isOperational: boolean
  public readonly timestamp: string

  constructor(
    message: string,
    type: ErrorType = ErrorType.INTERNAL,
    statusCode: number = 500,
    context?: ErrorContext,
    isOperational: boolean = true
  ) {
    super(message)
    this.name = 'AppError'
    this.type = type
    this.statusCode = statusCode
    this.context = context
    this.isOperational = isOperational
    this.timestamp = new Date().toISOString()

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(message, ErrorType.VALIDATION, 400, context)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required', context?: ErrorContext) {
    super(message, ErrorType.AUTHENTICATION, 401, context)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions', context?: ErrorContext) {
    super(message, ErrorType.AUTHORIZATION, 403, context)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', context?: ErrorContext) {
    super(message, ErrorType.NOT_FOUND, 404, context)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict', context?: ErrorContext) {
    super(message, ErrorType.CONFLICT, 409, context)
    this.name = 'ConflictError'
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded', context?: ErrorContext) {
    super(message, ErrorType.RATE_LIMIT, 429, context)
    this.name = 'RateLimitError'
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string, context?: ErrorContext) {
    super(`External service error (${service}): ${message}`, ErrorType.EXTERNAL_SERVICE, 502, context)
    this.name = 'ExternalServiceError'
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(`Database error: ${message}`, ErrorType.DATABASE, 500, context)
    this.name = 'DatabaseError'
  }
}

export class PaymentError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(`Payment error: ${message}`, ErrorType.PAYMENT, 402, context)
    this.name = 'PaymentError'
  }
}

export class EmailError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(`Email error: ${message}`, ErrorType.EMAIL, 500, context)
    this.name = 'EmailError'
  }
}

// Logger class
export class Logger {
  private service: string
  private isDevelopment: boolean

  constructor(service: string = 'nmbr-platform') {
    this.service = service
    this.isDevelopment = process.env.NODE_ENV === 'development'
  }

  private formatLog(entry: LogEntry): string {
    const baseLog = {
      timestamp: entry.timestamp,
      level: entry.level,
      service: entry.service,
      message: entry.message,
      ...(entry.context && { context: entry.context }),
      ...(entry.error && { 
        error: {
          name: entry.error.name,
          message: entry.error.message,
          stack: entry.stack
        }
      })
    }

    return JSON.stringify(baseLog, null, this.isDevelopment ? 2 : 0)
  }

  private log(level: LogLevel, message: string, error?: Error, context?: ErrorContext) {
    const entry: LogEntry = {
      level,
      message,
      error,
      context,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      service: this.service
    }

    const formattedLog = this.formatLog(entry)

    // Console output
    switch (level) {
      case LogLevel.DEBUG:
        if (this.isDevelopment) console.debug(formattedLog)
        break
      case LogLevel.INFO:
        console.info(formattedLog)
        break
      case LogLevel.WARN:
        console.warn(formattedLog)
        break
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(formattedLog)
        break
    }

    // TODO: Send to external logging service (Sentry, DataDog, etc.)
    this.sendToExternalService(entry)
  }

  private async sendToExternalService(entry: LogEntry) {
    // In production, send to external logging service
    if (process.env.NODE_ENV === 'production') {
      try {
        // Example: Send to Sentry
        // if (process.env.SENTRY_DSN) {
        //   await fetch(process.env.SENTRY_DSN, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(entry)
        //   })
        // }
      } catch (error) {
        // Don't throw errors in logging
        console.error('Failed to send log to external service:', error)
      }
    }
  }

  debug(message: string, context?: ErrorContext) {
    this.log(LogLevel.DEBUG, message, undefined, context)
  }

  info(message: string, context?: ErrorContext) {
    this.log(LogLevel.INFO, message, undefined, context)
  }

  warn(message: string, context?: ErrorContext) {
    this.log(LogLevel.WARN, message, undefined, context)
  }

  error(message: string, error?: Error, context?: ErrorContext) {
    this.log(LogLevel.ERROR, message, error, context)
  }

  critical(message: string, error?: Error, context?: ErrorContext) {
    this.log(LogLevel.CRITICAL, message, error, context)
  }
}

// Global logger instance
export const logger = new Logger()

// Error handler utilities
export const handleError = (error: unknown, context?: ErrorContext): AppError => {
  if (error instanceof AppError) {
    logger.error(`Operational error: ${error.message}`, error, context)
    return error
  }

  if (error instanceof Error) {
    logger.error(`Unexpected error: ${error.message}`, error, context)
    return new AppError(
      error.message,
      ErrorType.INTERNAL,
      500,
      context,
      false
    )
  }

  const unknownError = new AppError(
    'An unknown error occurred',
    ErrorType.INTERNAL,
    500,
    context,
    false
  )
  
  logger.critical('Unknown error type encountered', unknownError, context)
  return unknownError
}

// API Error Response Helper
export const createErrorResponse = (error: AppError) => {
  const response = {
    error: {
      type: error.type,
      message: error.message,
      timestamp: error.timestamp,
      ...(error.context && { context: error.context })
    }
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && !error.isOperational) {
    response.error.message = 'An internal error occurred'
    delete response.error.context
  }

  return {
    status: error.statusCode,
    body: response
  }
}

// Async error wrapper for API routes
export const withErrorHandling = (handler: Function) => {
  return async (request: any, ...args: any[]) => {
    try {
      return await handler(request, ...args)
    } catch (error) {
      const appError = handleError(error, {
        requestId: request.headers?.get('x-request-id'),
        userAgent: request.headers?.get('user-agent'),
        ip: request.headers?.get('x-forwarded-for') || request.headers?.get('x-real-ip'),
        timestamp: new Date().toISOString()
      })

      const { status, body } = createErrorResponse(appError)
      return new Response(JSON.stringify(body), { 
        status,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
}

// Database error handler
export const handleDatabaseError = (error: any, context?: ErrorContext): AppError => {
  logger.error('Database operation failed', error, context)

  // Supabase specific error handling
  if (error.code) {
    switch (error.code) {
      case '23505': // Unique constraint violation
        return new ConflictError('Resource already exists', context)
      case '23503': // Foreign key constraint violation
        return new ValidationError('Invalid reference to related resource', context)
      case '23502': // Not null constraint violation
        return new ValidationError('Required field is missing', context)
      case '42P01': // Undefined table
        return new DatabaseError('Database table not found', context)
      case '42501': // Insufficient privilege
        return new AuthorizationError('Insufficient database privileges', context)
      default:
        return new DatabaseError(error.message || 'Database operation failed', context)
    }
  }

  return new DatabaseError(error.message || 'Database operation failed', context)
}

// Payment error handler
export const handlePaymentError = (error: any, context?: ErrorContext): AppError => {
  logger.error('Payment operation failed', error, context)

  if (error.type === 'StripeCardError') {
    return new PaymentError(`Card error: ${error.message}`, context)
  }

  if (error.type === 'StripeRateLimitError') {
    return new RateLimitError('Payment service rate limit exceeded', context)
  }

  if (error.type === 'StripeInvalidRequestError') {
    return new ValidationError(`Invalid payment request: ${error.message}`, context)
  }

  if (error.type === 'StripeAPIError') {
    return new ExternalServiceError('Stripe', error.message, context)
  }

  return new PaymentError(error.message || 'Payment operation failed', context)
}

// Email error handler
export const handleEmailError = (error: any, context?: ErrorContext): AppError => {
  logger.error('Email operation failed', error, context)

  if (error.response?.status === 429) {
    return new RateLimitError('Email service rate limit exceeded', context)
  }

  if (error.response?.status === 400) {
    return new ValidationError(`Invalid email request: ${error.message}`, context)
  }

  if (error.response?.status >= 500) {
    return new ExternalServiceError('Email Service', error.message, context)
  }

  return new EmailError(error.message || 'Email operation failed', context)
}

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

export const validateRequired = (value: any, fieldName: string): void => {
  if (value === null || value === undefined || value === '') {
    throw new ValidationError(`${fieldName} is required`)
  }
}

export const validateMinLength = (value: string, minLength: number, fieldName: string): void => {
  if (value.length < minLength) {
    throw new ValidationError(`${fieldName} must be at least ${minLength} characters long`)
  }
}

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): void => {
  if (value.length > maxLength) {
    throw new ValidationError(`${fieldName} must be no more than ${maxLength} characters long`)
  }
}

export const validateRange = (value: number, min: number, max: number, fieldName: string): void => {
  if (value < min || value > max) {
    throw new ValidationError(`${fieldName} must be between ${min} and ${max}`)
  }
}

// Sanitization utilities
export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}

export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase()
}

export const sanitizeHTML = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}
