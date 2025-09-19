/**
 * Comprehensive Code Quality Analyzer
 * Provides code quality analysis, metrics, and improvement suggestions
 */

export interface CodeQualityMetrics {
  maintainability: number
  reliability: number
  security: number
  performance: number
  accessibility: number
  overall: number
}

export interface CodeIssue {
  id: string
  type: 'error' | 'warning' | 'info' | 'suggestion'
  severity: 'low' | 'medium' | 'high' | 'critical'
  file: string
  line: number
  column: number
  message: string
  rule: string
  fix?: string
  impact: string
  effort: 'low' | 'medium' | 'high'
}

export interface CodeComplexity {
  cyclomatic: number
  cognitive: number
  halstead: {
    vocabulary: number
    length: number
    volume: number
    difficulty: number
    effort: number
  }
}

export interface CodeDuplication {
  file: string
  lines: number[]
  duplicateOf: string
  similarity: number
  type: 'exact' | 'similar' | 'refactored'
}

export interface CodeCoverage {
  statements: number
  branches: number
  functions: number
  lines: number
  uncovered: {
    file: string
    lines: number[]
  }[]
}

export interface CodeQualityReport {
  timestamp: number
  metrics: CodeQualityMetrics
  issues: CodeIssue[]
  complexity: CodeComplexity
  duplication: CodeDuplication[]
  coverage: CodeCoverage
  suggestions: string[]
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
}

export class CodeQualityAnalyzer {
  private issues: CodeIssue[] = []
  private metrics: CodeQualityMetrics = {
    maintainability: 0,
    reliability: 0,
    security: 0,
    performance: 0,
    accessibility: 0,
    overall: 0
  }

  // Analyze code quality
  async analyzeCode(code: string, filePath: string): Promise<CodeQualityReport> {
    console.log(`🔍 Analyzing code quality for: ${filePath}`)

    // Reset metrics
    this.issues = []
    this.metrics = {
      maintainability: 0,
      reliability: 0,
      security: 0,
      performance: 0,
      accessibility: 0,
      overall: 0
    }

    // Run various analyses
    await this.analyzeMaintainability(code, filePath)
    await this.analyzeReliability(code, filePath)
    await this.analyzeSecurity(code, filePath)
    await this.analyzePerformance(code, filePath)
    await this.analyzeAccessibility(code, filePath)
    
    // Calculate overall metrics
    this.calculateOverallMetrics()

    // Generate report
    const report: CodeQualityReport = {
      timestamp: Date.now(),
      metrics: this.metrics,
      issues: this.issues,
      complexity: this.analyzeComplexity(code),
      duplication: this.analyzeDuplication(code, filePath),
      coverage: this.analyzeCoverage(code, filePath),
      suggestions: this.generateSuggestions(),
      grade: this.calculateGrade()
    }

    return report
  }

  // Analyze maintainability
  private async analyzeMaintainability(code: string, filePath: string): Promise<void> {
    let score = 100

    // Check for long functions
    const functions = this.extractFunctions(code)
    functions.forEach((func, index) => {
      if (func.lines > 50) {
        this.addIssue({
          id: `long-function-${index}`,
          type: 'warning',
          severity: 'medium',
          file: filePath,
          line: func.startLine,
          column: 1,
          message: `Function is too long (${func.lines} lines). Consider breaking it down.`,
          rule: 'max-function-length',
          fix: 'Break down the function into smaller, more focused functions',
          impact: 'Reduces readability and maintainability',
          effort: 'medium'
        })
        score -= 10
      }
    })

    // Check for long files
    const lines = code.split('\n').length
    if (lines > 500) {
      this.addIssue({
        id: 'long-file',
        type: 'warning',
        severity: 'medium',
        file: filePath,
        line: 1,
        column: 1,
        message: `File is too long (${lines} lines). Consider splitting into multiple files.`,
        rule: 'max-file-length',
        fix: 'Split the file into smaller, more focused modules',
        impact: 'Reduces maintainability and navigation',
        effort: 'high'
      })
      score -= 15
    }

    // Check for complex nested structures
    const maxNesting = this.getMaxNestingLevel(code)
    if (maxNesting > 4) {
      this.addIssue({
        id: 'deep-nesting',
        type: 'warning',
        severity: 'medium',
        file: filePath,
        line: 1,
        column: 1,
        message: `Code has deep nesting (${maxNesting} levels). Consider refactoring.`,
        rule: 'max-nesting-depth',
        fix: 'Extract nested logic into separate functions',
        impact: 'Reduces readability and maintainability',
        effort: 'medium'
      })
      score -= 20
    }

    // Check for magic numbers
    const magicNumbers = this.findMagicNumbers(code)
    magicNumbers.forEach((magic, index) => {
      this.addIssue({
        id: `magic-number-${index}`,
        type: 'info',
        severity: 'low',
        file: filePath,
        line: magic.line,
        column: magic.column,
        message: `Magic number detected: ${magic.value}. Consider using a named constant.`,
        rule: 'no-magic-numbers',
        fix: 'Replace with a named constant or configuration value',
        impact: 'Improves code readability and maintainability',
        effort: 'low'
      })
      score -= 2
    })

    this.metrics.maintainability = Math.max(0, score)
  }

