import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { extractColorTokens, resolveColor } from '../showcase/extract/tokens';

const tokensPath = resolve('src/styles/tokens.css');
const tokenSource = readFileSync(tokensPath, 'utf8');
const tokens = extractColorTokens(tokensPath);

const brand = (name: string) => tokens.brand.find((token) => token.name === name);
const theme = (name: string) => tokens.theme.find((token) => token.name === name);

describe('showcase color token extraction', () => {
  it('converts an opaque hsl token to hsl and hex', () => {
    expect(resolveColor('hsl(143 64% 24%)')).toEqual({
      value: 'hsl(143 64% 24%)',
      hsl: 'hsl(143 64% 24%)',
      hex: '#166434',
    });
  });

  it('carries a token alpha channel into both notations', () => {
    expect(resolveColor('hsl(0 0% 100% / 0.15)')).toEqual({
      value: 'hsl(0 0% 100% / 0.15)',
      hsl: 'hsl(0 0% 100% / 0.15)',
      hex: '#FFFFFF26',
    });
  });

  it('accepts the unitless saturation and lightness CSS Color 4 allows', () => {
    expect(resolveColor('hsl(0 0 0 / 0.1)')?.hex).toBe('#0000001A');
  });

  it('skips a value that is not a color', () => {
    expect(resolveColor('var(--spacing-4)')).toBeNull();
  });

  // The point of extracting rather than hand-listing: a token added to tokens.css shows up in the
  // showcase without a second edit. Compare against the file itself so a new color cannot be
  // documented in one place only.
  it('documents every color custom property declared in tokens.css', () => {
    const declared = new Set(
      [...tokenSource.matchAll(/(--[\w-]+)\s*:\s*(hsl\([^;]+\));/g)].map(([, name]) => name),
    );
    const documented = new Set([
      ...tokens.brand.map((token) => token.name),
      ...tokens.theme.map((token) => token.name),
    ]);
    expect(documented).toEqual(declared);
  });

  it('separates :root brand values from the per-theme ones', () => {
    expect(brand('--primary-color')?.hex).toBe('#166434');
    expect(brand('--primary-text-color')).toBeUndefined();
    expect(theme('--primary-color')).toBeUndefined();
  });

  it('pairs a themed token into its light and dark values', () => {
    expect(theme('--primary-text-color')).toEqual({
      name: '--primary-text-color',
      light: { value: 'hsl(143 64% 24%)', hsl: 'hsl(143 64% 24%)', hex: '#166434' },
      dark: { value: 'hsl(143 58% 44%)', hsl: 'hsl(143 58% 44%)', hex: '#2FB161' },
    });
  });
});
