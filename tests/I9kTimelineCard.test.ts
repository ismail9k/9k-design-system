import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kTimelineCard from '../src/components/I9kTimelineCard.vue';

describe('I9kTimelineCard', () => {
  it('formats an ISO date in UTC and defaults to medium size', () => {
    const wrapper = mount(I9kTimelineCard, { props: { date: '2026-01-25' } });

    expect(wrapper.get('.i9k-timeline-card__time').text()).toBe('January 25, 2026');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['timeline', 'i9k-timeline-card', 'i9k-timeline-card--md']),
    );
  });

  it('renders semantic title, default, and thumbnail slots', () => {
    const wrapper = mount(I9kTimelineCard, {
      props: { date: '2026-01-25', linked: true },
      slots: {
        title: '<a href="/article">Article title</a>',
        default: '<p>Article summary</p>',
        thumbnail: '<img src="/thumbnail.jpg" alt="" />',
      },
    });

    expect(wrapper.get('.i9k-timeline-card__title').text()).toBe('Article title');
    expect(wrapper.get('.i9k-timeline-card__main').text()).toContain('Article summary');
    expect(wrapper.get('.i9k-timeline-card__thumbnail img').attributes('src')).toBe(
      '/thumbnail.jpg',
    );
    expect(wrapper.get('.i9k-timeline-card__card').classes()).toEqual(
      expect.arrayContaining(['timeline__card', 'timeline__card--linked']),
    );
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s size', (size) => {
    const wrapper = mount(I9kTimelineCard, { props: { date: '2026-01-25', size } });

    expect(wrapper.classes()).toContain(`i9k-timeline-card--${size}`);
  });

  it('preserves legacy default-slot markup', () => {
    const wrapper = mount(I9kTimelineCard, {
      props: { date: '2026-01-25' },
      slots: { default: '<h3 class="timeline__title">Legacy title</h3>' },
    });

    expect(wrapper.get('.timeline__title').text()).toBe('Legacy title');
  });
});
