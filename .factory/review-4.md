# Adversarial first-read review 4 — FAIL

Reviewed 2026-08-28 UTC against repository commit
`8825eb29219fbf39a73207c13b89b5a677a3c236` and the cold production site at
<https://local-finance-export-vault.sociobot.in>.

## Verdict

**FAIL.** The product is clear enough to start, the demo is isolated and useful,
and every listed claim test passes. Three findings remain. PASS requires zero
findings and no untested claim.

## Findings

### F-4-1 — HIGH — Qualitative promises are not testable or listed

| Location | Exact quote | Why this fails | Concrete fix |
| --- | --- | --- | --- |
| Landing first screen | “For people changing budget apps who need a **checked archive they can understand later**.” | `validation` checks dates, amounts, and duplicates, but no claim defines “checked” or verifies that a person will understand the archive later. | “For people changing budget apps who want to inspect and keep their exports.” |
| README summary and PWA manifest description | “Preserve budget exports and make a **clear** migration packet on your device.” | “Clear” is a qualitative promise with no observable criterion or claim entry. | “Preserve budget exports and make a migration packet on your device.” |
| Landing price section and README Price | “The free vault stores two archives and makes **complete** migration packets.” | `packet-contents` verifies named files, not an undefined standard of completeness. A visitor cannot tell what “complete” adds. | “The free vault stores two archives and makes migration packets with originals, standard rows, field matches, and tamper-check codes.” |

The existing functional claims are sufficient once these unsupported adjectives
are removed. Adding subjective tests for “clear” or “understand” would not make
the wording useful.

### F-4-2 — LOW — Metaphor and decorative transit copy remain

The supplied plain-words rule prohibits metaphor, mood headings, invented lore,
and decorative labels even when a plain heading follows. These live strings
remain:

| Route/location | Exact quote | Concrete fix |
| --- | --- | --- |
| Landing hero eyebrow | “A private transfer desk for your data” | Remove it, or use “Local budget export archive.” |
| Landing art caption | “Original poster art: two budget exports travel into one archive.” | “Original poster art showing two stored budget exports.” This also avoids calling the combined result an “archive” instead of a “migration packet.” |
| Landing archive label | “Platform 01” | Delete it; “Start your archive” already names the section. |
| Landing process label | “Route map” | Replace with “Three steps.” |
| Landing process heading | “How your files move” | Replace with “How to make a migration packet.” |
| Landing empty-state heading | “Your archive desk is empty” | Replace with “No archives yet.” |
| Demo eyebrow / packet label | “Sample transfer desk” / “Final stop” | Replace with “Sample data” / “Packet download.” |
| Real vault eyebrow | “Your local transfer desk” | Replace with “Your local vault.” |
| 404 eyebrow and explanation | “No service here” / “The address does not point to an archive desk.” | Delete the eyebrow and use “This page does not exist.” |

The art-deco palette, type, geometry, and original illustration can remain. The
finding concerns words that carry no usable product information.

### F-4-3 — LOW — README does not explain deployment

Location: `README.md`, after **Test and build**. It explains that output lands in
`dist/` and how to preview it, but provides no deployment section or instruction.
The repository contract requires the README to say how to deploy.

Concrete fix: add **Deploy** and state that `npm run build` creates `dist/`, then
publish that directory to the configured static host. Mention that
`public/staticwebapp.config.json` supplies route rewrites, the HTTP 404, cache
rules, and security headers. Do not include credentials or perform deployment.

## Cold first read

Fresh Chromium contexts at 390 × 844 and 1440 × 900, before scrolling, gave the
same answers:

- What it does: preserves budget CSV exports before a budget-app switch and
  makes a migration packet.
- For whom: people changing budget apps who want a local archive they can
  inspect later.
- First action: **Try it with sample data**. The adjacent sentence says it loads
  two realistic exports in a separate demo.

The exact H1 was “Preserve your budget exports before you switch.” On mobile,
the CTA ended at y=615 and all three facts ended at y=801 within an 844 px
viewport. On desktop they ended at y=786 and y=891 within a 900 px viewport.
The required first-screen content is present, so there is no cold-read blocker.

## Copy audit

