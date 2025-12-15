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
            {{ $t('account.orders.title') }}
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
            <UserAvatar size="xs" />
          </div>
        </div>
      </div>

      <!-- Основной контент -->
      <main class="flex-1">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>
