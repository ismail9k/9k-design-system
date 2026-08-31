import type { ShowcaseEntry } from './types';

export const I9kFooterEntry: ShowcaseEntry = {
  name: 'I9kFooter',
  section: 'chrome',
  summary:
    "A page's bottom chrome: an optional row of social links and an optional tagline, both replaceable via slots.",
  agentPrompt: `Use I9kFooter from @9klabs/design as a page's <footer>, for a social-links row and a short tagline.

import { I9kFooter } from '@9klabs/design';

Props:
- tagline?: string | null (default null) — plain text shown under the social links, only when the default slot is not used.
- socialLinks?: I9kSocialLink[] (default []) — rendered via I9kSocialLinks; the type is { name: string; url: string; label?: string; icon?: I9kIconName }. It is not exported from the package — inline the shape or declare your own local type.
- socialLabels?: boolean (default false) — forwarded to I9kSocialLinks to show text labels next to each icon.

Emits: socialClick — [item: I9kSocialLink, event: MouseEvent], forwarded from the underlying I9kSocialLinks click.

Slots:
- social-icon — forwarded straight through to I9kSocialLinks' own \`icon\` slot; receives one slot prop, item: I9kSocialLink, for the link being rendered.
- default — replaces the tagline paragraph entirely. Falls back to \`<p>{{ tagline }}</p>\` (only rendered when \`tagline\` is set) when no slot content is given.

IMPORTANT: the social links row only renders when \`socialLinks\` is a non-empty array — pass at least one entry or nothing appears.

IMPORTANT: the default slot and the \`tagline\` prop are mutually exclusive in effect — providing default slot content replaces the tagline paragraph outright, it is not appended alongside it.

Usage:
<I9kFooter
  tagline="Built with the 9k design system."
  :social-links="[{ name: 'GitHub', url: 'https://github.com/ismail9k', icon: 'github' }]"
  @social-click="onSocialClick"
/>`,
  gotchas: [
    'The social links row is conditional on `socialLinks.length` — an empty array (the default) renders no I9kSocialLinks at all.',
    'The default slot fully replaces the tagline paragraph rather than appending to it — use one or the other, not both.',
    'I9kSocialLink is not exported from the package — inline `{ name: string; url: string; label?: string; icon?: I9kIconName }` yourself.',
  ],
  demos: [
    {
      label: 'Tagline and social links',
      code: `<div style="position: relative; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
  <I9kFooter
    tagline="Built with the 9k design system."
    :social-links="[
      { name: 'GitHub', url: 'https://github.com/ismail9k', icon: 'github' },
      { name: 'Mail', url: 'mailto:hello@ismail9k.com', icon: 'mail' },
    ]"
  />
</div>`,
    },
    {
      label: 'Custom footer content (default slot)',
      code: `<div style="position: relative; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
  <I9kFooter :social-links="[{ name: 'GitHub', url: 'https://github.com/ismail9k', icon: 'github' }]">
    <p style="margin: 0; font-size: 0.85rem;">© 2026 Ismail9k. All rights reserved.</p>
  </I9kFooter>
</div>`,
    },
  ],
};
