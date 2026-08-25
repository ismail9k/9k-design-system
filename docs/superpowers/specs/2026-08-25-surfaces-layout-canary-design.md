# Surfaces, Layout, and Canary Migration Design

**Status:** Approved in chat on 2026-08-25

## Goal

Add the six scoped components required to replace the live website's direct surface, badge, grid,
cluster, stat, and lede primitives, then migrate only the `/design-system` reference page as the
first website canary.

The package slice adds:

- `I9kPanel`
- `I9kBadge`
- `I9kGrid`
- `I9kCluster`
- `I9kStat`
- `I9kText`

`I9kStack` and the rest of the broader surfaces and layout inventory remain outside this slice
because they do not block the canary migration.

## Scope

### Included

- Typed public APIs and exports for the six new components.
- `sm`, `md`, and `lg` presentation for every component, defaulting to `md`.
- Vue SFC `<style scoped>` ownership with `i9k-`-prefixed classes.
- Medium defaults that preserve the current legacy primitive appearance.
- Native attribute forwarding to the rendered root element.
- Polymorphic root elements through a constrained `as` prop.
- Focused Vitest behavior tests, scoped-style safeguards, Storybook documentation, and package
  verification.
- Migration of primitive specimens on `ismail9k.com/pages/design-system.vue` to the new package
  components.
- English/Arabic, light/dark, mobile/desktop, SSR/static-output, and reduced-motion checks for the
  canary.
- Migration-ledger updates that record the package readiness and Batch 0 result.

### Excluded

- `I9kCard`, `I9kStack`, `I9kSeparator`, or `I9kCollapsible`.
- Remaining native form controls or interaction-heavy components.
- Public-route migration beyond `/design-system` and `/ar/design-system`.
- `I9kPagination` and the timeline migration in Batch 2.
- Removal or renaming of legacy selectors or deprecated button variants.
- Changes to the current token values or cascade-layer order.
- New runtime dependencies.

## Design Principles

1. The new components own their complete visual appearance in scoped CSS.
2. Compatibility rules remain unchanged while public website routes still use legacy classes.
3. Component APIs describe intent rather than reproducing legacy class names.
4. Medium rendering matches the current website; small and large variants scale density using
   component-local custom properties.
5. Layout components provide layout only and do not style their children.
6. Native and ARIA attributes reach the consumer-selected root element.
7. The canary migration is independently revertible and does not remove compatibility CSS.

## Shared Contracts

All six components consume `I9kComponentSize` from `src/types/components.ts`. Each defaults to
`size="md"`, renders an `i9k-<component>` root class and an `i9k-<component>--<size>` modifier,
and declares component-local custom properties on its root class.

The components accept an `as` prop whose default matches the common semantic use:

| Component    | Default element | Supported `as` purpose                               |
| ------------ | --------------- | ---------------------------------------------------- |
| `I9kPanel`   | `div`           | `section`, `article`, `aside`, or consumer component |
| `I9kBadge`   | `span`          | Inline semantic element or consumer component        |
| `I9kGrid`    | `div`           | `ul`, `ol`, `section`, or consumer component         |
| `I9kCluster` | `div`           | `nav`, `ul`, or consumer component                   |
| `I9kStat`    | `div`           | `li`, `article`, or consumer component               |
| `I9kText`    | `p`             | Another text-appropriate element or component        |

The prop is typed as `string | Component`, following the existing Vue package boundary. The
library does not validate HTML nesting chosen by the consumer.

## Component APIs

### `I9kPanel`

```ts
type I9kPanelVariant = 'default' | 'feature' | 'flat';

interface I9kPanelProps {
  as?: string | Component;
  size?: I9kComponentSize;
  variant?: I9kPanelVariant;
}
```

The default variant preserves the current border, medium radius, glass background, blur, and
transition. `feature` uses the current large radius, accent border, and branded gradient. `flat`
removes border, background, and blur. Size controls padding and internal radius without adding
layout to slotted content. The component does not expose an `interactive` prop: interaction and
hover lift belong to a semantic card or link component.

### `I9kBadge`

```ts
type I9kBadgeVariant = 'solid' | 'outline' | 'tag';

interface I9kBadgeProps {
  as?: string | Component;
  size?: I9kComponentSize;
  variant?: I9kBadgeVariant;
}
```

The default variant is `outline`, which is the safest neutral label treatment. `solid` preserves
the primary fill and uppercase label. `tag` preserves the current rectangular treatment and adds
the visual `#` through `::before`; the decoration is absent from the accessible name. Size controls
padding and font size while variants retain their semantic appearance.

### `I9kGrid`

```ts
type I9kGridColumns = 1 | 2 | 3 | 'auto';

interface I9kGridProps {
  as?: string | Component;
  columns?: I9kGridColumns;
  size?: I9kComponentSize;
}
```

