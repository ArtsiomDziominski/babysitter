<template>
  <UModal v-model:open="isOpen" title="Оставить отзыв">
    <template #body>
      <div class="space-y-4">
        <div v-if="completedBookings.length > 0" class="mb-4">
          <label class="block text-sm font-medium text-default mb-2">
            Выберите бронирование
          </label>
          <USelect
            v-model="selectedBookingId"
            :items="bookingOptions"
            label-key="label"
            value-key="value"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-default mb-2">
            Оценка
          </label>
          <div class="flex gap-2">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              class="text-3xl transition-colors cursor-pointer leading-none"
              :class="star <= rating ? 'text-yellow-400' : 'text-dimmed'"
              @click="rating = star"
            >
              {{ star <= rating ? '★' : '☆' }}
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-default mb-2">
            Комментарий
          </label>
          <UTextarea
            v-model="comment"
            placeholder="Расскажите о вашем опыте..."
            :rows="5"
            class="w-full"
          />
        </div>

        <div class="p-3 bg-muted dark:bg-default rounded-lg border border-default">
          <p class="text-xs font-medium text-default mb-2">
            Быстрые реакции
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
            Шаблоны
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
          Отмена
        </UButton>
        <UButton
          color="primary"
          :loading="isSubmitting"
          :disabled="rating === 0 || (completedBookings.length > 0 && !selectedBookingId)"
          class="cursor-pointer"
          @click="submitReview"
        >
          Отправить
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'
import type { BookingListItem } from '~/composables/useBookings'
import { useReviews } from '~/composables/useReviews'
import { useAuthStore } from '~/stores/auth'
import { UserRole } from '~/const/roles'

const props = defineProps<{
  isOpen: boolean
  sitter: Sitter
  completedBookings: BookingListItem[]
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  'success': []
}>()

const toast = useToast()
const reviewsApi = useReviews()
const authStore = useAuthStore()

const rating = ref(0)
const comment = ref('')
const isSubmitting = ref(false)
const selectedBookingId = ref<number | null>(null)

const quickReactions = ['👍', '❤️', '😊', '🌟', '💯', '🎉', '✨', '🔥']

const reviewTemplates = [
  'Отличная няня!',
  'Очень ответственная',
  'Внимательная к детям',
  'Рекомендую',
  'Спасибо за работу'
]

const bookingOptions = computed(() => {
  return props.completedBookings.map(booking => ({
    label: `Бронирование #${booking.id} - ${formatBookingDate(booking)}`,
    value: booking.id
  }))
})

const formatBookingDate = (booking: BookingListItem) => {
  const date = new Date(booking.startTime)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const isOpen = computed({
  get: () => props.isOpen,
  set: (value) => emit('update:isOpen', value)
})

const close = () => {
  isOpen.value = false
  resetForm()
}

const resetForm = () => {
  rating.value = 0
  comment.value = ''
  selectedBookingId.value = props.completedBookings.length > 0 ? props.completedBookings[0].id : null
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

const submitReview = async () => {
  if (rating.value === 0) return

  const bookingId = props.completedBookings.length > 0 
    ? (selectedBookingId.value || props.completedBookings[0].id)
    : null

  if (props.completedBookings.length > 0 && !bookingId) {
    toast.add({
      title: 'Ошибка',
      description: 'Выберите бронирование',
      color: 'error'
    })
    return
  }

  isSubmitting.value = true

  try {
    if (!props.sitter.userId) {
      throw new Error('Неверный ID ситтера')
    }

    if (!bookingId) {
      throw new Error('Не выбрано бронирование')
    }

    await reviewsApi.createReview({
      bookingId,
      targetId: props.sitter.userId,
      targetType: UserRole.BABYSITTER,
      rating: rating.value,
      comment: comment.value || undefined
    })

    toast.add({
      title: 'Успешно',
      description: 'Отзыв отправлен',
      color: 'success'
    })

    emit('success')
    close()
  } catch (err: any) {
    let errorMessage = 'Не удалось отправить отзыв'
    const statusCode = err.statusCode || err.status || err.response?.status
    const message = (err.message || err.response?.data?.message || '').toLowerCase()

    if (statusCode === 400) {
      if (message.includes('неделя') || message.includes('week') || message.includes('тыдня') || message.includes('7 дней') || message.includes('7 days')) {
        errorMessage = 'Прошло больше недели с момента завершения бронирования'
      } else if (message.includes('редактирова') || message.includes('edit') || message.includes('рэдактава') || message.includes('лимит') || message.includes('limit') || message.includes('ліміт')) {
        errorMessage = 'Превышен лимит редактирований отзыва'
      } else if (err.message) {
        errorMessage = err.message
      }
    } else if (statusCode === 403) {
      errorMessage = 'Недостаточно прав для создания отзыва'
    } else if (statusCode === 404) {
      errorMessage = 'Бронирование не найдено'
    } else if (err.message) {
      errorMessage = err.message
    }

    toast.add({
      title: 'Ошибка',
      description: errorMessage,
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    resetForm()
  }
})

watch(() => props.completedBookings, (bookings) => {
  if (bookings.length > 0 && !selectedBookingId.value) {
    selectedBookingId.value = bookings[0].id
  }
}, { immediate: true })
</script>

