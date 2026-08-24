# Scoped Existing Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the four remaining legacy-dependent package components scoped style ownership and
consistent `sm`, `md`, and `lg` sizing without breaking the current `ismail9k.com` consumer.

**Architecture:** Each component keeps its emitted legacy classes during the compatibility window
and adds an `i9k-`-prefixed scoped contract beside them. Existing global primitive rules remain in
`primitives.css` until the website migration reaches zero usage. `I9kTimelineCard` adds semantic
title and thumbnail slot wrappers while preserving the current default-slot markup contract.

**Tech Stack:** Vue 3 SFCs, TypeScript, scoped CSS, Vitest, Vue Test Utils, Storybook 10, Vite.

**Spec:** `docs/superpowers/specs/2026-08-23-component-library-design.md`

## Global Constraints

- Keep the visual language tightly coupled to the current Ismail9k design system.
- Every migrated visual component supports `sm`, `md`, and `lg` and defaults to `md`.
- Component appearance lives in Vue SFC `<style scoped>` blocks with `i9k-`-prefixed classes.
- Keep legacy classes and global compatibility selectors until `ismail9k.com` reaches zero usage.
- Preserve light/dark modes, English/Arabic content, LTR/RTL direction, reduced motion, SSR, and
  static-generation behavior.
- Use native HTML and existing Vue behavior; this phase adds no runtime dependency.
- Public and native attributes must reach the actual rendered element.
- Test filenames follow `I9k<ComponentName>.test.ts` with no extra dot segments.
- Do not edit `dist/` or `storybook-static/`.

## Phase Boundary

This plan migrates only `I9kAsciiEmoji`, `I9kLinkCard`, `I9kProfileCard`, and
`I9kTimelineCard`. It does not add general-purpose `I9kPanel`, `I9kBadge`, `I9kGrid`,
`I9kCluster`, `I9kStack`, or `I9kStat` components and does not edit the website repository.

## File Structure

- `src/components/I9kAsciiEmoji.vue`: owns ASCII emoji size, color, and accessible rendering.
- `src/components/I9kLinkCard.vue`: owns interactive surface, badge, image, and size appearance.
- `src/components/I9kProfileCard.vue`: owns profile surface, avatar, content, actions, and sizing.
- `src/components/I9kTimelineCard.vue`: owns timeline layout, rail, semantic slots, and sizing.
- `tests/I9kAsciiEmoji.test.ts`: ASCII emoji public rendering and size tests.
- `tests/I9kLinkCard.test.ts`: link semantics, events, badge, and size tests.
- `tests/I9kProfileCard.test.ts`: avatar, slot, compatibility, and size tests.
- `tests/I9kTimelineCard.test.ts`: UTC date, semantic slots, compatibility, and size tests.
- `tests/I9kScopedStyles.test.ts`: scoped-style ownership safeguard.
- Matching files in `stories/`: default, all-sizes, dark-ready, and RTL examples.
- `src/styles/primitives.css`: comments only; compatibility declarations remain unchanged.
- `README.md` and `docs/migrations/ismail9k-com-component-library.md`: public sizing and migration
  guidance.

---

### Task 1: Scope I9kAsciiEmoji

**Files:**

- Modify: `src/components/I9kAsciiEmoji.vue`
- Create: `tests/I9kAsciiEmoji.test.ts`
- Modify: `stories/I9kAsciiEmoji.stories.ts`
- Modify: `src/styles/primitives.css`

**Interfaces:**

- Consumes: `I9kComponentSize` from `src/types/components.ts`.
- Produces: unchanged `name`, `label`, `size`, and `color` props; legacy `emoticon*` classes; new
  scoped `i9k-ascii-emoji*` classes.

- [ ] **Step 1: Write the failing component tests**

Create `tests/I9kAsciiEmoji.test.ts`:

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kAsciiEmoji from '../src/components/I9kAsciiEmoji.vue';

