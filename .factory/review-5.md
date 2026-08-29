# Adversarial first-read review 5 — FAIL

Reviewed 2026-08-29 UTC against repository commit
`be8f3a1fc75f8b499c649f7c9ada694543f28121` and the cold production site at
<https://local-finance-export-vault.sociobot.in>.

## Verdict

**FAIL.** The cold first screen is clear, the one-click demo works in an
isolated sandbox, all 16 listed claim commands pass, and the site structure is
complete. Two prior finding categories are still only partly repaired. The
claims inventory omits promises that remain in the README and live legal pages,
and the undefined word “checked” remains in the product after the round-4
repair removed it from the hero. The work-order rule makes both regressions
blocking. PASS requires zero findings and no unlisted claim.

## Findings

### F-5-1 / F-1-1 reopened — BLOCKING — The claims inventory still omits visitor promises

Every literal command in `.factory/claims.json` passes, but the inventory is
not complete. These current statements have no claim entry that states the
whole promise and no single correspondingly tagged outcome test:

| Location | Exact quote | Why this is unlisted | Concrete fix |
| --- | --- | --- | --- |
| README, demo paragraph | “The demo at `/demo` loads two realistic exports **in one click**.” | `demo-two-exports` starts directly at `/demo`; its claim and tagged test omit the one-click path from `/`. The live path works, but the promised click count can regress while the claim test stays green. | Expand `demo-two-exports` to include “in one click”; start its tagged test at `/`, click **Try it with sample data** once, and assert the two named archives. |
| README and both encryption password help texts | “Keep the password somewhere separate because it cannot be recovered.” / “The password cannot be recovered.” | Neither encryption claim states that no recovery copy or recovery path exists. The tests reject a wrong password, but do not inspect browser storage and requests for retained password or recovery material. | Add `password-recovery` with a test that encrypts both storage forms, asserts the password is absent from storage and requests, reloads, and confirms that no recovery action exists; retain the warning. |
| README, Technical details | “Encrypted migration packets use PBKDF2 with SHA-256 and 250,000 iterations, then AES-256-GCM.” | `encrypted-packet` promises only that a packet can be encrypted and reopened. Its test checks the envelope's labels and round-trips through the same implementation; it does not independently establish the quantitative algorithm claim listed in the README. | Expand the JSON claim to name PBKDF2-SHA256, 250,000 iterations, and AES-256-GCM. Independently decrypt the fixture with Web Crypto using those parameters instead of trusting the envelope labels. |
| `/privacy`, Your controls | “You can download each migration packet and remove saved archives. Clearing this site's browser data also removes them.” | Packet download is listed, but archive removal and browser-data clearing are not. No `@claim:` test removes an archive and verifies IndexedDB after reload or storage clearing. | Add `archive-removal`: save an archive, remove it through the confirmed UI, reload, and assert it is absent from IndexedDB. Test browser-data clearing separately or remove that clause. |
| `/terms`, Purchase terms | “A refunded or disputed license may stop verifying.” | No claim entry or fixture test covers license revocation after a refund or dispute. This exact sentence was also called out as unlisted in the earlier independent verification and remains live. | Remove the sentence and leave payment/refund behavior to hosted checkout terms, or add a billing fixture for a revoked token and a tagged `license-revocation` test. |

This reopens the earlier claim-coverage finding because the round-4 handoff says
only observable visitor promises remain. These promises are still visible, and
the declared clean-sandbox claim list can pass without checking them.

### F-5-2 / F-4-1 reopened — BLOCKING — Undefined “checked” wording remains

Exact live locations:

- Landing empty-state note: **“Your checked exports will appear here.”**
- Demo and saved archive status stamp: **“CHECKED.”**

Round 4 removed “checked archive” from the hero because `validation` only
checks parseable dates and amounts and flags possible duplicates. It does not
establish accounting accuracy, completeness, or correctness. The same
undefined adjective remains in the empty state and status stamp, while the
terms correctly say the product does not certify completeness. A first-time
visitor cannot tell what “checked” guarantees.

Concrete fix: change the empty-state sentence to **“Your saved exports will
appear here.”** Replace the success stamp with **“Dates and amounts valid”**
and keep **“N rows to review”** for failures. Extend the literal-copy regression
test to reject standalone “checked” status language.

## Cold first read

Fresh Chromium contexts at 390 × 844 and 1440 × 900 were opened before
scrolling, with service workers blocked for the cold read.

- What it does: preserves budget exports before changing budget apps and makes
  a migration packet.
- For whom: people changing budget apps who want to inspect and keep their
  exports.
- First action: **Try it with sample data**. The adjacent sentence says it
  loads two realistic exports in a separate demo.

