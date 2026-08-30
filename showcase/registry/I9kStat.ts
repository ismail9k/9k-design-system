import type { ShowcaseEntry } from './types';

export const I9kStatEntry: ShowcaseEntry = {
  name: 'I9kStat',
  section: 'content',
  summary:
    'Value/label/source stack for a single statistic. Use it in a grid of a few key numbers, such as metrics on an about page or a pricing comparison.',
  agentPrompt: `Use I9kStat from @9klabs/design to display one statistic (value, label, and optional source).

import { I9kStat } from '@9klabs/design';

Props:
- as?: string | Component (default 'div') — the rendered root tag or component.
- label?: string (default undefined)
- size?: 'sm' | 'md' | 'lg' (default 'md')
- source?: string (default undefined)
- value?: string | number (default undefined)

Emits: none.

Slots:
- value — overrides the \`value\` prop's rendering, e.g. to bold or link the number.
- label — overrides the \`label\` prop's rendering.
- source — overrides the \`source\` prop's rendering, e.g. to link a citation.

Behavior: each of value/label/source renders only when its prop is set OR its matching slot is filled — pass either the prop or the slot for a given piece, not neither.

IMPORTANT: nothing renders for value, label, or source unless you supply the prop or the matching slot — do not rely on a slot alone without checking the prop is left unset (they are not mutually exclusive, but the slot always takes rendering priority when both are present).

Usage:
<I9kStat label="monthly npm downloads" value="480k+" source="npm snapshot" size="lg" />`,
  gotchas: [
    'Each of value/label/source only renders when its prop is set or its same-named slot is filled — an I9kStat with none of the three renders an empty shell.',
    'When both the prop and the matching slot are given, the slot content is what renders.',
  ],
  demos: [
    {
      label: 'Sizes',
      code: `<div style="display: grid; gap: var(--spacing-13); grid-template-columns: repeat(3, minmax(0, 1fr))">
  <I9kStat label="small stat" size="sm" value="12" />
  <I9kStat label="monthly downloads" size="md" value="480k+" />
  <I9kStat label="years building products" size="lg" value="10+" />
</div>`,
    },
    {
      label: 'Slot overrides',
      code: `<I9kStat>
  <template #value><strong>99.9%</strong></template>
  <template #label>availability target</template>
  <template #source><a href="#" @click.prevent>service report</a></template>
</I9kStat>`,
    },
  ],
};