describe('I9kAsciiEmoji', () => {
  it('renders the built-in accessible label and medium size by default', () => {
    const wrapper = mount(I9kAsciiEmoji, { props: { name: '^_^' } });

    expect(wrapper.attributes('role')).toBe('img');
    expect(wrapper.attributes('aria-label')).toBe('happy');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'emoticon',
        'emoticon--md',
        'i9k-ascii-emoji',
        'i9k-ascii-emoji--md',
        'i9k-ascii-emoji--primary',
      ]),
    );
  });

  it('uses an explicit accessible label', () => {
    const wrapper = mount(I9kAsciiEmoji, {
      props: { name: 'o_o', label: 'Unexpected result' },
    });

    expect(wrapper.attributes('aria-label')).toBe('Unexpected result');
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s size', (size) => {
    const wrapper = mount(I9kAsciiEmoji, { props: { name: '·ᴗ·', size } });

    expect(wrapper.classes()).toContain(`i9k-ascii-emoji--${size}`);
    expect(wrapper.classes()).toContain(`emoticon--${size}`);
  });
});
```

- [ ] **Step 2: Run the test and verify red**

Run: `npm test -- tests/I9kAsciiEmoji.test.ts`

Expected: FAIL because the `i9k-ascii-emoji` classes do not exist.

- [ ] **Step 3: Add the scoped class contract**

In `I9kAsciiEmoji.vue`, import `I9kComponentSize`, replace the literal size union, and bind both
class families:

```ts
import type { I9kComponentSize } from '../types/components';
```

```ts
size?: I9kComponentSize;
```

```vue
:class="[ 'emoticon', `emoticon--${size}`, `emoticon--${color}`, 'i9k-ascii-emoji',
`i9k-ascii-emoji--${size}`, `i9k-ascii-emoji--${color}`, ]"
```

- [ ] **Step 4: Add the complete scoped stylesheet**

Append to `I9kAsciiEmoji.vue`:

```css
<style scoped>
.i9k-ascii-emoji {
  display: inline-block;
  color: var(--primary-text-color);
  font-family:
    ui-monospace, 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.08em;
  line-height: 1;
  white-space: nowrap;
  text-rendering: optimizeSpeed;
}

.i9k-ascii-emoji--sm {
  font-size: 1rem;
}

.i9k-ascii-emoji--lg {
  font-size: 2rem;
}

.i9k-ascii-emoji--accent {
  color: var(--accent-color);
}

.i9k-ascii-emoji--muted {
  color: var(--text-color-light);
}

.i9k-ascii-emoji--current {
  color: currentColor;
}
</style>
```

- [ ] **Step 5: Extend Storybook**

Add a `Sizes` story with all three sizes and keep `ExpressionSet`. Use an inline-flex wrapper with
`gap: var(--component-gap-md)` so the story does not depend on `.cluster`:

```ts
export const Sizes: Story = {
  render: () => ({
    components: { I9kAsciiEmoji },
    template:
      '<div style="display: inline-flex; align-items: center; gap: var(--component-gap-md)"><I9kAsciiEmoji name="^_^" size="sm" /><I9kAsciiEmoji name="^_^" size="md" /><I9kAsciiEmoji name="^_^" size="lg" /></div>',
  }),
};
```

- [ ] **Step 6: Mark global styles as compatibility-only**

Add this comment immediately before the `.emoticon` block without deleting declarations:

```css
/* Temporary website compatibility. I9kAsciiEmoji owns its appearance in scoped SFC styles;
   remove this block only after the migration ledger reports zero .emoticon usage. */
```

- [ ] **Step 7: Verify and commit**

Run:

```bash
npm test -- tests/I9kAsciiEmoji.test.ts
npm run typecheck
```

Expected: both PASS.

Commit:

```bash
git add src/components/I9kAsciiEmoji.vue src/styles/primitives.css stories/I9kAsciiEmoji.stories.ts tests/I9kAsciiEmoji.test.ts
git commit -m "feat: scope ascii emoji styles"
```

---

### Task 2: Scope and size I9kLinkCard

**Files:**

- Modify: `src/components/I9kLinkCard.vue`
- Create: `tests/I9kLinkCard.test.ts`
- Modify: `stories/I9kLinkCard.stories.ts`
- Modify: `src/styles/primitives.css`

**Interfaces:**

- Consumes: `I9kComponentSize` and existing brand tokens.
- Produces: `size?: I9kComponentSize`, default `md`; legacy `surface`, `surface--interactive`,
  `badge`, and `badge--solid` classes; scoped `i9k-link-card*` classes.

- [ ] **Step 1: Write the failing LinkCard tests**

Create `tests/I9kLinkCard.test.ts`:

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kLinkCard from '../src/components/I9kLinkCard.vue';

const requiredProps = {
  name: 'Vue Carousel',
  url: 'https://example.com/project',
  description: 'A carousel for Vue applications.',
};

describe('I9kLinkCard', () => {
  it('preserves external-link semantics and emits click intent', async () => {
    const wrapper = mount(I9kLinkCard, { props: requiredProps });

    expect(wrapper.attributes('href')).toBe(requiredProps.url);
    expect(wrapper.attributes('target')).toBe('_blank');
    expect(wrapper.attributes('rel')).toBe('noopener');

    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('uses scoped and compatibility classes at the medium size by default', () => {
    const wrapper = mount(I9kLinkCard, { props: requiredProps });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'surface',
        'surface--interactive',
        'link-card',
        'i9k-link-card',
        'i9k-link-card--md',
      ]),
    );
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s size', (size) => {
    const wrapper = mount(I9kLinkCard, { props: { ...requiredProps, size } });

    expect(wrapper.classes()).toContain(`i9k-link-card--${size}`);
  });

  it('renders a scoped compatibility badge', () => {
    const wrapper = mount(I9kLinkCard, {
      props: { ...requiredProps, badge: 'Library' },
    });

    expect(wrapper.get('.i9k-link-card__badge').classes()).toEqual(
      expect.arrayContaining(['badge', 'badge--solid', 'link-card-badge']),
    );
  });
});
```

