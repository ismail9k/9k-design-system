import { flushPromises, mount } from '@vue/test-utils';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import ShowcasePromptBlock from '../showcase/components/ShowcasePromptBlock.vue';
import ShowcaseApp from '../showcase/ShowcaseApp.vue';

// ShowcaseApp merges the real showcase/registry entries against props/emits/slots extracted from
// src/components/*.vue at build time via the virtual:showcase-data module (aliased to an empty
// fixture for tests — see vite.config.ts's `test.alias`). mergeRegistry throws if an entry has no
// matching extracted component, so `entries` is stubbed empty too — these tests only exercise
// ShowcaseApp's own toggle behavior, not the per-component specimens. vi.mock calls are hoisted
// above these imports by Vitest, so declaration order here doesn't matter.
vi.mock('../showcase/registry', () => ({ entries: [] }));

// jsdom has never implemented window.matchMedia. Stubbed defensively, following the pattern in
// tests/showcaseDemos.test.ts, in case any mounted showcase component reads it.
beforeAll(() => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }));
});

afterAll(() => {
  vi.unstubAllGlobals();
});

beforeEach(() => {
  document.documentElement.className = '';
});

describe('ShowcaseApp theme toggle', () => {
  it('flips the button label and the document root classes on each click', async () => {
    const wrapper = mount(ShowcaseApp);
    const button = wrapper.findAll('button').find((b) => b.text().startsWith('Theme:'));
    expect(button).toBeDefined();

    expect(button!.text()).toBe('Theme: light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    await button!.trigger('click');

    expect(button!.text()).toBe('Theme: dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);

    await button!.trigger('click');

    expect(button!.text()).toBe('Theme: light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});

describe('ShowcaseApp direction toggle', () => {
  it('flips the dir attribute on <main>, not the outer page wrapper', async () => {
    const wrapper = mount(ShowcaseApp);
    const button = wrapper.findAll('button').find((b) => b.text().startsWith('Direction:'));
    expect(button).toBeDefined();

    const main = wrapper.find('main');
    expect(main.attributes('dir')).toBe('ltr');
    expect(wrapper.find('.showcase').attributes('dir')).toBeUndefined();

    await button!.trigger('click');

    expect(button!.text()).toBe('Direction: rtl');
    expect(main.attributes('dir')).toBe('rtl');
    expect(wrapper.find('.showcase').attributes('dir')).toBeUndefined();

    await button!.trigger('click');

    expect(button!.text()).toBe('Direction: ltr');
    expect(main.attributes('dir')).toBe('ltr');
  });
});

describe('ShowcasePromptBlock copy button', () => {
  const prompt = 'Use I9kButton like this: <I9kButton>Click</I9kButton>';
  let writeText: ReturnType<typeof vi.fn>;
  let originalClipboard: unknown;

  beforeEach(() => {
    originalClipboard = (navigator as { clipboard?: unknown }).clipboard;
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true,
    });
  });

  it('copies the exact prompt text and flips the label to its copied state', async () => {
    const wrapper = mount(ShowcasePromptBlock, { props: { prompt } });
    const button = wrapper.find('button');
    expect(button.text()).toBe('Copy');

    await button.trigger('click');
    await flushPromises();

    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith(prompt);
    expect(button.text()).toBe('Copied');
  });
});
