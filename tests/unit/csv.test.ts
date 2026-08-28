import { describe, expect, it } from 'vitest';
import { detectMapping, detectSource, makeDraft, parseCsv, rowsToCsv } from '../../src/csv';
import { makePacket, sealDraft } from '../../src/vault';
import { unzipSync, strFromU8 } from 'fflate';

describe('CSV import', () => {
  it('parses quoted commas and escaped quotes', () => {
    const parsed = parseCsv('Date,Payee,Amount\n2026-01-02,"Market, North",-4.20\n2026-01-03,"A ""quoted"" shop",2');
    expect(parsed.rows).toHaveLength(2);
    expect(parsed.rows[0].Payee).toBe('Market, North');
    expect(parsed.rows[1].Payee).toBe('A "quoted" shop');
  });

  it('detects known source shapes and YNAB flow columns', () => {
    const headers = ['Account', 'Date', 'Payee', 'Category', 'Outflow', 'Inflow', 'Cleared'];
    expect(detectSource(headers)).toBe('YNAB CSV');
    expect(detectMapping(headers).amount).toBe('__flow__');
  });

  it('reports an empty export in plain words', () => {
    expect(() => parseCsv('')).toThrow('This file is empty');
    expect(() => parseCsv('Date,Amount\n')).toThrow('headers but no rows');
  });

  it('neutralizes spreadsheet formulas in text fields', () => {
    const draft = makeDraft('safe.csv', 'Date,Payee,Amount\n2026-01-02,=HYPERLINK("bad"),-4.20');
    expect(rowsToCsv([{ date: '2026-01-02', payee: '=SUM(1)', amount: '-4.2', category: '', account: '', memo: '', cleared: '', currency: '', sourceRow: 2 }])).toContain("'=SUM(1)");
    expect(draft.mapping.amount).toBe('Amount');
  });
});

describe('migration packet', () => {
  it('keeps originals, standard rows, a manifest, and a mapping report', async () => {
    const draft = makeDraft('actual.csv', 'Date,Account,Payee,Notes,Category,Amount,Cleared\n2026-04-01,Main,Bookshop,Guide,Learning,-19.50,Cleared');
    const archive = await sealDraft(draft, '2026-08-20T10:00:00.000Z');
    const files = unzipSync(makePacket([archive]));
    expect(Object.keys(files)).toEqual(expect.arrayContaining([
      'manifest.json', 'mapping-report.md', 'README.txt', 'normalized-transactions.csv'
    ]));
    expect(strFromU8(files['mapping-report.md'])).toContain('| payee | Payee |');
    expect(strFromU8(files['normalized-transactions.csv'])).toContain('Bookshop');
    expect(archive.manifest.originalFile.sha256).toMatch(/^[a-f0-9]{64}$/);
  });
});
