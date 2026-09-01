import type { ShowcaseEntry } from './types';

export const I9kNavMenuEntry: ShowcaseEntry = {
  name: 'I9kNavMenu',
  section: 'chrome',
  summary:
    'Mobile navigation: a bars toggle that opens a full-screen panel with the brand, the link list, and a footer slot. Owns the modal behavior — teleport, scroll lock, focus trap, Escape, and closing itself when the viewport passes the desktop breakpoint.',
  agentPrompt: `Use I9kNavMenu from @9klabs/design for the small-screen counterpart to I9kNavigation, whose own menu hides at 768px.

import { I9kNavMenu } from '@9klabs/design';

Props:
- links: I9kNavigationLink[] (required) — the same { id: string; label: string; href: string } shape I9kNavigation takes, so both can be fed from one array. The type is not exported from the package; inline the object shape or declare your own local type.
- open?: boolean (default false) — optional external control. The panel drives itself, so this can be left unbound; bind it with v-model:open when something outside the panel has to close it, such as a router navigation the panel cannot see.
- compact?: boolean (default false) — forwarded to the \`brand\` slot, so the wordmark in the panel head can match whatever the header was showing when the toggle was tapped.
- linkComponent?: string | object | null (default null) — render the menu links with this component instead of a plain <a>, receiving the destination as \`to\` rather than \`href\`. Pass an imported component (RouterLink, NuxtLink), not its name as a string: a string is resolved through resolveDynamicComponent, which does not see locally or compile-time registered components.
- openLabel?: string (default 'Open menu') / closeLabel?: string (default 'Close menu') — accessible names for the toggle and the close button. closeLabel is also the toggle's name while the panel is open.
- menuLabel?: string (default 'Site menu') — accessible name for the panel dialog.
- desktopQuery?: string (default '(min-width: 769px)') — media query that closes the panel when the viewport grows past the breakpoint. Keep it one pixel above the width at which the caller stops showing this component.
- preview?: boolean (default false) — documentation mode. Renders the panel open and in normal flow: no teleport, no fixed positioning, no scroll lock, no focus trap, no toggle, no close button. For specimen pages only; never use it in a real header.

Emits:
- navigate — [link: I9kNavigationLink, event: MouseEvent], fired when a menu link is clicked, just before the panel closes itself.
- update:open — [open: boolean], fired on every open and close, including Escape and the desktop-breakpoint close.

Slots:
- brand — the logo/wordmark in the panel head. Receives one slot prop: compact: boolean, mirroring the compact prop.
- footer — the block pinned to the bottom of the panel, above the safe-area padding: theme and language controls, a primary call to action. Rendered in a grid; supply the rows.

Active links: with a router link component the panel styles the active route itself, from the \`router-link-active\` class and \`aria-current="page"\` that vue-router sets — the active link takes the primary color and reveals its trailing caret.

IMPORTANT: this component only renders the toggle and the panel — it has no breakpoint of its own. Hide it above the breakpoint from the caller, the way I9kNavigation hides its own menu below it.

Usage:
<I9kNavMenu :links="links" :link-component="NuxtLink" :compact="compact" @navigate="onNavigate">
  <template #brand="{ compact }"><I9kBrandWordmark :compact="compact" /></template>
  <template #footer><I9kButton variant="primary" href="/contact">Work with me</I9kButton></template>
</I9kNavMenu>`,
  gotchas: [
    'The component renders at every width — it has no breakpoint of its own. Hide it above the breakpoint from the caller, and keep `desktopQuery` one pixel above that width so a resize closes an open panel.',
    'The panel is teleported to `<body>`, so no CSS scoped to the header that mounts this component can reach it; style the panel through the `brand` and `footer` slots instead.',
    'Without `linkComponent` the menu renders plain `<a href>`, so in a router app every click is a full page load — pass the router link component (RouterLink, NuxtLink) as an imported component, not a string name.',
    'The panel closes itself on a link click, but it cannot see a navigation started from `footer` slot content (a language switcher, a call to action) or from the browser back button — bind `v-model:open` and close it from the consumer for those.',
    '`preview` is for specimen pages only: it strips the teleport, the focus trap, the scroll lock, and both buttons, leaving a bounded box that documents the composition.',
  ],
  demos: [
    {
      label: 'Panel composition',
      code: `<I9kNavMenu
  preview
  :links="[
    { id: 'blog', label: 'Blog', href: '/blog' },
    { id: 'projects', label: 'Projects', href: '/projects' },
    { id: 'talks', label: 'Talks', href: '/talks' },
  ]"
>
  <template #brand><I9kBrandWordmark /></template>
  <template #footer>
    <I9kButton variant="primary" href="/contact">Work with me</I9kButton>
  </template>
</I9kNavMenu>`,
    },
    {
      label: 'Toggle and panel',
      code: `<I9kNavMenu :links="links" open-label="Open menu" close-label="Close menu">
  <template #brand><I9kBrandWordmark /></template>
</I9kNavMenu>`,
      state: {
        links: [
          { id: 'blog', label: 'Blog', href: '/blog' },
          { id: 'projects', label: 'Projects', href: '/projects' },
        ],
      },
    },
  ],
};
