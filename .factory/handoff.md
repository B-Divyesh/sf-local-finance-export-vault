# Local Finance Export Vault — review 4 handoff

## Result

Adversarial review 4 is complete against commit
`8825eb29219fbf39a73207c13b89b5a677a3c236` and the live production site.
Verdict: **FAIL** with three findings in `.factory/review-4.md`.

No product code was modified. The remaining work is copy/documentation:

- F-4-1: remove untestable “checked/understand,” “clear,” and “complete” claims.
- F-4-2: replace remaining transit metaphors and decorative labels with literal
  product copy.
- F-4-3: add README deployment instructions.

## Verification performed

- Fresh Chromium cold reads at 390 × 844 and 1440 × 900.
- Live demo reset, real-data isolation, IndexedDB comparison, request log, and
  offline reload.
- Every literal command in `.factory/claims.json`, independently from fresh
  clone `/tmp/lfv-review4.hj5OHN/repo`: 16/16 passed.
- Fresh-clone `npm test`: 9 unit tests and 29 Chromium tests passed.
- Fresh-clone `npm run build`: passed; `dist/` produced; app JavaScript was
  18.23 kB gzip.
- Live Axe scans on all routes and the HTTP 404: zero violations.
- Factory URL verifier: passed title, language, H1, main, alt, control-name, and
  console checks.
- Route metadata, direct links, Back/Forward focus and scroll, 44 px mobile
  targets, dead links, HTTP 404, security headers, asset provenance, and prior
  findings were rechecked.
- Principal live assets matched the clean build byte-for-byte.

## Next step

Apply the exact rewrites in `.factory/review-4.md`, document static deployment
in README, update the copy audit, and rerun the complete review checklist.
