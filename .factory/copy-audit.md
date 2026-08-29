# Copy audit

Audited 29 August 2026 after polish round 5. Counts treat contractions,
hyphenated terms, prices, and versions as one word. The landing page has no
sentence over 22 words, no banned marketing words, no metaphor-led label, and
no qualitative promise outside the claim inventory.

| Landing sentence or label | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Navigation |
| Export Vault | 2 | Product label |
| Demo / Vault / Privacy | 1 each | Navigation |
| On device | 2 | Status |
| Local budget export archive | 4 | Literal eyebrow |
| Preserve your budget exports before you switch | 7 | H1 |
| For people changing budget apps who want to inspect and keep their exports. | 13 | Audience and outcome |
| Try it with sample data | 5 | Primary action; `demo-two-exports` |
| Loads two realistic exports in a separate demo. | 8 | `demo-two-exports` |
| Runs offline after the first visit. | 6 | `offline-reload` |
| Financial rows stay in this browser. | 6 | `local-only` |
| Free for two archives. $12 once for unlimited archives. | 9 | `free-tier` |
| An art-deco station vault receives document cases on three brass rails. | 11 | Image alt |
| Original poster art showing two stored budget exports. | 8 | Art caption |
| Start your archive | 3 | Workspace heading |
| Choose a budget CSV. Review each field before you save it. | 11 | `field-review` |
| No sealed archives yet | 4 | Empty state status |
| Your saved exports will appear here. | 6 | Saved-state description |
| Choose CSV files | 3 | File action |
| No archives yet | 3 | Empty state heading |
| Choose a CSV to start its field review. | 8 | Empty state instruction |
| Dates and amounts valid | 4 | Exact `validation` result |
| N rows to review | 4 | Exact `validation` result |
| Three steps | 2 | Process label |
| How to make a migration packet | 6 | Process heading |
| Choose exports | 2 | Step heading |
| Add CSV files from YNAB, Monarch, Actual, or another budget tool. | 11 | `common-imports` |
| Review field matches | 3 | Step heading |
| Match each export column to the standard fields in your archive. | 11 | `field-review` |
| Download a migration packet | 4 | Step heading |
| Download original files, tamper-check codes, row checks, and standard rows together. | 11 | `packet-contents` |
| Scope | 1 | Section label |
| What the vault does not do | 6 | Scope heading |
| The vault does not connect to banks or change your original files. | 12 | `scope-limits` |
| Use it to document portability, not to certify accounting or tax work. | 12 | Limitation |
| Unlimited archive storage | 3 | Price label |
| Keep more than two archives | 5 | Price heading |
| The free vault stores two archives and makes migration packets with original files, standard rows, field matches, and tamper-check codes. | 20 | `free-tier`, `packet-contents` |
| $12 one-time purchase | 3 | `free-tier` |
| Unlimited saved archives on this device. | 6 | `free-tier` |
| Buy unlimited archives | 3 | Purchase action |
| Have a license? Paste it here. | 6 | Form label and instruction |
| Verify license | 2 | License action |
| Payment opens in Sociobot's hosted checkout. | 6 | `billing-checkout` |
| Read purchase terms | 3 | Legal link |
| Preserve budget exports on your device. | 6 | Footer scope |
| Terms / Built by Param Factory | 1 / 4 | Footer navigation and provenance |
| Version 1.0 · Schema 1.0.0 · Hero art generated for this product. | 10 | Build and asset provenance |

## README audit

The README summary reads: “Preserve budget exports and make a migration packet
on your device.” The demo paragraph names both the one-click first-screen action
and its direct `/?demo=1` URL. The price description names the exact packet
contents instead of promising an undefined “complete” result. The encryption
warning is covered by `password-recovery`, and the quantitative algorithm
sentence is covered by the independently decrypted `encrypted-packet` test.
The **Deploy** section states that `npm run build` produces `dist/` and that the
configured static host publishes it with the route, 404, cache, and header rules.

No README sentence is over 22 words. It contains none of the banned marketing
words. Public-facing terms remain consistent with the table below.

## Terminology

| Concept | One term used |
| --- | --- |
| Imported source file and its saved record | export / archive |
| Download containing one or more archives | migration packet |
| Standard destination fields and mapped values | standard fields / standard rows |
| Original-to-standard column choices | field matches |
| Non-persistent sample environment | demo |
| Completed immutable archive snapshot | sealed archive |
