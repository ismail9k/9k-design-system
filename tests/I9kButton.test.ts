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
});
