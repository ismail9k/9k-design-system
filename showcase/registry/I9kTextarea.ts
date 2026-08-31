import type { ShowcaseEntry } from './types';

export const I9kTextareaEntry: ShowcaseEntry = {
  name: 'I9kTextarea',
  section: 'forms',
  summary:
    'Multi-line text control for longer form input. Wires its own id and ARIA attributes standalone, and inherits id, size, and error state from a wrapping I9kField when there is one.',
  agentPrompt: `Use I9kTextarea from @9klabs/design for multi-line text input, typically inside an I9kField.

import { I9kTextarea } from '@9klabs/design';

Props:
- modelValue: string (required) — the v-model target.
- uiSize?: 'sm' | 'md' | 'lg' — falls back to a wrapping I9kField's size, then to 'md'.
- resize?: 'vertical' | 'horizontal' | 'both' | 'none' (default 'vertical')

Emits: update:modelValue with the new string.

Slots: none — this renders a bare <textarea>.

Behavior: inside an I9kField, I9kTextarea calls useI9kField() and takes its id, described-by ids, invalid state, required state, and size from that context automatically. Standalone (no wrapping I9kField), it generates its own id and expects the caller to provide an accessible name via aria-label or aria-labelledby — omitting both triggers a dev-mode console warning. required, aria-invalid, and aria-describedby also pass through as native attrs when there is no I9kField.

IMPORTANT: the visual scale prop is \`uiSize\`, not \`size\`. IMPORTANT: inside I9kField, do not pass id, aria-invalid, or aria-describedby — I9kField supplies them, and a mismatched id triggers a dev-mode warning.

Usage:
<I9kField label="Project details"><I9kTextarea v-model="details" /></I9kField>`,
  gotchas: [
    'The visual scale prop is `uiSize`, not `size`.',
    'Inside an I9kField, do not pass id, aria-invalid, or aria-describedby — the field supplies them; a conflicting id logs a dev warning.',
    'Without a wrapping I9kField, supply aria-label or aria-labelledby yourself — there is no visible label otherwise.',
  ],
  demos: [
    {
      label: 'Inside I9kField',
      code: `<I9kField label="Project details" hint="A few sentences is plenty.">
  <I9kTextarea v-model="details" />
</I9kField>`,
      state: { details: '' },
    },
    {
      label: 'Sizes',
      code: `<I9kField label="Small" size="sm"><I9kTextarea v-model="a" /></I9kField>
<I9kField label="Medium" size="md"><I9kTextarea v-model="b" /></I9kField>
<I9kField label="Large" size="lg"><I9kTextarea v-model="c" /></I9kField>`,
      state: { a: '', b: '', c: '' },
    },
    {
      label: 'Error state',
      code: `<I9kField label="Project details" error="Please provide project details.">
  <I9kTextarea v-model="details" />
</I9kField>`,
      state: { details: '' },
    },
  ],
};
