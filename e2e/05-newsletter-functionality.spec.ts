import { test, expect } from '@playwright/test'

test.describe('Newsletter Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to newsletters
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', 'admin@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="login-button"]')
    await page.waitForURL('/dashboard', { timeout: 10000 })
    await page.goto('/dashboard/newsletters')
  })

  test('User can create a new newsletter', async ({ page }) => {
    // Click create newsletter button
    await page.click('[data-testid="create-newsletter-button"]')
    
    // Verify newsletter builder opens
    await expect(page.locator('[data-testid="newsletter-builder"]')).toBeVisible()
    
    // Fill newsletter details
    await page.fill('[data-testid="newsletter-name"]', 'Test Newsletter')
    await page.fill('[data-testid="newsletter-subject"]', 'Test Subject')
    
    // Select newsletter type
    await page.selectOption('[data-testid="newsletter-type"]', 'story_update')
    
    // Fill content
    await page.fill('[data-testid="newsletter-content"]', 'This is a test newsletter content.')
    
    // Save newsletter
    await page.click('[data-testid="save-newsletter"]')
    
    // Verify success
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible()
    await expect(page.locator('[data-testid="newsletter-list"]')).toContainText('Test Newsletter')
  })

  test('User can edit existing newsletter', async ({ page }) => {
    // Create a newsletter first
    await page.click('[data-testid="create-newsletter-button"]')
    await page.fill('[data-testid="newsletter-name"]', 'Original Newsletter')
    await page.fill('[data-testid="newsletter-subject"]', 'Original Subject')
    await page.fill('[data-testid="newsletter-content"]', 'Original content')
    await page.click('[data-testid="save-newsletter"]')
    await page.waitForSelector('[data-testid="save-success"]')
    
    // Edit the newsletter
    await page.click('[data-testid="edit-newsletter-0"]')
    await page.fill('[data-testid="newsletter-name"]', 'Updated Newsletter')
    await page.fill('[data-testid="newsletter-subject"]', 'Updated Subject')
    await page.fill('[data-testid="newsletter-content"]', 'Updated content')
    
    // Save changes
    await page.click('[data-testid="save-newsletter"]')
    
    // Verify update
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible()
    await expect(page.locator('[data-testid="newsletter-list"]')).toContainText('Updated Newsletter')
  })

  test('User can send newsletter to subscribers', async ({ page }) => {
    // Create a newsletter
    await page.click('[data-testid="create-newsletter-button"]')
    await page.fill('[data-testid="newsletter-name"]', 'Send Test Newsletter')
    await page.fill('[data-testid="newsletter-subject"]', 'Send Test Subject')
    await page.fill('[data-testid="newsletter-content"]', 'This newsletter will be sent to subscribers.')
    await page.click('[data-testid="save-newsletter"]')
    await page.waitForSelector('[data-testid="save-success"]')
    
    // Send newsletter
    await page.click('[data-testid="send-newsletter-0"]')
    
    // Verify send modal opens
    await expect(page.locator('[data-testid="send-modal"]')).toBeVisible()
    
    // Select recipients
    await page.check('[data-testid="select-all-subscribers"]')
    
    // Send
    await page.click('[data-testid="confirm-send"]')
    
    // Verify success
    await expect(page.locator('[data-testid="send-success"]')).toBeVisible()
    await expect(page.locator('[data-testid="newsletter-status-0"]')).toContainText('Sent')
  })

  test('User can preview newsletter', async ({ page }) => {
    // Create a newsletter
    await page.click('[data-testid="create-newsletter-button"]')
    await page.fill('[data-testid="newsletter-name"]', 'Preview Newsletter')
    await page.fill('[data-testid="newsletter-subject"]', 'Preview Subject')
    await page.fill('[data-testid="newsletter-content"]', 'This is preview content.')
    await page.click('[data-testid="save-newsletter"]')
    await page.waitForSelector('[data-testid="save-success"]')
    
    // Preview newsletter
    await page.click('[data-testid="preview-newsletter-0"]')
    
    // Verify preview opens
    await expect(page.locator('[data-testid="newsletter-preview"]')).toBeVisible()
    await expect(page.locator('[data-testid="preview-subject"]')).toContainText('Preview Subject')
    await expect(page.locator('[data-testid="preview-content"]')).toContainText('This is preview content')
  })

  test('User can delete newsletter', async ({ page }) => {
    // Create a newsletter
    await page.click('[data-testid="create-newsletter-button"]')
    await page.fill('[data-testid="newsletter-name"]', 'Delete Test Newsletter')
    await page.fill('[data-testid="newsletter-subject"]', 'Delete Subject')
    await page.fill('[data-testid="newsletter-content"]', 'This newsletter will be deleted.')
    await page.click('[data-testid="save-newsletter"]')
    await page.waitForSelector('[data-testid="save-success"]')
    
    // Delete newsletter
    await page.click('[data-testid="delete-newsletter-0"]')
    
    // Confirm deletion
    await expect(page.locator('[data-testid="delete-confirmation"]')).toBeVisible()
    await page.click('[data-testid="confirm-delete"]')
    
    // Verify deletion
    await expect(page.locator('[data-testid="delete-success"]')).toBeVisible()
    await expect(page.locator('[data-testid="newsletter-list"]')).not.toContainText('Delete Test Newsletter')
  })

  test('User can filter newsletters', async ({ page }) => {
    // Create newsletters of different types
    await page.click('[data-testid="create-newsletter-button"]')
    await page.fill('[data-testid="newsletter-name"]', 'Story Update Newsletter')
    await page.selectOption('[data-testid="newsletter-type"]', 'story_update')
    await page.fill('[data-testid="newsletter-subject"]', 'Story Update')
    await page.fill('[data-testid="newsletter-content"]', 'Story update content')
    await page.click('[data-testid="save-newsletter"]')
    await page.waitForSelector('[data-testid="save-success"]')
    
    await page.click('[data-testid="create-newsletter-button"]')
    await page.fill('[data-testid="newsletter-name"]', 'Milestone Newsletter')
    await page.selectOption('[data-testid="newsletter-type"]', 'milestone')
    await page.fill('[data-testid="newsletter-subject"]', 'Milestone Reached')
    await page.fill('[data-testid="newsletter-content"]', 'Milestone content')
    await page.click('[data-testid="save-newsletter"]')
    await page.waitForSelector('[data-testid="save-success"]')
    
    // Filter by type
    await page.selectOption('[data-testid="type-filter"]', 'story_update')
    await page.click('[data-testid="apply-filter"]')
    
    // Verify filtered results
    await expect(page.locator('[data-testid="newsletter-list"]')).toContainText('Story Update Newsletter')
    await expect(page.locator('[data-testid="newsletter-list"]')).not.toContainText('Milestone Newsletter')
  })

  test('User can search newsletters', async ({ page }) => {
    // Create newsletters with different names
    await page.click('[data-testid="create-newsletter-button"]')
    await page.fill('[data-testid="newsletter-name"]', 'Water Project Update')
    await page.fill('[data-testid="newsletter-subject"]', 'Water Update')
    await page.fill('[data-testid="newsletter-content"]', 'Water project content')
    await page.click('[data-testid="save-newsletter"]')
    await page.waitForSelector('[data-testid="save-success"]')
    
    await page.click('[data-testid="create-newsletter-button"]')
    await page.fill('[data-testid="newsletter-name"]', 'Education Milestone')
    await page.fill('[data-testid="newsletter-subject"]', 'Education Milestone')
    await page.fill('[data-testid="newsletter-content"]', 'Education content')
    await page.click('[data-testid="save-newsletter"]')
    await page.waitForSelector('[data-testid="save-success"]')
    
    // Search for specific newsletter
    await page.fill('[data-testid="newsletter-search"]', 'Water')
    await page.click('[data-testid="search-button"]')
    
    // Verify search results
    await expect(page.locator('[data-testid="newsletter-list"]')).toContainText('Water Project Update')
    await expect(page.locator('[data-testid="newsletter-list"]')).not.toContainText('Education Milestone')
  })

  test('Newsletter builder has drag and drop functionality', async ({ page }) => {
    await page.click('[data-testid="create-newsletter-button"]')
    
    // Verify drag and drop elements
    await expect(page.locator('[data-testid="drag-drop-area"]')).toBeVisible()
    await expect(page.locator('[data-testid="text-block"]')).toBeVisible()
    await expect(page.locator('[data-testid="image-block"]')).toBeVisible()
    await expect(page.locator('[data-testid="button-block"]')).toBeVisible()
    
    // Test dragging text block
    await page.dragAndDrop('[data-testid="text-block"]', '[data-testid="drag-drop-area"]')
    await expect(page.locator('[data-testid="dropped-text-block"]')).toBeVisible()
    
    // Test dragging image block
    await page.dragAndDrop('[data-testid="image-block"]', '[data-testid="drag-drop-area"]')
    await expect(page.locator('[data-testid="dropped-image-block"]')).toBeVisible()
  })

  test('Newsletter templates work correctly', async ({ page }) => {
    await page.click('[data-testid="create-newsletter-button"]')
    
    // Select template
    await page.click('[data-testid="template-selector"]')
    await page.click('[data-testid="template-clean-water"]')
    
    // Verify template is applied
    await expect(page.locator('[data-testid="newsletter-name"]')).toHaveValue('Clean Water Update')
    await expect(page.locator('[data-testid="newsletter-subject"]')).toHaveValue('Clean Water Project Update')
    
    // Customize template
    await page.fill('[data-testid="newsletter-content"]', 'Custom content for water project')
    
    // Save
    await page.click('[data-testid="save-newsletter"]')
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible()
  })
})
