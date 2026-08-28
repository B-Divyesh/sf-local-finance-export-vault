import type { ArchiveDraft, FieldMapping, NeutralField, NeutralRow, ParsedCsv } from './types';
import { neutralFields } from './types';

const clean = (value: string) => value.replace(/^\uFEFF/, '').trim();

export function parseCsv(input: string): ParsedCsv {
  const text = input.replace(/^\uFEFF/, '');
  const firstLine = text.split(/\r?\n/, 1)[0] ?? '';
  const candidates = [',', ';', '\t'];
  const delimiter = candidates.reduce((best, item) =>
    countOutsideQuotes(firstLine, item) > countOutsideQuotes(firstLine, best) ? item : best
  , ',');

  const grid: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"') {
      if (quoted && next === '"') {
        cell += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === delimiter && !quoted) {
      row.push(clean(cell));
      cell = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') index += 1;
      row.push(clean(cell));
      if (row.some(Boolean)) grid.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }
  row.push(clean(cell));
  if (row.some(Boolean)) grid.push(row);
  if (!grid.length) throw new Error('This file is empty. Choose a CSV export with a header row.');

  const headers = grid[0].map(clean);
  if (headers.length < 2 || new Set(headers.map((header) => header.toLowerCase())).size !== headers.length) {
    throw new Error('The header row is missing or repeats a field. Fix the CSV headers and try again.');
  }

  const rows = grid.slice(1).map((values) => Object.fromEntries(
    headers.map((header, index) => [header, values[index] ?? ''])
  ));
  if (!rows.length) throw new Error('This CSV has headers but no rows. Choose an export with transactions.');
  return { headers, rows, delimiter };
}

function countOutsideQuotes(line: string, needle: string): number {
  let quoted = false;
  let count = 0;
  for (const char of line) {
    if (char === '"') quoted = !quoted;
    if (char === needle && !quoted) count += 1;
  }
  return count;
}

const aliases: Record<NeutralField, string[]> = {
  date: ['date', 'transaction date', 'posted date'],
  amount: ['amount', 'value'],
  payee: ['payee', 'merchant', 'description', 'name'],
  category: ['category', 'category name'],
  account: ['account', 'account name'],
  memo: ['memo', 'notes', 'note'],
  cleared: ['cleared', 'status', 'reconciled'],
  currency: ['currency', 'currency code']
};

export function detectSource(headers: string[]): string {
  const lower = headers.map((item) => item.toLowerCase());
  if (lower.includes('outflow') && lower.includes('inflow')) return 'YNAB CSV';
  if (lower.includes('merchant') && lower.includes('original statement')) return 'Monarch CSV';
  if (lower.includes('payee') && lower.includes('cleared') && lower.includes('amount')) return 'Actual CSV';
  return 'Generic budget CSV';
}

export function detectMapping(headers: string[]): FieldMapping {
  const mapping = Object.fromEntries(neutralFields.map((field) => [field, ''])) as FieldMapping;
  const lower = new Map(headers.map((header) => [header.toLowerCase(), header]));
  for (const field of neutralFields) {
    for (const alias of aliases[field]) {
      const match = lower.get(alias);
      if (match) { mapping[field] = match; break; }
    }
  }
  if (lower.has('outflow') && lower.has('inflow')) mapping.amount = '__flow__';
  return mapping;
}

export function makeDraft(name: string, content: string): ArchiveDraft {
  const parsed = parseCsv(content);
  return {
    name,
    bytes: new TextEncoder().encode(content).byteLength,
    content,
    parsed,
    mapping: detectMapping(parsed.headers),
    source: detectSource(parsed.headers)
  };
}

export function normalizeRows(draft: ArchiveDraft): NeutralRow[] {
  return draft.parsed.rows.map((source, index) => {
    const output = {} as Record<NeutralField, string>;
    for (const field of neutralFields) {
      const column = draft.mapping[field];
      output[field] = column ? source[column] ?? '' : '';
    }
    if (draft.mapping.amount === '__flow__') {
      const inflow = parseMoney(source[findHeader(draft.parsed.headers, 'inflow')] ?? '') ?? 0;
      const outflow = parseMoney(source[findHeader(draft.parsed.headers, 'outflow')] ?? '') ?? 0;
      output.amount = String(inflow - outflow);
    } else {
      const amount = parseMoney(output.amount);
      output.amount = amount === null ? output.amount : String(amount);
    }
    output.date = normalizeDate(output.date);
    return { ...output, sourceRow: index + 2 };
  });
}

function findHeader(headers: string[], wanted: string): string {
  return headers.find((header) => header.toLowerCase() === wanted) ?? wanted;
}

export function parseMoney(value: string): number | null {
  if (!value.trim()) return null;
  let cleaned = value.trim().replace(/[£€₹$\s]/g, '');
  const negative = /^\(.*\)$/.test(cleaned);
  cleaned = cleaned.replace(/[(),]/g, '');
  const number = Number(cleaned);
  return Number.isFinite(number) ? (negative ? -number : number) : null;
}

export function normalizeDate(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const us = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed);
  if (us) return `${us[3]}-${us[1].padStart(2, '0')}-${us[2].padStart(2, '0')}`;
  const date = new Date(trimmed);
  return Number.isNaN(date.valueOf()) ? trimmed : date.toISOString().slice(0, 10);
}

export function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

export function csvEscape(value: string | number): string {
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function rowsToCsv(rows: NeutralRow[]): string {
  const headers = [...neutralFields, 'sourceRow'];
  return [headers.join(','), ...rows.map((row) => headers.map((key) => csvEscape(row[key as keyof NeutralRow])).join(','))].join('\n');
}
