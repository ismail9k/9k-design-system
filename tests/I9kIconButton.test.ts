import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import I9kIconButton from '../src/components/I9kIconButton.vue';

describe('I9kIconButton', () => {
  it('renders a labeled native button with a decorative icon', () => {
    const wrapper = mount(I9kIconButton, { props: { icon: 'home', label: 'Go home' } });
    const button = wrapper.get('button');

    expect(button.attributes('type')).toBe('button');
    expect(button.attributes('aria-label')).toBe('Go home');
    expect(button.classes()).toEqual(
      expect.arrayContaining([
        'i9k-icon-button',
        'i9k-icon-button--secondary',
        'i9k-icon-button--md',
      ]),
    );
    expect(button.get('svg').attributes('aria-hidden')).toBe('true');
  });

  it('renders an anchor and forwards link attributes', () => {
    const wrapper = mount(I9kIconButton, {
      props: { icon: 'github', label: 'GitHub', href: 'https://github.com/ismail9k' },
      attrs: { target: '_blank', rel: 'noreferrer' },
    });
    const link = wrapper.get('a');

    expect(link.attributes('href')).toBe('https://github.com/ismail9k');
    expect(link.attributes('target')).toBe('_blank');
    expect(link.attributes('type')).toBeUndefined();
  });

  it('owns its accessible label while preserving root type, class, and native attrs', () => {
    const wrapper = mount(I9kIconButton, {
      props: { icon: 'home', label: 'Go home', type: 'submit' },
      attrs: {
        'aria-label': '',
        class: 'consumer-action',
        'data-testid': 'home-action',
      },
    });
    const button = wrapper.get('button');

    expect(button.attributes('aria-label')).toBe('Go home');
    expect(button.attributes('type')).toBe('submit');
    expect(button.attributes('data-testid')).toBe('home-action');
    expect(button.classes()).toEqual(
      expect.arrayContaining(['consumer-action', 'i9k-icon-button', 'i9k-icon-button--secondary']),
    );
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s size', (size) => {
    const wrapper = mount(I9kIconButton, { props: { icon: 'mail', label: 'Mail', size } });
    expect(wrapper.classes()).toContain(`i9k-icon-button--${size}`);
  });

  it.each(['secondary', 'primary', 'ghost'] as const)('renders the %s variant', (variant) => {
    const wrapper = mount(I9kIconButton, { props: { icon: 'menu', label: 'Menu', variant } });
    expect(wrapper.classes()).toContain(`i9k-icon-button--${variant}`);
  });

  it('passes a route destination to a consumer router component', () => {
    const RouterLinkStub = defineComponent({
      props: { to: { type: [String, Object], required: true } },
      template: '<a data-router-link><slot /></a>',
    });
    const wrapper = mount(I9kIconButton, {
      props: { icon: 'home', label: 'Home', to: '/home', linkComponent: RouterLinkStub },
    });

    expect(wrapper.getComponent(RouterLinkStub).props('to')).toBe('/home');
  });

  it('warns when the accessible label is empty', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mount(I9kIconButton, { props: { icon: 'home', label: '   ' } });

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('non-empty label'));
    warn.mockRestore();
  });
});
