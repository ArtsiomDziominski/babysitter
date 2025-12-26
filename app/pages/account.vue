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
  if (route.path.includes('/booking')) return 'booking'
  return 'profile'
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageAccountNavigation :active-tab="activeTab" />

      <!-- Основной контент -->
      <main class="flex-1">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>
