'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Bug, 
  Copy, 
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showDetails?: boolean
  enableReporting?: boolean
  enableRetry?: boolean
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string
  retryCount: number
  isReporting: boolean
  reportSent: boolean
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  private maxRetries = 3

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0,
      isReporting: false,
      reportSent: false
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo)
    }

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Auto-report critical errors
    if (this.isCriticalError(error)) {
      this.reportError(error, errorInfo)
    }
  }

  private isCriticalError(error: Error): boolean {
    const criticalPatterns = [
      /ChunkLoadError/,
      /Loading chunk/,
      /NetworkError/,
      /TypeError.*undefined/,
      /ReferenceError.*undefined/
    ]
    
    return criticalPatterns.some(pattern => pattern.test(error.message))
  }

  private async reportError(error: Error, errorInfo: ErrorInfo) {
    if (this.state.isReporting || this.state.reportSent) return

    this.setState({ isReporting: true })

    try {
      const errorReport = {
        errorId: this.state.errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        retryCount: this.state.retryCount
      }

      // Send to error reporting service
      await fetch('/api/errors/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport)
      })

      this.setState({ 
        isReporting: false, 
        reportSent: true 
      })

      toast({
        title: "Error reported",
        description: "We've automatically reported this error to our team.",
        variant: "default"
      })
    } catch (reportError) {
      console.error('Failed to report error:', reportError)
      this.setState({ isReporting: false })
    }
  }

  private handleRetry = () => {
    if (this.state.retryCount >= this.maxRetries) {
      toast({
        title: "Maximum retries reached",
        description: "Please refresh the page or contact support.",
        variant: "destructive"
      })
      return
    }

    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
      reportSent: false
    }))
  }

  private handleRefresh = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  private copyErrorDetails = () => {
    const errorDetails = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      retryCount: this.state.retryCount
    }

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
    toast({
      title: "Error details copied",
      description: "Error information has been copied to your clipboard.",
      variant: "default"
    })
  }

  private getErrorSeverity(): 'low' | 'medium' | 'high' | 'critical' {
    if (!this.state.error) return 'low'

    const error = this.state.error
    const message = error.message.toLowerCase()

    // Critical errors
    if (this.isCriticalError(error) || message.includes('chunk') || message.includes('loading')) {
      return 'critical'
    }

    // High severity errors
    if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
      return 'high'
    }

    // Medium severity errors
    if (message.includes('type') || message.includes('reference') || message.includes('syntax')) {
      return 'medium'
    }

    return 'low'
  }

  private getErrorRecommendations(): string[] {
    const recommendations: string[] = []
    const error = this.state.error

    if (!error) return recommendations

    const message = error.message.toLowerCase()

    if (message.includes('chunk') || message.includes('loading')) {
      recommendations.push('Try refreshing the page to reload the application')
      recommendations.push('Clear your browser cache and try again')
    }

    if (message.includes('network') || message.includes('fetch')) {
      recommendations.push('Check your internet connection')
      recommendations.push('Try again in a few moments')
    }

    if (message.includes('type') || message.includes('reference')) {
      recommendations.push('This appears to be a code error. Please contact support.')
    }

    if (this.state.retryCount > 0) {
      recommendations.push(`You've tried ${this.state.retryCount} time(s). Consider refreshing the page.`)
    }

    return recommendations
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      const severity = this.getErrorSeverity()
      const recommendations = this.getErrorRecommendations()

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <CardTitle className="text-xl">Something went wrong</CardTitle>
              </div>
              <CardDescription>
                We encountered an unexpected error. Don't worry, we're working to fix it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Error ID and Severity */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Error ID:</span>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {this.state.errorId}
                  </code>
                </div>
                <Badge 
                  variant={
                    severity === 'critical' ? 'destructive' :
                    severity === 'high' ? 'destructive' :
                    severity === 'medium' ? 'secondary' : 'outline'
                  }
                >
                  {severity.toUpperCase()}
                </Badge>
              </div>

              {/* Error Message */}
              {this.state.error && (
                <Alert>
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Error Details</AlertTitle>
                  <AlertDescription>
                    {this.state.error.message}
                  </AlertDescription>
                </Alert>
              )}

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center space-x-2">
                    <Info className="h-4 w-4" />
                    <span>What you can try:</span>
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {this.props.enableRetry !== false && this.state.retryCount < this.maxRetries && (
                  <Button onClick={this.handleRetry} className="flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4" />
                    <span>Try Again ({this.maxRetries - this.state.retryCount} left)</span>
                  </Button>
                )}
                
                <Button variant="outline" onClick={this.handleRefresh} className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh Page</span>
                </Button>
                
                <Button variant="outline" onClick={this.handleGoHome} className="flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Go Home</span>
                </Button>

                {this.props.showDetails && this.state.error && (
                  <Button variant="outline" onClick={this.copyErrorDetails} className="flex items-center space-x-2">
                    <Copy className="h-4 w-4" />
                    <span>Copy Details</span>
                  </Button>
                )}
              </div>

              {/* Error Reporting Status */}
              {this.props.enableReporting !== false && (
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Error reporting:</span>
                    <div className="flex items-center space-x-2">
                      {this.state.isReporting ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Reporting...</span>
                        </>
                      ) : this.state.reportSent ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Reported</span>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => this.state.error && this.reportError(this.state.error, this.state.errorInfo!)}
                          className="flex items-center space-x-1"
                        >
                          <Bug className="h-4 w-4" />
                          <span>Report Error</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Technical Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="pt-4 border-t">
                  <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                    Technical Details (Development)
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 rounded-md">
                    <pre className="text-xs overflow-auto">
                      {this.state.error.stack}
                    </pre>
                    {this.state.errorInfo && (
                      <pre className="text-xs overflow-auto mt-2">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for functional components
export const useErrorHandler = () => {
  const handleError = (error: Error, errorInfo?: any) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo)
    
    // You can add custom error handling logic here
    // For example, sending to an error reporting service
    
    toast({
      title: "An error occurred",
      description: error.message,
      variant: "destructive"
    })
  }

  return { handleError }
}

export default EnhancedErrorBoundary
