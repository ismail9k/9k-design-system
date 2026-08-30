import type { ShowcaseEntry } from './types';

export const I9kFaqListEntry: ShowcaseEntry = {
  name: 'I9kFaqList',
  section: 'content',
  summary:
    'List of collapsible question/answer pairs built on native <details>/<summary>. Use it for an FAQ section without wiring any open/close state yourself.',
  agentPrompt: `Use I9kFaqList from @9klabs/design to render a list of collapsible FAQ entries.

import { I9kFaqList } from '@9klabs/design';
// Item shape: { question: string; answer: string }
// This type (I9kFaqItem) is not exported from the package; inline the object shape or declare
// your own local type.

Props:
- items: I9kFaqItem[] (required) — each item renders as a native <details>/<summary> pair; each item's \`question\` is used as its Vue :key, so keep questions unique within one list.

Emits: none.

Slots: none — question and answer are plain text per item, not slots.

Behavior: open/close state is native browser <details> behavior — no Vue state is involved, and each item opens/closes independently with no "only one open at a time" accordion behavior.

IMPORTANT: both \`question\` and \`answer\` render as plain text — there is no way to pass markup or links into an item; keep answers to plain sentences.

Usage:
<I9kFaqList :items="[{ question: 'Is this library tree-shakeable?', answer: 'Yes — each component is a separate export, so unused ones are dropped at build time.' }]" />`,
  gotchas: [
    "Each item's `question` string is used as its list key — keep questions unique within a single `items` array.",
    'question and answer are plain text only; there is no slot for markup or links inside an item.',
    'Items expand independently via native <details> — opening one never closes another.',
  ],
  demos: [
    {
      label: 'Default',
      code: `<I9kFaqList :items="[
  { question: 'Is this library tree-shakeable?', answer: 'Yes — each component is a separate export, so unused ones are dropped at build time.' },
  { question: 'Does it support right-to-left layouts?', answer: 'Yes, every component is checked in both LTR and RTL, and logical CSS properties are used throughout.' },
  { question: 'Can I use it outside a Vue Router app?', answer: 'Yes — components that render links accept a plain href by default and only need a router component when you pass one explicitly.' },
]" />`,
    },
  ],
};
