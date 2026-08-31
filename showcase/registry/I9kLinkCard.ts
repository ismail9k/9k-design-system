import type { ShowcaseEntry } from './types';

export const I9kLinkCardEntry: ShowcaseEntry = {
  name: 'I9kLinkCard',
  section: 'content',
  summary:
    'Clickable card linking out to an external resource, with a name, description, and optional image/badge/arrow. Use it for a grid of projects, articles, or external links.',
  agentPrompt: `Use I9kLinkCard from @9klabs/design for a clickable card that links to an external URL.

import { I9kLinkCard } from '@9klabs/design';

Props:
- name: string (required)
- url: string (required) — the card is an <a href="url"> opened in a new tab (target="_blank", rel="noopener").
- description: string (required)
- image?: string | null (default null)
- badge?: string | null (default null)
- showImage?: boolean (default true) — set false to hide the image even when \`image\` is given.
- arrow?: boolean (default false) — shows a trailing arrow glyph in the top-right corner.
- arrowLabel?: string (default '↗') — the arrow glyph itself.
- size?: 'sm' | 'md' | 'lg' (default 'md')

Emits: click with the native MouseEvent — the link still navigates; use this only for side effects like analytics, not to prevent navigation.

Slots: none — name, description, image, and badge are all props.

IMPORTANT: the whole card is a single <a> to \`url\` opened in a new tab; do not nest another interactive element (button, link) inside it.

Usage:
<I9kLinkCard name="vue3-carousel" url="https://github.com/ismail9k/vue3-carousel" description="A flexible, responsive carousel component for Vue 3." badge="Open source" arrow />`,
  gotchas: [
    'The entire card renders as one <a> element opened in a new tab — never nest another link or button inside it.',
    '`click` fires alongside normal navigation, not instead of it; it does not stop the link from opening.',
    '`showImage` only hides the image slot area — it does not remove the badge/arrow header or change card size.',
  ],
  demos: [
    {
      label: 'Badge and arrow',
      code: `<I9kLinkCard name="vue3-carousel" url="https://github.com/ismail9k/vue3-carousel" description="A flexible, responsive carousel component for Vue 3." badge="Open source" arrow />`,
    },
    {
      label: 'With image',
      code: `<I9kLinkCard name="ismail9k" url="https://github.com/ismail9k" description="Personal GitHub profile and open-source projects." image="https://avatars.githubusercontent.com/u/20756985?s=120&v=4" badge="Library" />`,
    },
    {
      label: 'Sizes',
      code: `<div style="display: grid; gap: var(--component-gap-md)">
  <I9kLinkCard size="sm" name="Small card" url="https://example.com/small" description="Compact link card" />
  <I9kLinkCard size="md" name="Medium card" url="https://example.com/medium" description="Default link card" />
  <I9kLinkCard size="lg" name="Large card" url="https://example.com/large" description="Prominent link card" />
</div>`,
    },
  ],
};
