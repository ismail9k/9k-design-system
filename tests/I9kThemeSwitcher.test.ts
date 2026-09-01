import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kIcon from '../src/components/I9kIcon.vue';
import I9kThemeSwitcher from '../src/components/I9kThemeSwitcher.vue';

describe('I9kThemeSwitcher', () => {
  it('shows the moon icon while light, because the button switches to dark', () => {
    const wrapper = mount(I9kThemeSwitcher, { props: { modelValue: false } });

    expect(wrapper.findComponent(I9kIcon).props('name')).toBe('moon');
  });

  it('shows the sun icon while dark, because the button switches to light', () => {
    const wrapper = mount(I9kThemeSwitcher, { props: { modelValue: true } });

    expect(wrapper.findComponent(I9kIcon).props('name')).toBe('sun');
  });

  it('labels the button with the theme it switches to', () => {
    const light = mount(I9kThemeSwitcher, {
      props: { modelValue: false, darkLabel: 'Switch to dark mode' },
    });
    const dark = mount(I9kThemeSwitcher, {
      props: { modelValue: true, lightLabel: 'Switch to light mode' },
    });

    expect(light.get('button').attributes('aria-label')).toBe('Switch to dark mode');
    expect(dark.get('button').attributes('aria-label')).toBe('Switch to light mode');
  });

  it('exposes the current theme as a pressed state', () => {
    const wrapper = mount(I9kThemeSwitcher, { props: { modelValue: true } });

    expect(wrapper.get('button').attributes('aria-pressed')).toBe('true');
  });

  it('emits the negated value when clicked', async () => {
    const wrapper = mount(I9kThemeSwitcher, { props: { modelValue: false } });

    await wrapper.get('button').trigger('click');

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]]);
  });

  it('keeps its icon decorative so the button label is announced once', () => {
    const wrapper = mount(I9kThemeSwitcher, { props: { modelValue: false } });

    expect(wrapper.get('svg').attributes('aria-hidden')).toBe('true');
  });

  it('renders the legacy and prefixed class names side by side', () => {
    const wrapper = mount(I9kThemeSwitcher, { props: { modelValue: true } });

    expect(wrapper.get('button').classes()).toEqual(
      expect.arrayContaining(['theme-switcher', 'i9k-theme-switcher', 'is-dark']),
    );
  });
});
