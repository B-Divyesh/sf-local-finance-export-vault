# Polish round 3 — cumulative zero-findings repair

Repaired from review commit `99aeba3a33691d58553d45611e6a99b5bd70ab31`.
Repair commit: `62c4e882851ba96b3a480dd6f6b152a8b5a42fdf`.
Deployed production URL: <https://local-finance-export-vault.sociobot.in>.

This round reread `review-1.md`, `review-2.md`, `review-3.md`, `polish-1.md`,
and `polish-2.md`. Earlier repairs were checked in the current source, from a
clean clone, and on the deployed site; they are listed below rather than being
accepted on the strength of an earlier report.

| Finding | Change made / current implementation | Evidence |
| --- | --- | --- |
| F-1-1 — claims and checkout outcome | Kept every visitor-facing landing and README promise in `claims.json`; the checkout test follows the Sociobot endpoint, requires its 303, allow-lists Dodo, and requests the hosted destination. | Clean-clone `npm test -- --grep @claim:billing-checkout` passed; all 16 literal claims commands passed. Live home: <https://local-finance-export-vault.sociobot.in/>. |
| F-1-2 — real 404 shell | Kept the designed static `404.html` with skip link, header/nav, footer/legal links, canonical, OG/Twitter metadata, and `Page not found` H1. | `tests/unit/release.test.ts` passed; live `GET /missing-platform` returned 404; [live 404](polish-3-assets/live-404-390.png). |
| F-1-3 — technical landing language | The landing uses “standard fields”, “standard rows”, and “tamper-check codes” in the visitor explanation. | `@claim:field-review`, `@claim:packet-contents`, and `@claim:hash-manifest` passed from the clean clone; [live home](polish-3-assets/live-home-390.png). |
| F-1-4 — unclear decorative headings | The purpose-bearing headings are `What the vault does not do` and `Unlimited archive storage`; poster labels are no longer the only headings. | `npm test` accessibility suite passed; cold live home check passed at <https://local-finance-export-vault.sociobot.in/>. |
| F-1-5 — one-time price | The first-screen fact says `Free for two archives. $12 once for unlimited archives.` | Clean-clone `npm test -- --grep @claim:free-tier` passed; [live home](polish-3-assets/live-home-390.png). |
| F-1-6 — truthful demo exit | The persistent banner says `Open my vault`, never `Open my empty vault`; demo storage remains separate from real archives. | Clean-clone `npm test -- --grep @claim:demo-isolation` passed; [live demo](polish-3-assets/live-demo-390.png) at <https://local-finance-export-vault.sociobot.in/?demo=1>. |
| R-1 / F-2-1 — mobile target sizes | Header, footer, file, checkbox, inline legal, and email controls have 44 px hit areas; the regression scans every visible link, button, input, select, and summary on each product route. | `every visible mobile control has a 44px target on every route` passed in `npm test`; cold 390 px live route check passed. |
| F-2-2 — Back/Forward restoration | Route state stores scroll and a stable focus key. Push navigation focuses the new H1; browser history restores the saved focus and scroll. | `Back and Forward restore route scroll and focus` passed in `npm test`; live navigation was rechecked at <https://local-finance-export-vault.sociobot.in/>. |
| F-2-3 — official home title | The home document, Open Graph, and Twitter title use `Local Finance Export Vault — preserve budget exports`. | `routes update title and focus without console errors` passed; [URL verifier](polish-3-assets/verify-live/verify.json) records the exact live title. |
| F-2-4 — one term for standard rows | Replaced the two remaining README phrases `standardised data` and `standardised rows` with `standard rows`. Added a unit regression assertion that rejects either old phrase. The copy audit now documents the single term. | `keeps the public archive terms consistent` passed in `tests/unit/release.test.ts`; `rg -i 'standardised (data|rows)' README.md` has no matches; [copy audit](copy-audit.md). |

## Verification

- Fresh clean clone: `/tmp/local-finance-export-vault-clean.IlbXlh/repo` at
  `62c4e88`; `npm ci` passed with zero vulnerabilities.
- Every literal command in `.factory/claims.json` passed independently in
  that clone: `demo-two-exports`, `local-only`, `license-privacy`,
  `packet-contents`, `hash-manifest`, `encrypted-packet`, `common-imports`,
  `field-review`, `validation`, `browser-persistence`, `encrypted-local`,
  `demo-isolation`, `scope-limits`, `free-tier`, `billing-checkout`, and
  `offline-reload`.
- Main checkout: `npm test` passed (9 unit tests, 29 Chromium tests), followed
  by `npm run lint`, `npm run typecheck`, and `npm run build`.
- Build output is `dist/index.html`; application JavaScript is 49.78 kB raw /
  18.23 kB gzip and CSS is 18.17 kB raw / 4.86 kB gzip.
- `/opt/fleet/lib/verify-url.sh` passed against the live homepage: title,
  `lang=en`, one H1, main landmark, image alt text, named controls, and no
  load errors. Its report and screenshots are in `polish-3-assets/verify-live/`.
- Fresh live mobile Lighthouse: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; LCP 1,507 ms and CLS 0. See
  [report](polish-3-assets/lighthouse-live.json).
- Cold 390 px browser checks passed for `/`, `/?demo=1` → `/demo`, `/vault`,
  `/privacy`, `/terms`, and `/missing-platform`. The valid routes had no
  console/page errors; the missing URL was deliberately checked as HTTP 404.

## Deployment

Built `dist/` and deployed it with the authenticated factory Static Web Apps
target `sf-local-finance-export-vault` in resource group `sociobot`:

```bash
swa deploy dist --env production --app-name sf-local-finance-export-vault \
  --resource-group sociobot --no-use-keychain
```

The deployment was cold-checked after the live response showed the new
`Last-Modified` timestamp. No cumulative review finding remains unresolved.
