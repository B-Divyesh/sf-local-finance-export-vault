# Adversarial first-read review 2 — FAIL

Reviewed 2026-08-28 UTC against commit
`a2e7719f156045c108d95abba2b9c064cbd95b55` and the live production site.

Verdict: **FAIL.** The cold read, demo, live product behavior, and all 16 listed
claim commands work. Two earlier findings are only partly repaired, however,
and four new structure, accessibility, and copy findings remain. The required
standard is zero findings and no untested claim.

## Cold read

Fresh Chromium contexts at 390 × 844 and 1440 × 900, before scrolling, gave
the same answers:

- What it does: preserves budget CSV exports before a switch and makes an
  archive that can be moved later.
- For whom: people changing budget apps who need a checked archive they can
  understand later.
- First click: **Try it with sample data**; the adjacent sentence says it loads
  two realistic exports in a separate demo.

The exact first-screen text was “Preserve your budget exports before you
switch”, “For people changing budget apps who need a checked archive they can
understand later”, and “Try it with sample data”. The CTA and all three facts
were above the fold at both sizes. This part passes.

Evidence: [mobile landing](review-2-assets/home-mobile.png),
[desktop landing](review-2-assets/home-desktop.png).

## Findings

### F-1-1 — BLOCKING — Reopened: checkout claim has a test entry but no outcome test

Exact claim locations:

- Landing: “Payment opens in Sociobot's hosted checkout.”
- README: “The purchase link opens Sociobot’s hosted checkout.”
- `.factory/claims.json`: “The $12 purchase link opens Sociobot's hosted checkout.”

The `@claim:billing-checkout` test only checks the link's `href`, the `$12`
label, and the sentence already rendered on the page. It never follows the
link or asserts the redirect destination. This does not prove that checkout
opens; the claim could be broken while the test remains green. The claim rules
require the observable result, not the presence of a control. This reopens the
claim-inventory finding under its original ID.

The live endpoint currently returned HTTP 303 to
`checkout.dodopayments.com`, so this is a coverage failure rather than a live
checkout outage.

Concrete fix: make `@claim:billing-checkout` request or click the Sociobot URL
without completing a purchase, assert the 303 response and the allow-listed
host in `Location`, then assert that the hosted page is reachable. Keep the
test deterministic by stopping before payment.

### F-1-6 — BLOCKING — Reopened: the demo exit still gives a false result name

Exact location: demo banner, **“Open my empty vault”**.

From a fresh context I saved `already-mine.csv` in the real vault, entered the
demo, and confirmed that the private archive stayed hidden. The banner still
said “Open my empty vault”. Activating it returned to `/vault`, where
`already-mine.csv` reappeared. The vault was not empty. The current
`@claim:demo-isolation` test reproduces this same state but asserts the
misleading label instead of rejecting it. The round-1 wording repair therefore
works only for a first-time user and is half-fixed.

Concrete fix: use **“Open my vault”**. If the intended result is specifically
an empty vault, provide an explicit, confirmed **“Start a new empty vault”**
action that cannot erase or hide existing data. Update the isolation test to
seed a real archive and assert truthful wording before returning to it.

### F-2-1 — HIGH — Mobile inline links miss the required 44 px target size

At 390 px Chromium measured:

- Landing and `/vault`, “Read purchase terms”: 127.625 × 14 px.
- `/privacy`, `privacy@sociobot.in`: 161.766 × 19 px.

These are real interactive links, but their hit areas are substantially below
the 44 px product accessibility baseline. A phone user can miss them even
though Axe reports no automated violation.

Concrete fix: give both links an inline-block or flex hit area with at least a
44 px minimum height and adequate spacing. Extend the mobile target-size test
to every visible `a`, `button`, `input`, `select`, and `summary` on `/`,
`/vault`, `/privacy`, and `/terms`, not a hand-picked subset.

### F-2-2 — MEDIUM — Back navigation discards scroll position and prior focus