- [ ] **Step 2: Run the test and verify red**

Run: `npm test -- tests/I9kLinkCard.test.ts`

Expected: FAIL because `size` and scoped link-card classes do not exist.

- [ ] **Step 3: Add size and scoped classes**

Import `I9kComponentSize`, add `size?: I9kComponentSize`, and add `size: 'md'` to the defaults.
Use these bindings:

```vue
class="surface surface--interactive link-card i9k-link-card" :class="`i9k-link-card--${size}`"
```

```vue
class="badge badge--solid link-card-badge i9k-link-card__badge"
```

Add `i9k-link-card__image`, `i9k-link-card__body`, `i9k-link-card__name`,
`i9k-link-card__description`, and `i9k-link-card__arrow` beside their legacy classes.

- [ ] **Step 4: Make the scoped root own the surface and size variables**

Prepend the existing scoped stylesheet with:

```css
.i9k-link-card {
  --i9k-link-card-padding: var(--spacing-11);
  --i9k-link-card-image-size: 3.75rem;
  --i9k-link-card-name-size: 1.05rem;
  --i9k-link-card-description-size: 0.95rem;

  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  cursor: pointer;
  transition: var(--transition);
}

.i9k-link-card:hover {
  transform: translateY(var(--lift));
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
}

.i9k-link-card--sm {
  --i9k-link-card-padding: var(--spacing-8);
  --i9k-link-card-image-size: 3rem;
  --i9k-link-card-name-size: 0.95rem;
  --i9k-link-card-description-size: 0.875rem;
}

.i9k-link-card--lg {
  --i9k-link-card-padding: var(--spacing-13);
  --i9k-link-card-image-size: 4.5rem;
  --i9k-link-card-name-size: 1.125rem;
  --i9k-link-card-description-size: 1rem;
}
```

Update existing declarations to consume the variables:

```css
.link-card {
  padding: var(--i9k-link-card-padding);
}

.link-card-image {
  width: var(--i9k-link-card-image-size);
  height: var(--i9k-link-card-image-size);
}

.link-card-name {
  font-size: var(--i9k-link-card-name-size);
}

.link-card-description {
  font-size: var(--i9k-link-card-description-size);
}
```

Add the badge appearance while keeping the existing positional `.link-card-badge` declarations:

```css
.i9k-link-card__badge {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-1) var(--spacing-5);
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  background: var(--primary-color);
  color: var(--on-primary-color);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  white-space: nowrap;
  transition: var(--transition);
}
```

Add reduced-motion behavior:

```css
@media (prefers-reduced-motion: reduce) {
  .i9k-link-card,
  .link-card-name,
  .link-card-arrow {
    transition: none;
  }

  .i9k-link-card:hover,
  .link-card:hover .link-card-arrow {
    transform: none;
  }
}
```

- [ ] **Step 5: Add Storybook size coverage**

Add this `argTypes` entry and a `Sizes` story that does not depend on `.grid`. Keep
`RightToLeft`:

```ts
argTypes: {
  size: { control: 'select', options: ['sm', 'md', 'lg'] },
},
```

