<script setup lang="ts">
import I9kSocialLinks, { type I9kSocialLink } from './I9kSocialLinks.vue';
withDefaults(
  defineProps<{ tagline?: string | null; socialLinks?: I9kSocialLink[]; socialLabels?: boolean }>(),
  { tagline: null, socialLinks: () => [], socialLabels: false },
);
defineEmits<{ socialClick: [item: I9kSocialLink, event: MouseEvent] }>();
</script>
<template>
  <footer class="footer">
    <I9kSocialLinks
      v-if="socialLinks.length"
      class="footer-socials"
      :items="socialLinks"
      :labels="socialLabels"
      @click="(item, event) => $emit('socialClick', item, event)"
      ><template #icon="slotProps"
        ><slot name="social-icon" v-bind="slotProps" /></template></I9kSocialLinks
    ><slot
      ><p v-if="tagline" class="footer-tagline">{{ tagline }}</p></slot
    >
  </footer>
</template>
<style scoped>
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-8);
  padding: var(--spacing-10);
  margin-bottom: var(--spacing-5);
}
.footer-socials {
  justify-content: center;
}
.footer-tagline {
  max-width: 40ch;
  margin: 0;
  color: var(--text-color-light);
  font-size: 0.85rem;
  text-align: center;
}
</style>
