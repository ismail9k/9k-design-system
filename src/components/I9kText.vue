<script setup lang="ts">
import type { Component } from 'vue';

import type { I9kComponentSize, I9kTextVariant } from '../types/components';

withDefaults(
  defineProps<{
    as?: string | Component;
    size?: I9kComponentSize;
    variant?: I9kTextVariant;
  }>(),
  {
    as: 'p',
    size: 'md',
    variant: 'body',
  },
);
</script>

<template>
  <component :is="as" :class="['i9k-text', `i9k-text--${variant}`, `i9k-text--${size}`]">
    <slot />
  </component>
</template>

<style scoped>
.i9k-text {
  --i9k-text-font-size: 1rem;
  --i9k-text-line-height: 1.6;

  font-size: var(--i9k-text-font-size);
  line-height: var(--i9k-text-line-height);
}

.i9k-text--sm {
  --i9k-text-font-size: 0.875rem;
  --i9k-text-line-height: 1.5;
}

.i9k-text--lg {
  --i9k-text-font-size: 1.125rem;
  --i9k-text-line-height: 1.7;
}

.i9k-text--lede {
  --i9k-text-font-size: 1.15rem;
  --i9k-text-line-height: 1.7;

  max-width: 62ch;
  margin: 0 0 var(--spacing-8);
  color: var(--text-color-light);
}

.i9k-text--lede.i9k-text--sm {
  --i9k-text-font-size: 1rem;
  --i9k-text-line-height: 1.6;
}

.i9k-text--lede.i9k-text--lg {
  --i9k-text-font-size: 1.3rem;
  --i9k-text-line-height: 1.75;
}
</style>
