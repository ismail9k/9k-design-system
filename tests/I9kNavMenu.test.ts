import { defineComponent, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import I9kNavMenu from '../src/components/I9kNavMenu.vue';

const links = [
  { id: 'blog', label: 'Blog', href: '/blog' },
  { id: 'talks', label: 'Talks', href: '/talks' },
];

const RouterLinkStub = defineComponent({
  props: { to: { type: [String, Object], required: true } },
  template: '<a data-router-link><slot /></a>',
});

// jsdom has never implemented window.matchMedia, and the panel reads it on mount
// to close itself once the viewport passes the desktop breakpoint.
let desktopMatches = false;
let desktopListeners: (() => void)[] = [];
beforeAll(() => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    get matches() {
      return desktopMatches;
    },
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: (_event: string, listener: () => void) => {
      desktopListeners.push(listener);
    },
    removeEventListener: (_event: string, listener: () => void) => {
      desktopListeners = desktopListeners.filter((entry) => entry !== listener);
    },
    dispatchEvent: () => false,
  }));
});

const resizeToDesktop = async (matches: boolean) => {
  desktopMatches = matches;
  desktopListeners.forEach((listener) => listener());
  await nextTick();
};

// The panel is teleported to <body>, so it is outside the wrapper's subtree and
// has to be reached through the document rather than through find/findAll.
const panelEl = () => document.querySelector<HTMLElement>('.nav-menu__panel');
const linkEls = () => [...document.querySelectorAll<HTMLElement>('.nav-menu__link')];

type MenuProps = InstanceType<typeof I9kNavMenu>['$props'];

const mounted: { unmount: () => void }[] = [];
const mountMenu = (props: MenuProps) => {
  const wrapper = mount(I9kNavMenu, { props, attachTo: document.body });
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  desktopMatches = false;
  desktopListeners = [];
  document.body.style.overflow = '';
});

const openMenu = async (wrapper: ReturnType<typeof mount>) => {
  await wrapper.get('.nav-menu__toggle').trigger('click');
  await nextTick();
};

describe('I9kNavMenu', () => {
  it('keeps the panel out of the document until the toggle is pressed', async () => {
    const wrapper = mountMenu({ links });

    expect(panelEl()).toBeNull();
    expect(wrapper.get('.nav-menu__toggle').attributes('aria-expanded')).toBe('false');

    await openMenu(wrapper);

    expect(panelEl()).not.toBeNull();
    expect(wrapper.get('.nav-menu__toggle').attributes('aria-expanded')).toBe('true');
  });

  it('names the toggle for the action it will perform', async () => {
    const wrapper = mountMenu({ links, openLabel: 'Open menu', closeLabel: 'Close menu' });

    expect(wrapper.get('.nav-menu__toggle').attributes('aria-label')).toBe('Open menu');
    await openMenu(wrapper);
    expect(wrapper.get('.nav-menu__toggle').attributes('aria-label')).toBe('Close menu');
  });

  it('labels the panel as a modal dialog and points the toggle at it', async () => {
    const wrapper = mountMenu({ links, menuLabel: 'Site menu' });
    await openMenu(wrapper);

    const panel = panelEl() as HTMLElement;
    expect(panel.getAttribute('role')).toBe('dialog');
    expect(panel.getAttribute('aria-modal')).toBe('true');
    expect(panel.getAttribute('aria-label')).toBe('Site menu');
    expect(wrapper.get('.nav-menu__toggle').attributes('aria-controls')).toBe(panel.id);
  });

  it('locks page scrolling only while the panel is open', async () => {
    const wrapper = mountMenu({ links });

    await openMenu(wrapper);
    expect(document.body.style.overflow).toBe('hidden');

    await wrapper.get('.nav-menu__toggle').trigger('click');
    await nextTick();
    expect(document.body.style.overflow).toBe('');
  });

  it('releases the scroll lock if it is unmounted while open', async () => {
    const wrapper = mountMenu({ links });
    await openMenu(wrapper);
    wrapper.unmount();

    expect(document.body.style.overflow).toBe('');
  });

  it('renders plain anchors by default and hands destinations to a link component', async () => {
    const plain = mountMenu({ links });
    await openMenu(plain);
    expect(linkEls().map((link) => link.getAttribute('href'))).toEqual(['/blog', '/talks']);
    plain.unmount();

    const routed = mountMenu({ links, linkComponent: RouterLinkStub });
    await openMenu(routed);
    expect(routed.findAllComponents(RouterLinkStub).map((link) => link.props('to'))).toEqual([
      '/blog',
      '/talks',
    ]);
  });

  it('reports the clicked link and closes itself', async () => {
    const wrapper = mountMenu({ links });
    await openMenu(wrapper);

    linkEls()[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();

    expect(wrapper.emitted('navigate')?.[0]?.[0]).toEqual(links[1]);
    expect(panelEl()).toBeNull();
  });

  it('closes on Escape', async () => {
    const wrapper = mountMenu({ links });
    await openMenu(wrapper);

    panelEl()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await nextTick();

    expect(panelEl()).toBeNull();
  });

  it('mirrors every state change through update:open', async () => {
    const wrapper = mountMenu({ links });

    await openMenu(wrapper);
    panelEl()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await nextTick();

    expect(wrapper.emitted('update:open')).toEqual([[true], [false]]);
  });

  it('follows an open state pushed in from the consumer', async () => {
    const wrapper = mountMenu({ links, open: true });
    await nextTick();
    expect(panelEl()).not.toBeNull();

    await wrapper.setProps({ open: false });
    await nextTick();
    expect(panelEl()).toBeNull();
  });

  it('closes when the viewport grows past the desktop breakpoint', async () => {
    const wrapper = mountMenu({ links });
    await openMenu(wrapper);
    expect(panelEl()).not.toBeNull();

    await resizeToDesktop(true);
    expect(panelEl()).toBeNull();
  });

  it('stays open while the viewport is still below the desktop breakpoint', async () => {
    const wrapper = mountMenu({ links });
    await openMenu(wrapper);

    await resizeToDesktop(false);
    expect(panelEl()).not.toBeNull();
  });

  it('renders the panel inline and stripped of its controls in preview mode', () => {
    const wrapper = mount(I9kNavMenu, { props: { links, preview: true } });

    expect(wrapper.find('.nav-menu__toggle').exists()).toBe(false);
    expect(wrapper.find('.nav-menu__close').exists()).toBe(false);
    const panel = wrapper.get('.nav-menu__panel');
    expect(panel.classes()).toContain('is-preview');
    expect(panel.attributes('role')).toBeUndefined();
    expect(panel.attributes('aria-modal')).toBeUndefined();
    expect(document.body.style.overflow).toBe('');
  });

  it('passes the compact state to the brand slot', () => {
    const wrapper = mount(I9kNavMenu, {
      props: { links, preview: true, compact: true },
      slots: { brand: '<template #default="{ compact }"><b>{{ String(compact) }}</b></template>' },
    });

    expect(wrapper.get('b').text()).toBe('true');
  });

  it('staggers the links so they animate in order', () => {
    const wrapper = mount(I9kNavMenu, { props: { links, preview: true } });

    expect(wrapper.findAll('.nav-menu__links li').map((li) => li.attributes('style'))).toEqual([
      '--stagger: 0ms;',
      '--stagger: 40ms;',
    ]);
  });
});
