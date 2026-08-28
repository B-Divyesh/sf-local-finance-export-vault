# Local Finance Export Vault

Preserve budget exports and make a clear migration packet on your device.

Local Finance Export Vault is for people moving between budget tools. It turns
CSV exports into a migration packet you can keep and inspect on your device.

## What it does

- Imports CSV files from YNAB, Monarch, and Actual, plus files with common date and amount columns.
- Lets you review each source field against the standard fields before saving.
- Validates dates and amounts and flags possible duplicate rows.
- Records tamper-check codes for both your original file and the standard rows.
- Downloads one ZIP with your original files, standard rows, field matches, and tamper-check codes.
- Encrypts and reopens a migration packet with a password.
- Optionally encrypts each saved local archive.
- Keeps sealed archives in this browser.
- Runs offline after the first visit.

The demo at [`/demo`](https://local-finance-export-vault.sociobot.in/demo)
loads two realistic exports in one click. Demo rows stay in memory and are not
written to the real vault.

This tool does not connect to banks or change your original CSV files. It is a
portability record, not accounting, tax, legal, or financial advice.

## Price

The free vault stores two archives and makes complete migration packets. A $12 one-time
license allows unlimited saved archives. The purchase link opens Sociobot's
hosted checkout. License verification uses the Sociobot billing API.

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
The standard archive format is version `1.0.0`.

## Privacy and security notes

Financial rows are processed in the browser. Optional local encryption also
hides the file name and rows until the password is entered. Only a paid license
token is sent to `api.sociobot.in` when a license is verified. Keep the password
somewhere separate because it cannot be recovered.

### Technical details

The browser database uses IndexedDB. SHA-256 creates the tamper-check codes.
Encrypted migration packets use PBKDF2 with SHA-256 and 250,000 iterations,
then AES-256-GCM.

See `/privacy` and `/terms` in the app. This project uses the MIT License.
