# Surfaces, Layout, and Canary Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship seven scoped Vue components for surfaces, layout, data display, text, and page
containment, then use them on the live design-system reference page as the first migration canary.

**Architecture:** Each component is a small polymorphic SFC with a typed public API, an
`i9k-`-prefixed scoped style contract, and component-local size variables. Legacy selectors remain
unchanged for unmigrated routes. The website consumes a packed build of the package and migrates
only `/design-system`; its shared layout containers remain site-owned until Batch 4.

**Tech Stack:** Vue 3.5 SFCs, TypeScript 5.7, CSS custom properties, Vitest 4, Vue Test Utils 2,
Storybook 10, Vite 7, Nuxt 4 static generation.

**Spec:** `docs/superpowers/specs/2026-08-25-surfaces-layout-canary-design.md`

## Global Constraints

- Add only `I9kPanel`, `I9kBadge`, `I9kGrid`, `I9kCluster`, `I9kStat`, `I9kText`, and
  `I9kPageContainer`.
- Every component defaults to `size="md"`, supports `sm`/`md`/`lg`, and owns one `<style scoped>`
  block with an `i9k-` root class.
- New components do not emit or depend on `.surface`, `.badge`, `.grid`, `.cluster`, `.stat`,
  `.lede`, or `.container`.
- Keep `src/styles/primitives.css` declarations and the website's `assets/css/base.css` container
  unchanged.
- Use component-local custom properties for size-dependent CSS values.
- Forward native and ARIA attributes to the selected root element.
- Preserve medium legacy visuals, the 768px responsive breakpoint, dark tag styling, logical RTL
  spacing, and reduced-motion behavior.
- Use TDD for package production code. The website explicitly forbids test creation; verify it with
  lint, static generation, and manual/visual checks.
- Do not modify the `9k.school` consumer.
- Do not stage the user-owned `AGENTS.md` or `.playwright-mcp/` changes.

---

### Task 1: Add public surface and layout types

**Files:**

- Modify: `src/types/components.ts`
- Modify: `src/index.ts`
- Modify: `tests/I9kComponentContracts.test.ts`

**Interfaces:**

- Consumes: existing `I9kComponentSize` and public entry point.
- Produces: `I9kPanelVariant`, `I9kBadgeVariant`, `I9kGridColumns`, and `I9kTextVariant`, plus public
  exports for all seven components.

- [ ] **Step 1: Write the failing public-contract assertions**

Extend `tests/I9kComponentContracts.test.ts` with these expected statements:

```ts
const surfaceLayoutExports = [
  "export type { I9kBadgeVariant } from './types/components';",
  "export type { I9kGridColumns } from './types/components';",
  "export type { I9kPanelVariant } from './types/components';",
  "export type { I9kTextVariant } from './types/components';",
  "export { default as I9kBadge } from './components/I9kBadge.vue';",
  "export { default as I9kCluster } from './components/I9kCluster.vue';",
  "export { default as I9kGrid } from './components/I9kGrid.vue';",
  "export { default as I9kPageContainer } from './components/I9kPageContainer.vue';",
  "export { default as I9kPanel } from './components/I9kPanel.vue';",
  "export { default as I9kStat } from './components/I9kStat.vue';",
  "export { default as I9kText } from './components/I9kText.vue';",
] as const;

it.each(surfaceLayoutExports)('exports %s', (statement) => {
  expect(indexSource).toContain(statement);
});
```

- [ ] **Step 2: Run the contract test and verify RED**

Run: `npx vitest run tests/I9kComponentContracts.test.ts`

Expected: FAIL because the type export line and seven component exports are absent.

- [ ] **Step 3: Add the public types and export statements**

Add to `src/types/components.ts`:

```ts
export type I9kBadgeVariant = 'solid' | 'outline' | 'tag';
export type I9kGridColumns = 1 | 2 | 3 | 'auto';
export type I9kPanelVariant = 'default' | 'feature' | 'flat';
export type I9kTextVariant = 'body' | 'lede';
```

Add the four exact type exports and the seven component exports beside the existing public exports
in `src/index.ts`. The SFC imports will remain unresolved until Tasks 2-6 are complete, so do not
run typecheck in this task.

- [ ] **Step 4: Re-run the source contract test and verify GREEN**

Run: `npx vitest run tests/I9kComponentContracts.test.ts`

Expected: PASS because this suite checks the source-level public contract without resolving SFCs.

- [ ] **Step 5: Commit the public contract**

```bash
git add src/types/components.ts src/index.ts tests/I9kComponentContracts.test.ts
git commit -m "feat: add surface and layout contracts"
```

---

### Task 2: Add I9kPanel and I9kBadge

**Files:**

