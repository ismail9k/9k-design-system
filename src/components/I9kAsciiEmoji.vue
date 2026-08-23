<script setup lang="ts">
import { computed } from 'vue';

import type { I9kComponentSize } from '../types/components';

const labels: Record<string, string> = {
  '^_^': 'happy',
  '·ᴗ·': 'gentle smile',
  '◡̈': 'smiling',
  '>‿<': 'joyful',
  x_x: 'exhausted',
  o_o: 'surprised',
  '-_-': 'unimpressed',
};
const props = withDefaults(
  defineProps<{
    name: keyof typeof labels;
    label?: string | null;
    size?: I9kComponentSize;
    color?: 'primary' | 'accent' | 'muted' | 'current';
  }>(),
  { label: null, size: 'md', color: 'primary' },
);
const accessibleLabel = computed(() => props.label ?? labels[props.name]);
</script>
<template>
  <span
    :class="[
      'emoticon',
      `emoticon--${size}`,
      `emoticon--${color}`,
      'i9k-ascii-emoji',
      `i9k-ascii-emoji--${size}`,
      `i9k-ascii-emoji--${color}`,
    ]"
    role="img"
    :aria-label="accessibleLabel"
    >{{ name }}</span
  >
</template>

<style scoped>
.i9k-ascii-emoji {
  display: inline-block;
  color: var(--primary-text-color);
  font-family:
    ui-monospace, 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.08em;
  line-height: 1;
  white-space: nowrap;
  text-rendering: optimizeSpeed;
}

.i9k-ascii-emoji--sm {
  font-size: 1rem;
}

.i9k-ascii-emoji--lg {
  font-size: 2rem;
}

.i9k-ascii-emoji--accent {
  color: var(--accent-color);
}

.i9k-ascii-emoji--muted {
  color: var(--text-color-light);
}

.i9k-ascii-emoji--current {
  color: currentColor;
}
</style>
