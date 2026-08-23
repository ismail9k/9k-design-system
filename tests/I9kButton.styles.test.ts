import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import postcss, { type Root, type Rule } from 'postcss';
import { describe, expect, it } from 'vitest';
import { build } from 'vite';

async function buildButtonStylesheet(): Promise<Root> {
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    plugins: [vue()],
    build: {
      write: false,
      lib: {
        entry: resolve('src/components/I9kButton.vue'),
        formats: ['es'],
        fileName: 'i9k-button',
      },
      rollupOptions: {
        external: ['vue'],
      },
    },
  });
  const outputs = (Array.isArray(result) ? result : [result]).flatMap((buildResult) =>
    'output' in buildResult ? buildResult.output : [],
  );
  const stylesheet = outputs.find(
    (output) => output.type === 'asset' && output.fileName.endsWith('.css'),
  );

  if (stylesheet?.type !== 'asset') {
    throw new Error('Vite did not emit the I9kButton stylesheet');
  }

  return postcss.parse(stylesheet.source.toString());
}

function hasDarkModeBorder(rule: Rule) {
  return rule.nodes.some(
    (node) =>
      node.type === 'decl' &&
      node.prop === 'border-color' &&
      node.value === 'var(--white-color-alpha-20)',
  );
}

describe('I9kButton compiled styles', () => {
  it('preserves dark-mode borders on every scoped Button control selector', async () => {
    const stylesheet = await buildButtonStylesheet();
    const darkBorderRules: Rule[] = [];

    stylesheet.walkRules((rule) => {
      if (hasDarkModeBorder(rule)) {
        darkBorderRules.push(rule);
      }
    });

    expect(darkBorderRules.map((rule) => rule.selector)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('.dark .i9k-button--filter'),
        expect.stringContaining('.dark .i9k-button--pagination'),
        expect.stringContaining('.dark .i9k-button--page'),
      ]),
    );
    expect(darkBorderRules.map((rule) => rule.selector)).not.toContain('.dark');
  });
});
