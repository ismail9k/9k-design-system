<script setup lang="ts">
import I9kCollapsible from './I9kCollapsible.vue';

export interface I9kFaqItem {
  question: string;
  answer: string;
}
defineProps<{ items: I9kFaqItem[] }>();
</script>

<template>
  <div class="i9k-faq-list">
    <I9kCollapsible v-for="item in items" :key="item.question">
      <template #summary>{{ item.question }}</template>
      <p class="i9k-faq-answer">{{ item.answer }}</p>
    </I9kCollapsible>
  </div>
</template>

<style scoped>
.i9k-faq-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.i9k-faq-answer {
  margin: 0;
}
</style>
