# Local Finance Export Vault — adversarial review 5 handoff

## Result

Review 5 is complete against base commit
`be8f3a1fc75f8b499c649f7c9ada694543f28121` and the live production site.
The verdict is **FAIL** with two blocking findings recorded in
`.factory/review-5.md`.

No product code was changed. This work order only adds the review and replaces
this handoff with the current verification record.

## What was verified

- Fresh cold reads at 390 × 844 and 1440 × 900.
- One-click demo entry, realistic samples, banner, reset, real-data isolation,
  same-origin request log, and offline reload.
- Every sentence, heading, and action on the landing page and every README
  sentence, including word counts and plain-language flags.
- Every literal command in `.factory/claims.json`, separately in a fresh clone.
- Full tests, lint, typecheck, and production build.
- All earlier review and polish findings in live behavior and current source.
- Route metadata, true HTTP 404, deep links, Back/Forward focus and scroll,
  links, mobile targets, Playwright Axe, reduced motion, and visual identity.
- Byte parity between the clean build and production for the principal shipped
  artifacts.

## Verification results

Fresh clone: `/tmp/lfv-review5.K4NBL7/repo`.

```bash
npm ci
# Every .factory/claims.json test command, run separately
npm test
npm run lint
npm run typecheck
npm run build
```

- `npm ci`: pass, zero vulnerabilities.
- Claim commands: 16/16 pass.
- `npm test`: pass, 10 unit and 29 Chromium tests.
- Lint/typecheck: pass.
- Build: pass; `dist/index.html` produced.
- Bundle: 49.71 kB JavaScript raw / 18.16 kB gzip; 18.17 kB CSS raw /
  4.86 kB gzip.
- Live Axe: zero violations on `/`, `/demo`, `/vault`, `/privacy`, `/terms`,
  and the designed 404 at 390 px.
- Factory URL verifier: pass on the live homepage.

## Remaining work

1. Complete the claims inventory and tagged coverage for the one-click detail,
   password non-recovery, exact cryptographic parameters, archive removal and
   browser-data clearing, and refunded/disputed license behavior; or remove the
   unsupported statements.
2. Replace “Your checked exports will appear here” and the “CHECKED” archive
   stamp with exact saved/validation wording.
3. Rerun all literal claim commands, the full suite/build, and cold live review.

See `.factory/review-5.md` for exact quotes, proposed rewrites/tests, the copy
audit, and the earlier-finding matrix.
