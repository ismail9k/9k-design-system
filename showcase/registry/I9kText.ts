import type { ShowcaseEntry } from './types';

export const I9kTextEntry: ShowcaseEntry = {
  name: 'I9kText',
  section: 'content',
  summary:
    'Text primitive for body copy and intros. Use it for any paragraph-level content that should follow the design system type scale rather than reaching for a bare <p>.',
  agentPrompt: `Use I9kText from @9klabs/design for paragraph-level copy.

import { I9kText } from '@9klabs/design';

Props:
- as?: string | Component (default 'p') — the rendered root tag or component.
- size?: 'sm' | 'md' | 'lg' (default 'md')
- variant?: 'body' | 'lede' (default 'body')

Emits: none.

Slots: default — the text content.

Behavior: 'lede' sets a wider line height, a quieter color, and caps the measure at 62ch, for the introductory paragraph under a heading. 'body' is normal flowing copy with no measure cap.

IMPORTANT: 'lede' adds bottom margin and a max-width of 62ch — do not use it for short inline copy or content already inside a constrained container, or the extra spacing will look wrong.

Usage:
<I9kText variant="lede" size="lg">A practical text primitive for branded content.</I9kText>`,
  gotchas: [
    '`variant="lede"` caps the measure at 62ch and adds bottom margin — meant for intro paragraphs under a heading, not short or already-constrained copy.',
  ],
  demos: [
    {
      label: 'Variants',
      code: `<I9kText variant="body">Body text keeps normal content flow.</I9kText>
<I9kText variant="lede">Lede text introduces a page with a deliberate measure and quieter color.</I9kText>`,
    },
    {
      label: 'Sizes',
      code: `<I9kText size="sm">Small body text</I9kText>
<I9kText size="md">Medium body text</I9kText>
<I9kText size="lg">Large body text</I9kText>`,
    },
  ],
};
