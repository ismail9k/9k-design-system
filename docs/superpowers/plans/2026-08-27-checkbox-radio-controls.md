# Checkbox and Radio Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the existing 9k.school checkbox treatment to the shared package and give default radio options a polished, RTL-safe custom control with correct first-line alignment.

**Architecture:** `I9kCheckboxGroup` owns native checkbox semantics, immutable array updates, field ARIA wiring, and scoped appearance. `I9kRadioGroup` keeps its API and card behavior while adding a decorative mark beside its visually hidden native input. The school questionnaire maps course records into checkbox options and removes its duplicated local control CSS.

**Tech Stack:** Vue 3 SFCs, strict TypeScript, scoped CSS, Vitest, Vue Test Utils, Vite/PostCSS, Storybook, Nuxt 4, pnpm.

## Global Constraints

- Preserve the current 9k.school checkbox appearance: compact rounded square, contrasting checkmark, primary selected fill, and accent focus ring.
- Keep `I9kRadioGroup` props, emitted value, card behavior, light/dark theming, and LTR/RTL support compatible.
- Use native inputs for semantics and keyboard behavior.
- Use existing tokens and component-local custom properties; add no global visual selector.
- Do not edit or commit generated `dist/`, `storybook-static/`, `showcase-dist/`, or `showcase/.ssr/` output.
- Preserve the staged 9k.school landing-page work; do not commit or overwrite unrelated edits in `app/pages/index.vue` or `tests/nuxt/home-page.test.ts`.
- The school lockfile pins a remote design-system archive. Use a temporary local link for verification, and refresh the lock only after the implementation commit exists remotely.

## File Map

- Create `src/components/I9kCheckboxGroup.vue`: behavior, native markup, ARIA, and scoped appearance.
- Create `tests/I9kCheckboxGroup.test.ts`: interaction and accessibility contract.
- Create `stories/I9kCheckboxGroup.stories.ts`: visual states, sizes, horizontal, and RTL examples.
- Modify `src/types/forms.ts` and `src/index.ts`: public type/component exports.
- Modify `tests/I9kComponentContracts.test.ts`, `tests/I9kScopedStyles.test.ts`, and `tests/I9kNativeActionsFormsSsr.test.ts`: package contracts.
- Modify `src/components/I9kRadioGroup.vue`, its unit/style tests, and stories: custom radio control.
- Modify `../9k.school/app/pages/index.vue` and `../9k.school/tests/nuxt/home-page.test.ts`: consume the group without changing submitted values.

---

### Task 1: Add `I9kCheckboxGroup`

**Files:**

- Create: `src/components/I9kCheckboxGroup.vue`
- Create: `tests/I9kCheckboxGroup.test.ts`
- Create: `stories/I9kCheckboxGroup.stories.ts`
- Modify: `src/types/forms.ts`
- Modify: `src/index.ts`
- Modify: `tests/I9kComponentContracts.test.ts`
- Modify: `tests/I9kScopedStyles.test.ts`
- Modify: `tests/I9kNativeActionsFormsSsr.test.ts`

**Interfaces:**

- Consumes: `I9kComponentSize`, `i9kAriaInvalidAttr`, `i9kStringAttr`, `mergeI9kIds`, `omitI9kAttrs`.
- Produces: `I9kCheckboxOption`, `I9kCheckboxGroup`, and `update:modelValue: [value: string[]]`.

- [ ] **Step 1: Write failing behavior tests**

Create `tests/I9kCheckboxGroup.test.ts`:

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, expectTypeOf, it } from 'vitest';

import I9kCheckboxGroup from '../src/components/I9kCheckboxGroup.vue';

const options = [
  { label: 'Engineering', value: 'engineering', description: 'Technical track' },
  { label: 'Design', value: 'design' },
  { label: 'Advisory', value: 'advisory', disabled: true },
] as const;

