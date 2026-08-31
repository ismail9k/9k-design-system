import type { ShowcaseEntry } from './types';

export const I9kProfileCardEntry: ShowcaseEntry = {
  name: 'I9kProfileCard',
  section: 'content',
  summary:
    'Card pairing an avatar with a name, bio, and optional action links. Use it for an author byline, a team member card, or a speaker bio.',
  agentPrompt: `Use I9kProfileCard from @9klabs/design for a person's avatar, name, and bio.

import { I9kProfileCard } from '@9klabs/design';

Props:
- name: string (required)
- alias?: string | null (default null) — rendered after the name, separated by " · " (e.g. a handle).
- namePrefix?: string | null (default null) — rendered before the name (e.g. "Written by").
- avatarSrc?: string | null (default null)
- avatarAlt?: string (default '')
- size?: 'sm' | 'md' | 'lg' (default 'md')

Emits: none.

Slots:
- avatar — overrides the built-in <img> rendered from \`avatarSrc\`; use this for a custom avatar element.
- default — the bio content, rendered under the name.
- actions — a row of action links/buttons under the bio.

Behavior: the avatar column only renders at all when either the \`avatar\` slot is filled or \`avatarSrc\` is set — with neither, the card is name/bio/actions only, no empty avatar space.

IMPORTANT: \`namePrefix\` and \`alias\` are plain strings rendered inline around \`name\` in one paragraph — they cannot contain markup or links; put any linked text in the \`default\` or \`actions\` slot instead.

Usage:
<I9kProfileCard name="Abdelrahman Ismail" alias="Ismail9k" name-prefix="Written by" avatar-src="https://avatars.githubusercontent.com/u/20756985?s=120&v=4">Software engineer sharing how AI is changing the way software gets built.<template #actions><a href="#instagram">Instagram</a><a href="#github">GitHub</a></template></I9kProfileCard>`,
  gotchas: [
    'The avatar column renders only when `avatarSrc` is set or the `avatar` slot is filled — there is no empty placeholder avatar.',
    '`namePrefix` and `alias` are plain text rendered inline with `name` — they cannot hold markup or links.',
  ],
  demos: [
    {
      label: 'With actions',
      code: `<I9kProfileCard name="Abdelrahman Ismail" alias="Ismail9k" name-prefix="Written by" avatar-src="https://avatars.githubusercontent.com/u/20756985?s=120&v=4">
  Software engineer sharing how AI is changing the way software gets built.
  <template #actions>
    <a href="#instagram">Instagram</a>
    <a href="#github">GitHub</a>
  </template>
</I9kProfileCard>`,
    },
    {
      label: 'Sizes',
      code: `<div style="display: grid; gap: var(--component-gap-md)">
  <I9kProfileCard size="sm" name="Small profile">Compact biography.</I9kProfileCard>
  <I9kProfileCard size="md" name="Medium profile">Default biography.</I9kProfileCard>
  <I9kProfileCard size="lg" name="Large profile">Prominent biography.</I9kProfileCard>
</div>`,
    },
  ],
};