- Create: `src/components/I9kPanel.vue`
- Create: `src/components/I9kBadge.vue`
- Create: `tests/I9kPanel.test.ts`
- Create: `tests/I9kBadge.test.ts`

**Interfaces:**

- Consumes: `I9kComponentSize`, `I9kPanelVariant`, and `I9kBadgeVariant`.
- Produces: polymorphic scoped surface and badge primitives with medium legacy parity.

- [ ] **Step 1: Write failing Panel behavior tests**

Create `tests/I9kPanel.test.ts`:

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kPanel from '../src/components/I9kPanel.vue';

describe('I9kPanel', () => {
  it('renders a medium default div', () => {
    const wrapper = mount(I9kPanel, { slots: { default: 'Panel content' } });
    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.text()).toBe('Panel content');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['i9k-panel', 'i9k-panel--default', 'i9k-panel--md']),
    );
    expect(wrapper.classes()).not.toContain('surface');
  });

  it.each(['default', 'feature', 'flat'] as const)('renders the %s variant', (variant) => {
    expect(mount(I9kPanel, { props: { variant } }).classes()).toContain(`i9k-panel--${variant}`);
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s size', (size) => {
    expect(mount(I9kPanel, { props: { size } }).classes()).toContain(`i9k-panel--${size}`);
  });

  it('renders the selected root and forwards consumer attributes', () => {
    const wrapper = mount(I9kPanel, {
      props: { as: 'article' },
      attrs: { class: 'project-panel', 'aria-labelledby': 'project-title' },
    });
    expect(wrapper.element.tagName).toBe('ARTICLE');
    expect(wrapper.classes()).toContain('project-panel');
    expect(wrapper.attributes('aria-labelledby')).toBe('project-title');
  });
});
```

- [ ] **Step 2: Run Panel tests and verify RED**

Run: `npx vitest run tests/I9kPanel.test.ts`

Expected: FAIL because `I9kPanel.vue` does not exist.

- [ ] **Step 3: Implement the minimal Panel SFC**

Create a typed dynamic root with this template contract:

```vue
<script setup lang="ts">
import type { Component } from 'vue';
import type { I9kComponentSize, I9kPanelVariant } from '../types/components';

withDefaults(
  defineProps<{ as?: string | Component; size?: I9kComponentSize; variant?: I9kPanelVariant }>(),
  { as: 'div', size: 'md', variant: 'default' },
);
</script>

<template>
  <component :is="as" :class="['i9k-panel', `i9k-panel--${variant}`, `i9k-panel--${size}`]">
    <slot />
  </component>
</template>
```

The scoped CSS sets medium padding to `var(--spacing-13)`, medium radius to `var(--radius-md)`,
small padding/radius to `var(--spacing-8)`/`var(--radius-sm)`, and large padding/radius to
`var(--spacing-18)`/`var(--radius-lg)`. Default, feature, and flat styles copy the corresponding
legacy surface declarations. Add a reduced-motion media rule that sets `transition: none`.

- [ ] **Step 4: Run Panel tests and verify GREEN**

Run: `npx vitest run tests/I9kPanel.test.ts`

Expected: all Panel tests PASS.

- [ ] **Step 5: Write failing Badge behavior tests**

Create `tests/I9kBadge.test.ts`:

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kBadge from '../src/components/I9kBadge.vue';

describe('I9kBadge', () => {
  it('renders a medium outline span by default', () => {
    const wrapper = mount(I9kBadge, { slots: { default: 'Open source' } });
    expect(wrapper.element.tagName).toBe('SPAN');
    expect(wrapper.text()).toBe('Open source');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['i9k-badge', 'i9k-badge--outline', 'i9k-badge--md']),
    );
    expect(wrapper.classes()).not.toContain('badge');
  });

  it.each(['solid', 'outline', 'tag'] as const)('renders the %s variant', (variant) => {
    expect(mount(I9kBadge, { props: { variant } }).classes()).toContain(`i9k-badge--${variant}`);
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s size', (size) => {
    expect(mount(I9kBadge, { props: { size } }).classes()).toContain(`i9k-badge--${size}`);
  });

  it('keeps the decorative tag hash out of text content', () => {
    expect(mount(I9kBadge, { props: { variant: 'tag' }, slots: { default: 'AI' } }).text()).toBe(
      'AI',
    );
  });

  it('renders the selected root and forwards attributes', () => {
    const wrapper = mount(I9kBadge, {
      props: { as: 'strong' },
      attrs: { class: 'release-label', title: 'Stable release' },
    });
    expect(wrapper.element.tagName).toBe('STRONG');
    expect(wrapper.classes()).toContain('release-label');
    expect(wrapper.attributes('title')).toBe('Stable release');
  });
});
```

- [ ] **Step 6: Run Badge tests and verify RED**

