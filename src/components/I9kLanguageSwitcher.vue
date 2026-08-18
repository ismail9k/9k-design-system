<script setup lang="ts">
withDefaults(defineProps<{ label: string; href: string; hreflang?: string | null }>(), {
  hreflang: null,
});
</script>
<template>
  <a class="language-switcher" :href="href" :hreflang="hreflang ?? undefined"
    ><slot>{{ label }}</slot></a
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
