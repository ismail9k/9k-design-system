# Native Actions and Form Foundations Design

**Status:** Approved in chat on 2026-08-24, pending written-spec review

## Goal

Deliver the first independently useful slice of Phase 3 from the approved component-library
roadmap. This slice completes the small action primitives and establishes the native form-field
contract needed by the live inquiry form, while preserving the existing website and the current
Ismail9k visual language.

The phase adds six public components:

- `I9kIconButton`
- `I9kButtonGroup`
- `I9kField`
- `I9kTextarea`
- `I9kSelect`
- `I9kRadioGroup`

It also integrates `I9kInput` with `I9kField` without removing or breaking the existing
standalone label, hint, error, native-attribute, and `uiSize` API.

## Clean-Context Boundary

Implementation starts from merge commit `e9b97da8fc8b1bb15f79bb0088cd1948cbef37d8` in the
isolated worktree `.worktrees/native-actions-form-foundations` on branch
`feat/native-actions-form-foundations`.

The uncommitted `stories/I9kButton.stories.ts` change in the main checkout is user-owned and must
not enter this branch. Implementation and review agents receive only this spec, the implementation
plan, their bounded task brief, and the necessary repository files. They use clean context rather
than inherited conversation history.

## Scope

### Included

- Typed public APIs and exports for the six new components.
- A private field-context composable for stable control, hint, and error associations.
- `sm`, `md`, and `lg` presentation for every new visual component, defaulting to `md`.
- Vue SFC `<style scoped>` ownership with `i9k-`-prefixed classes.
- Native attribute forwarding to the actual button, link, input, textarea, select, radio, or group
  element as appropriate.
- Light/dark, LTR/RTL, disabled, invalid, required, long-content, and reduced-motion behavior.
- Focused Vitest tests, compiled-style regressions where selector behavior matters, Storybook
  documentation, scoped-style safeguards, and package dry-run verification.
- Migration-ledger updates marking only the package replacements made ready by this phase.

### Excluded

- Website source changes or removal of any compatibility selector.
- `I9kCheckbox`, `I9kSwitch`, `I9kNumberInput`, `I9kSearchInput`, `I9kFileInput`, or
  `I9kInputGroup`; these remain in the next native-form slice.
- `I9kCombobox`; it remains in the interaction-heavy form slice.
- Removal or renaming of current `I9kButton` variants.
- `reka-ui`; all interactions in this phase are correctly served by native HTML.
- Form validation policy, schema validation, submission, data fetching, or application state.

## Design Principles

1. Native semantics come first. Buttons, links, textareas, selects, fieldsets, legends, and radio
   inputs retain their browser behavior.
2. Field association is automatic for library controls and explicit for arbitrary slotted native
   controls.
3. Consumer attributes reach the native interactive element rather than a visual wrapper.
4. The medium default matches the existing design system; new sizes scale density without
   changing semantics.
5. Scoped CSS owns all new appearance. No new component selector is added to global CSS.
6. Current website compatibility is preserved until its isolated migration phase.

## Shared Contracts

### Field context

A private composable under `src/composables/` defines the contract shared by `I9kField`,
`I9kInput`, `I9kTextarea`, and `I9kSelect`.

The provided context contains:

- the stable native control ID;
- the active hint or error description ID;
- invalid and required state;
- the field size;
- whether a library control has registered with the field.

`I9kField` uses Vue `useId()` when the consumer does not provide an explicit control ID. IDs must
be SSR-safe and deterministic across server rendering and hydration.

An explicit control `uiSize` wins over the enclosing field size. The enclosing field size wins
over the standalone `md` default.

When a consumer supplies `aria-describedby`, the component appends the active field description
ID rather than replacing the consumer value. Duplicate IDs are removed while preserving order.
An active error sets `aria-invalid="true"`; otherwise an explicit consumer value is preserved.

### Public types

Focused public types are exported from `src/index.ts`:

```ts
export type I9kIconButtonVariant = 'secondary' | 'primary' | 'ghost';

export interface I9kRadioOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}
```

Headless-library types and private field-context types are not public.

## Component APIs

### `I9kIconButton`

Purpose: a compact icon-only action or link with a required accessible name.

Props:

- `icon`: required `I9kIconName`.
- `label`: required non-empty accessible label.
- `variant`: `secondary | primary | ghost`, default `secondary`.
- `size`: `sm | md | lg`, default `md`.
- `type`: `button | submit | reset`, default `button` for button rendering.
- `href`, `to`, and `linkComponent`: follow the existing router/link integration used by
  `I9kButton`.

