# Local Finance Export Vault — adversarial review 2 handoff

## Result

Review 2 is complete at commit
`a2e7719f156045c108d95abba2b9c064cbd95b55`. Verdict: **FAIL**.

No product code was modified. The detailed report is in
[`review-2.md`](review-2.md). It contains two reopened blocking findings and
four new findings.

## Main findings

- F-1-1 reopened: the hosted-checkout claim test checks only link text and
  `href`, not the promised redirect outcome.
- F-1-6 reopened: “Open my empty vault” is false when the real vault already
  contains archives.
- Mobile purchase-terms and privacy-email links are below the required 44 px
  target size.
- SPA Back navigation restores the URL but not prior scroll or focus.
- The home title omits “Local” from the official product name.
- Landing and README copy still mixes packet/data terms and technical jargon.

## Verification performed

- Cold live Chromium at 390 × 844 and 1440 × 900.
- One-click demo, Reset, direct `/demo`, `?demo=1`, real-data isolation,
  no-cross-origin request, and offline reload checks.
- All 16 literal `.factory/claims.json` commands from a fresh clone: command
  result 16/16 PASS; the report explains the inadequate checkout assertion.
- `npm test`: PASS, 8 unit and 28 Chromium tests.
- `npm run build`: PASS; `dist/` produced.
- Live URL verifier: PASS with no console errors.
- Live Axe at 390 px on `/`, `/demo`, `/vault`, `/privacy`, `/terms`, and the
  designed 404: zero violations.
- Live route metadata, crawler, checkout redirect, touch target, and browser
  history checks.

Screenshots and verifier output are in `review-2-assets/`.

## Known gaps / next steps

The six findings in `review-2.md` remain for a repair worker. No deployment or
infrastructure action was taken.
