<template>
  <div class="relative w-full h-[430px] overflow-hidden rounded-2xl shadow-2xl">
    <div
      v-if="sitter.avatar"
      class="absolute inset-0 bg-cover bg-center"
      :style="{ backgroundImage: `url(${sitter.avatar})` }"
    >
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
    </div>
    <div
      v-else
      class="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-600 dark:to-gray-800"
    >
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <Icon name="i-lucide-user" size="100" class="text-white/30" />
      </div>
    </div>

    <div class="absolute top-3 right-3 flex gap-1.5 z-10">
      <button
        class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-full p-2 hover:bg-white dark:hover:bg-gray-800 transition-all shadow-lg hover:scale-110 active:scale-95"
        @click="$emit('toggle-favorite')"
      >
        <Icon
          name="i-lucide-heart"
          :class="isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600 dark:text-gray-400'"
          size="18"
        />
      </button>
      <button
        class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-full p-2 hover:bg-white dark:hover:bg-gray-800 transition-all shadow-lg hover:scale-110 active:scale-95"
      >
        <Icon name="i-lucide-share-2" size="18" class="text-gray-600 dark:text-gray-400" />
      </button>
      <button
        class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-full p-2 hover:bg-white dark:hover:bg-gray-800 transition-all shadow-lg hover:scale-110 active:scale-95"
      >
        <Icon name="i-lucide-flag" size="18" class="text-gray-600 dark:text-gray-400" />
      </button>
    </div>

    <div class="absolute bottom-0 left-0 right-0 p-4 z-10">
      <div class="flex items-start justify-between gap-3 mb-2">
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-white drop-shadow-lg line-clamp-1 mb-1">
            {{ sitter.name }}
          </h1>
          <div v-if="sitter.age" class="text-sm text-white/90">
            {{ sitter.age }} {{ getAgeText(sitter.age) }}
          </div>
        </div>
        <div class="flex flex-col items-end gap-2 flex-shrink-0">
          <div
            v-if="sitter.isOnline"
            class="flex items-center gap-1.5 bg-green-500/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-white text-xs font-medium shadow-lg"
          >
            <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Онлайн
          </div>
          <div
            v-else-if="sitter.lastSeenOnline"
            class="bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1 text-white text-xs"
          >
            Был {{ formatLastSeen(sitter.lastSeenOnline) }}
          </div>
          <div class="flex items-center gap-1.5 text-white/90">
            <Icon name="i-lucide-star" size="16" class="text-yellow-400 fill-yellow-400" />
            <span class="text-base font-semibold">{{ formatRating(sitter.rating) }}</span>
            <span class="text-xs text-white/70">({{ sitter.orders }})</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'
import { useSitterUtils } from '~/composables/useSitterUtils'

defineProps<{
  sitter: Sitter
  isFavorite: boolean
}>()

defineEmits<{
  'toggle-favorite': []
}>()

const { formatLastSeen, getAgeText } = useSitterUtils()

const formatRating = (rating: number | string | undefined) => {
  if (!rating) return '0.0'
  const numRating = typeof rating === 'string' ? parseFloat(rating) : rating
  return isNaN(numRating) ? '0.0' : numRating.toFixed(1)
}
</script>
