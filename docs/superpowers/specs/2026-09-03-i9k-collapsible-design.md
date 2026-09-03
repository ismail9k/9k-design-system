# I9kCollapsible Design

Intent-Issue: #9 — https://github.com/the9klabs/design/issues/9

## Goal

Add a reusable disclosure primitive to 9k.design so products can present independently expanding
sections with the same semantics, interaction states, and brand treatment. Replace the private
disclosure markup inside `I9kFaqList` with this primitive without changing the FAQ component's
public API.

## Scope

- Add and publicly export `I9kCollapsible`.
- Render native `details` and `summary` elements.
- Accept rich summary and body markup through named and default slots.
- Support an initially open state and notify consumers after the native open state changes.
- Give the component its own scoped surface, spacing, indicator, hover, focus, dark-theme, RTL,
  and reduced-motion treatment.
- Refactor `I9kFaqList` to compose `I9kCollapsible` internally while preserving its `items` prop
  and rendered question-and-answer behavior.
- Document the component in Storybook and the agent-facing showcase.

Changing the 9k.school course page is not part of this repository change. That consumer will be
updated after a design-system revision containing this component is available.

## Component API

The public usage is:

```vue
<I9kCollapsible :default-open="true" @toggle="onToggle">
  <template #summary>
    Any text or rich summary markup
  </template>

  Any nested content
</I9kCollapsible>
```

The component exposes one optional prop:

- `defaultOpen?: boolean`, defaulting to `false`. It sets the native disclosure's initial state
  and is not a controlled-state API.

It exposes one event:

- `toggle(open: boolean)`, emitted from the native `toggle` event with the current `details.open`
  value.

It exposes two slots:

- `summary`, rendered inside the native `summary` element.
- `default`, rendered in the collapsible body.

The component does not coordinate with sibling instances. Each instance retains its own native
open state, so any number of collapsibles may be open simultaneously. Controlled state, exclusive
accordion groups, disabled disclosures, size variants, and animation-duration props are outside
the current scope.

## Markup and State Flow

`I9kCollapsible` renders one root `details` element. Its first child is `summary`; the body slot is
wrapped by one presentational content element so the component can own body spacing without
constraining the caller's markup.

`defaultOpen` is read when the native element is created. After that, the browser owns expansion
and collapse. On each native toggle, the component reads `event.currentTarget.open` and emits the
boolean value. It does not mirror the value into Vue state, preventing parent rerenders from
unexpectedly resetting a disclosure the user has opened or closed.

## Visual Design

The root is a quiet branded surface using existing theme, border, radius, spacing, and transition
tokens. The summary uses a logical two-column layout: caller content fills the available space and
a decorative disclosure indicator occupies the inline end. Logical properties keep the indicator
correct in Arabic and English without direction-specific markup.

Hover adjusts the surface or border with existing theme colors. `:focus-visible` draws the
design-system focus ring around the summary. The indicator rotates when open; the body appears
below a deliberate gap and remains free to contain lists, paragraphs, or structured product UI.
Dark mode inherits theme tokens rather than adding a separate palette. Under reduced-motion, the
indicator and surface transitions are disabled.

## I9kFaqList Integration

`I9kFaqList` keeps its existing `items: I9kFaqItem[]` prop and public export. It renders one
`I9kCollapsible` per item, placing `item.question` in the summary slot and the existing paragraph
answer in the default slot. The list continues to own spacing between FAQ items; the shared
component owns each disclosure's surface and interaction states.

No new FAQ props or events are introduced. Questions and answers remain strings, keys remain based
on the question, and all current consumers continue to compile without changes.

## Accessibility

- Native `details` and `summary` preserve keyboard activation and disclosure semantics without
  recreating them in JavaScript.
- The summary remains the first child of `details`.
- The disclosure indicator is decorative and hidden from assistive technology.
- Focus is visible for keyboard users in both light and dark themes.
- Slotted markup remains owned by the consumer, allowing headings, counts, and nested lists while
  retaining their native semantics.

## Documentation and Testing

Tests are written first and observed failing before implementation. Component tests cover native
markup, both slots, closed and initially open states, repeated independent instances, and the
boolean toggle payload. FAQ regression tests confirm that `I9kFaqList` composes
`I9kCollapsible`, preserves its prop API, and renders all questions and answers.

Contract tests are updated for the public export and scoped-style root. Storybook includes closed,
initially open, rich-summary, multiple-independent, and RTL examples. The showcase registry gains
the required component summary, agent prompt, gotchas, demos, and generated API metadata.

Verification runs the focused Vitest files followed by formatting, linting, type checking, the
library build, Storybook build, showcase build, and the repository's complete check command.
