import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { build } from 'vite';

describe('normalized styles', () => {
  it('normalizes the root line height in the shipped stylesheet', async () => {
    const result = await build({
      configFile: false,
      logLevel: 'silent',
      build: {
        write: false,
        rollupOptions: {
          input: resolve('src/styles/index.css'),
        },
      },
    });
    const builds = Array.isArray(result) ? result : [result];
    const outputs = builds.flatMap((buildResult) =>
      'output' in buildResult ? buildResult.output : [],
    );
    const stylesheet = outputs.find(
      (output) => output.type === 'asset' && output.fileName.endsWith('.css'),
    );

    expect(stylesheet).toBeDefined();

    const style = document.createElement('style');
    style.textContent = stylesheet?.type === 'asset' ? stylesheet.source.toString() : '';
    document.head.append(style);

    expect(getComputedStyle(document.documentElement).lineHeight).toBe('1.15');

    style.remove();
  });
});