Run: `npx vitest run tests/I9kBadge.test.ts`

Expected: FAIL because `I9kBadge.vue` does not exist.

- [ ] **Step 7: Implement the minimal Badge SFC**

Use the same dynamic-root structure as Panel with `as: 'span'`, `size: 'md'`, and
`variant: 'outline'`. Render classes `i9k-badge`, `i9k-badge--<variant>`, and
`i9k-badge--<size>`.

Scoped CSS copies the solid, outline, and tag legacy appearance. Size variables use compact,
medium, and large padding/font values. The exact medium tag values remain
`var(--spacing-3) var(--spacing-6)` and `11px`. Add `content: '#'` and
`margin-inline-end: 2px` on the tag `::before`, a scoped `:global(.dark ...)` tag override, and a
reduced-motion transition override.

- [ ] **Step 8: Run both component suites and verify GREEN**

Run: `npx vitest run tests/I9kPanel.test.ts tests/I9kBadge.test.ts`

Expected: all tests PASS.

- [ ] **Step 9: Commit the surface components**

```bash
git add src/components/I9kPanel.vue src/components/I9kBadge.vue tests/I9kPanel.test.ts tests/I9kBadge.test.ts
git commit -m "feat: add panel and badge components"
```

---

### Task 3: Add I9kGrid and I9kCluster

**Files:**

- Create: `src/components/I9kGrid.vue`
- Create: `src/components/I9kCluster.vue`
- Create: `tests/I9kGrid.test.ts`
- Create: `tests/I9kCluster.test.ts`

**Interfaces:**

- Consumes: `I9kComponentSize` and `I9kGridColumns`.
- Produces: scoped child-agnostic grid and wrapping-row layout components.

- [ ] **Step 1: Write failing Grid tests**

Create `tests/I9kGrid.test.ts` with assertions for the default
`i9k-grid i9k-grid--columns-1 i9k-grid--md` classes, every `columns` value (`1`, `2`, `3`,
`auto`), every size, slotted children, `as="ul"`, a consumer class, and an `aria-label`. Assert the
root never has the legacy `grid` class.

```ts
it('renders a semantic list and forwards its accessible name', () => {
  const wrapper = mount(I9kGrid, {
    props: { as: 'ul', columns: 3 },
    attrs: { 'aria-label': 'Project list', class: 'projects' },
    slots: { default: '<li>One</li><li>Two</li>' },
  });
  expect(wrapper.element.tagName).toBe('UL');
  expect(wrapper.attributes('aria-label')).toBe('Project list');
  expect(wrapper.classes()).toEqual(
    expect.arrayContaining(['projects', 'i9k-grid', 'i9k-grid--columns-3', 'i9k-grid--md']),
  );
  expect(wrapper.findAll('li')).toHaveLength(2);
});
```

- [ ] **Step 2: Run Grid tests and verify RED**

Run: `npx vitest run tests/I9kGrid.test.ts`

Expected: FAIL because `I9kGrid.vue` does not exist.

- [ ] **Step 3: Implement Grid**

Create a dynamic `div` root with `columns: 1` and `size: 'md'` defaults. Scoped CSS uses a local
gap variable: small `var(--spacing-4)`, medium `var(--spacing-8)`, large
`var(--spacing-13)`. Column modifiers map to one, two, three, or
`repeat(auto-fill, minmax(280px, 1fr))`. At `max-width: 768px`, two, three, and auto modifiers set
`grid-template-columns: 1fr`.

- [ ] **Step 4: Run Grid tests and verify GREEN**

Run: `npx vitest run tests/I9kGrid.test.ts`

Expected: all Grid tests PASS.

- [ ] **Step 5: Write failing Cluster tests**

Create `tests/I9kCluster.test.ts` with a medium default, all sizes, slotted children, absence of the
legacy class, and a semantic nav case:

```ts
it('renders a labelled nav without changing its children', () => {
  const wrapper = mount(I9kCluster, {
    props: { as: 'nav', size: 'sm' },
    attrs: { 'aria-label': 'Filters', class: 'filter-row' },
    slots: { default: '<button data-filter="all">All</button>' },
  });
  expect(wrapper.element.tagName).toBe('NAV');
  expect(wrapper.attributes('aria-label')).toBe('Filters');
  expect(wrapper.classes()).toEqual(
    expect.arrayContaining(['filter-row', 'i9k-cluster', 'i9k-cluster--sm']),
  );
  expect(wrapper.get('button').attributes('data-filter')).toBe('all');
});
```

- [ ] **Step 6: Run Cluster tests and verify RED**

Run: `npx vitest run tests/I9kCluster.test.ts`

Expected: FAIL because `I9kCluster.vue` does not exist.

- [ ] **Step 7: Implement Cluster**

