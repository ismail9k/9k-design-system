import type { ColorTokens, ExtractedComponent } from '../../showcase/extract/types';

// Test-only stand-in for the `virtual:showcase-data` module that showcase/vite-plugin-data.ts
// generates at build/dev time by extracting props/emits/slots from every file under
// src/components/, plus the color tokens declared in src/styles/tokens.css. See vite.config.ts's
// `test.alias` for where this is wired in. Kept empty because tests/showcaseControls.test.ts also
// stubs `showcase/registry`'s `entries` to `[]`, so mergeRegistry never needs a match here.
export const extracted: ExtractedComponent[] = [];
export const colorTokens: ColorTokens = { brand: [], theme: [] };
