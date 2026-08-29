import { test, expect } from '@playwright/test';
import { strFromU8, unzipSync } from 'fflate';

const appBaseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4173';
const appOrigin = new URL(appBaseURL).origin;

test('@claim:demo-two-exports loads two mapped sample exports in one click', async ({ page }) => {
  await page.goto('/');
  const demoLink = page.getByRole('link', { name: 'Try it with sample data' });
  await expect(demoLink).toHaveAttribute('href', '/?demo=1');
  await demoLink.click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByLabel('Demo mode')).toContainText('Demo — sample data, nothing is saved');
  await expect(page.getByRole('heading', { name: 'Review two sample budget exports' })).toBeVisible();
  await expect(page.locator('.archive-card')).toHaveCount(2);
  await expect(page.getByText('household-ynab.csv', { exact: true })).toBeVisible();
  await expect(page.getByText('travel-monarch.csv', { exact: true })).toBeVisible();
  await page.locator('input[name="archive"]').first().uncheck();
  await expect(page.locator('input[name="archive"]:checked')).toHaveCount(1);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('input[name="archive"]:checked')).toHaveCount(2);
});

test('@claim:local-only sends no financial rows away', async ({ page }) => {
  const outside: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== appOrigin) outside.push(request.url());
  });
  await page.goto('/demo');
  await page.getByText('Inspect archive details and field matches').first().click();
  await expect(page.getByText('North Market')).toBeVisible();
  expect(outside).toEqual([]);
  const databases = await page.evaluate(async () => (await indexedDB.databases()).map((db) => db.name));
  expect(databases).not.toContain('local-finance-export-vault');
});

test('@claim:license-privacy sends only a license token to the billing API', async ({ page }) => {
  const outside: Array<{ url: string; body: string | null }> = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== appOrigin) outside.push({ url: request.url(), body: request.postData() });
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

test('@claim:packet-contents downloads a migration packet with its named contents', async ({ page }) => {
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
  await page.getByText('Inspect archive details and field matches').first().click();
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
  const independentlyDecrypted = await page.evaluate(async ({ encryptedEnvelope, password }) => {
    const bytes = (value: string) => Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
    const material = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: bytes(encryptedEnvelope.salt),
        iterations: 250_000,
        hash: 'SHA-256'
      },
      material,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    const clear = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: bytes(encryptedEnvelope.iv) },
      key,
      bytes(encryptedEnvelope.data)
    );
    return Array.from(new Uint8Array(clear));
  }, { encryptedEnvelope: envelope, password: 'correct horse battery staple' });
  const independentlyOpenedFiles = unzipSync(new Uint8Array(independentlyDecrypted));
  expect(Object.keys(independentlyOpenedFiles)).toContain('manifest.json');
  expect(strFromU8(independentlyOpenedFiles['normalized-transactions.csv'])).toContain('North Market');
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
  await page.getByText('Inspect archive details and field matches').click();
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

