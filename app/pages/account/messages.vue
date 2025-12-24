<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm flex flex-col h-[calc(100vh-12rem)]">
    <div class="flex h-full">
      <!-- Список чатов -->
      <div class="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div class="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ $t('account.messages.title') }}
          </h1>
        </div>
        <div class="flex-1 overflow-y-auto">
          <div class="p-2 space-y-1">
            <button
              v-for="chat in chats"
              :key="chat.id"
              class="w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-left"
              :class="activeChatId === chat.id
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'"
              @click="selectChat(chat.id)"
            >
              <UAvatar
                :src="chat.avatar"
                :icon="chat.icon"
                :alt="chat.name"
                size="md"
              />
              <div class="flex-1 min-w-0">
                <div class="font-medium truncate">{{ chat.name }}</div>
                <div
                  v-if="chat.lastMessage"
                  class="text-sm truncate opacity-70"
                >
                  {{ chat.lastMessage }}
                </div>
              </div>
              <div
                v-if="chat.unreadCount > 0"
                class="flex-shrink-0 bg-primary-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center"
              >
                {{ chat.unreadCount > 9 ? '9+' : chat.unreadCount }}
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Активный чат -->
      <div class="flex-1 flex flex-col min-h-0">
        <div
          v-if="activeChat"
          class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3"
        >
          <UAvatar
            :src="activeChat.avatar"
            :icon="activeChat.icon"
            :alt="activeChat.name"
            size="md"
          />
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ activeChat.name }}
            </h2>
            <p
              v-if="activeChat.type === 'user'"
              class="text-sm text-gray-500 dark:text-gray-400"
            >
              {{ activeChat.role === UserRole.BABYSITTER ? $t('account.role.nanny') : $t('account.role.parent') }}
            </p>
          </div>
        </div>

        <div class="flex-1 flex flex-col min-h-0">
          <UChatMessages
            :messages="currentMessages"
            :status="status"
            :user="{
              side: 'right',
              variant: 'soft',
              avatar: {
                src: authStore.currentUser?.avatar,
                icon: authStore.currentUser?.avatar ? undefined : 'i-lucide-user'
              }
            }"
            :assistant="activeChat?.type === 'ai' ? {
              side: 'left',
              variant: 'naked',
              avatar: {
                icon: 'i-lucide-bot'
              }
            } : {
              side: 'left',
              variant: 'naked',
              avatar: {
                src: activeChat?.avatar,
                icon: activeChat?.icon
              }
            }"
            should-auto-scroll
            class="flex-1 overflow-y-auto"
          >
            <template #content="{ message }">
              <div class="text-pretty whitespace-pre-wrap">{{ getTextFromMessage(message) }}</div>
            </template>
          </UChatMessages>

          <div class="border-t border-gray-200 dark:border-gray-700 p-4">
            <UChatPrompt
              v-model="input"
              :error="error"
              :disabled="status === 'streaming' || !activeChat"
              @submit="onSubmit"
            >
              <UChatPromptSubmit
                :status="status"
                @stop="handleStop"
                @reload="handleReload"
              />
            </UChatPrompt>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserRole } from '~/const/roles'

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
}

interface Chat {
  id: string
  name: string
  type: 'ai' | 'admin' | 'user'
  avatar?: string
  icon?: string
  role?: UserRole
  lastMessage?: string
  unreadCount: number
  messages: UIMessage[]
}

const { t } = useI18n()
const authStore = useAuthStore()
const route = useRoute()

const input = ref('')
const error = ref<Error | null>(null)
const status = ref<'submitted' | 'streaming' | 'ready' | 'error'>('ready')
const activeChatId = ref<string>('ai')

onMounted(() => {
  const chatParam = route.query.chat
  if (chatParam === 'admin') {
    activeChatId.value = 'admin'
  }
})

