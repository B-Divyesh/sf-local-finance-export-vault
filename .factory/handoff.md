# Verification handoff — Local Finance Export Vault

## Result

**FAIL — do not release candidate
`f9c434f6c73016006c8a1fcaeea9a1fd3462235f`.**

Independent verification ran on 2026-08-28 UTC against both a clean checkout
and <https://local-finance-export-vault.sociobot.in>. The live build's served
artifacts byte-match the candidate. Full evidence and reproduction steps are
in [`.factory/verification.md`](verification.md).

## Release-blocking findings

- All ten exact test commands in `.factory/claims.json` exit 1 with “No tests
  found” because `--grep` is forwarded incorrectly.
- At 1440 × 900, the cold first screen places the sample CTA label and all
  three facts below the fold.
- Demo state can show a user's real IndexedDB archive while claiming “sample
  data, nothing is saved.”
- The brief's optional encryption for persisted local archives is absent;
  IndexedDB stores original and normalized rows in plaintext.
- The advertised $12 checkout returns HTTP 404.
- The service worker leaves installed users on stale app code when app assets
  change without a `sw.js` change.
- A delayed invalid-license response lets a fake token create and seal more
  than two archives.

Additional defects: `/?demo=1` is not a true demo, several claims are unlisted
or incompletely tested, the footer's `www.sociobot.in` URL fails TLS, hashed
assets have only 30-second caching, multiple mobile targets are under 44 px,
unknown routes return HTTP 200, and import/seal rerenders lose keyboard focus.

## What passed

- `npm ci`: pass, 0 vulnerabilities.
- `npm test`: pass, 5 unit and 15 Chromium tests.
- Corrected diagnostic claim invocation: all 10 underlying claim tests pass.
- `npm run build`: pass; TypeScript checks and `dist/` output succeed.
- No lint command exists.
- Core two-export ZIP, hashes, mapping report, validation, persistence,
  encryption/decryption, and error recovery work.
- Direct `/demo` reloads offline after service-worker installation.
- Live privacy capture found no financial-row or tracking requests.
- Axe found zero violations on tested routes and states; visible keyboard
  focus and reduced motion work.
- Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.1 s, CLS 0, TBT 40 ms; transfer 127 KiB.
- Bundle sizes pass: 42.31 KB JS, 16.49 KB CSS, 84.80 KB hero image.
- License API burst limit starts at request 31: HTTP 429 with
  `Retry-After: 4`.

## Re-run

```bash
npm ci
npm test
npm run build
npm run test:e2e -- --grep '@claim:'
VERIFY_NODE_MODULES=/work/repo/node_modules \
  /opt/fleet/lib/verify-url.sh \
  https://local-finance-export-vault.sociobot.in \
  .factory/verification-assets
```

The candidate was not modified. Only this verification handoff, the detailed
verification report, and QA evidence artifacts were added.