Exact behavior: on the live 390 px page with reduced motion, I scrolled `/` to
`scrollY = 1600`, opened Privacy through the SPA navigation, then used browser
Back. The URL returned to `/`, but `scrollY` became `0` and focus moved to the
home H1. The site-structure contract requires Back/Forward to restore scroll
and focus. `routeChanged()` currently focuses every new H1 and scrolls every
history transition to the top, including `popstate`.

Concrete fix: before a push navigation, store `scrollY` and a stable focus
target in the current history entry. On `popstate`, render and restore that
state; only new push navigations should focus the destination H1 and start at
the top. Add an E2E test that scrolls, navigates, goes back and forward, and
checks both scroll and focus.

### F-2-3 — LOW — The home title omits the product's official name

Exact location: home `<title>` and dynamic home Open Graph title,
**“Finance Export Vault — preserve budget exports”**. The product name in the
brief, README, route titles, and accessible wordmark is **“Local Finance Export
Vault”**. The required pattern is “Product name — what it does”.

Concrete fix: use **“Local Finance Export Vault — preserve budget exports”**
for the home title and matching OG/Twitter title. It is 52 characters and
remains within the 60-character limit. Add an exact-title assertion.

### F-2-4 — LOW — The copy still changes terms and leaves jargon in primary explanations

No sentence exceeds 22 words and no banned marketing adjective appears. The
remaining issue is that the same result is called an “archive packet”,
“migration packet”, “packet”, and “ZIP”, while its mapped data is called
“neutral”, “normalized”, and “standard”. Several headings and README bullets
also require implementation knowledge.

| Exact quote/location | Why it fails first-read copy | Proposed rewrite |
| --- | --- | --- |
| Landing art: “your exports travel to one neutral archive” | “Neutral” is unexplained and differs from “standard” below. | “Original poster art: two budget exports travel into one archive.” |
| Landing H3: “Review the map” | A heading list does not say what map is reviewed. | “Review field matches” |
| Landing H3: “Make a packet” | “Packet” is not named consistently or useful out of context. | “Download a migration packet” |
| README: “archive packet” | The same output is called a migration packet elsewhere. | “It turns CSV exports into a migration packet you can keep and inspect on your device.” |
| README: “generic budget CSV shapes” | “Shapes” is developer jargon. | “Imports CSV files from YNAB, Monarch, and Actual, plus files with common date and amount columns.” |
| README: “SHA-256 hashes ... normalized data” | Two technical terms appear before their purpose is explained. | “Records tamper-check codes for both your original file and the standardised data.” |
| README: “a ZIP with originals, neutral rows, a manifest, and a mapping report” | It switches to “neutral” and lists file-format jargon rather than the result. | “Downloads one ZIP with your original files, standardised rows, field matches, and tamper-check codes.” |
| README: “using AES-256-GCM” and “writing it to IndexedDB” | Algorithms and storage APIs interrupt the primary capability list. | Use “Encrypts and reopens a migration packet with a password” and “Stores sealed archives in this browser”; move algorithm names to a defined Technical details section. |
| README: “neutral schema version” | This is a third name for the standard archive fields. | “The standard archive format is version 1.0.0.” |

Terminology to enforce: **export** for an imported source file, **archive** for
a saved source record, **standard fields/rows** for mapped data, and
**migration packet** for the downloaded ZIP. Define `SHA-256`, `AES-256-GCM`,
`PBKDF2`, and `IndexedDB` once in a technical section if they remain.

## Copy audit

Counts split displayed sentences at sentence boundaries and treat hyphenated
terms, URLs, and numbers as one word. Headings, labels, and controls are also
listed because they must work out of context. All controls on the landing page
use result-naming verbs. `F-2-4` marks every remaining copy flag.

### Landing page

