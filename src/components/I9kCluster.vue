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
  <component :is="as" :class="['i9k-cluster', `i9k-cluster--${size}`]">
    <slot />
  </component>
</template>

<style scoped>
.i9k-cluster {
  --i9k-cluster-gap: var(--spacing-6);

  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--i9k-cluster-gap);
}

.i9k-cluster--sm {
  --i9k-cluster-gap: var(--spacing-4);
}

.i9k-cluster--lg {
  --i9k-cluster-gap: var(--spacing-8);
}
</style>
