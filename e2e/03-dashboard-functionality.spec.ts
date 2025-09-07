import { test, expect } from '@playwright/test'

test.describe('Dashboard Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication and navigate to dashboard
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', 'admin@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="login-button"]')
    await page.waitForURL('/dashboard', { timeout: 10000 })
  })

  test('Dashboard loads with all sections', async ({ page }) => {
    // Verify main dashboard elements
    await expect(page.locator('[data-testid="dashboard-header"]')).toBeVisible()
    await expect(page.locator('[data-testid="dashboard-sidebar"]')).toBeVisible()
    await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible()
    
    // Verify stats cards
    await expect(page.locator('[data-testid="stats-cards"]')).toBeVisible()
    await expect(page.locator('[data-testid="total-stories-card"]')).toBeVisible()
    await expect(page.locator('[data-testid="total-subscribers-card"]')).toBeVisible()
    await expect(page.locator('[data-testid="total-donations-card"]')).toBeVisible()
    
    // Verify recent stories section
    await expect(page.locator('[data-testid="recent-stories"]')).toBeVisible()
    
    // Verify quick actions
    await expect(page.locator('[data-testid="quick-actions"]')).toBeVisible()
  })

  test('Dashboard navigation works correctly', async ({ page }) => {
    // Test sidebar navigation
    await page.click('[data-testid="subscribers-nav"]')
    await page.waitForURL('/dashboard/subscribers')
    await expect(page.locator('[data-testid="subscribers-page"]')).toBeVisible()
    
    await page.click('[data-testid="newsletters-nav"]')
    await page.waitForURL('/dashboard/newsletters')
    await expect(page.locator('[data-testid="newsletters-page"]')).toBeVisible()
    
    await page.click('[data-testid="nmbrs-nav"]')
    await page.waitForURL('/dashboard/nmbrs')
    await expect(page.locator('[data-testid="nmbrs-page"]')).toBeVisible()
    
    await page.click('[data-testid="widget-nav"]')
    await page.waitForURL('/dashboard/widget')
    await expect(page.locator('[data-testid="widget-page"]')).toBeVisible()
    
    await page.click('[data-testid="billing-nav"]')
    await page.waitForURL('/dashboard/billing')
    await expect(page.locator('[data-testid="billing-page"]')).toBeVisible()
  })

  test('Subscribers page functionality', async ({ page }) => {
    await page.goto('/dashboard/subscribers')
    
    // Verify subscribers page loads
    await expect(page.locator('[data-testid="subscribers-header"]')).toBeVisible()
    await expect(page.locator('[data-testid="subscribers-table"]')).toBeVisible()
    
    // Test search functionality
    await page.fill('[data-testid="subscribers-search"]', 'john@example.com')
    await page.click('[data-testid="search-button"]')
    
    // Verify search results
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible()
    
    // Test filter functionality
    await page.click('[data-testid="status-filter"]')
    await page.click('[data-testid="active-filter"]')
    
    // Verify filtered results
    await expect(page.locator('[data-testid="filtered-results"]')).toBeVisible()
  })

  test('Newsletters page functionality', async ({ page }) => {
    await page.goto('/dashboard/newsletters')
    
    // Verify newsletters page loads
    await expect(page.locator('[data-testid="newsletters-header"]')).toBeVisible()
    await expect(page.locator('[data-testid="newsletters-list"]')).toBeVisible()
    
    // Test create newsletter button
    await page.click('[data-testid="create-newsletter-button"]')
    await expect(page.locator('[data-testid="newsletter-builder"]')).toBeVisible()
    
    // Test newsletter builder
    await page.fill('[data-testid="newsletter-name"]', 'Test Newsletter')
    await page.fill('[data-testid="newsletter-subject"]', 'Test Subject')
    await page.fill('[data-testid="newsletter-content"]', 'Test content')
    
    // Save newsletter
    await page.click('[data-testid="save-newsletter"]')
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible()
  })

  test('NMBRs page functionality', async ({ page }) => {
    await page.goto('/dashboard/nmbrs')
    
    // Verify NMBRs page loads
    await expect(page.locator('[data-testid="nmbrs-header"]')).toBeVisible()
    await expect(page.locator('[data-testid="nmbrs-list"]')).toBeVisible()
    
    // Test create NMBR button
    await page.click('[data-testid="create-nmbr-button"]')
    await expect(page.locator('[data-testid="nmbr-form"]')).toBeVisible()
    
    // Fill NMBR form
    await page.fill('[data-testid="nmbr-code"]', 'TEST001')
    await page.fill('[data-testid="nmbr-title"]', 'Test Story')
    await page.fill('[data-testid="nmbr-description"]', 'Test description')
    await page.fill('[data-testid="goal-amount"]', '1000')
    
    // Save NMBR
    await page.click('[data-testid="save-nmbr"]')
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible()
  })

  test('Widget page functionality', async ({ page }) => {
    await page.goto('/dashboard/widget')
    
    // Verify widget page loads
    await expect(page.locator('[data-testid="widget-header"]')).toBeVisible()
    await expect(page.locator('[data-testid="widget-preview"]')).toBeVisible()
    
    // Test widget customization
    await page.click('[data-testid="customize-button"]')
    await expect(page.locator('[data-testid="customization-panel"]')).toBeVisible()
    
    // Test color customization
    await page.click('[data-testid="primary-color-picker"]')
    await page.fill('[data-testid="primary-color-input"]', '#ff0000')
    
    // Test font customization
    await page.selectOption('[data-testid="font-select"]', 'Arial')
    
    // Save customization
    await page.click('[data-testid="save-customization"]')
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible()
  })

  test('Billing page functionality', async ({ page }) => {
    await page.goto('/dashboard/billing')
    
    // Verify billing page loads
    await expect(page.locator('[data-testid="billing-header"]')).toBeVisible()
    await expect(page.locator('[data-testid="billing-summary"]')).toBeVisible()
    
    // Test Stripe connect
    await page.click('[data-testid="connect-stripe-button"]')
    await expect(page.locator('[data-testid="stripe-connect-modal"]')).toBeVisible()
    
    // Test billing history
    await page.click('[data-testid="billing-history-tab"]')
    await expect(page.locator('[data-testid="billing-history"]')).toBeVisible()
  })

  test('Dashboard responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    
    // Verify mobile navigation
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible()
    await page.click('[data-testid="mobile-menu-button"]')
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.reload()
    
    // Verify tablet layout
    await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.reload()
    
    // Verify desktop layout
    await expect(page.locator('[data-testid="dashboard-sidebar"]')).toBeVisible()
    await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible()
  })
})
