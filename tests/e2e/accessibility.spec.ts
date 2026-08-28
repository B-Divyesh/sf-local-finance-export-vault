import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const route of ['/', '/demo', '/privacy', '/terms']) {
  test(`has no serious accessibility issues on ${route}`, async ({ page }) => {
    if (route === '/demo') await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  });
}

test('routes update title and focus without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (exception) => errors.push(exception.message));
  await page.goto('/');
  await expect(page).toHaveTitle('Finance Export Vault — preserve budget exports');
  await page.getByRole('link', { name: 'Demo' }).first().click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.locator('h1')).toBeFocused();
  await page.goBack();
  await expect(page).toHaveTitle('Finance Export Vault — preserve budget exports');
  await page.goto('/missing-platform');
  await expect(page).toHaveTitle('Not found — Local Finance Export Vault');
  await expect(page.getByRole('link', { name: 'Return to the vault' })).toBeVisible();
  expect(errors).toEqual([]);
});
