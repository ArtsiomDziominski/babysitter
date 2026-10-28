<template>
  <InfoLanding
    i18n-prefix="pages.becomeBabysitter"
    :lists="['requirements', 'benefits']"
    cta-to="/register"
  />
</template>

<script setup lang="ts">
import InfoLanding from '~/components/landing/InfoLanding.vue'

// Одна страница с отдельным адресом в каждой локали: /ru/kak-stat-bebisitterom, /en/how-to-become-babysitter и т.д.
// Чужие слаги внутри локали (например, /en/kak-stat-bebisitterom) редиректит server/middleware/locale-redirect.ts
definePageMeta({
  pageTransition: false,
  i18n: {
    paths: {
      ru: '/kak-stat-bebisitterom',
      en: '/how-to-become-babysitter',
      uk: '/yak-staty-bebisiterom',
      ka: '/rogor-gavides-bebisiteri'
    }
  }
})
</script>
