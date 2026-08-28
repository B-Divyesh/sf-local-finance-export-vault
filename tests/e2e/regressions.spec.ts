import { test, expect } from '@playwright/test';

const csv = (name: string, amount: number) => ({
  name,
  mimeType: 'text/csv',
  buffer: Buffer.from(`Date,Payee,Amount\n2026-08-01,Private Clinic,${amount}`)
});

test('keeps the complete first action and three facts above the fold', async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const action = await page.getByRole('link', { name: 'Try it with sample data' }).boundingBox();
    const facts = await page.locator('.plain-facts').boundingBox();
    expect(action).not.toBeNull();
    expect(facts).not.toBeNull();
    expect(action!.y + action!.height).toBeLessThanOrEqual(viewport.height);
    expect(facts!.y + facts!.height).toBeLessThanOrEqual(viewport.height);
  }
});

test('treats the documented query alias as the isolated demo route', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByLabel('Demo mode')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Review two sample budget exports' })).toBeVisible();
});

test('does not grant import capacity while a new license is unverified', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/local-finance-export-vault/verify?license=*', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'invalid' }) });
  });
  await page.goto('/vault');
  await page.getByLabel('Have a license? Paste it here.').fill('invalid-fixture-license');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('Checking this license…')).toBeVisible();
  await page.locator('#csv-files').setInputFiles([csv('one.csv', 1), csv('two.csv', 2), csv('three.csv', 3)]);
  await expect(page.locator('.draft-card')).toHaveCount(2);
  await expect(page.getByText('This license is no longer active.')).toBeVisible();
  await page.getByRole('button', { name: 'Seal archive' }).first().click();
  await page.getByRole('button', { name: 'Seal archive' }).first().click();
  await expect(page.getByText('2 sealed archives')).toBeVisible();
  await expect(page.getByText('3 sealed archives')).toHaveCount(0);
});

test('restores useful keyboard focus after import and seal rerenders', async ({ page }) => {
  await page.goto('/vault');
  await page.locator('#csv-files').setInputFiles(csv('focus.csv', 5));
  await expect(page.getByRole('heading', { name: 'focus.csv' })).toBeFocused();
  await page.getByRole('button', { name: 'Seal archive' }).click();
  await expect(page.getByRole('heading', { name: 'focus.csv' })).toBeFocused();
});

test('mobile navigation, demo controls, and footer links have 44px targets', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  const targets = [
    page.getByRole('link', { name: 'Local Finance Export Vault home' }),
    page.getByRole('link', { name: 'Demo' }).first(),
    page.getByRole('link', { name: 'Vault' }).first(),
    page.getByRole('link', { name: 'Privacy' }).first(),
    page.getByRole('button', { name: 'Reset demo' }),
    page.getByRole('link', { name: 'Start for real' }),
    page.getByRole('link', { name: 'Terms' }),
    page.getByLabel('Include household-ynab.csv in packet'),
    page.getByLabel('Encrypt with a password')
  ];
  for (const target of targets) {
    const box = await target.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});

test('footer uses the valid Sociobot hostname', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /Built by Param Factory/ })).toHaveAttribute('href', 'https://sociobot.in');
});
