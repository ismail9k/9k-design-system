# Agent-Friendly Component Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single prerendered page in this repository that documents every component exported from `src/index.ts`, readable by both people and AI agents, with a copy-paste prompt per component, a `components.json` manifest, and an explicit rules section.

**Architecture:** A Vue app under `showcase/` renders one long page from a registry. Editorial content (summary, gotchas, demos, prompt) is hand-authored one file per component; props, defaults, emits, and slots are extracted from the SFC sources at build time by a TypeScript-compiler-API pass and handed to the app through a Vite virtual module. The same merged data produces the HTML page, `components.json`, and `llms.txt`. The page is server-rendered to static HTML at build time and hydrated on the client, so an agent fetching the URL gets the whole design system without executing JavaScript.

**Tech Stack:** Vue 3.5, Vite, `vue/compiler-sfc` (SFC parsing + template AST), the TypeScript compiler API (already a devDependency), `@vue/server-renderer` (already a devDependency), Vitest, Cloudflare Pages.

**Spec:** `docs/superpowers/specs/2026-08-27-agent-showcase-design.md`

## Global Constraints

- Nothing under `showcase/` is exported from the package. `package.json` `files` stays `["dist"]`, and the `build` script is not modified.
- The showcase imports components from `src/`, never from `dist/`.
- Prettier: `printWidth: 100`, `singleQuote: true`, `trailingComma: 'all'`. Run `npm run format` before committing broad edits.
- ESLint runs `vue/multi-word-component-names` as an error. **Every showcase `.vue` file must have a multi-word name** — hence the `Showcase*` prefix used throughout this plan.
- TypeScript is `strict` with `verbatimModuleSyntax: true`. Type-only imports must use `import type`.
- Vitest only collects `tests/**/*.test.ts`. All showcase tests go in `tests/`, not in `showcase/`.
- Component naming stays PascalCase with the `I9k` prefix for library components; showcase-internal components use the `Showcase` prefix.
- Conventional Commits, lowercase type: `feat`, `fix`, `chore`, `docs`, `test`.
- Do not modify any file under `src/`. This work is additive documentation; if a component looks wrong, note it, do not fix it here.

## File Structure

**Created:**

| Path | Responsibility |
|---|---|
| `showcase/extract/types.ts` | Shared types for extractor output |
| `showcase/extract/props.ts` | Parse one SFC → props, defaults, emits, slots, referenced types |
| `showcase/extract/aliases.ts` | Build the alias map from `src/types/*.ts` and resolve alias names |
| `showcase/registry/types.ts` | `ShowcaseEntry`, `SectionId`, `ShowcaseComponent` |
| `showcase/registry/rules.ts` | The single source of the agent rules list |
| `showcase/registry/sections.ts` | Ordered section ids and their display titles |
| `showcase/registry/<Component>.ts` | One hand-authored entry per exported component |
| `showcase/registry/index.ts` | Collects entries in section order |
| `showcase/registry/merge.ts` | Merge registry entries with extractor output |
| `showcase/manifest.ts` | Build the `components.json` object and the `llms.txt` string |
| `showcase/vite-plugin-data.ts` | Serves `virtual:showcase-data` from the extractor |
| `showcase/vite.config.ts` | Showcase-only Vite config (root, outDir, plugin) |
| `showcase/env.d.ts` | Module declaration for `virtual:showcase-data` |
| `showcase/index.html` | Page shell |
| `showcase/main.ts` | Client entry; hydrates |
| `showcase/entry-server.ts` | SSR entry; exports `render()` and `manifest()` |
| `showcase/prerender.mjs` | Post-build: inject HTML, write `components.json` and `llms.txt` |
| `showcase/ShowcaseApp.vue` | Page shell: header, rail, sections |
| `showcase/components/ShowcaseSpecimen.vue` | Demo + code + props table + gotchas + prompt |
| `showcase/components/ShowcasePropsTable.vue` | Props / emits / slots tables |
| `showcase/components/ShowcasePromptBlock.vue` | Visible prompt text + copy button |
| `showcase/components/ShowcaseRail.vue` | Sticky section rail |
| `showcase/components/ShowcaseTokens.vue` | Token specimens for the Tokens section |
| `tests/showcaseExtract.test.ts` | Extractor correctness against known components |
| `tests/showcaseRegistry.test.ts` | Registry completeness against `src/index.ts` |
| `tests/showcaseManifest.test.ts` | Manifest shape and prompt/summary presence |
| `wrangler.jsonc` | Cloudflare Pages output dir |
| `.github/workflows/showcase.yml` | Build and deploy on push to `main` |

**Modified:** `package.json` (scripts), `.gitignore`, `eslint.config.js` (ignores), `tsconfig.test.json` (include showcase), `AGENTS.md` (document the showcase).

---

### Task 1: Extractor — props, defaults, and alias resolution

**Files:**
- Create: `showcase/extract/types.ts`
- Create: `showcase/extract/aliases.ts`
- Create: `showcase/extract/props.ts`
- Test: `tests/showcaseExtract.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `extractComponent(filePath: string): ExtractedComponent` from `showcase/extract/props.ts`. `ExtractedComponent` is `{ name: string; props: ExtractedProp[]; emits: ExtractedEmit[]; slots: string[]; referencedTypes: Record<string, string> }`. `ExtractedProp` is `{ name: string; type: string; required: boolean; default: string | null }`. `ExtractedEmit` is `{ name: string; payload: string }`. Task 2 fills `emits` and `slots`; this task leaves them as empty arrays.

**Background the implementer needs:** Every component in `src/components/` uses the same declaration shape — `withDefaults(defineProps<{ … }>(), { … })` inside `<script setup lang="ts">`. A few use a bare `defineProps<{ … }>()` with no defaults, so handle both. Prop types are either inline (`string | Record<string, unknown> | null`), a locally declared alias (`type Variant = 'default' | 'primary' | …` in `I9kButton.vue`), or an alias imported from `src/types/` (`I9kComponentSize`).

**Alias resolution rule (implement exactly this):** resolve an alias only when its declaration is a `type X = …` whose right-hand side is a union of literal or keyword types. Everything else — interfaces, object types, imports from `vue` such as `Component` — keeps its name and has its declaration text recorded in `referencedTypes`. This keeps `size` rendering as `'sm' | 'md' | 'lg'` while `links` stays `I9kNavigationLink[]` instead of an inlined object blob.

- [ ] **Step 1: Write the failing test**

Create `tests/showcaseExtract.test.ts`:

```ts
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { extractComponent } from '../showcase/extract/props';

const component = (name: string) => extractComponent(resolve(`src/components/${name}.vue`));