type Props = InstanceType<typeof I9kCheckboxGroup>['$props'];

describe('I9kCheckboxGroup', () => {
  it('renders native named inputs and immutably adds and removes values', async () => {
    const selected = ['engineering'];
    const wrapper = mount(I9kCheckboxGroup, {
      props: { modelValue: selected, options, legend: 'Choose tracks', name: 'tracks' },
    });
    const inputs = wrapper.findAll('input[type="checkbox"]');

    expect(inputs.map((input) => input.attributes('name'))).toEqual(['tracks', 'tracks', 'tracks']);
    expect(inputs[0].attributes('checked')).toBeDefined();
    expect(wrapper.findAll('.i9k-checkbox-group__mark')).toHaveLength(3);
    await inputs[1].setValue(true);
    expect(wrapper.emitted('update:modelValue')).toEqual([[['engineering', 'design']]]);
    expect(selected).toEqual(['engineering']);

    await wrapper.setProps({ modelValue: ['engineering', 'design'] });
    await wrapper.get('input[value="engineering"]').setValue(false);
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([['design']]);
  });

  it('requires at least one option only while the group is empty', async () => {
    const wrapper = mount(I9kCheckboxGroup, {
      props: { modelValue: [], options, legend: 'Choose tracks', required: true },
    });
    expect(
      wrapper.findAll('input').every((input) => input.attributes('required') !== undefined),
    ).toBe(true);
    await wrapper.setProps({ modelValue: ['engineering'] });
    expect(
      wrapper.findAll('input').every((input) => input.attributes('required') === undefined),
    ).toBe(true);
  });

  it('links descriptions and errors while forwarding consumer attrs', () => {
    const wrapper = mount(I9kCheckboxGroup, {
      props: { modelValue: [], options, legend: 'Choose', hint: 'One or more', error: 'Required' },
      attrs: {
        'aria-describedby': 'note',
        'aria-invalid': 'spelling',
        class: 'consumer',
        'data-testid': 'group',
      },
    });
    const fieldset = wrapper.get('fieldset');
    const error = wrapper.get('[role="alert"]');
    expect(wrapper.find('.i9k-checkbox-group__hint').exists()).toBe(false);
    expect(fieldset.attributes('aria-invalid')).toBe('true');
    expect(fieldset.attributes('aria-describedby')?.split(' ')).toEqual([
      'note',
      error.attributes('id'),
    ]);
    expect(
      wrapper.get('input[value="engineering"]').attributes('aria-describedby')?.split(' '),
    ).toEqual([
      wrapper.get('.i9k-checkbox-group__description').attributes('id'),
      error.attributes('id'),
    ]);
    expect(fieldset.classes()).toContain('consumer');
    expect(fieldset.attributes('data-testid')).toBe('group');
  });

  it('renders the hint inside the legend and honors disabled states', () => {
    const wrapper = mount(I9kCheckboxGroup, {
      props: { modelValue: [], options, legend: 'Choose', hint: 'One or more', disabled: true },
    });
    const hint = wrapper.get('.i9k-checkbox-group__hint');
    expect(hint.element.parentElement?.tagName).toBe('LEGEND');
    expect(wrapper.get('fieldset').attributes('aria-describedby')).toBe(hint.attributes('id'));
    expect(wrapper.get('fieldset').attributes('disabled')).toBeDefined();
    expect(wrapper.get('input[value="advisory"]').attributes('disabled')).toBeDefined();
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s horizontal size', (size) => {
    const wrapper = mount(I9kCheckboxGroup, {
      props: { modelValue: [], options, legend: 'Choose', size, orientation: 'horizontal' },
    });
    expect(wrapper.get('fieldset').classes()).toEqual(
      expect.arrayContaining([`i9k-checkbox-group--${size}`, 'i9k-checkbox-group--horizontal']),
    );
    expectTypeOf<Props['size']>().toEqualTypeOf<'sm' | 'md' | 'lg' | undefined>();
  });
});
```

- [ ] **Step 2: Add failing package-contract expectations**

Update the export contract to require:

```ts
"export type { I9kCheckboxOption, I9kRadioOption } from './types/forms';",
"export { default as I9kCheckboxGroup } from './components/I9kCheckboxGroup.vue';",
```

Add `['I9kCheckboxGroup.vue', 'i9k-checkbox-group']` to `I9kScopedStyles.test.ts`. Import,
register, and SSR-render the component in `I9kNativeActionsFormsSsr.test.ts`:

```vue
<I9kCheckboxGroup :model-value="['audit']" :options="options" legend="Interests" />
```

Then assert `expect(html).toContain('i9k-checkbox-group--md')`.

- [ ] **Step 3: Run tests and verify RED**

Run:

```bash
npx vitest run tests/I9kCheckboxGroup.test.ts tests/I9kComponentContracts.test.ts tests/I9kScopedStyles.test.ts tests/I9kNativeActionsFormsSsr.test.ts
```

Expected: FAIL because `I9kCheckboxGroup.vue` and its exports are absent.

- [ ] **Step 4: Add public types and exports**

Add this interface in `src/types/forms.ts`:

```ts
export interface I9kCheckboxOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}
```

Add these exports in `src/index.ts`:

```ts
export type { I9kCheckboxOption, I9kRadioOption } from './types/forms';
export { default as I9kCheckboxGroup } from './components/I9kCheckboxGroup.vue';
```

- [ ] **Step 5: Implement behavior and markup**

Create `I9kCheckboxGroup.vue` by following `I9kRadioGroup`'s fieldset attribute/ARIA setup. Define
props for `modelValue: readonly string[]`, `options: readonly I9kCheckboxOption[]`, `legend`,
`name`, `hint`, `error`, `required`, `disabled`,
`size`, and `orientation`. Use this update function:

```ts
function updateOption(value: string, checked: boolean) {
  const nextValue = props.modelValue.filter((selectedValue) => selectedValue !== value);
  if (checked) nextValue.push(value);
  emit('update:modelValue', nextValue);
}
```

Render the hint inside the legend and keep each native input immediately before its mark:

```vue
<legend class="i9k-checkbox-group__legend">
  <span>{{ props.legend }}</span>
  <span v-if="props.hint && !props.error" :id="hintId" class="i9k-checkbox-group__hint">{{ props.hint }}</span>
