# Adversarial first-read review 6 — PASS

Reviewed 2026-08-29 UTC against `d5fb44fe559f2463218a3e007579202e94deace1`
and <https://local-finance-export-vault.sociobot.in>.

## Verdict

**PASS.** No blocking, high, medium, low, copy, claim, demo, routing, or
history-regression finding was reproduced. There are no `F-6-*` findings.

## Cold first read

Fresh Chromium contexts with service workers blocked, before scrolling, gave
the same answer at 390 × 844 and 1440 × 900:

- It preserves budget CSV exports before someone switches budgeting apps and
  creates a migration packet.
- It is for people changing budget apps who want to inspect and keep exports.
- Click **Try it with sample data** first; it says it loads two realistic
  exports in a separate demo.

The exact headline is “Preserve your budget exports before you switch.” The
audience sentence is “For people changing budget apps who want to inspect and
keep their exports.” At 390 px, the action ends at y=569 and the facts at
y=755. At 1440 px, they end at y=786 and y=891 in a 900 px viewport. The
first-read blocker is not reproduced. The art-deco poster, brass rules, clipped
ticket corners, and dark-paper layout match `.factory/design.md` and are
distinct without replacing task copy.

## Copy audit

Counts treat hyphenated words, prices, URLs, commands, and versions as one
word. No landing or README sentence exceeds 22 words. No banned marketing
adjective, unexplained primary-copy jargon, inconsistent term, mood heading,
or non-result-naming product button remains. PBKDF2, SHA-256, and AES-256-GCM
are confined to the labelled README Technical details section.

### Landing page

| Text | Words | Check |
| --- | ---: | --- |
| Skip to main content | 4 | Navigation |
| Export Vault | 2 | Wordmark |
| Demo / Vault / Privacy | 1 each | Navigation |
| On device | 2 | Status |
| Local budget export archive | 4 | Literal label |
| Preserve your budget exports before you switch | 7 | H1, plain job |
| For people changing budget apps who want to inspect and keep their exports. | 13 | Audience/outcome |
| Try it with sample data | 5 | Primary result action |
| Loads two realistic exports in a separate demo. | 8 | `demo-two-exports` |
| Runs offline after the first visit. | 6 | `offline-reload` |
| Financial rows stay in this browser. | 6 | `local-only` |
| Free for two archives. $12 once for unlimited archives. | 9 | `free-tier` |
| An art-deco station vault receives document cases on three brass rails. | 11 | Image alt |
| Original poster art showing two stored budget exports. | 8 | Caption |
| Start your archive | 3 | Heading |
| Choose a budget CSV. | 4 | Instruction |
| Review each field before you save it. | 7 | `field-review` |
| No sealed archives yet | 4 | Status |
| Your saved exports will appear here. | 6 | Empty-state result |
| Choose CSV files | 3 | File action |
| No archives yet | 3 | Empty heading |
| Choose a CSV to start its field review. | 8 | Instruction |
| Three steps | 2 | Process label |
| How to make a migration packet | 6 | Heading |
| Choose exports | 2 | Step heading |
| Add CSV files from YNAB, Monarch, Actual, or another budget tool. | 11 | `common-imports` |
| Review field matches | 3 | Step heading |
| Match each export column to the standard fields in your archive. | 11 | `field-review` |
| Download a migration packet | 4 | Step heading |
| Download original files, tamper-check codes, row checks, and standard rows together. | 11 | `packet-contents` |
| Scope | 1 | Label |
| What the vault does not do | 6 | Heading |
| The vault does not connect to banks or change your original files. | 12 | `scope-limits` |
| Use it to document portability, not to certify accounting or tax work. | 12 | Limitation |
| Unlimited archive storage | 3 | Price label |
| Keep more than two archives | 5 | Heading |
| The free vault stores two archives and makes migration packets with original files, standard rows, field matches, and tamper-check codes. | 20 | `free-tier`; `packet-contents` |
| $12 one-time purchase | 3 | `free-tier` |
| Unlimited saved archives on this device. | 6 | `free-tier` |
| Buy unlimited archives | 3 | Purchase action |
| Have a license? Paste it here. | 6 | Label/instruction |
| Verify license | 2 | Result action |
| Payment opens in Sociobot's hosted checkout. | 6 | `billing-checkout` |
| Read purchase terms | 3 | Link action |
| Preserve budget exports on your device. | 6 | Footer purpose |
| Terms / Built by Param Factory | 1 / 4 | Footer |
| Version 1.0 · Schema 1.0.0 · Hero art generated for this product. | 10 | Provenance |

