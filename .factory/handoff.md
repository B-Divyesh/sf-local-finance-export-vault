# Handoff — Local Finance Export Vault

## What shipped

- A Vite and TypeScript offline PWA at `/`, `/vault`, and `/demo`.
- CSV import with quoted-field parsing and profiles for YNAB, Monarch, Actual,
  and generic budget exports.
- A review step that maps source columns into neutral schema `1.0.0`.
- Immutable archive snapshots with original and normalized SHA-256 hashes.
- Validation for dates, amounts, missing fields, and possible duplicate rows.
- IndexedDB persistence for real archives and memory-only isolation for demo
  archives.
- ZIP migration packets containing original CSV files, normalized rows,
  `manifest.json`, `mapping-report.md`, and a plain README.
- Password encryption and reopening of packets with PBKDF2-SHA256 and
  AES-256-GCM.
- A $12 one-time unlimited-archive license flow through the Sociobot checkout
  and verification API. No product ID is hardcoded.
- Install metadata, icons, a versioned service worker, offline route caching,
  update handling, security headers, sitemap, robots file, and a styled 404.
- Privacy, terms, demo, claims, copy-audit, and project documentation.
- An original generated art-deco transit poster, with its prompt and provenance
  recorded in `.factory/design.md` and `assets/src/`.

## Verification

Run from a clean checkout:

```bash
npm install
npm test
npm run build
```

Results on 2026-08-28:

- `npm test`: 5 unit tests and 15 Chromium tests passed.
- All ten entries in `.factory/claims.json` passed from the demo sandbox or a
  fresh real-vault context.
- Axe: no serious or critical violations on home, demo at 390 × 844, privacy,
  or terms.
- Browser smoke test: route titles, history focus, 404 path, and console errors
  passed.
- Offline: `/demo` reloaded with the browser network disabled after the app
  shell was installed.
- Production build: `dist/index.html` exists. Initial JavaScript is 42.30 KB
  raw / 16.63 KB gzip. CSS is 16.49 KB raw / 4.53 KB gzip. The hero WebP is
  83 KB. No web fonts are downloaded.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100. LCP 1.8 s, CLS 0, TBT 0 ms. Lab INP was not available because the
  run had no user interaction.
- Desktop home and 390 px demo screenshots were inspected in
  `.factory/qa/` during development; that ignored folder is not shipped.

## Known limits

- Automatic mappings are header-based. Unusual exports need manual field
  choices before sealing.
- CSV imports are limited to 25 MB per file to protect browser memory.
- The archive checks portability and structure, not accounting or tax
  correctness.
- License checkout will work after the factory registers this slug with the
  Sociobot billing service. Network loss leaves a previously verified cached
  license active; a new license needs one online verification.
- Data does not sync between devices. Users move it with downloaded packets.

## Next release checks

- Register `local-finance-export-vault` with the billing service and verify a
  live purchase return once on the deployed origin.
- Add import fixtures when supported vendors change their export headers.
