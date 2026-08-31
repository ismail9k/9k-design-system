# Agent-Friendly Component Showcase Design

**Status:** Approved in chat on 2026-08-27

## Goal

Build a single, publicly hosted page that documents every component this package exports and is
readable by both people and AI agents. The live reference page today is
`ismail9k.com/pages/design-system.vue`, which lives in a consumer repo and specimens only the seven
components that site happens to use. This spec moves the canonical reference into
`9k-design-system`, extends it to all exported components, and adds an agent layer the current page
lacks: a copy-paste prompt per component, a machine-readable manifest, and an explicit rules
section.

The page is the artifact for both audiences. There is no separate "agent version" to drift.

## Scope

### Included

- A `showcase/` Vue application in this repository, built with the existing Vite tooling.
- Static prerendering to HTML at build time via `@vue/server-renderer`, with client hydration.
- A specimen for every component exported from `src/index.ts`.
- Build-time extraction of props, defaults, emits, and slots from component source.
- A hand-authored registry entry per component carrying summary, gotchas, demos, and agent prompt.
- Three agent surfaces: per-component copy-paste prompt, `components.json`, and a rules section
  mirrored into `llms.txt`.
- Light/dark and LTR/RTL toggles that flip the live demos in place.
- Vitest coverage for registry completeness, extractor correctness, and manifest shape.
- `npm run showcase` and `npm run build:showcase` scripts, with the showcase build added to
  `npm run check`.
- A GitHub Actions workflow deploying to Cloudflare Pages on push to `main`.

### Excluded

- Any change to the published package surface. `files` stays `["dist"]`; nothing under `showcase/`
  is exported, and the library build is untouched.
- Removing or rewriting `ismail9k.com/pages/design-system.vue`. That page keeps working; whether it
  later redirects to the showcase is a separate decision.
- Task-recipe prompts ("build a landing page hero"). Considered and deliberately left out of this
  slice; the per-component prompts and rules section come first.
- Per-component routes or deep links beyond in-page anchors.
- Replacing Storybook. The workshop stays as-is for development; the showcase is documentation.
- Visual regression testing or screenshot capture.
- Search, filtering, or a component playground with editable props.

## Architecture

### Directory layout

```
showcase/
  index.html            shell; prerendered #app filled at build
  main.ts               createSSRApp + hydrate on client
  App.vue               page shell: header, section rail, sections
  build.ts              SSR render -> showcase-dist/ + components.json + llms.txt
  registry/
    index.ts            ordered entries, grouped into sections
    <Component>.ts      one entry per exported component
  extract/
    props.ts            TypeScript-compiler-API pass over src/components/*.vue
  components/
    Specimen.vue        demo + code + props table + gotchas + prompt
    PropsTable.vue
    PromptBlock.vue     copy-to-clipboard prompt
    SectionRail.vue
```

The showcase imports components from `src/`, not `dist/`, so the page reflects the working tree
without a library build first.

### Rendering

`showcase/build.ts` runs the app through `@vue/server-renderer`, injects the resulting HTML into
`index.html`, and writes `showcase-dist/`. The client bundle hydrates that markup for the
interactive parts: theme toggle, direction toggle, and copy buttons. An agent fetching the URL
receives the complete design system as HTML in one request, with no JavaScript execution required.

SSR is already exercised in this repo by `tests/I9kNativeActionsFormsSsr.test.ts`, so components are
known to render server-side.

## Prop extraction

Every component in `src/components/` uses the same shape:

```ts
withDefaults(defineProps<{/* type literal */}>(), {/* defaults */});
```

`showcase/extract/props.ts` parses each SFC's `<script setup lang="ts">` block with the TypeScript
compiler API — already a devDependency, so no new tooling — and reads:

- the type literal passed to `defineProps<T>()`: prop names, optionality, and declared types;
- the object literal passed as the second argument to `withDefaults`: default values;
- `defineEmits<T>()`: emitted event names and payload types;
- `<slot name="…">` occurrences in the template: slot names, with the unnamed slot as `default`.

Imported type aliases are resolved against `src/types/*.ts` so a prop renders its literal union
(`'sm' | 'md' | 'lg'`) rather than the alias name. An alias that cannot be resolved falls back to
printing the alias name, and the extractor records that as unresolved rather than failing the build.

Extraction is a build-time step. Extracted data is never hand-copied into registry entries.

## Registry

One file per component under `showcase/registry/`, exporting an entry of this shape:

```ts
export interface ShowcaseEntry {
  name: string; // must match an export from src/index.ts
  section: SectionId;
  summary: string; // one or two sentences
  agentPrompt: string; // self-contained, copy-paste ready
  gotchas: string[]; // non-obvious constraints; may be empty
  demos: { label: string; code: string; component?: Component }[];
}
```

Only editorial content is hand-authored. Props, defaults, emits, and slots are merged in from the
extractor at build time.

`agentPrompt` is self-contained: an agent pasting it into a fresh conversation, with no other
context, has enough to use the component correctly. Each prompt states the import from
`@9klabs/design`, the props with their literal unions and defaults, any gotcha for that
component, and one correct usage line.

## Page structure

One long page with a sticky section rail, following the shape of the existing website page.

Header: title, install snippet, theme toggle, direction toggle. The toggles flip the live demos in
place, because visual work in this repo requires light/dark and LTR/RTL checks and the page should
make both reachable without leaving it.

Sections, in order:

