import type { ShowcaseEntry } from './types';

export const I9kPanelEntry: ShowcaseEntry = {
  name: 'I9kPanel',
  section: 'layout',
  summary:
    'Bordered, blurred glass surface for grouping content. Use it as the standard card/surface wrapper wherever content needs visual separation from the page background.',
  agentPrompt: `Use I9kPanel from @ismail9k/9k-design-system to wrap content in a bordered surface.

import { I9kPanel } from '@ismail9k/9k-design-system';

Props:
- as?: string | Component (default 'div') — the rendered root tag or component.
- size?: 'sm' | 'md' | 'lg' (default 'md') — sets padding and border radius.
- variant?: 'default' | 'feature' | 'flat' (default 'default') — sets the border and background treatment.

Emits: none.

Slots: default — the panel content.

Behavior: 'default' renders a 1px border, glass background, and backdrop blur. 'feature' emphasizes the border and background with an accent-tinted gradient for content that should stand out (e.g. a highlighted pricing tier). 'flat' removes the border, background, and backdrop-filter entirely, leaving only the size-driven padding — useful when you want the padding/radius rhythm without a visible surface, e.g. nested inside another panel.

IMPORTANT: \`variant="flat"\` strips the border and background — do not combine it with content that depends on the panel having a visible surface.

Usage:
<I9kPanel variant="feature" size="lg"><I9kText variant="lede">Highlighted content</I9kText></I9kPanel>`,
  gotchas: [
    '`variant="flat"` removes the border, background, and backdrop-filter, keeping only padding and radius.',
    '`size` controls padding and border radius, not width — the panel is only as wide as its container allows.',
  ],
  demos: [
    {
      label: 'Variants',
      code: `<div style="display: grid; gap: var(--spacing-8); grid-template-columns: repeat(3, minmax(0, 1fr))">
  <I9kPanel variant="default">Default panel</I9kPanel>
  <I9kPanel variant="feature">Feature panel</I9kPanel>
  <I9kPanel variant="flat">Flat panel</I9kPanel>
</div>`,
    },
    {
      label: 'Sizes',
      code: `<div style="display: grid; gap: var(--spacing-8)">
  <I9kPanel size="sm">Small panel</I9kPanel>
  <I9kPanel size="md">Medium panel</I9kPanel>
  <I9kPanel size="lg">Large panel</I9kPanel>
</div>`,
    },
  ],
};