### README

| Text | Words | Check |
| --- | ---: | --- |
| Local Finance Export Vault | 4 | Title |
| Preserve budget exports and make a migration packet on your device. | 11 | Summary |
| Local Finance Export Vault is for people moving between budget tools. | 10 | Audience |
| It turns CSV exports into a migration packet you can keep and inspect on your device. | 16 | Purpose |
| What it does | 3 | Heading |
| Imports CSV files from YNAB, Monarch, and Actual, plus files with common date and amount columns. | 16 | `common-imports` |
| Lets you review each source field against the standard fields before saving. | 12 | `field-review` |
| Validates dates and amounts and flags possible duplicate rows. | 9 | `validation` |
| Records tamper-check codes for both your original file and the standard rows. | 12 | `hash-manifest` |
| Downloads one ZIP with your original files, standard rows, field matches, and tamper-check codes. | 14 | `packet-contents` |
| Encrypts and reopens a migration packet with a password. | 9 | `encrypted-packet` |
| Optionally encrypts each saved local archive. | 6 | `encrypted-local` |
| Keeps sealed archives in this browser. | 6 | `browser-persistence` |
| Runs offline after the first visit. | 6 | `offline-reload` |
| Choose Try it with sample data once, or open /?demo=1. | 10 | `demo-two-exports` |
| Both load two realistic exports in a separate demo. | 9 | `demo-two-exports` |
| Demo rows stay in memory and are not written to the real vault. | 12 | `demo-isolation` |
| This tool does not connect to banks or change your original CSV files. | 13 | `scope-limits` |
| It is a portability record, not accounting, tax, legal, or financial advice. | 12 | Limitation |
| Price | 1 | Heading |
| The free vault stores two archives and makes migration packets with original files, standard rows, field matches, and tamper-check codes. | 20 | `free-tier`; `packet-contents` |
| A $12 one-time license allows unlimited saved archives. | 9 | `free-tier` |
| The purchase link opens Sociobot's hosted checkout. | 7 | `billing-checkout` |
| License verification uses the Sociobot billing API. | 7 | `license-privacy` |
| Run locally | 2 | Heading |
| Requirements: Node.js 20 or newer. | 5 | Requirement |
| npm install / npm run dev | 2 / 3 | Commands |
| Open http://localhost:5173 or go directly to http://localhost:5173/demo. | 7 | Run instruction |
| Test and build | 3 | Heading |
| npm test / npm run build | 2 / 3 | Commands |
| The exact production build command is npm run build. | 9 | Build instruction |
| Static output lands in dist/, with dist/index.html at its root. | 10 | Output location |
| Preview it with npm run preview. | 6 | Preview instruction |
| Claim tests are listed in .factory/claims.json. | 7 | Verification |
| The standard archive format is version 1.0.0. | 7 | Version |
| Deploy | 1 | Heading |
| Run npm run build, then publish the dist/ directory to the configured static host. | 13 | Deployment |
| public/staticwebapp.config.json supplies route rewrites, the HTTP 404 page, cache rules, and security headers. | 12 | Deployment detail |
| Deployment credentials stay with the configured host; this repository does not contain them. | 12 | Security note |
| Privacy and security notes | 4 | Heading |
| Financial rows are processed in the browser. | 7 | `local-only` |
| Optional local encryption also hides the file name and rows until the password is entered. | 15 | `encrypted-local` |
| Only a paid license token is sent to api.sociobot.in when a license is verified. | 13 | `license-privacy` |
| Keep the password somewhere separate because it cannot be recovered. | 10 | `password-recovery` |
| Technical details | 2 | Heading |
| The browser database uses IndexedDB. | 5 | Technical fact |
| SHA-256 creates the tamper-check codes. | 5 | Technical fact |
| Encrypted migration packets use PBKDF2 with SHA-256 and 250,000 iterations, then AES-256-GCM. | 10 | `encrypted-packet` |
| See /privacy and /terms in the app. | 6 | Legal route |
| This project uses the MIT License. | 6 | License |

