import { io, type Socket } from 'socket.io-client'
import { ref, watch, readonly } from 'vue'
import type { Message } from './useChat'

export interface BookingCreatedData {
  booking: {
    id: number
    parentId: number
    babysitterId: number
    startTime: string
    endTime: string
    status: string
    totalPrice: number
    childrenCount?: number
    parent?: { firstName?: string; lastName?: string }
  }
  message: string
}

export interface BookingStatusChangedData {
  bookingId: number
  oldStatus: string
  newStatus: string
  /** Кто поменял статус. Нет, если статус поменял сервер (автоотмена, начало, завершение) */
  actorId?: number
  booking: {
    id: number
    status: string
    startTime: string
    endTime: string
    babysitter?: { user?: { firstName?: string; lastName?: string } }
  }
}

export interface BookingUpdatedData {
  booking: {
    id: number
    status: string
    startTime: string
    endTime: string
    childrenCount?: number
    bookingType?: string
    notes?: string
    totalPrice: number
  }
  message: string
}

export interface NotificationData {
  id: number
  type: 'booking' | 'message' | 'system' | 'new_message'
  title?: string
  message?: string
  read?: boolean
  createdAt?: string
  conversationId?: number
  messageId?: number
  senderId?: number
  senderName?: string
  content?: string
}

export interface UserConnectionData {
  userId: number
  timestamp: string
}

export interface UserStatusChangedData {
  userId: number
  isOnline: boolean
}

type BookingCreatedCallback = (data: BookingCreatedData) => void
type BookingStatusChangedCallback = (data: BookingStatusChangedData) => void
type BookingUpdatedCallback = (data: BookingUpdatedData) => void
type NotificationCallback = (notification: NotificationData) => void
type UserConnectionCallback = (data: UserConnectionData) => void
type MessageNewCallback = (message: Message) => void
type MessageEditedCallback = (message: Partial<Message> & { id: number; conversationId: number }) => void
type MessageDeletedCallback = (message: Partial<Message> & { id: number; conversationId: number }) => void
type MessageReadCallback = (data: { conversationId: number; userId: number }) => void
type UserStatusChangedCallback = (data: UserStatusChangedData) => void

let socketInstance: Socket | null = null
let chatSocketInstance: Socket | null = null
const joinedChatRooms = new Set<number>()
const isConnected = ref(false)
const isChatConnected = ref(false)
const connectionError = ref<string | null>(null)
let watchInitialized = false
// Подписки на основной сокет. Хранятся отдельно от экземпляра, чтобы пережить переподключение
// с новым токеном и подписку до того, как сокет создан
const mainSocketListeners = new Map<string, Set<(...args: any[]) => void>>()

const listen = (event: string, callback: (...args: any[]) => void) => {
  if (!mainSocketListeners.has(event)) mainSocketListeners.set(event, new Set())
  const callbacks = mainSocketListeners.get(event)!
  if (callbacks.has(callback)) return
  callbacks.add(callback)
  socketInstance?.on(event, callback)
}

const unlisten = (event: string, callback?: (...args: any[]) => void) => {
  if (callback) {
    mainSocketListeners.get(event)?.delete(callback)
    socketInstance?.off(event, callback)
    return
  }
  mainSocketListeners.get(event)?.forEach(cb => socketInstance?.off(event, cb))
  mainSocketListeners.delete(event)
}

