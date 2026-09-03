# I9kCollapsible Implementation Plan

Intent-Issue: #9 — https://github.com/the9klabs/design/issues/9

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reusable native disclosure component and make `I9kFaqList` consume it without
changing the FAQ API.

**Architecture:** `I9kCollapsible` wraps one native `details`/`summary` pair, exposes slotted
summary and body content, and lets the browser own each instance's state. `I9kFaqList` becomes a
thin data-to-slots adapter, while the new primitive owns the branded surface and interaction
states.

**Tech Stack:** Vue 3 SFCs, TypeScript, scoped CSS, Vue Test Utils, Vitest, Storybook 10, Vite.

**Spec:** `docs/superpowers/specs/2026-09-03-i9k-collapsible-design.md`

**Execution note:** The first showcase red run also exposed a pre-existing missing registry entry
for the already-public `I9kCheckboxGroup`. No existing branch or worktree contained that entry.
The user authorized repairing it as part of Task 3 so the repository-wide showcase contract can
return to green.

## Global Constraints

- Render native `details` and `summary`; do not recreate disclosure semantics in JavaScript.
- `defaultOpen?: boolean` defaults to `false` and supplies only the initial open state.
- Emit `toggle(open: boolean)` from the native toggle event.
- Provide a named `summary` slot and a default body slot.
- Every instance expands independently; do not add exclusive accordion coordination.
- Use existing design tokens and logical CSS properties for light/dark and LTR/RTL support.
- Disable component transitions under `prefers-reduced-motion: reduce`.
- Keep `I9kFaqList`'s existing `items: I9kFaqItem[]` API unchanged and implement it with
  `I9kCollapsible`.
- Do not add controlled state, disabled behavior, size variants, or animation configuration.

---

### Task 1: Build and export the native disclosure primitive

**Files:**

- Create: `tests/I9kCollapsible.test.ts`
- Create: `src/components/I9kCollapsible.vue`
- Modify: `src/index.ts`
- Modify: `tests/I9kComponentContracts.test.ts`
- Modify: `tests/I9kScopedStyles.test.ts`

**Interfaces:**

- Consumes: Vue's native `Event` and `HTMLDetailsElement` APIs; existing spacing, color, border,
  radius, and transition CSS tokens.
- Produces: public `I9kCollapsible` component with `defaultOpen?: boolean`, `summary` and default
  slots, and `toggle(open: boolean)`.

- [ ] **Step 1: Write failing component and contract tests**

Create `tests/I9kCollapsible.test.ts` with the behavioral contract:

```ts
import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kCollapsible from '../src/components/I9kCollapsible.vue';

describe('I9kCollapsible', () => {
  it('renders native disclosure markup and both slots', () => {
    const wrapper = mount(I9kCollapsible, {
      slots: {
        summary: '<strong>Module one</strong>',
        default: '<ol><li>First lesson</li></ol>',
      },
    });

    expect(wrapper.element.tagName).toBe('DETAILS');
    expect(wrapper.get('summary strong').text()).toBe('Module one');
    expect(wrapper.get('.i9k-collapsible__body li').text()).toBe('First lesson');
    expect(wrapper.get('.i9k-collapsible__indicator').attributes('aria-hidden')).toBe('true');
  });

  it('is closed by default and supports an initially open state', () => {
    expect(mount(I9kCollapsible).get('details').element.open).toBe(false);
    expect(
      mount(I9kCollapsible, { props: { defaultOpen: true } }).get('details').element.open,
    ).toBe(true);
  });

  it('emits the current native open state after each toggle', async () => {
    const wrapper = mount(I9kCollapsible);
    const details = wrapper.get('details');

    details.element.open = true;
    await details.trigger('toggle');
    details.element.open = false;
    await details.trigger('toggle');

    expect(wrapper.emitted('toggle')).toEqual([[true], [false]]);
  });

  it('does not coordinate the state of sibling instances', async () => {
    const host = mount(
      defineComponent({
        components: { I9kCollapsible },
        template: `
          <div>
            <I9kCollapsible><template #summary>One</template>First</I9kCollapsible>
            <I9kCollapsible><template #summary>Two</template>Second</I9kCollapsible>
          </div>
        `,
      }),
    );
    const details = host.findAll('details');

    details[0].element.open = true;
    await details[0].trigger('toggle');
    details[1].element.open = true;
    await details[1].trigger('toggle');

    expect(details.map((item) => item.element.open)).toEqual([true, true]);
  });
});
```

