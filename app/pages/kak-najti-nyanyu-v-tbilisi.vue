<template>
  <InfoLanding
    i18n-prefix="pages.findNanny.tbilisi"
    :lists="['considerations']"
    cta-to="/search?city=tbilisi"
  />
</template>

<script setup lang="ts">
import InfoLanding from '~/components/landing/InfoLanding.vue'

definePageMeta({
  pageTransition: false
})
</script>
