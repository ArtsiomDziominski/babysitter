<script setup lang="ts">
const route = useRoute()

definePageMeta({
  middleware: 'auth'
})

const menuItems = [
  {
    to: '/account/booking/trusted',
    label: 'account.booking.trustedPerson.title',
    section: 'trusted'
  }
]

const activeSection = computed(() => {
  if (route.path.includes('/booking/trusted')) return 'trusted'
  return 'trusted'
})
</script>

<template>
  <div class="flex gap-6">
    <PageAccountSectionSidebar :items="menuItems" :active-section="activeSection" />
    <NuxtPage />
  </div>
</template>

