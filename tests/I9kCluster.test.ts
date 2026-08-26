import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kCluster from '../src/components/I9kCluster.vue';

describe('I9kCluster', () => {
  it('renders a medium div by default', () => {
    const wrapper = mount(I9kCluster, {
      slots: { default: '<button>Save</button><button>Share</button>' },
    });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['i9k-cluster', 'i9k-cluster--md']));
    expect(wrapper.classes()).not.toContain('cluster');
    expect(wrapper.findAll('button')).toHaveLength(2);
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s gap size', (size) => {
    const wrapper = mount(I9kCluster, { props: { size } });

    expect(wrapper.classes()).toContain(`i9k-cluster--${size}`);
  });

  it('renders a labelled nav without changing its children', () => {
    const wrapper = mount(I9kCluster, {
      props: { as: 'nav', size: 'sm' },
      attrs: { 'aria-label': 'Filters', class: 'filter-row' },
      slots: { default: '<button data-filter="all">All</button>' },
    });

    expect(wrapper.element.tagName).toBe('NAV');
    expect(wrapper.attributes('aria-label')).toBe('Filters');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['filter-row', 'i9k-cluster', 'i9k-cluster--sm']),
    );
    expect(wrapper.get('button').attributes('data-filter')).toBe('all');
  });
});