Create a dynamic `div` root with size classes. Scoped CSS sets `display: flex`,
`flex-wrap: wrap`, `align-items: center`, and a local gap variable using
`var(--spacing-4)`, `var(--spacing-6)`, and `var(--spacing-8)` for small, medium, and large.

- [ ] **Step 8: Run layout behavior suites and verify GREEN**

Run: `npx vitest run tests/I9kGrid.test.ts tests/I9kCluster.test.ts`

Expected: all tests PASS.

- [ ] **Step 9: Commit the layout components**

```bash
git add src/components/I9kGrid.vue src/components/I9kCluster.vue tests/I9kGrid.test.ts tests/I9kCluster.test.ts
git commit -m "feat: add grid and cluster components"
```

---

### Task 4: Add I9kStat and I9kText

**Files:**

- Create: `src/components/I9kStat.vue`
- Create: `src/components/I9kText.vue`
- Create: `tests/I9kStat.test.ts`
- Create: `tests/I9kText.test.ts`

**Interfaces:**

- Consumes: `I9kComponentSize` and `I9kTextVariant`.
- Produces: structured stat content with slot overrides and a scoped body/lede text primitive.

- [ ] **Step 1: Write failing Stat tests**

Create `tests/I9kStat.test.ts`:

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import I9kStat from '../src/components/I9kStat.vue';

describe('I9kStat', () => {
  it('renders value and label while omitting an absent source', () => {
    const wrapper = mount(I9kStat, { props: { value: '480k+', label: 'monthly downloads' } });
    expect(wrapper.get('.i9k-stat__value').text()).toBe('480k+');
    expect(wrapper.get('.i9k-stat__label').text()).toBe('monthly downloads');
    expect(wrapper.find('.i9k-stat__source').exists()).toBe(false);
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['i9k-stat', 'i9k-stat--md']));
  });

  it('renders zero as a value', () => {
    expect(
      mount(I9kStat, { props: { value: 0 } })
        .get('.i9k-stat__value')
        .text(),
    ).toBe('0');
  });

  it('lets named slots override prop content', () => {
    const wrapper = mount(I9kStat, {
      props: { value: 'old', label: 'old', source: 'old' },
      slots: {
        value: '<strong>10+</strong>',
        label: 'years building products',
        source: '<a href="/source">Snapshot</a>',
      },
    });
    expect(wrapper.get('.i9k-stat__value strong').text()).toBe('10+');
    expect(wrapper.get('.i9k-stat__label').text()).toBe('years building products');
    expect(wrapper.get('.i9k-stat__source a').attributes('href')).toBe('/source');
  });

  it('renders a large semantic list item and forwards attributes', () => {
    const wrapper = mount(I9kStat, {
      props: { as: 'li', size: 'lg', value: '10+' },
      attrs: { class: 'proof', 'aria-label': 'Ten years' },
    });
    expect(wrapper.element.tagName).toBe('LI');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['proof', 'i9k-stat', 'i9k-stat--lg']),
    );
    expect(wrapper.attributes('aria-label')).toBe('Ten years');
  });
});
```

- [ ] **Step 2: Run Stat tests and verify RED**

Run: `npx vitest run tests/I9kStat.test.ts`

Expected: FAIL because `I9kStat.vue` does not exist.

- [ ] **Step 3: Implement Stat**

Render a dynamic `div` root and conditionally render `.i9k-stat__value`, `__label`, and `__source`
when `value !== undefined || $slots.value` (and the equivalent condition for each other region).
Named slots take precedence by rendering inside each region before falling back to the prop.

Scoped CSS uses local size variables. Medium copies the legacy values: `1.5rem` value,
`0.9rem` label, `0.75rem` source, and `var(--spacing-2)` gap. Large uses
`clamp(2rem, 5vw, 3.25rem)` for the value. Small uses `1.25rem`, `0.8rem`, and `0.7rem` while
retaining the same hierarchy.

- [ ] **Step 4: Run Stat tests and verify GREEN**

Run: `npx vitest run tests/I9kStat.test.ts`

Expected: all Stat tests PASS.

- [ ] **Step 5: Write failing Text tests**

Create `tests/I9kText.test.ts` with a default body paragraph, all sizes, lede variant, custom root,
attribute forwarding, and absence of the legacy `lede` class:

```ts
it('renders lede text as a blockquote when requested', () => {
  const wrapper = mount(I9kText, {
    props: { as: 'blockquote', variant: 'lede', size: 'lg' },
    attrs: { cite: 'https://example.com', class: 'opening-copy' },
    slots: { default: 'A clear introduction.' },
  });
  expect(wrapper.element.tagName).toBe('BLOCKQUOTE');
  expect(wrapper.attributes('cite')).toBe('https://example.com');
  expect(wrapper.classes()).toEqual(
    expect.arrayContaining(['opening-copy', 'i9k-text', 'i9k-text--lede', 'i9k-text--lg']),
  );
  expect(wrapper.classes()).not.toContain('lede');
});
```

- [ ] **Step 6: Run Text tests and verify RED**

Run: `npx vitest run tests/I9kText.test.ts`

Expected: FAIL because `I9kText.vue` does not exist.

- [ ] **Step 7: Implement Text**

Create a dynamic `p` root with `body` and `lede` variant classes. Size-local variables control
font size and line height. The medium lede rule copies `max-width: 62ch`,
`margin: 0 0 var(--spacing-8)`, muted color, `1.15rem`, and `1.7`. Body remains unopinionated about
width and margin while using the selected font size and line height.

- [ ] **Step 8: Run content suites and verify GREEN**

Run: `npx vitest run tests/I9kStat.test.ts tests/I9kText.test.ts`

Expected: all tests PASS.

- [ ] **Step 9: Commit the content components**

```bash
git add src/components/I9kStat.vue src/components/I9kText.vue tests/I9kStat.test.ts tests/I9kText.test.ts
git commit -m "feat: add stat and text components"
```

---

### Task 5: Add I9kPageContainer

**Files:**

- Create: `src/components/I9kPageContainer.vue`
- Create: `tests/I9kPageContainer.test.ts`

**Interfaces:**

- Consumes: `I9kComponentSize`.
- Produces: a scoped page-width and responsive-gutter contract that can replace the website layout
  wrappers in Batch 4.

- [ ] **Step 1: Write failing PageContainer tests**

Create `tests/I9kPageContainer.test.ts`:

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import I9kPageContainer from '../src/components/I9kPageContainer.vue';

describe('I9kPageContainer', () => {
  it('renders a medium div without the website compatibility class', () => {
    const wrapper = mount(I9kPageContainer, { slots: { default: '<h1>Projects</h1>' } });
    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.get('h1').text()).toBe('Projects');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['i9k-page-container', 'i9k-page-container--md']),
    );
    expect(wrapper.classes()).not.toContain('container');
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s gutter size', (size) => {
    expect(mount(I9kPageContainer, { props: { size } }).classes()).toContain(
      `i9k-page-container--${size}`,
    );
  });

  it('renders a selected section root and forwards attributes', () => {
    const wrapper = mount(I9kPageContainer, {
      props: { as: 'section' },
      attrs: { class: 'project-page', 'aria-labelledby': 'projects-title' },
    });
    expect(wrapper.element.tagName).toBe('SECTION');
    expect(wrapper.classes()).toContain('project-page');
    expect(wrapper.attributes('aria-labelledby')).toBe('projects-title');
  });
});
```

