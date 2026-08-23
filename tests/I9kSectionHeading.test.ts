import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kSectionHeading from '../src/components/I9kSectionHeading.vue';

describe('I9kSectionHeading', () => {
  it('renders component-owned title typography without consumer classes', () => {
    const wrapper = mount(I9kSectionHeading, {
      props: {
        title: 'Shared section heading',
        description: 'Section supporting copy',
        level: 3,
      },
    });

    const title = wrapper.get('h3');
    expect(title.text()).toBe('Shared section heading');
    expect(title.classes()).toContain('section-heading-title');
    expect(title.classes()).not.toContain('title');
    expect(wrapper.get('.section-heading-description').text()).toBe('Section supporting copy');
  });
});
