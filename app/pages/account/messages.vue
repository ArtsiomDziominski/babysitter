<template>
  <div class="chat-container bg-gray-50 dark:bg-gray-900 flex flex-col h-[calc(100vh-12rem)] rounded-lg overflow-hidden">
    <div class="flex h-full">
      <ChatList
        :chats="chats"
        :active-chat-id="activeChatId"
        :loading="loading"
        :last-messages-time-map="lastMessagesTimeMap"
        @select="selectChat"
      />

      <div class="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800">
        <ChatHeader :chat="activeChat || null" />

        <div v-if="!activeChat" class="flex-1 flex items-center justify-center">
          <div class="text-gray-500">{{ $t('account.messages.selectChat') }}</div>
        </div>

        <div v-else class="flex-1 flex flex-col min-h-0">
          <div v-if="loadingMessages" class="flex-1 flex items-center justify-center">
            <div class="text-gray-500">{{ $t('account.messages.loadingMessages') }}</div>
          </div>
          <ChatMessagesList
            v-else
            ref="messagesListRef"
            :messages="currentMessages"
            :chat-avatar="activeChat ? activeChat.avatar : undefined"
            :chat-icon="activeChat ? activeChat.icon : undefined"
            :chat-name="activeChat ? activeChat.name : undefined"
            :current-user-avatar="authStore.currentUser?.avatar"
            :current-user-name="authStore.currentUser?.name"
          />

          <ChatMessageInput
            :input="input"
            :disabled="status === 'streaming' || !activeChat || activeChat.id === 'admin-placeholder' || !activeChat.conversationId || loadingMessages"
            :status="status"
            @update:input="input = $event"
            @submit="onSubmit"
            @stop="handleStop"
            @reload="handleReload"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserRole } from '~/const/roles'
import type { Conversation, Message } from '~/composables/useChat'

definePageMeta({
  middleware: 'auth'
})

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
}

interface Chat {
  id: number | string
  name: string
  type: 'admin' | 'user'
  avatar?: string
  icon?: string
  role?: UserRole
  lastMessage?: string
  unreadCount: number
  conversationId?: number
}

const { t } = useI18n()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const chat = useChat()
const websocket = useWebSocket()

const input = ref('')
const error = ref<Error | null>(null)
const status = ref<'submitted' | 'streaming' | 'ready' | 'error'>('ready')
const loading = ref(false)
const loadingMessages = ref(false)
const activeChatId = ref<number | string | null>(null)
const conversations = ref<Conversation[]>([])
const messagesMap = ref<Map<number, Message[]>>(new Map())
const lastMessagesMap = ref<Map<number, string>>(new Map())
const lastMessagesTimeMap = ref<Map<number, string>>(new Map())
const messagesListRef = ref<{ scrollToBottom: () => void } | null>(null)

const chats = computed<Chat[]>(() => {
  const currentUserId = authStore.currentUser?.id
  if (!currentUserId || !Array.isArray(conversations.value)) {
    return []
  }

  const adminChat = conversations.value.find(c => c.isAdminChat)
  const userChats: Chat[] = conversations.value.map(conv => {
    const otherUser = conv.user1Id === currentUserId ? conv.user2 : conv.user1
    const unreadCount = conv.user1Id === currentUserId
      ? conv.unreadCountUser1
      : conv.unreadCountUser2

    return {
      id: conv.id,
      conversationId: conv.id,
      name: conv.isAdminChat
        ? t('account.messages.admin')
        : otherUser
          ? `${otherUser.firstName} ${otherUser.lastName}`.trim()
          : 'Пользователь',
      type: (conv.isAdminChat ? 'admin' : 'user') as 'admin' | 'user',
      avatar: conv.isAdminChat ? undefined : otherUser?.avatar,
      icon: conv.isAdminChat ? 'i-lucide-headphones' : undefined,
      role: otherUser ? undefined : undefined,
      lastMessage: lastMessagesMap.value.get(conv.id),
      unreadCount,
    }
  })

  if (!adminChat) {
    const placeholderChat: Chat = {
      id: 'admin-placeholder',
      conversationId: undefined,
      name: t('account.messages.admin'),
      type: 'admin',
      icon: 'i-lucide-headphones',
      unreadCount: 0,
    }
    userChats.unshift(placeholderChat)
  }

  return userChats
})

const activeChat = computed(() => {
  if (!activeChatId.value) return null
  return chats.value.find(chat => chat.id === activeChatId.value)
})

