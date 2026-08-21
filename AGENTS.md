# Repository Guidelines

## Project Structure & Module Organization

This package provides Vue 3 design-system components and shared CSS. Component source lives in `src/components/`; public exports are collected in `src/index.ts`. Keep design tokens and reusable primitives in `src/styles/`, icon data in `src/icons/`, and other static files in `src/assets/`. Storybook examples belong in `stories/`, with configuration under `.storybook/`. Vitest unit tests live in `tests/`. `dist/` and `storybook-static/` are generated outputs—do not edit or commit them.

## Build, Test, and Development Commands

- `npm ci`: install the exact dependencies recorded in `package-lock.json`.
- `npm run storybook`: start the component workshop at port 6006.
- `npm test`: run the Vitest suite once.
- `npm run test:watch`: rerun affected tests while developing.
- `npm run lint`: check TypeScript and Vue files with ESLint.
- `npm run format:check`: verify Prettier formatting without rewriting files.
- `npm run typecheck`: type-check the library, Storybook, and unit tests.
- `npm run build`: create the ESM library and declarations in `dist/`.
- `npm run check`: run the complete test, formatting, lint, type, library, and Storybook build pipeline.

## Coding Style & Naming Conventions

Use TypeScript and Vue Single-File Components where practical. Prettier enforces two-space indentation, single quotes, trailing commas, and a 100-character print width; run `npm run format` before submitting broad edits. Name components in PascalCase with the `I9k` prefix (`I9kButton.vue`), stories as `I9kButton.stories.ts`, and tests as `I9kButton.test.ts`. Prefer scoped component styles, existing CSS custom properties, and `i9k-` prefixes for package-specific classes. Add every public component or type to `src/index.ts`.

## Testing Guidelines

Write tests with Vitest and mount Vue components with Vue Test Utils in the configured jsdom environment. Assert public rendering and interaction behavior rather than implementation details. Add focused cases for new variants, state changes, events, and accessibility contracts. Keep each test independent and use explicit imports from `vitest`. No coverage threshold is configured; cover changed behavior and run `npm run check` before opening a pull request.

## Commit & Pull Request Guidelines

Recent history follows Conventional Commits such as `feat: add I9kInput` and `fix: refine selector for Arabic page header titles`. Use a lowercase type (`feat`, `fix`, `chore`, `docs`, or `test`) and a concise imperative summary. Pull requests should explain the user-facing effect, list verification performed, and link relevant issues. Include Storybook screenshots or recordings for visual changes, noting light/dark and RTL checks when applicable. Keep generated artifacts and unrelated refactors out of the change.
