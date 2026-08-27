# Checkbox and Radio Controls Design

## Goal

Move the existing 9k.school course-checkbox treatment into the shared design system and refine
the default radio treatment so both controls share a deliberate visual rhythm, align correctly in
Arabic and mixed-direction labels, and retain distinct checkbox and radio semantics.

## Scope

- Add a public `I9kCheckboxGroup` component and `I9kCheckboxOption` type.
- Preserve the current 9k.school checkbox appearance: a compact rounded square, checkmark,
  primary selected fill, and accent keyboard-focus ring.
- Replace the native-looking default radio with a custom circular mark using the same dimensions,
  spacing, color tokens, and focus treatment as the checkbox.
- Keep the existing `I9kRadioGroup` public API and card variant behavior.
- Replace the page-local 9k.school checkbox markup and styles with `I9kCheckboxGroup`.
- Add Storybook coverage for sizes, disabled states, errors, horizontal layout, and RTL.

## Component API

`I9kCheckboxGroup` follows the established `I9kRadioGroup` field contract:

- `modelValue: readonly string[]`
- `options: readonly I9kCheckboxOption[]`
- `legend: string`
- optional `name`, `hint`, `error`, `required`, `disabled`, and `size`
- optional `orientation`, defaulting to `vertical`
- emits `update:modelValue` with a new string array

`I9kCheckboxOption` contains `label`, `value`, and optional `description` and `disabled` fields.
The component renders a native fieldset and native checkbox inputs so form behavior, keyboard
interaction, and assistive-technology semantics do not depend on JavaScript simulations.

The checkbox group deliberately does not add a card variant. No current use case requires it,
and the requested visual treatment is the compact default control.

## Visual Design

Both default controls use a shared 1.35rem mark at medium size, scaled through component-local
custom properties for `sm`, `md`, and `lg`. Each option uses a two-column logical grid: mark then
copy. A logical block-start offset centers the mark on the label's first line, including when the
copy wraps, and CSS writing direction places it correctly in both LTR and RTL layouts.

Checkboxes remain rounded squares. Their checked state uses the primary text color as the fill,
with a contrasting checkmark. Radios use a circle with a filled primary selected state and a
centered contrasting dot. This makes the family visually consistent without making single-select
and multi-select choices indistinguishable.

The native input remains in the accessibility tree but is visually hidden. Focus is drawn on the
custom mark with the existing accent-colored three-pixel outline. Disabled options reduce opacity
and remove the pointer cursor. Horizontal groups wrap and use separate row and column gaps so
mixed Arabic/English labels remain readable rather than visually colliding.

The radio card variant continues to hide the compact mark and uses its existing selected card,
hover, focus, responsive, and reduced-motion behavior.

## State and Data Flow

For each checkbox change, the component copies `modelValue`, adds or removes the changed option
value, and emits the new array. It never mutates the prop. Option order in the emitted value follows
the order in which values already exist, with newly selected values appended, matching native user
interaction and the current page behavior.

`I9kRadioGroup` keeps its existing scalar `modelValue` emission. Its behavior does not change;
only default-control markup and styling are refined.

On 9k.school, course records are mapped to checkbox options with the course slug as `value` and
title as `label`. The existing `selectedCourses` ref remains the source of truth, so submission and
validation behavior stay unchanged.

## Accessibility and Error Handling

- The legend remains the accessible group name.
- Hint and error IDs are merged with consumer-provided `aria-describedby` values.
- A component error forces `aria-invalid="true"`; other explicit ARIA-invalid values are preserved.
- When the group is required and empty, its native checkboxes receive `required`; once one value is
  selected the requirement clears. This expresses "choose at least one" without requiring every
  option.
- Disabled group and per-option states are reflected on the native inputs.
- Option descriptions are associated with their own input and the group hint or error.
- Custom marks are decorative and hidden from assistive technology.

## Testing and Verification

Design-system tests will cover rendering, immutable array updates, required and disabled states,
description/error associations, forwarded attributes, public exports, size/orientation classes,
and the custom-control style contract. Tests are written first and observed failing before the
component implementation.

9k.school tests will confirm that the questionnaire renders `I9kCheckboxGroup`, preserves selected
course submission, and no longer carries the page-local checkbox visual classes. Verification
includes the focused test suites, design-system formatting/lint/type checks and build, then the
school lint, typecheck, and relevant Nuxt tests.
