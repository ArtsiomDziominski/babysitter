<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div class="mb-6">
        <UBreadcrumb :items="breadcrumbItems" />
      </div>

      <div v-if="sitter" class="space-y-8">
        <SitterHeader
          :sitter="sitter"
          :is-favorite="isFavorite"
          @toggle-favorite="toggleFavorite"
          @contact="handleContact"
          @message="handleMessage"
        />

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-24 lg:pb-8">
          <div class="lg:col-span-2 space-y-8">
            <SitterAboutSection :sitter="sitter" />

            <SitterScheduleSection :sitter="sitter" />

            <SitterWorkInfoSection :sitter="sitter" />
          </div>

          <div class="lg:col-span-1">
            <div class="sticky top-6">
              <SitterReviewsSection :sitter="sitter" />
            </div>
          </div>
        </div>

        <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg z-50">
          <div class="max-w-7xl mx-auto flex gap-3">
            <div v-if="isBabysitter" class="flex-1 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
              <p class="text-xs text-gray-600 dark:text-gray-400 text-center">
                Няни не могут бронировать других нянь
              </p>
            </div>
            <UButton
              v-else
              color="primary"
              size="lg"
              class="flex-1 font-semibold"
              @click="handleContact"
            >
              <Icon name="i-lucide-calendar-plus" size="20" class="mr-2" />
              Забронировать
            </UButton>
            <UButton
              v-if="!isBabysitter"
              variant="outline"
              size="lg"
              class="flex-1 font-semibold"
              @click="handleMessage"
            >
              <Icon name="i-lucide-message-circle" size="20" class="mr-2" />
              Написать
            </UButton>
          </div>
        </div>
      </div>

      <div v-else-if="pending" class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p class="text-gray-500 dark:text-gray-400">
            Загрузка...
          </p>
        </div>
      </div>
      <div v-else-if="error" class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center">
          <Icon name="i-lucide-alert-circle" size="48" class="text-red-500 mx-auto mb-4" />
          <p class="text-red-500 dark:text-red-400 text-lg">
            Ошибка загрузки данных
          </p>
        </div>
      </div>
      <div v-else class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center">
          <Icon name="i-lucide-user-x" size="48" class="text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500 dark:text-gray-400 text-lg">
            Ситтер не найден
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'
import { useBabysitter, mapBabysitterToSitter } from '~/composables/useBabysitter'
import { UserRole } from '~/const/roles'

const route = useRoute()
const sitterId = route.params.id as string
const babysitterApi = useBabysitter()
const authStore = useAuthStore()

const isFavorite = ref(false)
const isBabysitter = computed(() => authStore.currentUser?.role === UserRole.BABYSITTER)

const { data: sitter, pending, error } = await useAsyncData<Sitter | null>(
  `sitter-${sitterId}`,
  async () => {
    try {
      const id = parseInt(sitterId)
      if (isNaN(id)) {
        return null
      }
      const babysitterData = await babysitterApi.fetchBabysitterById(id)
      if (!babysitterData) {
        return null
      }
      return mapBabysitterToSitter(babysitterData)
    } catch (err) {
      console.error('Ошибка загрузки ситтера:', err)
      return null
    }
  }
)

const breadcrumbItems = computed(() => [
  {
    label: 'Главная',
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: 'Поиск',
    icon: 'i-lucide-search',
    to: '/search'
  },
  {
    label: sitter.value?.name || 'Ситтер',
    icon: 'i-lucide-user'
  }
])

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

const handleContact = () => {
  const router = useRouter()
  router.push(`/sitter/${sitterId}/book`)
}

const handleMessage = () => {
  // TODO: Implement message functionality
  console.log('Message clicked')
}

</script>
