import type { BookingCreatedData, BookingStatusChangedData, NotificationData } from './useWebSocket'
import { UserRole } from '~/const/roles'

export enum NotificationType {
  NEW_MESSAGE = 'new_message',
  BOOKING = 'booking',
  SYSTEM = 'system',
  MESSAGE = 'message'
}

/** Число неотвеченных заявок у няни: бейдж у пункта «Заказы» в шапке */
export const usePendingBookingsCount = () => useState<number>('pending-bookings-count', () => 0)

const formatBookingTime = (iso: string, locale: string) => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString(locale, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tbilisi' })
}

const personName = (person?: { firstName?: string; lastName?: string }) =>
  [person?.firstName, person?.lastName].filter(Boolean).join(' ')

export const useNotifications = () => {
  const authStore = useAuthStore()
  const router = useRouter()
  const toast = useToast()
  const { t, locale } = useI18n()
  const pendingBookingsCount = usePendingBookingsCount()
  const localePath = useLocalePath()
  const getRouteBaseName = useRouteBaseName()
  const websocket = useWebSocket()

  const handleNewMessageNotification = (notification: NotificationData) => {
    const currentUserId = authStore.currentUser?.id

    if (!currentUserId || !notification.conversationId || notification.senderId === currentUserId) return

    const conversationId = notification.conversationId
    const route = useRoute()
    const isOnMessagesPage = getRouteBaseName(route) === 'account-messages'
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
        router.push(localePath(`/account/messages?chat=${conversationId}`))
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

  const isSitter = () => authStore.currentUser?.role === UserRole.BABYSITTER

  const refreshPendingBookingsCount = async () => {
    if (!authStore.isAuthenticated || !isSitter()) {
      pendingBookingsCount.value = 0
      return
    }
    try {
      const response = await useBookings().getBookings({ status: 'pending', page: 1, limit: 1 })
      pendingBookingsCount.value = response.meta?.total ?? response.data.length
    } catch {
      // Счётчик вспомогательный: ошибку не показываем
    }
  }

  const openOrders = () => router.push(localePath('/account/orders'))

  const handleBookingCreated = (data: BookingCreatedData) => {
    const booking = data.booking
    const parent = personName(booking?.parent) || t('notifications.booking.someParent')
    toast.add({
      title: t('notifications.booking.newRequest'),
      description: t('notifications.booking.newRequestDesc', { name: parent, time: formatBookingTime(booking?.startTime, locale.value) }),
      color: 'info',
      icon: 'i-lucide-calendar-plus',
      duration: 10000,
      actions: [{ label: t('notifications.booking.open'), color: 'neutral', variant: 'outline', onClick: openOrders }]
    })
    refreshPendingBookingsCount()
  }

  const handleBookingStatusChanged = (data: BookingStatusChangedData) => {
    refreshPendingBookingsCount()

    const currentUserId = authStore.currentUser?.id
    // Свои действия пользователь видит и так
    if (data.actorId && data.actorId === currentUserId) return

    const time = formatBookingTime(data.booking?.startTime, locale.value)
    const sitter = personName(data.booking?.babysitter?.user) || t('notifications.booking.someSitter')
    const unanswered = !data.actorId && data.oldStatus === 'pending'

    const byStatus: Record<string, { title: string; description: string; color: 'success' | 'warning' | 'info'; icon: string } | undefined> = {
      confirmed: {
        title: t('notifications.booking.confirmed'),
        description: t('notifications.booking.confirmedDesc', { name: sitter, time }),
        color: 'success',
        icon: 'i-lucide-calendar-check'
      },
      cancelled: {
        title: t('notifications.booking.cancelled'),
        description: unanswered
          ? (isSitter() ? t('notifications.booking.expiredSitterDesc', { time }) : t('notifications.booking.expiredParentDesc', { time }))
          : t('notifications.booking.cancelledDesc', { time }),
        color: 'warning',
        icon: 'i-lucide-calendar-x'
      },
      completed: isSitter() ? undefined : {
        title: t('notifications.booking.completed'),
        description: t('notifications.booking.completedDesc', { name: sitter }),
        color: 'info',
        icon: 'i-lucide-star'
      }
    }

    const content = byStatus[data.newStatus]
    if (!content) return

    toast.add({
      ...content,
      duration: 10000,
      actions: [{ label: t('notifications.booking.open'), color: 'neutral', variant: 'outline', onClick: openOrders }]
    })
  }

  const subscribe = () => {
    websocket.onNotification(handleNotification)
    websocket.onBookingCreated(handleBookingCreated)
    websocket.onBookingStatusChanged(handleBookingStatusChanged)
    refreshPendingBookingsCount()
  }

  const unsubscribe = () => {
    websocket.offNotification(handleNotification)
    websocket.offBookingCreated(handleBookingCreated)
    websocket.offBookingStatusChanged(handleBookingStatusChanged)
    pendingBookingsCount.value = 0
  }

  const init = () => {
    if (authStore.isAuthenticated) subscribe()

    watch(() => authStore.isAuthenticated, (isAuth) => {
      if (isAuth) subscribe()
      else unsubscribe()
    })

    // Роль выбирают после входа: счётчик нужен только няне
    watch(() => authStore.currentUser?.role, () => refreshPendingBookingsCount())

    onUnmounted(unsubscribe)
  }

  return {
    init
  }
}

