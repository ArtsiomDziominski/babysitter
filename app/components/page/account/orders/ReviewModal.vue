<template>
  <UModal v-model:open="isOpen" :title="$t('account.orders.review.title')">
    <template #body>
      <div class="space-y-4">
        <UAlert
          v-if="hasExistingReview"
          color="warning"
          variant="soft"
          :title="$t('account.orders.review.alreadyExists')"
        />

        <div v-if="booking" class="p-4 bg-muted dark:bg-default rounded-lg border border-default">
          <h3 class="text-sm font-semibold text-highlighted mb-3">
            {{ $t('account.orders.review.orderDetails') }}
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-toned">{{ $t('account.orders.review.orderNumber') }}:</span>
              <span class="font-medium text-highlighted">#{{ booking.id }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-toned">{{ $t('account.orders.review.date') }}:</span>
              <span class="text-highlighted">{{ formatDate(booking.startTime) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-toned">{{ $t('account.orders.review.time') }}:</span>
              <span class="text-highlighted">{{ formatTimeRange(booking.startTime, booking.endTime) }}</span>
            </div>
            <div v-if="targetName" class="flex justify-between">
              <span class="text-toned">{{ $t('account.orders.review.target') }}:</span>
              <span class="text-highlighted">{{ targetName }}</span>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-default mb-2">
            {{ $t('account.orders.review.rating') }}
          </label>
          <div class="flex gap-2">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              class="text-3xl transition-colors cursor-pointer"
              :class="star <= rating ? 'text-yellow-400' : 'text-dimmed'"
              @click="rating = star"
            >
              ★
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-default mb-2">
            {{ $t('account.orders.review.comment') }}
          </label>
          <UTextarea
              v-model="comment"
              :placeholder="$t('account.orders.review.commentPlaceholder')"
              :rows="5"
              class="w-full"
          />
        </div>

        <div class="p-3 bg-muted dark:bg-default rounded-lg border border-default">
          <p class="text-xs font-medium text-default mb-2">
            {{ $t('account.orders.review.quickReactions') }}
          </p>
          <div class="flex flex-wrap gap-2 mb-3">
            <button
              v-for="emoji in quickReactions"
              :key="emoji"
              type="button"
              class="text-2xl hover:scale-110 transition-transform p-1 cursor-pointer"
              @click="addEmojiToComment(emoji)"
            >
              {{ emoji }}
            </button>
          </div>
          <p class="text-xs font-medium text-default mb-2">
            {{ $t('account.orders.review.quickTemplates') }}
          </p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="template in reviewTemplates"
              :key="template"
              type="button"
              class="px-3 py-1.5 text-xs bg-default border border-accented rounded-md hover:bg-elevated transition-colors text-default cursor-pointer"
              @click="addTemplateToComment(template)"
            >
              {{ template }}
            </button>
          </div>
        </div>

      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton
          variant="outline"
          :disabled="isSubmitting"
          class="cursor-pointer"
          @click="close"
        >
          {{ $t('account.orders.review.cancel') }}
        </UButton>
        <UButton
          color="primary"
          :loading="isSubmitting"
          :disabled="rating === 0"
          class="cursor-pointer"
          @click="submitReview"
        >
          {{ $t('account.orders.review.submit') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { BookingDetails } from '~/composables/useBookings'
import { useReviews } from '~/composables/useReviews'
import { useAuthStore } from '~/stores/auth'
import { UserRole } from '~/const/roles'

const props = defineProps<{
  isOpen: boolean
  booking: BookingDetails | null
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  'success': []
}>()

const { t } = useI18n()
const toast = useToast()
const reviewsApi = useReviews()
const authStore = useAuthStore()

const rating = ref(0)
const comment = ref('')
const isSubmitting = ref(false)
const hasExistingReview = ref(false)

const quickReactions = ['👍', '❤️', '😊', '🌟', '💯', '🎉', '✨', '🔥']

const reviewTemplates = computed(() => {
  const userRole = authStore.currentUser?.role
  if (userRole === UserRole.PARENT) {
    return [
      t('account.orders.review.templates.excellent'),
      t('account.orders.review.templates.responsible'),
      t('account.orders.review.templates.attentive'),
      t('account.orders.review.templates.recommend'),
      t('account.orders.review.templates.thankYou')
    ]
  } else {
    return [
      t('account.orders.review.templates.goodParent'),
      t('account.orders.review.templates.polite'),
      t('account.orders.review.templates.punctual'),
      t('account.orders.review.templates.pleasant'),
      t('account.orders.review.templates.thankYou')
    ]
  }
})

const targetName = computed(() => {
  if (!props.booking) return ''
  const userRole = authStore.currentUser?.role
  if (userRole === UserRole.PARENT && props.booking.babysitter) return getBabysitterName(props.booking)
  if (userRole === UserRole.BABYSITTER && props.booking.parent) return getParentName(props.booking)
  return ''
})

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

const getBabysitterName = (details: BookingDetails) => {
  if (details.babysitter?.user) return `${details.babysitter.user.firstName} ${details.babysitter.user.lastName}`
  return ''
}

const getParentName = (details: BookingDetails) => {
  if (details.parent) {
    if (details.parent.firstName && details.parent.lastName) return `${details.parent.firstName} ${details.parent.lastName}`
    if (details.parent.user) return `${details.parent.user.firstName} ${details.parent.user.lastName}`
  }
  return ''
}

const addEmojiToComment = (emoji: string) => {
  comment.value = (comment.value || '') + emoji
}

const addTemplateToComment = (template: string) => {
  if (comment.value && !comment.value.endsWith(' ')) {
    comment.value += ' '
  }
  comment.value = (comment.value || '') + template
}

const isOpen = computed({
  get: () => props.isOpen,
  set: (value) => emit('update:isOpen', value)
})

const close = () => {
  isOpen.value = false
  resetReviewForm()
}

const submitReview = async () => {
  if (!props.booking || rating.value === 0) return

  isSubmitting.value = true

  try {
    const userRole = authStore.currentUser?.role
    let targetId: number | undefined

    targetId = userRole === UserRole.PARENT ? props.booking.babysitter?.user?.id : props.booking.parentId

    const targetType = userRole === UserRole.PARENT ? UserRole.BABYSITTER : UserRole.PARENT

    if (!targetId) {
      throw new Error('Не удалось определить получателя отзыва')
    }

    await reviewsApi.createReview({
      bookingId: props.booking.id,
      targetId,
      targetType,
      rating: rating.value,
      comment: comment.value || undefined
    })

    toast.add({
      title: t('account.orders.review.success'),
      color: 'success'
    })

    emit('success')
    close()
  } catch (err: any) {
    let errorMessage = t('account.orders.review.errorMessage')
    const statusCode = err.statusCode || err.status || err.response?.status
    const message = (err.message || err.response?.data?.message || '').toLowerCase()

    if (statusCode === 400) {
      if (message.includes('неделя') || message.includes('week') || message.includes('тыдня') || message.includes('7 дней') || message.includes('7 days')) {
        errorMessage = t('account.orders.review.errorWeekPassed')
      } else if (message.includes('редактирова') || message.includes('edit') || message.includes('рэдактава') || message.includes('лимит') || message.includes('limit') || message.includes('ліміт')) {
        errorMessage = t('account.orders.review.errorEditLimit')
      } else if (err.message) {
        errorMessage = err.message
      } else {
        errorMessage = t('account.orders.review.errorBadRequest')
      }
    } else if (statusCode === 403) {
      errorMessage = t('account.orders.review.errorForbidden')
    } else if (statusCode === 404) {
      errorMessage = t('account.orders.review.errorNotFound')
    } else if (err.message) {
      errorMessage = err.message
    }

    toast.add({
      title: t('account.orders.review.error'),
      description: errorMessage,
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}

const resetReviewForm = () => {
  hasExistingReview.value = false
  rating.value = 0
  comment.value = ''
}

const loadExistingReview = async () => {
  if (!props.booking || !authStore.currentUser) return

  try {
    const reviews = await reviewsApi.getReviewsByBookingId(props.booking.id)
    const userRole = authStore.currentUser.role
    const currentUserId = authStore.currentUser.id

    const targetType = userRole === UserRole.PARENT ? UserRole.BABYSITTER : UserRole.PARENT
    const targetId = userRole === UserRole.PARENT
      ? props.booking.babysitter?.user?.id
      : props.booking.parentId

    const existingReview = reviews.find(review =>
      review.authorId === currentUserId &&
      review.targetType === targetType &&
      review.targetId === targetId
    )

    if (existingReview) {
      rating.value = existingReview.rating
      comment.value = existingReview.comment || ''
      hasExistingReview.value = true
    } else {
      resetReviewForm()
    }
  } catch (err: any) {
    resetReviewForm()
  }
}

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    loadExistingReview()
  } else {
    resetReviewForm()
  }
})
</script>

