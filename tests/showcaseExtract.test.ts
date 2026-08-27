import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { extractComponent } from '../showcase/extract/props';

const component = (name: string) => extractComponent(resolve(`src/components/${name}.vue`));

describe('showcase prop extraction', () => {
  it('reads every prop I9kButton declares, in source order', () => {
    expect(component('I9kButton').props.map((prop) => prop.name)).toEqual([
      'to',
      'href',
      'variant',
      'size',
      'active',
      'type',
      'linkComponent',
    ]);
  });

  it('reads the value withDefaults supplies', () => {
    const size = component('I9kButton').props.find((prop) => prop.name === 'size');
    expect(size?.default).toBe("'md'");
  });

  it('marks an optional prop as not required', () => {
    const size = component('I9kButton').props.find((prop) => prop.name === 'size');
    expect(size?.required).toBe(false);
  });

  it('marks a prop with no question token as required and defaultless', () => {
    const modelValue = component('I9kInput').props.find((prop) => prop.name === 'modelValue');
    expect(modelValue).toMatchObject({ required: true, default: null, type: 'string' });
  });

  it('resolves an alias imported from src/types to its literal union', () => {
    const size = component('I9kBadge').props.find((prop) => prop.name === 'size');
    expect(size?.type).toBe("'sm' | 'md' | 'lg'");
  });

  it('resolves an alias declared inside the component', () => {
    const variant = component('I9kButton').props.find((prop) => prop.name === 'variant');
    expect(variant?.type).toBe("'default' | 'primary' | 'link' | 'filter' | 'pagination' | 'page'");
  });

  it('resolves a union mixing numeric and string literals', () => {
    const columns = component('I9kGrid').props.find((prop) => prop.name === 'columns');
    expect(columns?.type).toBe("1 | 2 | 3 | 'auto'");
  });

  it('leaves an inline union untouched', () => {
    const to = component('I9kButton').props.find((prop) => prop.name === 'to');
    expect(to?.type).toBe('string | Record<string, unknown> | null');
  });

  it('keeps an interface alias by name and records its declaration', () => {
    const extracted = component('I9kNavigation');
    const links = extracted.props.find((prop) => prop.name === 'links');
    expect(links?.type).toBe('I9kNavigationLink[]');
    expect(extracted.referencedTypes.I9kNavigationLink).toContain('label: string');
  });
});
