<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string;
    url: string;
    description: string;
    image?: string | null;
    badge?: string | null;
    showImage?: boolean;
    arrow?: boolean;
    arrowLabel?: string;
  }>(),
  { image: null, badge: null, showImage: true, arrow: false, arrowLabel: '↗' },
);
defineEmits<{ click: [event: MouseEvent] }>();
</script>

<template>
  <a
    class="surface surface--interactive link-card"
    :href="url"
    target="_blank"
    rel="noopener"
    @click="$emit('click', $event)"
  >
    <span v-if="badge" class="badge badge--solid link-card-badge">{{ badge }}</span>
    <div v-if="showImage && image" class="link-card-image">
      <img :src="image" :alt="name" width="60" height="60" loading="lazy" />
    </div>
    <div class="link-card-body">
      <h3 class="link-card-name">{{ name }}</h3>
      <p class="link-card-description">{{ description }}</p>
    </div>
    <span v-if="arrow" class="link-card-arrow" aria-hidden="true">{{ arrowLabel }}</span>
  </a>
</template>

<style scoped>
.link-card {
  position: relative;
  display: block;
  padding: var(--spacing-11);
  color: var(--theme-text-color);
  text-decoration: none;
  font-weight: normal;
}
.link-card:hover .link-card-name,
.link-card:hover .link-card-arrow {
  color: var(--primary-text-color);
}
.link-card:hover .link-card-arrow {
  opacity: 1;
  transform: translate(1px, -1px);
}
[dir='rtl'] .link-card:hover .link-card-arrow {
  transform: translate(-1px, -1px);
}
.link-card-badge {
  position: absolute;
  top: var(--spacing-6);
  inset-inline-end: var(--spacing-6);
}
.link-card-image {
  width: 60px;
  height: 60px;
  margin-bottom: var(--spacing-5);
  padding: 2px;
  border-radius: var(--radius-sm);
}
.link-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.link-card-name {
  margin: 0 0 var(--spacing-4);
  font-size: 1.05rem;
  font-weight: 700;
  transition: var(--transition);
}
.link-card-description {
  margin: 0;
  color: var(--text-color-light);
  font-size: 0.95rem;
  line-height: 1.55;
}
.link-card-arrow {
  position: absolute;
  top: var(--spacing-8);
  inset-inline-end: var(--spacing-8);
  opacity: 0.3;
  transition: var(--transition);
}
</style>
