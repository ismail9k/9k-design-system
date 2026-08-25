import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import postcss, { type AtRule, type Root, type Rule } from 'postcss';
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

function findRule(stylesheet: Root, property: string, value: string, selectorPart: string) {
  let match: Rule | undefined;

  stylesheet.walkRules((rule) => {
    if (rule.selector.includes(selectorPart) && hasDeclaration(rule, property, value)) {
      match = rule;
    }
  });

  return match;
}

function isReducedMotionRule(rule: Rule) {
  const parent = rule.parent;

  return (
    parent?.type === 'atrule' &&
    (parent as AtRule).name === 'media' &&
    (parent as AtRule).params.includes('prefers-reduced-motion')
  );
}

describe('scoped existing component compiled styles', () => {
  it('disables the ProfileCard scoped transition for reduced motion', async () => {
    const stylesheet = await buildComponentStylesheet('I9kProfileCard');
    let reducedMotionRule: Rule | undefined;

    stylesheet.walkRules((rule) => {
      if (
        isReducedMotionRule(rule) &&
        rule.selector.includes('.i9k-profile-card') &&
        hasDeclaration(rule, 'transition', 'none')
      ) {
        reducedMotionRule = rule;
      }
    });

    expect(reducedMotionRule?.selector).toMatch(/^\.i9k-profile-card\[data-v-[^\]]+\]$/);
  });

  it('keeps the LinkCard RTL arrow scoped without overruling reduced motion', async () => {
    const stylesheet = await buildComponentStylesheet('I9kLinkCard');
    const orderedRules: Rule[] = [];
    let reducedMotionRule: Rule | undefined;

    stylesheet.walkRules((rule) => {
      orderedRules.push(rule);
      if (
        isReducedMotionRule(rule) &&
        rule.selector.includes('.link-card-arrow') &&
        hasDeclaration(rule, 'transform', 'none')
      ) {
        reducedMotionRule = rule;
      }
    });

    const rtlRule = findRule(
      stylesheet,
      'transform',
      'translate(-1px,-1px)scaleX(-1)',
      '[dir=rtl]',
    );
    const rtlSelector = rtlRule?.selector;
    const reducedArrowSelector = reducedMotionRule?.selector
      .split(',')
      .find((selector) => selector.includes('.link-card-arrow'));
    const restMirrorRule = orderedRules.find(
      (rule) =>
        !isReducedMotionRule(rule) &&
        rule.selector.includes('[dir=rtl]') &&
        !rule.selector.includes(':hover') &&
        hasDeclaration(rule, 'transform', 'scaleX(-1)'),
    );
    const reducedMirrorRule = orderedRules.find(
      (rule) =>
        isReducedMotionRule(rule) &&
        rule.selector.includes('[dir=rtl]') &&
        hasDeclaration(rule, 'transform', 'scaleX(-1)'),
    );

    expect(rtlSelector).toMatch(
      /\.link-card:hover \.link-card-arrow\[data-v-[^\]]+\]:where\(\[dir=rtl\] \*\)$/,
    );
    expect(reducedArrowSelector).toBe(rtlSelector?.replace(':where([dir=rtl] *)', ''));
    expect(orderedRules.indexOf(reducedMotionRule!)).toBeGreaterThan(
      orderedRules.indexOf(rtlRule!),
    );

    // The glyph is mirrored with scaleX, so reduced motion must drop the hover nudge
    // without also un-mirroring the arrow.
    expect(restMirrorRule?.selector).toMatch(
      /^\.link-card-arrow\[data-v-[^\]]+\]:where\(\[dir=rtl\] \*\)$/,
    );
    expect(reducedMirrorRule?.selector).toBe(rtlSelector);
    expect(orderedRules.indexOf(reducedMirrorRule!)).toBeGreaterThan(
      orderedRules.indexOf(reducedMotionRule!),
    );
  });

  it('retains TimelineCard scope attributes on RTL and dark ancestor-state selectors', async () => {
    const stylesheet = await buildComponentStylesheet('I9kTimelineCard');
    const rtlRailRule = findRule(stylesheet, 'transform', 'translate(5px)', '[dir=rtl]');
    const rtlTimeRule = findRule(stylesheet, 'transform-origin', '100%', '[dir=rtl]');
    const darkRailStartRule = findRule(
      stylesheet,
      'border-color',
      'var(--white-color-alpha-20)',
      '.dark',
    );
    const darkRailEndRule = findRule(
      stylesheet,
      'background-color',
      'var(--white-color-alpha-20)',
      '.dark',
    );

    expect(rtlRailRule?.selector).toMatch(
      /^\.i9k-timeline-card__rail\[data-v-[^\]]+\]:where\(\[dir=rtl\] \*\)$/,
    );
    expect(rtlTimeRule?.selector).toMatch(
      /^\.i9k-timeline-card__time\[data-v-[^\]]+\]:where\(\[dir=rtl\] \*\)$/,
    );
    expect(darkRailStartRule?.selector).toMatch(
      /^\.i9k-timeline-card__rail\[data-v-[^\]]+\]:where\(\.dark \*\):before$/,
    );
    expect(darkRailEndRule?.selector).toMatch(
      /^\.i9k-timeline-card__rail\[data-v-[^\]]+\]:where\(\.dark \*\):after$/,
    );
  });

  it('renders the TimelineCard slotted thumbnail image as a block', async () => {
    const stylesheet = await buildComponentStylesheet('I9kTimelineCard');
    const thumbnailRule = findRule(
      stylesheet,
      'object-fit',
      'cover',
      '.i9k-timeline-card__thumbnail img',
    );

    expect(thumbnailRule?.selector).toMatch(
      /^\.i9k-timeline-card__thumbnail img\[data-v-[^\]]+-s\]$/,
    );
    expect(thumbnailRule && hasDeclaration(thumbnailRule, 'display', 'block')).toBe(true);
  });

  it('limits the TimelineCard stretched title link to linked cards', async () => {
    const stylesheet = await buildComponentStylesheet('I9kTimelineCard');
    const stretchedLinkRule = findRule(stylesheet, 'inset', '0', '.i9k-timeline-card__title');

    expect(stretchedLinkRule?.selector).toMatch(
      /^\.i9k-timeline-card__card--linked \.i9k-timeline-card__title a\[data-v-[^\]]+-s\]:after$/,
    );
  });

  it('preserves the TimelineCard legacy radius at the default size', async () => {
    const stylesheet = await buildComponentStylesheet('I9kTimelineCard');
    const cardRule = findRule(stylesheet, 'border-radius', '15px', '.i9k-timeline-card__card');

    expect(cardRule?.selector).toMatch(/^\.i9k-timeline-card__card\[data-v-[^\]]+\]$/);
  });
});
