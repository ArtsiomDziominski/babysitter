<template>
  <InfoLanding
    i18n-prefix="pages.findBabysitter.poti"
    :lists="['advantages']"
    cta-to="/search?city=poti"
  />
</template>

<script setup lang="ts">
import InfoLanding from '~/components/landing/InfoLanding.vue'

definePageMeta({
  pageTransition: false
})
</script>
