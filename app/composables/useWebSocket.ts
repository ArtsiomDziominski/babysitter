import { io, type Socket } from 'socket.io-client'
import { ref, watch, readonly } from 'vue'

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
  type: 'booking' | 'message' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: string
}

export interface UserConnectionData {
  userId: number
  timestamp: string
}

type BookingCreatedCallback = (data: BookingCreatedData) => void
type BookingStatusChangedCallback = (data: BookingStatusChangedData) => void
type BookingUpdatedCallback = (data: BookingUpdatedData) => void
type NotificationCallback = (notification: NotificationData) => void
type UserConnectionCallback = (data: UserConnectionData) => void

export const useWebSocket = () => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl
  const authStore = useAuthStore()

  const socket = ref<Socket | null>(null)
  const isConnected = ref(false)
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

  watch(() => authStore.accessToken, (newToken) => {
    if (newToken && process.client) {
      connect(newToken)
    } else {
      disconnect()
    }
  }, { immediate: true })

  watch(() => authStore.isAuthenticated, (isAuth) => {
    if (!isAuth && process.client) {
      disconnect()
    }
  })

  return {
    socket: readonly(socket),
    isConnected: readonly(isConnected),
    connectionError: readonly(connectionError),
    connect,
    disconnect,
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
    markNotificationAsRead
  }
}