The component renders a native button unless a link destination is provided. It forwards native
attributes to that root element and renders `I9kIcon` decoratively. The root receives
`aria-label=label`; the visual icon cannot become a second accessible name. Disabled button
behavior remains native. Link consumers use `aria-disabled` and application navigation policy
rather than a fake disabled anchor API.

The secondary appearance follows the current outlined button, primary follows the branded pill
action, and ghost removes the visible surface while retaining hover and focus feedback. Each size
uses the shared control-height and icon-size scale. Reduced motion removes hover transforms and
transitions.

### `I9kButtonGroup`

Purpose: give related actions a semantic group and controlled spacing.

Props:

- `size`: `sm | md | lg`, default `md`; maps to group gap.
- `orientation`: `horizontal | vertical`, default `horizontal`.
- `label`: optional accessible group label.

The root is a `div` with `role="group"`, optional `aria-label`, an orientation data attribute, and
a default slot. It does not silently mutate child button props. Consumers choose child sizes when
they need them to differ from `md`; the group size controls density only. Horizontal layout wraps,
uses logical properties, and works unchanged in RTL. Vertical layout does not wrap.

### `I9kField`

Purpose: own the label, hint, error, stable IDs, and layout for one native form control.

Props:

- `label`: optional only when the `label` slot is supplied.
- `hint`: optional supporting text.
- `error`: optional validation message; when present, it replaces the visible hint.
- `required`: boolean, default `false`.
- `size`: `sm | md | lg`, default `md`.
- `controlId`: optional explicit native control ID.

Slots:

- `label`: replaces label text while remaining inside the component label element.
- default scoped slot: receives `controlId`, `describedBy`, `invalid`, `required`, and `size` so an
  arbitrary native control can opt into the same association contract.

The component renders one visible label, the default slot, then either hint or error. Error text
uses `role="alert"`. A development warning is emitted when neither the label prop nor label slot
is present. Another warning is emitted when more than one library field control registers, because
one label cannot safely target multiple controls.

### `I9kInput` integration

Inside `I9kField`, `I9kInput` renders only its native input and consumes field context for ID,
description, invalid, required, and size. Its `label`, `hint`, and `error` props remain supported
outside `I9kField`, where the existing self-contained markup and medium appearance remain the
compatibility contract.

`label` becomes optional at the TypeScript level so field composition is possible. A standalone
input without a label prop must receive an accessible name through native attributes; in
development, the component warns when neither `label`, `aria-label`, nor `aria-labelledby` is
available.

The native HTML `size` attribute continues to forward to the input. Visual size remains `uiSize`.
An explicit `id` is respected for standalone rendering. Inside `I9kField`, `controlId` is the
authoritative ID; a conflicting input `id` produces a development warning rather than breaking
the label association.

### `I9kTextarea`

Purpose: a multiline value control that composes with `I9kField`.

Props:

- `modelValue`: string.
- `uiSize`: optional `sm | md | lg`; inherits the field and otherwise defaults to `md`.
- `resize`: `vertical | horizontal | both | none`, default `vertical`.

It emits `update:modelValue` with the native string value. Native attributes including `name`,
`rows`, `minlength`, `maxlength`, `autocomplete`, `required`, `readonly`, and `disabled` reach the
textarea. Standalone use requires an accessible name through native attributes. The component
does not duplicate label, hint, or error rendering; those belong to `I9kField`.

### `I9kSelect`

Purpose: a branded native single-select control that composes with `I9kField`.

Props:

- `modelValue`: string.
- `uiSize`: optional `sm | md | lg`; inherits the field and otherwise defaults to `md`.

It emits `update:modelValue` from the native change event. Consumers provide native `option` and
`optgroup` elements through the default slot, preserving browser semantics and flexible localized
content. Native `name`, `autocomplete`, `required`, and `disabled` attributes reach the select.
The native `size` and `multiple` modes are outside this component contract because they represent
a different interaction and layout; the component emits a development warning and does not
forward those two attributes. A later listbox component may cover that need.

### `I9kRadioGroup`

Purpose: a self-contained native radio fieldset supporting ordinary and card-style choices.

Props:

- `modelValue`: string.
- `options`: readonly `I9kRadioOption[]`.
- `legend`: required visible legend text.
- `name`: optional native name; a stable generated value is used when omitted.
- `hint` and `error`: optional supporting or validation text; error replaces hint.
- `required` and `disabled`: booleans, default `false`.
- `size`: `sm | md | lg`, default `md`.
- `variant`: `default | card`, default `default`.
- `orientation`: `vertical | horizontal`, default `vertical` for the default variant.

