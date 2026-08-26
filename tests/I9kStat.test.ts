import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kStat from '../src/components/I9kStat.vue';

describe('I9kStat', () => {
  it('renders value and label while omitting an absent source', () => {
    const wrapper = mount(I9kStat, {
      props: { value: '480k+', label: 'monthly downloads' },
    });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.get('.i9k-stat__value').text()).toBe('480k+');
    expect(wrapper.get('.i9k-stat__label').text()).toBe('monthly downloads');
    expect(wrapper.find('.i9k-stat__source').exists()).toBe(false);
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['i9k-stat', 'i9k-stat--md']));
    expect(wrapper.classes()).not.toContain('stat');
  });

  it('renders zero as a value', () => {
    const wrapper = mount(I9kStat, { props: { value: 0 } });

    expect(wrapper.get('.i9k-stat__value').text()).toBe('0');
  });

  it('lets named slots override prop content', () => {
    const wrapper = mount(I9kStat, {
      props: { value: 'old', label: 'old', source: 'old' },
      slots: {
        value: '<strong>10+</strong>',
        label: 'years building products',
        source: '<a href="/source">Snapshot</a>',
      },
    });

    expect(wrapper.get('.i9k-stat__value strong').text()).toBe('10+');
    expect(wrapper.get('.i9k-stat__label').text()).toBe('years building products');
    expect(wrapper.get('.i9k-stat__source a').attributes('href')).toBe('/source');
  });

  it('omits every optional region when no content is provided', () => {
    const wrapper = mount(I9kStat);

    expect(wrapper.find('.i9k-stat__value').exists()).toBe(false);
    expect(wrapper.find('.i9k-stat__label').exists()).toBe(false);
    expect(wrapper.find('.i9k-stat__source').exists()).toBe(false);
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s size', (size) => {
    const wrapper = mount(I9kStat, { props: { size } });

    expect(wrapper.classes()).toContain(`i9k-stat--${size}`);
  });

  it('renders a large semantic list item and forwards attributes', () => {
    const wrapper = mount(I9kStat, {
      props: { as: 'li', size: 'lg', value: '10+' },
      attrs: { class: 'proof', 'aria-label': 'Ten years' },
    });

    expect(wrapper.element.tagName).toBe('LI');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['proof', 'i9k-stat', 'i9k-stat--lg']),
    );
    expect(wrapper.attributes('aria-label')).toBe('Ten years');
  });
});
