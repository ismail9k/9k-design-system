<script setup lang="ts">
import type { Component } from 'vue';

import type { I9kComponentSize } from '../types/components';

withDefaults(
  defineProps<{
    as?: string | Component;
    label?: string;
    size?: I9kComponentSize;
    source?: string;
    value?: string | number;
  }>(),
  {
    as: 'div',
    label: undefined,
    size: 'md',
    source: undefined,
    value: undefined,
  },
);
</script>

<template>
  <component :is="as" :class="['i9k-stat', `i9k-stat--${size}`]">
    <span v-if="value !== undefined || $slots.value" class="i9k-stat__value">
      <slot name="value">{{ value }}</slot>
    </span>
    <span v-if="label !== undefined || $slots.label" class="i9k-stat__label">
      <slot name="label">{{ label }}</slot>
    </span>
    <span v-if="source !== undefined || $slots.source" class="i9k-stat__source">
      <slot name="source">{{ source }}</slot>
    </span>
  </component>
</template>

<style scoped>
.i9k-stat {
  --i9k-stat-gap: var(--spacing-2);
  --i9k-stat-value-size: 1.5rem;
  --i9k-stat-value-line-height: 1.1;
  --i9k-stat-label-size: 0.9rem;
  --i9k-stat-source-size: 0.75rem;

  display: flex;
  flex-direction: column;
  gap: var(--i9k-stat-gap);
}

.i9k-stat--sm {
  --i9k-stat-gap: var(--spacing-1);
  --i9k-stat-value-size: 1.25rem;
  --i9k-stat-label-size: 0.8rem;
  --i9k-stat-source-size: 0.7rem;
}

.i9k-stat--lg {
  --i9k-stat-gap: var(--spacing-3);
  --i9k-stat-value-size: clamp(2rem, 5vw, 3.25rem);
  --i9k-stat-value-line-height: 1;
  --i9k-stat-label-size: 1rem;
  --i9k-stat-source-size: 0.8rem;
}

.i9k-stat__value {
  color: var(--primary-text-color);
  font-size: var(--i9k-stat-value-size);
  font-weight: 800;
  line-height: var(--i9k-stat-value-line-height);
}

.i9k-stat__label {
  color: var(--text-color-light);
  font-size: var(--i9k-stat-label-size);
  font-weight: 700;
  line-height: 1.4;
}

.i9k-stat__source {
  color: var(--text-color-light);
  font-size: var(--i9k-stat-source-size);
}
</style>
