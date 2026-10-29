<template>
  <div class="bg-default rounded-xl border border-default p-6 sm:p-8 max-xl:p-4">
    <h1 class="text-2xl max-xl:text-xl font-bold text-highlighted mb-8 max-xl:mb-4">
      {{ $t('favorites.title') }}
    </h1>

    <div v-if="isLoading" class="space-y-3">
      <USkeleton v-for="n in 3" :key="n" class="h-40 w-full rounded-xl" />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-error-500 dark:text-error-400 mb-4">
        {{ $t('favorites.loadError') }}
      </p>
      <UButton color="primary" @click="loadFavorites">
        {{ $t('account.orders.retry') }}
      </UButton>
    </div>

    <UEmpty
      v-else-if="visibleSitters.length === 0"
      icon="i-lucide-heart"
      :title="$t('favorites.empty')"
      :description="$t('favorites.emptyHint')"
      :actions="[{ label: $t('header.bookings'), to: localePath('/search'), icon: 'i-lucide-search' }]"
      variant="naked"
      class="py-12"
    />

    <SearchSitterList
      v-else
      :sitters="visibleSitters"
      @book="openSitter"
    />
  </div>
</template>

<script setup lang="ts">
import type { BabysitterListItem } from '~/composables/useBabysitter'

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const { ids, fetchFavorites, loadIds } = useFavorites()

useSeoMeta({
  title: () => t('favorites.title'),
  robots: 'noindex, nofollow'
})

const sitters = ref<BabysitterListItem[]>([])
const isLoading = ref(false)
const error = ref(false)

// Снятое сердечко сразу убирает карточку из списка
const visibleSitters = computed(() => sitters.value.filter(sitter => ids.value.includes(sitter.id)))

const loadFavorites = async () => {
  isLoading.value = true
  error.value = false
  try {
    const [list] = await Promise.all([fetchFavorites(), loadIds(true)])
    sitters.value = list
  } catch {
    error.value = true
  } finally {
    isLoading.value = false
  }
}

const openSitter = (sitterId: string | number) => {
  router.push(localePath(`/sitter/${sitterId}`))
}

onMounted(loadFavorites)
</script>
