import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kIcon from '../src/components/I9kIcon.vue';
import I9kLanguageSwitcher from '../src/components/I9kLanguageSwitcher.vue';

const baseProps = { label: 'العربية', href: '/ar' };

describe('I9kLanguageSwitcher', () => {
  it('renders the translate glyph beside the target locale code', () => {
    const wrapper = mount(I9kLanguageSwitcher, { props: { ...baseProps, code: 'ar' } });

    expect(wrapper.findComponent(I9kIcon).props('name')).toBe('translate');
    expect(wrapper.get('.i9k-language-switcher__code').text()).toBe('AR');
  });

  it('leaves a code that is not latin script alone', () => {
    const wrapper = mount(I9kLanguageSwitcher, { props: { ...baseProps, code: 'ع' } });

    expect(wrapper.get('.i9k-language-switcher__code').text()).toBe('ع');
  });

  it('names the link after the language it switches to, not the code', () => {
    const wrapper = mount(I9kLanguageSwitcher, { props: { ...baseProps, code: 'ar' } });

    expect(wrapper.get('a').attributes('aria-label')).toBe('العربية');
  });

  it('falls back to the label as visible text when no code is given', () => {
    const wrapper = mount(I9kLanguageSwitcher, { props: baseProps });

    expect(wrapper.text()).toBe('العربية');
    expect(wrapper.findComponent(I9kIcon).exists()).toBe(false);
  });

  it('forwards link attributes on a plain anchor', () => {
    const wrapper = mount(I9kLanguageSwitcher, {
      props: { ...baseProps, code: 'ar', hreflang: 'ar' },
    });
    const link = wrapper.get('a');

    expect(link.attributes('href')).toBe('/ar');
    expect(link.attributes('hreflang')).toBe('ar');
  });

  it('hands the destination to a caller-supplied link component', () => {
    const RouterLinkStub = defineComponent({
      props: { to: { type: [String, Object], required: true } },
      template: '<a data-router-link><slot /></a>',
    });
    const wrapper = mount(I9kLanguageSwitcher, {
      props: { ...baseProps, code: 'ar', linkComponent: RouterLinkStub },
    });

    expect(wrapper.getComponent(RouterLinkStub).props('to')).toBe('/ar');
    expect(wrapper.get('[data-router-link]').attributes('href')).toBeUndefined();
  });

  it('renders the legacy and prefixed class names side by side', () => {
    const wrapper = mount(I9kLanguageSwitcher, { props: { ...baseProps, code: 'ar' } });

    expect(wrapper.get('a').classes()).toEqual(
      expect.arrayContaining(['language-switcher', 'i9k-language-switcher']),
    );
  });
});
