<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ prompt: string }>();
const copied = ref(false);

const copy = async () => {
  await navigator.clipboard.writeText(props.prompt);
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
};
</script>

<template>
  <div class="showcase-prompt">
    <div class="showcase-prompt__head">
      <h4>Agent prompt</h4>
      <button type="button" @click="copy">{{ copied ? 'Copied' : 'Copy' }}</button>
    </div>
    <pre class="showcase-prompt__body">{{ prompt }}</pre>
  </div>
</template>

<style scoped>
.showcase-prompt {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--code-bg);
}

.showcase-prompt__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--border-color);
}

.showcase-prompt__head h4 {
  margin: 0;
  font-size: 0.875rem;
}

.showcase-prompt__body {
  margin: 0;
  padding: var(--spacing-6);
  overflow-x: auto;
  white-space: pre-wrap;
  font-size: 0.8125rem;
}
</style>
