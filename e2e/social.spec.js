const { test, expect } = require('@playwright/test')

test.describe('Social page', () => {
  test('renders social hub and activity cards', async ({ page }) => {
    await page.goto('/social')

    await expect(page.getByRole('heading', { name: /connected/i })).toBeVisible()

    // Profiles grid should include the main three profiles.
    await expect(page.getByText('LinkedIn', { exact: true })).toBeVisible()
    await expect(page.getByText('GitHub', { exact: true })).toBeVisible()
    await expect(page.getByText('Twitter', { exact: true })).toBeVisible()

    await expect(page.getByText('Latest_Activity')).toBeVisible()

    // At least one post card should appear (tag pill).
    await expect(page.locator('span').filter({ hasText: 'AI Engineering' }).first()).toBeVisible()
  })
})

