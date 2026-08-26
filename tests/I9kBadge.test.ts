import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kBadge from '../src/components/I9kBadge.vue';

describe('I9kBadge', () => {
  it('renders a medium outline span by default', () => {
    const wrapper = mount(I9kBadge, { slots: { default: 'Open source' } });

    expect(wrapper.element.tagName).toBe('SPAN');
    expect(wrapper.text()).toBe('Open source');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['i9k-badge', 'i9k-badge--outline', 'i9k-badge--md']),
    );
    expect(wrapper.classes()).not.toContain('badge');
  });

  it.each(['solid', 'outline', 'tag'] as const)('renders the %s variant', (variant) => {
    const wrapper = mount(I9kBadge, { props: { variant } });

    expect(wrapper.classes()).toContain(`i9k-badge--${variant}`);
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s size', (size) => {
    const wrapper = mount(I9kBadge, { props: { size } });

    expect(wrapper.classes()).toContain(`i9k-badge--${size}`);
  });

  it('keeps the decorative tag hash out of text content', () => {
    const wrapper = mount(I9kBadge, {
      props: { variant: 'tag' },
      slots: { default: 'AI' },
    });

    expect(wrapper.text()).toBe('AI');
  });

  it('renders the selected root and forwards attributes', () => {
    const wrapper = mount(I9kBadge, {
      props: { as: 'strong' },
      attrs: { class: 'release-label', title: 'Stable release' },
    });

    expect(wrapper.element.tagName).toBe('STRONG');
    expect(wrapper.classes()).toContain('release-label');
    expect(wrapper.attributes('title')).toBe('Stable release');
  });
});
