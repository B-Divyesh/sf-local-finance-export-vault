import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { serviceWorkerVersion } from '../../vite.config';

describe('release response and update policy', () => {
  it('returns a real 404 and gives built assets immutable caching', () => {
    const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8')) as {
      navigationFallback?: unknown;
      responseOverrides: Record<string, { rewrite: string }>;
      routes: Array<{ route: string; rewrite?: string; headers?: Record<string, string> }>;
    };
    expect(config.navigationFallback).toBeUndefined();
    expect(config.responseOverrides['404'].rewrite).toBe('/404.html');
    expect(config.routes.filter((route) => route.rewrite).map((route) => route.route)).toEqual(['/demo', '/vault', '/privacy', '/terms']);
    expect(config.routes.find((route) => route.route === '/assets/*')?.headers?.['Cache-Control']).toBe('public, max-age=31536000, immutable');
  });

  it('ships the HTTP 404 as a complete site page with discoverable metadata', () => {
    const page = readFileSync('public/404.html', 'utf8');
    expect(page).toContain('<main id="main"');
    expect(page).toContain('<h1 id="not-found-title">Page not found</h1>');
    expect(page).toContain('Skip to main content');
    expect(page).toContain('aria-label="Primary navigation"');
    expect(page).toContain('aria-label="Footer navigation"');
    expect(page).toContain('property="og:title"');
    expect(page).toContain('name="twitter:card"');
    expect(page).toContain('Built by Param Factory');
  });

  it('keeps the public archive terms consistent', () => {
    const readme = readFileSync('README.md', 'utf8');
    expect(readme).toContain('original file and the standard rows');
    expect(readme).toContain('original files, standard rows, field matches');
    expect(readme).not.toMatch(/standardised (data|rows)/i);
  });

  it('keeps product copy literal, testable, and deployment-ready', () => {
    const source = readFileSync('src/main.ts', 'utf8');
    const readme = readFileSync('README.md', 'utf8');
    const manifest = readFileSync('public/manifest.webmanifest', 'utf8');
    const static404 = readFileSync('public/404.html', 'utf8');
    for (const text of [source, readme, manifest, static404]) {
      expect(text).not.toMatch(/checked archive they can understand later|clear migration packet|complete migration packets/i);
      expect(text).not.toMatch(/transfer desk|platform 01|route map|how your files move|archive desk|final stop|no service here/i);
    }
    expect(source).toContain('For people changing budget apps who want to inspect and keep their exports.');
    expect(source).toContain('The free vault stores two archives and makes migration packets with original files, standard rows, field matches, and tamper-check codes.');
    expect(static404).toContain('This page does not exist.');
    expect(readme).toContain('## Deploy');
    expect(readme).toContain('publish the `dist/` directory to the configured');
  });

  it('versions every built worker and checks navigation on the network first', () => {
    const worker = readFileSync('public/sw.js', 'utf8');
    const vite = readFileSync('vite.config.ts', 'utf8');
    expect(worker).toContain("finance-vault-__BUILD_VERSION__");
    expect(worker).toContain("keys.filter((key) => ![SHELL, RUNTIME].includes(key))");
    expect(worker.indexOf("if (request.mode === 'navigate')")).toBeLessThan(worker.indexOf('fetch(request)', worker.indexOf("if (request.mode === 'navigate')")));
    expect(vite).toContain("source.replace('__BUILD_VERSION__', version)");
    expect(serviceWorkerVersion([{ fileName: 'assets/app.js', content: 'release one' }]))
      .not.toBe(serviceWorkerVersion([{ fileName: 'assets/app.js', content: 'release two' }]));
  });
});
