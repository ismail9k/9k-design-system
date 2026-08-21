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
- `I9kLinkCard`
- `I9kPageHeader`
- `I9kSectionHeading`
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
- design tokens and primitive CSS via `@ismail9k/9k-design-system/style.css`

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
