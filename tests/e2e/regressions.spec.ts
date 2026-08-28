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

test('every visible mobile control has a 44px target on every route', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/demo', '/vault', '/privacy', '/terms']) {
    await page.goto(route);
    const misses = await page.locator('a, button, input, select, summary').evaluateAll((elements) => elements.flatMap((element) => {
      const node = element as HTMLElement;
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      const hidden = style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0 || rect.width === 0 || rect.height === 0;
      if (hidden) return [];
      return rect.width + 0.01 < 44 || rect.height + 0.01 < 44
        ? [`${node.tagName.toLowerCase()} ${node.getAttribute('href') ?? node.textContent?.trim() ?? node.id}: ${rect.width.toFixed(2)}×${rect.height.toFixed(2)}`]
        : [];
    }));
    expect(misses, `${route} has undersized targets`).toEqual([]);
  }
});

test('Back and Forward restore route scroll and focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const privacyLink = page.locator('[data-history-focus="footer-privacy"]');
  await privacyLink.scrollIntoViewIfNeeded();
  await privacyLink.focus();
  const homeScroll = await page.evaluate(() => scrollY);
  expect(homeScroll).toBeGreaterThan(1000);
  await privacyLink.click();
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.locator('#privacy-title')).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(privacyLink).toBeFocused();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(homeScroll);
  await page.goForward();
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.locator('#privacy-title')).toBeFocused();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
});

test('footer uses the valid Sociobot hostname', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /Built by Param Factory/ })).toHaveAttribute('href', 'https://sociobot.in');
});
