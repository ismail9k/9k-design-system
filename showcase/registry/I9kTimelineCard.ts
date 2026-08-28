import type { ShowcaseEntry } from './types';

export const I9kTimelineCardEntry: ShowcaseEntry = {
  name: 'I9kTimelineCard',
  section: 'content',
  summary:
    'Dated entry in a vertical timeline/rail, with a title, body, and optional thumbnail. Use it for a chronological list of talks, posts, or events.',
  agentPrompt: `Use I9kTimelineCard from @ismail9k/9k-design-system for one entry in a vertical, dated timeline. Stack multiple instances to build the full timeline — the rail connects visually between adjacent cards via CSS, with no wrapping list component required.

import { I9kTimelineCard } from '@ismail9k/9k-design-system';

Props:
- date: string | Date (required) — an ISO date string ('2026-01-25') or a Date object; formatted with Intl.DateTimeFormat as a long date (e.g. "January 25, 2026") in UTC, so a date-only string never shifts to the previous/next day from timezone drift.
- linked?: boolean (default false) — when true, styles the whole card as hoverable/clickable and stretches the title's <a> to fill the card (via a CSS ::after overlay); requires the title slot to contain a real <a>.
- locale?: string (default 'en') — passed to Intl.DateTimeFormat, e.g. 'ar' for Arabic date formatting.
- size?: 'sm' | 'md' | 'lg' (default 'md')

Emits: none.

Slots:
- title — the entry heading; wrap it in an <a> when using \`linked\`.
- default — the entry body content.
- thumbnail — an image shown beside the body (hidden under 600px viewport width).

IMPORTANT: \`linked\` only changes hover styling and stretches an <a> found inside the \`title\` slot to cover the card — put a real <a> in \`title\` yourself, the component does not create one for you.

Usage:
<I9kTimelineCard date="2026-01-25" linked><template #title><a href="#">Are AI coding tools ready to replace programmers?</a></template><p>A practical discussion of what today's tools can do and what still needs engineering judgement.</p></I9kTimelineCard>`,
  gotchas: [
    '`linked` only adds hover styling and a full-card click target over an `<a>` inside the `title` slot — you must put that `<a>` there yourself.',
    'Dates are formatted in UTC, so a plain date string like "2026-01-25" always shows as that calendar day regardless of the viewer\'s timezone.',
    'The `thumbnail` slot is hidden entirely below a 600px viewport — do not rely on it for content that has no alternative in `default`.',
  ],
  demos: [
    {
      label: 'Linked with thumbnail',
      code: `<I9kTimelineCard date="2026-01-25" linked>
  <template #title><a href="#">Are AI coding tools ready to replace programmers?</a></template>
  <p>A practical discussion of what today's tools can do and what still needs engineering judgement.</p>
  <template #thumbnail>
    <img src="https://i.ytimg.com/vi/NfRC9Lj4-rU/hqdefault.jpg" alt="" width="160" height="100" />
  </template>
</I9kTimelineCard>`,
    },
    {
      label: 'Sizes',
      code: `<I9kTimelineCard date="2026-01-25" size="sm"><template #title>Small timeline card</template>Compact summary.</I9kTimelineCard>
<I9kTimelineCard date="2026-01-25" size="md"><template #title>Medium timeline card</template>Default summary.</I9kTimelineCard>
<I9kTimelineCard date="2026-01-25" size="lg"><template #title>Large timeline card</template>Prominent summary.</I9kTimelineCard>`,
    },
  ],
};
