/// <reference types="vitest/config" />

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
    alias: {
      // ShowcaseApp.vue imports the `virtual:showcase-data` module that showcase/vite-plugin-data.ts
      // resolves during `npm run showcase` / `npm run build:showcase`. That plugin isn't part of this
      // config (it belongs to the showcase's own Vite config), so under Vitest the id would otherwise
      // fail to resolve. Alias it to a minimal fixture so tests/showcaseControls.test.ts can mount
      // ShowcaseApp without pulling in the real build-time extraction pipeline.
      'virtual:showcase-data': resolve(rootDir, 'tests/fixtures/virtualShowcaseData.ts'),
    },
  },
  build: {
    assetsInlineLimit: 0,
    lib: {
      entry: resolve(rootDir, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue'],
      output: { globals: { vue: 'Vue' } },
    },
  },
});