const currentMessages = computed(() => {
  if (!activeChat.value || activeChat.value.id === 'admin-placeholder') return []
  if (typeof activeChat.value.id !== 'number') return []

  const conversationId = activeChat.value.id
  const messages = messagesMap.value.get(conversationId) || []

  return messages.map(msg => {
    const isCurrentUser = msg.senderId === authStore.currentUser?.id
    return {
      id: msg.id.toString(),
      role: isCurrentUser ? 'user' : 'assistant',
      parts: [
        {
          type: 'text',
          id: `${msg.id}-1`,
          text: msg.content || '',
          state: 'done'
        }
      ],
      createdAt: msg.createdAt
    } as UIMessage
  })
})

async function loadConversations() {
  loading.value = true
  try {
    const data = await chat.getConversations()
    conversations.value = Array.isArray(data) ? data : []

    for (const conv of conversations.value) {
      await loadLastMessage(conv.id)
    }
  } catch (err) {
    console.error('Ошибка загрузки чатов:', err)
    error.value = err instanceof Error ? err : new Error('Ошибка загрузки чатов')
    conversations.value = []
  } finally {
    loading.value = false
  }
}

async function loadLastMessage(conversationId: number) {
  try {
    const response = await chat.getMessages(conversationId, 1, 1)
    if (response.data.length > 0) {
      const lastMsg = response.data[0]
      if (lastMsg) {
        lastMessagesMap.value.set(conversationId, lastMsg.content || '')
        lastMessagesTimeMap.value.set(conversationId, lastMsg.createdAt)
      }
    }
  } catch (err) {
    console.warn('Ошибка загрузки последнего сообщения:', err)
  }
}

async function loadMessages(conversationId: number) {
  if (messagesMap.value.has(conversationId)) {
    await nextTick()
    setTimeout(() => scrollToBottom(), 100)
    return
  }

  loadingMessages.value = true
  try {
    const response = await chat.getMessages(conversationId)
    messagesMap.value.set(conversationId, response.data)
  } catch (err) {
    console.error('Ошибка загрузки сообщений:', err)
    error.value = err instanceof Error ? err : new Error('Ошибка загрузки сообщений')
  } finally {
    loadingMessages.value = false
    await nextTick()
    setTimeout(() => scrollToBottom(), 100)
  }
}

async function selectChat(chatId: number | string) {
  if (chatId === 'admin-placeholder') {
    try {
      const adminChat = conversations.value.find(c => c.isAdminChat)
      if (adminChat) {
        await selectChat(adminChat.id)
        return
      }

      loadingMessages.value = true
      status.value = 'ready'
      const newAdminChat = await chat.createAdminConversation()
      conversations.value.push(newAdminChat)

      await nextTick()

      activeChatId.value = newAdminChat.id
      router.push({ query: { chat: newAdminChat.id } })

      const conversation = conversations.value.find(c => c.id === newAdminChat.id)
      if (conversation) {
        await loadMessages(newAdminChat.id)
        websocket.joinChatRoom(newAdminChat.id)
        websocket.markMessagesAsRead(newAdminChat.id)

        const currentUserId = authStore.currentUser?.id
        if (currentUserId) {
          if (conversation.user1Id === currentUserId) {
            conversation.unreadCountUser1 = 0
          } else {
            conversation.unreadCountUser2 = 0
          }
        }
      }
      loadingMessages.value = false
      await nextTick()
      setTimeout(() => scrollToBottom(), 100)
    } catch (err) {
      console.error('Ошибка создания чата с админом:', err)
      error.value = err instanceof Error ? err : new Error('Ошибка создания чата с админом')
      loadingMessages.value = false
      status.value = 'ready'
    }
    return
  }

  if (typeof chatId === 'string') {
    return
  }

  activeChatId.value = chatId
  status.value = 'ready'

  router.push({ query: { chat: chatId } })

  const conversation = conversations.value.find(c => c.id === chatId)
  if (!conversation) {
    loadingMessages.value = false
    return
  }

  await loadMessages(chatId)

  websocket.joinChatRoom(chatId)
  websocket.markMessagesAsRead(chatId)

  const currentUserId = authStore.currentUser?.id
  if (currentUserId) {
    const conv = conversations.value.find(c => c.id === chatId)
    if (conv) {
      if (conv.user1Id === currentUserId) {
        conv.unreadCountUser1 = 0
      } else {
        conv.unreadCountUser2 = 0
      }
    }
  }

  await nextTick()
  setTimeout(() => scrollToBottom(), 100)
}

function scrollToBottom() {
  if (messagesListRef.value) {
    messagesListRef.value.scrollToBottom()
  }
}

