# Local Finance Export Vault — polish round 5 handoff

## Result

All findings from `review-1.md` through `review-5.md` are repaired. The
application repair is commit `69ee7e1`, pushed to `origin/main` and deployed at
<https://local-finance-export-vault.sociobot.in> on 29 August 2026 UTC.

The product keeps its Night Transfer Office visual system and original poster.
The artifact remains a static, offline PWA with browser-local financial data.

## What changed

- The first-screen sample action now uses `/?demo=1`, normalizes to `/demo`, and
  reaches two named sample exports in one click.
- Demo banner, reset, exit, in-memory data, and real-vault isolation are covered
  by outcome tests.
- Valid archives say `Dates and amounts valid`; empty state says `Your saved
  exports will appear here`. Undefined standalone `checked` copy is gone.
- `.factory/claims.json` now has 18 claims. New coverage proves password
  non-retention, independent PBKDF2-SHA-256/AES-256-GCM decryption, and durable
  archive deletion. The one-click test begins on the landing page.
- Privacy no longer claims browser-data clearing behavior. Terms no longer
  claims refunded or disputed licenses stop verifying.
- Metadata copy now uses `review` instead of an ambiguous `check` result.
- Playwright can target production with `PLAYWRIGHT_BASE_URL`; its 404 assertion
  permits only the deliberate document-level 404 network message.
- Catalog description, demo guide, copy audit, cumulative finding map, and this
  handoff are current.

## Exact verification

Fresh clone: `/tmp/lfv-polish5-clean.npZXAp/repo` at `69ee7e1`.

```bash
npm ci
# Every literal .factory/claims.json test command, run separately
npm test
npm run lint
npm run typecheck
npm run build
```

- Install: pass, zero vulnerabilities.
- Claim commands: 18/18 pass independently. See
  [claim results](polish-5-assets/claim-results.txt).
- Full clean-clone suite: 10 Vitest tests and 33 Chromium tests pass.
- Lint and typecheck: pass.
- Build: pass; `dist/index.html` exists.
- JavaScript: 49.78 kB raw / 18.18 kB gzip. CSS: 18.17 kB raw / 4.86 kB gzip.
- Local URL verifier: pass, no console errors.
- Local Lighthouse mobile: Performance 99, Accessibility 100, Best Practices
  100, SEO 100; LCP 1,905 ms, CLS 0, TBT 21 ms.

Production verification:

```bash
PLAYWRIGHT_BASE_URL=https://local-finance-export-vault.sociobot.in npx playwright test
```

- Live browser suite: 33/33 pass. This includes 18 claims, Axe scans of every
  route and 404, keyboard use, focus/scroll history, 44 px mobile targets,
  privacy request logs, demo isolation/reset, archive deletion, and offline
  service-worker reload.
- `/opt/fleet/lib/verify-url.sh`: pass on the live homepage; exact title,
  `lang=en`, one H1, main, alt text, named controls, and no console errors.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1,501 ms, CLS 0, TBT 0 ms.
- `/`, `/demo`, `/vault`, `/privacy`, and `/terms`: HTTP 200.
  `/missing-platform`: HTTP 404 with full site shell and legal links.
- Live and local `dist/index.html` SHA-256 match:
  `a0b2653c965f2e66d97f87d789c631b457a76c17b866ab2238ec82b3609921f4`.
- Checkout returns HTTP 303 to the allow-listed
  `checkout.dodopayments.com` host.

Evidence is under [polish-5-assets](polish-5-assets/) and the full cumulative
mapping is [polish-5.md](polish-5.md).

## Deploy

The deployed build was produced with `npm run build` and published with:

```bash
swa deploy dist --env production --app-name sf-local-finance-export-vault \
  --resource-group sociobot --no-use-keychain
```

The CLI-created `.env` credential file was deleted immediately after deploy and
was never staged or committed.

## Known gaps and next steps

None. No review finding of any severity remains unresolved.
