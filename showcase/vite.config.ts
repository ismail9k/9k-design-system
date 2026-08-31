import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

import { showcaseData } from './vite-plugin-data';

const showcaseDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: showcaseDir,
  plugins: [vue(), showcaseData()],
  resolve: {
    // The demo stage compiles each demo's code string at runtime, which the
    // runtime-only build cannot do. The find is an exact-match regex, not the
    // plain string 'vue', because a plain string key aliases anything that starts
    // with 'vue' (e.g. 'vue/server-renderer'), which mangles subpath imports.
    alias: [{ find: /^vue$/, replacement: 'vue/dist/vue.esm-bundler.js' }],
  },
  ssr: {
    // Keep the SSR build on the same aliased entry, so prerender and hydration
    // compile demos identically.
    noExternal: ['vue'],
  },
  build: {
    outDir: resolve(showcaseDir, '../showcase-dist'),
    emptyOutDir: true,
  },
});
