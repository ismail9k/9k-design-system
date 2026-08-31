import type { ShowcaseEntry } from './types';

export const I9kClusterEntry: ShowcaseEntry = {
  name: 'I9kCluster',
  section: 'layout',
  summary:
    'Flex-wrap row that keeps items center-aligned and evenly gapped, wrapping onto new lines instead of overflowing. Use it for groups of buttons, badges, or other inline controls.',
  agentPrompt: `Use I9kCluster from @9klabs/design to lay out a horizontal group of items that should wrap instead of overflow.

import { I9kCluster } from '@9klabs/design';

Props:
- as?: string | Component (default 'div') — the rendered root tag or component.
- size?: 'sm' | 'md' | 'lg' (default 'md') — sets the gap between items only.

Emits: none.

Slots: default — the items to cluster.

Behavior: renders \`display: flex; flex-wrap: wrap; align-items: center;\` with a size-driven gap. Items wrap onto new rows as the container narrows; there is no column count or breakpoint logic to configure.

IMPORTANT: items are vertically centered (\`align-items: center\`), not baseline-aligned — mixed-height items (e.g. a button next to a badge) line up on their centers, not their text baselines.

Usage:
<I9kCluster size="md"><I9kButton>Primary action</I9kButton><I9kButton variant="link">Secondary action</I9kButton><I9kBadge variant="outline">Status</I9kBadge></I9kCluster>`,
  gotchas: [
    '`size` sets the gap only — there is no column or breakpoint prop, wrapping is automatic flex-wrap.',
    'Items are center-aligned on the cross axis, not baseline-aligned.',
  ],
  demos: [
    {
      label: 'Default',
      code: `<I9kCluster>
  <I9kButton>Primary action</I9kButton>
  <I9kButton variant="link">Secondary action</I9kButton>
  <I9kBadge variant="outline">Status</I9kBadge>
</I9kCluster>`,
    },
    {
      label: 'Sizes',
      code: `<div style="display: grid; gap: var(--spacing-8)">
  <I9kCluster size="sm"><I9kBadge>Small</I9kBadge><I9kBadge>Cluster</I9kBadge></I9kCluster>
  <I9kCluster size="lg"><I9kBadge>Large</I9kBadge><I9kBadge>Cluster</I9kBadge></I9kCluster>
</div>`,
    },
    {
      label: 'Wrapping',
      code: `<I9kCluster style="max-width: 16rem">
  <I9kBadge variant="tag">Design systems</I9kBadge>
  <I9kBadge variant="tag">Vue</I9kBadge>
  <I9kBadge variant="tag">Accessibility</I9kBadge>
  <I9kBadge variant="tag">RTL</I9kBadge>
</I9kCluster>`,
    },
  ],
};
