# Polish round 2 — zero-findings repair record

Repaired product commit: `1f602f8e5fafb9423879d7e6653da36f79bef591`.
Deployed at: <https://local-finance-export-vault.sociobot.in> (Azure Static Web
Apps deployment `e646c620-7219-42ee-965a-8ad2e4aa883c`, 2026-08-28 UTC).

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Made `@claim:billing-checkout` request the exact Sociobot checkout endpoint, require a 303, allow-list `checkout.dodopayments.com`, and fetch the hosted destination. | Clean-clone `npm test -- --grep @claim:billing-checkout` passed; cold live `curl` returned 303 to Dodo; [live home](polish-2-assets/live-home/screenshot-desktop.png). |
| F-1-2 | Retained the complete designed static 404 with header, footer, metadata, canonical, OG/Twitter, and “Page not found” H1. | `tests/unit/release.test.ts` passed; live `/missing-platform` returned 404; [live 404](polish-2-assets/live-404-mobile.png). |
| F-1-3 | Replaced remaining landing jargon with standard fields/rows and tamper-check codes. | `.factory/copy-audit.md`; clean-clone `@claim:field-review`, `@claim:packet-contents`, and `@claim:hash-manifest` passed; [live home](polish-2-assets/live-home/screenshot-mobile.png). |
| F-1-4 | Kept clear headings “What the vault does not do” and “Unlimited archive storage”; decorative transit labels are no longer the sole section labels. | `.factory/copy-audit.md`; cold live home check. |
| F-1-5 | Kept the explicit first-screen wording “$12 once for unlimited archives.” | Clean-clone `@claim:free-tier` passed; [live home](polish-2-assets/live-home/screenshot-mobile.png). |
| F-1-6 | Changed the demo exit to truthful “Open my vault”; it returns to existing real archives without exposing them in demo mode. | Clean-clone `@claim:demo-isolation` passed; cold live `?demo=1` normalized to `/demo`, showed two samples and “Open my vault”; [live demo](polish-2-assets/live-demo-mobile.png). |
| R-1 | Rechecked the earlier touch-target repair across all visible controls, not just hand-picked controls. | `every visible mobile control has a 44px target on every route` passed; live 390 px route check found no undersized targets. |
| F-2-1 | Added 44 px inline hit areas for purchase-terms and privacy-email links; expanded mobile control coverage to all links, buttons, inputs, selects, and summaries on every route. | `every visible mobile control has a 44px target on every route` passed; cold live Axe/mobile route check passed. |
| F-2-2 | Stored scroll position and stable focus IDs in History state; restored them on `popstate`, while new navigations still focus the destination H1. | `Back and Forward restore route scroll and focus` passed; cold live check restored `scrollY` 3645 and the focused footer Privacy link. |
| F-2-3 | Restored the official full product name in the home title and Open Graph/Twitter titles. | `routes update title and focus without console errors` passed; [live verifier](polish-2-assets/live-home/verify.json) reports `Local Finance Export Vault — preserve budget exports`. |
| F-2-4 | Standardised product wording: export, archive, standard fields/rows, field matches, and migration packet. Moved algorithm/storage names to README Technical details. | `.factory/copy-audit.md`; clean-clone full suite passed; [live home](polish-2-assets/live-home/screenshot-desktop.png). |

## Final live check

- `/?demo=1` normalized to `/demo`, with the persistent isolation banner, two
  realistic samples, Reset demo, and truthful exit action.
- `/`, `/demo`, `/vault`, `/privacy`, and `/terms` returned 200. A missing URL
  returned 404 with the full static shell.
- Cold 390 px Axe checks found no serious or critical violations on all six
  routes; every visible interactive target measured at least 44 px.
- The supplied URL verifier found no console errors, one H1, a main landmark,
  `lang="en"`, a title, and no image missing alt text.

No review finding remains unresolved.