```ts
export const Sizes: Story = {
  render: () => ({
    components: { I9kLinkCard },
    template:
      '<div style="display: grid; gap: var(--component-gap-md)"><I9kLinkCard size="sm" name="Small card" url="https://example.com/small" description="Compact link card" /><I9kLinkCard size="md" name="Medium card" url="https://example.com/medium" description="Default link card" /><I9kLinkCard size="lg" name="Large card" url="https://example.com/large" description="Prominent link card" /></div>',
  }),
};
```

- [ ] **Step 6: Annotate compatibility selectors**

Add temporary-compatibility comments before `.surface` and `.badge` in `primitives.css`. State
that scoped card components own their appearance and the blocks remain until the website ledger
reports zero direct usage. Do not change the declarations.

- [ ] **Step 7: Verify and commit**

Run:

```bash
npm test -- tests/I9kLinkCard.test.ts
npm run typecheck
```

Expected: both PASS.

Commit:

```bash
git add src/components/I9kLinkCard.vue src/styles/primitives.css stories/I9kLinkCard.stories.ts tests/I9kLinkCard.test.ts
git commit -m "feat: scope link card styles and sizes"
```

---

### Task 3: Scope and size I9kProfileCard

**Files:**

- Modify: `src/components/I9kProfileCard.vue`
- Create: `tests/I9kProfileCard.test.ts`
- Modify: `stories/I9kProfileCard.stories.ts`
- Modify: `src/styles/primitives.css`

**Interfaces:**

- Consumes: `I9kComponentSize` and existing brand tokens.
- Produces: `size?: I9kComponentSize`, default `md`; legacy `surface`, `cluster`, and
  `cluster--tight` classes; scoped `i9k-profile-card*` classes.

- [ ] **Step 1: Write the failing ProfileCard tests**

Create `tests/I9kProfileCard.test.ts` with cases that assert:

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kProfileCard from '../src/components/I9kProfileCard.vue';

describe('I9kProfileCard', () => {
  it('renders profile content and compatibility classes at medium size', () => {
    const wrapper = mount(I9kProfileCard, {
      props: { name: 'Abdelrahman Ismail', alias: 'Ismail9k', namePrefix: 'Written by' },
      slots: { default: 'Software engineer' },
    });

    expect(wrapper.text()).toContain('Written by Abdelrahman Ismail');
    expect(wrapper.text()).toContain('Ismail9k');
    expect(wrapper.text()).toContain('Software engineer');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'surface',
        'profile-card',
        'i9k-profile-card',
        'i9k-profile-card--md',
      ]),
    );
  });

  it('renders the native avatar attributes', () => {
    const wrapper = mount(I9kProfileCard, {
      props: {
        name: 'Abdelrahman Ismail',
        avatarSrc: '/avatar.jpg',
        avatarAlt: 'Abdelrahman Ismail',
      },
    });

    const avatar = wrapper.get('img');
    expect(avatar.attributes('src')).toBe('/avatar.jpg');
    expect(avatar.attributes('alt')).toBe('Abdelrahman Ismail');
    expect(avatar.attributes('loading')).toBe('lazy');
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s size', (size) => {
    const wrapper = mount(I9kProfileCard, {
      props: { name: 'Abdelrahman Ismail', size },
    });

    expect(wrapper.classes()).toContain(`i9k-profile-card--${size}`);
  });

  it('owns the action layout while retaining cluster compatibility', () => {
    const wrapper = mount(I9kProfileCard, {
      props: { name: 'Abdelrahman Ismail' },
      slots: { actions: '<a href="#profile">Profile</a>' },
    });

    expect(wrapper.get('.i9k-profile-card__actions').classes()).toEqual(
      expect.arrayContaining(['cluster', 'cluster--tight', 'profile-card__actions']),
    );
  });
});
```

- [ ] **Step 2: Run the test and verify red**

Run: `npm test -- tests/I9kProfileCard.test.ts`

Expected: FAIL because `size` and scoped profile-card classes do not exist.

- [ ] **Step 3: Add size and scoped class bindings**

Import `I9kComponentSize`, add `size?: I9kComponentSize`, and default it to `md`. Use these class
bindings while keeping the `<aside>` root and all existing slots and image attributes:

```vue
<aside :class="['surface', 'profile-card', 'i9k-profile-card', `i9k-profile-card--${size}`]">
```

```vue
class="profile-card__avatar i9k-profile-card__avatar" class="profile-card__body
i9k-profile-card__body" class="profile-card__name i9k-profile-card__name" class="profile-card__alias
i9k-profile-card__alias" class="profile-card__bio i9k-profile-card__bio" class="cluster
cluster--tight profile-card__actions i9k-profile-card__actions"
```

- [ ] **Step 4: Make the scoped stylesheet self-contained**

Use these root size variables and surface rules:

```css
.i9k-profile-card {
  --i9k-profile-card-padding: var(--spacing-10);
  --i9k-profile-card-gap: var(--spacing-8);
  --i9k-profile-card-avatar-size: 4.5rem;
  --i9k-profile-card-body-size: 0.95rem;

  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  transition: var(--transition);
}