Counts split at sentence boundaries and count hyphenated terms, URLs, prices,
and versions as one word. Labels, headings, controls, alt text, and accessible
names are included because their wording also has to stand alone. No item
exceeds 22 words and no banned marketing word appears. All action controls name
a result. The only copy flags are F-4-1 and F-4-2.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Local Finance Export Vault home | 5 | Accessible link name — pass |
| Export Vault | 2 | Visible wordmark — pass |
| Demo | 1 | Navigation — pass |
| Vault | 1 | Navigation — pass |
| Privacy | 1 | Navigation — pass |
| On device | 2 | Status — pass |
| A private transfer desk for your data | 7 | F-4-2: metaphor/slogan |
| Preserve your budget exports before you switch | 7 | H1 — pass |
| For people changing budget apps who need a checked archive they can understand later. | 14 | F-4-1: undefined qualitative promise |
| Try it with sample data | 5 | Result-naming action — pass |
| Loads two realistic exports in a separate demo. | 8 | `demo-two-exports` |
| Runs offline after the first visit. | 6 | `offline-reload` |
| Financial rows stay in this browser. | 6 | `local-only` |
| Free for two archives. | 4 | `free-tier` |
| $12 once for unlimited archives. | 5 | `free-tier` |
| An art-deco station vault receives document cases on three brass rails. | 11 | Image alt — pass |
| Original poster art: two budget exports travel into one archive. | 10 | F-4-2: metaphor and inconsistent result name |
| Platform 01 | 2 | F-4-2: decorative lore |
| Start your archive | 3 | Heading — pass |
| Choose a budget CSV. | 4 | Instruction — pass |
| Review each field before you save it. | 7 | `field-review` |
| No sealed archives yet | 4 | Status — pass |
| Your checked exports will appear here. | 6 | Empty-state result — pass |
| Choose CSV files | 3 | Result-naming action — pass |
| Your archive desk is empty | 5 | F-4-2: metaphor |
| Choose a CSV to start its field review. | 8 | Empty-state instruction — pass |
| Route map | 2 | F-4-2: decorative metaphor |
| How your files move | 4 | F-4-2: vague heading |
| Choose exports | 2 | Heading — pass |
| Add CSV files from YNAB, Monarch, Actual, or another budget tool. | 11 | `common-imports` |
| Review field matches | 3 | Heading — pass |
| Match each export column to the standard fields in your archive. | 11 | `field-review` |
| Download a migration packet | 4 | Heading — pass |
| Download original files, tamper-check codes, row checks, and standard rows together. | 11 | `packet-contents` |
| Scope | 1 | Plain section label — pass |
| What the vault does not do | 6 | Heading — pass |
| The vault does not connect to banks or change your original files. | 12 | `scope-limits` |
| Use it to document portability, not to certify accounting or tax work. | 12 | Limitation — pass |
| Unlimited archive storage | 3 | Section label — pass |
| Keep more than two archives | 5 | Heading — pass |
| The free vault stores two archives and makes complete migration packets. | 11 | F-4-1: undefined “complete” |
| $12 one-time purchase | 3 | `free-tier` |
| Unlimited saved archives on this device. | 6 | `free-tier` |
| Buy unlimited archives | 3 | Result-naming action — pass |
| Have a license? | 3 | Form label — pass |
| Paste it here. | 3 | Form instruction — pass |
| Verify license | 2 | Result-naming action — pass |
| Payment opens in Sociobot's hosted checkout. | 6 | `billing-checkout` |
| Read purchase terms | 3 | Result-naming link — pass |
| Preserve budget exports on your device. | 6 | Footer scope — pass |
| Privacy | 1 | Footer navigation — pass |
| Terms | 1 | Footer navigation — pass |
| Built by Param Factory | 4 | Provenance link — pass |
| external site | 2 | Accessible qualifier — pass |
| Version 1.0 · Schema 1.0.0 · Hero art generated for this product. | 10 | Version/provenance — pass |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Local Finance Export Vault | 4 | Title — pass |
| Preserve budget exports and make a clear migration packet on your device. | 12 | F-4-1: undefined “clear” |
| Local Finance Export Vault is for people moving between budget tools. | 11 | Pass |
| It turns CSV exports into a migration packet you can keep and inspect on your device. | 16 | `packet-contents`; download outcome — pass |
| What it does | 3 | Heading — pass |
| Imports CSV files from YNAB, Monarch, and Actual, plus files with common date and amount columns. | 16 | `common-imports` |
| Lets you review each source field against the standard fields before saving. | 12 | `field-review` |
| Validates dates and amounts and flags possible duplicate rows. | 9 | `validation` |
| Records tamper-check codes for both your original file and the standard rows. | 12 | `hash-manifest` |
| Downloads one ZIP with your original files, standard rows, field matches, and tamper-check codes. | 14 | `packet-contents` |
| Encrypts and reopens a migration packet with a password. | 9 | `encrypted-packet` |
| Optionally encrypts each saved local archive. | 6 | `encrypted-local` |
| Keeps sealed archives in this browser. | 6 | `browser-persistence` |
| Runs offline after the first visit. | 6 | `offline-reload` |
| The demo at /demo loads two realistic exports in one click. | 11 | `demo-two-exports` |
| Demo rows stay in memory and are not written to the real vault. | 13 | `demo-isolation` |
| This tool does not connect to banks or change your original CSV files. | 13 | `scope-limits` |
| It is a portability record, not accounting, tax, legal, or financial advice. | 12 | Limitation — pass |
| Price | 1 | Heading — pass |
| The free vault stores two archives and makes complete migration packets. | 11 | F-4-1: undefined “complete” |
| A $12 one-time license allows unlimited saved archives. | 8 | `free-tier` |
| The purchase link opens Sociobot's hosted checkout. | 7 | `billing-checkout` |
| License verification uses the Sociobot billing API. | 7 | `license-privacy` |
| Run locally | 2 | Heading — pass |
| Requirements: Node.js 20 or newer. | 5 | Run instruction — pass |
| Open http://localhost:5173 or go directly to http://localhost:5173/demo. | 7 | Run instruction — pass |
| Test and build | 3 | Heading — pass |
| The exact production build command is npm run build. | 9 | Build instruction — pass |
| Static output lands in dist/, with dist/index.html at its root. | 10 | Build instruction; F-4-3 follows |
| Preview it with npm run preview. | 6 | Run instruction — pass |
| Claim tests are listed in .factory/claims.json. | 6 | Test instruction — pass |
| The standard archive format is version 1.0.0. | 7 | Technical note — pass |
| Privacy and security notes | 4 | Heading — pass |
| Financial rows are processed in the browser. | 7 | `local-only` |
| Optional local encryption also hides the file name and rows until the password is entered. | 15 | `encrypted-local` |
| Only a paid license token is sent to api.sociobot.in when a license is verified. | 14 | `license-privacy` |
| Keep the password somewhere separate because it cannot be recovered. | 10 | Necessary encryption warning — pass |
| Technical details | 2 | Heading — pass |
| The browser database uses IndexedDB. | 5 | Defined technical detail — pass |
| SHA-256 creates the tamper-check codes. | 5 | Defined technical detail — pass |
| Encrypted migration packets use PBKDF2 with SHA-256 and 250,000 iterations, then AES-256-GCM. | 12 | Defined technical detail; `encrypted-packet` |
| See /privacy and /terms in the app. | 7 | Documentation pointer — pass |
| This project uses the MIT License. | 6 | License note — pass |