| Copy | Words | Audit |
| --- | ---: | --- |
| Export Vault | 2 | Product label |
| Demo | 1 | Navigation |
| Vault | 1 | Navigation |
| Privacy | 1 | Navigation |
| On device | 2 | Status |
| A private transfer desk for your data | 7 | Visual eyebrow; job remains in H1 |
| Preserve your budget exports before you switch | 7 | Pass |
| For people changing budget apps who need a checked archive they can understand later. | 14 | Pass |
| Try it with sample data | 5 | Pass; result-naming action |
| Loads two realistic exports in a separate demo. | 8 | `demo-two-exports` |
| Runs offline after the first visit. | 6 | `offline-reload` |
| Financial rows stay in this browser. | 6 | `local-only` |
| Free for two archives. | 4 | `free-tier` |
| $12 once for unlimited archives. | 5 | `free-tier` |
| Original poster art: your exports travel to one neutral archive. | 10 | F-2-4: inconsistent “neutral” |
| Platform 01 | 2 | Decorative label |
| Start your archive | 3 | Pass |
| Choose a budget CSV. | 4 | Pass |
| Review each archive field before you save it. | 8 | `field-review` |
| No sealed archives yet | 4 | Status |
| Your checked exports will appear here. | 6 | Empty-state result |
| Choose CSV files | 3 | Pass; result-naming action |
| Your archive desk is empty | 5 | Empty-state heading |
| Choose a CSV to start its field review. | 8 | Empty-state instruction |
| Route map | 2 | Decorative label |
| How your files move | 4 | Pass |
| Choose exports | 2 | Pass |
| Add CSV files from YNAB, Monarch, Actual, or another budget tool. | 11 | `common-imports` |
| Review the map | 3 | F-2-4: unclear standalone heading |
| Match each export column to the standard fields in your archive. | 11 | `field-review` |
| Make a packet | 3 | F-2-4: inconsistent standalone heading |
| Download original files, tamper-check codes, row checks, and standard rows together. | 11 | `packet-contents` |
| Scope | 1 | Section label |
| What the vault does not do | 6 | Pass |
| The vault does not connect to banks or change your original files. | 12 | `scope-limits` |
| Use it to document portability, not to certify accounting or tax work. | 12 | Honest limitation |
| Unlimited archive storage | 3 | Section label |
| Keep more than two archives | 5 | Pass |
| The free vault stores two archives and makes complete packets. | 10 | `free-tier`, `packet-contents` |
| $12 one-time purchase | 3 | `free-tier` |
| Unlimited saved archives on this device. | 6 | `free-tier` |
| Buy unlimited archives | 3 | Pass; result-naming action |
| Have a license? | 3 | Form label |
| Paste it here. | 3 | Form instruction |
| Verify license | 2 | Pass; result-naming action |
| Payment opens in Sociobot's hosted checkout. | 6 | F-1-1: listed but outcome untested |
| Read purchase terms | 3 | Pass; result-naming link |
| Preserve budget exports on your device. | 6 | Footer summary |
| Privacy | 1 | Footer link |
| Terms | 1 | Footer link |
| Built by Param Factory | 4 | External link |
| (external site) | 2 | Accessible qualifier |
| Version 1.0 · Schema 1.0.0 · Hero art generated for this product. | 10 | Version/provenance |

### README