test('@claim:field-review saves a changed field map', async ({ page }) => {
  await page.goto('/vault');
  await page.locator('#csv-files').setInputFiles({
    name: 'mapped.csv', mimeType: 'text/csv',
    buffer: Buffer.from('Date,Store,Group,Amount\n2026-08-01,Corner Shop,Groceries,-12.40')
  });
  await page.locator('select[data-field="category"]').selectOption('Group');
  await page.getByRole('button', { name: 'Seal archive' }).click();
  await page.getByText('Inspect archive details and field matches').click();
  await expect(page.getByRole('row', { name: /category Group/i })).toBeVisible();
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
  await page.goto('/');
  await expect(page.getByText('Free for two archives. $12 once for unlimited archives.')).toBeVisible();
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

test('@claim:demo-isolation keeps samples in memory and never reads or writes real vault data', async ({ page, browser }) => {
  const directDemo = await browser.newContext({ baseURL: appBaseURL });
  const directPage = await directDemo.newPage();
  await directPage.goto('/demo');
  const demoDatabases = await directPage.evaluate(async () => (await indexedDB.databases()).map((database) => database.name));
  expect(demoDatabases).not.toContain('local-finance-export-vault');
  await directDemo.close();

  await page.goto('/vault');
  await page.locator('#csv-files').setInputFiles({
    name: 'private-medical-budget.csv', mimeType: 'text/csv',
    buffer: Buffer.from('Date,Payee,Amount\n2026-08-01,Private Clinic,-150')
  });
  await page.getByRole('button', { name: 'Seal archive' }).click();
  await page.getByRole('link', { name: 'Demo' }).click();
  await expect(page.getByText('household-ynab.csv', { exact: true })).toBeVisible();
  await expect(page.getByText('private-medical-budget.csv', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Open my vault' })).toBeVisible();
  await page.getByRole('link', { name: 'Open my vault' }).click();
  await expect(page.getByText('private-medical-budget.csv', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Demo' }).click();
  await expect(page.getByText('private-medical-budget.csv', { exact: true })).toHaveCount(0);
  await expect(page.locator('.archive-card')).toHaveCount(2);
});

test('@claim:archive-removal removes a saved archive from browser storage', async ({ page }) => {
  await page.goto('/vault');
  await page.locator('#csv-files').setInputFiles({
    name: 'remove-me.csv', mimeType: 'text/csv',
    buffer: Buffer.from('Date,Payee,Amount\n2026-08-01,Corner Shop,-12.40')
  });
  await page.getByRole('button', { name: 'Seal archive' }).click();
  await page.getByText('Inspect archive details and field matches').click();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Remove this archive' }).click();
  await expect(page.getByText('remove-me.csv', { exact: true })).toHaveCount(0);
  await page.reload();
  await expect(page.getByText('remove-me.csv', { exact: true })).toHaveCount(0);
  const storedArchives = await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('local-finance-export-vault');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return await new Promise<unknown[]>((resolve, reject) => {
      const request = database.transaction('archives').objectStore('archives').getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  });
  expect(storedArchives).toEqual([]);
});

test('@claim:password-recovery stores no encryption password or recovery path', async ({ page }) => {
  const packetPassword = 'packet-only-Secret-48291';
  const archivePassword = 'archive-only-Secret-73510';
  const requests: Array<{ url: string; body: string | null }> = [];
  page.on('request', (request) => requests.push({ url: request.url(), body: request.postData() }));

  await page.goto('/demo');
  await page.getByLabel('Encrypt with a password').check();
  await page.getByLabel('Archive password').fill(packetPassword);
  await expect(page.locator('#password-help')).toContainText('password cannot be recovered');
  const encryptedDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download migration packet' }).click();
  const packet = await encryptedDownload;
  const packetStream = await packet.createReadStream();
  const packetChunks: Buffer[] = [];
  for await (const chunk of packetStream) packetChunks.push(Buffer.from(chunk));
  expect(Buffer.concat(packetChunks).toString('utf8')).not.toContain(packetPassword);

  await page.goto('/vault');
  await page.locator('#csv-files').setInputFiles({
    name: 'password-private.csv', mimeType: 'text/csv',
    buffer: Buffer.from('Date,Payee,Amount\n2026-08-01,Private Clinic,-150')
  });
  await page.getByLabel('Encrypt this saved archive').check();
  await page.getByLabel('Local archive password').fill(archivePassword);
  await expect(page.locator('[id^="local-password-help-"]')).toContainText('cannot be recovered');
  await page.getByRole('button', { name: 'Seal archive' }).click();
  await expect(page.getByText('password-private.csv', { exact: true })).toBeVisible();
  await expect(page.getByText(/encrypted on this device/)).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Encrypted saved archive' })).toBeVisible();

  const browserStorage = await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('local-finance-export-vault');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const indexedDbRecords = await new Promise<unknown[]>((resolve, reject) => {
      const request = database.transaction('archives').objectStore('archives').getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return {
      indexedDbRecords,
      localStorage: { ...localStorage },
      sessionStorage: { ...sessionStorage },
      cookies: document.cookie
    };
  });
  const retainedData = JSON.stringify({ browserStorage, requests });
  expect(retainedData).not.toContain(packetPassword);
  expect(retainedData).not.toContain(archivePassword);
  const recoveryActions = await page.locator('a, button').allTextContents();
  expect(recoveryActions.join(' ')).not.toMatch(/recover password|reset password|forgot password/i);
});

test('@claim:scope-limits keeps originals unchanged and makes no external request', async ({ page }) => {
  const outside: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== appOrigin) outside.push(request.url());
  });
  const original = 'Date,Payee,Amount\n2026-08-01,North Market,-42.10\n';
  await page.goto('/vault');
  await page.locator('#csv-files').setInputFiles({ name: 'original.csv', mimeType: 'text/csv', buffer: Buffer.from(original) });
  await page.getByRole('button', { name: 'Seal archive' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download migration packet' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const files = unzipSync(new Uint8Array(Buffer.concat(chunks)));
  const originalName = Object.keys(files).find((name) => name.endsWith('-original.csv'));
  expect(originalName).toBeDefined();
  expect(strFromU8(files[originalName!])).toBe(original);
  expect(outside).toEqual([]);
});

test('@claim:billing-checkout opens the reachable Sociobot hosted checkout', async ({ page, request }) => {
  await page.goto('/');
  const buy = page.getByRole('link', { name: 'Buy unlimited archives' });
  const checkout = 'https://api.sociobot.in/api/v1/products/local-finance-export-vault/checkout';
  await expect(buy).toHaveAttribute('href', checkout);
  await expect(page.getByText('$12 one-time purchase')).toBeVisible();
  await expect(page.getByText("Payment opens in Sociobot's hosted checkout.")).toBeVisible();
  const redirect = await request.get(checkout, { maxRedirects: 0 });
  expect(redirect.status()).toBe(303);
  const destination = new URL(redirect.headers().location, checkout);
  expect(destination.protocol).toBe('https:');
  expect(destination.hostname).toBe('checkout.dodopayments.com');
  const hosted = await request.get(destination.toString());
  expect(hosted.status()).toBeGreaterThanOrEqual(200);
  expect(hosted.status()).toBeLessThan(400);
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