## Demo and sandbox

- The landing action reached `/demo` in one click. Its first rendered screen
  showed `household-ynab.csv` and `travel-monarch.csv`, four rows each, with
  YNAB and Monarch source profiles.
- The persistent banner read “Demo — sample data, nothing is saved” and exposed
  **Reset demo** and **Open my vault**. Unchecking a sample and choosing Reset
  restored the selected state and both sample archives.
- A fresh live demo opened no IndexedDB database and requested only same-origin
  HTML, JavaScript, and CSS. There were no console errors.
- After saving `review4-private.csv` in the real live vault, demo mode showed
  zero copies of it and two samples. Returning through **Open my vault** restored
  the private archive; its serialized IndexedDB record was byte-for-byte
  unchanged.
- After first load and service-worker control, the live demo reloaded with the
  browser offline. Both samples and “Offline — ready” remained visible.

The demo requirement passes and is not a blocking finding.

## Claims

A fresh clone at `/tmp/lfv-review4.hj5OHN/repo` checked out the reviewed commit
and completed `npm ci`. Every literal command from `.factory/claims.json` ran
independently.

| Claim | Result |
| --- | --- |
| `demo-two-exports` | PASS |
| `local-only` | PASS |
| `license-privacy` | PASS |
| `packet-contents` | PASS |
| `hash-manifest` | PASS |
| `encrypted-packet` | PASS |
| `common-imports` | PASS |
| `field-review` | PASS |
| `validation` | PASS |
| `browser-persistence` | PASS |
| `encrypted-local` | PASS |
| `demo-isolation` | PASS |
| `scope-limits` | PASS |
| `free-tier` | PASS |
| `billing-checkout` | PASS |
| `offline-reload` | PASS |

The checkout test asserted the actual 303 from Sociobot, allow-listed the Dodo
host, and reached its hosted destination. F-4-1 records the qualitative phrases
that remain outside this otherwise complete functional inventory. No listed
claim test failed, so there is no claim-test blocker.

