import type { ShowcaseEntry } from './types';

export const I9kIconButtonEntry: ShowcaseEntry = {
  name: 'I9kIconButton',
  section: 'actions',
  summary:
    'Circular icon-only action trigger: renders a native button by default, or an anchor/caller-supplied component when given a destination. Its own variant set is separate from I9kButton.',
  agentPrompt: `Use I9kIconButton from @ismail9k/9k-design-system for a compact, icon-only action (e.g. a toolbar button or a social/contact link) that needs no visible text label.

import { I9kIconButton } from '@ismail9k/9k-design-system';

Props:
- icon: I9kIconName (required) — a name from src/icons/paths.json, e.g. 'mail', 'home', 'menu'.
- label: string (required) — the accessible name, rendered as \`aria-label\`. There is no visible text, so this must be non-empty and descriptive; the component logs a dev warning if it is blank.
- to?: string | Record<string, unknown> | null (default null) — a route-like destination. Setting this makes the root render as \`<a>\` (or \`linkComponent\` if given).
- href?: string | null (default null) — a plain URL. Setting this also makes the root render as \`<a>\`.
- variant?: 'secondary' | 'primary' | 'ghost' (default 'secondary')
- size?: 'sm' | 'md' | 'lg' (default 'md') — also scales the inner icon.
- type?: 'button' | 'submit' | 'reset' (default 'button') — only applies when the root renders as a native <button>; dropped when \`to\` or \`href\` is set.
- linkComponent?: string | object | null (default null) — a component to render instead of \`<a>\` when \`to\` is set, e.g. a router link component.

Emits: none. It forwards native events (click, etc.) as ordinary DOM listeners via \`v-bind\`/attribute fallthrough.

Slots: none — content is always the icon; there is no default slot for text.

IMPORTANT: I9kIconButton has its OWN variant type, 'secondary' | 'primary' | 'ghost' — this is NOT the same union as I9kButton's variant ('default' | 'primary' | 'link' | 'filter' | 'pagination' | 'page'). Do not pass I9kButton variants like 'default' or 'filter' here; only 'secondary', 'primary', or 'ghost' are valid.

IMPORTANT: \`label\` is required and must be non-empty — it is the button's only accessible name since it renders no visible text.

Usage:
<I9kIconButton icon="mail" label="Email us" variant="primary" @click="onEmail" />
<I9kIconButton icon="github" label="View on GitHub" href="https://github.com/ismail9k" variant="ghost" />`,
  gotchas: [
    "I9kIconButton's variant union ('secondary' | 'primary' | 'ghost') is distinct from I9kButton's — never reuse I9kButton variants like 'default' or 'filter' here.",
    '`label` is required and must be non-empty: it is the sole accessible name since the button renders an icon only, no text.',
    'The root element depends on props, not a mode flag: pass `to` or `href` for a link, omit both for a native button, same convention as I9kButton.',
  ],
  demos: [
    {
      label: 'Variants',
      code: `<I9kIconButton icon="home" label="Home" />
<I9kIconButton icon="mail" label="Mail" variant="primary" />
<I9kIconButton icon="menu" label="Menu" variant="ghost" />`,
    },
    {
      label: 'Sizes',
      code: `<I9kIconButton icon="home" label="Small home" size="sm" />
<I9kIconButton icon="home" label="Medium home" size="md" />
<I9kIconButton icon="home" label="Large home" size="lg" />`,
    },
    {
      label: 'As a link',
      code: `<I9kIconButton icon="github" label="View on GitHub" href="https://github.com/ismail9k" variant="ghost" />`,
    },
  ],
};