.i9k-profile-card--sm {
  --i9k-profile-card-padding: var(--spacing-8);
  --i9k-profile-card-gap: var(--spacing-6);
  --i9k-profile-card-avatar-size: 3.5rem;
  --i9k-profile-card-body-size: 0.875rem;
}

.i9k-profile-card--lg {
  --i9k-profile-card-padding: var(--spacing-13);
  --i9k-profile-card-gap: var(--spacing-11);
  --i9k-profile-card-avatar-size: 5.5rem;
  --i9k-profile-card-body-size: 1rem;
}
```

Update `.profile-card` padding and gap to use the variables. Update avatar `:deep(img)` width and
height to use `--i9k-profile-card-avatar-size`, and bio font size to use
`--i9k-profile-card-body-size`. Add the action layout directly:

```css
.i9k-profile-card__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--component-gap-sm);
}
```

- [ ] **Step 5: Add Storybook sizes and remove story-only primitive dependence**

Add this size control:

```ts
argTypes: {
  size: { control: 'select', options: ['sm', 'md', 'lg'] },
},
```

Add a `Sizes` story:

```ts
export const Sizes: Story = {
  render: () => ({
    components: { I9kProfileCard },
    template:
      '<div style="display: grid; gap: var(--component-gap-md)"><I9kProfileCard size="sm" name="Small profile">Compact biography.</I9kProfileCard><I9kProfileCard size="md" name="Medium profile">Default biography.</I9kProfileCard><I9kProfileCard size="lg" name="Large profile">Prominent biography.</I9kProfileCard></div>',
  }),
};
```

In `WithActions`, use this template so the component owns the action layout:

```ts
template:
  '<I9kProfileCard v-bind="args" avatar-src="https://avatars.githubusercontent.com/u/20756985?s=120&v=4">Software engineer sharing how AI is changing the way software gets built.<template #actions><a href="#instagram">Instagram</a><a href="#github">GitHub</a></template></I9kProfileCard>',
```

- [ ] **Step 6: Annotate cluster compatibility**

Add a temporary-compatibility comment before `.cluster` in `primitives.css`. Do not alter its
declarations because the website still uses it directly.

- [ ] **Step 7: Verify and commit**

Run:

```bash
npm test -- tests/I9kProfileCard.test.ts
npm run typecheck
```

Expected: both PASS.

Commit:

```bash
git add src/components/I9kProfileCard.vue src/styles/primitives.css stories/I9kProfileCard.stories.ts tests/I9kProfileCard.test.ts
git commit -m "feat: scope profile card styles and sizes"
```

---

### Task 4: Scope and size I9kTimelineCard

**Files:**

- Modify: `src/components/I9kTimelineCard.vue`
- Create: `tests/I9kTimelineCard.test.ts`
- Modify: `stories/I9kTimelineCard.stories.ts`
- Modify: `src/styles/primitives.css`

**Interfaces:**

- Consumes: `I9kComponentSize` and current default and `thumbnail` slots.
- Produces: `size?: I9kComponentSize`, default `md`; a new semantic `title` slot rendered inside
  the component heading; the unchanged default slot; a wrapped `thumbnail` slot; legacy
  `timeline*` classes; scoped `i9k-timeline-card*` classes.

- [ ] **Step 1: Write the failing TimelineCard tests**

Create `tests/I9kTimelineCard.test.ts`:

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kTimelineCard from '../src/components/I9kTimelineCard.vue';

describe('I9kTimelineCard', () => {
  it('formats an ISO date in UTC and defaults to medium size', () => {
    const wrapper = mount(I9kTimelineCard, { props: { date: '2026-01-25' } });

    expect(wrapper.get('.i9k-timeline-card__time').text()).toBe('January 25, 2026');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['timeline', 'i9k-timeline-card', 'i9k-timeline-card--md']),
    );
  });

  it('renders semantic title, default, and thumbnail slots', () => {
    const wrapper = mount(I9kTimelineCard, {
      props: { date: '2026-01-25', linked: true },
      slots: {
        title: '<a href="/article">Article title</a>',
        default: '<p>Article summary</p>',
        thumbnail: '<img src="/thumbnail.jpg" alt="" />',
      },
    });

    expect(wrapper.get('.i9k-timeline-card__title').text()).toBe('Article title');
    expect(wrapper.get('.i9k-timeline-card__main').text()).toContain('Article summary');
    expect(wrapper.get('.i9k-timeline-card__thumbnail img').attributes('src')).toBe(
      '/thumbnail.jpg',
    );
    expect(wrapper.get('.i9k-timeline-card__card').classes()).toEqual(
      expect.arrayContaining(['timeline__card', 'timeline__card--linked']),
    );
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s size', (size) => {
    const wrapper = mount(I9kTimelineCard, { props: { date: '2026-01-25', size } });

    expect(wrapper.classes()).toContain(`i9k-timeline-card--${size}`);
  });

  it('preserves legacy default-slot markup', () => {
    const wrapper = mount(I9kTimelineCard, {
      props: { date: '2026-01-25' },
      slots: { default: '<h3 class="timeline__title">Legacy title</h3>' },
    });

    expect(wrapper.get('.timeline__title').text()).toBe('Legacy title');
  });
});
```

