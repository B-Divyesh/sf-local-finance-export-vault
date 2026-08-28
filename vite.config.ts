import { defineConfig } from 'vite';
import type { OutputBundle } from 'rollup';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

export function serviceWorkerVersion(release: Array<{ fileName: string; content: string }>): string {
  return createHash('sha256').update(JSON.stringify(release)).digest('hex').slice(0, 12);
}

function versionServiceWorker() {
  return {
    name: 'version-service-worker',
    async writeBundle(_options: unknown, bundle: OutputBundle) {
      const release = Object.values(bundle).map((item) => ({
        fileName: item.fileName,
        content: item.type === 'chunk' ? item.code : String(item.source)
      })).sort((left, right) => left.fileName.localeCompare(right.fileName));
      const version = serviceWorkerVersion(release);
      const path = new URL('./dist/sw.js', import.meta.url);
      const source = await readFile(path, 'utf8');
      await writeFile(path, source.replace('__BUILD_VERSION__', version));
    }
  };
}

export default defineConfig({
  plugins: [versionServiceWorker()],
  build: {
    target: 'es2022',
    sourcemap: true,
    rollupOptions: { output: { manualChunks: undefined } }
  }
});
