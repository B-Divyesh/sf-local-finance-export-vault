# Local Finance Export Vault

Preserve budget exports and make a clear migration packet on your device.

Local Finance Export Vault is for people moving between budget tools. It turns
CSV exports into a documented, vendor-neutral archive without bank access or an
account.

## What it does

- Imports YNAB, Monarch, Actual, and generic budget CSV shapes.
- Lets you review each source-to-neutral field mapping before saving.
- Validates dates and amounts and flags possible duplicate rows.
- Records SHA-256 hashes for both the original and normalized data.
- Downloads a ZIP with originals, neutral rows, a manifest, and a mapping report.
- Encrypts and reopens packets with a password using AES-256-GCM.
- Optionally encrypts each saved local archive before writing it to IndexedDB.
- Keeps sealed archives in this browser with IndexedDB.
- Runs offline after the first visit.

The demo at [`/demo`](https://local-finance-export-vault.sociobot.in/demo)
loads two realistic exports in one click. Demo rows stay in memory and are not
written to the real vault.

This tool does not connect to banks or prepare financial advice, accounts, or
tax returns. It does not certify that a vendor export is complete.

## Price

The free vault stores two archives and makes complete packets. A $12 one-time
license allows unlimited saved archives. Checkout and license verification use
the Sociobot billing API; no payment provider is embedded here.

## Run locally

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:5173` or go directly to
`http://localhost:5173/demo`.

## Test and build

```bash
npm test
npm run build
```

The exact production build command is `npm run build`. Static output lands in
`dist/`, with `dist/index.html` at its root. Preview it with `npm run preview`.

Claim tests are listed in [`.factory/claims.json`](.factory/claims.json).
The neutral schema version is `1.0.0`.

## Privacy and security notes

Financial rows are processed in the browser. Optional local encryption also
hides the file name and rows in IndexedDB until the password is entered. Only a paid license token is sent
to `api.sociobot.in` when a license is verified. Encrypted packets use PBKDF2
with SHA-256 and 250,000 iterations, then AES-256-GCM. Keep the password
somewhere separate because it cannot be recovered.

See `/privacy` and `/terms` in the app. This project uses the MIT License.
