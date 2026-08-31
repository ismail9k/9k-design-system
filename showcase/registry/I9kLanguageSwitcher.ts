import type { ShowcaseEntry } from './types';

export const I9kLanguageSwitcherEntry: ShowcaseEntry = {
  name: 'I9kLanguageSwitcher',
  section: 'chrome',
  summary:
    "A styled link to an alternate-language version of the current page. It is only the link's markup — it does not itself switch the page's language or navigate via JS.",
  agentPrompt: `Use I9kLanguageSwitcher from @9klabs/design for a link to an alternate-language version of the current page.

import { I9kLanguageSwitcher } from '@9klabs/design';

Props:
- label: string (required) — fallback text shown only when no default slot content is given.
- href: string (required) — the destination URL, typically the same page in the other language.
- hreflang?: string | null (default null) — sets the anchor's \`hreflang\` attribute, e.g. 'ar'.
- linkComponent?: string | object | null (default null) — a component to render instead of \`<a>\`, receiving \`to\` set to \`href\`, e.g. a router link component.

Emits: none. Slots: default — replaces the visible text entirely; falls back to \`{{ label }}\` when empty.

IMPORTANT: \`label\` is required by its type but is only ever rendered as the default slot's fallback content — if you pass default slot content (e.g. a flag emoji plus text), \`label\` is never displayed. It is still required, so pass a plain-text equivalent even when you also supply slot content.

IMPORTANT: this component does not change \`document.documentElement.lang\`/\`dir\`, and does not navigate via JavaScript — it renders a plain \`<a href>\` (or your \`linkComponent\`). Actually switching the visitor's language happens through normal navigation to \`href\`, or through your own routing logic if you pass \`linkComponent\`.

Usage:
<I9kLanguageSwitcher label="العربية" href="/ar" hreflang="ar" />`,
  gotchas: [
    'It never touches `document.documentElement.lang` or `dir`, and does not navigate via JavaScript — it is a plain link; the language actually changes only when the browser follows `href` (or your `linkComponent` routing does).',
    "`label` is required but renders only as the default slot's fallback text — passing slot content hides `label` entirely, though you must still supply it for the type.",
  ],
  demos: [
    {
      label: 'Default (fallback text)',
      code: `<div style="position: relative; padding: var(--spacing-8); border: 1px solid var(--border-color); border-radius: var(--radius-md);">
  <I9kLanguageSwitcher label="العربية" href="/ar" hreflang="ar" />
</div>`,
    },
    {
      label: 'Custom content (default slot)',
      code: `<div style="position: relative; padding: var(--spacing-8); border: 1px solid var(--border-color); border-radius: var(--radius-md);">
  <I9kLanguageSwitcher label="Arabic" href="/ar" hreflang="ar">🇸🇦 العربية</I9kLanguageSwitcher>
</div>`,
    },
  ],
};