const chatsData = ref<Omit<Chat, 'name'>[]>([
  {
    id: 'ai',
    type: 'ai',
    icon: 'i-lucide-bot',
    unreadCount: 0,
    messages: [
      {
        id: '1',
        role: 'assistant',
        parts: [
          {
            type: 'text',
            id: '1-1',
            text: 'Привет! Я AI помощник. Чем могу помочь?'
          }
        ]
      }
    ]
  },
  {
    id: 'admin',
    type: 'admin',
    icon: 'i-lucide-headphones',
    unreadCount: 2,
    messages: [
      {
        id: '1',
        role: 'assistant',
        parts: [
          {
            type: 'text',
            id: '1-1',
            text: 'Здравствуйте! Я администратор. Если у вас есть вопросы, задавайте!'
          }
        ]
      }
    ]
  },
  {
    id: 'user-1',
    name: 'Анна Петрова',
    type: 'user',
    avatar: 'https://github.com/benjamincanac.png',
    role: UserRole.BABYSITTER,
    unreadCount: 0,
    messages: [
      {
        id: '1',
        role: 'assistant',
        parts: [
          {
            type: 'text',
            id: '1-1',
            text: 'Привет! Готова помочь с детьми.'
          }
        ]
      }
    ]
  },
  {
    id: 'user-2',
    type: 'user',
    avatar: undefined,
    icon: 'i-lucide-user',
    role: UserRole.PARENT,
    unreadCount: 1,
    messages: []
  }
])

const chats = computed<Chat[]>(() => chatsData.value.map(chat => {
  let name = ''
  if (chat.type === 'ai') {
    name = t('account.messages.aiAssistant')
  } else if (chat.type === 'admin') {
    name = t('account.messages.admin')
  } else if (chat.id === 'user-1') {
    name = 'Анна Петрова'
  } else if (chat.id === 'user-2') {
    name = 'Иван Сидоров'
  }
  return { ...chat, name } as Chat
}))

const activeChat = computed(() => chats.value.find(chat => chat.id === activeChatId.value))
const currentMessages = computed(() => activeChat.value?.messages || [])

function getTextFromMessage(message: UIMessage): string {
  return message.parts
    .filter(part => part.type === 'text' && part.text)
    .map(part => part.text || '')
    .join('\n')
}

function selectChat(chatId: string) {
  activeChatId.value = chatId
  const chatData = chatsData.value.find(c => c.id === chatId)
  if (chatData) {
    chatData.unreadCount = 0
  }
}

async function onSubmit() {
  if (!input.value.trim() || status.value === 'streaming' || !activeChat.value) return

  const userMessage: UIMessage = {
    id: Date.now().toString(),
    role: 'user',
    parts: [
      {
        type: 'text',
        id: `${Date.now()}-1`,
        text: input.value
      }
    ]
  }

  activeChat.value.messages.push(userMessage)
  const messageText = input.value
  input.value = ''
  error.value = null
  status.value = 'submitted'

  try {
    status.value = 'streaming'

    let responseText = ''
    if (activeChat.value.type === 'ai') {
      responseText = `Вы написали: "${messageText}". Это демо-версия AI чата. Для полноценной работы необходимо подключить API.`
    } else if (activeChat.value.type === 'admin') {
      responseText = `Спасибо за сообщение! Администратор ответит вам в ближайшее время.`
    } else {
      responseText = `Сообщение отправлено. Это демо-версия. В реальном приложении сообщение будет доставлено пользователю.`
    }

    const assistantMessage: UIMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      parts: [
        {
          type: 'text',
          id: `${Date.now() + 1}-1`,
          text: responseText,
          state: 'done'
        }
      ]
    }

    await new Promise(resolve => setTimeout(resolve, 1000))

    activeChat.value.messages.push(assistantMessage)
    activeChat.value.lastMessage = messageText
    status.value = 'ready'
  } catch (err) {
    error.value = err instanceof Error ? err : new Error('Произошла ошибка')
    status.value = 'error'
  }
}

function handleStop() {
  status.value = 'ready'
}

function handleReload() {
  if (!activeChat.value) return
  if (activeChat.value.messages.length > 0 && activeChat.value.messages[activeChat.value.messages.length - 1].role === 'user') {
    activeChat.value.messages.pop()
  }
  status.value = 'ready'
}
</script>
