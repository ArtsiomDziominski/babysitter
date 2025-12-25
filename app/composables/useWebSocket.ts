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
  }
  message: string
}

export interface BookingStatusChangedData {
  bookingId: number
  oldStatus: string
  newStatus: string
  booking: {
    id: number
    status: string
    startTime: string
    endTime: string
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
type UserStatusChangedCallback = (data: UserStatusChangedData) => void

let socketInstance: Socket | null = null
let chatSocketInstance: Socket | null = null
const isConnected = ref(false)
const isChatConnected = ref(false)
const connectionError = ref<string | null>(null)
let watchInitialized = false

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

  const onBookingCreated = (callback: BookingCreatedCallback) => {
    if (!socketInstance) return
    socketInstance.on('booking:created', callback)
  }

  const offBookingCreated = (callback?: BookingCreatedCallback) => {
    if (!socketInstance) return
    if (callback) {
      socketInstance.off('booking:created', callback)
    } else {
      socketInstance.off('booking:created')
    }
  }

  const onBookingStatusChanged = (callback: BookingStatusChangedCallback) => {
    if (!socketInstance) return
    socketInstance.on('booking:status_changed', callback)
  }

  const offBookingStatusChanged = (callback?: BookingStatusChangedCallback) => {
    if (!socketInstance) return
    if (callback) {
      socketInstance.off('booking:status_changed', callback)
    } else {
      socketInstance.off('booking:status_changed')
    }
  }

  const onBookingUpdated = (callback: BookingUpdatedCallback) => {
    if (!socketInstance) return
    socketInstance.on('booking:updated', callback)
  }

  const offBookingUpdated = (callback?: BookingUpdatedCallback) => {
    if (!socketInstance) return
    if (callback) {
      socketInstance.off('booking:updated', callback)
    } else {
      socketInstance.off('booking:updated')
    }
  }

  const onNotification = (callback: NotificationCallback) => {
    if (!socketInstance) return
    socketInstance.on('notification:new', callback)
  }

  const offNotification = (callback?: NotificationCallback) => {
    if (!socketInstance) return
    if (callback) {
      socketInstance.off('notification:new', callback)
    } else {
      socketInstance.off('notification:new')
    }
  }

  const onUserConnected = (callback: UserConnectionCallback) => {
    if (!socketInstance) return
    socketInstance.on('user:connected', callback)
  }

  const offUserConnected = (callback?: UserConnectionCallback) => {
    if (!socketInstance) return
    if (callback) {
      socketInstance.off('user:connected', callback)
    } else {
      socketInstance.off('user:connected')
    }
  }

  const onUserDisconnected = (callback: UserConnectionCallback) => {
    if (!socketInstance) return
    socketInstance.on('user:disconnected', callback)
  }

  const offUserDisconnected = (callback?: UserConnectionCallback) => {
    if (!socketInstance) return
    if (callback) {
      socketInstance.off('user:disconnected', callback)
    } else {
      socketInstance.off('user:disconnected')
    }
  }

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
      console.log('Chat WebSocket подключен')
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
    if (chatSocketInstance) {
      chatSocketInstance.disconnect()
      chatSocketInstance = null
      isChatConnected.value = false
    }
  }

  const joinChatRoom = (conversationId: number) => {
    if (!chatSocketInstance || !chatSocketInstance.connected) return
    chatSocketInstance.emit('chat:join', { conversationId })
  }

  const leaveChatRoom = (conversationId: number) => {
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
    onUserStatusChanged,
    offUserStatusChanged,
    markNotificationAsRead,
    markMessagesAsRead
  }
}

