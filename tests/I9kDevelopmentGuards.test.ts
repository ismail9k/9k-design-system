import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import { describe, expect, it } from 'vitest';
import { build } from 'vite';

async function buildProductionComponent(componentName: string) {
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    mode: 'production',
    define: { 'import.meta.env.DEV': 'false' },
    plugins: [vue()],
    build: {
      write: false,
      lib: {
        entry: resolve(`src/components/${componentName}.vue`),
        formats: ['es'],
        fileName: componentName,
      },
      rollupOptions: { external: ['vue'] },
    },
  });
  const outputs = (Array.isArray(result) ? result : [result]).flatMap((buildResult) =>
    'output' in buildResult ? buildResult.output : [],
  );
  const module = outputs.find((output) => output.type === 'chunk');

  if (module?.type !== 'chunk') {
    throw new Error(`Vite did not emit the ${componentName} module`);
  }

  return module.code;
}

describe('development warning guards', () => {
  it('removes both I9kField warnings from browser production output', async () => {
    const code = await buildProductionComponent('I9kField');

    expect(code).not.toMatch(/console\.warn/);
    expect(code).not.toMatch(/process\.env/);
  });
});
