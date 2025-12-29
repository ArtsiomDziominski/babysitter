<template>
  <div
    v-if="chat"
    class="px-4 max-xl:px-3 py-3 max-xl:py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center gap-3 shadow-sm"
  >
    <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-arrow-left"
        size="sm"
        class="xl:hidden -ml-2"
        @click="$emit('back')"
    />
    <UAvatar
      :src="chat.avatar"
      :icon="chat.icon"
      :alt="chat.name"
      size="md"
      class="max-xl:w-8 max-xl:h-8"
    />
    <div class="flex-1 min-w-0">
      <h2 class="text-base max-xl:text-sm font-semibold text-gray-900 dark:text-white truncate">
        {{ chat.name }}
      </h2>
      <p
        v-if="chat.type === 'user'"
        class="text-xs max-xl:text-[10px] text-gray-500 dark:text-gray-400"
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

defineEmits<{
  back: []
}>()
</script>