async function onSubmit() {
  if (!input.value.trim() || status.value === 'streaming' || !activeChat.value) return

  if (activeChat.value.id === 'admin-placeholder') {
    await selectChat('admin-placeholder')
    if (!activeChat.value || activeChat.value.id === 'admin-placeholder') {
      return
    }
  }

  const conversationId = activeChat.value.conversationId
  if (!conversationId || typeof conversationId !== 'number') return

  const messageText = input.value
  input.value = ''
  error.value = null
  status.value = 'submitted'

  try {
    status.value = 'streaming'

    const newMessage = await chat.sendMessage({
      conversationId,
      content: messageText,
    })

    const messages = messagesMap.value.get(conversationId) || []
    messages.push(newMessage)
    messagesMap.value.set(conversationId, messages)
    lastMessagesMap.value.set(conversationId, messageText)
    lastMessagesTimeMap.value.set(conversationId, newMessage.createdAt)

    status.value = 'ready'
    await nextTick()
    scrollToBottom()
  } catch (err) {
    error.value = err instanceof Error ? err : new Error('Ошибка отправки сообщения')
    status.value = 'error'
    input.value = messageText
  }
}

function handleStop() {
  status.value = 'ready'
}

function handleReload() {
  if (!activeChat.value || typeof activeChat.value.id !== 'number') return
  const conversationId = activeChat.value.id
  messagesMap.value.delete(conversationId)
  loadMessages(conversationId)
  status.value = 'ready'
}

function handleNewMessage(message: Message) {
  const conversationId = message.conversationId
  const messages = messagesMap.value.get(conversationId) || []

  if (!messages.find(m => m.id === message.id)) {
    messages.push(message)
    messagesMap.value.set(conversationId, messages)
    lastMessagesMap.value.set(conversationId, message.content || '')
    lastMessagesTimeMap.value.set(conversationId, message.createdAt)

    const conv = conversations.value.find(c => c.id === conversationId)
    if (conv) {
      const currentUserId = authStore.currentUser?.id
      if (currentUserId && message.senderId !== currentUserId) {
        if (conv.user1Id === currentUserId) {
          conv.unreadCountUser1++
        } else {
          conv.unreadCountUser2++
        }
      }
    }

    if (activeChatId.value === conversationId) {
      nextTick(() => scrollToBottom())
    }
  }
}

function handleMessageEdited(data: Partial<Message> & { id: number; conversationId: number }) {
  const messages = messagesMap.value.get(data.conversationId) || []
  const index = messages.findIndex(m => m.id === data.id)
  if (index !== -1 && messages[index]) {
    messages[index] = { ...messages[index], ...data } as Message
    messagesMap.value.set(data.conversationId, messages)
  }
}

function handleMessageDeleted(data: Partial<Message> & { id: number; conversationId: number }) {
  const messages = messagesMap.value.get(data.conversationId) || []
  const index = messages.findIndex(m => m.id === data.id)
  if (index !== -1 && messages[index]) {
    messages[index] = { ...messages[index], content: '[Сообщение удалено]', deletedAt: new Date().toISOString() } as Message
    messagesMap.value.set(data.conversationId, messages)
  }
}

onMounted(async () => {
  await loadConversations()

  const chatParam = route.query.chat
  if (chatParam === 'admin') {
    await selectChat('admin-placeholder')
  } else if (chatParam) {
    const chatIdStr = Array.isArray(chatParam) ? chatParam[0] : chatParam
    if (chatIdStr) {
      const chatId = typeof chatIdStr === 'string' ? parseInt(chatIdStr, 10) : chatIdStr
      if (!isNaN(chatId) && typeof chatId === 'number' && conversations.value.find(c => c.id === chatId)) {
        await selectChat(chatId)
      } else if (conversations.value.length > 0 && conversations.value[0]) {
        await selectChat(conversations.value[0].id)
      }
    } else if (conversations.value.length > 0 && conversations.value[0]) {
      await selectChat(conversations.value[0].id)
    }
  } else if (conversations.value.length > 0 && conversations.value[0]) {
    await selectChat(conversations.value[0].id)
  }

  websocket.onMessageNew(handleNewMessage)
  websocket.onMessageEdited(handleMessageEdited)
  websocket.onMessageDeleted(handleMessageDeleted)
})

onUnmounted(() => {
  websocket.offMessageNew(handleNewMessage)
  websocket.offMessageEdited(handleMessageEdited)
  websocket.offMessageDeleted(handleMessageDeleted)

  if (activeChatId.value && typeof activeChatId.value === 'number') {
    websocket.leaveChatRoom(activeChatId.value)
  }
})
</script>

<style scoped>
.chat-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