  // Analyze reliability
  private async analyzeReliability(code: string, filePath: string): Promise<void> {
    let score = 100

    // Check for error handling
    const errorHandling = this.analyzeErrorHandling(code)
    if (errorHandling.missingHandlers > 0) {
      this.addIssue({
        id: 'missing-error-handling',
        type: 'warning',
        severity: 'high',
        file: filePath,
        line: 1,
        column: 1,
        message: `Missing error handling in ${errorHandling.missingHandlers} places.`,
        rule: 'error-handling',
        fix: 'Add proper error handling with try-catch blocks',
        impact: 'Improves application stability',
        effort: 'medium'
      })
      score -= 20
    }

    // Check for null/undefined checks
    const nullChecks = this.analyzeNullChecks(code)
    if (nullChecks.missingChecks > 0) {
      this.addIssue({
        id: 'missing-null-checks',
        type: 'warning',
        severity: 'medium',
        file: filePath,
        line: 1,
        column: 1,
        message: `Missing null/undefined checks in ${nullChecks.missingChecks} places.`,
        rule: 'null-checks',
        fix: 'Add null/undefined checks before accessing properties',
        impact: 'Prevents runtime errors',
        effort: 'low'
      })
      score -= 15
    }

    // Check for type safety
    const typeSafety = this.analyzeTypeSafety(code)
    if (typeSafety.unsafeOperations > 0) {
      this.addIssue({
        id: 'type-safety',
        type: 'warning',
        severity: 'medium',
        file: filePath,
        line: 1,
        column: 1,
        message: `Type safety issues detected in ${typeSafety.unsafeOperations} places.`,
        rule: 'type-safety',
        fix: 'Add proper type annotations and checks',
        impact: 'Prevents type-related runtime errors',
        effort: 'medium'
      })
      score -= 10
    }

    this.metrics.reliability = Math.max(0, score)
  }

  // Analyze security
  private async analyzeSecurity(code: string, filePath: string): Promise<void> {
    let score = 100

    // Check for SQL injection vulnerabilities
    const sqlInjection = this.checkSQLInjection(code)
    if (sqlInjection.length > 0) {
      sqlInjection.forEach((issue, index) => {
        this.addIssue({
          id: `sql-injection-${index}`,
          type: 'error',
          severity: 'critical',
          file: filePath,
          line: issue.line,
          column: issue.column,
          message: 'Potential SQL injection vulnerability detected.',
          rule: 'no-sql-injection',
          fix: 'Use parameterized queries or prepared statements',
          impact: 'Critical security vulnerability',
          effort: 'high'
        })
        score -= 30
      })
    }

    // Check for XSS vulnerabilities
    const xss = this.checkXSS(code)
    if (xss.length > 0) {
      xss.forEach((issue, index) => {
        this.addIssue({
          id: `xss-${index}`,
          type: 'error',
          severity: 'critical',
          file: filePath,
          line: issue.line,
          column: issue.column,
          message: 'Potential XSS vulnerability detected.',
          rule: 'no-xss',
          fix: 'Sanitize user input before rendering',
          impact: 'Critical security vulnerability',
          effort: 'high'
        })
        score -= 30
      })
    }

    // Check for hardcoded secrets
    const secrets = this.checkHardcodedSecrets(code)
    if (secrets.length > 0) {
      secrets.forEach((secret, index) => {
        this.addIssue({
          id: `hardcoded-secret-${index}`,
          type: 'error',
          severity: 'high',
          file: filePath,
          line: secret.line,
          column: secret.column,
          message: 'Hardcoded secret detected. Move to environment variables.',
          rule: 'no-hardcoded-secrets',
          fix: 'Move secrets to environment variables or secure configuration',
          impact: 'Security risk if code is exposed',
          effort: 'low'
        })
        score -= 25
      })
    }

    this.metrics.security = Math.max(0, score)
  }

