<template>
  <InfoLanding
    i18n-prefix="pages.findBabysitter.kutaisi"
    :lists="['advantages']"
    cta-to="/search?city=kutaisi"
  />
</template>

<script setup lang="ts">
import InfoLanding from '~/components/landing/InfoLanding.vue'

definePageMeta({
  pageTransition: false
})
</script>
