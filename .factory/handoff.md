# Local Finance Export Vault — polish round 1 handoff

## Result

All findings in [`review-1.md`](review-1.md) are repaired. The product remains
a Vite + TypeScript local-first PWA with Static Web Apps output in `dist/` and
the art-deco Night Transfer Office visual system intact.

## What changed

- Added three observable claim tests: editable field review, original-file
  preservation/no bank request, and the exact hosted Sociobot checkout route.
  Removed claims that cannot be verified in the sandbox.
- Rewrote first-screen, workflow, archive-limit, payment, and README copy in
  plain language. The price now says `$12 once`; the demo exit says `Open my
  empty vault`.
- Added route-specific SPA descriptions/OG/Twitter titles and rebuilt the real
  static HTTP 404 with the full site skeleton and metadata.
- Increased key mobile interaction targets to 46px to avoid a browser
  sub-pixel failure at the 44px accessibility boundary.
- Added the catalog description, refreshed the copy audit and demo guide, and
  recorded the complete finding-to-evidence map in [`polish-1.md`](polish-1.md).

## Verification

Executed after `npm ci` (62 packages; 0 vulnerabilities):

```bash
npm test                         # pass: 8 unit + 28 Chromium tests
npm run lint                     # pass
npm run typecheck                # pass
npm run build                    # pass; dist/index.html exists
```

Every literal command in `.factory/claims.json` passed independently (16/16),
including the offline reload, privacy interception, demo isolation, encrypted
archive, field-review, scope-limit, and checkout claims. Targeted accessibility
and regression suites both passed 6/6. The local mobile Lighthouse report is
at [`polish-1-assets/lighthouse-local.json`](polish-1-assets/lighthouse-local.json):
100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1,804ms,
CLS 0, TBT 0ms.

Independent clean-clone confirmation: `/tmp/tmp.Z1m2Ufcmzt/vault` cloned pushed
commit `4ca6d3d27cb9225ccdbab6f2ca12168d1df59b7b`, ran `npm ci` successfully,
then passed `npm test` (exit `0`) and all 16 literal claim commands (exit `0`).

Build payload: 48.39 kB raw JavaScript (17.87 kB gzip), 18.09 kB raw CSS
(4.85 kB gzip), and an 84 kB hero WebP.

## Deploy and live verification

Deployed `dist/` to production Static Web Apps (`sf-local-finance-export-vault`).
Fresh live checks passed at <https://local-finance-export-vault.sociobot.in/>:

- `/` at 390 × 844: H1, CTA, all three facts above the fold, no overflow or console errors.
- `/?demo=1`: normalizes to `/demo`, displays two sample archives and the reset/empty-vault isolation controls.
- `/missing-platform`: HTTP 404, Page not found H1, header/footer, and OG/Twitter metadata.
- Live Axe at 390px on `/`, `/demo`, `/privacy`, and `/terms`: zero serious or critical violations.

Screenshots and the detailed evidence are in [`polish-1.md`](polish-1.md).

## Known gaps

None.
