# Adversarial first-read review 1 — FAIL

Reviewed 2026-08-28 UTC against commit 672497d6215ab3d6a8a13868acc3c70c3ddd0ade.

Verdict: FAIL. The product is understandable and tryable, but the claim inventory is incomplete, some copy is not plain, and the real HTTP 404 is outside the required site structure. PASS requires zero findings.

## Cold read

Fresh, unscrolled Chromium at 390 × 844 and 1440 × 900 gave the same answer.

- It preserves budget CSV exports before a person changes budget apps, then makes a migration packet.
- It is for people changing budget apps who need an archive they can understand later.
- Click Try it with sample data. The adjacent copy says it loads two realistic exports in a separate demo.

The CTA and all three facts were visible before scrolling at both sizes. No cold-read blocker reproduced. The art-deco transfer-desk presentation is distinct and matches the recorded visual thesis, not a generic SaaS template.

## Findings

### F-1-1 — HIGH — Unlisted claims

These exact visitor-facing product promises have no matching claims.json entry and observable sandbox test. Existing entries cover samples, local financial-row handling, named imports, packets, hashes, encryption, persistence, price, and offline use; they do not test these statements.

| Location | Exact quote | Concrete fix |
| --- | --- | --- |
| Landing archive start | “You will review each field before saving it.” | Add field-review: import a CSV, verify editable mappings, change one, seal it, then inspect the saved map; or remove the promise. |
| Landing empty state | “Choose a CSV to see its source fields, row checks, and file hash.” | Add draft-inspection testing all three outcomes; or make this a non-promissory instruction. |
| Landing limitation | “The vault does not connect to banks, score spending, prepare taxes, or change original files.” | Split into testable claims, including a before/after original-file assertion, or retain only tested limitations. |
| Landing paid ticket | “Sociobot and Dodo are the merchant of record.” | Add a checkout/merchant claim that checks the live redirect and merchant details, or remove it. |
| Landing paid ticket | “Their checkout handles payment and refunds.” | Add a sandbox-verifiable claim or replace this with a merchant-terms link. |
| README introduction | “It turns CSV exports into a documented, vendor-neutral archive without bank access or an account.” | Add a neutral-archive/no-account claim from a fresh demo context, or use narrower tested wording. |
| README capability list | “Lets you review each source-to-neutral field mapping before saving.” | Cover with field-review or remove it. |
| README price | “Checkout and license verification use the Sociobot billing API; no payment provider is embedded here.” | Add a billing-integration claim checking allowed origin/no archive data, or remove it. |

Why this matters: a visitor can rely on each sentence when deciding whether to use the vault. The claims contract requires one named sandbox test per promise; the current suite can pass while these regress.

### F-1-2 — MEDIUM — The real HTTP 404 is outside the site skeleton

A direct request to https://local-finance-export-vault.sociobot.in/missing-platform correctly returned HTTP 404, but its served 404.html has only main. It lacks the skip link, wordmark/header, Demo/Vault/Privacy navigation, footer with Privacy/Terms/build information, Open Graph tags, and Twitter card. Its exact H1 is “Wrong platform”, which does not identify a missing page out of context.

Fix: keep HTTP 404, but give 404.html the same static header/footer and metadata as application routes. Change the H1 to “Page not found”. Add an E2E assertion for the 404 status, header/footer links, and OG/Twitter metadata.

### F-1-3 — LOW — Landing uses unexplained technical terms

| Exact quote | Why / rewrite |
| --- | --- |
| “Match original columns to a documented neutral schema.” | Neutral schema is implementation terminology. Use: “Match each export column to the standard fields in your archive.” |
| “Download originals, hashes, validation notes, and neutral rows together.” | Hashes and neutral rows do not explain the result. Use: “Download your original files, a tamper-check code, row checks, and standardised rows together.” |

The README can retain exact algorithms in a labelled technical note. The landing page should explain the outcome first.

### F-1-4 — LOW — Decorative labels are not useful standalone headings

“NO ONWARD SERVICE” and “FREQUENT TRAVELLER” are metaphoric visual labels, not clear section headings. The latter does not identify an archive-limit section in a screen-reader heading list.

Fix: use “What the vault does not do” and “Unlimited archive storage”. Retain the art-deco treatment in CSS rather than the only purpose-bearing text.

### F-1-5 — LOW — First-screen price omits one-time