The exact first-screen strings are “Preserve your budget exports before you
switch,” “For people changing budget apps who want to inspect and keep their
exports,” and “Try it with sample data.” At 390 px the action ended at 569 px
and all three facts ended at 755 px. At desktop they ended at 786 px and 891 px
inside the 900 px viewport. This gate passes.

## Copy audit

Counts treat contractions, hyphenated terms, prices, paths, commands, and
versions as one word. No sentence exceeds 22 words, no banned marketing word
appears, and all landing actions use result-naming verbs. F-5-1 and F-5-2 are
the only copy flags.

### Landing page

| Sentence, heading, label, or action | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Navigation — pass |
| Export Vault | 2 | Product label — pass |
| Demo | 1 | Navigation — pass |
| Vault | 1 | Navigation — pass |
| Privacy | 1 | Navigation — pass |
| On device | 2 | Status — `local-only` |
| Local budget export archive | 4 | Literal label — pass |
| Preserve your budget exports before you switch | 7 | H1 — pass |
| For people changing budget apps who want to inspect and keep their exports. | 13 | Audience and outcome — pass |
| Try it with sample data | 5 | Result-naming primary action — pass |
| Loads two realistic exports in a separate demo. | 8 | `demo-two-exports` |
| Runs offline after the first visit. | 6 | `offline-reload` |
| Financial rows stay in this browser. | 6 | `local-only` |
| Free for two archives. | 4 | `free-tier` |
| $12 once for unlimited archives. | 5 | `free-tier` |
| An art-deco station vault receives document cases on three brass rails. | 11 | Image alt — describes the art |
| Original poster art showing two stored budget exports. | 8 | Art caption — pass |
| Start your archive | 3 | Section heading — pass |
| Choose a budget CSV. | 4 | Instruction — pass |
| Review each field before you save it. | 7 | `field-review` |
| No sealed archives yet | 4 | Empty-state status — pass |
| Your checked exports will appear here. | 6 | **F-5-2: undefined “checked”** |
| Choose CSV files | 3 | Result-naming action — pass |
| No archives yet | 3 | Empty-state heading — pass |
| Choose a CSV to start its field review. | 8 | Empty-state instruction — pass |
| Three steps | 2 | Literal process label — pass |
| How to make a migration packet | 6 | Section heading — pass |
| Choose exports | 2 | Step heading — pass |
| Add CSV files from YNAB, Monarch, Actual, or another budget tool. | 11 | `common-imports` |
| Review field matches | 3 | Step heading — pass |
| Match each export column to the standard fields in your archive. | 11 | `field-review` |
| Download a migration packet | 4 | Step heading — pass |
| Download original files, tamper-check codes, row checks, and standard rows together. | 11 | `packet-contents` |
| Scope | 1 | Literal section label — pass |
| What the vault does not do | 6 | Section heading — pass |
| The vault does not connect to banks or change your original files. | 12 | `scope-limits` |
| Use it to document portability, not to certify accounting or tax work. | 12 | Scope limitation — pass |
| Unlimited archive storage | 3 | Literal price label — pass |
| Keep more than two archives | 5 | Price heading — pass |
| The free vault stores two archives and makes migration packets with original files, standard rows, field matches, and tamper-check codes. | 20 | `free-tier`, `packet-contents` |
| $12 one-time purchase | 3 | `free-tier` |
| Unlimited saved archives on this device. | 6 | `free-tier` |
| Buy unlimited archives | 3 | Result-naming action — pass |
| Have a license? | 3 | Form label — pass |
| Paste it here. | 3 | Form instruction — pass |
| Verify license | 2 | Result-naming action — pass |
| Payment opens in Sociobot's hosted checkout. | 6 | `billing-checkout` |
| Read purchase terms | 3 | Result-naming link — pass |
| Preserve budget exports on your device. | 6 | Footer scope — pass |
| Terms | 1 | Footer navigation — pass |
| Built by Param Factory | 4 | Provenance link — pass |
| Version 1.0 · Schema 1.0.0 · Hero art generated for this product. | 10 | Version and asset provenance — pass |

### README

