<template>
  <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-2">
          <span class="text-lg font-semibold text-gray-900 dark:text-white">
            #{{ order.id }}
          </span>
          <NuxtLink
            v-if="sitterId && userRole === UserRole.PARENT"
            :to="`/sitter/${sitterId}`"
            class="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {{ order.customer.name }}
          </NuxtLink>
          <h3
            v-else
            class="text-lg font-semibold text-gray-900 dark:text-white"
          >
            {{ order.customer.name }}
          </h3>
          <span
            class="px-2 py-1 text-xs font-medium rounded"
            :class="getStatusClass(order.status)"
          >
            {{ getStatusText(order.status) }}
          </span>
        </div>
        <div class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <span class="font-medium">{{ $t('account.orders.date') }}:</span>
            {{ formatDate(order.date) }}
          </p>
          <p>
            <span class="font-medium">{{ $t('account.orders.time') }}:</span>
            {{ order.time }}
          </p>
          <p v-if="order.children.length > 0">
            <span class="font-medium">{{ $t('account.orders.children') }}:</span>
            {{ order.children.join(', ') }}
          </p>
          <p>
            <span class="font-medium">{{ $t('account.orders.createdAt') }}:</span>
            {{ formatDateTime(order.createdAt) }}
          </p>
        </div>
      </div>
      <div class="flex flex-col items-end">
        <span class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ typeof order.totalPrice === 'string' ? parseFloat(order.totalPrice).toFixed(2) : order.totalPrice }} ₽
        </span>
      </div>
    </div>

    <div class="flex items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <PageAccountOrdersOrderActions
        :order-id="order.id"
        :status="order.status"
        :end-time="order.endTime"
        :user-role="userRole"
        @action="$emit('action', $event[0], $event[1])"
      />

      <div class="flex gap-2">
        <UButton
          size="sm"
          variant="outline"
          class="cursor-pointer"
          @click="$emit('showDetails', order.id)"
        >
          {{ $t('account.orders.actions.details') }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BookingListItem } from '~/composables/useBookings'
import { UserRole } from '~/const/roles'

const { t } = useI18n()
const authStore = useAuthStore()

const props = defineProps<{
  order: BookingListItem
  babysitterIdMap?: Record<number, number>
}>()

const sitterId = computed(() => {
  return props.order.babysitterId || props.babysitterIdMap?.[props.order.id]
})

defineEmits<{
  showDetails: [id: number]
  action: [id: number, action: string]
}>()

const userRole = computed(() => authStore.currentUser?.role)

const getStatusClass = (status: BookingListItem['status']) => {
  const classes = {
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    confirmed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    in_progress: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    completed: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
  }
  return classes[status]
}

const getStatusText = (status: BookingListItem['status']) => {
  const statusMap = {
    pending: t('account.orders.status.pending'),
    confirmed: t('account.orders.status.confirmed'),
    in_progress: t('account.orders.status.in_progress'),
    completed: t('account.orders.status.completed'),
    cancelled: t('account.orders.status.cancelled')
  }
  return statusMap[status]
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatDateTime = (dateString: string | undefined) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>


