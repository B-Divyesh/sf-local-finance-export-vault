import { strToU8, zipSync } from 'fflate';
import { csvEscape, isValidIsoDate, makeDraft, normalizeRows, rowsToCsv, safeSpreadsheetText } from './csv';
import { SCHEMA_VERSION, neutralFields, type ArchiveDraft, type LockedArchive, type VaultArchive, type VaultItem } from './types';

const DB_NAME = 'local-finance-export-vault';
const STORE = 'archives';

export const SAMPLE_FILES = [
  {
    name: 'household-ynab.csv',
    content: `Account,Flag,Date,Payee,Category Group/Category,Category Group,Category,Memo,Outflow,Inflow,Cleared\nEveryday,,2026-07-01,North Market,Living: Groceries,Living,Groceries,Weekly shop,86.42,0.00,Cleared\nEveryday,,2026-07-02,City Transit,Transport: Pass,Transport,Pass,Monthly card,48.00,0.00,Cleared\nSavings,,2026-07-05,Interest,Income: Interest,Income,Interest,,0.00,3.18,Cleared\nEveryday,,2026-07-07,River Energy,Home: Utilities,Home,Utilities,Electric bill,64.11,0.00,Uncleared`
  },
  {
    name: 'travel-monarch.csv',
    content: `Date,Merchant,Category,Account,Original Statement,Amount,Notes,Tags\n2026-06-12,Harbor Rail,Travel,Holiday Card,HARBOR RAIL,-72.50,Airport transfer,summer\n2026-06-13,Oak Guesthouse,Lodging,Holiday Card,OAK HOUSE,-214.00,Two nights,summer\n2026-06-14,Canvas Cafe,Dining,Holiday Card,CANVAS CAFE,-18.35,Breakfast,summer\n2026-06-16,Card payment,Transfer,Everyday,PAYMENT,304.85,,summer`
  }
];

export async function sampleArchives(): Promise<VaultArchive[]> {
  const archives: VaultArchive[] = [];
  for (let index = 0; index < SAMPLE_FILES.length; index += 1) {
    const sample = SAMPLE_FILES[index];
    const draft = makeDraft(sample.name, sample.content);
    archives.push(await sealDraft(draft, `2026-08-${String(18 + index).padStart(2, '0')}T10:30:00.000Z`));
  }
  return archives;
}

export async function sealDraft(draft: ArchiveDraft, now = new Date().toISOString()): Promise<VaultArchive> {
  if (!draft.mapping.date || !draft.mapping.amount) {
    throw new Error('Date and amount need a source field. Choose both fields, then seal the archive.');
  }
  const rows = normalizeRows(draft);
  const validRows = rows.filter((row) => isValidIsoDate(row.date) && Number.isFinite(Number(row.amount)));
  const invalidRows = rows.length - validRows.length;
  const keys = rows.map((row) => `${row.date}|${row.amount}|${row.payee.toLowerCase()}`);
  const duplicateRows = keys.length - new Set(keys).size;
  const notices: string[] = [];
  if (invalidRows) notices.push(`${invalidRows} row${invalidRows === 1 ? '' : 's'} need a valid date or amount.`);
  if (duplicateRows) notices.push(`${duplicateRows} possible duplicate row${duplicateRows === 1 ? '' : 's'} found.`);
  if (!draft.mapping.category) notices.push('No category field was mapped.');
  if (!draft.mapping.account) notices.push('No account field was mapped.');
  if (!notices.length) notices.push('Every row has a valid date and amount.');
  const originalHash = await sha256(draft.content);
  const normalizedCsv = rowsToCsv(rows);
  const normalizedHash = await sha256(normalizedCsv);
  const id = `${originalHash.slice(0, 12)}-${Date.parse(now).toString(36)}`;
  const manifest = {
    schemaVersion: SCHEMA_VERSION,
    archiveId: id,
    createdAt: now,
    sourceProfile: draft.source,
    originalFile: { name: draft.name, bytes: draft.bytes, sha256: originalHash },
    normalized: { rows: rows.length, sha256: normalizedHash },
    headers: draft.parsed.headers,
    mapping: { ...draft.mapping },
    validation: {
      validRows: validRows.length,
      invalidRows,
      duplicateRows,
      missingPayees: rows.filter((row) => !row.payee).length,
      missingCategories: rows.filter((row) => !row.category).length,
      notices
    }
  };
  return { id, name: draft.name, createdAt: now, originalContent: draft.content, rows, manifest };
}

