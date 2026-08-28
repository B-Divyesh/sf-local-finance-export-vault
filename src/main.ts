import './styles.css';
import { makeDraft } from './csv';
import { acceptReturnedLicense, checkoutUrl, readLicenseState, restoreLicense, verifyLicense, type LicenseState } from './license';
import { decryptPacket, encryptPacket, listArchives, makePacket, removeArchive, sampleArchives, saveArchive, sealDraft, unlockArchive } from './vault';
import { isLockedArchive, neutralFields, SCHEMA_VERSION, type ArchiveDraft, type NeutralField, type VaultArchive, type VaultItem } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;
const routeStatus = document.querySelector<HTMLDivElement>('#route-status')!;
let archives: VaultItem[] = [];
let drafts: ArchiveDraft[] = [];
const encryptedThisSession = new Set<string>();
let busy = false;
let notice = '';
let error = '';
let online = navigator.onLine;
let updateWaiting: ServiceWorker | null = null;
let licenseState: LicenseState = { unlocked: false, checking: false, message: '' };

const routeTitles: Record<string, string> = {
  '/': 'Finance Export Vault — preserve budget exports',
  '/demo': 'Demo — Local Finance Export Vault',
  '/vault': 'Vault — Local Finance Export Vault',
  '/privacy': 'Privacy — Local Finance Export Vault',
  '/terms': 'Terms — Local Finance Export Vault',
  '/404': 'Not found — Local Finance Export Vault'
};
const routeDescriptions: Record<string, string> = {
  '/': 'Preserve budget exports, check their fields, and make a migration packet without uploading financial rows.',
  '/demo': 'Try two realistic budget exports in an isolated sample vault.',
  '/vault': 'Import budget CSV files and make a local migration packet.',
  '/privacy': 'Learn what Local Finance Export Vault stores and what stays on your device.',
  '/terms': 'Read the terms for Local Finance Export Vault and its one-time archive license.',
  '/404': 'This address does not lead to a Local Finance Export Vault page.'
};

void start();

async function start(): Promise<void> {
  if (location.pathname === '/' && new URLSearchParams(location.search).get('demo') === '1') {
    history.replaceState({}, '', '/demo');
  }
  acceptReturnedLicense();
  licenseState = readLicenseState();
  await loadRouteData();
  render();
  if (!isDemo()) {
    licenseState = await verifyLicense();
    render();
  }
  bindGlobalEvents();
  registerServiceWorker();
}

function isDemo(): boolean {
  return location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
}

async function loadRouteData(): Promise<void> {
  error = '';
  try {
    if (isDemo()) {
      archives = await sampleArchives();
    } else {
      archives = await listArchives();
    }
  } catch (cause) {
    error = messageOf(cause);
  }
}

function render(): void {
  const path = normalPath();
  updateMetadata(path);
  if (!['/', '/demo', '/vault', '/privacy', '/terms'].includes(path)) {
    app.innerHTML = shell(notFoundPage(), false);
  } else if (path === '/privacy') {
    app.innerHTML = shell(privacyPage(), false);
  } else if (path === '/terms') {
    app.innerHTML = shell(termsPage(), false);
  } else if (path === '/') {
    app.innerHTML = shell(homePage(), false);
  } else {
    app.innerHTML = shell(vaultPage(path === '/demo'), path === '/demo');
  }
  bindPageEvents();
}

function updateMetadata(path: string): void {
  const knownPath = routeTitles[path] ? path : '/404';
  const title = routeTitles[knownPath];
  const description = routeDescriptions[knownPath];
  document.title = title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', `https://local-finance-export-vault.sociobot.in${knownPath === '/404' ? '/' : knownPath}`);
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', title);
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', description);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute('content', title);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')?.setAttribute('content', description);
}

