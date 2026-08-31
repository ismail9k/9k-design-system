import type { ShowcaseEntry } from './types';

export const I9kSelectEntry: ShowcaseEntry = {
  name: 'I9kSelect',
  section: 'forms',
  summary:
    'Native single-select dropdown that auto-selects the option matching modelValue. Wires its own id and ARIA attributes standalone, and inherits id, size, and error state from a wrapping I9kField when there is one.',
  agentPrompt: `Use I9kSelect from @9klabs/design for a single-choice dropdown, typically inside an I9kField.

import { I9kSelect } from '@9klabs/design';

Props:
- modelValue: string (required) — the v-model target, matched against each child <option>'s value (or its text content if it has no value attribute).
- uiSize?: 'sm' | 'md' | 'lg' — falls back to a wrapping I9kField's size, then to 'md'.

Emits: update:modelValue with the new string.

Slots:
- default — plain <option> and <optgroup> elements. I9kSelect clones them and sets \`selected\` on the one matching modelValue; do not set \`selected\` yourself.

Behavior: inside an I9kField, I9kSelect calls useI9kField() and takes its id, described-by ids, invalid state, required state, and size from that context automatically. Standalone, it generates its own id and expects an accessible name via aria-label or aria-labelledby — omitting both triggers a dev-mode console warning. This is a native single-select only: the \`multiple\` and \`size\` HTML attributes are stripped and log a dev-mode warning if passed.

IMPORTANT: the visual scale prop is \`uiSize\`, not \`size\` — passing the native \`size\` attribute is rejected with a dev warning. IMPORTANT: inside I9kField, do not pass id, aria-invalid, or aria-describedby — I9kField supplies them.

Usage:
<I9kField label="Service"><I9kSelect v-model="service"><option value="">Choose one</option><option value="audit">Technical audit</option></I9kSelect></I9kField>`,
  gotchas: [
    'The visual scale prop is `uiSize`, not `size`; the native `size` and `multiple` attributes are stripped and logged as a dev warning.',
    "Pass plain <option>/<optgroup> children without a `selected` attribute — I9kSelect sets it based on modelValue matching the option's value or text.",
    'Inside an I9kField, do not pass id, aria-invalid, or aria-describedby — the field supplies them.',
  ],
  demos: [
    {
      label: 'Inside I9kField',
      code: `<I9kField label="Service">
  <I9kSelect v-model="service">
    <option value="">Choose a service</option>
    <option value="audit">Technical audit</option>
    <option value="design">Design system</option>
    <option value="development">Development</option>
  </I9kSelect>
</I9kField>`,
      state: { service: '' },
    },
    {
      label: 'Sizes',
      code: `<I9kField label="Small" size="sm">
  <I9kSelect v-model="a"><option value="audit">Technical audit</option></I9kSelect>
</I9kField>
<I9kField label="Medium" size="md">
  <I9kSelect v-model="b"><option value="audit">Technical audit</option></I9kSelect>
</I9kField>
<I9kField label="Large" size="lg">
  <I9kSelect v-model="c"><option value="audit">Technical audit</option></I9kSelect>
</I9kField>`,
      state: { a: 'audit', b: 'audit', c: 'audit' },
    },
    {
      label: 'Error state',
      code: `<I9kField label="Service" error="Select the service you need.">
  <I9kSelect v-model="service">
    <option value="">Choose a service</option>
    <option value="audit">Technical audit</option>
  </I9kSelect>
</I9kField>`,
      state: { service: '' },
    },
  ],
};
