# Complete Component Library Design

**Status:** Approved in chat on 2026-08-23

## Goal

Expand `@ismail9k/9k-design-system` into a product-ready Vue 3 component library with
approximately 47 general-purpose components, consistent `sm`, `md`, and `lg` sizes, scoped
component styling, accessible interaction behavior, complete Storybook documentation, and a
safe migration path for the existing `ismail9k.com` consumer.

## Context

The package currently exports 20 Vue components and a shared stylesheet. `I9kButton`,
`I9kInput`, `I9kToast`, surfaces, badges, fields, timeline chrome, and layout helpers depend on
selectors in `src/styles/primitives.css`. Only a small subset of the components has focused unit
tests. Storybook covers several components but does not yet represent a complete public API or
enforce accessibility checks.

The live Nuxt website at `../ismail9k.com` consumes the package through a local file dependency.
It imports 15 package components across 22 source files and also uses global primitive classes
directly. Removing those selectors without a coordinated website migration would cause visible
breakage.

## Confirmed Product Decisions

- Target a product-ready core rather than an exhaustive enterprise suite.
- Keep the visual language tightly coupled to the current Ismail9k design system.
- Give every visual component a meaningful `sm`, `md`, and `lg` size.
- Place component appearance in Vue SFC `<style scoped>` blocks.
- Limit global CSS to normalization, fonts, brand tokens, themes, branded element defaults, and
  narrowly scoped accessibility utilities.
- Allow controlled breaking changes before `1.0.0`, with a documented compatibility window and
  migration path.
- Use one headless accessibility dependency for interaction-heavy components.
- Treat light/dark modes, English/Arabic content, LTR/RTL direction, reduced motion, SSR, and
  static generation as first-class requirements.
- Migrate the live website before removing any API or selector on which it depends.

## Non-Goals

The first release will not include enterprise data grids, calendars, date pickers, rich-text
editors, charting, tree views, drag-and-drop builders, or application-specific business widgets.
Those features need their own product and accessibility designs.

The library will not expose a general theme-builder API. Consumers may override documented brand
tokens when necessary, but component-level colors, spacing decisions, and visual variants are not
designed as an unbounded customization surface.

## Architecture

### 1. Global foundations

`src/styles/index.css` will import only these global layers after migration:

1. Normalize
2. Fonts
3. Brand and semantic tokens
4. Light/dark theme values
5. Branded element defaults
6. Accessibility utilities

The existing `primitives` layer will be retired. A temporary legacy stylesheet may preserve
current global selectors during the website migration, but it must not remain in the default
stylesheet after the zero-usage gate is met.

Tokens remain global because scoped components and teleported overlay content both need stable
brand values. Tokens are implementation contracts for the Ismail9k system, not an invitation to
restyle every component independently.

### 2. Shared TypeScript contracts

Shared public types live in focused files under `src/types/` and are re-exported by
`src/index.ts`:

```ts
export type I9kComponentSize = 'sm' | 'md' | 'lg';
export type I9kTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
```

Internal composables under `src/composables/` may coordinate stable IDs, field descriptions,
controlled/uncontrolled state, and toast orchestration. They must not introduce a global state
store or expose Reka UI types through the package API.

### 3. Self-contained Vue components

Every DOM-rendering component owns its template, typed props and emits, and a `<style scoped>`
block in its `.vue` file. Components use readable `i9k-`-prefixed classes and data attributes for
state. Element-only selectors and broad descendant selectors are avoided. Slot appearance uses
internal wrappers or explicit `:slotted()` rules. `:deep()` is permitted only where an internal
headless primitive cannot be styled through an assigned class or state attribute.

Scoped styling is a selector-encapsulation guarantee, not a promise that the production build
will emit one physical CSS file per component. Vite may extract and merge component CSS while
preserving Vue's scope attributes.

### 4. Headless interaction layer

`reka-ui` will be a private runtime dependency used only for components with complex WAI-ARIA,
focus, dismissal, typeahead, collision, or keyboard behavior. Native HTML remains the basis for
buttons, text inputs, textareas, checkboxes, radio inputs, file inputs, and progress elements when
native behavior satisfies the contract.

