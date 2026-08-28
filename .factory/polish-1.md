# Polish round 1 — all review findings repaired

Candidate repaired from `94769ecfc814364943ace93ae1e247d089c6cd1d` against
review commit `cea9a81a3d1c06a44ff827a2825f14bdb495e08b` on 2026-08-28 UTC.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 — unlisted claims | Removed the untestable merchant/refund promises and the over-specific empty-state promise. Rewrote the README in plain terms. Added `field-review`, `scope-limits`, and `billing-checkout` claims with deterministic Playwright tests. Existing claims continue to cover every retained landing/README promise. | All 16 commands in `.factory/claims.json` passed from `npm ci`; new tests are `@claim:field-review`, `@claim:scope-limits`, and `@claim:billing-checkout`. Live demo: <https://local-finance-export-vault.sociobot.in/demo>. |
| F-1-2 — incomplete HTTP 404 | Rebuilt `404.html` as a full static member of the night-transfer site: skip link, wordmark, navigation, footer, title/description/canonical, OG/Twitter metadata, and a clear “Page not found” H1. Kept the Static Web Apps 404 response override. | `tests/unit/release.test.ts` asserts the full 404 structure. Live `GET /missing-platform` returned HTTP 404 and contained all required landmarks/metadata. [live not-found screenshot](polish-1-assets/live-not-found.png). |
| F-1-3 — technical landing terms | Replaced “neutral schema” with “standard fields in your archive” and rewrote the packet result as original files, tamper-check codes, row checks, and standard rows. | [copy audit](copy-audit.md); [mobile home screenshot](polish-1-assets/home-mobile-390.png). |
| F-1-4 — metaphoric labels | Replaced “No onward service” with “What the vault does not do” and “Frequent traveller” with “Unlimited archive storage.” | [copy audit](copy-audit.md); `npx playwright test tests/e2e/accessibility.spec.ts --workers=1` passed. |
| F-1-5 — price wording | First-screen fact now says “Free for two archives. $12 once for unlimited archives.” The free-tier claim asserts that exact copy. | `@claim:free-tier`; live 390px cold-browser check confirmed the full fact above the fold. |
| F-1-6 — ambiguous demo exit | Demo banner now says “Open my empty vault”; the demo-isolation test asserts the wording and real/demo separation. | `@claim:demo-isolation`; [live demo screenshot](polish-1-assets/live-demo-mobile.png). |
| R-1 — 44px edge case found during repair | Increased header, footer, archive-selection, and checkbox target dimensions to 46px after Chromium measured a nominal target at 43.999px. | `npx playwright test tests/e2e/regressions.spec.ts --workers=1` passed; mobile Axe/overflow suite passed. |

## Verification

- Clean install: `npm ci` — pass, 62 packages, 0 vulnerabilities.
- Full suite: `npm test` — pass: 8 unit tests and 28 Chromium tests (recorded exit status `0`).
- All 16 literal claim commands in `.factory/claims.json` — pass independently after the clean install.
- Independent clean clone: `/tmp/tmp.Z1m2Ufcmzt/vault` checked out pushed commit `4ca6d3d27cb9225ccdbab6f2ca12168d1df59b7b`; `npm ci`, `npm test`, and all 16 literal claim commands each exited `0`.
- `npm run lint`, `npm run typecheck`, and `npm run build` — pass. `dist/index.html` exists.
- `npx playwright test tests/e2e/accessibility.spec.ts --workers=1` — 6/6 pass; no serious or critical Axe findings, keyboard, focus, mobile overflow, and route checks included.
- `npx playwright test tests/e2e/regressions.spec.ts --workers=1` — 6/6 pass.
- Lighthouse local mobile report: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,804 ms, CLS 0, TBT 0 ms. [Report](polish-1-assets/lighthouse-local.json).
- Production build sizes: JavaScript 48.39 kB raw / 17.87 kB gzip; CSS 18.09 kB raw / 4.85 kB gzip; hero WebP 84 kB.

## Deployment and cold live re-check

Production deploy used `swa deploy dist --env production` with the Static Web
Apps deployment token for `sf-local-finance-export-vault`.

- <https://local-finance-export-vault.sociobot.in/>: a fresh 390 × 844 Chromium visit had the plain H1, CTA, all three facts (including “$12 once”), no horizontal overflow, and no console errors.
- <https://local-finance-export-vault.sociobot.in/?demo=1>: normalized to `/demo`, showed two named sample archives, the persistent isolation banner, Reset demo, and Open my empty vault.
- <https://local-finance-export-vault.sociobot.in/missing-platform>: HTTP 404, “Page not found,” full site navigation/footer, and OG/Twitter metadata.
- Live Axe at 390px on `/`, `/demo`, `/privacy`, and `/terms`: zero serious or critical violations.

Visual evidence: [desktop home](polish-1-assets/home-desktop.png), [390px home](polish-1-assets/home-mobile-390.png), [390px demo](polish-1-assets/live-demo-mobile.png), and [HTTP 404](polish-1-assets/live-not-found.png).
