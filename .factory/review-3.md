# Adversarial first-read review 3 — FAIL

Reviewed 2026-08-28 UTC against c5422f896ad4a28ddb176d7769ea0fe3ee55bcef
and the cold live site at https://local-finance-export-vault.sociobot.in.

## Verdict

**FAIL.** One earlier terminology finding remains in the current README. The
contract requires zero findings and says an unfixed earlier finding is blocking.

## Cold read

Fresh unscrolled Chromium at 390 x 844 and 1440 x 900 answered all three
required questions:

- It preserves budget exports before a budget-app switch and makes a migration
  packet.
- It is for people changing budget apps who need a checked archive.
- Click **Try it with sample data**; adjacent text says, “Loads two realistic
  exports in a separate demo.”

The exact H1 was “Preserve your budget exports before you switch.” At 390 px,
the CTA was y=567–615 and facts ended at y=801. At desktop, the CTA was
y=738–786 and facts ended at y=891. This is not a cold-read blocker. The
night-transfer-office poster, brass rules, clipped tickets, and dark-paper
palette match design.md and are not a generic SaaS treatment.

## Findings

### F-2-4 — BLOCKING — Reopened: README gives one result two names

polish-2.md says terminology was standardised to “standard fields/rows.”
The checked README and source still say:

| Location | Exact quote | Why a visitor is misled | Concrete fix |
| --- | --- | --- | --- |
| README, What it does | “Records tamper-check codes for both your original file and the **standardised data**.” | The landing page calls this result “standard rows.” A reader cannot tell if this is another retained output. | “Records tamper-check codes for both your original file and the **standard rows**.” |
| README, What it does | “Downloads one ZIP with your original files, **standardised rows**, field matches, and tamper-check codes.” | The same output changes from “standard rows” to “standardised rows.” This regresses the one-term rule. | “Downloads one ZIP with your original files, **standard rows**, field matches, and tamper-check codes.” |

This is copy-only, but it is blocking under the explicit earlier-finding rule.

## Copy audit

Counts treat $12, hyphenated terms, and versions as one word. All copy is at
or below 22 words. No banned marketing adjective or non-result-naming button
was found. The two bolded F-2-4 entries are the only flags.

### Landing page

| Copy | Words | Audit |
| --- | ---: | --- |
| Export Vault; Demo; Vault; Privacy; On device | 2; 1; 1; 1; 2 | Labels — pass |
| A private transfer desk for your data | 7 | Eyebrow; plain H1 follows |
| Preserve your budget exports before you switch | 7 | H1 — pass |
| For people changing budget apps who need a checked archive they can understand later. | 14 | Pass |
| Try it with sample data | 5 | Result-naming action — pass |
| Loads two realistic exports in a separate demo. | 8 | demo-two-exports |
| Runs offline after the first visit. | 6 | offline-reload |
| Financial rows stay in this browser. | 6 | local-only |
| Free for two archives. | 4 | free-tier |
| $12 once for unlimited archives. | 5 | free-tier |
| Original poster art: two budget exports travel into one archive. | 10 | Art caption — pass |
| Platform 01; Start your archive | 2; 3 | Decorative label; clear H2 follows |
| Choose a budget CSV. | 4 | field-review |
| Review each field before you save it. | 8 | field-review |
| No sealed archives yet; Your checked exports will appear here. | 4; 6 | Empty state — pass |
| Choose CSV files | 3 | Result-naming action — pass |
| Your archive desk is empty; Choose a CSV to start its field review. | 5; 9 | Empty state — pass |
| Route map; How your files move; Choose exports | 2; 4; 2 | Labels/headings — pass |
| Add CSV files from YNAB, Monarch, Actual, or another budget tool. | 11 | common-imports |
| Review field matches | 3 | Heading — pass |
| Match each export column to the standard fields in your archive. | 11 | field-review |
| Download a migration packet | 4 | Result heading — pass |
| Download original files, tamper-check codes, row checks, and standard rows together. | 11 | packet-contents |
| Scope; What the vault does not do | 1; 6 | Label/heading — pass |
| The vault does not connect to banks or change your original files. | 12 | scope-limits |
| Use it to document portability, not to certify accounting or tax work. | 12 | Honest limitation — pass |
| Unlimited archive storage; Keep more than two archives | 3; 5 | Label/heading — pass |
| The free vault stores two archives and makes complete migration packets. | 11 | free-tier, packet-contents |
| $12 one-time purchase; Unlimited saved archives on this device. | 3; 6 | free-tier |
| Buy unlimited archives | 3 | Result-naming action — pass |
| Have a license?; Paste it here.; Verify license | 3; 3; 2 | Form label/action — pass |
| Payment opens in Sociobot's hosted checkout. | 6 | billing-checkout |
| Read purchase terms | 3 | Result-naming link — pass |
| Preserve budget exports on your device. | 6 | Footer summary — pass |
| Terms; Built by Param Factory | 1; 4 | Footer navigation — pass |
| Version 1.0 · Schema 1.0.0 · Hero art generated for this product. | 10 | Provenance — pass |