</legend>
<div class="i9k-checkbox-group__options">
  <label v-for="(option, index) in props.options" :key="option.value" class="i9k-checkbox-group__option">
    <input
      :id="`${groupId}-option-${index}`"
      class="i9k-checkbox-group__input"
      type="checkbox"
      :name="resolvedName"
      :value="option.value"
      :checked="props.modelValue.includes(option.value)"
      :required="props.required && props.modelValue.length === 0"
      :disabled="props.disabled || option.disabled"
      :aria-describedby="mergeI9kIds(option.description ? `${groupId}-option-${index}-description` : undefined, groupDescriptionId)"
      @change="updateOption(option.value, ($event.target as HTMLInputElement).checked)"
    />
    <span class="i9k-checkbox-group__mark" aria-hidden="true">✓</span>
    <span class="i9k-checkbox-group__copy">
      <span>{{ option.label }}</span>
      <span v-if="option.description" :id="`${groupId}-option-${index}-description`" class="i9k-checkbox-group__description">{{ option.description }}</span>
    </span>
  </label>
</div>
```

Render the error after the options with `role="alert"`, matching `I9kRadioGroup`.

- [ ] **Step 6: Add scoped checkbox styles**

Use component-local variables: mark sizes `1.15rem`, `1.35rem`, `1.55rem`; control font tokens;
`line-height: 1.5`; a logical two-column grid; `gap: var(--spacing-6)`; and a first-line offset:

```css
.i9k-checkbox-group__mark {
  display: grid;
  width: var(--i9k-checkbox-mark-size);
  height: var(--i9k-checkbox-mark-size);
  margin-block-start: calc(
    (var(--i9k-checkbox-font-size) * 1.5 - var(--i9k-checkbox-mark-size)) / 2
  );
  place-items: center;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: transparent;
  transition: var(--transition);
}

