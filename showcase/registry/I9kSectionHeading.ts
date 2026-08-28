import type { ShowcaseEntry } from './types';

export const I9kSectionHeadingEntry: ShowcaseEntry = {
  name: 'I9kSectionHeading',
  section: 'content',
  summary:
    'Heading with an optional description for introducing a section of a page. Use it above any grouped block of content — a card grid, a list, a feature set.',
  agentPrompt: `Use I9kSectionHeading from @ismail9k/9k-design-system to introduce a page section.

import { I9kSectionHeading } from '@ismail9k/9k-design-system';

Props:
- title: string (required)
- description?: string | null (default null)
- id?: string | null (default null) — set on the rendered heading element, e.g. for an in-page anchor link.
- level?: 2 | 3 | 4 | 5 | 6 (default 2) — the rendered heading level (renders <h{level}>).

Emits: none.

Slots: none — title and description are text-only props, not slots.

IMPORTANT: pick \`level\` to match the surrounding document outline; the component does not infer nesting from context, and the default is h2.

Usage:
<I9kSectionHeading title="Speaking" description="Practical sessions grounded in building, shipping, and leading with AI." />`,
  gotchas: [
    'title and description are plain string props, not slots — there is no way to pass rich markup into the heading or description.',
    '`level` defaults to 2 and is not inferred from context; set it to match the surrounding document outline.',
  ],
  demos: [
    {
      label: 'Default',
      code: `<I9kSectionHeading title="Speaking" description="Practical sessions grounded in building, shipping, and leading with AI." />`,
    },
    {
      label: 'Title only, custom level',
      code: `<I9kSectionHeading title="Recent projects" :level="3" />`,
    },
  ],
};