`columns` defaults to `1`. Numeric values render fixed equal-width columns; `auto` uses the current
`repeat(auto-fill, minmax(280px, 1fr))` contract. Two-, three-, and auto-column layouts collapse to
one column at 768px. Size maps to the current tight, default, and loose gaps so the medium rendering
retains the current `var(--spacing-8)` gap.

### `I9kCluster`

```ts
interface I9kClusterProps {
  as?: string | Component;
  size?: I9kComponentSize;
}
```

The root is a wrapping flex row aligned on the cross axis. Size controls gap; medium preserves the
current `var(--spacing-6)` value and small preserves `cluster--tight`. Alignment and justification
remain consumer-owned through normal classes because the canary does not require additional API.

### `I9kStat`

```ts
interface I9kStatProps {
  as?: string | Component;
  label?: string;
  size?: I9kComponentSize;
  source?: string;
  value?: string | number;
}
```

The component renders `value`, `label`, and `source` regions in that order. Named slots with the
same names override their corresponding prop, allowing rich text without exposing internal class
names. A region is omitted when neither its prop nor slot is present. Medium value and label styles
match the current `.stat`; large value styling matches `.stat--lg`. Small provides a compact data
display while preserving hierarchy.

### `I9kText`

```ts
type I9kTextVariant = 'body' | 'lede';

interface I9kTextProps {
  as?: string | Component;
  size?: I9kComponentSize;
  variant?: I9kTextVariant;
}
```

The default variant is `body`. `lede` preserves the current 62-character maximum width, muted
color, bottom margin, medium font size, and line height. Size changes the font scale and spacing;
it does not change the semantic element selected with `as`.

## Styling and Compatibility

Every component has one `<style scoped>` block. The new SFCs do not emit `.surface`, `.badge`,
`.grid`, `.cluster`, `.stat`, or `.lede` classes and do not rely on declarations in
`src/styles/primitives.css`.

`src/styles/primitives.css` remains intact during this slice. Its selectors continue serving all
unmigrated website routes. The stylesheet comments may be updated to name the new scoped owners,
but declarations and cascade placement remain unchanged.

Dark-mode styling is needed only where the existing primitive has a dark override: the tag badge
uses a scoped `:global(.dark ...)` selector. Logical properties are used for tag decoration spacing
so RTL rendering does not require a separate direction override. Reduced-motion styling disables
panel and badge transitions.

## Storybook and Tests

Each component receives a focused behavior test covering:

- default element, size, and variant;
- custom `as` rendering and native attribute forwarding;
- modifier classes;
- component-specific props and slots;
- omitted optional Stat regions;
- the Grid responsive contract and Badge tag decoration through compiled-style safeguards.

`tests/I9kScopedStyles.test.ts` adds all six prefixes. `tests/I9kComponentContracts.test.ts`
asserts the public exports and public component-specific types. Compiled CSS tests verify the
responsive grid selector, dark tag selector, and reduced-motion rules where source assertions are
insufficient.

Matching Storybook entries show all sizes and variants. An integrated surfaces-and-layout story
shows nested panels, grids, clusters, badges, stats, and text under LTR and RTL containers without
legacy classes.

## Website Canary Migration

Only the primitive specimen section of `../ismail9k.com/pages/design-system.vue` is migrated in
Batch 0. The page imports the six public components and replaces:

- surface examples with default, feature, and flat `I9kPanel` examples;
- badge spans with the three `I9kBadge` variants;
- grid wrappers with `I9kGrid`;
- stat markup with `I9kStat`;
- clusters with `I9kCluster`;
- lede paragraphs with `I9kText variant="lede"`.

Token specimens on the same page may use `I9kGrid` where they currently demonstrate layout, but
unrelated legacy examples and public routes remain untouched. Code snippets and explanatory copy
are updated to document components instead of retired classes. Existing local canary classes may
remain only for page-specific presentation and must not recreate a package component's visual
contract.

`components/ds/DsSpecimen.vue` changes only if its canary controls require a public size or variant
adjustment. `assets/css/app.css` retains the package stylesheet and compatibility cascade.

## Verification

Package verification:

```bash
npm test
npm run format:check
npm run lint
npm run typecheck
npm run build
npm run build-storybook
npm pack --dry-run
git diff --check
```

Website verification against the local package commit:

```bash
npm run lint
npm run generate
```

The canary is reviewed at `/design-system` and `/ar/design-system` in light and dark modes at 375px
and at least 1280px. Direct static loads and client navigation must render the same component
states. Reduced motion must remove transitions without changing layout.

## Rollback and Completion

The package and website changes remain separate commits so either can be reverted independently.
Compatibility selectors stay available throughout rollback. Batch 0 is complete only when the
package gates pass, the website lint and generate commands pass, both locale routes exist in static
output, and the visual verification matrix has no unresolved regression.

Completing this slice unlocks Batch 1 but does not authorize compatibility removal. The next
package prerequisite after Batch 1 is `I9kPagination` for the timeline and blog migration.