.i9k-checkbox-group__input:checked + .i9k-checkbox-group__mark {
  border-color: var(--primary-text-color);
  background: var(--primary-text-color);
  color: var(--dark-color);
}

.i9k-checkbox-group__input:focus-visible + .i9k-checkbox-group__mark {
  outline: 3px solid var(--accent-color);
  outline-offset: 3px;
}
```

Visually hide inputs with absolute positioning, `1px` dimensions, and opacity zero. Use
`column-gap: var(--spacing-13)` and `row-gap: var(--spacing-8)` for horizontal wrapping. Style the
hint exactly like the page's current `legend small`. Give disabled options `opacity: 0.5` and
`cursor: not-allowed`. Disable mark transitions under reduced motion.

- [ ] **Step 7: Add and verify Storybook states**

Create stories named `Default`, `Sizes`, `Horizontal`, `DisabledOption`, `DisabledGroup`,
`WithError`, and `RightToLeft`. The RTL story must use `lang="ar" dir="rtl"`, the supplied course
labels, `hint="اختر واحدة أو أكثر"`, and a mixed `Vibe Coder` label.

Run the focused tests from Step 3 again. Expected: all PASS.

- [ ] **Step 8: Format and commit**

Run Prettier on all Task 1 files, then:

```bash
git diff --check
git add src/components/I9kCheckboxGroup.vue src/types/forms.ts src/index.ts tests/I9kCheckboxGroup.test.ts tests/I9kComponentContracts.test.ts tests/I9kScopedStyles.test.ts tests/I9kNativeActionsFormsSsr.test.ts stories/I9kCheckboxGroup.stories.ts
git commit -m "feat: add checkbox group"
```

Expected: the commit contains only the checkbox-group change.

---

### Task 2: Refine the default radio control and alignment

**Files:**

- Modify: `src/components/I9kRadioGroup.vue`
- Modify: `tests/I9kRadioGroup.test.ts`
- Modify: `tests/I9kNativeComponentStyles.test.ts`
- Modify: `stories/I9kRadioGroup.stories.ts`

**Interfaces:**

- Consumes: the existing `I9kRadioGroup` props and `update:modelValue: [value: string]`.
- Produces: `.i9k-radio-group__input` and `.i9k-radio-group__mark`; no public API change.

- [ ] **Step 1: Write failing markup and style regressions**

Add this unit test:

```ts
it('renders a decorative mark beside every native radio', () => {
  const wrapper = mount(I9kRadioGroup, {
    props: { modelValue: 'audit', options, legend: 'Service', orientation: 'horizontal' },
  });
  const radios = wrapper.findAll('.i9k-radio-group__input');
  const marks = wrapper.findAll('.i9k-radio-group__mark');

  expect(radios).toHaveLength(options.length);
  expect(marks).toHaveLength(options.length);
  expect(marks.every((mark) => mark.attributes('aria-hidden') === 'true')).toBe(true);
  expect(radios[0].element.nextElementSibling).toBe(marks[0].element);
});
```

In `I9kNativeComponentStyles.test.ts`, inspect compiled CSS and assert rules exist for:

```ts
expect(
  findRule(
    stylesheet,
    'grid-template-columns',
    'var(--i9k-radio-mark-size) minmax(0,1fr)',
    '--default .i9k-radio-group__option',
  ),
).toBeDefined();
expect(
  findRule(stylesheet, 'border-radius', 'var(--radius-circle)', '.i9k-radio-group__mark'),
).toBeDefined();
expect(
  findRule(
    stylesheet,
    'outline',
    '3px solid var(--accent-color)',
    ':focus-visible + .i9k-radio-group__mark',
  ),
).toBeDefined();
expect(findRule(stylesheet, 'display', 'none', '--card .i9k-radio-group__mark')).toBeDefined();
```

Add or reuse a `findRule(stylesheet, property, value, selectorPart)` helper like the one in
`I9kExistingComponentStyles.test.ts`.

- [ ] **Step 2: Run tests and verify RED**

```bash
npx vitest run tests/I9kRadioGroup.test.ts tests/I9kNativeComponentStyles.test.ts
```

Expected: FAIL because the custom mark and styles are absent.

- [ ] **Step 3: Add custom markup without changing behavior**

Add `class="i9k-radio-group__input"` to each native radio and insert immediately after it:

```vue
<span class="i9k-radio-group__mark" aria-hidden="true" />
```

Do not change checked, required, disabled, ARIA, ID, or emission behavior.

- [ ] **Step 4: Implement the refined default layout**

Add `--i9k-radio-mark-size` values of `1.15rem`, `1.35rem`, and `1.55rem` for `sm`, `md`, and
`lg`, plus `--i9k-radio-line-height: 1.5`. Replace the default option flex with:

```css
.i9k-radio-group--default .i9k-radio-group__option {
  display: grid;
  grid-template-columns: var(--i9k-radio-mark-size) minmax(0, 1fr);
  gap: var(--spacing-6);
  align-items: start;
  cursor: pointer;
}

