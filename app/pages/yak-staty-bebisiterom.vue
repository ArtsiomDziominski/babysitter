<template>
  <InfoLanding
    i18n-prefix="pages.becomeBabysitter"
    :lists="['requirements', 'benefits']"
    cta-to="/register"
  />
</template>

<script setup lang="ts">
import InfoLanding from '~/components/landing/InfoLanding.vue'

definePageMeta({
  pageTransition: false
})
</script>
