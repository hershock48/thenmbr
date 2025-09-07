'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Keyboard,
  Mouse,
  Monitor,
  Smartphone,
  Tablet,
  Zap,
  Shield,
  Target,
  BarChart3,
  FileText,
  Download
} from 'lucide-react'
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext'
import { accessibilityService, AccessibilityAudit, AccessibilityResult } from '@/lib/accessibility-service'

export function AccessibilityAuditDashboard() {
  const { user, hasPermission, isAdmin } = useEnhancedAuth()
  const [audit, setAudit] = useState<AccessibilityAudit | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<'A' | 'AA' | 'AAA' | 'all'>('all')
  const [selectedImpact, setSelectedImpact] = useState<'critical' | 'serious' | 'moderate' | 'minor' | 'all'>('all')
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Check if user has permission to view accessibility audits
  if (!hasPermission('VIEW_LOGS') && !isAdmin()) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <Shield className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          You don't have permission to view accessibility audits.
        </AlertDescription>
      </Alert>
    )
  }

  const runAudit = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const auditResult = await accessibilityService.runAccessibilityAudit()
      setAudit(auditResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run accessibility audit')
    } finally {
      setIsLoading(false)
    }
  }

  const exportAudit = () => {
    if (!audit) return

    const auditData = {
      ...audit,
      exportedAt: new Date().toISOString(),
      url: window.location.href
    }

    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `accessibility-audit-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    runAudit()
    
    // Auto-refresh every 5 minutes if enabled
    let interval: NodeJS.Timeout | null = null
    if (autoRefresh) {
      interval = setInterval(runAudit, 300000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />
      case 'failed':
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'serious':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'minor':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />
      case 'info':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const filteredResults = audit?.results.filter(result => {
    const levelMatch = selectedLevel === 'all' || result.level === selectedLevel
    const impactMatch = selectedImpact === 'all' || result.impact === selectedImpact
    return levelMatch && impactMatch
  }) || []

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Accessibility Audit</h2>
          <Button disabled>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Running Audit...
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <XCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Error running accessibility audit: {error}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Accessibility Audit</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </Button>
          <Button onClick={runAudit} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Run Audit
          </Button>
          {audit && (
            <Button onClick={exportAudit} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Audit Summary */}
      {audit && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{audit.score}/100</div>
              <p className="text-xs text-muted-foreground">
                {audit.status === 'passed' ? 'Passed' : audit.status === 'warning' ? 'Warning' : 'Failed'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{audit.results.length}</div>
              <p className="text-xs text-muted-foreground">
                {audit.results.filter(r => r.type === 'error').length} errors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {audit.results.filter(r => r.impact === 'critical').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Require immediate attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Audit</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatTimestamp(audit.timestamp).split(',')[0]}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatTimestamp(audit.timestamp).split(',')[1]}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      {audit && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Filter Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Level:</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value as any)}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="all">All Levels</option>
                  <option value="A">A</option>
                  <option value="AA">AA</option>
                  <option value="AAA">AAA</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Impact:</label>
                <select
                  value={selectedImpact}
                  onChange={(e) => setSelectedImpact(e.target.value as any)}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="all">All Impacts</option>
                  <option value="critical">Critical</option>
                  <option value="serious">Serious</option>
                  <option value="moderate">Moderate</option>
                  <option value="minor">Minor</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issues List */}
      {audit && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Accessibility Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p>No issues found with current filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredResults.map((result, index) => (
                  <div
                    key={`${result.id}-${index}`}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {getTypeIcon(result.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium">{result.description}</h3>
                          <Badge className={getStatusColor(result.type)}>
                            {result.type}
                          </Badge>
                          <Badge className={getImpactColor(result.impact)}>
                            {result.impact}
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-800">
                            {result.level}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Criterion:</strong> {result.criterion}
                        </p>
                        {result.element && (
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>Element:</strong> {result.element}
                          </p>
                        )}
                        {result.selector && (
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>Selector:</strong> {result.selector}
                          </p>
                        )}
                        {result.suggestion && (
                          <p className="text-sm text-blue-600">
                            <strong>Suggestion:</strong> {result.suggestion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {audit && audit.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {audit.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AccessibilityAuditDashboard
