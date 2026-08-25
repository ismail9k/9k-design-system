# Native Actions and Form Foundations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add six native, accessible action and form components and make `I9kInput` compose with a
shared field contract without breaking its standalone API.

**Architecture:** `I9kField` provides a private Vue injection context containing stable IDs,
description state, required/invalid state, size, and control registration. Native controls consume
that context while forwarding all supported attributes to their real interactive element. Action
components remain native button/link/group markup, and every component owns prefixed scoped CSS.

**Tech Stack:** Vue 3 SFCs, TypeScript, native HTML form controls, scoped CSS, Vitest, Vue Test
Utils, Vue server renderer, Storybook 10, Vite.

**Spec:** `docs/superpowers/specs/2026-08-24-native-actions-form-foundations-design.md`

## Global Constraints

- Start from merge commit `e9b97da8fc8b1bb15f79bb0088cd1948cbef37d8` on
  `feat/native-actions-form-foundations` in `.worktrees/native-actions-form-foundations`.
- The main checkout's user-owned `stories/I9kButton.stories.ts` modification must never enter this
  branch.
- Keep the visual language tightly coupled to the current Ismail9k design system.
- Every new visual component supports `sm`, `md`, and `lg` and defaults to `md`.
- Component appearance lives in Vue SFC `<style scoped>` blocks with `i9k-`-prefixed classes.
- Add no runtime dependency and no new global component selector.
- Use native HTML for buttons, links, textareas, selects, fieldsets, legends, and radio inputs.
- Preserve light/dark modes, English/Arabic content, LTR/RTL direction, reduced motion, SSR, and
  static-generation behavior.
- Native and ARIA attributes reach the actual interactive element, except unsupported native
  `I9kSelect` `size` and `multiple` attributes, which are rejected with a development warning.
- Keep all existing `I9kInput` standalone behavior, including native input `size` forwarding.
- Keep website compatibility CSS and website source unchanged.
- Public components and types are exported from `src/index.ts`.
- Test filenames follow `I9k<ComponentName>.test.ts` with no extra dot segments.
- Do not edit or commit `dist/` or `storybook-static/`.

## File Structure

- `src/composables/i9kField.ts`: private field injection key, context interface, ID merging, native
  attribute helpers, and control-registration contract.
- `src/components/I9kField.vue`: label, hint, error, size, scoped slot, and field provider.
- `src/components/I9kInput.vue`: standalone compatibility plus nested field consumption.
- `src/components/I9kTextarea.vue`: native multiline control consuming field context.
- `src/components/I9kSelect.vue`: native single-select control consuming field context.
- `src/types/icons.ts`: public icon-name type derived from the package icon registry.
- `src/components/I9kIconButton.vue`: accessible icon-only native button or link.
- `src/components/I9kButtonGroup.vue`: semantic action grouping and directional layout.
- `src/types/forms.ts`: public radio-option type.
- `src/components/I9kRadioGroup.vue`: native radio fieldset with default and card presentations.
- Matching files under `tests/` and `stories/`: public behavior and Storybook state coverage.
- `tests/I9kNativeActionsFormsSsr.test.ts`: server-rendering smoke coverage.
- `tests/I9kScopedStyles.test.ts`: scoped-style ownership safeguard.
- `README.md` and `docs/migrations/ismail9k-com-component-library.md`: public usage and migration
  readiness.

---

### Task 1: Add the field context and I9kField

**Files:**

- Create: `src/composables/i9kField.ts`
- Create: `src/components/I9kField.vue`
- Create: `tests/I9kField.test.ts`
- Create: `stories/I9kField.stories.ts`
- Modify: `src/index.ts`
- Modify: `tests/I9kScopedStyles.test.ts`

**Interfaces:**

- Consumes: `I9kComponentSize` from `src/types/components.ts`.
- Produces: `I9kFieldContext`, `provideI9kField`, `useI9kField`, `mergeI9kIds`,
  `i9kStringAttr`, `hasI9kBooleanAttr`, and `omitI9kAttrs` as private source interfaces.
- Produces: public `I9kField` props `label`, `hint`, `error`, `required`, `size`, and `controlId`;
  `label` slot; scoped default-slot fields `controlId`, `describedBy`, `invalid`, `required`, and
  `size`.

- [ ] **Step 1: Write the failing field tests**

Create `tests/I9kField.test.ts`:

```ts
import { h } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import I9kField from '../src/components/I9kField.vue';

describe('I9kField', () => {
  it('associates its label and hint with an arbitrary native control', () => {
    const wrapper = mount(I9kField, {
      props: { label: 'Email', hint: 'Use your work address', controlId: 'email' },
      slots: {
        default: ({ controlId, describedBy, required }) =>
          h('input', { id: controlId, 'aria-describedby': describedBy, required }),
      },
    });

    expect(wrapper.get('label').attributes('for')).toBe('email');
    expect(wrapper.get('input').attributes('aria-describedby')).toBe(
      wrapper.get('.i9k-field__hint').attributes('id'),
    );
  });

  it('shows an alert error instead of the hint and exposes invalid slot state', () => {
    const wrapper = mount(I9kField, {
      props: { label: 'Email', hint: 'Hint', error: 'Enter an email' },
      slots: {
        default: ({ controlId, describedBy, invalid }) =>
          h('input', { id: controlId, 'aria-describedby': describedBy, 'aria-invalid': invalid }),
      },
    });

    const error = wrapper.get('[role="alert"]');
    expect(wrapper.text()).not.toContain('Hint');
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true');
    expect(wrapper.get('input').attributes('aria-describedby')).toBe(error.attributes('id'));
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s size', (size) => {
    const wrapper = mount(I9kField, {
      props: { label: 'Name', size },
      slots: { default: ({ controlId }) => h('input', { id: controlId }) },
    });

    expect(wrapper.classes()).toContain(`i9k-field--${size}`);
  });

  it('warns when it has no label content', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mount(I9kField, { slots: { default: '<input />' } });

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('label'));
    warn.mockRestore();
  });
});
```

- [ ] **Step 2: Run the field tests and verify red**

Run: `npm test -- tests/I9kField.test.ts`

Expected: FAIL because `src/components/I9kField.vue` does not exist.

- [ ] **Step 3: Implement the private context helpers**

Create `src/composables/i9kField.ts` with this contract:

```ts
import { inject, provide, type ComputedRef, type InjectionKey } from 'vue';

import type { I9kComponentSize } from '../types/components';

export interface I9kFieldContext {
  controlId: ComputedRef<string>;
  describedBy: ComputedRef<string | undefined>;
  invalid: ComputedRef<boolean>;
  required: ComputedRef<boolean>;
  size: ComputedRef<I9kComponentSize>;
  registerControl: () => () => void;
}

const i9kFieldKey: InjectionKey<I9kFieldContext> = Symbol('i9k-field');

export function provideI9kField(context: I9kFieldContext) {
  provide(i9kFieldKey, context);
}

export function useI9kField() {
  return inject(i9kFieldKey, undefined);
}

export function mergeI9kIds(...values: Array<string | undefined>) {
  const ids = values.flatMap((value) => value?.split(/\s+/).filter(Boolean) ?? []);
  const uniqueIds = [...new Set(ids)];
  return uniqueIds.length > 0 ? uniqueIds.join(' ') : undefined;
}

export function i9kStringAttr(value: unknown) {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : undefined;
}

export function hasI9kBooleanAttr(value: unknown) {
  return value !== undefined && value !== null && value !== false && value !== 'false';
}

export function omitI9kAttrs(attrs: Record<string, unknown>, names: string[]) {
  return Object.fromEntries(Object.entries(attrs).filter(([name]) => !names.includes(name)));
}
```

- [ ] **Step 4: Implement I9kField**

Create `src/components/I9kField.vue`. Use `useId()` for the fallback control ID, computed IDs
`${controlId}-hint` and `${controlId}-error`, and a registration counter. `registerControl()`
increments the counter, warns when it exceeds one, and returns a function that decrements it.
Provide computed `controlId`, `describedBy`, `invalid`, `required`, and `size` values.

The template must use this exact semantic order:

```vue
<div :class="['i9k-field', `i9k-field--${size}`]">
  <label class="i9k-field__label" :for="resolvedControlId">
    <slot name="label">{{ label }}</slot><span v-if="required" aria-hidden="true"> *</span>
  </label>
  <slot
    :control-id="resolvedControlId"
    :described-by="describedBy"
    :invalid="Boolean(error)"
    :required="required"
    :size="size"
  />
  <p v-if="hint && !error" :id="hintId" class="i9k-field__hint">{{ hint }}</p>
  <p v-if="error" :id="errorId" class="i9k-field__error" role="alert">{{ error }}</p>
</div>
```

Add a scoped stylesheet using shared tokens:

```css
.i9k-field {
  --i9k-field-gap: var(--spacing-2);
  --i9k-field-label-size: var(--control-font-size-md);

  display: flex;
  flex-direction: column;
  gap: var(--i9k-field-gap);
  margin-block-end: var(--spacing-8);
}

.i9k-field--sm {
  --i9k-field-gap: var(--spacing-1);
  --i9k-field-label-size: var(--control-font-size-sm);
}

.i9k-field--lg {
  --i9k-field-gap: var(--spacing-4);
  --i9k-field-label-size: var(--control-font-size-lg);
}

.i9k-field__label {
  color: var(--text-color);
  font-size: var(--i9k-field-label-size);
  font-weight: 600;
}

.i9k-field__hint,
.i9k-field__error {
  margin: 0;
  font-size: var(--text-size-1);
}

.i9k-field__hint {
  color: var(--text-color-light);
}

.i9k-field__error {
  color: var(--accent-color);
  font-weight: 600;
}
```

- [ ] **Step 5: Export, safeguard, and document the field in Storybook**

Export `I9kField` from `src/index.ts`. Add `['I9kField.vue', 'i9k-field']` to
`migratedComponents` in `tests/I9kScopedStyles.test.ts`.

Create `stories/I9kField.stories.ts` with `Default`, `Sizes`, `Required`, `WithError`,
`LongLabel`, and `RightToLeft` stories. Use native input markup through the scoped slot for this
task so the story does not depend on Task 2.

- [ ] **Step 6: Verify and commit**

Run:

```bash
npm test -- tests/I9kField.test.ts tests/I9kScopedStyles.test.ts
npm run typecheck
```

Expected: both commands PASS.

Commit:

```bash
git add src/composables/i9kField.ts src/components/I9kField.vue src/index.ts stories/I9kField.stories.ts tests/I9kField.test.ts tests/I9kScopedStyles.test.ts
git commit -m "feat: add field foundation"
```

---

### Task 2: Integrate I9kInput with I9kField

**Files:**

- Modify: `src/components/I9kInput.vue`
- Modify: `tests/I9kInput.test.ts`
- Modify: `stories/I9kInput.stories.ts`

**Interfaces:**

- Consumes: `I9kFieldContext` and helpers from `src/composables/i9kField.ts`.
- Produces: existing standalone `I9kInput` behavior plus nested field consumption; optional
  `label`; explicit `uiSize` > field size > `md`; merged consumer and field descriptions.

- [ ] **Step 1: Add failing composition tests**

Append to `tests/I9kInput.test.ts`:

Merge the added Vue and Vitest names into the file's existing top-level imports; do not place new
import declarations after the current tests.

```ts
import { defineComponent, h } from 'vue';
import { vi } from 'vitest';
import I9kField from '../src/components/I9kField.vue';

it('uses enclosing field semantics without duplicate field chrome', () => {
  const wrapper = mount(
    defineComponent({
      components: { I9kField, I9kInput },
      template:
        '<I9kField label="Email" hint="Work address" control-id="email" size="lg" required><I9kInput model-value="" aria-describedby="consumer-note" /></I9kField>',
    }),
  );
  const input = wrapper.get('input');

  expect(wrapper.findAll('.i9k-field')).toHaveLength(1);
  expect(input.attributes('id')).toBe('email');
  expect(input.attributes('aria-describedby')?.split(' ')).toEqual([
    'consumer-note',
    wrapper.get('.i9k-field__hint').attributes('id'),
  ]);
  expect(input.classes()).toContain('i9k-input--lg');
  expect(input.attributes('required')).toBeDefined();
});

it('lets an explicit input UI size override the field size', () => {
  const wrapper = mount(I9kField, {
    props: { label: 'Name', size: 'lg' },
    slots: { default: () => h(I9kInput, { modelValue: '', uiSize: 'sm' }) },
  });

  expect(wrapper.get('input').classes()).toContain('i9k-input--sm');
});

it('warns when a field contains multiple library controls', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  mount(I9kField, {
    props: { label: 'Names' },
    slots: { default: () => [h(I9kInput, { modelValue: '' }), h(I9kInput, { modelValue: '' })] },
  });

  expect(warn).toHaveBeenCalledWith(expect.stringContaining('one control'));
  warn.mockRestore();
});

it('warns for an unnamed standalone input and a conflicting nested ID', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  mount(I9kInput, { props: { modelValue: '' } });
  mount(I9kField, {
    props: { label: 'Email', controlId: 'email' },
    slots: { default: () => h(I9kInput, { modelValue: '', id: 'different-email' }) },
  });

  expect(warn).toHaveBeenCalledWith(expect.stringContaining('accessible name'));
  expect(warn).toHaveBeenCalledWith(expect.stringContaining('controlId'));
  warn.mockRestore();
});
```

- [ ] **Step 2: Run the Input tests and verify red**

Run: `npm test -- tests/I9kInput.test.ts`

Expected: FAIL because nested Input still renders its own field wrapper and ignores field context.

- [ ] **Step 3: Refactor the Input setup around field context**

Keep `inheritAttrs: false`. Make `label` optional and remove the `uiSize: 'md'` prop default so
inheritance can be detected. Import `computed`, `onScopeDispose`, and the field helpers.

Create these computed values:

```ts
const field = useI9kField();
const localId = useId();
const unregister = field?.registerControl();
if (unregister) onScopeDispose(unregister);

const resolvedId = computed(() => field?.controlId.value ?? i9kStringAttr(attrs.id) ?? localId);
const resolvedSize = computed(() => props.uiSize ?? field?.size.value ?? 'md');
const standaloneHintId = computed(() => `${resolvedId.value}-hint`);
const standaloneErrorId = computed(() => `${resolvedId.value}-error`);
const localDescription = computed(() =>
  props.error ? standaloneErrorId.value : props.hint ? standaloneHintId.value : undefined,
);
const describedBy = computed(() =>
  mergeI9kIds(
    i9kStringAttr(attrs['aria-describedby']),
    field?.describedBy.value ?? localDescription.value,
  ),
);
const invalid = computed(
  () => field?.invalid.value || Boolean(props.error) || attrs['aria-invalid'] === 'true',
);
const required = computed(
  () => props.required || Boolean(field?.required.value) || hasI9kBooleanAttr(attrs.required),
);
const nativeAttrs = computed(() =>
  omitI9kAttrs(attrs, ['id', 'required', 'aria-invalid', 'aria-describedby']),
);
```

When nested, warn in development if `attrs.id` differs from the field control ID. When standalone
without `label`, `aria-label`, or `aria-labelledby`, emit a development warning naming the missing
accessible name.

- [ ] **Step 4: Render one native input in both modes**

Use one internal input template in a conditional standalone wrapper. The input always receives:

```vue
<input
  v-bind="nativeAttrs"
  :id="resolvedId"
  :class="['field__input', 'i9k-input', `i9k-input--${resolvedSize}`]"
  :type="type"
  :value="modelValue"
  :required="required"
  :aria-invalid="invalid ? 'true' : undefined"
  :aria-describedby="describedBy"
  @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
/>
```

When `field` exists, render only the input. Otherwise preserve the existing `.field i9k-field`
wrapper, label, hint suppression, and alert error markup. Keep all current scoped input CSS and
standalone field CSS so medium standalone rendering remains unchanged.

- [ ] **Step 5: Add composed stories**

Keep existing Input stories. Add `InField`, `InFieldWithError`, and `FieldSizeInheritance` stories
using `I9kField`. The all-sizes story must show both standalone compatibility and field-composed
controls.

- [ ] **Step 6: Verify and commit**

Run:

```bash
npm test -- tests/I9kInput.test.ts tests/I9kField.test.ts
npm run typecheck
```

Expected: both commands PASS and the existing native input `size` test remains green.

Commit:

```bash
git add src/components/I9kInput.vue stories/I9kInput.stories.ts tests/I9kInput.test.ts
git commit -m "feat: compose input with field"
```

---

### Task 3: Add I9kTextarea

**Files:**

- Create: `src/components/I9kTextarea.vue`
- Create: `tests/I9kTextarea.test.ts`
- Create: `stories/I9kTextarea.stories.ts`
- Modify: `src/index.ts`
- Modify: `tests/I9kScopedStyles.test.ts`

**Interfaces:**

- Consumes: field context and helpers from Task 1.
- Produces: public `modelValue: string`, optional `uiSize`, and
  `resize: 'vertical' | 'horizontal' | 'both' | 'none'`; emits `update:modelValue`.

- [ ] **Step 1: Write failing Textarea tests**

Create `tests/I9kTextarea.test.ts`:

```ts
import { h } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kField from '../src/components/I9kField.vue';
import I9kTextarea from '../src/components/I9kTextarea.vue';

describe('I9kTextarea', () => {
  it('forwards native attributes and emits the native string value', async () => {
    const wrapper = mount(I9kTextarea, {
      props: { modelValue: '' },
      attrs: { name: 'details', rows: 6, maxlength: 500, 'aria-label': 'Details' },
    });
    const textarea = wrapper.get('textarea');

    expect(textarea.attributes('name')).toBe('details');
    expect(textarea.attributes('rows')).toBe('6');
    await textarea.setValue('Project details');
    expect(wrapper.emitted('update:modelValue')).toEqual([['Project details']]);
  });

  it('consumes field IDs, error state, required state, and size', () => {
    const wrapper = mount(I9kField, {
      props: { label: 'Details', error: 'Required', required: true, size: 'lg' },
      slots: { default: () => h(I9kTextarea, { modelValue: '' }) },
    });
    const textarea = wrapper.get('textarea');

    expect(textarea.attributes('id')).toBe(wrapper.get('label').attributes('for'));
    expect(textarea.attributes('aria-invalid')).toBe('true');
    expect(textarea.attributes('required')).toBeDefined();
    expect(textarea.classes()).toContain('i9k-textarea--lg');
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s UI size', (uiSize) => {
    const wrapper = mount(I9kTextarea, {
      props: { modelValue: '', uiSize },
      attrs: { 'aria-label': uiSize },
    });
    expect(wrapper.classes()).toContain(`i9k-textarea--${uiSize}`);
  });
});
```

- [ ] **Step 2: Run the Textarea tests and verify red**

Run: `npm test -- tests/I9kTextarea.test.ts`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the native Textarea**

Create `I9kTextarea.vue` with `inheritAttrs: false`. Resolve ID, size, description, invalid, and
required exactly as Task 2 does. Register with the field and unregister through `onScopeDispose`.
Block only managed `id`, `required`, `aria-invalid`, and `aria-describedby` from `v-bind`.

Use this root template:

```vue
<textarea
  v-bind="nativeAttrs"
  :id="resolvedId"
  :class="['i9k-textarea', `i9k-textarea--${resolvedSize}`]"
  :data-resize="resize"
  :value="modelValue"
  :required="required"
  :aria-invalid="invalid ? 'true' : undefined"
  :aria-describedby="describedBy"
  @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
/>
```

Add complete scoped styles:

```css
.i9k-textarea {
  width: 100%;
  min-height: calc(var(--control-height-md) * 2.5);
  padding: var(--spacing-6);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--glass-bg);
  color: var(--text-color);
  font: inherit;
  font-size: var(--control-font-size-md);
  line-height: 1.5;
  transition: var(--transition);
}

.i9k-textarea--sm {
  min-height: calc(var(--control-height-sm) * 2.5);
  padding: var(--spacing-5);
  font-size: var(--control-font-size-sm);
}

.i9k-textarea--lg {
  min-height: calc(var(--control-height-lg) * 2.5);
  padding: var(--spacing-8);
  font-size: var(--control-font-size-lg);
}

.i9k-textarea[data-resize='vertical'] {
  resize: vertical;
}
.i9k-textarea[data-resize='horizontal'] {
  resize: horizontal;
}
.i9k-textarea[data-resize='both'] {
  resize: both;
}
.i9k-textarea[data-resize='none'] {
  resize: none;
}

.i9k-textarea:focus-visible {
  border-color: var(--accent-color);
  outline: 2px solid var(--accent-color);
  outline-offset: 1px;
}

.i9k-textarea[aria-invalid='true'] {
  border-color: var(--accent-color);
}
.i9k-textarea:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

@media (prefers-reduced-motion: reduce) {
  .i9k-textarea {
    transition: none;
  }
}
```

- [ ] **Step 4: Export, safeguard, and add Storybook coverage**

Export `I9kTextarea`, register `['I9kTextarea.vue', 'i9k-textarea']` in the scoped safeguard, and
create `Default`, `Sizes`, `Readonly`, `Disabled`, `WithError`, `LongContent`, and `RightToLeft`
stories. Compose label/error stories with `I9kField`.

- [ ] **Step 5: Verify and commit**

Run:

```bash
npm test -- tests/I9kTextarea.test.ts tests/I9kField.test.ts tests/I9kScopedStyles.test.ts
npm run typecheck
```

Expected: both commands PASS.

Commit:

```bash
git add src/components/I9kTextarea.vue src/index.ts stories/I9kTextarea.stories.ts tests/I9kTextarea.test.ts tests/I9kScopedStyles.test.ts
git commit -m "feat: add textarea component"
```

---

### Task 4: Add I9kSelect

**Files:**

- Create: `src/components/I9kSelect.vue`
- Create: `tests/I9kSelect.test.ts`
- Create: `stories/I9kSelect.stories.ts`
- Modify: `src/index.ts`
- Modify: `tests/I9kScopedStyles.test.ts`

**Interfaces:**

- Consumes: field context and helpers from Task 1.
- Produces: public `modelValue: string` and optional `uiSize`; emits `update:modelValue`; native
  option and optgroup default slot; rejects native `size` and `multiple`.

- [ ] **Step 1: Write failing Select tests**

Create `tests/I9kSelect.test.ts`:

```ts
import { h } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import I9kField from '../src/components/I9kField.vue';
import I9kSelect from '../src/components/I9kSelect.vue';

describe('I9kSelect', () => {
  it('renders native options, forwards supported attributes, and emits a string', async () => {
    const wrapper = mount(I9kSelect, {
      props: { modelValue: '' },
      attrs: { name: 'service', autocomplete: 'off', 'aria-label': 'Service' },
      slots: { default: '<option value="">Choose</option><option value="audit">Audit</option>' },
    });
    const select = wrapper.get('select');

    expect(select.attributes('name')).toBe('service');
    expect(wrapper.findAll('option')).toHaveLength(2);
    await select.setValue('audit');
    expect(wrapper.emitted('update:modelValue')).toEqual([['audit']]);
  });

  it('consumes enclosing field semantics', () => {
    const wrapper = mount(I9kField, {
      props: { label: 'Service', hint: 'Choose one', required: true, size: 'sm' },
      slots: { default: () => h(I9kSelect, { modelValue: '' }, () => h('option')) },
    });
    const select = wrapper.get('select');

    expect(select.attributes('id')).toBe(wrapper.get('label').attributes('for'));
    expect(select.attributes('aria-describedby')).toBe(
      wrapper.get('.i9k-field__hint').attributes('id'),
    );
    expect(select.classes()).toContain('i9k-select--sm');
  });

  it('rejects native multiple and size modes', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const wrapper = mount(I9kSelect, {
      props: { modelValue: '' },
      attrs: { multiple: true, size: 4, 'aria-label': 'Services' },
    });

    expect(wrapper.attributes('multiple')).toBeUndefined();
    expect(wrapper.attributes('size')).toBeUndefined();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('single-select'));
    warn.mockRestore();
  });
});
```

- [ ] **Step 2: Run the Select tests and verify red**

Run: `npm test -- tests/I9kSelect.test.ts`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the native single select**

Create `I9kSelect.vue` with the same field resolution as `I9kTextarea`. Build `nativeAttrs` by
omitting managed attributes plus `size` and `multiple`. In development, warn when either rejected
attribute is present.

Use this template:

```vue
<select
  v-bind="nativeAttrs"
  :id="resolvedId"
  :class="['i9k-select', `i9k-select--${resolvedSize}`]"
  :value="modelValue"
  :required="required"
  :aria-invalid="invalid ? 'true' : undefined"
  :aria-describedby="describedBy"
  @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
>
  <slot />
</select>
```

Add scoped styles matching the current input surface:

```css
.i9k-select {
  width: 100%;
  min-height: var(--control-height-md);
  padding: 0 var(--spacing-8);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background-color: var(--glass-bg);
  color: var(--text-color);
  font: inherit;
  font-size: var(--control-font-size-md);
  transition: var(--transition);
}

.i9k-select--sm {
  min-height: var(--control-height-sm);
  padding-inline: var(--spacing-6);
  font-size: var(--control-font-size-sm);
}

.i9k-select--lg {
  min-height: var(--control-height-lg);
  padding-inline: var(--spacing-11);
  font-size: var(--control-font-size-lg);
}

.i9k-select:focus-visible {
  border-color: var(--accent-color);
  outline: 2px solid var(--accent-color);
  outline-offset: 1px;
}

.i9k-select[aria-invalid='true'] {
  border-color: var(--accent-color);
}
.i9k-select:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

@media (prefers-reduced-motion: reduce) {
  .i9k-select {
    transition: none;
  }
}
```

- [ ] **Step 4: Export, safeguard, and add Storybook coverage**

Export `I9kSelect`, register it in the scoped safeguard, and create `Default`, `Sizes`, `Disabled`,
`WithError`, `ArabicOptions`, and `RightToLeft` stories. Every story supplies native option nodes.

- [ ] **Step 5: Verify and commit**

Run:

```bash
npm test -- tests/I9kSelect.test.ts tests/I9kField.test.ts tests/I9kScopedStyles.test.ts
npm run typecheck
```

Expected: both commands PASS.

Commit:

```bash
git add src/components/I9kSelect.vue src/index.ts stories/I9kSelect.stories.ts tests/I9kSelect.test.ts tests/I9kScopedStyles.test.ts
git commit -m "feat: add native select component"
```

---

### Task 5: Add I9kIconButton and the public icon type

**Files:**

- Create: `src/types/icons.ts`
- Modify: `src/components/I9kIcon.vue`
- Create: `src/components/I9kIconButton.vue`
- Create: `tests/I9kIconButton.test.ts`
- Create: `stories/I9kIconButton.stories.ts`
- Modify: `src/index.ts`
- Modify: `tests/I9kScopedStyles.test.ts`

**Interfaces:**

- Consumes: `I9kComponentSize`, `I9kIcon`, and `src/icons/paths.json`.
- Produces: public `I9kIconName`, `I9kIconButtonVariant`, and `I9kIconButton`; mirrors existing
  `href`, `to`, and `linkComponent` routing integration.

- [ ] **Step 1: Write failing IconButton tests**

Create `tests/I9kIconButton.test.ts`:

```ts
import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import I9kIconButton from '../src/components/I9kIconButton.vue';

describe('I9kIconButton', () => {
  it('renders a labeled native button with a decorative icon', () => {
    const wrapper = mount(I9kIconButton, { props: { icon: 'home', label: 'Go home' } });
    const button = wrapper.get('button');

    expect(button.attributes('type')).toBe('button');
    expect(button.attributes('aria-label')).toBe('Go home');
    expect(button.classes()).toEqual(
      expect.arrayContaining([
        'i9k-icon-button',
        'i9k-icon-button--secondary',
        'i9k-icon-button--md',
      ]),
    );
    expect(button.get('svg').attributes('aria-hidden')).toBe('true');
  });

  it('renders an anchor and forwards link attributes', () => {
    const wrapper = mount(I9kIconButton, {
      props: { icon: 'github', label: 'GitHub', href: 'https://github.com/ismail9k' },
      attrs: { target: '_blank', rel: 'noreferrer' },
    });
    const link = wrapper.get('a');

    expect(link.attributes('href')).toBe('https://github.com/ismail9k');
    expect(link.attributes('target')).toBe('_blank');
    expect(link.attributes('type')).toBeUndefined();
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s size', (size) => {
    const wrapper = mount(I9kIconButton, { props: { icon: 'mail', label: 'Mail', size } });
    expect(wrapper.classes()).toContain(`i9k-icon-button--${size}`);
  });

  it.each(['secondary', 'primary', 'ghost'] as const)('renders the %s variant', (variant) => {
    const wrapper = mount(I9kIconButton, { props: { icon: 'menu', label: 'Menu', variant } });
    expect(wrapper.classes()).toContain(`i9k-icon-button--${variant}`);
  });

  it('passes a route destination to a consumer router component', () => {
    const RouterLinkStub = defineComponent({
      props: { to: { type: [String, Object], required: true } },
      template: '<a data-router-link><slot /></a>',
    });
    const wrapper = mount(I9kIconButton, {
      props: { icon: 'home', label: 'Home', to: '/home', linkComponent: RouterLinkStub },
    });

    expect(wrapper.getComponent(RouterLinkStub).props('to')).toBe('/home');
  });

  it('warns when the accessible label is empty', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mount(I9kIconButton, { props: { icon: 'home', label: '   ' } });

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('non-empty label'));
    warn.mockRestore();
  });
});
```

- [ ] **Step 2: Run the IconButton tests and verify red**

Run: `npm test -- tests/I9kIconButton.test.ts`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Extract and export the icon-name type**

Create `src/types/icons.ts`:

```ts
import icons from '../icons/paths.json';

export type I9kIconName = keyof typeof icons;
```

Update `I9kIcon.vue` to import this type and remove its local duplicate. Export `I9kIconName` and
this variant type from `src/index.ts`:

```ts
export type I9kIconButtonVariant = 'secondary' | 'primary' | 'ghost';
```

Place `I9kIconButtonVariant` in `src/types/components.ts` and include it in the existing type
re-export statement.

- [ ] **Step 4: Implement I9kIconButton**

Follow `I9kButton` root selection with `useAttrs`, `isLink`, `destination`, and `tag` computed
values. Render `I9kIcon` with no title or description so the root label is the only accessible
name. In development, warn when `label.trim()` is empty.

Use these root bindings:

```vue
<component
  :is="tag"
  v-bind="attrs"
  :to="linkComponent && to !== null ? to : undefined"
  :href="!linkComponent && isLink ? destination : undefined"
  :type="!isLink ? type : undefined"
  :aria-label="label"
  :class="['i9k-icon-button', `i9k-icon-button--${variant}`, `i9k-icon-button--${size}`]"
>
  <I9kIcon :name="icon" :size="iconSize" />
</component>
```

Use computed icon sizes `1rem`, `1.2rem`, and `1.4rem` for `sm`, `md`, and `lg`. Add scoped CSS:

```css
.i9k-icon-button {
  display: inline-flex;
  width: var(--control-height-md);
  height: var(--control-height-md);
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid currentColor;
  border-radius: var(--radius-circle);
  appearance: none;
  cursor: pointer;
  color: var(--theme-text-color);
  text-decoration: none;
  transition: var(--transition);
}

.i9k-icon-button--sm {
  width: var(--control-height-sm);
  height: var(--control-height-sm);
}
.i9k-icon-button--lg {
  width: var(--control-height-lg);
  height: var(--control-height-lg);
}
.i9k-icon-button--secondary {
  background: var(--white-color-alpha-20);
}
.i9k-icon-button--primary {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: var(--on-primary-color);
}
.i9k-icon-button--ghost {
  border-color: transparent;
  background: transparent;
}
.i9k-icon-button:hover {
  border-color: var(--accent-color);
  background: var(--glass-bg);
}
.i9k-icon-button--primary:hover {
  border-color: var(--accent-color);
  background: var(--accent-color);
  transform: translateY(-1px);
}
.i9k-icon-button:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}
.i9k-icon-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

@media (prefers-reduced-motion: reduce) {
  .i9k-icon-button {
    transition: none;
  }
  .i9k-icon-button--primary:hover {
    transform: none;
  }
}
```

- [ ] **Step 5: Export, safeguard, and add stories**

Export `I9kIconButton`, register it in the scoped safeguard, and create `Default`, `Variants`,
`Sizes`, `Disabled`, `AsLink`, and `RightToLeft` stories.

- [ ] **Step 6: Verify and commit**

Run:

```bash
npm test -- tests/I9kIconButton.test.ts tests/I9kScopedStyles.test.ts
npm run typecheck
```

Expected: both commands PASS.

Commit:

```bash
git add src/types/icons.ts src/types/components.ts src/components/I9kIcon.vue src/components/I9kIconButton.vue src/index.ts stories/I9kIconButton.stories.ts tests/I9kIconButton.test.ts tests/I9kScopedStyles.test.ts
git commit -m "feat: add icon button component"
```

---

### Task 6: Add I9kButtonGroup

**Files:**

- Create: `src/components/I9kButtonGroup.vue`
- Create: `tests/I9kButtonGroup.test.ts`
- Create: `stories/I9kButtonGroup.stories.ts`
- Modify: `src/index.ts`
- Modify: `tests/I9kScopedStyles.test.ts`

**Interfaces:**

- Consumes: `I9kComponentSize`; composes existing buttons through a default slot.
- Produces: public `size`, `orientation: 'horizontal' | 'vertical'`, and optional `label`.

- [ ] **Step 1: Write failing ButtonGroup tests**

Create `tests/I9kButtonGroup.test.ts`:

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kButtonGroup from '../src/components/I9kButtonGroup.vue';

describe('I9kButtonGroup', () => {
  it('renders an accessible horizontal medium group by default', () => {
    const wrapper = mount(I9kButtonGroup, {
      props: { label: 'Article actions' },
      attrs: { 'data-testid': 'actions' },
      slots: { default: '<button>Save</button><button>Share</button>' },
    });

    expect(wrapper.attributes('role')).toBe('group');
    expect(wrapper.attributes('aria-label')).toBe('Article actions');
    expect(wrapper.attributes('data-testid')).toBe('actions');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'i9k-button-group',
        'i9k-button-group--horizontal',
        'i9k-button-group--md',
      ]),
    );
    expect(wrapper.findAll('button')).toHaveLength(2);
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s density', (size) => {
    const wrapper = mount(I9kButtonGroup, { props: { size } });
    expect(wrapper.classes()).toContain(`i9k-button-group--${size}`);
  });

  it('renders vertical orientation without changing child attributes', () => {
    const wrapper = mount(I9kButtonGroup, {
      props: { orientation: 'vertical' },
      slots: { default: '<button data-child="kept">Save</button>' },
    });
    expect(wrapper.classes()).toContain('i9k-button-group--vertical');
    expect(wrapper.get('button').attributes('data-child')).toBe('kept');
  });
});
```

- [ ] **Step 2: Run the ButtonGroup tests and verify red**

Run: `npm test -- tests/I9kButtonGroup.test.ts`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the semantic group**

Create `I9kButtonGroup.vue` with a root `div`, `role="group"`, optional `aria-label`,
`data-orientation`, and the three class bindings. Forward `$attrs` to the root.

Add scoped CSS:

```css
.i9k-button-group {
  --i9k-button-group-gap: var(--component-gap-md);

  display: inline-flex;
  gap: var(--i9k-button-group-gap);
}

.i9k-button-group--sm {
  --i9k-button-group-gap: var(--component-gap-sm);
}
.i9k-button-group--lg {
  --i9k-button-group-gap: var(--component-gap-lg);
}
.i9k-button-group--horizontal {
  flex-flow: row wrap;
  align-items: center;
}
.i9k-button-group--vertical {
  flex-direction: column;
  align-items: stretch;
}
```

- [ ] **Step 4: Export, safeguard, and add stories**

Export the component, register it in the scoped safeguard, and create `Default`, `Sizes`,
`Vertical`, `Wrapping`, and `RightToLeft` stories using both `I9kButton` and `I9kIconButton`.

- [ ] **Step 5: Verify and commit**

Run:

```bash
npm test -- tests/I9kButtonGroup.test.ts tests/I9kIconButton.test.ts tests/I9kScopedStyles.test.ts
npm run typecheck
```

Expected: both commands PASS.

Commit:

```bash
git add src/components/I9kButtonGroup.vue src/index.ts stories/I9kButtonGroup.stories.ts tests/I9kButtonGroup.test.ts tests/I9kScopedStyles.test.ts
git commit -m "feat: add button group component"
```

---

### Task 7: Add I9kRadioGroup

**Files:**

- Create: `src/types/forms.ts`
- Create: `src/components/I9kRadioGroup.vue`
- Create: `tests/I9kRadioGroup.test.ts`
- Create: `stories/I9kRadioGroup.stories.ts`
- Modify: `src/index.ts`
- Modify: `tests/I9kScopedStyles.test.ts`

**Interfaces:**

- Produces: public `I9kRadioOption`, `I9kRadioGroup`, `modelValue`, `options`, `legend`, `name`,
  `hint`, `error`, `required`, `disabled`, `size`, `variant`, and `orientation`.
- Emits: `update:modelValue` with the selected option's string value.

- [ ] **Step 1: Add the public type and failing tests**

Create `src/types/forms.ts`:

```ts
export interface I9kRadioOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}
```

Create `tests/I9kRadioGroup.test.ts`:

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kRadioGroup from '../src/components/I9kRadioGroup.vue';

const options = [
  { label: 'Audit', value: 'audit', description: 'Review an existing product' },
  { label: 'Build', value: 'build', description: 'Create a new product' },
  { label: 'Advisory', value: 'advisory', disabled: true },
] as const;

describe('I9kRadioGroup', () => {
  it('renders a native named fieldset and emits selection', async () => {
    const wrapper = mount(I9kRadioGroup, {
      props: { modelValue: 'audit', options, legend: 'Choose a service', name: 'service' },
    });
    const radios = wrapper.findAll('input[type="radio"]');

    expect(wrapper.get('fieldset').get('legend').text()).toBe('Choose a service');
    expect(radios.map((radio) => radio.attributes('name'))).toEqual([
      'service',
      'service',
      'service',
    ]);
    expect(radios[0].attributes('checked')).toBeDefined();
    await radios[1].setValue(true);
    expect(wrapper.emitted('update:modelValue')).toEqual([['build']]);
  });

  it('associates option descriptions and group errors', () => {
    const wrapper = mount(I9kRadioGroup, {
      props: { modelValue: '', options, legend: 'Service', error: 'Choose one' },
    });
    const firstRadio = wrapper.get('input[value="audit"]');
    const error = wrapper.get('[role="alert"]');

    expect(firstRadio.attributes('aria-describedby')?.split(' ')).toEqual([
      wrapper.get('.i9k-radio-group__description').attributes('id'),
      error.attributes('id'),
    ]);
    expect(wrapper.get('fieldset').attributes('aria-invalid')).toBe('true');
  });

  it('honors disabled group and option states', () => {
    const wrapper = mount(I9kRadioGroup, {
      props: { modelValue: '', options, legend: 'Service', disabled: true },
    });

    expect(wrapper.get('fieldset').attributes('disabled')).toBeDefined();
    expect(wrapper.get('input[value="advisory"]').attributes('disabled')).toBeDefined();
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s card size', (size) => {
    const wrapper = mount(I9kRadioGroup, {
      props: { modelValue: 'audit', options, legend: 'Service', variant: 'card', size },
    });
    expect(wrapper.get('fieldset').classes()).toEqual(
      expect.arrayContaining(['i9k-radio-group--card', `i9k-radio-group--${size}`]),
    );
  });
});
```

- [ ] **Step 2: Run the RadioGroup tests and verify red**

Run: `npm test -- tests/I9kRadioGroup.test.ts`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement native radio semantics**

Create `I9kRadioGroup.vue`. Use `useId()` for a stable group base and fallback name. Build option
IDs by array index so arbitrary values never produce invalid IDs. The fieldset owns `disabled`,
`aria-invalid`, and the active group hint/error `aria-describedby`.

Each radio uses this binding contract:

```vue
<input
  :id="`${groupId}-option-${index}`"
  type="radio"
  :name="resolvedName"
  :value="option.value"
  :checked="modelValue === option.value"
  :required="required"
  :disabled="disabled || option.disabled"
  :aria-describedby="
    mergeI9kIds(
      option.description ? `${groupId}-option-${index}-description` : undefined,
      groupDescriptionId,
    )
  "
  @change="$emit('update:modelValue', option.value)"
/>
```

Render each input inside `.i9k-radio-group__option` label with `.i9k-radio-group__copy`, label text,
and optional description. Render hint or alert error after the options.

Add scoped CSS with these required behaviors:

```css
.i9k-radio-group {
  --i9k-radio-gap: var(--component-gap-md);
  --i9k-radio-padding: var(--spacing-8);
  --i9k-radio-font-size: var(--control-font-size-md);

  min-inline-size: 0;
  margin: 0;
  padding: 0;
  border: 0;
}
.i9k-radio-group--sm {
  --i9k-radio-gap: var(--component-gap-sm);
  --i9k-radio-padding: var(--spacing-6);
  --i9k-radio-font-size: var(--control-font-size-sm);
}
.i9k-radio-group--lg {
  --i9k-radio-gap: var(--component-gap-lg);
  --i9k-radio-padding: var(--spacing-11);
  --i9k-radio-font-size: var(--control-font-size-lg);
}
.i9k-radio-group__legend {
  margin-block-end: var(--spacing-5);
  font-weight: 700;
}
.i9k-radio-group__options {
  display: flex;
  gap: var(--i9k-radio-gap);
}
.i9k-radio-group--vertical .i9k-radio-group__options {
  flex-direction: column;
}
.i9k-radio-group--horizontal .i9k-radio-group__options {
  flex-flow: row wrap;
}
.i9k-radio-group__option {
  display: flex;
  gap: var(--spacing-5);
  align-items: flex-start;
}
.i9k-radio-group__copy {
  display: flex;
  flex-direction: column;
  font-size: var(--i9k-radio-font-size);
}
.i9k-radio-group__description,
.i9k-radio-group__hint {
  color: var(--text-color-light);
}
.i9k-radio-group__error {
  color: var(--accent-color);
  font-weight: 600;
}
.i9k-radio-group--card .i9k-radio-group__options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.i9k-radio-group--card .i9k-radio-group__option {
  position: relative;
  min-height: 7rem;
  padding: var(--i9k-radio-padding);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--glass-bg);
  cursor: pointer;
  transition: var(--transition);
}
.i9k-radio-group--card .i9k-radio-group__option:has(input:checked) {
  border-color: var(--primary-color);
  background: var(--primary-color-alpha-12);
  box-shadow: inset 0 0 0 2px var(--primary-color-alpha-12);
}
.i9k-radio-group--card .i9k-radio-group__option:not(:has(input:disabled)):hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
}
.i9k-radio-group--card .i9k-radio-group__option:has(input:focus-visible) {
  outline: 3px solid var(--accent-color);
  outline-offset: 3px;
}
.i9k-radio-group--card input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}
@media (max-width: 640px) {
  .i9k-radio-group--card .i9k-radio-group__options {
    grid-template-columns: 1fr;
  }
}
@media (prefers-reduced-motion: reduce) {
  .i9k-radio-group--card .i9k-radio-group__option {
    transition: none;
  }
  .i9k-radio-group--card .i9k-radio-group__option:hover {
    transform: none;
  }
}
```

- [ ] **Step 4: Export, safeguard, and add comprehensive stories**

Export `I9kRadioOption` and `I9kRadioGroup`. Register the component in the scoped safeguard.
Create `Default`, `Sizes`, `Horizontal`, `Cards`, `DisabledOption`, `DisabledGroup`, `WithError`,
`LongDescriptions`, `ArabicCards`, and `RightToLeft` stories.

- [ ] **Step 5: Verify and commit**

Run:

```bash
npm test -- tests/I9kRadioGroup.test.ts tests/I9kScopedStyles.test.ts
npm run typecheck
```

Expected: both commands PASS.

Commit:

```bash
git add src/types/forms.ts src/components/I9kRadioGroup.vue src/index.ts stories/I9kRadioGroup.stories.ts tests/I9kRadioGroup.test.ts tests/I9kScopedStyles.test.ts
git commit -m "feat: add radio group component"
```

---

### Task 8: Add SSR, public-contract, documentation, and package safeguards

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `tests/I9kNativeActionsFormsSsr.test.ts`
- Create: `tests/I9kNativeComponentStyles.test.ts`
- Modify: `tests/I9kComponentContracts.test.ts`
- Create: `stories/I9kNativeActionsForms.stories.ts`
- Modify: `README.md`
- Modify: `docs/migrations/ismail9k-com-component-library.md`
- Create: `docs/assets/pr-3/actions-sizes-light.png`
- Create: `docs/assets/pr-3/field-states-dark.png`
- Create: `docs/assets/pr-3/native-controls-rtl-light.png`
- Create: `docs/assets/pr-3/radio-cards-dark.png`

**Interfaces:**

- Consumes: all Task 1-7 public components and types.
- Produces: direct server-renderer test dependency, SSR smoke coverage, public export assertions,
  migration readiness, README examples, and PR visual evidence.

- [ ] **Step 1: Add the direct SSR test dependency**

Run:

```bash
npm install --save-dev @vue/server-renderer@^3.5.0
```

Expected: `package.json` and `package-lock.json` record the development dependency; no runtime
dependency is added.

- [ ] **Step 2: Write the failing SSR and export tests**

Create `tests/I9kNativeActionsFormsSsr.test.ts`:

