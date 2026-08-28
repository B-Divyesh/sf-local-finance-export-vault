# Independent product verification — PASS

Verified on **2026-08-28 UTC** from clean commit
`94769ecfc814364943ace93ae1e247d089c6cd1d` on `main`.

- Live URL: <https://local-finance-export-vault.sociobot.in>
- Contract: `.factory/brief.json`, `.factory/claims.json`, and the supplied
  factory work order and product skills.
- Result: **PASS — candidate is releasable.**

This is a fresh verification following the earlier failed report in
`verification.md`. Product source was not modified during this verification.

## Mandatory first checks

`npm ci` completed from this clean clone (62 packages, 0 vulnerabilities).
Every literal command declared in `.factory/claims.json` was invoked in a
separate fresh Playwright run after installation and passed:

- `demo-two-exports`, `local-only`, `license-privacy`, `packet-contents`, and
  `hash-manifest`
- `encrypted-packet`, `common-imports`, `validation`, `browser-persistence`,
  and `encrypted-local`
- `demo-isolation`, `free-tier`, and `offline-reload`

Therefore the required claim-test result is **13/13 pass**. The final whole
suite also passed: 7 Vitest unit/policy tests and 25 Chromium tests.

Cold-reading the live landing page at 1440 x 900 found the answer to all three
required questions in the first screen:

- It preserves budget exports before a person switches budgeting apps.
- It is for people changing budgeting apps who need an archive they can later
  understand.
- The visible first action is **Try it with sample data**, immediately
  explained as loading two realistic exports in a separate demo.

The call to action occupies y=738–786 and the three facts end at y=891 at
1440 x 900. At 390 x 844 the call to action occupies y=567–615 and the facts
end at y=801. The first screen passes the plain-words and one-click-demo gate.

## Local release checks

| Check | Result |
| --- | --- |
| `npm test` | Pass — 7 unit/policy + 25 Chromium tests |
| `npm run lint` | Pass (`tsc --noEmit`) |
| `npm run typecheck` | Pass |
| `npm run build` | Pass; `dist/` produced |
| JS budget | 47,398 B raw / 17,450 B gzip (under 200 KB) |
| CSS budget | 18,071 B raw / 4,840 B gzip (under 50 KB) |
| Hero art | 84,802 B WebP (under 300 KB) |

The normal flow and recovery coverage in the claim and end-to-end suite
includes YNAB, Monarch, Actual, and generic CSV imports; two source archives;
neutral mapping; SHA-256 original and neutral hashes; ZIP packet creation;
packet encryption/decryption; empty/invalid/duplicate data notices; free-tier
limits; persistence; encrypted IndexedDB archives; bad password recovery;
and demo-to-real isolation.

## Production parity and live behavior

The rebuilt application matches production byte-for-byte for the principal
shipped files:

- `index.html`: `8e88303a28c0b0ebf3b1a9410c8c29201089fe062312ffec85dde3472f1470f6`
- `sw.js`: `78b4303235c364e757e7384b3e9fa982299f238f0c6b16ec8ddf402276c08377`
- JavaScript, CSS, manifest, hero art, and all three app icons also matched
  their live responses.

On the live demo, a downloaded packet contained `README.txt`, `manifest.json`,
`mapping-report.md`, `normalized-transactions.csv`, and two `originals/` CSVs.
The manifest recorded both exports at schema `1.0.0`, with 64-character
SHA-256 values for each original and normalized data. The complete demo packet
flow made no cross-origin request. A direct visit to `/?demo=1` normalized to
`/demo`, displayed the persistent demo banner, and showed two archives.

The live service worker installed, then `/demo` reloaded successfully after
the browser was set offline, showing both samples and **Offline — ready**.
The unit policy test additionally verifies that every production build stamps a
different worker version, cleans old caches, and uses network-first navigation.

## Privacy, security, commerce, and rate limit

- The demo and real-vault privacy claim tests passed: sample mode does not
  open the real IndexedDB database; financial rows do not leave the browser;
  an encrypted saved archive stores ciphertext rather than the fixture row.
- Valid application routes emitted no console or page errors. Live response
  headers include HSTS, CSP with `frame-ancestors 'none'`, `nosniff`,
  `Referrer-Policy: no-referrer`, and a restrictive Permissions Policy.
  Hashed JS/CSS and immutable assets return one-year immutable caching.
- Checkout returned HTTP 303 to hosted Dodo checkout. An invalid token returned
  the expected no-store invalid verdict. There is no sign-in, so Entra tenant
  validation is not applicable.
- A 50-request concurrent burst to the product license-verification endpoint
  produced 30 HTTP 200 and 20 HTTP 429 responses in 602 ms. The 429 responses
  included `Retry-After: 4`; the observed threshold is 30 successful requests
  per window.

## Accessibility, mobile, and performance

`/opt/fleet/lib/verify-url.sh` passed on production: title, `lang`, one h1,
main landmark, image alt text, named buttons, and no load errors. Independent
Playwright Axe scans found **zero violations**, including zero serious or
critical findings, on `/`, `/demo`, `/vault`, `/privacy`, `/terms`, and the
designed 404 route at 390 px. All valid routes had no horizontal overflow.

Keyboard testing found a 3 px jade focus outline on the skip link, Enter moved
focus to `main`, and all measured visible landing controls at 390 px were at
least 44 CSS px. With reduced motion enabled, transitions reduce to 0.01 ms.

Three fresh mobile Lighthouse runs produced Performance scores of 87, 99, and
94 (median **94**) and Accessibility 100 in every run. The first run's 87 was
an isolated lab outlier (TBT 522 ms); the following runs measured 96 ms and
298 ms TBT. Across the runs: LCP 1.48–1.53 s, CLS 0, and transfer about 132 KB.
The median clears the required 90 performance threshold.

## Findings

No release-blocking, high, medium, or low-severity defects were reproduced.
The product meets the researched job: it imports multiple budget exports,
preserves their originals and meaning in a neutral local archive, and produces
a validated migration packet without sending financial rows to a service.