| Copy | Words | Audit |
| --- | ---: | --- |
| Local Finance Export Vault | 4 | Title |
| Preserve budget exports and make a clear migration packet on your device. | 12 | Pass |
| Local Finance Export Vault is for people moving between budget tools. | 11 | Pass |
| It turns CSV exports into an archive packet you can keep and inspect on your device. | 16 | F-2-4: inconsistent “archive packet” |
| What it does | 3 | Heading passes |
| Imports YNAB, Monarch, Actual, and generic budget CSV shapes. | 9 | F-2-4: “shapes” jargon |
| Lets you review each source field against the standard archive fields before saving. | 13 | `field-review` |
| Validates dates and amounts and flags possible duplicate rows. | 9 | `validation` |
| Records SHA-256 hashes for both the original and normalized data. | 10 | F-2-4: jargon and inconsistent “normalized” |
| Downloads a ZIP with originals, neutral rows, a manifest, and a mapping report. | 13 | F-2-4: jargon and inconsistent “neutral” |
| Encrypts and reopens packets with a password using AES-256-GCM. | 9 | F-2-4: algorithm in primary list |
| Optionally encrypts each saved local archive before writing it to IndexedDB. | 11 | F-2-4: storage API in primary list |
| Keeps sealed archives in this browser with IndexedDB. | 8 | F-2-4: storage API in primary list |
| Runs offline after the first visit. | 6 | `offline-reload` |
| The demo at /demo loads two realistic exports in one click. | 11 | `demo-two-exports` |
| Demo rows stay in memory and are not written to the real vault. | 13 | `demo-isolation` |
| This tool does not connect to banks or change your original CSV files. | 13 | `scope-limits` |
| It is a portability record, not accounting, tax, legal, or financial advice. | 12 | Honest limitation |
| Price | 1 | Heading passes |
| The free vault stores two archives and makes complete packets. | 10 | `free-tier`, `packet-contents` |
| A $12 one-time license allows unlimited saved archives. | 8 | `free-tier` |
| The purchase link opens Sociobot’s hosted checkout. | 7 | F-1-1: listed but outcome untested |
| License verification uses the Sociobot billing API. | 7 | `license-privacy` |
| Run locally | 2 | Heading passes |
| Requirements: Node.js 20 or newer. | 5 | Run instruction |
| Open http://localhost:5173 or go directly to http://localhost:5173/demo. | 7 | Run instruction |
| Test and build | 3 | Heading passes |
| The exact production build command is npm run build. | 9 | Build instruction |
| Static output lands in dist/, with dist/index.html at its root. | 10 | Build instruction |
| Preview it with npm run preview. | 6 | Run instruction |
| Claim tests are listed in .factory/claims.json. | 6 | Test instruction |
| The neutral schema version is 1.0.0. | 6 | F-2-4: inconsistent technical term |
| Privacy and security notes | 4 | Heading passes |
| Financial rows are processed in the browser. | 7 | `local-only` |
| Optional local encryption also hides the file name and rows in IndexedDB until the password is entered. | 17 | `encrypted-local`; define IndexedDB |
| Only a paid license token is sent to api.sociobot.in when a license is verified. | 14 | `license-privacy` |
| Encrypted packets use PBKDF2 with SHA-256 and 250,000 iterations, then AES-256-GCM. | 11 | `encrypted-packet`; move under defined technical details |
| Keep the password somewhere separate because it cannot be recovered. | 10 | Necessary warning |
| See /privacy and /terms in the app. | 7 | Documentation link |
| This project uses the MIT License. | 6 | License note |

## Demo and sandbox

- The landing CTA entered `/demo` in one click. The first resulting screen
  already showed `household-ynab.csv` and `travel-monarch.csv`, each with four
  rows and a named source format.
- The persistent banner said “Demo — sample data, nothing is saved” and showed
  Reset plus the exit action. After unchecking one sample, Reset restored the
  selection and both archives.
- Fresh direct visits to `/demo` and `/?demo=1` created no IndexedDB database.
  No cross-origin request occurred during the demo flow.
- A real `already-mine.csv` archive never appeared under the demo banner and
  reappeared after leaving demo. Its IndexedDB record was unchanged.
- After the service worker controlled `/demo`, a network-disabled mobile
  reload kept the heading and both sample archives.

The sandbox behavior passes. F-1-6 concerns only the false exit label.

Evidence: [mobile demo](review-2-assets/demo-mobile.png).

## Claims

A fresh local clone at `/tmp/tmp.3NXsjY8P9q/repo` checked out the reviewed
commit, completed `npm ci`, and ran every literal command independently.

| Claim ID | Literal command result |
| --- | --- |
| demo-two-exports | PASS |
| local-only | PASS |
| license-privacy | PASS |
| packet-contents | PASS |
| hash-manifest | PASS |
| encrypted-packet | PASS |
| common-imports | PASS |
| field-review | PASS |
| validation | PASS |
| browser-persistence | PASS |
| encrypted-local | PASS |
| demo-isolation | PASS |
| scope-limits | PASS |
| free-tier | PASS |
| billing-checkout | PASS, but inadequate assertion; see F-1-1 |
| offline-reload | PASS |

