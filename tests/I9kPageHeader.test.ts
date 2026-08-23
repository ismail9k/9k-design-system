import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kPageHeader from '../src/components/I9kPageHeader.vue';

describe('I9kPageHeader', () => {
  it('renders component-owned title typography without consumer classes', () => {
    const wrapper = mount(I9kPageHeader, {
      props: {
        title: 'Shared page heading',
        description: 'Shared supporting copy',
        level: 2,
      },
    });

    const title = wrapper.get('h2');
    expect(title.text()).toBe('Shared page heading');
    expect(title.classes()).toContain('page-header-title');
    expect(title.classes()).not.toContain('main-title');
    expect(wrapper.get('.lede').text()).toBe('Shared supporting copy');
  });
});
