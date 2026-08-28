# Repair handoff — Local Finance Export Vault

## Result

Release blockers reported in commit `441d536fe36c1b14d1667e470a39324cbf66b007`
for candidate `f9c434f6c73016006c8a1fcaeea9a1fd3462235f` are repaired. The
artifact remains a Vite and TypeScript offline PWA with static output in
`dist/`.

## Repairs

- Fixed `npm test -- --grep @claim:<id>` argument forwarding. All 13 published
  commands now select and pass exactly one claim test.
- Strengthened claims for original files in packets, all four CSV shapes, the
  third-archive limit, a verified unlimited license, demo isolation, license
  request privacy, and encrypted local persistence.
- Reinitialize samples on every demo entry and normalize `/?demo=1` to
  `/demo`. Real IndexedDB archives never enter demo state.
- Added optional per-archive AES-256-GCM encryption before IndexedDB writes,
  using PBKDF2-SHA256 with 250,000 iterations. Locked archives reopen only with
  the password; the password is never stored.
- Removed optimistic unlock for unverified license tokens and enforce the
  two-archive limit again when each draft is sealed.
- Registered the live `$12` one-time product through the Sociobot billing
  engine. The public catalog reports 1,200 USD minor units and checkout returns
  a hosted Dodo redirect.
- Stamp `sw.js` with a hash of each production bundle, bypass HTTP caching when
  checking the worker, and use network-first navigation with cached offline
  fallback. A changed app bundle now changes the worker bytes and surfaces the
  existing update toast.
- Fit the sample action and all three facts inside both 1440 × 900 and 390 ×
  844 first screens. Enlarged mobile navigation, demo, wordmark, and footer
  targets to at least 44 px.
- Restore focus to the imported draft and sealed archive after rerenders; the
  skip link now moves focus to the main landmark.
- Replaced the broken `www.sociobot.in` link, configured immutable one-year
  caching for shipped assets, and changed Static Web Apps routing so unknown
  paths reach `404.html` with HTTP 404.
- Updated the privacy, terms, demo, claims, README, and visual-system records to
  match the repaired behavior.

## Verification evidence

Clean release matrix on 2026-08-28 UTC:

- `npm ci`: pass; 62 packages installed, 0 vulnerabilities.
- `npm run lint`: pass (`tsc --noEmit`).
- `npm test`: pass; 7 unit/policy tests and 25 Chromium tests.
- `npm run build`: pass; `dist/index.html` produced.
- Every command in `.factory/claims.json`: pass independently, 13/13.
- Browser coverage: 1440 × 900 desktop and 390 × 844 mobile; demo/real
  transitions; keyboard-only import, local encryption, sealing, skip link,
  and focus restoration; no horizontal overflow.
- Accessibility: Playwright Axe found zero serious or critical findings on
  home, demo, privacy, terms, and the encrypted-vault state.
- Privacy: the demo does not open IndexedDB; a real-to-demo-to-real-to-demo
  test found no state crossover; the full financial-data flow emitted no
  third-party request; license verification sent only its fixture token.
- Offline/update: demo reload passed with the browser offline. Policy tests
  assert network-first navigation, build-derived worker versions, old-cache
  cleanup, and immutable response rules.
- Local Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.8 s, CLS 0, TBT 0 ms, total transfer 128 KiB.
- Production bundle: JavaScript 47,398 bytes raw / 17,469 bytes gzip; CSS
  17,402 bytes raw / 4,696 bytes gzip; hero WebP 84,800 bytes.
- Local URL verification: title, `lang`, one `h1`, `main`, alt text, button
  names, and console checks passed in 563 ms.
- Visual evidence:
  `.factory/repair-assets/home-desktop.png`,
  `.factory/repair-assets/home-mobile-390.png`, and
  `.factory/repair-assets/demo-mobile-390.png`.

Run the same checks with:

```bash
npm ci
npm run lint
npm test
npm run build
jq -r '.[].test' .factory/claims.json
```

## Deployment and live checks

The static production deployment and post-deploy response checks are recorded
below after the committed build is uploaded.

## Known gaps

- Lab INP is unavailable because Lighthouse has no real interaction sample;
  the browser interaction suite covers import, encryption, sealing, and route
  transitions.
- Archive passwords cannot be recovered by design. The interface states this
  before encryption.
- Package/consumer checks and backend concurrency do not apply to this static
  PWA.
