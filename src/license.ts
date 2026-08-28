const SLUG = 'local-finance-export-vault';
const TOKEN_KEY = `sb_license:${SLUG}`;
const CACHE_KEY = `sb_license_cache:${SLUG}`;
const DAY = 86_400_000;

interface Verdict {
  valid: boolean;
  checkedAt: number;
  reason?: string;
}

export interface LicenseState {
  unlocked: boolean;
  checking: boolean;
  message: string;
}

export const checkoutUrl = `https://api.sociobot.in/api/v1/products/${SLUG}/checkout`;

export function acceptReturnedLicense(): boolean {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return false;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.removeItem(CACHE_KEY);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  return true;
}

export function readLicenseState(): LicenseState {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return { unlocked: false, checking: false, message: '' };
  const verdict = readVerdict();
  if (!verdict) return { unlocked: false, checking: true, message: 'Checking this license…' };
  return verdict.valid
    ? { unlocked: true, checking: false, message: 'Unlimited archives are active.' }
    : { unlocked: false, checking: false, message: 'This license is no longer active.' };
}

export async function verifyLicense(force = false): Promise<LicenseState> {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return readLicenseState();
  const prior = readVerdict();
  if (!force && prior && Date.now() - prior.checkedAt < DAY) return readLicenseState();
  try {
    const response = await fetch(`https://api.sociobot.in/api/v1/products/${SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('verify unavailable');
    const data = await response.json() as { valid?: boolean; reason?: string };
    const verdict: Verdict = { valid: data.valid === true, reason: data.reason, checkedAt: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(verdict));
  } catch {
    if (!prior) return { unlocked: false, checking: false, message: 'License check is offline. Connect once to verify this license.' };
  }
  return readLicenseState();
}

export function restoreLicense(token: string): void {
  const trimmed = token.trim();
  if (trimmed.length < 8) throw new Error('That license looks incomplete. Paste the full license and try again.');
  localStorage.setItem(TOKEN_KEY, trimmed);
  localStorage.removeItem(CACHE_KEY);
}

function readVerdict(): Verdict | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) as Verdict : null;
  } catch {
    return null;
  }
}
