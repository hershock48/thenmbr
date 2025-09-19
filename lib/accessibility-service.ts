// Accessibility service for WCAG 2.1 AA compliance
export interface AccessibilityConfig {
  enableKeyboardNavigation: boolean
  enableScreenReader: boolean
  enableHighContrast: boolean
  enableReducedMotion: boolean
  enableFocusManagement: boolean
  enableAriaLabels: boolean
  enableColorContrast: boolean
  enableTextScaling: boolean
  enableVoiceOver: boolean
  enableBraille: boolean
}

export interface AccessibilityAudit {
  id: string
  timestamp: number
  type: 'manual' | 'automated' | 'user_testing'
  results: AccessibilityResult[]
  score: number
  recommendations: string[]
  status: 'passed' | 'failed' | 'warning'
}

export interface AccessibilityResult {
  id: string
  type: 'error' | 'warning' | 'info'
  level: 'A' | 'AA' | 'AAA'
  criterion: string
  description: string
  element?: string
  selector?: string
  suggestion?: string
  impact: 'critical' | 'serious' | 'moderate' | 'minor'
}

export interface ColorContrastResult {
  ratio: number
  level: 'AA' | 'AAA' | 'fail'
  foreground: string
  background: string
  element: string
}

export interface FocusableElement {
  element: HTMLElement
  tabIndex: number
  isVisible: boolean
  isEnabled: boolean
  hasAriaLabel: boolean
  hasAriaDescribedBy: boolean
}

// Accessibility service
export class AccessibilityService {
  private config: AccessibilityConfig
  private focusableElements: FocusableElement[] = []
  private currentFocusIndex = 0
  private focusTrapStack: HTMLElement[] = []

  constructor(config: Partial<AccessibilityConfig> = {}) {
    this.config = {
      enableKeyboardNavigation: true,
      enableScreenReader: true,
      enableHighContrast: true,
      enableReducedMotion: true,
      enableFocusManagement: true,
      enableAriaLabels: true,
      enableColorContrast: true,
      enableTextScaling: true,
      enableVoiceOver: true,
      enableBraille: true,
      ...config
    }

    this.initializeAccessibility()
  }

  // Initialize accessibility features
  private initializeAccessibility(): void {
    if (typeof window === 'undefined') return

    // Add accessibility attributes to document
    document.documentElement.setAttribute('lang', 'en')
    document.documentElement.setAttribute('dir', 'ltr')

    // Add meta tags for accessibility
    this.addAccessibilityMetaTags()

    // Initialize keyboard navigation
    if (this.config.enableKeyboardNavigation) {
      this.initializeKeyboardNavigation()
    }

    // Initialize focus management
    if (this.config.enableFocusManagement) {
      this.initializeFocusManagement()
    }

    // Initialize screen reader support
    if (this.config.enableScreenReader) {
      this.initializeScreenReaderSupport()
    }

    // Initialize high contrast mode
    if (this.config.enableHighContrast) {
      this.initializeHighContrastMode()
    }

    // Initialize reduced motion
    if (this.config.enableReducedMotion) {
      this.initializeReducedMotion()
    }
  }

  // Add accessibility meta tags
  private addAccessibilityMetaTags(): void {
    const metaTags = [
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { name: 'theme-color', content: '#ffffff' },
      { name: 'color-scheme', content: 'light dark' },
      { name: 'prefers-color-scheme', content: 'light' },
      { name: 'prefers-reduced-motion', content: 'reduce' }
    ]

    metaTags.forEach(tag => {
      if (!document.querySelector(`meta[name="${tag.name}"]`)) {
        const meta = document.createElement('meta')
        meta.name = tag.name
        meta.content = tag.content
        document.head.appendChild(meta)
      }
    })
  }

