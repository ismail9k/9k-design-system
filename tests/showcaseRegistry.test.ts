import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { extractComponent } from '../showcase/extract/props';
import { entries } from '../showcase/registry';
import { mergeRegistry } from '../showcase/registry/merge';
import { SECTIONS } from '../showcase/registry/sections';

const exportedNames = [
  ...readFileSync(resolve('src/index.ts'), 'utf8').matchAll(/export \{ default as (I9k\w+) \}/g),
].map((match) => match[1]);

const sectionIds = new Set(SECTIONS.map((section) => section.id));

describe('showcase registry', () => {
  it('finds the exported component names it is measured against', () => {
    expect(exportedNames.length).toBe(33);
  });

  it('names only real exports', () => {
    const unknown = entries.filter((entry) => !exportedNames.includes(entry.name));
    expect(unknown.map((entry) => entry.name)).toEqual([]);
  });

  it('has no duplicate entries', () => {
    const names = entries.map((entry) => entry.name);
    expect(names).toEqual([...new Set(names)]);
  });

  it.each(entries.map((entry) => [entry.name, entry] as const))(
    '%s carries a summary, a prompt, a demo, and a known section',
    (_name, entry) => {
      expect(entry.summary.length).toBeGreaterThan(20);
      expect(entry.agentPrompt.length).toBeGreaterThan(80);
      expect(entry.agentPrompt).toContain('@ismail9k/9k-design-system');
      expect(entry.demos.length).toBeGreaterThan(0);
      expect(sectionIds.has(entry.section)).toBe(true);
    },
  );

  it('merges extracted props onto the entry', () => {
    const extracted = entries.map((entry) =>
      extractComponent(resolve(`src/components/${entry.name}.vue`)),
    );
    const merged = mergeRegistry(entries, extracted);
    const input = merged.find((component) => component.name === 'I9kInput');
    expect(input?.props.map((prop) => prop.name)).toContain('uiSize');
    expect(input?.emits).toEqual([{ name: 'update:modelValue', payload: '[value: string]' }]);
  });
});