.i9k-radio-group__input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.i9k-radio-group__mark {
  display: grid;
  width: var(--i9k-radio-mark-size);
  height: var(--i9k-radio-mark-size);
  margin-block-start: calc(
    (var(--i9k-radio-font-size) * var(--i9k-radio-line-height) - var(--i9k-radio-mark-size)) / 2
  );
  place-items: center;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-circle);
  transition: var(--transition);
}

.i9k-radio-group__mark::after {
  width: 42%;
  aspect-ratio: 1;
  border-radius: var(--radius-circle);
  background: var(--dark-color);
  content: '';
  transform: scale(0);
  transition: var(--transition);
}

.i9k-radio-group__input:checked + .i9k-radio-group__mark {
  border-color: var(--primary-text-color);
  background: var(--primary-text-color);
}

.i9k-radio-group__input:checked + .i9k-radio-group__mark::after {
  transform: scale(1);
}

.i9k-radio-group__input:focus-visible + .i9k-radio-group__mark {
  outline: 3px solid var(--accent-color);
  outline-offset: 3px;
}
```

Set horizontal `column-gap: var(--spacing-13)` and `row-gap: var(--spacing-8)`. Add `min-width: 0`
and the shared line-height to copy. Apply disabled opacity/cursor to default options. Preserve cards:

```css
.i9k-radio-group--card .i9k-radio-group__option {
  display: flex;
}
.i9k-radio-group--card .i9k-radio-group__mark {
  display: none;
}
```

Keep every existing card state rule. Disable mark and pseudo-element transitions under reduced motion.

- [ ] **Step 5: Expand stories and verify GREEN**

Keep existing stories. Make `RightToLeft` a default horizontal group with the five questionnaire
labels, including `Vibe Coder`, and add `RightToLeftCards` to retain Arabic card coverage.

Run the Step 2 command. Expected: both files PASS, including all existing card assertions.

- [ ] **Step 6: Format and commit**

Run Prettier on the four Task 2 files, then:

```bash
git diff --check
git add src/components/I9kRadioGroup.vue tests/I9kRadioGroup.test.ts tests/I9kNativeComponentStyles.test.ts stories/I9kRadioGroup.stories.ts
git commit -m "fix: refine radio control alignment"
```

---

### Task 3: Consume the checkbox group in 9k.school

**Files:**

- Modify: `../9k.school/app/pages/index.vue`
- Modify: `../9k.school/tests/nuxt/home-page.test.ts`
- Local-only link: `../9k.school/node_modules/@9klabs/design`

**Interfaces:**

- Consumes: `I9kCheckboxGroup` and `update:modelValue: [value: string[]]` from Task 1.
- Produces: unchanged `selectedCourses` values for `/api/subscribe`.

- [ ] **Step 1: Add a failing Nuxt assertion**

After opening the questionnaire in the existing test, assert:

```ts
const courseGroup = wrapper.get('.i9k-checkbox-group');
expect(courseGroup.get('legend').text()).toContain('ما الدورات التي تهمّك؟');
expect(courseGroup.get('.i9k-checkbox-group__hint').text()).toBe('اختر واحدة أو أكثر');
expect(courseGroup.findAll('.i9k-checkbox-group__mark')).toHaveLength(3);
expect(wrapper.find('.course-choice').exists()).toBe(false);
```

Keep the existing preselection and submitted-body assertions unchanged.

- [ ] **Step 2: Link locally and verify RED**

```bash
cd ../9k-design-system
npm run build
cd ../9k.school
pnpm link ../9k-design-system
pnpm test:unit tests/nuxt/home-page.test.ts
```

Expected: FAIL because the page still renders `.course-choice`. The link changes only ignored
`node_modules`; do not change `package.json` or the lockfile.

- [ ] **Step 3: Replace local markup and CSS**

Import `I9kCheckboxGroup`. After `courses`, add:

```ts
const courseOptions = courses.map((course) => ({
  label: course.title,
  value: course.slug,
}));
```

Replace the local fieldset with:

```vue
<I9kCheckboxGroup
  v-model="selectedCourses"
  class="course-picker"
  :options="courseOptions"
  legend="ما الدورات التي تهمّك؟"
  hint="اختر واحدة أو أكثر"
  name="courseInterests"