  // Initialize keyboard navigation
  private initializeKeyboardNavigation(): void {
    document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this))
  }

  // Handle keyboard navigation
  private handleKeyboardNavigation(event: KeyboardEvent): void {
    const { key, ctrlKey, altKey, shiftKey } = event

    // Skip if modifier keys are pressed
    if (ctrlKey || altKey || shiftKey) return

    switch (key) {
      case 'Tab':
        this.handleTabNavigation(event)
        break
      case 'Escape':
        this.handleEscapeKey(event)
        break
      case 'Enter':
      case ' ':
        this.handleActivationKey(event)
        break
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        this.handleArrowKeys(event)
        break
      case 'Home':
        this.handleHomeKey(event)
        break
      case 'End':
        this.handleEndKey(event)
        break
    }
  }

  // Handle tab navigation
  private handleTabNavigation(event: KeyboardEvent): void {
    const focusableElements = this.getFocusableElements()
    const currentIndex = focusableElements.findIndex(el => el === document.activeElement)

    if (currentIndex === -1) return

    const nextIndex = event.shiftKey 
      ? (currentIndex - 1 + focusableElements.length) % focusableElements.length
      : (currentIndex + 1) % focusableElements.length

    focusableElements[nextIndex]?.focus()
    event.preventDefault()
  }

  // Handle escape key
  private handleEscapeKey(event: KeyboardEvent): void {
    // Close modals, dropdowns, etc.
    const modals = document.querySelectorAll('[role="dialog"], [role="alertdialog"]')
    const activeModal = Array.from(modals).find(modal => 
      modal.getAttribute('aria-hidden') !== 'true'
    )

    if (activeModal) {
      const closeButton = activeModal.querySelector('[aria-label*="close"], [aria-label*="Close"]')
      if (closeButton instanceof HTMLElement) {
        closeButton.click()
      }
    }
  }

  // Handle activation keys
  private handleActivationKey(event: KeyboardEvent): void {
    const target = event.target as HTMLElement
    if (target && (target.tagName === 'BUTTON' || target.getAttribute('role') === 'button')) {
      target.click()
    }
  }

  // Handle arrow keys
  private handleArrowKeys(event: KeyboardEvent): void {
    const target = event.target as HTMLElement
    const role = target.getAttribute('role')

    if (role === 'menubar' || role === 'menu' || role === 'tablist') {
      this.handleMenuNavigation(event)
    } else if (role === 'slider' || role === 'spinbutton') {
      this.handleSliderNavigation(event)
    }
  }

  // Handle menu navigation
  private handleMenuNavigation(event: KeyboardEvent): void {
    const { key } = event
    const target = event.target as HTMLElement
    const menu = target.closest('[role="menubar"], [role="menu"], [role="tablist"]')
    
    if (!menu) return

    const items = Array.from(menu.querySelectorAll('[role="menuitem"], [role="tab"]'))
    const currentIndex = items.indexOf(target)

    let nextIndex = currentIndex
    switch (key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % items.length
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + items.length) % items.length
        break
    }

    if (nextIndex !== currentIndex) {
      (items[nextIndex] as HTMLElement)?.focus()
      event.preventDefault()
    }
  }

  // Handle slider navigation
  private handleSliderNavigation(event: KeyboardEvent): void {
    const { key } = event
    const target = event.target as HTMLInputElement
    
    if (target.type !== 'range') return

    const step = parseFloat(target.step) || 1
    const min = parseFloat(target.min) || 0
    const max = parseFloat(target.max) || 100
    const currentValue = parseFloat(target.value)

    let newValue = currentValue
    switch (key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(currentValue + step, max)
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(currentValue - step, min)
        break
      case 'Home':
        newValue = min
        break
      case 'End':
        newValue = max
        break
    }

    if (newValue !== currentValue) {
      target.value = newValue.toString()
      target.dispatchEvent(new Event('input', { bubbles: true }))
      event.preventDefault()
    }
  }

  // Handle home key
  private handleHomeKey(event: KeyboardEvent): void {
    const target = event.target as HTMLElement
    const role = target.getAttribute('role')

    if (role === 'menubar' || role === 'menu' || role === 'tablist') {
      const menu = target.closest('[role="menubar"], [role="menu"], [role="tablist"]')
      const firstItem = menu?.querySelector('[role="menuitem"], [role="tab"]') as HTMLElement
      firstItem?.focus()
      event.preventDefault()
    }
  }

  // Handle end key
  private handleEndKey(event: KeyboardEvent): void {
    const target = event.target as HTMLElement
    const role = target.getAttribute('role')

    if (role === 'menubar' || role === 'menu' || role === 'tablist') {
      const menu = target.closest('[role="menubar"], [role="menu"], [role="tablist"]')
      const items = menu?.querySelectorAll('[role="menuitem"], [role="tab"]')
      const lastItem = items?.[items.length - 1] as HTMLElement
      lastItem?.focus()
      event.preventDefault()
    }
  }

  // Initialize focus management
  private initializeFocusManagement(): void {
    // Track focus changes
    document.addEventListener('focusin', this.handleFocusIn.bind(this))
    document.addEventListener('focusout', this.handleFocusOut.bind(this))

    // Initialize focusable elements
    this.updateFocusableElements()
  }

  // Handle focus in
  private handleFocusIn(event: FocusEvent): void {
    const target = event.target as HTMLElement
    this.announceFocusChange(target)
  }

  // Handle focus out
  private handleFocusOut(event: FocusEvent): void {
    // Clean up any focus-related state
  }

  // Announce focus change
  private announceFocusChange(element: HTMLElement): void {
    if (!this.config.enableScreenReader) return

    const ariaLabel = element.getAttribute('aria-label')
    const ariaLabelledBy = element.getAttribute('aria-labelledby')
    const textContent = element.textContent?.trim()

    if (ariaLabel || ariaLabelledBy || textContent) {
      this.announceToScreenReader(
        ariaLabel || textContent || 'Focus moved to interactive element'
      )
    }
  }

  // Initialize screen reader support
  private initializeScreenReaderSupport(): void {
    // Create live region for announcements
    this.createLiveRegion()
  }

  // Create live region for screen reader announcements
  private createLiveRegion(): void {
    if (document.getElementById('accessibility-live-region')) return

    const liveRegion = document.createElement('div')
    liveRegion.id = 'accessibility-live-region'
    liveRegion.setAttribute('aria-live', 'polite')
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `
    document.body.appendChild(liveRegion)
  }

  // Announce to screen reader
  announceToScreenReader(message: string): void {
    const liveRegion = document.getElementById('accessibility-live-region')
    if (liveRegion) {
      liveRegion.textContent = message
    }
  }

  // Initialize high contrast mode
  private initializeHighContrastMode(): void {
    // Check for high contrast preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      document.documentElement.classList.add('high-contrast')
    }

    // Listen for changes
    window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
      if (e.matches) {
        document.documentElement.classList.add('high-contrast')
      } else {
        document.documentElement.classList.remove('high-contrast')
      }
    })
  }

  // Initialize reduced motion
  private initializeReducedMotion(): void {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('reduced-motion')
    }

    // Listen for changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      if (e.matches) {
        document.documentElement.classList.add('reduced-motion')
      } else {
        document.documentElement.classList.remove('reduced-motion')
      }
    })
  }

  // Get focusable elements
  getFocusableElements(): HTMLElement[] {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([disabled])',
      '[role="link"]',
      '[role="menuitem"]',
      '[role="tab"]'
    ]

    return Array.from(document.querySelectorAll(focusableSelectors.join(', '))) as HTMLElement[]
  }

  // Update focusable elements
  updateFocusableElements(): void {
    this.focusableElements = this.getFocusableElements().map((element, index) => ({
      element,
      tabIndex: element.tabIndex || 0,
      isVisible: this.isElementVisible(element),
      isEnabled: !element.hasAttribute('disabled'),
      hasAriaLabel: !!element.getAttribute('aria-label'),
      hasAriaDescribedBy: !!element.getAttribute('aria-describedby')
    }))
  }

  // Check if element is visible
  private isElementVisible(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect()
    const style = window.getComputedStyle(element)
    
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.visibility !== 'hidden' &&
      style.display !== 'none' &&
      style.opacity !== '0'
    )
  }

  // Trap focus within element
  trapFocus(element: HTMLElement): void {
    this.focusTrapStack.push(element)
    this.updateFocusableElements()
    
    const focusableElements = this.getFocusableElements().filter(el => 
      element.contains(el)
    )

    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }
  }

  // Release focus trap
  releaseFocusTrap(): void {
    this.focusTrapStack.pop()
  }

  // Check color contrast
  checkColorContrast(foreground: string, background: string): ColorContrastResult {
    const fgRgb = this.hexToRgb(foreground)
    const bgRgb = this.hexToRgb(background)

    if (!fgRgb || !bgRgb) {
      return {
        ratio: 0,
        level: 'fail',
        foreground,
        background,
        element: ''
      }
    }

    const ratio = this.calculateContrastRatio(fgRgb, bgRgb)
    
    let level: 'AA' | 'AAA' | 'fail'
    if (ratio >= 7) {
      level = 'AAA'
    } else if (ratio >= 4.5) {
      level = 'AA'
    } else {
      level = 'fail'
    }

    return {
      ratio,
      level,
      foreground,
      background,
      element: ''
    }
  }

  // Convert hex to RGB
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  // Calculate contrast ratio
  private calculateContrastRatio(color1: { r: number; g: number; b: number }, color2: { r: number; g: number; b: number }): number {
    const luminance1 = this.calculateLuminance(color1)
    const luminance2 = this.calculateLuminance(color2)
    
    const lighter = Math.max(luminance1, luminance2)
    const darker = Math.min(luminance1, luminance2)
    
    return (lighter + 0.05) / (darker + 0.05)
  }

  // Calculate relative luminance
  private calculateLuminance(color: { r: number; g: number; b: number }): number {
    const { r, g, b } = color
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  // Run accessibility audit
  async runAccessibilityAudit(): Promise<AccessibilityAudit> {
    const results: AccessibilityResult[] = []

    // Check for missing alt text
    const images = document.querySelectorAll('img')
    images.forEach(img => {
      if (!img.alt && !img.getAttribute('aria-label')) {
        results.push({
          id: 'missing-alt-text',
          type: 'error',
          level: 'A',
          criterion: '1.1.1',
          description: 'Image missing alt text',
          element: img.tagName,
          selector: this.getElementSelector(img),
          suggestion: 'Add alt attribute or aria-label',
          impact: 'critical'
        })
      }
    })

    // Check for missing form labels
    const inputs = document.querySelectorAll('input, select, textarea')
    inputs.forEach(input => {
      const id = input.getAttribute('id')
      const ariaLabel = input.getAttribute('aria-label')
      const ariaLabelledBy = input.getAttribute('aria-labelledby')
      
      if (!id && !ariaLabel && !ariaLabelledBy) {
        results.push({
          id: 'missing-form-label',
          type: 'error',
          level: 'A',
          criterion: '1.3.1',
          description: 'Form control missing label',
          element: input.tagName,
          selector: this.getElementSelector(input),
          suggestion: 'Add label, aria-label, or aria-labelledby',
          impact: 'critical'
        })
      }
    })

    // Check for color contrast
    const elements = document.querySelectorAll('*')
    elements.forEach(element => {
      const style = window.getComputedStyle(element)
      const color = style.color
      const backgroundColor = style.backgroundColor
      
      if (color && backgroundColor && color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        const contrast = this.checkColorContrast(color, backgroundColor)
        if (contrast.level === 'fail') {
          results.push({
            id: 'insufficient-color-contrast',
            type: 'error',
            level: 'AA',
            criterion: '1.4.3',
            description: `Insufficient color contrast (${contrast.ratio.toFixed(2)})`,
            element: element.tagName,
            selector: this.getElementSelector(element),
            suggestion: 'Increase color contrast to at least 4.5:1',
            impact: 'serious'
          })
        }
      }
    })

    // Check for keyboard navigation
    const focusableElements = this.getFocusableElements()
    focusableElements.forEach(element => {
      if (element.tabIndex === -1 && !element.hasAttribute('aria-hidden')) {
        results.push({
          id: 'keyboard-navigation',
          type: 'warning',
          level: 'A',
          criterion: '2.1.1',
          description: 'Element not keyboard accessible',
          element: element.tagName,
          selector: this.getElementSelector(element),
          suggestion: 'Ensure element is keyboard accessible',
          impact: 'moderate'
        })
      }
    })

    // Calculate score
    const totalResults = results.length
    const errorCount = results.filter(r => r.type === 'error').length
    const warningCount = results.filter(r => r.type === 'warning').length
    const score = totalResults > 0 ? Math.max(0, 100 - (errorCount * 20) - (warningCount * 10)) : 100

    // Generate recommendations
    const recommendations = this.generateRecommendations(results)

    return {
      id: this.generateId(),
      timestamp: Date.now(),
      type: 'automated',
      results,
      score,
      recommendations,
      status: score >= 80 ? 'passed' : score >= 60 ? 'warning' : 'failed'
    }
  }

  // Generate recommendations
  private generateRecommendations(results: AccessibilityResult[]): string[] {
    const recommendations: string[] = []
    const errorTypes = new Set(results.filter(r => r.type === 'error').map(r => r.id))

    if (errorTypes.has('missing-alt-text')) {
      recommendations.push('Add alt text to all images for screen reader users')
    }

    if (errorTypes.has('missing-form-label')) {
      recommendations.push('Add labels to all form controls for better usability')
    }

    if (errorTypes.has('insufficient-color-contrast')) {
      recommendations.push('Improve color contrast to meet WCAG AA standards')
    }

    if (errorTypes.has('keyboard-navigation')) {
      recommendations.push('Ensure all interactive elements are keyboard accessible')
    }

    return recommendations
  }

  // Get element selector
  private getElementSelector(element: Element): string {
    if (element.id) {
      return `#${element.id}`
    }

    let selector = element.tagName.toLowerCase()
    if (element.className) {
      selector += `.${element.className.split(' ').join('.')}`
    }

    return selector
  }

  // Generate unique ID
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
  }

  // Update configuration
  updateConfig(newConfig: Partial<AccessibilityConfig>): void {
    this.config = { ...this.config, ...newConfig }
    this.initializeAccessibility()
  }

  // Get current configuration
  getConfig(): AccessibilityConfig {
    return { ...this.config }
  }
}

// Export singleton instance
export const accessibilityService = new AccessibilityService()

export default AccessibilityService
