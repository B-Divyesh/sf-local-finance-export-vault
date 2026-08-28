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

test('@claim:license-privacy sends only a license token to the billing API', async ({ page }) => {
  const outside: Array<{ url: string; body: string | null }> = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') outside.push({ url: request.url(), body: request.postData() });
  });
  await page.route('https://api.sociobot.in/api/v1/products/local-finance-export-vault/verify?license=*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'invalid' }) });
  });
  await page.goto('/vault');
  await page.locator('#csv-files').setInputFiles({
    name: 'private.csv', mimeType: 'text/csv', buffer: Buffer.from('Date,Payee,Amount\n2026-08-01,Private Clinic,-150')
  });
  await page.getByRole('button', { name: 'Seal archive' }).click();
  await page.getByLabel('Have a license? Paste it here.').fill('privacy-fixture-license');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('This license is no longer active.')).toBeVisible();
  expect(outside).toHaveLength(1);
  expect(outside[0].url).toContain('/verify?license=privacy-fixture-license');
  expect(JSON.stringify(outside)).not.toContain('Private Clinic');
  expect(outside[0].body).toBeNull();
  const thirdPartyScripts = await page.locator('script[src]').evaluateAll((scripts) => scripts.map((script) => (script as HTMLScriptElement).src).filter((src) => new URL(src).origin !== location.origin));
  expect(thirdPartyScripts).toEqual([]);
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
  const originals = Object.keys(files).filter((name) => name.startsWith('originals/'));
  expect(originals).toHaveLength(2);
  expect(strFromU8(files[originals[0]])).toContain('Date');
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

test('@claim:common-imports imports YNAB, Monarch, Actual, and generic CSV shapes', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('YNAB CSV · 4 rows · schema 1.0.0')).toBeVisible();
  await expect(page.getByText('Monarch CSV · 4 rows · schema 1.0.0')).toBeVisible();
  await page.goto('/vault');
  await page.locator('#csv-files').setInputFiles([
    {
      name: 'actual-export.csv', mimeType: 'text/csv',
      buffer: Buffer.from('Date,Account,Payee,Notes,Category,Amount,Cleared\n2026-08-01,Main,Corner Shop,Food,Groceries,-12.40,Cleared')
    },
    {
      name: 'generic-export.csv', mimeType: 'text/csv',
      buffer: Buffer.from('Transaction Date,Description,Value\n2026-08-02,Bus,-3.25')
    }
  ]);
  await expect(page.getByText('Actual CSV · 1 rows')).toBeVisible();
  await expect(page.getByText('Generic budget CSV · 1 rows')).toBeVisible();
  await page.getByRole('button', { name: 'Seal archive' }).first().click();
  await page.getByRole('button', { name: 'Seal archive' }).first().click();
  await expect(page.getByText('actual-export.csv', { exact: true })).toBeVisible();
  await expect(page.getByText('generic-export.csv', { exact: true })).toBeVisible();
  await expect(page.getByText('Actual CSV · 1 rows · schema 1.0.0')).toBeVisible();
  await expect(page.getByText('Generic budget CSV · 1 rows · schema 1.0.0')).toBeVisible();
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
  await expect(page.locator('.draft-card')).toHaveCount(2);
  await page.getByRole('button', { name: 'Seal archive' }).first().click();
  await page.getByRole('button', { name: 'Seal archive' }).first().click();
  await expect(page.locator('#csv-files')).toBeDisabled();
  const buy = page.getByRole('link', { name: 'Buy unlimited archives' });
  await expect(buy).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/local-finance-export-vault/checkout');
  await expect(page.getByText('$12')).toBeVisible();

  await page.route('https://api.sociobot.in/api/v1/products/local-finance-export-vault/verify?license=*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok' }) });
  });
  await page.getByLabel('Have a license? Paste it here.').fill('valid-fixture-license');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('Unlimited archives are active.')).toBeVisible();
  await expect(page.locator('#csv-files')).toBeEnabled();
  await page.locator('#csv-files').setInputFiles({
    name: 'three.csv', mimeType: 'text/csv', buffer: Buffer.from('Date,Amount\n2026-01-03,3')
  });
  await page.getByRole('button', { name: 'Seal archive' }).click();
  await expect(page.getByText('3 sealed archives')).toBeVisible();
});

test('@claim:demo-isolation never reads or writes real vault data', async ({ page }) => {
  await page.goto('/vault');
  await page.locator('#csv-files').setInputFiles({
    name: 'private-medical-budget.csv', mimeType: 'text/csv',
    buffer: Buffer.from('Date,Payee,Amount\n2026-08-01,Private Clinic,-150')
  });
  await page.getByRole('button', { name: 'Seal archive' }).click();
  await page.getByRole('link', { name: 'Demo' }).click();
  await expect(page.getByText('household-ynab.csv', { exact: true })).toBeVisible();
  await expect(page.getByText('private-medical-budget.csv', { exact: true })).toHaveCount(0);
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page.getByText('private-medical-budget.csv', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Demo' }).click();
  await expect(page.getByText('private-medical-budget.csv', { exact: true })).toHaveCount(0);
  await expect(page.locator('.archive-card')).toHaveCount(2);
});

test('@claim:encrypted-local stores ciphertext and reopens only with its password', async ({ page }) => {
  await page.goto('/vault');
  await page.locator('#csv-files').setInputFiles({
    name: 'private-medical-budget.csv', mimeType: 'text/csv',
    buffer: Buffer.from('Date,Payee,Amount\n2026-08-01,Private Clinic,-150')
  });
  await page.getByLabel('Encrypt this saved archive').check();
  await page.getByLabel('Local archive password').fill('correct horse battery staple');
  await page.getByRole('button', { name: 'Seal archive' }).click();
  await expect(page.getByText('private-medical-budget.csv', { exact: true })).toBeVisible();
  await expect(page.getByText(/encrypted on this device/)).toBeVisible();
  const stored = await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('local-finance-export-vault');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return await new Promise<unknown>((resolve, reject) => {
      const request = db.transaction('archives').objectStore('archives').getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  });
  const raw = JSON.stringify(stored);
  expect(raw).not.toContain('Private Clinic');
  expect(raw).not.toContain('private-medical-budget.csv');
  expect(raw).toContain('AES-256-GCM');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Encrypted saved archive' })).toBeVisible();
  await page.getByLabel('Local archive password').fill('wrong password');
  await page.getByRole('button', { name: 'Open saved archive' }).click();
  await expect(page.getByText('That password did not open this saved archive.')).toBeVisible();
  await page.getByLabel('Local archive password').fill('correct horse battery staple');
  await page.getByRole('button', { name: 'Open saved archive' }).click();
  await expect(page.getByText('private-medical-budget.csv', { exact: true })).toBeVisible();
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
