# Local Finance Export Vault — polish round 2 handoff

## Result

The repair is complete and deployed at
<https://local-finance-export-vault.sociobot.in>. Product repair commit:
`1f602f8e5fafb9423879d7e6653da36f79bef591`.

It closes every finding in `review-1.md` and `review-2.md`: real checkout
outcome coverage, truthful isolated demo exit, full mobile hit targets,
Back/Forward focus and scroll restoration, official metadata, consistent plain
language, and the complete static 404 shell.

## Verification evidence

- Fresh clone at `/tmp/local-finance-export-vault-clean.z8CQNL` from repair
  commit `1f602f8` completed `npm ci`, then every literal command in
  `.factory/claims.json` independently: all 16 passed.
- The same clean clone passed `npm test` (8 unit and 29 Chromium tests) and
  `npm run build`; `dist/index.html` exists at its root.
- Production build: JavaScript 49.78 kB raw / 18.23 kB gzip; CSS 18.17 kB raw
  / 4.86 kB gzip.
- Azure Static Web Apps deployment
  `e646c620-7219-42ee-965a-8ad2e4aa883c` succeeded. Cold live `/` returned
  200; cold live `/missing-platform` returned 404.
- [`verify.json`](polish-2-assets/live-home/verify.json) records a 664 ms cold
  live load, no console errors, `lang="en"`, one H1, main, and complete image
  alt coverage. Screenshots: [desktop](polish-2-assets/live-home/screenshot-desktop.png),
  [mobile](polish-2-assets/live-home/screenshot-mobile.png),
  [demo](polish-2-assets/live-demo-mobile.png), and
  [404](polish-2-assets/live-404-mobile.png).
- Cold live mobile Axe coverage for `/`, `/demo`, `/vault`, `/privacy`,
  `/terms`, and `/missing-platform` found zero serious/critical issues and no
  visible control smaller than 44 px.
- Live Lighthouse scores were Performance 97, Accessibility 100, Best
  Practices 100, and SEO 100; raw report:
  [`lighthouse-live.json`](polish-2-assets/lighthouse-live.json).

## Run and verify

```bash
npm ci
npm test
npm run build
npm run preview
```

Open `http://localhost:4173/demo` or `/?demo=1` for isolated sample data.
Claim commands are listed in `.factory/claims.json`; each starts from its own
fresh browser context.

## Known gaps

None. The product remains a local-first static PWA: no analytics, no third
party scripts or fonts, and no financial-row upload path.
