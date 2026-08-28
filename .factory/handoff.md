# Local Finance Export Vault — polish 3 handoff

## Result

Release repair `62c4e882851ba96b3a480dd6f6b152a8b5a42fdf` is committed,
pushed to `main`, and deployed to
<https://local-finance-export-vault.sociobot.in>.

The one unresolved cumulative finding, F-2-4, is fixed: README now consistently
calls the mapped result **standard rows**. A regression test prevents the old
“standardised data/rows” wording from returning. Every prior finding was also
rechecked as current behavior; the full map is in [polish-3.md](polish-3.md).

## What changed

- Rewrote the two README bullets to use `standard rows`.
- Added a unit release test for the public terminology contract.
- Updated the copy audit and the verb-first catalog description.
- Preserved the existing night-transfer-office visual system, PWA/offline
  behavior, separate demo sandbox, client-only archive storage, routing,
  titles, legal pages, and designed HTTP 404.

## How to run and verify

```bash
npm ci
npm test
npm run build
npm run preview
```

Open <http://localhost:4173/> or the isolated demo at
<http://localhost:4173/?demo=1>. The query alias normalizes to `/demo`, shows
two bundled samples, and never reads or writes the real vault.

For claim verification, run every literal `test` command in
`.factory/claims.json`. All 16 were run independently from clean clone
`/tmp/local-finance-export-vault-clean.IlbXlh/repo` at this commit, after
`npm ci`, and all passed.

## Evidence

- `npm test`: pass — 9 unit tests and 29 Chromium tests, including browser,
  accessibility/Axe, keyboard, privacy, demo isolation, history focus/scroll,
  mobile-target, encryption, checkout, and offline tests.
- `npm run lint`, `npm run typecheck`, and `npm run build`: pass. `dist/` was
  produced with 49.78 kB raw / 18.23 kB gzip JavaScript and 18.17 kB raw /
  4.86 kB gzip CSS.
- Live verifier: [report](polish-3-assets/verify-live/verify.json) — title,
  lang, one H1, main, alt text, named buttons, and no console errors.
- Live Lighthouse: [report](polish-3-assets/lighthouse-live.json) — 100
  Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1,507 ms,
  CLS 0.
- Cold live evidence: [home](polish-3-assets/live-home-390.png),
  [demo](polish-3-assets/live-demo-390.png), and
  [HTTP 404](polish-3-assets/live-404-390.png).
- Production command: `swa deploy dist --env production --app-name
  sf-local-finance-export-vault --resource-group sociobot --no-use-keychain`;
  then a cold browser check of `/`, `/?demo=1`, `/vault`, `/privacy`, `/terms`,
  and `/missing-platform`.

## Known gaps / next steps

None. The product remains a static offline PWA; no server, analytics,
third-party fonts, or runtime AI feature was added.
