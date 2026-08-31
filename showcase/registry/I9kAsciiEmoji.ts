import type { ShowcaseEntry } from './types';

export const I9kAsciiEmojiEntry: ShowcaseEntry = {
  name: 'I9kAsciiEmoji',
  section: 'content',
  summary:
    'Small text-based emoticon (e.g. "^_^") rendered in a monospace face, for a lighter-touch alternative to emoji or icon glyphs.',
  agentPrompt: `Use I9kAsciiEmoji from @9klabs/design for a small ASCII-art emoticon.

import { I9kAsciiEmoji } from '@9klabs/design';

Props:
- name: keyof typeof labels (required) — the internal label map is typed as \`Record<string, string>\`, so this declared type widens to plain \`string\` at compile time; TypeScript accepts any string here, not just the seven below. The seven strings with a built-in label are '^_^', '·ᴗ·', '◡̈', '>‿<', 'x_x', 'o_o', '-_-'.
- label?: string | null (default null) — overrides the automatic aria-label; when omitted, a matching label is used for the seven known strings ('^_^' → "happy", '·ᴗ·' → "gentle smile", '◡̈' → "smiling", '>‿<' → "joyful", 'x_x' → "exhausted", 'o_o' → "surprised", '-_-' → "unimpressed").
- size?: 'sm' | 'md' | 'lg' (default 'md')
- color?: 'primary' | 'accent' | 'muted' | 'current' (default 'primary')

Emits: none.

Slots: none — the emoticon text comes only from \`name\`.

Behavior: always renders role="img". An aria-label is present when \`label\` is passed, or when \`name\` is one of the seven known strings; otherwise no aria-label is rendered at all.

IMPORTANT: pass one of the seven known strings, or pass \`label\` explicitly. TypeScript does not restrict \`name\` to a closed set — any string compiles — but an unrecognized \`name\` has no entry in the internal label map, so the element ends up with role="img" and no aria-label, breaking the accessibility contract this component exists to provide.

Usage:
<I9kAsciiEmoji name="^_^" size="lg" color="accent" />`,
  gotchas: [
    'TypeScript does not enforce a closed set for `name`: the label map is typed as `Record<string, string>`, so `keyof typeof labels` widens to plain `string` and any value compiles.',
    'Passing a `name` outside the seven known strings without also passing `label` renders `role="img"` with no `aria-label` at all — always pass `label` explicitly for anything but the seven known strings.',
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
