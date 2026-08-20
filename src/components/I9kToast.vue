<!-- src/components/I9kToast.vue -->
<script setup lang="ts">
type Variant = 'info' | 'success' | 'error';

const props = withDefaults(defineProps<{ variant?: Variant }>(), { variant: 'info' });
</script>

<template>
  <div
    :class="['toast', `toast--${props.variant}`]"
    :role="props.variant === 'error' ? 'alert' : 'status'"
  >
    <slot />
  </div>
</template>