The first-screen fact is “Free for two archives. $12 for unlimited archives.” The paid section later says “$12 one-time purchase.” The first version can be read as recurring.

Fix: “Free for two archives. $12 once for unlimited archives.” Extend free-tier to assert that landing wording.

### F-1-6 — LOW — The demo exit action does not name its result

The demo banner says “Start for real.” It does not say where it goes or what happens to samples at the boundary between sample and personal data.

Fix: “Open my empty vault”. Extend demo-isolation to assert that wording and an empty real vault.

## Copy audit

Counts treat hyphenated terms, URLs, and numbers as one word. No sentence exceeds 22 words and no banned marketing adjective appears. F-1-3 through F-1-6 record all jargon/context/terminology flags.

### Landing page

| Copy | Words | Audit |
| --- | ---: | --- |
| Export Vault | 2 | Product label |
| Demo | 1 | Pass |
| Vault | 1 | Pass |
| Privacy | 1 | Pass |
| On device | 2 | Pass |
| A private transfer desk for your data | 7 | Metaphoric eyebrow; H1 remains plain |
| Preserve your budget exports before you switch | 7 | Pass |
| For people changing budget apps who need a checked archive they can understand later. | 14 | Pass |
| Try it with sample data | 5 | Pass |
| Loads two realistic exports in a separate demo. | 8 | Pass |
| Runs offline after the first visit. | 6 | Pass |
| Financial rows stay in this browser. | 6 | Pass |
| Free for two archives. | 4 | Pass |
| $12 for unlimited archives. | 4 | F-1-5 |
| Original poster art: your exports travel to one neutral archive. | 10 | Decorative metaphor |
| Platform 01 | 2 | Decorative label |
| Start your archive | 3 | Pass |
| Choose a budget CSV. | 4 | Pass |
| You will review each field before saving it. | 8 | F-1-1 |
| No sealed archives yet | 4 | Pass |
| Your checked exports will appear here. | 6 | Pass |
| Choose CSV files | 3 | Pass |
| Your archive desk is empty | 5 | Pass |
| Choose a CSV to see its source fields, row checks, and file hash. | 13 | F-1-1 |
| Route map | 2 | Decorative label |
| How your files move | 4 | Pass |
| Choose exports | 2 | Pass |
| Add CSV files from YNAB, Monarch, Actual, or another budget tool. | 11 | common-imports |
| Review the map | 3 | Pass |
| Match original columns to a documented neutral schema. | 8 | F-1-3 |
| Make a packet | 3 | Pass |
| Download originals, hashes, validation notes, and neutral rows together. | 9 | F-1-3 |
| No onward service | 3 | F-1-4 |
| Your exports do not become a dashboard | 7 | Pass |
| The vault does not connect to banks, score spending, prepare taxes, or change original files. | 15 | F-1-1 |
| It documents portability. | 3 | Scope statement |
| It does not certify accounting or tax correctness. | 8 | Limitation |
| Frequent traveller | 2 | F-1-4 |
| Keep more than two archives | 5 | Pass |
| The free vault stores two archives and makes complete packets. | 10 | free-tier |
| $12 one-time purchase | 3 | free-tier |
| Unlimited saved archives on this device. | 6 | free-tier |
| Buy unlimited archives | 3 | Result-naming purchase action |
| Have a license? | 3 | Pass |
| Paste it here. | 4 | Pass |
| Verify license | 2 | Pass |
| Sociobot and Dodo are the merchant of record. | 8 | F-1-1 |
| Their checkout handles payment and refunds. | 6 | F-1-1 |
| Preserve budget exports on your device. | 6 | Pass |
| Terms | 1 | Pass |
| Built by Param Factory | 4 | Pass |
| Version 1.0 · Schema 1.0.0 · Hero art generated for this product. | 10 | Build/provenance label |

### README

