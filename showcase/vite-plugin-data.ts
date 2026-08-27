import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

import type { Plugin } from 'vite';

import { extractComponent } from './extract/props';

const VIRTUAL_ID = 'virtual:showcase-data';
const RESOLVED_ID = '\0' + VIRTUAL_ID;

export const showcaseData = (componentsDir = resolve('src/components')): Plugin => ({
  name: 'showcase-data',
  resolveId: (id) => (id === VIRTUAL_ID ? RESOLVED_ID : null),
  load(id) {
    if (id !== RESOLVED_ID) return null;
    const extracted = readdirSync(componentsDir)
      .filter((file) => file.endsWith('.vue'))
      .map((file) => extractComponent(join(componentsDir, file)));
    return `export const extracted = ${JSON.stringify(extracted)};`;
  },
  handleHotUpdate({ file, server }) {
    if (!file.endsWith('.vue') || !file.startsWith(componentsDir)) return;
    const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
    if (mod) server.moduleGraph.invalidateModule(mod);
  },
});
