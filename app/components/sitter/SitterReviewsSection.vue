<template>
  <div class="space-y-4">
    <div v-if="canLeaveReview" class="mb-4">
      <UButton
        color="primary"
        variant="outline"
        class="w-full"
        @click="showReviewModal = true"
      >
        <Icon name="i-lucide-star" size="18" class="mr-2" />
        Оставить отзыв
      </UButton>
    </div>

    <div
      v-for="review in reviews"
      :key="review.id"
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8 hover:shadow-md transition-shadow"
    >
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <UAvatar
              v-if="review.author.avatar"
              :src="review.author.avatar"
              :alt="getAuthorName(review.author)"
              size="md"
            />
            <div v-else class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span class="text-primary-600 dark:text-primary-400 font-bold text-lg">
                {{ getAuthorName(review.author).charAt(0).toUpperCase() }}
              </span>
            </div>
            <div>
              <div class="font-semibold text-gray-900 dark:text-white text-lg">
                {{ getAuthorName(review.author) }}
              </div>
              <div class="flex items-center gap-1 mt-1">
                <Icon
                  v-for="i in 5"
                  :key="i"
                  name="i-lucide-star"
                  :class="i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'"
                  size="18"
                />
              </div>
            </div>
          </div>
        </div>
        <span class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {{ formatDate(review.createdAt) }}
        </span>
      </div>
      <p v-if="review.comment" class="text-gray-700 dark:text-gray-300 leading-relaxed">
        {{ review.comment }}
      </p>
    </div>
    <div v-if="pending" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
      <p class="text-gray-500 dark:text-gray-400">
        Загрузка отзывов...
      </p>
    </div>
    <div v-else-if="!reviews || reviews.length === 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
      <Icon name="i-lucide-message-square" size="48" class="text-gray-400 mx-auto mb-4" />
      <p class="text-gray-500 dark:text-gray-400 text-lg">
        Пока нет отзывов
      </p>
    </div>

    <SitterReviewModal
      v-model:is-open="showReviewModal"
      :sitter="sitter"
      :completed-bookings="completedBookings"
      @success="handleReviewSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'
import type { Review } from '~/composables/useReviews'
import type { BookingListItem } from '~/composables/useBookings'
import { useSitterUtils } from '~/composables/useSitterUtils'
import { useReviews } from '~/composables/useReviews'
import { useBookings } from '~/composables/useBookings'
import { useAuthStore } from '~/stores/auth'
import { UserRole } from '~/const/roles'

const props = defineProps<{
  sitter: Sitter
}>()

const { formatDate } = useSitterUtils()
const reviewsApi = useReviews()
const bookingsApi = useBookings()
const authStore = useAuthStore()

const reviews = ref<Review[]>([])
const pending = ref(true)
const showReviewModal = ref(false)
const completedBookings = ref<BookingListItem[]>([])

const getAuthorName = (author: Review['author']) => {
  return `${author.firstName} ${author.lastName}`.trim() || 'Аноним'
}

const canLeaveReview = computed(() => {
  if (!authStore.isAuthenticated) return false
  if (authStore.currentUser?.role !== UserRole.PARENT) return false
  return completedBookings.value.length > 0
})

const loadReviews = async () => {
  if (!props.sitter.userId) return

  pending.value = true
  try {
    const response = await reviewsApi.getReviews({
      targetId: props.sitter.userId,
      targetType: 'babysitter',
      limit: 50
    })

    reviews.value = response.data || []
  } catch (err) {
    console.error('Ошибка загрузки отзывов:', err)
    reviews.value = []
  } finally {
    pending.value = false
  }
}

const loadCompletedBookings = async () => {
  if (!authStore.isAuthenticated || authStore.currentUser?.role !== UserRole.PARENT) {
    completedBookings.value = []
    return
  }

  try {
    const sitterId = parseInt(props.sitter.id)
    if (isNaN(sitterId)) return

    const response = await bookingsApi.getBookings({
      status: 'completed',
      limit: 100
    })

    completedBookings.value = response.data.filter(booking => 
      booking.babysitterId === sitterId && !booking.parentReviewId
    )
  } catch (err) {
    console.error('Ошибка загрузки бронирований:', err)
    completedBookings.value = []
  }
}

watch(() => props.sitter.id, () => {
  loadCompletedBookings()
}, { immediate: true })

const handleReviewSuccess = () => {
  loadReviews()
  loadCompletedBookings()
}

watch(() => props.sitter.userId, () => {
  loadReviews()
}, { immediate: true })

watch(() => props.sitter.id, () => {
  loadCompletedBookings()
}, { immediate: true })

onMounted(() => {
  loadReviews()
  loadCompletedBookings()
})
</script>