```ts
import { createSSRApp } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';

import {
  I9kButtonGroup,
  I9kField,
  I9kIconButton,
  I9kInput,
  I9kRadioGroup,
  I9kSelect,
  I9kTextarea,
} from '../src';

describe('native action and form SSR', () => {
  it('renders every Phase 3A component without browser-only setup access', async () => {
    const app = createSSRApp({
      components: {
        I9kButtonGroup,
        I9kField,
        I9kIconButton,
        I9kInput,
        I9kRadioGroup,
        I9kSelect,
        I9kTextarea,
      },
      setup: () => ({ options: [{ label: 'Audit', value: 'audit' }] }),
      template: `
        <main>
          <I9kButtonGroup label="Actions"><I9kIconButton icon="home" label="Home" /></I9kButtonGroup>
          <I9kField label="Name"><I9kInput model-value="" /></I9kField>
          <I9kField label="Details"><I9kTextarea model-value="" /></I9kField>
          <I9kField label="Service"><I9kSelect model-value=""><option value="audit">Audit</option></I9kSelect></I9kField>
          <I9kRadioGroup model-value="audit" :options="options" legend="Intent" />
        </main>
      `,
    });

    const html = await renderToString(app);
    expect(html).toContain('i9k-icon-button--md');
    expect(html).toContain('i9k-input--md');
    expect(html).toContain('i9k-textarea--md');
    expect(html).toContain('i9k-select--md');
    expect(html).toContain('i9k-radio-group--md');
  });
});
```

Extend `tests/I9kComponentContracts.test.ts` to assert that `src/index.ts` exports all six new
components and both new public types. Use a literal table of exact export statements so a missing
package boundary fails clearly.

```ts
const phase3AExports = [
  "export type { I9kComponentSize, I9kIconButtonVariant, I9kTone } from './types/components';",
  "export type { I9kIconName } from './types/icons';",
  "export type { I9kRadioOption } from './types/forms';",
  "export { default as I9kButtonGroup } from './components/I9kButtonGroup.vue';",
  "export { default as I9kField } from './components/I9kField.vue';",
  "export { default as I9kIconButton } from './components/I9kIconButton.vue';",
  "export { default as I9kRadioGroup } from './components/I9kRadioGroup.vue';",
  "export { default as I9kSelect } from './components/I9kSelect.vue';",
  "export { default as I9kTextarea } from './components/I9kTextarea.vue';",
] as const;

it.each(phase3AExports)('exports %s', (statement) => {
  expect(indexSource).toContain(statement);
});
```

Create `tests/I9kNativeComponentStyles.test.ts` using the real Vite/Vue compiler, following the
`buildComponentStylesheet` and `hasDeclaration` helpers in
`tests/I9kExistingComponentStyles.test.ts`, including the PostCSS `Rule` type import. Assert the emitted RadioGroup CSS
contains a scope attribute on the selected-card `:has(input:checked)` selector and on the
reduced-motion hover `transform: none` selector:

```ts
const stylesheet = await buildComponentStylesheet('I9kRadioGroup');
let selectedRule: Rule | undefined;
let reducedMotionRule: Rule | undefined;

stylesheet.walkRules((rule) => {
  if (rule.selector.includes(':has(input:checked)')) selectedRule = rule;
  if (
    rule.selector.includes('.i9k-radio-group__option:hover') &&
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
```

- [ ] **Step 3: Run the new safeguards and verify red if any boundary is missing**

Run:

```bash
npm test -- tests/I9kNativeActionsFormsSsr.test.ts tests/I9kNativeComponentStyles.test.ts tests/I9kComponentContracts.test.ts
```

Expected: PASS when Tasks 1-7 exported every contract. If an exact export assertion fails, fix the
missing `src/index.ts` export and rerun until green.

- [ ] **Step 4: Document public usage**

Add a README section named `Native actions and form fields` with one import block and compact
examples for IconButton, ButtonGroup, Field + Input, Field + Textarea, Field + Select, and
RadioGroup card options. State these rules explicitly:

- visual controls default to `md` and support `sm`, `md`, and `lg`;
- native form attributes belong on the control component;
- `I9kInput` uses `uiSize` so native HTML `size` remains available;
- `I9kField` owns label, hint, and error association;
- native Select `multiple` and `size` are outside the single-select contract.

Update `docs/migrations/ismail9k-com-component-library.md` with package-ready rows for `I9kField`,
`I9kInput` field composition, `I9kTextarea`, `I9kSelect`, and `I9kRadioGroup`. Keep Batch 3 marked
unexecuted and repeat that website source and `.field*` compatibility CSS remain unchanged.

Create `stories/I9kNativeActionsForms.stories.ts` as the stable visual-review entry point. Its
meta title is `Examples/NativeActionsForms`, and it exports these four render-only stories:

- `ActionsAndSizes`: three labeled ButtonGroups containing matching Button and IconButton sizes.
- `FieldStates`: default hint, required, and invalid Field + Input examples.
- `NativeControlsRtl`: Arabic Field + Textarea and Field + Select examples inside `dir="rtl"`.
- `RadioCards`: three card RadioGroups showing `sm`, `md`, and `lg` with a selected option.

Use local refs for all model values and this shared option fixture so the stories remain fully
interactive without application state:

```ts
const radioOptions = [
  { label: 'تدقيق منتج', value: 'audit', description: 'مراجعة منتج قائم' },
  { label: 'بناء منتج', value: 'build', description: 'إنشاء تجربة جديدة' },
] as const;
```

Each render template uses an inline grid wrapper with `gap: var(--component-gap-lg)` and imports
only public components from `../src`; it must not depend on `.cluster`, `.grid`, `.field`, or any
other legacy primitive class.

- [ ] **Step 5: Run the full repository and package gates**

Run:

```bash
npm run check
npm pack --dry-run
git diff --check
```

Expected:

- all Vitest files and tests pass;
- Prettier, ESLint, all three TypeScript projects, the library build, and Storybook build pass;
- the package contains runtime JS, CSS, and declarations but excludes tests and stories;
- no whitespace errors are reported.

- [ ] **Step 6: Capture and inspect PR visual evidence**

Serve the freshly built `storybook-static` output and capture these stories under
`docs/assets/pr-3/`:

- IconButton and ButtonGroup all sizes in light mode;
- Field hint/error/required states in dark mode;
- Textarea and Select sizes inside an Arabic RTL wrapper in light mode;
- RadioGroup card sizes and selected state in dark mode.

Inspect every image at original resolution. Confirm spacing, focus-independent selected state,
light/dark contrast, RTL ordering, and all size differences. Regenerate any stale or clipped image.

- [ ] **Step 7: Commit the integration safeguards**

```bash
git add package.json package-lock.json tests/I9kNativeActionsFormsSsr.test.ts tests/I9kNativeComponentStyles.test.ts tests/I9kComponentContracts.test.ts stories/I9kNativeActionsForms.stories.ts README.md docs/migrations/ismail9k-com-component-library.md docs/assets/pr-3
git commit -m "docs: cover native action and form foundations"
```

- [ ] **Step 8: Final clean-context audit**

Run:

```bash
git status --short --branch
git diff --name-only e9b97da8fc8b1bb15f79bb0088cd1948cbef37d8...HEAD
git log --oneline e9b97da8fc8b1bb15f79bb0088cd1948cbef37d8..HEAD
```

Expected: the worktree is clean, every changed path belongs to this spec, and the user-owned main
checkout `stories/I9kButton.stories.ts` edit is absent.
