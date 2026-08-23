<!-- src/components/I9kInput.vue -->
<script setup lang="ts">
import { useAttrs, useId } from 'vue';

import type { I9kComponentSize } from '../types/components';

type InputType = 'text' | 'email' | 'password';

defineOptions({ inheritAttrs: false });

withDefaults(
  defineProps<{
    modelValue: string;
    label: string;
    type?: InputType;
    error?: string | null;
    hint?: string;
    required?: boolean;
    uiSize?: I9kComponentSize;
  }>(),
  { type: 'text', error: null, hint: undefined, required: false, uiSize: 'md' },
);

defineEmits<{ 'update:modelValue': [value: string] }>();

const attrs = useAttrs();
const fieldId = useId();
const errorId = `${fieldId}-error`;
const hintId = `${fieldId}-hint`;
</script>

<template>
  <div :class="['field', 'i9k-field', `i9k-field--${uiSize}`]">
    <label class="field__label i9k-field__label" :for="fieldId">
      {{ label }}<span v-if="required" aria-hidden="true"> *</span>
    </label>
    <input
      :id="fieldId"
      :class="['field__input', 'i9k-input', `i9k-input--${uiSize}`]"
      :type="type"
      :value="modelValue"
      :required="required"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? errorId : hint ? hintId : undefined"
      v-bind="attrs"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="hint && !error" :id="hintId" class="field__hint i9k-field__hint">{{ hint }}</p>
    <p v-if="error" :id="errorId" class="field__error i9k-field__error" role="alert">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.i9k-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  margin-block-end: var(--spacing-8);
}

.i9k-field__label {
  color: var(--text-color);
  font-size: var(--text-size-1);
  font-weight: 600;
}

.i9k-input {
  width: 100%;
  min-height: var(--control-height-md);
  padding: 0 var(--spacing-6);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--glass-bg);
  color: var(--text-color);
  font-family: inherit;
  font-size: var(--control-font-size-md);
  transition: var(--transition);
}

.i9k-input--sm {
  min-height: var(--control-height-sm);
  padding-inline: var(--spacing-5);
  font-size: var(--control-font-size-sm);
}

.i9k-input--lg {
  min-height: var(--control-height-lg);
  padding-inline: var(--spacing-8);
  font-size: var(--control-font-size-lg);
}

.i9k-input:focus-visible {
  border-color: var(--accent-color);
  outline: 2px solid var(--accent-color);
  outline-offset: 1px;
}

.i9k-input[aria-invalid='true'] {
  border-color: var(--accent-color);
}

.i9k-field__hint {
  color: var(--text-color-light);
  font-size: var(--text-size-1);
}

.i9k-field__error {
  color: var(--accent-color);
  font-size: var(--text-size-1);
  font-weight: 600;
}

@media (prefers-reduced-motion: reduce) {
  .i9k-input {
    transition: none;
  }
}
</style>
