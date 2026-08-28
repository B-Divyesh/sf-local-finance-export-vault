# Polish round 4 — cumulative zero-findings repair

Reviewed candidate: `8825eb29219fbf39a73207c13b89b5a677a3c236`.
Repair commit: `3e713299ab326fa02851329df7079e1db0a06cb5`.
Production URL: <https://local-finance-export-vault.sociobot.in>.

This round reread every `review-*.md`, `polish-*.md`, verification record,
claims inventory, demo guide, visual thesis, and the prior handoff. The table
maps every unique review finding to the current implementation and evidence.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 — claim coverage and checkout outcome | Kept only observable visitor promises. `claims.json` has 16 entries with one tagged browser outcome test each; the checkout test follows the real Sociobot 303 and reachable Dodo destination. | Fresh-clone every literal `npm test -- --grep @claim:<id>` command passed; `@claim:billing-checkout`; live production URL. |
| F-1-2 — incomplete real 404 | Retained the static full-shell 404 with skip link, header, footer, Privacy/Terms links, metadata, OG/Twitter cards, and literal `Page not found` copy. | `ships the HTTP 404 as a complete site page with discoverable metadata`; live `GET /missing-platform -> 404`; [live 404](polish-4-assets/live-404-390.png). |
| F-1-3 — technical landing terms | The landing and packet use `standard fields`, `standard rows`, `field matches`, and `tamper-check codes`; the downloadable report now does too. | `@claim:field-review`, `@claim:packet-contents`, `@claim:hash-manifest`; [live home](polish-4-assets/live-home-cold-390.png). |
| F-1-4 — unclear decorative headings | The meaningful headings remain `What the vault does not do` and `Unlimited archive storage`. | Live 390 px Axe/heading scan on `/`; [live home](polish-4-assets/live-home-390.png). |
| F-1-5 — recurring-price ambiguity | The first-screen fact still says `$12 once`, and the price ticket says `$12 one-time purchase`. | `@claim:free-tier`; live home cold check. |
| F-1-6 — false empty-vault demo exit | The persistent exit is `Open my vault`, never an empty-vault promise; demo data stays in a separate memory-only state. | `@claim:demo-isolation`; cold live `?demo=1` reset check; [live demo](polish-4-assets/live-demo-390.png). |
| R-1 — prior touch-target edge cases | Header, demo, workspace, footer, form, and inline controls retain designed 44 px or larger targets. | `every visible mobile control has a 44px target on every route`; live 390 px target scan on all routes found none under 44 px. |
| F-2-1 — inline mobile links | Legal and privacy links keep the expanded inline hit areas, and the regression scans every visible interactive element. | `every visible mobile control has a 44px target on every route`; live 390 px target scan. |
| F-2-2 — Back/Forward restoration | History saves route scroll and stable focus keys; popstate restores them, while new navigation focuses the destination H1. | `Back and Forward restore route scroll and focus` in the clean-clone full suite. |
| F-2-3 — official title and metadata | Home remains `Local Finance Export Vault — preserve budget exports`; each route updates title and metadata. | `routes update title and focus without console errors`; [live verifier](polish-4-assets/live-verify/verify.json). |
| F-2-4 — one archive vocabulary | README, landing, packet README, and mapping report now use `standard fields` and `standard rows`; no public `standardised`/`neutral` result term remains. | `keeps the public archive terms consistent`; `rg` policy check; [copy audit](copy-audit.md). |
| F-4-1 — untestable qualitative promises | Replaced `checked archive they can understand later` with `want to inspect and keep their exports`; removed `clear`; replaced undefined `complete` with named, tested packet contents. Manifest and README match. | `keeps product copy literal, testable, and deployment-ready`; [live home](polish-4-assets/live-home-cold-390.png); live manifest check at `/manifest.webmanifest`. |
| F-4-2 — remaining transit metaphors and decorative labels | Replaced the hero eyebrow, caption, `Platform 01`, `Route map`, `How your files move`, empty state, demo/vault eyebrows, packet label, and both 404 phrases with literal product copy. The art-deco visual system remains unchanged. | `keeps product copy literal, testable, and deployment-ready`; [live home](polish-4-assets/live-home-cold-390.png), [live demo](polish-4-assets/live-demo-390.png), and [live 404](polish-4-assets/live-404-390.png). |
| F-4-3 — README deployment instructions | Added `## Deploy`: build `dist/`, publish it to the configured static host, and use `public/staticwebapp.config.json` for rewrites, HTTP 404, cache, and security headers. | `keeps product copy literal, testable, and deployment-ready`; [README](../README.md); production deployment command below. |

## Exact verification

- Fresh clone: `/tmp/local-finance-export-vault-round4.wgaxwN/repo` at
  `3e713299ab326fa02851329df7079e1db0a06cb5`; `npm ci` passed with zero
  vulnerabilities.
- Every literal command from `.factory/claims.json` passed separately in that
  clean clone: `demo-two-exports`, `local-only`, `license-privacy`,
  `packet-contents`, `hash-manifest`, `encrypted-packet`, `common-imports`,
  `field-review`, `validation`, `browser-persistence`, `encrypted-local`,
  `demo-isolation`, `scope-limits`, `free-tier`, `billing-checkout`, and
  `offline-reload`.
- Clean-clone `npm test` passed: 10 Vitest unit tests and 29 Chromium tests.
  Clean-clone `npm run lint`, `npm run typecheck`, and `npm run build` passed;
  `dist/index.html` was produced. The app bundle is 49.71 kB raw / 18.16 kB
  gzip and CSS is 18.17 kB raw / 4.86 kB gzip.
- `/opt/fleet/lib/verify-url.sh` passed on local and live home. Its live report
  records a title, `lang=en`, one H1, one main landmark, alt text, named
  controls, and no console errors: [live report](polish-4-assets/live-verify/verify.json).
- Playwright Axe live scans at 390 px found zero serious or critical issues on
  `/`, `/demo`, `/vault`, `/privacy`, `/terms`, and `/missing-platform`; every
  visible control was at least 44 px and every route had zero horizontal
  overflow.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1,530 ms and CLS 0. See
  [report](polish-4-assets/lighthouse-live.json).

## Deployment and cold live check

The production build was deployed through the configured Static Web Apps work
order target:

```bash
swa deploy dist --env production --app-name sf-local-finance-export-vault \
  --resource-group sociobot --no-use-keychain
```

After deployment, a cold 390 px browser visit confirmed the revised first
screen and decoded the 1200 px-wide hero asset. Cold `?demo=1` normalized to
`/demo`, showed the persistent isolation banner, two named samples, Reset
demo, and Open my vault; reset restored both selections without opening the
real IndexedDB database. `/missing-platform` returned HTTP 404 with `Page not
found` and `This page does not exist.` There were no residual review phrases,
console errors on valid pages, or unresolved findings.
