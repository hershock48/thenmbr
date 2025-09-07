import { test, expect } from '@playwright/test'

test.describe('Authentication Flows', () => {
  test('User can sign up successfully', async ({ page }) => {
    await page.goto('/signup')
    
    // Verify signup page loads
    await expect(page.locator('[data-testid="signup-header"]')).toContainText('Create Account')
    
    // Fill signup form
    await page.fill('[data-testid="first-name-input"]', 'John')
    await page.fill('[data-testid="last-name-input"]', 'Doe')
    await page.fill('[data-testid="email-input"]', 'john.doe@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.fill('[data-testid="confirm-password-input"]', 'password123')
    await page.fill('[data-testid="organization-name-input"]', 'Test Organization')
    
    // Submit signup
    await page.click('[data-testid="signup-button"]')
    
    // Verify success
    await expect(page.locator('[data-testid="signup-success"]')).toBeVisible()
    await expect(page.locator('[data-testid="signup-success"]')).toContainText('Account created successfully')
  })

  test('User can login successfully', async ({ page }) => {
    await page.goto('/login')
    
    // Verify login page loads
    await expect(page.locator('[data-testid="login-header"]')).toContainText('Sign In')
    
    // Fill login form
    await page.fill('[data-testid="email-input"]', 'admin@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    
    // Submit login
    await page.click('[data-testid="login-button"]')
    
    // Verify redirect to dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 })
    await expect(page.locator('[data-testid="dashboard-header"]')).toBeVisible()
  })

  test('Login form validation works', async ({ page }) => {
    await page.goto('/login')
    
    // Test empty form submission
    await page.click('[data-testid="login-button"]')
    
    // Verify validation errors
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="password-error"]')).toBeVisible()
    
    // Test invalid email
    await page.fill('[data-testid="email-input"]', 'invalid-email')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="login-button"]')
    
    // Verify email validation error
    await expect(page.locator('[data-testid="email-error"]')).toContainText('Invalid email format')
    
    // Test short password
    await page.fill('[data-testid="email-input"]', 'admin@example.com')
    await page.fill('[data-testid="password-input"]', '123')
    await page.click('[data-testid="login-button"]')
    
    // Verify password validation error
    await expect(page.locator('[data-testid="password-error"]')).toContainText('Password must be at least 8 characters')
  })

  test('Signup form validation works', async ({ page }) => {
    await page.goto('/signup')
    
    // Test empty form submission
    await page.click('[data-testid="signup-button"]')
    
    // Verify validation errors
    await expect(page.locator('[data-testid="first-name-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="last-name-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="password-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="organization-name-error"]')).toBeVisible()
    
    // Test password mismatch
    await page.fill('[data-testid="first-name-input"]', 'John')
    await page.fill('[data-testid="last-name-input"]', 'Doe')
    await page.fill('[data-testid="email-input"]', 'john.doe@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.fill('[data-testid="confirm-password-input"]', 'different123')
    await page.fill('[data-testid="organization-name-input"]', 'Test Organization')
    await page.click('[data-testid="signup-button"]')
    
    // Verify password mismatch error
    await expect(page.locator('[data-testid="confirm-password-error"]')).toContainText('Passwords do not match')
  })

  test('User can logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', 'admin@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="login-button"]')
    await page.waitForURL('/dashboard', { timeout: 10000 })
    
    // Logout
    await page.click('[data-testid="user-menu"]')
    await page.click('[data-testid="logout-button"]')
    
    // Verify redirect to login page
    await page.waitForURL('/login', { timeout: 10000 })
    await expect(page.locator('[data-testid="login-header"]')).toBeVisible()
  })

  test('User can reset password', async ({ page }) => {
    await page.goto('/login')
    
    // Click forgot password link
    await page.click('[data-testid="forgot-password-link"]')
    
    // Verify password reset page
    await expect(page.locator('[data-testid="password-reset-header"]')).toContainText('Reset Password')
    
    // Fill email
    await page.fill('[data-testid="email-input"]', 'admin@example.com')
    await page.click('[data-testid="reset-button"]')
    
    // Verify success message
    await expect(page.locator('[data-testid="reset-success"]')).toBeVisible()
    await expect(page.locator('[data-testid="reset-success"]')).toContainText('Password reset email sent')
  })

  test('User can select organization after login', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', 'admin@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="login-button"]')
    
    // If user has multiple organizations, show selection page
    if (await page.locator('[data-testid="org-selection-page"]').isVisible()) {
      await expect(page.locator('[data-testid="org-selection-header"]')).toContainText('Select Organization')
      
      // Select organization
      await page.click('[data-testid="org-card-0"]')
      await page.click('[data-testid="select-org-button"]')
      
      // Verify redirect to dashboard
      await page.waitForURL('/dashboard', { timeout: 10000 })
    }
    
    await expect(page.locator('[data-testid="dashboard-header"]')).toBeVisible()
  })

  test('Authentication errors are handled gracefully', async ({ page }) => {
    await page.goto('/login')
    
    // Test invalid credentials
    await page.fill('[data-testid="email-input"]', 'admin@example.com')
    await page.fill('[data-testid="password-input"]', 'wrongpassword')
    await page.click('[data-testid="login-button"]')
    
    // Verify error message
    await expect(page.locator('[data-testid="login-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="login-error"]')).toContainText('Invalid credentials')
    
    // Test non-existent user
    await page.fill('[data-testid="email-input"]', 'nonexistent@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="login-button"]')
    
    // Verify error message
    await expect(page.locator('[data-testid="login-error"]')).toBeVisible()
  })

  test('Protected routes redirect to login', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto('/dashboard')
    
    // Verify redirect to login
    await page.waitForURL('/login', { timeout: 10000 })
    await expect(page.locator('[data-testid="login-header"]')).toBeVisible()
    
    // Try to access subscribers page
    await page.goto('/dashboard/subscribers')
    
    // Verify redirect to login
    await page.waitForURL('/login', { timeout: 10000 })
  })

  test('Authentication persists across page refreshes', async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', 'admin@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="login-button"]')
    await page.waitForURL('/dashboard', { timeout: 10000 })
    
    // Refresh page
    await page.reload()
    
    // Verify still authenticated
    await expect(page.locator('[data-testid="dashboard-header"]')).toBeVisible()
  })
})