export const useWebSocket = () => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl
  const authStore = useAuthStore()

  const socket = computed(() => socketInstance)
  const chatSocket = computed(() => chatSocketInstance)

  const connect = (token: string) => {
    if (socketInstance?.connected) {
      return
    }

    if (socketInstance) {
      socketInstance.disconnect()
    }

    socketInstance = io(apiBaseUrl, {
      auth: {
        token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    })

    mainSocketListeners.forEach((callbacks, event) => {
      callbacks.forEach(callback => socketInstance?.on(event, callback))
    })

    socketInstance.on('connect', () => {
      isConnected.value = true
      connectionError.value = null
      console.log('WebSocket подключен')
    })

    socketInstance.on('disconnect', () => {
      isConnected.value = false
      console.log('WebSocket отключен')
    })

    socketInstance.on('connect_error', (error) => {
      connectionError.value = error.message
      console.error('Ошибка подключения WebSocket:', error)
    })
  }

  const disconnect = () => {
    if (socketInstance) {
      socketInstance.disconnect()
      socketInstance = null
      isConnected.value = false
    }
  }

  const onBookingCreated = (callback: BookingCreatedCallback) => listen('booking:created', callback)

  const offBookingCreated = (callback?: BookingCreatedCallback) => unlisten('booking:created', callback)

  const onBookingStatusChanged = (callback: BookingStatusChangedCallback) => listen('booking:status_changed', callback)

  const offBookingStatusChanged = (callback?: BookingStatusChangedCallback) => unlisten('booking:status_changed', callback)

  const onBookingUpdated = (callback: BookingUpdatedCallback) => listen('booking:updated', callback)

  const offBookingUpdated = (callback?: BookingUpdatedCallback) => unlisten('booking:updated', callback)

  const onNotification = (callback: NotificationCallback) => listen('notification:new', callback)

  const offNotification = (callback?: NotificationCallback) => unlisten('notification:new', callback)

  const onUserConnected = (callback: UserConnectionCallback) => listen('user:connected', callback)

  const offUserConnected = (callback?: UserConnectionCallback) => unlisten('user:connected', callback)

  const onUserDisconnected = (callback: UserConnectionCallback) => listen('user:disconnected', callback)

  const offUserDisconnected = (callback?: UserConnectionCallback) => unlisten('user:disconnected', callback)

  const markNotificationAsRead = (notificationId: number) => {
    if (!socketInstance || !socketInstance.connected) return
    socketInstance.emit('notification:read', { notificationId })
  }

  const connectChat = (token: string) => {
    if (chatSocketInstance?.connected) {
      return
    }

    if (chatSocketInstance) {
      chatSocketInstance.disconnect()
    }

    chatSocketInstance = io(`${apiBaseUrl}/chat`, {
      auth: {
        token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    })

    chatSocketInstance.on('connect', () => {
      isChatConnected.value = true
      // После (пере)подключения сервер не помнит комнаты — входим в них заново
      joinedChatRooms.forEach((conversationId) => {
        chatSocketInstance?.emit('chat:join', { conversationId })
      })
    })

    chatSocketInstance.on('disconnect', () => {
      isChatConnected.value = false
      console.log('Chat WebSocket отключен')
    })

    chatSocketInstance.on('connect_error', (error) => {
      console.error('Ошибка подключения Chat WebSocket:', error)
    })
  }

  const disconnectChat = () => {
    joinedChatRooms.clear()
    if (chatSocketInstance) {
      chatSocketInstance.disconnect()
      chatSocketInstance = null
      isChatConnected.value = false
    }
  }

  // Комнату запоминаем, даже если сокет ещё подключается: вход выполнится в обработчике connect
  const joinChatRoom = (conversationId: number) => {
    joinedChatRooms.add(conversationId)
    if (!chatSocketInstance || !chatSocketInstance.connected) return
    chatSocketInstance.emit('chat:join', { conversationId })
  }

  const leaveChatRoom = (conversationId: number) => {
    joinedChatRooms.delete(conversationId)
    if (!chatSocketInstance || !chatSocketInstance.connected) return
    chatSocketInstance.emit('chat:leave', { conversationId })
  }

  const onMessageNew = (callback: MessageNewCallback) => {
    if (!chatSocketInstance) return
    chatSocketInstance.on('message:new', callback)
  }

  const offMessageNew = (callback?: MessageNewCallback) => {
    if (!chatSocketInstance) return
    if (callback) {
      chatSocketInstance.off('message:new', callback)
    } else {
      chatSocketInstance.off('message:new')
    }
  }

  const onMessageEdited = (callback: MessageEditedCallback) => {
    if (!chatSocketInstance) return
    chatSocketInstance.on('message:edited', callback)
  }

  const offMessageEdited = (callback?: MessageEditedCallback) => {
    if (!chatSocketInstance) return
    if (callback) {
      chatSocketInstance.off('message:edited', callback)
    } else {
      chatSocketInstance.off('message:edited')
    }
  }

  const onMessageDeleted = (callback: MessageDeletedCallback) => {
    if (!chatSocketInstance) return
    chatSocketInstance.on('message:deleted', callback)
  }

  const offMessageDeleted = (callback?: MessageDeletedCallback) => {
    if (!chatSocketInstance) return
    if (callback) {
      chatSocketInstance.off('message:deleted', callback)
    } else {
      chatSocketInstance.off('message:deleted')
    }
  }

  const onMessageRead = (callback: MessageReadCallback) => {
    if (!chatSocketInstance) return
    chatSocketInstance.on('message:read', callback)
  }

  const offMessageRead = (callback?: MessageReadCallback) => {
    if (!chatSocketInstance) return
    if (callback) {
      chatSocketInstance.off('message:read', callback)
    } else {
      chatSocketInstance.off('message:read')
    }
  }

  const onUserStatusChanged = (callback: UserStatusChangedCallback) => {
    if (!chatSocketInstance) return
    chatSocketInstance.on('user:status_changed', callback)
  }

  const offUserStatusChanged = (callback?: UserStatusChangedCallback) => {
    if (!chatSocketInstance) return
    if (callback) {
      chatSocketInstance.off('user:status_changed', callback)
    } else {
      chatSocketInstance.off('user:status_changed')
    }
  }

  const markMessagesAsRead = (conversationId: number) => {
    if (!chatSocketInstance || !chatSocketInstance.connected) return
    chatSocketInstance.emit('message:read', { conversationId })
  }

  // Watch только один раз
  if (process.client && !watchInitialized) {
    watchInitialized = true
    watch(() => authStore.accessToken, (newToken) => {
      if (newToken) {
        connect(newToken)
        connectChat(newToken)
      } else {
      disconnect()
        disconnectChat()
    }
  }, { immediate: true })

  watch(() => authStore.isAuthenticated, (isAuth) => {
      if (!isAuth) {
      disconnect()
        disconnectChat()
    }
  })
  }

  return {
    socket: computed(() => socketInstance),
    chatSocket: computed(() => chatSocketInstance),
    isConnected: readonly(isConnected),
    isChatConnected: readonly(isChatConnected),
    connectionError: readonly(connectionError),
    connect,
    disconnect,
    connectChat,
    disconnectChat,
    joinChatRoom,
    leaveChatRoom,
    onBookingCreated,
    offBookingCreated,
    onBookingStatusChanged,
    offBookingStatusChanged,
    onBookingUpdated,
    offBookingUpdated,
    onNotification,
    offNotification,
    onUserConnected,
    offUserConnected,
    onUserDisconnected,
    offUserDisconnected,
    onMessageNew,
    offMessageNew,
    onMessageEdited,
    offMessageEdited,
    onMessageDeleted,
    offMessageDeleted,
    onMessageRead,
    offMessageRead,
    onUserStatusChanged,
    offUserStatusChanged,
    markNotificationAsRead,
    markMessagesAsRead
  }
}

