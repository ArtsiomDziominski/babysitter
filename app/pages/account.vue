<script setup lang="ts">
const route = useRoute()

definePageMeta({
  middleware: 'auth'
})

useSeoMeta({
  robots: 'noindex, nofollow'
})

const activeTab = computed(() => {
  if (route.path.includes('/messages')) return 'messages'
  if (route.path.includes('/orders')) return 'orders'
  if (route.path.includes('/favorites')) return 'favorites'
  if (route.path.includes('/booking')) return 'booking'
  return 'profile'
})
</script>

<template>
  <div class="py-6 lg:py-10 flex gap-8 max-lg:flex-col max-lg:gap-4">
    <PageAccountNavigation :active-tab="activeTab" />

    <div class="flex-1 min-w-0">
      <PageAccountLocationReminder class="mb-4" />
      <NuxtPage />
    </div>
  </div>
</template>
