<template>
  <InfoLanding
    i18n-prefix="pages.findBabysitter.batumi"
    :lists="['advantages']"
    cta-to="/search?city=batumi"
  />
</template>

<script setup lang="ts">
import InfoLanding from '~/components/landing/InfoLanding.vue'

definePageMeta({
  pageTransition: false
})
</script>