function shell(content: string, demo: boolean): string {
  return `
    ${demo ? demoBanner() : ''}
    <header class="site-header">
      <a class="wordmark" href="/" data-link aria-label="Local Finance Export Vault home">
        <svg aria-hidden="true" viewBox="0 0 44 44"><path d="M7 15h30v23H7zM12 15V9h20v6"/><circle cx="22" cy="27" r="7"/><path d="M22 20v14M15 27h14"/></svg>
        <span>Export<br>Vault</span>
      </a>
      <nav aria-label="Primary navigation">
        <a href="/demo" data-link ${normalPath() === '/demo' ? 'aria-current="page"' : ''}>Demo</a>
        <a href="/vault" data-link ${normalPath() === '/vault' ? 'aria-current="page"' : ''}>Vault</a>
        <a href="/privacy" data-link ${normalPath() === '/privacy' ? 'aria-current="page"' : ''}>Privacy</a>
      </nav>
      <span class="network-state ${online ? '' : 'offline'}" role="status">${online ? 'On device' : 'Offline — ready'}</span>
    </header>
    ${content}
    <footer class="site-footer">
      <p>Preserve budget exports on your device.</p>
      <nav aria-label="Footer navigation"><a href="/privacy" data-link>Privacy</a><a href="/terms" data-link>Terms</a><a href="https://sociobot.in" rel="external">Built by Param Factory <span class="sr-only">(external site)</span></a></nav>
      <p class="build">Version 1.0 · Schema ${SCHEMA_VERSION} · Hero art generated for this product.</p>
    </footer>
    ${updateWaiting ? '<div class="toast" role="status">A new version is ready. <button type="button" data-action="update">Update now</button></div>' : ''}
  `;
}

function demoBanner(): string {
  return `<aside class="demo-banner" aria-label="Demo mode"><strong>Demo — sample data, nothing is saved</strong><span><button type="button" data-action="reset-demo">Reset demo</button><a href="/vault" data-link>Open my empty vault</a></span></aside>`;
}

function homePage(): string {
  return `<main id="main" tabindex="-1">
    <section class="hero poster-section" aria-labelledby="home-title">
      <div class="hero-copy">
        <p class="eyebrow">A private transfer desk for your data</p>
        <h1 id="home-title" tabindex="-1">Preserve your budget exports before you switch</h1>
        <p class="lede">For people changing budget apps who need a checked archive they can understand later.</p>
        <div class="hero-action"><a class="button primary" href="/demo" data-link>Try it with sample data</a><span>Loads two realistic exports in a separate demo.</span></div>
        <ul class="plain-facts" aria-label="Product facts">
          <li><span aria-hidden="true">●</span> Runs offline after the first visit.</li>
          <li><span aria-hidden="true">●</span> Financial rows stay in this browser.</li>
          <li><span aria-hidden="true">●</span> Free for two archives. $12 once for unlimited archives.</li>
        </ul>
      </div>
      <figure class="hero-art">
        <img src="/art/vault-transfer.webp" width="1200" height="800" alt="An art-deco station vault receives document cases on three brass rails." fetchpriority="high" decoding="async">
        <figcaption>Original poster art: your exports travel to one neutral archive.</figcaption>
      </figure>
    </section>
    <section class="workspace-section" aria-labelledby="workspace-title">
      <div class="section-heading"><p class="platform-number">Platform 01</p><h2 id="workspace-title">Start your archive</h2><p>Choose a budget CSV. Review each archive field before you save it.</p></div>
      ${workspace()}
    </section>
    <section class="how-section" aria-labelledby="how-title">
      <div class="section-heading"><p class="platform-number">Route map</p><h2 id="how-title">How your files move</h2></div>
      <ol class="route-steps">
        <li><span>1</span><div><h3>Choose exports</h3><p>Add CSV files from YNAB, Monarch, Actual, or another budget tool.</p></div></li>
        <li><span>2</span><div><h3>Review the map</h3><p>Match each export column to the standard fields in your archive.</p></div></li>
        <li><span>3</span><div><h3>Make a packet</h3><p>Download original files, tamper-check codes, row checks, and standard rows together.</p></div></li>
      </ol>
    </section>
    <section class="limits-section" aria-labelledby="limits-title">
      <div><p class="platform-number">Scope</p><h2 id="limits-title">What the vault does not do</h2></div>
      <div class="limits-copy"><p>The vault does not connect to banks or change your original files.</p><p>Use it to document portability, not to certify accounting or tax work.</p></div>
    </section>
    ${paidSection()}
  </main>`;
}