- [ ] **Step 2: Run the test and verify red**

Run: `npm test -- tests/I9kTimelineCard.test.ts`

Expected: FAIL because the size contract, prefixed classes, and title wrapper do not exist.

- [ ] **Step 3: Add size and semantic slot markup**

Import `I9kComponentSize`, add `size?: I9kComponentSize`, and default it to `md`. Render:

```vue
<div :class="['timeline', 'i9k-timeline-card', `i9k-timeline-card--${size}`]">
  <p class="timeline__time i9k-timeline-card__time">{{ formattedDate }}</p>
  <div class="timeline__rail i9k-timeline-card__rail" />
  <div
    class="timeline__card i9k-timeline-card__card"
    :class="{ 'timeline__card--linked': linked, 'i9k-timeline-card__card--linked': linked }"
  >
    <div class="timeline__main i9k-timeline-card__main">
      <h3 v-if="$slots.title" class="i9k-timeline-card__title"><slot name="title" /></h3>
      <slot />
    </div>
    <div v-if="$slots.thumbnail" class="i9k-timeline-card__thumbnail">
      <slot name="thumbnail" />
    </div>
  </div>
</div>
```

- [ ] **Step 4: Add the scoped timeline layout**

Move the visual declarations from the global timeline block into prefixed scoped selectors while
leaving the global block unchanged. Define these size variables:

```css
.i9k-timeline-card {
  --i9k-timeline-gap: var(--spacing-10);
  --i9k-timeline-card-padding: var(--spacing-10);
  --i9k-timeline-time-width: 6.25rem;
  --i9k-timeline-time-size: 0.75rem;
  --i9k-timeline-thumb-width: 10rem;
  --i9k-timeline-thumb-height: 6.25rem;

  position: relative;
  display: flex;
  gap: var(--i9k-timeline-gap);
  transition: var(--transition);
}

.i9k-timeline-card--sm {
  --i9k-timeline-gap: var(--spacing-7);
  --i9k-timeline-card-padding: var(--spacing-7);
  --i9k-timeline-time-width: 5.5rem;
  --i9k-timeline-time-size: 0.6875rem;
  --i9k-timeline-thumb-width: 8rem;
  --i9k-timeline-thumb-height: 5rem;
}

.i9k-timeline-card--lg {
  --i9k-timeline-gap: var(--spacing-13);
  --i9k-timeline-card-padding: var(--spacing-13);
  --i9k-timeline-time-width: 7rem;
  --i9k-timeline-time-size: 0.875rem;
  --i9k-timeline-thumb-width: 12rem;
  --i9k-timeline-thumb-height: 7.5rem;
}
```

Add the remaining scoped layout declarations:

```css
.i9k-timeline-card__time {
  width: var(--i9k-timeline-time-width);
  flex-shrink: 0;
  margin-block-start: var(--spacing-10);
  margin-inline-end: var(--spacing-7);
  color: var(--dark-gray-color);
  font-size: var(--i9k-timeline-time-size);
  font-weight: 700;
  text-align: end;
  white-space: nowrap;
}

.i9k-timeline-card__rail {
  position: relative;
  transform: translateX(-5px);
}

:global([dir='rtl'] .i9k-timeline-card__rail) {
  transform: translateX(5px);
}

.i9k-timeline-card__rail::before {
  position: absolute;
  top: var(--spacing-10);
  inset-inline-start: 0;
  display: block;
  width: 6px;
  height: 6px;
  border: 2px solid var(--dark-color-alpha-20);
  content: '';
  transform: translateY(5px);
}

.i9k-timeline-card__rail::after {
  position: absolute;
  top: var(--spacing-10);
  inset-inline-start: 4px;
  display: block;
  width: 1px;
  height: calc(100% - 10px);
  margin-inline-start: 0.5px;
  background: var(--dark-color-alpha-20);
  content: '';
  transform: translateY(15px);
}

.i9k-timeline-card__card {
  position: relative;
  display: flex;
  width: 100%;
  align-items: flex-start;
  gap: var(--component-gap-lg);
  padding: var(--i9k-timeline-card-padding);
  border-radius: var(--radius-md);
}

.i9k-timeline-card__card--linked:hover {
  background: var(--glass-bg);
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(var(--glass-blur));
}

.i9k-timeline-card__main {
  min-width: 0;
  flex: 1;
}

.i9k-timeline-card__thumbnail {
  flex-shrink: 0;
}
```

Use compiler-safe complete global dark selectors:

```css
:global(.dark .i9k-timeline-card__rail)::before {
  border-color: var(--white-color-alpha-20);
}

:global(.dark .i9k-timeline-card__rail)::after {
  background-color: var(--white-color-alpha-20);
}
```

Style semantic slot content without `:deep()`:

```css
.i9k-timeline-card__title {
  margin-top: 0;
  color: var(--theme-text-color);
}

.i9k-timeline-card__title :slotted(a) {
  color: inherit;
  text-decoration: none;
  text-decoration-color: var(--accent-color);
  transition: var(--transition);
}

.i9k-timeline-card__title :slotted(a)::after {
  position: absolute;
  inset: 0;
  content: '';
}

.i9k-timeline-card__card--linked:hover .i9k-timeline-card__title :slotted(a) {
  text-decoration: underline;
  text-decoration-color: var(--accent-color);
}

.i9k-timeline-card__thumbnail :slotted(img) {
  width: var(--i9k-timeline-thumb-width);
  height: var(--i9k-timeline-thumb-height);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  object-fit: cover;
}
```

Add the responsive and reduced-motion rules:

```css
@media screen and (max-width: 991px) {
  .i9k-timeline-card {
    gap: var(--spacing-7);
  }

  .i9k-timeline-card__time {
    position: absolute;
    top: var(--spacing-15);
    inset-inline-start: 0;
    z-index: 1;
    width: auto;
    margin: 0;
    padding: 0 var(--spacing-5);
    background: var(--glass-bg);
    color: var(--primary-text-color);
    transform: rotate(90deg);
    transform-origin: left;
    backdrop-filter: blur(var(--glass-blur));
  }

  :global([dir='rtl'] .i9k-timeline-card__time) {
    transform-origin: right;
  }

  .i9k-timeline-card__card {
    padding: var(--spacing-7);
  }
}

@media (max-width: 600px) {
  .i9k-timeline-card__thumbnail {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .i9k-timeline-card,
  .i9k-timeline-card__title :slotted(a) {
    transition: none;
  }
}
```

- [ ] **Step 5: Update Storybook to the semantic API**

Add this size control:

```ts
argTypes: {
  size: { control: 'select', options: ['sm', 'md', 'lg'] },
},
```

Use this semantic template for `Linked`; `Arabic` continues extending it:

```ts
template:
  '<I9kTimelineCard v-bind="args"><template #title><a href="#">Are AI coding tools ready to replace programmers?</a></template><p>A practical discussion of what today’s tools can do and what still needs engineering judgement.</p><template #thumbnail><img src="https://i.ytimg.com/vi/NfRC9Lj4-rU/hqdefault.jpg" alt="" width="160" height="100"></template></I9kTimelineCard>',
```

Add the all-sizes story:

```ts
export const Sizes: Story = {
  render: () => ({
    components: { I9kTimelineCard },
    template:
      '<div><I9kTimelineCard date="2026-01-25" size="sm"><template #title>Small timeline card</template>Compact summary.</I9kTimelineCard><I9kTimelineCard date="2026-01-25" size="md"><template #title>Medium timeline card</template>Default summary.</I9kTimelineCard><I9kTimelineCard date="2026-01-25" size="lg"><template #title>Large timeline card</template>Prominent summary.</I9kTimelineCard></div>',
  }),
};
```

