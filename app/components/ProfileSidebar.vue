<template>
  <aside class="w-64 flex-shrink-0">
    <nav class="space-y-1">
      <NuxtLink
        to="/account/profile"
        class="block px-4 py-3 text-sm font-medium rounded-lg transition-colors"
        :class="activeSection === 'basicData'
          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
      >
        {{ $t('account.sections.basicData') }}
      </NuxtLink>
      <NuxtLink
        to="/account/profile/kids"
        class="block px-4 py-3 text-sm font-medium rounded-lg transition-colors"
        :class="activeSection === 'kids'
          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
      >
        {{ $t('account.sections.kids') }}
      </NuxtLink>
      <NuxtLink
        to="/account/profile/security"
        class="block px-4 py-3 text-sm font-medium rounded-lg transition-colors"
        :class="activeSection === 'security'
          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
      >
        {{ $t('account.sections.security') }}
      </NuxtLink>
      <NuxtLink
        to="/account/profile/notifications"
        class="block px-4 py-3 text-sm font-medium rounded-lg transition-colors"
        :class="activeSection === 'notifications'
          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
      >
        {{ $t('account.sections.notificationSettings') }}
      </NuxtLink>
      <NuxtLink
        to="/account/profile/booking"
        class="block px-4 py-3 text-sm font-medium rounded-lg transition-colors"
        :class="activeSection === 'booking'
          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
      >
        {{ $t('account.sections.bookingData') }}
      </NuxtLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
const route = useRoute()

const activeSection = computed(() => {
  if (route.path.includes('/profile/kids')) return 'kids'
  if (route.path.includes('/profile/security')) return 'security'
  if (route.path.includes('/notifications')) return 'notifications'
  if (route.path.includes('/booking')) return 'booking'
  return 'basicData'
})
</script>
