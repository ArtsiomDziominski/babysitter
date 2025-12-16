<script setup lang="ts">
const route = useRoute()

const menuItems = [
  {
    to: '/account/profile',
    label: 'account.sections.basicData',
    section: 'basicData'
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
  }
]

const activeSection = computed(() => {
  if (route.path.includes('/profile/security')) return 'security'
  if (route.path.includes('/notifications')) return 'notifications'
  return 'basicData'
})
</script>

<template>
  <PageAccountSectionSidebar :items="menuItems" :active-section="activeSection" />
</template>
