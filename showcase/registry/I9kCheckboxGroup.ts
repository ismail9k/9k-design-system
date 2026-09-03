import type { ShowcaseEntry } from './types';

export const I9kCheckboxGroupEntry: ShowcaseEntry = {
  name: 'I9kCheckboxGroup',
  section: 'forms',
  summary:
    'Accessible checkbox fieldset for selecting multiple values with labels, descriptions, validation, and RTL support.',
  agentPrompt: `Use I9kCheckboxGroup from @9klabs/design when a user may select zero, one, or several options.

import { I9kCheckboxGroup } from '@9klabs/design';
import type { I9kCheckboxOption } from '@9klabs/design';

Props:
- modelValue: readonly string[] (required) — selected option values; use v-model in interactive forms.
- options: readonly I9kCheckboxOption[] (required) — { label, value, description?, disabled? }.
- legend: string (required) — accessible fieldset name.
- name?: string — shared native checkbox name; generated when omitted.
- hint?: string — supporting text announced with the group.
- error?: string — validation message announced as an alert.
- required?: boolean (default false) — requires at least one enabled selection.
- disabled?: boolean (default false) — disables the whole fieldset.
- size?: 'sm' | 'md' | 'lg' (default 'md').
- orientation?: 'horizontal' | 'vertical' (default 'vertical').

Emits:
- update:modelValue(value: string[]) — returns a new array after a native checkbox change.

Slots: none.

Behavior: the component renders a native fieldset and checkbox inputs. Required state clears from individual inputs after one enabled option is selected, while disabled options remain unavailable.

Usage:
<I9kCheckboxGroup
  v-model="selected"
  :options="[{ label: 'Engineering', value: 'engineering' }, { label: 'Design', value: 'design' }]"
  legend="Choose your interests"
/>
`,
  gotchas: [
    '`modelValue` is an array because multiple options may be selected; the emitted array is new and never mutates the prop.',
    'Use `legend` as the group label instead of adding a separate, unassociated heading.',
    'An option-level `disabled` value combines with the group-level `disabled` prop.',
  ],
  demos: [
    {
      label: 'Default',
      code: `<I9kCheckboxGroup
  :model-value="['engineering']"
  :options="[
    { label: 'Engineering', value: 'engineering', description: 'Technical product work' },
    { label: 'Design', value: 'design', description: 'Product and interface design' },
  ]"
  legend="Choose your interests"
/>
`,
    },
    {
      label: 'Horizontal',
      code: `<I9kCheckboxGroup
  :model-value="['engineering']"
  :options="[{ label: 'Engineering', value: 'engineering' }, { label: 'Design', value: 'design' }]"
  legend="Choose your interests"
  orientation="horizontal"
/>
`,
    },
    {
      label: 'Validation error',
      code: `<I9kCheckboxGroup
  :model-value="[]"
  :options="[{ label: 'Engineering', value: 'engineering' }, { label: 'Design', value: 'design' }]"
  legend="Choose your interests"
  error="Choose at least one interest."
  required
/>
`,
    },
    {
      label: 'Arabic RTL',
      code: `<div dir="rtl" lang="ar">
  <I9kCheckboxGroup
    :model-value="['engineering']"
    :options="[{ label: 'هندسة البرمجيات', value: 'engineering' }, { label: 'تصميم المنتجات', value: 'design' }]"
    legend="اختر اهتماماتك"
    hint="يمكنك اختيار أكثر من مجال"
  />
</div>
`,
    },
  ],
};
