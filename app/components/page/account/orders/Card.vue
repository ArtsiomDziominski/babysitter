<template>
  <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-6 max-xl:p-4 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between mb-4 max-xl:mb-3 max-xl:flex-col max-xl:gap-3">
      <div class="flex-1 max-xl:w-full">
        <div class="flex items-center gap-3 mb-2 max-xl:flex-wrap max-xl:gap-2">
          <span class="text-lg max-xl:text-base font-semibold text-gray-900 dark:text-white">
            #{{ order.id }}
          </span>
          <NuxtLink
            v-if="sitterId && userRole === UserRole.PARENT"
            :to="`/sitter/${sitterId}`"
            class="text-lg max-xl:text-base font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors break-words"
          >
            {{ order.customer.name }}
          </NuxtLink>
          <h3
            v-else
            class="text-lg max-xl:text-base font-semibold text-gray-900 dark:text-white break-words"
          >
            {{ order.customer.name }}
          </h3>
          <span
            class="px-2 py-1 text-xs max-xl:text-[10px] font-medium rounded flex-shrink-0"
            :class="getStatusClass(order.status)"
          >
            {{ getStatusText(order.status) }}
          </span>
        </div>
        <div class="space-y-1 max-xl:space-y-0.5 text-sm max-xl:text-xs text-gray-600 dark:text-gray-400">
          <p>
            <span class="font-medium">{{ $t('account.orders.date') }}:</span>
            {{ formatDate(order.date) }}
          </p>
          <p>
            <span class="font-medium">{{ $t('account.orders.time') }}:</span>
            {{ order.time }}
          </p>
          <p v-if="order.childrenCount > 0">
            <span class="font-medium mr-2">{{ $t('account.orders.details.childrenCount') }}:</span>
            <UTooltip v-if="childrenTooltipText" :text="childrenTooltipText">
              <span class="cursor-help">
                {{ order.childrenCount }}
              </span>
            </UTooltip>
            <span v-else>
              {{ order.childrenCount }}
            </span>
          </p>
          <p>
            <span class="font-medium">{{ $t('account.orders.createdAt') }}:</span>
            {{ formatDateTime(order.createdAt) }}
          </p>
        </div>
      </div>
      <div class="flex flex-col items-end max-xl:items-start max-xl:mt-2">
        <span class="text-lg max-xl:text-base font-semibold text-gray-900 dark:text-white">
          {{ typeof order.totalPrice === 'string' ? parseFloat(order.totalPrice).toFixed(2) : order.totalPrice }} {{ siteConfig.currency }}
        </span>
      </div>
    </div>

    <div class="flex items-center justify-between gap-4 max-xl:flex-col max-xl:items-stretch max-xl:gap-3 pt-4 max-xl:pt-3 border-t border-gray-200 dark:border-gray-700">
      <PageAccountOrdersOrderActions
        :order-id="order.id"
        :status="order.status"
        :end-time="order.endTime"
        :user-role="userRole"
        @action="(id, action) => $emit('action', id, action)"
      />

      <div class="flex gap-2 max-xl:w-full">
        <UButton
          size="sm"
          variant="outline"
          class="cursor-pointer max-xl:flex-1"
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
const siteConfig = useSiteConfig()

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

const getAgeWord = (age: number): string => {
  const ageNum = Math.floor(age)
  const lastDigit = ageNum % 10
  const lastTwoDigits = ageNum % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return t('account.orders.details.years')
  }

  if (lastDigit === 1) {
    return t('account.orders.details.year')
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return t('account.orders.details.years2')
  }

  return t('account.orders.details.years')
}

const childrenTooltipText = computed((): string | undefined => {
  if (!props.order.children || props.order.children.length === 0) {
    return undefined
  }

  const children = props.order.children
  
  if (typeof children[0] === 'string') {
    return (children as string[]).join(', ')
  }

  return (children as any[]).map((child: any) => {
    if (child.name && child.age) {
      return `${child.name} (${child.age} ${getAgeWord(child.age)})`
    } else if (child.name) {
      return child.name
    } else if (child.age) {
      return `${child.age} ${getAgeWord(child.age)}`
    }
    return ''
  }).filter(Boolean).join(', ')
})
</script>