Consumers import branded components such as `I9kDialog`, `I9kSheet`, and `I9kCombobox`; they do
not import or configure the underlying Reka primitives through this package.

## Size System

Every visual component accepts `size="sm | md | lg"` and defaults to `md`.

- Controls map size to height, inline padding, type scale, icon scale, and internal gap.
- Panels and cards map size to padding, radius, and content spacing.
- Dialogs and sheets map size to content width or maximum width plus internal spacing.
- Layout components map size to gap or density.
- Feedback components map size to padding, icon scale, and typography.
- Separators map size to visual weight and surrounding spacing.

Size does not replace component-specific properties such as `side`, `orientation`, `columns`, or
`placement`. Component stories must display all three sizes side by side so visual drift is easy
to detect.

## Product-Ready Component Inventory

### Actions

- `I9kButton`
- `I9kIconButton`
- `I9kButtonGroup`

### Forms

- `I9kField`
- `I9kInput`
- `I9kTextarea`
- `I9kSelect`
- `I9kCombobox`
- `I9kCheckbox`
- `I9kRadioGroup`
- `I9kSwitch`
- `I9kNumberInput`
- `I9kSearchInput`
- `I9kFileInput`
- `I9kInputGroup`

### Surfaces and layout

- `I9kPanel`
- `I9kCard`
- `I9kGrid`
- `I9kCluster`
- `I9kStack`
- `I9kSeparator`
- `I9kCollapsible`

### Overlays

- `I9kDialog`
- `I9kAlertDialog`
- `I9kSheet`
- `I9kPopover`
- `I9kTooltip`
- `I9kDropdownMenu`
- `I9kCommandMenu`

### Navigation and disclosure

- `I9kTabs`
- `I9kAccordion`
- `I9kBreadcrumbs`
- `I9kPagination`
- `I9kNavigationMenu`
- `I9kStepper`

### Feedback and status

- `I9kAlert`
- `I9kToast`
- `I9kProgress`
- `I9kSpinner`
- `I9kSkeleton`
- `I9kEmptyState`

### Data and content display

- `I9kBadge`
- `I9kAvatar`
- `I9kTable`
- `I9kStat`
- `I9kText`
- `I9kTimelineCard`

The existing branded components remain public: `I9kArticleHeader`, `I9kAsciiEmoji`,
`I9kBlurredCircles`, `I9kBrandWordmark`, `I9kFaqList`, `I9kFooter`, `I9kGithubEmbed`, `I9kIcon`,
`I9kLanguageSwitcher`, `I9kLinkCard`, `I9kNavigation`, `I9kPageHeader`, `I9kProfileCard`,
`I9kSectionHeading`, `I9kSocialLinks`, and `I9kThemeSwitcher`. Each will be migrated to the same
scoped-style and size contracts where a size is visually meaningful.

## Public API Conventions

- Value controls use `modelValue` and emit `update:modelValue`.
- Overlays use controlled `open` plus `update:open` and may accept `defaultOpen` for uncontrolled
  use.
- Native and ARIA attributes reach the actual interactive element rather than an incidental
  wrapper.
- Form controls preserve native names, submission values, autocomplete, required, readonly,
  disabled, focus, and validation behavior.
- `I9kField` connects its label, hint, and error with stable IDs and can provide field state to a
  nested control.
- Components accept named slots for deliberate customization without exposing headless-library
  anatomy.
- Public variant names describe semantic appearance. Pagination buttons and page numbers belong
  to `I9kPagination`, not to special-purpose `I9kButton` variants.
- Link-capable actions continue supporting the existing router-component integration while the
  website is migrated.
- Public types, components, and supported composables are exported from `src/index.ts`.

## State and Behavior

State is local or consumer-controlled. The library does not fetch application data or own route
state. Components emit user intent and leave business decisions to the consuming application.

Toast orchestration is the single provider-based subsystem. `I9kToastProvider`,
`I9kToastViewport`, and `useI9kToast()` manage queued announcements, timeouts, stacking, and
dismissal. The visible `I9kToast` remains directly renderable for simple or server-rendered use.

