import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const migratedComponents = [
  ['I9kButton.vue', 'i9k-button'],
  ['I9kInput.vue', 'i9k-input'],
  ['I9kToast.vue', 'i9k-toast'],
] as const;

describe('migrated component styles', () => {
  it.each(migratedComponents)('%s owns scoped %s styles', (fileName, className) => {
    const source = readFileSync(resolve('src/components', fileName), 'utf8');

    expect(source).toMatch(/<style\s+scoped>/);
    expect(source).toContain(`.${className}`);
  });
});
