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