function vaultPage(demo: boolean): string {
  return `<main id="main" class="vault-page" tabindex="-1">
    <section class="vault-intro">
      <p class="eyebrow">${demo ? 'Sample transfer desk' : 'Your local transfer desk'}</p>
      <h1 tabindex="-1">${demo ? 'Review two sample budget exports' : 'Build your private migration packet'}</h1>
      <p>${demo ? 'Inspect both mappings, then download a sample packet. The demo never reads or saves your files.' : 'Import exports, review their meaning, and keep a portable record.'}</p>
    </section>
    <h2 class="sr-only">Archive workspace</h2>
    ${workspace()}
    ${demo ? '' : paidSection()}
  </main>`;
}

function workspace(): string {
  const limitReached = !licenseState.unlocked && archives.length + drafts.length >= 2 && !isDemo();
  return `<div class="workspace">
    <div class="workspace-toolbar">
      <div>
        <p class="toolbar-title">${archives.length ? `${archives.length} sealed archive${archives.length === 1 ? '' : 's'}` : 'No sealed archives yet'}</p>
        <p class="toolbar-note">${archives.length ? 'Select archives for one migration packet.' : 'Your checked exports will appear here.'}</p>
      </div>
      ${isDemo() ? '' : `<label class="button ${limitReached ? 'disabled' : 'primary'}" for="csv-files">${limitReached ? 'Free limit reached' : 'Choose CSV files'}</label><input id="csv-files" type="file" accept=".csv,text/csv" multiple ${limitReached ? 'disabled' : ''}>`}
    </div>
    ${statusMessages()}
    ${drafts.map(draftCard).join('')}
    ${archives.length ? archiveList() : emptyState()}
    ${archives.some((archive) => !isLockedArchive(archive)) ? packetMaker() : ''}
  </div>`;
}

function statusMessages(): string {
  return `<div class="messages" aria-live="polite">${error ? `<p class="message error"><strong>Could not finish that step.</strong> ${escapeHtml(error)}</p>` : ''}${notice ? `<p class="message success">${escapeHtml(notice)}</p>` : ''}${busy ? '<p class="message working">Checking the files…</p>' : ''}</div>`;
}

function emptyState(): string {
  return `<div class="empty-state"><svg viewBox="0 0 120 80" aria-hidden="true"><path d="M12 29h96v42H12zM25 29V15h70v14"/><path d="M44 43h32M44 54h32"/></svg><h3>Your archive desk is empty</h3><p>Choose a CSV to start its field review.</p></div>`;
}

function draftCard(draft: ArchiveDraft, index: number): string {
  const hasFlow = draft.parsed.headers.some((header) => header.toLowerCase() === 'outflow') && draft.parsed.headers.some((header) => header.toLowerCase() === 'inflow');
  return `<section class="draft-card" aria-labelledby="draft-${index}">
    <div class="ticket-heading"><span>Review</span><div><h3 id="draft-${index}" tabindex="-1">${escapeHtml(draft.name)}</h3><p>${escapeHtml(draft.source)} · ${draft.parsed.rows.length} rows · ${draft.bytes.toLocaleString()} bytes</p></div></div>
    <p>Check what each original field means. Date and amount are required.</p>
    <div class="mapping-grid">
      ${neutralFields.map((field) => `<label><span>${field}${field === 'date' || field === 'amount' ? ' *' : ''}</span><select data-draft="${index}" data-field="${field}"><option value="">Not mapped</option>${field === 'amount' && hasFlow ? `<option value="__flow__" ${draft.mapping[field] === '__flow__' ? 'selected' : ''}>Inflow minus outflow</option>` : ''}${draft.parsed.headers.map((header) => `<option value="${escapeAttr(header)}" ${draft.mapping[field] === header ? 'selected' : ''}>${escapeHtml(header)}</option>`).join('')}</select></label>`).join('')}
    </div>
    <div class="local-encryption">
      <label class="toggle"><input type="checkbox" data-local-encrypt="${index}"><span>Encrypt this saved archive</span></label>
      <div data-local-password-field="${index}" hidden><label for="local-password-${index}">Local archive password</label><input id="local-password-${index}" data-local-password="${index}" type="password" minlength="8" autocomplete="new-password" aria-describedby="local-password-help-${index}"><small id="local-password-help-${index}">You will enter this password after a reload. It cannot be recovered.</small></div>
    </div>
    <div class="card-actions"><button class="button primary" type="button" data-action="seal" data-index="${index}">Seal archive</button><button class="button secondary" type="button" data-action="discard-draft" data-index="${index}">Discard file</button></div>
  </section>`;
}

