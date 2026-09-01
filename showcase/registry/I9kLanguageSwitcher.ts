import type { ShowcaseEntry } from './types';

export const I9kLanguageSwitcherEntry: ShowcaseEntry = {
  name: 'I9kLanguageSwitcher',
  section: 'chrome',
  summary:
    "A link to an alternate-language version of the current page, shown as a compact glyph-plus-locale-code button. It is only the link's markup — it does not itself switch the page's language or navigate via JS.",
  agentPrompt: `Use I9kLanguageSwitcher from @9klabs/design for a link to an alternate-language version of the current page.

import { I9kLanguageSwitcher } from '@9klabs/design';

Props:
- label: string (required) — the human-readable name of the target language, e.g. 'العربية'. With \`code\` set this becomes the link's \`aria-label\`; without \`code\` it is the visible fallback text.
- href: string (required) — the destination URL, typically the same page in the other language.
- code?: string | null (default null) — the target locale code, e.g. 'ar'. When set, the control renders a translate glyph plus the code uppercased ('AR'), and \`label\` moves to \`aria-label\`. Pass this for the compact header form.
- hreflang?: string | null (default null) — sets the anchor's \`hreflang\` attribute, e.g. 'ar'.
- linkComponent?: string | object | null (default null) — a component to render instead of \`<a>\`, receiving \`to\` set to \`href\`, e.g. a router link component.

Emits: none. Slots: default — replaces the visible content entirely; falls back to the glyph-plus-code (or \`{{ label }}\` when \`code\` is unset).

IMPORTANT: prefer passing \`code\` — 'AR'/'EN' beside the glyph keeps the control the same height as I9kThemeSwitcher so the two pair up in a header. Omitting \`code\` falls back to the older full-text pill form.

IMPORTANT: this component does not change \`document.documentElement.lang\`/\`dir\`, and does not navigate via JavaScript — it renders a plain \`<a href>\` (or your \`linkComponent\`). Actually switching the visitor's language happens through normal navigation to \`href\`, or through your own routing logic if you pass \`linkComponent\`.

Usage:
<I9kLanguageSwitcher label="العربية" code="ar" href="/ar" hreflang="ar" />`,
  gotchas: [
    'It never touches `document.documentElement.lang` or `dir`, and does not navigate via JavaScript — it is a plain link; the language actually changes only when the browser follows `href` (or your `linkComponent` routing does).',
    '`code` is uppercased for display, which is a no-op for non-latin scripts — pass `code="ar"` to get "AR", or `code="ع"` if you want the target language in its own script.',
    'Without `code` the control keeps its older full-text form, showing `label` inline. That fallback exists so consumers on an older build keep working; new callers should pass `code`.',
    '`label` is still required in both forms — with `code` it is the accessible name, without it the visible text. Default slot content replaces the visible content but never the `aria-label`.',
  ],
  demos: [
    {
      label: 'Compact form (glyph plus locale code)',
      code: `<div style="position: relative; padding: var(--spacing-8); border: 1px solid var(--border-color); border-radius: var(--radius-md);">
  <I9kLanguageSwitcher label="العربية" code="ar" href="/ar" hreflang="ar" />
</div>`,
    },
    {
      label: 'Paired with the theme switcher, as in a site header',
      code: `<div style="position: relative; display: flex; gap: var(--spacing-4); padding: var(--spacing-8); border: 1px solid var(--border-color); border-radius: var(--radius-md);">
  <I9kLanguageSwitcher label="العربية" code="ar" href="/ar" hreflang="ar" />
  <I9kThemeSwitcher v-model="isDark" />
</div>`,
      state: { isDark: false },
    },
    {
      label: 'Fallback text form (no code)',
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
