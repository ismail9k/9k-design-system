import type { Component } from 'vue';

import type { ExtractedEmit, ExtractedProp } from '../extract/types';

export type SectionId =
  | 'install'
  | 'tokens'
  | 'layout'
  | 'content'
  | 'forms'
  | 'actions'
  | 'feedback'
  | 'chrome'
  | 'rules';

export interface ShowcaseDemo {
  label: string;
  /** Source shown to the reader and copied by the copy button. */
  code: string;
  /** Rendered live. Omit for a code-only demo. */
  render?: Component;
}

export interface ShowcaseEntry {
  /** Must match an export from src/index.ts. */
  name: string;
  section: SectionId;
  summary: string;
  /** Self-contained instruction; an agent pasting this needs no other context. */
  agentPrompt: string;
  /** Non-obvious constraints. May be empty. */
  gotchas: string[];
  demos: ShowcaseDemo[];
}

export interface ShowcaseComponent extends ShowcaseEntry {
  props: ExtractedProp[];
  emits: ExtractedEmit[];
  slots: string[];
  referencedTypes: Record<string, string>;
}
