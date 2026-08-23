import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kButton from '../src/components/I9kButton.vue';

describe('I9kButton', () => {
  it('renders a typed button with the default variant', () => {
    const wrapper = mount(I9kButton, {
      slots: { default: 'Save changes' },
    });

    const button = wrapper.get('button');
    expect(button.text()).toBe('Save changes');
    expect(button.attributes('type')).toBe('button');
    expect(button.classes()).toContain('btn--default');
  });

  it('renders an anchor when an href is provided', () => {
    const wrapper = mount(I9kButton, {
      props: { href: '/projects', variant: 'primary' },
      slots: { default: 'View projects' },
    });

    const link = wrapper.get('a');
    expect(link.attributes('href')).toBe('/projects');
    expect(link.attributes('type')).toBeUndefined();
    expect(link.classes()).toContain('btn--primary');
  });

  it('uses the medium size by default', () => {
    const wrapper = mount(I9kButton, { slots: { default: 'Save' } });

    expect(wrapper.get('button').classes()).toEqual(
      expect.arrayContaining([
        'btn',
        'btn--default',
        'i9k-button',
        'i9k-button--default',
        'i9k-button--md',
      ]),
    );
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s size', (size) => {
    const wrapper = mount(I9kButton, {
      props: { size },
      slots: { default: size },
    });

    expect(wrapper.get('button').classes()).toContain(`i9k-button--${size}`);
  });

  it('keeps the active compatibility class', () => {
    const wrapper = mount(I9kButton, {
      props: { variant: 'filter', active: true },
      slots: { default: 'Selected' },
    });

    expect(wrapper.get('button').classes()).toEqual(
      expect.arrayContaining(['btn--filter', 'i9k-button--filter', 'is-active']),
    );
  });
});