Add this statement to a new `collapsibleExports` tuple in
`tests/I9kComponentContracts.test.ts`, then assert it with `it.each`:

```ts
const collapsibleExports = [
  "export { default as I9kCollapsible } from './components/I9kCollapsible.vue';",
] as const;
```

Add `['I9kCollapsible.vue', 'i9k-collapsible']` to `migratedComponents` in
`tests/I9kScopedStyles.test.ts`.

- [ ] **Step 2: Run the focused tests and verify the red state**

Run:

```bash
npx vitest run tests/I9kCollapsible.test.ts tests/I9kComponentContracts.test.ts tests/I9kScopedStyles.test.ts
```

Expected: FAIL because `src/components/I9kCollapsible.vue` and its public export do not exist.

- [ ] **Step 3: Implement `I9kCollapsible`**

Create `src/components/I9kCollapsible.vue`:

```vue
<script setup lang="ts">
const props = withDefaults(defineProps<{ defaultOpen?: boolean }>(), {
  defaultOpen: false,
});

const emit = defineEmits<{ toggle: [open: boolean] }>();
const initialOpen = props.defaultOpen;

function onToggle(event: Event) {
  const details = event.currentTarget;
  if (!(details instanceof HTMLDetailsElement)) return;
  emit('toggle', details.open);
}
</script>

<template>
  <details class="i9k-collapsible" :open="initialOpen" @toggle="onToggle">
    <summary class="i9k-collapsible__summary">
      <span class="i9k-collapsible__summary-content"><slot name="summary" /></span>
      <span class="i9k-collapsible__indicator" aria-hidden="true" />
    </summary>
    <div class="i9k-collapsible__body"><slot /></div>
  </details>
</template>

<style scoped>
.i9k-collapsible {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--glass-bg);
  transition: var(--transition);
}

.i9k-collapsible:hover,
.i9k-collapsible[open] {
  border-color: color-mix(in srgb, var(--primary-color) 34%, var(--border-color));
}

.i9k-collapsible__summary {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--spacing-8);
  align-items: center;
  padding: var(--spacing-8) var(--spacing-10);
  border-radius: inherit;
  cursor: pointer;
  font-weight: 600;
  list-style: none;
  transition: var(--transition);
}

.i9k-collapsible__summary::-webkit-details-marker {
  display: none;
}

.i9k-collapsible__summary:hover {
  background: var(--primary-color-alpha-12);
}

.i9k-collapsible__summary:focus-visible {
  outline: 3px solid var(--accent-color);
  outline-offset: 3px;
}

.i9k-collapsible__summary-content {
  min-width: 0;
}

.i9k-collapsible__indicator {
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: var(--radius-circle);
  background: var(--primary-color-alpha-12);
}

.i9k-collapsible__indicator::before,
.i9k-collapsible__indicator::after {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  width: 0.75rem;
  height: 2px;
  background: var(--primary-text-color);
  content: '';
  transform: translate(-50%, -50%);
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.i9k-collapsible__indicator::after {
  transform: translate(-50%, -50%) rotate(90deg);
}

.i9k-collapsible[open] .i9k-collapsible__indicator::after {
  transform: translate(-50%, -50%) rotate(0deg);
}

.i9k-collapsible__body {
  padding: 0 var(--spacing-10) var(--spacing-10);
  color: var(--text-color-light);
  line-height: 1.6;
}

@media (prefers-reduced-motion: reduce) {
  .i9k-collapsible,
  .i9k-collapsible__summary,
  .i9k-collapsible__indicator::before,
  .i9k-collapsible__indicator::after {
    transition: none;
  }
}
</style>
```

Add the public export to `src/index.ts` alongside the content components:

```ts
export { default as I9kCollapsible } from './components/I9kCollapsible.vue';
```

- [ ] **Step 4: Run focused tests and verify the green state**

Run:

```bash
npx vitest run tests/I9kCollapsible.test.ts tests/I9kComponentContracts.test.ts tests/I9kScopedStyles.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit the primitive**

```bash
git add src/components/I9kCollapsible.vue src/index.ts tests/I9kCollapsible.test.ts tests/I9kComponentContracts.test.ts tests/I9kScopedStyles.test.ts
git commit -m "feat: add I9kCollapsible"
```

### Task 2: Compose I9kFaqList from I9kCollapsible

**Files:**

- Create: `tests/I9kFaqList.test.ts`
- Modify: `src/components/I9kFaqList.vue`

**Interfaces:**

- Consumes: `I9kCollapsible` from Task 1 with `summary` and default slots.
- Produces: unchanged `I9kFaqList` props contract with internal `I9kCollapsible` composition.

- [ ] **Step 1: Write the failing FAQ composition regression test**

Create `tests/I9kFaqList.test.ts`:

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kCollapsible from '../src/components/I9kCollapsible.vue';
import I9kFaqList from '../src/components/I9kFaqList.vue';

const items = [
  { question: 'What is included?', answer: 'Components, tokens, and typography.' },
  { question: 'Does it support Arabic?', answer: 'Yes, including RTL layouts.' },
];

describe('I9kFaqList', () => {
  it('renders every item through I9kCollapsible without changing its items API', () => {
    const wrapper = mount(I9kFaqList, { props: { items } });
    const disclosures = wrapper.findAllComponents(I9kCollapsible);

    expect(disclosures).toHaveLength(2);
    expect(wrapper.findAll('details')).toHaveLength(2);
    expect(wrapper.findAll('summary').map((summary) => summary.text())).toEqual([
      'What is included?',
      'Does it support Arabic?',
    ]);
    expect(wrapper.text()).toContain('Components, tokens, and typography.');
    expect(wrapper.text()).toContain('Yes, including RTL layouts.');
  });

  it('keeps FAQ disclosures independently expandable', async () => {
    const wrapper = mount(I9kFaqList, { props: { items } });
    const details = wrapper.findAll('details');

    details[0].element.open = true;
    await details[0].trigger('toggle');
    details[1].element.open = true;
    await details[1].trigger('toggle');

    expect(details.map((item) => item.element.open)).toEqual([true, true]);
  });
});
```

- [ ] **Step 2: Run the FAQ test and verify the red state**

Run:

```bash
npx vitest run tests/I9kFaqList.test.ts
```

Expected: FAIL because `I9kFaqList` still renders `details` directly and contains zero
`I9kCollapsible` component instances.

- [ ] **Step 3: Refactor I9kFaqList without changing its props**

Update `src/components/I9kFaqList.vue` to import and compose the primitive:

```vue
<script setup lang="ts">
import I9kCollapsible from './I9kCollapsible.vue';

export interface I9kFaqItem {
  question: string;
  answer: string;
}
defineProps<{ items: I9kFaqItem[] }>();
</script>

<template>
  <div class="i9k-faq-list">
    <I9kCollapsible v-for="item in items" :key="item.question">
      <template #summary>{{ item.question }}</template>
      <p class="i9k-faq-answer">{{ item.answer }}</p>
    </I9kCollapsible>
  </div>
</template>

<style scoped>
.i9k-faq-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.i9k-faq-answer {
  margin: 0;
}
</style>
```

- [ ] **Step 4: Run the component regression tests**

Run:

```bash
npx vitest run tests/I9kCollapsible.test.ts tests/I9kFaqList.test.ts tests/I9kScopedStyles.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit the FAQ migration**

```bash
git add src/components/I9kFaqList.vue tests/I9kFaqList.test.ts
git commit -m "refactor: build I9kFaqList with I9kCollapsible"
```

### Task 3: Document the public component and verify the package

**Files:**

- Create: `stories/I9kCollapsible.stories.ts`
- Create: `showcase/registry/I9kCollapsible.ts`
- Create: `showcase/registry/I9kCheckboxGroup.ts`
- Modify: `showcase/registry/index.ts`
- Modify: `showcase/registry/I9kFaqList.ts`
- Modify: `tests/showcaseRegistry.test.ts`

**Interfaces:**

- Consumes: the public `I9kCollapsible` API from Task 1 and the unchanged `I9kFaqList` API from
  Task 2.
- Produces: Storybook scenarios, an agent-facing showcase entry, and a manifest that lists 36
  public components, including restored documentation coverage for `I9kCheckboxGroup`.

- [ ] **Step 1: Tighten the showcase test for the new public component count**

In `tests/showcaseRegistry.test.ts`, change the discovery assertion from 35 to 36:

```ts
expect(exportedNames.length).toBe(36);
```

- [ ] **Step 2: Run the showcase registry test and verify the red state**

Run:

```bash
npx vitest run tests/showcaseRegistry.test.ts
```

Expected: FAIL because `I9kCollapsible` is exported but has no showcase registry entry.

- [ ] **Step 3: Add Storybook coverage**

Create `stories/I9kCollapsible.stories.ts` with five stories:

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite';

import I9kCollapsible from '../src/components/I9kCollapsible.vue';

const meta = {
  title: 'Components/I9kCollapsible',
  component: I9kCollapsible,
  args: { defaultOpen: false },
} satisfies Meta<typeof I9kCollapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  render: (args) => ({
    components: { I9kCollapsible },
    setup: () => ({ args }),
    template:
      '<I9kCollapsible v-bind="args"><template #summary>Course module</template><p>Module lessons and resources.</p></I9kCollapsible>',
  }),
};

export const InitiallyOpen: Story = {
  args: { defaultOpen: true },
  render: Closed.render,
};

export const RichSummary: Story = {
  render: () => ({
    components: { I9kCollapsible },
    template: `<I9kCollapsible>
      <template #summary><span><strong>Module 03</strong> · 9 topics</span></template>
      <ol><li>Plan</li><li>Design</li><li>Build</li></ol>
    </I9kCollapsible>`,
  }),
};

export const Independent: Story = {
  render: () => ({
    components: { I9kCollapsible },
    template: `<div style="display: grid; gap: var(--spacing-6)">
      <I9kCollapsible :default-open="true"><template #summary>First</template>Open together.</I9kCollapsible>
      <I9kCollapsible :default-open="true"><template #summary>Second</template>Also open.</I9kCollapsible>
    </div>`,
  }),
};

export const Rtl: Story = {
  render: () => ({
    components: { I9kCollapsible },
    template: `<div dir="rtl" lang="ar">
      <I9kCollapsible :default-open="true"><template #summary>الوحدة الأولى</template><p>محتوى الوحدة وتفاصيلها.</p></I9kCollapsible>
    </div>`,
  }),
};
```

- [ ] **Step 4: Add and register the agent-facing showcase entry**

Create `showcase/registry/I9kCollapsible.ts`:

```ts
import type { ShowcaseEntry } from './types';

export const I9kCollapsibleEntry: ShowcaseEntry = {
  name: 'I9kCollapsible',
  section: 'content',
  summary:
    'Native, independently expanding disclosure surface with slots for rich summary and body content.',
  agentPrompt: `Use I9kCollapsible from @9klabs/design for a single branded disclosure that may contain rich Vue markup.

import { I9kCollapsible } from '@9klabs/design';

Props:
- defaultOpen?: boolean (default false) — sets only the initial native open state.

Emits:
- toggle(open: boolean) — reports the current native details.open value after a user toggle.

Slots:
- summary — content rendered inside the native <summary>.
- default — content rendered in the disclosure body.

Behavior: the component renders native <details>/<summary>. Each instance owns its browser-managed state, so siblings expand independently and any number may stay open.

IMPORTANT: defaultOpen is an initial-state option, not a controlled prop. Listen to @toggle when a parent needs to observe changes.

Usage:
<I9kCollapsible :default-open="true" @toggle="(open) => console.log(open)">
  <template #summary><strong>Module 01</strong> · 7 topics</template>
  <ol><li>What is coding?</li><li>Engineering judgment</li></ol>