function archiveList(): string {
  return `<div class="archive-list"><div class="rail-label"><span>Sealed</span><span>SHA-256 manifests</span></div>${archives.map((archive, index) => isLockedArchive(archive) ? lockedArchiveCard(archive, index) : archiveCard(archive, index)).join('')}</div>`;
}

function archiveCard(archive: VaultArchive, index: number): string {
  const validation = archive.manifest.validation;
  const valid = validation.invalidRows === 0;
  return `<article class="archive-card" data-archive-id="${escapeAttr(archive.id)}">
    <div class="archive-summary">
      <label class="packet-check"><input type="checkbox" name="archive" value="${escapeAttr(archive.id)}" checked><span class="sr-only">Include ${escapeHtml(archive.name)} in packet</span></label>
      <span class="archive-index">${String(index + 1).padStart(2, '0')}</span>
      <div><h3 tabindex="-1">${escapeHtml(archive.name)}</h3><p>${escapeHtml(archive.manifest.sourceProfile)} · ${archive.rows.length} rows · schema ${archive.manifest.schemaVersion}${encryptedThisSession.has(archive.id) ? ' · encrypted on this device' : ''}</p></div>
      <span class="stamp ${valid ? 'valid' : 'warning'}">${valid ? 'Checked' : `${validation.invalidRows} to review`}</span>
    </div>
    <details>
      <summary>Inspect manifest and field map</summary>
      <div class="manifest-grid">
        <div><h4>Integrity</h4><dl><dt>Original SHA-256</dt><dd><code>${archive.manifest.originalFile.sha256}</code></dd><dt>Neutral SHA-256</dt><dd><code>${archive.manifest.normalized.sha256}</code></dd><dt>Created</dt><dd>${formatDate(archive.createdAt)}</dd></dl></div>
        <div><h4>Validation</h4><ul>${validation.notices.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>
      </div>
      <div class="table-wrap"><table><caption>Field mapping for ${escapeHtml(archive.name)}</caption><thead><tr><th scope="col">Neutral field</th><th scope="col">Original field</th></tr></thead><tbody>${neutralFields.map((field) => `<tr><th scope="row">${field}</th><td>${escapeHtml(archive.manifest.mapping[field] === '__flow__' ? 'Inflow minus outflow' : archive.manifest.mapping[field] || 'Not mapped')}</td></tr>`).join('')}</tbody></table></div>
      <div class="table-wrap"><table class="row-preview"><caption>First ${Math.min(5, archive.rows.length)} neutral rows from ${escapeHtml(archive.name)}</caption><thead><tr><th scope="col">Date</th><th scope="col">Payee</th><th scope="col">Category</th><th scope="col">Account</th><th scope="col">Amount</th></tr></thead><tbody>${archive.rows.slice(0, 5).map((row) => `<tr><td>${escapeHtml(row.date)}</td><td>${escapeHtml(row.payee || '—')}</td><td>${escapeHtml(row.category || '—')}</td><td>${escapeHtml(row.account || '—')}</td><td class="amount">${escapeHtml(row.amount)}</td></tr>`).join('')}</tbody></table></div>
      ${isDemo() ? '' : `<button class="text-button danger" type="button" data-action="remove" data-id="${escapeAttr(archive.id)}" data-name="${escapeAttr(archive.name)}">Remove this archive</button>`}
    </details>
  </article>`;
}

