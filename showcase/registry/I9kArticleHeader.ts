import type { ShowcaseEntry } from './types';

export const I9kArticleHeaderEntry: ShowcaseEntry = {
  name: 'I9kArticleHeader',
  section: 'content',
  summary:
    'Wide banner image for the top of an article, with a generated watermark fallback when there is no image. Use it once, at the top of an article body.',
  agentPrompt: `Use I9kArticleHeader from @9klabs/design at the top of an article for a banner image or a branded fallback.

import { I9kArticleHeader } from '@9klabs/design';

Props:
- title: string (required) — used to build the image's alt text when \`imageAlt\` is not given; not rendered as visible text.
- imageSrc?: string | null (default null)
- imageAlt?: string (default '')
- watermark?: string (default '9k') — short text shown in the gradient fallback when there is no imageSrc.
- eager?: boolean (default false) — when true, loads the image eagerly with high fetchpriority instead of lazily; use only for an above-the-fold hero image.

Emits: none.

Slots: none.

Behavior: with \`imageSrc\` set, renders a 2:1 <figure><img></figure> capped at 420px tall, object-fit cover. With no \`imageSrc\`, renders an aria-hidden gradient panel showing \`#{{ watermark }}\` instead — a decorative placeholder, not a loading state.

IMPORTANT: \`title\` is not rendered as visible text anywhere — it only feeds the image's default alt text, so still write a real, separate heading (e.g. I9kPageHeader) for the article's visible title.

Usage:
<I9kArticleHeader title="Are AI coding tools ready to replace programmers?" image-src="https://i.ytimg.com/vi/NfRC9Lj4-rU/hqdefault.jpg" eager />`,
  gotchas: [
    '`title` only supplies the fallback alt text for the image — it is never rendered as visible text, so pair this with a real heading elsewhere on the page.',
    'With no `imageSrc`, the component renders a decorative gradient watermark, not a loading or empty state — it never fetches anything.',
    'Set `eager` only for an above-the-fold header; the default is lazy loading with normal fetch priority.',
  ],
  demos: [
    {
      label: 'With image',
      code: `<I9kArticleHeader title="Are AI coding tools ready to replace programmers?" image-src="https://i.ytimg.com/vi/NfRC9Lj4-rU/hqdefault.jpg" eager />`,
    },
    {
      label: 'Fallback watermark',
      code: `<I9kArticleHeader title="Shipping with agents" watermark="9k" />`,
    },
  ],
};
