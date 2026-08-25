# @ismail9k/9k-design-system

Reusable Vue 3 primitives from [ismail9k.com](https://ismail9k.com/design-system/).

## Install

```bash
npm install @ismail9k/9k-design-system
```

Import the shared CSS once in your application entry point:

```ts
import '@ismail9k/9k-design-system/style.css';
```

Then use components directly:

```vue
<script setup lang="ts">
import { I9kButton, I9kLinkCard, I9kPageHeader } from '@ismail9k/9k-design-system';
</script>
```

The package is framework-agnostic within Vue 3. `I9kButton` uses a normal anchor for `to` by default. Pass `link-component="RouterLink"` in Vue Router apps when you want router navigation.

## Exports

- `I9kButton`
- `I9kButtonGroup`
- `I9kField`
- `I9kIconButton`
- `I9kInput`
- `I9kLinkCard`
- `I9kPageHeader`
- `I9kRadioGroup`
- `I9kSectionHeading`
- `I9kSelect`
- `I9kTextarea`
- `I9kTimelineCard`
- `I9kArticleHeader`
- `I9kAsciiEmoji`
- `I9kBlurredCircles`
- `I9kBrandWordmark`
- `I9kFaqList`
- `I9kFooter`
- `I9kIcon`, a curated local set of brand, social, contact, and navigation SVG icons
- `I9kLanguageSwitcher`
- `I9kNavigation`
- `I9kSocialLinks`
- `I9kThemeSwitcher`
- `I9kToast`
- design tokens and primitive CSS via `@ismail9k/9k-design-system/style.css`

## Component sizes and styles

Visual components use the shared `sm`, `md`, and `lg` size scale and default to `md`:

```vue
<I9kButton size="sm">Compact action</I9kButton>
<I9kInput v-model="email" label="Email" ui-size="md" />
<I9kToast size="lg" variant="success">Saved successfully</I9kToast>
<I9kAsciiEmoji name="^_^" size="sm" />
<I9kLinkCard size="md" name="Project" url="https://example.com" description="Description" />
<I9kProfileCard size="lg" name="Abdelrahman Ismail" />
<I9kTimelineCard size="md" date="2026-01-25">
  <template #title><a href="/article">Article title</a></template>
  Article summary
</I9kTimelineCard>
```

Component appearance is scoped to each Vue SFC. The global stylesheet supplies fonts, brand
tokens, themes, element defaults, accessibility utilities, and temporary compatibility styles
for the current `ismail9k.com` migration.

Legacy classes remain emitted during the website compatibility window. New consumers should treat
`i9k-` classes and component props/slots as the supported contract.

`I9kInput` uses `uiSize` for its visual scale so the native HTML `size` attribute remains available
for character-based input widths.

## Native actions and form fields

Use the action and form components through the package entry point. Keep native attributes such as
`name`, `autocomplete`, and `required` on the control component; `I9kField` owns the visible label,
hint, error, and their accessibility associations.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import {
  I9kButton,
  I9kButtonGroup,
  I9kField,
  I9kIconButton,
  I9kInput,
  I9kRadioGroup,
  I9kSelect,
  I9kTextarea,
} from '@ismail9k/9k-design-system';

const email = ref('');
const details = ref('');
const service = ref('audit');
const intent = ref('audit');
const intentOptions = [
  { label: 'Product audit', value: 'audit', description: 'Review an existing product' },
  { label: 'Product build', value: 'build', description: 'Create a new experience' },
];
</script>

<template>
  <I9kIconButton icon="home" label="Home" />

  <I9kButtonGroup label="Draft actions">
    <I9kButton>Save</I9kButton>
    <I9kIconButton icon="mail" label="Email draft" />
  </I9kButtonGroup>

  <I9kField label="Email" hint="Use your work address." required>
    <I9kInput v-model="email" name="email" type="email" autocomplete="email" required />
  </I9kField>

  <I9kField label="Project details">
    <I9kTextarea v-model="details" name="details" rows="5" />
  </I9kField>

  <I9kField label="Service">
    <I9kSelect v-model="service" name="service">
      <option value="audit">Product audit</option>
      <option value="build">Product build</option>
    </I9kSelect>
  </I9kField>

  <I9kRadioGroup
    v-model="intent"
    :options="intentOptions"
    legend="Project intent"
    name="intent"
    variant="card"
  />
</template>
```

Visual controls default to `md` and support `sm`, `md`, and `lg`. `I9kInput` uses `uiSize` for
visual sizing so the native HTML `size` attribute remains available. `I9kSelect` intentionally
supports the native single-select contract; native `multiple` and `size` modes are outside that
contract.

## Typography

The package ships the ismail9k brand fonts through its CSS entry point, so consumers only need:

```ts
import '@ismail9k/9k-design-system/style.css';
```

- **English UI and display:** IBM Plex Sans, exposed as `--font-sans`.
- **English editorial text:** IBM Plex Serif, exposed as `--font-serif`.
- **Arabic UI and body:** Thmanyah Sans, exposed as `--font-arabic-sans`.
- **Arabic display treatments:** Thmanyah Serif Display, exposed as `--font-arabic-display`.

Arabic text automatically uses Thmanyah Sans through `:lang(ar)`. Arabic headings use Thmanyah Serif Display. Use `.i9k-root` on an app shell to explicitly apply IBM Plex Sans, and `.i9k-arabic` / `.i9k-arabic-display` when language metadata is unavailable.

## Development

```bash
npm install
npm run storybook
npm test
npm run test:watch
npm run format:check
npm run lint
npm run typecheck
npm run build
npm run build-storybook
npm pack --dry-run
```

`npm test` runs Vitest once; `npm run test:watch` reruns affected unit tests while developing. `npm run check` runs tests, formatting, linting, TypeScript checks, the library build, and the static Storybook build in one command.

Storybook provides isolated component documentation, light and dark theme previews, and accessibility checks. It is development tooling only and is excluded from the published npm tarball.
