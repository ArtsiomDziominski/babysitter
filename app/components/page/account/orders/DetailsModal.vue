<template>
  <UModal v-model:open="isOpen" :title="$t('account.orders.details.title')">
    <template #body>
      <div v-if="isLoading" class="flex items-center justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
      <div v-else-if="details" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              {{ $t('account.orders.details.status') }}
            </p>
            <span
              class="px-2 py-1 text-xs font-medium rounded inline-block"
              :class="getStatusClass(details.status)"
            >
              {{ getStatusText(details.status) }}
            </span>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              {{ $t('account.orders.details.totalPrice') }}
            </p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ typeof details.totalPrice === 'string' ? parseFloat(details.totalPrice).toFixed(2) : details.totalPrice }} ₽
            </p>
          </div>
        </div>

        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {{ $t('account.orders.details.date') }}
          </p>
          <p class="text-gray-900 dark:text-white">
            {{ formatDate(details.startTime) }}
          </p>
        </div>

        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {{ $t('account.orders.details.time') }}
          </p>
          <p class="text-gray-900 dark:text-white">
            {{ formatTimeRange(details.startTime, details.endTime) }}
          </p>
        </div>

        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {{ $t('account.orders.details.childrenCount') }}
          </p>
          <p class="text-gray-900 dark:text-white">
            {{ details.childrenCount }} ({{ details.childrenAges.map(age => String(age)).join(', ') }} {{ $t('account.orders.details.years') }})
          </p>
        </div>

        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {{ $t('account.orders.details.bookingType') }}
          </p>
          <p class="text-gray-900 dark:text-white">
            {{ details.bookingType === 'offline' ? $t('account.orders.details.offline') : $t('account.orders.details.online') }}
          </p>
        </div>

        <div v-if="details.notes">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {{ $t('account.orders.details.notes') }}
          </p>
          <p class="text-gray-900 dark:text-white">
            {{ details.notes }}
          </p>
        </div>

        <div v-if="details.babysitter">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {{ $t('account.orders.details.babysitter') }}
          </p>
          <NuxtLink
            v-if="details.babysitterId"
            :to="`/sitter/${details.babysitterId}`"
            class="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {{ getBabysitterName(details) }}
          </NuxtLink>
          <p
            v-else
            class="text-gray-900 dark:text-white"
          >
            {{ getBabysitterName(details) }}
          </p>
        </div>

        <div v-if="details.parent">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {{ $t('account.orders.details.parent') }}
          </p>
          <p class="text-gray-900 dark:text-white">
            {{ getParentName(details) }}
          </p>
        </div>

        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {{ $t('account.orders.details.createdAt') }}
          </p>
          <p class="text-gray-900 dark:text-white">
            {{ formatDateTime(details.createdAt) }}
          </p>
        </div>

        <div v-if="details.status === 'completed' || details.status === 'cancelled'">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {{ $t('account.orders.details.completedAt') }}
          </p>
          <p class="text-gray-900 dark:text-white">
            {{ formatDateTime(details.updatedAt || details.createdAt) }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div v-if="details.needsHelpWithHomework">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t('account.orders.details.needsHelpWithHomework') }}
            </p>
          </div>
          <div v-if="details.needsOutdoorActivities">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t('account.orders.details.needsOutdoorActivities') }}
            </p>
          </div>
          <div v-if="details.needsCarTransportation">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t('account.orders.details.needsCarTransportation') }}
            </p>
          </div>
          <div v-if="details.needsWalking">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t('account.orders.details.needsWalking') }}
            </p>
          </div>
          <div v-if="details.childIsSick">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t('account.orders.details.childIsSick') }}
            </p>
          </div>
          <div v-if="details.hasSpecialNeedsChild">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t('account.orders.details.hasSpecialNeedsChild') }}
            </p>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">
          {{ $t('account.orders.details.error') }}
        </p>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { BookingDetails } from '~/composables/useBookings'

const { t } = useI18n()

const props = defineProps<{
  isOpen: boolean
  isLoading: boolean
  details: BookingDetails | null
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
}>()

const isOpen = computed({
  get: () => props.isOpen,
  set: (value) => {
    emit('update:isOpen', value)
  }
})

const getStatusClass = (status: BookingDetails['status']) => {
  const classes = {
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    confirmed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    in_progress: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    completed: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
  }
  return classes[status]
}

const getStatusText = (status: BookingDetails['status']) => {
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

const formatTimeRange = (startTime: string, endTime: string) => {
  const start = new Date(startTime)
  const end = new Date(endTime)
  const startStr = start.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  const endStr = end.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  return `${startStr} - ${endStr}`
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

const getBabysitterName = (details: BookingDetails) => {
  if (details.babysitter?.user) {
    return `${details.babysitter.user.firstName} ${details.babysitter.user.lastName}`
  }
  return ''
}

const getParentName = (details: BookingDetails) => {
  if (details.parent) {
    if (details.parent.firstName && details.parent.lastName) {
      return `${details.parent.firstName} ${details.parent.lastName}`
    }
    if (details.parent.user) {
      return `${details.parent.user.firstName} ${details.parent.user.lastName}`
    }
  }
  return ''
}
</script>

