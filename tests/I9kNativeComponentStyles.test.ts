import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import postcss, { type Root, type Rule } from 'postcss';
import { describe, expect, it } from 'vitest';
import { build } from 'vite';

async function buildComponentStylesheet(componentName: string): Promise<Root> {
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    plugins: [vue()],
    build: {
      write: false,
      lib: {
        entry: resolve(`src/components/${componentName}.vue`),
        formats: ['es'],
        fileName: componentName,
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
    throw new Error(`Vite did not emit the ${componentName} stylesheet`);
  }

  return postcss.parse(stylesheet.source.toString());
}

function hasDeclaration(rule: Rule, property: string, value: string) {
  return rule.nodes.some(
    (node) => node.type === 'decl' && node.prop === property && node.value === value,
  );
}

describe('native component compiled styles', () => {
  it('retains RadioGroup scope attributes for selected cards and reduced-motion hover', async () => {
    const stylesheet = await buildComponentStylesheet('I9kRadioGroup');
    let selectedRule: Rule | undefined;
    let reducedMotionRule: Rule | undefined;

    stylesheet.walkRules((rule) => {
      if (rule.selector.includes(':has(input:checked)')) selectedRule = rule;
      if (
        rule.selector.includes('.i9k-radio-group__option') &&
        rule.selector.includes(':hover') &&
        rule.parent?.type === 'atrule' &&
        rule.parent.name === 'media' &&
        rule.parent.params.includes('prefers-reduced-motion') &&
        hasDeclaration(rule, 'transform', 'none')
      ) {
        reducedMotionRule = rule;
      }
    });

    expect(selectedRule?.selector).toMatch(
      /\.i9k-radio-group__option\[data-v-[^\]]+\]:has\(input:checked\)/,
    );
    expect(reducedMotionRule?.selector).toMatch(/\.i9k-radio-group__option\[data-v-[^\]]+\]:hover/);
  });
});
