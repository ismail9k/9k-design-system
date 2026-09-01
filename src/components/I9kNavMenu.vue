<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useId, watch } from 'vue';

import type { I9kNavigationLink } from './I9kNavigation.vue';

const props = withDefaults(
  defineProps<{
    links: I9kNavigationLink[];
    open?: boolean;
    compact?: boolean;
    linkComponent?: string | object | null;
    preview?: boolean;
    openLabel?: string;
    closeLabel?: string;
    menuLabel?: string;
    desktopQuery?: string;
  }>(),
  {
    open: false,
    compact: false,
    linkComponent: null,
    preview: false,
    openLabel: 'Open menu',
    closeLabel: 'Close menu',
    menuLabel: 'Site menu',
    desktopQuery: '(min-width: 769px)',
  },
);
const emit = defineEmits<{
  'update:open': [open: boolean];
  navigate: [link: I9kNavigationLink, event: MouseEvent];
}>();

const tag = computed(() => props.linkComponent ?? 'a');

// The panel drives itself, so a consumer that never binds open still gets a
// working menu; binding v-model:open mirrors the state back for the cases only
// the consumer can see, such as closing after a router navigation.
const isOpen = ref(props.open);
watch(
  () => props.open,
  (open) => {
    isOpen.value = open;
  },
);
const setOpen = (open: boolean) => {
  isOpen.value = open;
  emit('update:open', open);
};
const close = () => setOpen(false);

const panel = ref<HTMLElement | null>(null);
const toggle = ref<HTMLElement | null>(null);
const panelId = useId();

const isPanelVisible = computed(() => props.preview || isOpen.value);
const toggleLabel = computed(() => (isOpen.value ? props.closeLabel : props.openLabel));

const FOCUSABLE = 'a[href], button:not([disabled])';

let desktopMediaQuery: MediaQueryList | undefined;

// The panel is teleported to <body>, so no CSS in the header that mounts this
// can reach it. A resize past the breakpoint has to be handled here.
const handleDesktopChange = () => {
  if (desktopMediaQuery?.matches) close();
};

const handleLinkClick = (link: I9kNavigationLink, event: MouseEvent) => {
  emit('navigate', link, event);
  close();
};