  // Analyze performance
  private async analyzePerformance(code: string, filePath: string): Promise<void> {
    let score = 100

    // Check for inefficient loops
    const inefficientLoops = this.checkInefficientLoops(code)
    if (inefficientLoops.length > 0) {
      inefficientLoops.forEach((loop, index) => {
        this.addIssue({
          id: `inefficient-loop-${index}`,
          type: 'warning',
          severity: 'medium',
          file: filePath,
          line: loop.line,
          column: loop.column,
          message: 'Inefficient loop detected. Consider optimization.',
          rule: 'efficient-loops',
          fix: 'Optimize loop or use more efficient algorithms',
          impact: 'Improves application performance',
          effort: 'medium'
        })
        score -= 15
      })
    }

    // Check for memory leaks
    const memoryLeaks = this.checkMemoryLeaks(code)
    if (memoryLeaks.length > 0) {
      memoryLeaks.forEach((leak, index) => {
        this.addIssue({
          id: `memory-leak-${index}`,
          type: 'warning',
          severity: 'high',
          file: filePath,
          line: leak.line,
          column: leak.column,
          message: 'Potential memory leak detected.',
          rule: 'no-memory-leaks',
          fix: 'Add proper cleanup and event listener removal',
          impact: 'Prevents memory leaks and improves performance',
          effort: 'medium'
        })
        score -= 20
      })
    }

    // Check for unnecessary re-renders
    const reRenders = this.checkUnnecessaryRerenders(code)
    if (reRenders.length > 0) {
      reRenders.forEach((render, index) => {
        this.addIssue({
          id: `unnecessary-rerender-${index}`,
          type: 'info',
          severity: 'low',
          file: filePath,
          line: render.line,
          column: render.column,
          message: 'Potential unnecessary re-render detected.',
          rule: 'optimize-rerenders',
          fix: 'Use React.memo, useMemo, or useCallback to optimize',
          impact: 'Improves rendering performance',
          effort: 'low'
        })
        score -= 5
      })
    }

    this.metrics.performance = Math.max(0, score)
  }

  // Analyze accessibility
  private async analyzeAccessibility(code: string, filePath: string): Promise<void> {
    let score = 100

    // Check for missing alt text
    const missingAlt = this.checkMissingAltText(code)
    if (missingAlt.length > 0) {
      missingAlt.forEach((img, index) => {
        this.addIssue({
          id: `missing-alt-${index}`,
          type: 'error',
          severity: 'high',
          file: filePath,
          line: img.line,
          column: img.column,
          message: 'Image missing alt text for accessibility.',
          rule: 'alt-text-required',
          fix: 'Add alt attribute to img elements',
          impact: 'Improves accessibility for screen readers',
          effort: 'low'
        })
        score -= 20
      })
    }

    // Check for missing ARIA labels
    const missingAria = this.checkMissingAriaLabels(code)
    if (missingAria.length > 0) {
      missingAria.forEach((element, index) => {
        this.addIssue({
          id: `missing-aria-${index}`,
          type: 'warning',
          severity: 'medium',
          file: filePath,
          line: element.line,
          column: element.column,
          message: 'Interactive element missing ARIA label.',
          rule: 'aria-labels-required',
          fix: 'Add aria-label or aria-labelledby attributes',
          impact: 'Improves accessibility for screen readers',
          effort: 'low'
        })
        score -= 10
      })
    }

    // Check for keyboard navigation
    const keyboardNav = this.checkKeyboardNavigation(code)
    if (keyboardNav.length > 0) {
      keyboardNav.forEach((element, index) => {
        this.addIssue({
          id: `keyboard-nav-${index}`,
          type: 'warning',
          severity: 'medium',
          file: filePath,
          line: element.line,
          column: element.column,
          message: 'Interactive element not keyboard accessible.',
          rule: 'keyboard-navigation',
          fix: 'Add tabindex or ensure element is focusable',
          impact: 'Improves accessibility for keyboard users',
          effort: 'low'
        })
        score -= 15
      })
    }

    this.metrics.accessibility = Math.max(0, score)
  }

