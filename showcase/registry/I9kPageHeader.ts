import type { ShowcaseEntry } from './types';

export const I9kPageHeaderEntry: ShowcaseEntry = {
  name: 'I9kPageHeader',
  section: 'content',
  summary:
    'Large hero-style heading for the top of a page, with optional subtitle, description, actions, and avatar. Use it once per page, at the top.',
  agentPrompt: `Use I9kPageHeader from @ismail9k/9k-design-system for the hero heading at the top of a page.

import { I9kPageHeader } from '@ismail9k/9k-design-system';

Props:
- title: string (required)
- description?: string | null (default null)
- id?: string | null (default null) — set on the rendered heading element.
- level?: 1 | 2 | 3 | 4 | 5 | 6 (default 1) — the rendered heading level (renders <h{level}>).

Emits: none.

Slots:
- subtitle — rendered directly under the title, above the description.
- actions — rendered after the description, e.g. for buttons.
- avatar — when present, switches the header to a side-by-side layout with the avatar next to the title/description/actions block, stacking to centered-column on narrow viewports.

Behavior: the layout only changes shape when the avatar slot is used — with no avatar slot, everything renders as a single stacked column.

IMPORTANT: use I9kPageHeader once per page, at the top — it renders a display-scale title (clamp up to 4rem) meant for the page's main heading, not for section headings (use I9kSectionHeading for those).

Usage:
<I9kPageHeader title="Practical AI from someone who ships." description="Practical talks for builders and technology teams, grounded in real product work."><template #actions><I9kButton variant="primary">Book a session</I9kButton></template></I9kPageHeader>`,
  gotchas: [
    'Reserve I9kPageHeader for the single main heading at the top of a page — use I9kSectionHeading for headings inside the page body.',
    'The side-by-side avatar layout only activates when the `avatar` slot is filled; otherwise the header always stacks in one column.',
  ],
  demos: [
    {
      label: 'Default',
      code: `<I9kPageHeader title="Practical AI from someone who ships." description="Practical talks for builders and technology teams, grounded in real product work." />`,
    },
    {
      label: 'With avatar and actions',
      code: `<I9kPageHeader title="Abdelrahman Ismail" description="Software engineer sharing how AI is changing the way software gets built.">
  <template #avatar>
    <img alt="" src="https://avatars.githubusercontent.com/u/20756985?s=160&v=4" width="112" height="112" style="border-radius: 50%" />
  </template>
  <template #actions>
    <div class="cluster"><I9kButton variant="primary">Invite Ismail</I9kButton></div>
  </template>
</I9kPageHeader>`,
    },
  ],
};
