import type { ShowcaseEntry } from './types';

export const I9kButtonEntry: ShowcaseEntry = {
  name: 'I9kButton',
  section: 'actions',
  summary:
    'Polymorphic action trigger: renders a native button by default, an anchor when given a destination, or a caller-supplied component. Six variants cover primary actions, filters, and pagination.',
  agentPrompt: `Use I9kButton from @ismail9k/9k-design-system for any clickable action or link styled as a button.

import { I9kButton } from '@ismail9k/9k-design-system';

Props:
- to?: string | Record<string, unknown> | null (default null) — a route-like destination. Setting this makes the root render as \`<a>\` (or \`linkComponent\` if given).
- href?: string | null (default null) — a plain URL. Setting this also makes the root render as \`<a>\`.
- variant?: 'default' | 'primary' | 'link' | 'filter' | 'pagination' | 'page' (default 'default')
- size?: 'sm' | 'md' | 'lg' (default 'md')
- active?: boolean (default false) — toggles the selected look; used by 'filter' and 'page' variants.
- type?: 'button' | 'submit' | 'reset' (default 'button') — only applies when the root renders as a native <button>; it is dropped when \`to\` or \`href\` is set.
- linkComponent?: string | object | null (default null) — a component to render instead of \`<a>\` when \`to\` is set, e.g. a router link component.

Emits: none. It forwards native events (click, etc.) as ordinary DOM listeners via \`v-bind\`/attribute fallthrough.

Slots: default — the button's content.

Root element rule: with no \`to\`/\`href\`/\`linkComponent\`, I9kButton renders \`<button>\`. Passing \`to\` or \`href\` switches it to \`<a>\`. Passing \`linkComponent\` renders that component instead, and it receives \`to\` — use this in a Vue Router app by setting \`link-component="RouterLink"\` so internal navigation goes through the router instead of a full page load.

IMPORTANT: \`type\` only takes effect on the native \`<button>\` form. If \`to\` or \`href\` is set, \`type\` is not rendered — do not rely on it to distinguish submit buttons that are also links.

Usage:
<I9kButton variant="primary" @click="onSave">Save</I9kButton>
<I9kButton to="/pricing" link-component="RouterLink">See pricing</I9kButton>`,
  gotchas: [
    'The root element depends on props, not a separate mode flag: pass `to` or `href` for a link, omit both for a native button.',
    '`type` is only meaningful on the button form — it is not rendered when the component resolves to `<a>` or a `linkComponent`.',
    'In a Vue Router app, pass `link-component="RouterLink"` alongside `to` so navigation uses the router instead of a full page reload.',
  ],
  demos: [
    {
      label: 'Variants',
      code: `<I9kButton>Default</I9kButton>
<I9kButton variant="primary">Primary</I9kButton>
<I9kButton variant="link">Link</I9kButton>
<I9kButton variant="filter" active>Selected filter</I9kButton>
<I9kButton variant="pagination">Next</I9kButton>
<I9kButton variant="page" active>1</I9kButton>`,
    },
    {
      label: 'As a link',
      code: `<I9kButton href="https://example.com" variant="primary">Visit site</I9kButton>
<I9kButton to="/pricing" link-component="RouterLink">See pricing</I9kButton>`,
    },
  ],
};