// Escape closes. Tab cycles within the panel: while aria-modal is set, the
// rest of the page must not be reachable by keyboard.
const handleKeydown = (event: KeyboardEvent) => {
  if (props.preview) return;

  if (event.key === 'Escape') {
    close();
    return;
  }

  if (event.key !== 'Tab' || !panel.value) return;

  const items = panel.value.querySelectorAll<HTMLElement>(FOCUSABLE);
  if (!items.length) return;

  const first = items[0];
  const last = items[items.length - 1];
  const active = document.activeElement;

  if (event.shiftKey && (active === first || active === panel.value)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
};

watch(isOpen, async (open) => {
  if (props.preview) return;

  document.body.style.overflow = open ? 'hidden' : '';

  if (open) {
    await nextTick();
    panel.value?.querySelector<HTMLElement>('.nav-menu__close')?.focus();
  } else {
    toggle.value?.focus();
  }
});

onMounted(() => {
  if (props.preview) return;
  desktopMediaQuery = window.matchMedia(props.desktopQuery);
  desktopMediaQuery.addEventListener('change', handleDesktopChange);
});

onUnmounted(() => {
  if (props.preview) return;
  document.body.style.overflow = '';
  desktopMediaQuery?.removeEventListener('change', handleDesktopChange);
});
</script>
<template>
  <div class="nav-menu">
    <button
      v-if="!preview"
      ref="toggle"
      class="nav-menu__toggle"
      type="button"
      :aria-label="toggleLabel"
      :aria-expanded="isOpen"
      :aria-controls="panelId"
      @click="setOpen(!isOpen)"
    >
      <span class="nav-menu__bars" :class="{ 'is-open': isOpen }" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </button>

    <Teleport to="body" :disabled="preview">
      <Transition name="nav-menu">
        <div
          v-if="isPanelVisible"
          :id="panelId"
          ref="panel"
          class="nav-menu__panel"
          :class="{ 'is-preview': preview }"
          :role="preview ? undefined : 'dialog'"
          :aria-modal="preview ? undefined : 'true'"
          :aria-label="preview ? undefined : menuLabel"
          tabindex="-1"
          @keydown="handleKeydown"
        >
          <div class="nav-menu__head">
            <slot name="brand" :compact="compact" />
            <button
              v-if="!preview"
              class="nav-menu__close"
              type="button"
              :aria-label="closeLabel"
              @click="close"
            >
              <span class="nav-menu__bars is-open" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>

          <ul class="nav-menu__links">
            <li
              v-for="(link, index) in links"
              :key="link.id"
              :style="{ '--stagger': `${index * 40}ms` }"
            >
              <component
                :is="tag"
                class="nav-menu__link"
                :to="linkComponent ? link.href : undefined"
                :href="linkComponent ? undefined : link.href"
                @click="handleLinkClick(link, $event)"
              >
                {{ link.label }}<span class="nav-menu__caret" aria-hidden="true">_</span>
              </component>
            </li>
          </ul>

          <div class="nav-menu__foot"><slot name="footer" /></div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
<style scoped>
.nav-menu__toggle,
.nav-menu__close {
  display: grid;
  padding: var(--spacing-6);
  border: none;
  background: none;
  color: var(--theme-text-color);
  cursor: pointer;
  place-items: center;
}

/* Three lines that morph into the X, rather than swapping to a different
   glyph, using the same approach I9kThemeSwitcher takes with its sun/moon. */
.nav-menu__bars {
  position: relative;
  display: block;
  width: 22px;
  height: 16px;
}

.nav-menu__bars span {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  border-radius: 2px;
  background: currentColor;
  transition:
    transform 0.25s ease,
    opacity 0.2s ease;
}

.nav-menu__bars span:nth-child(1) {
  top: 0;
}
.nav-menu__bars span:nth-child(2) {
  top: 7px;
}
.nav-menu__bars span:nth-child(3) {
  top: 14px;
}

.nav-menu__bars.is-open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.nav-menu__bars.is-open span:nth-child(2) {
  opacity: 0;
}
.nav-menu__bars.is-open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.nav-menu__panel {
  position: fixed;
  z-index: 200; /* I9kNavigation is 100 */
  inset: 0;
  display: flex;
  overflow-y: auto;
  padding: var(--spacing-6) var(--spacing-10) max(var(--spacing-11), env(safe-area-inset-bottom));
  background: var(--theme-bg-color);
  flex-direction: column;
  overscroll-behavior: contain;
}

/* Specimen mode: same composition, bounded box, no page takeover. */
.nav-menu__panel.is-preview {
  position: static;
  z-index: auto;
  height: 440px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
}

.nav-menu__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-15);
}

.nav-menu__caret {
  color: var(--primary-text-color);
}

.nav-menu__links {
  display: grid;
  margin: 0;
  padding: 0;
  gap: var(--spacing-11);
  list-style: none;
}

.nav-menu__links li {
  animation: nav-menu-link 0.3s ease backwards;
  animation-delay: var(--stagger);
}

.nav-menu__link {
  color: var(--theme-text-color);
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  text-decoration: none;
}

/* The active route borrows the wordmark's caret instead of inventing a
   separate active treatment. A router link marks itself: vue-router adds
   router-link-active for the whole branch and aria-current="page" on an exact
   match. Plain anchors match neither and keep the caret hidden. */
.nav-menu__link .nav-menu__caret {
  opacity: 0;
}

.nav-menu__link.router-link-active,
.nav-menu__link[aria-current='page'] {
  color: var(--primary-text-color);
}

.nav-menu__link.router-link-active .nav-menu__caret,
.nav-menu__link[aria-current='page'] .nav-menu__caret {
  opacity: 1;
}

.nav-menu__foot {
  display: grid;
  margin-top: auto;
  padding-top: var(--spacing-11);
  border-top: 1px solid var(--border-color);
  gap: var(--spacing-8);
}

.nav-menu-enter-active,
.nav-menu-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.nav-menu-enter-from,
.nav-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@keyframes nav-menu-link {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .nav-menu__bars span,
  .nav-menu-enter-active,
  .nav-menu-leave-active {
    transition: none;
  }

  .nav-menu__links li {
    animation: none;
  }
}
</style>
