import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

import { showcaseData } from './vite-plugin-data';

const showcaseDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: showcaseDir,
  plugins: [vue(), showcaseData()],
  build: {
    outDir: resolve(showcaseDir, '../showcase-dist'),
    emptyOutDir: true,
  },
});
