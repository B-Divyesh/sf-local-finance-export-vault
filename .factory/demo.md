# Demo sandbox

- URL: `https://local-finance-export-vault.sociobot.in/?demo=1`
- Local URL: `http://localhost:5173/?demo=1`
- Canonical demo route: `/demo` (the query URL immediately normalizes here)

The demo loads `household-ynab.csv` with four household rows and
`travel-monarch.csv` with four travel rows. Both are bundled strings generated
for this product. They include categories, accounts, notes, and cleared states.

The first-screen **Try it with sample data** action reaches the demo in one
click. Demo data lives only in module memory. Each entry replaces the
working state with fresh samples. It never opens or writes the real
`local-finance-export-vault` IndexedDB database. Reloading or choosing **Reset
demo** recreates the same samples. **Open my vault** discards the sample state
and opens `/vault`; any real archives remain separate and hidden in demo mode.

Verification can inspect both field matches, validation notes, original and
standard-row SHA-256 tamper-check codes, the migration packet, encryption, and
offline reload without an account or network request outside the product origin.
