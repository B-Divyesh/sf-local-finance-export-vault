import { test, expect } from '@playwright/test';
import { strFromU8, unzipSync } from 'fflate';

test('@claim:demo-two-exports loads two mapped sample exports', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'Review two sample budget exports' })).toBeVisible();
  await expect(page.locator('.archive-card')).toHaveCount(2);
  await expect(page.getByText('household-ynab.csv', { exact: true })).toBeVisible();
  await expect(page.getByText('travel-monarch.csv', { exact: true })).toBeVisible();
});

test('@claim:local-only sends no financial rows away', async ({ page }) => {
  const outside: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== 'http://127.0.0.1:4173') outside.push(request.url());
  });
  await page.goto('/demo');
  await page.getByText('Inspect manifest and field map').first().click();
  await expect(page.getByText('North Market')).toBeVisible();
  expect(outside).toEqual([]);
  const databases = await page.evaluate(async () => (await indexedDB.databases()).map((db) => db.name));
  expect(databases).not.toContain('local-finance-export-vault');
});

test('@claim:packet-contents downloads a complete migration packet', async ({ page }) => {
  await page.goto('/demo');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download migration packet' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const files = unzipSync(new Uint8Array(Buffer.concat(chunks)));
  expect(Object.keys(files)).toEqual(expect.arrayContaining([
    'manifest.json', 'mapping-report.md', 'normalized-transactions.csv', 'README.txt'
  ]));
  const manifest = JSON.parse(strFromU8(files['manifest.json']));
  expect(manifest.archives).toHaveLength(2);
  expect(strFromU8(files['mapping-report.md'])).toContain('YNAB CSV');
});

test('@claim:hash-manifest records two SHA-256 hashes per archive', async ({ page }) => {
  await page.goto('/demo');
  await page.getByText('Inspect manifest and field map').first().click();
  const hashes = await page.locator('.archive-card').first().locator('code').allTextContents();
  expect(hashes).toHaveLength(2);
  for (const hash of hashes) expect(hash).toMatch(/^[a-f0-9]{64}$/);
});

test('@claim:encrypted-packet encrypts a packet with a password', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel('Encrypt with a password').check();
  await page.getByLabel('Archive password').fill('correct horse battery staple');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download migration packet' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('finance-migration-packet.vault');
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const encrypted = Buffer.concat(chunks);
  const envelope = JSON.parse(encrypted.toString('utf8'));
  expect(envelope.cipher).toBe('AES-256-GCM');
  expect(envelope.keyDerivation).toBe('PBKDF2-SHA256-250000');
  expect(envelope.data).not.toContain('North Market');
  await page.getByText('Open an encrypted packet').click();
  await page.locator('#encrypted-file').setInputFiles({ name: 'packet.vault', mimeType: 'application/octet-stream', buffer: encrypted });
  await page.getByLabel('Packet password').fill('correct horse battery staple');
  const decryptedPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Decrypt to ZIP' }).click();
  const decrypted = await decryptedPromise;
  expect(decrypted.suggestedFilename()).toBe('decrypted-finance-migration-packet.zip');
});

test('@claim:validation flags invalid and duplicate rows', async ({ page }) => {
  await page.goto('/vault');
  await page.locator('#csv-files').setInputFiles({
    name: 'needs-review.csv', mimeType: 'text/csv',
    buffer: Buffer.from('Date,Payee,Category,Account,Amount\nnot-a-date,Shop,Food,Card,-10\nnot-a-date,Shop,Food,Card,-10')
  });
  await page.getByRole('button', { name: 'Seal archive' }).click();
  await page.getByText('Inspect manifest and field map').click();
  await expect(page.getByText('2 rows need a valid date or amount.')).toBeVisible();
  await expect(page.getByText('1 possible duplicate row found.')).toBeVisible();
});

test('@claim:common-imports imports an Actual-shaped CSV', async ({ page }) => {
  await page.goto('/vault');
  await page.locator('#csv-files').setInputFiles({
    name: 'actual-export.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('Date,Account,Payee,Notes,Category,Amount,Cleared\n2026-08-01,Main,Corner Shop,Food,Groceries,-12.40,Cleared')
  });
  await expect(page.getByText('Actual CSV · 1 rows')).toBeVisible();
  await page.getByRole('button', { name: 'Seal archive' }).click();
  await expect(page.getByText('actual-export.csv', { exact: true })).toBeVisible();
  await expect(page.getByText('Actual CSV · 1 rows · schema 1.0.0')).toBeVisible();
});

test('@claim:browser-persistence keeps a sealed archive after reload', async ({ page }) => {
  await page.goto('/vault');
  await page.locator('#csv-files').setInputFiles({
    name: 'persistent.csv', mimeType: 'text/csv',
    buffer: Buffer.from('Date,Payee,Category,Account,Amount\n2026-08-02,Train,Travel,Card,-20')
  });
  await page.getByRole('button', { name: 'Seal archive' }).click();
  await page.reload();
  await expect(page.getByText('persistent.csv', { exact: true })).toBeVisible();
});

test('@claim:free-tier limits free storage to two archives and shows the paid route', async ({ page }) => {
  await page.goto('/vault');
  await page.locator('#csv-files').setInputFiles([
    { name: 'one.csv', mimeType: 'text/csv', buffer: Buffer.from('Date,Amount\n2026-01-01,1') },
    { name: 'two.csv', mimeType: 'text/csv', buffer: Buffer.from('Date,Amount\n2026-01-02,2') }
  ]);
  await expect(page.getByText('Free limit reached')).toBeVisible();
  const buy = page.getByRole('link', { name: 'Buy unlimited archives' });
  await expect(buy).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/local-finance-export-vault/checkout');
  await expect(page.getByText('$12')).toBeVisible();
});

test('@claim:offline-reload reloads the demo without a network', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Review two sample budget exports' })).toBeVisible();
  await expect(page.getByText('Offline — ready')).toBeVisible();
});