The root is a native `fieldset` with a `legend`. Each option is a native radio input inside a
label. Shared `name` preserves browser arrow-key navigation and single-selection behavior. The
component emits `update:modelValue` on native change. Option descriptions receive stable IDs and
are referenced by their radio inputs. Group errors are announced and the fieldset is marked
invalid without making decorative text part of the option name.

The card variant matches the current inquiry-intent visual language: bordered glass cards,
selected primary treatment, strong focus-visible outline, responsive one-column fallback, logical
properties, and no hover lift under reduced motion.

## Styling

Every new component owns one scoped style block and uses only `i9k-`-prefixed component classes.
Shared global tokens remain the source for control heights, type scales, gaps, colors, borders,
radii, elevation, and motion.

The form controls share visual decisions but do not introduce a new global primitive selector.
Small, repeated declarations may remain in each SFC until a private build-time styling mechanism
has a demonstrated need; public CSS utilities or unscoped modules are not introduced.

Focus-visible outlines must remain visible in light and dark themes. Disabled controls keep native
behavior and use reduced opacity without removing semantic state. Invalid controls use the current
accent color and never depend on color alone because the associated error text is present.

## Accessibility and Behavior

- All icon-only actions have a non-empty accessible name.
- Labels target the real native control ID.
- Hint and error IDs reach `aria-describedby` without erasing consumer-provided IDs.
- Required, readonly, disabled, autocomplete, name, and value semantics remain native.
- Radio groups use a native fieldset, legend, shared name, and radio inputs.
- Direction is inherited; layouts use logical properties and preserve natural RTL order.
- Motion honors `prefers-reduced-motion: reduce`.
- Components do not access browser-only APIs during setup, so SSR rendering remains safe.

## Storybook

Each component receives a default story and an all-sizes story. Additional stories cover:

- IconButton variants, disabled state, and router/link rendering.
- ButtonGroup horizontal, vertical, wrapping, and RTL layouts.
- Field hint, error, required, long label, and arbitrary native-control composition.
- Input standalone compatibility and Field composition.
- Textarea resizing, readonly, disabled, and long content.
- Select placeholder-option, disabled, invalid, and Arabic option content.
- RadioGroup default/card variants, selected, disabled option, group disabled, invalid, long
  descriptions, RTL, and Arabic content.

Dark-mode coverage uses the existing Storybook color-mode global. RTL stories wrap the component
in a `dir="rtl"` ancestor rather than forcing direction inside the component.

## Testing

Vitest and Vue Test Utils cover public behavior rather than internal implementation details:

- public rendering and default `md` sizing;
- all size and variant classes;
- native attribute forwarding and event payloads;
- link/button root selection for IconButton;
- group semantics and orientation;
- stable label, hint, and error associations;
- consumer and field `aria-describedby` merging;
- Input standalone compatibility and nested Field rendering;
- Textarea and Select value updates;
- native RadioGroup fieldset, legend, name, descriptions, disabled states, and updates;
- development warnings for invalid field composition;
- SSR rendering smoke tests for all new components;
- scoped-style safeguards and focused compiled-CSS assertions where Vue selector compilation can
  change behavior.

The implementation follows red-green-refactor for every behavioral change. The final branch runs
`npm run check`, `npm pack --dry-run`, `git diff --check`, and a visual Storybook review covering
light, dark, LTR, RTL, and all sizes.

## Migration and Compatibility

This phase changes only the package. It marks the following replacements as package-ready in the
migration ledger:

- `.field*` label/hint/error layout through `I9kField`;
- native text input composition through the updated `I9kInput`;
- native multiline controls through `I9kTextarea`;
- native single-select controls through `I9kSelect`;
- inquiry intent choices through `I9kRadioGroup variant="card"`.

The website continues using its existing local components and global compatibility rules. No
legacy selector, prop, or current `I9kInput` standalone behavior is removed. Actual website
adoption remains a later isolated migration batch with its own review and rollback boundary.

## Acceptance Criteria

- Six new components and their public types are exported from `src/index.ts`.
- Every new visual component supports a meaningful `sm`, `md`, and `lg` presentation.
- Every new component SFC owns scoped, prefixed styles and adds no global component selector.
- `I9kInput` works unchanged standalone and composes without duplicate field chrome inside
  `I9kField`.
- Field labels, hints, errors, consumer description IDs, invalid state, and required state are
  correctly associated with the real native control.
- IconButton button/link semantics and accessible naming are correct.
- RadioGroup preserves native keyboard and form behavior in both default and card appearances.
- Stories and tests cover the documented state matrix.
- The branch contains none of the user-owned main-worktree modification.
- Full repository and package verification pass with no generated outputs committed.
