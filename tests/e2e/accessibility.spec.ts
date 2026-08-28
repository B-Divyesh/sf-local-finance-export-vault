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

test('supports keyboard-only import, encryption, and locked archive access at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/vault');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();

  await page.locator('#csv-files').setInputFiles({
    name: 'keyboard.csv', mimeType: 'text/csv', buffer: Buffer.from('Date,Payee,Amount\n2026-08-01,Train,-20')
  });
  await page.getByLabel('Encrypt this saved archive').check();
  await page.getByLabel('Local archive password').fill('keyboard password');
  await page.getByRole('button', { name: 'Seal archive' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'keyboard.csv' })).toBeFocused();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Encrypted saved archive' })).toBeVisible();
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
