import type { ShowcaseEntry } from './types';

export const I9kBadgeEntry: ShowcaseEntry = {
  name: 'I9kBadge',
  section: 'content',
  summary:
    'Small inline label for status, category, or tag content. Use it next to a heading or inside a card to mark a short piece of metadata.',
  agentPrompt: `Use I9kBadge from @ismail9k/9k-design-system for a short inline label.

import { I9kBadge } from '@ismail9k/9k-design-system';

Props:
- as?: string | Component (default 'span') — the rendered root tag or component.
- size?: 'sm' | 'md' | 'lg' (default 'md')
- variant?: 'solid' | 'outline' | 'tag' (default 'outline')

Emits: none.

Slots: default — the badge text.

Behavior: 'solid' fills with the primary color for a featured/callout badge. 'outline' is a bordered, transparent badge for general metadata (the default). 'tag' renders a subtler filled chip with a leading "#" decoration, for topic/category tags.

IMPORTANT: badge text renders uppercase via CSS (text-transform) regardless of the casing you pass — write it in normal case in the slot content, do not pre-uppercase it yourself.

Usage:
<I9kBadge variant="tag" size="sm">AI</I9kBadge>`,
  gotchas: [
    'Badge text is uppercased by CSS automatically — pass normal-case text, do not pre-uppercase it.',
    '`variant="tag"` adds a decorative leading "#" automatically; do not include one in the slot content.',
  ],
  demos: [
    {
      label: 'Variants',
      code: `<div style="display: flex; flex-wrap: wrap; gap: var(--spacing-6)">
  <I9kBadge variant="solid">Featured</I9kBadge>
  <I9kBadge variant="outline">Open source</I9kBadge>
  <I9kBadge variant="tag">AI</I9kBadge>
</div>`,
    },
    {
      label: 'Sizes',
      code: `<div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--spacing-6)">
  <I9kBadge size="sm" variant="tag">Small</I9kBadge>
  <I9kBadge size="md" variant="tag">Medium</I9kBadge>
  <I9kBadge size="lg" variant="tag">Large</I9kBadge>
</div>`,
    },
  ],
};
