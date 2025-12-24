<script setup lang="ts">
import { UserRole } from '~/const/roles'

const authStore = useAuthStore()

defineProps<{
  activeTab: string
}>()
</script>

<template>
  <div class="mb-6">
    <div class="flex items-center gap-6 border-b border-gray-200 dark:border-gray-700">
      <NuxtLink
        to="/account/messages"
        class="px-4 py-3 text-sm font-medium transition-colors"
        :class="activeTab === 'messages'
          ? 'text-primary-500 border-b-2 border-primary-500'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
      >
        {{ $t('account.messages.title') }}
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
        :to="authStore.user.role === UserRole.PARENT ? '/account/booking/kids' : '/account/booking/babysitter'"
        class="px-4 py-3 text-sm font-medium transition-colors"
        :class="activeTab === 'booking'
          ? 'text-primary-500 border-b-2 border-primary-500'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
      >
        {{ $t('account.booking.title') }}
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
</template>