- [ ] **Step 2: Run PageContainer tests and verify RED**

Run: `npx vitest run tests/I9kPageContainer.test.ts`

Expected: FAIL because `I9kPageContainer.vue` does not exist.

- [ ] **Step 3: Implement PageContainer**

Create a dynamic `div` root with size classes. Scoped CSS uses this contract:

```css
.i9k-page-container {
  --i9k-page-container-gutter: var(--spacing-13);

  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 1000px;
  max-width: 100%;
  min-height: calc(100vh - 250px);
  margin-inline: auto;
  padding-block: var(--spacing-8);
  padding-inline: var(--i9k-page-container-gutter);
}

.i9k-page-container--sm {
  --i9k-page-container-gutter: var(--spacing-8);
}
.i9k-page-container--lg {
  --i9k-page-container-gutter: var(--spacing-18);
}

@media (max-width: 768px) {
  .i9k-page-container {
    --i9k-page-container-gutter: var(--spacing-8);
    width: 100%;
  }
}
```

- [ ] **Step 4: Run PageContainer tests and verify GREEN**

Run: `npx vitest run tests/I9kPageContainer.test.ts`

Expected: all tests PASS.

- [ ] **Step 5: Commit PageContainer**

```bash
git add src/components/I9kPageContainer.vue tests/I9kPageContainer.test.ts
git commit -m "feat: add page container component"
```

---

### Task 6: Add scoped and compiled style safeguards

**Files:**

- Modify: `tests/I9kScopedStyles.test.ts`
- Create: `tests/I9kSurfaceLayoutStyles.test.ts`

**Interfaces:**

- Consumes: all seven SFC class contracts.
- Produces: source and emitted-CSS regression coverage for scoping, responsiveness, RTL, dark mode,
  and reduced motion.

- [ ] **Step 1: Write failing scoped ownership rows**

Add these rows to `migratedComponents`:

