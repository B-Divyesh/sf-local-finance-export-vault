# Independent product verification — FAIL

Verified on **2026-08-28 UTC**.

- Candidate: `f9c434f6c73016006c8a1fcaeea9a1fd3462235f`
- Branch: `main`
- Live URL: <https://local-finance-export-vault.sociobot.in>
- Acceptance contract: `.factory/brief.json`, the supplied factory work order,
  and its claims, demo, accessibility, PWA, paid-unlock, performance,
  plain-words, and site-structure requirements
- Result: **FAIL — do not release this candidate**

The live deployment is the candidate under review. The rebuilt `index.html`,
hashed JavaScript and CSS, service worker, hero image, icons, manifest, and
other publicly served build artifacts byte-match the live responses. Key
SHA-256 prefixes are `d5cebbbc17514362` for `index.html`,
`6408feedbb4d64ed` for the JavaScript, `66010951e30e188d` for the CSS, and
`cf0c39348e5c5404` for `sw.js`.

## Release blockers

### Blocker — every command published in `claims.json` fails

After `npm ci`, every one of the ten exact `.factory/claims.json` commands was
run independently. Every command exited 1 with `Error: No tests found.` The
package script turns, for example:

```text
npm test -- --grep @claim:demo-two-exports
```

into:

```text
playwright test @claim:demo-two-exports
```

Playwright therefore treats the tag as a file filter instead of receiving a
`--grep` option. This is an explicit release blocker in the claims contract.

For diagnostic separation only, `npm run test:e2e -- --grep '@claim:'` was
also run. All ten underlying tagged tests passed. That confirms a broken
published test contract rather than ten absent product behaviors; it does not
make the required commands pass.

Several tests also do not prove their entire claims. The packet test does not
assert that an original file is present, the common-imports test covers only
Actual in that test, and the free-tier test neither attempts a third sealed
archive nor verifies a valid unlimited license.

### Blocker — the cold first screen hides what to click

Cold-read summary:

- What it does: preserves budget exports before changing apps.
- Who it is for: people changing budget apps who need a checked archive.
- Intended first click: **Try it with sample data**.

The wording is plain, and the demo works in one click once the link is found.
At a normal 1440 × 900 desktop viewport, however, the call to action begins at
`y=880` and ends at `y=928`. Its label is below the fold. The three required
facts begin at `y=960` and end at `y=1041`. A cold visitor's first visible
screen therefore does not say what to click first. Evidence:
[desktop first read](verification-assets/first-read-desktop.png).

The action is visible at 390 × 844, but the third fact is cut by the bottom of
that viewport. Evidence: [390 px home](verification-assets/home-mobile-390.png).

## High-severity defects

### Demo mode can display real financial archives under a false safety banner

Reproduced on the live deployment in a fresh browser context:

1. Open `/vault`, import and seal `private-medical-budget.csv` containing a
   `Private Clinic` row.
2. Open **Demo**. The two samples appear.
3. Choose **Start for real**. The private archive appears.
4. Open **Demo** again.

The demo now shows `private-medical-budget.csv` while its banner says
“Demo — sample data, nothing is saved” and its introduction says the demo
“never reads or saves your files.” This violates the required isolated demo
namespace and creates a privacy-confusing packet path. Evidence:
[demo showing the real archive](verification-assets/demo-real-data-leak-full.png).

The cause is observable in the SPA state: after `demoLoaded` becomes true,
returning to `/demo` skips sample reinitialization and retains the real vault
array loaded by `/vault`.

### The required encrypted local archive option is absent

The only encryption control encrypts a downloaded migration packet. Saved
archives, original CSV content, and normalized rows remain plaintext objects
in the `local-finance-export-vault` IndexedDB database. A live test read the
freshly stored fixture value back in plaintext. This does not meet the brief's
explicit “Encrypt local archive option” constraint.

### The paid purchase path is unavailable

On 2026-08-28 at 14:35 UTC, a fresh GET to the exact live buy link returned:

```text
HTTP 404
{"error":"enabled factory product","status":404}
```

The product prominently advertises “$12 one-time purchase” and “Buy unlimited
archives,” so the monetized end-to-end path is not shippable.

### Existing PWA installs can remain indefinitely stale

A controlled two-release test installed the candidate service worker, then
changed the server response from release R1 to R2 without changing `sw.js`.
After an explicit registration update and reload, the controlled page remained
R1; there was no waiting worker and no update toast. The service worker keeps
the fixed cache name `finance-vault-v1-shell` and serves navigation responses
cache-first. Ordinary app-only deployments do not change the service-worker
bytes, so Chrome finds no update and continues serving old HTML and assets.

### An invalid license can bypass the two-archive limit

During license verification the UI sets `unlocked: true` before the API result
arrives. With the verification response delayed, a fake token enabled the file
input and accepted three drafts. After the API returned `valid: false`, all
three drafts could still be sealed. The final screen simultaneously showed
“This license is no longer active,” “3 sealed archives,” and “Free limit
reached.” Server-side verification therefore does not enforce the advertised
free limit.

## Medium-severity defects

- **The documented query demo is not the demo.** A fresh visit to `/?demo=1`
  renders the landing heading, has no demo banner, and exposes two sample
  archives inside the landing workspace. `.factory/demo.md` advertises this as
  a direct demo alias.
- **Claim inventory is incomplete.** Unlisted product claims include “the demo
  never reads or saves your files,” “no analytics, ads, bank connection, or
  tracking script,” “a refund revokes the license,” and “core export and
  accessibility features remain available without a purchase.” The first is
  disproved by the navigation sequence above.