| Sentence or heading | Words | Result |
| --- | ---: | --- |
| Local Finance Export Vault | 4 | Title — pass |
| Preserve budget exports and make a migration packet on your device. | 11 | Summary — `packet-contents`, `local-only` |
| Local Finance Export Vault is for people moving between budget tools. | 11 | Audience — pass |
| It turns CSV exports into a migration packet you can keep and inspect on your device. | 16 | Product outcome — covered |
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
| The demo at `/demo` loads two realistic exports in one click. | 11 | **F-5-1: one-click detail is absent from the claim/test** |
| Demo rows stay in memory and are not written to the real vault. | 13 | Demo isolation behavior is exercised, but the memory detail should be stated in the inventory |
| This tool does not connect to banks or change your original CSV files. | 13 | `scope-limits` |
| It is a portability record, not accounting, tax, legal, or financial advice. | 12 | Scope limitation — pass |
| Price | 1 | Heading — pass |
| The free vault stores two archives and makes migration packets with original files, standard rows, field matches, and tamper-check codes. | 20 | `free-tier`, `packet-contents` |
| A $12 one-time license allows unlimited saved archives. | 8 | `free-tier` |
| The purchase link opens Sociobot's hosted checkout. | 7 | `billing-checkout` |
| License verification uses the Sociobot billing API. | 7 | `license-privacy` |
| Run locally | 2 | Heading — pass |
| Requirements: Node.js 20 or newer. | 5 | Runtime requirement — pass |
| Open `http://localhost:5173` or go directly to `http://localhost:5173/demo`. | 7 | Run instruction — pass |
| Test and build | 3 | Heading — pass |
| The exact production build command is `npm run build`. | 9 | Build instruction — pass |
| Static output lands in `dist/`, with `dist/index.html` at its root. | 10 | Build instruction — pass |
| Preview it with `npm run preview`. | 6 | Run instruction — pass |
| Claim tests are listed in `.factory/claims.json`. | 6 | Test instruction; F-5-1 shows the list is incomplete |
| The standard archive format is version 1.0.0. | 7 | Version statement — pass |
| Deploy | 1 | Heading — pass |
| Run `npm run build`, then publish the `dist/` directory to the configured static host. | 14 | Deploy instruction — pass |
| `public/staticwebapp.config.json` supplies route rewrites, the HTTP 404 page, cache rules, and security headers. | 13 | Deploy instruction — verified in source |
| Deployment credentials stay with the configured host; this repository does not contain them. | 13 | Repository scope — verified |
| Privacy and security notes | 4 | Heading — pass |
| Financial rows are processed in the browser. | 7 | `local-only` |
| Optional local encryption also hides the file name and rows until the password is entered. | 15 | `encrypted-local` |
| Only a paid license token is sent to `api.sociobot.in` when a license is verified. | 14 | `license-privacy` |
| Keep the password somewhere separate because it cannot be recovered. | 10 | **F-5-1: no password-recovery claim/test** |
| Technical details | 2 | Heading — pass |
| The browser database uses IndexedDB. | 5 | `browser-persistence` |
| SHA-256 creates the tamper-check codes. | 5 | `hash-manifest` |
| Encrypted migration packets use PBKDF2 with SHA-256 and 250,000 iterations, then AES-256-GCM. | 12 | **F-5-1: quantitative algorithm claim is not stated in JSON** |
| See `/privacy` and `/terms` in the app. | 7 | Documentation pointer — pass |
| This project uses the MIT License. | 6 | License statement — `LICENSE` exists |

The terminology remains consistent: **export** is an imported source file,
**archive** is its saved record, **standard fields/rows** are mapped data,
**field matches** are the mapping choices, and **migration packet** is the
download. No jargon, metaphor, vague heading, or non-result action was found
outside F-5-2's “checked” status.

## Demo and sandbox

- The first-screen action entered `/demo` with one click. The first resulting
  screen already showed `household-ynab.csv` and `travel-monarch.csv`, each
  with four rows and YNAB/Monarch source labels.
- Expanding the first archive showed realistic entries including North Market,
  City Transit, River Energy, Groceries, Pass, and Utilities.
- The banner remained visible and read “Demo — sample data, nothing is saved,”
  with **Reset demo** and **Open my vault**. After deselecting one archive,
  Reset restored two selected samples.
- A direct fresh `/demo` context created no IndexedDB database and issued no
  cross-origin request. Entering from `/` had already opened the real vault's
  empty database on the non-demo landing workspace, but the demo replaced the
  visible state and did not read or write it while the banner was present.
- A real `review5-private.csv` archive never appeared under the demo banner.
  **Open my vault** restored it, and entering the demo again showed only the two
  samples.
- After service-worker control, the live demo reloaded with the browser offline
  and showed both samples plus “Offline — ready.”

The demo behavior itself passes. F-5-1 concerns statements omitted from the
formal claim inventory, not a reproduced data leak.

## Claims and quality gates

A fresh clone at `/tmp/lfv-review5.K4NBL7/repo` checked out the reviewed commit
and completed `npm ci` with zero vulnerabilities. Every literal JSON command
was run independently:

| Claim ID | Result |
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

The checkout test observed Sociobot's HTTP 303, allow-listed
`checkout.dodopayments.com`, and reached the hosted page. No listed test failed.
F-5-1 records claims that are missing or narrower than the current copy.

