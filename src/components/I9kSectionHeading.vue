<script setup lang="ts">
withDefaults(
  defineProps<{
    number?: string | null;
    title: string;
    description?: string | null;
    id?: string | null;
    level?: 2 | 3 | 4 | 5 | 6;
  }>(),
  { number: null, description: null, id: null, level: 2 },
);
</script>

<template>
  <div class="section-heading" :class="{ 'section-heading--has-number': number }">
    <p v-if="number" class="eyebrow eyebrow--number">{{ number }}</p>
    <div class="section-heading-body">
      <component :is="`h${level}`" :id="id ?? undefined" class="title">{{ title }}</component>
      <p v-if="description" class="section-heading-description">{{ description }}</p>
    </div>
  </div>
</template>

<style scoped>
.section-heading {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-8);
  margin-bottom: var(--spacing-13);
}
.section-heading--has-number {
  grid-template-columns: 5rem minmax(0, 1fr);
}
.title {
  margin: 0;
}
.section-heading-description {
  max-width: 62ch;
  margin: var(--spacing-4) 0 0;
  color: var(--text-color-light);
  line-height: 1.7;
}
@media (max-width: 768px) {
  .section-heading {
    grid-template-columns: 1fr;
    gap: var(--spacing-2);
  }
}
</style>