function lockedArchiveCard(archive: Extract<VaultItem, { locked: true }>, index: number): string {
  return `<article class="archive-card locked-card" data-archive-id="${escapeAttr(archive.id)}">
    <div class="archive-summary">
      <span class="lock-mark" aria-hidden="true">◆</span>
      <span class="archive-index">${String(index + 1).padStart(2, '0')}</span>
      <div><h3 tabindex="-1">Encrypted saved archive</h3><p>Sealed ${formatDate(archive.createdAt)} · password required</p></div>
      <span class="stamp valid">Encrypted</span>
    </div>
    <form class="unlock-form" data-unlock-form="${escapeAttr(archive.id)}">
      <label for="unlock-${escapeAttr(archive.id)}">Local archive password</label>
      <div><input id="unlock-${escapeAttr(archive.id)}" type="password" autocomplete="current-password"><button class="button secondary" type="submit">Open saved archive</button></div>
    </form>
    <button class="text-button danger" type="button" data-action="remove" data-id="${escapeAttr(archive.id)}" data-name="this encrypted archive">Remove this encrypted archive</button>
  </article>`;
}

function packetMaker(): string {
  return `<section class="packet-maker" aria-labelledby="packet-title">
    <div><p class="platform-number">Final stop</p><h3 id="packet-title">Make the migration packet</h3><p>The ZIP includes originals, neutral rows, a manifest, hashes, and the field-mapping report.</p></div>
    <form id="packet-form">
      <label class="toggle"><input type="checkbox" id="encrypt-packet"><span>Encrypt with a password</span></label>
      <div id="password-field" hidden><label for="packet-password">Archive password</label><input id="packet-password" type="password" minlength="8" autocomplete="new-password" aria-describedby="password-help"><small id="password-help">Use at least 8 characters. The password cannot be recovered.</small></div>
      <button class="button primary" type="submit">Download migration packet</button>
      <details class="decrypt-box"><summary>Open an encrypted packet</summary><div><label for="encrypted-file">Encrypted .vault file</label><input id="encrypted-file" type="file" accept=".vault,application/octet-stream"><label for="decrypt-password">Packet password</label><input id="decrypt-password" type="password" autocomplete="current-password"><button class="button secondary" type="button" data-action="decrypt">Decrypt to ZIP</button></div></details>
    </form>
  </section>`;
}

function paidSection(): string {
  return `<section class="paid-section" aria-labelledby="paid-title">
    <div><p class="platform-number">Unlimited archive storage</p><h2 id="paid-title">Keep more than two archives</h2><p>The free vault stores two archives and makes complete packets.</p></div>
    <div class="paid-ticket">
      <p class="price"><strong>$12</strong> one-time purchase</p>
      <p>Unlimited saved archives on this device.</p>
      <a class="button primary" href="${checkoutUrl}">Buy unlimited archives</a>
      <form id="license-form"><label for="license-token">Have a license? Paste it here.</label><div><input id="license-token" name="license" autocomplete="off"><button class="button secondary" type="submit">Verify license</button></div></form>
      <p class="license-status" aria-live="polite">${escapeHtml(licenseState.message)}</p>
      <p class="fine-print">Payment opens in Sociobot's hosted checkout. <a href="/terms" data-link>Read purchase terms</a>.</p>
    </div>
  </section>`;
}

