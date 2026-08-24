<script setup lang="ts">
import { computed, useAttrs } from 'vue';

import { omitI9kAttrs } from '../composables/i9kField';
import type { I9kComponentSize } from '../types/components';

defineOptions({ inheritAttrs: false });

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

const attrs = useAttrs();
const rootAttrs = computed(() =>
  omitI9kAttrs(attrs, ['aria-label', 'class', 'data-orientation', 'role']),
);
</script>

<template>
  <div
    v-bind="rootAttrs"
    role="group"
    :aria-label="label || undefined"
    :data-orientation="orientation"
    :class="[
      attrs.class,
      'i9k-button-group',
      `i9k-button-group--${orientation}`,
      `i9k-button-group--${size}`,
    ]"
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
