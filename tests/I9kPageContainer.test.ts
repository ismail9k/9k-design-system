import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kPageContainer from '../src/components/I9kPageContainer.vue';

describe('I9kPageContainer', () => {
  it('renders a medium div without the website compatibility class', () => {
    const wrapper = mount(I9kPageContainer, { slots: { default: '<h1>Projects</h1>' } });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.get('h1').text()).toBe('Projects');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['i9k-page-container', 'i9k-page-container--md']),
    );
    expect(wrapper.classes()).not.toContain('container');
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s gutter size', (size) => {
    const wrapper = mount(I9kPageContainer, { props: { size } });

    expect(wrapper.classes()).toContain(`i9k-page-container--${size}`);
  });

  it('renders a selected section root and forwards attributes', () => {
    const wrapper = mount(I9kPageContainer, {
      props: { as: 'section' },
      attrs: { class: 'project-page', 'aria-labelledby': 'projects-title' },
    });

    expect(wrapper.element.tagName).toBe('SECTION');
    expect(wrapper.classes()).toContain('project-page');
    expect(wrapper.attributes('aria-labelledby')).toBe('projects-title');
  });
});
