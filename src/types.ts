export const SCHEMA_VERSION = '1.0.0';

export type NeutralField =
  | 'date'
  | 'amount'
  | 'payee'
  | 'category'
  | 'account'
  | 'memo'
  | 'cleared'
  | 'currency';

export const neutralFields: NeutralField[] = [
  'date', 'amount', 'payee', 'category', 'account', 'memo', 'cleared', 'currency'
];

export type FieldMapping = Record<NeutralField, string>;

export interface ParsedCsv {
  headers: string[];
  rows: Record<string, string>[];
  delimiter: string;
}

export interface ArchiveDraft {
  name: string;
  bytes: number;
  content: string;
  parsed: ParsedCsv;
  mapping: FieldMapping;
  source: string;
}

export interface NeutralRow {
  date: string;
  amount: string;
  payee: string;
  category: string;
  account: string;
  memo: string;
  cleared: string;
  currency: string;
  sourceRow: number;
}

export interface ArchiveManifest {
  schemaVersion: string;
  archiveId: string;
  createdAt: string;
  sourceProfile: string;
  originalFile: { name: string; bytes: number; sha256: string };
  normalized: { rows: number; sha256: string };
  headers: string[];
  mapping: FieldMapping;
  validation: {
    validRows: number;
    invalidRows: number;
    duplicateRows: number;
    missingPayees: number;
    missingCategories: number;
    notices: string[];
  };
}

export interface VaultArchive {
  id: string;
  name: string;
  createdAt: string;
  originalContent: string;
  rows: NeutralRow[];
  manifest: ArchiveManifest;
}

export interface LockedArchive {
  id: string;
  createdAt: string;
  locked: true;
  encryption: {
    format: 'local-finance-export-vault-local';
    version: 1;
    cipher: 'AES-256-GCM';
    keyDerivation: 'PBKDF2-SHA256-250000';
    salt: string;
    iv: string;
    data: string;
  };
}

export type VaultItem = VaultArchive | LockedArchive;

export function isLockedArchive(item: VaultItem): item is LockedArchive {
  return 'locked' in item && item.locked === true;
}
