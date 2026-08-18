<script setup lang="ts">
export interface I9kFaqItem {
  question: string;
  answer: string;
}
defineProps<{ items: I9kFaqItem[] }>();
</script>

<template>
  <div class="i9k-faq-list">
    <details v-for="item in items" :key="item.question" class="i9k-faq-item">
      <summary class="i9k-faq-question">{{ item.question }}</summary>
      <p class="i9k-faq-answer">{{ item.answer }}</p>
    </details>
  </div>
</template>

<style scoped>
.i9k-faq-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}
.i9k-faq-item {
  padding: var(--spacing-8) var(--spacing-10);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--theme-bg-color);
}
.i9k-faq-question {
  cursor: pointer;
  font-weight: 600;
  list-style: none;
}
.i9k-faq-question::-webkit-details-marker {
  display: none;
}
.i9k-faq-question::after {
  float: inline-end;
  color: var(--text-color-light);
  content: '+';
}
.i9k-faq-item[open] .i9k-faq-question::after {
  content: '−';
}
.i9k-faq-answer {
  margin: var(--spacing-6) 0 0;
  color: var(--text-color-light);
  line-height: 1.6;
}
</style>
