const { test, expect } = require('@playwright/test')

test.describe('Projects', () => {
  test('projects index renders and can open a project detail page', async ({ page }) => {
    await page.goto('/projects')

    await expect(page.getByRole('heading', { name: /projects/i })).toBeVisible()

    // Open the first project card
    const firstExecLogLink = page.getByRole('link', { name: 'EXEC_LOG' }).first()
    await expect(firstExecLogLink).toBeVisible()
    await Promise.all([
      page.waitForURL(/\/projects\/[0-9]+\/?$/),
      firstExecLogLink.click(),
    ])

    await expect(page).toHaveURL(/\/projects\/[0-9]+\/?$/)
    await expect(page.getByRole('heading', { name: /overview/i })).toBeVisible()

    // Back navigation
    await Promise.all([
      page.waitForURL(/\/projects\/?$/),
      page.getByRole('link', { name: /back to archive/i }).click(),
    ])
    await expect(page).toHaveURL(/\/projects\/?$/)
  })

  test('featured projects on home deep-link into a project', async ({ page }) => {
    await page.goto('/')

    // Scroll down until the featured projects heading is visible
    await page.getByRole('heading', { name: /select projects/i }).scrollIntoViewIfNeeded()

    const inspectLink = page.getByRole('link', { name: /inspect_module/i }).first()
    await expect(inspectLink).toBeVisible()
    await Promise.all([
      page.waitForURL(/\/projects\/[0-9]+\/?$/),
      inspectLink.click(),
    ])

    await expect(page).toHaveURL(/\/projects\/[0-9]+\/?$/)
    await expect(page.getByRole('heading', { name: /overview/i })).toBeVisible()
  })
})