export async function sha256(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function makePacket(archives: VaultArchive[]): Uint8Array {
  if (!archives.length) throw new Error('Choose at least one archive before making a packet.');
  const combinedRows = archives.flatMap((archive) => archive.rows.map((row) => ({ ...row, archiveId: archive.id })));
  const manifest = {
    packetFormat: 'local-finance-export-vault',
    packetVersion: '1.0.0',
    schemaVersion: SCHEMA_VERSION,
    createdAt: new Date().toISOString(),
    archives: archives.map((archive) => archive.manifest)
  };
  const files: Record<string, Uint8Array> = {
    'manifest.json': strToU8(JSON.stringify(manifest, null, 2)),
    'mapping-report.md': strToU8(mappingReport(archives)),
    'README.txt': strToU8('LOCAL FINANCE EXPORT VAULT\n\nThis packet preserves original CSV files, SHA-256 hashes, field mappings, and neutral rows.\nSchema: 1.0.0\nThis is a portability archive, not an accounting or tax record.\n'),
    'normalized-transactions.csv': strToU8(combinedCsv(combinedRows))
  };
  for (const archive of archives) {
    files[`originals/${safeName(archive.id)}-${safeName(archive.name)}`] = strToU8(archive.originalContent);
  }
  return zipSync(files, { level: 6 });
}

function mappingReport(archives: VaultArchive[]): string {
  const sections = archives.map((archive) => {
    const map = neutralFields.map((field) => `| ${field} | ${archive.manifest.mapping[field] || 'Not mapped'} |`).join('\n');
    const notices = archive.manifest.validation.notices.map((notice) => `- ${notice}`).join('\n');
    return `## ${archive.name}\n\nSource profile: ${archive.manifest.sourceProfile}\n\nOriginal SHA-256: \`${archive.manifest.originalFile.sha256}\`\n\n| Neutral field | Original field |\n| --- | --- |\n${map}\n\n### Validation\n\n${notices}`;
  }).join('\n\n');
  return `# Field mapping report\n\nNeutral schema version: ${SCHEMA_VERSION}\n\n${sections}\n`;
}

function combinedCsv(rows: Array<Record<string, string | number>>): string {
  const fields = ['archiveId', ...neutralFields, 'sourceRow'];
  return [fields.join(','), ...rows.map((row) => fields.map((field) => {
    const value = row[field];
    return csvEscape(field === 'amount' || field === 'sourceRow' ? value : safeSpreadsheetText(String(value)));
  }).join(','))].join('\n');
}

function safeName(name: string): string {
  return name.replace(/[^a-z0-9._-]+/gi, '-').replace(/^-|-$/g, '');
}

function bytesToBase64(bytes: Uint8Array): string {
  let value = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    value += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(value);
}

function base64ToBytes(value: string): Uint8Array {
  const decoded = atob(value);
  return Uint8Array.from(decoded, (char) => char.charCodeAt(0));
}

export async function encryptPacket(packet: Uint8Array, password: string): Promise<Uint8Array> {
  if (password.length < 8) throw new Error('Use at least 8 characters for the archive password.');
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 250_000, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  const data = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, packet as BufferSource));
  return strToU8(JSON.stringify({
    format: 'local-finance-export-vault-encrypted',
    version: 1,
    cipher: 'AES-256-GCM',
    keyDerivation: 'PBKDF2-SHA256-250000',
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    data: bytesToBase64(data)
  }));
}

async function encryptLocalArchive(archive: VaultArchive, password: string): Promise<LockedArchive> {
  if (password.length < 8) throw new Error('Use at least 8 characters for the local archive password.');
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 250_000, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  const plaintext = new TextEncoder().encode(JSON.stringify(archive));
  const data = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext));
  return {
    id: archive.id,
    createdAt: archive.createdAt,
    locked: true,
    encryption: {
      format: 'local-finance-export-vault-local',
      version: 1,
      cipher: 'AES-256-GCM',
      keyDerivation: 'PBKDF2-SHA256-250000',
      salt: bytesToBase64(salt),
      iv: bytesToBase64(iv),
      data: bytesToBase64(data)
    }
  };
}

export async function unlockArchive(record: LockedArchive, password: string): Promise<VaultArchive> {
  if (!password) throw new Error('Enter the password used when this archive was sealed.');
  try {
    const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: base64ToBytes(record.encryption.salt) as BufferSource, iterations: 250_000, hash: 'SHA-256' },
      material,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    const bytes = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: base64ToBytes(record.encryption.iv) as BufferSource },
      key,
      base64ToBytes(record.encryption.data) as BufferSource
    );
    const archive = JSON.parse(new TextDecoder().decode(bytes)) as VaultArchive;
    if (archive.id !== record.id || !archive.manifest?.originalFile?.sha256) throw new Error('invalid archive');
    return archive;
  } catch {
    throw new Error('That password did not open this saved archive. Check it and try again.');
  }
}

export async function decryptPacket(envelopeBytes: Uint8Array, password: string): Promise<Uint8Array> {
  if (!password) throw new Error('Enter the password used when this packet was encrypted.');
  let envelope: { format?: string; salt?: string; iv?: string; data?: string };
  try {
    envelope = JSON.parse(new TextDecoder().decode(envelopeBytes)) as typeof envelope;
  } catch {
    throw new Error('This is not an encrypted vault packet. Choose a .vault file.');
  }
  if (envelope.format !== 'local-finance-export-vault-encrypted' || !envelope.salt || !envelope.iv || !envelope.data) {
    throw new Error('This encrypted packet format is not supported.');
  }
  try {
    const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: base64ToBytes(envelope.salt) as BufferSource, iterations: 250_000, hash: 'SHA-256' },
      material,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    return new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: base64ToBytes(envelope.iv) as BufferSource }, key, base64ToBytes(envelope.data) as BufferSource));
  } catch {
    throw new Error('That password did not open this packet. Check the password and try again.');
  }
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('The browser could not open local storage. Check private browsing settings.'));
  });
}

export async function listArchives(): Promise<VaultItem[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE, 'readonly').objectStore(STORE).getAll();
    request.onsuccess = () => resolve((request.result as VaultItem[]).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    request.onerror = () => reject(new Error('Saved archives could not be read. Reload and try again.'));
  });
}

export async function saveArchive(archive: VaultArchive, password = ''): Promise<void> {
  const db = await openDatabase();
  const record: VaultItem = password ? await encryptLocalArchive(archive, password) : archive;
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE, 'readwrite').objectStore(STORE).put(record);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error('This archive could not be saved. Export a packet before closing the tab.'));
  });
}

export async function removeArchive(id: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE, 'readwrite').objectStore(STORE).delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error('This archive could not be removed. Reload and try again.'));
  });
}