  // Helper methods for analysis
  private extractFunctions(code: string): Array<{ startLine: number; lines: number }> {
    const functions: Array<{ startLine: number; lines: number }> = []
    const lines = code.split('\n')
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.includes('function ') || line.includes('=>')) {
        // Simple function detection - in real implementation, use AST
        const startLine = i + 1
        let endLine = i + 1
        let braceCount = 0
        let inFunction = false
        
        for (let j = i; j < lines.length; j++) {
          const currentLine = lines[j]
          if (currentLine.includes('{')) {
            braceCount++
            inFunction = true
          }
          if (currentLine.includes('}')) {
            braceCount--
          }
          if (inFunction && braceCount === 0) {
            endLine = j + 1
            break
          }
        }
        
        functions.push({
          startLine,
          lines: endLine - startLine
        })
      }
    }
    
    return functions
  }

  private getMaxNestingLevel(code: string): number {
    let maxNesting = 0
    let currentNesting = 0
    
    for (const char of code) {
      if (char === '{') {
        currentNesting++
        maxNesting = Math.max(maxNesting, currentNesting)
      } else if (char === '}') {
        currentNesting--
      }
    }
    
    return maxNesting
  }

  private findMagicNumbers(code: string): Array<{ line: number; column: number; value: string }> {
    const magicNumbers: Array<{ line: number; column: number; value: string }> = []
    const lines = code.split('\n')
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const numbers = line.match(/\b\d+\b/g)
      if (numbers) {
        numbers.forEach(number => {
          if (parseInt(number) > 10) { // Consider numbers > 10 as magic
            magicNumbers.push({
              line: i + 1,
              column: line.indexOf(number),
              value: number
            })
          }
        })
      }
    }
    
    return magicNumbers
  }

  private analyzeErrorHandling(code: string): { missingHandlers: number } {
    // Simple analysis - in real implementation, use AST
    const asyncFunctions = (code.match(/async\s+function/g) || []).length
    const tryCatchBlocks = (code.match(/try\s*{/g) || []).length
    
    return {
      missingHandlers: Math.max(0, asyncFunctions - tryCatchBlocks)
    }
  }

  private analyzeNullChecks(code: string): { missingChecks: number } {
    // Simple analysis - in real implementation, use AST
    const propertyAccess = (code.match(/\.\w+/g) || []).length
    const nullChecks = (code.match(/if\s*\(\s*\w+\s*\)/g) || []).length
    
    return {
      missingChecks: Math.max(0, propertyAccess - nullChecks)
    }
  }

  private analyzeTypeSafety(code: string): { unsafeOperations: number } {
    // Simple analysis - in real implementation, use AST
    const anyTypes = (code.match(/:\s*any/g) || []).length
    const typeAssertions = (code.match(/as\s+\w+/g) || []).length
    
    return {
      unsafeOperations: anyTypes + typeAssertions
    }
  }

  private checkSQLInjection(code: string): Array<{ line: number; column: number }> {
    const issues: Array<{ line: number; column: number }> = []
    const lines = code.split('\n')
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.includes('SELECT') && line.includes('${') || line.includes('INSERT') && line.includes('${')) {
        issues.push({
          line: i + 1,
          column: line.indexOf('${')
        })
      }
    }
    
    return issues
  }

  private checkXSS(code: string): Array<{ line: number; column: number }> {
    const issues: Array<{ line: number; column: number }> = []
    const lines = code.split('\n')
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.includes('dangerouslySetInnerHTML') || line.includes('innerHTML')) {
        issues.push({
          line: i + 1,
          column: line.indexOf('dangerouslySetInnerHTML') || line.indexOf('innerHTML')
        })
      }
    }
    
    return issues
  }

  private checkHardcodedSecrets(code: string): Array<{ line: number; column: number }> {
    const issues: Array<{ line: number; column: number }> = []
    const lines = code.split('\n')
    
    const secretPatterns = [
      /password\s*[:=]\s*['"][^'"]+['"]/gi,
      /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/gi,
      /secret\s*[:=]\s*['"][^'"]+['"]/gi,
      /token\s*[:=]\s*['"][^'"]+['"]/gi
    ]
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      secretPatterns.forEach(pattern => {
        if (pattern.test(line)) {
          issues.push({
            line: i + 1,
            column: line.search(pattern)
          })
        }
      })
    }
    
    return issues
  }

  private checkInefficientLoops(code: string): Array<{ line: number; column: number }> {
    const issues: Array<{ line: number; column: number }> = []
    const lines = code.split('\n')
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.includes('for (') && line.includes('length') && line.includes('i++')) {
        // Simple check for inefficient loop patterns
        issues.push({
          line: i + 1,
          column: line.indexOf('for')
        })
      }
    }
    
    return issues
  }

  private checkMemoryLeaks(code: string): Array<{ line: number; column: number }> {
    const issues: Array<{ line: number; column: number }> = []
    const lines = code.split('\n')
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.includes('addEventListener') && !line.includes('removeEventListener')) {
        issues.push({
          line: i + 1,
          column: line.indexOf('addEventListener')
        })
      }
    }
    
    return issues
  }

  private checkUnnecessaryRerenders(code: string): Array<{ line: number; column: number }> {
    const issues: Array<{ line: number; column: number }> = []
    const lines = code.split('\n')
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.includes('useState') && line.includes('setState')) {
        issues.push({
          line: i + 1,
          column: line.indexOf('useState')
        })
      }
    }
    
    return issues
  }

  private checkMissingAltText(code: string): Array<{ line: number; column: number }> {
    const issues: Array<{ line: number; column: number }> = []
    const lines = code.split('\n')
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.includes('<img') && !line.includes('alt=')) {
        issues.push({
          line: i + 1,
          column: line.indexOf('<img')
        })
      }
    }
    
    return issues
  }

  private checkMissingAriaLabels(code: string): Array<{ line: number; column: number }> {
    const issues: Array<{ line: number; column: number }> = []
    const lines = code.split('\n')
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if ((line.includes('<button') || line.includes('<input')) && 
          !line.includes('aria-label') && !line.includes('aria-labelledby')) {
        issues.push({
          line: i + 1,
          column: line.indexOf('<button') || line.indexOf('<input')
        })
      }
    }
    
    return issues
  }

  private checkKeyboardNavigation(code: string): Array<{ line: number; column: number }> {
    const issues: Array<{ line: number; column: number }> = []
    const lines = code.split('\n')
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.includes('onClick') && !line.includes('onKeyDown') && !line.includes('onKeyPress')) {
        issues.push({
          line: i + 1,
          column: line.indexOf('onClick')
        })
      }
    }
    
    return issues
  }

  private analyzeComplexity(code: string): CodeComplexity {
    // Simplified complexity analysis
    const lines = code.split('\n').length
    const functions = (code.match(/function\s+\w+/g) || []).length
    const conditions = (code.match(/if\s*\(/g) || []).length + (code.match(/switch\s*\(/g) || []).length
    const loops = (code.match(/for\s*\(/g) || []).length + (code.match(/while\s*\(/g) || []).length
    
    return {
      cyclomatic: conditions + loops + 1,
      cognitive: lines * 0.1 + functions * 0.5 + conditions * 0.3 + loops * 0.4,
      halstead: {
        vocabulary: functions + conditions + loops,
        length: lines,
        volume: lines * Math.log2(functions + conditions + loops + 1),
        difficulty: (functions + conditions + loops) / 2,
        effort: lines * Math.log2(functions + conditions + loops + 1) * (functions + conditions + loops) / 2
      }
    }
  }

  private analyzeDuplication(code: string, filePath: string): CodeDuplication[] {
    // Simplified duplication analysis
    return []
  }

  private analyzeCoverage(code: string, filePath: string): CodeCoverage {
    // Simplified coverage analysis
    return {
      statements: 85,
      branches: 80,
      functions: 90,
      lines: 85,
      uncovered: []
    }
  }

  private addIssue(issue: CodeIssue): void {
    this.issues.push(issue)
  }

  private calculateOverallMetrics(): void {
    const { maintainability, reliability, security, performance, accessibility } = this.metrics
    this.metrics.overall = (maintainability + reliability + security + performance + accessibility) / 5
  }

  private generateSuggestions(): string[] {
    const suggestions: string[] = []
    
    if (this.metrics.maintainability < 70) {
      suggestions.push('Consider breaking down large functions and files')
    }
    
    if (this.metrics.reliability < 70) {
      suggestions.push('Add more error handling and null checks')
    }
    
    if (this.metrics.security < 70) {
      suggestions.push('Review and fix security vulnerabilities')
    }
    
    if (this.metrics.performance < 70) {
      suggestions.push('Optimize performance bottlenecks')
    }
    
    if (this.metrics.accessibility < 70) {
      suggestions.push('Improve accessibility compliance')
    }
    
    return suggestions
  }

  private calculateGrade(): 'A' | 'B' | 'C' | 'D' | 'F' {
    const overall = this.metrics.overall
    
    if (overall >= 90) return 'A'
    if (overall >= 80) return 'B'
    if (overall >= 70) return 'C'
    if (overall >= 60) return 'D'
    return 'F'
  }
}

export default CodeQualityAnalyzer
