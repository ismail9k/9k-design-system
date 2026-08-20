<!-- src/components/I9kInput.vue -->
<script setup lang="ts">
import { useAttrs, useId } from 'vue';

type InputType = 'text' | 'email' | 'password';

withDefaults(
  defineProps<{
    modelValue: string;
    label: string;
    type?: InputType;
    error?: string | null;
    hint?: string;
    required?: boolean;
  }>(),
  { type: 'text', error: null, hint: undefined, required: false },
);

defineEmits<{ 'update:modelValue': [value: string] }>();

const attrs = useAttrs();
const fieldId = useId();
const errorId = `${fieldId}-error`;
const hintId = `${fieldId}-hint`;
</script>

<template>
  <div class="field">
    <label class="field__label" :for="fieldId"
      >{{ label }}<span v-if="required" aria-hidden="true"> *</span></label
    >
    <input
      :id="fieldId"
      class="field__input"
      :type="type"
      :value="modelValue"
      :required="required"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? errorId : hint ? hintId : undefined"
      v-bind="attrs"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="hint && !error" :id="hintId" class="field__hint">{{ hint }}</p>
    <p v-if="error" :id="errorId" class="field__error" role="alert">{{ error }}</p>
  </div>
</template>
