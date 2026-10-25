<template>
  <div class="w-80 max-xl:w-full bg-default border-r border-default max-xl:border-r-0 flex flex-col">
    <div class="px-4 max-xl:px-3 h-16 flex items-center border-b border-default">
      <h1 class="text-lg font-semibold text-highlighted">
        {{ $t('account.messages.title') }}
      </h1>
    </div>
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin text-muted" />
    </div>
    <div v-else class="flex-1 overflow-y-auto">
      <div class="p-2 space-y-0.5">
        <button
          v-for="chat in chats"
          :key="chat.id"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-elevated/60 transition-colors text-left group"
          :class="activeChatId === chat.id ? 'bg-primary/10 hover:bg-primary/10' : ''"
          @click="$emit('select', chat.id)"
        >
          <div class="relative flex-shrink-0">
            <UAvatar
              :src="chat.avatar"
              :icon="chat.icon"
              :alt="chat.name"
              size="lg"
            />
            <div
              v-if="chat.unreadCount > 0"
              class="absolute -top-1 -right-1 bg-primary text-inverted text-xs font-medium rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center"
            >
              {{ chat.unreadCount > 9 ? '9+' : chat.unreadCount }}
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <div class="font-medium text-highlighted truncate">{{ chat.name }}</div>
              <div
                v-if="chat.lastMessage"
                class="text-xs text-muted flex-shrink-0 ml-2"
              >
                {{ formatTime(getLastMessageTime(chat.id)) }}
              </div>
            </div>
            <div
              v-if="chat.lastMessage"
              class="text-sm text-toned truncate"
              :class="chat.unreadCount > 0 ? 'font-medium text-highlighted' : ''"
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

