<script setup lang="ts">
const route = useRoute()

const menuItems = [
  {
    to: '/account/profile',
    label: 'account.sections.basicData',
    section: 'basicData'
  },
  {
    to: '/account/profile/kids',
    label: 'account.sections.kids',
    section: 'kids'
  },
  {
    to: '/account/profile/security',
    label: 'account.sections.security',
    section: 'security'
  },
  {
    to: '/account/profile/notifications',
    label: 'account.sections.notificationSettings',
    section: 'notifications'
  },
  {
    to: '/account/profile/booking',
    label: 'account.sections.bookingData',
    section: 'booking'
  }
]

const activeSection = computed(() => {
  if (route.path.includes('/profile/kids')) return 'kids'
  if (route.path.includes('/profile/security')) return 'security'
  if (route.path.includes('/notifications')) return 'notifications'
  if (route.path.includes('/booking')) return 'booking'
  return 'basicData'
})
</script>

<template>
  <PageAccountSectionSidebar :items="menuItems" :active-section="activeSection" />
</template>