1. **Install** — package install, the single `style.css` import, Vue Router note for `I9kButton`.
2. **Tokens** — colors, spacing, radius, shadow, type scale, read from the built stylesheet.
3. **Layout & surfaces** — `I9kPageContainer`, `I9kGrid`, `I9kCluster`, `I9kPanel`.
4. **Content** — `I9kText`, `I9kSectionHeading`, `I9kPageHeader`, `I9kArticleHeader`, `I9kBadge`,
   `I9kStat`, `I9kLinkCard`, `I9kTimelineCard`, `I9kProfileCard`, `I9kFaqList`, `I9kGithubEmbed`,
   `I9kIcon`, `I9kAsciiEmoji`.
5. **Forms** — `I9kField`, `I9kInput`, `I9kTextarea`, `I9kSelect`, `I9kRadioGroup`.
6. **Actions** — `I9kButton`, `I9kButtonGroup`, `I9kIconButton`.
7. **Feedback** — `I9kToast`.
8. **Site chrome** — `I9kNavigation`, `I9kFooter`, `I9kBrandWordmark`, `I9kSocialLinks`,
   `I9kThemeSwitcher`, `I9kLanguageSwitcher`, `I9kBlurredCircles`.
9. **Rules for agents**.

Section assignment lives in each registry entry, so the grouping above is data, not layout code.

Every component renders as a Specimen: live demo, code sample, props table, gotchas, and its agent
prompt behind a copy button.

## Agent surfaces

### Per-component prompt

Rendered on the page in a `PromptBlock` with a copy button, sourced from `entry.agentPrompt` plus
the extracted prop signature. Visible as text, so an agent reading the HTML gets it without needing
to trigger the copy control.

### components.json

Emitted by `build.ts` from the same registry and extractor output, served at the site root:

```json
{
  "package": "@9klabs/design",
  "version": "…",
  "styleImport": "@9klabs/design/style.css",
  "rules": ["…"],
  "components": [
    {
      "name": "I9kInput",
      "section": "Forms",
      "summary": "…",
      "props": [
        {
          "name": "uiSize",
          "type": "'sm' | 'md' | 'lg'",
          "default": "undefined",
          "required": false
        }
      ],
      "emits": [{ "name": "update:modelValue", "payload": "[value: string]" }],
      "slots": ["default"],
      "gotchas": ["…"],
      "prompt": "…"
    }
  ]
}
```

One fetch yields the whole system, fully parseable, with no HTML scraping.

### Rules & guardrails

An on-page section, mirrored into `llms.txt`, carrying the invariants that are not derivable from a
props table:

- `I9kInput` names its visual scale prop `uiSize`, not `size`, so the native HTML `size` attribute
  stays available.
- Components own their appearance in `<style scoped>` and must not rely on global classes.
- Components declare component-local custom properties on their root class rather than consuming
  raw brand tokens for sizing.
- Sizes and tones come from `I9kComponentSize` and `I9kTone`; do not redeclare string unions.
- `I9kButton` renders `<button>`, `<a>`, or a supplied component: pass `to`/`href` for a link, and
  `link-component="RouterLink"` in Vue Router apps.
- `I9kIcon` renders from `src/icons/paths.json`; add icons there rather than inlining SVG.
- Legacy classes are emitted alongside `i9k-` ones and may not be removed until the migration
  ledger row is complete.
- Visual changes need light/dark and LTR/RTL checks.

The rules text has one source in `showcase/registry/rules.ts`, consumed by the page, the manifest,
and `llms.txt`.

## Testing

- `tests/showcaseRegistry.test.ts` — every component name exported from `src/index.ts` has a
  registry entry, and every entry names a real export. This is the completeness guarantee: a new
  component cannot ship undocumented. It follows the precedent of
  `tests/I9kComponentContracts.test.ts`, which already pins the public export list.
- `tests/showcaseExtract.test.ts` — the extractor against known components: `I9kButton`'s seven
  props with their defaults, `I9kInput`'s `uiSize`, `I9kBadge`'s resolved `I9kBadgeVariant` union.
  A parser regression is then visible rather than silent.
- `tests/showcaseManifest.test.ts` — `components.json` shape, and that every entry carries a
  non-empty prompt and summary.

These are ordinary Vitest suites. The extractor test reads source text and does not invoke a Vite
build, so it stays fast.

## Build and deploy

- `npm run showcase` — Vite dev server for the showcase.
- `npm run build:showcase` — prerender to `showcase-dist/`, emit `components.json` and `llms.txt`.
- `npm run check` gains `build:showcase` so the page cannot break unnoticed.
- `showcase-dist/` is gitignored, alongside `dist/` and `storybook-static/`.
- `wrangler.jsonc` sets `pages_build_output_dir: "./showcase-dist"`.
- `.github/workflows/showcase.yml` — the repository's first workflow: install, `npm run check`,
  `npm run build:showcase`, deploy to Cloudflare Pages on push to `main`.

**Manual step, outside this work:** the Cloudflare Pages project must exist, and
`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` must be set as repository secrets. The workflow
is committed ready to run and fails on the deploy step until those exist.

## Implementation sequencing

The bulk of the effort is authoring registry entries, and prompt quality is the point of the page.
The shell, extractor, manifest, and agent surfaces land first against a small set of entries, so
prompt style can be reviewed and corrected before it is replicated across every component.

1. Extractor plus its test, standalone and verifiable on its own.
2. Showcase shell, Specimen components, prerender build, and deploy wiring, with four registry
   entries covering distinct shapes: `I9kButton` (polymorphic root), `I9kInput` (form, `uiSize`
   gotcha), `I9kGrid` (layout), `I9kNavigation` (site chrome).
3. **Review gate:** the four prompts and the manifest they produce are reviewed before proceeding.
4. Remaining registry entries in section-sized batches.
5. `showcaseRegistry.test.ts` flipped to require full coverage once every entry exists.

## Open questions

None. The Cloudflare project name is the one input needed at deploy time and is recorded above as a
manual step.