describe('showcase prop extraction', () => {
  it('reads every prop I9kButton declares, in source order', () => {
    expect(component('I9kButton').props.map((prop) => prop.name)).toEqual([
      'to',
      'href',
      'variant',
      'size',
      'active',
      'type',
      'linkComponent',
    ]);
  });

  it('reads the value withDefaults supplies', () => {
    const size = component('I9kButton').props.find((prop) => prop.name === 'size');
    expect(size?.default).toBe("'md'");
  });

  it('marks an optional prop as not required', () => {
    const size = component('I9kButton').props.find((prop) => prop.name === 'size');
    expect(size?.required).toBe(false);
  });

  it('marks a prop with no question token as required and defaultless', () => {
    const modelValue = component('I9kInput').props.find((prop) => prop.name === 'modelValue');
    expect(modelValue).toMatchObject({ required: true, default: null, type: 'string' });
  });

  it('resolves an alias imported from src/types to its literal union', () => {
    const size = component('I9kBadge').props.find((prop) => prop.name === 'size');
    expect(size?.type).toBe("'sm' | 'md' | 'lg'");
  });

  it('resolves an alias declared inside the component', () => {
    const variant = component('I9kButton').props.find((prop) => prop.name === 'variant');
    expect(variant?.type).toBe(
      "'default' | 'primary' | 'link' | 'filter' | 'pagination' | 'page'",
    );
  });

  it('resolves a union mixing numeric and string literals', () => {
    const columns = component('I9kGrid').props.find((prop) => prop.name === 'columns');
    expect(columns?.type).toBe("1 | 2 | 3 | 'auto'");
  });

  it('leaves an inline union untouched', () => {
    const to = component('I9kButton').props.find((prop) => prop.name === 'to');
    expect(to?.type).toBe('string | Record<string, unknown> | null');
  });

  it('keeps an interface alias by name and records its declaration', () => {
    const extracted = component('I9kNavigation');
    const links = extracted.props.find((prop) => prop.name === 'links');
    expect(links?.type).toBe('I9kNavigationLink[]');
    expect(extracted.referencedTypes.I9kNavigationLink).toContain('label: string');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/showcaseExtract.test.ts`
Expected: FAIL — cannot resolve `../showcase/extract/props`.

- [ ] **Step 3: Write the shared types**

Create `showcase/extract/types.ts`:

```ts
export interface ExtractedProp {
  name: string;
  type: string;
  required: boolean;
  default: string | null;
}

export interface ExtractedEmit {
  name: string;
  payload: string;
}

export interface ExtractedComponent {
  name: string;
  props: ExtractedProp[];
  emits: ExtractedEmit[];
  slots: string[];
  referencedTypes: Record<string, string>;
}
```

- [ ] **Step 4: Write the alias resolver**

Create `showcase/extract/aliases.ts`:

```ts
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import ts from 'typescript';

export interface AliasEntry {
  /** Right-hand side text, present only when the alias is a literal union. */
  inline: string | null;
  /** Full declaration text, always present. */
  declaration: string;
}

const LITERAL_KINDS = new Set<ts.SyntaxKind>([
  ts.SyntaxKind.LiteralType,
  ts.SyntaxKind.StringKeyword,
  ts.SyntaxKind.NumberKeyword,
  ts.SyntaxKind.BooleanKeyword,
  ts.SyntaxKind.NullKeyword,
  ts.SyntaxKind.UndefinedKeyword,
]);

const isInlineable = (node: ts.TypeNode): boolean => {
  if (ts.isUnionTypeNode(node)) return node.types.every(isInlineable);
  return LITERAL_KINDS.has(node.kind);
};

/** Collects `type X = …` and `interface X {…}` declarations from one source text. */
export const collectAliases = (source: string, fileName: string): Map<string, AliasEntry> => {
  const sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.ES2022, true);
  const aliases = new Map<string, AliasEntry>();

  sourceFile.forEachChild((node) => {
    if (ts.isTypeAliasDeclaration(node)) {
      aliases.set(node.name.text, {
        inline: isInlineable(node.type) ? node.type.getText(sourceFile) : null,
        declaration: node.getText(sourceFile),
      });
      return;
    }
    if (ts.isInterfaceDeclaration(node)) {
      aliases.set(node.name.text, { inline: null, declaration: node.getText(sourceFile) });
    }
  });

  return aliases;
};

/** Aliases exported from `src/types/*.ts`, read once and cached. */
let sharedAliases: Map<string, AliasEntry> | null = null;

export const sharedTypeAliases = (typesDir = resolve('src/types')): Map<string, AliasEntry> => {
  if (sharedAliases) return sharedAliases;

  sharedAliases = new Map();
  for (const file of readdirSync(typesDir).filter((name) => name.endsWith('.ts'))) {
    const path = join(typesDir, file);
    for (const [name, entry] of collectAliases(readFileSync(path, 'utf8'), path)) {
      sharedAliases.set(name, entry);
    }
  }
  return sharedAliases;
};

/**
 * Replaces whole-word alias references with their literal union when the alias is
 * inlineable, and reports every alias that stayed by name so the caller can record
 * its declaration.
 */
export const resolveTypeText = (
  typeText: string,
  aliases: Map<string, AliasEntry>,
): { text: string; referenced: string[] } => {
  const referenced: string[] = [];
  const text = typeText.replace(/\b[A-Z][A-Za-z0-9_]*\b/g, (name) => {
    const entry = aliases.get(name);
    if (!entry) return name;
    if (entry.inline) return entry.inline;
    referenced.push(name);
    return name;
  });
  return { text, referenced };
};
```

- [ ] **Step 5: Write the extractor**

Create `showcase/extract/props.ts`:

```ts
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

import ts from 'typescript';
import { parse as parseSfc } from 'vue/compiler-sfc';

import type { AliasEntry } from './aliases';
import { collectAliases, resolveTypeText, sharedTypeAliases } from './aliases';
import type { ExtractedComponent, ExtractedProp } from './types';

/** Finds the first call to `name` anywhere in the script setup block. */
const findCall = (sourceFile: ts.SourceFile, name: string): ts.CallExpression | null => {
  let found: ts.CallExpression | null = null;
  const visit = (node: ts.Node) => {
    if (found) return;
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === name) {
      found = node;
      return;
    }
    ts.forEachChild(node, visit);
  };
  ts.forEachChild(sourceFile, visit);
  return found;
};

/** Reads the `{ key: value }` second argument of `withDefaults`, as source text. */
const readDefaults = (sourceFile: ts.SourceFile): Map<string, string> => {
  const defaults = new Map<string, string>();
  const call = findCall(sourceFile, 'withDefaults');
  const argument = call?.arguments[1];
  if (!argument || !ts.isObjectLiteralExpression(argument)) return defaults;

  for (const property of argument.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    defaults.set(property.name.getText(sourceFile), property.initializer.getText(sourceFile));
  }
  return defaults;
};

const propertyName = (node: ts.PropertySignature, sourceFile: ts.SourceFile): string =>
  ts.isStringLiteral(node.name) ? node.name.text : node.name.getText(sourceFile);

export const extractComponent = (filePath: string): ExtractedComponent => {
  const source = readFileSync(filePath, 'utf8');
  const { descriptor } = parseSfc(source, { filename: filePath });
  const scriptSetup = descriptor.scriptSetup?.content ?? '';
  const sourceFile = ts.createSourceFile(filePath, scriptSetup, ts.ScriptTarget.ES2022, true);

  const aliases = new Map<string, AliasEntry>([
    ...sharedTypeAliases(),
    ...collectAliases(scriptSetup, filePath),
  ]);

  const referencedTypes: Record<string, string> = {};
  const record = (names: string[]) => {
    for (const name of names) {
      const entry = aliases.get(name);
      if (entry) referencedTypes[name] = entry.declaration;
    }
  };

  const props: ExtractedProp[] = [];
  const defaults = readDefaults(sourceFile);
  const propsType = findCall(sourceFile, 'defineProps')?.typeArguments?.[0];

  if (propsType && ts.isTypeLiteralNode(propsType)) {
    for (const member of propsType.members) {
      if (!ts.isPropertySignature(member) || !member.type) continue;
      const name = propertyName(member, sourceFile);
      const resolved = resolveTypeText(member.type.getText(sourceFile), aliases);
      record(resolved.referenced);
      props.push({
        name,
        type: resolved.text,
        required: member.questionToken === undefined,
        default: defaults.get(name) ?? null,
      });
    }
  }

  return {
    name: basename(filePath, '.vue'),
    props,
    emits: [],
    slots: [],
    referencedTypes,
  };
};
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run tests/showcaseExtract.test.ts`
Expected: PASS, 9 tests.

If `columns` comes back as `1 | 2 | 3 | 'auto'` but `size` on the same component does not resolve, the alias map is being built before `collectAliases` — check the spread order in `extractComponent`, local aliases must come second so they win.

- [ ] **Step 7: Commit**

```bash
git add showcase/extract tests/showcaseExtract.test.ts
git commit -m "feat: extract component props from SFC source for the showcase"
```

---

### Task 2: Extractor — emits and slots

**Files:**
- Modify: `showcase/extract/props.ts`
- Test: `tests/showcaseExtract.test.ts` (append a second `describe`)

**Interfaces:**
- Consumes: `extractComponent`, `ExtractedComponent`, `resolveTypeText` from Task 1.
- Produces: the same `extractComponent`, now populating `emits: ExtractedEmit[]` and `slots: string[]`.

**Background:** Emits are declared as `defineEmits<{ 'update:modelValue': [value: string] }>()` — a type literal whose member names may be string literals. Slots come from the template, and `vue/compiler-sfc`'s `parse` already exposes `descriptor.template.ast`, so walk that instead of adding a parser dependency. In the template AST an element node has `type === 1`; a plain attribute has `type === 6`. `I9kNavigation` declares `brand` and `actions` and has no unnamed slot; `I9kGrid` has only `<slot />`, which reports as `default`.

- [ ] **Step 1: Write the failing test**

Append to `tests/showcaseExtract.test.ts`:

```ts
describe('showcase emit and slot extraction', () => {
  it('reads a model emit with its payload tuple', () => {
    expect(component('I9kInput').emits).toEqual([
      { name: 'update:modelValue', payload: '[value: string]' },
    ]);
  });

  it('reads an emit whose payload references a component-local interface', () => {
    expect(component('I9kNavigation').emits).toEqual([
      { name: 'navigate', payload: '[link: I9kNavigationLink, event: MouseEvent]' },
    ]);
  });

  it('reads named slots in template order', () => {
    expect(component('I9kNavigation').slots).toEqual(['brand', 'actions']);
  });

  it('reports an unnamed slot as default', () => {
    expect(component('I9kGrid').slots).toEqual(['default']);
  });

  it('reports no slots for a component that renders none', () => {
    expect(component('I9kInput').slots).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/showcaseExtract.test.ts -t 'emit and slot'`
Expected: FAIL — every assertion receives `[]`.

- [ ] **Step 3: Add emit and slot reading**

In `showcase/extract/props.ts`, widen the existing `./types` import to
`import type { ExtractedComponent, ExtractedEmit, ExtractedProp } from './types';` — do not add a
second import statement from the same module. Then add this import and these helpers above
`extractComponent`:

```ts
import type { TemplateChildNode, RootNode, ElementNode } from '@vue/compiler-core';

const readEmits = (
  sourceFile: ts.SourceFile,
  aliases: Map<string, AliasEntry>,
  record: (names: string[]) => void,
): ExtractedEmit[] => {
  const emitsType = findCall(sourceFile, 'defineEmits')?.typeArguments?.[0];
  if (!emitsType || !ts.isTypeLiteralNode(emitsType)) return [];

  return emitsType.members.flatMap((member) => {
    if (!ts.isPropertySignature(member) || !member.type) return [];
    const resolved = resolveTypeText(member.type.getText(sourceFile), aliases);
    record(resolved.referenced);
    return [{ name: propertyName(member, sourceFile), payload: resolved.text }];
  });
};

const readSlots = (root: RootNode | undefined): string[] => {
  if (!root) return [];
  const names: string[] = [];

  const visit = (node: TemplateChildNode) => {
    if (node.type !== 1) return;
    const element = node as ElementNode;
    if (element.tag === 'slot') {
      const nameProp = element.props.find((prop) => prop.type === 6 && prop.name === 'name');
      const value = nameProp && nameProp.type === 6 ? nameProp.value?.content : undefined;
      names.push(value ?? 'default');
    }
    element.children.forEach(visit);
  };

  root.children.forEach(visit);
  return names;
};
```

Then replace the return statement of `extractComponent` with:

```ts
  return {
    name: basename(filePath, '.vue'),
    props,
    emits: readEmits(sourceFile, aliases, record),
    slots: readSlots(descriptor.template?.ast),
    referencedTypes,
  };
```

`@vue/compiler-core` is a transitive dependency of `vue`; these are type-only imports, erased at build time, so no runtime dependency is added.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run tests/showcaseExtract.test.ts`
Expected: PASS, 14 tests.

If the slot assertions receive `[]`, `descriptor.template.ast` was not populated — confirm `parseSfc` is called with the second argument `{ filename: filePath }` and that the component actually has a `<template>` block.

- [ ] **Step 5: Commit**

```bash
git add showcase/extract tests/showcaseExtract.test.ts
git commit -m "feat: extract component emits and slots for the showcase"
```

---

### Task 3: Registry types, rules, sections, and the four exemplar entries

**Files:**
- Create: `showcase/registry/types.ts`, `showcase/registry/rules.ts`, `showcase/registry/sections.ts`, `showcase/registry/merge.ts`, `showcase/registry/index.ts`
- Create: `showcase/registry/I9kButton.ts`, `showcase/registry/I9kInput.ts`, `showcase/registry/I9kGrid.ts`, `showcase/registry/I9kNavigation.ts`
- Modify: `tsconfig.test.json`
- Test: `tests/showcaseRegistry.test.ts`

**Interfaces:**
- Consumes: `ExtractedComponent` from Task 1.
- Produces: `entries: ShowcaseEntry[]` from `showcase/registry/index.ts`; `mergeRegistry(entries: ShowcaseEntry[], extracted: ExtractedComponent[]): ShowcaseComponent[]` from `showcase/registry/merge.ts`; `RULES: string[]` from `showcase/registry/rules.ts`; `SECTIONS: { id: SectionId; title: string }[]` from `showcase/registry/sections.ts`. Tasks 4, 5, and 8–12 all build on these.

**Note on scope:** this task deliberately ships only four entries — one per structural shape (polymorphic root, form control with a naming trap, layout, site chrome with slots and emits). Task 7 is a review gate on their prompt quality before the remaining entries are written.

- [ ] **Step 1: Write the failing test**

Create `tests/showcaseRegistry.test.ts`. It checks entry well-formedness now and is upgraded to a full-coverage check in Task 13.

```ts
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { extractComponent } from '../showcase/extract/props';
import { entries } from '../showcase/registry';
import { mergeRegistry } from '../showcase/registry/merge';
import { SECTIONS } from '../showcase/registry/sections';

const exportedNames = [
  ...readFileSync(resolve('src/index.ts'), 'utf8').matchAll(
    /export \{ default as (I9k\w+) \}/g,
  ),
].map((match) => match[1]);

const sectionIds = new Set(SECTIONS.map((section) => section.id));

describe('showcase registry', () => {
  it('finds the exported component names it is measured against', () => {
    expect(exportedNames.length).toBe(33);
  });

  it('names only real exports', () => {
    const unknown = entries.filter((entry) => !exportedNames.includes(entry.name));
    expect(unknown.map((entry) => entry.name)).toEqual([]);
  });

  it('has no duplicate entries', () => {
    const names = entries.map((entry) => entry.name);
    expect(names).toEqual([...new Set(names)]);
  });

  it.each(entries.map((entry) => [entry.name, entry] as const))(
    '%s carries a summary, a prompt, a demo, and a known section',
    (_name, entry) => {
      expect(entry.summary.length).toBeGreaterThan(20);
      expect(entry.agentPrompt.length).toBeGreaterThan(80);
      expect(entry.agentPrompt).toContain('@ismail9k/9k-design-system');
      expect(entry.demos.length).toBeGreaterThan(0);
      expect(sectionIds.has(entry.section)).toBe(true);
    },
  );

  it('merges extracted props onto the entry', () => {
    const extracted = entries.map((entry) =>
      extractComponent(resolve(`src/components/${entry.name}.vue`)),
    );
    const merged = mergeRegistry(entries, extracted);
    const input = merged.find((component) => component.name === 'I9kInput');
    expect(input?.props.map((prop) => prop.name)).toContain('uiSize');
    expect(input?.emits).toEqual([{ name: 'update:modelValue', payload: '[value: string]' }]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/showcaseRegistry.test.ts`
Expected: FAIL — cannot resolve `../showcase/registry`.

- [ ] **Step 3: Write the registry types**

Create `showcase/registry/types.ts`:

```ts
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
```

- [ ] **Step 4: Write the sections and rules**

Create `showcase/registry/sections.ts`:

```ts
import type { SectionId } from './types';

export const SECTIONS: { id: SectionId; title: string }[] = [
  { id: 'install', title: 'Install' },
  { id: 'tokens', title: 'Tokens' },
  { id: 'layout', title: 'Layout & surfaces' },
  { id: 'content', title: 'Content' },
  { id: 'forms', title: 'Forms' },
  { id: 'actions', title: 'Actions' },
  { id: 'feedback', title: 'Feedback' },
  { id: 'chrome', title: 'Site chrome' },
  { id: 'rules', title: 'Rules for agents' },
];
```

Create `showcase/registry/rules.ts`. This is the single source consumed by the page, `components.json`, and `llms.txt` — do not restate these anywhere else:

```ts
export const RULES: string[] = [
  'I9kInput names its visual scale prop `uiSize`, not `size`, so the native HTML `size` attribute stays available on the underlying input.',
  'Every component owns its appearance in `<style scoped>` and must not rely on global classes for its look.',
  'Components declare component-local custom properties on their root class and redefine them per size modifier, rather than consuming raw brand tokens for sizing.',
  'Sizes and tones come from the shared `I9kComponentSize` and `I9kTone` types. Do not redeclare those string unions per component.',
  'I9kButton renders a `<button>`, an `<a>`, or a caller-supplied component: pass `to` or `href` for a link, and `link-component="RouterLink"` in Vue Router apps.',
  'I9kIcon renders from the local `src/icons/paths.json` set. Add new icons to that file rather than inlining SVG in a component.',
  'Components emit legacy classes alongside their `i9k-` ones while the website migration is in progress. Do not remove a legacy selector or prop until its migration ledger row is complete.',
  'Import the stylesheet once, at the application entry: `@ismail9k/9k-design-system/style.css`. It is the only CSS a consumer needs.',
  'Any visual change needs checking in light and dark themes and in both LTR and RTL directions.',
];
```

- [ ] **Step 5: Write the merge function**

Create `showcase/registry/merge.ts`:

```ts
import type { ExtractedComponent } from '../extract/types';
import type { ShowcaseComponent, ShowcaseEntry } from './types';

export const mergeRegistry = (
  entries: ShowcaseEntry[],
  extracted: ExtractedComponent[],
): ShowcaseComponent[] => {
  const byName = new Map(extracted.map((component) => [component.name, component]));

  return entries.map((entry) => {
    const source = byName.get(entry.name);
    if (!source) {
      throw new Error(
        `Registry entry "${entry.name}" has no matching component at src/components/${entry.name}.vue`,
      );
    }
    return {
      ...entry,
      props: source.props,
      emits: source.emits,
      slots: source.slots,
      referencedTypes: source.referencedTypes,
    };
  });
};
```

- [ ] **Step 6: Write the four exemplar entries**

`showcase/registry/I9kInput.ts` is the reference every later entry copies in shape and tone. Note what the prompt does: names the import, lists props with resolved unions and defaults, states the emit, states the trap, and closes with one correct usage line.

```ts
import type { ShowcaseEntry } from './types';

export const I9kInputEntry: ShowcaseEntry = {
  name: 'I9kInput',
  section: 'forms',
  summary:
    'Single-line text input with an optional label, hint, and error state. Wires its own accessible ids, and inherits size and error state from a wrapping I9kField when there is one.',
  agentPrompt: `Use I9kInput from @ismail9k/9k-design-system for a labelled single-line text field.

import { I9kInput } from '@ismail9k/9k-design-system';

Props:
- modelValue: string (required) — the v-model target.
- label?: string
- type?: 'text' | 'email' | 'password' (default 'text')
- error?: string | null (default null) — a non-null value renders the error state and wires aria-describedby.
- hint?: string
- required?: boolean (default false)
- uiSize?: 'sm' | 'md' | 'lg' — falls back to a wrapping I9kField's size, then to 'md'.

Emits: update:modelValue with the new string.

IMPORTANT: the visual scale prop is \`uiSize\`, NOT \`size\`. \`size\` is left free for the native HTML attribute and is forwarded to the underlying <input>.

Usage:
<I9kInput v-model="email" label="Email" type="email" ui-size="md" hint="We never share it." />`,
  gotchas: [
    'The visual scale prop is `uiSize`, not `size` — `size` passes through to the native input attribute.',
    'Inside an I9kField, omit `label`, `hint`, `error`, and `uiSize`: the field supplies them and owns the ids.',
  ],
  demos: [
    {
      label: 'Sizes',
      code: `<I9kInput v-model="a" ui-size="sm" label="Small" />
<I9kInput v-model="b" ui-size="md" label="Medium" />
<I9kInput v-model="c" ui-size="lg" label="Large" />`,
    },
    {
      label: 'Hint and error',
      code: `<I9kInput v-model="email" label="Email" hint="We never share it." />
<I9kInput v-model="email" label="Email" error="That address is not valid." />`,
    },
  ],
};
```

Write `showcase/registry/I9kButton.ts`, `showcase/registry/I9kGrid.ts`, and `showcase/registry/I9kNavigation.ts` in the same shape, exporting `I9kButtonEntry`, `I9kGridEntry`, and `I9kNavigationEntry`. Read each component's source before writing its entry and cover, at minimum:

- **I9kButton** — the polymorphic root: `<button>` by default, `<a>` when `to` or `href` is set, or `linkComponent` when supplied; the six `variant` values; that `type` only applies to the button form; the `link-component="RouterLink"` rule.
- **I9kGrid** — `columns` accepting `1 | 2 | 3 | 'auto'`, that `'auto'` fills at a 280px minimum track, that every multi-column value collapses to one column at 768px, and that `size` sets the gap only.
- **I9kNavigation** — the `links` array shape (`{ id, label, href }`), the `brand` slot receiving a `compact` slot prop, the `actions` slot, the `navigate` emit, and that `compactAt`/`expandAt` are scroll thresholds in pixels with hysteresis between them.

Create `showcase/registry/index.ts`:

```ts
import { I9kButtonEntry } from './I9kButton';
import { I9kGridEntry } from './I9kGrid';
import { I9kInputEntry } from './I9kInput';
import { I9kNavigationEntry } from './I9kNavigation';
import type { ShowcaseEntry } from './types';

export const entries: ShowcaseEntry[] = [
  I9kGridEntry,
  I9kInputEntry,
  I9kButtonEntry,
  I9kNavigationEntry,
];
```

- [ ] **Step 7: Let the type checker see the showcase**

In `tsconfig.test.json`, replace the `include` array with:

```json
  "include": [
    "src/**/*.ts",
    "src/**/*.vue",
    "tests/**/*.ts",
    "showcase/**/*.ts",
    "showcase/**/*.vue"
  ]
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `npx vitest run tests/showcaseRegistry.test.ts`
Expected: PASS. The `it.each` block runs four times, once per entry.

Run: `npm run typecheck && npm run lint`
Expected: both clean.

- [ ] **Step 9: Commit**

```bash
git add showcase/registry tests/showcaseRegistry.test.ts tsconfig.test.json
git commit -m "feat: add showcase registry types, agent rules, and four exemplar entries"
```

---

### Task 4: Showcase app shell and specimen components

**Files:**
- Create: `showcase/vite-plugin-data.ts`, `showcase/vite.config.ts`, `showcase/env.d.ts`, `showcase/index.html`, `showcase/main.ts`, `showcase/ShowcaseApp.vue`
- Create: `showcase/components/ShowcaseSpecimen.vue`, `showcase/components/ShowcasePropsTable.vue`, `showcase/components/ShowcasePromptBlock.vue`, `showcase/components/ShowcaseRail.vue`, `showcase/components/ShowcaseTokens.vue`
- Modify: `package.json`, `.gitignore`, `eslint.config.js`

**Interfaces:**
- Consumes: `entries`, `mergeRegistry`, `SECTIONS`, `RULES` from Task 3; `ExtractedComponent` from Task 1.
- Produces: the virtual module `virtual:showcase-data` exporting `extracted: ExtractedComponent[]`; a dev server on `npm run showcase`. Task 5 imports `ShowcaseApp.vue` from its SSR entry.

**Background:** the extractor reads files from disk, so it cannot run in the browser. A Vite plugin runs it at build/dev time and serves the result as a virtual module, which keeps dev server, client build, and SSR build on one code path.

- [ ] **Step 1: Write the virtual data plugin**

Create `showcase/vite-plugin-data.ts`:

```ts
import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

import type { Plugin } from 'vite';

import { extractComponent } from './extract/props';

const VIRTUAL_ID = 'virtual:showcase-data';
const RESOLVED_ID = '\0' + VIRTUAL_ID;

export const showcaseData = (componentsDir = resolve('src/components')): Plugin => ({
  name: 'showcase-data',
  resolveId: (id) => (id === VIRTUAL_ID ? RESOLVED_ID : null),
  load(id) {
    if (id !== RESOLVED_ID) return null;
    const extracted = readdirSync(componentsDir)
      .filter((file) => file.endsWith('.vue'))
      .map((file) => extractComponent(join(componentsDir, file)));
    return `export const extracted = ${JSON.stringify(extracted)};`;
  },
  handleHotUpdate({ file, server }) {
    if (!file.endsWith('.vue') || !file.startsWith(componentsDir)) return;
    const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
    if (mod) server.moduleGraph.invalidateModule(mod);
  },
});
```

Create `showcase/env.d.ts`:

```ts
declare module 'virtual:showcase-data' {
  import type { ExtractedComponent } from './extract/types';

  export const extracted: ExtractedComponent[];
}
```

Create `showcase/vite.config.ts`:

```ts
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

import { showcaseData } from './vite-plugin-data';

const showcaseDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: showcaseDir,
  plugins: [vue(), showcaseData()],
  build: {
    outDir: resolve(showcaseDir, '../showcase-dist'),
    emptyOutDir: true,
  },
});
```

- [ ] **Step 2: Write the page shell**

Create `showcase/index.html`:

```html
<!doctype html>
<html lang="en" class="light">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>9k Design System</title>
    <meta
      name="description"
      content="Every component in @ismail9k/9k-design-system, with props, live demos, and copy-paste prompts for AI agents."
    />
  </head>
  <body>
    <div id="app"><!--app-html--></div>
    <script type="module" src="/main.ts"></script>
  </body>
</html>
```

The `<!--app-html-->` marker is what Task 5's prerender step replaces. Do not remove it.

Create `showcase/main.ts`:

```ts
import { createSSRApp } from 'vue';

import ShowcaseApp from './ShowcaseApp.vue';

import '../src/styles/index.css';

createSSRApp(ShowcaseApp).mount('#app');
```

`createSSRApp` (not `createApp`) is required so the client hydrates the prerendered markup rather than discarding it.

- [ ] **Step 3: Write the specimen components**

Create `showcase/components/ShowcasePromptBlock.vue`. The prompt must be present as readable text, not only behind the copy button, so an agent reading the HTML gets it:

```vue
<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ prompt: string }>();
const copied = ref(false);

const copy = async () => {
  await navigator.clipboard.writeText(props.prompt);
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
};
</script>

<template>
  <div class="showcase-prompt">
    <div class="showcase-prompt__head">
      <h4>Agent prompt</h4>
      <button type="button" @click="copy">{{ copied ? 'Copied' : 'Copy' }}</button>
    </div>
    <pre class="showcase-prompt__body">{{ prompt }}</pre>
  </div>
</template>

<style scoped>
.showcase-prompt {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--code-bg);
}

.showcase-prompt__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--border-color);
}

.showcase-prompt__head h4 {
  margin: 0;
  font-size: 0.875rem;
}

.showcase-prompt__body {
  margin: 0;
  padding: var(--spacing-6);
  overflow-x: auto;
  white-space: pre-wrap;
  font-size: 0.8125rem;
}
</style>
```

Create `showcase/components/ShowcasePropsTable.vue`:

```vue
<script setup lang="ts">
import type { ExtractedEmit, ExtractedProp } from '../extract/types';

defineProps<{ propRows: ExtractedProp[]; emitRows: ExtractedEmit[]; slotNames: string[] }>();
</script>

<template>
  <div class="showcase-api">
    <div v-if="propRows.length" class="showcase-api__scroll">
      <table>
        <caption>
          Props
        </caption>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th></tr>
        </thead>
        <tbody>
          <tr v-for="prop in propRows" :key="prop.name">
            <td>
              <code>{{ prop.name }}</code>
              <span v-if="prop.required" class="showcase-api__required" title="Required">*</span>
            </td>
            <td><code>{{ prop.type }}</code></td>
            <td>
              <code v-if="prop.default">{{ prop.default }}</code>
              <span v-else>&mdash;</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="emitRows.length" class="showcase-api__scroll">
      <table>
        <caption>
          Emits
        </caption>
        <thead>
          <tr><th>Event</th><th>Payload</th></tr>
        </thead>
        <tbody>
          <tr v-for="emit in emitRows" :key="emit.name">
            <td><code>{{ emit.name }}</code></td>
            <td><code>{{ emit.payload }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="slotNames.length" class="showcase-api__slots">
      Slots: <code v-for="slot in slotNames" :key="slot">{{ slot }}</code>
    </p>
  </div>
</template>

<style scoped>
.showcase-api {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

/* Keeps a long union type inside its own scrollbar instead of widening the page. */
.showcase-api__scroll {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

caption {
  margin-bottom: var(--spacing-3);
  text-align: start;
  font-weight: bold;
}

th,
td {
  padding: var(--spacing-3) var(--spacing-4);
  border-bottom: 1px solid var(--border-color);
  text-align: start;
  vertical-align: top;
  white-space: nowrap;
}

.showcase-api__required {
  color: var(--accent-color);
}

.showcase-api__slots code {
  margin-inline-end: var(--spacing-3);
}
</style>
```

`text-align: start` and `margin-inline-end`, rather than `left`/`right`, are what keep these tables correct when the direction toggle flips.

Create `showcase/components/ShowcaseSpecimen.vue`. Note the `demo.render` handling: a demo with no `render` component shows its code only, which is what the exemplar entries do.

```vue
<script setup lang="ts">
import ShowcasePromptBlock from './ShowcasePromptBlock.vue';
import ShowcasePropsTable from './ShowcasePropsTable.vue';
import type { ShowcaseComponent } from '../registry/types';

defineProps<{ component: ShowcaseComponent }>();
</script>

<template>
  <article class="showcase-specimen">
    <h3 :id="component.name">{{ component.name }}</h3>
    <p class="showcase-specimen__summary">{{ component.summary }}</p>

    <section v-for="demo in component.demos" :key="demo.label" class="showcase-specimen__demo">
      <h4>{{ demo.label }}</h4>
      <div v-if="demo.render" class="showcase-specimen__stage">
        <component :is="demo.render" />
      </div>
      <pre class="showcase-specimen__code"><code>{{ demo.code }}</code></pre>
    </section>

    <div v-if="component.gotchas.length" class="showcase-specimen__gotchas">
      <h4>Watch out</h4>
      <ul>
        <li v-for="gotcha in component.gotchas" :key="gotcha">{{ gotcha }}</li>
      </ul>
    </div>

    <ShowcasePropsTable
      :prop-rows="component.props"
      :emit-rows="component.emits"
      :slot-names="component.slots"
    />

    <ShowcasePromptBlock :prompt="component.agentPrompt" />
  </article>
</template>

<style scoped>
.showcase-specimen {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
  padding-block: var(--spacing-13);
  border-bottom: 1px solid var(--border-color);
  /* Matches the rail's offset so an anchor jump does not hide the heading. */
  scroll-margin-top: 6rem;
}

.showcase-specimen h3 {
  margin: 0;
}

.showcase-specimen h4 {
  margin: 0 0 var(--spacing-3);
  font-size: 0.875rem;
  color: var(--text-color-light);
}

.showcase-specimen__stage {
  padding: var(--spacing-8);
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-md);
}

.showcase-specimen__code {
  margin: var(--spacing-4) 0 0;
  padding: var(--spacing-6);
  overflow-x: auto;
  border-radius: var(--radius-md);
  background: var(--code-bg);
  font-size: 0.8125rem;
}
</style>
```

Create `showcase/components/ShowcaseRail.vue`:

```vue
<script setup lang="ts">
import { SECTIONS } from '../registry/sections';
</script>

<template>
  <nav class="showcase-rail" aria-label="Sections">
    <ul>
      <li v-for="section in SECTIONS" :key="section.id">
        <a :href="`#section-${section.id}`">{{ section.title }}</a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.showcase-rail {
  position: sticky;
  top: var(--spacing-8);
  align-self: start;
}

ul {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

a {
  font-size: 0.875rem;
  color: var(--text-color-light);
  text-decoration: none;
}

a:hover {
  color: var(--theme-text-color);
}

@media (max-width: 900px) {
  .showcase-rail {
    display: none;
  }
}
</style>
```

Create `showcase/components/ShowcaseTokens.vue`. Every swatch reads its value through `var(--token)` rather than a hardcoded literal, so the swatches follow the theme toggle and cannot drift from `src/styles/tokens.css`:

```vue
<script setup lang="ts">
const colorTokens = [
  '--primary-color',
  '--on-primary-color',
  '--accent-color',
  '--on-accent-color',
  '--theme-bg-color',
  '--theme-text-color',
  '--text-color-light',
  '--border-color',
  '--code-bg',
];

const spacingTokens = [
  '--spacing-1',
  '--spacing-2',
  '--spacing-3',
  '--spacing-4',
  '--spacing-6',
  '--spacing-8',
  '--spacing-10',
  '--spacing-13',
  '--spacing-18',
];

const controlTokens = [
  '--control-height-sm',
  '--control-height-md',
  '--control-height-lg',
  '--control-font-size-sm',
  '--control-font-size-md',
  '--control-font-size-lg',
  '--component-gap-sm',
  '--component-gap-md',
  '--component-gap-lg',
];

const radiusTokens = ['--radius-sm', '--radius-md', '--radius-lg', '--radius-pill'];
</script>

<template>
  <div class="showcase-tokens">
    <section>
      <h3 id="tokens-color">Color</h3>
      <ul class="showcase-tokens__swatches">
        <li v-for="token in colorTokens" :key="token">
          <span class="showcase-tokens__swatch" :style="{ background: `var(${token})` }" />
          <code>{{ token }}</code>
        </li>
      </ul>
    </section>

    <section>
      <h3 id="tokens-spacing">Spacing</h3>
      <ul class="showcase-tokens__bars">
        <li v-for="token in spacingTokens" :key="token">
          <code>{{ token }}</code>
          <span class="showcase-tokens__bar" :style="{ inlineSize: `var(${token})` }" />
        </li>
      </ul>
    </section>

    <section>
      <h3 id="tokens-radius">Radius</h3>
      <ul class="showcase-tokens__swatches">
        <li v-for="token in radiusTokens" :key="token">
          <span class="showcase-tokens__swatch" :style="{ borderRadius: `var(${token})` }" />
          <code>{{ token }}</code>
        </li>
      </ul>
    </section>

    <section>
      <h3 id="tokens-control">Control scale</h3>
      <p>
        Components declare local custom properties on their root class and redefine them per size
        modifier, drawing from this shared scale rather than from raw brand values.
      </p>
      <ul class="showcase-tokens__list">
        <li v-for="token in controlTokens" :key="token"><code>{{ token }}</code></li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.showcase-tokens {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-13);
}

ul {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-6);
  margin: 0;
  padding: 0;
  list-style: none;
}

.showcase-tokens__bars,
.showcase-tokens__list {
  flex-direction: column;
  gap: var(--spacing-3);
}

.showcase-tokens__swatch {
  display: block;
  inline-size: 4rem;
  block-size: 4rem;
  border: 1px solid var(--border-color);
  background: var(--primary-color);
}

.showcase-tokens__bar {
  display: inline-block;
  block-size: 0.75rem;
  background: var(--accent-color);
}

code {
  font-size: 0.75rem;
}
</style>
```

- [ ] **Step 4: Write the app shell**

Create `showcase/ShowcaseApp.vue`. It merges the registry with the extracted data once, groups by section, and renders header, rail, sections, and the rules list. Both toggles touch `document` only from inside a click handler, never during setup, which is what keeps the SSR render in Task 5 identical to the first client render:

```vue
<script setup lang="ts">
import { extracted } from 'virtual:showcase-data';
import { computed, ref } from 'vue';

import ShowcaseRail from './components/ShowcaseRail.vue';
import ShowcaseSpecimen from './components/ShowcaseSpecimen.vue';
import ShowcaseTokens from './components/ShowcaseTokens.vue';
import { entries } from './registry';
import { mergeRegistry } from './registry/merge';
import { RULES } from './registry/rules';
import { SECTIONS } from './registry/sections';

const components = mergeRegistry(entries, extracted);
// 'install' and 'rules' are rendered explicitly in the template, so they must be
// excluded here — leaving them in would emit a second element with the same id.
const bySection = SECTIONS.filter(
  (section) => section.id !== 'install' && section.id !== 'rules',
).map((section) => ({
  ...section,
  components: components.filter((component) => component.section === section.id),
}));

const theme = ref<'light' | 'dark'>('light');
const direction = ref<'ltr' | 'rtl'>('ltr');

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  document.documentElement.classList.toggle('dark', theme.value === 'dark');
  document.documentElement.classList.toggle('light', theme.value === 'light');
};

const toggleDirection = () => {
  direction.value = direction.value === 'ltr' ? 'rtl' : 'ltr';
};

const installCode = 'npm install @ismail9k/9k-design-system';
const styleCode = "import '@ismail9k/9k-design-system/style.css';";
const componentCount = computed(() => components.length);
</script>

<template>
  <div class="showcase">
    <header class="showcase__header">
      <h1>9k Design System</h1>
      <p>
        Every one of the {{ componentCount }} components in
        <code>@ismail9k/9k-design-system</code>, with props read from source, live demos, and a
        copy-paste prompt per component. Machine-readable at
        <a href="/components.json">/components.json</a> and <a href="/llms.txt">/llms.txt</a>.
      </p>
      <div class="showcase__toggles">
        <button type="button" @click="toggleTheme">Theme: {{ theme }}</button>
        <button type="button" @click="toggleDirection">Direction: {{ direction }}</button>
      </div>
    </header>

    <div class="showcase__body">
      <ShowcaseRail />

      <main :dir="direction">
        <section id="section-install">
          <h2>Install</h2>
          <pre><code>{{ installCode }}</code></pre>
          <p>Import the stylesheet once, at your application entry:</p>
          <pre><code>{{ styleCode }}</code></pre>
          <p>
            In a Vue Router app, pass <code>link-component="RouterLink"</code> to
            <code>I9kButton</code> so its link form renders a router link.
          </p>
        </section>

        <section v-for="section in bySection" :key="section.id" :id="`section-${section.id}`">
          <h2>{{ section.title }}</h2>
          <ShowcaseTokens v-if="section.id === 'tokens'" />
          <ShowcaseSpecimen
            v-for="component in section.components"
            :key="component.name"
            :component="component"
          />
        </section>

        <section id="section-rules">
          <h2>Rules for agents</h2>
          <p>
            These are the constraints a props table cannot express. They hold for every component
            above.
          </p>
          <ol class="showcase__rules">
            <li v-for="rule in RULES" :key="rule">{{ rule }}</li>
          </ol>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.showcase {
  max-inline-size: 72rem;
  margin-inline: auto;
  padding: var(--spacing-13) var(--spacing-8) var(--spacing-18);
}

.showcase__body {
  display: grid;
  grid-template-columns: 12rem minmax(0, 1fr);
  gap: var(--spacing-13);
}

@media (max-width: 900px) {
  .showcase__body {
    grid-template-columns: minmax(0, 1fr);
  }
}

.showcase__toggles {
  display: flex;
  gap: var(--spacing-4);
  margin-top: var(--spacing-6);
}

section[id] {
  scroll-margin-top: 6rem;
}

pre {
  padding: var(--spacing-6);
  overflow-x: auto;
  border-radius: var(--radius-md);
  background: var(--code-bg);
}

.showcase__rules li {
  margin-bottom: var(--spacing-4);
}
</style>
```

Two things to get right here, both load-bearing:

- `mergeRegistry` runs at module scope, not inside `computed`. The data is static, so recomputing it on the client would be wasted work and a hydration-mismatch risk.
- `:dir="direction"` sits on `<main>`, not on the page wrapper, so the direction toggle flips the specimens while the header and rail stay put.

- [ ] **Step 5: Wire the scripts and ignores**

In `package.json`, add to `scripts`:

```json
    "showcase": "vite --config showcase/vite.config.ts",
```

Append to `.gitignore`:

```
showcase-dist/
showcase/.ssr/
```

In `eslint.config.js`, add `'showcase-dist/'` to the `ignores` array in the first config object.

- [ ] **Step 6: Verify the page renders**

Run: `npm run showcase`
Open http://localhost:5173 and confirm: all four components render live, the props tables show resolved unions (`'sm' | 'md' | 'lg'`, not `I9kComponentSize`), prompts are visible as text, the copy button reports "Copied", and both toggles change the demos.

Run: `npm run lint && npm run typecheck`
Expected: both clean.

- [ ] **Step 7: Commit**

```bash
git add showcase package.json .gitignore eslint.config.js
git commit -m "feat: add showcase app shell, specimens, and virtual data module"
```

---

### Task 5: Prerender build, components.json, and llms.txt

**Files:**
- Create: `showcase/manifest.ts`, `showcase/entry-server.ts`, `showcase/prerender.mjs`
- Modify: `package.json`
- Test: `tests/showcaseManifest.test.ts`

**Interfaces:**
- Consumes: `entries`, `mergeRegistry`, `RULES` from Task 3; `ShowcaseApp.vue` from Task 4.
- Produces: `buildManifest(components: ShowcaseComponent[], version: string): Manifest` and `buildLlmsTxt(manifest: Manifest): string` from `showcase/manifest.ts`; `npm run build:showcase` emitting `showcase-dist/index.html`, `showcase-dist/components.json`, and `showcase-dist/llms.txt`.

- [ ] **Step 1: Write the failing test**

Create `tests/showcaseManifest.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { extractComponent } from '../showcase/extract/props';
import { buildLlmsTxt, buildManifest } from '../showcase/manifest';
import { entries } from '../showcase/registry';
import { mergeRegistry } from '../showcase/registry/merge';
import { RULES } from '../showcase/registry/rules';

const components = mergeRegistry(
  entries,
  entries.map((entry) => extractComponent(resolve(`src/components/${entry.name}.vue`))),
);
const manifest = buildManifest(components, '1.2.3');

describe('showcase manifest', () => {
  it('names the package and its stylesheet entry point', () => {
    expect(manifest.package).toBe('@ismail9k/9k-design-system');
    expect(manifest.styleImport).toBe('@ismail9k/9k-design-system/style.css');
    expect(manifest.version).toBe('1.2.3');
  });

  it('carries the shared rules list verbatim', () => {
    expect(manifest.rules).toEqual(RULES);
  });

  it('gives every component a prompt, a summary, and a section', () => {
    for (const component of manifest.components) {
      expect(component.prompt.length).toBeGreaterThan(80);
      expect(component.summary.length).toBeGreaterThan(20);
      expect(component.section).toBeTruthy();
    }
  });

  it('carries resolved prop types rather than alias names', () => {
    const grid = manifest.components.find((component) => component.name === 'I9kGrid');
    const columns = grid?.props.find((prop) => prop.name === 'columns');
    expect(columns?.type).toBe("1 | 2 | 3 | 'auto'");
  });

  it('serialises to JSON without loss', () => {
    expect(() => JSON.parse(JSON.stringify(manifest))).not.toThrow();
  });

  it('writes an llms.txt naming the package, every rule, and every component', () => {
    const text = buildLlmsTxt(manifest);
    expect(text).toContain('@ismail9k/9k-design-system');
    for (const rule of RULES) expect(text).toContain(rule);
    for (const component of manifest.components) expect(text).toContain(component.name);
  });

  it('reports a version that matches package.json when built from it', () => {
    const version = JSON.parse(readFileSync(resolve('package.json'), 'utf8')).version;
    expect(buildManifest(components, version).version).toBe(version);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/showcaseManifest.test.ts`
Expected: FAIL — cannot resolve `../showcase/manifest`.

- [ ] **Step 3: Write the manifest builder**

Create `showcase/manifest.ts`:

```ts
import type { ExtractedEmit, ExtractedProp } from './extract/types';
import { RULES } from './registry/rules';
import type { ShowcaseComponent } from './registry/types';

export interface ManifestComponent {
  name: string;
  section: string;
  summary: string;
  props: ExtractedProp[];
  emits: ExtractedEmit[];
  slots: string[];
  referencedTypes: Record<string, string>;
  gotchas: string[];
  prompt: string;
}

export interface Manifest {
  package: string;
  version: string;
  styleImport: string;
  rules: string[];
  components: ManifestComponent[];
}

export const buildManifest = (components: ShowcaseComponent[], version: string): Manifest => ({
  package: '@ismail9k/9k-design-system',
  version,
  styleImport: '@ismail9k/9k-design-system/style.css',
  rules: RULES,
  components: components.map((component) => ({
    name: component.name,
    section: component.section,
    summary: component.summary,
    props: component.props,
    emits: component.emits,
    slots: component.slots,
    referencedTypes: component.referencedTypes,
    gotchas: component.gotchas,
    prompt: component.agentPrompt,
  })),
});

export const buildLlmsTxt = (manifest: Manifest): string => {
  const lines = [
    `# ${manifest.package}`,
    '',
    `Vue 3 design system, version ${manifest.version}.`,
    `Import the stylesheet once at your app entry: ${manifest.styleImport}`,
    '',
    'Full machine-readable reference: /components.json',
    '',
    '## Rules',
    '',
    ...manifest.rules.map((rule) => `- ${rule}`),
    '',
    '## Components',
    '',
  ];

  for (const component of manifest.components) {
    lines.push(`### ${component.name}`, '', component.summary, '', component.prompt, '');
  }

  return lines.join('\n');
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/showcaseManifest.test.ts`
Expected: PASS, 7 tests.

- [ ] **Step 5: Write the SSR entry and prerender script**

Create `showcase/entry-server.ts`:

```ts
import { extracted } from 'virtual:showcase-data';
import { createSSRApp } from 'vue';
import { renderToString } from '@vue/server-renderer';

import { buildLlmsTxt, buildManifest } from './manifest';
import ShowcaseApp from './ShowcaseApp.vue';
import { entries } from './registry';
import { mergeRegistry } from './registry/merge';

export const render = (): Promise<string> => renderToString(createSSRApp(ShowcaseApp));

export const artifacts = (version: string) => {
  const manifest = buildManifest(mergeRegistry(entries, extracted), version);
  return { manifest, llmsTxt: buildLlmsTxt(manifest) };
};
```

Create `showcase/prerender.mjs`. It is plain JavaScript on purpose: it imports the already-compiled SSR bundle, so nothing needs transpiling to run it.

```js
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = resolve('showcase-dist');
const { version } = JSON.parse(readFileSync(resolve('package.json'), 'utf8'));

const server = await import(pathToFileURL(resolve('showcase/.ssr/entry-server.js')).href);

const html = await server.render();
const { manifest, llmsTxt } = server.artifacts(version);

const shell = readFileSync(resolve(dist, 'index.html'), 'utf8');
if (!shell.includes('<!--app-html-->')) {
  throw new Error('showcase-dist/index.html lost its <!--app-html--> marker');
}

writeFileSync(resolve(dist, 'index.html'), shell.replace('<!--app-html-->', html));
writeFileSync(resolve(dist, 'components.json'), JSON.stringify(manifest, null, 2));
writeFileSync(resolve(dist, 'llms.txt'), llmsTxt);

console.log(`Prerendered ${manifest.components.length} components.`);
```

- [ ] **Step 6: Wire the build script**

In `package.json`, add to `scripts`:

```json
    "build:showcase": "vite build --config showcase/vite.config.ts && vite build --config showcase/vite.config.ts --ssr entry-server.ts --outDir .ssr && node showcase/prerender.mjs",
```

The `--ssr` and `--outDir` values are relative to the config's `root`, which is `showcase/`.

Also extend `check` so a broken showcase cannot merge silently:

```json
    "check": "npm test && npm run format:check && npm run lint && npm run typecheck && npm run build && npm run build-storybook && npm run build:showcase",
```

- [ ] **Step 7: Verify the build**

Run: `npm run build:showcase`
Expected: `Prerendered 4 components.`

Run: `grep -c 'I9kInput' showcase-dist/index.html`
Expected: a non-zero count — the component content is in the HTML, not injected by script.

Run: `node -e "const m=require('./showcase-dist/components.json'); console.log(m.components.length, m.rules.length)"`
Expected: `4 9`

Run: `head -20 showcase-dist/llms.txt`
Expected: the package heading, version, and the rules list.

Then serve `showcase-dist/` and confirm the page hydrates without a Vue hydration mismatch warning in the console. A mismatch means something in `ShowcaseApp.vue` differs between server and client render — most likely a `document` or `window` read during setup.

- [ ] **Step 8: Commit**

```bash
git add showcase tests/showcaseManifest.test.ts package.json
git commit -m "feat: prerender the showcase and emit components.json and llms.txt"
```

---

### Task 6: Cloudflare Pages deployment

**Files:**
- Create: `wrangler.jsonc`, `.github/workflows/showcase.yml`
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: `npm run build:showcase` from Task 5.
- Produces: nothing later tasks depend on.

**Background:** this repository has no CI today, so this is its first workflow. The Cloudflare Pages project must be named `9k-design-system` to match the config below.

- [ ] **Step 1: Write the wrangler config**

Create `wrangler.jsonc`:

```jsonc
{
  "name": "9k-design-system",
  "compatibility_date": "2026-08-27",
  // The showcase is a fully static prerender. `npm run build:showcase` writes here.
  "pages_build_output_dir": "./showcase-dist"
}
```

- [ ] **Step 2: Write the workflow**

Create `.github/workflows/showcase.yml`:

```yaml
name: Showcase

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run check

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build:showcase
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy showcase-dist --project-name=9k-design-system
```

- [ ] **Step 3: Document the manual step**

Add a `## Component showcase` section to `AGENTS.md`, after `## Architecture`, covering: what the showcase is and where it lives; that `npm run showcase` serves it and `npm run build:showcase` builds it; that every new component needs a `showcase/registry/<Name>.ts` entry or `tests/showcaseRegistry.test.ts` fails; and this deployment prerequisite, stated plainly:

> Deploying requires a Cloudflare Pages project named `9k-design-system` and two repository secrets, `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. Until both exist, the `deploy` job fails while the `build` job still passes.

- [ ] **Step 4: Verify**

Run: `npx yaml-lint .github/workflows/showcase.yml 2>/dev/null || node -e "require('node:fs').readFileSync('.github/workflows/showcase.yml','utf8')"`
Then confirm by eye that `build` runs on every push and PR while `deploy` is gated on `main`.

Run: `npm run format:check`
Expected: clean. Run `npm run format` first if it is not.

- [ ] **Step 5: Commit**

```bash
git add wrangler.jsonc .github/workflows/showcase.yml AGENTS.md
git commit -m "chore: build and deploy the showcase to Cloudflare Pages"
```

---

### Task 7: Review gate — prompt quality

**Files:** none.

**Interfaces:** none.

**This task writes no code.** Stop and get a human decision before the entry style is replicated across the remaining 29 components.

- [ ] **Step 1: Build and present**

Run: `npm run build:showcase && npm run showcase`

Present to the reviewer: the four rendered specimens, and the four `prompt` values from `showcase-dist/components.json`.

- [ ] **Step 2: Ask the four questions**

1. Is a prompt genuinely self-contained — could an agent with no other context use the component correctly from it alone?
2. Is the level of detail right, or are the prompts too long or too thin?
3. Are `gotchas` and `agentPrompt` duplicating each other more than they should?
4. Should demos be code-only, or is a live render worth the extra authoring per entry?

- [ ] **Step 3: Apply the feedback to all four entries before continuing**

Whatever changes come back, apply them to `I9kButton`, `I9kInput`, `I9kGrid`, and `I9kNavigation` first, then commit. Tasks 8–12 copy the corrected style.

```bash
git add showcase/registry
git commit -m "docs: revise showcase agent prompts after review"
```

---

### Tasks 8–12: Remaining registry entries, by section

Each of these five tasks follows the identical procedure below, differing only in the component list. They are separate tasks so a reviewer can accept one section and reject another.

**Files, for each task:**
- Create: `showcase/registry/<Component>.ts`, one per component in that task's list
- Modify: `showcase/registry/index.ts`
- Test: `tests/showcaseRegistry.test.ts` (no edit; the existing `it.each` picks up new entries automatically)

**Interfaces:**
- Consumes: `ShowcaseEntry` from `showcase/registry/types.ts` (Task 3), and the corrected exemplar style from Task 7.
- Produces: additional members of `entries` in `showcase/registry/index.ts`.

**Procedure, for every component in the list:**

- [ ] **Step 1: Read the component source** at `src/components/<Name>.vue` — script, template, and scoped styles — and its story at `stories/<Name>.stories.ts` if one exists. Stories carry working demo code you can lift.
- [ ] **Step 2: Read the extractor output** for the component, so the prompt cannot contradict the
  props table rendered beside it. Add this temporary test to `tests/showcaseExtract.test.ts`, run
  it, copy the output, then delete the test before committing:

```ts
  it('TEMP: dump extraction', () => {
    console.log(JSON.stringify(component('<Name>'), null, 2));
  });
```

Run: `npx vitest run tests/showcaseExtract.test.ts -t 'TEMP'`

This goes through the existing Vitest setup rather than a bare `node -e`, so module resolution for
`vue/compiler-sfc` and `typescript` is already handled.

- [ ] **Step 3: Write `showcase/registry/<Name>.ts`** exporting `<Name>Entry: ShowcaseEntry`, in the shape of `I9kInput.ts`. The prompt must:
  - open with one sentence saying when to reach for the component;
  - show the named import from `@ismail9k/9k-design-system`;
  - list every prop with its resolved type and default, matching the extractor output exactly;
  - name every emit and every slot, including slot props;
  - state each gotcha as an imperative, not an observation;
  - close with one runnable usage line.
- [ ] **Step 4: Add the import and the entry** to `showcase/registry/index.ts`, keeping `entries` in section order.
- [ ] **Step 5: Verify:** `npx vitest run tests/showcaseRegistry.test.ts && npm run typecheck` — expected PASS, with the `it.each` block now running once per entry.
- [ ] **Step 6: Check it renders:** `npm run showcase`, confirm each new specimen renders live in both themes and both directions.
- [ ] **Step 7: Commit:** `git commit -m "docs: add showcase entries for <section> components"`

**Task 8 — Layout & surfaces** (`section: 'layout'`), 3 entries: `I9kPageContainer`, `I9kCluster`, `I9kPanel`. `I9kGrid` already exists from Task 3.

**Task 9 — Content** (`section: 'content'`), 13 entries: `I9kText`, `I9kSectionHeading`, `I9kPageHeader`, `I9kArticleHeader`, `I9kBadge`, `I9kStat`, `I9kLinkCard`, `I9kTimelineCard`, `I9kProfileCard`, `I9kFaqList`, `I9kGithubEmbed`, `I9kIcon`, `I9kAsciiEmoji`. For `I9kIcon`, the prompt must state that names come from `src/icons/paths.json`, that the component is `aria-hidden` unless given a `title` or `desc`, and that new icons are added to that JSON rather than inlined.

**Task 10 — Forms** (`section: 'forms'`), 4 entries: `I9kField`, `I9kTextarea`, `I9kSelect`, `I9kRadioGroup`. `I9kInput` already exists from Task 3. Each of these prompts must say what the control inherits from a wrapping `I9kField` and what it owns standalone; read `src/composables/i9kField.ts` before writing them.

**Task 11 — Actions & feedback**, 3 entries: `I9kButtonGroup` and `I9kIconButton` with `section: 'actions'`, `I9kToast` with `section: 'feedback'`. `I9kButton` already exists from Task 3.

**Task 12 — Site chrome** (`section: 'chrome'`), 6 entries: `I9kFooter`, `I9kBrandWordmark`, `I9kSocialLinks`, `I9kThemeSwitcher`, `I9kLanguageSwitcher`, `I9kBlurredCircles`. `I9kNavigation` already exists from Task 3. These components own page-level chrome, so demos must be visually contained — render each inside a bordered box with `position: relative` and constrained height rather than letting a sticky header or fixed background escape into the page. `I9kBrandWordmark` animates on an internal 15–35s timer; say so in its entry rather than trying to demo the wink.

After Task 12, `entries` contains 33 members: 4 (Task 3) + 3 + 13 + 4 + 3 + 6.

---

### Task 13: Enforce full coverage

**Files:**
- Modify: `tests/showcaseRegistry.test.ts`

**Interfaces:**
- Consumes: the complete `entries` array from Tasks 3 and 8–12.
- Produces: the guarantee that a new export without a registry entry fails the suite.

- [ ] **Step 1: Write the failing test**

Add this to the `describe('showcase registry')` block in `tests/showcaseRegistry.test.ts`:

```ts
  it('documents every component exported from src/index.ts', () => {
    const documented = new Set(entries.map((entry) => entry.name));
    const missing = exportedNames.filter((name) => !documented.has(name));
    expect(missing).toEqual([]);
  });
```

- [ ] **Step 2: Run the test**

Run: `npx vitest run tests/showcaseRegistry.test.ts`
Expected: PASS. If it fails, the assertion names exactly which components are undocumented — write those entries following the Task 8–12 procedure, then rerun.

- [ ] **Step 3: Prove the guard actually bites**

Temporarily comment out one entry in `showcase/registry/index.ts` and rerun the test. Expected: FAIL naming that component. Restore the entry and rerun. Expected: PASS. A guard that never fails is not a guard.

- [ ] **Step 4: Run the full pipeline**

Run: `npm run check`
Expected: clean through test, format, lint, typecheck, library build, Storybook build, and showcase build.

Run: `node -e "console.log(require('./showcase-dist/components.json').components.length)"`
Expected: `33`

- [ ] **Step 5: Commit**

```bash
git add tests/showcaseRegistry.test.ts
git commit -m "test: require a showcase entry for every exported component"
```

---

## Verification checklist

Run at the end, before opening the pull request:

- [ ] `npm run check` passes.
- [ ] `showcase-dist/components.json` lists 33 components, each with a non-empty prompt.
- [ ] `showcase-dist/index.html` contains every component name as literal text — confirm with `for n in $(node -e "require('./showcase-dist/components.json').components.forEach(c=>console.log(c.name))"); do grep -q "$n" showcase-dist/index.html || echo "MISSING $n"; done`
- [ ] `showcase-dist/llms.txt` opens with the package name and lists all nine rules.
- [ ] The served page hydrates with no Vue hydration mismatch warning in the console.
- [ ] The page reads correctly in light and dark, and in LTR and RTL.
- [ ] `npm run build` still emits `dist/` unchanged, and `package.json` `files` is still `["dist"]`.
- [ ] The pull request notes the Cloudflare prerequisite: a Pages project named `9k-design-system` plus the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets.
