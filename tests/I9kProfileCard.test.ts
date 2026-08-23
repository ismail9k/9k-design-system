import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kProfileCard from '../src/components/I9kProfileCard.vue';

describe('I9kProfileCard', () => {
  it('renders profile content and compatibility classes at medium size', () => {
    const wrapper = mount(I9kProfileCard, {
      props: { name: 'Abdelrahman Ismail', alias: 'Ismail9k', namePrefix: 'Written by' },
      slots: { default: 'Software engineer' },
    });

    expect(wrapper.text()).toContain('Written by Abdelrahman Ismail');
    expect(wrapper.text()).toContain('Ismail9k');
    expect(wrapper.text()).toContain('Software engineer');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'surface',
        'profile-card',
        'i9k-profile-card',
        'i9k-profile-card--md',
      ]),
    );
  });

  it('renders the native avatar attributes', () => {
    const wrapper = mount(I9kProfileCard, {
      props: {
        name: 'Abdelrahman Ismail',
        avatarSrc: '/avatar.jpg',
        avatarAlt: 'Abdelrahman Ismail',
      },
    });

    const avatar = wrapper.get('img');
    expect(avatar.attributes('src')).toBe('/avatar.jpg');
    expect(avatar.attributes('alt')).toBe('Abdelrahman Ismail');
    expect(avatar.attributes('loading')).toBe('lazy');
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s size', (size) => {
    const wrapper = mount(I9kProfileCard, {
      props: { name: 'Abdelrahman Ismail', size },
    });

    expect(wrapper.classes()).toContain(`i9k-profile-card--${size}`);
  });

  it('owns the action layout while retaining cluster compatibility', () => {
    const wrapper = mount(I9kProfileCard, {
      props: { name: 'Abdelrahman Ismail' },
      slots: { actions: '<a href="#profile">Profile</a>' },
    });

    expect(wrapper.get('.i9k-profile-card__actions').classes()).toEqual(
      expect.arrayContaining(['cluster', 'cluster--tight', 'profile-card__actions']),
    );
  });
});