function privacyPage(): string {
  return `<main id="main" class="reading-page"><p class="eyebrow">The short version</p><h1 tabindex="-1">Your financial rows stay on your device</h1><p class="updated">Effective 28 August 2026</p><section><h2>What the vault stores</h2><p>Your imported files, field maps, hashes, and normalized rows are stored in this browser with IndexedDB.</p><p>You can encrypt each saved archive with a password. Its file name and financial rows then remain encrypted in IndexedDB.</p><p>Demo data stays in memory and is discarded when you leave or reset the demo.</p></section><section><h2>What leaves the device</h2><p>Archive data is not sent to us. The tested app contains no analytics, ads, bank connection, or tracking script.</p><p>If you verify a paid license, only the license token goes to the Sociobot billing API. Financial rows are never included.</p></section><section><h2>Your controls</h2><p>You can download each migration packet and remove saved archives. Clearing this site's browser data also removes them.</p></section><section><h2>Contact</h2><p>For privacy questions, email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p></section></main>`;
}

function termsPage(): string {
  return `<main id="main" class="reading-page"><p class="eyebrow">Use terms</p><h1 tabindex="-1">Use the vault as a portability record</h1><p class="updated">Effective 28 August 2026</p><section><h2>What the tool provides</h2><p>The vault maps budget exports into standard archive fields. It also records hashes and validation notices.</p><p>It is not accounting, tax, legal, or financial advice. It does not certify that a vendor export is complete.</p></section><section><h2>Your responsibility</h2><p>Check the field map and keep a second backup. You are responsible for remembering encryption passwords.</p></section><section><h2>Purchase terms</h2><p>The $12 license is a one-time purchase for unlimited archives. The Buy unlimited archives link opens Sociobot's hosted checkout.</p><p>For payment and refund terms, use the terms shown at checkout. A refunded or disputed license may stop verifying.</p><p>The free vault still stores two archives and makes packets.</p></section><section><h2>Warranty</h2><p>The software is provided as available under the MIT License, without a warranty of correctness or fitness.</p></section></main>`;
}

function notFoundPage(): string {
  return `<main id="main" class="not-found"><p class="eyebrow">No service here</p><h1 tabindex="-1">Page not found</h1><p>The address does not point to an archive desk.</p><a class="button primary" href="/" data-link>Return to the vault</a></main>`;
}

function bindGlobalEvents(): void {
  addEventListener('popstate', () => { void routeChanged(); });
  addEventListener('online', () => { online = true; render(); });
  addEventListener('offline', () => { online = false; render(); });
  document.querySelector<HTMLAnchorElement>('.skip-link')?.addEventListener('click', (event) => {
    event.preventDefault();
    const main = document.querySelector<HTMLElement>('#main');
    main?.focus();
    main?.scrollIntoView({ block: 'start' });
  });
}

function bindPageEvents(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[data-link]').forEach((link) => link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(link.pathname);
  }));
  document.querySelector<HTMLInputElement>('#csv-files')?.addEventListener('change', onFiles);
  document.querySelectorAll<HTMLSelectElement>('select[data-draft]').forEach((select) => select.addEventListener('change', () => {
    const draft = drafts[Number(select.dataset.draft)];
    if (draft) draft.mapping[select.dataset.field as NeutralField] = select.value;
  }));
  document.querySelectorAll<HTMLInputElement>('[data-local-encrypt]').forEach((toggle) => toggle.addEventListener('change', () => {
    const index = toggle.dataset.localEncrypt ?? '';
    const field = document.querySelector<HTMLElement>(`[data-local-password-field="${index}"]`);
    if (field) field.hidden = !toggle.checked;
    if (toggle.checked) document.querySelector<HTMLInputElement>(`[data-local-password="${index}"]`)?.focus();
  }));
  document.querySelectorAll<HTMLFormElement>('[data-unlock-form]').forEach((form) => form.addEventListener('submit', (event) => {
    event.preventDefault();
    void openSavedArchive(form);
  }));
  document.querySelectorAll<HTMLButtonElement>('[data-action]').forEach((button) => button.addEventListener('click', () => { void onAction(button); }));
  document.querySelector<HTMLInputElement>('#encrypt-packet')?.addEventListener('change', (event) => {
    const checked = (event.currentTarget as HTMLInputElement).checked;
    const field = document.querySelector<HTMLElement>('#password-field');
    if (field) field.hidden = !checked;
    if (checked) document.querySelector<HTMLInputElement>('#packet-password')?.focus();
  });
  document.querySelector<HTMLFormElement>('#packet-form')?.addEventListener('submit', (event) => { event.preventDefault(); void downloadPacket(); });
  document.querySelector<HTMLFormElement>('#license-form')?.addEventListener('submit', (event) => { event.preventDefault(); void onRestoreLicense(); });
}