```ts
['I9kBadge.vue', 'i9k-badge'],
['I9kCluster.vue', 'i9k-cluster'],
['I9kGrid.vue', 'i9k-grid'],
['I9kPageContainer.vue', 'i9k-page-container'],
['I9kPanel.vue', 'i9k-panel'],
['I9kStat.vue', 'i9k-stat'],
['I9kText.vue', 'i9k-text'],
```

Temporarily change one prefix to a missing value, run
`npx vitest run tests/I9kScopedStyles.test.ts`, and confirm that row fails. Restore the real prefix
and rerun to PASS. This proves the new rows can detect a missing scoped owner.

- [ ] **Step 2: Write emitted-CSS regression tests**

Create `tests/I9kSurfaceLayoutStyles.test.ts` by reusing the Vite/PostCSS build helper pattern from
`tests/I9kNativeComponentStyles.test.ts`. Add tests that locate:

```ts
expect(gridMobileRule?.selector).toMatch(/\.i9k-grid--columns-(2|3|auto)\[data-v-/);
expect(hasDeclaration(gridMobileRule!, 'grid-template-columns', '1fr')).toBe(true);
expect(tagBeforeRule?.selector).toMatch(/\.i9k-badge--tag\[data-v-[^\]]+\]::before/);
expect(hasDeclaration(tagBeforeRule!, 'margin-inline-end', '2px')).toBe(true);
expect(darkTagRule?.selector).toMatch(/\.dark \.i9k-badge--tag\[data-v-/);
expect(hasDeclaration(panelReducedRule!, 'transition', 'none')).toBe(true);
expect(
  hasDeclaration(containerMobileRule!, '--i9k-page-container-gutter', 'var(--spacing-8)'),
).toBe(true);
```

Each discovered media rule must also verify its parent parameters contain the expected
`max-width: 768px` or `prefers-reduced-motion: reduce` condition.

- [ ] **Step 3: Prove the compiled tests fail when the contract is broken**

Temporarily change the Grid mobile declaration from `1fr` to `2fr`, run
`npx vitest run tests/I9kSurfaceLayoutStyles.test.ts`, and verify the Grid case FAILS for the
expected value. Restore `1fr` and rerun.

- [ ] **Step 4: Run all new component and safeguard suites**

```bash
npx vitest run \
  tests/I9kPanel.test.ts tests/I9kBadge.test.ts \
  tests/I9kGrid.test.ts tests/I9kCluster.test.ts \
  tests/I9kStat.test.ts tests/I9kText.test.ts \
  tests/I9kPageContainer.test.ts \
  tests/I9kComponentContracts.test.ts tests/I9kScopedStyles.test.ts \
  tests/I9kSurfaceLayoutStyles.test.ts
```

Expected: every focused test PASSES after both deliberate failure probes are restored.

- [ ] **Step 5: Commit the safeguards**

```bash
git add tests/I9kScopedStyles.test.ts tests/I9kSurfaceLayoutStyles.test.ts
git commit -m "test: cover surface and layout style contracts"
```

---

### Task 7: Add Storybook and package documentation

**Files:**

- Create: `stories/I9kPanel.stories.ts`
- Create: `stories/I9kBadge.stories.ts`
- Create: `stories/I9kGrid.stories.ts`
- Create: `stories/I9kCluster.stories.ts`
- Create: `stories/I9kStat.stories.ts`
- Create: `stories/I9kText.stories.ts`
- Create: `stories/I9kPageContainer.stories.ts`
- Create: `stories/I9kSurfacesLayout.stories.ts`
- Modify: `README.md`
- Modify: `docs/migrations/ismail9k-com-component-library.md`

**Interfaces:**

- Consumes: public imports from `../src` and the approved component APIs.
- Produces: individual controls, visual size coverage, an integrated RTL composition, and package
  readiness documentation.

- [ ] **Step 1: Add individual component stories**

Each story file uses `Meta<typeof Component>`, imports its component from the direct SFC path, and
provides `Default`, `Sizes`, and the relevant variants. Use these fixtures consistently:

```ts
const sizes = ['sm', 'md', 'lg'] as const;
const variants = ['default', 'feature', 'flat'] as const; // Panel
const badgeVariants = ['solid', 'outline', 'tag'] as const;
```

Grid stories render three child panels for `columns=1/2/3/auto`; Cluster renders buttons and badges;
Stat renders value/label/source; Text renders body and lede; PageContainer renders a dashed
page-specific child block at all three sizes. Do not use legacy primitive classes in any new story.

- [ ] **Step 2: Add the integrated LTR/RTL story**

Create `stories/I9kSurfacesLayout.stories.ts` with title `Examples/SurfacesLayout`. Import all seven
components from `../src`. Its LTR and RTL stories nest this public-only composition:

```vue
<I9kPageContainer :dir="direction" :lang="direction === 'rtl' ? 'ar' : 'en'">
  <I9kText variant="lede">A clear view of product reach across channels.</I9kText>
  <I9kGrid :columns="3">
    <I9kPanel v-for="item in items" :key="item.label">
      <I9kCluster size="sm"><I9kBadge variant="tag">{{ item.tag }}</I9kBadge></I9kCluster>
      <I9kStat :value="item.value" :label="item.label" />
    </I9kPanel>
  </I9kGrid>
</I9kPageContainer>
```

- [ ] **Step 3: Document the public APIs**

Add all seven components to the README exports and add compact usage showing Panel/Grid/Stat,
Badge/Cluster, Text lede, and PageContainer. State that PageContainer defaults to a `div`, medium
matches the 1000px website layout contract, and consumers choose semantic roots through `as`.

- [ ] **Step 4: Record package readiness without claiming Batch 0 completion**

Add package-status rows for all seven components to
`docs/migrations/ismail9k-com-component-library.md`. State that `.surface`, `.badge`, `.grid`,
`.cluster`, `.stat`, `.lede`, and the site `.container` remain active until their website batches
land. Add `I9kPageContainer` to the primitive mapping and Batch 0 specimen action, while retaining
layout wrapper replacement in Batch 4.

- [ ] **Step 5: Format and type-check Storybook**

Run:

```bash
npx prettier --write stories README.md docs/migrations/ismail9k-com-component-library.md
npm run typecheck
npm run build-storybook
```

Expected: typecheck and Storybook build exit 0. The normal Storybook chunk-size warning is
non-blocking.

- [ ] **Step 6: Commit stories and package docs**

```bash
git add stories README.md docs/migrations/ismail9k-com-component-library.md
git commit -m "docs: cover surfaces and layout components"
```

---

### Task 8: Run the package release gate and create a local artifact

**Files:**

- Verify only; do not commit `dist/` or `storybook-static/`.

**Interfaces:**

- Consumes: the complete package slice.
- Produces: a verified tarball that the website can install without changing its declared GitHub
  dependency.

- [ ] **Step 1: Run the full package gate**

Run:

```bash
npm run check
npm pack --dry-run
git diff --check
```

Expected: all 33 test files (the existing 25 plus seven component files and the new style suite;
use the actual Vitest count as authoritative), formatting, lint, all typecheck projects, library
build, Storybook build, package dry run, and whitespace checks exit 0.

- [ ] **Step 2: Inspect package contents**

Confirm the dry run includes `dist/index.js`, `dist/index.d.ts`, and `dist/index.css`, and excludes
tests, stories, `storybook-static`, and documentation.

- [ ] **Step 3: Pack into an isolated temporary directory**

```bash
PACKAGE_ARTIFACT_DIR=$(mktemp -d)
npm pack --pack-destination "$PACKAGE_ARTIFACT_DIR"
```

Record the printed tarball path for Task 9. Do not put the tarball in either repository.

---

### Task 9: Migrate the website design-system canary

**Files:**

- Modify: `../ismail9k.com/pages/design-system.vue`
- Modify: `../ismail9k.com/nuxt.config.js`
- Modify only if required: `../ismail9k.com/components/ds/DsSpecimen.vue`
- Modify: `docs/migrations/ismail9k-com-component-library.md`

**Interfaces:**

- Consumes: the packed package artifact from Task 8.
- Produces: component-based specimens on `/design-system` and a generated RTL canary route at
  `/ar/design-system`, without changing shared layouts or public routes.

- [ ] **Step 1: Install the packed package without changing dependency metadata**

From `../ismail9k.com`, run:

```bash
npm install --no-save /absolute/path/from/task-8.tgz
git diff -- package.json package-lock.json
```

Expected: the package is available in `node_modules`; `package.json` and `package-lock.json` remain
unchanged. If npm changes either file, restore only those npm-generated diffs with `apply_patch`
before continuing; do not touch unrelated changes.

- [ ] **Step 2: Remove the English-only canary restriction**

Delete this line from `pages/design-system.vue`:

```js
definePageMeta({ i18n: { locales: ['en'] } });
```

The page contains reference copy rather than localized product content, so the Arabic route may
fall back to English while still exercising document RTL, Arabic typography inheritance, and
component layout.

Add `/ar/design-system` beside `/design-system` in `nitro.prerender.routes` because neither canary
route is linked and `crawlLinks` cannot discover the Arabic route. Add `/ar/design-system` beside
`/design-system` in `sitemap.exclude` so both reference routes remain outside the public sitemap.

- [ ] **Step 3: Import the seven components**

Add `I9kBadge`, `I9kCluster`, `I9kGrid`, `I9kPageContainer`, `I9kPanel`, `I9kStat`, and `I9kText`
to the existing package import in `pages/design-system.vue`.

- [ ] **Step 4: Replace only primitive-section markup**

