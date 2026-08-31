import type { ShowcaseEntry } from './types';

export const I9kButtonGroupEntry: ShowcaseEntry = {
  name: 'I9kButtonGroup',
  section: 'actions',
  summary:
    'Layout wrapper that spaces a row or column of buttons with a consistent gap and groups them as one control for assistive tech.',
  agentPrompt: `Use I9kButtonGroup from @9klabs/design to lay out a cluster of related buttons (e.g. Save/Cancel, or a toolbar of icon buttons) with consistent spacing.

import { I9kButtonGroup } from '@9klabs/design';

Props:
- size?: 'sm' | 'md' | 'lg' (default 'md') — sets the gap between children only.
- orientation?: 'horizontal' | 'vertical' (default 'horizontal') — horizontal wraps onto new lines; vertical stretches children to full width.
- label?: string — sets the group's accessible name (\`aria-label\`) via \`role="group"\`. Omit it and no \`aria-label\` is rendered.

Emits: none.

Slots: default — the buttons (typically I9kButton and/or I9kIconButton).

IMPORTANT: \`size\` only controls the gap between children — it does NOT resize the buttons inside. Set \`size\` on each child button to match if you want them visually smaller or larger, not just on the group.

Usage:
<I9kButtonGroup label="Article actions" size="sm">
  <I9kButton size="sm">Save</I9kButton>
  <I9kIconButton icon="mail" label="Email article" size="sm" />
</I9kButtonGroup>`,
  gotchas: [
    '`size` on I9kButtonGroup only changes the gap between children — set the same `size` on each child button to actually resize them.',
    'Give it a `label` when the group has no adjacent visible heading; it becomes the `aria-label` on the `role="group"` wrapper.',
    '`orientation="vertical"` stretches children to fill the group\'s width (`align-items: stretch`); horizontal (the default) wraps children onto new lines instead of overflowing.',
  ],
  demos: [
    {
      label: 'Horizontal (default)',
      code: `<I9kButtonGroup label="Article actions">
  <I9kButton>Save</I9kButton>
  <I9kIconButton icon="mail" label="Email article" />
</I9kButtonGroup>`,
    },
    {
      label: 'Vertical',
      code: `<I9kButtonGroup label="Article actions" orientation="vertical">
  <I9kButton>Save draft</I9kButton>
  <I9kButton>Preview</I9kButton>
  <I9kIconButton icon="mail" label="Email article" />
</I9kButtonGroup>`,
    },
    {
      label: 'Sizes (set on both the group and its children)',
      code: `<I9kButtonGroup label="Small actions" size="sm">
  <I9kButton size="sm">Save</I9kButton>
  <I9kIconButton icon="mail" label="Email" size="sm" />
</I9kButtonGroup>
<I9kButtonGroup label="Large actions" size="lg">
  <I9kButton size="lg">Save</I9kButton>
  <I9kIconButton icon="mail" label="Email" size="lg" />
</I9kButtonGroup>`,
    },
  ],
};
