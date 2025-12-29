<template>
  <div
    ref="messagesContainer"
    class="flex-1 overflow-y-auto overflow-x-hidden px-4 max-xl:px-3 py-4 max-xl:py-3 space-y-3 max-xl:space-y-2 w-full min-w-0 max-w-full"
  >
    <div
      v-for="(message, index) in messages"
      :key="message.id"
      class="flex gap-2 w-full min-w-0"
      :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
    >
      <div
        v-if="message.role === 'assistant' && shouldShowAvatar(message, index)"
        class="flex-shrink-0"
      >
        <UAvatar
          :src="getMessageAvatar(message)"
          :icon="chatIcon"
          :alt="chatName"
          size="xs"
          class="mt-1"
        />
      </div>
      <div
        v-else-if="message.role === 'assistant'"
        class="flex-shrink-0 w-6"
      />
      <div
        class="flex flex-col gap-1 max-xl:max-w-[85%]"
        :class="message.role === 'user' ? 'items-end' : 'items-start'"
        style="max-width: 70%; min-width: 0; flex-shrink: 1;"
      >
        <div
          class="rounded-2xl px-4 py-2 shadow-sm relative"
          :class="message.role === 'user'
            ? 'bg-primary-500 text-white rounded-tr-sm'
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-sm border border-gray-200 dark:border-gray-700'"
          style="max-width: 100%; min-width: 0; word-wrap: break-word; overflow-wrap: break-word; box-sizing: border-box;"
        >
          <div class="text-sm whitespace-pre-wrap" style="word-break: break-word; overflow-wrap: anywhere; word-wrap: break-word;">
            {{ getTextFromMessage(message) }}
          </div>
        </div>
        <div
          class="text-xs px-1 flex items-center gap-1"
          :class="message.role === 'user' 
            ? 'text-right justify-end' 
            : 'text-left'"
        >
          <span class="text-gray-500 dark:text-gray-400">{{ formatMessageTime(message) }}</span>
          <div
            v-if="message.role === 'user'"
            class="flex items-center"
          >
            <div
              v-if="message.isPending"
              class="w-3.5 h-3.5 border-2 rounded-full animate-spin border-green-400 border-t-green-600"
            ></div>
            <Icon
              v-else-if="message.isRead"
              name="i-lucide-check-check"
              class="w-3.5 h-3.5 text-green-500"
            />
            <Icon
              v-else
              name="i-lucide-check"
              class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400"
            />
          </div>
        </div>
      </div>
      <div
        v-if="message.role === 'user' && shouldShowAvatar(message, index)"
        class="flex-shrink-0"
      >
        <UAvatar
          :src="currentUserAvatar"
          :icon="currentUserAvatar ? undefined : 'i-lucide-user'"
          :alt="currentUserName"
          size="xs"
          class="mt-1"
        />
      </div>
      <div
        v-else-if="message.role === 'user'"
        class="flex-shrink-0 w-6"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface MessagePart {
  type: 'text' | 'tool-call' | 'tool-result' | 'file'
  id: string
  text?: string
  state?: 'done' | 'streaming'
  [key: string]: any
}

interface UIMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  parts: MessagePart[]
  createdAt?: string
  isPending?: boolean
  isRead?: boolean
}

const props = defineProps<{
  messages: UIMessage[]
  chatAvatar?: string
  chatIcon?: string
  chatName?: string
  currentUserAvatar?: string
  currentUserName?: string
  hasMore?: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  loadMore: []
}>()

const messagesContainer = ref<HTMLElement | null>(null)
let isLoadingMore = false

function handleScroll() {
  if (!messagesContainer.value || isLoadingMore || !props.hasMore || props.loading) return
  
  const container = messagesContainer.value
  const scrollTop = container.scrollTop
  const scrollHeight = container.scrollHeight
  const clientHeight = container.clientHeight
  
  if (scrollTop < 200) {
    isLoadingMore = true
    const previousScrollHeight = scrollHeight
    
    emit('loadMore')
    
    nextTick(() => {
      setTimeout(() => {
        if (messagesContainer.value) {
          const newScrollHeight = messagesContainer.value.scrollHeight
          const heightDifference = newScrollHeight - previousScrollHeight
          messagesContainer.value.scrollTop = scrollTop + heightDifference
        }
        isLoadingMore = false
      }, 100)
    })
  }
}

onMounted(() => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.addEventListener('scroll', handleScroll)
    }
  })
})

onUnmounted(() => {
  if (messagesContainer.value) {
    messagesContainer.value.removeEventListener('scroll', handleScroll)
  }
})

function getTextFromMessage(message: UIMessage): string {
  return message.parts
    .filter(part => part.type === 'text' && part.text)
    .map(part => part.text || '')
    .join('\n')
}

function shouldShowAvatar(message: UIMessage, index: number): boolean {
  if (index === 0) return true
  
  const previousMessage = props.messages[index - 1]
  if (!previousMessage) return true
  
  return previousMessage.role !== message.role
}

function getMessageAvatar(message: UIMessage): string | undefined {
  return props.chatAvatar
}

function formatMessageTime(message: UIMessage): string {
  if (!message.createdAt) return ''
  const date = new Date(message.createdAt)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return 'только что'
  if (minutes < 60) return `${minutes} мин назад`
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

defineExpose({
  scrollToBottom
})
</script>