</I9kCollapsible>`,
  gotchas: [
    '`defaultOpen` controls only the initial state; it is not a v-model or controlled-state API.',
    'Sibling instances expand independently; use a different component if only one section may be open.',
    'Provide visible summary content because the summary slot is the disclosure control label.',
  ],
  demos: [
    {
      label: 'Closed',
      code: `<I9kCollapsible>
  <template #summary>Course module</template>
  <p>Module lessons and resources.</p>
</I9kCollapsible>`,
    },
    {
      label: 'Initially open',
      code: `<I9kCollapsible :default-open="true">
  <template #summary>Course module</template>
  <p>This body is visible when the example first renders.</p>
</I9kCollapsible>`,
    },
    {
      label: 'Rich summary',
      code: `<I9kCollapsible>
  <template #summary><span><strong>Module 03</strong> · 9 topics</span></template>
  <ol><li>Plan</li><li>Design</li><li>Build</li></ol>
</I9kCollapsible>`,
    },
    {
      label: 'Independent instances',
      code: `<div style="display: grid; gap: var(--spacing-6)">
  <I9kCollapsible :default-open="true"><template #summary>First</template><p>Open together.</p></I9kCollapsible>
  <I9kCollapsible :default-open="true"><template #summary>Second</template><p>Also open.</p></I9kCollapsible>
</div>`,
    },
    {
      label: 'Arabic RTL',
      code: `<div dir="rtl" lang="ar">
  <I9kCollapsible :default-open="true">
    <template #summary>الوحدة الأولى</template>
    <p>محتوى الوحدة وتفاصيلها.</p>
  </I9kCollapsible>
</div>`,
    },
  ],
};
```

Import `I9kCollapsibleEntry` in `showcase/registry/index.ts` and place it in the `content` section
immediately before `I9kFaqListEntry`.

Create `showcase/registry/I9kCheckboxGroup.ts` from the component's existing public API and
Storybook scenarios. Register `I9kCheckboxGroupEntry` in the `forms` section immediately before
`I9kInputEntry`. Its prompt must document the required `modelValue`, `options`, and `legend` props;
the optional `name`, `hint`, `error`, `required`, `disabled`, `size`, and `orientation` props; the
`update:modelValue` event; its native fieldset/checkbox semantics; and immutable array updates.
Provide default, horizontal, validation-error, and Arabic RTL demos using only supported props.

In `showcase/registry/I9kFaqList.ts`, replace the current summary with:

```ts
summary:
  'List of collapsible question/answer pairs composed from I9kCollapsible. Use it for plain-text FAQ content without wiring open/close state.',
```

Replace its `Behavior:` paragraph with this exact compatibility guidance:

```text
Behavior: each item is rendered through I9kCollapsible and retains independent native <details> state. Opening one item never closes another, and no Vue state wiring is required.
```

- [ ] **Step 5: Run showcase and component tests**

Run:

```bash
npx vitest run tests/showcaseRegistry.test.ts tests/showcaseManifest.test.ts tests/showcaseDemos.test.ts tests/I9kCollapsible.test.ts tests/I9kFaqList.test.ts
```

Expected: PASS.

- [ ] **Step 6: Format and run the complete repository verification**

Run:

```bash
npm run format
npm run check
```

Expected: all component tests, formatting checks, lint, type checks, library build, Storybook
build, and showcase build pass.

- [ ] **Step 7: Inspect the final diff and commit documentation**

Run:

```bash
git diff --check
git status --short
git diff --stat HEAD~2
```

Confirm that generated `dist/`, `storybook-static/`, and `showcase-dist/` files are not staged.
Then commit only the authored documentation and registry files:

```bash
git add stories/I9kCollapsible.stories.ts showcase/registry/I9kCollapsible.ts showcase/registry/I9kFaqList.ts showcase/registry/index.ts tests/showcaseRegistry.test.ts docs/superpowers/plans/2026-09-03-i9k-collapsible.md
git commit -m "docs: document I9kCollapsible"
```
