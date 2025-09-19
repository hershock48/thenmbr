import { test, expect } from '@playwright/test'

test.describe('Widget Functionality', () => {
  test('Widget loads and displays story information', async ({ page }) => {
    // Navigate to widget page
    await page.goto('/widget/test-org')
    
    // Verify widget loads
    await expect(page.locator('[data-testid="widget-container"]')).toBeVisible()
    await expect(page.locator('[data-testid="widget-header"]')).toContainText('Find Your NMBR Story')
    
    // Test NMBR code search
    await page.fill('[data-testid="nmbr-search-input"]', 'HOPE001')
    await page.click('[data-testid="nmbr-search-button"]')
    
    // Wait for story to load
    await page.waitForSelector('[data-testid="story-details"]', { timeout: 10000 })
    
    // Verify story information
    await expect(page.locator('[data-testid="story-title"]')).toBeVisible()
    await expect(page.locator('[data-testid="story-description"]')).toBeVisible()
    await expect(page.locator('[data-testid="progress-section"]')).toBeVisible()
    await expect(page.locator('[data-testid="subscription-section"]')).toBeVisible()
  })

  test('Widget subscription form validation', async ({ page }) => {
    await page.goto('/widget/test-org')
    
    // Search for a story first
    await page.fill('[data-testid="nmbr-search-input"]', 'HOPE001')
    await page.click('[data-testid="nmbr-search-button"]')
    await page.waitForSelector('[data-testid="story-details"]', { timeout: 10000 })
    
    // Test empty form submission
    await page.click('[data-testid="subscribe-button"]')
    
    // Verify validation errors
    await expect(page.locator('[data-testid="first-name-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="last-name-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible()
    
    // Test invalid email
    await page.fill('[data-testid="first-name-input"]', 'John')
    await page.fill('[data-testid="last-name-input"]', 'Doe')
    await page.fill('[data-testid="email-input"]', 'invalid-email')
    await page.click('[data-testid="subscribe-button"]')
    
    // Verify email validation error
    await expect(page.locator('[data-testid="email-error"]')).toContainText('Invalid email format')
    
    // Test valid form submission
    await page.fill('[data-testid="email-input"]', 'john.doe@example.com')
    await page.click('[data-testid="subscribe-button"]')
    
    // Verify success
    await expect(page.locator('[data-testid="subscription-success"]')).toBeVisible()
  })

  test('Widget donation flow', async ({ page }) => {
    await page.goto('/widget/test-org')
    
    // Search for a story
    await page.fill('[data-testid="nmbr-search-input"]', 'HOPE001')
    await page.click('[data-testid="nmbr-search-button"]')
    await page.waitForSelector('[data-testid="story-details"]', { timeout: 10000 })
    
    // Click donate button
    await page.click('[data-testid="donate-button"]')
    
    // Verify donation form appears
    await expect(page.locator('[data-testid="donation-form"]')).toBeVisible()
    
    // Test donation amount selection
    await page.click('[data-testid="donation-amount-25"]')
    await expect(page.locator('[data-testid="selected-amount"]')).toContainText('$25')
    
    // Test custom amount
    await page.click('[data-testid="custom-amount"]')
    await page.fill('[data-testid="custom-amount-input"]', '100')
    await expect(page.locator('[data-testid="selected-amount"]')).toContainText('$100')
    
    // Fill donor information
    await page.fill('[data-testid="donor-name"]', 'John Doe')
    await page.fill('[data-testid="donor-email"]', 'john.doe@example.com')
    
    // Submit donation
    await page.click('[data-testid="submit-donation"]')
    
    // Verify donation success
    await expect(page.locator('[data-testid="donation-success"]')).toBeVisible()
  })

  test('Widget responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/widget/test-org')
    
    // Verify widget is responsive
    await expect(page.locator('[data-testid="widget-container"]')).toBeVisible()
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.reload()
    
    // Verify widget adapts to tablet
    await expect(page.locator('[data-testid="widget-container"]')).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.reload()
    
    // Verify widget adapts to desktop
    await expect(page.locator('[data-testid="widget-container"]')).toBeVisible()
  })

  test('Widget error handling', async ({ page }) => {
    await page.goto('/widget/test-org')
    
    // Test invalid NMBR code
    await page.fill('[data-testid="nmbr-search-input"]', 'INVALID123')
    await page.click('[data-testid="nmbr-search-button"]')
    
    // Verify error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Story not found')
    
    // Test empty search
    await page.fill('[data-testid="nmbr-search-input"]', '')
    await page.click('[data-testid="nmbr-search-button"]')
    
    // Verify validation error
    await expect(page.locator('[data-testid="search-error"]')).toBeVisible()
  })
})