### README

| Copy | Words | Audit |
| --- | ---: | --- |
| Local Finance Export Vault | 4 | Title — pass |
| Preserve budget exports and make a clear migration packet on your device. | 12 | Summary — pass |
| Local Finance Export Vault is for people moving between budget tools. | 11 | Pass |
| It turns CSV exports into a migration packet you can keep and inspect on your device. | 16 | packet-contents, browser-persistence |
| What it does | 3 | Heading — pass |
| Imports CSV files from YNAB, Monarch, and Actual, plus files with common date and amount columns. | 16 | common-imports |
| Lets you review each source field against the standard fields before saving. | 12 | field-review |
| Validates dates and amounts and flags possible duplicate rows. | 9 | validation |
| Records tamper-check codes for both your original file and the standardised data. | 12 | **F-2-4** |
| Downloads one ZIP with your original files, standardised rows, field matches, and tamper-check codes. | 14 | **F-2-4** |
| Encrypts and reopens a migration packet with a password. | 9 | encrypted-packet |
| Optionally encrypts each saved local archive. | 6 | encrypted-local |
| Keeps sealed archives in this browser. | 6 | browser-persistence |
| Runs offline after the first visit. | 6 | offline-reload |
| The demo at /demo loads two realistic exports in one click. | 11 | demo-two-exports |
| Demo rows stay in memory and are not written to the real vault. | 12 | demo-isolation |
| This tool does not connect to banks or change your original CSV files. | 13 | scope-limits |
| It is a portability record, not accounting, tax, legal, or financial advice. | 12 | Limitation — pass |
| Price | 1 | Heading — pass |
| The free vault stores two archives and makes complete migration packets. | 11 | free-tier, packet-contents |
| A $12 one-time license allows unlimited saved archives. | 8 | free-tier |
| The purchase link opens Sociobot’s hosted checkout. | 7 | billing-checkout |
| License verification uses the Sociobot billing API. | 7 | license-privacy |
| Run locally; Requirements: Node.js 20 or newer. | 2; 5 | Run instructions — pass |
| Open http://localhost:5173 or go directly to http://localhost:5173/demo. | 7 | Run instruction — pass |
| Test and build; The exact production build command is npm run build. | 3; 9 | Build instructions — pass |
| Static output lands in dist/, with dist/index.html at its root. | 10 | Build instruction — pass |
| Preview it with npm run preview. | 6 | Build instruction — pass |
| Claim tests are listed in .factory/claims.json. | 6 | Test instruction — pass |
| The standard archive format is version 1.0.0. | 7 | Technical note — pass |
| Privacy and security notes | 4 | Heading — pass |
| Financial rows are processed in the browser. | 7 | local-only |
| Optional local encryption also hides the file name and rows until the password is entered. | 14 | encrypted-local |
| Only a paid license token is sent to api.sociobot.in when a license is verified. | 14 | license-privacy |
| Keep the password somewhere separate because it cannot be recovered. | 10 | Necessary warning — pass |
| Technical details; The browser database uses IndexedDB. | 2; 5 | Defined technical detail — pass |
| SHA-256 creates the tamper-check codes. | 5 | Defined technical detail — pass |
| Encrypted migration packets use PBKDF2 with SHA-256 and 250,000 iterations, then AES-256-GCM. | 11 | Technical detail; encrypted-packet |
| See /privacy and /terms in the app. | 7 | Documentation link — pass |
| This project uses the MIT License. | 6 | License note — pass |

