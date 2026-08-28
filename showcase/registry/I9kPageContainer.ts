import type { ShowcaseEntry } from './types';

export const I9kPageContainerEntry: ShowcaseEntry = {
  name: 'I9kPageContainer',
  section: 'layout',
  summary:
    'Centered, width-capped page wrapper with a size-driven horizontal gutter. Use it once per page as the outermost content wrapper.',
  agentPrompt: `Use I9kPageContainer from @ismail9k/9k-design-system as the outermost wrapper for a page's content.

import { I9kPageContainer } from '@ismail9k/9k-design-system';

Props:
- as?: string | Component (default 'div') — the rendered root tag or component.
- size?: 'sm' | 'md' | 'lg' (default 'md') — sets the inline gutter (padding-inline) only.

Emits: none.

Slots: default — the page content.

Behavior: renders a flex column, max 1000px wide, centered with \`margin-inline: auto\`, and a \`min-height: calc(100vh - 250px)\` so short pages still fill the viewport. Below a 768px viewport the width becomes 100% and the gutter is forced to the 'sm' spacing regardless of the \`size\` prop.

IMPORTANT: \`size\` only changes the horizontal gutter — it does not change the 1000px max width or add vertical spacing between children. Wrap groups of children yourself (e.g. in I9kCluster or a styled div) if they need gaps.

Usage:
<I9kPageContainer size="md"><I9kText variant="lede">Welcome</I9kText><I9kPanel size="sm">Page content</I9kPanel></I9kPageContainer>`,
  gotchas: [
    '`size` only sets the horizontal gutter (padding-inline) — the 1000px max width is fixed regardless of size.',
    'Below 768px viewports the gutter always drops to the `sm` spacing, overriding whatever `size` was passed.',
    'The container does not space its children vertically; group related content yourself.',
  ],
  demos: [
    {
      label: 'Default',
      code: `<I9kPageContainer style="min-height: 12rem; outline: 1px dashed var(--border-color)">
  <I9kText variant="lede">A centered 1000px page container with responsive gutters.</I9kText>
  <I9kPanel size="sm">Page content</I9kPanel>
</I9kPageContainer>`,
    },
    {
      label: 'Sizes',
      code: `<div style="display: grid; gap: var(--spacing-8)">
  <I9kPageContainer size="sm" style="min-height: 6rem; outline: 1px dashed var(--border-color)"><I9kPanel size="sm">Small gutter</I9kPanel></I9kPageContainer>
  <I9kPageContainer size="lg" style="min-height: 6rem; outline: 1px dashed var(--border-color)"><I9kPanel size="sm">Large gutter</I9kPanel></I9kPageContainer>
</div>`,
    },
  ],
};
