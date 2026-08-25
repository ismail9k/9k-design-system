import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kLinkCard from '../src/components/I9kLinkCard.vue';

const requiredProps = {
  name: 'Vue Carousel',
  url: 'https://example.com/project',
  description: 'A carousel for Vue applications.',
};

describe('I9kLinkCard', () => {
  it('preserves external-link semantics and emits click intent', async () => {
    const wrapper = mount(I9kLinkCard, { props: requiredProps });

    expect(wrapper.attributes('href')).toBe(requiredProps.url);
    expect(wrapper.attributes('target')).toBe('_blank');
    expect(wrapper.attributes('rel')).toBe('noopener');

    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('uses scoped and compatibility classes at the medium size by default', () => {
    const wrapper = mount(I9kLinkCard, { props: requiredProps });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'surface',
        'surface--interactive',
        'link-card',
        'i9k-link-card',
        'i9k-link-card--md',
      ]),
    );
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s size', (size) => {
    const wrapper = mount(I9kLinkCard, { props: { ...requiredProps, size } });

    expect(wrapper.classes()).toContain(`i9k-link-card--${size}`);
  });

  it('groups the badge and the arrow in one corner row so they cannot overlap', () => {
    const wrapper = mount(I9kLinkCard, {
      props: { ...requiredProps, badge: 'Product', arrow: true },
    });

    const meta = wrapper.get('.i9k-link-card__meta');

    expect(meta.classes()).toContain('link-card-meta');
    expect(meta.find('.i9k-link-card__badge').exists()).toBe(true);
    expect(meta.find('.i9k-link-card__arrow').exists()).toBe(true);
    expect(wrapper.findAll('.i9k-link-card__arrow')).toHaveLength(1);
  });

  it('omits the corner row when there is neither a badge nor an arrow', () => {
    const wrapper = mount(I9kLinkCard, { props: requiredProps });

    expect(wrapper.find('.i9k-link-card__meta').exists()).toBe(false);
  });

  it('renders a scoped compatibility badge', () => {
    const wrapper = mount(I9kLinkCard, {
      props: { ...requiredProps, badge: 'Library' },
    });

    expect(wrapper.get('.i9k-link-card__badge').classes()).toEqual(
      expect.arrayContaining(['badge', 'badge--solid', 'link-card-badge']),
    );
  });
});
