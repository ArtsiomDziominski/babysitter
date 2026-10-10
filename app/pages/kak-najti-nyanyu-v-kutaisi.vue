<template>
  <InfoLanding
    i18n-prefix="pages.findNanny.kutaisi"
    :lists="['considerations']"
    cta-to="/search?city=kutaisi"
  />
</template>

<script setup lang="ts">
import InfoLanding from '~/components/landing/InfoLanding.vue'

definePageMeta({
  pageTransition: false
})
</script>
