<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string;
    alias?: string | null;
    namePrefix?: string | null;
    avatarSrc?: string | null;
    avatarAlt?: string;
  }>(),
  { alias: null, namePrefix: null, avatarSrc: null, avatarAlt: '' },
);
</script>

<template>
  <aside class="surface profile-card">
    <div v-if="$slots.avatar || avatarSrc" class="profile-card__avatar">
      <slot name="avatar">
        <img
          v-if="avatarSrc"
          :src="avatarSrc"
          :alt="avatarAlt"
          width="72"
          height="72"
          loading="lazy"
        />
      </slot>
    </div>
    <div class="profile-card__body">
      <p class="profile-card__name">
        <template v-if="namePrefix">{{ namePrefix }} </template>{{ name
        }}<span v-if="alias" class="profile-card__alias"> · {{ alias }}</span>
      </p>
      <div v-if="$slots.default" class="profile-card__bio"><slot /></div>
      <div v-if="$slots.actions" class="cluster cluster--tight profile-card__actions">
        <slot name="actions" />
      </div>
    </div>
  </aside>
</template>

<style scoped>
.profile-card {
  display: flex;
  gap: var(--spacing-8);
  padding: var(--spacing-10);
}
@media (max-width: 480px) {
  .profile-card {
    flex-direction: column;
  }
}
.profile-card__avatar {
  flex-shrink: 0;
}
.profile-card__avatar :deep(img) {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-circle);
  object-fit: cover;
  border: 2px solid var(--primary-color);
}
.profile-card__name {
  margin: 0 0 var(--spacing-3);
  font-weight: 800;
}
.profile-card__alias {
  color: var(--primary-text-color);
  font-weight: 600;
}
.profile-card__bio {
  margin: 0 0 var(--spacing-6);
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--text-color-light);
}
</style>
