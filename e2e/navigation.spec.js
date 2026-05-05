const { test, expect } = require('@playwright/test')

test.describe('Top-level navigation', () => {
  test('home renders hero content', async ({ page }) => {
    await page.goto('/')

    // There are multiple headings containing the name (hero + footer), so scope to the main content.
    await expect(
      page.locator('main').getByRole('heading', { name: /vinay siddha/i }).first()
    ).toBeVisible()

    // Navbar brand should always be visible
    await expect(page.getByRole('link', { name: /vinay siddha/i })).toBeVisible()
  })

  test('navbar links navigate to core pages', async ({ page }) => {
    await page.goto('/')

    const cases = [
      { name: 'About', href: '/about', heading: /engineering/i },
      { name: 'Experience', href: '/experience', heading: /experience/i },
      { name: 'Projects', href: '/projects', heading: /projects/i },
      { name: 'Skills', href: '/skills', heading: /the stack/i },
      { name: 'Social', href: '/social', heading: /connected/i },
      { name: 'Contact', href: '/contact', heading: /contact/i },
    ]

    for (const c of cases) {
      await Promise.all([
        page.waitForURL(new RegExp(`${c.href.replace('/', '\\/')}\/?$`)),
        page.getByRole('link', { name: c.name, exact: true }).click(),
      ])

      await expect(page).toHaveURL(new RegExp(`${c.href.replace('/', '\\/')}\/?$`))
      await expect(page.getByRole('heading', { name: c.heading })).toBeVisible()
    }
  })
})


