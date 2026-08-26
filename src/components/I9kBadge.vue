<script setup lang="ts">
import type { Component } from 'vue';

import type { I9kBadgeVariant, I9kComponentSize } from '../types/components';

withDefaults(
  defineProps<{
    as?: string | Component;
    size?: I9kComponentSize;
    variant?: I9kBadgeVariant;
  }>(),
  {
    as: 'span',
    size: 'md',
    variant: 'outline',
  },
);
</script>

<template>
  <component :is="as" :class="['i9k-badge', `i9k-badge--${variant}`, `i9k-badge--${size}`]">
    <span v-if="variant === 'tag'" class="i9k-badge__decoration" aria-hidden="true">#</span>
    <slot />
  </component>
</template>

<style scoped>
.i9k-badge {
  --i9k-badge-padding-block: var(--spacing-1);
  --i9k-badge-padding-inline: var(--spacing-5);
  --i9k-badge-font-size: 0.7rem;

  display: inline-flex;
  align-items: center;
  padding: var(--i9k-badge-padding-block) var(--i9k-badge-padding-inline);
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  font-size: var(--i9k-badge-font-size);
  font-weight: 600;
  letter-spacing: 0.4px;
  line-height: 1.5;
  text-transform: uppercase;
  white-space: nowrap;
  transition: var(--transition);
}

.i9k-badge--sm {
  --i9k-badge-padding-block: 0;
  --i9k-badge-padding-inline: var(--spacing-4);
  --i9k-badge-font-size: 0.625rem;
}

.i9k-badge--lg {
  --i9k-badge-padding-block: var(--spacing-2);
  --i9k-badge-padding-inline: var(--spacing-6);
  --i9k-badge-font-size: 0.8rem;
}

.i9k-badge--solid {
  background: var(--primary-color);
  color: var(--on-primary-color);
}

.i9k-badge--outline {
  border-color: var(--border-color);
  color: var(--text-color-light);
}

.i9k-badge--tag {
  --i9k-badge-padding-block: var(--spacing-3);
  --i9k-badge-padding-inline: var(--spacing-6);
  --i9k-badge-font-size: 11px;

  border-color: var(--dark-color-alpha-10);
  border-radius: var(--radius-md);
  background: var(--dark-color-alpha-05);
  color: var(--primary-text-color);
  letter-spacing: 0.3px;
}

.i9k-badge--tag.i9k-badge--sm {
  --i9k-badge-padding-block: var(--spacing-2);
  --i9k-badge-padding-inline: var(--spacing-5);
  --i9k-badge-font-size: 0.625rem;
}

.i9k-badge--tag.i9k-badge--lg {
  --i9k-badge-padding-block: var(--spacing-4);
  --i9k-badge-padding-inline: var(--spacing-7);
  --i9k-badge-font-size: 0.75rem;
}

.i9k-badge__decoration {
  margin-inline-end: var(--spacing-1);
  opacity: 0.6;
}

:global(.dark .i9k-badge--tag) {
  border-color: var(--white-color-alpha-15);
  background: var(--white-color-alpha-05);
}

@media (prefers-reduced-motion: reduce) {
  .i9k-badge {
    transition: none;
  }
}
</style>
