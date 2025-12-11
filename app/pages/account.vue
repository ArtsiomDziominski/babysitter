<script setup lang="ts">
const { t } = useI18n()
const authStore = useAuthStore()
const route = useRoute()

definePageMeta({
  middleware: 'auth'
})

const activeTab = computed(() => {
  if (route.path.includes('/messages')) return 'messages'
  if (route.path.includes('/orders')) return 'orders'
  return 'profile'
})

const activeSection = computed(() => {
  if (route.path.includes('/dogs')) return 'dogs'
  if (route.path.includes('/account') && route.path !== '/account' && !route.path.includes('/account/profile')) return 'account'
  if (route.path.includes('/notifications')) return 'notifications'
  if (route.path.includes('/booking')) return 'booking'
  return 'basicData'
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Верхняя навигация -->
      <div class="mb-6">
        <div class="flex items-center gap-6 border-b border-gray-200 dark:border-gray-700">
          <NuxtLink
            to="/account/messages"
            class="px-4 py-3 text-sm font-medium transition-colors"
            :class="activeTab === 'messages' 
              ? 'text-primary-500 border-b-2 border-primary-500' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
          >
            {{ $t('account.messages') }}
          </NuxtLink>
          <NuxtLink
            to="/account/orders"
            class="px-4 py-3 text-sm font-medium transition-colors"
            :class="activeTab === 'orders' 
              ? 'text-primary-500 border-b-2 border-primary-500' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
          >
            {{ $t('account.orders') }}
          </NuxtLink>
          <NuxtLink
            to="/account/profile"
            class="px-4 py-3 text-sm font-medium transition-colors"
            :class="activeTab === 'profile' 
              ? 'text-primary-500 border-b-2 border-primary-500' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
          >
            {{ $t('account.profile') }}
          </NuxtLink>
          <div class="ml-auto flex items-center gap-3">
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {{ authStore.currentUser?.name }}
            </span>
            <UAvatar
              :src="authStore.currentUser?.avatar"
              :alt="authStore.currentUser?.name"
              size="sm"
            />
          </div>
        </div>
      </div>

      <div class="flex gap-6">
        <!-- Боковая панель -->
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
              to="/account/dogs"
              class="block px-4 py-3 text-sm font-medium rounded-lg transition-colors"
              :class="activeSection === 'dogs'
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
            >
              {{ $t('account.sections.yourDogs') }}
            </NuxtLink>
            <NuxtLink
              to="/account/account"
              class="block px-4 py-3 text-sm font-medium rounded-lg transition-colors"
              :class="activeSection === 'account'
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
            >
              {{ $t('account.sections.account') }}
            </NuxtLink>
            <NuxtLink
              to="/account/notifications"
              class="block px-4 py-3 text-sm font-medium rounded-lg transition-colors"
              :class="activeSection === 'notifications'
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
            >
              {{ $t('account.sections.notificationSettings') }}
            </NuxtLink>
            <NuxtLink
              to="/account/booking"
              class="block px-4 py-3 text-sm font-medium rounded-lg transition-colors"
              :class="activeSection === 'booking'
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
            >
              {{ $t('account.sections.bookingData') }}
            </NuxtLink>
          </nav>
        </aside>

        <!-- Основной контент -->
        <main class="flex-1">
          <NuxtPage />
        </main>
      </div>
    </div>
  </div>
</template>
