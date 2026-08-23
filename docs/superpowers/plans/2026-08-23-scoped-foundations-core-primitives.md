# Scoped Foundations and Core Primitives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the shared size contract and migrate `I9kButton`, `I9kInput`, and `I9kToast` to self-contained scoped styles without breaking the current website.

**Architecture:** Add public size/tone types and global brand size tokens, then let each migrated Vue SFC consume those tokens from its own `<style scoped>` block. Keep the existing selectors in `primitives.css` temporarily as website compatibility CSS; scoped `i9k-` classes become the source of truth for the migrated components.

**Tech Stack:** Vue 3.5 SFCs, TypeScript 5.7, CSS custom properties, Vitest 4, Vue Test Utils 2, Storybook 10, Vite 7.

**Spec:** `docs/superpowers/specs/2026-08-23-component-library-design.md`

## Global Constraints

- Keep the visual language tightly coupled to the current Ismail9k design system.
- Every migrated visual component accepts `size="sm | md | lg"` and defaults to `md`.
- Component appearance belongs in Vue SFC `<style scoped>` blocks.
- Global CSS remains limited to normalization, fonts, brand tokens, themes, branded element defaults, accessibility utilities, and temporary website compatibility selectors.
- Existing `I9kButton` variants and classes remain available until the website migration ledger permits their removal.
- Preserve light/dark modes, English/Arabic content, LTR/RTL direction, reduced motion, SSR, and static generation behavior.
- Use TypeScript and Vue SFCs with two-space indentation, single quotes, trailing commas, and a 100-character print width.
- Do not modify `../ismail9k.com` in this phase; its worktree contains unrelated local changes.

## Phase Boundary

This is the first executable slice of a multi-plan program. It deliberately does not install Reka UI, add new overlay components, remove `primitives.css`, change the website, or normalize the deprecated Button variants. Those changes belong to later plans for layout/surfaces, forms, overlays/feedback, navigation/disclosure, and website stabilization. This phase produces a compatible package release on its own.

## File Structure

- `src/types/components.ts` — public cross-component size and tone types.
- `src/styles/tokens.css` — global brand values used by scoped components.
- `src/components/I9kButton.vue` — Button behavior plus scoped Button appearance.
- `src/components/I9kInput.vue` — current field/input behavior plus scoped appearance.
- `src/components/I9kToast.vue` — directly rendered Toast behavior plus scoped appearance.
- `src/styles/primitives.css` — unchanged compatibility selectors during this phase, with an explicit migration comment.
- `src/index.ts` — public type exports alongside existing components.
- `tests/componentContracts.test.ts` — source-level tests for public contracts and size tokens.
- `tests/I9kButton.test.ts` — Button rendering, links, variants, and sizes.
- `tests/I9kInput.test.ts` — Input values, attributes, descriptions, errors, and sizes.
- `tests/I9kToast.test.ts` — Toast roles, variants, and sizes.
- `tests/scopedStyles.test.ts` — guard that the migrated SFCs contain scoped styles and prefixed classes.
- `stories/I9kButton.stories.ts` — Button sizes and compatibility states.
- `stories/I9kInput.stories.ts` — Input sizes, error, and RTL states.
- `stories/I9kToast.stories.ts` — Toast sizes, tones, and RTL states.
- `README.md` — size contract and scoped-style boundary for consumers.

---

### Task 1: Add shared component contracts and size tokens

**Files:**

- Create: `src/types/components.ts`
- Create: `tests/componentContracts.test.ts`
- Modify: `src/styles/tokens.css:37-70`
- Modify: `src/index.ts:1-23`

**Interfaces:**

- Consumes: existing global token file and package entry point.
- Produces: `I9kComponentSize`, `I9kTone`, and the `--control-*` and `--component-gap-*` CSS custom properties used by Tasks 2-4.

- [ ] **Step 1: Write the failing contract test**

Create `tests/componentContracts.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const indexSource = readFileSync(resolve('src/index.ts'), 'utf8');
const tokenSource = readFileSync(resolve('src/styles/tokens.css'), 'utf8');

describe('shared component contracts', () => {
  it('exports the common component types', () => {
    expect(indexSource).toContain(
      "export type { I9kComponentSize, I9kTone } from './types/components';",
    );
  });

  it.each([
    ['--control-height-sm', '2rem'],
    ['--control-height-md', '2.5rem'],
    ['--control-height-lg', '3rem'],
    ['--control-font-size-sm', '0.875rem'],
    ['--control-font-size-md', '1rem'],
    ['--control-font-size-lg', '1.125rem'],
    ['--component-gap-sm', 'var(--spacing-4)'],
    ['--component-gap-md', 'var(--spacing-6)'],
    ['--component-gap-lg', 'var(--spacing-8)'],
  ])('declares %s as %s', (name, value) => {
    expect(tokenSource).toContain(`${name}: ${value};`);
  });
});
```

- [ ] **Step 2: Run the contract test and verify it fails**

Run:

```bash
npm test -- tests/componentContracts.test.ts
```

Expected: FAIL because `src/types/components.ts`, the public export, and size tokens do not exist.

- [ ] **Step 3: Add the shared TypeScript types**

Create `src/types/components.ts`:

```ts
export type I9kComponentSize = 'sm' | 'md' | 'lg';

export type I9kTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
```

Add this export immediately after the stylesheet import in `src/index.ts`:

```ts
export type { I9kComponentSize, I9kTone } from './types/components';
```

- [ ] **Step 4: Add the shared size tokens**

Insert after `--text-size-2` in `src/styles/tokens.css`:

```text
  /* Component sizing. Scoped components consume these brand values. */
  --control-height-sm: 2rem;
  --control-height-md: 2.5rem;
  --control-height-lg: 3rem;
  --control-font-size-sm: 0.875rem;
  --control-font-size-md: 1rem;
  --control-font-size-lg: 1.125rem;
  --component-gap-sm: var(--spacing-4);
  --component-gap-md: var(--spacing-6);
  --component-gap-lg: var(--spacing-8);
```

- [ ] **Step 5: Run the focused test and typecheck**

Run:

```bash
npm test -- tests/componentContracts.test.ts
npm run typecheck
```

Expected: both commands PASS.

- [ ] **Step 6: Commit the shared contracts**

```bash
git add src/types/components.ts src/styles/tokens.css src/index.ts tests/componentContracts.test.ts
git commit -m "feat: add shared component size contracts"
```

---

### Task 2: Migrate I9kButton to scoped styles and sizes

**Files:**

- Modify: `src/components/I9kButton.vue:1-32`
- Modify: `src/styles/primitives.css:219-335`
- Modify: `tests/I9kButton.test.ts:1-29`

**Interfaces:**

- Consumes: `I9kComponentSize` and the control size tokens from Task 1.
- Produces: `I9kButton` with `size?: I9kComponentSize`, default `md`, scoped `i9k-button` classes, and unchanged legacy `.btn` classes/variants.

- [ ] **Step 1: Extend the Button tests with the size contract**

Add these cases inside the existing `describe('I9kButton')` block:

```ts
it('uses the medium size by default', () => {
  const wrapper = mount(I9kButton, { slots: { default: 'Save' } });

  expect(wrapper.get('button').classes()).toEqual(
    expect.arrayContaining([
      'btn',
      'btn--default',
      'i9k-button',
      'i9k-button--default',
      'i9k-button--md',
    ]),
  );
});

it.each(['sm', 'md', 'lg'] as const)('renders the %s size', (size) => {
  const wrapper = mount(I9kButton, {
    props: { size },
    slots: { default: size },
  });

  expect(wrapper.get('button').classes()).toContain(`i9k-button--${size}`);
});

it('keeps the active compatibility class', () => {
  const wrapper = mount(I9kButton, {
    props: { variant: 'filter', active: true },
    slots: { default: 'Selected' },
  });

  expect(wrapper.get('button').classes()).toEqual(
    expect.arrayContaining(['btn--filter', 'i9k-button--filter', 'is-active']),
  );
});
```

- [ ] **Step 2: Run the Button test and verify it fails**

Run:

```bash
npm test -- tests/I9kButton.test.ts
```

Expected: FAIL because `size` and the `i9k-button` classes are not implemented.

- [ ] **Step 3: Add the Button size prop and scoped class names**

Import the shared type:

```ts
import type { I9kComponentSize } from '../types/components';
```

Add `size?: I9kComponentSize` to the prop type, add `size: 'md'` to the defaults, and replace the
class binding with:

```vue
:class="[ 'btn', `btn--${variant}`, 'i9k-button', `i9k-button--${variant}`, `i9k-button--${size}`, {
'is-active': active }, ]"
```

- [ ] **Step 4: Add the complete scoped Button stylesheet**

Append this block to `I9kButton.vue`:

```css
<style scoped>
.i9k-button {
  --i9k-button-height: var(--control-height-md);
  --i9k-button-padding: var(--spacing-8);
  --i9k-button-wide-padding: var(--spacing-11);
  --i9k-button-page-padding: var(--spacing-10);
  --i9k-button-font-size: var(--control-font-size-md);

  display: inline-flex;
  min-height: var(--i9k-button-height);
  align-items: center;
  justify-content: center;
  border: none;
  appearance: none;
  cursor: pointer;
  font-family: inherit;
  font-size: var(--i9k-button-font-size);
  text-decoration: none;
  transition: var(--transition);
}

.i9k-button--sm {
  --i9k-button-height: var(--control-height-sm);
  --i9k-button-padding: var(--spacing-6);
  --i9k-button-wide-padding: var(--spacing-8);
  --i9k-button-page-padding: var(--spacing-8);
  --i9k-button-font-size: var(--control-font-size-sm);
}

.i9k-button--lg {
  --i9k-button-height: var(--control-height-lg);
  --i9k-button-padding: var(--spacing-11);
  --i9k-button-wide-padding: var(--spacing-13);
  --i9k-button-page-padding: var(--spacing-11);
  --i9k-button-font-size: var(--control-font-size-lg);
}

.i9k-button--default {
  gap: var(--spacing-5);
  padding: 0 var(--i9k-button-padding);
  border: 1px solid currentColor;
  border-radius: var(--radius-sm);
  background: var(--white-color-alpha-20);
  color: var(--theme-text-color);
  font-weight: 500;
}

.i9k-button--default:hover {
  border-color: var(--accent-color);
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
}

.i9k-button--primary {
  padding: 0 var(--i9k-button-wide-padding);
  border-radius: var(--radius-pill);
  background: var(--primary-color);
  color: var(--on-primary-color);
  font-weight: 700;
}

.i9k-button--primary:hover {
  background: var(--accent-color);
  transform: translateY(-1px);
}

.i9k-button--link {
  min-height: auto;
  padding: 0;
  background: transparent;
  color: var(--primary-text-color);
  font-weight: 700;
  text-decoration-color: var(--accent-color);
}

.i9k-button--link:hover {
  text-decoration: underline;
  text-decoration-color: var(--accent-color);
}

.i9k-button--filter {
  padding: 0 var(--i9k-button-padding);
  border: 1px solid var(--dark-color-alpha-20);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--theme-text-color);
  font-weight: 500;
}

.i9k-button--pagination {
  padding: 0 var(--i9k-button-page-padding);
  border: 1px solid var(--dark-color-alpha-20);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--theme-text-color);
  font-weight: 500;
}

.i9k-button--page {
  width: var(--i9k-button-height);
  height: var(--i9k-button-height);
  min-height: 0;
  padding: 0;
  border: 1px solid var(--dark-color-alpha-20);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--theme-text-color);
  font-weight: 500;
}

.i9k-button--filter:hover,
.i9k-button--pagination:hover:not(:disabled),
.i9k-button--page:hover {
  border-color: var(--accent-color);
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
}

.i9k-button--filter.is-active {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: var(--on-primary-color);
}

.i9k-button--page.is-active {
  border-color: var(--accent-color);
  background: var(--accent-color);
  color: var(--on-accent-color);
}

.i9k-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

:global(.dark) :is(.i9k-button--filter, .i9k-button--pagination, .i9k-button--page) {
  border-color: var(--white-color-alpha-20);
}

@media (prefers-reduced-motion: reduce) {
  .i9k-button {
    transition: none;
  }

  .i9k-button--primary:hover {
    transform: none;
  }
}
</style>
```

Add this comment above the legacy Button block in `src/styles/primitives.css` without deleting
the rules:

```css
/* Temporary website compatibility. I9kButton owns its current appearance in scoped SFC styles;
   remove this block only after the migration ledger reports zero .btn usage. */
```

- [ ] **Step 5: Run Button tests and checks**

Run:

```bash
npm test -- tests/I9kButton.test.ts tests/normalizeStyles.test.ts
npm run typecheck
```

Expected: all commands PASS, including the legacy cascade test.

- [ ] **Step 6: Commit the Button migration**

```bash
git add src/components/I9kButton.vue src/styles/primitives.css tests/I9kButton.test.ts
git commit -m "feat: scope button styles and sizes"
```

---

### Task 3: Migrate I9kInput to scoped styles and sizes

**Files:**

- Modify: `src/components/I9kInput.vue:1-48`
- Modify: `src/styles/primitives.css:501-546`
- Create: `tests/I9kInput.test.ts`

**Interfaces:**

- Consumes: `I9kComponentSize` and the control size tokens from Task 1.
- Produces: the existing standalone `I9kInput` API plus `size?: I9kComponentSize`, default `md`, with labels/errors/attributes unchanged.

- [ ] **Step 1: Write focused Input tests**

Create `tests/I9kInput.test.ts`:

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kInput from '../src/components/I9kInput.vue';

describe('I9kInput', () => {
  it('forwards native attributes to the input and emits its value', async () => {
    const wrapper = mount(I9kInput, {
      props: { modelValue: '', label: 'Email' },
      attrs: { name: 'email', autocomplete: 'email' },
    });
    const input = wrapper.get('input');

    expect(input.attributes('name')).toBe('email');
    expect(input.attributes('autocomplete')).toBe('email');
    expect(wrapper.attributes('name')).toBeUndefined();

    await input.setValue('person@example.com');
    expect(wrapper.emitted('update:modelValue')).toEqual([['person@example.com']]);
  });

  it('associates an error and suppresses the hint', () => {
    const wrapper = mount(I9kInput, {
      props: {
        modelValue: '',
        label: 'Email',
        hint: 'Use your work address',
        error: 'Enter a valid email',
      },
    });
    const input = wrapper.get('input');
    const error = wrapper.get('[role="alert"]');

    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('aria-describedby')).toBe(error.attributes('id'));
    expect(wrapper.text()).not.toContain('Use your work address');
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s size', (size) => {
    const wrapper = mount(I9kInput, {
      props: { modelValue: '', label: 'Name', size },
    });

    expect(wrapper.get('.i9k-field').classes()).toContain(`i9k-field--${size}`);
    expect(wrapper.get('input').classes()).toContain(`i9k-input--${size}`);
  });
});
```

- [ ] **Step 2: Run the Input test and verify it fails**

Run:

```bash
npm test -- tests/I9kInput.test.ts
```

Expected: the behavior cases pass, but size cases FAIL because the prop and prefixed classes do not exist.

- [ ] **Step 3: Add the Input size contract and prefixed classes**

Import `I9kComponentSize`, add `size?: I9kComponentSize` to props, and default it to `md`.

Update the template classes to:

```vue
<div :class="['field', 'i9k-field', `i9k-field--${size}`]">
  <label class="field__label i9k-field__label" :for="fieldId">
    {{ label }}<span v-if="required" aria-hidden="true"> *</span>
  </label>
  <input
    :id="fieldId"
    :class="['field__input', 'i9k-input', `i9k-input--${size}`]"
    :type="type"
    :value="modelValue"
    :required="required"
    :aria-invalid="error ? 'true' : undefined"
    :aria-describedby="error ? errorId : hint ? hintId : undefined"
    v-bind="attrs"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
  <p v-if="hint && !error" :id="hintId" class="field__hint i9k-field__hint">{{ hint }}</p>
  <p v-if="error" :id="errorId" class="field__error i9k-field__error" role="alert">
    {{ error }}
  </p>
</div>
```

- [ ] **Step 4: Add the scoped Input stylesheet**

Append:

```css
<style scoped>
.i9k-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  margin-block-end: var(--spacing-8);
}

.i9k-field__label {
  color: var(--text-color);
  font-size: var(--text-size-1);
  font-weight: 600;
}

.i9k-input {
  width: 100%;
  min-height: var(--control-height-md);
  padding: 0 var(--spacing-6);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--glass-bg);
  color: var(--text-color);
  font-family: inherit;
  font-size: var(--control-font-size-md);
  transition: var(--transition);
}

.i9k-input--sm {
  min-height: var(--control-height-sm);
  padding-inline: var(--spacing-5);
  font-size: var(--control-font-size-sm);
}

.i9k-input--lg {
  min-height: var(--control-height-lg);
  padding-inline: var(--spacing-8);
  font-size: var(--control-font-size-lg);
}

.i9k-input:focus-visible {
  border-color: var(--accent-color);
  outline: 2px solid var(--accent-color);
  outline-offset: 1px;
}

.i9k-input[aria-invalid='true'] {
  border-color: var(--accent-color);
}

.i9k-field__hint {
  color: var(--text-color-light);
  font-size: var(--text-size-1);
}

.i9k-field__error {
  color: var(--accent-color);
  font-size: var(--text-size-1);
  font-weight: 600;
}

@media (prefers-reduced-motion: reduce) {
  .i9k-input {
    transition: none;
  }
}
</style>
```

Add this comment above the legacy Field block in `primitives.css` and keep the declarations:

```css
/* Temporary website compatibility. I9kInput owns its current appearance in scoped SFC styles;
   remove this block only after the migration ledger reports zero .field usage. */
```

- [ ] **Step 5: Run Input tests and typecheck**

Run:

```bash
npm test -- tests/I9kInput.test.ts tests/normalizeStyles.test.ts
npm run typecheck
```

Expected: all commands PASS.

- [ ] **Step 6: Commit the Input migration**

```bash
git add src/components/I9kInput.vue src/styles/primitives.css tests/I9kInput.test.ts
git commit -m "feat: scope input styles and sizes"
```

---

### Task 4: Migrate I9kToast to scoped styles and sizes

**Files:**

- Modify: `src/components/I9kToast.vue:1-15`
- Modify: `src/styles/primitives.css:548-575`
- Create: `tests/I9kToast.test.ts`

**Interfaces:**

- Consumes: `I9kComponentSize` and component gap tokens from Task 1.
- Produces: directly rendered `I9kToast` with `size?: I9kComponentSize`, default `md`, and unchanged `info | success | error` roles.

- [ ] **Step 1: Write focused Toast tests**

Create `tests/I9kToast.test.ts`:

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kToast from '../src/components/I9kToast.vue';

describe('I9kToast', () => {
  it.each([
    ['info', 'status'],
    ['success', 'status'],
    ['error', 'alert'],
  ] as const)('renders %s with the %s role', (variant, role) => {
    const wrapper = mount(I9kToast, {
      props: { variant },
      slots: { default: variant },
    });

    expect(wrapper.attributes('role')).toBe(role);
    expect(wrapper.classes()).toContain(`i9k-toast--${variant}`);
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s size', (size) => {
    const wrapper = mount(I9kToast, {
      props: { size },
      slots: { default: size },
    });

    expect(wrapper.classes()).toContain(`i9k-toast--${size}`);
  });
});
```

- [ ] **Step 2: Run the Toast test and verify it fails**

Run:

```bash
npm test -- tests/I9kToast.test.ts
```

Expected: FAIL because the prefixed variant classes and size contract do not exist.

- [ ] **Step 3: Add the Toast size prop and prefixed classes**

Use this script block:

```vue
<script setup lang="ts">
import type { I9kComponentSize } from '../types/components';

type Variant = 'info' | 'success' | 'error';

const props = withDefaults(defineProps<{ variant?: Variant; size?: I9kComponentSize }>(), {
  variant: 'info',
  size: 'md',
});
</script>
```

Replace the root class binding with:

```vue
:class="['toast', `toast--${props.variant}`, 'i9k-toast', `i9k-toast--${props.variant}`,
`i9k-toast--${props.size}`]"
```

- [ ] **Step 4: Add the scoped Toast stylesheet**

Append:

```css
<style scoped>
.i9k-toast {
  display: flex;
  align-items: flex-start;
  gap: var(--component-gap-md);
  padding: var(--spacing-6) var(--spacing-8);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  font-size: var(--text-size-1);
}

.i9k-toast--sm {
  gap: var(--component-gap-sm);
  padding: var(--spacing-4) var(--spacing-6);
  font-size: 0.75rem;
}

.i9k-toast--lg {
  gap: var(--component-gap-lg);
  padding: var(--spacing-8) var(--spacing-11);
  font-size: var(--text-size-2);
}

.i9k-toast--info {
  border-color: var(--border-color);
  color: var(--text-color);
}

.i9k-toast--success {
  border-color: var(--primary-color);
  color: var(--primary-text-color);
}

.i9k-toast--error {
  border-color: var(--accent-color);
  color: var(--accent-color);
}
</style>
```

Add this comment above the legacy Toast block and keep the declarations:

```css
/* Temporary website compatibility. I9kToast owns its current appearance in scoped SFC styles;
   remove this block only after the migration ledger reports zero .toast usage. */
```

- [ ] **Step 5: Run Toast tests and typecheck**

Run:

```bash
npm test -- tests/I9kToast.test.ts tests/normalizeStyles.test.ts
npm run typecheck
```

Expected: all commands PASS.

- [ ] **Step 6: Commit the Toast migration**

```bash
git add src/components/I9kToast.vue src/styles/primitives.css tests/I9kToast.test.ts
git commit -m "feat: scope toast styles and sizes"
```

---

### Task 5: Add scoped-style safeguards and complete documentation

**Files:**

- Create: `tests/scopedStyles.test.ts`
- Modify: `stories/I9kButton.stories.ts:4-40`
- Modify: `stories/I9kInput.stories.ts:4-37`
- Modify: `stories/I9kToast.stories.ts:4-37`
- Modify: `README.md:17-45`

**Interfaces:**

- Consumes: the scoped classes and size props produced by Tasks 2-4.
- Produces: a regression guard, all-size Storybook examples, and consumer-facing size/style documentation.

- [ ] **Step 1: Write the scoped-style source guard**

Create `tests/scopedStyles.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const migratedComponents = [
  ['I9kButton.vue', 'i9k-button'],
  ['I9kInput.vue', 'i9k-input'],
  ['I9kToast.vue', 'i9k-toast'],
] as const;

describe('migrated component styles', () => {
  it.each(migratedComponents)('%s owns scoped %s styles', (fileName, className) => {
    const source = readFileSync(resolve('src/components', fileName), 'utf8');

    expect(source).toMatch(/<style\s+scoped>/);
    expect(source).toContain(`.${className}`);
  });
});
```

- [ ] **Step 2: Run the guard**

Run:

```bash
npm test -- tests/scopedStyles.test.ts
```

Expected: PASS because the three components were migrated in Tasks 2-4.

- [ ] **Step 3: Add all-size Button, Input, and Toast stories**

