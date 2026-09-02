import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

import type { Plugin } from 'vite';

import { extractComponent } from './extract/props';
import { extractColorTokens } from './extract/tokens';

const VIRTUAL_ID = 'virtual:showcase-data';
const RESOLVED_ID = '\0' + VIRTUAL_ID;

export const showcaseData = (
  componentsDir = resolve('src/components'),
  tokensFile = resolve('src/styles/tokens.css'),
): Plugin => ({
  name: 'showcase-data',
  resolveId: (id) => (id === VIRTUAL_ID ? RESOLVED_ID : null),
  load(id) {
    if (id !== RESOLVED_ID) return null;
    const extracted = readdirSync(componentsDir)
      .filter((file) => file.endsWith('.vue'))
      .map((file) => extractComponent(join(componentsDir, file)));
    const colorTokens = extractColorTokens(tokensFile);
    return [
      `export const extracted = ${JSON.stringify(extracted)};`,
      `export const colorTokens = ${JSON.stringify(colorTokens)};`,
    ].join('\n');
  },
  handleHotUpdate({ file, server, modules }) {
    const isSource = file.endsWith('.vue') && file.startsWith(componentsDir);
    if (!isSource && file !== tokensFile) return;
    const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
    if (!mod) return;
    server.moduleGraph.invalidateModule(mod);
    // `modules` is whatever Vite computed as the changed file's own importers (its demo preview,
    // etc.) — keep those so the component's normal HMR still works. The virtual module has no
    // static import edge back to the .vue file (its content comes from a readdir + extraction at
    // load time), so it would never be included otherwise, and its props/emits/slots tables would
    // stay stale until a manual reload. Add it to the returned set; since nothing calls
    // `import.meta.hot.accept()` for `virtual:showcase-data`, Vite's client runtime can't find an
    // accept boundary for it and falls back to a full reload, which is what we want here.
    return [...modules, mod];
  },
});
