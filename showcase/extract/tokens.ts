import { readFileSync } from 'node:fs';

import type { BrandColorToken, ColorTokens, ColorValue, ThemeColorToken } from './types';

/** Strips `/* … *\/` comments so declarations inside them are never extracted. */
const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');

const BLOCK = /([^{}]+)\{([^{}]*)\}/g;
const DECLARATION = /(--[\w-]+)\s*:\s*([^;]+);/g;

const HSL =
  /^hsl\(\s*(-?[\d.]+)(?:deg)?\s+(-?[\d.]+)%?\s+(-?[\d.]+)%?\s*(?:\/\s*(-?[\d.]+)(%?)\s*)?\)$/i;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const toHexPair = (channel: number) =>
  clamp(Math.round(channel * 255), 0, 255)
    .toString(16)
    .padStart(2, '0');

/**
 * Every color in `tokens.css` is authored as space-separated `hsl()`, so that is the only notation
 * resolved here. Anything else is skipped rather than guessed at, which keeps a mis-parse out of
 * the swatch list instead of publishing a wrong hex.
 */
export const resolveColor = (raw: string): ColorValue | null => {
  const value = raw.trim();
  const match = HSL.exec(value);
  if (!match) return null;

  const [, hue, saturation, lightness, alphaValue, alphaUnit] = match;
  const h = ((Number(hue) % 360) + 360) % 360;
  const s = clamp(Number(saturation), 0, 100) / 100;
  const l = clamp(Number(lightness), 0, 100) / 100;
  const alpha =
    alphaValue === undefined ? 1 : clamp(Number(alphaValue) / (alphaUnit === '%' ? 100 : 1), 0, 1);

  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const secondary = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const offset = l - chroma / 2;
  const sector = Math.floor(h / 60) % 6;
  const [r, g, b] = (
    [
      [chroma, secondary, 0],
      [secondary, chroma, 0],
      [0, chroma, secondary],
      [0, secondary, chroma],
      [secondary, 0, chroma],
      [chroma, 0, secondary],
    ] as const
  )[sector].map((channel) => channel + offset);

  const hslAlpha = alpha === 1 ? '' : ` / ${Number(alpha.toFixed(4))}`;
  const hexAlpha = alpha === 1 ? '' : toHexPair(alpha);

  return {
    value,
    hsl: `hsl(${Number(h.toFixed(2))} ${Number((s * 100).toFixed(2))}% ${Number((l * 100).toFixed(2))}%${hslAlpha})`,
    hex: `#${toHexPair(r)}${toHexPair(g)}${toHexPair(b)}${hexAlpha}`.toUpperCase(),
  };
};

type Scope = 'brand' | 'light' | 'dark';

const scopeOf = (selector: string): Scope | null => {
  const normalized = selector.trim();
  if (/\.dark\b/.test(normalized)) return 'dark';
  if (/\.light\b/.test(normalized)) return 'light';
  if (/^:root\b/.test(normalized)) return 'brand';
  return null;
};

/**
 * Reads every color custom property out of `src/styles/tokens.css` so the showcase documents the
 * tokens that exist rather than a hand-maintained subset that drifts. Brand values come from
 * `:root`; anything redefined under `html.light` / `html.dark` is paired into one themed row.
 */
export const extractColorTokens = (tokensPath: string): ColorTokens => {
  const css = stripComments(readFileSync(tokensPath, 'utf8'));

  const brand: BrandColorToken[] = [];
  const themed = new Map<string, ThemeColorToken>();
  const order: string[] = [];

  for (const [, selector, body] of css.matchAll(BLOCK)) {
    const scope = scopeOf(selector);
    if (!scope) continue;

    for (const [, name, rawValue] of body.matchAll(DECLARATION)) {
      const color = resolveColor(rawValue);
      if (!color) continue;

      if (scope === 'brand') {
        brand.push({ name, ...color });
        continue;
      }

      let token = themed.get(name);
      if (!token) {
        token = { name, light: null, dark: null };
        themed.set(name, token);
        order.push(name);
      }
      token[scope] = color;
    }
  }

  return { brand, theme: order.map((name) => themed.get(name) as ThemeColorToken) };
};
