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
  /** Shown to the reader AND compiled to produce the live render — they cannot drift. */
  code: string;
  /** Reactive scope for the compiled code, for demos using v-model or bound expressions. */
  state?: Record<string, unknown>;
  /** Escape hatch for a demo the template compiler cannot express. Prefer `code`. */
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
