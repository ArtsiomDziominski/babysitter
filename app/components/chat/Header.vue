<template>
  <div
    v-if="chat"
    class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center gap-3 shadow-sm"
  >
    <UAvatar
      :src="chat.avatar"
      :icon="chat.icon"
      :alt="chat.name"
      size="md"
    />
    <div class="flex-1">
      <h2 class="text-base font-semibold text-gray-900 dark:text-white">
        {{ chat.name }}
      </h2>
      <p
        v-if="chat.type === 'user'"
        class="text-xs text-gray-500 dark:text-gray-400"
      >
        {{ chat.role === UserRole.BABYSITTER ? $t('account.role.nanny') : $t('account.role.parent') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserRole } from '~/const/roles'

interface Chat {
  id: number | string
  name: string
  type: 'admin' | 'user'
  avatar?: string
  icon?: string
  role?: UserRole
  unreadCount: number
  conversationId?: number
}

defineProps<{
  chat: Chat | null
}>()
</script>