async function onFiles(event: Event): Promise<void> {
  const input = event.currentTarget as HTMLInputElement;
  const files = [...(input.files ?? [])];
  error = '';
  notice = '';
  const slots = licenseState.unlocked ? files.length : Math.max(0, 2 - archives.length - drafts.length);
  if (files.length > slots) {
    error = slots ? `The free vault has room for ${slots} more archive${slots === 1 ? '' : 's'}. Choose fewer files or buy unlimited archives.` : 'The free vault already holds two archives. Remove one or buy unlimited archives.';
  }
  busy = true;
  render();
  for (const file of files.slice(0, slots)) {
    try {
      if (file.size > 25 * 1024 * 1024) throw new Error(`${file.name} is over 25 MB. Export a smaller date range and try again.`);
      drafts.push(makeDraft(file.name, await file.text()));
    } catch (cause) {
      error = messageOf(cause);
    }
  }
  busy = false;
  render();
  document.querySelector<HTMLElement>('.draft-card:last-of-type h3')?.focus();
}

async function onAction(button: HTMLButtonElement): Promise<void> {
  const action = button.dataset.action;
  if (action === 'seal') {
    const index = Number(button.dataset.index);
    const draft = drafts[index];
    if (!draft) return;
    if (!licenseState.unlocked && archives.length >= 2) {
      error = 'The free vault already holds two archives. Remove one or verify an unlimited license.';
      render();
      return;
    }
    const encryptLocal = document.querySelector<HTMLInputElement>(`[data-local-encrypt="${index}"]`)?.checked ?? false;
    const localPassword = document.querySelector<HTMLInputElement>(`[data-local-password="${index}"]`)?.value ?? '';
    if (encryptLocal && localPassword.length < 8) {
      error = 'Use at least 8 characters for the local archive password.';
      render();
      return;
    }
    busy = true; error = ''; notice = ''; render();
    try {
      const archive = await sealDraft(draft);
      if (!isDemo()) await saveArchive(archive, encryptLocal ? localPassword : '');
      archives.unshift(archive);
      if (encryptLocal) encryptedThisSession.add(archive.id);
      drafts.splice(index, 1);
      notice = `${archive.name} is sealed with a manifest and two SHA-256 hashes.`;
    } catch (cause) { error = messageOf(cause); }
    busy = false; render();
    const firstArchive = archives[0];
    if (firstArchive) document.querySelector<HTMLElement>(`[data-archive-id="${CSS.escape(firstArchive.id)}"] h3`)?.focus();
  } else if (action === 'discard-draft') {
    drafts.splice(Number(button.dataset.index), 1); render();
  } else if (action === 'remove') {
    const id = button.dataset.id ?? '';
    const name = button.dataset.name ?? 'this archive';
    if (!confirm(`Remove ${name} from this browser? Downloaded packets will not be affected.`)) return;
    await removeArchive(id);
    archives = archives.filter((archive) => archive.id !== id);
    notice = `${name} was removed from this browser.`;
    render();
  } else if (action === 'reset-demo') {
    archives = await sampleArchives(); drafts = []; notice = 'The sample archives were reset.'; error = ''; render();
  } else if (action === 'update') {
    updateWaiting?.postMessage({ type: 'SKIP_WAITING' });
  } else if (action === 'decrypt') {
    await openEncryptedPacket();
  }
}

