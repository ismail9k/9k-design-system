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

function isMediaRule(rule: Rule, condition: string) {
  const params = rule.parent?.type === 'atrule' ? rule.parent.params.replaceAll(' ', '') : '';
  const normalizedCondition = condition.replaceAll(' ', '');
  const matchesCondition =
    params.includes(normalizedCondition) ||
    (normalizedCondition === 'max-width:768px' && params.includes('width<=768px'));

  return (
    rule.parent?.type === 'atrule' &&
    rule.parent.name === 'media' &&
    matchesCondition
  );
}

describe('surface and layout compiled styles', () => {
  it('collapses multi-column grids at the shared mobile breakpoint', async () => {
    const stylesheet = await buildComponentStylesheet('I9kGrid');
    let mobileRule: Rule | undefined;

    stylesheet.walkRules((rule) => {
      if (
        rule.selector.includes('.i9k-grid--columns-2') &&
        rule.selector.includes('.i9k-grid--columns-3') &&
        rule.selector.includes('.i9k-grid--columns-auto') &&
        isMediaRule(rule, 'max-width: 768px')
      ) {
        mobileRule = rule;
      }
    });

    expect(mobileRule?.selector).toMatch(/\.i9k-grid--columns-2\[data-v-[^\]]+\]/);
    expect(mobileRule && hasDeclaration(mobileRule, 'grid-template-columns', '1fr')).toBe(true);
  });

  it('keeps the tag hash logical and its dark override scoped', async () => {
    const stylesheet = await buildComponentStylesheet('I9kBadge');
    let tagBeforeRule: Rule | undefined;
    let darkTagRule: Rule | undefined;

    stylesheet.walkRules((rule) => {
      if (rule.selector.includes('.i9k-badge--tag') && rule.selector.includes(':before')) {
        tagBeforeRule = rule;
      }
      if (rule.selector.includes('.dark') && rule.selector.includes('.i9k-badge--tag')) {
        darkTagRule = rule;
      }
    });

    expect(tagBeforeRule?.selector).toMatch(/\.i9k-badge--tag\[data-v-[^\]]+\]:before/);
    expect(tagBeforeRule && hasDeclaration(tagBeforeRule, 'margin-inline-end', '2px')).toBe(true);
    expect(darkTagRule?.selector).toMatch(/\.dark \.i9k-badge--tag/);
    expect(darkTagRule && hasDeclaration(darkTagRule, 'background', 'var(--white-color-alpha-05)'))
      .toBe(true);
  });

  it('removes Panel transitions for reduced motion', async () => {
    const stylesheet = await buildComponentStylesheet('I9kPanel');
    let reducedMotionRule: Rule | undefined;

    stylesheet.walkRules((rule) => {
      if (
        rule.selector.includes('.i9k-panel') &&
        isMediaRule(rule, 'prefers-reduced-motion: reduce') &&
        hasDeclaration(rule, 'transition', 'none')
      ) {
        reducedMotionRule = rule;
      }
    });

    expect(reducedMotionRule?.selector).toMatch(/\.i9k-panel\[data-v-[^\]]+\]/);
  });

  it('pins PageContainer to the safe mobile gutter', async () => {
    const stylesheet = await buildComponentStylesheet('I9kPageContainer');
    let mobileRule: Rule | undefined;

    stylesheet.walkRules((rule) => {
      if (
        rule.selector.includes('.i9k-page-container') &&
        isMediaRule(rule, 'max-width: 768px') &&
        hasDeclaration(rule, '--i9k-page-container-gutter', 'var(--spacing-8)')
      ) {
        mobileRule = rule;
      }
    });

    expect(mobileRule?.selector).toMatch(/\.i9k-page-container\[data-v-[^\]]+\]/);
    expect(mobileRule && hasDeclaration(mobileRule, 'width', '100%')).toBe(true);
  });
});
