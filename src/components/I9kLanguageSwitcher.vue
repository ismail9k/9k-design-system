<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    label: string;
    href: string;
    hreflang?: string | null;
    linkComponent?: string | object | null;
  }>(),
  { hreflang: null, linkComponent: null },
);
const tag = computed(() => props.linkComponent ?? 'a');
</script>
<template>
  <component
    :is="tag"
    class="language-switcher"
    :to="linkComponent ? href : undefined"
    :href="!linkComponent ? href : undefined"
    :hreflang="hreflang ?? undefined"
    ><slot>{{ label }}</slot></component
  >
</template>
<style scoped>
.language-switcher {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-4) var(--spacing-6);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-pill);
  color: var(--theme-text-color);
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition);
}
.language-switcher:hover {
  border-color: var(--primary-color);
  color: var(--primary-text-color);
}
</style>
