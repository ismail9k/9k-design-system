import type { ShowcaseEntry } from './types';

export const I9kBrandWordmarkEntry: ShowcaseEntry = {
  name: 'I9kBrandWordmark',
  section: 'chrome',
  summary:
    'Decorative, self-animating logotype that types itself out and swaps between a full and short form — purely visual, and carries no accessible name of its own.',
  agentPrompt: `Use I9kBrandWordmark from @9klabs/design for a site's animated logotype, typically inside I9kNavigation's \`brand\` slot bound to that slot's \`compact\` prop.

import { I9kBrandWordmark } from '@9klabs/design';

Props (this is the one component in the package using the runtime \`defineProps({...})\` form rather than the type-generic form, but the resolved props are the same shape):
- compact?: boolean (default false) — when true, the wordmark types itself down to \`short\`; when false, it types back up to \`full\`.
- full?: string (default 'Ismail9k') — the expanded text.
- short?: string (default '9k') — the condensed text.

Emits: none. Slots: none.

IMPORTANT: the whole component renders with \`aria-hidden="true"\` — it has no accessible name of its own. Wrap it in an element that supplies one, e.g. an \`<a aria-label="Ismail9k, back to homepage">\`, rather than relying on the wordmark's visible text to be read by assistive tech.

IMPORTANT: do not try to demo or screenshot the animation — it is driven entirely internally. Changing \`compact\` retypes the text via a timed animation; separately, on an internal 15–35 second random timer, a compact, resting wordmark occasionally "winks" into a random face (e.g. '^_^') for two seconds before typing back to \`short\`. There is no prop or event to trigger, control, or observe the wink — it is purely ambient and non-deterministic, and (like the retype) is skipped entirely when the user has \`prefers-reduced-motion\` set.

Usage:
<a href="/" aria-label="Ismail9k, back to homepage">
  <I9kBrandWordmark :compact="isScrolledPastHeader" />
</a>`,
  gotchas: [
    'It renders `aria-hidden="true"` on its root — always wrap it in an element that supplies a real accessible name (e.g. an `<a aria-label="...">`), it is purely decorative on its own.',
    'It animates on an internal 15–35 second random timer (an idle "wink"), and retypes between `full`/`short` when `compact` changes — there is no prop or event to trigger this manually, so do not build a demo or test that waits for it to visibly happen.',
    'Both the retype-on-`compact`-change animation and the idle wink are skipped when the visitor has `prefers-reduced-motion` set; the text just settles directly to its target.',
  ],
  demos: [
    {
      label: 'Full and compact forms',
      code: `<div style="position: relative; display: flex; align-items: center; gap: 2rem; padding: var(--spacing-8); border: 1px solid var(--border-color); border-radius: var(--radius-md);">
  <I9kBrandWordmark />
  <I9kBrandWordmark compact />
</div>`,
    },
    {
      label: 'Custom text pair',
      code: `<div style="position: relative; padding: var(--spacing-8); border: 1px solid var(--border-color); border-radius: var(--radius-md);">
  <I9kBrandWordmark full="9kschool" short="9k" compact />
</div>`,
    },
  ],
};
