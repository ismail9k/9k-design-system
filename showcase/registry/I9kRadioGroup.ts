import type { ShowcaseEntry } from './types';

export const I9kRadioGroupEntry: ShowcaseEntry = {
  name: 'I9kRadioGroup',
  section: 'forms',
  summary:
    'Fieldset of mutually exclusive radio options, rendered as a stacked list or a card grid. Unlike I9kInput, I9kTextarea, and I9kSelect, it does not participate in the I9kField composable — it owns its own legend, hint, error, and ids entirely.',
  agentPrompt: `Use I9kRadioGroup from @9klabs/design for a single choice among a small, fully visible set of options.

import { I9kRadioGroup } from '@9klabs/design';
import type { I9kRadioOption } from '@9klabs/design';

Props:
- modelValue: string (required) — the v-model target, matched against each option's value.
- options: readonly I9kRadioOption[] (required) — each is { label: string; value: string; description?: string; disabled?: boolean }.
- legend: string (required) — the fieldset's accessible name; always rendered, there is no slot override.
- name?: string — the radio input group name; defaults to an auto-generated id.
- hint?: string
- error?: string — a defined value renders the error message instead of the hint and marks the group invalid.
- required?: boolean (default false)
- disabled?: boolean (default false) — disables the whole group.
- size?: 'sm' | 'md' | 'lg' (default 'md')
- variant?: 'default' | 'card' (default 'default')
- orientation?: 'horizontal' | 'vertical' (default 'vertical')

Emits: update:modelValue with the selected option's value.

Slots: none.

IMPORTANT: I9kRadioGroup never calls useI9kField() — do NOT wrap it in I9kField expecting it to inherit label, hint, error, or size the way I9kInput/I9kTextarea/I9kSelect do. It renders its own <fieldset><legend> and its own hint/error paragraphs directly from its own props. Wrapping it in I9kField still renders I9kField's separate label/hint/error around the group, producing duplicated, disconnected markup — pass legend, hint, error, required, and size straight to I9kRadioGroup instead, with no I9kField involved.

Usage:
<I9kRadioGroup v-model="service" legend="Choose a service" :options="[{ label: 'Technical audit', value: 'audit' }, { label: 'Design system', value: 'design' }]" />`,
  gotchas: [
    'Never wrap I9kRadioGroup in I9kField — it does not call useI9kField() and will not inherit label, hint, error, or size from it; pass those as its own props instead.',
    '`options` must match the I9kRadioOption shape exactly: { label, value, description?, disabled? }.',
    'The `card` variant lays out options in a two-column grid (one column under 640px) with the native input visually hidden; `default` renders a plain stacked or wrapped list.',
  ],
  demos: [
    {
      label: 'Default',
      code: `<I9kRadioGroup v-model="service" legend="Choose a service" :options="options" />`,
      state: {
        service: 'audit',
        options: [
          { label: 'Technical audit', value: 'audit', description: 'Review an existing product' },
          { label: 'Design system', value: 'design', description: 'Create shared foundations' },
        ],
      },
    },
    {
      label: 'Card variant',
      code: `<I9kRadioGroup
  v-model="service"
  legend="Choose a service"
  variant="card"
  :options="options"
/>`,
      state: {
        service: 'audit',
        options: [
          { label: 'Technical audit', value: 'audit', description: 'Review an existing product' },
          { label: 'Design system', value: 'design', description: 'Create shared foundations' },
        ],
      },
    },
    {
      label: 'Required with error',
      code: `<I9kRadioGroup
  v-model="service"
  legend="Choose a service"
  required
  error="Choose the service you need."
  :options="options"
/>`,
      state: {
        service: '',
        options: [
          { label: 'Technical audit', value: 'audit' },
          { label: 'Design system', value: 'design' },
        ],
      },
    },
  ],
};
