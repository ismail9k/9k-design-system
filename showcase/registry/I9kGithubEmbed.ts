import type { ShowcaseEntry } from './types';

export const I9kGithubEmbedEntry: ShowcaseEntry = {
  name: 'I9kGithubEmbed',
  section: 'content',
  summary:
    'Compact card linking to a GitHub repository by "owner/repo" name. Use it to reference a specific repo inline in content, e.g. a blog post or project list.',
  agentPrompt: `Use I9kGithubEmbed from @9klabs/design to link to a GitHub repository.

import { I9kGithubEmbed } from '@9klabs/design';

Props:
- repo: string (required) — an "owner/repo" string, e.g. 'ismail9k/vue3-carousel'. The component builds the link as \`https://github.com/\${repo}\` and does not validate the format.

Emits: none.

Slots: none.

Behavior: this is a static link card — it makes no network request and fetches no repository data (stars, description, etc.) from GitHub; it only renders the GitHub icon and the \`repo\` text as a link.

IMPORTANT: pass the full "owner/repo" string, not just the repo name — the component does not prepend an owner, so 'vue3-carousel' alone produces a broken link (github.com/vue3-carousel) instead of 'ismail9k/vue3-carousel'.

Usage:
<I9kGithubEmbed repo="ismail9k/vue3-carousel" />`,
  gotchas: [
    'This is a static link, not a live embed — it never fetches stars, description, or any other data from GitHub.',
    'Pass the full "owner/repo" string; the component does not validate or prepend an owner, so a bare repo name produces a broken link.',
  ],
  demos: [
    {
      label: 'Default',
      code: `<I9kGithubEmbed repo="ismail9k/vue3-carousel" />`,
    },
  ],
};
