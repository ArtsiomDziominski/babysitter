<template>
  <div class="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
    <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
        {{ $t('account.messages.title') }}
      </h1>
    </div>
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="text-gray-500">{{ $t('account.messages.loading') }}</div>
    </div>
    <div v-else class="flex-1 overflow-y-auto">
      <div class="py-1">
        <button
          v-for="chat in chats"
          :key="chat.id"
          class="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors text-left group"
          :class="activeChatId === chat.id
            ? 'bg-primary-50 dark:bg-primary-900/20 border-l-2 border-primary-500'
            : ''"
          @click="$emit('select', chat.id)"
        >
          <div class="relative flex-shrink-0">
            <UAvatar
              :src="chat.avatar"
              :icon="chat.icon"
              :alt="chat.name"
              size="md"
              class="ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
              :class="activeChatId === chat.id ? 'ring-primary-500' : 'ring-transparent'"
            />
            <div
              v-if="chat.unreadCount > 0"
              class="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-medium rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center"
            >
              {{ chat.unreadCount > 9 ? '9+' : chat.unreadCount }}
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <div class="font-medium text-gray-900 dark:text-white truncate">{{ chat.name }}</div>
              <div
                v-if="chat.lastMessage"
                class="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2"
              >
                {{ formatTime(getLastMessageTime(chat.id)) }}
              </div>
            </div>
            <div
              v-if="chat.lastMessage"
              class="text-sm text-gray-600 dark:text-gray-400 truncate"
              :class="chat.unreadCount > 0 ? 'font-medium text-gray-900 dark:text-white' : ''"
            >
              {{ chat.lastMessage }}
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Chat {
  id: number | string
  name: string
  type: 'admin' | 'user'
  avatar?: string
  icon?: string
  role?: any
  lastMessage?: string
  unreadCount: number
  conversationId?: number
}

const props = defineProps<{
  chats: Chat[]
  activeChatId: number | string | null
  loading: boolean
  lastMessagesTimeMap: Map<number, string>
}>()

defineEmits<{
  select: [chatId: number | string]
}>()

function getLastMessageTime(chatId: number | string): string | undefined {
  if (typeof chatId === 'string') return undefined
  return props.lastMessagesTimeMap.get(chatId)
}

function formatTime(timeStr?: string): string {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  const now = new Date()
  
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Вчера'
  }
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}
</script>

