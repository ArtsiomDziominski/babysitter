<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

onMounted(() => {
  navigateTo('/account/profile')
})
</script>

<template>
  <NuxtPage />
</template>