Dialogs and sheets trap focus, restore it to the opener, close with Escape where dismissal is
allowed, and prevent background interaction while modal. Menus, tabs, selects, and comboboxes
follow their applicable keyboard patterns. Direction is inherited from the document, and all
animation respects `prefers-reduced-motion`.

Invalid prop combinations produce clear development warnings when native semantics cannot express
the issue. Disabled or loading actions cannot emit accidental activation. Component errors are
presented through slots or events; the library does not swallow consumer exceptions.

## Website Compatibility and Migration

The live migration is a release gate, not follow-up cleanup. The authoritative operational ledger
is `docs/migrations/ismail9k-com-component-library.md`.

New scoped components land before legacy selectors are removed. The website's live
`/design-system` route migrates first and acts as a Nuxt/SSR/theme/RTL canary. Remaining pages are
migrated in small batches. A deprecated API or selector can be deleted only when repository
search shows zero live website usages and both repositories pass their verification commands.

The website currently has unrelated uncommitted changes. Implementation must preserve them and
must not start cross-repository edits until a clean, isolated branch or worktree is available.

## Documentation

Storybook is the exhaustive developer reference. Every component receives:

- A default story and an all-sizes story.
- Variant and meaningful state stories.
- Disabled, loading, invalid, empty, and long-content stories where relevant.
- Light/dark and LTR/RTL coverage.
- Keyboard and accessibility notes.
- Typed controls and realistic English and Arabic examples.

The live `ismail9k.com/pages/design-system.vue` page remains a curated public showcase and
integration test. It demonstrates supported components in the real Nuxt application but does not
replace Storybook's exhaustive state matrix.

## Testing and Definition of Done

A component is complete only when it has typed API coverage, scoped styles, all three sizes,
focused Vitest tests, Storybook documentation, accessibility behavior, and public exports.

Automated safeguards will verify:

- Every DOM-rendering component SFC contains scoped styling.
- Global styles do not regain component selectors after the legacy removal milestone.
- Reka UI types and components do not leak through declarations or public exports.
- Native attributes, events, controlled state, and slot contracts work as documented.
- Focus, keyboard navigation, dismissal, portals, and overlays work in a real browser.
- SSR rendering and hydration do not access browser-only APIs too early.
- Storybook's required stories pass automated accessibility checks.
- The library build, declaration build, Storybook build, and package dry run succeed.

The behavioral and contrast target is WCAG 2.2 AA. Static accessibility scans are supplemented by
interaction tests because scanning alone cannot validate focus order, keyboard movement, or focus
restoration.

## Delivery Sequence

1. **Foundation and contracts:** size/state tokens, shared types, dependency boundary,
   scoped-style safeguards, and accessibility test infrastructure.
2. **Existing component migration:** move current component appearance into SFCs while keeping
   temporary compatibility selectors needed by the website.
3. **Actions and forms:** complete action and input families.
4. **Surfaces, layout, and data display:** replace direct primitive-class usage with components.
5. **Overlays and feedback:** deliver interaction-heavy components and toast orchestration.
6. **Navigation and disclosure:** deliver tabs, accordion, breadcrumbs, pagination, navigation,
   and stepper.
7. **Website migration and stabilization:** finish the live migration ledger, remove compatibility
   CSS, validate SSR/static output, and prepare a release candidate.

Each phase ends with independently useful components, focused tests, Storybook documentation,
full repository verification, and a conventional commit.

## Acceptance Criteria

- The product-ready inventory is publicly exported and documented.
- Every visual component renders `sm`, `md`, and `lg` consistently.
- Every DOM-rendering component owns its visual CSS in a scoped SFC block.
- The default global stylesheet contains no component primitive selectors.
- Complex interactions meet documented keyboard and focus contracts.
- Required Storybook accessibility checks pass.
- Light/dark, English/Arabic, LTR/RTL, mobile/desktop, reduced-motion, and SSR cases are verified.
- `ismail9k.com` has zero live usage of retired APIs and selectors.
- Both repositories build successfully before the final compatibility CSS is removed.
- The migration ledger records every changed website file and its verification status.
