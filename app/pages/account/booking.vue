<script setup lang="ts">
const route = useRoute()

definePageMeta({
  middleware: 'auth'
})

onMounted(() => {
  if (route.path === '/account/booking') {
    navigateTo('/account/booking/kids', { replace: true })
  }
})

const menuItems = [
  {
    to: '/account/booking/kids',
    label: 'account.sections.kids',
    section: 'kids'
  },
  {
    to: '/account/booking/trusted',
    label: 'account.booking.trustedPerson.title',
    section: 'trusted'
  }
]

const activeSection = computed(() => {
  if (route.path.includes('/booking/kids')) return 'kids'
  if (route.path.includes('/booking/trusted')) return 'trusted'
  return 'kids'
})
</script>

<template>
  <div class="flex gap-6">
    <PageAccountSectionSidebar :items="menuItems" :active-section="activeSection" />
    <NuxtPage />
  </div>
</template>

