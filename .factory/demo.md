# Demo sandbox

- URL: `https://local-finance-export-vault.sociobot.in/demo`
- Local URL: `http://localhost:5173/demo`
- Direct query alias: `/?demo=1`

The demo loads `household-ynab.csv` with four household rows and
`travel-monarch.csv` with four travel rows. Both are bundled strings generated
for this product. They include categories, accounts, notes, and cleared states.

Demo data lives only in module memory. It never opens or writes the real
`local-finance-export-vault` IndexedDB database. Reloading or choosing **Reset
demo** recreates the same samples. **Start for real** discards the sample state
and opens `/vault`.

Verification can inspect both field maps, validation notes, original and
neutral SHA-256 hashes, the ZIP packet, encryption, and offline reload without
an account or network request outside the product origin.
