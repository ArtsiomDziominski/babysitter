<template>
  <InfoLanding
    i18n-prefix="pages.findBabysitter.gori"
    :lists="['advantages']"
    cta-to="/search?city=gori"
  />
</template>

<script setup lang="ts">
import InfoLanding from '~/components/landing/InfoLanding.vue'

definePageMeta({
  pageTransition: false
})
</script>