async function downloadPacket(): Promise<void> {
  error = ''; notice = '';
  const selected = [...document.querySelectorAll<HTMLInputElement>('input[name="archive"]:checked')].map((item) => item.value);
  const chosen = archives.filter((archive): archive is VaultArchive => !isLockedArchive(archive) && selected.includes(archive.id));
  const encrypt = document.querySelector<HTMLInputElement>('#encrypt-packet')?.checked ?? false;
  const password = document.querySelector<HTMLInputElement>('#packet-password')?.value ?? '';
  try {
    busy = true; render();
    let bytes = makePacket(chosen);
    let name = 'finance-migration-packet.zip';
    let type = 'application/zip';
    if (encrypt) {
      bytes = await encryptPacket(bytes, password);
      name = 'finance-migration-packet.vault';
      type = 'application/octet-stream';
    }
    const blob = new Blob([bytes as BlobPart], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = name; document.body.append(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1_000);
    notice = `${name} is ready in your downloads.`;
  } catch (cause) { error = messageOf(cause); }
  busy = false; render();
}

async function onRestoreLicense(): Promise<void> {
  const input = document.querySelector<HTMLInputElement>('#license-token');
  try {
    restoreLicense(input?.value ?? '');
    licenseState = { unlocked: false, checking: true, message: 'Checking this license…' };
    render();
    licenseState = await verifyLicense(true);
  } catch (cause) { error = messageOf(cause); }
  render();
}

async function openSavedArchive(form: HTMLFormElement): Promise<void> {
  const id = form.dataset.unlockForm ?? '';
  const index = archives.findIndex((archive) => archive.id === id);
  const record = archives[index];
  if (index < 0 || !record || !isLockedArchive(record)) return;
  const password = form.querySelector<HTMLInputElement>('input[type="password"]')?.value ?? '';
  try {
    const archive = await unlockArchive(record, password);
    archives[index] = archive;
    encryptedThisSession.add(archive.id);
    error = '';
    notice = `${archive.name} is open for this tab. Its saved copy stays encrypted.`;
    render();
    document.querySelector<HTMLElement>(`[data-archive-id="${CSS.escape(archive.id)}"] h3`)?.focus();
  } catch (cause) {
    error = messageOf(cause);
    render();
    document.querySelector<HTMLInputElement>(`#unlock-${CSS.escape(id)}`)?.focus();
  }
}

async function openEncryptedPacket(): Promise<void> {
  const file = document.querySelector<HTMLInputElement>('#encrypted-file')?.files?.[0];
  const password = document.querySelector<HTMLInputElement>('#decrypt-password')?.value ?? '';
  if (!file) { error = 'Choose the encrypted .vault file you want to open.'; render(); return; }
  try {
    const zip = await decryptPacket(new Uint8Array(await file.arrayBuffer()), password);
    const url = URL.createObjectURL(new Blob([zip as BlobPart], { type: 'application/zip' }));
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'decrypted-finance-migration-packet.zip'; document.body.append(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1_000);
    notice = 'The decrypted ZIP is ready in your downloads.';
    error = '';
  } catch (cause) { error = messageOf(cause); }
  render();
}

function navigate(path: string): void {
  history.pushState({}, '', path);
  void routeChanged();
}

async function routeChanged(): Promise<void> {
  drafts = []; notice = ''; error = '';
  await loadRouteData();
  render();
  const heading = document.querySelector<HTMLElement>('h1');
  heading?.focus();
  routeStatus.textContent = document.title;
  scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

function normalPath(): string {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  return path;
}

function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator) || import.meta.env.DEV) return;
  const wasControlled = Boolean(navigator.serviceWorker.controller);
  let refreshing = false;
  navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).then((registration) => {
    void registration.update();
    if (registration.waiting) { updateWaiting = registration.waiting; render(); }
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) { updateWaiting = worker; render(); }
      });
    });
    addEventListener('focus', () => { void registration.update(); });
  }).catch(() => { /* The app remains usable if installation is unavailable. */ });
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (wasControlled && !refreshing) {
      refreshing = true;
      location.reload();
    }
  });
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function messageOf(cause: unknown): string {
  return cause instanceof Error ? cause.message : 'An unexpected error occurred. Reload and try again.';
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]!);
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/`/g, '&#096;');
}