The clean clone also passed:

- `npm test`: 10 Vitest tests and 29 Chromium tests.
- `npm run lint` and `npm run typecheck`.
- `npm run build`: `dist/index.html` produced.
- JavaScript: 49.71 kB raw / 18.16 kB gzip; CSS: 18.17 kB raw / 4.86 kB gzip.

The built `index.html`, JavaScript, CSS, service worker, manifest, hero art,
and static 404 byte-match production.

## Earlier findings

Every `review-1.md` through `review-4.md`, every `polish-1.md` through
`polish-4.md`, both independent verification reports, the demo record, design
record, claims inventory, README, and prior handoff were read. Each prior
finding was checked in current source and on the live site.

| Earlier finding | Round-5 confirmation |
| --- | --- |
| F-1-1 — unlisted claims / checkout outcome | **Reopened / BLOCKING.** All declared commands pass, but current README, password help, Privacy, and Terms statements remain absent or narrower than the inventory; see F-5-1. |
| F-1-2 — incomplete HTTP 404 | Fixed. A direct missing URL returned HTTP 404 with the full header/footer, metadata, Privacy/Terms links, and “Page not found” H1. |
| F-1-3 — technical landing terms | Fixed. The landing uses standard fields/rows and tamper-check codes consistently. |
| F-1-4 — metaphor-only headings | Fixed. Purpose-bearing headings are literal and work out of context. |
| F-1-5 — ambiguous recurring price | Fixed. The first screen says “$12 once,” and the paid section says “$12 one-time purchase.” |
| F-1-6 — false empty-vault demo exit | Fixed. “Open my vault” truthfully restored the seeded real archive. |
| F-2-1 — mobile target sizes | Fixed. All visibly rendered controls measured at least 44 px at 390 px; the clipped 1 px file input is operated by its 48 px visible label. |
| F-2-2 — Back/Forward state | Fixed. Back restored the focused footer Privacy link at `scrollY=3613`; Forward restored the Privacy H1 at the top. |
| F-2-3 — incomplete home title | Fixed. The exact title is “Local Finance Export Vault — preserve budget exports.” |
| F-2-4 — inconsistent archive terminology | Fixed. Landing, README, and packet terms consistently use migration packet, standard fields/rows, and field matches. |
| F-4-1 — unsupported qualitative promises | **Reopened / BLOCKING.** The hero rewrite is fixed, but “Your checked exports” and “CHECKED” retain the same undefined promise; see F-5-2. |
| F-4-2 — decorative transit copy | Fixed. Literal product labels replaced the identified metaphors; the art-deco visual treatment remains in the design rather than purpose-bearing copy. |
| F-4-3 — missing deploy documentation | Fixed. README has a concrete Deploy section for `dist/` and the static-host configuration. |

## Structure, links, accessibility, and visual identity

- `/`, `/demo`, `/vault`, `/privacy`, and `/terms` returned 200. The deliberate
  missing URL returned a designed HTTP 404.
- Every route had `lang="en"`, one H1, one main, ordered headings, a consistent
  header/footer, route-specific title, description, canonical URL, OG/Twitter
  metadata, SVG favicon, and Apple touch icon.
- The sitemap lists all five real routes. `robots.txt`, the manifest, social
  image, icons, and every discovered internal link returned 200. Sociobot
  returned 200, and checkout returned 303 to a reachable hosted Dodo page.
- Push navigation focused and announced the new H1. Back/Forward restored focus
  and scroll. Deep links loaded their intended state.
- Live Playwright Axe scans at 390 px found zero violations on all five routes
  and the 404. No route overflowed horizontally. The factory URL verifier
  reported no homepage console errors, one H1, one main, `lang=en`, alt text,
  and named controls.
- Reduced-motion CSS removes the reveal movement. The art-deco night-vault
  palette, original poster, clipped paper tickets, brass rules, and geometric
  layout match `.factory/design.md` and are recognisable rather than a generic
  SaaS template.

No structure, routing, link, accessibility, privacy-behavior, or visual-identity
finding remains.

## Missed leverage

No missing AI, sync, import, or export feature is implied by the brief. The
product already imports the named and generic CSV forms, lets the user change
field matches, preserves originals, encrypts local archives, and downloads a
migration packet. Runtime AI would add data sharing and key setup to a
deterministic local workflow without an identified user benefit. No decorative
AI feature or provider key is present.

## What would make this perfect

Inventory and independently test every remaining promise listed in F-5-1 (or
remove the unsupported detail), then replace both “checked” strings with exact
validation or saved-state wording. Rerun all literal claim commands, the full
suite, the copy audit, and the cold live checks. PASS is appropriate only when
that rerun has zero findings.
