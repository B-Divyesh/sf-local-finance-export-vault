# Polish round 5 — cumulative zero-findings repair

Reviewed release candidate: `be8f3a1fc75f8b499c649f7c9ada694543f28121`.
Review commit: `d11250f46a2e49f79b10f296e773c5a85f74b968`.
Application repair commit: `69ee7e1`.
Production URL: <https://local-finance-export-vault.sociobot.in>.

Every `review-1.md` through `review-5.md` and `polish-1.md` through
`polish-4.md` was reread. The map below records every unique finding, including
reopened findings and the repair-discovered target-size item.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 — claim inventory | The inventory now has 18 claims with one outcome test each. It includes one-click entry, exact cryptography, password non-recovery, and archive deletion. Untested browser-clearing and license-revocation wording was removed. | `@claim:demo-two-exports`, `@claim:encrypted-packet`, `@claim:password-recovery`, `@claim:archive-removal`, and `@claim:billing-checkout`; [claim results](polish-5-assets/claim-results.txt); [live Terms](polish-5-assets/live-terms-390.png); `/`, `/privacy`, and `/terms` returned 200. |
| F-1-2 — incomplete real 404 | Retained the full night-vault header, navigation, footer, legal links, metadata, and `Page not found` H1 on the static HTTP 404. | `ships the HTTP 404 as a complete site page with discoverable metadata`; [live 404](polish-5-assets/live-404-390.png); live `/missing-platform` returned 404. |
| F-1-3 — unexplained technical terms | Public copy consistently uses standard fields, standard rows, field matches, and tamper-check codes. Algorithms remain in the labelled README technical section. | `keeps the public archive terms consistent`; `@claim:field-review`; [live home](polish-5-assets/live-home-390.png); live `/` returned 200. |
| F-1-4 — metaphor-only headings | Meaningful headings remain literal: `What the vault does not do` and `Unlimited archive storage`. The art-deco identity stays visual. | `keeps product copy literal, testable, and deployment-ready`; [live home](polish-5-assets/live-home-390.png); live `/` heading scan passed. |
| F-1-5 — one-time price ambiguity | The first-screen fact says `$12 once`; the purchase section says `$12 one-time purchase`. | `@claim:free-tier`; [live home](polish-5-assets/live-home-390.png); live `/` cold fold check passed. |
| F-1-6 — misleading demo exit | The persistent demo action remains `Open my vault`, which truthfully restores any existing real archive. | `@claim:demo-isolation`; [live demo](polish-5-assets/live-demo-390.png); live `/?demo=1` normalized to `/demo`. |
| R-1 — target-size edge cases | Header, footer, form, checkbox, inline legal, and demo controls remain at least 44 px at 390 px. | `every visible mobile control has a 44px target on every route`; [live Privacy](polish-5-assets/live-privacy-390.png); live mobile suite passed on every route. |
| F-2-1 — undersized inline links | Purchase-terms and email links retain expanded mobile hit areas; the regression scans every visible interactive control. | `every visible mobile control has a 44px target on every route`; [live Privacy](polish-5-assets/live-privacy-390.png); live `/privacy` passed. |
| F-2-2 — Back/Forward state loss | History still saves scroll and stable focus keys; push navigation focuses the next H1, while Back/Forward restores prior focus and scroll. | `Back and Forward restore route scroll and focus`; [live home](polish-5-assets/live-home-390.png); live 33-test run passed. |
| F-2-3 — incomplete home title | Home title and social title remain `Local Finance Export Vault — preserve budget exports`; route-specific titles remain intact. | `routes update title and focus without console errors`; [live verifier](polish-5-assets/live-verify/verify.json); live `/` title matched exactly. |
| F-2-4 — inconsistent archive language | Landing, README, and generated packet continue to use migration packet, standard fields/rows, and field matches consistently. | `keeps the public archive terms consistent`; `@claim:packet-contents`; [live demo](polish-5-assets/live-demo-390.png); live `/demo` passed. |
| F-4-1 — qualitative promises | Unsupported `clear`, `complete`, and hero `checked archive` wording remains absent. Round 5 also removes the last ambiguous saved-state use. | `keeps product copy literal, testable, and deployment-ready`; [copy audit](copy-audit.md); [live home](polish-5-assets/live-home-390.png); live `/` passed. |
| F-4-2 — decorative transit copy | All earlier metaphor and lore strings remain absent while the art-deco palette, poster, brass rules, clipped tickets, and geometry remain unchanged. | `keeps product copy literal, testable, and deployment-ready`; [live home](polish-5-assets/live-home-390.png); live visual inspection passed. |
| F-4-3 — deployment docs | README retains the exact build output and configured static-host deployment instructions. | `keeps product copy literal, testable, and deployment-ready`; [live verifier](polish-5-assets/live-verify/verify.json); live build matched local `dist/index.html` byte-for-byte. |
| F-5-1 — omitted current promises | The first-screen CTA now points to `/?demo=1`; its test begins at `/`, clicks once, checks the banner, two named samples, and Reset. Password storage, independent PBKDF2/AES decryption, and archive deletion now have dedicated outcome tests. The two unverified legal clauses were removed. | `@claim:demo-two-exports`, `@claim:password-recovery`, `@claim:encrypted-packet`, `@claim:archive-removal`; [live demo](polish-5-assets/live-demo-390.png), [live Privacy](polish-5-assets/live-privacy-390.png), [live Terms](polish-5-assets/live-terms-390.png); live `/`, `/?demo=1`, `/privacy`, and `/terms` passed. |
| F-5-2 — undefined `checked` status | Empty state now says `Your saved exports will appear here`. A valid archive now says `Dates and amounts valid`; invalid archives keep the exact `N to review` result. A source regression rejects the former standalone wording. | `@claim:validation` and `keeps product copy literal, testable, and deployment-ready`; [live demo](polish-5-assets/live-demo-390.png); live `/demo` showed both exact valid stamps and no standalone `Checked`. |

## Verification

- Fresh clone `/tmp/lfv-polish5-clean.npZXAp/repo` at `69ee7e1`: `npm ci`
  passed with zero vulnerabilities. Every literal command in
  `.factory/claims.json` passed separately, 18/18.
- Clean-clone `npm test` passed: 10 Vitest tests and 33 Chromium tests.
  `npm run lint`, `npm run typecheck`, and `npm run build` passed.
- The build contains 49.78 kB raw / 18.18 kB gzip JavaScript and 18.17 kB raw /
  4.86 kB gzip CSS. `dist/index.html` exists.
- Local URL verifier passed with no console errors. Local mobile Lighthouse:
  Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1,905 ms,
  CLS 0, TBT 21 ms. See [report](polish-5-assets/lighthouse-local.json).
- The complete Playwright browser suite ran again against production: 33/33
  passed, including all claims, keyboard, Axe, focus/history, mobile targets,
  privacy request logging, demo isolation, offline reload, and the real 404.
- Production URL verifier passed with no console errors. Live mobile Lighthouse:
  Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,501 ms,
  CLS 0, TBT 0 ms. See [report](polish-5-assets/lighthouse-live.json).
- [Live route evidence](polish-5-assets/live-route-checks.txt) records all route
  statuses, checkout 303, exact deployed asset names, and byte parity.

## Deployment and cold review

The application was deployed through the configured Azure Static Web Apps
target `sf-local-finance-export-vault` in resource group `sociobot`. A fresh
390 × 844 browser then checked `/`, `/?demo=1`, `/privacy`, `/terms`, and the
HTTP 404. The demo banner, Reset demo, Open my vault, two samples, and exact
validation stamps were visible. No cumulative finding remains unresolved.