Summary: 16/16 commands exited 0. F-1-1 means the checkout outcome remains
untested despite the green command. No claim-like landing or README sentence
lacks a JSON entry; the defect is the entry's assertion quality.

## Earlier findings and handoff claims

I read `review-1.md`, `polish-1.md`, the prior `handoff.md`, and all verification
reports. Each round-1 finding was checked live and in source.

| Earlier item | Round-2 result |
| --- | --- |
| F-1-1 — unlisted claims | **Reopened / BLOCKING.** Entries now exist, but the checkout promise has no observable outcome assertion. |
| F-1-2 — incomplete real HTTP 404 | Fixed. A missing URL returns HTTP 404 with Page not found, header, footer, route links, canonical, OG/Twitter tags, and favicon. |
| F-1-3 — technical landing terms | Fixed at both exact locations. The broader remaining terminology issue is F-2-4. |
| F-1-4 — metaphoric headings | Fixed. The two exact headings are now “What the vault does not do” and “Unlimited archive storage”. |
| F-1-5 — first-screen price ambiguity | Fixed. It says “$12 once”. |
| F-1-6 — demo exit result | **Reopened / BLOCKING.** “Open my empty vault” is false when real data exists. |
| Polish R-1 — repaired 44 px edge cases | The named header, footer, checkbox, and demo targets remain at least 46/44 px. New untested inline-link misses are F-2-1. |

## Structure, links, and accessibility

- `/`, `/demo`, `/vault`, `/privacy`, and `/terms` returned 200; the missing
  route returned a designed 404. Each had one H1, one main, header/footer,
  description, canonical, OG, Twitter card, favicon, and apple-touch icon.
- Deep links loaded the correct state. New SPA navigation moved focus to the
  destination H1 and updated the polite live region. F-2-2 records the Back
  restoration failure.
- All discovered same-origin links returned 200, the deliberate missing URL
  returned 404, `mailto:` was explicit, `sociobot.in` returned 200, and the
  checkout route returned 303 to Dodo. No dead link was found.
- `robots.txt` and `sitemap.xml` were present. The sitemap lists all five real
  routes.
- Live Axe checks at 390 px on all five routes and the 404 found zero
  violations. F-2-1 records target sizes Axe does not flag.
- The supplied URL verifier passed with no console errors. Its report is at
  [verify.json](review-2-assets/verify/verify.json).
- The art-deco night transfer office is recognisable and follows the recorded
  palette, type, shape, and asset provenance. It is not a generic SaaS
  template.

## Local quality gates

- `npm test`: PASS — 8 unit tests and 28 Chromium tests.
- `npm run build`: PASS — `dist/` produced; JavaScript 48.39 kB raw / 17.87 kB
  gzip and CSS 18.09 kB raw / 4.85 kB gzip.
- Live verifier: PASS — title/lang/H1/main/alt/buttons/console basics.
- Live 390 px Axe: zero violations on every real route and the 404.

## Missed leverage

No missed AI, sync, import, or export feature is indicated by the brief. The
tool already imports the named and generic CSV forms, maps fields, preserves
originals, and exports migration packets. Runtime AI would add network and key
handling to a job that is deterministic and deliberately local. Sync would
conflict with the current local-only promise unless introduced as a separate,
explicitly optional product direction.

## What would make this perfect

Repair the two reopened blockers first: test the actual checkout redirect and
rename the demo exit so it never promises an empty vault. Then enlarge every
mobile target, restore scroll and focus through browser history, use the full
product name in the home title, and enforce one plain term for each core
concept. Re-run every literal claim command, the all-links target-size test,
the Back/Forward restoration test, and the complete copy audit. PASS is
appropriate only when that rerun produces zero findings.
