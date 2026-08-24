import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const indexSource = readFileSync(resolve('src/index.ts'), 'utf8');
const tokenSource = readFileSync(resolve('src/styles/tokens.css'), 'utf8');

describe('shared component contracts', () => {
  it('exports the common component types', () => {
    expect(indexSource).toContain(
      "export type { I9kComponentSize, I9kIconButtonVariant, I9kTone } from './types/components';",
    );
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
