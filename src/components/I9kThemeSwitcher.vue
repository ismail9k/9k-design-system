<script setup lang="ts">
import { computed } from 'vue';
const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    lightLabel?: string;
    darkLabel?: string;
  }>(),
  { modelValue: false, lightLabel: 'Switch to light mode', darkLabel: 'Switch to dark mode' },
);

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();
const toggleLabel = computed(() => (props.modelValue ? props.lightLabel : props.darkLabel));
</script>

<template>
  <button
    class="theme-switcher"
    :class="{ 'is-dark': modelValue }"
    type="button"
    :aria-label="toggleLabel"
    :aria-pressed="modelValue"
    @click="emit('update:modelValue', !modelValue)"
  >
    <span class="theme-switcher__thumb" aria-hidden="true">
      <svg class="theme-switcher__icon theme-switcher__icon--sun" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="3.25" />
        <path
          d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M4 4l1.4 1.4M14.6 14.6L16 16M16 4l-1.4 1.4M5.4 14.6L4 16"
        />
      </svg>
      <svg class="theme-switcher__icon theme-switcher__icon--moon" viewBox="0 0 20 20">
        <path d="M16.8 12.5A7 7 0 0 1 7.5 3.2a7 7 0 1 0 9.3 9.3Z" />
      </svg>
    </span>
  </button>
</template>

<style scoped>
.theme-switcher {
  position: relative;
  display: block;
  width: 44px;
  height: 26px;
  padding: 0;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-pill);
  background: var(--glass-bg);
  color: var(--dark-color);
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}
.theme-switcher:hover {
  border-color: var(--primary-text-color);
}
.theme-switcher:focus-visible {
  outline: 2px solid var(--primary-text-color);
  outline-offset: 3px;
}
.theme-switcher__thumb {
  position: absolute;
  top: 2px;
  inset-inline-start: 2px;
  display: grid;
  width: 20px;
  height: 20px;
  place-items: center;
  border-radius: var(--radius-circle);
  background: var(--primary-color);
  color: var(--on-primary-color);
  box-shadow: var(--shadow-sm);
  transition: transform 0.25s ease;
}
.theme-switcher.is-dark .theme-switcher__thumb {
  transform: translateX(18px);
}
[dir='rtl'] .theme-switcher.is-dark .theme-switcher__thumb {
  transform: translateX(-18px);
}
.theme-switcher__icon {
  position: absolute;
  width: 13px;
  height: 13px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition:
    opacity 0.2s ease,
    transform 0.25s ease;
}
.theme-switcher__icon--moon {
  fill: currentColor;
  stroke: none;
  opacity: 0;
  transform: rotate(-25deg) scale(0.75);
}
.theme-switcher.is-dark .theme-switcher__icon--sun {
  opacity: 0;
  transform: rotate(45deg) scale(0.75);
}
.theme-switcher.is-dark .theme-switcher__icon--moon {
  opacity: 1;
  transform: rotate(0) scale(1);
}
@media (prefers-reduced-motion: reduce) {
  .theme-switcher,
  .theme-switcher__thumb,
  .theme-switcher__icon {
    transition: none;
  }
}
</style>
