<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

export interface I9kNavigationLink {
  id: string;
  label: string;
  href: string;
}
const props = withDefaults(
  defineProps<{
    links: I9kNavigationLink[];
    brandHref?: string;
    brandLabel?: string;
    compactAt?: number;
    expandAt?: number;
  }>(),
  { brandHref: '/', brandLabel: 'Home', compactAt: 72, expandAt: 24 },
);
defineEmits<{ navigate: [link: I9kNavigationLink, event: MouseEvent] }>();
const isScrolled = ref(false);
const isCompact = ref(false);
const brandHref = computed(() => props.brandHref);
const handleScroll = () => {
  const offset = window.scrollY;
  isScrolled.value = offset > 0;
  if (offset > props.compactAt) isCompact.value = true;
  else if (offset < props.expandAt) isCompact.value = false;
};
onMounted(() => {
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
});
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>
<template>
  <header class="navigation" :class="{ 'is-scrolled': isScrolled }">
    <nav class="navigation__inner" :aria-label="brandLabel">
      <a class="navigation__brand" :href="brandHref" :aria-label="brandLabel"
        ><slot name="brand" :compact="isCompact"
      /></a>
      <div class="navigation__end">
        <ul class="navigation__menu">
          <li v-for="link in links" :key="link.id">
            <a
              class="navigation__link"
              :href="link.href"
              @click="$emit('navigate', link, $event)"
              >{{ link.label }}</a
            >
          </li>
        </ul>
        <div class="navigation__actions"><slot name="actions" /></div>
      </div>
    </nav>
  </header>
</template>
<style scoped>
.navigation {
  position: sticky;
  top: 0;
  z-index: 100;
  transition:
    background 0.3s ease,
    box-shadow 0.3s ease;
}
.navigation.is-scrolled {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  box-shadow: var(--shadow-sm);
}
.navigation__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 80rem;
  padding: var(--spacing-8) var(--spacing-13);
  margin: 0 auto;
}
.navigation__brand {
  padding: var(--spacing-4);
  color: inherit;
  text-decoration: none;
}
.navigation__end,
.navigation__menu,
.navigation__actions {
  display: flex;
  align-items: center;
}
.navigation__end {
  gap: var(--spacing-6);
}
.navigation__menu {
  flex-wrap: wrap;
  gap: var(--spacing-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
.navigation__link {
  display: block;
  padding: var(--spacing-5);
  color: var(--theme-text-color);
  text-decoration: none;
  transition: color 0.2s ease;
}
.navigation__link:hover,
.navigation__link:focus-visible {
  color: var(--primary-text-color);
}
@media (max-width: 768px) {
  .navigation__inner {
    padding: var(--spacing-6) var(--spacing-4);
  }
  .navigation__menu {
    display: none;
  }
}
</style>
