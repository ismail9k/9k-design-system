import type { ShowcaseEntry } from './types';

export const I9kThemeSwitcherEntry: ShowcaseEntry = {
  name: 'I9kThemeSwitcher',
  section: 'chrome',
  summary:
    "Controlled light/dark icon button. It renders and emits the toggle only — applying the theme to the page is entirely the caller's job.",
  agentPrompt: `Use I9kThemeSwitcher from @9klabs/design as the visual control for a light/dark theme toggle.

import { I9kThemeSwitcher } from '@9klabs/design';

Props:
- modelValue?: boolean (default false) — true means dark mode is active; the switch is fully controlled by this prop, it holds no state of its own.
- lightLabel?: string (default 'Switch to light mode') — the accessible label used while \`modelValue\` is true (i.e. the action the next click performs).
- darkLabel?: string (default 'Switch to dark mode') — the accessible label used while \`modelValue\` is false.

Emits: update:modelValue — [value: boolean], fired on click with the flipped value. Use \`v-model\` to wire it up.

Slots: none.

IMPORTANT: this component does NOT touch \`document.documentElement\` or any global theme state itself — it only renders a button and emits the new value. You are responsible for reacting to \`update:modelValue\` (or a \`v-model\` watcher) to actually apply the theme, e.g. \`document.documentElement.classList.toggle('dark', isDark)\`, and for persisting the choice if needed.

Usage:
<I9kThemeSwitcher v-model="isDark" @update:model-value="applyTheme" />`,
  gotchas: [
    'It is a controlled component with no side effects of its own — it never touches `document.documentElement` or any global theme state; you must apply the theme yourself in response to `update:modelValue`.',
    '`modelValue` is the single source of truth for which glyph and label are shown — there is no internal toggle state, so it will not visually flip unless you update `modelValue` from the emitted event.',
    'The glyph names the theme the button switches TO, not the one that is active: a moon while the page is light, a sun while it is dark. This matches `darkLabel`/`lightLabel`, so keep those labels phrased as actions.',
    'It renders a square icon button sized to `--control-height-sm`, matching `I9kLanguageSwitcher` in its icon form so the two sit together in a header.',
  ],
  demos: [
    {
      label: "Controlled toggle (local state only — does not change this page's theme)",
      code: `<div style="position: relative; padding: var(--spacing-8); border: 1px solid var(--border-color); border-radius: var(--radius-md);">
  <I9kThemeSwitcher v-model="isDark" />
</div>`,
      state: { isDark: false },
    },
  ],
};
