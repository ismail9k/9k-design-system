<script setup lang="ts">
import type { Component } from 'vue';

import type { I9kComponentSize, I9kGridColumns } from '../types/components';

withDefaults(
  defineProps<{
    as?: string | Component;
    columns?: I9kGridColumns;
    size?: I9kComponentSize;
  }>(),
  {
    as: 'div',
    columns: 1,
    size: 'md',
  },
);
</script>

<template>
  <component :is="as" :class="['i9k-grid', `i9k-grid--columns-${columns}`, `i9k-grid--${size}`]">
    <slot />
  </component>
</template>

<style scoped>
.i9k-grid {
  --i9k-grid-gap: var(--spacing-8);

  display: grid;
  gap: var(--i9k-grid-gap);
}

.i9k-grid--sm {
  --i9k-grid-gap: var(--spacing-4);
}

.i9k-grid--lg {
  --i9k-grid-gap: var(--spacing-13);
}

.i9k-grid--columns-1 {
  grid-template-columns: minmax(0, 1fr);
}

.i9k-grid--columns-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.i9k-grid--columns-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.i9k-grid--columns-auto {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

@media (max-width: 768px) {
  .i9k-grid--columns-2,
  .i9k-grid--columns-3,
  .i9k-grid--columns-auto {
    grid-template-columns: 1fr;
  }
}
</style>