In `I9kButton.stories.ts`, extend the existing `argTypes` object to:

```ts
argTypes: {
  variant: {
    control: 'select',
    options: ['default', 'primary', 'link', 'filter', 'pagination', 'page'],
  },
  size: { control: 'select', options: ['sm', 'md', 'lg'] },
},
```

In `I9kInput.stories.ts`, add this property after `args`:

```ts
argTypes: {
  size: { control: 'select', options: ['sm', 'md', 'lg'] },
},
```

In `I9kToast.stories.ts`, replace the existing `argTypes` object with:

```ts
argTypes: {
  variant: { control: 'select', options: ['info', 'success', 'error'] },
  size: { control: 'select', options: ['sm', 'md', 'lg'] },
},
```

Add this story to `I9kButton.stories.ts`:

```ts
export const Sizes: Story = {
  render: () => ({
    components: { I9kButton },
    template:
      '<div class="cluster"><I9kButton size="sm">Small</I9kButton><I9kButton size="md">Medium</I9kButton><I9kButton size="lg">Large</I9kButton></div>',
  }),
};
```

Add this story to `I9kInput.stories.ts`:

```ts
export const Sizes: Story = {
  render: () => ({
    components: { I9kInput },
    template:
      '<div><I9kInput model-value="" label="Small" size="sm" /><I9kInput model-value="" label="Medium" size="md" /><I9kInput model-value="" label="Large" size="lg" /></div>',
  }),
};
```

Add this story to `I9kToast.stories.ts`:

```ts
export const Sizes: Story = {
  render: () => ({
    components: { I9kToast },
    template:
      '<div class="grid"><I9kToast size="sm">Small notification</I9kToast><I9kToast size="md">Medium notification</I9kToast><I9kToast size="lg">Large notification</I9kToast></div>',
  }),
};
```

- [ ] **Step 4: Document the first scoped and sized components**

Add `I9kInput` and `I9kToast` to the README export list. Insert this section after the exports:

````markdown
## Component sizes and styles

Visual components use the shared `sm`, `md`, and `lg` size scale and default to `md`:

```vue
<I9kButton size="sm">Compact action</I9kButton>
<I9kInput v-model="email" label="Email" size="md" />
<I9kToast size="lg" variant="success">Saved successfully</I9kToast>
```

Component appearance is scoped to each Vue SFC. The global stylesheet supplies fonts, brand
tokens, themes, element defaults, accessibility utilities, and temporary compatibility styles
for the current `ismail9k.com` migration.
````

- [ ] **Step 5: Run focused tests and Storybook typecheck**

Run:

```bash
npm test -- tests/componentContracts.test.ts tests/I9kButton.test.ts tests/I9kInput.test.ts tests/I9kToast.test.ts tests/scopedStyles.test.ts
npm run typecheck
npm run build-storybook
```

Expected: all commands PASS; Storybook emits `storybook-static` without type or build errors.

- [ ] **Step 6: Run the complete package pipeline**

Run:

```bash
npm run check
npm pack --dry-run
```

Expected: both commands PASS. The dry run contains `dist/index.js`, `dist/index.d.ts`, and `dist/index.css`, with no Storybook or test files.

- [ ] **Step 7: Commit the safeguards and documentation**

```bash
git add tests/scopedStyles.test.ts stories/I9kButton.stories.ts stories/I9kInput.stories.ts stories/I9kToast.stories.ts README.md
git commit -m "docs: cover scoped component sizes"
```

## Phase Completion Gate

Before starting the layout/surfaces plan, confirm:

- `I9kComponentSize` and `I9kTone` are exported in declarations.
- Button, Input, and Toast render all three sizes and use scoped `i9k-` styles.
- Existing `.btn`, `.field`, and `.toast` compatibility selectors remain available to the website.
- Focus, invalid, dark, RTL, and reduced-motion behavior has not regressed.
- Unit tests, formatting, lint, typecheck, library build, Storybook build, and package dry run pass.
- The website repository remains untouched.