- [ ] **Step 6: Mark global timeline CSS compatibility-only**

Replace the current descriptive timeline comment with a temporary-compatibility comment naming
`BlogCard.vue`, `TalkCard.vue`, and the website design-system page. Keep every declaration until
those consumers adopt the semantic slots.

- [ ] **Step 7: Verify and commit**

Run:

```bash
npm test -- tests/I9kTimelineCard.test.ts
npm run typecheck
```

Expected: both PASS.

Commit:

```bash
git add src/components/I9kTimelineCard.vue src/styles/primitives.css stories/I9kTimelineCard.stories.ts tests/I9kTimelineCard.test.ts
git commit -m "feat: scope timeline card styles and sizes"
```

---

### Task 5: Extend safeguards and migration documentation

**Files:**

- Modify: `tests/I9kScopedStyles.test.ts`
- Modify: `README.md`
- Modify: `docs/migrations/ismail9k-com-component-library.md`

**Interfaces:**

- Consumes: scoped class contracts from Tasks 1-4.
- Produces: automated scoped-style ownership coverage and explicit Phase 2 migration status.

- [ ] **Step 1: Extend the scoped-style safeguard**

Add these entries to `migratedComponents` in `tests/I9kScopedStyles.test.ts`:

```ts
['I9kAsciiEmoji.vue', 'i9k-ascii-emoji'],
['I9kLinkCard.vue', 'i9k-link-card'],
['I9kProfileCard.vue', 'i9k-profile-card'],
['I9kTimelineCard.vue', 'i9k-timeline-card'],
```

- [ ] **Step 2: Run the safeguard**

Run: `npm test -- tests/I9kScopedStyles.test.ts`

Expected: PASS because Tasks 1-4 added scoped ownership.

- [ ] **Step 3: Document public size usage**

Add examples to the README component-size section:

```vue
<I9kAsciiEmoji name="^_^" size="sm" />
<I9kLinkCard size="md" name="Project" url="https://example.com" description="Description" />
<I9kProfileCard size="lg" name="Abdelrahman Ismail" />
<I9kTimelineCard size="md" date="2026-01-25">
  <template #title><a href="/article">Article title</a></template>
  Article summary
</I9kTimelineCard>
```

Explain that legacy classes remain emitted during the website compatibility window and new
consumers should treat `i9k-` classes and component props/slots as the supported contract.

- [ ] **Step 4: Update the migration ledger**

Add a `Package Migration Status` section before `Direct Primitive Usage Batches` with this table:

```markdown
| Package component | Scoped replacement ready                      | Website compatibility still required                                  |
| ----------------- | --------------------------------------------- | --------------------------------------------------------------------- |
| `I9kAsciiEmoji`   | Yes: scoped size and color styles             | `.emoticon*` remains during migration                                 |
| `I9kLinkCard`     | Yes: scoped surface, badge, and sizes         | `.surface*` and `.badge*` remain for direct website usage             |
| `I9kProfileCard`  | Yes: scoped surface, actions, and sizes       | `.surface*` and `.cluster*` remain for direct website usage           |
| `I9kTimelineCard` | Yes: scoped layout, sizes, and semantic slots | `.timeline*` remains until BlogCard, TalkCard, and the canary migrate |
```

- [ ] **Step 5: Run the phase gate**

Run:

```bash
npm run check
npm pack --dry-run
```

Expected: all tests, formatting, lint, three type-check projects, library build, Storybook build,
and package dry-run PASS. The normal Storybook chunk-size warning is non-blocking.

- [ ] **Step 6: Commit documentation and safeguards**

```bash
git add README.md docs/migrations/ismail9k-com-component-library.md tests/I9kScopedStyles.test.ts
git commit -m "docs: cover scoped existing components"
```

## Phase Completion Gate

- All four component test files pass.
- `I9kScopedStyles.test.ts` covers all four scoped class prefixes.
- Existing legacy classes still render and global compatibility declarations remain.
- Storybook has default and all-sizes coverage for all four components plus TimelineCard RTL.
- `npm run check` passes.
- `npm pack --dry-run` contains declarations, JavaScript, and CSS and excludes tests and stories.
