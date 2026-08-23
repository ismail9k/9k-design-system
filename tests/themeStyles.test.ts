import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const themeStyles = readFileSync(resolve('src/styles/theme.css'), 'utf8');
const tokenStyles = readFileSync(resolve('src/styles/tokens.css'), 'utf8');

describe('theme styles', () => {
  beforeEach(() => {
    const style = document.createElement('style');
    style.dataset.testTheme = '';
    style.textContent = `${tokenStyles}\n${themeStyles}`;
    document.head.append(style);
  });

  afterEach(() => {
    document.documentElement.className = '';
    document.body.replaceChildren();
    document.querySelector('[data-test-theme]')?.remove();
  });

  it('applies the dark theme colors to page and design-system surfaces', () => {
    document.documentElement.classList.add('dark');
    const root = document.createElement('main');
    root.classList.add('i9k-root');
    document.body.append(root);

    const bodyStyles = getComputedStyle(document.body);
    const rootStyles = getComputedStyle(root);

    expect(bodyStyles.backgroundColor).toBe('var(--theme-bg-color)');
    expect(bodyStyles.color).toBe('var(--theme-text-color)');
    expect(rootStyles.backgroundColor).toBe('var(--theme-bg-color)');
    expect(rootStyles.color).toBe('var(--theme-text-color)');
    expect(rootStyles.getPropertyValue('--theme-bg-color')).toBe('hsl(0 0% 0%)');
    expect(rootStyles.getPropertyValue('--theme-text-color')).toBe('hsl(0 0% 100%)');
  });

  it('applies the active theme background to the document root', () => {
    document.documentElement.classList.add('dark');

    expect(getComputedStyle(document.documentElement).backgroundColor).toBe(
      'var(--theme-bg-color)',
    );
  });

  it('uses the dark color scheme for native controls', () => {
    document.documentElement.classList.add('dark');

    expect(getComputedStyle(document.documentElement).colorScheme).toBe('dark');
  });
});
