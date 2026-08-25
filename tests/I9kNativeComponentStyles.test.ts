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

function hasHalfOpacity(rule: Rule) {
  return rule.nodes.some(
    (node) => node.type === 'decl' && node.prop === 'opacity' && Number(node.value) === 0.5,
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

  it('styles disabled card groups and options without removing enabled interaction', async () => {
    const stylesheet = await buildComponentStylesheet('I9kRadioGroup');
    let enabledOptionRule: Rule | undefined;
    let enabledHoverRule: Rule | undefined;
    let disabledGroupRule: Rule | undefined;
    let disabledOptionRule: Rule | undefined;

    stylesheet.walkRules((rule) => {
      if (
        rule.selector.includes('--card') &&
        rule.selector.includes('__option') &&
        hasDeclaration(rule, 'cursor', 'pointer')
      ) {
        enabledOptionRule = rule;
      }
      if (rule.selector.includes(':not(:has(input:disabled)):hover')) enabledHoverRule = rule;
      if (rule.selector.includes('--card') && rule.selector.includes(':disabled')) {
        if (hasHalfOpacity(rule) && hasDeclaration(rule, 'cursor', 'not-allowed')) {
          disabledGroupRule = rule;
        }
      }
      if (rule.selector.includes(':has(input:disabled)')) {
        if (hasHalfOpacity(rule) && hasDeclaration(rule, 'cursor', 'not-allowed')) {
          disabledOptionRule = rule;
        }
      }
    });

    expect(enabledOptionRule && hasDeclaration(enabledOptionRule, 'cursor', 'pointer')).toBe(true);
    expect(enabledHoverRule).toBeDefined();
    expect(disabledGroupRule).toBeDefined();
    expect(disabledOptionRule).toBeDefined();
  });
});
