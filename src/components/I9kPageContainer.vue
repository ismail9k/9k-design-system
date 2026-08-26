<script setup lang="ts">
import type { Component } from 'vue';

import type { I9kComponentSize } from '../types/components';

withDefaults(
  defineProps<{
    as?: string | Component;
    size?: I9kComponentSize;
  }>(),
  {
    as: 'div',
    size: 'md',
  },
);
</script>

<template>
  <component :is="as" :class="['i9k-page-container', `i9k-page-container--${size}`]">
    <slot />
  </component>
</template>

<style scoped>
.i9k-page-container {
  --i9k-page-container-gutter: var(--spacing-13);

  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 1000px;
  max-width: 100%;
  min-height: calc(100vh - 250px);
  margin-inline: auto;
  padding-block: var(--spacing-8);
  padding-inline: var(--i9k-page-container-gutter);
}

.i9k-page-container--sm {
  --i9k-page-container-gutter: var(--spacing-8);
}

.i9k-page-container--lg {
  --i9k-page-container-gutter: var(--spacing-18);
}

@media (max-width: 768px) {
  .i9k-page-container {
    --i9k-page-container-gutter: var(--spacing-8);

    width: 100%;
  }
}
</style>
