import type { ShowcaseEntry } from './types';

export const I9kSocialLinksEntry: ShowcaseEntry = {
  name: 'I9kSocialLinks',
  section: 'chrome',
  summary:
    'Row of pill-shaped social/contact links, each opening in a new tab, with an icon fallback and a customizable accessible label per item.',
  agentPrompt: `Use I9kSocialLinks from @ismail9k/9k-design-system for a row of social or contact links (also used internally by I9kFooter).

import { I9kSocialLinks } from '@ismail9k/9k-design-system';

Props:
- items: I9kSocialLink[] (required) — { name: string; url: string; label?: string; icon?: I9kIconName }. This type is not exported from the package — inline the shape or declare your own local type.
- labels?: boolean (default false) — shows \`item.label ?? item.name\` as visible text next to each icon.
- followLabel?: (platform: string) => string (default \`(platform) => \\\`Follow on \\\${platform}\\\`\`) — builds each link's \`aria-label\` from \`item.name\`. Override it for non-social contexts, e.g. a plain "Email" or "Call" link.

Emits: click — [item: I9kSocialLink, event: MouseEvent].

Slots:
- icon — one slot prop, item: I9kSocialLink. Replaces the default rendering (an I9kIcon when \`item.icon\` is set, otherwise the first letter of \`item.name\`) for every link.

IMPORTANT: every link renders with \`target="_blank" rel="noopener"\` unconditionally — there is no prop to open a link in the same tab.

Usage:
<I9kSocialLinks
  :items="[
    { name: 'GitHub', url: 'https://github.com/ismail9k', icon: 'github' },
    { name: 'Mail', url: 'mailto:hello@ismail9k.com', icon: 'mail' },
  ]"
  @click="onSocialClick"
/>`,
  gotchas: [
    'Every link opens in a new tab (`target="_blank" rel="noopener"`) — this is not configurable per item or overall.',
    'An item with no `icon` falls back to a single-letter avatar (the first character of `name`), not a blank space — supply `icon` for every item that should show a real icon.',
    '`followLabel` builds the accessible name from `item.name`; override it when the links are not "follow" actions (e.g. email or phone contact links).',
  ],
  demos: [
    {
      label: 'Icons, with labels',
      code: `<div style="position: relative; padding: var(--spacing-8); border: 1px solid var(--border-color); border-radius: var(--radius-md);">
  <I9kSocialLinks :items="items" labels />
</div>`,
      state: {
        items: [
          { name: 'GitHub', url: 'https://github.com/ismail9k', icon: 'github' },
          { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
          { name: 'Mail', url: 'mailto:hello@ismail9k.com', icon: 'mail', label: 'Email' },
        ],
      },
    },
    {
      label: 'Fallback initial (no icon)',
      code: `<div style="position: relative; padding: var(--spacing-8); border: 1px solid var(--border-color); border-radius: var(--radius-md);">
  <I9kSocialLinks :items="noIconItems" />
</div>`,
      state: {
        noIconItems: [
          { name: 'Discord', url: 'https://discord.com' },
          { name: 'Threads', url: 'https://threads.net' },
        ],
      },
    },
  ],
};