/>
```

Delete the `.course-picker`, `.course-picker legend`, `.course-picker legend small`,
`.course-choice`, `.course-choice input`, `.course-choice__mark`, checked, and focus rules. Keep the
profession/experience legend override.

- [ ] **Step 4: Verify GREEN and local-style removal**

```bash
pnpm test:unit tests/nuxt/home-page.test.ts
grep -R -n 'course-choice\|course-choice__mark' app tests --exclude-dir=.nuxt --exclude-dir=.output
```

Expected: the test file PASS and grep returns no matches. Do not commit these overlapping school
files because they already contain staged user-owned landing-page work; leave commit boundaries to
the user.

---

### Task 4: Full verification and visual QA

**Files:** Verify only; do not edit generated output.

**Interfaces:** Consumes Tasks 1–3 and produces fresh completion evidence.

- [ ] **Step 1: Run the design-system gate**

```bash
npm test
npm run format:check
npm run lint
npm run typecheck
npm run build
```

Expected: all exit zero. Remove no files; generated directories remain uncommitted.

- [ ] **Step 2: Inspect the stories**

Run `npm run storybook` and inspect checkbox RTL, radio RTL, and radio-card stories in light and
dark themes. Confirm selected shapes, focus rings, first-line alignment, mixed-language spacing,
wrapping, disabled appearance, and unchanged cards.

- [ ] **Step 3: Run the school gate against the local link**

```bash
pnpm test:unit
pnpm lint
pnpm typecheck
pnpm build
```

Expected: all exit zero. Record that clean installs still use the previous locked remote revision
until the design-system commits are published and the dependency lock is refreshed.

- [ ] **Step 4: Review final status**

```bash
git -C ../9k-design-system status --short
git -C ../9k-design-system log -4 --oneline
git -C ../9k.school status --short
git -C ../9k.school diff --check
```

Expected: design-system source commits contain no generated files; the school retains the user's
existing staged landing work plus the intentional checkbox-group integration.
