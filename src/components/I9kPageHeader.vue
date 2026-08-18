<script setup lang="ts">
withDefaults(
  defineProps<{
    kicker?: string | null;
    title: string;
    description?: string | null;
    id?: string | null;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
  }>(),
  { kicker: null, description: null, id: null, level: 1 },
);
</script>

<template>
  <header class="page-header" :class="{ 'page-header--with-avatar': $slots.avatar }">
    <div class="page-header__body">
      <p v-if="kicker" class="eyebrow">{{ kicker }}</p>
      <component :is="`h${level}`" :id="id ?? undefined" class="main-title page-header-title">{{
        title
      }}</component>
      <slot name="subtitle" />
      <p v-if="description" class="lede">{{ description }}</p>
      <slot name="actions" />
    </div>
    <div v-if="$slots.avatar" class="page-header__avatar"><slot name="avatar" /></div>
  </header>
</template>

<style scoped>
.page-header {
  min-width: 0;
  margin-top: var(--spacing-8);
}
.page-header--with-avatar {
  display: flex;
  align-items: center;
  gap: var(--spacing-15);
}
.page-header__body {
  min-width: 0;
  flex: 1 1 auto;
}
.page-header__avatar {
  flex: 0 0 auto;
}
.page-header-title {
  max-width: 16ch;
  margin-top: var(--spacing-3);
  margin-bottom: var(--spacing-8);
  font-size: clamp(2.35rem, 1.8rem + 2.75vw, 4rem);
  line-height: 0.98;
  letter-spacing: -0.045em;
  text-wrap: balance;
}
@media (max-width: 768px) {
  .page-header--with-avatar {
    flex-direction: column;
    gap: var(--spacing-10);
    text-align: center;
  }
  .page-header--with-avatar .page-header__avatar {
    order: -1;
  }
  .page-header--with-avatar .page-header__body {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .page-header--with-avatar .page-header__body :deep(.cluster) {
    justify-content: center;
  }

  .page-header-title {
    max-width: 15ch;
  }
}
</style>
