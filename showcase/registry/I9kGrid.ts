import type { ShowcaseEntry } from './types';

export const I9kGridEntry: ShowcaseEntry = {
  name: 'I9kGrid',
  section: 'layout',
  summary:
    'CSS grid layout wrapper with a fixed 1/2/3-column or auto-filling track and a size-driven gap. Collapses to one column on narrow viewports.',
  agentPrompt: `Use I9kGrid from @9klabs/design to lay out a set of cards or panels in a responsive grid.

import { I9kGrid } from '@9klabs/design';

Props:
- as?: string | Component (default 'div') — the rendered root tag or component.
- columns?: 1 | 2 | 3 | 'auto' (default 1)
- size?: 'sm' | 'md' | 'lg' (default 'md') — sets the gap between tracks only; it does not affect column count or track width.

Emits: none.

Slots: default — the grid items. Each direct child occupies one cell; wrap items yourself (e.g. in I9kPanel) if they need their own padding or surface.

Column behavior: \`columns={1|2|3}\` renders that many equal-width tracks (\`repeat(n, minmax(0, 1fr))\`). \`columns="auto"\` renders \`repeat(auto-fill, minmax(280px, 1fr))\` — as many equal tracks as fit at a 280px minimum, wrapping to new rows as the container narrows, with no JS breakpoint logic involved. Below a 768px viewport, every multi-column value (2, 3, and 'auto') collapses to a single column; \`columns={1}\` is already one column and is unaffected.

IMPORTANT: \`size\` only changes the gap (sm/md/lg spacing tokens) — pick the column count with \`columns\`, not \`size\`.

Usage:
<I9kGrid :columns="3" size="md"><I9kPanel>One</I9kPanel><I9kPanel>Two</I9kPanel><I9kPanel>Three</I9kPanel></I9kGrid>`,
  gotchas: [
    '`size` sets the gap only — it has no effect on column count or track width, so pick columns via `columns`.',
    '`columns="auto"` fills as many 280px-minimum tracks as fit; it is not the same as a fixed column count.',
    'Every multi-column value (2, 3, auto) collapses to a single column at viewports under 768px.',
  ],
  demos: [
    {
      label: 'Columns',
      code: `<I9kGrid :columns="2"><I9kPanel size="sm">Two</I9kPanel><I9kPanel size="sm">columns</I9kPanel></I9kGrid>
<I9kGrid :columns="3"><I9kPanel size="sm">Three</I9kPanel><I9kPanel size="sm">equal</I9kPanel><I9kPanel size="sm">columns</I9kPanel></I9kGrid>
<I9kGrid columns="auto"><I9kPanel size="sm">Auto</I9kPanel><I9kPanel size="sm">fill</I9kPanel></I9kGrid>`,
    },
    {
      label: 'Sizes',
      code: `<I9kGrid :columns="2" size="sm"><I9kPanel size="sm">Small</I9kPanel><I9kPanel size="sm">gap</I9kPanel></I9kGrid>
<I9kGrid :columns="2" size="lg"><I9kPanel size="sm">Large</I9kPanel><I9kPanel size="sm">gap</I9kPanel></I9kGrid>`,
    },
  ],
};
