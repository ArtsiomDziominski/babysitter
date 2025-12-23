<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">
      {{ $t('account.orders.title') }}
    </h1>

    <PageAccountOrdersStatusTabs
      :selected-status="selectedStatus"
      @update:selected-status="selectedStatus = $event"
    />

    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p class="text-gray-500 dark:text-gray-400">
          {{ $t('account.orders.loading') }}
        </p>
      </div>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500 dark:text-red-400 mb-4">
        {{ error }}
      </p>
      <UButton color="primary" @click="loadBookings">
        {{ $t('account.orders.retry') }}
      </UButton>
    </div>

    <div v-else-if="orders.length === 0" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">
        {{ $t('account.orders.empty') }}
      </p>
    </div>

    <div v-else class="space-y-4">
      <PageAccountOrdersCard
        v-for="order in orders"
        :key="order.id"
        :order="order"
        :babysitter-id-map="babysitterIdMap"
        @show-details="openDetailsModal"
        @action="handleAction"
      />
    </div>

    <PageAccountOrdersDetailsModal
      v-model:is-open="isDetailsModalOpen"
      :is-loading="isLoadingDetails"
      :details="bookingDetails"
    />

    <PageAccountOrdersReviewModal
      v-model:is-open="isReviewModalOpen"
      :booking="reviewBooking"
      @success="loadBookings"
    />
  </div>
</template>

<script setup lang="ts">
import type { BookingDetails, BookingListItem } from '~/composables/useBookings'

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const bookingsApi = useBookings()
const toast = useToast()
const authStore = useAuthStore()
const modalStore = useModalStore()
const websocket = useWebSocket()

const selectedStatus = ref<string | null>(null)
const orders = ref<BookingListItem[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const isDetailsModalOpen = ref(false)
const bookingDetails = ref<BookingDetails | null>(null)
const isLoadingDetails = ref(false)
const babysitterIdMap = ref<Record<number, number>>({})
const isReviewModalOpen = ref(false)
const reviewBooking = ref<BookingDetails | null>(null)

const loadBookings = async () => {
  isLoading.value = true
  error.value = null

  try {
    const params: any = {
      page: 1,
      limit: 50
    }

    if (selectedStatus.value) {
      params.status = selectedStatus.value
    }

    const response = await bookingsApi.getBookings(params)
    orders.value = response.data
  } catch (err: any) {
    console.error('Ошибка загрузки заказов:', err)
    error.value = err.message || t('account.orders.loadError')
    toast.add({
      title: t('account.orders.loadError'),
      description: err.message || t('account.orders.loadErrorMessage'),
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

watch(selectedStatus, () => {
  loadBookings()
})

const handleBookingCreated = (data: any) => {
  toast.add({
    title: t('account.orders.notifications.newBooking'),
    description: data.message || t('account.orders.notifications.newBookingMessage'),
    color: 'info'
  })
  loadBookings()
}

const handleBookingStatusChanged = (data: any) => {
  const statusText = {
    pending: t('account.orders.status.pending'),
    confirmed: t('account.orders.status.confirmed'),
    in_progress: t('account.orders.status.in_progress'),
    completed: t('account.orders.status.completed'),
    cancelled: t('account.orders.status.cancelled')
  }

  toast.add({
    title: t('account.orders.notifications.statusChanged'),
    description: `${t('account.orders.notifications.statusChangedFrom')} ${statusText[data.oldStatus as keyof typeof statusText]} ${t('account.orders.notifications.statusChangedTo')} ${statusText[data.newStatus as keyof typeof statusText]}`,
    color: 'info'
  })

  const orderIndex = orders.value.findIndex(o => o.id === data.bookingId)
  if (orderIndex !== -1 && orders.value[orderIndex]) {
    orders.value[orderIndex].status = data.booking.status as any
  } else {
    loadBookings()
  }
}

const handleBookingUpdated = (data: any) => {
  toast.add({
    title: t('account.orders.notifications.bookingUpdated'),
    description: data.message || t('account.orders.notifications.bookingUpdatedMessage'),
    color: 'info'
  })
  loadBookings()
}

const handleNotification = (notification: any) => {
  toast.add({
    title: notification.title,
    description: notification.message,
    color: notification.type === 'booking' ? 'info' : 'neutral'
  })
}

onMounted(() => {
  loadBookings()

  websocket.onBookingCreated(handleBookingCreated)
  websocket.onBookingStatusChanged(handleBookingStatusChanged)
  websocket.onBookingUpdated(handleBookingUpdated)
  websocket.onNotification(handleNotification)
})

onUnmounted(() => {
  websocket.offBookingCreated(handleBookingCreated)
  websocket.offBookingStatusChanged(handleBookingStatusChanged)
  websocket.offBookingUpdated(handleBookingUpdated)
  websocket.offNotification(handleNotification)
})

const openDetailsModal = async (id: number) => {
  isDetailsModalOpen.value = true
  isLoadingDetails.value = true
  bookingDetails.value = null

  try {
    const details = await bookingsApi.getBookingById(id)
    console.log('Детали заказа загружены:', details)
    bookingDetails.value = details
    if (details.babysitterId) {
      babysitterIdMap.value[id] = details.babysitterId
    }
  } catch (err: any) {
    console.error('Ошибка загрузки деталей заказа:', err)
    toast.add({
      title: t('account.orders.details.loadError'),
      description: err.message || t('account.orders.details.loadErrorMessage'),
      color: 'error'
    })
  } finally {
    isLoadingDetails.value = false
  }
}

const handleAction = async (orderId: number, action: string) => {
  if (action === 'cancel') {
    modalStore.open({
      title: t('account.orders.actions.cancelConfirmTitle'),
      description: t('account.orders.actions.cancelConfirmMessage'),
      actions: [
        {
          label: t('account.orders.actions.cancelConfirmCancel'),
          variant: 'outline',
          handler: () => {
            modalStore.close()
          }
        },
        {
          label: t('account.orders.actions.cancel'),
          color: 'error',
          handler: async () => {
            modalStore.close()
            try {
              await bookingsApi.updateBookingStatus(orderId, 'cancelled')
              toast.add({
                title: t('account.orders.actions.cancelSuccess'),
                color: 'success'
              })
              await loadBookings()
            } catch (err: any) {
              console.error('Ошибка отмены заказа:', err)
              toast.add({
                title: t('account.orders.actions.cancelError'),
                description: err.message || t('account.orders.actions.cancelErrorMessage'),
                color: 'error'
              })
            }
          }
        }
      ]
    })
  } else if (action === 'confirm') {
    try {
      await bookingsApi.updateBookingStatus(orderId, 'confirmed')
      toast.add({
        title: t('account.orders.actions.confirmSuccess'),
        color: 'success'
      })
      await loadBookings()
    } catch (err: any) {
      console.error('Ошибка подтверждения заказа:', err)
      toast.add({
        title: t('account.orders.actions.confirmError'),
        description: err.message || t('account.orders.actions.confirmErrorMessage'),
        color: 'error'
      })
    }
  } else if (action === 'review') {
    try {
      reviewBooking.value = await bookingsApi.getBookingById(orderId)
      isReviewModalOpen.value = true
    } catch (err: any) {
      console.error('Ошибка загрузки деталей заказа для отзыва:', err)
      toast.add({
        title: t('account.orders.review.loadError'),
        description: err.message || t('account.orders.review.loadErrorMessage'),
        color: 'error'
      })
    }
  }
}
</script>
