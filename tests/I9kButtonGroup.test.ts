import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kButtonGroup from '../src/components/I9kButtonGroup.vue';

describe('I9kButtonGroup', () => {
  it('renders an accessible horizontal medium group by default', () => {
    const wrapper = mount(I9kButtonGroup, {
      props: { label: 'Article actions' },
      attrs: { 'data-testid': 'actions' },
      slots: { default: '<button>Save</button><button>Share</button>' },
    });

    expect(wrapper.attributes('role')).toBe('group');
    expect(wrapper.attributes('aria-label')).toBe('Article actions');
    expect(wrapper.attributes('data-testid')).toBe('actions');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'i9k-button-group',
        'i9k-button-group--horizontal',
        'i9k-button-group--md',
      ]),
    );
    expect(wrapper.findAll('button')).toHaveLength(2);
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s density', (size) => {
    const wrapper = mount(I9kButtonGroup, { props: { size } });
    expect(wrapper.classes()).toContain(`i9k-button-group--${size}`);
  });

  it('renders vertical orientation without changing child attributes', () => {
    const wrapper = mount(I9kButtonGroup, {
      props: { orientation: 'vertical' },
      slots: { default: '<button data-child="kept">Save</button>' },
    });
    expect(wrapper.classes()).toContain('i9k-button-group--vertical');
    expect(wrapper.get('button').attributes('data-child')).toBe('kept');
  });

  it('owns group semantics while forwarding consumer classes and other attributes', () => {
    const wrapper = mount(I9kButtonGroup, {
      props: { label: 'Article actions', orientation: 'vertical' },
      attrs: {
        role: 'presentation',
        'aria-label': 'Wrong label',
        'data-orientation': 'horizontal',
        class: 'consumer-group',
        'data-testid': 'actions',
      },
    });

    expect(wrapper.attributes('role')).toBe('group');
    expect(wrapper.attributes('aria-label')).toBe('Article actions');
    expect(wrapper.attributes('data-orientation')).toBe('vertical');
    expect(wrapper.attributes('data-testid')).toBe('actions');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['consumer-group', 'i9k-button-group', 'i9k-button-group--vertical']),
    );
  });
});
