<template>
  <InfoLanding
    i18n-prefix="pages.findBabysitter.rustavi"
    :lists="['advantages']"
    cta-to="/search?city=rustavi"
  />
</template>

<script setup lang="ts">
import InfoLanding from '~/components/landing/InfoLanding.vue'

definePageMeta({
  pageTransition: false
})
</script>