| Copy | Words | Audit |
| --- | ---: | --- |
| Local Finance Export Vault | 4 | Product title |
| Preserve budget exports and make a clear migration packet on your device. | 11 | Pass |
| Local Finance Export Vault is for people moving between budget tools. | 10 | Pass |
| It turns CSV exports into a documented, vendor-neutral archive without bank access or an account. | 14 | F-1-1; vendor-neutral jargon |
| Imports YNAB, Monarch, Actual, and generic budget CSV shapes. | 9 | common-imports |
| Lets you review each source-to-neutral field mapping before saving. | 9 | F-1-1; jargon |
| Validates dates and amounts and flags possible duplicate rows. | 9 | validation |
| Records SHA-256 hashes for both the original and normalized data. | 10 | hash-manifest |
| Downloads a ZIP with originals, neutral rows, a manifest, and a mapping report. | 12 | packet-contents |
| Encrypts and reopens packets with a password using AES-256-GCM. | 9 | encrypted-packet |
| Optionally encrypts each saved local archive before writing it to IndexedDB. | 11 | encrypted-local |
| Keeps sealed archives in this browser with IndexedDB. | 8 | browser-persistence |
| Runs offline after the first visit. | 6 | offline-reload |
| The demo at /demo loads two realistic exports in one click. | 11 | demo-two-exports |
| Demo rows stay in memory and are not written to the real vault. | 12 | demo-isolation |
| This tool does not connect to banks or prepare financial advice, accounts, or tax returns. | 15 | Narrow/claim as in F-1-1 |
| It does not certify that a vendor export is complete. | 10 | Limitation |
| The free vault stores two archives and makes complete packets. | 10 | free-tier |
| A $12 one-time license allows unlimited saved archives. | 9 | free-tier |
| Checkout and license verification use the Sociobot billing API; no payment provider is embedded here. | 14 | F-1-1 |
| Requirements: Node.js 20 or newer. | 5 | Run instruction |
| Open http://localhost:5173 or go directly to http://localhost:5173/demo. | 7 | Run instruction |
| The exact production build command is npm run build. | 9 | Pass |
| Static output lands in dist/, with dist/index.html at its root. | 9 | Pass |
| Preview it with npm run preview. | 6 | Pass |
| Claim tests are listed in .factory/claims.json. | 7 | Pass |
| The neutral schema version is 1.0.0. | 6 | Technical reference |
| Financial rows are processed in the browser. | 7 | local-only |
| Optional local encryption also hides the file name and rows in IndexedDB until the password is entered. | 15 | encrypted-local |
| Only a paid license token is sent to api.sociobot.in when a license is verified. | 13 | license-privacy |
| Encrypted packets use PBKDF2 with SHA-256 and 250,000 iterations, then AES-256-GCM. | 9 | encrypted-packet |
| Keep the password somewhere separate because it cannot be recovered. | 10 | Recovery warning |
| See /privacy and /terms in the app. | 6 | Pass |
| This project uses the MIT License. | 6 | Pass |

## Demo, claims, and verification

- The one-click landing CTA entered /demo. Its first screen showed household-ynab.csv and travel-monarch.csv.
- The persistent “Demo — sample data, nothing is saved” banner included Reset demo and Start for real. Reset restored two samples.
- In a fresh live context, demo mode had no IndexedDB databases and made no cross-origin requests. After service-worker installation, offline reload showed both samples and “Offline — ready”.
- A fresh clone completed npm ci. Every literal test command in claims.json passed independently: 13/13 (demo-two-exports, local-only, license-privacy, packet-contents, hash-manifest, encrypted-packet, common-imports, validation, browser-persistence, encrypted-local, demo-isolation, free-tier, offline-reload).
- The clean clone also passed npm test (7 unit tests and 25 Chromium tests) and npm run build; dist/ was produced.

## History and structure

There are no earlier review-*.md or polish-*.md files. I read verification.md, verification-2.md, demo.md, and the handoff. The earlier failed claim-command, fold, demo-leak, local-encryption, purchase, stale-worker, limit-race, touch-target, focus, query-alias, external-link, cache, and HTTP-404 findings were rechecked rather than accepted from their marked status. None regressed in this review.

Normal routes /, /demo, /vault, /privacy, and /terms had route titles, one H1, main, description, canonical, OG image, favicon, consistent header/footer, deep links, route-change focus, and live announcement. The crawler found no dead links: app routes returned 200, checkout returned 303 to Dodo, the Param Factory link returned 200, and the missing route returned 404. robots.txt and sitemap.xml were present. F-1-2 is the static-404 exception.

The brief does not imply a missing AI, sync, or import/export capability: the app already imports the named CSV forms, preserves originals, creates a mapping report/packet, and deliberately keeps financial rows local. No runtime AI feature is needed.

## What would make this perfect

Give every visitor-facing promise a named claim and clean-sandbox observable test, make the real HTTP 404 a full member of the site, and replace the remaining technical/metaphoric labels with plain result-oriented language. Then rerun the literal claims commands, the direct 404 test, and this copy audit.