All claim-like README and landing sentences have an observable claim entry.
No rewrite is proposed because no copy flag was found.

## Demo, privacy, and claims

One click from landing normalizes `/?demo=1` to `/demo` and immediately shows
`household-ynab.csv` and `travel-monarch.csv`. The persistent banner says
“Demo — sample data, nothing is saved”, contains **Reset demo** and truthful
**Open my vault**, and reset restores both samples. Direct `/demo` has no
`local-finance-export-vault` IndexedDB database. The isolation test creates a
real `private-medical-budget.csv`, visits demo twice, and confirms it never
appears there. Demo requests are same-origin; the offline test reloads it with
network disabled and retains the samples and “Offline — ready.”

A clean clone ran every literal `.factory/claims.json` command separately:
all 18 passed. These are `demo-two-exports`, `local-only`,
`license-privacy`, `packet-contents`, `hash-manifest`, `encrypted-packet`,
`common-imports`, `field-review`, `validation`, `browser-persistence`,
`encrypted-local`, `demo-isolation`, `archive-removal`, `password-recovery`,
`scope-limits`, `free-tier`, `billing-checkout`, and `offline-reload`.
`billing-checkout` follows the 303 to the allow-listed reachable Dodo host.

The clean clone passed `npm ci` (zero vulnerabilities), `npm test` (10 unit
and 33 Chromium tests), `npm run lint`, `npm run typecheck`, and `npm run
build`. The full 33-test suite also passed against production. Local
`dist/index.html` SHA-256
`a0b2653c965f2e66d97f87d789c631b457a76c17b866ab2238ec82b3609921f4` exactly
matches the live homepage.

## History and structure

Every earlier `review-*.md`, `polish-*.md`, and handoff was read. The live site
and source confirm all historic findings are fixed: complete claim coverage;
full HTTP 404; plain, consistent terminology; `$12 once`; truthful demo exit;
44 px mobile targets; preserved Back/Forward focus and scroll; full official
home title; deployment docs; query demo alias; local archive encryption;
checkout handoff; free-limit race; worker versioning; caching; and the valid
Sociobot hostname. No earlier finding is merely marked fixed or regressed.

`/`, `/demo`, `/vault`, `/privacy`, and `/terms` return 200; the designed
missing route returns 404. Each route has a route-specific title, one H1,
main, description, canonical URL, OG/Twitter metadata, favicon, skip link,
consistent header/footer, and focus/announcement handling. `robots.txt` and
`sitemap.xml` are correct. All internal links and the external Sociobot and
checkout links resolve; `mailto:` is explicit. Valid routes have no console
error; only the expected document-level 404 message appears on the missing
route. Cold landing requests are same-origin only. The license privacy test
allows its one intentional Sociobot request and confirms it contains no
financial archive data.

## Missed leverage

No obvious omitted feature was found. The brief’s local import, review,
archive, and export job is complete. An AI step would be decorative and could
send financial data in a product whose core value is deterministic local
processing; it is not implied by the brief. Import and export paths exist.

## What would make this perfect

No product change is required. Keep the 18 claim tests, clean-clone checks,
and live route/privacy checks in the release workflow so a future copy,
billing, or service-worker change cannot reopen a verified condition.
