<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    description?: string | null;
    id?: string | null;
    level?: 2 | 3 | 4 | 5 | 6;
  }>(),
  { description: null, id: null, level: 2 },
);
</script>

<template>
  <div class="section-heading">
    <component :is="`h${level}`" :id="id ?? undefined" class="section-heading-title">{{
      title
    }}</component>
    <p v-if="description" class="section-heading-description">{{ description }}</p>
  </div>
</template>

<style scoped>
.section-heading {
  margin-bottom: var(--spacing-13);
}
.section-heading-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}
.section-heading-description {
  max-width: 62ch;
  margin: var(--spacing-4) 0 0;
  color: var(--text-color-light);
  line-height: 1.7;
}
@media (max-width: 991px) {
  .section-heading-title {
    font-size: 1.25rem;
  }
}
</style>
