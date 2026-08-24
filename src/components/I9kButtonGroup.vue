<script setup lang="ts">
import type { I9kComponentSize } from '../types/components';

withDefaults(
  defineProps<{
    size?: I9kComponentSize;
    orientation?: 'horizontal' | 'vertical';
    label?: string;
  }>(),
  {
    size: 'md',
    orientation: 'horizontal',
    label: undefined,
  },
);
</script>

<template>
  <div
    v-bind="$attrs"
    role="group"
    :aria-label="label || undefined"
    :data-orientation="orientation"
    :class="['i9k-button-group', `i9k-button-group--${orientation}`, `i9k-button-group--${size}`]"
  >
    <slot />
  </div>
</template>

<style scoped>
.i9k-button-group {
  --i9k-button-group-gap: var(--component-gap-md);

  display: inline-flex;
  gap: var(--i9k-button-group-gap);
}

.i9k-button-group--sm {
  --i9k-button-group-gap: var(--component-gap-sm);
}

.i9k-button-group--lg {
  --i9k-button-group-gap: var(--component-gap-lg);
}

.i9k-button-group--horizontal {
  flex-flow: row wrap;
  align-items: center;
}

.i9k-button-group--vertical {
  flex-direction: column;
  align-items: stretch;
}
</style>