## Demo and sandbox

- The one-click CTA reached /demo; its first screen showed household-ynab.csv
  and travel-monarch.csv, four rows each, with source profiles.
- The persistent banner read “Demo — sample data, nothing is saved,” with
  **Reset demo** and **Open my vault**. Reset restored an unchecked sample.
- A fresh /demo context had no vault IndexedDB database and requested only
  product-origin HTML, JS, CSS, and art.
- After sealing review3-private.csv in the real vault, demo showed zero copies
  of it; leaving demo restored the real archive without a record change.
- offline-reload passed from the clean clone, including a controlled service
  worker, a network-disabled reload, samples, and “Offline — ready.”

## Claims and local verification

A new clone at /tmp/finance-vault-review-3.pqGdQr/repo completed npm ci. Every
literal claims command passed independently: demo-two-exports, local-only,
license-privacy, packet-contents, hash-manifest, encrypted-packet,
common-imports, field-review, validation, browser-persistence, encrypted-local,
demo-isolation, scope-limits, free-tier, billing-checkout, and offline-reload.

npm test passed (8 unit, 29 Chromium). npm run build passed and produced dist/;
app JavaScript is 49,775 bytes raw / 18,230 bytes gzip. A first suite attempt
encountered an orphaned local preview process from an interrupted command; once
that process was gone, the normal clean-clone command passed.

No other claim-like landing or README sentence lacked a claims.json entry. The
tested checkout asserts the actual 303 and reachable Dodo destination.

## Earlier findings and structure

I read every prior review, polish report, verification report, demo record,
design record, claims file, and handoff.

| Earlier item | Current result |
| --- | --- |
| F-1-1 claim coverage | Fixed: all retained landing/README promises have tested outcomes. |
| F-1-2 static 404 | Fixed: direct missing URL is HTTP 404 with full designed shell and metadata. |
| F-1-3 technical landing terms | Fixed at the named landing locations. |
| F-1-4 metaphoric headings | Fixed: meaningful headings remain. |
| F-1-5 one-time price | Fixed: first screen says “$12 once.” |
| F-1-6 demo exit | Fixed: “Open my vault” is truthful with existing data. |
| R-1 / F-2-1 mobile target sizes | Fixed: every visible live control measured at least 44 px at 390 px. |
| F-2-2 history state | Fixed: live Back restored focused footer Privacy and scrollY 3645. |
| F-2-3 home title | Fixed: “Local Finance Export Vault — preserve budget exports.” |
| F-2-4 terminology | **Reopened / BLOCKING** as documented above. |

/, /demo, /vault, /privacy, and /terms returned 200; a missing URL returned
404. At 390 px every route had lang, one H1, main, route title, description,
canonical, OG/Twitter metadata, favicon, header/footer, no overflow, no
serious/critical Axe issue, and no undersized visible control. Deep links,
focus/announcement, and Back passed. Crawled app links, robots, sitemap,
Sociobot, and the hosted checkout were reachable; mail is explicit.

Cold landing/demo logs had no cross-origin request. There are no third-party
fonts/scripts. The only intentional external product request is licence
verification to Sociobot, which license-privacy asserts carries only its token.

## Missed leverage

No missing AI, sync, import, or export feature was found. The brief's local CSV
import, review, archive, checks, and packet-download workflow is present. AI
would add data-sharing/key setup to a deterministic local task without a stated
benefit; no decorative AI or provider key is present.

## What would make this perfect

Replace the two README phrases “standardised data/rows” with “standard rows,”
then rerun the terminology audit and npm test. That is the only remaining item
before a zero-findings PASS.

