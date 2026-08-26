import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kGrid from '../src/components/I9kGrid.vue';

describe('I9kGrid', () => {
  it('renders one medium column by default', () => {
    const wrapper = mount(I9kGrid, { slots: { default: '<div>One</div><div>Two</div>' } });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['i9k-grid', 'i9k-grid--columns-1', 'i9k-grid--md']),
    );
    expect(wrapper.classes()).not.toContain('grid');
    expect(wrapper.findAll(':scope > div')).toHaveLength(2);
  });

  it.each([1, 2, 3, 'auto'] as const)('renders the %s column contract', (columns) => {
    const wrapper = mount(I9kGrid, { props: { columns } });

    expect(wrapper.classes()).toContain(`i9k-grid--columns-${columns}`);
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s gap size', (size) => {
    const wrapper = mount(I9kGrid, { props: { size } });

    expect(wrapper.classes()).toContain(`i9k-grid--${size}`);
  });

  it('renders a semantic list and forwards its accessible name', () => {
    const wrapper = mount(I9kGrid, {
      props: { as: 'ul', columns: 3 },
      attrs: { 'aria-label': 'Project list', class: 'projects' },
      slots: { default: '<li>One</li><li>Two</li>' },
    });

    expect(wrapper.element.tagName).toBe('UL');
    expect(wrapper.attributes('aria-label')).toBe('Project list');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['projects', 'i9k-grid', 'i9k-grid--columns-3', 'i9k-grid--md']),
    );
    expect(wrapper.findAll('li')).toHaveLength(2);
  });
});
