# Local Finance Export Vault — polish round 4 handoff

## Result

Repair commit: `3e713299ab326fa02851329df7079e1db0a06cb5`.
It is pushed to `origin/main` and deployed to
<https://local-finance-export-vault.sociobot.in>.

Round 4 closes every finding from `review-1.md` through `review-4.md` and all
prior polish records. The final repair replaces the remaining untestable and
metaphoric product wording, updates the PWA manifest and downloadable packet
terminology, adds README deployment instructions, preserves the isolated
one-click demo, and records a regression test for the literal/testable copy
rules. The art-deco night-vault identity, local-first workflow, and deployment
class are unchanged.

## Run and verify

```bash
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run preview
```

Open `http://localhost:4173`, or enter the sandbox directly at
`http://localhost:4173/demo` (the documented `/?demo=1` alias normalizes to
`/demo`). Build output is `dist/`. Publish that directory to the configured
static host; `public/staticwebapp.config.json` supplies application rewrites,
the HTTP 404 response, cache policy, and security headers.

## Exact evidence

- Fresh clone: `/tmp/local-finance-export-vault-round4.wgaxwN/repo` at repair
  commit `3e713299ab326fa02851329df7079e1db0a06cb5`.
- Fresh-clone `npm ci`: passed, 0 vulnerabilities.
- Every one of the 16 literal commands in `.factory/claims.json` passed
  independently: `demo-two-exports`, `local-only`, `license-privacy`,
  `packet-contents`, `hash-manifest`, `encrypted-packet`, `common-imports`,
  `field-review`, `validation`, `browser-persistence`, `encrypted-local`,
  `demo-isolation`, `scope-limits`, `free-tier`, `billing-checkout`, and
  `offline-reload`.
- Fresh-clone `npm test`: passed — 10 unit tests and 29 Chromium tests.
  `npm run lint`, `npm run typecheck`, and `npm run build` also passed.
- Production bundle: JavaScript 49.71 kB raw / 18.16 kB gzip; CSS 18.17 kB
  raw / 4.86 kB gzip. `dist/index.html` exists.
- Live URL verifier passed: [report](polish-4-assets/live-verify/verify.json)
  and [desktop screenshot](polish-4-assets/live-verify/screenshot-desktop.png).
- Live 390 px Playwright Axe scans on `/`, `/demo`, `/vault`, `/privacy`,
  `/terms`, and `/missing-platform`: zero serious/critical violations, one H1
  and one main per route, no horizontal overflow, and no visible target below
  44 px.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1,530 ms; CLS 0. See
  [report](polish-4-assets/lighthouse-live.json).
- Cold live check: `?demo=1` normalized to `/demo`; the banner read
  `Demo — sample data, nothing is saved` and exposed `Reset demo` and
  `Open my vault`; reset restored both named samples while no real vault
  IndexedDB database was opened. The hero decoded at 1200 px wide. A missing
  route returned HTTP 404 with the complete static shell and literal copy.
  Evidence: [home](polish-4-assets/live-home-cold-390.png),
  [demo](polish-4-assets/live-demo-390.png), and
  [404](polish-4-assets/live-404-390.png).

## Deployment

```bash
swa deploy dist --env production --app-name sf-local-finance-export-vault \
  --resource-group sociobot --no-use-keychain
```

The command completed through the authenticated work-order target. Live
`index.html` serves `assets/index-CVMC9q2J.js`; the home response has a fresh
`Last-Modified` timestamp of 2026-08-28 20:29:16 UTC.

## Known gaps and next steps

None. No review finding of any severity remains unresolved. The only normal
maintenance step is to rebuild and redeploy when source changes so the
versioned service worker can offer its update toast.
