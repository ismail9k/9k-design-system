import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const indexSource = readFileSync(resolve('src/index.ts'), 'utf8');
const tokenSource = readFileSync(resolve('src/styles/tokens.css'), 'utf8');

const phase3AExports = [
  "export type { I9kComponentSize, I9kIconButtonVariant, I9kTone } from './types/components';",
  "export type { I9kIconName } from './types/icons';",
  "export type { I9kRadioOption } from './types/forms';",
  "export { default as I9kButtonGroup } from './components/I9kButtonGroup.vue';",
  "export { default as I9kField } from './components/I9kField.vue';",
  "export { default as I9kIconButton } from './components/I9kIconButton.vue';",
  "export { default as I9kRadioGroup } from './components/I9kRadioGroup.vue';",
  "export { default as I9kSelect } from './components/I9kSelect.vue';",
  "export { default as I9kTextarea } from './components/I9kTextarea.vue';",
] as const;

describe('shared component contracts', () => {
  it('exports the common component types', () => {
    expect(indexSource).toContain(
      "export type { I9kComponentSize, I9kIconButtonVariant, I9kTone } from './types/components';",
    );
  });

  it.each(phase3AExports)('exports %s', (statement) => {
    expect(indexSource).toContain(statement);
  });

  it.each([
    ['--control-height-sm', '2rem'],
    ['--control-height-md', '2.5rem'],
    ['--control-height-lg', '3rem'],
    ['--control-font-size-sm', '0.875rem'],
    ['--control-font-size-md', '1rem'],
    ['--control-font-size-lg', '1.125rem'],
    ['--component-gap-sm', 'var(--spacing-4)'],
    ['--component-gap-md', 'var(--spacing-6)'],
    ['--component-gap-lg', 'var(--spacing-8)'],
  ])('declares %s as %s', (name, value) => {
    expect(tokenSource).toContain(`${name}: ${value};`);
  });
});