## Earlier findings

Every prior review, polish report, verification report, demo record, design
record, claims file, and handoff was read. Each earlier finding was checked in
the current source and on production.

| Earlier item | Round-4 confirmation |
| --- | --- |
| F-1-1 — unlisted functional claims / checkout outcome | Fixed for the named functional claims. All 16 entries have outcome tests; checkout follows the live redirect. F-4-1 is new qualitative wording, not a regression of the repaired checkout test. |
| F-1-2 — incomplete HTTP 404 | Fixed. A missing URL returned HTTP 404 with `Page not found`, header, footer, metadata, legal links, and no Axe violation. |
| F-1-3 — technical landing terms | Fixed at the named locations. The landing uses standard fields/rows and tamper-check codes. |
| F-1-4 — “No onward service” / “Frequent traveller” headings | Fixed. The two exact headings remain replaced. F-4-2 covers other metaphor/decorative text that prior reviews did not identify. |
| F-1-5 — recurring-price ambiguity | Fixed. The first screen says “$12 once”; the paid section says “$12 one-time purchase.” |
| F-1-6 — false empty-vault demo exit | Fixed. “Open my vault” restored an existing real archive truthfully. |
| R-1 / F-2-1 — mobile target sizes | Fixed. Every visible link, button, input, select, and summary on all five product routes measured at least 44 px at 390 px. |
| F-2-2 — Back/Forward state | Fixed. Live Back restored the focused footer Privacy link and `scrollY=3645`; Forward restored the Privacy H1 and top position. |
| F-2-3 — incomplete home title | Fixed. The exact title is “Local Finance Export Vault — preserve budget exports.” |
| F-2-4 — inconsistent standard-row terminology | Fixed. Landing and README consistently use “standard rows”; the regression test rejects the former “standardised” variants. |

## Structure, accessibility, privacy, and links

- `/`, `/demo`, `/vault`, `/privacy`, and `/terms` returned 200. A missing path
  returned a designed HTTP 404. Each page had `lang=en`, one H1, one main,
  ordered headings, a consistent header/footer, route-specific title,
  description, canonical, OG/Twitter metadata, favicon, and apple-touch icon.
- Direct deep links loaded their intended state. Push navigation focused the new
  H1 and announced the route title. Back and Forward restored focus and scroll.
- A crawl of all discovered links found no dead link. Same-origin pages and
  assets returned 200, the deliberate missing route returned 404, Sociobot
  returned 200, and checkout returned 303 to a reachable Dodo page. The email
  target is an explicit `mailto:` link.
- Playwright Axe scans found zero violations on every product route and the 404
  at 390 px. No route overflowed horizontally and no visible control was under
  44 px. The factory URL verifier passed with one H1, `main`, `lang`, alt text,
  named controls, and no console errors.
- The service-worker flow proved offline reload. Fresh demo traffic was
  same-origin only. Source inspection confirmed demo mode calls
  `sampleArchives()` instead of `listArchives()` and never opens IndexedDB.
- The night-station palette, art-deco geometry, clipped tickets, custom poster,
  and restrained motion match `.factory/design.md`. The visual identity is
  recognisable and not a generic SaaS template. Reduced-motion CSS removes the
  reveal movement.

## Quality gates and production parity

- Fresh-clone `npm test`: PASS — 9 unit tests and 29 Chromium tests.
- Fresh-clone `npm run build`: PASS — `dist/` produced.
- App JavaScript: 49.78 kB raw / 18.23 kB gzip, below the budget.
- The live `index.html`, JavaScript, CSS, service worker, 404, and hero art
  matched the clean build byte-for-byte.
- MIT `LICENSE`, `/privacy`, `/terms`, `robots.txt`, `sitemap.xml`, manifest,
  static-route rules, and security headers are present. README deployment
  documentation remains F-4-3.

## Missed leverage

No missing AI, sync, import, or export feature is implied by the brief. The
tool imports the named and generic CSV forms, lets a person review field
matches, preserves originals, and downloads a readable migration packet. A
runtime model would add data-sharing and key setup to a deterministic local
workflow without an identified benefit. No decorative AI or provider key is
present.

## What would make this perfect

Remove the three subjective promises or replace them with the tested facts,
replace every remaining transit metaphor/decorative label with literal product
language, and add a short README deployment section. Then rerun the copy audit,
all 16 literal claim commands, the full suite, the build, and the cold live
checks. PASS is appropriate only when that rerun has zero findings.
