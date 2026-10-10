<template>
  <InfoLanding
    i18n-prefix="pages.becomeBabysitter"
    :lists="['requirements', 'benefits']"
    cta-to="/register"
    article
  />
</template>

<script setup lang="ts">
import InfoLanding from '~/components/landing/InfoLanding.vue'
</script>
