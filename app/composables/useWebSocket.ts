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

export const useWebSocket = () => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl
  const authStore = useAuthStore()

  const socket = ref<Socket | null>(null)
  const chatSocket = ref<Socket | null>(null)
  const isConnected = ref(false)
  const isChatConnected = ref(false)
  const connectionError = ref<string | null>(null)

  const connect = (token: string) => {
    if (socket.value?.connected) {
      return
    }

    if (socket.value) {
      socket.value.disconnect()
    }

    socket.value = io(apiBaseUrl, {
      auth: {
        token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    })

    socket.value.on('connect', () => {
      isConnected.value = true
      connectionError.value = null
      console.log('WebSocket подключен')
    })

    socket.value.on('disconnect', () => {
      isConnected.value = false
      console.log('WebSocket отключен')
    })

    socket.value.on('connect_error', (error) => {
      connectionError.value = error.message
      console.error('Ошибка подключения WebSocket:', error)
    })
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      isConnected.value = false
    }
  }

  const onBookingCreated = (callback: BookingCreatedCallback) => {
    if (!socket.value) return
    socket.value.on('booking:created', callback)
  }

  const offBookingCreated = (callback?: BookingCreatedCallback) => {
    if (!socket.value) return
    if (callback) {
      socket.value.off('booking:created', callback)
    } else {
      socket.value.off('booking:created')
    }
  }

  const onBookingStatusChanged = (callback: BookingStatusChangedCallback) => {
    if (!socket.value) return
    socket.value.on('booking:status_changed', callback)
  }

  const offBookingStatusChanged = (callback?: BookingStatusChangedCallback) => {
    if (!socket.value) return
    if (callback) {
      socket.value.off('booking:status_changed', callback)
    } else {
      socket.value.off('booking:status_changed')
    }
  }

  const onBookingUpdated = (callback: BookingUpdatedCallback) => {
    if (!socket.value) return
    socket.value.on('booking:updated', callback)
  }

  const offBookingUpdated = (callback?: BookingUpdatedCallback) => {
    if (!socket.value) return
    if (callback) {
      socket.value.off('booking:updated', callback)
    } else {
      socket.value.off('booking:updated')
    }
  }

  const onNotification = (callback: NotificationCallback) => {
    if (!socket.value) return
    socket.value.on('notification:new', callback)
  }

  const offNotification = (callback?: NotificationCallback) => {
    if (!socket.value) return
    if (callback) {
      socket.value.off('notification:new', callback)
    } else {
      socket.value.off('notification:new')
    }
  }

  const onUserConnected = (callback: UserConnectionCallback) => {
    if (!socket.value) return
    socket.value.on('user:connected', callback)
  }

  const offUserConnected = (callback?: UserConnectionCallback) => {
    if (!socket.value) return
    if (callback) {
      socket.value.off('user:connected', callback)
    } else {
      socket.value.off('user:connected')
    }
  }

  const onUserDisconnected = (callback: UserConnectionCallback) => {
    if (!socket.value) return
    socket.value.on('user:disconnected', callback)
  }

  const offUserDisconnected = (callback?: UserConnectionCallback) => {
    if (!socket.value) return
    if (callback) {
      socket.value.off('user:disconnected', callback)
    } else {
      socket.value.off('user:disconnected')
    }
  }

  const markNotificationAsRead = (notificationId: number) => {
    if (!socket.value || !socket.value.connected) return
    socket.value.emit('notification:read', { notificationId })
  }

  const connectChat = (token: string) => {
    if (chatSocket.value?.connected) {
      return
    }

    if (chatSocket.value) {
      chatSocket.value.disconnect()
    }

    chatSocket.value = io(`${apiBaseUrl}/chat`, {
      auth: {
        token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    })

    chatSocket.value.on('connect', () => {
      isChatConnected.value = true
      console.log('Chat WebSocket подключен')
    })

    chatSocket.value.on('disconnect', () => {
      isChatConnected.value = false
      console.log('Chat WebSocket отключен')
    })

    chatSocket.value.on('connect_error', (error) => {
      console.error('Ошибка подключения Chat WebSocket:', error)
    })
  }

  const disconnectChat = () => {
    if (chatSocket.value) {
      chatSocket.value.disconnect()
      chatSocket.value = null
      isChatConnected.value = false
    }
  }

  const joinChatRoom = (conversationId: number) => {
    if (!chatSocket.value || !chatSocket.value.connected) return
    chatSocket.value.emit('chat:join', { conversationId })
  }

  const leaveChatRoom = (conversationId: number) => {
    if (!chatSocket.value || !chatSocket.value.connected) return
    chatSocket.value.emit('chat:leave', { conversationId })
  }

  const onMessageNew = (callback: MessageNewCallback) => {
    if (!chatSocket.value) return
    chatSocket.value.on('message:new', callback)
  }

  const offMessageNew = (callback?: MessageNewCallback) => {
    if (!chatSocket.value) return
    if (callback) {
      chatSocket.value.off('message:new', callback)
    } else {
      chatSocket.value.off('message:new')
    }
  }

  const onMessageEdited = (callback: MessageEditedCallback) => {
    if (!chatSocket.value) return
    chatSocket.value.on('message:edited', callback)
  }

  const offMessageEdited = (callback?: MessageEditedCallback) => {
    if (!chatSocket.value) return
    if (callback) {
      chatSocket.value.off('message:edited', callback)
    } else {
      chatSocket.value.off('message:edited')
    }
  }

  const onMessageDeleted = (callback: MessageDeletedCallback) => {
    if (!chatSocket.value) return
    chatSocket.value.on('message:deleted', callback)
  }

  const offMessageDeleted = (callback?: MessageDeletedCallback) => {
    if (!chatSocket.value) return
    if (callback) {
      chatSocket.value.off('message:deleted', callback)
    } else {
      chatSocket.value.off('message:deleted')
    }
  }

  const onUserStatusChanged = (callback: UserStatusChangedCallback) => {
    if (!chatSocket.value) return
    chatSocket.value.on('user:status_changed', callback)
  }

  const offUserStatusChanged = (callback?: UserStatusChangedCallback) => {
    if (!chatSocket.value) return
    if (callback) {
      chatSocket.value.off('user:status_changed', callback)
    } else {
      chatSocket.value.off('user:status_changed')
    }
  }

  const markMessagesAsRead = (conversationId: number) => {
    if (!chatSocket.value || !chatSocket.value.connected) return
    chatSocket.value.emit('message:read', { conversationId })
  }

  watch(() => authStore.accessToken, (newToken) => {
    if (newToken && process.client) {
      connect(newToken)
      connectChat(newToken)
    } else {
      disconnect()
      disconnectChat()
    }
  }, { immediate: true })

  watch(() => authStore.isAuthenticated, (isAuth) => {
    if (!isAuth && process.client) {
      disconnect()
      disconnectChat()
    }
  })

  return {
    socket: readonly(socket),
    chatSocket: readonly(chatSocket),
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

