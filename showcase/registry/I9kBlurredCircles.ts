import type { ShowcaseEntry } from './types';

export const I9kBlurredCirclesEntry: ShowcaseEntry = {
  name: 'I9kBlurredCircles',
  section: 'chrome',
  summary:
    'Decorative, non-interactive layer of four slow-drifting blurred circles, meant as an ambient page background sitting behind real content.',
  agentPrompt: `Use I9kBlurredCircles from @ismail9k/9k-design-system as a decorative ambient background layer, mounted once near the root of a page, behind your real content.

import { I9kBlurredCircles } from '@ismail9k/9k-design-system';

Props: none. Emits: none. Slots: none — it renders its own fixed set of four circles and nothing else.

Behavior: it renders \`position: fixed; inset: 0; pointer-events: none;\` with \`aria-hidden="true"\` — by default it covers the ENTIRE VIEWPORT, not just its parent element, sits behind content only because of normal DOM/stacking order (it has no \`z-index\`), and never intercepts clicks. The four circles drift slowly via CSS animation, which is disabled under \`prefers-reduced-motion\`.

IMPORTANT: because it is \`position: fixed\`, mounting it anywhere covers the whole browser viewport by default — it does NOT stay confined to a parent container just because that parent is sized or positioned. To scope it to one section instead of the whole page, wrap it in an ancestor that establishes a new containing block for fixed-position descendants, e.g. one with \`transform: translateZ(0)\` (or any non-none \`transform\`/\`filter\`/\`contain: paint\`) plus \`overflow: hidden\` to clip it to that ancestor's bounds.

IMPORTANT: mount it once per page (typically as the first child inside your root layout), not once per section — several instances stack multiple full-viewport layers on top of each other.

Usage:
<body>
  <I9kBlurredCircles />
  <!-- rest of the page, stacked above it by DOM order -->
</body>`,
  gotchas: [
    'It is `position: fixed` and covers the entire browser viewport by default, regardless of where in the DOM it is mounted or how its parent is sized.',
    'To confine it to one container (as in this demo) instead of the whole page, give an ancestor `transform`/`filter`/`contain: paint` (any of these creates a new containing block for `position: fixed` descendants) plus `overflow: hidden`.',
    'It has no `z-index` of its own — it stays behind your content only via DOM order (mount it before your other content) or your own stacking context.',
  ],
  demos: [
    {
      label: 'Confined to a container (transform + overflow: hidden contain the fixed layer)',
      code: `<div
  style="position: relative; height: 220px; overflow: hidden; border: 1px solid var(--border-color); border-radius: var(--radius-md); transform: translateZ(0);"
>
  <I9kBlurredCircles />
  <p style="position: relative; z-index: 1; margin: 0; padding: var(--spacing-8); color: var(--theme-text-color);">
    Real page content stacks above this ambient background layer.
  </p>
</div>`,
    },
  ],
};
