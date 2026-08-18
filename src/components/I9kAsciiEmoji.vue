<script setup lang="ts">
import { computed } from 'vue';
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
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'accent' | 'muted' | 'current';
  }>(),
  { label: null, size: 'md', color: 'primary' },
);
const accessibleLabel = computed(() => props.label ?? labels[props.name]);
</script>
<template>
  <span
    class="emoticon"
    :class="[`emoticon--${size}`, `emoticon--${color}`]"
    role="img"
    :aria-label="accessibleLabel"
    >{{ name }}</span
  >
</template>
