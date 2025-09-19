import { test, expect } from '@playwright/test'

test.describe('Complete User Journey', () => {
  test('User can discover story, subscribe, and receive updates', async ({ page }) => {
    // Step 1: User visits the homepage
    await page.goto('/')
    
    // Verify homepage loads correctly
    await expect(page).toHaveTitle(/NMBR Platform/)
    await expect(page.locator('h1')).toContainText('Connect Through Impact')
    
    // Step 2: User searches for their NMBR code
    await page.fill('[data-testid="nmbr-search-input"]', 'HOPE001')
    await page.click('[data-testid="nmbr-search-button"]')
    
    // Wait for story to load
    await page.waitForSelector('[data-testid="story-card"]', { timeout: 10000 })
    
    // Verify story details are displayed
    await expect(page.locator('[data-testid="story-title"]')).toBeVisible()
    await expect(page.locator('[data-testid="story-description"]')).toBeVisible()
    await expect(page.locator('[data-testid="progress-bar"]')).toBeVisible()
    
    // Step 3: User subscribes to story updates
    await page.fill('[data-testid="first-name-input"]', 'John')
    await page.fill('[data-testid="last-name-input"]', 'Doe')
    await page.fill('[data-testid="email-input"]', 'john.doe@example.com')
    
    // Click subscribe button
    await page.click('[data-testid="subscribe-button"]')
    
    // Verify subscription success
    await expect(page.locator('[data-testid="subscription-success"]')).toBeVisible()
    await expect(page.locator('[data-testid="subscription-success"]')).toContainText('Successfully subscribed')
    
    // Step 4: User makes a donation
    await page.click('[data-testid="donate-button"]')
    
    // Fill donation form
    await page.fill('[data-testid="donation-amount"]', '50')
    await page.fill('[data-testid="donor-name"]', 'John Doe')
    await page.fill('[data-testid="donor-email"]', 'john.doe@example.com')
    
    // Submit donation (mock payment)
    await page.click('[data-testid="submit-donation"]')
    
    // Verify donation success
    await expect(page.locator('[data-testid="donation-success"]')).toBeVisible()
    await expect(page.locator('[data-testid="donation-success"]')).toContainText('Thank you for your donation')
  })

  test('User can navigate through different stories', async ({ page }) => {
    await page.goto('/')
    
    // Search for different NMBR codes
    const nmbrCodes = ['HOPE001', 'HOPE002', 'HOPE003']
    
    for (const code of nmbrCodes) {
      await page.fill('[data-testid="nmbr-search-input"]', code)
      await page.click('[data-testid="nmbr-search-button"]')
      
      // Wait for story to load
      await page.waitForSelector('[data-testid="story-card"]', { timeout: 10000 })
      
      // Verify story is displayed
      await expect(page.locator('[data-testid="story-title"]')).toBeVisible()
      
      // Clear search for next iteration
      await page.fill('[data-testid="nmbr-search-input"]', '')
    }
  })

  test('User can access dashboard after authentication', async ({ page }) => {
    // Mock authentication
    await page.goto('/login')
    
    // Fill login form
    await page.fill('[data-testid="email-input"]', 'admin@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    
    // Submit login
    await page.click('[data-testid="login-button"]')
    
    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 })
    
    // Verify dashboard loads
    await expect(page.locator('[data-testid="dashboard-header"]')).toBeVisible()
    await expect(page.locator('[data-testid="dashboard-sidebar"]')).toBeVisible()
    
    // Verify dashboard sections
    await expect(page.locator('[data-testid="stats-cards"]')).toBeVisible()
    await expect(page.locator('[data-testid="recent-stories"]')).toBeVisible()
    await expect(page.locator('[data-testid="quick-actions"]')).toBeVisible()
  })
})
