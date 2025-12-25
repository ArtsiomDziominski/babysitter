import type { NotificationData } from './useWebSocket'

export enum NotificationType {
  NEW_MESSAGE = 'new_message',
  BOOKING = 'booking',
  SYSTEM = 'system',
  MESSAGE = 'message'
}

export const useNotifications = () => {
  const authStore = useAuthStore()
  const router = useRouter()
  const toast = useToast()
  const { t } = useI18n()
  const websocket = useWebSocket()

  const handleNewMessageNotification = (notification: NotificationData) => {
    const currentUserId = authStore.currentUser?.id

    if (!currentUserId || !notification.conversationId || notification.senderId === currentUserId) return

    const conversationId = notification.conversationId
    const route = useRoute()
    const isOnMessagesPage = route.path === '/account/messages'
    const activeChatId = route.query.chat
    const isActiveChat = isOnMessagesPage && activeChatId && String(activeChatId) === String(conversationId)

    if (isActiveChat) return

    const senderName = notification.senderName || t('account.messages.defaultSender')
    const messagePreview = notification.content || t('account.messages.newMessage')

    toast.add({
      title: senderName,
      description: messagePreview.length > 50 ? messagePreview.substring(0, 50) + '...' : messagePreview,
      color: 'neutral',
      onClick: () => {
        router.push(`/account/messages?chat=${conversationId}`)
      }
    })
  }

  const handleBookingNotification = (notification: NotificationData) => {
    if (!notification.title && !notification.message) return

    toast.add({
      title: notification.title || '',
      description: notification.message || '',
      color: 'info'
    })
  }

  const handleSystemNotification = (notification: NotificationData) => {
    if (!notification.title && !notification.message) return

    toast.add({
      title: notification.title || '',
      description: notification.message || '',
      color: 'neutral'
    })
  }

  const handleMessageNotification = (notification: NotificationData) => {
    if (!notification.title && !notification.message) return

    toast.add({
      title: notification.title || '',
      description: notification.message || '',
      color: 'neutral'
    })
  }

  const handleNotification = (notification: NotificationData) => {
    const currentUserId = authStore.currentUser?.id

    if (!currentUserId) return

    switch (notification.type) {
      case NotificationType.NEW_MESSAGE:
        handleNewMessageNotification(notification)
        break
      case NotificationType.BOOKING:
        handleBookingNotification(notification)
        break
      case NotificationType.SYSTEM:
        handleSystemNotification(notification)
        break
      case NotificationType.MESSAGE:
        handleMessageNotification(notification)
        break
    }
  }

  const init = () => {
    if (authStore.isAuthenticated) {
      websocket.onNotification(handleNotification)
    }

    watch(() => authStore.isAuthenticated, (isAuth) => {
      if (isAuth) websocket.onNotification(handleNotification)
      else websocket.offNotification(handleNotification)
    })

    onUnmounted(() => {
      websocket.offNotification(handleNotification)
    })
  }

  return {
    init
  }
}

