'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Type, 
  MousePointer, 
  Keyboard, 
  Contrast,
  ZoomIn,
  ZoomOut,
  Settings,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface AccessibilitySettings {
  // Visual
  highContrast: boolean
  fontSize: number
  zoomLevel: number
  reduceMotion: boolean
  colorBlindSupport: boolean
  
  // Audio
  screenReader: boolean
  audioDescriptions: boolean
  soundNotifications: boolean
  
  // Interaction
  keyboardNavigation: boolean
  focusIndicators: boolean
  largeClickTargets: boolean
  voiceControl: boolean
  
  // Cognitive
  readingMode: boolean
  simplifiedLayout: boolean
  errorPrevention: boolean
  clearInstructions: boolean
}

interface AccessibilityIssue {
  id: string
  type: 'error' | 'warning' | 'info'
  element: string
  message: string
  wcagLevel: 'A' | 'AA' | 'AAA'
  fix: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export const AccessibilityEnhancer = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    fontSize: 16,
    zoomLevel: 100,
    reduceMotion: false,
    colorBlindSupport: false,
    screenReader: false,
    audioDescriptions: false,
    soundNotifications: false,
    keyboardNavigation: true,
    focusIndicators: true,
    largeClickTargets: false,
    voiceControl: false,
    readingMode: false,
    simplifiedLayout: false,
    errorPrevention: true,
    clearInstructions: true
  })

  const [issues, setIssues] = useState<AccessibilityIssue[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // Apply accessibility settings to the document
  const applySettings = useCallback(() => {
    const root = document.documentElement
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Font size
    root.style.setProperty('--font-size-base', `${settings.fontSize}px`)
    root.style.setProperty('--font-size-sm', `${settings.fontSize * 0.875}px`)
    root.style.setProperty('--font-size-lg', `${settings.fontSize * 1.125}px`)
    root.style.setProperty('--font-size-xl', `${settings.fontSize * 1.25}px`)

    // Zoom level
    root.style.setProperty('--zoom-level', `${settings.zoomLevel}%`)
    root.style.transform = `scale(${settings.zoomLevel / 100})`
    root.style.transformOrigin = 'top left'

    // Reduce motion
    if (settings.reduceMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }

    // Color blind support
    if (settings.colorBlindSupport) {
      root.classList.add('color-blind-support')
    } else {
      root.classList.remove('color-blind-support')
    }

    // Large click targets
    if (settings.largeClickTargets) {
      root.classList.add('large-click-targets')
    } else {
      root.classList.remove('large-click-targets')
    }

    // Focus indicators
    if (settings.focusIndicators) {
      root.classList.add('enhanced-focus')
    } else {
      root.classList.remove('enhanced-focus')
    }

    // Reading mode
    if (settings.readingMode) {
      root.classList.add('reading-mode')
    } else {
      root.classList.remove('reading-mode')
    }

    // Simplified layout
    if (settings.simplifiedLayout) {
      root.classList.add('simplified-layout')
    } else {
      root.classList.remove('simplified-layout')
    }

    // Save settings to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings))
  }, [settings])

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Failed to load accessibility settings:', error)
      }
    }
  }, [])

  // Apply settings when they change
  useEffect(() => {
    applySettings()
  }, [applySettings])

  // Scan for accessibility issues
  const scanForIssues = useCallback(async () => {
    setIsScanning(true)
    const foundIssues: AccessibilityIssue[] = []

    // Check for missing alt text
    const images = document.querySelectorAll('img')
    images.forEach((img, index) => {
      if (!img.alt && !img.getAttribute('aria-label')) {
        foundIssues.push({
          id: `missing-alt-${index}`,
          type: 'error',
          element: img.tagName,
          message: 'Image missing alt text',
          wcagLevel: 'A',
          fix: 'Add alt attribute or aria-label',
          severity: 'high'
        })
      }
    })

    // Check for missing form labels
    const inputs = document.querySelectorAll('input, textarea, select')
    inputs.forEach((input, index) => {
      const id = input.getAttribute('id')
      const label = id ? document.querySelector(`label[for="${id}"]`) : null
      const ariaLabel = input.getAttribute('aria-label')
      const ariaLabelledBy = input.getAttribute('aria-labelledby')

      if (!label && !ariaLabel && !ariaLabelledBy) {
        foundIssues.push({
          id: `missing-label-${index}`,
          type: 'error',
          element: input.tagName,
          message: 'Form control missing label',
          wcagLevel: 'A',
          fix: 'Add label element or aria-label',
          severity: 'high'
        })
      }
    })

    // Check for missing heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let lastLevel = 0
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1))
      if (level > lastLevel + 1) {
        foundIssues.push({
          id: `heading-skip-${index}`,
          type: 'warning',
          element: heading.tagName,
          message: 'Heading level skipped',
          wcagLevel: 'AA',
          fix: 'Use proper heading hierarchy',
          severity: 'medium'
        })
      }
      lastLevel = level
    })

    // Check for color contrast (simplified check)
    const elements = document.querySelectorAll('*')
    elements.forEach((element, index) => {
      const styles = window.getComputedStyle(element)
      const color = styles.color
      const backgroundColor = styles.backgroundColor
      
      // This is a simplified check - in a real implementation, you'd use a proper contrast checker
      if (color === backgroundColor) {
        foundIssues.push({
          id: `contrast-${index}`,
          type: 'warning',
          element: element.tagName,
          message: 'Potential color contrast issue',
          wcagLevel: 'AA',
          fix: 'Improve color contrast ratio',
          severity: 'medium'
        })
      }
    })

    // Check for keyboard navigation
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]')
    interactiveElements.forEach((element, index) => {
      const tabIndex = element.getAttribute('tabindex')
      if (tabIndex === '-1' && !element.hasAttribute('aria-hidden')) {
        foundIssues.push({
          id: `keyboard-${index}`,
          type: 'warning',
          element: element.tagName,
          message: 'Element not keyboard accessible',
          wcagLevel: 'A',
          fix: 'Ensure element is keyboard accessible',
          severity: 'medium'
        })
      }
    })

    setIssues(foundIssues)
    setIsScanning(false)

    toast({
      title: "Accessibility scan complete",
      description: `Found ${foundIssues.length} issues`,
      variant: foundIssues.length > 0 ? "destructive" : "default"
    })
  }, [])

  // Auto-scan on mount
  useEffect(() => {
    scanForIssues()
  }, [scanForIssues])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + A for accessibility menu
      if (event.altKey && event.key === 'a') {
        event.preventDefault()
        setShowSettings(!showSettings)
      }

      // Alt + S for scan
      if (event.altKey && event.key === 's') {
        event.preventDefault()
        scanForIssues()
      }

      // Alt + 1-9 for quick settings
      if (event.altKey && event.key >= '1' && event.key <= '9') {
        event.preventDefault()
        const settingIndex = parseInt(event.key) - 1
        const settingKeys = Object.keys(settings) as (keyof AccessibilitySettings)[]
        if (settingKeys[settingIndex]) {
          const key = settingKeys[settingIndex]
          setSettings(prev => ({
            ...prev,
            [key]: !prev[key]
          }))
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showSettings, settings, scanForIssues])

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const resetSettings = () => {
    setSettings({
      highContrast: false,
      fontSize: 16,
      zoomLevel: 100,
      reduceMotion: false,
      colorBlindSupport: false,
      screenReader: false,
      audioDescriptions: false,
      soundNotifications: false,
      keyboardNavigation: true,
      focusIndicators: true,
      largeClickTargets: false,
      voiceControl: false,
      readingMode: false,
      simplifiedLayout: false,
      errorPrevention: true,
      clearInstructions: true
    })
    toast({
      title: "Settings reset",
      description: "Accessibility settings have been reset to defaults",
      variant: "default"
    })
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return <X className="h-4 w-4 text-red-600" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'info': return <Info className="h-4 w-4 text-blue-600" />
      default: return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Accessibility Toggle Button */}
      <Button
        onClick={() => setShowSettings(!showSettings)}
        className="rounded-full shadow-lg"
        size="lg"
      >
        <Settings className="h-5 w-5 mr-2" />
        Accessibility
      </Button>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="absolute bottom-16 left-0 w-96 max-h-96 overflow-y-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Accessibility Settings</span>
            </CardTitle>
            <CardDescription>
              Customize your experience for better accessibility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Visual Settings */}
            <div className="space-y-3">
              <h3 className="font-medium flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Visual</span>
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">High Contrast</span>
                  <Switch
                    checked={settings.highContrast}
                    onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Font Size</span>
                    <span className="text-sm text-muted-foreground">{settings.fontSize}px</span>
                  </div>
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={([value]) => updateSetting('fontSize', value)}
                    min={12}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Zoom Level</span>
                    <span className="text-sm text-muted-foreground">{settings.zoomLevel}%</span>
                  </div>
                  <Slider
                    value={[settings.zoomLevel]}
                    onValueChange={([value]) => updateSetting('zoomLevel', value)}
                    min={50}
                    max={200}
                    step={10}
                    className="w-full"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Reduce Motion</span>
                  <Switch
                    checked={settings.reduceMotion}
                    onCheckedChange={(checked) => updateSetting('reduceMotion', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Color Blind Support</span>
                  <Switch
                    checked={settings.colorBlindSupport}
                    onCheckedChange={(checked) => updateSetting('colorBlindSupport', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Interaction Settings */}
            <div className="space-y-3">
              <h3 className="font-medium flex items-center space-x-2">
                <MousePointer className="h-4 w-4" />
                <span>Interaction</span>
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Large Click Targets</span>
                  <Switch
                    checked={settings.largeClickTargets}
                    onCheckedChange={(checked) => updateSetting('largeClickTargets', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Enhanced Focus</span>
                  <Switch
                    checked={settings.focusIndicators}
                    onCheckedChange={(checked) => updateSetting('focusIndicators', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Reading Mode</span>
                  <Switch
                    checked={settings.readingMode}
                    onCheckedChange={(checked) => updateSetting('readingMode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Simplified Layout</span>
                  <Switch
                    checked={settings.simplifiedLayout}
                    onCheckedChange={(checked) => updateSetting('simplifiedLayout', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-4 border-t">
              <Button
                onClick={scanForIssues}
                disabled={isScanning}
                size="sm"
                className="flex-1"
              >
                {isScanning ? (
                  <>
                    <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Scan Issues
                  </>
                )}
              </Button>
              <Button
                onClick={resetSettings}
                variant="outline"
                size="sm"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issues Panel */}
      {issues.length > 0 && (
        <Card className="absolute bottom-16 right-0 w-96 max-h-96 overflow-y-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Accessibility Issues</span>
            </CardTitle>
            <CardDescription>
              {issues.length} issue{issues.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {issues.map((issue) => (
              <div key={issue.id} className="p-3 border rounded-lg">
                <div className="flex items-start space-x-2">
                  {getIssueIcon(issue.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium">{issue.message}</span>
                      <Badge className={getSeverityColor(issue.severity)}>
                        {issue.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {issue.element} • WCAG {issue.wcagLevel}
                    </p>
                    <p className="text-xs text-blue-600">
                      Fix: {issue.fix}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AccessibilityEnhancer
