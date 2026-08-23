import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kAsciiEmoji from '../src/components/I9kAsciiEmoji.vue';

describe('I9kAsciiEmoji', () => {
  it('renders the built-in accessible label and medium size by default', () => {
    const wrapper = mount(I9kAsciiEmoji, { props: { name: '^_^' } });

    expect(wrapper.attributes('role')).toBe('img');
    expect(wrapper.attributes('aria-label')).toBe('happy');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'emoticon',
        'emoticon--md',
        'i9k-ascii-emoji',
        'i9k-ascii-emoji--md',
        'i9k-ascii-emoji--primary',
      ]),
    );
  });

  it('uses an explicit accessible label', () => {
    const wrapper = mount(I9kAsciiEmoji, {
      props: { name: 'o_o', label: 'Unexpected result' },
    });

    expect(wrapper.attributes('aria-label')).toBe('Unexpected result');
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s size', (size) => {
    const wrapper = mount(I9kAsciiEmoji, { props: { name: '·ᴗ·', size } });

    expect(wrapper.classes()).toContain(`i9k-ascii-emoji--${size}`);
    expect(wrapper.classes()).toContain(`emoticon--${size}`);
  });
});