- **The footer link is broken.** `https://www.sociobot.in` fails certificate
  validation because the certificate does not cover that hostname.
- **Immutable caching is not configured.** Hashed JavaScript, CSS, icons, and
  the hero image all return `Cache-Control: public, must-revalidate,
  max-age=30`, not long-lived immutable caching as required for the PWA.
- **Several mobile targets are under 44 CSS px.** At 390 px, “Start for real”
  and footer links are 22 px high; the wordmark is 42 × 42; some navigation
  links are 35–42 px wide. Checkbox controls are visually 20 × 20, although
  two archive checkboxes have larger label areas.

## Low-severity defects

- A missing route renders the designed SPA not-found screen but responds with
  HTTP 200 instead of 404.
- Selecting a CSV and sealing an archive each replace the focused element and
  leave focus on `<body>`. In the tested mapping, keyboard users then needed
  14 Tab presses to reach **Seal archive** again. The controls remain operable,
  but async focus management is poor.

## Passing evidence

### Install, tests, type check, and build

| Check | Result |
| --- | --- |
| `npm ci` | Pass; 62 packages installed, 0 vulnerabilities |
| Ten exact commands from `.factory/claims.json` | **Fail; 10/10 exit 1, no tests found** |
| Corrected diagnostic claim run | Pass; 10/10 tagged tests |
| `npm test` | Pass; 5 unit and 15 Chromium tests |
| Type check | Pass through `tsc --noEmit` in the build |
| Lint | Not available; no lint script or config exists |
| `npm run build` | Pass; `dist/index.html` produced |

The exact production build reports 42.31 KB JavaScript (16.63 KB gzip), 16.49
KB CSS (4.53 KB gzip), and an 84.80 KB hero WebP. There are no downloaded web
fonts. These pass the static-product bundle budgets.

### Core workflow and recovery

The live one-click `/demo` path loads two archives named
`household-ynab.csv` and `travel-monarch.csv`. The inspected ZIP contained:

```text
README.txt
manifest.json
mapping-report.md
normalized-transactions.csv
originals/...-household-ynab.csv
originals/...-travel-monarch.csv
```

Its manifest contained two archives at neutral schema `1.0.0`. The live flow
also produced an AES-256-GCM envelope using PBKDF2-SHA256 with 250,000
iterations, did not expose the sample merchant string in ciphertext, rejected
a wrong password in plain words, and reopened with the correct password.

Additional live cases passed: empty CSV, headers without required mappings,
manual mapping recovery, invalid dates, duplicate rows, no archive selected,
short password validation, corrupt encrypted packet, a file over 25 MB,
three-file free-tier messaging, delete cancel/confirm, persistence after
reload, and recovery after errors.

### Privacy and browser behavior

- Full demo and real-import flows emitted no cross-origin request.
- License verification sent only the supplied token to
  `api.sociobot.in`; its CORS response allowed the product origin.
- No analytics, CDN font, ad, or tracking requests were observed.
- No console or page errors occurred on home, demo, vault, privacy, terms, or
  the SPA not-found view.
- Security responses include HSTS, CSP with `frame-ancestors 'none'`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, and a
  restrictive Permissions Policy.
- No sign-in exists, so Entra tenant verification is not applicable.

### Accessibility and responsive behavior

`/opt/fleet/lib/verify-url.sh` passed and wrote `verify.json` plus desktop and
mobile screenshots in `verification-assets/`. Playwright Axe found zero
violations of any impact, including zero serious/critical findings, on home,
demo at 390 px, a populated vault draft, privacy, terms, and not-found.

Every tested page had `lang="en"`, a route-specific title, one `<h1>`, one
`<main>`, ordered headings, and image alt text. At 390 px there was no page
overflow. Keyboard navigation, the skip link, file chooser, native selects,
details, checkboxes, buttons, and Enter/Space activation worked. Focus used a
visible 3 px jade outline. Reduced motion matched and reduced animation and
transition durations to `0.01ms` with automatic scrolling.

### PWA, performance, and rate limiting

- Manifest parsed with no browser errors; 192 px and 512 px icons returned
  200, and the 512 px icon is declared maskable.
- After service-worker installation, `/demo` reloaded offline with two sample
  archives and the visible “Offline — ready” state.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 1.0 s, LCP 1.1 s, TBT 40 ms, CLS 0, Speed Index 1.1 s, total
  transfer 127 KiB. A 4× CPU-throttled sample-data click measured 192 ms in
  Event Timing. Full report: [lighthouse.json](verification-assets/lighthouse.json).
- API rate limit passed: a burst of 150 license-verification requests returned
  30 HTTP 200 responses followed by 120 HTTP 429 responses. The first 429 was
  request index 30 and included `Retry-After: 4`.

Backend concurrency and server persistence are not applicable to this static,
local-first PWA. Library/CLI consumer installation is also not applicable. The
brief does not benefit from an AI feature; deterministic local processing is
the privacy-appropriate implementation.

## Required next actions

1. Fix every literal claims command and strengthen tests to prove each full
   claim; inventory or remove all other claim-like copy.
2. Keep demo state isolated on every SPA transition and make `/?demo=1`
   equivalent to `/demo`.
3. Add optional encryption for the persisted local archive, not only the
   downloaded packet.
4. Register and verify the live Sociobot paid product, then remove the
   verification race that temporarily grants unlimited import capacity.
5. Version the service-worker cache and use an update strategy that actually
   discovers and activates app releases.
6. Put the sample CTA and required facts inside the first desktop viewport;
   fix touch targets and post-render focus.
7. Fix the external footer URL, return a real 404 status, and give hashed
   assets long-lived immutable cache headers.
