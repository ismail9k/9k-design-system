import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kText from '../src/components/I9kText.vue';

describe('I9kText', () => {
  it('renders a medium body paragraph by default', () => {
    const wrapper = mount(I9kText, { slots: { default: 'Product introduction.' } });

    expect(wrapper.element.tagName).toBe('P');
    expect(wrapper.text()).toBe('Product introduction.');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['i9k-text', 'i9k-text--body', 'i9k-text--md']),
    );
  });

  it.each(['body', 'lede'] as const)('renders the %s variant', (variant) => {
    const wrapper = mount(I9kText, { props: { variant } });

    expect(wrapper.classes()).toContain(`i9k-text--${variant}`);
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s size', (size) => {
    const wrapper = mount(I9kText, { props: { size } });

    expect(wrapper.classes()).toContain(`i9k-text--${size}`);
  });

  it('renders lede text as a blockquote when requested', () => {
    const wrapper = mount(I9kText, {
      props: { as: 'blockquote', variant: 'lede', size: 'lg' },
      attrs: { cite: 'https://example.com', class: 'opening-copy' },
      slots: { default: 'A clear introduction.' },
    });

    expect(wrapper.element.tagName).toBe('BLOCKQUOTE');
    expect(wrapper.attributes('cite')).toBe('https://example.com');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['opening-copy', 'i9k-text', 'i9k-text--lede', 'i9k-text--lg']),
    );
    expect(wrapper.classes()).not.toContain('lede');
  });
});
