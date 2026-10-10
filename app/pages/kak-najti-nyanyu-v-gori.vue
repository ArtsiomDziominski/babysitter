<template>
  <InfoLanding
    i18n-prefix="pages.findNanny.gori"
    :lists="['considerations']"
    cta-to="/search?city=gori"
  />
</template>

<script setup lang="ts">
import InfoLanding from '~/components/landing/InfoLanding.vue'

definePageMeta({
  pageTransition: false
})
</script>
