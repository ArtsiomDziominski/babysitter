<template>
  <UModal v-model:open="isOpen" :title="$t('account.orders.details.title')">
    <template #body>
      <div v-if="isLoading" class="flex items-center justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
      <div v-else-if="details" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-medium text-muted mb-1">
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
            <p class="text-sm font-medium text-muted mb-1">
              {{ $t('account.orders.details.totalPrice') }}
            </p>
            <p class="text-lg font-semibold text-highlighted">
              {{ typeof details.totalPrice === 'string' ? parseFloat(details.totalPrice).toFixed(2) : details.totalPrice }} {{ siteConfig.currency }}
            </p>
          </div>
        </div>

        <div class="p-4 bg-muted rounded-lg">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30">
              <Icon name="i-lucide-calendar" size="20" class="text-primary" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-muted mb-0.5">
                {{ $t('account.orders.details.date') }}
              </p>
              <p class="text-base font-semibold text-highlighted">
                {{ formatDate(details.startTime) }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3 mt-3 pt-3 border-t border-default">
            <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30">
              <Icon name="i-lucide-clock" size="20" class="text-primary" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-muted mb-0.5">
                {{ $t('account.orders.details.time') }}
              </p>
              <p class="text-base font-semibold text-highlighted">
                {{ formatTimeRange(details.startTime, details.endTime) }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3 mt-3 pt-3 border-t border-default">
            <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30">
              <Icon name="i-lucide-hourglass" size="20" class="text-primary" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-muted mb-0.5">
                {{ $t('account.orders.details.duration') }}
              </p>
              <p class="text-base font-semibold text-highlighted">
                {{ formatDuration(details.startTime, details.endTime) }}
              </p>
            </div>
          </div>
        </div>

        <div>
          <p class="text-sm font-medium text-muted mb-2">
            {{ details.childrenCount === 1 ? $t('account.orders.details.child') : `${$t('account.orders.details.children')} (${details.childrenCount})` }}
          </p>
          <div v-if="details.children && details.children.length > 0" class="flex flex-wrap gap-2">
            <div
              v-for="(child, index) in details.children"
              :key="index"
              class="inline-flex flex-col gap-1 px-3 py-2 bg-elevated rounded-lg"
            >
              <div class="flex items-center gap-2">
                <Icon name="i-lucide-baby" size="16" class="text-primary" />
                <span class="text-sm font-medium text-highlighted">{{ child.name }}</span>
                <span class="text-xs text-muted">{{ child.age }} {{ getAgeWord(child.age) }}</span>
              </div>
              <p v-if="child.description" class="text-xs text-toned mt-1">
                {{ child.description }}
              </p>
            </div>
          </div>
          <div v-else-if="details.childrenAges && details.childrenAges.length > 0" class="flex flex-wrap gap-2">
            <div
              v-for="(age, index) in details.childrenAges"
              :key="index"
              class="inline-flex items-center gap-2 px-3 py-1.5 bg-elevated rounded-lg"
            >
              <Icon name="i-lucide-baby" size="16" class="text-primary" />
              <span class="text-sm text-highlighted">{{ age }} {{ getAgeWord(Number(age)) }}</span>
            </div>
          </div>
          <p v-else class="text-highlighted">
            {{ details.childrenCount }}
          </p>
        </div>

        <div class="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30">
            <Icon
              :name="details.bookingType === 'offline' ? 'i-lucide-home' : 'i-lucide-video'"
              size="20"
              class="text-primary"
            />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-muted mb-0.5">
              {{ $t('account.orders.details.bookingType') }}
            </p>
            <p class="text-base font-semibold text-highlighted">
              {{ details.bookingType === 'offline' ? $t('account.orders.details.offline') : $t('account.orders.details.online') }}
            </p>
          </div>
        </div>

        <div v-if="getCity(details)" class="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30">
            <Icon name="i-lucide-map-pin" size="20" class="text-primary" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-muted mb-0.5">
              {{ $t('account.orders.details.city') }}
            </p>
            <p class="text-base font-semibold text-highlighted">
              {{ getCity(details) }}
            </p>
          </div>
        </div>

        <div v-if="details.notes" class="p-3 bg-muted rounded-lg">
          <p class="text-sm font-medium text-muted mb-2">
            {{ $t('account.orders.details.notes') }}
          </p>
          <p class="text-sm text-highlighted whitespace-pre-line">
            {{ details.notes }}
          </p>
        </div>

        <div v-if="details.trustedContacts && details.trustedContacts.length > 0">
          <p class="text-sm font-medium text-muted mb-2">
            {{ $t('account.orders.details.trustedContacts') }}
          </p>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="(contact, index) in details.trustedContacts"
              :key="index"
              class="inline-flex flex-col gap-1 px-3 py-2 bg-elevated rounded-lg"
            >
              <div class="flex items-center gap-2">
                <Icon name="i-lucide-user-check" size="16" class="text-primary" />
                <span class="text-sm font-medium text-highlighted">
                  {{ contact.lastName }} {{ contact.firstName }}
                </span>
              </div>
              <div class="text-xs text-toned">
                <div>{{ contact.phone }}</div>
                <div v-if="contact.relationship">{{ contact.relationship }}</div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="details.babysitter">
          <p class="text-sm font-medium text-muted mb-1">
            {{ $t('account.orders.details.babysitter') }}
          </p>
          <NuxtLink
            v-if="details.babysitterId"
            :to="`/sitter/${details.babysitterId}`"
            class="text-highlighted hover:text-primary transition-colors"
          >
            {{ getBabysitterName(details) }}
          </NuxtLink>
          <p
            v-else
            class="text-highlighted"
          >
            {{ getBabysitterName(details) }}
          </p>
        </div>

        <div v-if="details.parent">
          <p class="text-sm font-medium text-muted mb-1">
            {{ $t('account.orders.details.parent') }}
          </p>
          <p class="text-highlighted">
            {{ getParentName(details) }}
          </p>
        </div>

        <div>
          <p class="text-sm font-medium text-muted mb-1">
            {{ $t('account.orders.details.createdAt') }}
          </p>
          <p class="text-highlighted">
            {{ formatDateTime(details.createdAt) }}
          </p>
        </div>

        <div v-if="details.status === 'completed' || details.status === 'cancelled'">
          <p class="text-sm font-medium text-muted mb-1">
            {{ $t('account.orders.details.completedAt') }}
          </p>
          <p class="text-highlighted">
            {{ formatDateTime(details.updatedAt || details.createdAt) }}
          </p>
        </div>

        <div v-if="hasSpecialConditions" class="pt-4 border-t border-default">
          <p class="text-sm font-medium text-muted mb-3">
            {{ $t('account.booking.create.specialConditions.title') }}
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div v-if="details.needsHelpWithHomework" class="flex items-center gap-2 px-3 py-2 bg-info-50 dark:bg-info-900/20 rounded-lg">
              <Icon name="i-lucide-book-open" size="16" class="text-info-600 dark:text-info-400" />
              <p class="text-sm text-highlighted">
                {{ $t('account.orders.details.needsHelpWithHomework') }}
              </p>
            </div>
            <div v-if="details.needsOutdoorActivities" class="flex items-center gap-2 px-3 py-2 bg-success-50 dark:bg-success-900/20 rounded-lg">
              <Icon name="i-lucide-tree-pine" size="16" class="text-success-600 dark:text-success-400" />
              <p class="text-sm text-highlighted">
                {{ $t('account.orders.details.needsOutdoorActivities') }}
              </p>
            </div>
            <div v-if="details.needsCarTransportation" class="flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Icon name="i-lucide-car" size="16" class="text-purple-600 dark:text-purple-400" />
              <p class="text-sm text-highlighted">
                {{ $t('account.orders.details.needsCarTransportation') }}
              </p>
            </div>
            <div v-if="details.needsWalking" class="flex items-center gap-2 px-3 py-2 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
              <Icon name="i-lucide-footprints" size="16" class="text-cyan-600 dark:text-cyan-400" />
              <p class="text-sm text-highlighted">
                {{ $t('account.orders.details.needsWalking') }}
              </p>
            </div>
            <div v-if="details.childIsSick" class="flex items-center gap-2 px-3 py-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Icon name="i-lucide-alert-circle" size="16" class="text-orange-600 dark:text-orange-400" />
              <p class="text-sm text-highlighted">
                {{ $t('account.orders.details.childIsSick') }}
              </p>
            </div>
            <div v-if="details.hasSpecialNeedsChild" class="flex items-center gap-2 px-3 py-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <Icon name="i-lucide-heart-handshake" size="16" class="text-pink-600 dark:text-pink-400" />
              <p class="text-sm text-highlighted">
                {{ $t('account.orders.details.hasSpecialNeedsChild') }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="details" class="pt-4 border-t border-default">
          <PageAccountOrdersOrderActions
            :order-id="details.id"
            :status="details.status"
            :end-time="details.endTime"
            :user-role="userRole"
            @action="handleAction"
          />
        </div>
      </div>
      <div v-else class="text-center py-8">
        <p class="text-muted">
          {{ $t('account.orders.details.error') }}
        </p>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { BookingDetails } from '~/composables/useBookings'
import { UserRole } from '~/const/roles'

const { t } = useI18n()
const authStore = useAuthStore()
const siteConfig = useSiteConfig()

const props = defineProps<{
  isOpen: boolean
  isLoading: boolean
  details: BookingDetails | null
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  action: [id: number, action: string]
}>()

const userRole = computed(() => authStore.currentUser?.role)

const handleAction = (id: number, action: string) => {
  emit('action', id, action)
}

const isOpen = computed({
  get: () => props.isOpen,
  set: (value) => {
    emit('update:isOpen', value)
  }
})

const getStatusClass = (status: BookingDetails['status']) => {
  const classes = {
    pending: 'bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-300',
    confirmed: 'bg-info-100 dark:bg-info-900/30 text-info-800 dark:text-info-300',
    in_progress: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    completed: 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300',
    cancelled: 'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-300'
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

const formatDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime)
  const end = new Date(endTime)
  const diffMs = end.getTime() - start.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  const parts: string[] = []
  if (diffHours > 0) {
    parts.push(`${diffHours} ${t('account.orders.details.hours')}`)
  }
  if (diffMinutes > 0) {
    parts.push(`${diffMinutes} ${t('account.orders.details.minutes')}`)
  }

  return parts.length > 0 ? parts.join(' ') : `0 ${t('account.orders.details.minutes')}`
}

const hasSpecialConditions = computed(() => {
  if (!props.details) return false
  return props.details.needsHelpWithHomework ||
    props.details.needsOutdoorActivities ||
    props.details.needsCarTransportation ||
    props.details.needsWalking ||
    props.details.childIsSick ||
    props.details.hasSpecialNeedsChild
})

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

const getCity = (details: BookingDetails): string | null => {
  const cityKey = details.city || details.babysitter?.city
  if (!cityKey) return null

  const translated = t(`cities.${cityKey}`)
  return translated && translated !== `cities.${cityKey}` ? translated : cityKey
}
</script>