Replace the surface, badge, grid, stat, cluster, and lede specimens with the exact public
components and update snippets from class-based HTML to Vue usage. Use default/feature/flat Panel
examples; do not recreate the retired interactive surface because interactive behavior belongs to
the existing LinkCard specimen. Use `I9kPanel size="sm"` for numbered Grid children so Grid remains
child-agnostic.

Add a PageContainer specimen whose outer stage remains inside the active site container:

```vue
<I9kPageContainer class="ds-page-container-demo" size="sm">
  <I9kText variant="lede">A bounded preview of the shared page-width contract.</I9kText>
</I9kPageContainer>
```

Constrain only the preview's height or outline with `.ds-page-container-demo`; do not override its
width, gutters, flex flow, or centering contract. Replace primitive classes used only as incidental
layout inside the migrated primitive section with the new components. Leave later Components,
Patterns, and For Agents examples unchanged for their own ledger batches.

- [ ] **Step 5: Update primitive documentation copy**

Rename the section descriptions and code snippets to `I9kPanel`, `I9kBadge`, `I9kGrid`,
`I9kCluster`, `I9kStat`, `I9kText`, and `I9kPageContainer`. Update the agent ladder so these are
described as package components rather than primitive classes, without claiming later page batches
are complete.

- [ ] **Step 6: Run website formatting only through its existing lint rules**

Do not add or run tests in the website repository. Run:

```bash
npm run lint
```

Expected: ESLint exits 0.

- [ ] **Step 7: Commit the isolated website canary**

From `../ismail9k.com`:

```bash
git add pages/design-system.vue nuxt.config.js
# Add components/ds/DsSpecimen.vue only when it changed.
git diff --cached --check
git commit -m "feat: migrate design system primitive canary"
```

Do not stage `components/ds/DsSpecimen.vue` when it is unchanged.

---

### Task 10: Verify static output and close Batch 0

**Files:**

- Modify: `docs/migrations/ismail9k-com-component-library.md`

**Interfaces:**

- Consumes: the committed package and website changes.
- Produces: fresh release-gate evidence and an accurate Batch 0 completion record.

- [ ] **Step 1: Generate the website with the packed package installed**

From `../ismail9k.com`, run:

```bash
npm run generate
```

Expected: Nuxt generation exits 0 and reports no hydration/build errors.

- [ ] **Step 2: Verify both static canary routes exist**

Run:

```bash
test -f .output/public/design-system/index.html
test -f .output/public/ar/design-system/index.html
grep -q 'i9k-panel' .output/public/design-system/index.html
grep -q 'i9k-page-container' .output/public/design-system/index.html
grep -Eq 'dir="?rtl"?' .output/public/ar/design-system/index.html
```

Expected: every command exits 0.

- [ ] **Step 3: Perform visual canary checks**

Run `npm run dev`, inspect `/design-system` and `/ar/design-system` at 375px and 1280px in light and
dark mode, and confirm:

- Panel default/feature/flat appearance and spacing match the reference language.
- Badge solid/outline/tag variants remain legible; tag hash placement follows LTR/RTL.
- Grid collapses at mobile width and Cluster wraps without overflow.
- Stat hierarchy and lede line length remain intact.
- PageContainer preview shows all gutters without horizontal overflow.
- Reduced-motion emulation removes Panel/Badge transitions without moving layout.

- [ ] **Step 4: Record Batch 0 completion only after checks pass**

Update the package migration ledger with a dated Batch 0 completion record listing package commit,
website commit, commands run, routes checked, locales, themes, and viewports. Do not mark Batches
1-6 complete and do not remove compatibility CSS.

- [ ] **Step 5: Re-run the package documentation and whitespace gates**

From `9k-design-system`:

```bash
npx prettier --check docs/migrations/ismail9k-com-component-library.md
git diff --check
```

Expected: both exit 0.

- [ ] **Step 6: Commit the completion record**

```bash
git add docs/migrations/ismail9k-com-component-library.md
git commit -m "docs: record design system canary migration"
```

## Completion Gate

- Seven new components and four new public types are exported in declarations.
- All seven components have behavior tests, scoped ownership, and individual plus integrated
  Storybook coverage.
- Compiled CSS verifies Grid responsiveness, tag RTL/dark behavior, reduced motion, and mobile
  PageContainer gutters.
- `npm run check`, `npm pack --dry-run`, and `git diff --check` pass in the package.
- Website `npm run lint` and `npm run generate` pass against the packed package.
- English and Arabic canary output contains the new component contracts.
- Visual checks cover light/dark, LTR/RTL, 375px/1280px, and reduced motion.
- Legacy compatibility CSS and shared website layout wrappers remain unchanged.
- Batch 0 is recorded complete; Batches 1-6 remain open.
