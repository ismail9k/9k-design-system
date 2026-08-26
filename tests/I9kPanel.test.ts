import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kPanel from '../src/components/I9kPanel.vue';

describe('I9kPanel', () => {
  it('renders a medium default div', () => {
    const wrapper = mount(I9kPanel, { slots: { default: 'Panel content' } });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.text()).toBe('Panel content');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['i9k-panel', 'i9k-panel--default', 'i9k-panel--md']),
    );
    expect(wrapper.classes()).not.toContain('surface');
  });

  it.each(['default', 'feature', 'flat'] as const)('renders the %s variant', (variant) => {
    const wrapper = mount(I9kPanel, { props: { variant } });

    expect(wrapper.classes()).toContain(`i9k-panel--${variant}`);
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s size', (size) => {
    const wrapper = mount(I9kPanel, { props: { size } });

    expect(wrapper.classes()).toContain(`i9k-panel--${size}`);
  });

  it('renders the selected root and forwards consumer attributes', () => {
    const wrapper = mount(I9kPanel, {
      props: { as: 'article' },
      attrs: { class: 'project-panel', 'aria-labelledby': 'project-title' },
    });

    expect(wrapper.element.tagName).toBe('ARTICLE');
    expect(wrapper.classes()).toContain('project-panel');
    expect(wrapper.attributes('aria-labelledby')).toBe('project-title');
  });
});
