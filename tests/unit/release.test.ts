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
