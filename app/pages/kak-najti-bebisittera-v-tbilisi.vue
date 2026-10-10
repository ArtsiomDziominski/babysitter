<template>
  <InfoLanding
    i18n-prefix="pages.findBabysitter.tbilisi"
    :lists="['advantages']"
    cta-to="/search?city=tbilisi"
    article
  />
</template>

<script setup lang="ts">
import InfoLanding from '~/components/landing/InfoLanding.vue'

definePageMeta({
  pageTransition: false
})
</script>
