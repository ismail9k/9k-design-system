import type { ShowcaseEntry } from './types';

export const I9kAsciiEmojiEntry: ShowcaseEntry = {
  name: 'I9kAsciiEmoji',
  section: 'content',
  summary:
    'Small text-based emoticon (e.g. "^_^") rendered in a monospace face, for a lighter-touch alternative to emoji or icon glyphs.',
  agentPrompt: `Use I9kAsciiEmoji from @ismail9k/9k-design-system for a small ASCII-art emoticon.

import { I9kAsciiEmoji } from '@ismail9k/9k-design-system';

Props:
- name: keyof typeof labels (required) — one of the seven built-in emoticon strings: '^_^', '·ᴗ·', '◡̈', '>‿<', 'x_x', 'o_o', '-_-'. This is a closed set; there is no way to render a custom emoticon string.
- label?: string | null (default null) — overrides the automatic aria-label; when omitted, a matching label is used ('^_^' → "happy", '·ᴗ·' → "gentle smile", '◡̈' → "smiling", '>‿<' → "joyful", 'x_x' → "exhausted", 'o_o' → "surprised", '-_-' → "unimpressed").
- size?: 'sm' | 'md' | 'lg' (default 'md')
- color?: 'primary' | 'accent' | 'muted' | 'current' (default 'primary')

Emits: none.

Slots: none — the emoticon text comes only from \`name\`.

Behavior: always renders with role="img" and an aria-label (from \`label\` or the built-in mapping) — never aria-hidden, since the ASCII characters alone are not meaningful to a screen reader.

IMPORTANT: \`name\` only accepts the seven exact emoticon strings above — passing any other string is a type error and has no matching entry in the internal label map.

Usage:
<I9kAsciiEmoji name="^_^" size="lg" color="accent" />`,
  gotchas: [
    '`name` only accepts the seven built-in emoticon strings — there is no way to render an arbitrary custom emoticon.',
    'Always exposed to assistive tech via role="img" and an aria-label — pass `label` to override the automatic one if the default wording does not fit the context.',
  ],
  demos: [
    {
      label: 'Expression set',
      code: `<div class="cluster">
  <I9kAsciiEmoji name="^_^" size="lg" />
  <I9kAsciiEmoji name="·ᴗ·" size="lg" color="accent" />
  <I9kAsciiEmoji name="◡̈" size="lg" />
  <I9kAsciiEmoji name=">‿<" size="lg" color="muted" />
  <I9kAsciiEmoji name="x_x" size="lg" />
</div>`,
    },
    {
      label: 'Sizes',
      code: `<div style="display: inline-flex; align-items: center; gap: var(--component-gap-md)">
  <I9kAsciiEmoji name="^_^" size="sm" />
  <I9kAsciiEmoji name="^_^" size="md" />
  <I9kAsciiEmoji name="^_^" size="lg" />
</div>`,
    },
  ],
};
