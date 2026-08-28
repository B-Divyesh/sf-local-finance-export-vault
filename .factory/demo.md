# Demo sandbox

- URL: `https://local-finance-export-vault.sociobot.in/demo`
- Local URL: `http://localhost:5173/demo`
- Direct query alias: `/?demo=1` (it immediately normalizes to `/demo`)

The demo loads `household-ynab.csv` with four household rows and
`travel-monarch.csv` with four travel rows. Both are bundled strings generated
for this product. They include categories, accounts, notes, and cleared states.

Demo data lives only in module memory. Each entry to the demo replaces the
working state with fresh samples. It never opens or writes the real
`local-finance-export-vault` IndexedDB database. Reloading or choosing **Reset
demo** recreates the same samples. **Open my empty vault** discards the sample
state and opens `/vault`; the real vault is separate from the demo namespace.

Verification can inspect both field maps, validation notes, original and
neutral SHA-256 hashes, the ZIP packet, encryption, and offline reload without
an account or network request outside the product origin.
